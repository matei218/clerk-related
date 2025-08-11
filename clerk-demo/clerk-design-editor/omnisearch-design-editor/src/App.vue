<script setup>
import { ref } from 'vue'
import HtmlRenderer from './components/HtmlRenderer.vue'
import defaultStyles from './data/globalStyles.json'


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
                :style="{ width: column.width }"
              >
                <div class="column-header">
                  <span>
                    Column {{ columnIndex + 1 }} ({{ column.width }})
                    <span v-if="column.manualWidth" class="manual-width-indicator" title="Manual width set">📌</span>
                  </span>
                  <div class="column-controls">
                    <button @click="moveColumnLeft(rowIndex, columnIndex)" :disabled="columnIndex === 0" title="Move Left">←</button>
                    <button @click="moveColumnRight(rowIndex, columnIndex)" :disabled="columnIndex === row.columns.length - 1" title="Move Right">→</button>
                    <div class="width-controls">
                      <button @click="changeColumnWidth(rowIndex, columnIndex, '15%')" :class="{ active: column.width === '15%' }" title="15% Width">15%</button>
                      <button @click="changeColumnWidth(rowIndex, columnIndex, '20%')" :class="{ active: column.width === '20%' }" title="20% Width">20%</button>
                      <button @click="changeColumnWidth(rowIndex, columnIndex, '25%')" :class="{ active: column.width === '25%' }" title="25% Width">25%</button>
                      <button @click="changeColumnWidth(rowIndex, columnIndex, '30%')" :class="{ active: column.width === '30%' }" title="30% Width">30%</button>
                      <button @click="changeColumnWidth(rowIndex, columnIndex, '50%')" :class="{ active: column.width === '50%' }" title="50% Width">50%</button>
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
                <input v-model="globalStyles.global.fontSize" type="text" placeholder="16px" @input="addToHistory('Style Change', 'Updated global font size')" />
              </div>
              
              <div class="style-group">
                <label>Font Family:</label>
                <select v-model="globalStyles.global.fontFamily" @change="addToHistory('Style Change', 'Updated global font family')">
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                </select>
              </div>
              
              <div class="style-group">
                <label>Primary Color:</label>
                <input v-model="globalStyles.global.primaryColor" type="color" @input="addToHistory('Style Change', 'Updated primary color')" />
              </div>
              
              <div class="style-group">
                <label>Background Color:</label>
                <input v-model="globalStyles.global.backgroundColor" type="color" @input="addToHistory('Style Change', 'Updated background color')" />
              </div>
              
              <div class="style-group">
                <label>Text Color:</label>
                <input v-model="globalStyles.global.textColor" type="color" @input="addToHistory('Style Change', 'Updated text color')" />
              </div>
              
              <div class="style-group">
                <label>Title Color:</label>
                <input v-model="globalStyles.global.titleColor" type="color" @input="addToHistory('Style Change', 'Updated title color')" />
              </div>
              
              <div class="style-group">
                <label>Link Color:</label>
                <input v-model="globalStyles.global.linkColor" type="color" @input="addToHistory('Style Change', 'Updated link color')" />
              </div>
              
              <div class="style-group">
                <label>Button Color:</label>
                <input v-model="globalStyles.global.buttonColor" type="color" @input="addToHistory('Style Change', 'Updated button color')" />
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
                  <input v-model="componentStyle.inputBorderColor" type="color" @input="addToHistory('Style Change', 'Updated SearchBar input border color')" />
                </div>
                <div class="style-group">
                  <label>Input Focus Color:</label>
                  <input v-model="componentStyle.inputFocusColor" type="color" @input="addToHistory('Style Change', 'Updated SearchBar input focus color')" />
                </div>
                <div class="style-group">
                  <label>Button Hover Color:</label>
                  <input v-model="componentStyle.buttonHoverColor" type="color" @input="addToHistory('Style Change', 'Updated SearchBar button hover color')" />
                </div>
              </template>

              <!-- SortingOptions specific styles -->
              <template v-if="componentName === 'SortingOptions'">
                <div class="style-group">
                  <label>Label Color:</label>
                  <input v-model="componentStyle.labelColor" type="color" @input="addToHistory('Style Change', 'Updated SortingOptions label color')" />
                </div>
                <div class="style-group">
                  <label>Select Border Color:</label>
                  <input v-model="componentStyle.selectBorderColor" type="color" @input="addToHistory('Style Change', 'Updated SortingOptions select border color')" />
                </div>
                <div class="style-group">
                  <label>Select Focus Color:</label>
                  <input v-model="componentStyle.selectFocusColor" type="color" @input="addToHistory('Style Change', 'Updated SortingOptions select focus color')" />
                </div>
              </template>

              <!-- ProductFeed specific styles -->
              <template v-if="componentName === 'ProductFeed'">
                <div class="style-group">
                  <label>Product Title Color:</label>
                  <input v-model="componentStyle.titleColor" type="color" @input="addToHistory('Style Change', 'Updated ProductFeed title color')" />
                </div>
                <div class="style-group">
                  <label>Price Color:</label>
                  <input v-model="componentStyle.priceColor" type="color" @input="addToHistory('Style Change', 'Updated ProductFeed price color')" />
                </div>
                <div class="style-group">
                  <label>Rating Color:</label>
                  <input v-model="componentStyle.ratingColor" type="color" @input="addToHistory('Style Change', 'Updated ProductFeed rating color')" />
                </div>
                <div class="style-group">
                  <label>Card Border Color:</label>
                  <input v-model="componentStyle.cardBorderColor" type="color" @input="addToHistory('Style Change', 'Updated ProductFeed card border color')" />
                </div>
              </template>

              <!-- Facets specific styles -->
              <template v-if="componentName === 'Facets'">
                <div class="style-group">
                  <label>Facet Title Color:</label>
                  <input v-model="componentStyle.titleColor" type="color" @input="addToHistory('Style Change', 'Updated Facets title color')" />
                </div>
                <div class="style-group">
                  <label>Facet Label Color:</label>
                  <input v-model="componentStyle.labelColor" type="color" @input="addToHistory('Style Change', 'Updated Facets label color')" />
                </div>
                <div class="style-group">
                  <label>Option Text Color:</label>
                  <input v-model="componentStyle.optionColor" type="color" @input="addToHistory('Style Change', 'Updated Facets option color')" />
                </div>
                <div class="style-group">
                  <label>Container Background:</label>
                  <input v-model="componentStyle.containerBackground" type="color" @input="addToHistory('Style Change', 'Updated Facets container background')" />
                </div>
              </template>

              <!-- Pages specific styles -->
              <template v-if="componentName === 'Pages'">
                <div class="style-group">
                  <label>Title Color:</label>
                  <input v-model="componentStyle.titleColor" type="color" @input="addToHistory('Style Change', 'Updated Pages title color')" />
                </div>
                <div class="style-group">
                  <label>Link Color:</label>
                  <input v-model="componentStyle.linkColor" type="color" @input="addToHistory('Style Change', 'Updated Pages link color')" />
                </div>
                <div class="style-group">
                  <label>Link Hover Color:</label>
                  <input v-model="componentStyle.linkHoverColor" type="color" @input="addToHistory('Style Change', 'Updated Pages link hover color')" />
                </div>
                <div class="style-group">
                  <label>Container Background:</label>
                  <input v-model="componentStyle.containerBackground" type="color" @input="addToHistory('Style Change', 'Updated Pages container background')" />
                </div>
              </template>

              <!-- Categories specific styles -->
              <template v-if="componentName === 'Categories'">
                <div class="style-group">
                  <label>Title Color:</label>
                  <input v-model="componentStyle.titleColor" type="color" @input="addToHistory('Style Change', 'Updated Categories title color')" />
                </div>
                <div class="style-group">
                  <label>Category Name Color:</label>
                  <input v-model="componentStyle.nameColor" type="color" @input="addToHistory('Style Change', 'Updated Categories name color')" />
                </div>
                <div class="style-group">
                  <label>Count Text Color:</label>
                  <input v-model="componentStyle.countColor" type="color" @input="addToHistory('Style Change', 'Updated Categories count color')" />
                </div>
                <div class="style-group">
                  <label>Icon Size:</label>
                  <input v-model="componentStyle.iconSize" type="text" placeholder="48px" @input="addToHistory('Style Change', 'Updated Categories icon size')" />
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

