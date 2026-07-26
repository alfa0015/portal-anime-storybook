# Changelog 0.1.0

Initial design system release for TV series/manga portal + community. Scope: **9 phases, 12+ PRs, 100+ components** documented in Storybook following Grafana UI standards.

Theme: **dark-first**, adaptive dark mode, semantic HSL tokens, streaming UX (Netflix/Crunchyroll/Apple TV+/Disney+), Reddit-style community, ABR video player, MangaPlus-style manga reader.

---

## Foundations (Phase 1)

### Design Tokens

- **Semantic color palette (HSL):** primary purple `#9146F0`, accent blue `#0080FF`, destructive red `#F04D4D`, light/dark backgrounds, surfaces, borders, inputs
- **Adaptive dark theme:** light mode + dark mode with `@custom-variant`, `.dark` class on `<html>`
- **Typography:** Inter 400–800, bold tight headings, responsive hero title scaling
- **Spacing & Radius:** 0.75rem radius, container max 1400px with 2rem padding, `--radius-sm/md/lg/xl` derived
- **Shadows & glows:** `--shadow-card`, `--shadow-card-hover` (purple-tinted), `--glow-primary`, `--glow-accent` — intensified in dark mode
- **Gradients:** `--gradient-primary` (purple), `--gradient-accent` (blue), `--gradient-dark` (overlay)

### MDX Documentation

- `Foundations/Colors` — ColorPalette doc block, tokens by category (semantic, background, border, etc.), light+dark side-by-side
- `Foundations/Typography` — Typeset doc block, hero heading recipe, weight/size/line-height scale
- `Foundations/SpacingRadius` — spacing scale, radius variants, container, header/hero/card heights
- `Foundations/ShadowsGradients` — shadow visuals + glow demos, gradients in context (buttons, cards), dark mode toggle
- `Foundations/Icons` — gallery of Lucide icons used (play, download, cast, arrows, pin, lock, etc.), extensible for future features

---

## Storybook Infrastructure (Phase 2)

### Dark Mode Toggle

- `@storybook/addon-themes` with `withThemeByClassName` (`.dark` class on `<html>` for Reka portal)
- Toolbar paintbrush to switch light↔dark
- Default theme: **dark-first**

### Storybook Structure

- Title hierarchy: `Overview > Foundations > UI > Media > Community > Player > Reader > App > Pages`
- `storySort` order configured in `preview.js`
- Deprecated group for retired components (growth convention)

### Overview MDX (Meta-documentation)

- `Overview/Intro` — what is the design system, for whom, how to consume (install/imports), link to repo
- `Overview/Design Principles` — dark-first, poster-driven, Netflix/Crunchyroll/Apple TV+/Disney+ inspiration, "never invent colors: always use tokens"
- `Overview/Accessibility` — a11y policy: addon in `error` mode, `aria-label` on icon buttons, documented keyboard shortcuts, focus trapping in overlays
- `Overview/Changelog` — release history/PRs, link to CHANGELOG.md

### Component Documentation Standard (2.3)

- Usage description (what it is, when to use it, when NOT to use it)
- `Default` story + `With<Prop>` story for each boolean/visual state
- `AllVariants` / `AllSizes` matrix (CVA) with controls disabled
- `Examples` story in real product context (with mocks)
- Complete props table (argTypes; slots/emits documented in Vue)
- Accessibility note (supported keys, roles/labels)
- Reviewed in both themes (light+dark toggle)

### a11y Enforcement (Phase 3+)

- addon-vitest with Playwright browser tests (each story = smoke test)
- addon-a11y in `error` mode (CI enforces accessibility)

---

## shadcn-vue Primitives (Phase 3)

### UI Batch A — Browsing Core

