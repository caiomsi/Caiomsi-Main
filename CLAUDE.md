# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal/portfolio website for Caio ("Caio · MSI"), deployed to **GitHub Pages** at the custom domain `caiomsi.com` (see `CNAME`). It is a static site with **no build step, no package manager, and no test suite** — three hand-authored files plus image assets. Edits to the files on the default branch go live on the site directly.

## Running / previewing

There is no build or dev server defined. To preview locally, open `index.html` directly in a browser, or serve the folder statically:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Deployment is automatic via GitHub Pages on push to the default branch — there is no CI or deploy script in the repo.

## Architecture

Three files, each with a single responsibility, coupled by shared CSS class / element-id names:

- **`index.html`** — all content and page structure. One `<nav>` plus six `<section>` elements with stable ids: `hero`, `about`, `gallery`, `projects`, `skills`, `connect`. Nav links and scroll-spy target these ids, so renaming a section id means updating the matching `<a href="#...">` in the nav too.
- **`style.css`** — all styling. The top `:root` block defines **design tokens** (colors like `--gold`, fonts, `--max-width`, `--transition`). Change the look globally by editing these variables rather than hardcoding values elsewhere. The Roman/classical aesthetic (Cinzel + Cormorant Garamond fonts, gold-on-near-black palette) flows from these tokens.
- **`script.js`** — all interactivity, organized as independent comment-delimited blocks (navbar scroll state, mobile nav toggle, smooth scroll, scroll progress bar + hero parallax, carousel with swipe, scroll-spy, fade-in / reveal / stat animations via `IntersectionObserver`, 3D card tilt, gold particle canvas, contact form).

### Key coupling to respect

Behavior in `script.js` is wired to specific class names and ids in `index.html` (and styled in `style.css`). When adding or renaming elements, keep the trio in sync:
- Scroll animations attach to selectors like `.project-card`, `.skill-block`, `.stat`, `.section-intro`, `.reveal` — adding a new card/section of those types makes it animate automatically; using different class names means it won't.
- The carousel relies on `.carousel-slide` / `.carousel-dot` pairs and `.carousel-btn--prev/--next`.
- Scroll-spy maps every `section[id]` to `.nav-links a[href="#id"]`.

### Contact form

The form in the `connect` section posts to **MSI Forms**, our own backend at `https://forms.caiomsi.com/api/submit` (repo: `caiomsi/MSI-Forms`, a Vercel project). `script.js` intercepts submit, posts JSON via `fetch`, and toggles an inline `#contact-success` message instead of redirecting. The visually-hidden `company` input is a spam honeypot (styled by `.hp-field`) — keep it. To read submissions, see the MSI-Forms README (lead inbox at `/api/submissions?key=…`).

## Conventions

- Vanilla HTML/CSS/JS only — no frameworks, bundlers, or dependencies. Keep it that way unless asked.
- The files contain extensive human-facing comments explaining what to edit (name, motto, colors, nav links). Preserve that comment style when editing.
- Images live in `assets/img/`; the favicon is `assets/favicon.svg`.
