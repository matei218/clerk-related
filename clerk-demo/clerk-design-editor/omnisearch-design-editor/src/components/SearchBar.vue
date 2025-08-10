<template>
  <div class="search-bar-component">
    <div class="search-container">
      <input 
        type="text" 
        :placeholder="placeholder" 
        class="search-input"
        :style="componentStyles"
      />
      <button class="search-button" :style="componentStyles">
        🔍
      </button>
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

const placeholder = computed(() => dataService.getSearchPlaceholder())
</script>