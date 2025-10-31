import { GOOGLE_SEARCH, LlmAgent, Gemini } from "@google/adk";
import { InMemorySessionService, Runner } from "@google/adk";
import { Content } from "@google/genai";

async function main() {
  const model = new Gemini({
    vertexai: process.env.GOOGLE_CLOUD_PROJECT ? true : false,
    project: process.env.GOOGLE_CLOUD_PROJECT,
    // apiKey: process.env.GOOGLE_GENAI_API_KEY,
  });

  const rootAgent = new LlmAgent({
    model: model,
    name: "root_agent",
    description:
      "an agent whose job it is to perform Google search queries and answer questions about the results.",
    instruction:
      "You are an agent whose job is to perform Google search queries and answer questions about the results.",
    tools: [GOOGLE_SEARCH],
  });

  const sessionService = new InMemorySessionService();
  const runner = new Runner({
    appName: "google_search_agent",
    agent: rootAgent,
    sessionService,
  });

  const userId = "user";
  const sessionId = "session";

  await sessionService.createSession({
    appName: "google_search_agent",
    userId,
    sessionId,
  });

  const question = "What is the capital of France?";
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
