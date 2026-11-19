import SearchEventHandler from "../js/searchEventHandler.mjs";

describe("SearchEventHandler", () => {
  test("prevents form navigation and searches the submitted value", () => {
    const handler = Object.create(SearchEventHandler.prototype);
    handler.searchRenderer = {
      getSearchValue: jest.fn(() => "tent"),
      hideSuggestions: jest.fn(),
    };
    handler.performSearch = jest.fn();
    const event = { preventDefault: jest.fn() };

    handler.handleSearchSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(handler.performSearch).toHaveBeenCalledWith("tent");
    expect(handler.searchRenderer.hideSuggestions).toHaveBeenCalled();
  });

  test("renders products when search results are updated", () => {
    const handler = Object.create(SearchEventHandler.prototype);
    handler.productListRenderer = { displayProductList: jest.fn() };
    const products = [{ Id: "tent-1" }];
    const log = jest.spyOn(console, "log").mockImplementation(() => {});

    handler.handleSearchResultsUpdated({
      detail: { products, searchTerm: "tent" },
    });

    expect(handler.productListRenderer.displayProductList).toHaveBeenCalledWith(
      products
    );
    log.mockRestore();
  });
});
