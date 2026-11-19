/**
 * Inventory Main Module
 * Entry point for inventory management system
 * Coordinates all inventory-related modules
 */

import InventoryManager from "./inventoryManager.mjs";
import InventoryRenderer from "./inventoryRenderer.mjs";
import InventoryFormHandler from "./inventoryFormHandler.mjs";

/**
 * Initialize inventory management system
 */
async function initializeInventorySystem() {
  try {
    // Create manager instance
    const inventoryManager = new InventoryManager("tents");

    // Create renderer instance
    const inventoryRenderer = new InventoryRenderer(inventoryManager);

    // Create form handler instance
    new InventoryFormHandler(inventoryManager, inventoryRenderer);

    // Initial render
    inventoryRenderer.render();
    inventoryRenderer.updateCountDisplay();

    console.log("Inventory system initialized successfully");
  } catch (error) {
    console.error("Failed to initialize inventory system:", error);
    displayFatalError(
      "Failed to initialize inventory system. Please refresh the page."
    );
  }
}

/**
 * Display fatal error to user
 * @param {String} message - Error message
 */
function displayFatalError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert--error";
  errorDiv.setAttribute("role", "alert");
  errorDiv.textContent = message;
  document.body.insertAdjacentElement("afterbegin", errorDiv);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeInventorySystem);
} else {
  initializeInventorySystem();
}
