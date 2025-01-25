// ==UserScript==
// @name         Auto-click "Continue with adblocker" on Aternos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically clicks "Continue with adblocker anyway" on Aternos
// @author       ElliNet13
// @match        *://aternos.org/*
// @grant        none
// @homepageURL		https://ellinet13.github.io/userscripts/
// ==/UserScript==

(function() {
    'use strict';

    const clickWhenAvailable = () => {
        // Attempt to find and click the element
        const element = Array.from(document.querySelectorAll("*"))
            .find(el => el.textContent.trim() === "Continue with adblocker anyway");
        
        if (element) {
            element.click();  // Click the element if it exists
            clearInterval(interval);  // Stop checking once clicked
            console.log("Element clicked successfully!");
        }
    };

    // Set an interval to retry every 500 milliseconds
    const interval = setInterval(clickWhenAvailable, 500);
})();