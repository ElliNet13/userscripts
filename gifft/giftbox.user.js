// ==UserScript==
// @name         Gift box gifft completer
// @namespace    https://ellinet13.com
// @version      1.0.0
// @description  Clicks the gift box gifft to complete it once the page is ready
// @author       ElliNet13
// @match        https://gifft.me/o/b/*
// @match        https://gifft.me/challenge/open/gift-box
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gifft.me
// @grant        none
// @run-at       document-idle
// @updateURL    https://ellinet13.github.io/userscripts/gifft/giftbox.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/giftbox.user.js
// ==/UserScript==

// =========================
// Autoclicker
// =========================

const CLICK_SELECTOR = "#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div.flex.flex-col.items-center > div.cursor-pointer.focus\\:outline-none";
const CONTINUE_SELECTOR = "#open";
// Added: wait 2s between clicks
const CLICK_INTERVAL = 2000; // milliseconds
let lastClick = Date.now() - CLICK_INTERVAL; // allow immediate first click

(function startAutoClicker() {
  let running = true;

  // Run checks frequently, but only click the main element every CLICK_INTERVAL
  const CHECK_INTERVAL = 250; // ms
  let intervalId = setInterval(() => {
    if (!running) return;

    const cont = document.querySelector(CONTINUE_SELECTOR);
    if (cont) {
      running = false;
      cont.click();
      clearInterval(intervalId);
      console.log("Open button detected and clicked. Auto-clicker stopped.");
      return;
    }

    const now = Date.now();
    const el = document.querySelector(CLICK_SELECTOR);
    if (el && (now - lastClick) >= CLICK_INTERVAL) {
      el.click();
      lastClick = now;
    }
  }, CHECK_INTERVAL);

  console.log("Auto-clicker started).");
})();
