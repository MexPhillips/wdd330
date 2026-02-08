/**
 * Product Search Module
 * Handles product filtering and search logic
 * Filters products by name, brand, or category
 */

export class ProductSearch {
  constructor(products = []) {
    this.allProducts = products;
    this.filteredProducts = products;
    this.currentSearch = "";
    this.currentCategory = "";
  }

  /**
   * Set the products to search through
   * @param {Array} products - Array of product objects
   */
  setProducts(products) {
    this.allProducts = products;
    this.filteredProducts = products;
  }

  /**
   * Search products by term (searches name and brand)
   * @param {String} searchTerm - Term to search for
   * @param {String} category - Optional category to filter by
   * @returns {Array} Filtered products array
   */
  search(searchTerm, category = null) {
    this.currentSearch = searchTerm.toLowerCase().trim();
    this.currentCategory = category ? category.toLowerCase().trim() : "";

    // If no search term and no category, return all products
    if (!this.currentSearch && !this.currentCategory) {
      this.filteredProducts = this.allProducts;
      return this.filteredProducts;
    }

    this.filteredProducts = this.allProducts.filter((product) => {
      // Check category filter if provided
      if (this.currentCategory) {
        const productCategory = this.getProductCategory(product);
        if (
          !productCategory
            .toLowerCase()
            .includes(this.currentCategory)
        ) {
          return false;
        }
      }

      // Check search term if provided
      if (this.currentSearch) {
        return this.matchesSearchTerm(product, this.currentSearch);
      }

      return true;
    });

    return this.filteredProducts;
  }

  /**
   * Filter products by category only
   * @param {String} category - Category name
   * @returns {Array} Filtered products
   */
  filterByCategory(category) {
    return this.search("", category);
  }

  /**
   * Clear all filters and return all products
   * @returns {Array} All products
   */
  clearFilters() {
    this.currentSearch = "";
    this.currentCategory = "";
    this.filteredProducts = this.allProducts;
    return this.filteredProducts;
  }

  /**
   * Get filtered products with context about search
   * @returns {Object} Object containing filtered products and search info
   */
  getResults() {
    return {
      products: this.filteredProducts,
      count: this.filteredProducts.length,
      searchTerm: this.currentSearch,
      category: this.currentCategory,
      hasResults: this.filteredProducts.length > 0,
    };
  }

  /**
   * Get count of filtered products
   * @returns {Number} Count of products
   */
  getResultCount() {
    return this.filteredProducts.length;
  }

  /**
   * Check if product matches search term
   * @private
   * @param {Object} product - Product object
   * @param {String} searchTerm - Search term
   * @returns {Boolean} True if product matches
   */
  matchesSearchTerm(product, searchTerm) {
    // Search in product name
    if (
      product.Name &&
      product.Name.toLowerCase().includes(searchTerm)
    ) {
      return true;
    }

    // Search in product name without brand
    if (
      product.NameWithoutBrand &&
      product.NameWithoutBrand.toLowerCase().includes(searchTerm)
    ) {
      return true;
    }

    // Search in brand name
    if (
      product.Brand &&
      product.Brand.Name &&
      product.Brand.Name.toLowerCase().includes(searchTerm)
    ) {
      return true;
    }

    // Search in description (if available)
    if (
      product.DescriptionHtmlSimple &&
      product.DescriptionHtmlSimple.toLowerCase().includes(searchTerm)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Get product category (used to categorize search results)
   * @private
   * @param {Object} product - Product object
   * @returns {String} Category name
   */
  getProductCategory(product) {
    // For products with explicit category
    if (product.Category) {
      return product.Category;
    }

    // Infer from product type/structure
    if (product.SizesAvailable !== undefined) {
      // Tents, backpacks, sleeping bags have this
      return "gear";
    }

    return "product";
  }

  /**
   * Get suggestions based on partial search
   * Useful for autocomplete functionality
   * @param {String} partial - Partial search term
   * @param {Number} limit - Max suggestions to return
   * @returns {Array} Array of suggestion strings
   */
  getSuggestions(partial, limit = 5) {
    if (!partial || partial.length < 2) {
      return [];
    }

    const searchTerm = partial.toLowerCase().trim();
    const suggestions = new Set();

    this.allProducts.forEach((product) => {
      // Add product names
      if (
        product.Name &&
        product.Name.toLowerCase().includes(searchTerm)
      ) {
        suggestions.add(product.Name);
      }

      // Add brand names
      if (
        product.Brand &&
        product.Brand.Name &&
        product.Brand.Name.toLowerCase().includes(searchTerm)
      ) {
        suggestions.add(product.Brand.Name);
      }

      // Add product names without brand
      if (
        product.NameWithoutBrand &&
        product.NameWithoutBrand.toLowerCase().includes(searchTerm)
      ) {
        suggestions.add(product.NameWithoutBrand);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get products grouped by brand (for organized results)
   * @returns {Object} Products grouped by brand
   */
  getResultsGroupedByBrand() {
    const grouped = {};

    this.filteredProducts.forEach((product) => {
      const brand = product.Brand?.Name || "Unknown Brand";
      if (!grouped[brand]) {
        grouped[brand] = [];
      }
      grouped[brand].push(product);
    });

    return grouped;
  }

  /**
   * Get price range of filtered results
   * @returns {Object} Min and max price
   */
  getPriceRange() {
    if (this.filteredProducts.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = this.filteredProducts
      .map((p) => p.FinalPrice || p.ListPrice || 0)
      .filter((p) => typeof p === "number");

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
}

export default ProductSearch;
