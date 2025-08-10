<template>
  <div class="facets-component">
    <div class="facets-container" :style="componentStyles">
      <h3 class="facets-title">Filter Products</h3>
      
      <div class="facet-group">
        <h4 class="facet-label">Price Range</h4>
        <div class="facet-options">
          <label v-for="range in facets.priceRanges" :key="range.id">
            <input type="checkbox"> {{ range.label }}
          </label>
        </div>
      </div>

      <div class="facet-group">
        <h4 class="facet-label">Brand</h4>
        <div class="facet-options">
          <label v-for="brand in facets.brands" :key="brand.id">
            <input type="checkbox"> {{ brand.name }} ({{ brand.count }})
          </label>
        </div>
      </div>

      <div class="facet-group">
        <h4 class="facet-label">Rating</h4>
        <div class="facet-options">
          <label v-for="rating in facets.ratings" :key="rating.stars">
            <input type="checkbox"> {{ rating.label }}
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