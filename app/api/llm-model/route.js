import { inngest } from "../../../inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userInput, searchResult, recordId } = await req.json();
    console.log("Received data in /api/llm-model:", { userInput, searchResult, recordId });
    const inngestRunId = await inngest.send({
        name: "llm-model",
        data: {
            userInput:userInput,
            searchResult:searchResult,
            recordId:recordId,
        },
    });
    console.log("Inngest function triggered, runId:", inngestRunId);
    
    return NextResponse.json( inngestRunId.ids[0] );
}