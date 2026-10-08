---
name: tailwind-css-patterns
description: Provides Tailwind CSS v4 utility-first styling patterns including CSS-first configuration (@theme, @layer, @custom-variant), responsive design, layout utilities, flexbox, grid, spacing, typography, and design token integration. Use when styling Astro/React/Vue/Svelte components, building responsive layouts, implementing design systems with custom @theme tokens, or migrating from Tailwind v3.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Tailwind CSS v4 Development Patterns

Expert guide for building modern, responsive UIs with Tailwind CSS v4. CSS-first configuration — no `tailwind.config.js`.

## Overview

Tailwind v4 replaces the JS config file with a CSS-first `@theme` directive. All design tokens live in your CSS file. No `content: []` paths needed — v4 auto-detects template files.

## When to Use

- Styling Astro/React/Vue/Svelte components
- Building responsive layouts and grids
- Implementing design systems with custom tokens
- Configuring `@theme`, `@layer`, `@custom-variant`
- Migrating from Tailwind v3 to v4

## v4 Setup

### Vite integration (Astro, Vite projects)

```javascript
// astro.config.mjs / vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
})
```

### CSS entry point

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-primary: #ecb2ff;
  --color-surface: #13131b;
  --font-body: "Lexend", sans-serif;
  --text-headline-lg: 40px;
  --text-headline-lg--line-height: 1.2;
  --text-headline-lg--font-weight: 700;
  --radius-xl: 0.75rem;
  --animate-fade-up: fadeUp 0.7s ease forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(2rem); }
  to   { opacity: 1; transform: translateY(0); }
}
```

> No `tailwind.config.js`, no `content: []`, no `purge`. v4 scans templates automatically.

## Core Concepts

### @theme — design tokens

`@theme` defines CSS custom properties that Tailwind exposes as utility classes:

```css
@theme {
  --color-brand: #bd00ff;       /* → bg-brand, text-brand, border-brand */
  --font-display: "Space Grotesk", sans-serif;  /* → font-display */
  --spacing-18: 4.5rem;         /* → p-18, m-18, gap-18 */
  --radius-card: 1rem;          /* → rounded-card */
}
```

Token naming pattern:
| CSS variable | Generated utility |
|---|---|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `ring-*` |
| `--font-*` | `font-*` |
| `--text-*` | `text-*` (with `--line-height`, `--font-weight` sub-tokens) |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` |
| `--radius-*` | `rounded-*` |
| `--animate-*` | `animate-*` |

### @layer — style organization

```css
@layer base {
  /* HTML element defaults, body, :root */
  body { background-color: var(--color-surface); }
}

@layer components {
  /* Multi-property reusable classes NOT coverable by a single utility */
  .glass-card {
    background: rgba(57, 56, 65, 0.4);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}

@layer utilities {
  /* Single-purpose helpers when @theme isn't enough */
  .no-scrollbar { scrollbar-width: none; }
}
```

**Rule:** Only put in `@layer components` what Tailwind utilities genuinely can't express. Spacing, padding, colors → always Tailwind classes.

### @custom-variant — extend variant system

```css
/* Activate dark mode with .dark class instead of media query */
@custom-variant dark (&:where(.dark, .dark *));

/* Custom state variant */
@custom-variant hocus (&:hover, &:focus);
```

Usage:
```html
<div class="bg-surface dark:bg-surface-dim hocus:opacity-80">
```

## Quick Reference

### Responsive Breakpoints (mobile-first)

| Prefix | Min Width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

Always write base style for mobile first, add breakpoint prefixes for larger screens.

### Common Patterns

```html
<!-- Centered layout -->
<div class="flex items-center justify-center min-h-screen">
  Content
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Items -->
</div>

<!-- Card with design tokens -->
<div class="bg-surface-container rounded-xl p-6 border border-outline-variant">
  <h3 class="text-headline-sm text-on-surface">Title</h3>
  <p class="text-body-md text-on-surface-variant">Description</p>
</div>
```

### style attribute — when to use vs Tailwind class

