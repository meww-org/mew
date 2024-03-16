"use client";
import React, { useState } from "react";
import { Spinner } from "@nextui-org/react";
import {
  getFiles,
  getRepoStructure,
  getAIResponse,
  getFileContents,
} from "@/app/action";
import ReactMarkdown from "react-markdown";
import {
  Avatar,
  Button,
  Chip,
  Input,
  ScrollShadow,
  Textarea,
} from "@nextui-org/react";

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
    <div className="bg-slate-100">
      <div className="flex min-h-screen flex-col items-center justify-between md:px-24 py-5 px-12 ">
        <div className=" flex items-center gap-3 w-[500px] ">
          <input
            placeholder="Github link"
            className="      w-full p-3 rounded-lg outline-none"
            value={repoUrl}
            onChange={(e) => {
              setRepoUrl(e.target.value);
              fetchRepoStructure(e.target.value);
            }}
          />{" "}
          {loading && <Spinner color="success" />}
          {/* <Button
            isLoading={loading}
            className="py-2 font-semibold text-white bg-green-500 rounded-md"
          >
            Add{" "}
          </Button> */}
        </div>
        {/* <h2 className="text-2xl font-bold mb-4">RepoForm</h2> */}
        <div className="my-4">Status: {status}</div>
        <div className="mb-4">Time taken: {timeTaken} ms</div>
        <div className="flex md:w-[73%] w-[95%] md:p-3 p-2 flex-col   ">
          <ScrollShadow
            //   ref={chatContainerRef}
            offset={100}
            orientation="horizontal"
            hideScrollBar
            className=" min-h-[650px] max-h-[650px]  "
          >
            <ReactMarkdown className="markdown mx-20">
              {structure}
            </ReactMarkdown>
          </ScrollShadow>
        </div>
        {/* <ReactMarkdown className="prose text-white flex-grow">
          {structure}
        </ReactMarkdown> */}
        {/* <div className="mt-auto">
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
        </div> */}
        <div className="relative mb-3 md:w-[100%] w-[95%] bottom-0  flex justify-between  items-center mt-10 p-2 rounded-xl border-2 bg-slate-50">
          <textarea
            disabled={loading}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className=" bg-slate-50 w-full rounded-lg outline-none"
          />
          <Button
            isLoading={loading}
            onClick={() => fetchRepoDetails(question, repoUrl)}
            className="py-2 font-semibold text-white bg-green-500 rounded-md"
          >
            Ask
          </Button>
        </div>
      </div>
    </div>
  );
}
