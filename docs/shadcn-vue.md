# shadcn-vue

This project uses [shadcn-vue](https://www.shadcn-vue.com/) to add UI components. It is **not** a component library installed as a regular dependency — its CLI copies each component's source code directly into `src/components/ui/`, so components live in this repo and can be freely edited.

> Note: the original [shadcn/ui](https://ui.shadcn.com/) only targets React. shadcn-vue is the community-maintained Vue port of the same idea (CLI-driven, copy-paste components, Tailwind-based), built on [Reka UI](https://reka-ui.com/) instead of Radix UI.

## Prerequisites (already in place)

shadcn-vue relies on infrastructure this project already has configured:

- **Tailwind CSS v4** — see [docs/tailwindcss.md](tailwindcss.md).
- **`@` path alias** pointing to `src/`, defined in both [`vite.config.js`](../vite.config.js) (`resolve.alias`) and [`jsconfig.json`](../jsconfig.json) (`compilerOptions.paths`).
- **JavaScript, not TypeScript** — the project has no `tsconfig.json`, so `components.json` is configured with `"typescript": false` and generated components are plain `.vue`/`.js`.

## Installation (already done in this project)

```sh
pnpm dlx shadcn-vue@latest init
```

This is interactive and asks for a style preset, base color, icon library, etc. This project was initialized with:

| Setting               | Value                    |
| --------------------- | ------------------------ |
| Style                 | `new-york`               |
| Base color            | `neutral`                |
| Icon library          | `lucide` (`@lucide/vue`) |
| CSS variables theming | enabled                  |

Running `init` again is **not** needed to add more components — it's a one-time setup step. It:

1. Created [`components.json`](../components.json) at the repo root — the config the CLI reads on every subsequent `add`.
2. Added theme CSS variables (colors in OKLch, light + dark via `.dark`) and `@import 'tw-animate-css'` to [`src/assets/main.css`](../src/assets/main.css), on top of the existing `@import 'tailwindcss';`.
3. Created `src/lib/utils.js` with the `cn()` helper (merges Tailwind classes via `clsx` + `tailwind-merge`, used internally by every generated component).
4. Added `class-variance-authority`, `clsx`, `tailwind-merge`, `@lucide/vue`, `tw-animate-css` to `dependencies`/`devDependencies` in `package.json`.

## Adding a new component

```sh
pnpm dlx shadcn-vue@latest add <component-name>
```

Example:

```sh
pnpm dlx shadcn-vue@latest add card dialog input
```

Each component is written to `src/components/ui/<component-name>/` (e.g. `src/components/ui/button/Button.vue` + an `index.js` re-export) and pulls in whatever Reka UI primitive it needs (installed automatically as a dependency, e.g. `reka-ui`).

Import and use it like any other Vue component, via the `@/components/ui/...` alias:

```vue
<script setup>
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button variant="outline">Click me</Button>
</template>
```

### ⚠️ pnpm build script approval

The first time a component pulls in a new dependency with a `postinstall` script (e.g. `reka-ui` → `vue-demi`), pnpm blocks it by default with:

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: vue-demi
```

This is a pnpm 9+ security gate against arbitrary install scripts, not a shadcn-vue problem. Fix it once per new package by running:

```sh
pnpm approve-builds   # interactive checklist — select the package(s) and confirm
pnpm install          # re-run so the approved script actually executes
```

Then re-run the `pnpm dlx shadcn-vue@latest add <component-name>` command — if it failed before completing, the component files won't exist yet even though the dependency was already added to `package.json`.

### Storybook

Components in `src/components/ui/` don't come with their own `.stories.js`. Per this repo's convention (every component ships with a co-located story), write one when you use a `ui` component directly, the same way [`HelloWorld.stories.js`](../src/components/HelloWorld.stories.js) documents [`HelloWorld.vue`](../src/components/HelloWorld.vue). No extra Storybook config is needed — [`.storybook/preview.js`](../.storybook/preview.js) already imports `src/assets/main.css`, so theme variables and component styles render identically in Storybook and in the app.

## Verifying it works

1. Add a component: `pnpm dlx shadcn-vue@latest add button`.
2. Import it somewhere (e.g. `@/components/ui/button` in a `.vue` file).
3. Run `pnpm dev` and `pnpm storybook` and confirm the component renders with shadcn-vue styling (borders, radius, hover/focus states) in both.
