import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import CartManager from "./cartManager.mjs";

const dataSource = new ProductData();
const cartManager = new CartManager();

/**
 * Add product to cart and show feedback
 * @param {Object} product - Product object to add
 */
function addProductToCart(product) {
  if (!product) return;
  
  cartManager.addToCart(product);
  
  // Visual feedback
  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) {
    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = "✓ Added to Cart!";
    addToCartBtn.classList.add("btn-success");
    
    setTimeout(() => {
      addToCartBtn.textContent = originalText;
      addToCartBtn.classList.remove("btn-success");
    }, 2000);
  }
  
  // Update cart badge if it exists
  updateCartBadge();
}

/**
 * Update cart badge with item count
 */
function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (badge) {
    const count = cartManager.getItemCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

/**
 * Handle add to cart button click
 * @param {Event} e - Click event
 */
async function addToCartHandler(e) {
  e.preventDefault();
  const productId = e.target.dataset.id;
  const category = e.target.dataset.category || "tents";
  
  try {
    const product = await dataSource.findProductById(productId, category);
    if (product) {
      addProductToCart(product);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

/**
 * Initialize add to cart functionality
 */
function initializeAddToCart() {
  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCartHandler);
  }
  
  // Update badge on page load
  updateCartBadge();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAddToCart);
} else {
  initializeAddToCart();
}
