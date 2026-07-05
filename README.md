# Luca Polare — Gelateria Website

A modern, elegant redesign of [lucapolare.com](https://www.lucapolare.com) — a premium
artisan gelato brand from Tbilisi, Georgia. Built as a fast, dependency-free static site.

## Structure

```
index.html        All sections, semantic markup
css/style.css     Design system + layout (mobile-first, custom properties)
js/main.js        Header state, mobile nav, scroll reveals, parallax (~120 lines, no libs)
assets/img/       Optimized photography (Unsplash, hotlink-free, served locally)
```

## Sections

1. **Hero** — full-viewport visual with parallax, headline and dual CTA
2. **Ethos strip** — four brand pillars (fresh milk, real ingredients, Italian craft, churned daily)
3. **Flavours** — six signature flavours in a responsive card grid with soft hover effects
4. **Our Story** — layered image collage with scroll drift + brand narrative and stats
5. **Word of Mouth** — review cards highlighting *delicious, natural, cozy, wide variety*
6. **Visit** — parallax CTA with three café locations and directions links
7. **Footer** — navigation, contact, social

## Design system

- **Palette:** cream `#FBF7EF`, paper `#F4EBDD`, sand `#E7D9C3`, caramel `#A8784E`, espresso `#362B20`
- **Type:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display serif) + [Inter](https://fonts.google.com/specimen/Inter) (body)
- **Motion:** IntersectionObserver reveals, rAF-throttled parallax, `prefers-reduced-motion` respected throughout

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
