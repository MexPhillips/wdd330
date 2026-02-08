/**
 * Product Search Module Tests
 * Tests for productSearch.mjs
 * Coverage: search logic, filtering, suggestions, price ranges
 */

import ProductSearch from "../js/productSearch.mjs";

describe("ProductSearch", () => {
  let search;
  let mockProducts;

  beforeEach(() => {
    // Mock product data
    mockProducts = [
      {
        Id: "880RR",
        Name: "Marmot Ajax Tent - 3-Person, 3-Season",
        NameWithoutBrand: "Ajax Tent - 3-Person, 3-Season",
        Brand: { Id: "1308", Name: "Marmot" },
        FinalPrice: 199.99,
        ListPrice: 199.99,
        DescriptionHtmlSimple: "Get out and enjoy nature with Marmot's Ajax tent",
        SizesAvailable: {},
      },
      {
        Id: "985RF",
        Name: "The North Face Talus Tent - 4-Person, 3-Season",
        NameWithoutBrand: "Talus Tent - 4-Person, 3-Season",
        Brand: { Id: "1440", Name: "The North Face" },
        FinalPrice: 199.99,
        ListPrice: 199.99,
        DescriptionHtmlSimple:
          "Enjoy a fun night under stars with The North Face Talus tent",
        SizesAvailable: {},
      },
      {
        Id: "223RN",
        Name: "Gregory Zulu 55 Backpack - Internal Frame",
        NameWithoutBrand: "Zulu 55 Backpack - Internal Frame",
        Brand: { Id: "223", Name: "Gregory" },
        FinalPrice: 249.99,
        ListPrice: 249.99,
        DescriptionHtmlSimple: "Lightweight and ready for adventure",
        SizesAvailable: {},
      },
    ];

    search = new ProductSearch(mockProducts);
  });

  describe("Constructor", () => {
    test("should initialize with products", () => {
      expect(search.allProducts).toEqual(mockProducts);
      expect(search.filteredProducts).toEqual(mockProducts);
    });

    test("should initialize with empty products if not provided", () => {
      const emptySearch = new ProductSearch();
      expect(emptySearch.allProducts).toEqual([]);
      expect(emptySearch.filteredProducts).toEqual([]);
    });
  });

  describe("search()", () => {
    test("should return all products when search term is empty", () => {
      const results = search.search("");
      expect(results).toEqual(mockProducts);
      expect(results.length).toBe(3);
    });

    test("should filter products by name", () => {
      const results = search.search("Tent");
      expect(results.length).toBe(2);
      expect(results[0].Id).toBe("880RR");
      expect(results[1].Id).toBe("985RF");
    });

    test("should filter products by brand name", () => {
      const results = search.search("Marmot");
      expect(results.length).toBe(1);
      expect(results[0].Brand.Name).toBe("Marmot");
    });

    test("should perform case-insensitive search", () => {
      const results1 = search.search("marmot");
      const results2 = search.search("MARMOT");
      const results3 = search.search("Marmot");
      expect(results1).toEqual(mockProducts.slice(0, 1));
      expect(results2).toEqual(results1);
      expect(results3).toEqual(results1);
    });

    test("should filter products by product name without brand", () => {
      const results = search.search("Talus");
      expect(results.length).toBe(1);
      expect(results[0].NameWithoutBrand).toContain("Talus");
    });

    test("should trim whitespace from search term", () => {
      const results1 = search.search("  Tent  ");
      const results2 = search.search("Tent");
      expect(results1).toEqual(results2);
    });

    test("should return empty array for non-matching search", () => {
      const results = search.search("NonExistent");
      expect(results).toEqual([]);
      expect(results.length).toBe(0);
    });

    test("should search in description field", () => {
      const results = search.search("adventure");
      expect(results.length).toBe(1);
      expect(results[0].Id).toBe("223RN");
    });

    test("should filter by category if provided", () => {
      const results = search.search("", "gear");
      expect(results.length).toBe(3);
    });

    test("should combine search term and category filter", () => {
      const results = search.search("Marmot", "gear");
      expect(results.length).toBe(1);
      expect(results[0].Brand.Name).toBe("Marmot");
    });
  });

  describe("filterByCategory()", () => {
    test("should filter products by category only", () => {
      const results = search.filterByCategory("gear");
      expect(results.length).toBe(3);
    });

    test("should return empty array for non-existent category", () => {
      const results = search.filterByCategory("nonexistent");
      expect(results.length).toBe(0);
    });

    test("should perform case-insensitive category filter", () => {
      const results1 = search.filterByCategory("gear");
      const results2 = search.filterByCategory("GEAR");
      expect(results1).toEqual(results2);
    });
  });

  describe("clearFilters()", () => {
    test("should return all products when clearing filters", () => {
      search.search("Marmot");
      expect(search.filteredProducts.length).toBe(1);

      const results = search.clearFilters();
      expect(results).toEqual(mockProducts);
      expect(results.length).toBe(3);
    });

    test("should reset search and category", () => {
      search.search("Tent", "gear");
      search.clearFilters();
      expect(search.currentSearch).toBe("");
      expect(search.currentCategory).toBe("");
    });
  });

  describe("getResults()", () => {
    test("should return results object with metadata", () => {
      const results = search.search("Tent");
      const resultsObj = search.getResults();

      expect(resultsObj).toHaveProperty("products");
      expect(resultsObj).toHaveProperty("count");
      expect(resultsObj).toHaveProperty("searchTerm");
      expect(resultsObj).toHaveProperty("category");
      expect(resultsObj).toHaveProperty("hasResults");
    });

    test("should include correct count in results", () => {
      search.search("Tent");
      const resultsObj = search.getResults();
      expect(resultsObj.count).toBe(2);
    });

    test("should set hasResults to true when matches found", () => {
      search.search("Tent");
      const resultsObj = search.getResults();
      expect(resultsObj.hasResults).toBe(true);
    });

    test("should set hasResults to false when no matches", () => {
      search.search("NonExistent");
      const resultsObj = search.getResults();
      expect(resultsObj.hasResults).toBe(false);
    });
  });

  describe("getResultCount()", () => {
    test("should return correct product count", () => {
      search.search("Tent");
      expect(search.getResultCount()).toBe(2);
    });

    test("should return 0 for no matches", () => {
      search.search("NonExistent");
      expect(search.getResultCount()).toBe(0);
    });
  });

  describe("getSuggestions()", () => {
    test("should return empty array for empty input", () => {
      const suggestions = search.getSuggestions("");
      expect(suggestions).toEqual([]);
    });

    test("should return empty array for single character", () => {
      const suggestions = search.getSuggestions("T");
      expect(suggestions).toEqual([]);
    });

    test("should return suggestions for 2+ characters", () => {
      const suggestions = search.getSuggestions("Te");
      expect(suggestions.length).toBeGreaterThan(0);
    });

    test("should return product names in suggestions", () => {
      const suggestions = search.getSuggestions("tent");
      expect(suggestions.some((s) => s.includes("Tent"))).toBe(true);
    });

    test("should return brand names in suggestions", () => {
      const suggestions = search.getSuggestions("ma");
      expect(suggestions.some((s) => s.includes("Marmot"))).toBe(true);
    });

    test("should respect limit parameter", () => {
      const suggestions = search.getSuggestions("e", 2);
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    test("should return unique suggestions", () => {
      const suggestions = search.getSuggestions("tent");
      const unique = new Set(suggestions);
      expect(suggestions.length).toBe(unique.size);
    });
  });

  describe("getResultsGroupedByBrand()", () => {
    test("should group products by brand", () => {
      search.search("");
      const grouped = search.getResultsGroupedByBrand();

      expect(grouped).toHaveProperty("Marmot");
      expect(grouped).toHaveProperty("The North Face");
      expect(grouped).toHaveProperty("Gregory");
    });

    test("should group only filtered products", () => {
      search.search("Tent");
      const grouped = search.getResultsGroupedByBrand();

      expect(grouped).toHaveProperty("Marmot");
      expect(grouped).toHaveProperty("The North Face");
      expect(grouped).not.toHaveProperty("Gregory");
    });

    test("should contain correct products in each group", () => {
      search.search("");
      const grouped = search.getResultsGroupedByBrand();

      expect(grouped.Marmot.length).toBe(1);
      expect(grouped.Marmot[0].Id).toBe("880RR");
    });
  });

  describe("getPriceRange()", () => {
    test("should return min and max prices", () => {
      search.search("");
      const range = search.getPriceRange();

      expect(range).toHaveProperty("min");
      expect(range).toHaveProperty("max");
    });

    test("should calculate correct price range", () => {
      search.search("");
      const range = search.getPriceRange();

      expect(range.min).toBe(199.99);
      expect(range.max).toBe(249.99);
    });

    test("should return 0 for empty results", () => {
      search.search("NonExistent");
      const range = search.getPriceRange();

      expect(range.min).toBe(0);
      expect(range.max).toBe(0);
    });

    test("should calculate price range for filtered results", () => {
      search.search("Tent");
      const range = search.getPriceRange();

      expect(range.min).toBe(199.99);
      expect(range.max).toBe(199.99);
    });
  });

  describe("setProducts()", () => {
    test("should update all products", () => {
      const newProducts = [
        {
          Id: "999",
          Name: "New Product",
          NameWithoutBrand: "New Product",
          Brand: { Name: "NewBrand" },
          FinalPrice: 100,
          ListPrice: 100,
        },
      ];

      search.setProducts(newProducts);
      expect(search.allProducts).toEqual(newProducts);
    });

    test("should reset filtered products when setting new products", () => {
      search.search("Tent");
      expect(search.filteredProducts.length).toBe(2);

      const newProducts = mockProducts.slice(0, 1);
      search.setProducts(newProducts);
      expect(search.filteredProducts).toEqual(newProducts);
    });
  });

  describe("Edge Cases", () => {
    test("should handle products without brand", () => {
      const productsNoBrand = [
        {
          Id: "001",
          Name: "Product With No Brand",
          NameWithoutBrand: "Product",
          Brand: null,
          FinalPrice: 50,
          ListPrice: 50,
        },
      ];

      search.setProducts(productsNoBrand);
      const results = search.search("Product");
      expect(results.length).toBe(1);
    });

    test("should handle special characters in search", () => {
      const resultsApostrophe = search.search("'");
      // Should not throw error
      expect(Array.isArray(resultsApostrophe)).toBe(true);
    });

    test("should handle very long search terms", () => {
      const longTerm =
        "a".repeat(100) + "Tent" + "a".repeat(100);
      const results = search.search(longTerm);
      expect(results.length).toBe(0);
    });

    test("should handle multiple spaces in search", () => {
      const results = search.search("   Tent   ");
      expect(results.length).toBe(2);
    });
  });
});
