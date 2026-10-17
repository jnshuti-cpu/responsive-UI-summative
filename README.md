# Student Finance Tracker

## Overview

Student Finance Tracker is a responsive web app that helps students log their spending, set a spending cap, and search or sort their records. It is built with plain HTML, CSS and JavaScript (ES modules), with no frameworks.

| | |
|---|---|
| **Author** | Joshua Indoha Nshuti |
| **Email** | j.nshuti@alustudent.com |
| **GitHub** | [jnshuti-cpu](https://github.com/jnshuti-cpu) |
| **Repository** | https://github.com/jnshuti-cpu/responsive-UI-summative |
| **Live site** | https://jnshuti-cpu.github.io/responsive-UI-summative/ |
| **Demo video** | PASTE-LINK-HERE |

**Theme:** Student Finance Tracker

---

## Setup Guide

**Requirements:** a modern browser and Python 3 (any local web server works).

1. Clone the repository:
   ```bash
   git clone https://github.com/jnshuti-cpu/responsive-UI-summative.git
   cd responsive-UI-summative
   ```
2. Start a local server (ES modules do not work when opening the file directly):
   ```bash
   python3 -m http.server 8000
   ```
3. Open http://localhost:8000 in your browser.

On the first visit, the app loads sample data from `seed.json`. To reset, clear the site's localStorage or import a JSON file from Settings.

### Project structure

```
index.html          Main page (About, Dashboard, Records, Form, Settings)
tests.html          Browser tests
seed.json           12 sample records
styles/main.css     Mobile-first styles
scripts/
  storage.js        localStorage save/load
  state.js          Records and stats logic
  validators.js     Regex validation rules
  search.js         Safe regex compiler and highlighting
  ui.js             DOM rendering and events
```

---

## Features

- **Records:** add, edit and delete expenses (delete asks for confirmation)
- **Dashboard:** total records, total spent, top category and a 7-day trend chart
- **Spending cap:** live message that is polite when you are under the cap and assertive when you go over
- **Sorting:** by date, description (A-Z, Z-A) or amount (low-high, high-low)
- **Regex search:** type a pattern, toggle case sensitivity, and see matches highlighted with `<mark>`; invalid patterns are caught and reported
- **Validation:** 5 regex rules with clear error messages
- **Settings:** spending cap, display currency (USD, EUR, RWF) with manual rates, and editable categories
- **Persistence:** all changes save automatically to localStorage
- **Import / Export:** export to JSON and import it back, with structure validation before loading
- **Responsive:** mobile-first layout with breakpoints at ~360px, 768px and 1024px

### Data model

```json
{
  "id": "rec_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.5,
  "category": "Food",
  "date": "2025-09-25",
  "createdAt": "2025-10-01T00:00:00.000Z",
  "updatedAt": "2025-10-01T00:00:00.000Z"
}
```

---

## Regex Catalog

### Validation rules

| Field | Pattern | Valid example | Invalid example |
|---|---|---|---|
| Description (no leading/trailing spaces) | `^\S(?:.*\S)?$` | `Lunch` | ` Lunch` |
| Description (no double spaces) | `\s{2,}` (rejected if it matches) | `Bus pass` | `Bus  pass` |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `12.50`, `0` | `012`, `1.234` |
| Date (YYYY-MM-DD) | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2025-09-29` | `2025-13-01` |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Fast-food` | `Food1` |
| **Advanced:** duplicate word (back-reference) | `\b(\w+)\s+\1\b` | flags `the the` | `the cat` |

### Search examples

Try these in the search box on the Records section:

| Pattern | Finds |
|---|---|
| `\.\d{2}\b` | Amounts with cents |
| `(coffee\|tea)` | Drink-related records |
| `\b(\w+)\s+\1\b` | Repeated words in a description |

---

## Keyboard Map

| Key | Action |
|---|---|
| `Tab` / `Shift + Tab` | Move forward / backward between controls |
| `Enter` / `Space` | Activate a button or link |
| `Enter` (in the form) | Submit the form |
| `↑` / `↓` | Change the selected sort option |
| First `Tab` on the page | Reveals the "Skip to content" link |

The whole app can be used with the keyboard alone. When you click Edit, focus moves to the form.

---

## Accessibility Notes

- **Landmarks and headings:** `header`, `nav`, `main`, `section` and `footer`, with a logical heading order
- **Skip link:** jumps straight to the main content
- **Forms:** every input has a bound `<label>`, and errors are linked with `aria-describedby`
- **Focus:** a visible focus outline on all interactive elements
- **Live regions:** status messages use `role="status"`; the cap message switches between `aria-live="polite"` and `"assertive"`
- **Tables:** proper `<th scope="col">` headers and a caption
- **Motion:** transitions are subtle and turn off with `prefers-reduced-motion`
- **Responsive:** works on phone, tablet and desktop

---

## Testing

1. Start the local server (see Setup Guide).
2. Open http://localhost:8000/tests.html.
3. Each check shows **PASS** or **FAIL**.

The tests cover:

- Each validation regex (valid and invalid inputs)
- The duplicate-word back-reference rule
- The safe regex compiler (an invalid pattern returns `null` instead of crashing)
- Match highlighting
- Collection of multiple validation errors

**Manual checks:** try the app with the keyboard only, test search with edge patterns such as `(` or `.*`, and export then re-import your data.
