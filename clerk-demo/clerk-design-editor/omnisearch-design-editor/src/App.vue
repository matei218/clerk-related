<script setup>
import { ref } from 'vue'
import HtmlRenderer from './components/HtmlRenderer.vue'
import GlobalStylesSection from './components/GlobalStylesSection.vue'
import ComponentStylesSection from './components/ComponentStylesSection.vue'
import defaultStyles from './data/globalStyles.json'


const availableComponents = [
  { id: 'SearchBar', name: 'search', used: false },
  { id: 'SortingOptions', name: 'sort', used: false },
  { id: 'ProductFeed', name: 'products', used: false },
  { id: 'Facets', name: 'facets', used: false },
  { id: 'Pages', name: 'pages', used: false },
  { id: 'Categories', name: 'categories', used: false }
]

const layout = ref([])
const activeTab = ref('editor')
const darkMode = ref(false)
const notifications = ref([])
const versionHistory = ref([])
const lastChangeAnimation = ref(false)
let notificationId = 0
const globalStyles = ref(JSON.parse(JSON.stringify(defaultStyles)))

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
  
  // Animate last change update
  lastChangeAnimation.value = true
  setTimeout(() => {
    lastChangeAnimation.value = false
  }, 500)
}

const clearHistory = () => {
  versionHistory.value = []
  addNotification('History Cleared', 'Version history has been cleared', 'info')
}

const addRow = () => {
  layout.value.push({
    id: Date.now(),
    columns: [{
      id: Date.now() + 1,
      components: [],
      width: '100%',
      manualWidth: false
    }]
  })
  addNotification('Row Added', 'New row added to layout', 'success')
  addToHistory('Layout Change', 'Added new row')
}

const addColumn = (rowIndex) => {
  const row = layout.value[rowIndex]
  const newColumn = {
    id: Date.now(),
    components: [],
    width: '25%',
    manualWidth: false
  }
  row.columns.push(newColumn)
  
  // Only auto-adjust columns that haven't been manually set
  const manualColumns = row.columns.filter(col => col.manualWidth)
  const autoColumns = row.columns.filter(col => !col.manualWidth)
  
  if (autoColumns.length > 0) {
    // Calculate remaining width after manual columns
    const manualWidthTotal = manualColumns.reduce((total, col) => {
      return total + parseFloat(col.width)
    }, 0)
    const remainingWidth = Math.max(100 - manualWidthTotal, 0)
    const autoWidth = `${(remainingWidth / autoColumns.length).toFixed(1)}%`
    
    autoColumns.forEach(col => {
      col.width = autoWidth
    })
  }
  
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
  
  // Only redistribute auto columns
  const row = layout.value[rowIndex]
  if (row.columns.length > 0) {
    const manualColumns = row.columns.filter(col => col.manualWidth)
    const autoColumns = row.columns.filter(col => !col.manualWidth)
    
    if (autoColumns.length > 0) {
      const manualWidthTotal = manualColumns.reduce((total, col) => {
        return total + parseFloat(col.width)
      }, 0)
      const remainingWidth = Math.max(100 - manualWidthTotal, 0)
      const autoWidth = `${(remainingWidth / autoColumns.length).toFixed(1)}%`
      
      autoColumns.forEach(col => {
        col.width = autoWidth
      })
    }
  }
}




const htmlRendererRef = ref(null)

const changeColumnWidth = (rowIndex, columnIndex, width) => {
  const column = layout.value[rowIndex].columns[columnIndex]
  column.width = width
  column.manualWidth = true
  addNotification('Column Width Changed', `Column ${columnIndex + 1} width set to ${width}`, 'info')
  addToHistory('Layout Change', `Changed column ${columnIndex + 1} width to ${width} in row ${rowIndex + 1}`)
}

const generateHTML = () => {
  if (htmlRendererRef.value) {
    return htmlRendererRef.value.generateHTML()
  }
  return ''
}

const calculateAvailableWidth = (rowIndex, currentColumnIndex) => {
  const row = layout.value[rowIndex]
  let usedWidth = 0
  
  row.columns.forEach((col, index) => {
    if (index !== currentColumnIndex) {
      usedWidth += parseFloat(col.width)
    }
  })
  
  return Math.max(100 - usedWidth, 0)
}

const getAvailableWidthOptions = (rowIndex, columnIndex) => {
  const availableWidth = calculateAvailableWidth(rowIndex, columnIndex)
  const options = []
  
  // Standard width options that fit within available space
  const standardWidths = [15, 20, 25, 30, 33, 40, 50, 60, 66, 75, 80, 100]
  
  for (const width of standardWidths) {
    if (width <= availableWidth) {
      options.push(`${width}%`)
    }
  }
  
  // Add the exact remaining width if it's not already in the list
  if (availableWidth > 0 && availableWidth % 1 !== 0) {
    const exactWidth = `${availableWidth.toFixed(1)}%`
    if (!options.includes(exactWidth)) {
      options.push(exactWidth)
    }
  }
  
  return options.sort((a, b) => parseFloat(a) - parseFloat(b))
}

