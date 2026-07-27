# Learning Guide — Design System for TV series/manga portal + community

> **Living document**: updates as features and PRs progress. Mark PR progress in the status table at the end ([Verification and ritual by phase](#verification-and-ritual-by-phase)) and adjust phases if a decision changes along the way — the plan works only if it reflects reality.

## Context

You will build a Storybook-documented design system for a TV series and manga/comic portal with discussion community (Reddit-style, with the spirit of classic forums). UX draws inspiration from Netflix, Crunchyroll, Apple TV+, and Disney+: **dark-first**, poster-driven navigation, horizontal carousels, hero billboard, hover cards with glow.

**You implement everything — this document is the guide.** Each phase explains what to do, why, and how to verify. Each phase is a natural PR.

Full scope: tokens → Storybook infrastructure → shadcn primitives → streaming components → community → auth → **video player** (ABR, Chromecast/AirPlay, buffering, quality, progress tracking, offline) → **manga/PDF reader MangaPlus-style** (reading modes, RTL, preload, quality, chapter tracking, offline) → **pages** (page-level composition stories).

Decisions already made with you:

- **HSL tokens** (1:1 match with your Figma spec; Tailwind v4 accepts them as-is).
- **Dark as default theme** in Storybook and the portal.
- **Reddit-style forum** (thread feed, votes, nested markdown comments), taking from phpBB only the community idea (ranks, counters, polls).

Current repo state (verified):

- Tailwind **v4** CSS-first: NO `tailwind.config.js` exists; everything lives in `src/assets/main.css` (`@theme inline` + `:root`/`.dark` with shadcn's stock OKLCH values).
- shadcn-vue initialized (new-york, Reka UI, CVA, JS without TS) but **only Button installed** (`src/components/ui/button/`).
- Storybook 10 with addon-docs, addon-a11y, addon-vitest (each story runs as a browser test), Chromatic. **No dark mode toggle.** Only story: `HelloWorld.stories.js`.
- Roboto imported in main.css but **not linked to any token** — not used today.
- CI runs lint + tests + build + `build-storybook` on every PR.

Cross-cutting rules:

- JS only (never `.ts` — `components.json` already has `"typescript": false`).
- Every component ships with co-located `*.stories.js` (the story IS the smoke test via addon-vitest).
- pnpm gotcha: if you see "Ignored build scripts" during install, run `pnpm approve-builds` + `pnpm install`.
- Before every push: `pnpm lint && pnpm build-storybook` (exactly what CI runs).

---

## Phase 1 — Foundations: HSL tokens in Tailwind v4 (PR 1)

**Single file to work on: `src/assets/main.css`.**

### 1.1 Rewrite `:root` and `.dark` with your HSL values

Replace the stock OKLCH values with your spec. **Key rule**: write full color values like `hsl(263 70% 60%)`, NOT bare triplets `263 70% 60%` — that was shadcn convention with Tailwind v3 (`hsl(var(--x))`); in v4 the `@theme inline` passes the value as-is to the browser.

```css
:root {
  --radius: 0.75rem; /* was 0.625rem; -sm/-md/-lg/-xl derive automatically */
  --background: hsl(210 20% 98%); /* #F9FAFB */
  --foreground: hsl(240 10% 10%);
  --card: hsl(0 0% 100%);
  --primary: hsl(263 70% 60%); /* #9146F0 */
  --primary-foreground: hsl(0 0% 100%);
  --accent: hsl(210 100% 50%); /* #0080FF */
  --accent-foreground: hsl(0 0% 100%);
  --destructive: hsl(0 85% 60%);
  --muted: hsl(220 15% 95%);
  --muted-foreground: hsl(240 5% 45%);
  --border: hsl(220 13% 91%);
  --input: hsl(220 13% 91%);
  --ring: hsl(263 70% 60%);
  /* ...popover, secondary per your table */

  /* gradients and effects (Figma spec) */
  --gradient-primary: linear-gradient(135deg, #9146f0, #7c3aed);
  --gradient-accent: linear-gradient(135deg, #0080ff, #00a3e0);
  --gradient-dark: linear-gradient(180deg, #111118, #181824);
  --shadow-card: 0 4px 24px -1px rgba(0, 0, 0, 0.12);
  --shadow-card-hover: 0 12px 48px -4px rgba(145, 70, 240, 0.25);
  --glow-primary: 0 0 40px rgba(145, 70, 240, 0.4);
  --glow-accent: 0 0 30px rgba(0, 128, 255, 0.3);
}

.dark {
  --background: hsl(240 15% 8%); /* #111118 */
  --foreground: hsl(210 20% 98%);
  --card: hsl(240 12% 12%); /* #1B1B24 */
  --popover: hsl(240 12% 10%);
  --primary: hsl(263 70% 60%); /* same purple, brighter over dark */
  --secondary: hsl(240 10% 18%);
  --muted: hsl(240 10% 18%);
  --muted-foreground: hsl(240 5% 65%);
  --destructive: hsl(0 70% 50%);
  --border: hsl(240 10% 18%);
  --input: hsl(240 10% 18%);
  /* more intense effects in dark — streaming-style glow */
  --shadow-card: 0 4px 24px -1px rgba(0, 0, 0, 0.4);
  --shadow-card-hover: 0 12px 48px -4px rgba(145, 70, 240, 0.35);
  --glow-primary: 0 0 50px rgba(145, 70, 240, 0.5);
}
```

Keep `chart-*` and `sidebar-*` defined (the `@theme inline` references them); you can alias them to card/primary.

**Why dark mode works without `dark:` on every class**: the existing `@theme inline` block maps `--color-primary: var(--primary)` → Tailwind generates `bg-primary` which resolves `var()` at runtime. By putting `.dark` on `<html>`, all tokens change with pure CSS. That block **stays untouched** except for the additions below.

### 1.2 Shadows/glows as utilities

Tailwind v4 has a `--shadow-*` namespace: mapping there auto-generates utilities. Inside the existing `@theme inline` add:

```css
--shadow-card: var(--shadow-card);
--shadow-card-hover: var(--shadow-card-hover);
--shadow-glow: var(--glow-primary);
--shadow-glow-accent: var(--glow-accent);
```

Result: `hover:shadow-card-hover` is written once and automatically more intense in dark (the value lives in `:root`/`.dark`). This is the Netflix-style card hover effect.

### 1.3 Gradients as `@utility`

There's no gradient namespace in v4; create utilities by hand (so they accept variants like `hover:` and can be merged with `cn()`):

```css
@utility bg-gradient-primary {
  background-image: var(--gradient-primary);
}
@utility bg-gradient-accent {
  background-image: var(--gradient-accent);
}
@utility bg-gradient-dark {
  background-image: var(--gradient-dark);
}
@utility text-gradient-primary {
  background-image: var(--gradient-primary);
  background-clip: text;
  color: transparent;
}
```

### 1.4 Typography: Roboto → Inter, and wire it up

Replace the Roboto `@import` with Inter (weights 400–800) and **wire** the token in a plain `@theme` (static value, doesn't need `inline`):

```css
@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

The existing `--font-heading: var(--font-sans)` keeps working. Update `"font"` in `components.json` to `"inter"` (cosmetic). Recipe for hero heading (documented, not a token): `text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight`.

### 1.5 Container

Tailwind v4 removed `container` config. Create your own utility:

```css
@utility container-page {
  margin-inline: auto;
  max-width: 1400px;
  padding-inline: 2rem;
}
```

### 1.6 Document tokens in Storybook (MDX)

Create `src/foundations/` (the glob `../src/**/*.mdx` in `.storybook/main.js` already includes it) with 5 pages:

- `Colors.mdx` — use doc blocks `ColorPalette`/`ColorItem` from `@storybook/addon-docs/blocks`
- `Typography.mdx` — doc block `Typeset` + hero recipe
- `SpacingRadius.mdx` — radius scale, container, header/hero/card heights
- `ShadowsGradients.mdx` — divs with `bg-gradient-primary`, `shadow-glow`; show dark by wrapping a copy in `<div class="dark bg-background p-8">`
- `Icons.mdx` — gallery of the lucide subset the system uses (play, download, cast, arrows, pin, lock…) with name + intended use; Grafana dedicates a whole group to iconography because icons without a catalog duplicate (grows each phase — start with Button's icons and add as they appear)

```mdx
import { Meta, ColorPalette, ColorItem } from '@storybook/addon-docs/blocks'
<Meta title="Foundations/Colors" />
<ColorPalette>
  <ColorItem title="primary" subtitle="Brand purple — CTAs, focus ring"
    colors={{ light: 'hsl(263 70% 60%)' }} />
</ColorPalette>
```

**Phase 1 verification**: `pnpm storybook` → the existing Button is now purple with 12px radius; the 4 Foundations pages appear; `pnpm build-storybook` is green.

---

## Phase 2 — Storybook Infrastructure (PR 2)

### 2.1 Dark mode toggle: `@storybook/addon-themes`

```bash
pnpm add -D @storybook/addon-themes
```

In `.storybook/main.js` add `'@storybook/addon-themes'` to `addons`. In `.storybook/preview.js`:

```js
import { withThemeByClassName } from '@storybook/addon-themes'

decorators: [
  withThemeByClassName({
    themes: { light: '', dark: 'dark' },
    defaultTheme: 'dark',
    parentSelector: 'html',
  }),
],
```

**Why addon and not a homemade decorator**: the dark variant is `&:is(.dark *)` — the class must be on an ancestor of EVERYTHING, including Reka UI overlays that teleport to `<body>` (Dialog, DropdownMenu, Tooltip). `parentSelector: 'html'` guarantees it; a `<div class="dark">` wrapper around the story would leave dropdowns in light mode (classic gotcha). Plus Chromatic understands it.

### 2.2 Title hierarchy (modeled on Grafana UI)

Grafana UI opens with a meta-documentation group ("Docs Overview": Intro, Design Principles, Voice and Tone, Accessibility) before any components. We adopt the same:

```
Overview/…      meta-doc MDX         → Intro, Design Principles, Accessibility, Changelog
Foundations/…   token MDX            → Colors, Typography, SpacingRadius, ShadowsGradients, Icons
UI/…            shadcn primitives    → UI/Button, UI/Badge
Media/…         streaming components → Media/MediaCard, Media/HeroBillboard
Community/…     community components → Community/ThreadCard, Community/CommentThread
Player/…        video player         → Player/VideoPlayer, Player/SeekBar
Reader/…        manga/PDF reader     → Reader/MangaReader, Reader/PageSlider
App/…           shell + auth         → App/AppHeader, App/SocialLoginButtons
Pages/…         page compositions    → Pages/Home, Pages/Watch
```

Pages in the `Overview/` group (all MDX in `src/overview/`):

- **Intro** — what is the design system, for whom, how to consume it (install/imports), link to repo. The Storybook landing (`Intro` first in storySort).
- **Design Principles** — dark-first, poster-driven, the 4 streaming references, "components never invent colors: always tokens".
- **Accessibility** — the policy: a11y addon on `error`, every icon button has `aria-label`, keyboard shortcuts documented, focus management in overlays. (Grafana dedicates a page to this; it's what makes the policy stick and doesn't depend on tribal memory.)
- **Changelog** — at the start can be a pointer to releases/PRs; existing from day one creates the habit.

Order the sidebar in `preview.js`:

```js
parameters: {
  options: {
    storySort: {
      order: ['Overview', ['Intro'], 'Foundations', 'UI', 'Media', 'Community', 'Player', 'Reader', 'App', 'Pages'],
    },
  },
}
```

Convention inherited from Grafana for the future: when a component gets replaced, don't delete it immediately — move it to a `…/Deprecated/` sub-group so consumers see what to avoid.

### 2.3 Component documentation standard (what makes a Storybook "complete")

References: Grafana UI and VSCode Webview UI Toolkit. What sets them apart isn't the number of components but that **each component meets the same documentation contract**:

1. **Usage description** — paragraph above the docs page: what it is, when to use it, when NOT (and what to use instead). In autodocs you achieve this with a JSDoc comment over the story's `export default` or with `parameters.docs.description.component`. For flagship components (VideoPlayer, MangaReader, MediaCard, PostCard) write your own MDX page with `<Meta of={...}>` + guidelines + embedded `<Canvas>`.
2. **One story named by meaningful state/prop** — the VSCode toolkit pattern (`Default`, `WithAutofocus`, `WithIconStart`, `WithDisabled`): each boolean prop or visual state gets its OWN story, because each story is simultaneously navigable documentation, Chromatic snapshot, and vitest test. Naming convention:
   - `Default` — default args, controls active.
   - `With<Prop>` — one state per story: `WithBadge`, `WithDisabled`, `WithSavedPosition`, `WithBufferedGaps`.
   - `AllVariants` / `AllSizes` — the CVA matrix (controls disabled).
   - `Examples` — realistic composition Grafana-style (Card: "As A Link", "Selectable", "Full") — the component in real product context with mock data.
3. **Complete props table** — autodocs generates it from `argTypes`; in Vue components also document **slots and emits** in `argTypes` by hand (autodocs for vue3-vite doesn't always infer them in JS without types): `argTypes: { onVote: { action: 'vote' }, default: { description: 'Post content' } }`.
4. **Accessibility note** — one line in docs: what keys it supports, what roles/labels it carries.

Component checklist (copy to your PR template if you want to make it mechanical): description ✓, Default ✓, one `With*` per state ✓, variant matrix ✓, slots/emits documented ✓, a11y note ✓, reviewed in both themes ✓.

### 2.4 A11y in stages

Leave `a11y: { test: 'todo' }` for now; after Phase 3 finishes, change it to `'error'` so CI **requires** accessibility (doing it day one would block you with shadcn quirks; doing it later is a ratchet, not a wall). Check the purple contrast on white (~4.1:1 — ok for large text/UI, borderline for small body).

**Phase 2 verification**: the brush in the toolbar changes the whole canvas; Button docs look good in both themes; `build-storybook` is green.

---

## Phase 3 — shadcn primitives (`UI/`) (PRs 3–4)

### 3.1 Install in batches with `pnpm dlx shadcn-vue@latest add <names>`

**Batch A — browsing core** (Phase 4 needs it):
`badge card skeleton tooltip separator scroll-area carousel tabs aspect-ratio`

- badge → rating, genre pills, "NEW" flags; card → base surface; skeleton → grid shimmer (streaming UIs are skeleton-heavy); carousel (embla) → the literal Netflix row; tabs → MediaDetail and editor write/preview; aspect-ratio → 2:3 posters and 16:9 backdrops without layout shift.

**Batch B — chrome and overlays**:
`avatar dropdown-menu dialog sheet input command`

- avatar → users throughout community; command → search palette ⌘K; sheet → mobile nav/filters.

**Batch C — forms and feedback** (for community phase):
`textarea select checkbox label sonner pagination breadcrumb progress toggle-group`

- textarea → markdown editor; sonner → toasts; progress → Continue Watching and polls; toggle-group → editor toolbar (B/I/link).

### 3.2 Story pattern for CVA components (learn it once)

Template in `src/components/ui/button/Button.stories.js` — replicate in every UI/:

```js
import { Button } from '.'

const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']

export default {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: variants } },
  args: { variant: 'default', size: 'default' },
}

export const Default = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Watch now</Button>`,
  }),
}

export const AllVariants = {
  render: () => ({
    components: { Button },
    setup: () => ({ variants }),
    template: `<div class="flex flex-wrap gap-3">
      <Button v-for="v in variants" :key="v" :variant="v">{{ v }}</Button>
    </div>`,
  }),
  parameters: { controls: { disable: true } },
}
```

**Why the matrix story**: Chromatic captures all variants in one snapshot and the a11y addon audits them in one pass.

Note on sizes from spec (36/40/44px): your current Button (`src/components/ui/button/index.js`) has `sm: h-8`, `default: h-9`, `lg: h-10`. If you want the 44px tier, add `xl: 'h-11 px-8'` to the CVA — your first exercise in **extending** a shadcn component instead of just consuming it.

**Phase 3 verification**: each `ui/*/` folder has a story; open Dialog/DropdownMenu in dark to validate that portals theme (validates Phase 2's decision); change a11y to `'error'`; `build-storybook`.

---

## Phase 4 — Streaming domain components (`Media/`, `App/`) (PRs 5–6)

Convention: live in `src/components/media/` and `src/components/app/`, PascalCase, compose `ui/` primitives + tokens — **never invent colors**. Create `src/mocks/media.js` with shared `mockShows` (posters via `https://picsum.photos/seed/<n>/300/450`) so all stories use the same fixtures.

Build order (each depends on the previous):

1. **RatingBadge** — `{ score, max: 10 }`. Composes `Badge`; color ramp by score (≥8 → primary, mid → accent, low → muted). First because almost every card uses it.
2. **GenrePill** — `{ label, active }`. Badge pill; `active` → `bg-gradient-primary`.
3. **MediaCard** — the flagship. Props: `{ title, posterUrl, rating, year, badge, size: 'sm'|'md'|'lg' }` (spec heights: 280/320/400px). `AspectRatio 2:3` + `rounded-xl` + `transition-all hover:scale-105 hover:shadow-card-hover hover:z-10`, RatingBadge absolute top-right, title over `bg-gradient-dark` overlay at bottom. Here the Phase 1 shadow token pays off: single `hover:shadow-card-hover` with stronger glow in dark. Stories: Default, WithBadge, AllSizes, Skeleton.
4. **SkeletonCard** — same dimensions/radius as MediaCard (shared `size` prop). Story side-by-side with MediaCard to test no layout shift.
5. **MediaCarousel** — `{ title, items }` + scoped slot `#item` (Vue's render props analogue). Composes `Carousel` embla, arrows on group-hover, bleed `-mx-8 px-8` so hover-scale doesn't clip.
6. **TopTenRow** — MediaCarousel specialization with giant numeral (`text-8xl font-extrabold` + `text-gradient-primary`) overlapping each card.
7. **HeroBillboard** — `{ title, synopsis, backdropUrl }` + slot `#actions`. `min-h-[60vh] lg:min-h-[80vh]`, double overlay (`bg-gradient-dark` bottom + `bg-gradient-to-r from-background` left), hero heading recipe, CTA `Button lg` with `bg-gradient-primary hover:shadow-glow`. Story with `parameters: { layout: 'fullscreen' }`.
8. **ContinueWatching** — 16:9 card with `Progress` at bottom and label `S2 E4 · 23 min left`.
9. **PersonCard** — `{ name, role, avatarUrl }` for cast rows.
10. **EpisodeListItem** — `{ number, title, synopsis, duration, thumbnailUrl, watched }`; watched → muted + check.
11. **MediaDetailHero** — HeroBillboard + metadata row (RatingBadge, year, GenrePills). Pure composition exercise.
12. **SearchPalette** (`app/`) — `Command` inside `Dialog`; story with `play` function to open it — your first interaction test with addon-vitest.
13. **AppHeader** — `fixed top-0 z-50 h-16 backdrop-blur-md bg-background/70 border-b` + `container-page`. Story fullscreen with scrollable content behind to demo the blur.
14. **AppFooter** — columns of muted links.

---

## Phase 5 — Reddit-style community (`Community/`) (PRs 7–8)

Thread feed with votes and nested markdown comments — the pattern people already know — keeping from phpBB only the community idea (ranks, counters, polls). Shared fixture in `src/mocks/community.js` (threads + comment tree + markdown kitchen-sink).

1. **OnlineIndicator** — `{ online }`. 8px green dot with pulse. Tiny, used everywhere.
2. **RankBadge** — `{ rank: 'admin'|'mod'|'member'|'newbie' }` with local `cva()` (admin → `bg-gradient-primary`, mod → accent). Lesson: CVA works for your components, not just shadcn's.
3. **VoteControl** — `{ score, userVote: 1|0|-1 }` + emits `vote`. Vertical column arrows + score (`tabular-nums`); upvote active → `text-primary`. The quintessential Reddit primitive.
4. **ThreadCard** — feed card: `{ title, author, community, createdAt, excerpt, thumbnailUrl?, commentCount, tags }` + VoteControl left. Can reference a series/manga (mini poster). Stories: text, with image, with spoiler-blur.
5. **ThreadListItem** — compact variant (dense list mode): title, author's RankBadge, reply/view counts, pin/lock with lucide icons. Matrix: default/pinned/locked/unread.
6. **CommentItem** — `{ author, createdAt, depth, collapsed }` + slot for body. Small avatar + name + RankBadge inline, clickable thread line to collapse (Reddit pattern), reply/share/report actions in `DropdownMenu`.
7. **CommentThread** — **recursive** component (`{ comments: [...], maxDepth }`) nesting CommentItem. Vue lesson: self-referential components and when to cut off nesting (`maxDepth` → "continue thread"). Story with 4-level tree.
8. **MarkdownRenderer** — `{ source }`. `pnpm add marked dompurify` — render + sanitize (**never** `v-html` user input unsanitized; security lesson of the phase). Styles with scoped class using tokens: links `text-accent`, blockquote `border-l-primary bg-muted/50`, code `bg-muted`.
9. **MarkdownEditor** — `Tabs` Write/Preview + toolbar `ToggleGroup` (bold/italic/link/quote/code, inserting markdown at cursor via textarea selection API) + `Textarea` + MarkdownRenderer in preview. `defineModel()` for v-model (Vue 3.5 idiom). Story with `play`: write, switch to Preview, assert `<strong>`.
10. **PollWidget** — `{ question, options, voted, totalVotes }`. Pre-vote: radios + button; post-vote: `Progress` bars with percentages, winner in `bg-gradient-primary`. Two stories, one per state.
11. **CommunityHeader** — sub-community banner: `{ name, description, members, online }` + Join button (`bg-gradient-primary`).

Close the phase with **`Community/Patterns/ThreadPage`**: full composition story (CommunityHeader → ThreadCard expanded → MarkdownEditor → CommentThread → Pagination) — the integration snapshot "does everything fit together?".

---

## Phase 6 — Auth/social and misc (`App/`) (PR 9)

1. **ThemeToggle** — `Button ghost icon` Sun/Moon, `document.documentElement.classList.toggle('dark')` + localStorage. Gotcha: in Storybook the class is controlled by addon-themes, so the story is visual-only — document in a comment.
2. **SocialLoginButtons** — `{ providers: ['google','discord','github'] }`, `Button outline` full-width with inline brand SVGs (lucide doesn't have brand marks). Stories: all, one, loading.
3. **UserMenu** — Avatar → DropdownMenu (Profile, My List, Settings, Sign out in `text-destructive`). `play` function to open the menu so Chromatic/a11y capture the open state.
4. **NotificationBell** — bell + Badge counter absolute (`bg-destructive -top-1 -right-1`). Stories: 0 / few / 99+.

Final: wire UserMenu/NotificationBell/ThemeToggle into AppHeader story and **delete `HelloWorld.vue` + `HelloWorld.stories.js`**.

---

## Phase 7 — Video Player (`Player/`) (PRs 10a–10b)

Comes after auth on purpose: it's the largest phase and depends on the most primitives (DropdownMenu, Slider, Dialog, Progress) — do it when they all exist. New directories: `src/components/player/` and `src/composables/` (the alias `@/composables` already exists in `components.json` but the folder doesn't).

### 7.0 Technical decisions (the "why" map)

| Requirement              | Choice                                          | Why                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adaptive streaming (ABR) | **hls.js** (`pnpm add hls.js`)                  | Standard HLS client over MSE: measures segment download speed and switches bitrate automatically — ABR "free", and `hls.levels` gives you quality menu data.                                                                                                                                                                                                   |
| Safari                   | HLS native fallback                             | Safari doesn't run hls.js for HLS but plays `.m3u8` natively via `video.src`; branch with `Hls.isSupported()`. Trade-off: no API `levels`, quality menu hidden there.                                                                                                                                                                                          |
| Buffer + state           | Native `<video>` events                         | `timeupdate`, `progress`, `waiting`, `canplay`, `ended` are the universal source of truth (hls.js or native) — building on them makes the controls layer agnostic of the engine.                                                                                                                                                                               |
| Chromecast               | Google Cast Web Sender SDK                      | Only official API; loaded via `<script>` from gstatic.com at runtime (NO npm package). `CastButton` renders disabled/hidden until `window.cast` exists — lesson in progressive enhancement.                                                                                                                                                                    |
| AirPlay                  | Remote Playback API + WebKit fallback           | `video.webkitShowPlaybackTargetPicker()` / `remote.prompt()` are one-liners; feature-detect and hide the button where inapplicable.                                                                                                                                                                                                                            |
| Media keys / lockscreen  | Media Session API                               | `navigator.mediaSession.metadata` + handlers make hardware keys and OS overlays work — minimal effort, native app feel.                                                                                                                                                                                                                                        |
| Progress tracking        | `useWatchProgress` composable over localStorage | Persistence behind a composable means migrating to an API changes one file, not every component.                                                                                                                                                                                                                                                               |
| Offline download         | Milestone advanced/stretch                      | Honesty: downloading HLS is genuinely hard (fetch each segment + rewrite playlist + service worker; production uses DRM + native downloaders). Tractable path: DRM-free progressive MP4 assets in **Cache API** + metadata in **IndexedDB**. **Now you design the UI contract** (`DownloadButton` with 4 states) and the engine later — real industry pattern. |

### 7.1 Composables first (the state layer)

Build them before any component — so controls are dumb views over shared state.

- **`useVideoPlayer(videoRef, opts)`** — the brain. State: `playing`, `currentTime`, `duration`, `buffered` (array of ranges read from `video.buffered` on `progress` events), `isBuffering` (`waiting`/`canplay`), `volume`, `playbackRate`, `isFullscreen`; quality: `levels` (from `hls.levels` → `{index, height, label}`), `currentLevel`, `autoLevel`, `setQuality(i)` (`hls.currentLevel = -1` = Auto — teach that distinction). Actions: `play/pause`, `seek`, `skip(±10)`, `toggleFullscreen` (on the container, not the video, so custom controls stay visible!). Register Media Session here. Cleanup on `onUnmounted`: `hls.destroy()` — MSE has memory leaks without it.
- **`useWatchProgress(seriesId, episodeId)`** — `savedPosition`, `save(t, duration)` with ~5s throttle (`timeupdate` fires 4×/sec — writing localStorage that often is wasteful), `markWatched()`. Rules that make "Continue Watching" feel good: don't save if <30s watched; if >95% watched, mark complete and clear resume point. Key: `watch:{seriesId}:{episodeId}`.
- **`useCast({ receiverAppId })`** — injects the sender `<script>` on demand, exposes `castAvailable`, `castState` (`no-devices|not-connected|connecting|connected`), `startCast(mediaInfo)`. All with `typeof window.cast !== 'undefined'` guard.

### 7.2 Components (all with `aria-label` on icon-only buttons — the phase's a11y theme)

1. **VideoPlayer** — orchestrator. Props: `src, poster, title, episodeInfo, chapters, nextEpisode, autoplay`. `<video>` + overlays + PlayerControls; controls auto-hide (3s timer on mousemove); keyboard shortcuts (Space/K, ←/→ ±10s, ↑/↓ volume, M, F) on container with `tabindex="0"` + `role="region"` + `aria-label="Video player"`.
2. **PlayerControls** — bar with gradient scrim, pure composition.
3. **PlayPauseButton**, **TimeDisplay** (click toggles remaining time, Apple TV style), **VolumeControl** (slider revealed on `:focus-within` — a11y-driven CSS lesson).
4. **SeekBar** — the flagship. Props: `currentTime, duration, buffered, chapters`. Track in layers: base rail + **one segment per buffered range** (real players show all ranges, not one bar — seek creates gaps) + purple fill + chapter markers + time tooltip. Built on shadcn/Reka Slider (keyboard + `role="slider"` free) with `aria-valuetext` ("23 minutes 45 seconds" not raw seconds).
5. **QualityMenu** — DropdownMenu. Props: `levels, currentLevel, autoLevel`. Items: "Auto (1080p)" showing the level ABR picked, then explicit levels, check on active — Netflix pattern.
6. **PlaybackSpeedMenu** (0.5–2×, same pattern — cheap reuse), **SubtitleMenu** optional (`video.textTracks[i].mode`).
7. **BufferingOverlay** — spinner with `role="status"` + `aria-live="polite"`.
8. **ResumeOverlay** — "Resume at 23:45" / "Start from beginning"; initial focus on Resume (focus management lesson).
9. **NextEpisodeCountdown** + **EpisodeEndCard** — circular countdown with Progress when episode ends.
10. **CastButton** / **AirPlayButton** — render only if API exists; styled by `castState`.
11. **DownloadButton** — props `status: 'idle'|'downloading'|'done'|'error'`, `progress: 0-100`. **Presentational on purpose**: Phase 8 reuses it identically and the future engine just passes props.

### 7.3 Storybook strategy (what you can and can't do)

- **Real playback DOES work in Storybook**: use the public Mux stream `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8` (multi-bitrate → QualityMenu populates for real). Mark that story `chromatic: { disableSnapshot: true }` (network video = flaky snapshots) and keep an "Idle" story with poster for visual regression.
- **Controls are stored with mock props** — payoff of container/presentational split: SeekBar with `buffered: [{start:0,end:400},{start:600,end:750}]` to show the gap.
- **CAN'T exercise** (document in MDX): real casting (needs device + HTTPS), real AirPlay (Safari + Apple), real bandwidth adaptation (can't throttle from a story — but you CAN manually: DevTools network throttling on the HLS story to watch hls.js drop quality). Mock: CastButton stories with `castState` forced + "CastingOverlay" story ("Playing on living room TV").
- **Play functions**: focus player → Space → assert pause; QualityMenu open/select 720p/assert emit; ResumeOverlay focus.

Internal order: engine (useVideoPlayer + raw video) → basic controls → SeekBar → menus → buffering/keyboard/MediaSession → progress/resume → cast/airplay → DownloadButton UI.

---

## Phase 8 — Manga/Comic Reader MangaPlus-style (`Reader/`) (PR 11)

Framing: **every video concern has an analog in the reader** — the phase is a translation exercise (ABR→image variants, buffering→page preload, timestamp→page, offline HLS→offline Cache API, easier here). Repeating the pattern with variation is how you learn.

### 8.0 Technical decisions

| Requirement        | Choice                                                           | Why                                                                                                                                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PDF chapters       | **pdf.js** (`pnpm add pdfjs-dist`)                               | Renders each PDF page to canvas → blob URL, so PDFs and images flow through the same `ReaderPage` — adapter pattern, one viewer. Classic gotcha: configure `GlobalWorkerOptions.workerSrc` with the worker bundled by Vite.                                  |
| Source abstraction | Interface `chapterSource: { pageCount, getPageUrl(i, quality) }` | Images and PDFs become interchangeable providers; reader never knows which it reads.                                                                                                                                                                         |
| RTL reading        | `direction: 'rtl'\|'ltr'` in `useReader`                         | Manga reads right→left; if arrows/swipe/slider don't invert, the reader is broken for its core audience — **the signature challenge of the phase**.                                                                                                          |
| "Buffering"        | `usePagePreloader` with `new Image().src`                        | Browser caches decoded images; preloading the next ~3 (+1 back) makes page turns instant.                                                                                                                                                                    |
| Auto quality       | Simple, honest heuristic                                         | `navigator.connection.effectiveType` (Chromium only) or measure page load time with `performance.now()`. Clearly state it's a coarse heuristic — no MSE for images.                                                                                          |
| Offline            | Cache API + IndexedDB — **in scope, not stretch**                | A chapter is ~40 images hundreds of KB without manifest or DRM — here you DO implement real offline, reusing the `DownloadButton` from Phase 7 unchanged. Read back with explicit `cache.match()` (no service worker lifecycle pain in a component library). |

### 8.1 Composables

- **`useReader(chapterSource, options)`** — `currentPage`, `pageCount`, `mode: 'single'|'spread'|'vertical'`, `direction`, `quality: 'low'|'high'|'auto'`. Actions `next()`/`prev()` **semantic** ("advance in the story"): state layer thinks in reading order, view decides which arrow/edge maps per `direction` — in RTL single-page, ← advances. Spread math: pairs (2,3),(4,5)… with cover alone (off-by-one worth noting).
- **`useChapterProgress(seriesId, chapterId)`** — mirror of useWatchProgress: `savedPage`, `save(page)` (no throttle — page changes are discrete), `markRead()` on last page. Key: `read:{seriesId}:{chapterId}`.
- **`usePagePreloader(chapterSource, currentPage, quality)`** — preloads window `[current+1…current+N]` + `current-1`; exposes `pageStates: loading|loaded|error` map for ReaderPage.
- **`useChapterDownloads()`** — `download(chapter)` fetches all pages into named cache (`caches.open('chapter-{id}')`), metadata in IndexedDB, reports `progress` → feeds DownloadButton; `remove()`, `isDownloaded()`.

### 8.2 Components

1. **MangaReader** — orchestrator. Props: `chapter {id, title, source}`, `seriesId`, `prevChapter/nextChapter`. Tap/click center toggles chrome (MangaPlus/Kindle pattern); keyboard: ←/→ direction-aware, ↑/↓ in vertical, F fullscreen.
2. **ReaderPage** — one page: `{ src, pageNumber, state, alt: "Page 12" }`. Loading shimmer skeleton (reuses tokens), error state with retry — the "buffering spinner", per page.
3. **ReaderSpread** — two ReaderPage side-by-side; **DOM order follows `direction`** (right page first in RTL).
4. **VerticalReader** — webtoon mode: pages stacked full-width; `IntersectionObserver` derives `currentPage` for tracking (no discrete page change to hook).
5. **ReaderToolbar** — top bar (back, title, settings) + bottom (ChapterNav, PageSlider, PageCounter); fades with chrome, `aria-hidden` when hidden.
6. **PageSlider** — the RTL flagship: wraps shadcn/Reka Slider using its `dir` prop (no manual transforms) so dragging right _retreats_ in RTL.
7. **ReadingModeMenu** (Single/Spread/Vertical with glyphs, check active — direct reuse of QualityMenu pattern), **QualityToggle** (Low/High/Auto showing "Auto (High)" — mirrors player convention).
8. **ChapterNav** — prev/next (direction-aware order) + trigger opening a **Sheet** with chapter list and read/downloaded indicators.
9. **PageCounter** — "12 / 44" with `aria-live="polite"` to announce page changes.
10. **ReaderSettingsSheet** — Sheet composing mode + quality + direction + fit.
11. **`createPdfChapterSource(url)`** (in `src/lib/`) — async factory returning the `chapterSource` interface rendering via pdf.js.

### 8.3 Storybook

- Mock chapters with seeded picsum (`https://picsum.photos/seed/ch1p{i}/800/1200` — seeded so Chromatic stays stable); quality variants = different widths so the toggle does something visible. Small sample PDF in `public/` — PDF story DOES work live.
- Story matrix: MangaReader in each mode × each direction (**RTL single-page story is the phase's most valuable**); ReaderPage loading/loaded/error; "slow network" story with preloader states forced.
- **Play tests are the centerpiece**: press `ArrowLeft` in an RTL story and assert the page _advanced_ — if this test regresses, you know RTL logic broke. PageSlider both directions. ChapterNav open-sheet-and-select.

Internal order: mock source + useReader + single-page → toolbar/slider/counter → **RTL + play tests** → spread/vertical → preload + quality → progress/resume + ChapterNav → PDF → offline.

---

## Phase 9 — Pages (`Pages/`) (PR 12)

### 9.0 Approach

This repo is a component library without router, so "pages" are **page-level composition stories**: `src/components/pages/HomePage.stories.js` (or a thin `HomePage.vue` + story when composition isn't trivial), under the `Pages/` title with `layout: 'fullscreen'` + decorator `min-h-screen bg-background`. Centralized mock data in `src/mocks/` — one fixtures module so all pages tell the same story of the same fake catalog.

**Why this layer exists**: it's atomic design's "pages" tier — proof that separately-built components really do compose; where integration gaps surface (spacing collisions, z-index fights between AppHeader and HeroBillboard, theme seams); and each story becomes the literal blueprint of the route component when an app with a router consumes the library.

### 9.1 Inventory

| Page story                        | Composes                                                                                                                                  | New components                                                                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Pages/Home`                      | AppHeader + HeroBillboard + MediaCarousel rows + TopTenRow + Continue Watching row                                                        | none                                                                                                                               |
| `Pages/Browse`                    | AppHeader + filters + responsive MediaCard grid + pagination                                                                              | **FilterBar** (genre/type/sort dropdowns + active filter Badge chips)                                                              |
| `Pages/Search`                    | Search input + results grid + empty state                                                                                                 | **EmptyState** (icon + title + description + action — used by 4+ pages, best reuse lesson of phase)                                |
| `Pages/MediaDetail`               | Hero (backdrop + poster + meta + Play/Resume + DownloadButton) + Tabs (Episodes/Details/Related) + EpisodeListItem + cast + CommentThread | EpisodeListItem exists (Phase 4) — add progress bar and per-episode DownloadButton                                                 |
| `Pages/MangaDetail`               | Same hero pattern + chapter list + "Continue reading" CTA                                                                                 | **ChapterListItem** (number, title, date, read checkmark, download icon)                                                           |
| `Pages/Watch`                     | VideoPlayer fullscreen + "up next" rail + EpisodeEndCard variant                                                                          | none                                                                                                                               |
| `Pages/Reader`                    | MangaReader fullscreen + chapter-end interstitial (mirrors NextEpisodeCountdown)                                                          | none                                                                                                                               |
| `Pages/CommunityHome`             | AppHeader + ThreadCard feed + sidebar (about/rules Card)                                                                                  | none                                                                                                                               |
| `Pages/Thread`                    | ThreadCard expanded + MarkdownEditor + CommentThread                                                                                      | none                                                                                                                               |
| `Pages/Profile`                   | Tabs: history / downloads / settings                                                                                                      | **WatchHistoryRow** (thumb + progress + Resume + remove), **DownloadsList** (rows reusing DownloadButton `done` + storage summary) |
| `Pages/Auth`                      | Centered Card + login/register forms + SocialLoginButtons                                                                                 | none                                                                                                                               |
| `Pages/NotFound` + empty variants | EmptyState + AppHeader; empty stories for Search/Downloads/History                                                                        | reuses EmptyState                                                                                                                  |

Build the 5 new leaf components first (FilterBar, EmptyState, ChapterListItem, WatchHistoryRow, DownloadsList) with their own stories in their domains; **pages must introduce zero new leaf UI**.

### 9.2 Page-story conventions

- Snapshot each page in **both themes** — pages are where theme seams show.
- Light interaction: one smoke play function per page (Home: tab from header to hero CTA; MediaDetail: switch to Episodes tab) — deep tests live in component stories; pages test _composition_.
- Heavy pages (Watch with live HLS): `chromatic: { disableSnapshot: true }` and snapshot a paused/poster variant.

---

## Verification and ritual by phase

1. `pnpm storybook` → review each new story in **both themes** (toolbar brush). On player/reader, chrome must stay readable over media — gradient scrims, not just theme tokens, guarantee contrast over video.
2. A11y panel clean (mandatory once Phase 3 flips a11y to `'error'`). In media phases recurring failures: icon buttons without `aria-label`, sliders without `aria-valuetext`, missing live regions (BufferingOverlay, PageCounter).
3. **Media-specific a11y**: player/reader containers are focusable regions with documented shortcuts; overlays capturing interaction (ResumeOverlay, Sheets) trap and restore focus — Reka Dialog/Sheet gives it free, custom overlays do it by hand; Esc always exits.
4. `pnpm test:unit` — addon-vitest runs each story as a test; `play` functions are your interaction tests (quality selection, RTL pagination, ResumeOverlay focus).
5. `pnpm lint && pnpm build-storybook` — the exact CI gate.
6. Chromatic reviews visual diffs in the PR (network-media stories → `disableSnapshot`).
7. **Honest limits, documented in each phase's MDX**: Storybook can't exercise real casting/AirPlay, real ABR, `navigator.connection`, or Cache API persistence in Chromatic — each gets a story with forced state + note "verify manually with…" (e.g., DevTools network throttling on the HLS story to watch hls.js drop quality).

**PR breakdown** (each leaves `build-storybook` green). Update the Status column as you open/merge each PR (`—` → `#<num> open` → `#<num> ✅`):

| PR  | Content                                                                                                                                          | Size                     | Status                                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ----------------------------------------------------------------------------------- |
| 1   | Phase 1: HSL tokens + 5 Foundations MDX                                                                                                          | S (highest review value) | #1 open (Colors ✅, Typography ✅, pending: SpacingRadius, ShadowsGradients, Icons) |
| 2   | Phase 2: addon-themes, storySort, Overview MDX (Intro, Principles, Accessibility, Changelog), Button → `UI/Button` with full docs standard (2.3) | S                        | —                                                                                   |
| 3   | Phase 3 Batch A + stories                                                                                                                        | M                        | —                                                                                   |
| 4   | Phase 3 Batches B+C + stories, a11y → `error`                                                                                                    | M                        | —                                                                                   |
| 5   | Phase 4 steps 1–8 + `src/mocks/media.js`                                                                                                         | L                        | —                                                                                   |
| 6   | Phase 4 steps 9–14 (detail + shell)                                                                                                              | M                        | —                                                                                   |
| 7   | Phase 5 steps 1–7 (feed + comments)                                                                                                              | M                        | —                                                                                   |
| 8   | Phase 5 steps 8–11 + ThreadPage pattern                                                                                                          | M                        | —                                                                                   |
| 9   | Phase 6 + delete HelloWorld                                                                                                                      | S                        | —                                                                                   |
| 10a | Phase 7: playback core (useVideoPlayer, controls, SeekBar, quality, buffering, resume)                                                           | L                        | —                                                                                   |
| 10b | Phase 7: cast/AirPlay/MediaSession + DownloadButton UI                                                                                           | M                        | —                                                                                   |
| 11  | Phase 8: complete reader (RTL, modes, preload, PDF, offline)                                                                                     | L                        | —                                                                                   |
| 12  | Phase 9: new leaf components + page stories                                                                                                      | L                        | —                                                                                   |

**New dependencies by phase**: `marked dompurify` (Phase 5), `hls.js` (Phase 7), `pdfjs-dist` (Phase 8). Cast/AirPlay carry no npm package (script-tag + native APIs).

## Critical files

- `src/assets/main.css` — all token work (Phase 1)
- `.storybook/preview.js` — theme decorator, storySort, a11y (Phase 2)
- `.storybook/main.js` — register addon-themes
- `src/components/ui/button/index.js` — CVA pattern reference; the `xl` 44px size goes here
- `components.json` — shadcn-vue config (font, aliases; confirm JS-only and `@/composables` alias)
- `src/composables/` — new folder (Phases 7–8): useVideoPlayer, useWatchProgress, useCast, useReader, useChapterProgress, usePagePreloader, useChapterDownloads
- `src/components/player/`, `src/components/reader/`, `src/components/pages/` — new domains (Phases 7–9)
