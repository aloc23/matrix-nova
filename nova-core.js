// Nova Core Functionality
// Independent core logic and calculations for Nova (Business Analytics) tab
// This operates completely independently from Vista and shared calculation systems

/**
 * Nova Core System
 * 
 * Independent core functionality for Nova Business Analytics tab.
 * Provides calculation engine, data processing, and business logic
 * without any dependencies on Vista tabs or shared systems.
 */
class NovaCore {
  constructor() {
    this.calculationEngine = new NovaCalculationEngine();
    this.dataProcessor = new NovaDataProcessor();
    
    console.log('Nova Core initialized');
  }

  /**
   * Initialize Nova core system
   */
  initialize() {
    // Initialize Nova calculation engine
    this.calculationEngine.initialize();
    
    // Set up Nova event listeners
    this.initializeNovaEventListeners();
    
    console.log('Nova Core system ready');
  }

  /**
   * Set up Nova-specific event listeners
   */
  initializeNovaEventListeners() {
    if (window.Nova?.stateManager) {
      // Listen for Nova form data changes to trigger recalculations
      window.Nova.stateManager.addEventListener('formDataChanged', (data) => {
        this.handleNovaFormDataChange(data);
      });

      // Listen for Nova project changes
      window.Nova.stateManager.addEventListener('activeProjectChanged', (data) => {
        this.handleNovaProjectChange(data);
      });
    }
  }

  /**
   * Handle Nova form data changes
   */
  handleNovaFormDataChange(data) {
    console.log('Nova Core: Form data changed', data);
    
    // Trigger recalculation for the affected project
    this.calculateProject(data.projectTypeId);
  }

  /**
   * Handle Nova project changes
   */
  handleNovaProjectChange(data) {
    console.log('Nova Core: Project changed', data);
    
    if (data.new) {
      // Load and calculate the new active project
      this.calculateProject(data.new);
    }
  }

  /**
   * Calculate results for a Nova project
   */
  calculateProject(projectTypeId) {
    if (!projectTypeId) return;
    
    const formData = window.Nova.stateManager.getProjectFormData(projectTypeId);
    const projectConfig = window.projectTypeManager?.getProjectType(projectTypeId);
    
    if (!projectConfig) {
      console.warn('Nova Core: No config found for project:', projectTypeId);
      return;
    }
    
    // Process the data and calculate results
    const results = this.calculationEngine.calculate(projectTypeId, formData, projectConfig);
    
    // Update the UI with results
    this.updateNovaResults(projectTypeId, results);
    
    return results;
  }

