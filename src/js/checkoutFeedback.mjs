/**
 * Checkout Feedback Module
 * Handles visual feedback, animations, and accessibility announcements
 */

export class CheckoutFeedback {
  constructor() {
    this.errorAnimationDuration = 300; // milliseconds
    this.announcer = this.createAccessibilityAnnouncer();
  }

  /**
   * Create accessibility announcer element
   * @returns {HTMLElement} Announcer element
   */
  createAccessibilityAnnouncer() {
    const announcer = document.createElement("div");
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only"; // Screen reader only
    announcer.style.position = "absolute";
    announcer.style.left = "-10000px";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.overflow = "hidden";
    document.body.appendChild(announcer);
    return announcer;
  }

  /**
   * Display field error with animation
   * @param {HTMLElement} field - Form field element
   * @param {String} errorMessage - Error message
   */
  displayFieldError(field, errorMessage) {
    const fieldGroup = field.closest(".form-group");
    if (!fieldGroup) return;

    // Add error class for styling
    fieldGroup.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", `error-${field.id}`);

    // Create or update error message
    let errorElement = fieldGroup.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.id = `error-${field.id}`;
      errorElement.setAttribute("role", "alert");
      fieldGroup.appendChild(errorElement);
    }

    // Animate error message in
    errorElement.textContent = errorMessage;
    errorElement.style.animation = "slideInError 0.3s ease-out";

    // Announce to screen reader
    this.announce(`Error: ${errorMessage}`);

    // Red shake animation for visual feedback
    this.playShakeAnimation(field);
  }

  /**
   * Clear field error
   * @param {HTMLElement} field - Form field element
   */
  clearFieldError(field) {
    const fieldGroup = field.closest(".form-group");
    if (!fieldGroup) return;

    fieldGroup.classList.remove("has-error");
    field.setAttribute("aria-invalid", "false");
    field.removeAttribute("aria-describedby");

    const errorElement = fieldGroup.querySelector(".error-message");
    if (errorElement) {
      errorElement.style.animation = "slideOutError 0.3s ease-out";
      setTimeout(() => {
        errorElement.remove();
      }, this.errorAnimationDuration);
    }
  }

  /**
   * Play shake animation on invalid field
   * @param {HTMLElement} field - Form field element
   */
  playShakeAnimation(field) {
    field.style.animation = "shake 0.5s ease-in-out";

    // Remove animation after it completes
    setTimeout(() => {
      field.style.animation = "";
    }, 500);
  }

  /**
   * Display form-level error alert
   * @param {String} message - Error message
   */
  displayFormError(message) {
    const form = document.querySelector(".checkout-form");
    if (!form) return;

    // Remove existing alerts
    const existingAlert = form.querySelector(".form-alert");
    if (existingAlert) {
      existingAlert.remove();
    }

    const alert = document.createElement("div");
    alert.className = "form-alert alert--error";
    alert.setAttribute("role", "alert");
    alert.setAttribute("aria-live", "assertive");
    alert.textContent = message;

    form.insertAdjacentElement("afterbegin", alert);

    // Animate alert in
    alert.style.animation = "slideDown 0.3s ease-out";

    // Announce to screen reader
    this.announce(`Error: ${message}`);

    // Focus first invalid field
    setTimeout(() => {
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }, 100);
  }

  /**
   * Display success message
   * @param {String} message - Success message
   */
  displaySuccess(message) {
    const form = document.querySelector(".checkout-form");
    if (!form) return;

    // Remove existing alerts
    const existingAlert = form.querySelector(".form-alert");
    if (existingAlert) {
      existingAlert.remove();
    }

    const alert = document.createElement("div");
    alert.className = "form-alert alert--success";
    alert.setAttribute("role", "status");
    alert.setAttribute("aria-live", "polite");
    alert.textContent = message;

    form.insertAdjacentElement("afterbegin", alert);

    // Animate alert in
    alert.style.animation = "slideDown 0.3s ease-out";

    // Announce to screen reader
    this.announce(`Success: ${message}`);
  }

  /**
   * Announce message to screen readers
   * @param {String} message - Message to announce
   */
  announce(message) {
    this.announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      this.announcer.textContent = "";
    }, 3000);
  }

  /**
   * Highlight field as valid
   * @param {HTMLElement} field - Form field element
   */
  markFieldValid(field) {
    const fieldGroup = field.closest(".form-group");
    if (!fieldGroup) return;

    fieldGroup.classList.remove("has-error");
    fieldGroup.classList.add("has-valid");
    field.setAttribute("aria-invalid", "false");
  }

  /**
   * Remove valid marking
   * @param {HTMLElement} field - Form field element
   */
  unmarkFieldValid(field) {
    const fieldGroup = field.closest(".form-group");
    if (!fieldGroup) return;

    fieldGroup.classList.remove("has-valid");
  }

  /**
   * Clear all form alerts
   */
  clearFormAlerts() {
    const alerts = document.querySelectorAll(".form-alert");
    alerts.forEach((alert) => {
      alert.style.animation = "slideUp 0.3s ease-out";
      setTimeout(() => alert.remove(), this.errorAnimationDuration);
    });
  }

  /**
   * Clear all field errors
   */
  clearAllFieldErrors() {
    document.querySelectorAll(".form-group.has-error").forEach((group) => {
      group.classList.remove("has-error");
      const field = group.querySelector("input, textarea, select");
      if (field) {
        field.setAttribute("aria-invalid", "false");
      }
      const error = group.querySelector(".error-message");
      if (error) {
        error.remove();
      }
    });
  }

  /**
   * Disable all form controls
   */
  disableForm() {
    document.querySelectorAll(".checkout-form input, .checkout-form select").forEach((field) => {
      field.disabled = true;
    });
    const submitBtn = document.querySelector(".btn-submit");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
    }
  }

  /**
   * Enable all form controls
   */
  enableForm() {
    document.querySelectorAll(".checkout-form input, .checkout-form select").forEach((field) => {
      field.disabled = false;
    });
    const submitBtn = document.querySelector(".btn-submit");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.setAttribute("aria-busy", "false");
    }
  }
}

export default CheckoutFeedback;
