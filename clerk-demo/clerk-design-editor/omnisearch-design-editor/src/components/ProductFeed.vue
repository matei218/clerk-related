<template>
  <div class="product-feed-component" :style="componentStyles">
    <div class="products-grid global-container">
      <div class="product-card global-card" v-for="product in products" :key="product.id">
        <div class="product-image">
          <div class="image-placeholder">📦</div>
        </div>
        <div class="product-info">
          <h3 class="product-title">{{ product.name }}</h3>
          <p class="product-price">${{ product.price }}</p>
          <p class="product-list-price">${{ product.list_price }}</p>
          <div class="product-rating">
            <span v-for="star in 5" :key="star" class="star">
              {{ star <= product.rating ? '⭐' : '☆' }}
            </span>
          </div>
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

const products = computed(() => dataService.getProducts())
</script>