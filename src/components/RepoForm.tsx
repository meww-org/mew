"use client";
import React from "react";
import {
  getFiles,
  getRepoStructure,
  getAIResponse,
  getFileContents,
} from "@/app/action";
import ReactMarkdown from "react-markdown";

export default function RepoForm() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [structure, setStructure] = React.useState<string>(" ");
  const [timeTaken, setTimeTaken] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchRepoStructure = async () => {
      setLoading(true);
      const startTime = Date.now();

      try {
        // First, get the repository structure
        const repoStructure = await getRepoStructure(
          "https://github.com/soumyajit4419/Portfolio"
        );
        console.log(repoStructure);

        // Then, get the AI response
        const links = await getAIResponse(
          "Explain this project and how to setup it locally",
          repoStructure
        );
        console.log(links);

        // Then, get the file contents
        const validContents = await getFileContents(
          "https://github.com/soumyajit4419/Portfolio",
          links
        );
        console.log(validContents);
        const validContentsStrings = validContents.map(
          (content) => content.content
        );

        // Finally, generate the markdown response
        const response = await getFiles(
          "Explain this project and how to setup it locally",
          "https://github.com/soumyajit4419/Portfolio",
          validContentsStrings
        );
        console.log(response);
        setStructure(response);
      } catch (error) {
        console.error("Failed to fetch repo structure:", error);
      } finally {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Fetch operation took ${duration} ms`);
        setTimeTaken(duration);
        setLoading(false);
      }
    };
    fetchRepoStructure();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>RepoForm</div>
      <div>Time taken: {timeTaken} ms</div>
      <ReactMarkdown className="mx-20">{structure}</ReactMarkdown>
    </div>
  );
}