- `Badge` — 6 variants (default, secondary, outline, destructive) + pill shape
- `Card` — base surface with border, shadow, radius
- `Skeleton` — shimmer for loading states
- `Tooltip` — label on hover/focus
- `Separator` — visual divider (horizontal/vertical)
- `Scroll-Area` — styled scrollable container
- `Carousel` (embla) — horizontal carousel with arrows
- `Tabs` — tab navigation + content switching
- `Aspect-Ratio` — maintain ratio (2:3 posters, 16:9 backdrops)

### UI Batch B — Chrome & Overlays

- `Avatar` — user profile picture (circular, multiple sizes)
- `Dropdown-Menu` — context menu (DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem)
- `Dialog` — centered modal with backdrop, focus trap
- `Sheet` — side panel (over-the-top), dismissible
- `Input` — text input with states (focus, error, disabled)
- `Command` — search/command palette (cmdk-based)

### UI Batch C — Forms & Feedback

- `Textarea` — multiline input
- `Select` — dropdown selector (Reka Select)
- `Checkbox` — boolean toggle + `Label`
- `Label` — form label
- `Sonner` (toast library) — notifications (success, error, loading)
- `Pagination` — page navigation (numbered + prev/next)
- `Breadcrumb` — path navigation
- `Progress` — progress bar (0–100%)
- `Toggle-Group` — button group (exclusive or multiple)

### CVA Story Pattern

- All UI components follow Button pattern: `Default`, `With<Prop>`, `AllVariants`
- argTypes derived from CVA (impossible to drift)
- addon-vitest tests each variant (snapshot + a11y)

---

## Streaming Components (Phase 4)

### Rating & Genre

- `RatingBadge` — score badge with color ramp (≥8 primary, mid accent, low muted)
- `GenrePill` — pill badge, `active` → gradient primary

### Cards

- `MediaCard` — 2:3 poster + hover scale/glow, RatingBadge, title overlay, sizes sm/md/lg (280/320/400px)
- `SkeletonCard` — layout-matched shimmer (no-shift proof)
- `ContinueWatching` — 16:9 still + Progress bar, episode label

### Rows & Carousels

- `MediaCarousel` — horizontal scroll with arrows on group-hover, `#item` scoped slot
- `TopTenRow` — MediaCarousel + giant outlined rank numbers overlapping

### Hero & Detail

- `HeroBillboard` — fullscreen backdrop + gradients + hero title recipe + CTA button with glow
- `MediaDetailHero` — HeroBillboard + metadata row (RatingBadge, year, GenrePills)
- `PersonCard` — avatar + name + role (cast rows)
- `EpisodeListItem` — 16:9 thumbnail + title + duration + synopsis + watch progress bar

### App Shell

- `AppHeader` — fixed top, h-16, backdrop-blur, border-b, dark-aware scrim
- `AppFooter` — link columns (muted)
- `SearchPalette` — Command inside Dialog, ⌘K trigger
- `NotificationBell` — bell icon + Badge counter (absolute, red), dropdown menu
- `UserMenu` — Avatar trigger → DropdownMenu (Profile, My List, Settings, Sign out)
- `ThemeToggle` — Sun/Moon button, toggles `.dark` + localStorage

### Mocks

- `src/mocks/media.js` — `mockShows`, `mockSeasons`, `mockEpisodes` with seeded picsum URLs

---

## Reddit-Style Community (Phase 5)

### User & Rank

- `OnlineIndicator` — 8px green dot + pulse when online
- `RankBadge` — admin (gradient primary) | mod (accent) | member | newbie (CVA local)

### Feed & Threads

- `VoteControl` — vertical upvote/downvote + score `tabular-nums`, emit `vote`
- `ThreadCard` — feed card: title + author + VoteControl + excerpt + optional thumbnail + comment count + tags
- `ThreadListItem` — dense variant: title + RankBadge + counters (replies/views) + pin/lock icons
- `CommunityHeader` — sub-community banner: name + description + online count + Join button

### Comments (Recursive)

- `CommentItem` — small avatar + name + RankBadge + time + collapse toggle + reply/share/report DropdownMenu
- `CommentThread` — recursive component nests CommentItem, `maxDepth` cuts indentation

