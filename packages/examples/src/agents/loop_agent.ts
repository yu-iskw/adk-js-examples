/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { FunctionTool, Gemini, LlmAgent, LoopAgent } from "@google/adk";
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

  const getTemperatureTool = new FunctionTool({
    name: "get_temperature",
    description: "Get the temperature from the environment.",
    execute: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const temperature = getRandomArbitrary(30, 40);

      console.log("Current temperature is: ", temperature);

      return temperature;
    },
  });

  const notifyUserTool = new FunctionTool({
    name: "notify_user",
    description: "Notify the user if temperature is too high.",
    parameters: z.object({
      temperature: z.number().describe("The temperature."),
      threshold: z.number().describe("The threshold."),
    }),
    execute: ({
      temperature,
      threshold,
    }: {
      temperature: number;
      threshold: number;
    }) => {
      console.log(
        `[NOTIFICATION]: Temperature ${temperature} is too high! Threshold is ${threshold}.`,
      );
    },
  });

  const monitorTemperatureAgent = new LlmAgent({
    name: "monitor_temperature_agent",
    model,
    description:
      "An agent that continuously monitors the temperature and alerts the user if temperature is too high.",
    instruction:
      "You are an agent that continuously monitors the temperature and alerts the user if the temperature is too high. Threshold is provided by the user.",
    tools: [getTemperatureTool, notifyUserTool],
  });

  const rootAgent = new LoopAgent({
    name: "root_agent",
    description:
      "An agent that continuously monitors the temperature and alerts the user if temperature is too high.",
    maxIterations: 5,
    subAgents: [monitorTemperatureAgent],
  });

  const sessionService = new InMemorySessionService();
  const runner = new Runner({
    appName: "loop_agent",
    agent: rootAgent,
    sessionService,
  });

  const userId = "user";
  const sessionId = "session";

  await sessionService.createSession({
    appName: "loop_agent",
    userId,
    sessionId,
  });

  const question =
    "Please monitor the temperature and notify me if it exceeds 35 degrees.";
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
