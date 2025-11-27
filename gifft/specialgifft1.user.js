// ==UserScript==
// @name         Special gifft completer 1
// @namespace    https://ellinet13.com
// @version      1.0.0
// @description  Completes: super box, surprise egg
// @author       ElliNet13
// @match        https://gifft.me/challenge/open/super-box
// @match        https://gifft.me/challenge/open/surprise-egg/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gifft.me
// @grant        none
// @run-at       document-idle
// @updateURL    https://ellinet13.github.io/userscripts/gifft/specialgifft1.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/specialgifft1.user.js
// ==/UserScript==

(function() {
    const canvas = document.querySelector("#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div > canvas");

    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function triggerMouseEvent(type, target, x, y) {
            const event = new MouseEvent(type, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                button: 0 // left mouse button
            });
            target.dispatchEvent(event);
        }

        // Full sequence
        triggerMouseEvent('mousemove', canvas, centerX, centerY);
        triggerMouseEvent('mousedown', canvas, centerX, centerY);
        triggerMouseEvent('mouseup', canvas, centerX, centerY);
        triggerMouseEvent('click', canvas, centerX, centerY);
    } else {
        console.log("Canvas not found!");
}
})