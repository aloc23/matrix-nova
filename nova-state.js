// Nova Independent State Management
// Dedicated state management for the Nova (Business Analytics) tab only
// This operates completely independently from Vista (other analysis tabs)

/**
 * Nova State Manager
 * 
 * Independent state management for the Nova Business Analytics tab.
 * This class manages only Nova-specific state and has no dependencies
 * on Vista tabs or shared state management.
 */
class NovaStateManager {
  constructor() {
    // Nova-specific state properties
    this.businessType = null;
    this.projectTypes = new Set();
    this.activeProject = null;
    this.formData = new Map();
    this.currentStep = 'business-type'; // 'business-type', 'project-type', 'analysis'
    
    // Event listeners for Nova state changes
    this.listeners = {
      businessTypeChanged: [],
      projectTypesChanged: [],
      activeProjectChanged: [],
      formDataChanged: []
    };
    
    // Load Nova-specific saved state
    this.loadNovaState();
    
    // Debug mode for Nova
    this.debugMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    this.log('Nova State Manager initialized');
  }

  // ==================== BUSINESS TYPE MANAGEMENT ====================

  /**
   * Set Nova business type
   */
  setBusinessType(businessTypeId) {
    if (this.businessType !== businessTypeId) {
      const oldBusinessType = this.businessType;
      this.businessType = businessTypeId;
      
      // Clear project types when business type changes
      this.projectTypes.clear();
      this.activeProject = null;
      this.currentStep = businessTypeId ? 'project-type' : 'business-type';
      
      this.saveNovaState();
      this.notifyListeners('businessTypeChanged', {
        old: oldBusinessType,
        new: businessTypeId
      });
      
      this.log('Nova business type changed:', { old: oldBusinessType, new: businessTypeId });
    }
  }

  /**
   * Get Nova business type
   */
  getBusinessType() {
    return this.businessType;
  }

  // ==================== PROJECT TYPE MANAGEMENT ====================

  /**
   * Add a project type to Nova selection
   */
  addProjectType(projectTypeId) {
    if (!this.projectTypes.has(projectTypeId)) {
      this.projectTypes.add(projectTypeId);
      
      // Set as active if it's the first one
      if (!this.activeProject) {
        this.activeProject = projectTypeId;
      }
      
      this.currentStep = 'analysis';
      this.saveNovaState();
      this.notifyListeners('projectTypesChanged', {
        selectedProjects: Array.from(this.projectTypes),
        added: projectTypeId
      });
      
      this.log('Nova project type added:', projectTypeId);
    }
  }

  /**
   * Remove a project type from Nova selection
   */
  removeProjectType(projectTypeId) {
    if (this.projectTypes.has(projectTypeId)) {
      this.projectTypes.delete(projectTypeId);
      
      // Update active project if needed
      if (this.activeProject === projectTypeId) {
        this.activeProject = this.projectTypes.size > 0 ? 
          Array.from(this.projectTypes)[0] : null;
      }
      
      this.currentStep = this.projectTypes.size > 0 ? 'analysis' : 'project-type';
      this.saveNovaState();
      this.notifyListeners('projectTypesChanged', {
        selectedProjects: Array.from(this.projectTypes),
        removed: projectTypeId
      });
      
      this.log('Nova project type removed:', projectTypeId);
    }
  }

  /**
   * Get Nova selected project types
   */
  getSelectedProjectTypes() {
    return Array.from(this.projectTypes);
  }

  /**
   * Set active project for detailed Nova analysis
   */
  setActiveProject(projectTypeId) {
    if (this.projectTypes.has(projectTypeId) && this.activeProject !== projectTypeId) {
      const oldActiveProject = this.activeProject;
      this.activeProject = projectTypeId;
      
      this.saveNovaState();
      this.notifyListeners('activeProjectChanged', {
        old: oldActiveProject,
        new: projectTypeId
      });
      
      this.log('Nova active project changed:', { old: oldActiveProject, new: projectTypeId });
    }
  }

  /**
   * Get Nova active project
   */
  getActiveProject() {
    return this.activeProject;
  }

  // ==================== FORM DATA MANAGEMENT ====================

  /**
   * Set Nova form data for a specific project type
   */
  setFormData(projectTypeId, fieldId, value) {
    const key = `${projectTypeId}.${fieldId}`;
    const oldValue = this.formData.get(key);
    
    if (oldValue !== value) {
      this.formData.set(key, value);
      this.saveNovaState();
      this.notifyListeners('formDataChanged', {
        projectTypeId,
        fieldId,
        oldValue,
        newValue: value
      });
      
      this.log('Nova form data changed:', { projectTypeId, fieldId, value });
    }
  }

