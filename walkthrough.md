# GiftsKart — Build Walkthrough

## What Was Built

A complete **B2B corporate gifting platform** prototype with 8 functional pages, mock data, and an end-to-end user journey from browsing to order tracking.

**Tech stack:** Vite + React + React Router + PapaParse + Vanilla CSS

---

## Pages Built

| Page | Route | Key Features |
|------|-------|-------------|
| Homepage | `/` | Hero with UVP, trust bar, how-it-works, 5 category cards, 4 trending products, competitor comparison |
| Catalogue | `/catalogue` | 16 products, category filtering, price slider, sort by price/name |
| Festival Gifts | `/festival-gifts` | Festival hampers with urgency banner, deadline messaging |
| Corporate Gifts | `/corporate-gifts` | Branded merchandise + desk accessories, UVP banner |
| Product Detail | `/product/:id` | Image gallery, pricing tiers table, live calculator, customization panel |
| Bulk Order | `/bulk-order` | Multi-section form, CSV upload, recipient table, date validation |
| Order Confirmation | `/order-confirmation` | Order ID (GK-YYYYMMDD-XXXX), summary, downloadable HTML invoice |
| Corporate Dashboard | `/dashboard` | Active orders with stepper, history, quotes, saved products |
| Admin Dashboard | `/admin` | Product CRUD, order status management, quotes overview |

---

## Business Rules Enforced

- ✅ **Min 25 units** — validated on form and product detail page
- ✅ **3-tier pricing** — 25-49 (listed), 50-99 (10% off), 100+ (20% off)
- ✅ **7-day lead time** — delivery date picker blocks earlier dates
- ✅ **Order ID format** — GK-YYYYMMDD-XXXX
- ✅ **localStorage persistence** — orders survive page reloads
- ✅ **CSV upload** — parses Name, Address, Pincode, City with template download
- ✅ **All prices in ₹** (Indian Rupees)

---

## End-to-End Verification

The full user journey was tested in browser:

```
Homepage → Browse Catalogue → Filter (Desk Accessories) → Product Detail
→ Pricing Calculator (20% discount at 100+ units) → Request Bulk Order
→ Fill Form (pre-filled product) → Submit → Order Confirmation (GK-20260322-9357)
→ Track Your Order → Dashboard (order visible with status stepper)
```

**Result: All 7 steps PASSED ✓**

---

## Screenshots

### Homepage — Hero & Trust Bar
![Homepage hero section](homepage_middle_1774188745401.png)

### Featured Categories & Trending Products
![Categories and trending products](homepage_categories_trending_1774188758300.png)

### Competitor Comparison & Product Cards
![Comparison and products](homepage_trending_and_comparison_final_1774188839787.png)

### Order Confirmation
![Order confirmation with Download Invoice and Track Your Order buttons](../.system_generated/click_feedback/click_feedback_1774189998605.png)

### End-to-End Journey Recording
![Full user journey recording](e2e_user_journey_1774189281670.webp)

---

## File Structure

```
giftsKart/
├── public/data/
│   ├── products.json      (16 products, 4 categories)
│   ├── orders.json        (4 mock orders)
│   └── quotes.json        (3 mock quotes)
├── src/
│   ├── components/
│   │   ├── Header.jsx     (sticky nav, mobile menu)
│   │   ├── Footer.jsx     (brand, links, contact)
│   │   ├── ProductCard.jsx (image, price, badges, save)
│   │   └── OrderStepper.jsx (4-step status timeline)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CataloguePage.jsx
│   │   ├── FestivalGiftsPage.jsx
│   │   ├── CorporateGiftsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── BulkOrderPage.jsx
│   │   ├── OrderConfirmationPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── AdminDashboardPage.jsx
│   ├── utils/
│   │   ├── pricing.js     (3-tier bulk pricing)
│   │   ├── storage.js     (localStorage CRUD)
│   │   └── orderUtils.js  (order ID, date validation)
│   ├── App.jsx            (router)
│   ├── main.jsx           (entry point)
│   └── index.css          (full design system)
└── index.html
```

## How to Run

```bash
cd c:\Users\hp\Desktop\giftsKart
npm run dev
```

Open http://localhost:5173/ in your browser.
