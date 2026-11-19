/**
 * Event Handler Module
 * Manages event listeners for product interactions (View Details, Add to Cart, etc.)
 */

import ProductDetailsRenderer from "./productDetails.mjs";

class EventHandler {
  constructor() {
    this.detailsRenderer = new ProductDetailsRenderer();
    this.setupEventListeners();
  }

  /**
   * Setup all event listeners with event delegation
   */
  setupEventListeners() {
    // Event delegation for View Details buttons and Add to Cart
    document.addEventListener("click", (e) => {
      if (e.target.closest(".view-details-btn")) {
        this.handleViewDetailsClick(e);
      } else if (e.target.closest(".add-to-cart-btn")) {
        this.handleAddToCartClick(e);
      }
    });
  }

  /**
   * Handle View Details button click
   * @param {Event} event - Click event
   */
  handleViewDetailsClick(event) {
    event.preventDefault();

    const button = event.target.closest(".view-details-btn");
    const productId = button.dataset.id;
    const category = button.dataset.category;

    if (productId && category) {
      this.detailsRenderer.loadProductDetails(productId, category);
    } else {
      console.error("Missing product ID or category data");
    }
  }

  /**
   * Handle Add to Cart button click
   * @param {Event} event - Click event
   */
  handleAddToCartClick(event) {
    event.preventDefault();
    this.detailsRenderer.addCurrentProductToCart();
  }
}

export default EventHandler;
