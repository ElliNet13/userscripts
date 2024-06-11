// ==UserScript==
// @name         Slap Page
// @namespace    https://ellinet13.github.io/
// @version      2024-06-11
// @description  SLAP EM using CTRL+Q
// @author       ElliNet13
// @match        http*://*/*
// @icon         https://ellinet13.github.io/ElliNet13.jpeg
// @grant        none
// @updateURL    https://ellinet13.github.io/userscripts/slap.user.js
// ==/UserScript==

(function() {
    function slap() {
        // Alert before making changes
        alert("AAAAAAAAAAAAAAAAA WHY DID YOU SLAP ME?!!?!?!!?!?!?!?!");

        // Replace text content with "AAAAAAAAAAA"
        function replaceTextWithA(element) {
            if (element.nodeType === Node.TEXT_NODE) {
                element.textContent = 'AAAAAAAAAAA';
            } else if (element.nodeType === Node.ELEMENT_NODE) {
                if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                    element.remove();
                } else if (element.tagName === 'IMG' || element.tagName === 'svg') {
                    element.remove();
                } else {
                    for (const childNode of element.childNodes) {
                        replaceTextWithA(childNode); // Recursive call for child nodes
                    }
                }
            }
        }

        // Observer to monitor changes in the DOM
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        replaceTextWithA(node);
                    }
                }
            }
        });

        // Start observing changes in the entire document
        observer.observe(document.body, { childList: true, subtree: true });

        // Call the function initially to replace existing content
        replaceTextWithA(document.body);

        // Change background color without freezing
        document.body.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    }

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'q') {
            event.preventDefault(); // Prevent the default action if any
            slap();
        }
    });
})();
