<template>
  <div class="html-renderer">
    <div class="generated-layout" :style="computedStyles">
      <div v-for="row in layout" :key="row.id" class="generated-row">
        <div v-for="column in row.columns" :key="column.id" class="generated-column" :style="{ width: column.width || 'auto' }">
          <div 
            v-for="component in column.components"
            :key="component.id"
            :style="getComponentStyles(component.type)"
          >
            <component 
              :is="components[component.type]"
              :componentStyles="getComponentStyles(component.type)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SearchBar from './SearchBar.vue'
import SortingOptions from './SortingOptions.vue'
import ProductFeed from './ProductFeed.vue'
import Facets from './Facets.vue'
import Pages from './Pages.vue'
import Categories from './Categories.vue'

const props = defineProps({
  layout: {
    type: Array,
    required: true
  },
  globalStyles: {
    type: Object,
    required: true
  }
})

const components = {
  SearchBar,
  SortingOptions,
  ProductFeed,
  Facets,
  Pages,
  Categories
}

const computedStyles = computed(() => ({
  fontFamily: props.globalStyles.global.fontFamily,
  fontSize: props.globalStyles.global.fontSize,
  color: props.globalStyles.global.textColor,
  backgroundColor: props.globalStyles.global.backgroundColor,
  '--primary-color': props.globalStyles.global.primaryColor,
  '--title-color': props.globalStyles.global.titleColor,
  '--subtitle-color': props.globalStyles.global.subtitleColor,
  '--link-color': props.globalStyles.global.linkColor,
  '--button-color': props.globalStyles.global.buttonColor,
  '--button-text-color': props.globalStyles.global.buttonTextColor,
  '--container-border': props.globalStyles.global.containerBorder,
  '--card-shadow': props.globalStyles.global.cardShadow
}))

const getComponentStyles = (componentType) => {
  const componentStyles = props.globalStyles.components[componentType] || {}
  const cssVars = {}
  
  Object.entries(componentStyles).forEach(([key, value]) => {
    const cssKey = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase()
    cssVars[cssKey] = value
  })
  
  return {
    ...computedStyles.value,
    ...cssVars
  }
}

const generateHTML = () => {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Layout</title>
  <style>
    body {
      font-family: ${props.globalStyles.global.fontFamily};
      font-size: ${props.globalStyles.global.fontSize};
      color: ${props.globalStyles.global.textColor};
      background-color: ${props.globalStyles.global.backgroundColor};
      margin: 0;
      padding: 20px;
    }
    .row { display: flex; margin: 20px 0; gap: 20px; }
    .column { flex: 1; }
  </style>
</head>
<body>\n`
  
  props.layout.forEach(row => {
    html += '  <div class="row">\n'
    row.columns.forEach(column => {
      html += '    <div class="column">\n'
      column.components.forEach(component => {
        html += `      <!-- ${component.type} Component -->\n`
        html += '      <div class="component">Component: ' + component.type + '</div>\n'
      })
      html += '    </div>\n'
    })
    html += '  </div>\n'
  })
  
  html += '</body>\n</html>'
  return html
}

defineExpose({
  generateHTML
})
</script>

<style scoped>
.html-renderer {
  width: 100%;
  height: 100%;
}

.generated-layout {
  padding: 20px;
  min-height: 500px;
}

.generated-row {
  display: flex;
  margin: 20px 0;
  gap: 20px;
}

/* .generated-column styles removed to allow custom widths */
</style>