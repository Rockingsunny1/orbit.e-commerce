# ORBIT — Static E-Commerce Website

A fully static e-commerce demo built with plain HTML, CSS and JavaScript.
No backend or database is used — the cart and last order are persisted
in the browser via `localStorage`.

## Overview

ORBIT is a small gadgets store (wearables, cameras, audio) with six pages:

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero banner, category strip, featured products |
| Shop | `products.html` | Full product grid with search + category filters |
| Product details | `product-details.html` | Large image, price, description, spec list, Add to cart |
| Cart | `cart.html` | Line items, quantity controls, remove, order summary |
| Checkout | `order.html` | Delivery details form + payment mode, order summary |
| Order success | `success.html` | Confirmation with order ID and summary |

Bonus features implemented: product search bar, category filters, and a
light/dark mode toggle (saved to `localStorage`).

## How to run

No build step or server is required.

1. Unzip the project.
2. Open `index.html` directly in a browser, **or** serve the folder with
   any static server, e.g.:
   ```bash
   cd project
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`.

An internet connection is needed only to load the Google Fonts
(Space Grotesk / Inter); the site still works offline with fallback fonts.

## Folder structure

```
project/
├── index.html            Home page
├── products.html         Shop / product listing page
├── product-details.html  Single product page (reads ?id= from the URL)
├── cart.html              Cart page
├── order.html             Checkout page
├── success.html           Order confirmation page
├── css/
│   └── style.css          All styling, design tokens, responsive rules
├── js/
│   ├── products.js        Static product data (id, name, price, image, specs…)
│   ├── cart.js             Cart state: add / remove / update qty / totals,
│   │                       backed by localStorage
│   └── main.js             Shared UI (header, theme, toast) + per-page
│                           rendering, guarded so one script serves all pages
└── images/                 Product photos (all products shown on the site)
```

## How the cart works

- `Cart` (in `js/cart.js`) stores an array of `{ id, qty }` under the
  `orbit_cart` key in `localStorage`.
- `Cart.detailedItems()` joins that against the product catalogue in
  `js/products.js` to compute line totals, subtotal, shipping (free over
  ₹5,000, otherwise ₹99) and grand total.
- Placing an order snapshots the cart into `orbit_last_order`, clears the
  cart, and redirects to `success.html`, which reads that snapshot.

## Product data

Products live in a single array in `js/products.js`:

```js
{
  id: 1,
  name: "AeroFit Pulse Smartwatch",
  category: "Wearables",
  price: 2499,
  tag: "Bestseller",
  image: "images/watch-square.jpg",
  description: "…",
  specs: [["Display", "1.9\" AMOLED"], …]
}
```

Add a new product by appending an object with the same shape — every page
(home, shop, details, cart) reads from this one file.

## Notes / next steps

- Screenshots of each page can be added here before converting this file
  to PDF for submission, per the assignment's documentation requirement.
- No backend, API, or database is used anywhere, per the assignment brief.