| Use Tailwind class | Use style attribute |
|---|---|
| Static spacing, colors, typography | Dynamic values computed in JS |
| Token-based values | `font-variation-settings` |
| Anything in the design system | CSS variables calculated at runtime |
| | `animation-delay` per element |

```astro
<!-- ✅ Static → Tailwind class -->
<div class="text-primary bg-surface-container p-6">

<!-- ✅ Dynamic → style attribute -->
<div style={`animation-delay: ${index * 100}ms`}>

<!-- ✅ font-variation-settings → always style -->
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">
```

**Never**: `style="font-size: 18px"` when `text-lg` covers it. **Never**: hardcoded hex/rgba in style when a token exists.

## Instructions

1. **Mobile-first**: Write base styles for mobile, add `md:` / `lg:` for larger screens
2. **Use tokens**: Use only classes generated from `@theme` tokens — no arbitrary hex colors
3. **Spacing via Tailwind**: All `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` — numeric Tailwind classes only
4. **global.css boundary**: Only `@theme`, `@layer base`, and visual component classes (`.glass-card`, `.neon-glow-*`) go in global.css — no spacing utilities
5. **Extract components**: Repeated multi-property visual patterns → `@layer components`. Repeated markup → Astro/React component
6. **Verify**: Test at mobile, tablet, desktop. Run `npm run build` — v4 will warn on invalid classes

## Troubleshooting

### Classes not applying (v4)

- No `content: []` needed — v4 scans all template files automatically
- Check `@import "tailwindcss"` is at top of CSS entry file
- Verify `@tailwindcss/vite` plugin is registered in vite config
- Dynamic class names (string concatenation) won't be detected — use full class names or `safelist`

### Token class not working

```css
/* ❌ Wrong — v4 doesn't auto-generate spacing utilities from named tokens */
@theme { --spacing-margin: 2rem; }
/* px-margin won't work */

/* ✅ Use numeric Tailwind class instead */
class="px-8"

/* ✅ Or reference as CSS var in style attr for dynamic use */
style="padding-left: var(--spacing-margin)"
```

### Responsive styles not working

- Mobile-first: `md:flex` means "flex at md and above" — no base class needed unless overriding
- Check you're not accidentally overriding with a non-responsive class after a responsive one

### v3 → v4 migration gotchas

| v3 | v4 |
|---|---|
| `tailwind.config.js` | `@theme {}` in CSS |
| `content: [...]` | Auto-detection |
| `darkMode: 'class'` | `@custom-variant dark (...)` |
| `theme.extend.colors` | `--color-*` in `@theme` |
| Plugin API | `@utility`, `@layer components` |
| `bg-opacity-50` | `bg-blue-500/50` |

## Best Practices

1. **Tokens only**: Never use hex/rgba colors inline — add to `@theme` first
2. **No arbitrary spacing**: `p-[13px]` is a smell — use the nearest scale value or add a token
3. **Compose, don't abstract**: Three inline classes beats a premature `@apply` component
4. **`@apply` sparingly**: Only for truly reusable visual components with 5+ properties. Never for spacing/layout
5. **Semantic HTML first**: Correct element + Tailwind classes beats a `div` with `role="heading"`
6. **Focus styles**: Always include `focus-visible:ring-*` on interactive elements

## References

- **[references/configuration.md](references/configuration.md)** — `@theme`, vite integration, custom utilities
- **[references/layout-patterns.md](references/layout-patterns.md)** — Flexbox, grid, spacing, typography
- **[references/component-patterns.md](references/component-patterns.md)** — Cards, navigation, forms, modals
- **[references/responsive-design.md](references/responsive-design.md)** — Responsive patterns, container queries
- **[references/animations.md](references/animations.md)** — Transitions, transforms, `@keyframes`
- **[references/performance.md](references/performance.md)** — Bundle optimization, production builds
- **[references/accessibility.md](references/accessibility.md)** — Focus management, color contrast, ARIA
- **[references/reference.md](references/reference.md)** — Additional reference materials

## External Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com)
