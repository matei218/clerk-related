import mockData from '../data/mockData.json'

export const dataService = {
  getProducts() {
    return mockData.products
  },

  getCategories() {
    return mockData.categories
  },

  getSortingOptions() {
    return mockData.sortingOptions
  },

  getFacets() {
    return mockData.facets
  },

  getPages() {
    return mockData.pages
  },

  getSearchPlaceholder() {
    return mockData.searchPlaceholder
  }
}