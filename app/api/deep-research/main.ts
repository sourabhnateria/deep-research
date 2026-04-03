/* eslint-disable @typescript-eslint/no-explicit-any */
import { createActivityTracker } from "./activity-tracker";
import { MAX_ITERATIONS } from "./constants";
import {
  analyzeFindings,
  generateReport,
  generateSearchQueries,
  processSearchResults,
  search,
} from "./research-function";
import { ResearchState } from "./types";
// import { createUIMessageStream } from "ai";

// type Writer = Parameters;
// Parameters < typeof createUIMessageStream > [0]["execute"] > [0]["writer"];

export async function deepResearch(researchState: ResearchState, writer: any) {
  let iteration = 0;

  const activityTracker = createActivityTracker(writer, researchState);

  const initialQueries = await generateSearchQueries(
    researchState,
    activityTracker,
  );
  let currentQueries = (initialQueries as any).searchQueries;

  while (
    currentQueries &&
    currentQueries.length > 0 &&
    iteration <= MAX_ITERATIONS
  ) {
    iteration++;
    console.log("Iteration: ", iteration);

    const searchResults = currentQueries.map((query: string) =>
      search(query, researchState, activityTracker),
    );
    const searchResultsResponses = await Promise.allSettled(searchResults);

    const allSearchResults = searchResultsResponses
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === "fulfilled" && result.value?.length > 0,
      )
      .map((result) => result.value)
      .flat();

    console.log(`Got ${allSearchResults.length} search results!`);

    const newFindings = await processSearchResults(
      allSearchResults,
      researchState,
      activityTracker,
    );
    console.log("Results processed!");

    researchState.findings = [...researchState.findings, ...newFindings];

    const analysis = await analyzeFindings(
      researchState,
      currentQueries,
      iteration,
      activityTracker,
    );
    console.log("Analysis: ", analysis);

    if ((analysis as any).sufficient) break;

    currentQueries = ((analysis as any).queries || []).filter(
      (query: string) => !currentQueries.includes(query),
    );
  }

  console.log("Outside loop. Total iterations: ", iteration);

  const report = await generateReport(researchState, activityTracker);

  writer.write({ type: "text-start", id: "report" });
  writer.write({ type: "text-delta", id: "report", delta: report as string });
  writer.write({ type: "text-end", id: "report" });

  return initialQueries;
}
