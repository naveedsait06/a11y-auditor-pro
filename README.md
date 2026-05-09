# ♿ A11y Auditor Pro

A professional, client-side web accessibility auditing tool built with Vanilla JavaScript, HTML5, and CSS3.

**[🔴 Click Here to View the Live Project](https://naveedsait06.github.io/a11y-auditor-pro/)**

## 📖 About the Project
As web accessibility becomes a critical legal and ethical requirement, developers need fast ways to check their code. A11y Auditor Pro is a lightweight, purely front-end tool that parses HTML and identifies common WCAG compliance failures instantly.

It acts as a "Virtual DOM Parser," taking raw HTML strings, converting them into DOM structures, and running specific logical checks against them.

## ✨ Key Features
*   **Zero Dependencies:** Built entirely with ES6+ Vanilla JavaScript. No React, no NPM, no heavy libraries.
*   **Virtual Parsing:** Uses `DOMParser()` to safely analyze HTML strings without rendering potentially malicious scripts.
*   **AI-Style Remediation:** Doesn't just find errors; it provides the user with the correct HTML snippet needed to fix the issue.
*   **Exportable Reports:** Generates downloadable `.txt` files of the audit results using the Blob API.

## 🛠️ Technical Implementation
This project was built to demonstrate proficiency in:
*   **DOM Manipulation & Traversal:** Navigating complex node trees to find missing attributes (e.g., `alt` tags, `aria-labels`).
*   **Object-Oriented Programming (OOP):** Structuring the auditing logic within an ES6 Class for scalability.
*   **Modern CSS:** Utilizing CSS Grid/Flexbox, custom properties, and animations for a premium UI.

## 🚀 How to Use
1. Paste any HTML snippet into the text area.
2. Click **Run Audit**.
3. Review the Critical (Red) and Warning (Yellow) flags.
4. Apply the suggested code fixes.
5. Click **Download Report** to save the findings.
