# Luca Polare — Gelateria Website

A modern, elegant redesign of [lucapolare.com](https://www.lucapolare.com) — a premium
artisan gelato brand from Tbilisi, Georgia. Built as a fast, dependency-free static site.

## Structure

```
index.html        All sections, semantic markup, data-i18n hooks
css/style.css     Design system + layout (mobile-first, custom properties)
js/main.js        Header state, mobile nav, scroll reveals, parallax,
                  flavour filters (FLIP), language switch — no libs
js/i18n.js        EN / KA translation dictionaries (keys match data-i18n)
assets/img/       Optimized photography (Unsplash, hotlink-free, served locally)
```

## Sections

1. **Hero** — full-viewport visual with parallax, headline and dual CTA
2. **Ethos strip** — four brand pillars (fresh milk, real ingredients, Italian craft, churned daily)
3. **Flavours** — interactive menu: eight signatures filterable by category
   (All / Classic / Fruit / Chocolate / Special) with FLIP-animated reflow and soft hover effects
4. **Our Story** — layered image collage with scroll drift + brand narrative and stats
5. **Word of Mouth** — review cards highlighting *delicious, natural, cozy, wide variety*
6. **Visit** — parallax CTA with three café locations and directions links
7. **Footer** — navigation, contact, social

## Design system

- **Palette:** cream `#FBF7EF`, paper `#F4EBDD`, sand `#E7D9C3`, caramel `#A8784E`, espresso `#362B20`
- **Type:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display serif) + [Inter](https://fonts.google.com/specimen/Inter) (body)
- **Motion:** IntersectionObserver reveals, rAF-throttled parallax, FLIP grid transitions, `prefers-reduced-motion` respected throughout

## Languages

The site is bilingual — English and Georgian (ქართული). The EN / ქარ toggle in the
header swaps every visible string in place (no reload), persists the choice in
`localStorage`, and updates `<html lang>`, the page title and meta description.
Translations live in `js/i18n.js` as one flat dictionary per language, keyed by the
`data-i18n` attributes in the markup. Georgian text renders in Noto Serif/Sans
Georgian, loaded via the same Google Fonts request (unicode-range subsetting keeps
it free until used).

## Performance

- No frameworks, no build step — open `index.html` or serve statically
- Hero image preloaded; everything below the fold lazy-loaded with explicit dimensions
- Single font request, single stylesheet, deferred script

## Run locally

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Photography via [Unsplash](https://unsplash.com) (Unsplash License).
