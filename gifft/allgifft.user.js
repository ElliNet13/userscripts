// ==UserScript==
// @name         Gifft ALL Userscript Loader
// @namespace    https://ellinet13.com
// @version      1.0.0
// @author       ElliNet13
// @description  Loads gifft-related userscripts from the GitHub repository based on the current page URL.
// @match        https://gifft.me/*
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @run-at       document-idle
// @updateURL    https://ellinet13.github.io/userscripts/gifft/allgifft.user.js
// @downloadURL  https://ellinet13.github.io/userscripts/gifft/allgifft.user.js
// ==/UserScript==

(function() {
    'use strict';

    const GITHUB_API_URL = 'https://api.github.com/repos/ElliNet13/userscripts/contents/gifft';

    // --- Parse metadata ---
    function parseMetadata(scriptText) {
        const metaMatch = scriptText.match(/\/\/ ==UserScript==([\s\S]*?)\/\/ ==\/UserScript==/);
        if (!metaMatch) return null;

        const lines = metaMatch[1].split("\n").map(line => line.replace(/^\/\/\s*/, ''));
        const meta = {};
        lines.forEach(line => {
            const m = line.match(/^@(\S+)\s+(.*)/);
            if (!m) return;
            const key = m[1].toLowerCase();
            const value = m[2];
            if (!meta[key]) meta[key] = [];
            meta[key].push(value);
        });
        return meta;
    }

    function matchPatternToRegex(pattern) {
        let regex = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = regex.replace(/\\\*/g, '.*');
        return new RegExp('^' + regex + '$');
    }

    function isScriptActiveHere(scriptText) {
        const meta = parseMetadata(scriptText);
        if (!meta) return false;

        const url = window.location.href;

        if (meta.exclude) {
            for (const pattern of meta.exclude) {
                const regex = matchPatternToRegex(pattern);
                if (regex.test(url)) return false;
            }
        }

        if (meta.match) {
            for (const pattern of meta.match) {
                const regex = matchPatternToRegex(pattern);
                if (regex.test(url)) return true;
            }
        }

        if (meta.include) {
            for (const pattern of meta.include) {
                if (url.includes(pattern)) return true;
            }
        }

        return false;
    }

    // --- GM_xmlhttpRequest wrapper for Promises ---
    function fetchUrl(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: res => resolve(res.responseText),
                onerror: err => reject(err)
            });
        });
    }

    async function loadGifftScripts() {
        try {
            // Get list of files from GitHub API
            const listJSON = await fetchUrl(GITHUB_API_URL);
            const files = JSON.parse(listJSON);

            for (const file of files) {
                if (!file.name.endsWith('.user.js')) continue;

                // Get the raw JS file
                const rawUrl = file.download_url;
                const scriptText = await fetchUrl(rawUrl);

                if (isScriptActiveHere(scriptText)) {
                    console.log(`✅ Loading ${file.name}`);

                    // Run the script in userscript sandbox
                    try {
                        eval(scriptText);
                    } catch (e) {
                        console.error(`Error executing ${file.name}:`, e);
                    }
                } else {
                    console.log(`❌ Skipping ${file.name}`);
                }
            }

        } catch (err) {
            console.error("Error fetching GitHub scripts:", err);
        }
    }

    loadGifftScripts();

})();
