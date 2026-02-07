/**
 * Form Validator Module
 * Handles all form validation logic for product creation
 */

export class FormValidator {
  constructor() {
    this.errors = {};
  }

  /**
   * Validate all form fields
   * @param {Object} formData - Form data to validate
   * @returns {Object} Validation result {isValid: boolean, errors: Object}
   */
  validateForm(formData) {
    this.errors = {};

    this.validateProductName(formData.productName);
    this.validateCategory(formData.category);
    this.validatePrice(formData.price);
    this.validateDescription(formData.description);
    this.validateImageUrl(formData.imageUrl);

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors,
    };
  }

  /**
   * Validate product name field
   * @param {String} name - Product name
   */
  validateProductName(name) {
    if (!name || name.trim() === "") {
      this.errors.productName = "Product name is required";
    } else if (name.trim().length < 3) {
      this.errors.productName = "Product name must be at least 3 characters";
    } else if (name.trim().length > 100) {
      this.errors.productName = "Product name cannot exceed 100 characters";
    }
  }

  /**
   * Validate category field
   * @param {String} category - Product category
   */
  validateCategory(category) {
    const validCategories = ["tents", "backpacks", "sleeping-bags"];
    if (!category || category.trim() === "") {
      this.errors.category = "Please select a category";
    } else if (!validCategories.includes(category.toLowerCase())) {
      this.errors.category = `Category must be one of: ${validCategories.join(", ")}`;
    }
  }

  /**
   * Validate price field
   * @param {String|Number} price - Product price
   */
  validatePrice(price) {
    if (!price || price === "") {
      this.errors.price = "Price is required";
    } else {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum)) {
        this.errors.price = "Price must be a valid number";
      } else if (priceNum <= 0) {
        this.errors.price = "Price must be greater than 0";
      } else if (priceNum > 99999) {
        this.errors.price = "Price cannot exceed $99,999";
      }
    }
  }

  /**
   * Validate description field
   * @param {String} description - Product description
   */
  validateDescription(description) {
    if (!description || description.trim() === "") {
      this.errors.description = "Description is required";
    } else if (description.trim().length < 10) {
      this.errors.description = "Description must be at least 10 characters";
    } else if (description.trim().length > 500) {
      this.errors.description = "Description cannot exceed 500 characters";
    }
  }

  /**
   * Validate image URL field
   * @param {String} imageUrl - Image URL
   */
  validateImageUrl(imageUrl) {
    if (!imageUrl || imageUrl.trim() === "") {
      this.errors.imageUrl = "Image URL is required";
    } else if (!this.isValidUrl(imageUrl)) {
      this.errors.imageUrl = "Image URL must be a valid URL";
    } else if (!this.isValidImageUrl(imageUrl)) {
      this.errors.imageUrl =
        "Image URL must point to a valid image (jpg, png, gif, webp)";
    }
  }

  /**
   * Check if string is valid URL
   * @param {String} string - URL string
   * @returns {Boolean} True if valid URL
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Check if URL points to valid image format
   * @param {String} imageUrl - Image URL
   * @returns {Boolean} True if valid image URL
   */
  isValidImageUrl(imageUrl) {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const url = imageUrl.toLowerCase();
    return imageExtensions.some((ext) => url.includes(ext));
  }

  /**
   * Get validation error for specific field
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
}

export default FormValidator;
