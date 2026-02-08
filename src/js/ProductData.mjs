function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor() {
    this.baseUrl = "/json/";
  }
  
  /**
   * Get product data from the specified category
   * @param {string} category - The category name (e.g., 'tents', 'backpacks', 'sleeping-bags')
   * @returns {Promise<Array>} Array of products
   */
  getData(category) {
    const path = `${this.baseUrl}${category}.json`;
    return fetch(path)
      .then(convertToJson)
      .then((data) => {
        // Handle different data structures
        let products = Array.isArray(data) ? data : data.Result || data;
        
        // Normalize image properties for consistency
        return products.map(product => {
          // If product has Images property (from backpacks.json), extract the main image
          if (!product.Image && product.Images) {
            product.Image = product.Images.PrimaryLarge || 
                           product.Images.PrimaryMedium || 
                           product.Images.PrimarySmall;
          }
          return product;
        });
      });
  }
  
  /**
   * Find a product by ID across all categories
   * @param {string} id - The product ID
   * @param {string} category - The category to search in
   * @returns {Promise<Object>} The product object
   */
  async findProductById(id, category) {
    const products = await this.getData(category);
    return products.find((item) => item.Id === id);
  }
}
