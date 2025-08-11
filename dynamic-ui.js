// Dynamic UI Generator for Generic P&L System
// Creates forms and interfaces based on project type configurations

class DynamicUIGenerator {
  constructor() {
    // Remove local state management - use centralized state manager instead
    this.formData = new Map();
    this.currentStep = 'business-type'; // 'business-type', 'project-type', 'analysis'
    
    // Initialize state change listeners
    this.initializeStateListeners();
  }

  /**
   * Initialize listeners for centralized state changes
   * This ensures the UI stays in sync with the global state
   */
  initializeStateListeners() {
    // Wait for state manager to be available
    const initListeners = () => {
      if (window.selectionStateManager) {
        // Listen for business type changes
        window.selectionStateManager.addEventListener('businessTypeChanged', (data) => {
          this.onBusinessTypeChanged(data);
        });

        // Listen for project type changes
        window.selectionStateManager.addEventListener('projectTypesChanged', (data) => {
          this.onProjectTypesChanged(data);
        });

        // Listen for active project changes
        window.selectionStateManager.addEventListener('activeProjectChanged', (data) => {
          this.onActiveProjectChanged(data);
        });
      } else {
        // Retry if state manager not yet available
        setTimeout(initListeners, 100);
      }
    };
    
    initListeners();
  }

  /**
   * Handle business type changes from centralized state
   */
  onBusinessTypeChanged(data) {
    console.log('Dynamic UI: Business type changed', data);
    
    if (data.new) {
      this.currentStep = 'project-type';
      this.showProjectTypeSelector();
      this.updateDropdownSelection(data.new);
      this.showSelectedBusinessTypeInfo(data.new);
    } else {
      this.currentStep = 'business-type';
      this.hideProjectTypeSelector();
      this.hideAnalysisForm();
    }
  }

  /**
   * Handle project type changes from centralized state
   */
  onProjectTypesChanged(data) {
    console.log('Dynamic UI: Project types changed', data);
    
    if (data.selectedProjects.length > 0) {
      this.currentStep = 'analysis';
      this.updateProjectTypeSelection(data.selectedProjects);
      
      // If there's an active project, show its analysis form
      const activeProject = window.selectionStateManager.getActiveProjectType();
      if (activeProject) {
        this.showAnalysisForm(activeProject);
      }
    } else {
      this.currentStep = 'project-type';
      this.hideAnalysisForm();
    }
  }

  /**
   * Handle active project changes from centralized state
   */
  onActiveProjectChanged(data) {
    console.log('Dynamic UI: Active project changed', data);
    
    if (data.new) {
      this.showAnalysisForm(data.new);
    }
  }

  // Getter methods that use centralized state
  get selectedBusinessType() {
    return window.selectionStateManager ? window.selectionStateManager.getBusinessType() : null;
  }

  get selectedProjectType() {
    return window.selectionStateManager ? window.selectionStateManager.getActiveProjectType() : null;
  }

  get selectedProjectTypes() {
    return window.selectionStateManager ? window.selectionStateManager.getSelectedProjectTypes() : [];
  }

  // Generate the main business type selection interface
  generateBusinessTypeSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const businessCategories = window.BUSINESS_TYPE_CATEGORIES;
    
    container.innerHTML = `
      <div class="business-analytics-container">
        <h2>Business Analytics Tool</h2>
        <p>Select your business type to access relevant analytics and KPIs tailored to your industry.</p>
        
        <div class="business-type-selector">
          <h3>Step 1: Choose Your Business Type</h3>
          
          <div class="business-type-dropdown-container">
            <label for="business-type-dropdown" class="business-type-label">
              Business Type:
            </label>
            <div class="custom-dropdown" tabindex="0" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="business-type-label">
              <div class="dropdown-trigger" id="business-type-trigger">
                <span class="dropdown-placeholder">Select your business type...</span>
                <span class="dropdown-arrow">▼</span>
              </div>
              <div class="dropdown-menu" role="listbox" aria-labelledby="business-type-label">
                ${Object.values(businessCategories).map(category => `
                  <div class="dropdown-option ${this.selectedBusinessType === category.id ? 'selected' : ''}" 
                       role="option" 
                       data-business-type="${category.id}"
                       aria-selected="${this.selectedBusinessType === category.id ? 'true' : 'false'}"
                       tabindex="-1">
                    <span class="option-icon">${category.icon}</span>
                    <div class="option-content">
                      <span class="option-title">${category.name}</span>
                      <span class="option-description">${category.description}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div id="selected-business-type-info" class="selected-business-type-info" style="display: none;">
            <!-- Selected business type details will be shown here -->
          </div>
        </div>

        <div id="project-type-selector" class="project-type-selector" style="display: none;">
          <h3>Step 2: Choose Your Specific Business Template</h3>
          <div id="project-type-options"></div>
        </div>

