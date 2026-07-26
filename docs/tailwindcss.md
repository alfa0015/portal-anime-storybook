# Tailwind CSS

This project uses [Tailwind CSS v4](https://tailwindcss.com/) as its CSS engine, integrated via the official Vite plugin (`@tailwindcss/vite`). As of v4, Tailwind no longer requires `tailwind.config.js` or PostCSS/`autoprefixer` for a basic setup: the Vite plugin handles everything.

## Installation

```sh
pnpm add tailwindcss @tailwindcss/vite
```

## Configuration

### 1. Vite plugin

[`vite.config.js`](../vite.config.js) imports the plugin and adds it to the `plugins` array:

```js
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  // ...
})
```

### 2. Entry stylesheet

[`src/assets/main.css`](../src/assets/main.css) contains only:

```css
@import 'tailwindcss';
```

This single line replaces the `@tailwind base/components/utilities` directives used in older Tailwind versions.

### 3. Import the CSS in the app

[`src/main.js`](../src/main.js) imports the CSS before mounting the app:

```js
import '@/assets/main.css'
```

### 4. Import the CSS in Storybook

Storybook doesn't load `src/main.js`, so the CSS must also be imported in [`.storybook/preview.js`](../.storybook/preview.js):

```js
import '@/assets/main.css'
```

Without this import, components render without styles in Storybook even though they work fine in the app.

> Note: the `@` alias (defined in `resolve.alias` in `vite.config.js`, pointing to `src/`) works both in the app and in Storybook, because `@storybook/builder-vite` automatically loads and merges the `vite.config.js` configuration, including aliases.

## Verifying it works

1. Add a utility class (e.g. `class="text-red-500 font-bold"`) to an element in a component.
2. Run `pnpm dev` and confirm the style is applied at `http://localhost:5173`.
3. Run `pnpm storybook` and confirm the same style is applied at `http://localhost:6006`.

Both commands are independent processes (Vite for the app, Storybook for the component catalog) and must be run separately.
