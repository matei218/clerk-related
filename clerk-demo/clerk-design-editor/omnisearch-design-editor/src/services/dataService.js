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
  },

  getStyleElements() {
    return mockData.styleElements
  },

  getGlobalStyleElements() {
    return mockData.styleElements.global
  },

  getComponentStyleElements(componentName) {
    return mockData.styleElements.components[componentName] || {}
  }
}