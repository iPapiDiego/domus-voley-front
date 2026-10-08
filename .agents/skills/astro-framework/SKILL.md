---
name: astro-framework
description: Astro 6 specialist for pure .astro components with vanilla JS/TS and Tailwind CSS. Use when creating Astro components, pages, layouts, handling client-side interactivity with vanilla JS scripts, configuring routing, optimizing images, using Content Layer API, server islands (server:defer), view transitions, or astro:env. This project uses NO React/Vue/Svelte/Solid — all interactivity is vanilla JS in <script> tags.
license: MIT
metadata:
  author: delineas
  version: "3.0.0"
  category: framework
  tags: astro, islands, ssg, content-collections, content-layer, view-transitions, server-islands, astro-env, vanilla-js, tailwind
---

# Astro 6 — Pure .astro Specialist

Senior Astro specialist for static sites and hybrid apps using pure `.astro` components, vanilla JS/TS, and Tailwind CSS. No React, Vue, Svelte, or Solid.

## Stack

- Astro 6 (currently `output: 'static'`, no adapter)
- Tailwind CSS 4 via `@tailwindcss/vite`
- TypeScript strict mode
- Vanilla JS in `<script>` tags — no UI frameworks

## When to Use This Skill

- Writing `.astro` components, pages, layouts
- Adding interactivity with vanilla JS `<script>` tags
- Configuring routing, dynamic routes, `getStaticPaths()`
- Optimizing images with `<Image>` / `<Picture>`
- Using Content Layer API (glob/file loaders)
- Setting up view transitions (`ClientRouter`)
- Planning server islands (`server:defer`) for future SSR
- Configuring `astro:env` for type-safe env vars
- Building static JSON endpoints

## Output Mode

This project is `output: 'static'` (default, no adapter). Implications:

| Feature | Static ✅/❌ | Requires |
|---|---|---|
| `.astro` components | ✅ | — |
| Vanilla JS `<script>` | ✅ | — |
| `<Image>` optimization | ✅ | — |
| Content Collections | ✅ | — |
| `astro:env` | ✅ | — |
| View Transitions | ✅ | — |
| `getStaticPaths()` | ✅ | — |
| `server:defer` | ❌ | SSR adapter |
| `Astro.session` | ❌ | SSR adapter |
| `Astro.cookies` | ❌ | SSR adapter |
| `Astro.redirect()` | ❌ | SSR adapter |
| Actions (full) | ❌ | SSR adapter |
| `Astro.request` | ❌ | SSR adapter |

> When the project adds an SSR adapter (`output: 'hybrid'`), all ❌ features unlock on opted-in pages.

## Component Structure

```astro
---
// 1. Imports (server-only — runs at build time)
import Layout from '../layouts/Layout.astro';
import { Image } from 'astro:assets';
import heroImg from '../assets/hero.jpg';

// 2. Props interface — always required
interface Props {
  title: string;
  subtitle?: string;
}

// 3. Destructure with defaults
const { title, subtitle = 'Default' } = Astro.props;

// 4. Logic — top-level await supported
const items = [{ id: 1, name: 'Prog A' }, { id: 2, name: 'Prog B' }];
---

<!-- Template — JSX-like expressions -->
<Layout title={title}>
  <h1>{title}</h1>
  {subtitle && <p>{subtitle}</p>}

  <ul>
    {items.map((item) => (
      <li>{item.name}</li>
    ))}
  </ul>

  <Image src={heroImg} alt="Hero" width={800} height={400} />
</Layout>
```

**Rules:**
- `window`, `document`, `localStorage` → NEVER in frontmatter (server-only)
- Props always typed with `interface Props`
- No `any` — use `unknown` and narrow

## Template Directives

### class:list — conditional classes (Tailwind pattern)

```astro
---
const isActive = true;
const variant: 'primary' | 'secondary' = 'primary';
---

<button class:list={[
  'px-4 py-2 rounded-lg font-label-bold',
  { 'bg-primary-container text-on-primary-container': variant === 'primary' },
  { 'bg-surface-variant text-on-surface-variant': variant === 'secondary' },
  { 'opacity-50 pointer-events-none': isActive === false },
]}>
  Click
</button>
```

### set:html / set:text

```astro
<!-- set:html — raw HTML injection (XSS risk: only use with trusted content) -->
<div set:html={trustedRichContent} />

<!-- set:text — safe text, escapes HTML -->
<p set:text={userInput} />
```

### define:vars — pass frontmatter values to CSS or client script

```astro
---
const accentColor = '#bd00ff';
const delay = 200;
---

<!-- CSS variables from frontmatter -->
<style define:vars={{ accentColor }}>
  .highlight { color: var(--accentColor); }
</style>

<!-- JS variables from frontmatter -->
<script define:vars={{ delay }}>
  setTimeout(() => console.log('fired'), delay);
</script>
```

