# Student Finance Tracker

A simple app to track your spending as a student. Add expenses, set a spending cap, and search or sort your records.

- **Repo:** https://github.com/jnshuti-cpu/responsive-UI-summative

**Author:** Joshua Indoha Nshuti
**Email:** j.nshuti@alustudent.com
**GitHub:** https://github.com/jnshuti-cpu

## What you can do

- Add, edit and delete expenses
- See your total spent, top category and a 7-day chart on the dashboard
- Set a spending cap and get a message when you go over it
- Sort by date, description or amount
- Search with regex patterns (matches are highlighted)
- Switch display currency (USD, EUR, RWF) using rates you set yourself
- Export your data to JSON and import it back
- Your data saves automatically in your browser

## How to run it

1. Download or clone the repo.
2. In the project folder, run: `python3 -m http.server 8000`
3. Open http://localhost:8000 in your browser.

To run the tests, open http://localhost:8000/tests.html. Each check shows PASS or FAIL.

## Input rules (regex)

| Field | Pattern | Good example | Bad example |
|---|---|---|---|
| Description | `^\S(?:.*\S)?$` | `Lunch` | ` Lunch` |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `12.50` | `012` |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2025-09-29` | `2025-13-01` |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Fast-food` | `Food1` |
| Duplicate word (back-reference) | `\b(\w+)\s+\1\b` | flags `the the` | `the cat` |

**Try these in the search box:**
- `\.\d{2}\b` finds amounts with cents
- `(coffee|tea)` finds drinks
- `\b(\w+)\s+\1\b` finds repeated words

## Keyboard shortcuts

| Key | What it does |
|---|---|
| Tab / Shift+Tab | Move between buttons and fields |
| Enter / Space | Press a button or link |
| Arrow keys | Change the sort option |
| First Tab press | "Skip to content" link |

## Accessibility

- Clear page sections and headings
- Every field has a label, and errors are announced to screen readers
- Visible focus outline on everything you can tab to
- Cap message is polite when you are under and urgent when you are over
- Animations turn off if your device asks for reduced motion
- Works on phone, tablet and desktop

## Files

```
index.html   tests.html   seed.json
styles/main.css
scripts/storage.js  state.js  ui.js  validators.js  search.js
```
