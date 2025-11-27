// ==UserScript==
// @name         Love Letter gifft completer
// @namespace    https://ellinet13.com
// @version      v1.0.1
// @description  Clicks the love letter gifft to complete it once the page is ready
// @author       ElliNet13
// @match        https://gifft.me/o/l/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gifft.me
// @grant        none
// @run-at       document-idle
// @updateURL    https://ellinet13.github.io/userscripts/gifft/loveletter.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/loveletter.user.js
// ==/UserScript==

(function() {
    // Wait until a specific element exists
    const checkH1 = setInterval(() => {
        const h1 = document.querySelector("#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > h1");
        if (h1) {
            clearInterval(checkH1);

            // Then click the gifft element once
            const gifft = document.querySelector("#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div > div");
            if (gifft) {
                gifft.click();
                console.log("Love letter gifft clicked!");
            }
        }
    }, 100);
})();
