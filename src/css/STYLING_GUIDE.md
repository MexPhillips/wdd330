/**
 * CSS Classes and Styling Guide for Product Components
 * Add these styles to your style.css for proper formatting
 */

/* 
  Recommended CSS for Product Cards:
  
  .product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    padding: 1rem;
    transition: box-shadow 0.3s ease;
  }
  
  .product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
  
  .card__brand {
    font-size: 0.9rem;
    color: #666;
    margin: 0.5rem 0 0;
  }
  
  .card__name {
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }
  
  .product-card__price {
    font-size: 1.3rem;
    font-weight: bold;
    color: #d32f2f;
    margin: 0.5rem 0;
  }
  
  .view-details-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    transition: background-color 0.3s ease;
  }
  
  .view-details-btn:hover {
    background-color: #0056b3;
  }
  
  .view-details-btn:focus {
    outline: 2px solid #0056b3;
    outline-offset: 2px;
  }
  
  Recommended CSS for Product Details:
  
  .product-details {
    margin-top: 2rem;
    padding: 2rem;
    border-top: 2px solid #ddd;
  }
  
  .details-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-width: 1000px;
  }
  
  @media (max-width: 768px) {
    .details-container {
      grid-template-columns: 1fr;
    }
  }
  
  .details-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  
  .details-info h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .details-color,
  .details-price {
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }
  
  .details-price {
    font-weight: bold;
    color: #d32f2f;
    font-size: 1.5rem;
  }
  
  .details-msrp {
    color: #999;
    text-decoration: line-through;
    font-size: 0.9rem;
  }
  
  .add-to-cart-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
    width: 100%;
    margin-top: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .add-to-cart-btn:hover {
    background-color: #218838;
  }
  
  .add-to-cart-btn:focus {
    outline: 2px solid #218838;
    outline-offset: 2px;
  }
  
  .error-message {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
    padding: 1rem;
    border-radius: 4px;
    list-style: none;
  }
  
  Accessibility Note:
  - All buttons have focus states with visible outlines
  - Images have alt text for screen readers
  - ARIA labels added for better context
  - Sufficient color contrast for visibility
  - Keyboard navigation fully supported
*/
