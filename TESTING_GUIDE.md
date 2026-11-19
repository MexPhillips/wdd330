## Week 02: Dynamic Product List - Testing Guide

This guide will help you verify that the dynamic product list implementation is working correctly.

---

### 🧪 Test 1: Verify Products Load on Page Load

**Steps:**
1. Start your development server with `npm run dev` (or equivalent)
2. Open your browser and navigate to `http://localhost:5173/` (or your dev server URL)
3. Check the Console tab (F12 > Console) for any errors
4. Verify that the "Top Products" section displays 4 tents (Marmot Ajax, North Face Talus 4-Person, North Face Alpine, Cedar Ridge Rimrock)

**Expected Result:**
- ✅ All 4 products display with images, names, brands, and prices
- ✅ No red errors in the console
- ✅ Console shows: `"Product page initialized successfully"`

**If it fails:**
- Check that `tents.json` exists in `src/json/`
- Verify the module path references are correct (`../json/` is relative to the JS file location)
- Check browser console for specific error messages

---

### 🧪 Test 2: Verify Template Element Usage

**Steps:**
1. Right-click on a product card in the browser and select "Inspect"
2. Look at the HTML source code
3. Expand the `.product-card` elements to verify they're rendered HTML (not `<template>` elements)

**Expected Result:**
- ✅ Each product card appears as a regular `<li class="product-card">` in the DOM
- ✅ Cards contain images, brand names, product names, prices, and buttons
- ❌ You should NOT see a `<template>` element in the rendered output

**Why:** Templates are not rendered visually - they're cloned and inserted into the DOM by JavaScript.

---

### 🧪 Test 3: Verify "View Details" Button Functionality

**Steps:**
1. On the home page, click the "View Details" button on any product
2. Watch the page scroll down smoothly
3. Verify that the product details section displays below the product list

**Expected Result:**
- ✅ Clicking the button scrolls to the details section
- ✅ Product details display with the correct product information (name, price, image, description)
- ✅ The correct color and MSRP information appears if available

**If it fails:**
- Check the browser console for errors
- Verify that `.product-details` container exists in the HTML
- Check that the product ID values in buttons match actual product IDs in `tents.json`

---

### 🧪 Test 4: Verify Event Delegation Works

**Steps:**
1. Open the developer console (F12)
2. Type this command to inspect event listeners:
   ```javascript
   // Check that the document has a click listener
   console.log('Testing event delegation...');
   ```
3. Add a new product dynamically by running your app with different categories and click view details

**Expected Result:**
- ✅ All "View Details" buttons work even though they're dynamically created
- ✅ Only ONE document-level click listener exists (event delegation)
- ✅ No memory leaks from creating individual listeners per button

**Why:** Event delegation is more efficient than adding listeners to each button individually.

---

### 🧪 Test 5: Verify Fetch API is Used

**Steps:**
1. Open browser DevTools (F12)
2. Go to the Network tab
3. Refresh the page (F5)
4. Look for a request to `tents.json`

**Expected Result:**
- ✅ You should see a network request for `/json/tents.json`
- ✅ Status should be 200 (successful)
- ✅ You can click on it and see the JSON response in the network tab

**Instructions:**
- Click on `tents.json` in the network list
- Go to the "Response" tab
- Verify you see valid JSON with product data

---

### 🧪 Test 6: Verify ES6 Module Structure

**Steps:**
1. Open `src/js/main.js` in your editor
2. Verify it imports from:
   - `./productList.mjs`
   - `./eventHandler.mjs`
3. Open `src/js/productList.mjs` and verify it imports from:
   - `./ProductData.mjs`
   - `./utils.mjs`
4. Open `src/js/eventHandler.mjs` and verify it imports:
   - `./productDetails.mjs`

**Expected Result:**
- ✅ All imports use ES6 `import` syntax
- ✅ All exports use `export` or `export default`
- ✅ Files use `.mjs` extension for module files
- ✅ No circular dependencies

**Check:**
```bash
# List the imports in each file
grep "^import\|^export" src/js/*.mjs src/js/*.js
```

---

### 🧪 Test 7: Verify Error Handling

**Steps:**
1. Open your browser's Network tab
2. Click "Block" on the `tents.json` request (or the throttle option)
3. Refresh the page
4. Observe what happens

