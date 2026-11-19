/**
 * Cart Manager Module
 * Handles all shopping cart operations including add, remove, and retrieval from localStorage
 */

import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class CartManager {
  constructor(storageKey = 'so-cart') {
    this.storageKey = storageKey;
  }

  /**
   * Get all items currently in the cart
   * @returns {Array} Array of cart items
   */
  getCartItems() {
    return getLocalStorage(this.storageKey) || [];
  }

  /**
   * Add a product to the cart
   * @param {Object} product - Product object to add
   * @returns {Array} Updated cart items
   */
  addToCart(product) {
    if (!product) {
      return this.getCartItems();
    }

    const cart = this.getCartItems();
    
    // Check if product already exists in cart (by Id)
    const existingIndex = cart.findIndex(item => item.Id === product.Id);
    
    if (existingIndex > -1) {
      // If product exists, increment quantity
      cart[existingIndex].Quantity = (cart[existingIndex].Quantity || 1) + 1;
    } else {
      // Add new product with quantity 1
      product.Quantity = 1;
      cart.push(product);
    }
    
    this.saveCart(cart);
    this.notifyListeners('cartUpdated', { cart, action: 'add', product });
    return cart;
  }

  /**
   * Remove a product from cart by product Id
   * @param {string} productId - The product ID to remove
   * @returns {Array} Updated cart items
   */
  removeFromCart(productId) {
    let cart = this.getCartItems();
    cart = cart.filter(item => item.Id !== productId);
    this.saveCart(cart);
    this.notifyListeners('cartUpdated', { cart, action: 'remove', productId });
    return cart;
  }

  /**
   * Update quantity of a product in cart
   * @param {string} productId - The product ID
   * @param {number} quantity - New quantity (0 or negative will remove the item)
   * @returns {Array} Updated cart items
   */
  updateQuantity(productId, quantity) {
    let cart = this.getCartItems();
    const itemIndex = cart.findIndex(item => item.Id === productId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].Quantity = quantity;
      }
    }
    
    this.saveCart(cart);
    this.notifyListeners('cartUpdated', { cart, action: 'updateQuantity', productId, quantity });
    return cart;
  }

  /**
   * Clear all items from the cart
   * @returns {Array} Empty cart
   */
  clearCart() {
    this.saveCart([]);
    this.notifyListeners('cartUpdated', { cart: [], action: 'clear' });
    return [];
  }

  /**
   * Get the number of items in the cart
   * @returns {number} Total item count
   */
  getItemCount() {
    const cart = this.getCartItems();
    return cart.reduce((count, item) => count + (item.Quantity || 1), 0);
  }

  /**
   * Get the total price of all items in cart
   * @returns {number} Total price
   */
  getCartTotal() {
    const cart = this.getCartItems();
    return cart.reduce((total, item) => {
      const price = item.FinalPrice || item.Price || 0;
      const quantity = item.Quantity || 1;
      return total + (price * quantity);
    }, 0);
  }

  /**
   * Save cart to localStorage
   * @private
   * @param {Array} cart - Cart items to save
   */
  saveCart(cart) {
    setLocalStorage(this.storageKey, cart);
  }

  /**
   * Listen for cart updates
   * @param {string} eventType - Event type to listen for
   * @param {Function} callback - Callback function
   */
  onCartUpdate(eventType, callback) {
    if (!this.listeners) {
      this.listeners = {};
    }
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  /**
   * Notify all listeners of a cart update
   * @private
   * @param {string} eventType - Event type
   * @param {Object} data - Event data
   */
  notifyListeners(eventType, data) {
    if (!this.listeners || !this.listeners[eventType]) return;
    this.listeners[eventType].forEach(callback => callback(data));
  }

  /**
   * Get formatted cart total
   * @returns {string} Formatted total price
   */
  getFormattedTotal() {
    return `$${this.getCartTotal().toFixed(2)}`;
  }
}
