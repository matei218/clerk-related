<script setup>
import { ref, computed } from 'vue'
import SearchBar from './components/SearchBar.vue'
import SortingOptions from './components/SortingOptions.vue'
import ProductFeed from './components/ProductFeed.vue'
import Facets from './components/Facets.vue'
import Pages from './components/Pages.vue'
import Categories from './components/Categories.vue'

const components = {
  SearchBar,
  SortingOptions,
  ProductFeed,
  Facets,
  Pages,
  Categories
}

const availableComponents = [
  { id: 'SearchBar', name: 'Search Bar', used: false },
  { id: 'SortingOptions', name: 'Sorting Options', used: false },
  { id: 'ProductFeed', name: 'Product Feed', used: false },
  { id: 'Facets', name: 'Facets', used: false },
  { id: 'Pages', name: 'Pages', used: false },
  { id: 'Categories', name: 'Categories', used: false }
]

const layout = ref([])
const activeTab = ref('editor')
const darkMode = ref(false)
const globalStyles = ref({
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  primaryColor: '#007bff',
  backgroundColor: '#ffffff',
  textColor: '#333333'
})

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

const addRow = () => {
  layout.value.push({
    id: Date.now(),
    columns: [{
      id: Date.now() + 1,
      components: []
    }]
  })
}

const addColumn = (rowIndex) => {
  layout.value[rowIndex].columns.push({
    id: Date.now(),
    components: []
  })
}

const addComponent = (rowIndex, columnIndex, componentId) => {
  const component = availableComponents.find(c => c.id === componentId)
  if (component && !component.used) {
    layout.value[rowIndex].columns[columnIndex].components.push({
      id: Date.now(),
      type: componentId,
      styles: {}
    })
    component.used = true
  }
}

const removeComponent = (rowIndex, columnIndex, componentIndex) => {
  const component = layout.value[rowIndex].columns[columnIndex].components[componentIndex]
  const availableComponent = availableComponents.find(c => c.id === component.type)
  if (availableComponent) {
    availableComponent.used = false
  }
  layout.value[rowIndex].columns[columnIndex].components.splice(componentIndex, 1)
}

const moveRowUp = (rowIndex) => {
  if (rowIndex > 0) {
    const row = layout.value.splice(rowIndex, 1)[0]
    layout.value.splice(rowIndex - 1, 0, row)
  }
}

const moveRowDown = (rowIndex) => {
  if (rowIndex < layout.value.length - 1) {
    const row = layout.value.splice(rowIndex, 1)[0]
    layout.value.splice(rowIndex + 1, 0, row)
  }
}

const moveColumnLeft = (rowIndex, columnIndex) => {
  if (columnIndex > 0) {
    const column = layout.value[rowIndex].columns.splice(columnIndex, 1)[0]
    layout.value[rowIndex].columns.splice(columnIndex - 1, 0, column)
  }
}

const moveColumnRight = (rowIndex, columnIndex) => {
  const row = layout.value[rowIndex]
  if (columnIndex < row.columns.length - 1) {
    const column = row.columns.splice(columnIndex, 1)[0]
    row.columns.splice(columnIndex + 1, 0, column)
  }
}

const moveComponentUp = (rowIndex, columnIndex, componentIndex) => {
  if (componentIndex > 0) {
    const column = layout.value[rowIndex].columns[columnIndex]
    const component = column.components.splice(componentIndex, 1)[0]
    column.components.splice(componentIndex - 1, 0, component)
  }
}

const moveComponentDown = (rowIndex, columnIndex, componentIndex) => {
  const column = layout.value[rowIndex].columns[columnIndex]
  if (componentIndex < column.components.length - 1) {
    const component = column.components.splice(componentIndex, 1)[0]
    column.components.splice(componentIndex + 1, 0, component)
  }
}

