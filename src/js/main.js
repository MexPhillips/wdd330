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

    // Display featured products from all categories mixed together
    displayFeaturedProducts(allProducts);

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
 * Display featured products on home page
 * @param {Array} allProducts - All products from all categories
 */
function displayFeaturedProducts(allProducts) {
  const productList = document.querySelector(".product-list");
  if (!productList) return;
  
  // Clear existing content
  productList.innerHTML = "";
  
  // Limit to first 12 products for featured display
  const featuredProducts = allProducts.slice(0, 12);
  
  // Create product cards
  const template = document.querySelector(".product-template");
  if (!template) return;
  
  featuredProducts.forEach((product) => {
    const clone = template.content.cloneNode(true);
    
    const card = clone.querySelector(".product-card");
    card.dataset.id = product.Id;
    
    clone.querySelector(".card__brand").textContent =
      product.Brand?.Name || "Unknown Brand";
    clone.querySelector(".card__name").textContent =
      product.NameWithoutBrand || product.Name;
    clone.querySelector(".product-card__price").textContent =
      `$${product.FinalPrice.toFixed(2)}`;
    clone.querySelector(".product-image").src = product.Image;
    clone.querySelector(".product-image").alt = product.Name;
    
    productList.appendChild(clone);
  });
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
