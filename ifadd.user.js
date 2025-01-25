// ==UserScript==
// @name            Infinite Craft Stuff
// @namespace       ifadd
// @match           https://neal.fun/infinite-craft/*
// @version         1.4
// @author          ElliNet13
// @description     A script that adds stuff features to Infinite Craft.
// @downloadURL     https://ellinet13.github.io/userscripts/ifadd.user.js
// @updateURL       https://ellinet13.github.io/userscripts/ifadd.user.js
// @homepageURL		https://ellinet13.github.io/userscripts/
// ==/UserScript==

// Well its not a fix for the problen but at least you know it happened
window.addEventListener('unhandledrejection', function(event) {
    if (event.reason == "TypeError: element.text.toLowerCase is not a function") {
        alert("That combo will not work!")
    }
});

// Make an invisible file input
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.position = 'absolute';
fileInput.style.display = 'none'; // Hides the input and removes it from the layout
fileInput.style.pointerEvents = 'none'; // Ensures no interaction with it
fileInput.accept = ".json";

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

const backups = new Backups();

// Event listener to handle the file input change
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0]; // Get the first selected file
  
  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        // Attempt to parse the file contents as JSON
        const jsonData = JSON.parse(reader.result);
        
        // If successful, store it in localStorage
        localStorage.setItem("infinite-craft-data", JSON.stringify(jsonData));
        console.log('JSON data successfully stored in localStorage.');
        location.reload()
      } catch (error) {
        console.error('Invalid JSON file:', error);
        alert('The file contents are not valid JSON!');
      }
    };

    reader.onerror = () => {
      console.error('Error reading the file');
    };

    // Read the file as text (JSON)
    reader.readAsText(file);
  }
});

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

    const saveFileButton = document.createElement('button');
    saveFileButton.textContent = 'Save backup (File)';
    saveFileButton.style.marginTop = '20px';
    saveFileButton.style.padding = '10px 20px';
    saveFileButton.style.fontSize = '14px';
    saveFileButton.style.backgroundColor = '#00FF00';
    saveFileButton.style.color = 'white';
    saveFileButton.style.border = 'none';
    saveFileButton.style.borderRadius = '8px';
    saveFileButton.style.cursor = 'pointer';
    saveFileButton.addEventListener('click', () => {
        // Get the data from localStorage
        const data = localStorage.getItem('infinite-craft-data');

        // Check if the data exists
        if (data) {
          // Parse the data into a JavaScript object
          const jsonData = JSON.parse(data);
  
          // Convert the object to a JSON string
          const jsonString = JSON.stringify(jsonData, null, 2);
          
          // Create a Blob with the JSON string and specify the MIME type
          const blob = new Blob([jsonString], { type: 'application/json' });
  
          // Create a download link
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'infinite-craft-data.json';
  
          // Trigger the download
          a.click();
  
          // Clean up: revoke the Blob URL and remove the link
          URL.revokeObjectURL(a.href);
          a.remove();
        } else {
          console.error('No data found in localStorage for "infinite-craft-data"');
        }
    });

    const loadFileButton = document.createElement('button');
    loadFileButton.textContent = 'Load backup (File)';
    loadFileButton.style.marginTop = '20px';
    loadFileButton.style.padding = '10px 20px';
    loadFileButton.style.fontSize = '14px';
    loadFileButton.style.backgroundColor = '#808080';
    loadFileButton.style.color = 'white';
    loadFileButton.style.border = 'none';
    loadFileButton.style.borderRadius = '8px';
    loadFileButton.style.cursor = 'pointer';
    loadFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    const saveBackupButton = document.createElement('button');
    saveBackupButton.textContent = 'Save backup';
    saveBackupButton.style.marginTop = '20px';
    saveBackupButton.style.padding = '10px 20px';
    saveBackupButton.style.fontSize = '14px';
    saveBackupButton.style.backgroundColor = '#00FF00';
    saveBackupButton.style.color = 'white';
    saveBackupButton.style.border = 'none';
    saveBackupButton.style.borderRadius = '8px';
    saveBackupButton.style.cursor = 'pointer';
    saveBackupButton.addEventListener('click', () => {
        backups.save(prompt("Enter the name for the backup:"));
    });

    const loadBackupButton = document.createElement('button');
    loadBackupButton.textContent = 'Load backup';
    loadBackupButton.style.marginTop = '20px';
    loadBackupButton.style.padding = '10px 20px';
    loadBackupButton.style.fontSize = '14px';
    loadBackupButton.style.backgroundColor = '#808080';
    loadBackupButton.style.color = 'white';
    loadBackupButton.style.border = 'none';
    loadBackupButton.style.borderRadius = '8px';
    loadBackupButton.style.cursor = 'pointer';
    loadBackupButton.addEventListener('click', () => {
        backups.load(prompt("Enter the backup name to load:"));
    });

    box.appendChild(cheatButton);
    box.appendChild(removeAllButton);
    box.appendChild(saveFileButton);
    box.appendChild(loadFileButton);
    box.appendChild(saveBackupButton);
    box.appendChild(loadBackupButton);
    box.appendChild(closeButton);

    document.body.appendChild(box);
});

document.body.appendChild(button);