const handleStyleChange = (details) => {
  addToHistory('Style Change', details)
}
</script>

<template>
  <div class="design-editor" :class="{ 'dark-mode': darkMode }">
    <header class="editor-header">
      <h1>omnisearch design editor</h1>
      <div class="header-controls">
        <div class="tabs">
          <button 
            :class="{ active: activeTab === 'editor' }"
            @click="activeTab = 'editor'"
          >
            Editor
          </button>
          <button 
            :class="{ active: activeTab === 'preview' }"
            @click="activeTab = 'preview'"
          >
            Preview
          </button>
          <button 
            :class="{ active: activeTab === 'styles' }"
            @click="activeTab = 'styles'"
          >
            Global Styles
          </button>
          <button 
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            History ({{ versionHistory.length }})
          </button>
          
          <!-- Last Change Tab -->
          <div 
            v-if="versionHistory.length > 0"
            class="last-change-tab"
            :class="{ 'change-animate': lastChangeAnimation }"
          >
            <div class="change-icon">📝</div>
            <div class="change-content">
              <div class="change-action">{{ versionHistory[0].action }}</div>
              <div class="change-details">{{ versionHistory[0].details }}</div>
            </div>
          </div>
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
          <h3>available components</h3>
          <div class="component-list">
            <div 
              v-for="component in availableComponents" 
              :key="component.id"
              :class="{ 'component-item': true, 'used': component.used }"
            >
              <span>{{ component.name }}</span>
              <span v-if="component.used" class="used-label">Y</span>
            </div>
          </div>
        </div>

        <div class="canvas">
          <div v-if="layout.length === 0" class="empty-canvas">
            <p>start by adding a row to start building your layout</p>
            <div class="actions">
              <button @click="addRow" class="btn-primary">add row</button>
            </div>
          </div>
          
          <transition-group name="row" tag="div" class="rows-container">
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
              <transition-group name="column" tag="div" class="columns-container">
                <div 
                  v-for="(column, columnIndex) in row.columns" 
                  :key="column.id"
                  class="column-container"
                  :style="{ width: column.width }"
                >
                <div class="column-inner">
                  <div class="column-header">
                  <span>
                    Column {{ columnIndex + 1 }} ({{ column.width }})
                    <span v-if="column.manualWidth" class="manual-width-indicator" title="Manual width set">📌</span>
                  </span>
                  <div class="column-controls">
                    <button @click="moveColumnLeft(rowIndex, columnIndex)" :disabled="columnIndex === 0" title="Move Left">←</button>
                    <button @click="moveColumnRight(rowIndex, columnIndex)" :disabled="columnIndex === row.columns.length - 1" title="Move Right">→</button>
                    <div class="width-controls">
                      <button 
                        v-for="widthOption in getAvailableWidthOptions(rowIndex, columnIndex)" 
                        :key="widthOption"
                        @click="changeColumnWidth(rowIndex, columnIndex, widthOption)" 
                        :class="{ active: column.width === widthOption }" 
                        :title="`${widthOption} Width`"
                      >
                        {{ widthOption }}
                      </button>
                    </div>
                    <button @click="removeColumn(rowIndex, columnIndex)" class="btn-danger" title="Delete Column">×</button>
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
                  
                  <transition-group name="component" tag="div" class="components-container">
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
                  </transition-group>
                </div>
                </div>
              </div>
              </transition-group>
            </div>
          </div>
          </transition-group>
          
          <div v-if="layout.length > 0" class="actions">
            <button @click="addRow" class="btn-primary">add row</button>
          </div>
        </div>
      </div>

      <!-- Global Styles Tab -->
      <div v-if="activeTab === 'styles'" class="styles-content">
        <div class="styles-sections">
          <!-- Global Styles Section -->
          <GlobalStylesSection 
            :globalStyles="globalStyles" 
            @styleChange="handleStyleChange" 
          />

          <!-- Component Styles Sections -->
          <ComponentStylesSection 
            v-for="(componentStyle, componentName) in globalStyles.components" 
            :key="componentName"
            :componentName="componentName"
            :componentStyle="componentStyle"
            @styleChange="handleStyleChange"
          />
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
        
        <HtmlRenderer 
          ref="htmlRendererRef"
          :layout="layout"
          :globalStyles="globalStyles"
        />
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="history-content">
        <div class="history-header">
          <h3>Version History</h3>
          <button v-if="versionHistory.length > 0" @click="clearHistory" class="btn-danger">
            Clear History
          </button>
        </div>
        
        <div v-if="versionHistory.length === 0" class="empty-history">
          <p>No history yet.</p>
        </div>
        
        <ul v-else class="history-list">
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