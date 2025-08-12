<template>
  <div class="style-section">
    <h3>Global Styles</h3>
    <p class="section-description">These styles apply to all components</p>
    <div class="style-controls">
      <div class="style-group">
        <label>Font Size:</label>
        <input v-model="globalStyles.global.fontSize" type="text" placeholder="16px" @input="onStyleChange('Updated global font size')" />
      </div>
      
      <div class="style-group">
        <label>Font Family:</label>
        <select v-model="globalStyles.global.fontFamily" @change="onStyleChange('Updated global font family')">
          <option value="Arial, sans-serif">Arial</option>
          <option value="Helvetica, sans-serif">Helvetica</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Courier New', monospace">Courier New</option>
        </select>
      </div>
      
      <div class="style-group">
        <label>Primary Color:</label>
        <input v-model="globalStyles.global.primaryColor" type="color" @input="onStyleChange('Updated primary color')" />
      </div>
      
      <div class="style-group">
        <label>Primary List Color:</label>
        <input v-model="globalStyles.global.primaryListColor" type="color" @input="onStyleChange('Updated primary color')" />
      </div>

      <div class="style-group">
        <label>Background Color:</label>
        <input v-model="globalStyles.global.backgroundColor" type="color" @input="onStyleChange('Updated background color')" />
      </div>
      
      <div class="style-group">
        <label>Text Color:</label>
        <input v-model="globalStyles.global.textColor" type="color" @input="onStyleChange('Updated text color')" />
      </div>
      
      <div class="style-group">
        <label>Title Color:</label>
        <input v-model="globalStyles.global.titleColor" type="color" @input="onStyleChange('Updated title color')" />
      </div>
      
      <div class="style-group">
        <label>Link Color:</label>
        <input v-model="globalStyles.global.linkColor" type="color" @input="onStyleChange('Updated link color')" />
      </div>
      
      <div class="style-group">
        <label>Button Color:</label>
        <input v-model="globalStyles.global.buttonColor" type="color" @input="onStyleChange('Updated button color')" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  globalStyles: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['styleChange'])

const onStyleChange = (details) => {
  emit('styleChange', details)
}
</script>