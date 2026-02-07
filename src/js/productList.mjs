/**
 * Product List Module
 * Handles fetching and rendering product lists dynamically using template elements
 */

import ProductData from "./ProductData.mjs";
import { qs } from "./utils.mjs";

class ProductListRenderer {
  constructor(category = "tents") {
    this.category = category;
    this.dataSource = new ProductData(category);
  }

  /**
   * Render product list by fetching data and populating template
   */
  async render() {
    try {
      const products = await this.dataSource.getData();
      this.displayProductList(products);
    } catch (error) {
      console.error("Error loading products:", error);
      this.displayErrorMessage(
        "Failed to load products. Please try again later."
      );
    }
  }

  /**
   * Display product list using template element
   * @param {Array} products - Array of product objects
   */
  displayProductList(products) {
    const productList = qs(".product-list");
    
    // Clear existing content
    productList.innerHTML = "";

    // Generate HTML from template for each product
    const productHTML = products.map((product) =>
      this.createProductCard(product)
    );

    productList.insertAdjacentHTML("beforeend", productHTML.join(""));
  }

  /**
   * Create a product card using template element
   * @param {Object} product - Product object
   * @returns {String} HTML string of product card
   */
  createProductCard(product) {
    const template = qs(".product-template");
    if (!template) {
      console.error("Product template not found");
      return "";
    }

    // Clone template content
    const clone = template.content.cloneNode(true);

    // Populate template with product data
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

    // Set data attributes for event delegation
    clone.querySelector(".view-details-btn").dataset.id = product.Id;
    clone.querySelector(".view-details-btn").dataset.category = this.category;

    // Convert clone to HTML string
    const tempDiv = document.createElement("div");
    tempDiv.appendChild(clone);
    return tempDiv.innerHTML;
  }

  /**
   * Display error message to user
   * @param {String} message - Error message
   */
  displayErrorMessage(message) {
    const productList = qs(".product-list");
    productList.innerHTML = `<li class="error-message"><p>${message}</p></li>`;
  }
}

export default ProductListRenderer;