### Markdown

- `MarkdownRenderer` — `marked` + `dompurify` render, scoped styles (links accent, blockquote border-l-primary, code bg-muted)
- `MarkdownEditor` — Tabs (Write/Preview) + toolbar ToggleGroup (bold/italic/link/quote/code via textarea selection API) + live Preview

### Polls & Patterns

- `PollWidget` — pre-vote: radio list + button; post-vote: Progress bars with percentages, winner in gradient-primary
- `Community/Patterns/ThreadPage` — full composition story (CommunityHeader → ThreadCard → MarkdownEditor → CommentThread → Pagination)

### Mocks

- `src/mocks/community.js` — `mockThreads`, `mockComments` tree, markdown kitchen-sink

---

## Auth & Social (Phase 6)

- `SocialLoginButtons` — Google/Discord/GitHub, `Button outline` full-width + inline brand SVGs, states (idle, loading, error)
- `UserMenu` — Avatar → DropdownMenu (Profile, My List, Settings, `Separator`, ThemeToggle, Sign out text-destructive)
- `ThemeToggle` — Button ghost icon (Sun/Moon), localStorage + `document.documentElement.classList.toggle('dark')`
- `NotificationBell` — Bell icon + Badge counter (red, pill, absolute -top-1 -right-1), dropdown list (avatar + text + time)

---

## Video Player (Phase 7)

### Composables

- `useVideoPlayer(videoRef, opts)` — state (playing, currentTime, duration, buffered, isBuffering, volume, playbackRate, isFullscreen); quality (levels, currentLevel, autoLevel, setQuality); actions (play/pause/seek/skip/toggleFullscreen); Media Session metadata + handlers; hls.js init + cleanup
- `useWatchProgress(seriesId, episodeId)` — savedPosition, save() throttled, markWatched(), localStorage key convention
- `useCast({ receiverAppId })` — injects gstatic script on-demand, exposes castAvailable/castState, startCast/stopCast, progressive enhancement

### Playback Core

- `VideoPlayer` — orchestrator, `<video>` + overlays, auto-hide controls (3s), keyboard shortcuts (Space/K, ←/→ ±10s, ↑/↓ vol, M mute, F fullscreen)
- `PlayPauseButton` — icon toggle, `aria-label` flips Play/Pause
- `TimeDisplay` — "23:45 / 45:00", click toggles remaining time
- `VolumeControl` — mute + slider (`:focus-within`), icon changes
- `SeekBar` — track layers: rail + buffered range segments + played fill + chapter ticks + hover tooltip, Reka Slider with `aria-valuetext` ("23 minutes 45 seconds")
- `QualityMenu` — DropdownMenu, items "Auto (1080p)" + explicit levels, check on active
- `PlaybackSpeedMenu` — 0.5–2×, same pattern
- `SubtitleMenu` (optional) — `video.textTracks[i].mode`

### Controls & States

- `PlayerControls` — bar layout with gradient scrim, flex row: play/skip/time/volume | quality/speed/subtitles/cast/airplay/fullscreen
- `BufferingOverlay` — spinner, `role="status"` + `aria-live="polite"`
- `ResumeOverlay` — "Continue at 23:45" / "Start from beginning", initial focus on Continue
- `NextEpisodeCountdown` — circular Progress countdown, `play-next` / `cancel`
- `EpisodeEndCard` — poster + NextEpisodeCountdown + "Back to details"

### Streaming & Cast

- `CastButton` — renders only if `castAvailable`, styled by `castState`, triggers cast flow
- `AirPlayButton` — renders if Remote Playback API/WebKit exists
- `DownloadButton` — states (idle, downloading %, done ✓, error) — **presentational by design**, fed props only

### Tech Stack

