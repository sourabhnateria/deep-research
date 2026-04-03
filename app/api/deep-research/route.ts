import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { ResearchState } from "./types";
import { deepResearch } from "./main";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const lastMessage = messages[messages.length - 1];

    // In AI SDK v6, content can be parts array or plain string
    let rawContent: string;
    if (typeof lastMessage.content === "string") {
      rawContent = lastMessage.content;
    } else if (Array.isArray(lastMessage.parts)) {
      // v6 uses parts array
      rawContent = lastMessage.parts
        .filter((p: { type: string }) => p.type === "text")
        .map((p: { text: string }) => p.text)
        .join("");
    } else {
      throw new Error("Invalid message format");
    }
    const parsed = JSON.parse(rawContent);
    const topic = parsed.topic;
    const clarification = parsed.clarification;

    const researchState: ResearchState = {
      topic: topic,
      completedSteps: 0,
      tokenUsed: 0,
      findings: [],
      processedUrl: new Set(),
      clarificationText: JSON.stringify(clarification),
    };

    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        execute: async ({ writer }) => {
          await deepResearch(researchState, writer);
        },
      }),
    });
  } catch (error) {
    console.error("deep-research error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Invalid message format!",
      }),
      { status: 500 },
    );
  }
}
