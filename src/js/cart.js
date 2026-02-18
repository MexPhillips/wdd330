import CartHeader from "./cartHeader.mjs";
import CartManager from "./cartManager.mjs";

const cartManager = new CartManager();

/**
 * Render cart contents
 */
function renderCartContents() {
  const cartItems = cartManager.getCartItems();
  const productList = document.querySelector(".product-list");
  
  if (cartItems.length === 0) {
    productList.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="../" class="btn-continue-shopping">Continue Shopping</a></div>';
    updateCartTotals();
    return;
  }
  
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");
  
  // Add event listeners for remove buttons
  document.querySelectorAll(".cart-card__remove-btn").forEach(button => {
    button.addEventListener("click", handleRemoveFromCart);
  });
  
  // Add event listeners for quantity inputs
  document.querySelectorAll(".cart-card__quantity-input").forEach(input => {
    input.addEventListener("change", handleQuantityChange);
  });
  
  updateCartTotals();
}

/**
 * Create HTML template for a cart item
 * @param {Object} item - Cart item object
 * @returns {string} HTML string for cart item
 */
function cartItemTemplate(item) {
  const colorName = item.Colors?.[0]?.ColorName || "Standard";
  const quantity = item.Quantity || 1;
  const price = parseFloat(item.FinalPrice || item.Price || 0);
  const itemTotal = (price * quantity).toFixed(2);
  
  return `<li class="cart-card divider" data-product-id="${item.Id}">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <div class="cart-card__details">
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${colorName}</p>
      <div class="cart-card__quantity-control">
        <label for="qty-${item.Id}">Qty:</label>
        <input 
          type="number" 
          id="qty-${item.Id}" 
          class="cart-card__quantity-input" 
          value="${quantity}" 
          min="1" 
          data-product-id="${item.Id}"
        />
      </div>
    </div>
    <div class="cart-card__pricing">
      <p class="cart-card__unit-price">$${price.toFixed(2)}</p>
      <p class="cart-card__total-price">Total: $${itemTotal}</p>
      <button 
        class="cart-card__remove-btn" 
        data-product-id="${item.Id}" 
        aria-label="Remove ${item.Name} from cart"
      >
        Remove
      </button>
    </div>
  </li>`;
}

/**
 * Handle remove button click
 * @param {Event} event - Click event
 */
function handleRemoveFromCart(event) {
  event.preventDefault();
  const productId = event.target.dataset.productId;
  
  if (confirm("Are you sure you want to remove this item from your cart?")) {
    cartManager.removeFromCart(productId);
    renderCartContents();
  }
}

/**
 * Handle quantity input change
 * @param {Event} event - Change event
 */
function handleQuantityChange(event) {
  const productId = event.target.dataset.productId;
  const newQuantity = parseInt(event.target.value, 10);
  
  if (newQuantity <= 0) {
    if (confirm("Remove this item from your cart?")) {
      cartManager.removeFromCart(productId);
      renderCartContents();
    } else {
      // Reset to previous value
      const item = cartManager.getCartItems().find(i => i.Id === productId);
      event.target.value = item?.Quantity || 1;
    }
  } else {
    cartManager.updateQuantity(productId, newQuantity);
    renderCartContents();
  }
}

/**
 * Update cart totals display
 */
function updateCartTotals() {
  const cartItems = cartManager.getCartItems();
  const subtotal = cartManager.getCartTotal();
  const shipping = cartItems.length > 0 ? 10 : 0; // $10 flat shipping
  const total = subtotal + shipping;
  
  // Create or find totals section
  let totalsSection = document.querySelector(".cart-totals");
  if (!totalsSection) {
    const productList = document.querySelector(".product-list");
    totalsSection = document.createElement("div");
    totalsSection.className = "cart-totals";
    productList.parentNode.insertBefore(totalsSection, productList.nextSibling);
  }
  
  totalsSection.innerHTML = `
    <div class="totals-breakdown">
      <div class="totals-row">
        <span>Subtotal:</span>
        <span class="subtotal">$${subtotal.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>Shipping:</span>
        <span class="shipping">$${shipping.toFixed(2)}</span>
      </div>
      <div class="totals-row total-row">
        <span>Total:</span>
        <span class="total">$${total.toFixed(2)}</span>
      </div>
    </div>
  `;
}

/**
 * Initialize cart page
 */
function initializeCartPage() {
  // Listen for cart updates from other pages/windows
  cartManager.onCartUpdate('cartUpdated', () => {
    renderCartContents();
  });
  
  // Initial render
  renderCartContents();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCartPage);
} else {
  initializeCartPage();
}
