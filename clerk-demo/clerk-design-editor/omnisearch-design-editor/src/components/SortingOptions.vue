<template>
  <div class="sorting-options-component">
    <div class="sorting-container">
      <label class="sorting-label">Sort by:</label>
      <select class="sorting-select" :style="componentStyles">
        <option 
          v-for="option in sortingOptions" 
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
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

const sortingOptions = computed(() => dataService.getSortingOptions())
</script>