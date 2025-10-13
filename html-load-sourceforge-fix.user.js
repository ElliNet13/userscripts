// ==UserScript==
// @name         Sourceforge html-load.com fix
// @namespace    ellinet13-html-load-sourceforge-fix
// @version      1.0
// @description  Silences html-load.com (and similar) failure alerts and prevents styles from being removed
// @match        *://sourceforge.net/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1) Override alert for html-load style failure messages
    const origAlert = window.alert;
    window.alert = function(message) {
        if (typeof message === 'string' && message.includes("Failed to load website properly") && message.includes("html-load")) {
            // Do nothing for these alerts
            return;
        }
        return origAlert.apply(this, arguments);
    };

    // 2) Prevent removal or disabling of <link rel="stylesheet"> and <style>
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            // Re-add removed nodes
            if (m.removedNodes) {
                m.removedNodes.forEach(node => {
                    if (node.tagName && ((node.tagName.toLowerCase() === 'link' && node.rel === 'stylesheet') || node.tagName.toLowerCase() === 'style')) {
                        if (m.target) {
                            m.target.appendChild(node); // reinsert where it was removed
                        } else if (document.head) {
                            document.head.appendChild(node);
                        }
                    }
                });
            }

            // Re-enable disabled styles
            if (m.type === 'attributes' && m.target) {
                const t = m.target;
                if (t.tagName && t.tagName.toLowerCase() === 'link' && t.rel === 'stylesheet') {
                    if (t.disabled) t.disabled = false;
                }
            }
        }
    });

    observer.observe(document.head || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled']
    });

})();