### is:raw — prevent Astro from processing content

```astro
<div is:raw>
  {this is not processed by Astro}
</div>
```

### transition:* — View Transitions (when ClientRouter is active)

```astro
<!-- Named transition for matched elements across pages -->
<img transition:name="hero-image" src={img} alt="Hero" />

<!-- Custom animation -->
<div transition:animate="slide">Content</div>

<!-- Persist element across navigations (media players, etc.) -->
<audio transition:persist src="/bg-music.mp3" />
```

## Client-Side JavaScript / TypeScript

The project uses vanilla JS in `<script>` tags. No `client:*` directives (those require React/Vue/Svelte).

### Script types

```astro
<!-- Bundled by Vite — TypeScript supported, deduped across pages -->
<script>
  const btn = document.querySelector<HTMLButtonElement>('#my-btn');
  btn?.addEventListener('click', () => console.log('clicked'));
</script>

<!-- Inline — emitted as-is, no Vite processing, no TS -->
<script is:inline>
  window.__CONFIG__ = { env: 'prod' };
</script>
```

**Key rules:**
- `<script>` (no attr) → bundled, TypeScript, deduped, safe to import npm modules
- `<script is:inline>` → raw emit, no TS, no dedup, no imports — use only for global init
- Script lives in the `.astro` file that owns it — never a separate JS file for per-component logic

### Interactivity pattern — markup in .astro, JS toggles state

**The golden rule: JS NEVER builds HTML. Markup lives in `.astro`. JS only toggles classes/attributes.**

```astro
---
// All markup declared here
---

<!-- Modal markup — always in DOM, hidden by default -->
<div id="modal" class="hidden fixed inset-0 z-50 flex items-center justify-center">
  <div class="glass-card rounded-xl p-8">
    <button id="modal-close" aria-label="Cerrar">✕</button>
    <slot />
  </div>
</div>

<button id="modal-open" class="bg-primary-container px-6 py-3 rounded-full">
  Abrir modal
</button>

<script>
  const modal = document.getElementById('modal')!;
  const openBtn = document.getElementById('modal-open')!;
  const closeBtn = document.getElementById('modal-close')!;

  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  });
</script>
```

### View Transitions — re-initializing scripts

When `ClientRouter` is active, scripts must re-initialize on every navigation:

```astro
<script>
  function init() {
    const btn = document.querySelector('#my-btn');
    btn?.addEventListener('click', handler);
  }

  // Initial load
  init();

  // Re-run after every View Transition navigation
  document.addEventListener('astro:page-load', init);
</script>
```

> `astro:after-swap` fires after the DOM swap but before paint. Use for state that must be set before render (e.g., theme class on `<html>`).

### Passing data from frontmatter to script

```astro
---
const items = [{ id: 1, label: 'A' }, { id: 2, label: 'B' }];
const config = { apiUrl: import.meta.env.PUBLIC_API_URL };
---

<script define:vars={{ items, config }}>
  // items and config are available here as JS values
  console.log(items, config.apiUrl);
</script>
```

## Slots

```astro
<!-- Named slots -->
<!-- Layout.astro -->
<header><slot name="header" /></header>
<main><slot /></main>
<footer><slot name="footer" /></footer>

<!-- Usage -->
<Layout>
  <h1 slot="header">Título</h1>
  <p>Contenido principal</p>
  <p slot="footer">Footer</p>
</Layout>
```

```astro
<!-- Conditional slot wrapper -->
---
const hasAside = Astro.slots.has('aside');
---
{hasAside && <aside><slot name="aside" /></aside>}
```

## Astro Global — Quick Reference

```astro
---
// Always available
Astro.props          // typed component props
Astro.slots          // { has(name), render(name) }
Astro.self           // reference to this component (recursive)
Astro.url            // URL object — pathname, searchParams, etc.
Astro.site           // configured site URL from astro.config.mjs
Astro.generator      // "Astro v6.x.x"
Astro.params         // dynamic route params { slug: 'post-1' }

// Requires SSR (not available in static output)
Astro.request        // Request object
Astro.response       // Response headers
Astro.cookies        // get/set cookies
Astro.redirect('/x') // server redirect
Astro.session        // server session
Astro.locals         // set by middleware
Astro.currentLocale  // i18n current locale
---
```

## Images

```astro
---
import { Image, Picture } from 'astro:assets';
import coachPhoto from '../assets/coaches/juan.jpg';
---

<!-- Image — single optimized format -->
<Image
  src={coachPhoto}
  alt="Juan García, entrenador principal"
  width={400}
  height={400}
  format="webp"
  class="rounded-full object-cover"
/>

<!-- Picture — multiple formats (best for hero images) -->
<Picture
  src={coachPhoto}
  formats={['avif', 'webp']}
  alt="Juan García"
  width={800}
  height={600}
/>
```

