# Week 02 Quick Reference Guide

## 🎯 What Was Built

A dynamic product listing system that:
- ✅ Fetches product data from JSON files using Fetch API
- ✅ Renders products dynamically with HTML template elements
- ✅ Shows product details on demand
- ✅ Uses modular ES6 code organized by functionality
- ✅ Implements accessibility best practices
- ✅ Handles errors gracefully

---

## 📦 New Files Created

```
src/js/
├── main.js                  - Entry point (orchestrates all modules)
├── productList.mjs          - Renders product list
├── productDetails.mjs       - Renders product details
└── eventHandler.mjs         - Manages click events

Documentation:
├── IMPLEMENTATION_SUMMARY.md - Full technical details
├── TESTING_GUIDE.md         - 11 detailed test scenarios
└── STYLING_GUIDE.md         - CSS recommendations
```

---

## 🔧 How Each Module Works

### `main.js` - **The Conductor**
```javascript
// Orchestrates the entire app
1. Creates ProductListRenderer
2. Calls render() to fetch and display products
3. Creates EventHandler for user interactions
```

### `productList.mjs` - **The Renderer**
```javascript
// Fetches products and uses templates to render them
1. Uses ProductData to fetch from tents.json
2. Clones template element for each product
3. Inserts cloned elements into DOM
```

### `productDetails.mjs` - **The Detail View**
```javascript
// Shows full details when user clicks "View Details"
1. Fetches specific product by ID
2. Clones details template
3. Scrolls to results
```

### `eventHandler.mjs` - **The Listener**
```javascript
// Uses event delegation for efficiency
1. Single listener on document for all clicks
2. Checks if click is on a View Details button
3. Delegates to details renderer
```

---

## 📋 Module Dependencies

```
main.js
  ├── imports ProductListRenderer (productList.mjs)
  │   └── imports ProductData.mjs
  │   └── imports utils.mjs
  │   └── Fetches from tents.json
  │
  └── imports EventHandler (eventHandler.mjs)
      └── imports ProductDetailsRenderer (productDetails.mjs)
          └── imports ProductData.mjs
          └── imports utils.mjs
          └── Fetches from tents.json
```

---

## 🚀 How to Test

### Quick Start (3 steps):
1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Verify:
   - Products load on page
   - Click "View Details" shows product info
   - Console shows "Product page initialized successfully"

### Detailed Testing:
See [TESTING_GUIDE.md](../TESTING_GUIDE.md) for 11 comprehensive test scenarios.

---

## 💡 Key Concepts Explained

### Template Elements
- **What:** HTML `<template>` tag that's not rendered visually
- **Why:** Efficient for cloning and inserting multiple similar elements
- **How:** `template.content.cloneNode(true)` creates a copy each time

```html
<template class="product-template">
  <li class="product-card">
    <img class="product-image" />
    <h3 class="card__brand"></h3>
    <p class="product-card__price"></p>
    <button class="view-details-btn">View Details</button>
  </li>
</template>
```

### Event Delegation
- **What:** Single listener on parent instead of individual listeners
- **Why:** Better performance, works for dynamic elements
- **How:** Check `e.target.closest()` to see what was clicked

```javascript
// ❌ Wrong way - adds listener to each button (inefficient)
buttons.forEach(btn => btn.addEventListener('click', handler));

// ✅ Right way - single listener on parent (efficient)
document.addEventListener('click', (e) => {
  if (e.target.closest('.button')) {
    // handle click
  }
});
```

### Fetch API
- **What:** Modern way to request data asynchronously
- **Why:** Better than XMLHttpRequest, handles JSON natively
- **How:** Returns a Promise that resolves to Response object

```javascript
const response = await fetch('./data.json');
const data = await response.json();
```

### ES6 Modules
- **What:** Individual `.mjs` files that import/export functions
- **Why:** Better code organization, avoids global scope
- **How:** Use `import`/`export` statements

```javascript
// productList.mjs
export default class ProductListRenderer { /* ... */ }

// main.js
import ProductListRenderer from "./productList.mjs";
```

---

## 🎨 HTML Template Structure

### Products Template
```html
<template class="product-template">
  <li class="product-card">
    <img class="product-image" alt="Product image" />
    <h3 class="card__brand"></h3>
    <h2 class="card__name"></h2>
    <p class="product-card__price"></p>
    <button class="view-details-btn" aria-label="View product details">
      View Details
    </button>
  </li>
</template>
```

