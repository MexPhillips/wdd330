# Shopping Cart Feature Implementation Guide

## Overview
A complete vanilla JavaScript shopping cart system for the "Sleep Outside" e-commerce project with localStorage persistence, dynamic UI updates, and responsive design.

## Features Implemented

### 1. Cart Management (`cartManager.mjs`)
A centralized cart management module that handles all shopping cart operations:

- **Add to Cart**: Automatically increases quantity if item already exists
- **Remove from Cart**: Completely removes an item by product ID
- **Update Quantity**: Changes item quantity (removes if quantity ≤ 0)
- **Clear Cart**: Empties the entire cart
- **Get Cart Total**: Calculates total price with quantities
- **Get Item Count**: Returns total number of items
- **Event Listeners**: Notifies other parts of the app when cart updates

```javascript
import CartManager from "./cartManager.mjs";

const cartManager = new CartManager();

// Add product to cart
cartManager.addToCart(product);

// Remove product by ID
cartManager.removeFromCart(productId);

// Update quantity
cartManager.updateQuantity(productId, 2);

// Get cart info
const items = cartManager.getCartItems();
const total = cartManager.getCartTotal();
const count = cartManager.getItemCount();
```

### 2. Cart Header Badge (`cartHeader.mjs`)
Auto-initializing module that:
- Displays cart item count in a badge on the header
- Updates across all pages automatically
- Syncs across browser tabs using storage events
- Hides badge when cart is empty

**Badge appears on all pages** (home, cart, checkout) and shows real-time updates.

### 3. Cart Display Page (`cart.js`)
Enhanced cart page with:
- **Product Listing**: Shows all cart items with images
- **Quantity Control**: Input fields to adjust quantities (min 1)
- **Remove Button**: Delete individual items with confirmation
- **Dynamic Totals**: Subtotal, shipping ($10 flat), and grand total
- **Empty Cart Message**: Friendly message with continue shopping button

**Features**:
- Quantity changes update totals immediately
- Removing items updates cart count instantly
- Clean, responsive layout

### 4. Checkout Integration (`checkout.js`)
Updated checkout page to:
- Display cart items with quantities
- Calculate correct totals with quantity multipliers
- Use CartManager instead of direct localStorage access
- Handle empty cart scenarios

### 5. Product Details (`productDetails.mjs`)
Updated to use CartManager for:
- Consistent add-to-cart behavior
- Success notifications
- Proper quantity tracking

### 6. Product Page (`product.js`)
Updated with:
- CartManager integration
- Visual feedback on add to cart (button changes text)
- Cart badge updates
- Error handling

### 7. Main Page (`main.js`)
Imported CartHeader module to enable badge on home page

## CSS Styling

### Cart Badge
```css
.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4444;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  /* ... shows item count ... */
}
```

### Cart Card Layout
- **Desktop**: 3-column grid (image, details, pricing)
- **Mobile**: 2-column responsive layout
- Includes quantity input, total price, remove button

### Cart Totals
- Clean breakdown of subtotal, shipping, and total
- Color-coded for visual hierarchy
- Responsive text sizing

### Button Styles
- **Remove Button**: Red (#ff6b6b) with hover effect
- **Checkout Button**: Secondary color with gradient
- **Continue Shopping**: Outline style with hover fill

## LocalStorage Structure

Cart data stored under key `"so-cart"` as JSON array:

```javascript
[
  {
    Id: "tent-001",
    Name: "Marmot Ajax Tent",
    FinalPrice: 199.99,
    Image: "/path/to/image.jpg",
    Colors: [{ ColorName: "Red" }],
    Quantity: 2  // Added by CartManager
  },
  // ... more items
]
```

## Cross-Tab Synchronization
The cart syncs across browser tabs/windows through:
1. **Storage events**: Triggered when localStorage changes
2. **Event listeners**: CartManager notifies on updates
3. **Badge updates**: Automatically reflects cart state

## Form Validation (Checkout)
Pre-existing validation handles:
- **Required fields**: First name, last name, email, phone, address, etc.
- **Email format**: Valid email validation
- **Phone format**: 10+ digits, accepts common formats
- **Card number**: Luhn algorithm validation
- **Expiry date**: MM/YY format, not expired
- **ZIP code**: 5 or 5+4 format
- **Real-time feedback**: Validation on blur, clear on input
- **Field-level errors**: Shown below each field

## Responsive Design Breakpoints

### Mobile (< 600px)
- Single-column cart layout
- Stacked pricing sections
- Full-width buttons
- Smaller images (100px)

### Tablet/Desktop (≥ 600px)
- Multi-column grid layout
- Side-by-side pricing
- Flexible button layout
- Larger images (120px)

## Usage Guide

### For Customers
1. **Add to Cart**: Click "Add to Cart" on product pages
2. **View Cart**: Click cart icon in header
3. **Adjust Quantities**: Use number input to change amounts
4. **Remove Items**: Click "Remove" button
5. **Checkout**: Review totals and proceed to checkout

### For Developers

#### Initialize Cart Manager
```javascript
import CartManager from "./js/cartManager.mjs";
const cartManager = new CartManager();
```

#### Handle Add to Cart
```javascript
const product = await dataSource.findProductById(id, category);
cartManager.addToCart(product);
```

#### Listen for Updates
```javascript
cartManager.onCartUpdate('cartUpdated', (data) => {
  console.log('Cart updated:', data.cart);
  updateUI();
});
```

#### Calculate Totals
```javascript
const subtotal = cartManager.getCartTotal();
const itemCount = cartManager.getItemCount();
```

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses localStorage (available in all modern browsers)
- ES6 modules and arrow functions required
- CSS Grid and Flexbox for layout

## Performance Considerations
1. **Efficient Updates**: Only items affected by changes re-render
2. **Event Delegation**: Remove button handlers attached once
3. **Local Storage**: Synchronous but acceptable for cart size
4. **Lazy Loading**: Product details loaded on demand

## Security Notes
1. **Client-Side Only**: No backend validation yet
2. **XSS Protection**: HTML is sanitized in templates
3. **localStorage Scope**: Domain-specific, cannot access cross-domain
4. **No Sensitive Data**: Cart contains only product info, no payment data

## Testing Checklist
- [ ] Add item to cart from product page
- [ ] Cart badge updates on all pages
- [ ] Remove item from cart page
- [ ] Update quantities dynamically
- [ ] Cart totals calculate correctly
- [ ] Cart persists on page reload
- [ ] Empty cart shows appropriate message
- [ ] Checkout displays correct totals
- [ ] Form validation works
- [ ] Mobile layout is responsive
- [ ] Multi-tab sync works
- [ ] Quantity 0 or less removes item

## Future Enhancements
1. **Wishlist Feature**: Save items for later
2. **Coupon Codes**: Apply discount codes
3. **Shipping Options**: Multiple shipping methods
4. **Tax Calculation**: Based on shipping address
5. **Order History**: View past orders
6. **Backend Integration**: Save cart on server
7. **Analytics**: Track add/remove events
8. **Recommendations**: Suggest related products
9. **Bulk Actions**: Multi-select for deletion
10. **Gift Messages**: Add message to items
