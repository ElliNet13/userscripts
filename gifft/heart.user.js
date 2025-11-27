// ==UserScript==
// @name         Heart gifft autoclicker
// @namespace    https://ellinet13.com
// @version      1.0.0
// @description  Autocomplete heart giffts by autoclicking the heart
// @author       ElliNet13
// @match        https://gifft.me/o/hm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gifft.me
// @grant        none
// @updateURL    https://ellinet13.github.io/userscripts/gifft/heart.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/heart.user.js
// ==/UserScript==

// =========================
// Status
// =========================

(function makeOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "giftStatusOverlay";
    overlay.textContent = "Heart gifft – autocompleting";
    Object.assign(overlay.style, {
        position: "fixed",
        right: "10px",
        bottom: "10px",
        color: "gray",
        fontSize: "14px",
        fontFamily: "sans-serif",
        opacity: "0.7",
        pointerEvents: "none",
        zIndex: 999999999
    });
    document.body.appendChild(overlay);
})();


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

const CLICK_SELECTOR = "#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div > div.flex.max-w-smd.flex-col.items-center.justify-center > div.relative.cursor-pointer.focus\\:outline-none";
const CONTINUE_SELECTOR = "#open";

(function startAutoClicker() {
  let running = true;

  function loop() {
    if (!running) return;

    const cont = document.querySelector(CONTINUE_SELECTOR);
    if (cont) {
      running = false;
      cont.click();

      // Update overlay text to completed
      const overlay = document.getElementById("giftStatusOverlay");
      if (overlay) overlay.textContent = "Heart gifft – autocompleted";

      console.log("Open button detected and clicked. Auto-clicker stopped.");
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