const removeRow = (rowIndex) => {
  const row = layout.value[rowIndex]
  row.columns.forEach(column => {
    column.components.forEach(component => {
      const availableComponent = availableComponents.find(c => c.id === component.type)
      if (availableComponent) {
        availableComponent.used = false
      }
    })
  })
  layout.value.splice(rowIndex, 1)
}

const removeColumn = (rowIndex, columnIndex) => {
  const column = layout.value[rowIndex].columns[columnIndex]
  column.components.forEach(component => {
    const availableComponent = availableComponents.find(c => c.id === component.type)
    if (availableComponent) {
      availableComponent.used = false
    }
  })
  layout.value[rowIndex].columns.splice(columnIndex, 1)
}

const computedGlobalStyles = computed(() => ({
  fontSize: globalStyles.value.fontSize,
  fontFamily: globalStyles.value.fontFamily,
  color: globalStyles.value.textColor,
  '--primary-color': globalStyles.value.primaryColor
}))

const computedPreviewStyles = computed(() => ({
  fontSize: globalStyles.value.fontSize,
  fontFamily: globalStyles.value.fontFamily,
  color: globalStyles.value.textColor,
  backgroundColor: globalStyles.value.backgroundColor,
  '--primary-color': globalStyles.value.primaryColor
}))

