// ==UserScript==
// @name         Adfoc Skipper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip the malware filled link shortener and go directly to the link without seeing ads
// @author       ElliNet13
// @match        https://adfoc.us/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get the URL parameter "url"
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('url');

    // If the URL parameter is present, redirect the page to that URL
    if (redirectUrl) {
        window.location.href = redirectUrl;
    }
})();
