"use server";
import fetch from "node-fetch";
import { db } from "@/lib/db/client";
import { repos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getRepoStructure(repoUrl: string) {
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