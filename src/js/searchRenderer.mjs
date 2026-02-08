/**
 * Search Renderer Module
 * Handles DOM updates and rendering for search results
 * Displays search results, suggestions, and feedback messages
 */

import { qs, qsAll } from "./utils.mjs";

export class SearchRenderer {
  constructor() {
    this.searchInput = qs(".search-input");
    this.searchButton = qs(".search-btn");
    this.clearButton = qs(".clear-search-btn");
    this.suggestionsContainer = qs(".search-suggestions");
    this.resultsCountElement = qs(".search-results-count");
    this.productList = qs(".product-list");
    this.noResultsMessage = qs(".no-search-results");
  }

  /**
   * Display search results by updating product list
   * @param {Array} products - Products to display
   * @param {String} searchTerm - The search term used
   */
  displayResults(products, searchTerm = "") {
    // Update product list
    if (this.productList) {
      if (products.length === 0) {
        this.showNoResults(searchTerm);
      } else {
        this.hideNoResults();
        // Products will be rendered by productList module
        // We just trigger the update via custom event
        const event = new CustomEvent("searchResultsUpdated", {
          detail: { products, searchTerm },
        });
        this.productList.dispatchEvent(event);
      }
    }

    // Update results count
    this.updateResultsCount(products.length, searchTerm);
  }

  /**
   * Update the search results count display
   * @param {Number} count - Number of results
   * @param {String} searchTerm - The search term used
   */
  updateResultsCount(count, searchTerm = "") {
    if (!this.resultsCountElement) return;

    let message = "";
    if (searchTerm) {
      message = `Found ${count} product${count !== 1 ? "s" : ""} matching "${searchTerm}"`;
    } else {
      message = `Showing ${count} product${count !== 1 ? "s" : ""}`;
    }

    this.resultsCountElement.textContent = message;
    this.resultsCountElement.setAttribute("role", "status");
    this.resultsCountElement.setAttribute("aria-live", "polite");

    // Add animation class
    this.resultsCountElement.classList.add("results-count-update");
    setTimeout(() => {
      this.resultsCountElement.classList.remove("results-count-update");
    }, 300);
  }

  /**
   * Display "no results" message
   * @param {String} searchTerm - The search term that produced no results
   */
  showNoResults(searchTerm) {
    if (this.noResultsMessage) {
      const message =
        searchTerm ?
        `No products found matching "${searchTerm}". Try a different search.`
        : "No products available.";

      this.noResultsMessage.textContent = message;
      this.noResultsMessage.style.display = "block";
      this.noResultsMessage.setAttribute("role", "alert");
    }

    if (this.productList) {
      this.productList.innerHTML = "";
    }
  }

  /**
   * Hide the "no results" message
   */
  hideNoResults() {
    if (this.noResultsMessage) {
      this.noResultsMessage.style.display = "none";
    }
  }

  /**
   * Display search suggestions for autocomplete
   * @param {Array} suggestions - Array of suggestion strings
   */
  displaySuggestions(suggestions) {
    if (!this.suggestionsContainer) return;

    if (suggestions.length === 0) {
      this.suggestionsContainer.innerHTML = "";
      this.suggestionsContainer.style.display = "none";
      return;
    }

    const html = suggestions
      .map(
        (suggestion) => `
      <li class="search-suggestion-item" role="option">
        <button type="button" class="suggestion-button" data-suggestion="${this.escapeHtml(suggestion)}">
          <span class="suggestion-text">${this.escapeHtml(suggestion)}</span>
        </button>
      </li>
    `
      )
      .join("");

    this.suggestionsContainer.innerHTML = `<ul class="search-suggestions-list" role="listbox">${html}</ul>`;
    this.suggestionsContainer.style.display = "block";
  }

  /**
   * Hide search suggestions
   */
  hideSuggestions() {
    if (this.suggestionsContainer) {
      this.suggestionsContainer.innerHTML = "";
      this.suggestionsContainer.style.display = "none";
    }
  }

  /**
   * Get current search input value
   * @returns {String} Search term
   */
  getSearchValue() {
    return this.searchInput ? this.searchInput.value.trim() : "";
  }

  /**
   * Set search input value
   * @param {String} value - Value to set
   */
  setSearchValue(value) {
    if (this.searchInput) {
      this.searchInput.value = value;
    }
  }

  /**
   * Clear search input and results
   */
  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = "";
      this.searchInput.focus();
    }
    this.hideSuggestions();
    this.hideNoResults();
    this.resetResultsCount();
  }

  /**
   * Reset results count display to default
   */
  resetResultsCount() {
    if (this.resultsCountElement) {
      this.resultsCountElement.textContent = "";
    }
  }

  /**
   * Show loading state while searching
   */
  showLoadingState() {
    if (this.searchButton) {
      this.searchButton.setAttribute("disabled", "true");
      this.searchButton.classList.add("loading");
    }
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    if (this.searchButton) {
      this.searchButton.removeAttribute("disabled");
      this.searchButton.classList.remove("loading");
    }
  }

  /**
   * Toggle search container visibility
   * @param {Boolean} visible - Show or hide
   */
  setSearchContainerVisible(visible) {
    const searchContainer = qs(".search-container");
    if (searchContainer) {
      searchContainer.style.display = visible ? "block" : "none";
    }
  }

  /**
   * Display search filters/options
   * @param {Array} categories - Array of category options
   */
  displayFilters(categories) {
    const filterContainer = qs(".search-filters");
    if (!filterContainer) return;

    const filterHtml = categories
      .map(
        (category) => `
      <button type="button" class="filter-button" data-filter="${this.escapeHtml(category)}">
        ${this.escapeHtml(category)}
      </button>
    `
      )
      .join("");

    filterContainer.innerHTML = `<div class="filter-buttons-group">${filterHtml}</div>`;
  }

  /**
   * Highlight active search filter
   * @param {String} activeFilter - Active filter name
   */
  highlightActiveFilter(activeFilter) {
    const filterButtons = qsAll(".filter-button");
    filterButtons.forEach((button) => {
      if (button.dataset.filter === activeFilter) {
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
      }
    });
  }

  /**
   * Show search help/tips
   * @param {String} message - Help message
   */
  showSearchHelp(message) {
    const helpElement = qs(".search-help");
    if (helpElement) {
      helpElement.textContent = message;
      helpElement.style.display = "block";
      helpElement.setAttribute("role", "tooltip");
    }
  }

  /**
   * Hide search help
   */
  hideSearchHelp() {
    const helpElement = qs(".search-help");
    if (helpElement) {
      helpElement.style.display = "none";
    }
  }

  /**
   * Display price range of results
   * @param {Object} priceRange - Object with min and max
   */
  displayPriceRange(priceRange) {
    const priceElement = qs(".search-price-range");
    if (priceElement && priceRange) {
      priceElement.textContent = `Price range: $${priceRange.min.toFixed(2)} - $${priceRange.max.toFixed(2)}`;
      priceElement.setAttribute("role", "status");
    }
  }

  /**
   * Escape HTML special characters for safe display
   * @private
   * @param {String} text - Text to escape
   * @returns {String} Escaped text
   */
  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }

  /**
   * Update ARIA live region for screen readers
   * @param {String} message - Message to announce
   */
  announceToScreenReader(message) {
    const announcement = qs(".sr-announcement");
    if (announcement) {
      announcement.textContent = message;
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
    }
  }
}

export default SearchRenderer;
