# storybook-pa

Vue 3 component library / UI workshop, built with Vite and documented with Storybook.

## Stack

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/)
- [Storybook](https://storybook.js.org/) for component documentation and visual development
- [Tailwind CSS](https://tailwindcss.com/) as the CSS engine (see [docs/tailwindcss.md](docs/tailwindcss.md))
- [shadcn-vue](https://www.shadcn-vue.com/) for UI components (see [docs/shadcn-vue.md](docs/shadcn-vue.md))
- [Vitest](https://vitest.dev/) for unit tests, [Playwright](https://playwright.dev/) for e2e tests
- [ESLint](https://eslint.org/) + [oxlint](https://oxc.rs/docs/guide/usage/linter.html) + [Prettier](https://prettier.io/) for linting/formatting
- [pnpm](https://pnpm.io/) as package manager (pinned via `packageManager` in `package.json`)

## Requirements

- Node.js (see `engines` in `package.json`)
- pnpm (version pinned in `packageManager`; run via `corepack enable` or install directly)

A ready-to-use dev container is available in `.devcontainer/`.

## Getting started

```sh
pnpm install
pnpm dev
```

## Available scripts

| Script                 | Purpose                              |
| ---------------------- | ------------------------------------ |
| `pnpm dev`             | Start the Vite dev server            |
| `pnpm build`           | Type-check-free production build     |
| `pnpm preview`         | Preview the production build locally |
| `pnpm storybook`       | Start Storybook on port 6006         |
| `pnpm build-storybook` | Build a static Storybook site        |
| `pnpm test:unit`       | Run unit tests with Vitest           |
| `pnpm test:e2e`        | Run e2e tests with Playwright        |
| `pnpm lint`            | Run eslint + oxlint (auto-fix)       |
| `pnpm format`          | Format `src/` with Prettier          |

## Project conventions

- **Components** live in `src/`; every component should ship with a co-located `*.stories.js` for Storybook.
- **Unit tests** live in `src/__tests__/` (Vitest + `@vue/test-utils`, jsdom environment).
- **E2E tests** live in `e2e/` (Playwright).
- **Linting/formatting** run automatically on staged files before every commit via a `pre-commit` git hook (husky + lint-staged). Commits that fail lint are blocked.
- **CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs lint, unit tests, the Vite build, and the Storybook build on every push/PR to `main`, plus a non-blocking `pnpm audit`.
- **Dependency updates** are proposed weekly by Dependabot ([.github/dependabot.yml](.github/dependabot.yml)) for npm packages, GitHub Actions, and dev container features.
- **Secrets**: never commit `.env` files — they're gitignored by default. Use `.env.example` to document required variables without real values.

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for version history and [`CHANGELOG/CHANGELOG-0.1.0.md`](CHANGELOG/CHANGELOG-0.1.0.md) for the complete feature inventory (9 phases, 100+ components).

## Documentation

- [Design system plan (living doc — phases, components, PR tracking)](docs/design-system-plan.md)
- [Tailwind CSS installation and configuration](docs/tailwindcss.md)
- [shadcn-vue installation and how to add components](docs/shadcn-vue.md)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) with the extensions recommended in `.vscode/extensions.json` (Vue Volar, ESLint, Prettier, EditorConfig, oxc, Playwright, Vitest Explorer).
