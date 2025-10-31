/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  FunctionTool,
  Gemini,
  GOOGLE_SEARCH,
  LlmAgent,
  ParallelAgent,
} from "@google/adk";
import { InMemorySessionService, Runner } from "@google/adk";
import { Content } from "@google/genai";
import { program } from "commander";
import { z } from "zod";

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

  function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  const getWeatherTemperatureTool = new FunctionTool({
    name: "get_weather_temperature",
    description:
      "Retrieves the current templature in celsius for a specified city.",
    parameters: z.object({
      city: z.string().describe("The name of the city."),
    }),
    execute: ({ city }: { city: string }) => {
      const temperature = Math.floor(getRandomArbitrary(15, 35));

      return `Temperature in ${city} is ${temperature} Celsius.`;
    },
  });

  const googleSearchAgent = new LlmAgent({
    name: "google_search_agent",
    model,
    description:
      "An agent whose job it is to perform Google search queries and answer questions about the results.",
    instruction:
      "You are an agent whose job is to perform Google search query and return summary for the result maximum containing 300 characters.",
    tools: [GOOGLE_SEARCH],
  });

  const getWeatherAgent = new LlmAgent({
    name: "get_weather_agent",
    model,
    description: "Retrieves the current weather report for a specified city.",
    instruction:
      "You are responsible for retrieving the current weather temperature for a city from the user request. You should not ask for additional information.",
    tools: [getWeatherTemperatureTool],
  });

  const rootAgent = new ParallelAgent({
    name: "parallel_agent",
    description: "A parallel agent that runs multiple sub-agents in parallel.",
    subAgents: [googleSearchAgent, getWeatherAgent],
  });

  const sessionService = new InMemorySessionService();
  const runner = new Runner({
    appName: "parallel_agent",
    agent: rootAgent,
    sessionService,
  });

  const userId = "user";
  const sessionId = "session";

  await sessionService.createSession({
    appName: "parallel_agent",
    userId,
    sessionId,
  });

  const question =
    "What's the weather in New York and what is the distance between Earth and Mars?";
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