**Rules:**
- Always import local images — never `src="/images/..."` string paths
- Never hotlink external URLs — download to `src/assets/`
- `alt` real and descriptive — never `data-alt` (invalid attribute)
- Images live in `src/assets/`, organized by category

## Content Collections (future scale)

Currently data is hardcoded in frontmatter arrays. When ready to migrate:

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const coaches = defineCollection({
  loader: glob({ base: './src/content/coaches', pattern: '**/*.json' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string(),
    bio: z.string(),
  }),
});

export const collections = { coaches };
```

```astro
---
import { getCollection } from 'astro:content';
const coaches = await getCollection('coaches');
---

{coaches.map((coach) => (
  <CoachCard name={coach.data.name} role={coach.data.role} />
))}
```

## Server Islands (requires SSR adapter — future)

When the project adds `output: 'hybrid'` + an adapter:

```astro
---
import UserGreeting from '../components/UserGreeting.astro';
---

<!-- Component renders server-side, independently from the page -->
<UserGreeting server:defer>
  <p slot="fallback">Cargando...</p>
</UserGreeting>
```

**Rules:**
- Always provide `slot="fallback"` to avoid layout shift
- Props must be serializable (strings, numbers, arrays — not functions or class instances)
- The island can access `Astro.cookies`, `Astro.session`, DB — the page can't (static)

## Routing

```
src/pages/
├── index.astro           → /
├── us/
│   └── coaches.astro     → /us/coaches
├── clients/
│   └── [id].astro        → /clients/:id  (needs getStaticPaths)
└── api/
    └── data.json.ts      → /api/data.json (static endpoint)
```

Dynamic routes in static mode:

```astro
---
export async function getStaticPaths() {
  return [
    { params: { id: '1' } },
    { params: { id: '2' } },
  ];
}

const { id } = Astro.params;
---
```

## Critical Rules

### MUST DO

- `interface Props` on every component
- `class:list` for conditional Tailwind classes — not ternary string concat
- Markup in `.astro`, JS only toggles `classList` / `aria-*` attributes
- `<Image>` / `<Picture>` for all images — no raw `<img>` for local assets
- `astro:page-load` listener when View Transitions are active
- `<Fragment>` or `<>` for multiple root elements

### MUST NOT DO

- `window` / `document` / `localStorage` in frontmatter — server-only context
- `innerHTML = "..."` or HTML string templates in `<script>` — build markup in `.astro`
- `data-alt` — use `alt` (valid attribute)
- `client:load`, `client:idle`, `client:visible` — no UI framework components in this project
- `Astro.cookies`, `Astro.session`, `Astro.redirect()` in static pages — requires SSR
- String paths for images (`src="/images/x.jpg"`) — import from `src/assets/`
- `any` in TypeScript — use `unknown` and narrow

## Reference Documentation

| Topic | Reference | When to Load |
|-------|-----------|--------------|
| Components | [references/components.md](references/components.md) | Props, slots, expressions, class:list, set:html |
| Styling | [references/styling.md](references/styling.md) | Scoped CSS, global styles, define:vars |
| Images | [references/images.md](references/images.md) | Image/Picture, formats, responsive |
| Routing | [references/routing.md](references/routing.md) | File routing, dynamic routes, getStaticPaths |
| Content Collections | [references/content-collections.md](references/content-collections.md) | Content Layer API, loaders, schemas |
| View Transitions | [references/view-transitions.md](references/view-transitions.md) | ClientRouter, transition:*, astro:page-load |
| Server Islands | [references/server-islands.md](references/server-islands.md) | server:defer, fallback, SSR requirements |
| SSR & Adapters | [references/ssr-adapters.md](references/ssr-adapters.md) | hybrid mode, adapters, prerender flags |
| Environment Variables | [references/environment-variables.md](references/environment-variables.md) | astro:env, envField, PUBLIC_* vars |
| Configuration | [references/configuration.md](references/configuration.md) | astro.config.mjs, integrations, sitemap |
| Middleware | [references/middleware.md](references/middleware.md) | onRequest, Astro.locals, auth guards |
| Actions | [references/actions.md](references/actions.md) | defineAction, form handling (requires SSR) |

## Technologies

Astro 6, Static Site Generation, Content Layer API, View Transitions, Server Islands (`server:defer`), `astro:env`, Tailwind CSS 4, TypeScript strict, Vanilla JS, Image Optimization (`astro:assets`), Scoped CSS, File-based Routing