  /**
   * Update Nova results in the UI
   */
  updateNovaResults(projectTypeId, results) {
    const resultsContainer = document.getElementById(`nova-results-${projectTypeId}`);
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
      <div class="nova-calculation-results">
        <div class="nova-results-header">
          <h4>Nova Analysis Results</h4>
          <button type="button" class="nova-export-btn" onclick="window.Nova.core.exportResults('${projectTypeId}')">
            Export Results
          </button>
        </div>
        
        <div class="nova-results-content">
          ${this.generateNovaResultsHTML(results)}
        </div>
        
        <div class="nova-results-charts">
          ${this.generateNovaChartsHTML(projectTypeId, results)}
        </div>
      </div>
    `;

    // Generate Nova charts
    this.generateNovaCharts(projectTypeId, results);
  }

  /**
   * Generate Nova results HTML
   */
  generateNovaResultsHTML(results) {
    if (!results) return '<p>No results available</p>';

    return `
      <div class="nova-kpi-grid">
        ${Object.entries(results.kpis || {}).map(([key, value]) => `
          <div class="nova-kpi-item">
            <div class="nova-kpi-label">${this.formatLabel(key)}</div>
            <div class="nova-kpi-value ${this.getValueClass(key, value)}">${this.formatValue(key, value)}</div>
          </div>
        `).join('')}
      </div>
      
      ${results.breakdown ? `
        <div class="nova-breakdown-section">
          <h5>Detailed Breakdown</h5>
          <div class="nova-breakdown-grid">
            ${Object.entries(results.breakdown).map(([category, items]) => `
              <div class="nova-breakdown-category">
                <h6>${this.formatLabel(category)}</h6>
                <div class="nova-breakdown-items">
                  ${Object.entries(items).map(([item, value]) => `
                    <div class="nova-breakdown-item">
                      <span class="nova-breakdown-item-label">${this.formatLabel(item)}</span>
                      <span class="nova-breakdown-item-value">${this.formatValue(item, value)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  /**
   * Generate Nova charts HTML placeholders
   */
  generateNovaChartsHTML(projectTypeId, results) {
    return `
      <div class="nova-charts-container">
        <div class="nova-chart-item">
          <canvas id="nova-chart-revenue-${projectTypeId}" width="400" height="200"></canvas>
        </div>
        <div class="nova-chart-item">
          <canvas id="nova-chart-costs-${projectTypeId}" width="400" height="200"></canvas>
        </div>
        <div class="nova-chart-item">
          <canvas id="nova-chart-profit-${projectTypeId}" width="400" height="200"></canvas>
        </div>
      </div>
    `;
  }

  /**
   * Generate Nova charts
   */
  generateNovaCharts(projectTypeId, results) {
    if (!results || !window.Chart) return;

    // Revenue chart
    this.createNovaChart(`nova-chart-revenue-${projectTypeId}`, {
      type: 'line',
      data: {
        labels: results.timeLabels || ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
        datasets: [{
          label: 'Revenue',
          data: results.revenueData || [0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Nova Revenue Trend'
          }
        }
      }
    });

    // Costs chart
    this.createNovaChart(`nova-chart-costs-${projectTypeId}`, {
      type: 'doughnut',
      data: {
        labels: Object.keys(results.breakdown?.costs || {}),
        datasets: [{
          data: Object.values(results.breakdown?.costs || {}),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Nova Cost Breakdown'
          }
        }
      }
    });

    // Profit chart
    this.createNovaChart(`nova-chart-profit-${projectTypeId}`, {
      type: 'bar',
      data: {
        labels: results.timeLabels || ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
        datasets: [{
          label: 'Profit',
          data: results.profitData || [0, 0, 0, 0, 0, 0],
          backgroundColor: results.profitData?.map(value => value >= 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)') || []
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Nova Profit Analysis'
          }
        }
      }
    });
  }

  /**
   * Create Nova chart
   */
  createNovaChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    return new Chart(ctx, config);
  }

  /**
   * Export Nova results
   */
  exportResults(projectTypeId) {
    const formData = window.Nova.stateManager.getProjectFormData(projectTypeId);
    const results = this.calculationEngine.getLastResults(projectTypeId);
    
    if (!results) {
      alert('No results to export. Please calculate first.');
      return;
    }

    const exportData = {
      projectType: projectTypeId,
      timestamp: new Date().toISOString(),
      inputs: formData,
      results: results
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-results-${projectTypeId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Nova results exported:', projectTypeId);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Format label for display
   */
  formatLabel(key) {
    return key.replace(/([A-Z])/g, ' $1')
             .replace(/^./, str => str.toUpperCase())
             .replace(/_/g, ' ');
  }

  /**
   * Format value for display
   */
  formatValue(key, value) {
    if (typeof value !== 'number') return value;

    if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('cost') || 
        key.toLowerCase().includes('profit') || key.toLowerCase().includes('price')) {
      return `€${value.toLocaleString()}`;
    }
    
    if (key.toLowerCase().includes('percent') || key.toLowerCase().includes('rate') || 
        key.toLowerCase().includes('margin')) {
      return `${value.toFixed(2)}%`;
    }
    
    return value.toLocaleString();
  }

  /**
   * Get CSS class for value styling
   */
  getValueClass(key, value) {
    if (typeof value !== 'number') return '';
    
    if (key.toLowerCase().includes('profit') || key.toLowerCase().includes('margin')) {
      return value >= 0 ? 'positive' : 'negative';
    }
    
    return '';
  }
}

/**
 * Nova Calculation Engine
 * 
 * Independent calculation engine for Nova analytics
 */
class NovaCalculationEngine {
  constructor() {
    this.lastResults = new Map();
    this.calculationFormulas = new Map();
    
    // Initialize default calculation formulas
    this.initializeDefaultFormulas();
  }

  /**
   * Initialize calculation engine
   */
  initialize() {
    console.log('Nova Calculation Engine initialized');
  }

  /**
   * Initialize default calculation formulas
   */
  initializeDefaultFormulas() {
    // Basic revenue calculation
    this.calculationFormulas.set('revenue', (data) => {
      const baseRevenue = parseFloat(data.baseRevenue || 0);
      const monthlyGrowth = parseFloat(data.monthlyGrowth || 0) / 100;
      const months = parseInt(data.months || 6);
      
      const revenueData = [];
      for (let i = 0; i < months; i++) {
        revenueData.push(baseRevenue * Math.pow(1 + monthlyGrowth, i));
      }
      
      return {
        total: revenueData.reduce((sum, val) => sum + val, 0),
        monthly: revenueData,
        average: revenueData.reduce((sum, val) => sum + val, 0) / months
      };
    });

    // Basic cost calculation
    this.calculationFormulas.set('costs', (data) => {
      const fixedCosts = parseFloat(data.fixedCosts || 0);
      const variableCosts = parseFloat(data.variableCosts || 0);
      const months = parseInt(data.months || 6);
      
      const costsData = [];
      for (let i = 0; i < months; i++) {
        costsData.push(fixedCosts + variableCosts);
      }
      
      return {
        total: costsData.reduce((sum, val) => sum + val, 0),
        monthly: costsData,
        fixed: fixedCosts * months,
        variable: variableCosts * months,
        breakdown: {
          fixed: fixedCosts * months,
          variable: variableCosts * months
        }
      };
    });
  }

  /**
   * Main calculation method
   */
  calculate(projectTypeId, formData, projectConfig) {
    console.log('Nova Calculation: Starting for project', projectTypeId);

    // Calculate revenue
    const revenue = this.calculationFormulas.get('revenue')(formData);
    
    // Calculate costs
    const costs = this.calculationFormulas.get('costs')(formData);
    
    // Calculate profit
    const profit = {
      total: revenue.total - costs.total,
      monthly: revenue.monthly.map((rev, i) => rev - (costs.monthly[i] || 0)),
      margin: revenue.total > 0 ? ((revenue.total - costs.total) / revenue.total) * 100 : 0
    };

    // Generate time labels
    const months = parseInt(formData.months || 6);
    const timeLabels = Array.from({ length: months }, (_, i) => `Month ${i + 1}`);

    // Build comprehensive results
    const results = {
      kpis: {
        totalRevenue: revenue.total,
        totalCosts: costs.total,
        totalProfit: profit.total,
        profitMargin: profit.margin,
        averageMonthlyRevenue: revenue.average,
        breakEvenPoint: this.calculateBreakEvenPoint(revenue, costs)
      },
      breakdown: {
        revenue: {
          total: revenue.total,
          average: revenue.average
        },
        costs: costs.breakdown || {
          fixed: costs.fixed,
          variable: costs.variable
        }
      },
      timeLabels: timeLabels,
      revenueData: revenue.monthly,
      profitData: profit.monthly,
      calculation: {
        timestamp: new Date().toISOString(),
        projectTypeId: projectTypeId,
        inputs: { ...formData }
      }
    };

    // Store results
    this.lastResults.set(projectTypeId, results);

    console.log('Nova Calculation: Completed for project', projectTypeId, results);
    return results;
  }

  /**
   * Calculate break-even point
   */
  calculateBreakEvenPoint(revenue, costs) {
    // Simple break-even calculation based on monthly data
    let breakEvenMonth = -1;
    let cumulativeProfit = 0;
    
    for (let i = 0; i < revenue.monthly.length; i++) {
      cumulativeProfit += revenue.monthly[i] - costs.monthly[i];
      if (cumulativeProfit >= 0 && breakEvenMonth === -1) {
        breakEvenMonth = i + 1;
        break;
      }
    }
    
    return breakEvenMonth > 0 ? breakEvenMonth : null;
  }

  /**
   * Get last calculation results
   */
  getLastResults(projectTypeId) {
    return this.lastResults.get(projectTypeId);
  }

  /**
   * Add custom calculation formula
   */
  addFormula(name, formula) {
    this.calculationFormulas.set(name, formula);
    console.log('Nova Calculation: Custom formula added:', name);
  }
}

/**
 * Nova Data Processor
 * 
 * Independent data processing for Nova analytics
 */
class NovaDataProcessor {
  constructor() {
    this.dataCache = new Map();
  }

  /**
   * Process Nova form data
   */
  processFormData(projectTypeId, rawData) {
    const processedData = {};
    
    // Convert string values to appropriate types
    Object.entries(rawData).forEach(([key, value]) => {
      if (value === '') {
        processedData[key] = 0;
      } else if (!isNaN(value) && value !== '') {
        processedData[key] = parseFloat(value);
      } else {
        processedData[key] = value;
      }
    });

    // Cache processed data
    this.dataCache.set(projectTypeId, processedData);

    return processedData;
  }

  /**
   * Validate Nova data
   */
  validateData(projectTypeId, data) {
    const errors = [];
    
    // Basic validation rules
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'number' && value < 0 && !key.includes('adjust')) {
        errors.push(`${key} cannot be negative`);
      }
      
      if (typeof value === 'number' && isNaN(value)) {
        errors.push(`${key} must be a valid number`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Get cached data
   */
  getCachedData(projectTypeId) {
    return this.dataCache.get(projectTypeId);
  }
}

// Create Nova Core instance (independent from Vista)
window.Nova = window.Nova || {};
window.Nova.core = new NovaCore();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.Nova.core.initialize();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NovaCore, NovaCalculationEngine, NovaDataProcessor };
}