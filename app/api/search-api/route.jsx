import { NextResponse } from "next/server";

export async function POST(request) {
    const { userInput, searchType } = await request.json();

    const resultCount = 10; // Number of results to fetch

    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.CX}&q=${encodeURIComponent(userInput)}&num=${resultCount}`;

    try {
        if(userInput){
        const response = await fetch(url);
        const data = await response.json();

        // Step 2: Return the Data
        return NextResponse.json(data);
        } else {
            return NextResponse.json({ error: "No user input provided" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error fetching data from Google API:", error);
        return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
    }
}