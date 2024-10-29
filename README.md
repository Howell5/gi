# gi-version-manager

A CLI tool for managing GitLab project versions and releases with both interactive and command modes.

## Prerequisites

This tool requires the following dependencies:

- Node.js >= 18
- [glab](https://gitlab.com/gitlab-org/cli) - GitLab CLI tool

```bash
# Install on macOS
brew install glab

# Install on Linux
# For Debian/Ubuntu
curl -s https://gitlab.com/gitlab-org/cli/-/releases/latest/downloads/glab_amd64.deb -o glab.deb
sudo dpkg -i glab.deb

# For other Linux distributions, visit:
# https://gitlab.com/gitlab-org/cli#installation
```

## Installation

```bash
npm install -g @howell5/gi
# or
pnpm add -g @howell5/gi
```

## Usage

### Interactive Mode

Use the interactive mode to select the release type from a menu:

```bash
gi r
# or
gi release
```

### Direct Command Mode

Create releases directly using commands:

```bash
gi patch  # Create a patch release (0.0.x)
gi minor  # Create a minor release (0.x.0)
gi major  # Create a major release (x.0.0)
gi alpha  # Create an alpha release (x.x.x-alpha.x)
gi beta   # Create a beta release (x.x.x-beta.x)
```

### Version Number Format

- Major: `vX.0.0`
- Minor: `vX.Y.0`
- Patch: `vX.Y.Z`
- Alpha: `vX.Y.Z-alpha.N`
- Beta: `vX.Y.Z-beta.N`

Where:

- X = major version
- Y = minor version
- Z = patch version
- N = pre-release number

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

### Local Testing

To test the CLI locally:

```bash
npm link
# or
pnpm link
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
