import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import z from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

const clerifyResearchGoals = async (topic: string) => {
  const prompt = `Give the research topic <topic>${topic}<topic/>, generate 2-4 clarifying questions to help narrow down the research scope. Focus on identifying:
    - Specific aspects of the interest
    - Required depth/complexity level
    - Any particular perspectives or excluded sources
    Respond in JSON format with a questions array.
    `;
  try {
    const { output } = await generateText({
      // model: openrouter("openrouter/free"),
      model: google("gemini-2.5-flash"),
      prompt,
      output: Output.object({
        schema: z.object({
          questions: z.array(z.string()),
        }),
      }),
    });

    return output; // { questions: string[] }
  } catch (error) {
    console.log("Error while generating questions", error);
  }
};
export async function POST(req: Request) {
  const { topic } = await req.json();
  console.log("Topic: ", topic);

  try {
    const questions = await clerifyResearchGoals(topic);
    console.log("Questions: ", questions);
    return NextResponse.json(questions);
  } catch (error) {
    console.log("Error while generating questions", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate questions",
      },
      { status: 500 },
    );
  }
}
