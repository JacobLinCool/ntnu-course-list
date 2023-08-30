# ntnu-course-list

Developer Friendly Course List of National Taiwan Normal University.

## Features

- [x] Changeset - Changelog Management, Versioning, and Publishing
- [x] Husky - Git Hooks (Commit, Merge)
- [x] GitHub Actions - Test, Docs, Release
- [x] Vitest - Test Runner

> This template can be used by [`tmpl`](https://github.com/JacobLinCool/tmpl) to generate a new project.

## Workflow

It is highly integrated with GitHub Actions.

### Setup

Before you start, you should:

- [Set `NPM_TOKEN` in your repository secrets.](./settings/secrets/actions)
- [Use GitHub Actions as the source of GitHub Pages.](./settings/pages)
- [Allow GitHub Actions to create and approve pull requests.](./settings/actions)

### Make Changes

After you make changes, you should:

- Run `pnpm changeset` to record changes.
- Commit changes.

### Publish

The GitHub Actions will automatically create a PR if there are one or more changesets in the `main` branch.

After the PR is merged, the GitHub Actions will automatically publish the package to NPM and generate GitHub Releases.

That's all! You don't need to do anything else.
