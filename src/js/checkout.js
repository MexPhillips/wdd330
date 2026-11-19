/**
 * Checkout Page Module
 * Handles checkout page initialization, cart display, and form integration
 */

import CartHeader from "./cartHeader.mjs";
import CartManager from "./cartManager.mjs";
import { CheckoutFormHandler } from "./checkoutFormHandler.mjs";

const cartManager = new CartManager();

/**
 * Display cart items in the order summary
 */
function displayCartItems() {
  const cartItems = cartManager.getCartItems();
  const cartList = document.querySelector(".order-summary .cart-items");

  if (!cartList) return;

  // Clear existing items
  cartList.innerHTML = "";

  if (cartItems.length === 0) {
    cartList.innerHTML =
      '<li class="empty-cart"><p>Your cart is empty. <a href="../index.html">Continue shopping</a></p></li>';
    return;
  }

  // Display each cart item
  cartItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    const quantity = item.Quantity || 1;
    const itemTotal = (parseFloat(item.FinalPrice || 0) * quantity).toFixed(2);
    li.innerHTML = `
      <div class="item-info">
        <h4>${item.Name}</h4>
        <p class="item-color">${item.Colors?.[0]?.ColorName || "Standard"}</p>
        <p class="item-qty">Qty: ${quantity}</p>
      </div>
      <div class="item-price">
        <span class="item-cost">$${itemTotal}</span>
      </div>
    `;
    cartList.appendChild(li);
  });
}

/**
 * Calculate and display order totals
 */
function calculateTotals() {
  const cartItems = cartManager.getCartItems();

  // Calculate subtotal with quantities
  const subtotal = cartItems.reduce((sum, item) => {
    const quantity = item.Quantity || 1;
    return sum + (parseFloat(item.FinalPrice || 0) * quantity);
  }, 0);

  // Fixed shipping cost
  const shipping = subtotal > 0 ? 10.0 : 0;

  // Total
  const total = subtotal + shipping;

  // Update display
  const subtotalEl = document.querySelector(".order-summary .subtotal");
  const shippingEl = document.querySelector(".order-summary .shipping");
  const totalEl = document.querySelector(".order-summary .total");

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

/**
 * Initialize checkout page
 */
function initCheckout() {
  // Display cart items
  displayCartItems();

  // Calculate totals
  calculateTotals();

  // Initialize form handler
  try {
    new CheckoutFormHandler();
  } catch (error) {
    console.error("Error initializing checkout form:", error);
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCheckout);
} else {
  initCheckout();
}