### Details Template
```html
<template class="product-details-template">
  <div class="details-container">
    <img class="details-image" alt="Product image" />
    <div class="details-info">
      <h2 class="details-title"></h2>
      <p class="details-color"></p>
      <p class="details-price"></p>
      <div class="details-msrp"></div>
      <p class="details-description"></p>
      <button class="add-to-cart-btn">Add to Cart</button>
    </div>
  </div>
</template>
```

---

## 📊 Data Flow Illustration

```
User visits page
    ↓
main.js loads
    ↓
ProductListRenderer.render()
    ↓
ProductData.getData() [Fetch API]
    ↓
tents.json loaded
    ↓
displayProductList() iterates products
    ↓
For each product:
  - Clone template
  - Fill in product data
  - Add data attributes
  - Insert into .product-list
    ↓
Products visible on page
    ↓
EventHandler sets up click listener
    ↓
User clicks "View Details"
    ↓
EventHandler.handleViewDetailsClick()
    ↓
ProductDetailsRenderer.loadProductDetails()
    ↓
ProductData.findProductById()
    ↓
Clone details template
    ↓
Fill with product info
    ↓
Insert into .product-details
    ↓
Scroll to details
    ↓
User sees product details
```

---

## ✅ Checklist: Requirements Met

### 1. Fetch API ✅
```javascript
// Located in ProductData.mjs
fetch(this.path).then(convertToJson).then(data => data)
```

### 2. Dynamic Product List ✅
```javascript
// Located in productList.mjs
displayProductList(products) {
  products.map(product => createProductCard(product))
}
```

### 3. Template Elements ✅
```javascript
// Located in productList.mjs
const template = qs(".product-template");
const clone = template.content.cloneNode(true);
```

### 4. View Details Button ✅
```html
<button class="view-details-btn">View Details</button>
```

### 5. ES6 Modules ✅
```javascript
// All files use import/export
// Files have .mjs extension
// Proper dependency management
```

### 6. Best Practices ✅
- JSDoc comments on all functions
- Error handling with try-catch
- Event delegation for efficiency
- Accessibility (ARIA labels, alt text, etc.)
- Readable variable names
- Separated concerns by module

---

## 🔗 Class Relationships

```
EventHandler
    └─ creates → ProductDetailsRenderer
                    └─ uses → ProductData

Main (main.js)
    ├─ creates → ProductListRenderer
    │                └─ uses → ProductData
    │                └─ uses → utils (qs function)
    │
    └─ creates → EventHandler
                    └─ uses → ProductDetailsRenderer
```

---

## 📚 File Reference

| File | Purpose | Key Export |
|------|---------|-----------|
| main.js | Entry point | (initializes on load) |
| productList.mjs | List rendering | ProductListRenderer class |
| productDetails.mjs | Detail display | ProductDetailsRenderer class |
| eventHandler.mjs | Event management | EventHandler class |
| ProductData.mjs | Data fetching | ProductData class |
| utils.mjs | Utilities | qs(), getLocalStorage(), etc. |
| index.html | Page structure | Templates + containers |

---

## 🎓 Key Learning Outcomes

After this activity, you understand:

1. **Fetch API** - How to request and handle JSON data
2. **Template Elements** - How to clone and render elements efficiently
3. **Event Delegation** - How to manage events on dynamic elements
4. **ES6 Modules** - How to organize code into reusable components
5. **Async/Await** - How to handle asynchronous operations
6. **DOM Manipulation** - How to update HTML with JavaScript
7. **Error Handling** - How to gracefully handle failures
8. **Accessibility** - How to make web apps usable for all users

---

## 🆘 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Products don't load | Check tents.json path, verify Network tab |
| Click doesn't work | Verify data attributes on buttons, check console |
| Template not working | Ensure `<template>` exists with correct classes |
| Module errors | Check import paths, verify .mjs extensions |
| No scrolling | Check .product-details container exists |
| Accessibility issues | Add aria-label, alt text to elements |

---

## 🌟 Next Steps

### For this week:
- [ ] Run all 11 tests in TESTING_GUIDE.md
- [ ] Verify console shows success message
- [ ] Check that network requests are made
- [ ] Test keyboard navigation

### For next week:
- [ ] Hook "Add to Cart" button to cart functionality
- [ ] Implement cart persistence with localStorage
- [ ] Add form validation to checkout
- [ ] Create order summary page

---

## 📞 Support Resources

- **MDN Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **MDN Templates:** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
- **MDN Modules:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- **WCAG Accessibility:** https://www.w3.org/WAI/WCAG21/quickref/

---

**Status:** ✅ Complete and Ready for Testing  
**Difficulty:** Intermediate  
**Time to Complete:** 2-3 hours  
**All 6 Requirements:** Met ✅
