/**
 * A11yAuditor Engine
 * This class handles the parsing and logic for web accessibility audits.
 */
class A11yAuditor {
    constructor() {
        this.issues = [];
    }

    // This is the "Brain" function that runs the checks
    runAudit(htmlString) {
        this.issues = []; // Reset issues for a new scan

        // 1. Convert string to a temporary DOM structure
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // 2. Call individual audit methods
        this.checkImages(doc);
        this.checkButtons(doc);
        this.checkInputs(doc);
        this.checkHeadings(doc);

        return this.issues;
    }

    // AUDIT: Check if images have descriptive 'alt' text
    checkImages(doc) {
        const images = doc.querySelectorAll('img');
        images.forEach((img, i) => {
            if (!img.hasAttribute('alt')) {
                console.log("I found a bad image!");
                this.addIssue('Critical', 'Image', `Image #${i + 1} is missing an "alt" attribute.`);
            } else if (img.alt.trim() === "") {
                this.addIssue('Warning', 'Image', `Image #${i + 1} has an empty "alt" attribute (Decorative).`);
            }
        });
    }

    // AUDIT: Check if buttons have text labels
    checkButtons(doc) {
        const buttons = doc.querySelectorAll('button');
        buttons.forEach((btn, i) => {
            if (btn.innerText.trim() === "" && !btn.hasAttribute('aria-label')) {
                this.addIssue('Critical', 'Button', `Button #${i + 1} has no text or aria-label.`);
            }
        });
    }

    // AUDIT: Check if inputs have associated labels
    checkInputs(doc) {
        const inputs = doc.querySelectorAll('input:not([type="hidden"])');
        inputs.forEach((input, i) => {
            const id = input.id;
            const label = id ? doc.querySelector(`label[for="${id}"]`) : null;
            if (!label) {
                this.addIssue('Warning', 'Form', `Input #${i + 1} (${input.type}) is missing a linked <label>.`);
            }
        });
    }

    // AUDIT: Check for logical heading hierarchy
    checkHeadings(doc) {
        const hasH1 = doc.querySelector('h1');
        if (!hasH1) {
            this.addIssue('Warning', 'Structure', 'No <h1> tag found. Every page should have one main heading.');
        }
    }

    // Helper function to push issues into the array
    addIssue(type, element, msg) {
        this.issues.push({ type, element, msg });
    }
}

// --- DOM INTERACTION LOGIC ---

const auditor = new A11yAuditor();
const scanBtn = document.getElementById('scanBtn');
const htmlInput = document.getElementById('htmlInput');
const issueList = document.getElementById('issueList');

scanBtn.addEventListener('click', () => {
    const code = htmlInput.value;
    
    if (!code.trim()) {
        alert("Please paste some HTML code first!");
        return;
    }

    // Run the audit
    const results = auditor.runAudit(code);
    
    // Render the results to the screen
    displayResults(results);
});

function displayResults(results) {
    issueList.innerHTML = ""; // Clear old results

    if (results.length === 0) {
        issueList.innerHTML = `<div class="success">✨ Perfect! No accessibility issues found.</div>`;
        return;
    }

    results.forEach(err => {
        const card = document.createElement('div');
        card.className = `issue-card ${err.type.toLowerCase()}`;
        
        // This is the "Smart Suggestion" logic
        let suggestionCode = "";
        if (err.element === "Image") {
            suggestionCode = '<code>&lt;img src="..." alt="Description of image"&gt;</code>';
        } else if (err.element === "Button") {
            suggestionCode = '<code>&lt;button&gt;Click Here&lt;/button&gt;</code>';
        } else if (err.element === "Structure") {
            suggestionCode = '<code>&lt;h1&gt;Your Page Title&lt;/h1&gt;</code>';
        }

        card.innerHTML = `
            <div class="card-header">
                <strong>[${err.type}] ${err.element}</strong>
            </div>
            <p>${err.msg}</p>
            <div class="suggestion-box">
                <span>💡 AI Suggestion:</span>
                <p>Try using this code instead:</p>
                ${suggestionCode}
            </div>
        `;
        issueList.appendChild(card);
    });
}

// 1. Get the new buttons from the HTML
const sampleBtn = document.getElementById('sampleBtn');
const clearBtn = document.getElementById('clearBtn');

// 2. Logic for "Load Sample HTML"
sampleBtn.addEventListener('click', () => {
    const sampleCode = `<h1>Welcome to my Site</h1>
<img src="profile.jpg"> <!-- This will trigger an error -->
<button></button> <!-- This will trigger a warning -->
<p>Hello World</p>`;
    
    htmlInput.value = sampleCode; // This puts the text into the box automatically
});

// 3. Logic for "Clear All"
clearBtn.addEventListener('click', () => {
    htmlInput.value = ""; // Empties the text box
    issueList.innerHTML = ""; // Clears the red/yellow boxes
});

const downloadBtn = document.getElementById('downloadBtn');

downloadBtn.addEventListener('click', () => {
    // 1. Get all the current results as text
    const results = auditor.issues;
    if (results.length === 0) {
        alert("Nothing to download! Run an audit first.");
        return;
    }

    // 2. Format the text for the file
    let reportText = "A11Y AUDIT REPORT\n=================\n\n";
    results.forEach((err, i) => {
        reportText += `${i + 1}. [${err.type}] ${err.element}: ${err.msg}\n`;
    });

    // 3. Create a "Blob" (Binary Large Object) of the text
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // 4. Create a fake link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-report.txt';
    a.click();

    // 5. Cleanup memory
    URL.revokeObjectURL(url);
});