/**
 * Checkout Validator Module Tests
 * Tests for checkoutValidator.mjs
 * Coverage: form validation, field validation, Luhn algorithm, error handling
 */

import { CheckoutValidator } from "../js/checkoutValidator.mjs";

describe("CheckoutValidator", () => {
  let validator;

  beforeEach(() => {
    validator = new CheckoutValidator();
  });

  describe("Constructor & Initialization", () => {
    test("should initialize with empty errors", () => {
      expect(validator.errors).toEqual({});
    });

    test("should initialize validation rules", () => {
      expect(validator.validationRules).toBeDefined();
      expect(Object.keys(validator.validationRules).length).toBeGreaterThan(0);
    });

    test("should have rules for required fields", () => {
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
        "cardName",
        "cardNumber",
        "expiryDate",
        "cvv",
      ];

      requiredFields.forEach((field) => {
        expect(validator.validationRules[field]).toBeDefined();
        expect(validator.validationRules[field].required).toBe(true);
      });
    });
  });

  describe("validateForm()", () => {
    let validFormData;

    beforeEach(() => {
      validFormData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "3105551234",
        address: "123 Main St",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        cardName: "John Doe",
        cardNumber: "4532015112830366", // Valid test card
        expiryDate: "12/99",
        cvv: "123",
      };
    });

    test("should return valid result for correct form data", () => {
      const result = validator.validateForm(validFormData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test("should return invalid result when required field is empty", () => {
      validFormData.firstName = "";
      const result = validator.validateForm(validFormData);

      expect(result.isValid).toBe(false);
      expect(result.errors.firstName).toBeDefined();
    });

    test("should validate all fields in form", () => {
      const emptyForm = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      };

      const result = validator.validateForm(emptyForm);

      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(5);
    });

    test("should return errors object with error messages", () => {
      validFormData.email = "invalid-email";
      const result = validator.validateForm(validFormData);

      expect(result.errors.email).toBeDefined();
      expect(typeof result.errors.email).toBe("string");
      expect(result.errors.email.length).toBeGreaterThan(0);
    });
  });

  describe("validateField() - Name Fields", () => {
    test("should reject empty first name", () => {
      validator.validateField("firstName", "");
      expect(validator.hasFieldError("firstName")).toBe(true);
    });

    test("should reject first name with numbers", () => {
      validator.validateField("firstName", "John123");
      expect(validator.hasFieldError("firstName")).toBe(true);
    });

    test("should accept valid first names", () => {
      validator.validateField("firstName", "John");
      expect(validator.hasFieldError("firstName")).toBe(false);
    });

    test("should accept names with apostrophes", () => {
      validator.validateField("firstName", "O'Brien");
      expect(validator.hasFieldError("firstName")).toBe(false);
    });

    test("should accept names with hyphens", () => {
      validator.validateField("lastName", "Smith-Jones");
      expect(validator.hasFieldError("lastName")).toBe(false);
    });

    test("should reject first name less than 2 chars", () => {
      validator.validateField("firstName", "A");
      expect(validator.hasFieldError("firstName")).toBe(true);
    });

    test("should reject first name more than 50 chars", () => {
      const longName = "A".repeat(51);
      validator.validateField("firstName", longName);
      expect(validator.hasFieldError("firstName")).toBe(true);
    });
  });

  describe("validateField() - Email", () => {
    test("should accept valid email addresses", () => {
      validator.validateField("email", "john@example.com");
      expect(validator.hasFieldError("email")).toBe(false);
    });

    test("should accept email with subdomain", () => {
      validator.validateField("email", "john@mail.example.com");
      expect(validator.hasFieldError("email")).toBe(false);
    });

    test("should reject email without @", () => {
      validator.validateField("email", "johnexample.com");
      expect(validator.hasFieldError("email")).toBe(true);
    });

    test("should reject email without domain", () => {
      validator.validateField("email", "john@");
      expect(validator.hasFieldError("email")).toBe(true);
    });

    test("should reject email without local part", () => {
      validator.validateField("email", "@example.com");
      expect(validator.hasFieldError("email")).toBe(true);
    });

    test("should reject empty email", () => {
      validator.validateField("email", "");
      expect(validator.hasFieldError("email")).toBe(true);
    });

    test("should reject email with spaces", () => {
      validator.validateField("email", "john doe@example.com");
      expect(validator.hasFieldError("email")).toBe(true);
    });
  });

  describe("validateField() - Phone", () => {
    test("should accept 10-digit phone number", () => {
      validator.validateField("phone", "3105551234");
      expect(validator.hasFieldError("phone")).toBe(false);
    });

    test("should accept phone with dashes", () => {
      validator.validateField("phone", "310-555-1234");
      expect(validator.hasFieldError("phone")).toBe(false);
    });

    test("should accept phone with parentheses", () => {
      validator.validateField("phone", "(310) 555-1234");
      expect(validator.hasFieldError("phone")).toBe(false);
    });

    test("should reject phone with less than 10 digits", () => {
      validator.validateField("phone", "123456789");
      expect(validator.hasFieldError("phone")).toBe(true);
    });

    test("should reject phone with letters", () => {
      validator.validateField("phone", "310-555-ABCD");
      expect(validator.hasFieldError("phone")).toBe(true);
    });

    test("should reject empty phone", () => {
      validator.validateField("phone", "");
      expect(validator.hasFieldError("phone")).toBe(true);
    });
  });

  describe("validateField() - Address", () => {
    test("should accept valid address", () => {
      validator.validateField("address", "123 Main St");
      expect(validator.hasFieldError("address")).toBe(false);
    });

    test("should accept address with apartment number", () => {
      validator.validateField("address", "123 Main St Apt 4B");
      expect(validator.hasFieldError("address")).toBe(false);
    });

    test("should accept address with direction abbreviation", () => {
      validator.validateField("address", "123 S Main St");
      expect(validator.hasFieldError("address")).toBe(false);
    });

    test("should reject empty address", () => {
      validator.validateField("address", "");
      expect(validator.hasFieldError("address")).toBe(true);
    });

    test("should accept address with only numbers (no pattern validation)", () => {
      validator.validateField("address", "123 456 789");
      expect(validator.hasFieldError("address")).toBe(false);
    });
  });

  describe("validateField() - City & State", () => {
    test("should accept valid city name", () => {
      validator.validateField("city", "Los Angeles");
      expect(validator.hasFieldError("city")).toBe(false);
    });

    test("should accept city with spaces", () => {
      validator.validateField("city", "New York");
      expect(validator.hasFieldError("city")).toBe(false);
    });

    test("should accept city with numbers (no pattern validation)", () => {
      validator.validateField("city", "Los123Angeles");
      expect(validator.hasFieldError("city")).toBe(false);
    });

    test("should accept valid state code", () => {
      validator.validateField("state", "CA");
      expect(validator.hasFieldError("state")).toBe(false);
    });

    test("should reject empty state", () => {
      validator.validateField("state", "");
      expect(validator.hasFieldError("state")).toBe(true);
    });

    test("should reject state with numbers (only letters allowed)", () => {
      validator.validateField("state", "01");
      expect(validator.hasFieldError("state")).toBe(true);
    });
  });

  describe("validateField() - Zip Code", () => {
    test("should accept 5-digit zip code", () => {
      validator.validateField("zipCode", "90001");
      expect(validator.hasFieldError("zipCode")).toBe(false);
    });

    test("should accept zip+4 format", () => {
      validator.validateField("zipCode", "90001-1234");
      expect(validator.hasFieldError("zipCode")).toBe(false);
    });

    test("should reject zip code with letters", () => {
      validator.validateField("zipCode", "9000A");
      expect(validator.hasFieldError("zipCode")).toBe(true);
    });

    test("should reject zip code with less than 5 digits", () => {
      validator.validateField("zipCode", "9000");
      expect(validator.hasFieldError("zipCode")).toBe(true);
    });

    test("should reject empty zip code", () => {
      validator.validateField("zipCode", "");
      expect(validator.hasFieldError("zipCode")).toBe(true);
    });
  });

  describe("validateField() - Credit Card", () => {
    test("should accept valid credit card number", () => {
      validator.validateField("cardNumber", "4532015112830366");
      expect(validator.hasFieldError("cardNumber")).toBe(false);
    });

    test("should accept credit card with spaces", () => {
      validator.validateField("cardNumber", "4532 0151 1283 0366");
      expect(validator.hasFieldError("cardNumber")).toBe(false);
    });

    test("should reject invalid credit card number using Luhn", () => {
      validator.validateField("cardNumber", "4532015112830367");
      expect(validator.hasFieldError("cardNumber")).toBe(true);
    });

    test("should reject card number with less than 13 digits", () => {
      validator.validateField("cardNumber", "453201511283");
      expect(validator.hasFieldError("cardNumber")).toBe(true);
    });

    test("should reject card number with letters", () => {
      validator.validateField("cardNumber", "4532015112830ABC");
      expect(validator.hasFieldError("cardNumber")).toBe(true);
    });

    test("should reject empty card number", () => {
      validator.validateField("cardNumber", "");
      expect(validator.hasFieldError("cardNumber")).toBe(true);
    });
  });

  describe("validateField() - Expiry Date", () => {
    test("should accept valid future expiry date", () => {
      const futureDate = "12/26";
      validator.validateField("expiryDate", futureDate);
      expect(validator.hasFieldError("expiryDate")).toBe(false);
    });

    test("should reject expired date", () => {
      const pastDate = "01/19";
      validator.validateField("expiryDate", pastDate);
      expect(validator.hasFieldError("expiryDate")).toBe(true);
    });

    test("should accept current month if year is future", () => {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear() + 1;
      const paddedMonth = String(currentMonth).padStart(2, "0");
      const yearTwo = String(currentYear).slice(-2);
      const date = `${paddedMonth}/${yearTwo}`;

      validator.validateField("expiryDate", date);
      expect(validator.hasFieldError("expiryDate")).toBe(false);
    });

    test("should reject invalid month", () => {
      validator.validateField("expiryDate", "13/25");
      expect(validator.hasFieldError("expiryDate")).toBe(true);
    });

    test("should reject date with wrong format", () => {
      validator.validateField("expiryDate", "12-25");
      expect(validator.hasFieldError("expiryDate")).toBe(true);
    });

    test("should reject empty expiry date", () => {
      validator.validateField("expiryDate", "");
      expect(validator.hasFieldError("expiryDate")).toBe(true);
    });

    test("should reject single digit month without leading zero", () => {
      validator.validateField("expiryDate", "1/25");
      expect(validator.hasFieldError("expiryDate")).toBe(true);
    });
  });

  describe("validateField() - CVV", () => {
    test("should accept 3-digit CVV", () => {
      validator.validateField("cvv", "123");
      expect(validator.hasFieldError("cvv")).toBe(false);
    });

    test("should accept 4-digit CVV", () => {
      validator.validateField("cvv", "1234");
      expect(validator.hasFieldError("cvv")).toBe(false);
    });

    test("should reject CVV with less than 3 digits", () => {
      validator.validateField("cvv", "12");
      expect(validator.hasFieldError("cvv")).toBe(true);
    });

    test("should reject CVV with more than 4 digits", () => {
      validator.validateField("cvv", "12345");
      expect(validator.hasFieldError("cvv")).toBe(true);
    });

    test("should reject CVV with letters", () => {
      validator.validateField("cvv", "12A");
      expect(validator.hasFieldError("cvv")).toBe(true);
    });

    test("should reject empty CVV", () => {
      validator.validateField("cvv", "");
      expect(validator.hasFieldError("cvv")).toBe(true);
    });
  });

  describe("Luhn Algorithm", () => {
    test("should validate correct credit card using Luhn", () => {
      // Valid test card number
      const validCard = "4532015112830366"; // Visa test card
      const result = validator.validateCardNumber(validCard);
      expect(result).toBeNull();
    });

    test("should reject invalid credit card using Luhn", () => {
      const invalidCard = "4532015112830367"; // Off by one
      const result = validator.validateCardNumber(invalidCard);
      expect(result).not.toBeNull();
      expect(typeof result).toBe("string");
    });

    test("should handle card with spaces in Luhn check", () => {
      const cardWithSpaces = "4532 0151 1283 0366";
      // The validator strips spaces before Luhn check
      validator.validateField("cardNumber", cardWithSpaces);
      expect(validator.hasFieldError("cardNumber")).toBe(false);
    });

    test("should handle single digit cards", () => {
      const result = validator.validateCardNumber("0");
      expect(result).not.toBeNull();
    });
  });

  describe("hasFieldError()", () => {
    test("should return true if field has error", () => {
      validator.validateField("firstName", "");
      expect(validator.hasFieldError("firstName")).toBe(true);
    });

    test("should return false if field has no error", () => {
      validator.validateField("firstName", "John");
      expect(validator.hasFieldError("firstName")).toBe(false);
    });

    test("should return false for non-existent field", () => {
      expect(validator.hasFieldError("nonExistent")).toBe(false);
    });
  });

  describe("getFieldError()", () => {
    test("should return error message for invalid field", () => {
      validator.validateField("email", "invalid");
      const error = validator.getFieldError("email");
      expect(typeof error).toBe("string");
      expect(error.length).toBeGreaterThan(0);
    });

    test("should return null for valid field", () => {
      validator.validateField("email", "john@example.com");
      const error = validator.getFieldError("email");
      expect(error).toBeNull();
    });

    test("should return null for non-existent field", () => {
      const error = validator.getFieldError("nonExistent");
      expect(error).toBeNull();
    });
  });

  describe("clearErrors()", () => {
    test("should clear all errors", () => {
      validator.validateField("firstName", "");
      validator.validateField("email", "invalid");
      expect(Object.keys(validator.errors).length).toBeGreaterThan(0);

      validator.clearErrors();
      expect(validator.errors).toEqual({});
    });
  });

  describe("Error Messages", () => {
    test("should provide clear error message for required field", () => {
      validator.validateField("firstName", "");
      const error = validator.getFieldError("firstName");
      expect(error.toLowerCase()).toContain("required");
    });

    test("should provide clear error message for invalid format", () => {
      validator.validateField("email", "invalid");
      const error = validator.getFieldError("email");
      expect(error.toLowerCase()).toContain("email");
    });

    test("should include field name in error message", () => {
      validator.validateField("firstName", "");
      const error = validator.getFieldError("firstName");
      expect(error).toContain("First Name");
    });
  });

  describe("Edge Cases", () => {
    test("should handle null values", () => {
      validator.validateField("firstName", null);
      expect(validator.hasFieldError("firstName")).toBe(true);
    });

    test("should handle undefined values", () => {
      validator.validateField("firstName", undefined);
      expect(validator.hasFieldError("firstName")).toBe(true);
    });

    test("should handle whitespace-only values", () => {
      validator.validateField("firstName", "   ");
      expect(validator.hasFieldError("firstName")).toBe(true);
    });

    test("should handle very long input", () => {
      const longString = "A".repeat(1000);
      validator.validateField("firstName", longString);
      expect(validator.hasFieldError("firstName")).toBe(true);
    });

    test("should handle special characters in names", () => {
      validator.validateField("firstName", "Jean-Pierre");
      expect(validator.hasFieldError("firstName")).toBe(false);
    });
  });
});