        <div id="business-analytics-form" class="business-analytics-form" style="display: none;">
          <!-- Dynamic form will be generated here -->
        </div>
      </div>
    `;
    
    // Initialize dropdown functionality
    this.initializeBusinessTypeDropdown();
  }

  // Initialize dropdown functionality
  initializeBusinessTypeDropdown() {
    const dropdown = document.querySelector('.custom-dropdown');
    const trigger = document.getElementById('business-type-trigger');
    const menu = document.querySelector('.dropdown-menu');
    const options = document.querySelectorAll('.dropdown-option');
    
    if (!dropdown || !trigger || !menu) return;
    
    // Toggle dropdown on trigger click
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleDropdown();
    });
    
    // Handle keyboard navigation
    dropdown.addEventListener('keydown', (e) => {
      this.handleDropdownKeydown(e);
    });
    
    // Handle option selection
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const businessTypeId = option.dataset.businessType;
        this.selectBusinessTypeFromDropdown(businessTypeId);
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });
    
    // Update dropdown if there's already a selection
    if (this.selectedBusinessType) {
      this.updateDropdownSelection(this.selectedBusinessType);
    }
  }
  
  // Toggle dropdown open/close
  toggleDropdown() {
    const dropdown = document.querySelector('.custom-dropdown');
    const menu = document.querySelector('.dropdown-menu');
    
    if (!dropdown || !menu) return;
    
    const isOpen = dropdown.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }
  
  // Open dropdown
  openDropdown() {
    const dropdown = document.querySelector('.custom-dropdown');
    const menu = document.querySelector('.dropdown-menu');
    
    if (!dropdown || !menu) return;
    
    dropdown.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('open');
    menu.style.display = 'block';
    
    // Focus first option
    const firstOption = menu.querySelector('.dropdown-option');
    if (firstOption) {
      firstOption.focus();
    }
  }
  
  // Close dropdown
  closeDropdown() {
    const dropdown = document.querySelector('.custom-dropdown');
    const menu = document.querySelector('.dropdown-menu');
    
    if (!dropdown || !menu) return;
    
    dropdown.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('open');
    menu.style.display = 'none';
  }
  
  // Handle keyboard navigation in dropdown
  handleDropdownKeydown(e) {
    const menu = document.querySelector('.dropdown-menu');
    const options = Array.from(document.querySelectorAll('.dropdown-option'));
    const isOpen = document.querySelector('.custom-dropdown').getAttribute('aria-expanded') === 'true';
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          this.openDropdown();
        } else {
          const focused = document.activeElement;
          if (focused && focused.classList.contains('dropdown-option')) {
            const businessTypeId = focused.dataset.businessType;
            this.selectBusinessTypeFromDropdown(businessTypeId);
          }
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        this.closeDropdown();
        document.querySelector('.custom-dropdown').focus();
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          this.openDropdown();
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
  
  // Select business type from dropdown
  selectBusinessTypeFromDropdown(businessTypeId) {
    this.selectBusinessType(businessTypeId);
    this.updateDropdownSelection(businessTypeId);
    this.closeDropdown();
    this.showSelectedBusinessTypeInfo(businessTypeId);
  }
  
  // Update dropdown visual selection
  updateDropdownSelection(businessTypeId) {
    const trigger = document.getElementById('business-type-trigger');
    const placeholder = trigger?.querySelector('.dropdown-placeholder');
    const options = document.querySelectorAll('.dropdown-option');
    const businessCategory = window.BUSINESS_TYPE_CATEGORIES[businessTypeId];
    
    if (!businessCategory || !placeholder) return;
    
    // Update trigger text
    placeholder.innerHTML = `
      <span class="selected-icon">${businessCategory.icon}</span>
      <span class="selected-text">${businessCategory.name}</span>
    `;
    placeholder.classList.add('has-selection');
    
    // Update option selection states
    options.forEach(option => {
      const isSelected = option.dataset.businessType === businessTypeId;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }
  
  // Show selected business type information
  showSelectedBusinessTypeInfo(businessTypeId) {
    const infoContainer = document.getElementById('selected-business-type-info');
    const businessCategory = window.BUSINESS_TYPE_CATEGORIES[businessTypeId];
    
    if (!infoContainer || !businessCategory) return;
    
    infoContainer.innerHTML = `
      <div class="selected-type-summary">
        <div class="selected-type-header">
          <span class="selected-type-icon">${businessCategory.icon}</span>
          <div class="selected-type-details">
            <h4>${businessCategory.name}</h4>
            <p>${businessCategory.description}</p>
          </div>
        </div>
        <div class="selected-type-info">
          <div class="info-section">
            <strong>Examples:</strong> ${businessCategory.examples.slice(0, 4).join(', ')}
          </div>
          <div class="info-section">
            <strong>Key Metrics:</strong> ${businessCategory.keyMetrics.slice(0, 3).join(', ')}
          </div>
        </div>
      </div>
    `;
    
    infoContainer.style.display = 'block';
  }

  // Select a business type and show relevant project templates
  selectBusinessType(businessTypeId) {
    // Use centralized state manager instead of local state
    if (window.selectionStateManager) {
      window.selectionStateManager.setBusinessType(businessTypeId);
    } else {
      console.warn('State manager not available, falling back to local state');
      this.currentStep = 'project-type';
      this.showProjectTypeSelector();
    }
  }

  // Show project type templates for the selected business type
  showProjectTypeSelector() {
    const projectTypeSelector = document.getElementById('project-type-selector');
    const projectTypeOptions = document.getElementById('project-type-options');
    
    if (!projectTypeSelector || !projectTypeOptions) return;
    
    const businessTypeId = this.selectedBusinessType;
    if (!businessTypeId) return;
    
    const businessCategory = window.BUSINESS_TYPE_CATEGORIES[businessTypeId];
    const projectTypes = window.projectTypeManager?.getProjectsByBusinessType(businessTypeId) || [];
    
    projectTypeSelector.style.display = 'block';
    
    projectTypeOptions.innerHTML = `
      <div class="business-type-info">
        <div class="selected-business-type">
          <span class="business-icon">${businessCategory.icon}</span>
          <strong>${businessCategory.name}</strong> - ${businessCategory.description}
        </div>
        <div class="key-metrics">
          <strong>Key Metrics for ${businessCategory.name}:</strong>
          <ul>
            ${businessCategory.keyMetrics.map(metric => `<li>${metric}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div class="project-type-templates">
        <h4>Available Templates</h4>
        <div class="project-template-grid">
          ${projectTypes.map(type => `
            <div class="project-template-card ${this.selectedProjectTypes.includes(type.id) ? 'selected' : ''}" 
                 data-project-type="${type.id}"
                 onclick="dynamicUI.selectProjectType('${type.id}')">
              <div class="project-icon">${type.icon}</div>
              <h5>${type.name}</h5>
              <p>${type.description}</p>
            </div>
          `).join('')}
          
          <div class="project-template-card create-custom" onclick="dynamicUI.createCustomTemplate()">
            <div class="project-icon">➕</div>
            <h5>Create Custom</h5>
            <p>Create a custom template for your specific business</p>
          </div>
        </div>
      </div>
    `;
    
    // Auto-select if only one template available
    if (projectTypes.length === 1) {
      setTimeout(() => this.selectProjectType(projectTypes[0].id), 100);
    }
  }

  // Select a project type and show the analysis form
  selectProjectType(projectTypeId) {
    // Use centralized state manager instead of local state
    if (window.selectionStateManager) {
      window.selectionStateManager.addProjectType(projectTypeId);
      window.selectionStateManager.setActiveProjectType(projectTypeId);
    } else {
      console.warn('State manager not available, falling back to local state');
      this.currentStep = 'analysis';
      this.showAnalysisForm(projectTypeId);
    }
  }

  /**
   * Update project type selection visual indicators
   */
  updateProjectTypeSelection(selectedProjects) {
    document.querySelectorAll('.project-template-card').forEach(card => {
      const projectId = card.dataset.projectType;
      if (projectId) {
        const isSelected = selectedProjects.includes(projectId);
        card.classList.toggle('selected', isSelected);
      }
    });
  }

  /**
   * Hide project type selector
   */
  hideProjectTypeSelector() {
    const projectTypeSelector = document.getElementById('project-type-selector');
    if (projectTypeSelector) {
      projectTypeSelector.style.display = 'none';
    }
  }

  /**
   * Hide analysis form
   */
  hideAnalysisForm() {
    const formContainer = document.getElementById('business-analytics-form');
    if (formContainer) {
      formContainer.style.display = 'none';
    }
  }

  // Show the analysis form for the selected project type
  showAnalysisForm(projectTypeId = null) {
    const formContainer = document.getElementById('business-analytics-form');
    if (!formContainer) return;
    
    const activeProjectId = projectTypeId || this.selectedProjectType;
    if (!activeProjectId) return;
    
    const projectType = window.projectTypeManager?.getProjectType(activeProjectId);
    const businessCategory = window.BUSINESS_TYPE_CATEGORIES[this.selectedBusinessType];
    
    if (!projectType || !businessCategory) return;
    
    // Initialize form data if not exists
    if (!this.formData.has(activeProjectId)) {
      this.initializeFormData(activeProjectId, projectType);
    }
    
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
      <div class="analysis-header">
        <h3>Step 3: ${projectType.name} Analysis</h3>
        <div class="breadcrumb">
          <span class="business-type">${businessCategory.icon} ${businessCategory.name}</span>
          <span class="separator">→</span>
          <span class="project-type">${projectType.icon} ${projectType.name}</span>
        </div>
        <button type="button" class="change-selection-btn" onclick="dynamicUI.resetSelection()">
          Change Selection
        </button>
      </div>
      
      <div class="business-insights">
        <h4>Business Type Insights: ${businessCategory.name}</h4>
        <div class="insights-grid">
          <div class="insight-card">
            <h5>Revenue Model</h5>
            <p>${this.getRevenueModelDescription(businessCategory.revenueModel)}</p>
          </div>
          <div class="insight-card">
            <h5>Key Success Factors</h5>
            <ul>
              ${businessCategory.characteristics.map(char => `<li>${this.formatCharacteristic(char)}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
      
      <div class="project-type-form">
        ${this.generateProjectTypeForm(activeProjectId, projectType)}
      </div>
      
      <div id="${activeProjectId}-summary" class="analysis-summary" aria-live="polite">
        <!-- Summary will be populated by calculations -->
      </div>
      
      <div class="analysis-actions">
        <button type="button" class="calculate-btn" onclick="dynamicUI.calculateProjectType('${activeProjectId}')">
          Calculate ${projectType.name}
        </button>
        <button type="button" class="save-scenario-btn" onclick="dynamicUI.saveCurrentScenario()">
          Save Scenario
        </button>
      </div>
    `;
    
    // Auto-calculate on form load
    setTimeout(() => this.calculateProjectType(activeProjectId), 100);
  }

  // Reset selection to start over
  resetSelection() {
    // Use centralized state manager to reset all selections
    if (window.selectionStateManager) {
      window.selectionStateManager.resetState();
    } else {
      // Fallback to local reset
      this.currentStep = 'business-type';
      
      // Hide secondary sections
      this.hideProjectTypeSelector();
      this.hideAnalysisForm();
      
      // Reset business type selection visuals
      document.querySelectorAll('.business-type-card').forEach(card => {
        card.classList.remove('selected');
      });
      
      // Reset dropdown
      const trigger = document.getElementById('business-type-trigger');
      const placeholder = trigger?.querySelector('.dropdown-placeholder');
      if (placeholder) {
        placeholder.innerHTML = 'Select your business type...';
        placeholder.classList.remove('has-selection');
      }
      
      // Hide business type info
      const infoContainer = document.getElementById('selected-business-type-info');
      if (infoContainer) {
        infoContainer.style.display = 'none';
      }
    }
  }

  // Helper method to get revenue model description
  getRevenueModelDescription(model) {
    const descriptions = {
      'time-based': 'Revenue generated by booking time slots or sessions',
      'subscription': 'Recurring revenue from membership fees or subscriptions',
      'event-tickets': 'Revenue from event ticket sales and attendance',
      'commission': 'Revenue from commissions on transactions or referrals',
      'product-sales': 'Revenue from selling physical or digital products',
      'hourly-project': 'Revenue from hourly billing or project-based fees',
      'tuition-fees': 'Revenue from educational fees and course enrollments',
      'rental-income': 'Revenue from renting out assets or properties',
      'mixed': 'Multiple revenue streams combined',
      'cost-savings': 'Benefits realized through cost reductions and efficiency gains',
      'royalty-income': 'Revenue from intellectual property licensing and royalties',
      'partnership-share': 'Revenue shared through strategic partnerships and collaborations',
      'investment-income': 'Returns from investment portfolios and financial instruments',
      'recurring-income': 'Predictable recurring revenue from contracts and services'
    };
    return descriptions[model] || 'Custom revenue model';
  }

  // Helper method to format characteristics
  formatCharacteristic(char) {
    const formats = {
      'time_slots': 'Time slot management',
      'capacity_utilization': 'Capacity utilization optimization',
      'peak_pricing': 'Peak and off-peak pricing',
      'scheduling': 'Scheduling and booking systems',
      'recurring_revenue': 'Recurring revenue management',
      'member_tiers': 'Membership tier optimization',
      'retention': 'Customer retention strategies',
      'growth_rate': 'Growth rate tracking',
      'ticket_pricing': 'Ticket pricing optimization',
      'event_capacity': 'Event capacity management',
      'seasonal_events': 'Seasonal event planning',
      'speaker_costs': 'Speaker and venue cost management',
      'redemption_tracking': 'Redemption rate tracking',
      'campaign_cycles': 'Campaign cycle optimization',
      'partner_commissions': 'Partner commission management',
      'conversion_funnels': 'Conversion funnel optimization',
      'inventory_management': 'Inventory management',
      'cost_of_goods': 'Cost of goods optimization',
      'order_fulfillment': 'Order fulfillment efficiency',
      'product_mix': 'Product mix optimization',
      'hourly_billing': 'Hourly billing optimization',
      'project_based': 'Project-based pricing',
      'consultant_utilization': 'Consultant utilization rates',
      'client_relationships': 'Client relationship management',
      'course_curriculum': 'Course curriculum development',
      'student_capacity': 'Student capacity optimization',
      'instructor_costs': 'Instructor cost management',
      'certification': 'Certification and accreditation',
      'asset_depreciation': 'Asset depreciation management',
      'maintenance_cycles': 'Maintenance cycle planning',
      'rental_duration': 'Rental duration optimization',
      'asset_utilization': 'Asset utilization tracking',
      'multiple_revenue_streams': 'Multiple revenue stream management',
      'cross_selling': 'Cross-selling opportunities',
      'segment_analysis': 'Customer segment analysis',
      'model_optimization': 'Business model optimization',
      'property_management': 'Property management and maintenance',
      'rental_income': 'Rental income optimization',
      'property_appreciation': 'Property value appreciation tracking',
      'tenant_management': 'Tenant relationship management',
      'budget_tracking': 'Budget utilization tracking',
      'project_management': 'Project timeline and milestone management',
      'cost_savings': 'Cost savings identification and tracking',
      'implementation_phases': 'Phased implementation planning'
    };
    return formats[char] || char.replace(/_/g, ' ');
  }

  // Create custom template
  createCustomTemplate() {
    const name = prompt('Enter name for your custom business template:');
    if (!name) return;

    try {
      const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const baseTemplate = window.projectTypeManager.getProjectType('generic');
      
      const customConfig = JSON.parse(JSON.stringify(baseTemplate)); // Deep clone
      customConfig.id = id;
      customConfig.name = name;
      customConfig.description = `Custom ${name} business based on ${this.selectedBusinessType} category`;
      customConfig.businessType = this.selectedBusinessType;
      
      window.projectTypeManager.setProjectType(id, customConfig);
      
      // Refresh project type selector
      this.showProjectTypeSelector();
      
      // Auto-select the new template
      setTimeout(() => this.selectProjectType(id), 100);
      
      alert(`Created custom template: ${name}`);
    } catch (error) {
      alert(`Failed to create custom template: ${error.message}`);
    }
  }

  // Generate the main project type selection interface (legacy method - updated)
  generateProjectTypeSelector(containerId) {
    // This is now the main entry point - delegate to business type selector
    this.generateBusinessTypeSelector(containerId);
  }

  // Legacy methods for backward compatibility - now redirect to new flow
  addProjectType(typeId) {
    // Auto-select business type based on project type
    const projectType = window.projectTypeManager.getProjectType(typeId);
    if (projectType && projectType.businessType) {
      this.selectBusinessType(projectType.businessType);
      setTimeout(() => this.selectProjectType(typeId), 200);
    }
  }

  removeProjectType(typeId) {
    // Reset if removing current selection
    if (this.selectedProjectType === typeId) {
      this.resetSelection();
    }
  }

  // Generate dynamic tabs for active project types (legacy - now shows single analysis)
  generateProjectTypeTabs() {
    // This method is now handled by the new business type flow
    // Keep for backward compatibility but redirect to main tab system
    if (this.selectedProjectType) {
      this.updateMainTabs();
    }
  }

  // Update main navigation tabs
  updateMainTabs() {
    const tabsContainer = document.querySelector('nav.tabs');
    if (!tabsContainer) return;

    // Clear existing dynamic tabs but keep system tabs
    const systemTabs = ['project-selector', 'pnl', 'roi', 'scenarios', 'summary', 'gantt'];
    tabsContainer.querySelectorAll('button').forEach(btn => {
      const tabId = btn.dataset.tab;
      if (tabId && !systemTabs.includes(tabId) && !btn.id) {
        btn.remove();
      }
    });

    // If we have a selected project type, we can proceed to other tabs
    if (this.selectedProjectType) {
      // Enable other tabs by updating their content
      this.updateCombinedAnalysis();
    }
  }

  // Initialize form data with default values
  initializeFormData(typeId, projectType) {
    const data = {};
    
    for (const categoryType of ['investment', 'revenue', 'operating', 'staffing']) {
      const category = projectType.categories[categoryType];
      for (const field of category) {
        data[field.id] = field.defaultValue || 0;
      }
    }
    
    this.formData.set(typeId, data);
  }

  // Generate dynamic tabs for active project types
  generateProjectTypeTabs() {
    const tabsContainer = document.querySelector('nav.tabs');
    const mainContainer = document.querySelector('main');
    
    if (!tabsContainer || !mainContainer) return;

    // Clear existing project-specific tabs (but keep system tabs)
    const systemTabs = ['project-selector', 'pnl', 'roi', 'scenarios', 'summary', 'gantt'];
    tabsContainer.querySelectorAll('button').forEach(btn => {
      const tabId = btn.dataset.tab;
      if (tabId && !systemTabs.includes(tabId)) {
        btn.remove();
      }
    });

    // Clear existing project type sections
    mainContainer.querySelectorAll('.project-type-section').forEach(section => {
      section.remove();
    });

    // Find the insertion point (before "Projects" button)
    const projectsButton = tabsContainer.querySelector('button[data-tab="project-selector"]');
    
    // Add tabs and sections for active project types
    const allTypes = window.projectTypeManager.getAllProjectTypes();
    
    for (const typeId of this.activeProjectTypes) {
      const projectType = allTypes[typeId];
      if (!projectType) continue;

      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.type = 'button';
      tabButton.dataset.tab = `${typeId}-dynamic`;
      tabButton.textContent = projectType.name;
      tabButton.addEventListener('click', () => this.showTab(`${typeId}-dynamic`));
      
      // Insert before Projects button
      if (projectsButton) {
        projectsButton.parentNode.insertBefore(tabButton, projectsButton);
      }

      // Create content section
      const section = document.createElement('section');
      section.id = `${typeId}-dynamic`;
      section.className = 'tab-content project-type-section hidden';
      section.innerHTML = this.generateProjectTypeForm(typeId, projectType);
      
      mainContainer.appendChild(section);
    }

    // Show first active tab if any
    if (this.activeProjectTypes.size > 0) {
      const firstActiveType = Array.from(this.activeProjectTypes)[0];
      this.showTab(`${firstActiveType}-dynamic`);
    }
  }

  // Generate form for a specific project type
  generateProjectTypeForm(typeId, projectType) {
    const data = this.formData.get(typeId) || {};
    
    return `
      <h2>${projectType.name} Analysis</h2>
      <div class="project-type-form">
        ${this.generateCategorySection('Investment', projectType.categories.investment, typeId, data)}
        ${this.generateCategorySection('Revenue', projectType.categories.revenue, typeId, data)}
        ${this.generateCategorySection('Operating Costs', projectType.categories.operating, typeId, data)}
        ${this.generateCategorySection('Staffing', projectType.categories.staffing, typeId, data)}
      </div>
      <div id="${typeId}-dynamicSummary" class="summary" aria-live="polite"></div>
      <button type="button" onclick="dynamicUI.calculateProjectType('${typeId}')">Calculate ${projectType.name}</button>
    `;
  }

  // Generate a category section (investment, revenue, etc.)
  generateCategorySection(categoryName, fields, typeId, data) {
    if (!fields || fields.length === 0) return '';

    // Group fields by group if available
    const groups = {};
    for (const field of fields) {
      const groupName = field.group || 'General';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(field);
    }

    return `
      <div class="section-group">
        <h3>${categoryName}</h3>
        ${Object.entries(groups).map(([groupName, groupFields]) => `
          <div class="field-group">
            ${Object.keys(groups).length > 1 ? `<h4>${groupName}</h4>` : ''}
            ${groupFields.map(field => this.generateFieldInput(field, typeId, data)).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Generate input field based on field configuration
  generateFieldInput(field, typeId, data) {
    const value = data[field.id] !== undefined ? data[field.id] : field.defaultValue || 0;
    const fieldId = `${typeId}_${field.id}`;
    
    let inputHtml = '';
    
    switch (field.type) {
      case 'boolean':
        inputHtml = `<input type="checkbox" id="${fieldId}" ${value ? 'checked' : ''} onchange="dynamicUI.updateFieldValue('${typeId}', '${field.id}', this.checked)">`;
        break;
        
      case 'percentage':
        inputHtml = `
          <input type="range" id="${fieldId}_range" min="${field.min || 0}" max="${field.max || 100}" value="${value}" 
                 oninput="${fieldId}_value.value=this.value; dynamicUI.updateFieldValue('${typeId}', '${field.id}', this.value)">
          <input type="number" id="${fieldId}_value" min="${field.min || 0}" max="${field.max || 100}" value="${value}" 
                 oninput="${fieldId}_range.value=this.value; dynamicUI.updateFieldValue('${typeId}', '${field.id}', this.value)">
        `;
        break;
        
      case 'currency':
      case 'number':
      default:
        const min = field.min !== undefined ? `min="${field.min}"` : '';
        const max = field.max !== undefined ? `max="${field.max}"` : '';
        inputHtml = `<input type="number" id="${fieldId}" value="${value}" ${min} ${max} 
                           oninput="dynamicUI.updateFieldValue('${typeId}', '${field.id}', this.value)">`;
        break;
    }

    const unit = field.unit ? ` <span class="field-unit">${field.unit}</span>` : '';
    const description = field.description ? `<span class="field-description" title="${field.description}">ℹ️</span>` : '';
    
    return `
      <label class="field-input">
        <span class="field-label">${field.name}:</span>
        ${inputHtml}
        ${unit}
        ${description}
      </label>
    `;
  }

  // Update field value in form data
  updateFieldValue(typeId, fieldId, value) {
    if (!this.formData.has(typeId)) {
      this.formData.set(typeId, {});
    }
    
    const data = this.formData.get(typeId);
    
    // Convert value based on type
    if (typeof value === 'boolean') {
      data[fieldId] = value;
    } else {
      const numValue = parseFloat(value);
      data[fieldId] = isNaN(numValue) ? 0 : numValue;
    }
    
    this.formData.set(typeId, data);
    this.updateCalculations();
  }

  // Calculate a specific project type
  calculateProjectType(typeId) {
    const data = this.formData.get(typeId);
    if (!data) return;

    try {
      const result = window.calculationEngine.registerProjectType(typeId, data);
      this.updateProjectTypeSummary(typeId, result);
      this.updateCombinedAnalysis();
    } catch (error) {
      console.error(`Failed to calculate ${typeId}:`, error);
      alert(`Calculation failed: ${error.message}`);
    }
  }

  // Update all calculations for active project types
  updateCalculations() {
    for (const typeId of this.activeProjectTypes) {
      this.calculateProjectType(typeId);
    }
  }

  // Update summary display for a project type
  updateProjectTypeSummary(typeId, result) {
    const summaryElement = document.getElementById(`${typeId}-dynamicSummary`);
    if (!summaryElement || !result) return;

    summaryElement.innerHTML = `
      <h3>Summary</h3>
      <p><strong>Total Revenue:</strong> €${result.revenue.annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      <p><strong>Total Costs:</strong> €${result.costs.annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      <p><strong>Net Profit:</strong> €${result.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      <p><strong>ROI:</strong> ${result.roi.roiPercentage.toFixed(1)}%</p>
      <p><strong>Payback Period:</strong> ${result.roi.paybackYears === Infinity ? 'Never' : result.roi.paybackYears + ' years'}</p>
      ${this.generateBreakdownSummary(result)}
    `;
  }

  // Generate breakdown summary based on project type
  generateBreakdownSummary(result) {
    let breakdownHtml = '';
    
    if (result.breakdown.revenue) {
      if (result.typeId === 'padel' && result.breakdown.revenue.peak) {
        breakdownHtml += `
          <h4>Utilization Breakdown (per court)</h4>
          <ul>
            <li>Peak: ${result.breakdown.revenue.peak.hours}h/day × ${result.breakdown.revenue.peak.totalHours} hours available</li>
            <li>Peak Utilized: <strong>${result.breakdown.revenue.peak.utilizedHours.toFixed(1)}</strong> hours/year (${result.breakdown.revenue.peak.utilization.toFixed(1)}% utilization)</li>
            <li>Off-Peak: ${result.breakdown.revenue.offPeak.hours}h/day × ${result.breakdown.revenue.offPeak.totalHours} hours available</li>
            <li>Off-Peak Utilized: <strong>${result.breakdown.revenue.offPeak.utilizedHours.toFixed(1)}</strong> hours/year (${result.breakdown.revenue.offPeak.utilization.toFixed(1)}% utilization)</li>
          </ul>
        `;
      } else if (result.typeId === 'gym' && result.breakdown.revenue.memberships) {
        const memberships = result.breakdown.revenue.memberships;
        breakdownHtml += `
          <h4>Membership Breakdown</h4>
          <ul>
            <li>Weekly: ${memberships.weekly.members} members × €${memberships.weekly.fee}/week = €${memberships.weekly.revenue.toLocaleString()}/year</li>
            <li>Monthly: ${memberships.monthly.members} members × €${memberships.monthly.fee}/month = €${memberships.monthly.revenue.toLocaleString()}/year</li>
            <li>Annual: ${memberships.annual.members} members × €${memberships.annual.fee}/year = €${memberships.annual.revenue.toLocaleString()}/year</li>
          </ul>
        `;
      } else if (result.typeId === 'realEstate' && result.breakdown.rental) {
        const rental = result.breakdown.rental;
        breakdownHtml += `
          <h4>Real Estate Analysis</h4>
          <ul>
            <li>Monthly Rent: €${rental.monthlyRent.toLocaleString()}</li>
            <li>Occupancy Rate: ${rental.occupancyRate}%</li>
            <li>Effective Annual Rent: €${rental.effectiveAnnualRent.toLocaleString()}</li>
            <li>With Growth Adjustment: €${rental.adjustedForIncrease.toLocaleString()}</li>
            <li>Other Income: €${rental.otherIncome.toLocaleString()}</li>
            <li><strong>Total Revenue: €${rental.totalRevenue.toLocaleString()}</strong></li>
          </ul>
        `;
      } else if (result.typeId === 'capexInvestment' && result.breakdown.revenue && result.breakdown.revenue.benefits) {
        const benefits = result.breakdown.revenue.benefits;
        breakdownHtml += `
          <h4>CapEx Investment Analysis</h4>
          <ul>
            <li>Annual Cost Savings: €${benefits.annualCostSavings.toLocaleString()}</li>
            <li>Annual Revenue Increase: €${benefits.annualRevenueIncrease.toLocaleString()}</li>
            <li>Total Annual Benefits: €${benefits.totalBenefits.toLocaleString()}</li>
            <li>Implementation Period: ${benefits.implementationMonths} months</li>
            <li>Ramp-up Period: ${benefits.rampUpMonths} months</li>
            <li><strong>First Year Benefits: €${benefits.firstYearBenefits.toLocaleString()}</strong></li>
            <li>Efficiency Gains: ${benefits.efficiencyGains}%</li>
            <li>Quality Improvement: ${benefits.qualityImprovement}%</li>
          </ul>
        `;
      }
    }
    
    return breakdownHtml;
  }

  // Update combined P&L analysis
  updateCombinedAnalysis() {
    if (!this.selectedProjectType) return;

    const result = window.calculationEngine.getCalculation(this.selectedProjectType);
    if (!result) return;

    // Create a "combined" analysis with single project for consistency with existing code
    const combined = {
      projects: [result],
      totals: {
        revenue: result.revenue.annual,
        costs: result.costs.annual,
        profit: result.profit,
        investment: result.investment,
        roi: result.roi.roiPercentage,
        paybackYears: result.roi.paybackYears
      }
    };
    
    this.updatePnLTab(combined);
    this.updateROITab(combined);
  }

  // Update calculations for current project type
  updateCalculations() {
    if (this.selectedProjectType) {
      this.calculateProjectType(this.selectedProjectType);
    }
  }

  // Calculate a specific project type
  calculateProjectType(typeId) {
    const data = this.formData.get(typeId);
    if (!data) return;

    try {
      const result = window.calculationEngine.registerProjectType(typeId, data);
      this.updateProjectTypeSummary(typeId, result);
      this.updateCombinedAnalysis();
    } catch (error) {
      console.error(`Failed to calculate ${typeId}:`, error);
      alert(`Calculation failed: ${error.message}`);
    }
  }

  // Update summary display for a project type
  updateProjectTypeSummary(typeId, result) {
    const summaryElement = document.getElementById(`${typeId}-summary`);
    if (!summaryElement || !result) return;

    const businessCategory = window.BUSINESS_TYPE_CATEGORIES[this.selectedBusinessType];
    
    summaryElement.innerHTML = `
      <h3>Analysis Results</h3>
      <div class="summary-cards">
        <div class="summary-card revenue">
          <h4>Total Revenue</h4>
          <div class="amount">€${result.revenue.annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="period">per year</div>
        </div>
        <div class="summary-card costs">
          <h4>Total Costs</h4>
          <div class="amount">€${result.costs.annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="period">per year</div>
        </div>
        <div class="summary-card profit ${result.profit >= 0 ? 'positive' : 'negative'}">
          <h4>Net Profit</h4>
          <div class="amount">€${result.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div class="period">per year</div>
        </div>
        <div class="summary-card roi">
          <h4>ROI</h4>
          <div class="amount">${result.roi.roiPercentage.toFixed(1)}%</div>
          <div class="period">annually</div>
        </div>
        <div class="summary-card payback">
          <h4>Payback Period</h4>
          <div class="amount">${result.roi.paybackYears === Infinity ? '∞' : result.roi.paybackYears}</div>
          <div class="period">${result.roi.paybackYears === 1 ? 'year' : 'years'}</div>
        </div>
      </div>
      
      <div class="business-type-kpis">
        <h4>${businessCategory.name} Key Performance Indicators</h4>
        ${this.generateBusinessTypeKPIs(result, businessCategory)}
      </div>
      
      ${this.generateBreakdownSummary(result)}
    `;
  }

  // Generate business type specific KPIs
  generateBusinessTypeKPIs(result, businessCategory) {
    const kpis = [];
    
    // Check both business category ID and specific project type ID for broader compatibility
    const categoryId = businessCategory.id;
    const projectTypeId = result.typeId;
    
    if (categoryId === 'booking' || projectTypeId === 'padel') {
      if (result.breakdown.revenue && result.breakdown.revenue.peak) {
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Peak Utilization Rate:</span>
          <span class="kpi-value">${result.breakdown.revenue.peak.utilization.toFixed(1)}%</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Total Bookable Hours/Year:</span>
          <span class="kpi-value">${(result.breakdown.revenue.peak.totalHours + result.breakdown.revenue.offPeak.totalHours).toLocaleString()}</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Revenue per Hour:</span>
          <span class="kpi-value">€${((result.revenue.annual) / (result.breakdown.revenue.peak.utilizedHours + result.breakdown.revenue.offPeak.utilizedHours)).toFixed(2)}</span>
        </div>`);
      }
    } else if (categoryId === 'member' || projectTypeId === 'gym') {
      if (result.breakdown.revenue && result.breakdown.revenue.memberships) {
        const memberships = result.breakdown.revenue.memberships;
        const totalMembers = memberships.weekly.members + memberships.monthly.members + memberships.annual.members;
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Total Members:</span>
          <span class="kpi-value">${totalMembers}</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Average Revenue per Member:</span>
          <span class="kpi-value">€${(result.revenue.annual / totalMembers).toFixed(2)}/year</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Monthly Recurring Revenue:</span>
          <span class="kpi-value">€${(result.revenue.annual / 12).toLocaleString()}</span>
        </div>`);
      }
    } else if (categoryId === 'event') {
      if (result.formData) {
        const eventsPerYear = result.formData.eventsPerYear || 0;
        const capacity = result.formData.capacity || 0;
        const occupancyRate = result.formData.occupancyRate || 0;
        
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Total Event Capacity/Year:</span>
          <span class="kpi-value">${(eventsPerYear * capacity).toLocaleString()}</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Expected Attendance/Year:</span>
          <span class="kpi-value">${(eventsPerYear * capacity * occupancyRate / 100).toLocaleString()}</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Revenue per Attendee:</span>
          <span class="kpi-value">€${(result.revenue.annual / (eventsPerYear * capacity * occupancyRate / 100)).toFixed(2)}</span>
        </div>`);
      }
    } else if (categoryId === 'product') {
      if (result.formData) {
        const ordersPerMonth = result.formData.ordersPerMonth || 0;
        const avgOrderValue = result.formData.avgOrderValue || 0;
        
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Orders per Year:</span>
          <span class="kpi-value">${(ordersPerMonth * 12).toLocaleString()}</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Average Order Value:</span>
          <span class="kpi-value">€${avgOrderValue}</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Gross Margin:</span>
          <span class="kpi-value">${result.formData.grossMargin || 0}%</span>
        </div>`);
      }
    } else if (categoryId === 'service') {
      if (result.formData) {
        const billableHours = result.formData.billableHours || 0;
        const hourlyRate = result.formData.hourlyRate || 0;
        const weeksPerYear = result.formData.weeksPerYear || 0;
        
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Billable Hours/Year:</span>
          <span class="kpi-value">${(billableHours * weeksPerYear).toLocaleString()}</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Hourly Rate:</span>
          <span class="kpi-value">€${hourlyRate}/hour</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Utilization Rate:</span>
          <span class="kpi-value">${result.formData.utilizationRate || 0}%</span>
        </div>`);
      }
    } else if (categoryId === 'real_estate' || projectTypeId === 'realEstate') {
      if (result.breakdown.rental) {
        const rental = result.breakdown.rental;
        const totalInvestment = result.investment;
        const grossRentYield = totalInvestment > 0 ? (rental.effectiveAnnualRent / totalInvestment * 100) : 0;
        const netRentYield = totalInvestment > 0 ? (result.profit / totalInvestment * 100) : 0;
        
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Gross Rental Yield:</span>
          <span class="kpi-value">${grossRentYield.toFixed(2)}%</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Net Rental Yield:</span>
          <span class="kpi-value">${netRentYield.toFixed(2)}%</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Occupancy Rate:</span>
          <span class="kpi-value">${rental.occupancyRate}%</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Monthly Cash Flow:</span>
          <span class="kpi-value">€${(result.profit / 12).toFixed(2)}</span>
        </div>`);
      }
    } else if (categoryId === 'capex_investment' || projectTypeId === 'capexInvestment') {
      if (result.breakdown.revenue && result.breakdown.revenue.benefits) {
        const benefits = result.breakdown.revenue.benefits;
        const budgetUtilization = result.investment > 0 ? 100 : 0; // Simplified - could be enhanced
        const projectROI = result.investment > 0 ? (benefits.totalBenefits / result.investment * 100) : 0;
        
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Project ROI:</span>
          <span class="kpi-value">${projectROI.toFixed(1)}%</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Annual Cost Savings:</span>
          <span class="kpi-value">€${benefits.annualCostSavings.toLocaleString()}</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Implementation + Ramp-up:</span>
          <span class="kpi-value">${benefits.implementationMonths + benefits.rampUpMonths} months</span>
        </div>`);
        kpis.push(`<div class="kpi">
          <span class="kpi-label">Efficiency Improvement:</span>
          <span class="kpi-value">${benefits.efficiencyGains}%</span>
        </div>`);
      }
    }
    
    return kpis.length > 0 ? `<div class="kpi-grid">${kpis.join('')}</div>` : '<p>No specific KPIs available for this business type.</p>';
  }

  // Save current scenario
  saveCurrentScenario() {
    if (!this.selectedProjectType) {
      alert('Please select a project type first');
      return;
    }
    
    const name = prompt('Enter scenario name:');
    if (!name) return;
    
    try {
      const scenarios = JSON.parse(localStorage.getItem('scenarios') || '[]');
      const state = {
        name: name,
        businessType: this.selectedBusinessType,
        projectType: this.selectedProjectType,
        formData: Object.fromEntries(this.formData),
        timestamp: Date.now()
      };
      
      scenarios.push(state);
      localStorage.setItem('scenarios', JSON.stringify(scenarios));
      alert(`Scenario "${name}" saved successfully`);
    } catch (error) {
      alert(`Failed to save scenario: ${error.message}`);
    }
  }

  // Update P&L tab with combined data
  updatePnLTab(combined) {
    const pnlSummary = document.getElementById('pnlSummary');
    if (!pnlSummary) return;

    pnlSummary.innerHTML = `
      <p><strong>Total Revenue:</strong> €${Math.round(combined.totals.revenue).toLocaleString('en-US')}</p>
      <p><strong>Total Costs:</strong> €${Math.round(combined.totals.costs).toLocaleString('en-US')}</p>
      <p><strong>Net Profit:</strong> €${Math.round(combined.totals.profit).toLocaleString('en-US')}</p>
      <div class="project-breakdown">
        <h4>By Project Type:</h4>
        ${combined.projects.map(project => `
          <p><strong>${project.typeName}:</strong> €${project.profit.toLocaleString()} profit</p>
        `).join('')}
      </div>
    `;

    // Update monthly breakdown table
    this.updateMonthlyBreakdownTable(combined);
    
    // Update cash flow table
    this.updateCashFlowTable(combined);
  }

  // Update monthly breakdown table
  updateMonthlyBreakdownTable(combined) {
    const tbody = document.querySelector('#monthlyBreakdown tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const monthlyRevenue = combined.totals.revenue / 12;
    const monthlyCosts = combined.totals.costs / 12;
    const monthlyProfit = combined.totals.profit / 12;

    for (let i = 1; i <= 12; i++) {
      const row = `<tr>
        <td>${i}</td>
        <td>€${monthlyRevenue.toFixed(2)}</td>
        <td>€${monthlyCosts.toFixed(2)}</td>
        <td>€${monthlyProfit.toFixed(2)}</td>
      </tr>`;
      tbody.insertAdjacentHTML('beforeend', row);
    }
  }

  // Update cash flow table
  updateCashFlowTable(combined) {
    const cashFlowBody = document.querySelector('#cashFlowTable tbody');
    if (!cashFlowBody) return;

    // Generate cash flow for the single selected project
    if (!this.selectedProjectType) return;
    
    const cashFlow = window.calculationEngine.generateCashFlow([this.selectedProjectType], 12);
    
    cashFlowBody.innerHTML = '';
    for (const month of cashFlow) {
      cashFlowBody.insertAdjacentHTML('beforeend',
        `<tr>
          <td>${month.month}</td>
          <td>€${month.opening.toFixed(2)}</td>
          <td>€${month.inflow.toFixed(2)}</td>
          <td>€${month.outflow.toFixed(2)}</td>
          <td>€${month.closing.toFixed(2)}</td>
        </tr>`);
    }
  }

  // Update ROI tab
  updateROITab(combined) {
    const roiElement = document.getElementById('yearsToROIText');
    if (roiElement) {
      roiElement.innerHTML = `<div class="roi-summary">Estimated Payback Period: <strong>${combined.totals.paybackYears === Infinity ? 'Never' : combined.totals.paybackYears + ' year(s)'}</strong></div>`;
    }

    // Update ROI KPIs
    const roiKPIs = document.getElementById('roiKPIs');
    if (roiKPIs) {
      const roi1 = (combined.totals.profit / combined.totals.investment) * 100;
      const roi3 = (combined.totals.profit * 3 / combined.totals.investment) * 100;
      const roi5 = (combined.totals.profit * 5 / combined.totals.investment) * 100;
      
      roiKPIs.innerHTML = `<h3>ROI Percentages</h3><ul>
        <li>Year 1: ${isFinite(roi1) ? roi1.toFixed(1) + '%' : 'N/A'}</li>
        <li>Year 3: ${isFinite(roi3) ? roi3.toFixed(1) + '%' : 'N/A'}</li>
        <li>Year 5: ${isFinite(roi5) ? roi5.toFixed(1) + '%' : 'N/A'}</li>
      </ul>`;
    }
  }

  // Show specific tab
  showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(sec => {
      sec.classList.add('hidden');
    });
    
    // Update tab buttons
    document.querySelectorAll('nav.tabs button').forEach(btn => {
      btn.classList.remove('active');
    });

    // Show selected tab
    const targetSection = document.getElementById(tabId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }

    // Activate tab button
    const targetButton = document.querySelector(`nav.tabs button[data-tab="${tabId}"]`);
    if (targetButton) {
      targetButton.classList.add('active');
    }

    // Trigger tab-specific updates
    if (tabId === 'pnl') {
      this.updateCombinedAnalysis();
    } else if (tabId === 'roi') {
      this.updateCombinedAnalysis();
    } else if (tabId === 'project-selector') {
      // Ensure project selector is regenerated
      this.generateProjectTypeSelector('project-selector');
    }
  }

  // Create custom project type dialog
  createCustomProjectType() {
    const name = prompt('Enter name for new project type:');
    if (!name) return;

    const template = prompt('Base on template (padel/gym/generic):', 'generic');
    const templateType = window.projectTypeManager.getProjectType(template);
    
    if (!templateType) {
      alert('Invalid template');
      return;
    }

    try {
      const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const newConfig = window.projectTypeManager.createFromTemplate(template, id, name);
      
      // Refresh UI
      this.generateProjectTypeSelector('project-selector');
      alert(`Created custom project type: ${name}`);
    } catch (error) {
      alert(`Failed to create project type: ${error.message}`);
    }
  }

  // Export configuration
  exportConfiguration() {
    const config = window.projectTypeManager.exportConfiguration();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pl-configuration.json';
    a.click();
    
    URL.revokeObjectURL(url);
  }

  // Import configuration
  importConfiguration() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          window.projectTypeManager.importConfiguration(config);
          this.generateProjectTypeSelector('project-selector');
          alert('Configuration imported successfully');
        } catch (error) {
          alert(`Failed to import configuration: ${error.message}`);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }
}

// Global dynamic UI instance
window.dynamicUI = new DynamicUIGenerator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DynamicUIGenerator };
}