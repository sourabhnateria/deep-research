// import { Activity, ResearchState } from "./types";

// export const createActivityTracker = (
//   dataStream: any,
//   researchState: ResearchState,
// ) => {
//   return {
//     add: (
//       type: Activity["type"],
//       status: Activity["status"],
//       message: Activity["message"],
//     ) => {
//       dataStream.writeData({
//         type: "activity",
//         content: {
//           type,
//           status,
//           message,
//           timestamp: Date.now(),
//           completedSteps: researchState.completedSteps,
//           tokenUsed: researchState.tokenUsed,
//         },
//       });
//     },
//   };
// };

import { Activity, ResearchState } from "./types";
// import { createUIMessageStream } from "ai";

// type Writer = Parameters;
// Parameters < typeof createUIMessageStream > [0]["execute"] > [0]["writer"];

export const createActivityTracker = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writer: any,
  researchState: ResearchState,
) => {
  return {
    add: (
      type: Activity["type"],
      status: Activity["status"],
      message: Activity["message"],
    ) => {
      writer.write({
        type: "data-activity",
        data: {
          type,
          status,
          message,
          timestamp: Date.now(),
          completedSteps: researchState.completedSteps,
          tokenUsed: researchState.tokenUsed,
        },
      });
    },
  };
};
