import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import Exa from "exa-js";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const exa = new Exa(process.env.EXA_SEARCH_API_KEY || "");

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});
