import { supabase } from "../Services/supabase";
import { inngest } from "./client";

export const llmModel = inngest.createFunction(
  { id: "llm-model" },
  { event: "llm-model" },
  async ({ event, step }) => {
    const aiResp = await step.ai.infer("call-llm", {
      model: step.ai.models.gemini({
        model: "gemini-1.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            parts: [
              {
                text: `Based on the user input and search results, summarize and provide information about the topic. Give a markdown text with proper formatting.

User Input: ${event.data.userInput}

Search Results: ${JSON.stringify(event.data.searchResult, null, 2)}`,
              },
            ],
          },
        ],
      },
    });

    const aiResponseText = aiResp?.candidates?.[0]?.content?.parts?.[0]?.text;

    const saveToDb = await step.run("save-to-db", async () => {
      // console.log("AI Response:", aiResponseText);
      const { data, error } = await supabase
        .from("Chats")
        .update([
          {
            aiResp: aiResponseText,
          },
        ])
        .eq("id", event.data.recordId)
        .select();

      // console.log("Updated AI response:", data, error);
      return data;
    });

    // Explicitly return the AI response or a success object
    return {
      success: true,
      message: "AI response successfully saved to database.",
      aiResponse: aiResponseText,
    };
  }
);
