import axios from "axios";

export async function POST(req) {
    const {runID}=await req.json();
  const result = await axios.get(
    process.env.INGEST_SERVER_HOST+'/v1/events/'+runID+'/runs',
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  return result.data;
}
