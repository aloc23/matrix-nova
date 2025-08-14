// Nova Independent UI Generator
// Dedicated UI generation for Nova (Business Analytics) tab only
// This operates completely independently from Vista and shared dynamic UI

/**
 * Nova UI Generator
 * 
 * Independent UI generation system for Nova Business Analytics tab.
 * Creates forms and interfaces based on project type configurations
 * without any dependencies on Vista tabs or shared UI systems.
 */
class NovaUIGenerator {
  constructor() {
    this.currentContainer = null;
    
    // Initialize Nova state listeners
    this.initializeNovaStateListeners();
    
    console.log('Nova UI Generator initialized');
  }

  /**
   * Initialize listeners for Nova state changes
   */
  initializeNovaStateListeners() {
    // Wait for Nova state manager to be available
    const initListeners = () => {
      if (window.Nova?.stateManager) {
        // Listen for Nova business type changes
        window.Nova.stateManager.addEventListener('businessTypeChanged', (data) => {
          this.onNovaBusinessTypeChanged(data);
        });

        // Listen for Nova project type changes
        window.Nova.stateManager.addEventListener('projectTypesChanged', (data) => {
          this.onNovaProjectTypesChanged(data);
        });

        // Listen for Nova active project changes
        window.Nova.stateManager.addEventListener('activeProjectChanged', (data) => {
          this.onNovaActiveProjectChanged(data);
        });

        console.log('Nova UI listeners initialized');
      } else {
        // Retry if Nova state manager not yet available
        setTimeout(initListeners, 100);
      }
    };
    
    initListeners();
  }

  /**
   * Handle Nova business type changes
   */
  onNovaBusinessTypeChanged(data) {
    console.log('Nova UI: Business type changed', data);
    
    if (data.new) {
      this.showNovaProjectTypeSelector();
      this.updateNovaBusinessTypeDisplay(data.new);
    } else {
      this.hideNovaProjectTypeSelector();
      this.hideNovaAnalysisForm();
    }
  }

  /**
   * Handle Nova project type changes
   */
  onNovaProjectTypesChanged(data) {
    console.log('Nova UI: Project types changed', data);
    
    if (data.selectedProjects.length > 0) {
      this.updateNovaProjectTypeSelection(data.selectedProjects);
      
      // Show analysis form for active project
      const activeProject = window.Nova.stateManager.getActiveProject();
      if (activeProject) {
        this.showNovaAnalysisForm(activeProject);
      }
    } else {
      this.hideNovaAnalysisForm();
    }
  }

  /**
   * Handle Nova active project changes
   */
  onNovaActiveProjectChanged(data) {
    console.log('Nova UI: Active project changed', data);
    
    if (data.new) {
      this.showNovaAnalysisForm(data.new);
    }
  }

  // ==================== NOVA BUSINESS TYPE SELECTOR ====================

  /**
   * Generate Nova business type selector interface
   */
  generateNovaBusinessTypeSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.currentContainer = container;
    const businessCategories = window.BUSINESS_TYPE_CATEGORIES;
    
    container.innerHTML = `
      <div class="nova-analytics-container">
        <h2>Nova Business Analytics</h2>
        <p>Independent business analytics tool with dedicated state and functionality.</p>
        
        <div class="nova-business-type-selector">
          <h3>Step 1: Choose Your Business Type</h3>
          
          <div class="nova-business-type-dropdown-container">
            <label for="nova-business-type-dropdown" class="nova-business-type-label">
              Business Type:
            </label>
            <div class="nova-dropdown" tabindex="0" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="nova-business-type-label">
              <div class="nova-dropdown-trigger" id="nova-business-type-trigger">
                <span class="nova-dropdown-placeholder">Select your business type...</span>
                <span class="nova-dropdown-arrow">▼</span>
              </div>
              <div class="nova-dropdown-menu" role="listbox" aria-labelledby="nova-business-type-label">
                ${Object.values(businessCategories).map(category => `
                  <div class="nova-dropdown-option ${window.Nova.stateManager.getBusinessType() === category.id ? 'selected' : ''}" 
                       role="option" 
                       data-nova-business-type="${category.id}"
                       aria-selected="${window.Nova.stateManager.getBusinessType() === category.id ? 'true' : 'false'}"
                       tabindex="-1">
                    <span class="nova-option-icon">${category.icon}</span>
                    <div class="nova-option-content">
                      <span class="nova-option-title">${category.name}</span>
                      <span class="nova-option-description">${category.description}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div id="nova-selected-business-type-info" class="nova-selected-business-type-info" style="display: none;">
            <!-- Nova selected business type details will be shown here -->
          </div>
        </div>

