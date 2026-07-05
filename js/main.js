/* Luca Polare — interactions
   Header state · mobile nav · scroll reveals · gentle parallax ·
   flavour filters (FLIP) · language switch (EN/KA)
   No dependencies. Everything degrades cleanly without JS.      */

(() => {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header: solid after leaving the hero top ---------- */

  const header = document.querySelector(".site-header");

  const updateHeader = () => {
    header.classList.toggle("is-solid", window.scrollY > 40);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- mobile navigation ---------- */

  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  /* ---------- scroll reveals ---------- */

  const revealables = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealables.forEach((el) => observer.observe(el));
  }

  /* ---------- parallax (hero + visit backdrops, story collage) ---------- */

  if (!prefersReducedMotion) {
    const backdrops = [...document.querySelectorAll("[data-parallax]")];
    const drifters = [...document.querySelectorAll("[data-drift]")];
    let ticking = false;

    const applyParallax = () => {
      ticking = false;
      const viewport = window.innerHeight;

      for (const el of backdrops) {
        const rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) continue;
        const speed = parseFloat(el.dataset.parallax);
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        el.style.transform = `translateY(${(-progress * speed * 100).toFixed(2)}px)`;
      }

      for (const el of drifters) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) continue;
        const drift = parseFloat(el.dataset.drift);
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        el.style.translate = `0 ${(progress * drift).toFixed(2)}px`;
      }
    };

    const requestParallax = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyParallax);
      }
    };

    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax, { passive: true });
    applyParallax();
  }

  /* ---------- flavour filters ----------
     Exit → re-layout → FLIP glide for the cards that stay,
     soft fade-up for the cards that enter. */

  const grid = document.getElementById("flavor-grid");
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  let filterRun = 0;

  const applyFilter = (filter) => {
    const run = ++filterRun;
    const cards = [...grid.children];

    // Cards may still be waiting on their scroll reveal; filtering can move
    // them above the fold, so settle the reveal state before animating.
    cards.forEach((c) => c.classList.add("is-visible"));
    const matches = (card) =>
      filter === "all" || card.dataset.cats.split(" ").includes(filter);

    const exiting = cards.filter((c) => !c.hidden && !matches(c));
    const entering = cards.filter((c) => c.hidden && matches(c));
    const staying = cards.filter((c) => !c.hidden && matches(c));

    const commit = () => {
      if (run !== filterRun) return;

      const firstRects = new Map(
        staying.map((c) => [c, c.getBoundingClientRect()])
      );

      exiting.forEach((c) => {
        c.hidden = true;
        c.classList.remove("is-exiting");
      });
      entering.forEach((c) => {
        c.hidden = false;
        c.classList.add("is-entering");
      });

      if (prefersReducedMotion) {
        entering.forEach((c) => c.classList.remove("is-entering"));
        return;
      }

      // FLIP: glide surviving cards from their old spot to the new one
      staying.forEach((c) => {
        const first = firstRects.get(c);
        const last = c.getBoundingClientRect();
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        if (dx || dy) {
          c.style.transition = "none";
          c.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      });

      void grid.offsetHeight; // flush styles

      requestAnimationFrame(() => {
        staying.forEach((c) => {
          c.style.transition = "";
          c.style.transform = "";
        });
        requestAnimationFrame(() => {
          entering.forEach((c) => c.classList.remove("is-entering"));
        });
      });
    };

    if (exiting.length && !prefersReducedMotion) {
      exiting.forEach((c) => c.classList.add("is-exiting"));
      setTimeout(commit, 240);
    } else {
      commit();
    }
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-active")) return;
      filterButtons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      applyFilter(btn.dataset.filter);
    });
  });

  /* ---------- language switch (EN / KA) ---------- */

  const langButtons = [...document.querySelectorAll(".lang-btn")];
  const translatable = [...document.querySelectorAll("[data-i18n]")];
  const metaDesc = document.querySelector('meta[name="description"]');

  const applyLanguage = (lang) => {
    const dict = I18N[lang] || I18N.en;

    translatable.forEach((el) => {
      const value = dict[el.dataset.i18n];
      if (value !== undefined) el.innerHTML = value;
    });

    document.documentElement.lang = lang;
    document.title = dict["meta.title"];
    if (metaDesc) metaDesc.setAttribute("content", dict["meta.desc"]);

    langButtons.forEach((b) => {
      b.classList.toggle("is-active", b.dataset.lang === lang);
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  };

  const switchLanguage = (lang) => {
    try { localStorage.setItem("lp-lang", lang); } catch (_) {}

    if (prefersReducedMotion) {
      applyLanguage(lang);
      return;
    }

    document.body.classList.add("lang-fading");
    setTimeout(() => {
      applyLanguage(lang);
      document.body.classList.remove("lang-fading");
    }, 200);
  };

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!btn.classList.contains("is-active")) switchLanguage(btn.dataset.lang);
    });
  });

  let savedLang = "en";
  try { savedLang = localStorage.getItem("lp-lang") || "en"; } catch (_) {}
  if (savedLang !== "en") applyLanguage(savedLang);

  /* ---------- footer year ---------- */

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
