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
const notifications = ref([])
const versionHistory = ref([])
let notificationId = 0
const globalStyles = ref({
  // Global elements that apply to all components
  global: {
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    primaryColor: '#007bff',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    titleColor: '#2c3e50',
    subtitleColor: '#34495e',
    linkColor: '#007bff',
    buttonColor: '#007bff',
    buttonTextColor: '#ffffff',
    containerBorder: '#ddd',
    cardShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  // Individual component styles
  components: {
    SearchBar: {
      inputBorderColor: '#ddd',
      inputFocusColor: '#007bff',
      buttonHoverColor: '#0056b3'
    },
    SortingOptions: {
      labelColor: '#333',
      selectBorderColor: '#ddd',
      selectFocusColor: '#007bff'
    },
    ProductFeed: {
      titleColor: '#333',
      priceColor: '#007bff',
      ratingColor: '#ffc107',
      cardBorderColor: '#ddd'
    },
    Facets: {
      titleColor: '#333',
      labelColor: '#555',
      optionColor: '#666',
      containerBackground: '#f8f9fa'
    },
    Pages: {
      titleColor: '#333',
      linkColor: '#333',
      linkHoverColor: '#007bff',
      containerBackground: '#f8f9fa'
    },
    Categories: {
      titleColor: '#333',
      nameColor: '#333',
      countColor: '#666',
      iconSize: '48px'
    }
  }
})

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  addNotification('Dark mode toggled', darkMode.value ? 'Enabled dark mode' : 'Enabled light mode', 'info')
  addToHistory('Theme Change', darkMode.value ? 'Switched to dark mode' : 'Switched to light mode')
}

const addNotification = (title, message, type = 'success') => {
  const notification = {
    id: ++notificationId,
    title,
    message,
    type,
    timestamp: new Date()
  }
  notifications.value.push(notification)
  
  // Auto-remove notification after 3 seconds
  setTimeout(() => {
    removeNotification(notification.id)
  }, 3000)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const addToHistory = (action, details) => {
  versionHistory.value.unshift({
    id: Date.now(),
    action,
    details,
    timestamp: new Date(),
    layout: JSON.parse(JSON.stringify(layout.value)),
    styles: JSON.parse(JSON.stringify(globalStyles.value))
  })
  
  // Keep only last 50 history items
  if (versionHistory.value.length > 50) {
    versionHistory.value = versionHistory.value.slice(0, 50)
  }
}

const addRow = () => {
  layout.value.push({
    id: Date.now(),
    columns: [{
      id: Date.now() + 1,
      components: []
    }]
  })
  addNotification('Row Added', 'New row added to layout', 'success')
  addToHistory('Layout Change', 'Added new row')
}

const addColumn = (rowIndex) => {
  layout.value[rowIndex].columns.push({
    id: Date.now(),
    components: []
  })
  addNotification('Column Added', `New column added to row ${rowIndex + 1}`, 'success')
  addToHistory('Layout Change', `Added column to row ${rowIndex + 1}`)
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
    addNotification('Component Added', `${component.name} added to layout`, 'success')
    addToHistory('Component Change', `Added ${component.name} to row ${rowIndex + 1}, column ${columnIndex + 1}`)
  }
}

const removeComponent = (rowIndex, columnIndex, componentIndex) => {
  const component = layout.value[rowIndex].columns[columnIndex].components[componentIndex]
  const availableComponent = availableComponents.find(c => c.id === component.type)
  if (availableComponent) {
    availableComponent.used = false
  }
  layout.value[rowIndex].columns[columnIndex].components.splice(componentIndex, 1)
  addNotification('Component Removed', `${component.type} removed from layout`, 'info')
  addToHistory('Component Change', `Removed ${component.type} from row ${rowIndex + 1}, column ${columnIndex + 1}`)
}

const moveRowUp = (rowIndex) => {
  if (rowIndex > 0) {
    const row = layout.value.splice(rowIndex, 1)[0]
    layout.value.splice(rowIndex - 1, 0, row)
    addNotification('Row Moved', `Row ${rowIndex + 1} moved up`, 'info')
    addToHistory('Layout Change', `Moved row ${rowIndex + 1} up`)
  }
}

const moveRowDown = (rowIndex) => {
  if (rowIndex < layout.value.length - 1) {
    const row = layout.value.splice(rowIndex, 1)[0]
    layout.value.splice(rowIndex + 1, 0, row)
    addNotification('Row Moved', `Row ${rowIndex + 1} moved down`, 'info')
    addToHistory('Layout Change', `Moved row ${rowIndex + 1} down`)
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
  fontSize: globalStyles.value.global.fontSize,
  fontFamily: globalStyles.value.global.fontFamily,
  color: globalStyles.value.global.textColor,
  '--primary-color': globalStyles.value.global.primaryColor,
  '--title-color': globalStyles.value.global.titleColor,
  '--subtitle-color': globalStyles.value.global.subtitleColor,
  '--link-color': globalStyles.value.global.linkColor,
  '--button-color': globalStyles.value.global.buttonColor,
  '--button-text-color': globalStyles.value.global.buttonTextColor,
  '--container-border': globalStyles.value.global.containerBorder,
  '--card-shadow': globalStyles.value.global.cardShadow
}))

const computedPreviewStyles = computed(() => ({
  fontSize: globalStyles.value.global.fontSize,
  fontFamily: globalStyles.value.global.fontFamily,
  color: globalStyles.value.global.textColor,
  backgroundColor: globalStyles.value.global.backgroundColor,
  '--primary-color': globalStyles.value.global.primaryColor,
  '--title-color': globalStyles.value.global.titleColor,
  '--subtitle-color': globalStyles.value.global.subtitleColor,
  '--link-color': globalStyles.value.global.linkColor,
  '--button-color': globalStyles.value.global.buttonColor,
  '--button-text-color': globalStyles.value.global.buttonTextColor,
  '--container-border': globalStyles.value.global.containerBorder,
  '--card-shadow': globalStyles.value.global.cardShadow
}))

