"use server";
import fetch from "node-fetch";
import { db } from "@/lib/db/client";
import { repos, files } from "@/lib/db/schema";
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

interface Content {
  filepath: string;
  content: string;
}

async function generateResponse(question: string, contents: Content[]) {
  const contentsString = contents.map((content) => `\n- ${content.filepath}: ${content.content}`).join("");
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `So you are my AI code assistant. So according to the question you have to give me the files which I need to read to make the changes in the code. Here is the question - ${question}, and here are the file contents - ${contentsString}.
        Give response in steps if possible. Like Step 1 , Step 2 , so on. Please give the response in markdown format. Always give code in code blocks and also the new code.`,
      },
    ],
  });
  console.log("AI response - ", response.content[0].text);
  return response.content[0].text;
}

async function readFileFromGithub(repoUrl: string, filePath: string) {
  const splitUrl = repoUrl.split("/");
  const owner = splitUrl[3];
  const repo = splitUrl[4];

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  const exists = await db
    .select()
    .from(files)
    .where(eq(files.path, `${repoUrl}/${filePath}`));

  if (exists.length > 0) {
    return { path: exists[0].abspath, content: exists[0].content };
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN!}`,
      "User-Agent": "anuragts",
    },
  });

  if (response.status === 404) {
    return;
  }

  const fileContents = (await response.json()) as FileContent;

  console.log("fileContents:", fileContents);

  const repo_id = await db
    .select({ id: repos.id })
    .from(repos)
    .where(eq(repos.url, repoUrl));

  const id = repo_id[0].id;

  const result = await db.insert(files).values({
    name: fileContents.name,
    path: `${repoUrl}/${fileContents.path}`,
    content: fileContents.content,
    abspath: fileContents.path,
    repoId: id,
  });

  console.log("result:", result);

  return {
    path: `${repoUrl}/${fileContents.path}`,
    content: fileContents.content,
  };
}

function extractFilePaths(jsonString: string) {
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

export async function getFiles(question: string, repoUrl: string) {
  const folderStructure = await getRepoStructure(repoUrl);
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `So you are my AI code assistant. So according to the question you have to give me the files which I need to read to make the changes in the code. here is question - ${question}, The you'll need to read to make the changes in the code. here is folder structure of the repo - ${folderStructure} , give me response in json format and only give file names I'll need to read.`,
      },
    ],
  });
  console.log("AI response - ", response.content[0].text);
  const links = extractFilePaths(response.content[0].text);
  const contents = await Promise.all(
    links.map(async (link) => {
      let base64Content = await readFileFromGithub(repoUrl, link);
      if (!base64Content) {
        return;
      }
      let content = Buffer.from(base64Content.content, "base64").toString("utf8");
      return { filepath: link, content: content };
    })
  );

  console.log("contents - ", contents);
  
  const validContents = contents.filter((content: Content | undefined) => content !== undefined) as Content[];
  const markdownResponse = await generateResponse(question, validContents);
  
  return markdownResponse;
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
