// ==UserScript==
// @name         Bubble wrap gifft completer
// @namespace    https://ellinet13.com
// @version      1.0.0
// @description  Clicks the bubble wrap gifft to complete it by popping all bubbles
// @author       ElliNet13
// @match        https://gifft.me/o/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gifft.me
// @grant        none
// @run-at       document-idle
// @updateURL    https://ellinet13.github.io/userscripts/gifft/loveletter.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/loveletter.user.js
// ==/UserScript==

(function() {
    // Wait until an element exists
    function waitForElement(selector) {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const observer = new MutationObserver(() => {
                const elNow = document.querySelector(selector);
                if (elNow) {
                    resolve(elNow);
                    observer.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    (async () => {
        // Step 1: Click the gift button
        const giftButton = await waitForElement("#gift-wrapped");
        giftButton.click();

        // Step 2: Wait 1 second
        await new Promise(r => setTimeout(r, 1000));

        // Step 3: Click all items in the list
        const listContainer = await waitForElement("#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div:nth-child(2) > ul");
        listContainer.querySelectorAll("*").forEach(el => el.click());

        // Step 4: Wait for the bubble button and click it
        const bubbleButtonSelector = "#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div:nth-child(2) > div.absolute.left-0.top-0.z-10.flex.h-dvh.w-full.items-center.justify-center > div > button";
        const bubbleButton = await waitForElement(bubbleButtonSelector);
        bubbleButton.click();
    })();
})();
