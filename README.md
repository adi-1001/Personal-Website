# Aditya Anshu - Developer Portfolio

A personal portfolio built with HTML, Tailwind CSS, and Vanilla JavaScript. Features smooth scroll interactions, an interactive particle background, a custom cursor, and a contact form that writes directly to Google Sheets using Google Apps Script.

## What's Inside

- **Scroll Effects**: Top scroll progress bar and viewport reveal animations.
- **Interactive UI**: Reactive particle canvas, custom cursor, and hover spotlights on principle cards.
- **Google Sheets Contact Form**: Contact inquiries are sent straight to Google Sheets via Google Apps Script without needing any external server or paid API.

## Project Structure

```text
.
├── css/
│   └── style.css            # Custom animations, progress bar & cursor styles
├── js/
│   ├── main.js              # Canvas background, cursor & scroll animations
│   └── contact.js           # Form handling & Google Sheets submission
├── apps-script/
│   └── Code.gs              # Google Apps Script for Google Sheets
├── favicon.svg              # Site icon
├── index.html               # Main portfolio page
├── vercel.json              # Static deployment configuration
└── README.md
```

## Running Locally

Open `index.html` directly in your browser, or start a local server:

```bash
# Python
python -m http.server 3000

# Node
npx serve .
```

## Deployment

This site is completely static and ready to deploy on **Vercel**, **GitHub Pages**, or **Netlify**.
