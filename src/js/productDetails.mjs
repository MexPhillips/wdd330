/**
 * Product Details Module
 * Handles fetching and rendering individual product details
 */

import ProductData from "./ProductData.mjs";
import CartManager from "./cartManager.mjs";
import { qs } from "./utils.mjs";

class ProductDetailsRenderer {
  constructor() {
    this.detailsContainer = qs(".product-details");
    this.currentProduct = null;
    this.cartManager = new CartManager();
  }

  /**
   * Load and display product details by ID
   * @param {String} productId - Product ID
   * @param {String} category - Product category (tents, backpacks, sleeping-bags)
   */
  async loadProductDetails(productId, category) {
    try {
      const dataSource = new ProductData();
      const product = await dataSource.findProductById(productId, category);

      if (product) {
        this.displayProductDetails(product);
        this.scrollToDetails();
      } else {
        this.displayErrorMessage("Product not found");
      }
    } catch (error) {
      console.error("Error loading product details:", error);
      this.displayErrorMessage(
        "Failed to load product details. Please try again."
      );
    }
  }

  /**
   * Display product details using template element
   * @param {Object} product - Product object
   */
  displayProductDetails(product) {
    const template = qs(".product-details-template");
    if (!template) {
      console.error("Product details template not found");
      return;
    }

    // Store the current product for add to cart functionality
    this.currentProduct = product;

    // Clone template content
    const clone = template.content.cloneNode(true);

    // Populate template with product data
    clone.querySelector(".details-title").textContent =
      product.Name || "Product Details";
    clone.querySelector(".details-price").textContent =
      `$${product.FinalPrice.toFixed(2)}`;
    clone.querySelector(".details-description").innerHTML =
      product.DescriptionHtmlSimple || "No description available";
    clone.querySelector(".details-image").src = product.Image;
    clone.querySelector(".details-image").alt = product.Name;

    // Display color information
    const colorInfo = clone.querySelector(".details-color");
    if (product.Colors && product.Colors.length > 0) {
      colorInfo.textContent = `Color: ${product.Colors[0].ColorName}`;
    }

    // Display original/suggested retail price if available
    if (product.SuggestedRetailPrice && product.SuggestedRetailPrice > product.FinalPrice) {
      const msrpSection = clone.querySelector(".details-msrp");
      if (msrpSection) {
        msrpSection.innerHTML = `<p><strong>MSRP:</strong> $${product.SuggestedRetailPrice.toFixed(2)}</p>`;
      }
    }

    // Add click handler to add to cart button
    const addToCartBtn = clone.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => this.addCurrentProductToCart());
    }

    // Clear previous content and insert new details
    this.detailsContainer.innerHTML = "";
    this.detailsContainer.appendChild(clone);
  }

  /**
   * Add the currently displayed product to cart
   */
  addCurrentProductToCart() {
    if (!this.currentProduct) {
      console.error("No product currently displayed");
      alert("Please select a product first");
      return;
    }

    this.cartManager.addToCart(this.currentProduct);

    // Show confirmation message
    const message = document.createElement("div");
    message.className = "cart-notification";
    message.textContent = `${this.currentProduct.Name} added to cart!`;
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4caf50;
      color: white;
      padding: 15px 20px;
      border-radius: 4px;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(message);

    // Remove message after 3 seconds
    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  /**
   * Display error message in details container
   * @param {String} message - Error message
   */
  displayErrorMessage(message) {
    this.detailsContainer.innerHTML = `<div class="error-message"><p>${message}</p></div>`;
  }

  /**
   * Scroll to product details section
   */
  scrollToDetails() {
    this.detailsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default ProductDetailsRenderer;
