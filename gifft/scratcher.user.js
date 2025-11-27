// ==UserScript==
// @name         Auto scratcher
// @namespace    https://ellinet13.com
// @version      1.1.3
// @description  Completes scratcher giffts by automatically scratching the canvas
// @author       ElliNet13
// @match        https://gifft.me/o/s/*
// @match        https://gifft.me/challenge/open/scratcher
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gifft.me
// @grant        none
// @run-at       document-idle
// @updateURL    https://ellinet13.github.io/userscripts/gifft/scratcher.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/scratcher.user.js
// ==/UserScript==

// =========================
// Mute
// =========================
(function enableAggressiveAutoMute() {
    function muteMedia(el) {
        try { el.muted = true; try { el.volume = 0; } catch(_){} try { if (!el.paused) el.pause(); } catch(_){} } catch(_) {}
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
    HTMLMediaElement.prototype.play = function() { muteMedia(this); return origPlay.apply(this, arguments); };
    const playHandler = ev => muteMedia(ev.target);
    document.addEventListener("play", playHandler, true);
    document.addEventListener("playing", playHandler, true);

    console.log("Aggressive auto-mute enabled.");
})();

// =========================
// Auto scratcher (wait for overlay first)
// =========================
(function() {
    const CANVAS_SELECTOR =
        "#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div > div.align-center.absolute.z-\\[1\\].flex.size-fit.justify-center > canvas";

    const OVERLAY_SELECTOR =
        "#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div > div.pointer-events-none.absolute.z-10.flex.flex-col.items-center.justify-center";

    let running = false;

    function fire(type, canvas, x, y) {
        canvas.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    }

    function fastFill(canvas) {
        if (!canvas || !document.body.contains(canvas)) { running = false; return; }
        const rect = canvas.getBoundingClientRect();
        const left = rect.left + 1, right = rect.right - 1;
        let y = rect.top + 1;
        const rowStep = 14, batchSize = 10;

        function batch() {
            if (!document.body.contains(canvas)) { running = false; return; }
            for (let i = 0; i < batchSize; i++) {
                if (y >= rect.bottom - 1) { running = false; return; }
                fire("mousedown", canvas, left, y);
                fire("mousemove", canvas, right, y);
                fire("mouseup", canvas, right, y);
                y += rowStep;
            }
            requestAnimationFrame(batch);
        }

        batch();
    }

    const observer = new MutationObserver(() => {
        const overlay = document.querySelector(OVERLAY_SELECTOR);
        if (!overlay) return;

        // Start the canvas scratcher once overlay exists
        const interval = setInterval(() => {
            const canvas = document.querySelector(CANVAS_SELECTOR);
            if (canvas && !running) { running = true; requestAnimationFrame(() => fastFill(canvas)); }
            if (!canvas) running = false;
        }, 300);

        // Stop observing once we started
        observer.disconnect();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
