"use client";
import React, { useState } from "react";
import {
  getFiles,
  getRepoStructure,
  getAIResponse,
  getFileContents,
} from "@/app/action";
import ReactMarkdown from "react-markdown";

export default function RepoForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [structure, setStructure] = useState<string>(" ");
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [repoStructure, setRepoStructure] = useState<any>(null);
  const [status, setStatus] = useState<string>("");

  const fetchRepoStructure = async (url: string) => {
    setLoading(true);
    const startTime = Date.now();
    setStatus("Fetching repo structure...");

    try {
      const structure = await getRepoStructure(url);
      setRepoStructure(structure);
      setStatus("Successfully fetched repo structure");
    } catch (error) {
      console.error("Failed to fetch repo structure:", error);
      setStatus("Failed to fetch repo structure");
    } finally {
      const endTime = Date.now();
      const duration = endTime - startTime;
      setTimeTaken(duration);
      setLoading(false);
    }
  };

  const fetchRepoDetails = async (question: string, url: string) => {
    setLoading(true);
    const startTime = Date.now();
    setStatus("Fetching repo details...");

    try {
      const links = await getAIResponse(question, repoStructure);
      const validContents = await getFileContents(url, links);
      const validContentsStrings = validContents.map(
        (content) => content.content
      );
      const response = await getFiles(question, url, validContentsStrings);
      setStructure(response);
      setStatus("Successfully fetched repo details");
    } catch (error) {
      console.error("Failed to fetch repo details:", error);
      setStatus("Failed to fetch repo details");
    } finally {
      const endTime = Date.now();
      const duration = endTime - startTime;
      setTimeTaken(duration);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="p-6 bg-gray-800 rounded shadow-md w-1/2 flex flex-col h-full">
        {/* <h2 className="text-2xl font-bold mb-4">RepoForm</h2> */}
        <div className="mb-4">Status: {status}</div>
        <div className="mb-4">Time taken: {timeTaken} ms</div>
        <ReactMarkdown className="prose text-white flex-grow">
          {structure}
        </ReactMarkdown>
        <div className="mt-auto">
          <textarea
            className="w-full p-2 mb-4 bg-gray-700 text-white border rounded"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input
            className="w-full p-2 mb-4 bg-gray-700 text-white border rounded"
            type="text"
            placeholder="Enter repo URL"
            value={repoUrl}
            onChange={(e) => {
              setRepoUrl(e.target.value);
              fetchRepoStructure(e.target.value);
            }}
          />
          <button
            className="w-full p-2 mb-4 bg-blue-500 text-white rounded"
            onClick={() => fetchRepoDetails(question, repoUrl)}
          >
            Fetch Details
          </button>
        </div>
      </div>
    </div>
  );
}
