// Nova Independent Initialization
// Dedicated initialization logic for Nova (Business Analytics) tab
// This operates completely independently from Vista and shared initialization

/**
 * Nova Initialization System
 * 
 * Independent initialization and setup for Nova Business Analytics tab.
 * Ensures Nova operates as its own hub without dependencies on Vista tabs.
 */
class NovaInitializer {
  constructor() {
    this.initialized = false;
    this.retryCount = 0;
    this.maxRetries = 10;
    
    console.log('Nova Initializer created');
  }

  /**
   * Initialize Nova system
   */
  async initialize() {
    if (this.initialized) {
      console.log('Nova already initialized');
      return;
    }

    console.log('Starting Nova initialization...');

    try {
      // Wait for dependencies
      await this.waitForDependencies();
      
      // Initialize Nova state management
      await this.initializeNovaState();
      
      // Initialize Nova UI system
      await this.initializeNovaUI();
      
      // Initialize Nova core functionality
      await this.initializeNovaCore();
      
      // Set up Nova tab integration
      await this.setupNovaTabIntegration();
      
      // Initialize Nova with saved state
      await this.loadNovaInitialState();
      
      this.initialized = true;
      console.log('Nova initialization completed successfully');
      
      // Dispatch Nova ready event
      this.dispatchNovaReadyEvent();
      
    } catch (error) {
      console.error('Nova initialization failed:', error);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying Nova initialization (${this.retryCount}/${this.maxRetries})...`);
        setTimeout(() => this.initialize(), 1000);
      } else {
        console.error('Nova initialization failed after maximum retries');
      }
    }
  }

  /**
   * Wait for required dependencies
   */
  async waitForDependencies() {
    const requiredGlobals = [
      'BUSINESS_TYPE_CATEGORIES',
      'projectTypeManager'
    ];

    const maxWait = 5000; // 5 seconds
    const checkInterval = 100; // 100ms
    let waited = 0;

    return new Promise((resolve, reject) => {
      const checkDependencies = () => {
        const missing = requiredGlobals.filter(global => typeof window[global] === 'undefined');
        
        if (missing.length === 0) {
          console.log('Nova dependencies ready');
          resolve();
        } else if (waited >= maxWait) {
          reject(new Error(`Nova dependencies not available: ${missing.join(', ')}`));
        } else {
          waited += checkInterval;
          setTimeout(checkDependencies, checkInterval);
        }
      };
      
      checkDependencies();
    });
  }

  /**
   * Initialize Nova state management
   */
  async initializeNovaState() {
    if (!window.Nova?.stateManager) {
      throw new Error('Nova state manager not available');
    }
    
    console.log('Nova state management initialized');
  }

  /**
   * Initialize Nova UI system
   */
  async initializeNovaUI() {
    if (!window.Nova?.ui) {
      throw new Error('Nova UI generator not available');
    }
    
    // Generate Nova interface in the business analytics tab
    const businessAnalyticsTab = document.getElementById('business-analytics');
    if (businessAnalyticsTab) {
      window.Nova.ui.generateNovaBusinessTypeSelector('business-analytics');
      console.log('Nova UI interface generated');
    } else {
      throw new Error('Business analytics tab container not found');
    }
  }

  /**
   * Initialize Nova core functionality
   */
  async initializeNovaCore() {
    if (!window.Nova?.core) {
      throw new Error('Nova core not available');
    }
    
    // Nova core initializes itself, just verify it's ready
    console.log('Nova core functionality ready');
  }

  /**
   * Set up Nova tab integration
   */
  async setupNovaTabIntegration() {
    // Replace the default tab behavior for business-analytics
    const businessAnalyticsTab = document.querySelector('button[data-tab="business-analytics"]');
    if (businessAnalyticsTab) {
      // Remove any existing event listeners by cloning and replacing
      const newTab = businessAnalyticsTab.cloneNode(true);
      businessAnalyticsTab.parentNode.replaceChild(newTab, businessAnalyticsTab);
      
      // Add Nova-specific tab behavior
      newTab.addEventListener('click', (e) => {
        e.preventDefault();
        this.showNovaTab();
      });
      
      console.log('Nova tab integration set up');
    }
  }

  /**
   * Show Nova tab with independent behavior
   */
  showNovaTab() {
    // Hide all other tabs
    document.querySelectorAll('.tab-content').forEach(sec => {
      sec.classList.add('hidden');
    });
    
    // Remove active state from all tab buttons
    document.querySelectorAll('nav.tabs button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show Nova tab
    const novaTab = document.getElementById('business-analytics');
    if (novaTab) {
      novaTab.classList.remove('hidden');
    }
    
    // Activate Nova tab button
    const novaTabButton = document.querySelector('button[data-tab="business-analytics"]');
    if (novaTabButton) {
      novaTabButton.classList.add('active');
      novaTabButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    
    console.log('Nova tab activated independently');
  }

  /**
   * Load Nova initial state
   */
  async loadNovaInitialState() {
    // Nova state manager automatically loads saved state
    // Just trigger UI updates if there's existing state
    
    const businessType = window.Nova.stateManager.getBusinessType();
    const selectedProjects = window.Nova.stateManager.getSelectedProjectTypes();
    const activeProject = window.Nova.stateManager.getActiveProject();
    
    if (businessType || selectedProjects.length > 0 || activeProject) {
      console.log('Nova restored saved state:', {
        businessType,
        selectedProjects,
        activeProject
      });
      
      // Trigger UI updates for saved state
      if (businessType) {
        window.Nova.ui.onNovaBusinessTypeChanged({ old: null, new: businessType });
      }
      
      if (selectedProjects.length > 0) {
        window.Nova.ui.onNovaProjectTypesChanged({ selectedProjects });
      }
      
      if (activeProject) {
        window.Nova.ui.onNovaActiveProjectChanged({ old: null, new: activeProject });
      }
    }
  }

  /**
   * Dispatch Nova ready event
   */
  dispatchNovaReadyEvent() {
    const event = new CustomEvent('nova-ready', {
      detail: {
        timestamp: Date.now(),
        version: '1.0.0',
        components: ['state', 'ui', 'core']
      }
    });
    
    document.dispatchEvent(event);
    console.log('Nova ready event dispatched');
  }

  /**
   * Check if Nova is initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Reset Nova system
   */
  async reset() {
    if (window.Nova?.stateManager) {
      window.Nova.stateManager.reset();
    }
    
    if (window.Nova?.ui) {
      window.Nova.ui.resetNovaUI();
    }
    
    console.log('Nova system reset');
  }

  /**
   * Get Nova system status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      retryCount: this.retryCount,
      components: {
        state: !!window.Nova?.stateManager,
        ui: !!window.Nova?.ui,
        core: !!window.Nova?.core
      },
      currentState: window.Nova?.stateManager ? {
        businessType: window.Nova.stateManager.getBusinessType(),
        projectTypes: window.Nova.stateManager.getSelectedProjectTypes(),
        activeProject: window.Nova.stateManager.getActiveProject(),
        currentStep: window.Nova.stateManager.getCurrentStep()
      } : null
    };
  }
}

/**
 * Nova Tab Controller
 * 
 * Independent tab management for Nova to prevent conflicts with Vista
 */
class NovaTabController {
  constructor() {
    this.isNovaActive = false;
  }

  /**
   * Handle Nova tab activation independently
   */
  activateNova() {
    if (this.isNovaActive) return;
    
    console.log('Activating Nova tab independently');
    
    // Use independent show method
    this.showNovaIndependently();
    
    this.isNovaActive = true;
  }

  /**
   * Show Nova tab independently from global tab system
   */
  showNovaIndependently() {
    // Hide all tabs except Nova
    document.querySelectorAll('.tab-content').forEach(section => {
      if (section.id !== 'business-analytics') {
        section.classList.add('hidden');
      }
    });
    
    // Show Nova tab
    const novaTab = document.getElementById('business-analytics');
    if (novaTab) {
      novaTab.classList.remove('hidden');
    }
    
    // Update tab button states
    document.querySelectorAll('nav.tabs button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === 'business-analytics');
    });
  }

  /**
   * Deactivate Nova tab
   */
  deactivateNova() {
    this.isNovaActive = false;
    console.log('Nova tab deactivated');
  }

  /**
   * Check if Nova tab is active
   */
  isActive() {
    return this.isNovaActive;
  }
}

// Create Nova initializer and tab controller instances
window.Nova = window.Nova || {};
window.Nova.initializer = new NovaInitializer();
window.Nova.tabController = new NovaTabController();

// Global Nova initialization function
window.initializeNova = function() {
  return window.Nova.initializer.initialize();
};

// Global Nova tab activation function
window.showNovaTab = function() {
  window.Nova.tabController.activateNova();
};

// Auto-initialize Nova when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all Nova files are loaded
  setTimeout(() => {
    window.initializeNova();
  }, 100);
});

// Listen for other tabs being activated to deactivate Nova
document.addEventListener('click', (e) => {
  if (e.target.matches('nav.tabs button') && e.target.dataset.tab !== 'business-analytics') {
    window.Nova.tabController?.deactivateNova();
  }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NovaInitializer, NovaTabController };
}