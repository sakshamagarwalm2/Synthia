import { inngest } from "../../../inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userInput, searchResult, recordId } = await req.json();
    const inngestRunId = await inngest.send({
        name: "llm-model",
        data: {
            userInput:userInput,
            searchResult:searchResult,
            recordId:recordId,
        },
    });
    
    return NextResponse.json( inngestRunId.ids[0] );
}