export function isJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  
  export function extractFilePaths(jsonString: string) {
    const regexPattern = /"([^"]+)"/g;
    let filePaths = [];
    let match;
    while ((match = regexPattern.exec(jsonString)) !== null) {
      filePaths.push(match[1]);
    }
    return filePaths;
  }
  
  export function createMessage(question: string, folderStructure: string[]) {
    return {
      model: "claude-3-haiku-20240307",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `So you are my AI code assistant. So according to the question you have to give me the files which I need to read to make the changes in the code. here is question - ${question}, The you'll need to read to make the changes in the code. here is folder structure of the repo - ${folderStructure} , give me response in json format and only give file names I'll need to read.`,
        },
      ],
    };
  }