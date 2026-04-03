/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useDeepResearchStore } from "@/store/deepResearch";
import React, { useEffect, useRef } from "react";
import QuestionForm from "./QuestionForm";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ResearchActivities from "./ResearchActivities";
import ResearchReport from "./ResearchReport";
import ResearchTimer from "./ResearchTimer";
import CompletedQuestions from "./CompletedQuestions";

const QnA = () => {
  const {
    questions,
    isCompleted,
    topic,
    answers,
    setIsLoading,
    setActivities,
    setSources,
    setReport,
  } = useDeepResearchStore();
  const hasSent = useRef(false);

  const { sendMessage, messages, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/deep-research",
    }),
  });

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    // Extract activities from data-activity parts
    const activities: any[] = [];
    for (const msg of messages) {
      for (const part of msg.parts) {
        if (part.type === "data-activity") {
          activities.push((part as any).data);
        }
      }
    }
    setActivities(activities);

    // Extract sources from completed extract activities
    const sources = activities
      .filter((a) => a.type === "extract" && a.status === "complete")
      .map((a) => {
        const url = a.message.split("from ")[1];
        return { url, title: url?.split("/")[2] || url };
      });
    setSources(sources);

    // Extract report from text parts of assistant messages
    const assistantMessages = messages.filter((m) => m.role === "assistant");
    if (assistantMessages.length > 0) {
      const lastAssistant = assistantMessages[assistantMessages.length - 1];
      const reportText = lastAssistant.parts
        .filter((p) => p.type === "text")
        .map((p) => (p as any).text)
        .join("");
      if (reportText) setReport(reportText);
    }

    setIsLoading(status === "streaming" || status === "submitted");
  }, [messages, status, setActivities, setSources, setReport, setIsLoading]);

  useEffect(() => {
    if (!isCompleted) {
      hasSent.current = false;
    }
  }, [isCompleted]);

  useEffect(() => {
    if (isCompleted && questions.length > 0 && !hasSent.current) {
      hasSent.current = true;
      const clarification = questions.map((question, index) => ({
        question,
        answer: answers[index],
      }));
      sendMessage({
        text: JSON.stringify({ topic, clarification }),
      });
    }
  }, [isCompleted]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex gap-4 w-full flex-col items-center mb-16">
      <QuestionForm />
      <CompletedQuestions />
      <ResearchActivities />
      <ResearchTimer />
      <ResearchReport />
    </div>
  );
};

export default QnA;