**Expected Result:**
- ✅ An error message displays: "Failed to load products. Please try again later."
- ✅ No JavaScript errors crash the page
- ✅ Console shows the caught error in a readable format

---

### 🧪 Test 8: Verify Accessibility

**Steps:**
1. Right-click on a product card and inspect the image
2. Verify the `<img>` tag has an `alt` attribute with descriptive text
3. Check that buttons have `aria-label` attributes
4. Use keyboard navigation (Tab key) to navigate through all buttons

**Expected Result:**
- ✅ All images have meaningful alt text
- ✅ Buttons have descriptive ARIA labels
- ✅ You can use Tab to focus on each button
- ✅ Buttons are visible when focused (outline/highlight)
- ✅ Enter/Space key activates focused buttons

---

### 🧪 Test 9: Verify Code Quality and Readability

**Checklist:**
- ✅ Functions have JSDoc comments explaining their purpose
- ✅ Variable names are descriptive (not `a`, `b`, `x`)
- ✅ Code is organized into logical modules by functionality
- ✅ No console.log statements remain (except for debugging)
- ✅ Try-catch blocks handle errors gracefully
- ✅ Classes use meaningful names (`ProductListRenderer`, `EventHandler`)

**Run this:** (Optional) Use a linter to check code quality:
```bash
npm install --save-dev eslint
npx eslint src/js/*.js src/js/*.mjs
```

---

### 🧪 Test 10: Performance Test

**Steps:**
1. Open DevTools > Performance tab
2. Click Record
3. Refresh the page
4. Click Stop
5. Analyze the recording

**Expected Result:**
- ✅ Page loads in under 2 seconds
- ✅ No long tasks blocking the main thread
- ✅ DOM is interactive quickly
- ✅ Scripts complete before layout shift

---

### 🧪 Test 11: Test Different Categories (Bonus Challenge)

**Steps:**
1. In `src/js/main.js`, change this line:
   ```javascript
   const productListRenderer = new ProductListRenderer("tents");
   ```
   to:
   ```javascript
   const productListRenderer = new ProductListRenderer("backpacks");
   ```
2. Refresh the page
3. Verify that backpack products load instead of tents

**Expected Result:**
- ✅ The product list updates to show backpacks
- ✅ All functionality works the same way with different data
- ✅ View Details still works for backpack products

**Note:** `backpacks.json` has a different data structure, so the renderer needs to handle this. Adjust the field names in `productList.mjs` if needed.

---

### 📋 Quick Checklist Before Submitting

- [ ] Products load dynamically from JSON
- [ ] Template elements are used
- [ ] View Details button shows product details
- [ ] Event listeners use delegation
- [ ] Fetch API is used for data retrieval
- [ ] Code is organized in ES6 modules
- [ ] Error handling is implemented
- [ ] Accessibility standards are met
- [ ] Code has comments and good documentation
- [ ] No console errors appear
- [ ] Responsive design works on mobile/tablet

---

### 🐛 Debugging Tips

If something isn't working, try these steps:

1. **Check the console** (F12 > Console)
   - Look for red errors explaining what went wrong
   - Check for the initialization success message

2. **Check the Network tab** (F12 > Network)
   - Verify that `tents.json` loads successfully
   - Check the response to ensure it's valid JSON

3. **Inspect the DOM** (F12 > Elements)
   - Verify that products are inserted into the `.product-list`
   - Check that buttons have correct `data-id` and `data-category` attributes

4. **Use breakpoints** (F12 > Sources)
   - Add breakpoints in your modules to pause execution
   - Step through the code to see what's happening

5. **Check file paths**
   - Ensure `../json/tents.json` path is correct relative to the JS file
   - Verify all imports use correct file names and extensions

6. **Browser compatibility**
   - Test in a modern browser (Chrome, Firefox, Edge, Safari)
   - ES6 modules require modern browser versions

---

### 📞 Getting Help

If tests fail:
1. Check the exact error message in the console
2. Verify file paths match your actual project structure
3. Ensure JSON file format is valid
4. Check that all ES6 imports/exports are correct
5. Review the module code for syntax errors

Good luck! Your dynamic product list should be working perfectly now. 🚀
