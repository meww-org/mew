"use client";
import React from "react";
import { getRepoStructure } from "@/app/action";
export default function RepoForm() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [structure, setStructure] = React.useState<string[] | string>(" ");
  const [timeTaken, setTimeTaken] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchRepoStructure = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const response = await getRepoStructure("https://github.com/zshlabs/datewise");
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
    }
    fetchRepoStructure();
},[])

if (loading) {
    return <div>Loading...</div>;
}

return (
    <div>
        <div>RepoForm</div>
        <div>Time taken: {timeTaken} ms</div>
        <div>{JSON.stringify(structure, null, 2)}</div>
    </div>
)
}