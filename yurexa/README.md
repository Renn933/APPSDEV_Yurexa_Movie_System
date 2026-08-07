# Yurexa 🎬

**Your cinematic universe.** A client-side movie discovery and rental website built with vanilla HTML, CSS, and JavaScript.

## Overview

Yurexa is a fully client-side movie website where you can browse a catalog of films, save movies to a watchlist, add rentals to a cart, and go through a simulated checkout flow. Everything runs in the browser — no server, no database.

## Features

### 7 Distinct Views (Screens)
1. **Home** — Hero section, featured films, new releases, genre explorer
2. **Browse** — Searchable, filterable, sortable movie catalog
3. **Movie Details** — Full movie info, reviews, and related films
4. **Watchlist** — Your saved movies (persisted in localStorage)
5. **Cart** — Shopping cart with quantity controls and order summary
6. **Checkout** — Multi-step form with payment method selection and validation
7. **Order Confirmation** — Receipt with order details after placing an order

### State Management (3+ features)
- **Cart** — Add/remove items, update quantities, **save for later**, move back to cart, persisted to localStorage
- **Watchlist** — Save/unsave movies with heart icons, **add individual movies to cart**, **add all to cart**, **clear watchlist**, persisted to localStorage
- **Search & Filter** — Text search, genre filtering, and six sort options
- **Badge animations** — Nav badges pop when cart/watchlist counts change

### Data-Driven Rendering
All movie content lives in `js/data.js` as a JavaScript array of objects. Views are rendered dynamically — there is zero copy-pasted HTML for movie content.

### Responsive Design
Works on phones, tablets, and laptops:
- Mobile hamburger navigation
- Fluid grid layouts that adapt to screen size
- Optimized touch targets and stacked layouts on small screens

### Polish
- ✅ **Empty states** — for cart, watchlist, search results, and orders
- ✅ **Input validation** — checkout form validates name, email, card number, expiry, and CVC with inline error messages
- ✅ **Confirmations** — clear-cart confirmation dialog and order confirmation screen
- ✅ **Loading states** — simulated order processing with spinner
- ✅ **Transitions** — fade-in view transitions, hover animations, toast notifications
- ✅ **Consistent visual design** — cohesive dark theme with a signature red accent

## How to Run

Simply open `index.html` in a browser:

```
start index.html
```

Or serve it locally (optional):

```
npx serve .
```

No build step. No npm install required. Everything runs in the browser.

## Data Persistence

Data is saved using `localStorage`:
- Cart items
- Watchlist
- Saved for later items
- Search query
- Genre filter
- Sort preference

> **Note:** This data lives only in one browser on one computer. Clearing browser data will reset the app.

## Tech Stack

- **HTML** — Semantic markup, single entry point
- **CSS** — Custom properties, flexbox, grid, media queries for responsiveness
- **Vanilla JavaScript** — Hash-based router, event delegation, state management, localStorage persistence

## Project Structure

```
yurexa/
├── index.html          # Single-page entry point
├── css/
│   └── style.css       # All styles (responsive, themed)
├── js/
│   ├── data.js         # Movie data (JS array of objects)
│   ├── state.js        # Cart/watchlist/filter state with localStorage
│   ├── components.js   # View templates and reusable UI components
│   ├── router.js       # Hash-based SPA router + form validation
│   └── app.js          # Entry point, event delegation, initialization
└── README.md
```

## Note on Payments

The checkout flow is a **demo only**. No real payment processing happens. "Payment" is simulated client-side with validation and a fake processing delay. Never treat this as real security or payment infrastructure.