/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { AgentTool, Gemini, LlmAgent } from "@google/adk";
import { InMemorySessionService, Runner } from "@google/adk";
import { Content } from "@google/genai";
import { program } from "commander";

async function main() {
  program
    .option("--project <project>", "The Google Cloud project ID.")
    .option("--model <model>", "The Gemini model name.", "gemini-2.5-flash");
  program.parse();
  const options = program.opts();

  const model = new Gemini({
    model: options.model,
    vertexai: options.project ? true : false,
    project: options.project,
  });

  const summaryAgent = new LlmAgent({
    model,
    name: "summary_agent",
    instruction:
      "You are an expert summarizer. Please read the following text and provide a concise summary.",
    description: "Agent to summarize text",
  });

  const rootAgent = new LlmAgent({
    name: "root_agent",
    model,
    instruction:
      "You are a helpful assistant. When the user provides a text, use the 'summarize' tool to generate a summary. Always forward the user's message exactly as received to the 'summarize' tool, without modifying or summarizing it yourself. Present the response from the tool to the user.",
    tools: [new AgentTool({ agent: summaryAgent, skipSummarization: true })],
  });

  const sessionService = new InMemorySessionService();
  const runner = new Runner({
    appName: "agent_as_tool",
    agent: rootAgent,
    sessionService,
  });

  const userId = "user";
  const sessionId = "session";

  await sessionService.createSession({
    appName: "agent_as_tool",
    userId,
    sessionId,
  });

  const question =
    "Compose a short story about a brave knight who must rescue a princess from a dragon. The story should be approximately 200 words and suitable for all ages.";
  console.log(`User: ${question}`);

  const message: Content = {
    role: "user",
    parts: [{ text: question }],
  };

  let lastResponse = "";
  for await (const event of runner.runAsync({
    userId,
    sessionId,
    newMessage: message,
  })) {
    // TODO: The response format is not yet finalized.
    lastResponse = JSON.stringify(event.content, null, 2);
  }
  console.log(`Agent: ${lastResponse}`);
}

main();
