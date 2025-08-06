// Dynamic UI Generator for Generic P&L System
// Creates forms and interfaces based on project type configurations

class DynamicUIGenerator {
  constructor() {
    this.activeProjectTypes = new Set();
    this.formData = new Map();
  }

  // Generate the main project type selection interface
  generateProjectTypeSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const allTypes = window.projectTypeManager.getAllProjectTypes();
    
    container.innerHTML = `
      <div class="project-type-selector">
        <h3>Select Project Types</h3>
        <div class="project-type-grid">
          ${Object.values(allTypes).map(type => `
            <div class="project-type-card" data-type-id="${type.id}">
              <div class="project-type-icon">${type.icon || '📊'}</div>
              <h4>${type.name}</h4>
              <p>${type.description}</p>
              <label>
                <input type="checkbox" value="${type.id}" ${this.activeProjectTypes.has(type.id) ? 'checked' : ''}>
                Include in Analysis
              </label>
            </div>
          `).join('')}
        </div>
        <div class="project-type-actions">
          <button type="button" onclick="dynamicUI.createCustomProjectType()">Create Custom Type</button>
          <button type="button" onclick="dynamicUI.importConfiguration()">Import Configuration</button>
          <button type="button" onclick="dynamicUI.exportConfiguration()">Export Configuration</button>
        </div>
      </div>
    `;

    // Add event listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const typeId = e.target.value;
        if (e.target.checked) {
          this.addProjectType(typeId);
        } else {
          this.removeProjectType(typeId);
        }
      });
    });
  }

  // Add a project type to the active list
  addProjectType(typeId) {
    this.activeProjectTypes.add(typeId);
    this.generateProjectTypeTabs();
    
    // Initialize form data if not exists
    if (!this.formData.has(typeId)) {
      const projectType = window.projectTypeManager.getProjectType(typeId);
      this.initializeFormData(typeId, projectType);
    }
    
    this.updateCalculations();
  }

  // Remove a project type from the active list
  removeProjectType(typeId) {
    this.activeProjectTypes.delete(typeId);
    this.generateProjectTypeTabs();
    this.updateCalculations();
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
      }
    }
    
    return breakdownHtml;
  }

  // Update combined P&L analysis
  updateCombinedAnalysis() {
    if (this.activeProjectTypes.size === 0) return;

    const activeTypes = Array.from(this.activeProjectTypes);
    const combined = window.calculationEngine.calculateCombinedPL(activeTypes);
    
    this.updatePnLTab(combined);
    this.updateROITab(combined);
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

    const activeTypes = Array.from(this.activeProjectTypes);
    const cashFlow = window.calculationEngine.generateCashFlow(activeTypes, 12);
    
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