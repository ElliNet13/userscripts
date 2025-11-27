// ==UserScript==
// @name         Auto scratcher
// @namespace    https://ellinet13.com
// @version      v1.0.0
// @description  Completes scratcher giffts by automatically scratching the canvas
// @author       ElliNet13
// @match        https://gifft.me/o/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gifft.me
// @grant        none
// @run-at       document-idle
// @updateURL    https://ellinet13.github.io/userscripts/gifft/scratcher.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/scratcher.user.js
// ==/UserScript==


(function() {

    // The exact canvas you gave
    const CANVAS_SELECTOR =
        "#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div > div.align-center.absolute.z-\\[1\\].flex.size-fit.justify-center > canvas";

    let running = false;   // prevents multiple overlapped runs

    // Restart loop: check every 300ms
    setInterval(() => {
        const canvas = document.querySelector(CANVAS_SELECTOR);

        // If canvas exists & we're not already drawing → start
        if (canvas && !running) {
            running = true;
            requestAnimationFrame(() => fastFill(canvas));
        }

        // If canvas disappeared, reset to restart later
        if (!canvas) running = false;

    }, 300);


    // Faster MouseEvent generator
    function fire(type, canvas, x, y) {
        canvas.dispatchEvent(new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        }));
    }


    function fastFill(canvas) {

        // If canvas vanished mid-draw → restart system handles it
        if (!canvas || !document.body.contains(canvas)) {
            running = false;
            return;
        }

        const rect = canvas.getBoundingClientRect();

        const left  = rect.left  + 1;
        const right = rect.right - 1;

        let y = rect.top + 1;

        // ⚡ TUNE THIS based on brush size
        const rowStep = 14;

        // ⚡ Lines drawn per frame
        const batchSize = 10;

        function batch() {

            // If canvas disappears, abort and allow auto-restart
            if (!document.body.contains(canvas)) {
                running = false;
                return;
            }

            for (let i = 0; i < batchSize; i++) {

                if (y >= rect.bottom - 1) {
                    running = false;  // finished → allow restart later
                    return;
                }

                // Start stroke
                fire("mousedown", canvas, left, y);

                // Teleport instantly across canvas
                fire("mousemove", canvas, right, y);

                // End stroke
                fire("mouseup", canvas, right, y);

                y += rowStep;
            }

            requestAnimationFrame(batch);
        }

        batch();
    }

})();