- `hls.js` — MSE-based ABR, `hls.levels` for quality menu, `Hls.isSupported()` branching
- Safari fallback: native HLS via `video.src` (no quality menu)
- Media Session API — metadata, handlers for hardware keys
- Mux test stream: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

### Stories (Storybook)

- `VideoPlayer` — live stream (Mux), `chromatic: { disableSnapshot: true }`, + "Idle" poster story for snapshots
- `SeekBar` — mock buffered ranges, chapter markers
- `QualityMenu` — dropdown opened story
- `BufferingOverlay`, `ResumeOverlay`, `NextEpisodeCountdown` — forced states
- `CastButton` — forced `castState` (no-devices, connecting, connected) + "CastingOverlay" ("Playing on Living Room TV")
- `DownloadButton` — 4 states in grid
- Play functions: focus→Space→pause assertion, QualityMenu select, ResumeOverlay choice

### Honest Limits (MDX)

- Storybook CANNOT: real casting (device + HTTPS), real AirPlay (Safari+device), real ABR (no network throttle)
- Workaround: manual DevTools network throttling on live stream to watch hls.js downswitch

---

## Manga/PDF Reader (Phase 8)

### Composables

- `useReader(chapterSource, options)` — currentPage, pageCount, mode (single/spread/vertical), direction (rtl/ltr), quality (low/high/auto); next/prev semantic; spread math (2,3),(4,5)...
- `useChapterProgress(seriesId, chapterId)` — savedPage, save() discrete, markRead(), localStorage key convention
- `usePagePreloader(chapterSource, currentPage, quality)` — preloads [current+1…current+N] + current-1, exposes pageStates map
- `useChapterDownloads()` — download() → named Cache API, metadata in IndexedDB, progress report; remove(), isDownloaded()

### Reader Core

- `MangaReader` — orchestrator, `chapter {id, title, source}`, seriesId, prev/nextChapter; tap center toggles chrome; keyboard ←/→ direction-aware, ↑/↓ scroll vertical, F fullscreen
- `ReaderPage` — single page, shimmer load, error with retry
- `ReaderSpread` — two ReaderPage side-by-side, **DOM order follows direction** (right first in RTL)
- `VerticalReader` — webtoon mode: full-width stack, `IntersectionObserver` → currentPage

### Toolbar & Navigation

- `ReaderToolbar` — top (back, series/title, settings trigger) + bottom (ChapterNav, PageSlider, PageCounter), fades with chrome
- `PageSlider` — **RTL flagship**: Reka Slider with `dir` prop, drag-right = backwards in RTL
- `PageCounter` — "12 / 44", `aria-live="polite"` announcements
- `ChapterNav` — prev/next (direction-aware order) + chapter-list Sheet trigger with read/downloaded indicators

### Reader Settings

- `ReadingModeMenu` — Single/Spread/Vertical toggle (glyphs, check on active)
- `QualityToggle` — Low/High/Auto, shows "Auto (High)" resolved
- `ReaderSettingsSheet` — Sheet composing mode + quality + direction + fit

### Adapters

- `createPdfChapterSource(url)` — async factory, `pdfjs-dist`, renders page to canvas → blob URL, returns `chapterSource` interface
- Image chapters: simple picsum URLs wrapped in `chapterSource`

### Stories (Storybook)

- `MangaReader` — matrix: each mode × each direction (**RTL single-page is most valuable**)
- `ReaderPage` — loading/loaded/error states
- `PageSlider` — both directions, keyboard test
- "Slow network" story — pageStates forced (loading placeholders)
- **Play tests**: ArrowLeft in RTL → assert page advanced (regression test); PageSlider drag/keyboard; ChapterNav open-sheet-select
- Live PDF story — sample PDF in `public/`

### Tech Stack

- `pdf.js` (`pdfjs-dist`) — Canvas render per page
- `GlobalWorkerOptions.workerSrc` setup (classic gotcha)
- Cache API + IndexedDB — offline chapter download/read (full scope, not stretch)
- RTL: **phase's signature challenge**

