// Generic P&L Configuration System
// This file contains the configuration structure and default templates for different project types

// Configuration schema for a project type
const PROJECT_TYPE_SCHEMA = {
  id: 'string',           // Unique identifier
  name: 'string',         // Display name
  description: 'string',  // Project description
  icon: 'string',         // Icon or emoji
  categories: {
    investment: [],       // Investment cost categories
    revenue: [],          // Revenue stream definitions
    operating: [],        // Operating cost categories
    staffing: []          // Staffing cost categories
  },
  calculations: {
    // Custom calculation overrides if needed
  }
};

// Category definition schema
const CATEGORY_SCHEMA = {
  id: 'string',           // Unique identifier within category type
  name: 'string',         // Display name
  type: 'string',         // 'number', 'percentage', 'currency', 'hours', etc.
  defaultValue: 0,        // Default input value
  min: 0,                 // Minimum allowed value
  max: null,              // Maximum allowed value (null = no limit)
  required: true,         // Whether field is required
  description: 'string',  // Tooltip or help text
  group: 'string',        // Optional grouping for UI organization
  unit: 'string',         // Display unit (€, %, hours, etc.)
  calculation: null       // Optional custom calculation function
};

// Default project type templates
const DEFAULT_PROJECT_TYPES = {
  padel: {
    id: 'padel',
    name: 'Padel Club',
    description: 'Padel court business with rental and coaching services',
    icon: '🏸',
    categories: {
      investment: [
        { id: 'ground', name: 'Ground Cost', type: 'currency', defaultValue: 50000, unit: '€', group: 'Infrastructure' },
        { id: 'structure', name: 'Structure Cost', type: 'currency', defaultValue: 120000, unit: '€', group: 'Infrastructure' },
        { id: 'courts', name: 'Number of Courts', type: 'number', defaultValue: 3, unit: 'courts', group: 'Equipment' },
        { id: 'courtCost', name: 'Per Court Cost', type: 'currency', defaultValue: 18000, unit: '€', group: 'Equipment' },
        { id: 'amenities', name: 'Amenities', type: 'currency', defaultValue: 20000, unit: '€', group: 'Infrastructure' }
      ],
      revenue: [
        { id: 'peakHours', name: 'Peak Hours/Day', type: 'number', defaultValue: 4, min: 0, max: 12, unit: 'hours', group: 'Peak Time' },
        { id: 'peakRate', name: 'Peak Rate', type: 'currency', defaultValue: 40, unit: '€/hour', group: 'Peak Time' },
        { id: 'peakUtil', name: 'Peak Utilization', type: 'percentage', defaultValue: 70, unit: '%', group: 'Peak Time' },
        { id: 'offHours', name: 'Off Hours/Day', type: 'number', defaultValue: 2, min: 0, max: 12, unit: 'hours', group: 'Off-Peak Time' },
        { id: 'offRate', name: 'Off Rate', type: 'currency', defaultValue: 25, unit: '€/hour', group: 'Off-Peak Time' },
        { id: 'offUtil', name: 'Off Utilization', type: 'percentage', defaultValue: 35, unit: '%', group: 'Off-Peak Time' },
        { id: 'days', name: 'Days/Week', type: 'number', defaultValue: 7, min: 1, max: 7, unit: 'days', group: 'Schedule' },
        { id: 'weeks', name: 'Weeks/Year', type: 'number', defaultValue: 52, min: 1, max: 53, unit: 'weeks', group: 'Schedule' }
      ],
      operating: [
        { id: 'utilities', name: 'Utilities/year', type: 'currency', defaultValue: 5000, unit: '€', group: 'Fixed Costs' },
        { id: 'insurance', name: 'Insurance/year', type: 'currency', defaultValue: 2500, unit: '€', group: 'Fixed Costs' },
        { id: 'maintenance', name: 'Maintenance/year', type: 'currency', defaultValue: 3000, unit: '€', group: 'Variable Costs' },
        { id: 'marketing', name: 'Marketing/year', type: 'currency', defaultValue: 4000, unit: '€', group: 'Variable Costs' },
        { id: 'admin', name: 'Admin/year', type: 'currency', defaultValue: 3500, unit: '€', group: 'Fixed Costs' },
        { id: 'cleaning', name: 'Cleaning/year', type: 'currency', defaultValue: 2000, unit: '€', group: 'Variable Costs' },
        { id: 'misc', name: 'Misc/year', type: 'currency', defaultValue: 1000, unit: '€', group: 'Variable Costs' }
      ],
      staffing: [
        { id: 'ftMgr', name: 'Full-time Manager', type: 'number', defaultValue: 1, unit: 'people', group: 'Management' },
        { id: 'ftMgrSal', name: 'FT Mgr Salary', type: 'currency', defaultValue: 35000, unit: '€/year', group: 'Management' },
        { id: 'ftRec', name: 'Full-time Reception', type: 'number', defaultValue: 1, unit: 'people', group: 'Front Office' },
        { id: 'ftRecSal', name: 'FT Rec Salary', type: 'currency', defaultValue: 21000, unit: '€/year', group: 'Front Office' },
        { id: 'ftCoach', name: 'Full-time Coach', type: 'number', defaultValue: 1, unit: 'people', group: 'Coaching' },
        { id: 'ftCoachSal', name: 'FT Coach Salary', type: 'currency', defaultValue: 25000, unit: '€/year', group: 'Coaching' },
        { id: 'ptCoach', name: 'Part-time Coach', type: 'number', defaultValue: 1, unit: 'people', group: 'Coaching' },
        { id: 'ptCoachSal', name: 'PT Coach Salary', type: 'currency', defaultValue: 12000, unit: '€/year', group: 'Coaching' },
        { id: 'addStaff', name: 'Additional Staff', type: 'number', defaultValue: 0, unit: 'people', group: 'Other' },
        { id: 'addStaffSal', name: 'Add Staff Salary', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Other' }
      ]
    }
  },
  
  gym: {
    id: 'gym',
    name: 'Gym/Fitness Center',
    description: 'Fitness facility with membership-based revenue model',
    icon: '💪',
    categories: {
      investment: [
        { id: 'equipment', name: 'Equipment', type: 'currency', defaultValue: 35000, unit: '€', group: 'Equipment' },
        { id: 'flooring', name: 'Flooring', type: 'currency', defaultValue: 8000, unit: '€', group: 'Infrastructure' },
        { id: 'amenities', name: 'Amenities', type: 'currency', defaultValue: 6000, unit: '€', group: 'Infrastructure' }
      ],
      revenue: [
        { id: 'weekMembers', name: 'Weekly Members', type: 'number', defaultValue: 60, unit: 'members', group: 'Memberships' },
        { id: 'weekFee', name: 'Weekly Fee', type: 'currency', defaultValue: 20, unit: '€/week', group: 'Memberships' },
        { id: 'monthMembers', name: 'Monthly Members', type: 'number', defaultValue: 30, unit: 'members', group: 'Memberships' },
        { id: 'monthFee', name: 'Monthly Fee', type: 'currency', defaultValue: 50, unit: '€/month', group: 'Memberships' },
        { id: 'annualMembers', name: 'Annual Members', type: 'number', defaultValue: 12, unit: 'members', group: 'Memberships' },
        { id: 'annualFee', name: 'Annual Fee', type: 'currency', defaultValue: 450, unit: '€/year', group: 'Memberships' },
        { id: 'rampUp', name: 'Apply Ramp-Up', type: 'boolean', defaultValue: false, group: 'Growth' },
        { id: 'rampDuration', name: 'Ramp Duration', type: 'number', defaultValue: 3, min: 0, max: 12, unit: 'months', group: 'Growth' },
        { id: 'rampEffect', name: 'Ramp Effect', type: 'percentage', defaultValue: 40, unit: '%', group: 'Growth' }
      ],
      operating: [
        { id: 'utilities', name: 'Utilities/year', type: 'currency', defaultValue: 2500, unit: '€', group: 'Fixed Costs' },
        { id: 'insurance', name: 'Insurance/year', type: 'currency', defaultValue: 1700, unit: '€', group: 'Fixed Costs' },
        { id: 'maintenance', name: 'Maintenance/year', type: 'currency', defaultValue: 2000, unit: '€', group: 'Variable Costs' },
        { id: 'marketing', name: 'Marketing/year', type: 'currency', defaultValue: 2500, unit: '€', group: 'Variable Costs' },
        { id: 'admin', name: 'Admin/year', type: 'currency', defaultValue: 2100, unit: '€', group: 'Fixed Costs' },
        { id: 'cleaning', name: 'Cleaning/year', type: 'currency', defaultValue: 1200, unit: '€', group: 'Variable Costs' },
        { id: 'misc', name: 'Misc/year', type: 'currency', defaultValue: 800, unit: '€', group: 'Variable Costs' }
      ],
      staffing: [
        { id: 'ftTrainer', name: 'Full-time Trainer', type: 'number', defaultValue: 1, unit: 'people', group: 'Training' },
        { id: 'ftTrainerSal', name: 'FT Trainer Salary', type: 'currency', defaultValue: 22000, unit: '€/year', group: 'Training' },
        { id: 'ptTrainer', name: 'Part-time Trainer', type: 'number', defaultValue: 1, unit: 'people', group: 'Training' },
        { id: 'ptTrainerSal', name: 'PT Trainer Salary', type: 'currency', defaultValue: 9000, unit: '€/year', group: 'Training' },
        { id: 'addStaff', name: 'Additional Staff', type: 'number', defaultValue: 0, unit: 'people', group: 'Other' },
        { id: 'addStaffSal', name: 'Add Staff Salary', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Other' }
      ]
    }
  },

  // Generic business template
  generic: {
    id: 'generic',
    name: 'Generic Business',
    description: 'Customizable business model template',
    icon: '🏢',
    categories: {
      investment: [
        { id: 'equipment', name: 'Equipment', type: 'currency', defaultValue: 0, unit: '€', group: 'Assets' },
        { id: 'infrastructure', name: 'Infrastructure', type: 'currency', defaultValue: 0, unit: '€', group: 'Assets' },
        { id: 'other', name: 'Other Investments', type: 'currency', defaultValue: 0, unit: '€', group: 'Assets' }
      ],
      revenue: [
        { id: 'primaryRevenue', name: 'Primary Revenue', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Income' },
        { id: 'secondaryRevenue', name: 'Secondary Revenue', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Income' }
      ],
      operating: [
        { id: 'utilities', name: 'Utilities', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Fixed Costs' },
        { id: 'insurance', name: 'Insurance', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Fixed Costs' },
        { id: 'maintenance', name: 'Maintenance', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Variable Costs' },
        { id: 'marketing', name: 'Marketing', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Variable Costs' },
        { id: 'other', name: 'Other Costs', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Variable Costs' }
      ],
      staffing: [
        { id: 'management', name: 'Management Staff', type: 'number', defaultValue: 0, unit: 'people', group: 'Staff' },
        { id: 'managementSal', name: 'Management Salary', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Staff' },
        { id: 'operational', name: 'Operational Staff', type: 'number', defaultValue: 0, unit: 'people', group: 'Staff' },
        { id: 'operationalSal', name: 'Operational Salary', type: 'currency', defaultValue: 0, unit: '€/year', group: 'Staff' }
      ]
    }
  }
};

// Configuration management utilities
class ProjectTypeManager {
  constructor() {
    this.customTypes = this.loadCustomTypes();
  }

  // Load custom project types from localStorage
  loadCustomTypes() {
    try {
      const saved = localStorage.getItem('customProjectTypes');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn('Failed to load custom project types:', e);
      return {};
    }
  }

  // Save custom project types to localStorage
  saveCustomTypes() {
    try {
      localStorage.setItem('customProjectTypes', JSON.stringify(this.customTypes));
    } catch (e) {
      console.warn('Failed to save custom project types:', e);
    }
  }

  // Get all available project types (default + custom)
  getAllProjectTypes() {
    return { ...DEFAULT_PROJECT_TYPES, ...this.customTypes };
  }

  // Get a specific project type by ID
  getProjectType(id) {
    const allTypes = this.getAllProjectTypes();
    return allTypes[id] || null;
  }

  // Add or update a custom project type
  setProjectType(id, config) {
    if (DEFAULT_PROJECT_TYPES[id]) {
      throw new Error(`Cannot override default project type: ${id}`);
    }
    
    // Validate configuration
    this.validateProjectTypeConfig(config);
    
    this.customTypes[id] = config;
    this.saveCustomTypes();
  }

  // Delete a custom project type
  deleteProjectType(id) {
    if (DEFAULT_PROJECT_TYPES[id]) {
      throw new Error(`Cannot delete default project type: ${id}`);
    }
    
    delete this.customTypes[id];
    this.saveCustomTypes();
  }

  // Validate project type configuration
  validateProjectTypeConfig(config) {
    if (!config.id || typeof config.id !== 'string') {
      throw new Error('Project type must have a valid ID');
    }
    if (!config.name || typeof config.name !== 'string') {
      throw new Error('Project type must have a valid name');
    }
    if (!config.categories || typeof config.categories !== 'object') {
      throw new Error('Project type must have categories');
    }
    
    // Validate each category
    const requiredCategories = ['investment', 'revenue', 'operating', 'staffing'];
    for (const categoryType of requiredCategories) {
      if (!config.categories[categoryType] || !Array.isArray(config.categories[categoryType])) {
        throw new Error(`Project type must have ${categoryType} category as array`);
      }
    }
  }

  // Create a new project type from template
  createFromTemplate(templateId, newId, newName) {
    const template = this.getProjectType(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    
    const newConfig = JSON.parse(JSON.stringify(template)); // Deep clone
    newConfig.id = newId;
    newConfig.name = newName;
    newConfig.description = `Custom ${newName} based on ${template.name}`;
    
    this.setProjectType(newId, newConfig);
    return newConfig;
  }

  // Export configuration as JSON
  exportConfiguration() {
    return {
      default: DEFAULT_PROJECT_TYPES,
      custom: this.customTypes,
      exportDate: new Date().toISOString()
    };
  }

  // Import configuration from JSON
  importConfiguration(configData) {
    if (configData.custom && typeof configData.custom === 'object') {
      // Validate each custom type before importing
      for (const [id, config] of Object.entries(configData.custom)) {
        try {
          this.validateProjectTypeConfig(config);
        } catch (e) {
          console.warn(`Skipping invalid project type ${id}:`, e.message);
          continue;
        }
      }
      
      this.customTypes = configData.custom;
      this.saveCustomTypes();
    }
  }
}

// Global instance
window.projectTypeManager = new ProjectTypeManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROJECT_TYPE_SCHEMA,
    CATEGORY_SCHEMA,
    DEFAULT_PROJECT_TYPES,
    ProjectTypeManager
  };
}