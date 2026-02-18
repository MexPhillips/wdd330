/**
 * Cart Header Module
 * Manages the cart badge and header cart functionality across all pages
 */

import CartManager from './cartManager.mjs';

export default class CartHeader {
  constructor() {
    this.cartManager = new CartManager();
    this.badge = document.querySelector('.cart-badge');
    this.init();
  }

  /**
   * Initialize cart header
   */
  init() {
    this.updateBadge();
    
    // Listen for storage changes (for multi-tab updates)
    window.addEventListener('storage', () => this.updateBadge());
    
    // Listen for cart updates
    this.cartManager.onCartUpdate('cartUpdated', () => this.updateBadge());
  }

  /**
   * Update cart badge with current item count
   */
  updateBadge() {
    if (!this.badge) return;
    
    const count = this.cartManager.getItemCount();
    this.badge.textContent = count;
    this.badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CartHeader();
  });
} else {
  new CartHeader();
}
