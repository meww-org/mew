"use server";
import fetch from "node-fetch";
import { db } from "@/lib/db/client";
import { repos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import anthropic from "@/lib/claude/client";

interface FileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

async function readFileFromGithub(repoUrl:string, filePath:string) {

  const splitUrl = repoUrl.split("/");
  const owner = splitUrl[3];
  const repo = splitUrl[4];

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN!}`,
      "User-Agent": "anuragts",
    },
  });  
  const fileContents = await response.json() as FileContent;
  return fileContents.content;
}

function extractFilePaths(jsonString:string) {
  // Define the regex pattern to match file names
  const regexPattern = /"([^"]+)"/g;

  // Extract file names using the regex pattern
  let filePaths = [];
  let match;
  while ((match = regexPattern.exec(jsonString)) !== null) {
    filePaths.push(match[1]);
  }

  // Return the extracted file paths
  return filePaths;
}

export async function getFiles(question:string,repoUrl:string){
  const folderStructure = await getRepoStructure(repoUrl);
  const response  = await anthropic.messages.create({
    model:'claude-3-opus-20240229', 
    max_tokens: 3000,
    messages: [
      {"role": "user", "content": `So you are my AI code assistant. So according to the question you have to give me the files which I need to read to make the changes in the code. here is question - ${question}, The you'll need to read to make the changes in the code. here is folder structure of the repo - ${folderStructure} , give me response in json format and only give file names I'll need to read.`},
    ],
  })
  console.log("AI response - ",response.content[0].text);
  const links = extractFilePaths(response.content[0].text);
  let base64Content = await readFileFromGithub(repoUrl, 'src/app/(application)/layout.tsx');
  let content = Buffer.from(base64Content, 'base64').toString('utf8');

  console.log("readFile - ",content);

  console.log("links - ",links);
  return `${content}`;
}

async function getRepoStructure(repoUrl: string) {
  const exists = await db.select().from(repos).where(eq(repos.url, repoUrl));
  console.log("exists:", exists);
  if (exists.length > 0) {
    return [exists[0].folderStructure];
  }

  const splitUrl = repoUrl.split("/");
  const owner = splitUrl[3];
  const repo = splitUrl[4];
  const paths: string[] = [];
  await fetchDirectory(owner, repo, "", paths);
  console.log(paths);
  addStructuretoDB(`${paths}`, repoUrl);
  return paths;
}

async function addStructuretoDB(structure: string, url: string) {
  const result = await db.insert(repos).values({
    folderStructure: `${structure}`,
    url,
  });
  return result;
}

const skipFolders = ["node_modules", "dist", ".next"];

async function fetchDirectory(
  owner: string,
  repo: string,
  path = "",
  paths: string[]
) {
  for (const folder of skipFolders) {
    if (path.includes(folder)) {
      return;
    }
  }
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN!}`,
      "User-Agent": "anuragts",
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (Array.isArray(data)) {
      for (const item of data) {
        paths.push(item.path);
        if (item.type === "dir") {
          await fetchDirectory(owner, repo, item.path, paths);
        }
      }
    }
  } else {
    console.error("Failed to fetch", url, "status:", response.status);
  }
}
