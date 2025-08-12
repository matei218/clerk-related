<template>
  <div class="style-section">
    <h4>{{ componentName }} Styles</h4>
    <div class="style-controls">
      <!-- SearchBar specific styles -->
      <template v-if="componentName === 'SearchBar'">
        <div class="style-group">
          <label>Input Border Color:</label>
          <input v-model="componentStyle.inputBorderColor" type="color" @input="onStyleChange('Updated SearchBar input border color')" />
        </div>
        <div class="style-group">
          <label>Input Focus Color:</label>
          <input v-model="componentStyle.inputFocusColor" type="color" @input="onStyleChange('Updated SearchBar input focus color')" />
        </div>
        <div class="style-group">
          <label>Button Hover Color:</label>
          <input v-model="componentStyle.buttonHoverColor" type="color" @input="onStyleChange('Updated SearchBar button hover color')" />
        </div>
      </template>

      <!-- SortingOptions specific styles -->
      <template v-if="componentName === 'SortingOptions'">
        <div class="style-group">
          <label>Label Color:</label>
          <input v-model="componentStyle.labelColor" type="color" @input="onStyleChange('Updated SortingOptions label color')" />
        </div>
        <div class="style-group">
          <label>Select Border Color:</label>
          <input v-model="componentStyle.selectBorderColor" type="color" @input="onStyleChange('Updated SortingOptions select border color')" />
        </div>
        <div class="style-group">
          <label>Select Focus Color:</label>
          <input v-model="componentStyle.selectFocusColor" type="color" @input="onStyleChange('Updated SortingOptions select focus color')" />
        </div>
      </template>

      <!-- ProductFeed specific styles -->
      <template v-if="componentName === 'ProductFeed'">
        <div class="style-group">
          <label>Product Title Color:</label>
          <input v-model="componentStyle.titleColor" type="color" @input="onStyleChange('Updated ProductFeed title color')" />
        </div>
        <div class="style-group">
          <label>Price Color:</label>
          <input v-model="componentStyle.priceColor" type="color" @input="onStyleChange('Updated ProductFeed price color')" />
        </div>
        <div class="style-group">
          <label>List Price Color:</label>
          <input v-model="componentStyle.listPriceColor" type="color" @input="onStyleChange('Updated ProductFeed list price color')" />
        </div>
        <div class="style-group">
          <label>Rating Color:</label>
          <input v-model="componentStyle.ratingColor" type="color" @input="onStyleChange('Updated ProductFeed rating color')" />
        </div>
        <div class="style-group">
          <label>Card Border Color:</label>
          <input v-model="componentStyle.cardBorderColor" type="color" @input="onStyleChange('Updated ProductFeed card border color')" />
        </div>
      </template>

      <!-- Facets specific styles -->
      <template v-if="componentName === 'Facets'">
        <div class="style-group">
          <label>Facet Title Color:</label>
          <input v-model="componentStyle.titleColor" type="color" @input="onStyleChange('Updated Facets title color')" />
        </div>
        <div class="style-group">
          <label>Facet Label Color:</label>
          <input v-model="componentStyle.labelColor" type="color" @input="onStyleChange('Updated Facets label color')" />
        </div>
        <div class="style-group">
          <label>Option Text Color:</label>
          <input v-model="componentStyle.optionColor" type="color" @input="onStyleChange('Updated Facets option color')" />
        </div>
        <div class="style-group">
          <label>Container Background:</label>
          <input v-model="componentStyle.containerBackground" type="color" @input="onStyleChange('Updated Facets container background')" />
        </div>
      </template>

      <!-- Pages specific styles -->
      <template v-if="componentName === 'Pages'">
        <div class="style-group">
          <label>Title Color:</label>
          <input v-model="componentStyle.titleColor" type="color" @input="onStyleChange('Updated Pages title color')" />
        </div>
        <div class="style-group">
          <label>Link Color:</label>
          <input v-model="componentStyle.linkColor" type="color" @input="onStyleChange('Updated Pages link color')" />
        </div>
        <div class="style-group">
          <label>Link Hover Color:</label>
          <input v-model="componentStyle.linkHoverColor" type="color" @input="onStyleChange('Updated Pages link hover color')" />
        </div>
        <div class="style-group">
          <label>Container Background:</label>
          <input v-model="componentStyle.containerBackground" type="color" @input="onStyleChange('Updated Pages container background')" />
        </div>
      </template>

      <!-- Categories specific styles -->
      <template v-if="componentName === 'Categories'">
        <div class="style-group">
          <label>Title Color:</label>
          <input v-model="componentStyle.titleColor" type="color" @input="onStyleChange('Updated Categories title color')" />
        </div>
        <div class="style-group">
          <label>Category Name Color:</label>
          <input v-model="componentStyle.nameColor" type="color" @input="onStyleChange('Updated Categories name color')" />
        </div>
        <div class="style-group">
          <label>Count Text Color:</label>
          <input v-model="componentStyle.countColor" type="color" @input="onStyleChange('Updated Categories count color')" />
        </div>
        <div class="style-group">
          <label>Icon Size:</label>
          <input v-model="componentStyle.iconSize" type="text" placeholder="48px" @input="onStyleChange('Updated Categories icon size')" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  componentName: {
    type: String,
    required: true
  },
  componentStyle: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['styleChange'])

const onStyleChange = (details) => {
  emit('styleChange', details)
}
</script>