  /**
   * Get Nova form data for a specific project and field
   */
  getFormData(projectTypeId, fieldId) {
    const key = `${projectTypeId}.${fieldId}`;
    return this.formData.get(key);
  }

  /**
   * Get all Nova form data for a project type
   */
  getProjectFormData(projectTypeId) {
    const projectData = {};
    for (const [key, value] of this.formData) {
      if (key.startsWith(`${projectTypeId}.`)) {
        const fieldId = key.substring(projectTypeId.length + 1);
        projectData[fieldId] = value;
      }
    }
    return projectData;
  }

  // ==================== CURRENT STEP MANAGEMENT ====================

  /**
   * Get Nova current step
   */
  getCurrentStep() {
    return this.currentStep;
  }

  /**
   * Set Nova current step
   */
  setCurrentStep(step) {
    if (this.currentStep !== step) {
      const oldStep = this.currentStep;
      this.currentStep = step;
      this.saveNovaState();
      this.log('Nova step changed:', { old: oldStep, new: step });
    }
  }

  // ==================== EVENT MANAGEMENT ====================

  /**
   * Add Nova event listener
   */
  addEventListener(eventType, callback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].push(callback);
      this.log('Nova event listener added:', eventType);
    } else {
      console.warn('Nova: Unknown event type:', eventType);
    }
  }

  /**
   * Remove Nova event listener
   */
  removeEventListener(eventType, callback) {
    if (this.listeners[eventType]) {
      const index = this.listeners[eventType].indexOf(callback);
      if (index > -1) {
        this.listeners[eventType].splice(index, 1);
        this.log('Nova event listener removed:', eventType);
      }
    }
  }

  /**
   * Notify Nova event listeners
   */
  notifyListeners(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Nova event listener error:', error);
        }
      });
    }
  }

  // ==================== PERSISTENCE ====================

  /**
   * Save Nova state to localStorage
   */
  saveNovaState() {
    const state = {
      businessType: this.businessType,
      projectTypes: Array.from(this.projectTypes),
      activeProject: this.activeProject,
      formData: Object.fromEntries(this.formData),
      currentStep: this.currentStep,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('nova_state', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save Nova state:', error);
    }
  }

  /**
   * Load Nova state from localStorage
   */
  loadNovaState() {
    try {
      const saved = localStorage.getItem('nova_state');
      if (saved) {
        const state = JSON.parse(saved);
        
        this.businessType = state.businessType || null;
        this.projectTypes = new Set(state.projectTypes || []);
        this.activeProject = state.activeProject || null;
        this.formData = new Map(Object.entries(state.formData || {}));
        this.currentStep = state.currentStep || 'business-type';
        
        this.log('Nova state loaded from localStorage:', state);
      }
    } catch (error) {
      console.warn('Failed to load Nova state:', error);
    }
  }

  /**
   * Clear Nova state
   */
  clearNovaState() {
    this.businessType = null;
    this.projectTypes.clear();
    this.activeProject = null;
    this.formData.clear();
    this.currentStep = 'business-type';
    
    try {
      localStorage.removeItem('nova_state');
    } catch (error) {
      console.warn('Failed to clear Nova state:', error);
    }
    
    this.log('Nova state cleared');
  }

  // ==================== DEBUG AND UTILITY ====================

  /**
   * Log Nova debug messages
   */
  log(...args) {
    if (this.debugMode) {
      console.log('[Nova State]', ...args);
    }
  }

  /**
   * Export Nova state for debugging
   */
  exportState() {
    return {
      businessType: this.businessType,
      projectTypes: Array.from(this.projectTypes),
      activeProject: this.activeProject,
      formData: Object.fromEntries(this.formData),
      currentStep: this.currentStep
    };
  }

  /**
   * Reset Nova to initial state
   */
  reset() {
    this.clearNovaState();
    this.notifyListeners('businessTypeChanged', { old: null, new: null });
    this.notifyListeners('projectTypesChanged', { selectedProjects: [], removed: null });
    this.notifyListeners('activeProjectChanged', { old: null, new: null });
  }
}

// Create Nova global instance (independent from Vista)
window.Nova = window.Nova || {};
window.Nova.stateManager = new NovaStateManager();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NovaStateManager;
}