const generateHTML = () => {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Layout</title>
  <style>
    body {
      font-family: ${globalStyles.value.fontFamily};
      font-size: ${globalStyles.value.fontSize};
      color: ${globalStyles.value.textColor};
      background-color: ${globalStyles.value.backgroundColor};
      margin: 0;
      padding: 20px;
    }
    .row { display: flex; margin: 20px 0; gap: 20px; }
    .column { flex: 1; }
  </style>
</head>
<body>\n`
  
  layout.value.forEach(row => {
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
</script>

<template>
  <div class="design-editor" :class="{ 'dark-mode': darkMode }">
    <header class="editor-header">
      <h1>Design Editor</h1>
      <div class="header-controls">
        <div class="tabs">
          <button 
            :class="{ active: activeTab === 'editor' }"
            @click="activeTab = 'editor'"
          >
            Editor
          </button>
          <button 
            :class="{ active: activeTab === 'styles' }"
            @click="activeTab = 'styles'"
          >
            Global Styles
          </button>
          <button 
            :class="{ active: activeTab === 'preview' }"
            @click="activeTab = 'preview'"
          >
            Preview
          </button>
        </div>
        <button @click="toggleDarkMode" class="dark-mode-toggle">
          {{ darkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <main class="editor-main">
      <!-- Editor Tab -->
      <div v-if="activeTab === 'editor'" class="editor-content">
        <div class="sidebar">
          <h3>Available Components</h3>
          <div class="component-list">
            <div 
              v-for="component in availableComponents" 
              :key="component.id"
              :class="{ 'component-item': true, 'used': component.used }"
            >
              <span>{{ component.name }}</span>
              <span v-if="component.used" class="used-label">Used</span>
            </div>
          </div>
          
          <div class="actions">
            <button @click="addRow" class="btn-primary">Add Row</button>
          </div>
        </div>

        <div class="canvas">
          <div v-if="layout.length === 0" class="empty-canvas">
            <p>Click "Add Row" to start building your layout</p>
          </div>
          
          <div v-for="(row, rowIndex) in layout" :key="row.id" class="row-container">
            <div class="row-header">
              <span>Row {{ rowIndex + 1 }}</span>
              <div class="row-controls">
                <button @click="moveRowUp(rowIndex)" :disabled="rowIndex === 0">↑</button>
                <button @click="moveRowDown(rowIndex)" :disabled="rowIndex === layout.length - 1">↓</button>
                <button @click="addColumn(rowIndex)">+ Column</button>
                <button @click="removeRow(rowIndex)" class="btn-danger">Delete Row</button>
              </div>
            </div>
            
            <div class="row-content">
              <div 
                v-for="(column, columnIndex) in row.columns" 
                :key="column.id"
                class="column-container"
              >
                <div class="column-header">
                  <span>Column {{ columnIndex + 1 }}</span>
                  <div class="column-controls">
                    <button @click="moveColumnLeft(rowIndex, columnIndex)" :disabled="columnIndex === 0">←</button>
                    <button @click="moveColumnRight(rowIndex, columnIndex)" :disabled="columnIndex === row.columns.length - 1">→</button>
                    <button @click="removeColumn(rowIndex, columnIndex)" class="btn-danger">×</button>
                  </div>
                </div>
                
                <div class="column-content">
                  <div v-if="column.components.length === 0" class="empty-column">
                    <select @change="addComponent(rowIndex, columnIndex, $event.target.value)" class="component-select">
                      <option value="">Select Component</option>
                      <option 
                        v-for="component in availableComponents.filter(c => !c.used)" 
                        :key="component.id"
                        :value="component.id"
                      >
                        {{ component.name }}
                      </option>
                    </select>
                  </div>
                  
                  <div 
                    v-for="(component, componentIndex) in column.components" 
                    :key="component.id"
                    class="component-wrapper"
                  >
                    <div class="component-header">
                      <span>{{ component.type }}</span>
                      <div class="component-controls">
                        <button @click="moveComponentUp(rowIndex, columnIndex, componentIndex)" :disabled="componentIndex === 0">↑</button>
                        <button @click="moveComponentDown(rowIndex, columnIndex, componentIndex)" :disabled="componentIndex === column.components.length - 1">↓</button>
                        <button @click="removeComponent(rowIndex, columnIndex, componentIndex)" class="btn-danger">×</button>
                      </div>
                    </div>
                    <div class="component-preview">
                      <div class="component-placeholder">
                        {{ component.type }}
                      </div>
                    </div>
                    
                    <div v-if="componentIndex === column.components.length - 1" class="add-component-below">
                      <select @change="addComponent(rowIndex, columnIndex, $event.target.value)" class="component-select">
                        <option value="">Add Component Below</option>
                        <option 
                          v-for="availableComp in availableComponents.filter(c => !c.used)" 
                          :key="availableComp.id"
                          :value="availableComp.id"
                        >
                          {{ availableComp.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Global Styles Tab -->
      <div v-if="activeTab === 'styles'" class="styles-content">
        <h3>Global Styles</h3>
        <div class="style-controls">
          <div class="style-group">
            <label>Font Size:</label>
            <input v-model="globalStyles.fontSize" type="text" placeholder="16px" />
          </div>
          
          <div class="style-group">
            <label>Font Family:</label>
            <select v-model="globalStyles.fontFamily">
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier New</option>
            </select>
          </div>
          
          <div class="style-group">
            <label>Primary Color:</label>
            <input v-model="globalStyles.primaryColor" type="color" />
          </div>
          
          <div class="style-group">
            <label>Background Color:</label>
            <input v-model="globalStyles.backgroundColor" type="color" />
          </div>
          
          <div class="style-group">
            <label>Text Color:</label>
            <input v-model="globalStyles.textColor" type="color" />
          </div>
        </div>
      </div>

      <!-- Preview Tab -->
      <div v-if="activeTab === 'preview'" class="preview-content">
        <div class="preview-header">
          <h3>Live Preview</h3>
          <button @click="() => { const html = generateHTML(); navigator.clipboard.writeText(html); alert('HTML copied to clipboard!') }" class="btn-secondary">
            Copy HTML
          </button>
        </div>
        
        <div class="preview-layout" :style="computedPreviewStyles">
          <div v-for="(row, rowIndex) in layout" :key="row.id" class="preview-row">
            <div v-for="(column, columnIndex) in row.columns" :key="column.id" class="preview-column">
              <component 
                v-for="component in column.components"
                :key="component.id"
                :is="components[component.type]"
                :componentStyles="{ ...computedGlobalStyles, ...component.styles }"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

