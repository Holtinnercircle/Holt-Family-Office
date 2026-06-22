/* ========================================
   LANGUAGE — DE / EN
   ----------------------------------------
   Default: DE. Persists via localStorage.
   Translates anything with [data-i18n].
   ======================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "holt.lang";
  const DEFAULT_LANG = "de";
  const SUPPORTED = ["de", "en", "fr"];

  const state = { dict: null, lang: null };

  function getInitialLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    return DEFAULT_LANG;
  }

  async function loadDict(lang) {
    const res = await fetch(`/lang/${lang}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Missing ${lang}.json`);
    return res.json();
  }

  function resolve(dict, key) {
    return key.split(".").reduce((acc, part) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) return acc[part];
      return undefined;
    }, dict);
  }

  function applyTranslations(dict) {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const value = resolve(dict, key);
      if (typeof value === "string") node.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
      const pairs = node.getAttribute("data-i18n-attr").split(",");
      pairs.forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        const value = resolve(dict, key);
        if (typeof value === "string") node.setAttribute(attr, value);
      });
    });
  }

  function updateLangButtons() {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      const code = btn.getAttribute("data-lang-btn");
      btn.setAttribute("aria-pressed", code === state.lang ? "true" : "false");
    });
  }

  function updateDocumentLang() {
    document.documentElement.lang = state.lang;
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    state.lang = lang;
    state.dict = await loadDict(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(state.dict);
    updateLangButtons();
    updateDocumentLang();
  }

  function bindButtons() {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-lang-btn");
        if (code !== state.lang) setLang(code);
      });
    });
  }

  window.Holt = window.Holt || {};
  window.Holt.setLang = setLang;
  window.Holt.getLang = () => state.lang;

  document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    setLang(getInitialLang()).catch((err) => {
      console.error("Language load failed:", err);
    });
  });
})();
