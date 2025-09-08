import axios from "axios";
import { NextResponse } from "next/server"; // Import NextResponse for consistency

export async function POST(req) {
  const { runID } = await req.json();
  // console.log("Fetching status for runID:", runID);

  try {
    const result = await axios.get(
      `${process.env.INNGEST_SERVER_HOST}/v1/runs/${runID}`, // Make sure this env variable is correct
      {
        headers: {
          Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
        },
      }
    );
    // Return a NextResponse with the fetched data and a 200 status
    return NextResponse.json(result.data, { status: 200 });

  } catch (error) {
    console.error("Error fetching Inngest run status:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    // Return a NextResponse with the error details and a 500 status
    return NextResponse.json({
      message: "Failed to fetch Inngest run status",
      status: error.response?.status,
      data: error.response?.data,
    }, { status: error.response?.status || 500 });
  }
}