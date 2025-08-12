// Project Selector Integration
// Integrates multi-select dropdowns into Investment Model and Staffing tabs

/**
 * Project Selector Manager
 * Manages multi-select dropdowns for project selection across tabs
 */
class ProjectSelectorManager {
  constructor() {
    this.investmentSelector = null;
    this.staffingSelector = null;
    this.isInitialized = false;
    
    // Wait for DOM and state manager to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  init() {
    // Wait for state manager to be available
    const initWithStateManager = () => {
      if (window.selectionStateManager) {
        this.initializeSelectors();
        this.bindStateManagerEvents();
        this.isInitialized = true;
      } else {
        setTimeout(initWithStateManager, 100);
      }
    };
    
    initWithStateManager();
  }
  
  initializeSelectors() {
    // Initialize Investment Model selector
    if (document.getElementById('investment-project-selector')) {
      this.investmentSelector = new MultiSelectDropdown('investment-project-selector', {
        label: 'Select Projects for Analysis',
        placeholder: 'Choose projects to include in investment calculations...',
        onSelectionChange: (selectedIds) => this.handleInvestmentSelectionChange(selectedIds),
        enableSearch: true,
        selectAllOption: true
      });
    }
    
    // Initialize Staffing selector
    if (document.getElementById('staffing-project-selector')) {
      this.staffingSelector = new MultiSelectDropdown('staffing-project-selector', {
        label: 'Select Projects for Staffing Analysis',
        placeholder: 'Choose projects to include in staffing calculations...',
        onSelectionChange: (selectedIds) => this.handleStaffingSelectionChange(selectedIds),
        enableSearch: true,
        selectAllOption: true
      });
    }
    
    // Update selectors with current state
    this.updateSelectorsFromState();
  }
  
  bindStateManagerEvents() {
    // Listen for state changes
    window.selectionStateManager.addEventListener('businessTypeChanged', () => {
      this.updateSelectorsFromState();
    });
    
    window.selectionStateManager.addEventListener('projectTypesChanged', () => {
      this.updateSelectorsFromState();
    });
  }
  
  updateSelectorsFromState() {
    if (!window.selectionStateManager || !this.isInitialized) return;
    
    const businessType = window.selectionStateManager.getBusinessType();
    if (!businessType) {
      // No business type selected, clear selectors
      if (this.investmentSelector) {
        this.investmentSelector.setItems([]);
      }
      if (this.staffingSelector) {
        this.staffingSelector.setItems([]);
      }
      return;
    }
    
    // Get available projects for current business type
    const availableProjects = this.getAvailableProjectsForBusinessType(businessType);
    const selectedProjects = Array.from(window.selectionStateManager.getSelectedProjectTypes());
    
    // Update both selectors
    if (this.investmentSelector) {
      this.investmentSelector.setItems(availableProjects);
      this.investmentSelector.setSelectedItems(selectedProjects);
    }
    
    if (this.staffingSelector) {
      this.staffingSelector.setItems(availableProjects);
      this.staffingSelector.setSelectedItems(selectedProjects);
    }
  }
  
  getAvailableProjectsForBusinessType(businessType) {
    if (!window.projectTypeManager) return [];
    
    try {
      // Get projects by business type from config
      const projectsForType = window.projectTypeManager.getProjectsByBusinessType(businessType) || [];
      
      return projectsForType.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        icon: project.icon,
        disabled: false
      }));
    } catch (error) {
      console.warn('Error getting projects for business type:', error);
      return [];
    }
  }
  
  handleInvestmentSelectionChange(selectedIds) {
    console.log('Investment Model: Project selection changed', selectedIds);
    
    // Update state manager
    if (window.selectionStateManager) {
      // Clear current selections
      const currentSelections = window.selectionStateManager.getSelectedProjectTypes();
      currentSelections.forEach(projectId => {
        window.selectionStateManager.removeProjectType(projectId);
      });
      
      // Add new selections
      selectedIds.forEach(projectId => {
        window.selectionStateManager.addProjectType(projectId);
      });
    }
    
    // Trigger recalculation of investment data
    this.updateInvestmentCalculations(selectedIds);
  }
  
  handleStaffingSelectionChange(selectedIds) {
    console.log('Staffing: Project selection changed', selectedIds);
    
    // Update state manager if this is a different selection than investment
    if (window.selectionStateManager) {
      // For now, keep both selectors in sync
      // In a more advanced implementation, these could be independent
      const currentSelections = window.selectionStateManager.getSelectedProjectTypes();
      const currentArray = Array.from(currentSelections);
      
      // Only update if different
      if (!this.arraysEqual(currentArray.sort(), selectedIds.sort())) {
        // Clear current selections
        currentSelections.forEach(projectId => {
          window.selectionStateManager.removeProjectType(projectId);
        });
        
        // Add new selections
        selectedIds.forEach(projectId => {
          window.selectionStateManager.addProjectType(projectId);
        });
      }
    }
    
    // Trigger recalculation of staffing data
    this.updateStaffingCalculations(selectedIds);
  }
  
  updateInvestmentCalculations(selectedProjectIds) {
    // Trigger investment model updates
    if (typeof updatePnL === 'function') {
      updatePnL();
    }
    if (typeof updateROI === 'function') {
      updateROI();
    }
    if (typeof updateCapExSummary === 'function') {
      updateCapExSummary();
    }
  }
  
  updateStaffingCalculations(selectedProjectIds) {
    // Trigger staffing updates
    if (typeof updateStaffingSummary === 'function') {
      updateStaffingSummary();
    }
  }
  
  arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  
  // Public methods for external use
  getInvestmentSelectedProjects() {
    return this.investmentSelector ? this.investmentSelector.getSelectedItems() : [];
  }
  
  getStaffingSelectedProjects() {
    return this.staffingSelector ? this.staffingSelector.getSelectedItems() : [];
  }
  
  syncSelectors() {
    // Sync both selectors to current state
    this.updateSelectorsFromState();
  }
}

// Initialize the project selector manager
window.projectSelectorManager = new ProjectSelectorManager();