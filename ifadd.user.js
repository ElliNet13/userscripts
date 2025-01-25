// ==UserScript==
// @name			Infinite Craft Stuff
// @namespace		ifadd
// @match			https://neal.fun/infinite-craft/*
// @version			2.1.4
// @author			ElliNet13
// @description		A script that adds stuff features to Infinite Craft.
// @downloadURL		https://ellinet13.github.io/userscripts/ifadd.user.js
// @updateURL		https://ellinet13.github.io/userscripts/ifadd.user.js
// ==/UserScript==

// Well its not a fix for the problen but at least you know it happened
window.addEventListener('unhandledrejection', function(event) {
    if (event.reason == "TypeError: element.text.toLowerCase is not a function") {
        alert("That combo will not work!")
    }
});

// Funcs
function add(emoji, name, discovered) {
    let items = JSON.parse(localStorage.getItem("infinite-craft-data")) || { elements: [] };
    let newItem = { text: name, emoji: emoji, discovered: discovered === undefined ? false : discovered };
    items.elements.push(newItem);
    localStorage.setItem("infinite-craft-data", JSON.stringify(items));
}

function craft() {
    while (true) {
        add(prompt("What will be the emoji?"), prompt("What will be the name?"), confirm("Did you discover it?"));
        if (confirm("Done adding stuff?")) {
            location.reload();
            break; 
        }
    }
}

function removeAll() {
    let items = JSON.parse(localStorage.getItem("infinite-craft-data"));
    items.elements = [];
    localStorage.setItem("infinite-craft-data", JSON.stringify(items));
}

function getAllText() {
    const uppercaseLetters = [];
    for (let i = 65; i <= 90; i++) {
        uppercaseLetters.push(String.fromCharCode(i));
    }
    const punctuationMarks = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
    const numbers = ["-"];
    for (let i = 0; i <= 9; i++) {
        numbers.push(i.toString());
    }
    return [...uppercaseLetters, ...punctuationMarks, ...numbers];
}

class Backups {
    constructor(prefix = "infinite-craft-backup") {
        this.prefix = prefix + "-";
    }

    save(name) {
        let items = JSON.parse(localStorage.getItem("infinite-craft-data"));
        localStorage.setItem(this.prefix + name, JSON.stringify(items));
    }

    load(name) {
        let items = JSON.parse(localStorage.getItem(this.prefix + name));
        localStorage.setItem("infinite-craft-data", JSON.stringify(items));
        location.reload();
    }
}

backups = new Backups();

// Create a button element
const button = document.createElement('button');
button.textContent = 'Open menu';
button.style.position = 'fixed';
button.style.left = '20px';
button.style.top = '50%';
button.style.transform = 'translateY(-50%)';
button.style.padding = '10px 20px';
button.style.fontSize = '16px';
button.style.backgroundColor = '#007BFF';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '8px';
button.style.cursor = 'pointer';
button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
button.style.zIndex = '1000';

button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#0056b3';
});
button.addEventListener('mouseout', () => {
    button.style.backgroundColor = '#007BFF';
});

button.addEventListener('click', () => {
    if (document.getElementById('popup-box')) return;

    const box = document.createElement('div');
    box.id = 'popup-box';
    box.style.position = 'fixed';
    box.style.top = '50%';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, -50%)';
    box.style.width = '300px';
    box.style.height = '400px';
    box.style.backgroundColor = 'white';
    box.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    box.style.borderRadius = '12px';
    box.style.zIndex = '1001';
    box.style.padding = '20px';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.justifyContent = 'center';
    box.style.alignItems = 'center';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '14px';
    closeButton.style.backgroundColor = '#FF0000';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '8px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(box);
    });

    // Add a cheat button
    const cheatButton = document.createElement('button');
    cheatButton.textContent = 'Cheat';
    cheatButton.style.marginTop = '20px';
    cheatButton.style.padding = '10px 20px';
    cheatButton.style.fontSize = '14px';
    cheatButton.style.backgroundColor = '#FFA500';
    cheatButton.style.color = 'white';
    cheatButton.style.border = 'none';
    cheatButton.style.borderRadius = '8px';
    cheatButton.style.cursor = 'pointer';
    cheatButton.addEventListener('click', () => {
        craft()
    });

    const removeAllButton = document.createElement('button');
    removeAllButton.textContent = 'Remove all items';
    removeAllButton.style.marginTop = '20px';
    removeAllButton.style.padding = '10px 20px';
    removeAllButton.style.fontSize = '14px';
    removeAllButton.style.backgroundColor = '#0000FF';
    removeAllButton.style.color = 'white';
    removeAllButton.style.border = 'none';
    removeAllButton.style.borderRadius = '8px';
    removeAllButton.style.cursor = 'pointer';
    removeAllButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete EVERYTHING?")) {
            removeAll();
            location.reload();
        } else {
            alert("Items not removed");
        }
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save backup';
    saveButton.style.marginTop = '20px';
    saveButton.style.padding = '10px 20px';
    saveButton.style.fontSize = '14px';
    saveButton.style.backgroundColor = '#00FF00';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '8px';
    saveButton.style.cursor = 'pointer';
    saveButton.addEventListener('click', () => {
        backups.save(prompt("Enter the name for the backup:"));
    });

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load backup';
    loadButton.style.marginTop = '20px';
    loadButton.style.padding = '10px 20px';
    loadButton.style.fontSize = '14px';
    loadButton.style.backgroundColor = '#808080';
    loadButton.style.color = 'white';
    loadButton.style.border = 'none';
    loadButton.style.borderRadius = '8px';
    loadButton.style.cursor = 'pointer';
    loadButton.addEventListener('click', () => {
        backups.load(prompt("Enter the backup name to load:"));
    });

    box.appendChild(cheatButton);
    box.appendChild(removeAllButton);
    box.appendChild(saveButton);
    box.appendChild(loadButton);
    box.appendChild(closeButton);

    document.body.appendChild(box);
});

document.body.appendChild(button);
