/**
 * Inventory Manager Module
 * Handles inventory data management and localStorage persistence
 */

export class InventoryManager {
  constructor(category = "tents") {
    this.category = category;
    this.storageKey = `so-inventory-${category}`;
    this.inventory = this.loadFromStorage();
  }

  /**
   * Load inventory from localStorage or initialize empty array
   * @returns {Array} Inventory items
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading inventory from localStorage:", error);
      return [];
    }
  }

  /**
   * Save inventory to localStorage
   * @returns {Boolean} True if successful
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.inventory));
      return true;
    } catch (error) {
      console.error("Error saving inventory to localStorage:", error);
      return false;
    }
  }

  /**
   * Add new product to inventory
   * @param {Object} product - Product object with required fields
   * @returns {Object} Result {success: boolean, message: string, product: Object}
   */
  addProduct(product) {
    try {
      // Generate unique ID
      const newId = this.generateUniqueId();

      // Create standardized product object
      const newProduct = {
        Id: newId,
        Name: product.productName,
        NameWithoutBrand: product.productName,
        Image: product.imageUrl,
        FinalPrice: parseFloat(product.price),
        ListPrice: parseFloat(product.price),
        DescriptionHtmlSimple: product.description,
        Brand: {
          Name: "User Added",
        },
        Colors: [
          {
            ColorName: "Standard",
            ColorCode: "01",
          },
        ],
        SizesAvailable: {},
        category: product.category,
        createdAt: new Date().toISOString(),
      };

      // Add to inventory array
      this.inventory.push(newProduct);

      // Save to localStorage
      if (!this.saveToStorage()) {
        throw new Error("Failed to save to localStorage");
      }

      return {
        success: true,
        message: "Product added successfully!",
        product: newProduct,
      };
    } catch (error) {
      console.error("Error adding product:", error);
      return {
        success: false,
        message: `Error adding product: ${error.message}`,
        product: null,
      };
    }
  }

  /**
   * Delete product from inventory
   * @param {String} productId - Product ID to delete
   * @returns {Object} Result {success: boolean, message: string}
   */
  deleteProduct(productId) {
    try {
      const initialLength = this.inventory.length;
      this.inventory = this.inventory.filter((p) => p.Id !== productId);

      if (this.inventory.length === initialLength) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      if (!this.saveToStorage()) {
        throw new Error("Failed to save to localStorage");
      }

      return {
        success: true,
        message: "Product deleted successfully!",
      };
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: `Error deleting product: ${error.message}`,
      };
    }
  }

  /**
   * Update existing product
   * @param {String} productId - Product ID to update
   * @param {Object} updates - Fields to update
   * @returns {Object} Result {success: boolean, message: string, product: Object}
   */
  updateProduct(productId, updates) {
    try {
      const productIndex = this.inventory.findIndex((p) => p.Id === productId);

      if (productIndex === -1) {
        return {
          success: false,
          message: "Product not found",
          product: null,
        };
      }

      // Update product fields
      const updatedProduct = {
        ...this.inventory[productIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      this.inventory[productIndex] = updatedProduct;

      if (!this.saveToStorage()) {
        throw new Error("Failed to save to localStorage");
      }

      return {
        success: true,
        message: "Product updated successfully!",
        product: updatedProduct,
      };
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: `Error updating product: ${error.message}`,
        product: null,
      };
    }
  }

  /**
   * Get all inventory items
   * @returns {Array} All products in inventory
   */
  getAll() {
    return [...this.inventory];
  }

  /**
   * Get product by ID
   * @param {String} productId - Product ID
   * @returns {Object|null} Product object or null if not found
   */
  getById(productId) {
    return this.inventory.find((p) => p.Id === productId) || null;
  }

  /**
   * Get inventory count
   * @returns {Number} Number of items in inventory
   */
  getCount() {
    return this.inventory.length;
  }

  /**
   * Clear all inventory
   * @returns {Object} Result {success: boolean, message: string}
   */
  clearAll() {
    try {
      this.inventory = [];
      if (!this.saveToStorage()) {
        throw new Error("Failed to save to localStorage");
      }
      return {
        success: true,
        message: "Inventory cleared successfully!",
      };
    } catch (error) {
      console.error("Error clearing inventory:", error);
      return {
        success: false,
        message: `Error clearing inventory: ${error.message}`,
      };
    }
  }

  /**
   * Generate unique product ID
   * @returns {String} Unique ID
   */
  generateUniqueId() {
    // Use timestamp + random number for uniqueness
    const timestamp = Date.now().toString(36);
    const randomNum = Math.random().toString(36).substring(2, 8);
    return `${timestamp}${randomNum}`.toUpperCase();
  }

  /**
   * Switch category
   * @param {String} newCategory - New category name
   */
  switchCategory(newCategory) {
    this.category = newCategory;
    this.storageKey = `so-inventory-${newCategory}`;
    this.inventory = this.loadFromStorage();
  }

  /**
   * Export inventory as JSON
   * @returns {String} JSON string of inventory
   */
  exportAsJSON() {
    return JSON.stringify(this.inventory, null, 2);
  }

  /**
   * Import inventory from JSON
   * @param {String} jsonString - JSON string to import
   * @returns {Object} Result {success: boolean, message: string}
   */
  importFromJSON(jsonString) {
    try {
      const imported = JSON.parse(jsonString);

      if (!Array.isArray(imported)) {
        throw new Error("Imported data must be an array");
      }

      this.inventory = imported;
      if (!this.saveToStorage()) {
        throw new Error("Failed to save to localStorage");
      }

      return {
        success: true,
        message: `Imported ${imported.length} products successfully!`,
      };
    } catch (error) {
      console.error("Error importing inventory:", error);
      return {
        success: false,
        message: `Error importing inventory: ${error.message}`,
      };
    }
  }
}

export default InventoryManager;