### Honest Limits (MDX)

- `navigator.connection.effectiveType` (Chromium-only), coarse heuristic vs hls.js MSE
- Storybook CANNOT: real bandwidth adaptation, Cache API persistence in Chromatic
- Workaround: manual `cache.storage.usage()` inspect in DevTools

---

## Pages (Phase 9)

### Page-Level Composition Stories

Fullscreen stories under `Pages/` title, layout: 'fullscreen' + `min-h-screen bg-background` decorator. Centralized mock data in `src/mocks/`.

### Home

- AppHeader + HeroBillboard + rows (MediaCarousel trending, Top-10 Row, Continue Watching) + footer
- Smoke test: tab header → CTA click

### Browse / Catalog

- AppHeader + FilterBar (genre/type/sort dropdowns + active filter Badge chips) + responsive MediaCard grid + Pagination
- `FilterBar` new component

### Search

- AppHeader + SearchPalette input → results grid + EmptyState (icon + title + description + action)
- `EmptyState` new component (reusable by 4+ pages)

### MediaDetail

- Hero (backdrop + poster + meta: RatingBadge, year, GenrePills + Play/Resume + DownloadButton) + Tabs (Episodes/Details/Related)
- Episodes tab: `EpisodeListItem` rows with progress bar + per-episode DownloadButton
- Cast strip: PersonCard rows
- Related: MediaCard grid
- Comments: CommentThread community section

### MangaDetail

- Same hero pattern + chapter list with read/downloaded indicators + "Continue Reading" CTA
- `ChapterListItem` new component (number, title, date, read-check, download icon)

### Watch

- VideoPlayer fullscreen + up-next rail (episode cards thumb + title + Play) + EpisodeEndCard state

### Reader

- MangaReader fullscreen + chapter-end interstitial (mirrors NextEpisodeCountdown)

### CommunityHome

- AppHeader + ThreadCard feed (vote, title, author, comments count) + sidebar (about Card, rules)

### Thread

- ThreadCard expanded (full width, more metadata) + MarkdownEditor reply + CommentThread tree

### Profile

- AppHeader + Tabs: watch history / downloads / settings
- `WatchHistoryRow` new component (thumb + title + progress + Resume button + Remove)
- `DownloadsList` new component (chapter/episode rows + storage used summary, reuses DownloadButton done state)

### Auth

- Centered Card, login/register forms + SocialLoginButtons
- Social providers: Google, Discord, GitHub

### NotFound & Empty States

- EmptyState + AppHeader
- Empty variants: Search, Downloads, History (reuses EmptyState)

### Verification

- Snapshots in light+dark (pages = where theme seams show)
- Smoke play test per page
- Media-heavy pages (Watch): `chromatic: { disableSnapshot: true }` + poster variant

---

## Specs & References

- **Colors:** [Foundations/Colors](../docs/design-system-plan.md)
- **Typography:** [Foundations/Typography](../docs/design-system-plan.md)
- **Icons:** [Foundations/Icons](../docs/design-system-plan.md)
- **Design Principles:** [Overview/Design Principles](../docs/design-system-plan.md)
- **Accessibility Policy:** [Overview/Accessibility](../docs/design-system-plan.md)
- **Implementation Guide:** [docs/design-system-plan.md](../docs/design-system-plan.md) — 9 phases, technical decisions, story pattern

---

## Implementation Status

See PR tracker in [docs/design-system-plan.md](../docs/design-system-plan.md#desglose-de-prs) for progress: Phase 1 → Phase 9, Status (open/merged).

---

**Repository:** [storybook-pa](https://github.com/alfa0015/storybook-pa)  
**Storybook:** In development (`pnpm storybook` after Phase 2 completion)  
**Stack:** Vue 3.5 + Vite 8 + Tailwind v4 + shadcn-vue (Reka UI) + Storybook 10 + vitest + Chromatic  
**Started:** July 2026
