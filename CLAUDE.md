# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal/portfolio website for Caio ("Caio · MSI"), deployed to **GitHub Pages** at the custom domain `caiomsi.com` (see `CNAME`). It is a static site with **no build step, no package manager, and no test suite** — three hand-authored files plus image assets. Edits to the files on the default branch go live on the site directly.

## Running / previewing

There is no build or dev server defined. To preview locally, open `index.html` directly in a browser, or serve the folder statically:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Deployment is automatic via GitHub Pages on push to the default branch (**`main`** in this repo, not `master`). Two GitHub Actions run alongside it: `validate.yml` (lychee link/anchor check) and `compress-images.yml` (auto-recompresses committed photos). Both trigger on `main` — keep those triggers matching the real branch name if it ever changes.

## Architecture

Three files, each with a single responsibility, coupled by shared CSS class / element-id names:

- **`index.html`** — all content and page structure. One `<nav>` plus seven `<section>` elements with stable ids: `hero`, `about`, `gallery`, `cursus`, `projects`, `skills`, `connect`. Nav links and scroll-spy target these ids, so renaming a section id means updating the matching `<a href="#...">` in the nav too. **`#gallery` is currently `hidden`** and its nav link commented out — see "Gallery" below.
- **`style.css`** — all styling. The top `:root` block defines **design tokens** (colors like `--gold`, fonts, `--max-width`, `--transition`). Change the look globally by editing these variables rather than hardcoding values elsewhere. The Roman/classical aesthetic (Cinzel + Cormorant Garamond fonts, gold-on-near-black palette) flows from these tokens.
- **`script.js`** — all interactivity, organized as independent comment-delimited blocks (navbar scroll state, mobile nav toggle, smooth scroll, scroll progress bar + hero parallax, scroll-spy, fade-in / reveal / stat animations via `IntersectionObserver`, 3D card tilt, gold particle canvas, contact form). The carousel block was removed with the old gallery — the gallery is pure CSS now.

### Key coupling to respect

Behavior in `script.js` is wired to specific class names and ids in `index.html` (and styled in `style.css`). When adding or renaming elements, keep the trio in sync:
- Scroll animations attach to selectors like `.project-card`, `.skill-block`, `.stat`, `.section-intro`, `.reveal` — adding a new card/section of those types makes it animate automatically; using different class names means it won't.
- The carousel relies on `.carousel-slide` / `.carousel-dot` pairs and `.carousel-btn--prev/--next`.
- Scroll-spy maps every `section[id]` to `.nav-links a[href="#id"]`.

### The hero has no photograph

`#hero` deliberately contains **no image**. Its backdrop is drawn entirely in CSS
by `.hero-architecture` — a colonnade of fluted columns (`.hero-colonnade`, layered
`repeating-linear-gradient`s masked away from the centre so the name stays legible),
an overhead shaft of light (`.hero-lightshaft`), and a floor line (`.hero-horizon`).
`#hero::before` adds the warm pool and deep corners; `#hero::after` adds fine
horizontal courses. The parallax in `script.js` targets `.hero-architecture`.

It previously used a casual photo of Caio as a darkened background; that was
removed for a more professional look. **Don't reintroduce a photographic hero
background.** If the hero needs retuning, adjust the CSS layers above.

### Gallery

The gallery is a row of uniform plates (`.plate-row` / `.plate`), each cropped to
the same 3:4 frame via `object-fit: cover`, so mixed portrait and landscape
originals sit side by side without awkward cropping. No JavaScript.

It is **awaiting new photography**: the section carries `hidden`, its nav `<li>` is
commented out, and each plate shows a numbered `.plate-empty` placeholder. The
comment block above the section in `index.html` lists the three steps to turn it on
(add images, swap `.plate-empty` for `<img>`, remove `hidden` + uncomment the nav
link). `[hidden] { display: none !important; }` in the stylesheet ensures a drafted
section really stays out of the page.

`assets/img/` still holds `caio-beach`, `caio-capitol`, `caio-dc`, and `caio-family`
from the old carousel. They are **unreferenced** — kept only in case Caio reuses
them. Only `caio-profile.jpg` is live (the About portrait and the OG/Twitter image).

### Section numbering

Sections carry Roman numerals in two places that **must stay in sync**: the visible
`<span class="section-num">` chip and the `data-numeral` attribute on the parent
`.section-header`, which CSS renders as the large ghosted watermark behind the
heading (`content: attr(data-numeral)`). Current order is About I, Cursus II,
Works III, Virtues IV, Connect V — inserting a section means renumbering both
places for every section after it.

### The Cursus section

`#cursus` is the résumé section — work history, education, and credentials, newest
first, plus a `Linguae` strip for languages. Each `.cursus-entry` is a two-column
grid (date/place, then role/org/description). Above 700px the list renders as a
*milliarium* — a vertical gold rule with a rotated-square milestone marker per
entry (`.cursus-entry::after`); below 700px it collapses to a stacked list and the
column is dropped. Content here mirrors Caio's actual résumé; **no phone numbers,
personal email addresses, or references belong on the page** — contact goes through
the form only.

### Contact form

The form in the `connect` section posts to **MSI Forms**, our own backend at `https://forms.caiomsi.com/api/submit` (repo: `caiomsi/MSI-Forms`, a Vercel project). `script.js` intercepts submit, posts JSON via `fetch`, and toggles an inline `#contact-success` message instead of redirecting. The visually-hidden `company` input is a spam honeypot (styled by `.hp-field`) — keep it. To read submissions, see the MSI-Forms README (lead inbox at `/api/submissions?key=…`).

## Conventions

- Vanilla HTML/CSS/JS only — no frameworks, bundlers, or dependencies. Keep it that way unless asked.
- The files contain extensive human-facing comments explaining what to edit (name, motto, colors, nav links). Preserve that comment style when editing.
- Images live in `assets/img/`; the favicon is `assets/favicon.svg`.
- The bottom of `style.css` holds a **design refinement pass** under the "carved in
  stone" concept: a fixed SVG-noise stone grain plus vignette on `body::before` /
  `body::after`, ghosted section numerals, gradient-clipped "incised" headings, gold
  selection/scrollbar colors, `:focus-visible` outlines, and a
  `prefers-reduced-motion` block that forces `.reveal` / `.fade-in` content visible.
  Those overlays sit at `z-index: 9997/9998` — keep new fixed UI below that or it
  will render under the grain.
