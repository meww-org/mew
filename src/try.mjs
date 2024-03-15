export async function getRepoStructure(repoUrl) {
    const splitUrl = repoUrl.split("/");
    const owner = splitUrl[3];
    const repo = splitUrl[4];
    await fetchDirectory(owner, repo);
  }
  const skipFolders = ["node_modules", "dist", ".next"];
  const structure = [];
  async function fetchDirectory(owner, repo, path = "") {
    for (const folder of skipFolders) {
      if (path.includes(folder)) {
        return;
      }
    }
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        for (const item of data) {
            structure.push(item);
            console.log(item.path);
          if (item.type === "dir") {
            await fetchDirectory(owner, repo, item.path);
          }
        }
      }
      console.log('Repo Structure:', structure);
    } else {
      console.error("Failed to fetch", url, "status:", response.status);
    }
  }
  
  console.log("Fetching repo structure...");
  getRepoStructure("https://github.com/zshlabs/datewise");
  