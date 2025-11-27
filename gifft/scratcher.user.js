// ==UserScript==
// @name         Auto scratcher
// @namespace    https://ellinet13.com
// @version      v1.0.0
// @description  Show images of Scratcher gifts
// @author       ElliNet13
// @match        https://gifft.me/o/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gifft.me
// @grant        none
// @run-at       document-idle
// @updateURL    https://ellinet13.github.io/userscripts/gifft/scratcher.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/scratcher.user.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = "#__nuxt > div > div.text-primary.flex.min-h-screen.flex-col > main > div > div > div > div.flex.size-full.items-center.justify-center.overflow-hidden > img";
    const placeholderSrc = "https://gifft.me/images/blurred-text.jpeg";

    function waitForValidImage(selector, callback) {
        const interval = setInterval(() => {
            const img = document.querySelector(selector);
            if (img && img.src && img.src !== placeholderSrc) {
                clearInterval(interval);
                callback(img.src);
            }
        }, 100); // check every 100ms
    }

    waitForValidImage(selector, (imgurl) => {
        // Clear the whole page
        document.body.innerHTML = '';

        // Set the brown background
        document.body.style.margin = '0';
        document.body.style.height = '100vh';
        document.body.style.backgroundColor = 'brown';
        document.body.style.display = 'flex';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';

        // Create the image
        const img = document.createElement('img');
        img.src = imgurl;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain'; // keeps aspect ratio
        document.body.appendChild(img);
    });
})();
