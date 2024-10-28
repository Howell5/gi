# gi-version-manager

A CLI tool for managing GitLab project versions and releases.

## Prerequisites

This tool requires the following dependencies:

- Node.js >= 18
- [glab](https://gitlab.com/gitlab-org/cli) - GitLab CLI tool

```bash
# Install on macOS
brew install glab

# Install on Linux
# (Add appropriate installation instructions for other platforms)
```

## Installation

```bash
npm install -g @howell5/gi
# or
pnpm add -g @howell5/gi
```

## Prerequisites

Node.js >= 18
GitLab CLI (glab)
Usage
bash

## Create a patch release (0.0.x)

```bash
gi patch
```

## Create a minor release (0.x.0)

```bash
gi minor
```

## Create a major release (x.0.0)

```bash
gi major
```

## Development

### Install dependencies

```bash
pnpm install
```

### Development with hot reload

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

### Run tests

```bash
pnpm test
```

### Lint files

```bash
pnpm lint
```

## License

MIT
