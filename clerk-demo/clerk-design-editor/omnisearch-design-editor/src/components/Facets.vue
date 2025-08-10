<template>
  <div class="facets-component" :style="componentStyles">
    <div class="facets-container global-container">
      <h3 class="facets-title global-title">Filter Products</h3>
      
      <div class="facet-group">
        <h4 class="facet-label">Price Range</h4>
        <div class="facet-options">
          <label v-for="range in facets.priceRanges" :key="range.id" class="facet-option">
            <input type="checkbox" class="facet-checkbox"> {{ range.label }}
          </label>
        </div>
      </div>

      <div class="facet-group">
        <h4 class="facet-label">Brand</h4>
        <div class="facet-options">
          <label v-for="brand in facets.brands" :key="brand.id" class="facet-option">
            <input type="checkbox" class="facet-checkbox"> {{ brand.name }} ({{ brand.count }})
          </label>
        </div>
      </div>

      <div class="facet-group">
        <h4 class="facet-label">Rating</h4>
        <div class="facet-options">
          <label v-for="rating in facets.ratings" :key="rating.stars" class="facet-option">
            <input type="checkbox" class="facet-checkbox"> {{ rating.label }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { dataService } from '../services/dataService.js'

defineProps({
  componentStyles: {
    type: Object,
    default: () => ({})
  }
})

const facets = computed(() => dataService.getFacets())
</script>