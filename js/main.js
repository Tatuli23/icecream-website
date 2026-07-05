/* Luca Polare — interactions
   Header state · mobile nav · scroll reveals · gentle parallax
   No dependencies. Everything degrades cleanly without JS.     */

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
        el.style.setProperty("--drift", `${(progress * drift).toFixed(2)}px`);
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

  /* ---------- footer year ---------- */

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
