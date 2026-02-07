/**
 * Main Module
 * Entry point for product page initialization
 * Coordinates product list rendering and event handling
 */

import ProductListRenderer from "./productList.mjs";
import EventHandler from "./eventHandler.mjs";

/**
 * Initialize the product listing page
 */
async function initializePage() {
  try {
    // Render the product list
    const productListRenderer = new ProductListRenderer("tents");
    await productListRenderer.render();

    // Initialize event handlers
    new EventHandler();

    console.log("Product page initialized successfully");
  } catch (error) {
    console.error("Failed to initialize product page:", error);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
