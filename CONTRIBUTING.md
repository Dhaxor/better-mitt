# Contributing to Better-Mitt

We love your input! We want to make contributing to Better-Mitt as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/better-mitt.git

# Install dependencies
cd better-mitt
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Testing

We use Jest for testing. Run the test suite with:

```bash
npm test
```

When adding new features, please include tests that cover the new functionality.

## Coding Style

We use TypeScript for type safety. Please follow these guidelines:

- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons
- Add appropriate comments for complex logic
- Follow TypeScript best practices

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.