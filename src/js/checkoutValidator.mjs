/**
 * Checkout Form Validator Module
 * Handles all form validation logic for checkout
 */

export class CheckoutValidator {
  constructor() {
    this.errors = {};
    this.validationRules = this.initializeRules();
  }

  /**
   * Initialize validation rules
   * @returns {Object} Validation rules for each field
   */
  initializeRules() {
    return {
      firstName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
      },
      lastName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      phone: {
        required: true,
        minLength: 10,
        pattern: /^[\d\s\-\(\)\+]+$/,
      },
      address: {
        required: true,
        minLength: 5,
        maxLength: 100,
      },
      city: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      state: {
        required: true,
        minLength: 2,
        maxLength: 2,
        pattern: /^[A-Z]{2}$/,
      },
      zipCode: {
        required: true,
        pattern: /^\d{5}(-\d{4})?$/,
      },
      cardName: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      cardNumber: {
        required: true,
        pattern: /^[\d\s]{13,19}$/,
        customValidator: this.validateCardNumber.bind(this),
      },
      expiryDate: {
        required: true,
        pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
        customValidator: this.validateExpiryDate.bind(this),
      },
      cvv: {
        required: true,
        pattern: /^\d{3,4}$/,
      },
    };
  }

  /**
   * Validate entire form
   * @param {Object} formData - Form data to validate
   * @returns {Object} Validation result {isValid: boolean, errors: Object}
   */
  validateForm(formData) {
    this.errors = {};

    // Validate each field
    Object.keys(this.validationRules).forEach((fieldName) => {
      this.validateField(fieldName, formData[fieldName]);
    });

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors,
    };
  }

  /**
   * Validate single field
   * @param {String} fieldName - Field name
   * @param {String} value - Field value
   */
  validateField(fieldName, value) {
    const rules = this.validationRules[fieldName];

    if (!rules) return;

    // Check required
    if (rules.required && (!value || value.trim() === "")) {
      this.errors[fieldName] = `${this.formatFieldName(fieldName)} is required`;
      return;
    }

    // Check min length
    if (rules.minLength && value.length < rules.minLength) {
      this.errors[fieldName] = `${this.formatFieldName(fieldName)} must be at least ${rules.minLength} characters`;
      return;
    }

    // Check max length
    if (rules.maxLength && value.length > rules.maxLength) {
      this.errors[fieldName] = `${this.formatFieldName(fieldName)} cannot exceed ${rules.maxLength} characters`;
      return;
    }

    // Check pattern
    if (rules.pattern && value && !rules.pattern.test(value)) {
      this.errors[fieldName] = this.getPatternErrorMessage(fieldName);
      return;
    }

    // Check custom validator
    if (rules.customValidator && value) {
      const customError = rules.customValidator(value);
      if (customError) {
        this.errors[fieldName] = customError;
        return;
      }
    }
  }

  /**
   * Validate credit card using Luhn algorithm
   * @param {String} cardNumber - Credit card number
   * @returns {String|null} Error message or null
   */
  validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, "");

    // Check length (13-19 digits)
    if (cleaned.length < 13 || cleaned.length > 19) {
      return "Credit card number must be 13-19 digits";
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return "Credit card number is invalid";
    }

    return null;
  }

  /**
   * Validate expiry date (not expired)
   * @param {String} expiryDate - Expiry date in MM/YY format
   * @returns {String|null} Error message or null
   */
  validateExpiryDate(expiryDate) {
    const [month, year] = expiryDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expireYear = parseInt(year, 10);
    const expireMonth = parseInt(month, 10);

    // Check if expired
    if (
      expireYear < currentYear ||
      (expireYear === currentYear && expireMonth < currentMonth)
    ) {
      return "Card has expired";
    }

    return null;
  }

  /**
   * Get pattern error message based on field
   * @param {String} fieldName - Field name
   * @returns {String} Error message
   */
  getPatternErrorMessage(fieldName) {
    const messages = {
      firstName: "First name must contain only letters, spaces, apostrophes, and hyphens",
      lastName: "Last name must contain only letters, spaces, apostrophes, and hyphens",
      email: "Please enter a valid email address",
      phone: "Phone number must be at least 10 digits",
      state: "State must be 2-letter abbreviation (e.g., UT, CA)",
      zipCode: "Zip code must be 5 digits or 5+4 format",
      cardNumber: "Card number must be 13-19 digits",
      expiryDate: "Expiry date must be in MM/YY format",
      cvv: "CVV must be 3-4 digits",
    };

    return (
      messages[fieldName] ||
      `${this.formatFieldName(fieldName)} format is invalid`
    );
  }

  /**
   * Format field name for display
   * @param {String} fieldName - Field name
   * @returns {String} Formatted field name
   */
  formatFieldName(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Get error for specific field
   * @param {String} fieldName - Field name
   * @returns {String|null} Error message or null
   */
  getFieldError(fieldName) {
    return this.errors[fieldName] || null;
  }

  /**
   * Check if field has error
   * @param {String} fieldName - Field name
   * @returns {Boolean} True if field has error
   */
  hasFieldError(fieldName) {
    return fieldName in this.errors;
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = {};
  }

  /**
   * Clear specific field error
   * @param {String} fieldName - Field name
   */
  clearFieldError(fieldName) {
    delete this.errors[fieldName];
  }
}

export default CheckoutValidator;