const getComponentStyles = (componentType) => {
  const componentStyles = globalStyles.value.components[componentType] || {}
  const cssVars = {}
  
  Object.entries(componentStyles).forEach(([key, value]) => {
    const cssKey = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase()
    cssVars[cssKey] = value
  })
  
  return {
    ...computedGlobalStyles.value,
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
          <button 
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            History ({{ versionHistory.length }})
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
        <div class="styles-sections">
          <!-- Global Styles Section -->
          <div class="style-section">
            <h3>Global Styles</h3>
            <p class="section-description">These styles apply to all components</p>
            <div class="style-controls">
              <div class="style-group">
                <label>Font Size:</label>
                <input v-model="globalStyles.global.fontSize" type="text" placeholder="16px" />
              </div>
              
              <div class="style-group">
                <label>Font Family:</label>
                <select v-model="globalStyles.global.fontFamily">
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                </select>
              </div>
              
              <div class="style-group">
                <label>Primary Color:</label>
                <input v-model="globalStyles.global.primaryColor" type="color" />
              </div>
              
              <div class="style-group">
                <label>Background Color:</label>
                <input v-model="globalStyles.global.backgroundColor" type="color" />
              </div>
              
              <div class="style-group">
                <label>Text Color:</label>
                <input v-model="globalStyles.global.textColor" type="color" />
              </div>
              
              <div class="style-group">
                <label>Title Color:</label>
                <input v-model="globalStyles.global.titleColor" type="color" />
              </div>
              
              <div class="style-group">
                <label>Link Color:</label>
                <input v-model="globalStyles.global.linkColor" type="color" />
              </div>
              
              <div class="style-group">
                <label>Button Color:</label>
                <input v-model="globalStyles.global.buttonColor" type="color" />
              </div>
            </div>
          </div>

          <!-- Component Styles Sections -->
          <div class="style-section" v-for="(componentStyle, componentName) in globalStyles.components" :key="componentName">
            <h4>{{ componentName }} Styles</h4>
            <div class="style-controls">
              <!-- SearchBar specific styles -->
              <template v-if="componentName === 'SearchBar'">
                <div class="style-group">
                  <label>Input Border Color:</label>
                  <input v-model="componentStyle.inputBorderColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Input Focus Color:</label>
                  <input v-model="componentStyle.inputFocusColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Button Hover Color:</label>
                  <input v-model="componentStyle.buttonHoverColor" type="color" />
                </div>
              </template>

              <!-- SortingOptions specific styles -->
              <template v-if="componentName === 'SortingOptions'">
                <div class="style-group">
                  <label>Label Color:</label>
                  <input v-model="componentStyle.labelColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Select Border Color:</label>
                  <input v-model="componentStyle.selectBorderColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Select Focus Color:</label>
                  <input v-model="componentStyle.selectFocusColor" type="color" />
                </div>
              </template>

              <!-- ProductFeed specific styles -->
              <template v-if="componentName === 'ProductFeed'">
                <div class="style-group">
                  <label>Product Title Color:</label>
                  <input v-model="componentStyle.titleColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Price Color:</label>
                  <input v-model="componentStyle.priceColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Rating Color:</label>
                  <input v-model="componentStyle.ratingColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Card Border Color:</label>
                  <input v-model="componentStyle.cardBorderColor" type="color" />
                </div>
              </template>

              <!-- Facets specific styles -->
              <template v-if="componentName === 'Facets'">
                <div class="style-group">
                  <label>Facet Title Color:</label>
                  <input v-model="componentStyle.titleColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Facet Label Color:</label>
                  <input v-model="componentStyle.labelColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Option Text Color:</label>
                  <input v-model="componentStyle.optionColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Container Background:</label>
                  <input v-model="componentStyle.containerBackground" type="color" />
                </div>
              </template>

              <!-- Pages specific styles -->
              <template v-if="componentName === 'Pages'">
                <div class="style-group">
                  <label>Title Color:</label>
                  <input v-model="componentStyle.titleColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Link Color:</label>
                  <input v-model="componentStyle.linkColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Link Hover Color:</label>
                  <input v-model="componentStyle.linkHoverColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Container Background:</label>
                  <input v-model="componentStyle.containerBackground" type="color" />
                </div>
              </template>

              <!-- Categories specific styles -->
              <template v-if="componentName === 'Categories'">
                <div class="style-group">
                  <label>Title Color:</label>
                  <input v-model="componentStyle.titleColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Category Name Color:</label>
                  <input v-model="componentStyle.nameColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Count Text Color:</label>
                  <input v-model="componentStyle.countColor" type="color" />
                </div>
                <div class="style-group">
                  <label>Icon Size:</label>
                  <input v-model="componentStyle.iconSize" type="text" placeholder="48px" />
                </div>
              </template>
            </div>
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
                :componentStyles="getComponentStyles(component.type)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="history-content">
        <h3>Version History</h3>
        <div v-if="versionHistory.length === 0" class="empty-history">
          <p>No history yet.</p>
        </div>
        
        <ul class="history-list">
          <li v-for="entry in versionHistory" :key="entry.id" class="history-item">
            <div class="history-info">
              <strong>{{ entry.action }}</strong>
              <span class="details">{{ entry.details }}</span>
              <span class="timestamp">{{ new Date(entry.timestamp).toLocaleString() }}</span>
            </div>
          </li>
        </ul>
      </div>

    </main>
  </div>
</template>

