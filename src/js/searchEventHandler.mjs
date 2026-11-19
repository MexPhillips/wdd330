/**
 * Search Event Handler Module
 * Manages search input events, filtering, and result display
 * Coordinates between ProductSearch logic and SearchRenderer UI
 */

import { qs } from "./utils.mjs";
import ProductSearch from "./productSearch.mjs";
import SearchRenderer from "./searchRenderer.mjs";

export class SearchEventHandler {
  constructor(allProducts = []) {
    this.productSearch = new ProductSearch(allProducts);
    this.searchRenderer = new SearchRenderer();
    this.debounceTimer = null;
    this.debounceDelay = 300; // ms
    this.setupEventListeners();
  }

  /**
   * Setup all search-related event listeners
   */
  setupEventListeners() {
    // Search input with debouncing
    if (this.searchRenderer.searchInput) {
      this.searchRenderer.searchInput.addEventListener("input", (e) =>
        this.handleSearchInput(e)
      );
      this.searchRenderer.searchInput.addEventListener("focus", () =>
        this.handleSearchFocus()
      );
      this.searchRenderer.searchInput.addEventListener("blur", () =>
        this.handleSearchBlur()
      );
      this.searchRenderer.searchInput.addEventListener("keydown", (e) =>
        this.handleSearchKeydown(e)
      );
    }

    // Search button
    if (this.searchRenderer.searchButton) {
      this.searchRenderer.searchButton.addEventListener("click", () =>
        this.handleSearchSubmit()
      );
    }

    // Clear button
    if (this.searchRenderer.clearButton) {
      this.searchRenderer.clearButton.addEventListener("click", () =>
        this.handleClearSearch()
      );
    }

    // Suggestion buttons (event delegation)
    document.addEventListener("click", (e) => {
      if (e.target.closest(".suggestion-button")) {
        this.handleSuggestionClick(e);
      }
    });

    // Filter buttons (event delegation)
    document.addEventListener("click", (e) => {
      if (e.target.closest(".filter-button")) {
        this.handleFilterClick(e);
      }
    });

    // Listen for product list updates
    const productList = qs(".product-list");
    if (productList) {
      productList.addEventListener("searchResultsUpdated", (e) =>
        this.handleSearchResultsUpdated(e)
      );
    }
  }

  /**
   * Handle search input with debouncing
   * @param {Event} e - Input event
   */
  handleSearchInput(e) {
    const searchTerm = e.target.value;

    // Clear previous debounce timer
    clearTimeout(this.debounceTimer);

    // Show loading state only if searching
    if (searchTerm.length > 0) {
      this.searchRenderer.showLoadingState();
    }

    // Debounce the search
    this.debounceTimer = setTimeout(() => {
      this.performSearch(searchTerm);

      // Get suggestions for autocomplete
      if (searchTerm.length >= 2) {
        const suggestions = this.productSearch.getSuggestions(searchTerm, 5);
        this.searchRenderer.displaySuggestions(suggestions);
      } else {
        this.searchRenderer.hideSuggestions();
      }

      this.searchRenderer.hideLoadingState();
    }, this.debounceDelay);
  }

  /**
   * Handle search focus event
   */
  handleSearchFocus() {
    const searchTerm = this.searchRenderer.getSearchValue();
    if (searchTerm.length >= 2) {
      const suggestions = this.productSearch.getSuggestions(searchTerm, 5);
      if (suggestions.length > 0) {
        this.searchRenderer.displaySuggestions(suggestions);
      }
    }
  }

  /**
   * Handle search blur event
   */
  handleSearchBlur() {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.searchRenderer.hideSuggestions();
    }, 200);
  }

  /**
   * Handle search input keydown (for Enter key)
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleSearchKeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleSearchSubmit();
    } else if (e.key === "Escape") {
      this.handleClearSearch();
    }
  }

  /**
   * Handle search form submission
   */
  handleSearchSubmit() {
    const searchTerm = this.searchRenderer.getSearchValue();
    this.performSearch(searchTerm);
    this.searchRenderer.hideSuggestions();
  }

  /**
   * Perform the actual search
   * @param {String} searchTerm - Term to search for
   */
  performSearch(searchTerm) {
    const results = this.productSearch.search(searchTerm);

    // Display results
    this.searchRenderer.displayResults(results, searchTerm);

    // Display price range if results exist
    if (results.length > 0) {
      const priceRange = this.productSearch.getPriceRange();
      this.searchRenderer.displayPriceRange(priceRange);
    }

    // Announce to screen readers
    const resultCount = results.length;
    const message =
      resultCount === 0 ?
      `No products found matching "${searchTerm}"`
      : `Found ${resultCount} product${resultCount !== 1 ? "s" : ""} matching "${searchTerm}"`;
    this.searchRenderer.announceToScreenReader(message);
  }

  /**
   * Handle clear search button click
   */
  handleClearSearch() {
    this.productSearch.clearFilters();
    this.searchRenderer.clearSearch();

    // Show all products again
    const allProducts = this.productSearch.getResults();
    this.searchRenderer.displayResults(allProducts.products);

    this.searchRenderer.announceToScreenReader("Search cleared");
  }

  /**
   * Handle suggestion click
   * @param {Event} e - Click event
   */
  handleSuggestionClick(e) {
    const suggestion = e.target.closest(".suggestion-button").dataset.suggestion;
    this.searchRenderer.setSearchValue(suggestion);
    this.performSearch(suggestion);
    this.searchRenderer.hideSuggestions();
  }

  /**
   * Handle filter button click
   * @param {Event} e - Click event
   */
  handleFilterClick(e) {
    const filterButton = e.target.closest(".filter-button");
    const filter = filterButton.dataset.filter;

    // Filter by category
    const results = this.productSearch.filterByCategory(filter);

    // Update UI
    this.searchRenderer.displayResults(results);
    this.searchRenderer.highlightActiveFilter(filter);

    // Announce to screen readers
    const resultCount = results.length;
    this.searchRenderer.announceToScreenReader(
      `Filtered by ${filter}: ${resultCount} product${resultCount !== 1 ? "s" : ""}`
    );
  }

  /**
   * Handle search results updated event from product list
   * @param {CustomEvent} e - Event with product details
   */
  handleSearchResultsUpdated(e) {
    const { products, searchTerm } = e.detail;
    // Additional processing if needed
    console.log(`Search results updated: ${products.length} products for "${searchTerm}"`);
  }

  /**
   * Update products to search through
   * Useful when products are dynamically loaded
   * @param {Array} newProducts - New products array
   */
  updateProducts(newProducts) {
    this.productSearch.setProducts(newProducts);
  }

  /**
   * Get current search results
   * @returns {Object} Results object with products and metadata
   */
  getResults() {
    return this.productSearch.getResults();
  }

  /**
   * Get suggestions for a search term
   * @param {String} term - Search term
   * @param {Number} limit - Max suggestions
   * @returns {Array} Array of suggestions
   */
  getSuggestions(term, limit = 5) {
    return this.productSearch.getSuggestions(term, limit);
  }
}

export default SearchEventHandler;
