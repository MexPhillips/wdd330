/**
 * Inventory Form Handler Module
 * Manages form submission, validation display, and user feedback
 */

import FormValidator from "./formValidator.mjs";
import { qs } from "./utils.mjs";

export class InventoryFormHandler {
  constructor(inventoryManager, inventoryRenderer) {
    this.inventoryManager = inventoryManager;
    this.inventoryRenderer = inventoryRenderer;
    this.validator = new FormValidator();
    this.form = qs(".inventory-form");
    this.editingProductId = null;
    this.setupEventListeners();
  }

  /**
   * Setup all form event listeners
   */
  setupEventListeners() {
    // Form submission
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));

    // Real-time validation on blur
    this.form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("change", () => this.clearFieldError(field));
    });

    // Listen for edit product event from renderer
    document.addEventListener("edit-product", (e) => {
      this.populateFormForEdit(e.detail.product);
    });

    // Cancel edit button
    const cancelBtn = qs(".btn-cancel-edit");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.resetForm());
    }

    // Category change
    const categorySelect = qs('select[name="category"]');
    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        this.inventoryManager.switchCategory(e.target.value);
        this.inventoryRenderer.render();
        this.inventoryRenderer.updateCountDisplay();
      });
    }
  }

  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = this.getFormData();

    // Validate form
    const validation = this.validator.validateForm(formData);

    if (!validation.isValid) {
      this.displayValidationErrors(validation.errors);
      return;
    }

    // Clear previous errors
    this.clearAllErrors();

    // Add or update product
    let result;
    if (this.editingProductId) {
      result = this.inventoryManager.updateProduct(
        this.editingProductId,
        formData
      );
    } else {
      result = this.inventoryManager.addProduct(formData);
    }

    if (result.success) {
      this.displaySuccess(result.message);
      this.resetForm();
      this.inventoryRenderer.render();
      this.inventoryRenderer.updateCountDisplay();
    } else {
      this.displayError(result.message);
    }
  }

  /**
   * Get form data as object
   * @returns {Object} Form data
   */
  getFormData() {
    return {
      productName: qs('input[name="product-name"]').value,
      category: qs('select[name="category"]').value,
      price: qs('input[name="price"]').value,
      description: qs('textarea[name="description"]').value,
      imageUrl: qs('input[name="image-url"]').value,
    };
  }

  /**
   * Validate single field
   * @param {HTMLElement} field - Form field element
   */
  validateField(field) {
    const fieldName = field.name;

    if (!fieldName) return;

    // Map HTML field names to validator field names
    const fieldMap = {
      "product-name": "productName",
      category: "category",
      price: "price",
      description: "description",
      "image-url": "imageUrl",
    };

    const validatorFieldName = fieldMap[fieldName];
    if (!validatorFieldName) return;

    // Validate using form data
    const formData = this.getFormData();
    const validation = this.validator.validateForm(formData);

    if (validation.errors[validatorFieldName]) {
      this.displayFieldError(field, validation.errors[validatorFieldName]);
    } else {
      this.clearFieldError(field);
    }
  }

  /**
   * Display validation errors
   * @param {Object} errors - Errors object
   */
  displayValidationErrors(errors) {
    const fieldMap = {
      productName: 'input[name="product-name"]',
      category: 'select[name="category"]',
      price: 'input[name="price"]',
      description: 'textarea[name="description"]',
      imageUrl: 'input[name="image-url"]',
    };

    Object.entries(errors).forEach(([field, message]) => {
      const selector = fieldMap[field];
      if (selector) {
        const element = qs(selector);
        this.displayFieldError(element, message);
      }
    });

    this.displayError("Please fix the errors below before submitting");
  }

  /**
   * Display error on specific field
   * @param {HTMLElement} field - Form field
   * @param {String} message - Error message
   */
  displayFieldError(field, message) {
    const fieldGroup = field.closest(".form-group");
    if (!fieldGroup) return;

    // Add error class
    fieldGroup.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");

    // Create/update error message
    let errorEl = fieldGroup.querySelector(".error-message");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.className = "error-message";
      errorEl.setAttribute("role", "alert");
      fieldGroup.appendChild(errorEl);
    }

    errorEl.textContent = message;
  }

  /**
   * Clear error from specific field
   * @param {HTMLElement} field - Form field
   */
  clearFieldError(field) {
    const fieldGroup = field.closest(".form-group");
    if (!fieldGroup) return;

    fieldGroup.classList.remove("has-error");
    field.setAttribute("aria-invalid", "false");

    const errorEl = fieldGroup.querySelector(".error-message");
    if (errorEl) {
      errorEl.remove();
    }
  }

  /**
   * Clear all validation errors
   */
  clearAllErrors() {
    this.form.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("has-error");
      const field = group.querySelector("input, textarea, select");
      if (field) {
        field.setAttribute("aria-invalid", "false");
      }
      const errorEl = group.querySelector(".error-message");
      if (errorEl) {
        errorEl.remove();
      }
    });
  }

  /**
   * Populate form for editing product
   * @param {Object} product - Product to edit
   */
  populateFormForEdit(product) {
    qs('input[name="product-name"]').value = product.Name;
    qs('select[name="category"]').value = product.category || "tents";
    qs('input[name="price"]').value = product.FinalPrice;
    qs('textarea[name="description"]').value = product.DescriptionHtmlSimple;
    qs('input[name="image-url"]').value = product.Image;

    // Update form title and button
    const formTitle = qs(".form-title");
    if (formTitle) {
      formTitle.textContent = "Edit Product";
    }

    const submitBtn = qs('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = "Update Product";
    }

    // Show cancel button
    const cancelBtn = qs(".btn-cancel-edit");
    if (cancelBtn) {
      cancelBtn.style.display = "inline-block";
    }

    // Scroll to form
    this.form.scrollIntoView({ behavior: "smooth" });
    this.editingProductId = product.Id;

    // Focus on first field
    qs('input[name="product-name"]').focus();
  }

  /**
   * Reset form to default state
   */
  resetForm() {
    this.form.reset();
    this.clearAllErrors();
    this.editingProductId = null;

    // Update form title and button
    const formTitle = qs(".form-title");
    if (formTitle) {
      formTitle.textContent = "Add New Product";
    }

    const submitBtn = qs('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = "Add Product";
    }

    // Hide cancel button
    const cancelBtn = qs(".btn-cancel-edit");
    if (cancelBtn) {
      cancelBtn.style.display = "none";
    }
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
   * @param {String} type - Alert type (success, error)
   * @param {String} message - Alert message
   * @returns {HTMLElement} Alert element
   */
  createAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert--${type}`;
    alert.setAttribute("role", "alert");
    alert.setAttribute("aria-live", "polite");
    alert.textContent = message;
    return alert;
  }
}

export default InventoryFormHandler;
