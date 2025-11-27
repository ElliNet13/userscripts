// ==UserScript==
// @name         Balloon gifft autoclicker
// @namespace    https://ellinet13.com
// @version      1.0.2
// @description  Autocomplete balloon giffts by autoclicking the balloons
// @author       ElliNet13
// @match        https://gifft.me/o/d/*
// @match        https://gifft.me/challenge/open/happy-birthday
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gifft.me
// @grant        none
// @updateURL    https://ellinet13.github.io/userscripts/gifft/balloon.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/balloon.user.js
// ==/UserScript==


// =========================
// Mute
// =========================

(function enableAggressiveAutoMute() {
  function muteMedia(el) {
    try {
      el.muted = true;
      try { el.volume = 0; } catch(_) {}
      try { if (!el.paused) el.pause(); } catch(_) {}
    } catch(_) {}
  }

  document.querySelectorAll("video, audio").forEach(muteMedia);

  const obs = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (!n || n.nodeType !== 1) continue;
        const tag = n.tagName?.toUpperCase();
        if (tag === "VIDEO" || tag === "AUDIO") muteMedia(n);
        n.querySelectorAll?.("video, audio").forEach(muteMedia);
      }
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });

  const origCreate = Document.prototype.createElement;
  Document.prototype.createElement = function(tag, opts) {
    const el = origCreate.call(this, tag, opts);
    if (["VIDEO","AUDIO"].includes(String(tag).toUpperCase())) {
      Promise.resolve().then(() => muteMedia(el));
    }
    return el;
  };

  const origAttach = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(init) {
    const root = origAttach.call(this, init);
    const shadowObs = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (!n || n.nodeType !== 1) continue;
          const tag = n.tagName?.toUpperCase();
          if (tag === "VIDEO" || tag === "AUDIO") muteMedia(n);
          n.querySelectorAll?.("video, audio").forEach(muteMedia);
        }
      }
    });
    shadowObs.observe(root, { childList: true, subtree: true });
    return root;
  };

  const origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function() {
    muteMedia(this);
    return origPlay.apply(this, arguments);
  };

  const playHandler = ev => muteMedia(ev.target);
  document.addEventListener("play", playHandler, true);
  document.addEventListener("playing", playHandler, true);

  console.log("Aggressive auto-mute enabled.");
})();


// =========================
// Autoclicker
// =========================

const CLICK_SELECTOR = "#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div";
const CONTINUE_SELECTOR = "#continue";

(function startAutoClicker() {
  let running = true;

  function loop() {
    if (!running) return;

    const cont = document.querySelector(CONTINUE_SELECTOR);
    if (cont) {
      running = false;
      cont.click();
      
      console.log("Continue button detected and clicked. Auto-clicker stopped.");
      return;
    }

    // Keep clicking main element
    const el = document.querySelector(CLICK_SELECTOR);
    if (el) el.click();

    requestAnimationFrame(loop);
  }

  loop();
  console.log("Auto-clicker started (60 FPS).");
})();
