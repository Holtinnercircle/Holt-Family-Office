/* ========================================
   MAIN — interactions
   ----------------------------------------
   - nav: invert over hero, solid when scrolled
   - reveal: subtle fade-in on scroll
   - mobile menu sheet
   ======================================== */

(function () {
  "use strict";

  function initNav() {
    const nav = document.querySelector(".nav");
    if (!nav) return;

    const hero = document.querySelector(".hero");
    const hasHero = !!hero;

    function update() {
      const scrolled = window.scrollY > 12;
      const overHero = hasHero && window.scrollY < hero.offsetHeight - 80;

      nav.classList.toggle("nav--scrolled", scrolled && !overHero);
      nav.classList.toggle("nav--on-hero", overHero);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initMobileMenu() {
    const trigger = document.querySelector("[data-menu-open]");
    const sheet = document.querySelector(".nav__sheet");
    const close = document.querySelector("[data-menu-close]");

    if (!trigger || !sheet) return;

    function open() {
      sheet.setAttribute("data-open", "true");
      document.body.style.overflow = "hidden";
    }

    function shut() {
      sheet.setAttribute("data-open", "false");
      document.body.style.overflow = "";
    }

    trigger.addEventListener("click", open);
    if (close) close.addEventListener("click", shut);
    sheet.querySelectorAll("a").forEach((a) => a.addEventListener("click", shut));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") shut();
    });
  }

  function initReveal() {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    nodes.forEach((n) => io.observe(n));
  }

  function initYear() {
    const els = document.querySelectorAll("[data-year]");
    const year = new Date().getFullYear();
    els.forEach((el) => (el.textContent = year));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initMobileMenu();
    initReveal();
    initYear();
  });
})();
