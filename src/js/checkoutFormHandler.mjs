/**
 * Checkout Form Handler Module
 * Manages form interaction, validation, and user feedback
 */

import CheckoutValidator from "./checkoutValidator.mjs";
import CheckoutFeedback from "./checkoutFeedback.mjs";
import { qs } from "./utils.mjs";

export class CheckoutFormHandler {
  constructor() {
    this.form = qs(".checkout-form");
    this.validator = new CheckoutValidator();
    this.feedback = new CheckoutFeedback();
    this.setupEventListeners();
  }

  /**
   * Setup all form event listeners
   */
  setupEventListeners() {
    if (!this.form) {
      console.error("Checkout form not found");
      return;
    }

    // Form submission
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));

    // Real-time validation on blur
    this.form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("blur", () => this.handleFieldBlur(field));
      field.addEventListener("change", () => this.handleFieldChange(field));
      
      // Clear errors on input (for better UX)
      field.addEventListener("input", () => {
        if (this.validator.hasFieldError(field.name)) {
          this.feedback.unmarkFieldValid(field);
        }
      });
    });

    // Format input on the fly
    qs('input[name="cardNumber"]')?.addEventListener("input", (e) =>
      this.formatCardNumber(e.target)
    );
    qs('input[name="expiryDate"]')?.addEventListener("input", (e) =>
      this.formatExpiryDate(e.target)
    );
    qs('input[name="phone"]')?.addEventListener("input", (e) =>
      this.formatPhoneNumber(e.target)
    );
    qs('input[name="zipCode"]')?.addEventListener("input", (e) =>
      this.formatZipCode(e.target)
    );
  }

  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  handleFormSubmit(e) {
    e.preventDefault();

    // Clear previous feedback
    this.feedback.clearFormAlerts();
    this.feedback.clearAllFieldErrors();

    // Get form data
    const formData = this.getFormData();

    // Validate entire form
    const validation = this.validator.validateForm(formData);

    if (!validation.isValid) {
      this.displayValidationErrors(validation.errors);
      return;
    }

    // Form is valid - process submission
    this.processCheckout(formData);
  }

  /**
   * Get all form data
   * @returns {Object} Form data object
   */
  getFormData() {
    return {
      firstName: qs('input[name="firstName"]').value,
      lastName: qs('input[name="lastName"]').value,
      email: qs('input[name="email"]').value,
      phone: qs('input[name="phone"]').value,
      address: qs('input[name="address"]').value,
      city: qs('input[name="city"]').value,
      state: qs('select[name="state"]').value,
      zipCode: qs('input[name="zipCode"]').value,
      cardName: qs('input[name="cardName"]').value,
      cardNumber: qs('input[name="cardNumber"]').value,
      expiryDate: qs('input[name="expiryDate"]').value,
      cvv: qs('input[name="cvv"]').value,
    };
  }

  /**
   * Handle field blur event
   * @param {HTMLElement} field - Form field
   */
  handleFieldBlur(field) {
    const fieldName = field.name;
    const formData = this.getFormData();

    // Validate using complete form context
    const validation = this.validator.validateForm(formData);

    if (validation.errors[fieldName]) {
      this.feedback.displayFieldError(field, validation.errors[fieldName]);
    } else {
      this.feedback.clearFieldError(field);
      this.feedback.markFieldValid(field);
    }
  }

  /**
   * Handle field change event
   * @param {HTMLElement} field - Form field
   */
  handleFieldChange(field) {
    // Clear errors when user changes field
    if (this.validator.hasFieldError(field.name)) {
      this.feedback.clearFieldError(field);
    }
  }

  /**
   * Display all validation errors
   * @param {Object} errors - Errors object
   */
  displayValidationErrors(errors) {
    const fieldMap = {
      firstName: 'input[name="firstName"]',
      lastName: 'input[name="lastName"]',
      email: 'input[name="email"]',
      phone: 'input[name="phone"]',
      address: 'input[name="address"]',
      city: 'input[name="city"]',
      state: 'select[name="state"]',
      zipCode: 'input[name="zipCode"]',
      cardName: 'input[name="cardName"]',
      cardNumber: 'input[name="cardNumber"]',
      expiryDate: 'input[name="expiryDate"]',
      cvv: 'input[name="cvv"]',
    };

    // Display field errors
    Object.entries(errors).forEach(([fieldName, message]) => {
      const selector = fieldMap[fieldName];
      if (selector) {
        const field = qs(selector);
        if (field) {
          this.feedback.displayFieldError(field, message);
        }
      }
    });

    // Show overall error message
    const errorCount = Object.keys(errors).length;
    this.feedback.displayFormError(
      `Please fix ${errorCount} field${errorCount !== 1 ? "s" : ""} before submitting`
    );
  }

  /**
   * Process checkout (submit form)
   * @param {Object} formData - Form data
   */
  processCheckout(formData) {
    // Disable form while processing
    this.feedback.disableForm();

    // Simulate API call
    setTimeout(() => {
      const orderNumber = this.generateOrderNumber();
      const message = `Order ${orderNumber} confirmed! Check your email for confirmation.`;

      this.feedback.displaySuccess(message);
      this.feedback.announce(message);

      // Reset form after success
      setTimeout(() => {
        this.resetForm();
        this.feedback.enableForm();
      }, 2000);
    }, 1000);
  }

  /**
   * Generate order number
   * @returns {String} Order number
   */
  generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    return `${timestamp}${random}`;
  }

  /**
   * Reset form to initial state
   */
  resetForm() {
    this.form.reset();
    this.feedback.clearFormAlerts();
    this.feedback.clearAllFieldErrors();
    this.validator.clearErrors();

    // Remove valid markings
    this.form.querySelectorAll(".has-valid").forEach((group) => {
      group.classList.remove("has-valid");
    });
  }

  /**
   * Format credit card number with spaces
   * @param {HTMLElement} field - Card number field
   */
  formatCardNumber(field) {
    let value = field.value.replace(/\s/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    field.value = value;
  }

  /**
   * Format expiry date as MM/YY
   * @param {HTMLElement} field - Expiry date field
   */
  formatExpiryDate(field) {
    let value = field.value.replace(/\D/g, "");

    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }

    field.value = value;
  }

  /**
   * Format phone number
   * @param {HTMLElement} field - Phone field
   */
  formatPhoneNumber(field) {
    let value = field.value.replace(/\D/g, "");

    if (value.length > 3 && value.length <= 6) {
      value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
    } else if (value.length > 6) {
      value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
    }

    field.value = value;
  }

  /**
   * Format zip code
   * @param {HTMLElement} field - Zip code field
   */
  formatZipCode(field) {
    let value = field.value.replace(/\D/g, "");

    if (value.length > 5) {
      value = value.substring(0, 5) + "-" + value.substring(5, 9);
    } else {
      value = value.substring(0, 5);
    }

    field.value = value;
  }
}

export default CheckoutFormHandler;
