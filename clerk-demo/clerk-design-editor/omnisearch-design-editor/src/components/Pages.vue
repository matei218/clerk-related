<template>
  <div class="pages-component" :style="componentStyles">
    <div class="pages-container global-container">
      <h3 class="pages-title global-title">Site Pages</h3>
      <div class="pages-list">
        <a 
          v-for="page in pages" 
          :key="page.id"
          :href="page.link"
          class="page-link global-link"
        >
          {{ page.name }}
        </a>
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

const pages = computed(() => dataService.getPages())
</script>