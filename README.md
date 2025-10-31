# ADK JS Examples

This repository contains a collection of examples demonstrating how to use the ADK (Agent Development Kit) for JavaScript.

## Packages

This repository is a monorepo containing the following packages:

- `packages/examples`: A collection of example agents showcasing various ADK features.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version specified in `.node-version`)
- [pnpm](https://pnpm.io/)

### Installation

1. Install the dependencies from the root of the repository:

   ```bash
   pnpm install
   ```

2. Build all packages:

   ```bash
   pnpm build
   ```

### Running the Examples

All examples can be run from the root of the monorepo. For detailed instructions on how to run each example, please see the [`packages/examples/README.md`](./packages/examples/README.md).

## Development

### Formatting and Linting

This project uses `trunk` for formatting and linting.

- **Format code:** `pnpm format`
- **Lint code:** `pnpm lint`
- **Run security checks:** `pnpm lint:security`
