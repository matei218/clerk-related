<template>
  <div class="categories-component" :style="componentStyles">
    <div class="categories-container global-container">
      <h3 class="categories-title global-title">Shop by Category</h3>
      <div class="categories-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-card global-card"
        >
          <h4 class="category-name">{{ category.name }}</h4>
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

const categories = computed(() => dataService.getCategories())
</script>