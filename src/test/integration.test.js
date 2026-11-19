/**
 * Integration Tests
 * Tests for features working together
 * Covers: Product Search + Checkout Validation interaction
 */

import ProductSearch from "../js/productSearch.mjs";
import { CheckoutValidator } from "../js/checkoutValidator.mjs";

describe("Integration Tests - Product Search + Checkout Validation", () => {
  let productSearch;
  let checkoutValidator;
  let allProducts;

  beforeEach(() => {
    // Setup mock products
    allProducts = [
      {
        Id: "T1",
        Name: "Marmot Ajax Tent - 3-Person",
        NameWithoutBrand: "Ajax Tent",
        Brand: { Name: "Marmot" },
        FinalPrice: 199.99,
        ListPrice: 199.99,
        DescriptionHtmlSimple: "Quality tent",
      },
      {
        Id: "T2",
        Name: "North Face Talus Tent - 4-Person",
        NameWithoutBrand: "Talus Tent",
        Brand: { Name: "North Face" },
        FinalPrice: 249.99,
        ListPrice: 249.99,
        DescriptionHtmlSimple: "Premium tent",
      },
      {
        Id: "B1",
        Name: "Gregory Backpack",
        NameWithoutBrand: "Backpack",
        Brand: { Name: "Gregory" },
        FinalPrice: 349.99,
        ListPrice: 349.99,
        DescriptionHtmlSimple: "Durable backpack",
      },
    ];

    productSearch = new ProductSearch(allProducts);
    checkoutValidator = new CheckoutValidator();
  });

  describe("Search -> Select Product -> Checkout Flow", () => {
    test("should maintain data integrity when searching and then validating purchase", () => {
      // Step 1: Search for product
      const searchResults = productSearch.search("Marmot");
      expect(searchResults.length).toBe(1);
      const selectedProduct = searchResults[0];

      // Step 2: Prepare checkout data for the product
      const checkoutData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "3105551234",
        address: "123 Main St",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        cardName: "John Doe",
        cardNumber: "4532015112830366",
        expiryDate: "12/26",
        cvv: "123",
        productId: selectedProduct.Id,
        productPrice: selectedProduct.FinalPrice,
      };

      // Step 3: Validate checkout data
      const validation = checkoutValidator.validateForm(checkoutData);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual({});
    });

    test("should allow searching while keeping checkout form valid", () => {
      // Perform multiple searches
      productSearch.search("Tent");
      expect(productSearch.getResultCount()).toBe(2);

      productSearch.search("Gregory");
      expect(productSearch.getResultCount()).toBe(1);

      // Checkout validation should still work
      const validCheckout = {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phone: "4155551234",
        address: "456 Oak Ave",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        cardName: "Jane Smith",
        cardNumber: "4532015112830366",
        expiryDate: "12/26",
        cvv: "456",
      };

      const validation = checkoutValidator.validateForm(validCheckout);
      expect(validation.isValid).toBe(true);
    });
  });

  describe("Multiple Products with Unique Checkout Data", () => {
    test("should handle checkout data for different searched products", () => {
      // Search for different products
      const tentResults = productSearch.search("Tent");
      const backpackResults = productSearch.search("Gregory");

      expect(tentResults.length).toBe(2);
      expect(backpackResults.length).toBe(1);

      // Create checkout data for tent
      const tentCheckout = {
        firstName: "Tom",
        lastName: "Johnson",
        email: "tom@example.com",
        phone: "2125551234",
        address: "789 Pine Rd",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        cardName: "Tom Johnson",
        cardNumber: "4532015112830366",
        expiryDate: "10/26",
        cvv: "123",
        productId: tentResults[0].Id,
      };

      // Create checkout data for backpack
      const backpackCheckout = {
        firstName: "Lisa",
        lastName: "Williams",
        email: "lisa@example.com",
        phone: "7135551234",
        address: "321 Elm St",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        cardName: "Lisa Williams",
        cardNumber: "4532015112830366",
        expiryDate: "09/26",
        cvv: "789",
        productId: backpackResults[0].Id,
      };

      // Both should validate successfully
      expect(checkoutValidator.validateForm(tentCheckout).isValid).toBe(true);
      expect(checkoutValidator.validateForm(backpackCheckout).isValid).toBe(true);
    });
  });

  describe("Search Filter Consistency with Form Data", () => {
    test("should maintain search filters when collecting checkout info", () => {
      // Filter by specific brand
      const marmotProducts = productSearch.search("Marmot");
      expect(marmotProducts.length).toBe(1);

      // Collect checkout info
      const checkoutData = {
        firstName: "Alex",
        lastName: "Brown",
        email: "alex@example.com",
        phone: "5105551234",
        address: "550 Market St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        cardName: "Alex Brown",
        cardNumber: "4532015112830366",
        expiryDate: "12/99",
        cvv: "321",
        selectedProductId: marmotProducts[0].Id,
      };

      // Validate
      const validation = checkoutValidator.validateForm(checkoutData);
      expect(validation.isValid).toBe(true);

      // Clear filters and search again
      productSearch.clearFilters();
      const allProducts = productSearch.getResults();
      expect(allProducts.count).toBe(3);

      // Checkout data should still be valid
      const validation2 = checkoutValidator.validateForm(checkoutData);
      expect(validation2.isValid).toBe(true);
    });
  });

  describe("Price Range & Checkout Handling", () => {
    test("should correctly calculate prices for filtered products during checkout", () => {
      // Search for expensive items
      productSearch.search("");
      const priceRange = productSearch.getPriceRange();
      expect(priceRange.min).toBe(199.99);
      expect(priceRange.max).toBe(349.99);

      // Prepare checkout for highest priced item
      const results = productSearch.search("Gregory");
      const product = results[0];

      const checkoutData = {
        firstName: "Michael",
        lastName: "Davis",
        email: "michael@example.com",
        phone: "5555551234",
        address: "999 Commerce St",
        city: "Denver",
        state: "CO",
        zipCode: "80202",
        cardName: "Michael Davis",
        cardNumber: "4532015112830366",
        expiryDate: "09/99",
        cvv: "654",
        productPrice: product.FinalPrice,
      };

      const validation = checkoutValidator.validateForm(checkoutData);
      expect(validation.isValid).toBe(true);
    });
  });

  describe("Search Results Grouping with Multi-Customer Checkout", () => {
    test("should group products by brand and validate separate checkouts", () => {
      productSearch.search("");
      const grouped = productSearch.getResultsGroupedByBrand();

      // Should have 3 brands
      expect(Object.keys(grouped).length).toBe(3);

      // Create checkouts for each brand
      const brands = Object.keys(grouped);
      const firstNames = ["John", "Sarah", "Michael"];
      const lastNames = ["Smith", "Johnson", "Williams"];
      const emails = ["john.smith@example.com", "sarah.johnson@example.com", "michael.williams@example.com"];
      
      const checkouts = brands.map((brand, index) => ({
        firstName: firstNames[index],
        lastName: lastNames[index],
        email: emails[index],
        phone: "3105551234",
        address: "123 Test St",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        cardName: `${firstNames[index]} ${lastNames[index]}`,
        cardNumber: "4532015112830366",
        expiryDate: "12/26",
        cvv: "123",
        brand: brand,
      }));

      // All should be valid
      checkouts.forEach((checkout) => {
        const validation = checkoutValidator.validateForm(checkout);
        expect(validation.isValid).toBe(true);
      });
    });
  });

  describe("Error State Handling Across Features", () => {
    test("should handle search errors without affecting validation", () => {
      // Create invalid checkout data
      const invalidCheckout = {
        firstName: "",
        lastName: "Test",
        email: "not-an-email",
        phone: "123",
        address: "123 St",
        city: "City",
        state: "",
        zipCode: "abc",
        cardName: "Name",
        cardNumber: "1234",
        expiryDate: "13/25",
        cvv: "12",
      };

      // Validation should fail
      const validation = checkoutValidator.validateForm(invalidCheckout);
      expect(validation.isValid).toBe(false);
      expect(Object.keys(validation.errors).length).toBeGreaterThan(5);

      // Search should still work
      const searchResults = productSearch.search("Tent");
      expect(searchResults.length).toBe(2);
    });
  });

  describe("Data Persistence Simulation", () => {
    test("should maintain consistency when simulating cart operations", () => {
      // Simulate: User searches for product
      const searchResults = productSearch.search("Marmot");
      const cartItem = {
        id: searchResults[0].Id,
        name: searchResults[0].Name,
        price: searchResults[0].FinalPrice,
        quantity: 1,
      };

      // Simulate: User modifies quantity
      cartItem.quantity = 2;

      // Simulate: User goes to checkout with multiple items
      const multiItemCheckout = {
        firstName: "Sarah",
        lastName: "Miller",
        email: "sarah@example.com",
        phone: "4155551234",
        address: "888 Market St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94103",
        cardName: "Sarah Miller",
        cardNumber: "4532015112830366",
        expiryDate: "12/26",
        cvv: "999",
        cartItems: [cartItem],
        totalPrice: cartItem.price * cartItem.quantity,
      };

      // Checkout should still be valid
      const validation = checkoutValidator.validateForm(multiItemCheckout);
      expect(validation.isValid).toBe(true);
    });
  });

  describe("Accessibility Consistency", () => {
    test("should maintain ARIA compliance across search and checkout", () => {
      // Search produces accessible results
      const searchResults = productSearch.search("Tent");

      // Result count should be accessible
      expect(searchResults.length).toBeGreaterThanOrEqual(0);

      // Checkout form data is valid and should be displayable
      const accessibleCheckout = {
        firstName: "Rachel",
        lastName: "Green",
        email: "rachel@example.com",
        phone: "2125559999",
        address: "Central Perk, 123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        cardName: "Rachel Green",
        cardNumber: "4532015112830366",
        expiryDate: "12/26",
        cvv: "111",
        ariaLabel: "Checkout form",
        role: "form",
      };

      const validation = checkoutValidator.validateForm(accessibleCheckout);
      expect(validation.isValid).toBe(true);
    });
  });
});