        <div id="nova-project-type-selector" class="nova-project-type-selector" style="display: none;">
          <h3>Step 2: Choose Your Specific Business Template</h3>
          <div id="nova-project-type-options"></div>
        </div>

        <div id="nova-business-analytics-form" class="nova-business-analytics-form" style="display: none;">
          <!-- Nova dynamic form will be generated here -->
        </div>
      </div>
    `;
    
    // Initialize Nova dropdown functionality
    this.initializeNovaBusinessTypeDropdown();
  }

  /**
   * Initialize Nova dropdown functionality
   */
  initializeNovaBusinessTypeDropdown() {
    const dropdown = document.querySelector('.nova-dropdown');
    const trigger = document.getElementById('nova-business-type-trigger');
    const menu = document.querySelector('.nova-dropdown-menu');
    const options = document.querySelectorAll('.nova-dropdown-option');
    
    if (!dropdown || !trigger || !menu) return;
    
    // Toggle dropdown on trigger click
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleNovaDropdown();
    });
    
    // Handle keyboard navigation
    dropdown.addEventListener('keydown', (e) => {
      this.handleNovaDropdownKeydown(e);
    });
    
    // Handle option selection
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const businessTypeId = option.dataset.novaBusinessType;
        this.selectNovaBusinessTypeFromDropdown(businessTypeId);
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        this.closeNovaDropdown();
      }
    });
    
    // Update dropdown if there's already a Nova selection
    const currentBusinessType = window.Nova.stateManager.getBusinessType();
    if (currentBusinessType) {
      this.updateNovaDropdownSelection(currentBusinessType);
    }
  }

  /**
   * Toggle Nova dropdown open/close
   */
  toggleNovaDropdown() {
    const dropdown = document.querySelector('.nova-dropdown');
    const menu = document.querySelector('.nova-dropdown-menu');
    
    if (!dropdown || !menu) return;
    
    const isOpen = dropdown.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
      this.closeNovaDropdown();
    } else {
      this.openNovaDropdown();
    }
  }

  /**
   * Open Nova dropdown
   */
  openNovaDropdown() {
    const dropdown = document.querySelector('.nova-dropdown');
    const menu = document.querySelector('.nova-dropdown-menu');
    
    if (!dropdown || !menu) return;
    
    dropdown.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('open');
    menu.style.display = 'block';
    
    // Focus first option
    const firstOption = menu.querySelector('.nova-dropdown-option');
    if (firstOption) {
      firstOption.focus();
    }
  }

  /**
   * Close Nova dropdown
   */
  closeNovaDropdown() {
    const dropdown = document.querySelector('.nova-dropdown');
    const menu = document.querySelector('.nova-dropdown-menu');
    
    if (!dropdown || !menu) return;
    
    dropdown.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('open');
    menu.style.display = 'none';
  }

  /**
   * Handle Nova dropdown keyboard navigation
   */
  handleNovaDropdownKeydown(e) {
    const menu = document.querySelector('.nova-dropdown-menu');
    const options = Array.from(document.querySelectorAll('.nova-dropdown-option'));
    const isOpen = document.querySelector('.nova-dropdown').getAttribute('aria-expanded') === 'true';
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          this.openNovaDropdown();
        } else {
          const focused = document.activeElement;
          if (focused && focused.classList.contains('nova-dropdown-option')) {
            const businessTypeId = focused.dataset.novaBusinessType;
            this.selectNovaBusinessTypeFromDropdown(businessTypeId);
          }
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        this.closeNovaDropdown();
        document.querySelector('.nova-dropdown').focus();
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          this.openNovaDropdown();
        } else {
          const currentIndex = options.indexOf(document.activeElement);
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          options[nextIndex].focus();
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          const currentIndex = options.indexOf(document.activeElement);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          options[prevIndex].focus();
        }
        break;
    }
  }

  /**
   * Select Nova business type from dropdown
   */
  selectNovaBusinessTypeFromDropdown(businessTypeId) {
    window.Nova.stateManager.setBusinessType(businessTypeId);
    this.updateNovaDropdownSelection(businessTypeId);
    this.closeNovaDropdown();
  }

  /**
   * Update Nova dropdown selection display
   */
  updateNovaDropdownSelection(businessTypeId) {
    const businessCategories = window.BUSINESS_TYPE_CATEGORIES;
    const category = businessCategories[businessTypeId];
    
    if (!category) return;
    
    // Update dropdown trigger
    const placeholder = document.querySelector('.nova-dropdown-placeholder');
    if (placeholder) {
      placeholder.textContent = category.name;
    }
    
    // Update option selection states
    document.querySelectorAll('.nova-dropdown-option').forEach(option => {
      const isSelected = option.dataset.novaBusinessType === businessTypeId;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }

  /**
   * Update Nova business type display
   */
  updateNovaBusinessTypeDisplay(businessTypeId) {
    const businessCategories = window.BUSINESS_TYPE_CATEGORIES;
    const category = businessCategories[businessTypeId];
    
    if (!category) return;
    
    const infoContainer = document.getElementById('nova-selected-business-type-info');
    if (infoContainer) {
      infoContainer.innerHTML = `
        <div class="nova-business-type-card">
          <div class="nova-business-type-header">
            <span class="nova-business-type-icon">${category.icon}</span>
            <h4>${category.name}</h4>
          </div>
          <p>${category.description}</p>
          <div class="nova-business-type-features">
            <h5>Key Features:</h5>
            <ul>
              ${category.features ? category.features.map(feature => `<li>${feature}</li>`).join('') : '<li>Customizable analytics</li><li>Real-time calculations</li><li>Detailed reporting</li>'}
            </ul>
          </div>
        </div>
      `;
      infoContainer.style.display = 'block';
    }
  }

  // ==================== NOVA PROJECT TYPE SELECTOR ====================

  /**
   * Show Nova project type selector
   */
  showNovaProjectTypeSelector() {
    const businessType = window.Nova.stateManager.getBusinessType();
    if (!businessType) return;

    const container = document.getElementById('nova-project-type-selector');
    const optionsContainer = document.getElementById('nova-project-type-options');
    
    if (!container || !optionsContainer) return;

    // Get available project types for the selected business type
    const availableProjects = this.getNovaAvailableProjectTypes(businessType);
    
    optionsContainer.innerHTML = `
      <div class="nova-project-type-grid">
        ${availableProjects.map(project => `
          <div class="nova-project-type-card ${window.Nova.stateManager.getSelectedProjectTypes().includes(project.id) ? 'selected' : ''}" 
               data-nova-project-type="${project.id}">
            <div class="nova-project-type-header">
              <span class="nova-project-type-icon">${project.icon || '📊'}</span>
              <h4>${project.name}</h4>
            </div>
            <p>${project.description}</p>
            <div class="nova-project-type-actions">
              <button type="button" class="nova-project-type-toggle" data-nova-project-type="${project.id}">
                ${window.Nova.stateManager.getSelectedProjectTypes().includes(project.id) ? 'Remove' : 'Add'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Add event listeners for Nova project type selection
    this.initializeNovaProjectTypeSelection();
    
    container.style.display = 'block';
  }

  /**
   * Hide Nova project type selector
   */
  hideNovaProjectTypeSelector() {
    const container = document.getElementById('nova-project-type-selector');
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Get available Nova project types for business type
   */
  getNovaAvailableProjectTypes(businessType) {
    if (!window.projectTypeManager) return [];
    
    // Get all project types from the project type manager
    const allTypes = window.projectTypeManager.getAllProjectTypes();
    return Object.values(allTypes).filter(project => 
      project.businessTypes && project.businessTypes.includes(businessType)
    );
  }

  /**
   * Initialize Nova project type selection
   */
  initializeNovaProjectTypeSelection() {
    const toggleButtons = document.querySelectorAll('.nova-project-type-toggle');
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const projectTypeId = button.dataset.novaProjectType;
        this.toggleNovaProjectType(projectTypeId);
      });
    });
  }

  /**
   * Toggle Nova project type selection
   */
  toggleNovaProjectType(projectTypeId) {
    const selectedProjects = window.Nova.stateManager.getSelectedProjectTypes();
    
    if (selectedProjects.includes(projectTypeId)) {
      window.Nova.stateManager.removeProjectType(projectTypeId);
    } else {
      window.Nova.stateManager.addProjectType(projectTypeId);
    }
  }

  /**
   * Update Nova project type selection display
   */
  updateNovaProjectTypeSelection(selectedProjects) {
    const cards = document.querySelectorAll('.nova-project-type-card');
    const buttons = document.querySelectorAll('.nova-project-type-toggle');
    
    cards.forEach(card => {
      const projectTypeId = card.dataset.novaProjectType;
      const isSelected = selectedProjects.includes(projectTypeId);
      card.classList.toggle('selected', isSelected);
    });
    
    buttons.forEach(button => {
      const projectTypeId = button.dataset.novaProjectType;
      const isSelected = selectedProjects.includes(projectTypeId);
      button.textContent = isSelected ? 'Remove' : 'Add';
    });
  }

  // ==================== NOVA ANALYSIS FORM ====================

  /**
   * Show Nova analysis form for active project
   */
  showNovaAnalysisForm(projectTypeId) {
    const container = document.getElementById('nova-business-analytics-form');
    if (!container) return;

    // Get project config from project type manager
    const projectConfig = window.projectTypeManager?.getProjectType(projectTypeId);
    if (!projectConfig) {
      console.warn('Nova: No config found for project type:', projectTypeId);
      return;
    }

    container.innerHTML = `
      <div class="nova-analysis-form">
        <div class="nova-form-header">
          <h3>Nova Analysis: ${projectConfig.name}</h3>
          <div class="nova-form-actions">
            <button type="button" class="nova-reset-btn" onclick="window.Nova.ui.resetNovaForm('${projectTypeId}')">
              Reset Form
            </button>
            <button type="button" class="nova-calculate-btn" onclick="window.Nova.ui.calculateNovaResults('${projectTypeId}')">
              Calculate
            </button>
          </div>
        </div>
        
        <div class="nova-form-content">
          ${this.generateNovaFormSections(projectTypeId, projectConfig)}
        </div>
        
        <div id="nova-results-${projectTypeId}" class="nova-results-section">
          <!-- Nova calculation results will appear here -->
        </div>
      </div>
    `;
    
    // Initialize Nova form inputs
    this.initializeNovaFormInputs(projectTypeId);
    
    container.style.display = 'block';
  }

  /**
   * Hide Nova analysis form
   */
  hideNovaAnalysisForm() {
    const container = document.getElementById('nova-business-analytics-form');
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Generate Nova form sections
   */
  generateNovaFormSections(projectTypeId, projectConfig) {
    const categories = projectConfig.categories || {};
    
    return Object.entries(categories).map(([categoryName, fields]) => `
      <div class="nova-form-section">
        <h4>${this.capitalize(categoryName)}</h4>
        <div class="nova-form-fields">
          ${Object.entries(fields).map(([fieldId, field]) => 
            this.generateNovaFormField(projectTypeId, fieldId, field)
          ).join('')}
        </div>
      </div>
    `).join('');
  }

  /**
   * Generate Nova form field
   */
  generateNovaFormField(projectTypeId, fieldId, field) {
    const inputId = `nova-${projectTypeId}-${fieldId}`;
    const value = window.Nova.stateManager.getFormData(projectTypeId, fieldId) || field.defaultValue || '';
    
    let inputElement = '';
    
    switch (field.type) {
      case 'number':
      case 'currency':
        inputElement = `
          <input type="number" 
                 id="${inputId}" 
                 value="${value}" 
                 min="${field.min || 0}" 
                 step="${field.step || 1}"
                 oninput="window.Nova.ui.updateNovaFormData('${projectTypeId}', '${fieldId}', this.value)">
        `;
        break;
      case 'percentage':
        inputElement = `
          <input type="range" 
                 id="${inputId}" 
                 value="${value}" 
                 min="${field.min || 0}" 
                 max="${field.max || 100}" 
                 step="${field.step || 1}"
                 oninput="window.Nova.ui.updateNovaFormData('${projectTypeId}', '${fieldId}', this.value); this.nextElementSibling.textContent = this.value + '%'">
          <span class="nova-range-value">${value}%</span>
        `;
        break;
      case 'select':
        inputElement = `
          <select id="${inputId}" onchange="window.Nova.ui.updateNovaFormData('${projectTypeId}', '${fieldId}', this.value)">
            ${field.options.map(option => `
              <option value="${option.value}" ${option.value == value ? 'selected' : ''}>
                ${option.label}
              </option>
            `).join('')}
          </select>
        `;
        break;
      default:
        inputElement = `
          <input type="text" 
                 id="${inputId}" 
                 value="${value}" 
                 oninput="window.Nova.ui.updateNovaFormData('${projectTypeId}', '${fieldId}', this.value)">
        `;
    }
    
    return `
      <div class="nova-form-field">
        <label for="${inputId}">
          ${field.name}
          ${field.unit ? ` (${field.unit})` : ''}
        </label>
        ${inputElement}
        ${field.description ? `<small class="nova-field-description">${field.description}</small>` : ''}
      </div>
    `;
  }

  /**
   * Initialize Nova form inputs
   */
  initializeNovaFormInputs(projectTypeId) {
    // Load saved Nova form data
    const formData = window.Nova.stateManager.getProjectFormData(projectTypeId);
    
    Object.entries(formData).forEach(([fieldId, value]) => {
      const inputId = `nova-${projectTypeId}-${fieldId}`;
      const input = document.getElementById(inputId);
      if (input) {
        input.value = value;
        
        // Update range value display if applicable
        if (input.type === 'range') {
          const valueSpan = input.nextElementSibling;
          if (valueSpan && valueSpan.classList.contains('nova-range-value')) {
            valueSpan.textContent = value + '%';
          }
        }
      }
    });
  }

  // ==================== NOVA FORM INTERACTION ====================

  /**
   * Update Nova form data
   */
  updateNovaFormData(projectTypeId, fieldId, value) {
    window.Nova.stateManager.setFormData(projectTypeId, fieldId, value);
  }

  /**
   * Reset Nova form
   */
  resetNovaForm(projectTypeId) {
    const projectConfig = window.projectTypeManager?.getProjectType(projectTypeId);
    if (!projectConfig) return;

    const categories = projectConfig.categories || {};
    
    Object.entries(categories).forEach(([categoryName, fields]) => {
      Object.entries(fields).forEach(([fieldId, field]) => {
        const inputId = `nova-${projectTypeId}-${fieldId}`;
        const input = document.getElementById(inputId);
        const defaultValue = field.defaultValue || '';
        
        if (input) {
          input.value = defaultValue;
          
          // Update range value display if applicable
          if (input.type === 'range') {
            const valueSpan = input.nextElementSibling;
            if (valueSpan && valueSpan.classList.contains('nova-range-value')) {
              valueSpan.textContent = defaultValue + '%';
            }
          }
        }
        
        // Update Nova state
        window.Nova.stateManager.setFormData(projectTypeId, fieldId, defaultValue);
      });
    });
    
    console.log('Nova form reset:', projectTypeId);
  }

  /**
   * Calculate Nova results
   */
  calculateNovaResults(projectTypeId) {
    const formData = window.Nova.stateManager.getProjectFormData(projectTypeId);
    const resultsContainer = document.getElementById(`nova-results-${projectTypeId}`);
    
    if (!resultsContainer) return;
    
    // Basic calculation for demonstration
    // In a real application, this would use the nova-calculations.js module
    const revenue = parseFloat(formData.revenue || 0);
    const costs = parseFloat(formData.costs || 0);
    const profit = revenue - costs;
    const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0;
    
    resultsContainer.innerHTML = `
      <div class="nova-results">
        <h4>Nova Calculation Results</h4>
        <div class="nova-results-grid">
          <div class="nova-result-item">
            <label>Revenue:</label>
            <span class="nova-result-value">€${revenue.toLocaleString()}</span>
          </div>
          <div class="nova-result-item">
            <label>Costs:</label>
            <span class="nova-result-value">€${costs.toLocaleString()}</span>
          </div>
          <div class="nova-result-item">
            <label>Profit:</label>
            <span class="nova-result-value ${profit >= 0 ? 'positive' : 'negative'}">€${profit.toLocaleString()}</span>
          </div>
          <div class="nova-result-item">
            <label>Margin:</label>
            <span class="nova-result-value">${margin}%</span>
          </div>
        </div>
      </div>
    `;
    
    console.log('Nova calculation completed:', { projectTypeId, formData, results: { revenue, costs, profit, margin } });
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Capitalize string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Reset entire Nova UI
   */
  resetNovaUI() {
    window.Nova.stateManager.reset();
    
    if (this.currentContainer) {
      this.generateNovaBusinessTypeSelector(this.currentContainer.id);
    }
    
    console.log('Nova UI reset');
  }
}

// Create Nova UI instance (independent from Vista)
window.Nova = window.Nova || {};
window.Nova.ui = new NovaUIGenerator();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NovaUIGenerator;
}