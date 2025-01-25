# Contributing to Questions & Answers

[← Back to main README](../README.md)

We love your input! We want to make contributing to Questions & Answers as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Git Flow

We follow the Git Flow branching model:

- `main` - Production-ready code
- `develop` - Latest development changes
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `release/*` - Release preparation
- `hotfix/*` - Urgent production fixes

Example workflow:
```bash
# Start a new feature
git checkout develop
git checkout -b feature/my-awesome-feature

# Make your changes, then
git add .
git commit -m "feat: add awesome feature"
git push origin feature/my-awesome-feature

# Create PR to merge into develop
```

### Conventional Commits

We use conventional commits to make our commit messages more meaningful. Format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or auxiliary tools
- `ci`: Changes to CI configuration files and scripts

Examples:
```bash
git commit -m "feat(auth): add login with Google"
git commit -m "fix(db): resolve connection timeout issue"
git commit -m "docs: update API documentation"
```

Breaking Changes:
```bash
git commit -m "feat!: drop support for Node 14

BREAKING CHANGE: Node 14 is no longer supported."
```

## Local Development Setup

1. Follow the setup instructions in the [README](../README.md)
2. Make your changes
3. Test your changes locally using `npm run dev`
4. For database changes:
   - Update schema in `src/db/schema.ts`
   - Generate DBML documentation: `npm run dbml`
   - Update seed data if needed: `npm run seed`

## Pull Request Process

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Reporting Issues

1. Use our [issue template](.github/ISSUE_TEMPLATE.md) to create a new issue
2. Provide all the required information
3. Be specific about the problem
4. Include steps to reproduce
5. Add screenshots if applicable

## Write Bug Reports With Detail, Background, and Sample Code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License
By contributing, you agree that your contributions will be licensed under its MIT License.