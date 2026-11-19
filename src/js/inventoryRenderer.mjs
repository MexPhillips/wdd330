/**
 * Inventory Renderer Module
 * Handles rendering inventory to the DOM
 */

import { qs } from "./utils.mjs";

export class InventoryRenderer {
  constructor(inventoryManager) {
    this.inventoryManager = inventoryManager;
    this.inventoryContainer = qs(".inventory-list");
  }

  /**
   * Render all inventory items to DOM
   */
  render() {
    try {
      const products = this.inventoryManager.getAll();

      if (products.length === 0) {
        this.renderEmptyState();
        return;
      }

      this.inventoryContainer.innerHTML = "";
      const itemsHTML = products
        .map((product) => this.createInventoryItem(product))
        .join("");

      this.inventoryContainer.insertAdjacentHTML("beforeend", itemsHTML);
      this.attachEventListeners();
    } catch (error) {
      console.error("Error rendering inventory:", error);
      this.displayError("Failed to render inventory");
    }
  }

  /**
   * Create HTML for single inventory item
   * @param {Object} product - Product object
   * @returns {String} HTML string
   */
  createInventoryItem(product) {
    const createdDate = product.createdAt
      ? new Date(product.createdAt).toLocaleDateString()
      : "N/A";

    return `
      <div class="inventory-item" data-product-id="${product.Id}">
        <div class="inventory-item__image">
          <img src="${product.Image}" alt="${product.Name}" />
        </div>
        
        <div class="inventory-item__info">
          <h3 class="inventory-item__name">${this.escapeHtml(product.Name)}</h3>
          <p class="inventory-item__price">$${product.FinalPrice.toFixed(2)}</p>
          <p class="inventory-item__description">
            ${this.escapeHtml(product.DescriptionHtmlSimple.substring(0, 100))}...
          </p>
          <p class="inventory-item__date">Added: ${createdDate}</p>
        </div>

        <div class="inventory-item__actions">
          <button 
            class="btn btn-edit" 
            data-action="edit" 
            data-product-id="${product.Id}"
            aria-label="Edit product ${this.escapeHtml(product.Name)}"
          >
            Edit
          </button>
          <button 
            class="btn btn-delete" 
            data-action="delete" 
            data-product-id="${product.Id}"
            aria-label="Delete product ${this.escapeHtml(product.Name)}"
          >
            Delete
          </button>
          <button 
            class="btn btn-view" 
            data-action="view" 
            data-product-id="${product.Id}"
            aria-label="View details for ${this.escapeHtml(product.Name)}"
          >
            View Details
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render empty state message
   */
  renderEmptyState() {
    this.inventoryContainer.innerHTML = `
      <div class="inventory-empty" role="status" aria-live="polite">
        <p>No products in inventory yet.</p>
        <p>Use the form above to add your first product!</p>
      </div>
    `;
  }

  /**
   * Attach event listeners to action buttons
   */
  attachEventListeners() {
    this.inventoryContainer.addEventListener("click", (e) => {
      const editBtn = e.target.closest("[data-action='edit']");
      const deleteBtn = e.target.closest("[data-action='delete']");
      const viewBtn = e.target.closest("[data-action='view']");

      if (editBtn) {
        this.handleEdit(editBtn.dataset.productId);
      } else if (deleteBtn) {
        this.handleDelete(deleteBtn.dataset.productId);
      } else if (viewBtn) {
        this.handleView(viewBtn.dataset.productId);
      }
    });
  }

  /**
   * Handle edit action
   * @param {String} productId - Product ID
   */
  handleEdit(productId) {
    const product = this.inventoryManager.getById(productId);
    if (!product) {
      this.displayError("Product not found");
      return;
    }

    // Dispatch custom event for form handler to listen
    const event = new CustomEvent("edit-product", {
      detail: { product },
    });
    document.dispatchEvent(event);
  }

  /**
   * Handle delete action
   * @param {String} productId - Product ID
   */
  handleDelete(productId) {
    const product = this.inventoryManager.getById(productId);
    if (!product) {
      this.displayError("Product not found");
      return;
    }

    // Confirm before deleting
    const confirmed = confirm(
      `Are you sure you want to delete "${product.Name}"?`
    );
    if (!confirmed) return;

    const result = this.inventoryManager.deleteProduct(productId);
    if (result.success) {
      this.displaySuccess(result.message);
      this.render();
    } else {
      this.displayError(result.message);
    }
  }

  /**
   * Handle view action
   * @param {String} productId - Product ID
   */
  handleView(productId) {
    const product = this.inventoryManager.getById(productId);
    if (!product) {
      this.displayError("Product not found");
      return;
    }

    // Show modal or details view
    this.displayProductDetails(product);
  }

  /**
   * Display full product details in modal
   * @param {Object} product - Product object
   */
  displayProductDetails(product) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal__content">
        <button class="modal__close" aria-label="Close modal">×</button>
        
        <div class="modal__body">
          <img src="${product.Image}" alt="${product.Name}" class="modal__image" />
          
          <div class="modal__details">
            <h2>${this.escapeHtml(product.Name)}</h2>
            <p class="modal__price"><strong>Price:</strong> $${product.FinalPrice.toFixed(2)}</p>
            <p class="modal__category"><strong>Category:</strong> ${product.category || "N/A"}</p>
            
            <div class="modal__description">
              <strong>Description:</strong>
              <p>${this.escapeHtml(product.DescriptionHtmlSimple)}</p>
            </div>
            
            ${
              product.createdAt
                ? `<p class="modal__date"><strong>Added:</strong> ${new Date(product.createdAt).toLocaleString()}</p>`
                : ""
            }
          </div>
        </div>

        <div class="modal__actions">
          <button class="btn btn-secondary modal__close-btn">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal on button click or overlay click
    const closeButtons = modal.querySelectorAll("[class$='close'], .modal__close-btn");
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => modal.remove());
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  /**
   * Display success message
   * @param {String} message - Success message
   */
  displaySuccess(message) {
    const alert = this.createAlert("success", message);
    document.body.insertAdjacentElement("afterbegin", alert);

    setTimeout(() => alert.remove(), 4000);
  }

  /**
   * Display error message
   * @param {String} message - Error message
   */
  displayError(message) {
    const alert = this.createAlert("error", message);
    document.body.insertAdjacentElement("afterbegin", alert);

    setTimeout(() => alert.remove(), 4000);
  }

  /**
   * Create alert element
   * @param {String} type - Alert type (success, error, warning)
   * @param {String} message - Alert message
   * @returns {HTMLElement} Alert element
   */
  createAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert--${type}`;
    alert.setAttribute("role", "alert");
    alert.textContent = message;
    return alert;
  }

  /**
   * Escape HTML to prevent XSS
   * @param {String} text - Text to escape
   * @returns {String} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Update inventory count display
   */
  updateCountDisplay() {
    const countElement = qs(".inventory-count");
    if (countElement) {
      const count = this.inventoryManager.getCount();
      countElement.textContent = count;
    }
  }
}

export default InventoryRenderer;
