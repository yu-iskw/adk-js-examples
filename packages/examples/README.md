# ADK JS Examples

This package contains a collection of examples demonstrating how to use the ADK (Agent Development Kit) for JavaScript. Each example showcases different features and patterns for building powerful and flexible agents.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version specified in `.node-version`)
- [pnpm](https://pnpm.io/)

### Installation

1. Install the dependencies:

   ```bash
   pnpm install
   ```

2. Build the packages:

   ```bash
   pnpm build
   ```

### Running the Examples

All examples can be run from the root of the monorepo. Use the following command format:

```bash
node packages/examples/dist/src/agents/{example_name}.js
```

Replace `{example_name}.js` with the compiled JavaScript file of the example you want to run (e.g., `agent_as_tool.js`).

Many examples can be configured to use a specific Gemini model and Google Cloud project. Use the `--help` flag to see the available options for each example:

```bash
node packages/examples/dist/src/agents/{example_name}.js --help
```

## Agent Examples

### Agent as Tool

- **File:** `src/agents/agent_as_tool.ts`
- **Description:** Demonstrates how to use one agent as a tool within another. In this example, a `summaryAgent` is used by a `rootAgent` to summarize text.
- **Run:**

  ```bash
  node packages/examples/dist/src/agents/agent_as_tool.js
  ```

### Agent with Tool

- **File:** `src/agents/agent_with_tool.ts`
- **Description:** Shows how to create an agent that uses multiple function tools. This example features an agent that can get the current weather and time for a given city.
- **Run:**

  ```bash
  node packages/examples/dist/src/agents/agent_with_tool.js
  ```

### Google Search Agent

- **File:** `src/agents/google_search_agent.ts`
- **Description:** A simple example of an agent that uses the built-in `GOOGLE_SEARCH` tool to answer questions.
- **Run:**

  ```bash
  node packages/examples/dist/src/agents/google_search_agent.js
  ```

### Loop Agent

- **File:** `src/agents/loop_agent.ts`
- **Description:** Demonstrates a `LoopAgent` that continuously monitors a condition. This example simulates monitoring temperature and sending a notification if it exceeds a threshold, running for a fixed number of iterations.
- **Run:**

  ```bash
  node packages/examples/dist/src/agents/loop_agent.js
  ```

### Parallel Agent

- **File:** `src/agents/parallel_agent.ts`
- **Description:** Showcases a `ParallelAgent` that runs multiple sub-agents concurrently. The example answers a user query that requires both weather information and a Google search.
- **Run:**

  ```bash
  node packages/examples/dist/src/agents/parallel_agent.js
  ```

### Sequential Agent

- **File:** `src/agents/sequential_agent.ts`
- **Description:** An example of a `SequentialAgent` that executes sub-agents in a specific order. This agent first rolls a die and then checks if the result is a prime number.
- **Run:**

  ```bash
  node packages/examples/dist/src/agents/sequential_agent.js
  ```
