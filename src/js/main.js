/**
 * Main Module
 * Entry point for product page initialization
 * Coordinates product list rendering, search, and event handling
 */

import ProductListRenderer from "./productList.mjs";
import EventHandler from "./eventHandler.mjs";
import SearchEventHandler from "./searchEventHandler.mjs";
import ProductData from "./ProductData.mjs";

/**
 * Initialize the product listing page
 */
async function initializePage() {
  try {
    // Get all products from data sources
    const productData = new ProductData();
    const allProducts = await getAllProducts(productData);

    // Render the product list
    const productListRenderer = new ProductListRenderer("tents");
    await productListRenderer.render();

    // Initialize search functionality
    new SearchEventHandler(allProducts);

    // Initialize event handlers
    new EventHandler();

    console.log("Product page initialized successfully");
  } catch (error) {
    console.error("Failed to initialize product page:", error);
  }
}

/**
 * Get all products from all categories
 * @param {ProductData} productData - ProductData instance
 * @returns {Promise<Array>} All products from all categories
 */
async function getAllProducts(productData) {
  try {
    const tents = await productData.getData("tents");
    const backpacks = await productData.getData("backpacks");
    const sleepingBags = await productData.getData("sleeping-bags");

    return [...tents, ...backpacks, ...sleepingBags];
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return [];
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
