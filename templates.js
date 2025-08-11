// HTML Template Functions for Matrix Nova
// These functions generate reusable HTML components to reduce duplication

/**
 * Creates a collapsible section with toggle button and content area
 * @param {string} title - The title displayed on the toggle button
 * @param {string} contentId - The ID for the collapsible content area
 * @param {string} content - The HTML content inside the collapsible area
 * @param {boolean} expanded - Whether the section should be expanded by default
 * @returns {string} HTML string for the collapsible section
 */
function createCollapsibleSection(title, contentId, content, expanded = true) {
  return `
    <div class="collapsible-section">
      <button type="button" class="collapsible-toggle" aria-expanded="${expanded}" aria-controls="${contentId}">
        ${title}
      </button>
      <div class="collapsible-content" id="${contentId}">
        ${content}
      </div>
    </div>
  `;
}

/**
 * Creates a chart container with canvas element
 * @param {string} chartId - The ID for the canvas element
 * @param {string} height - The height attribute for the canvas (default: '180')
 * @returns {string} HTML string for the chart container
 */
function createChartContainer(chartId, height = '180') {
  return `<div class="chart-container"><canvas id="${chartId}" height="${height}"></canvas></div>`;
}

/**
 * Creates a charts grid container with multiple chart containers
 * @param {Array} charts - Array of {chartId, height} objects
 * @returns {string} HTML string for the charts grid
 */
function createChartsGrid(charts) {
  const chartContainers = charts.map(chart => 
    createChartContainer(chart.chartId, chart.height || '180')
  ).join('');
  
  return `<div class="charts-grid">${chartContainers}</div>`;
}

/**
 * Creates a breakdown table with headers and tbody
 * @param {string} tableId - The ID for the table element
 * @param {Array} headers - Array of header strings
 * @param {string} bodyId - The ID for the tbody element (optional)
 * @returns {string} HTML string for the breakdown table
 */
function createBreakdownTable(tableId, headers, bodyId = null) {
  const theadContent = headers.map(header => `<th>${header}</th>`).join('');
  const tbodyId = bodyId ? ` id="${bodyId}"` : '';
  
  return `
    <table class="breakdown-table" id="${tableId}">
      <thead>
        <tr>
          ${theadContent}
        </tr>
      </thead>
      <tbody${tbodyId}>
        <!-- JS fills rows here -->
      </tbody>
    </table>
  `;
}

/**
 * Creates a form group section with title and input fields
 * @param {string} title - The section title
 * @param {Array} inputs - Array of input objects {label, id, type, value, attributes}
 * @returns {string} HTML string for the form group
 */
function createFormGroup(title, inputs) {
  const inputElements = inputs.map(input => {
    const attributes = input.attributes ? ` ${input.attributes}` : '';
    const value = input.value !== undefined ? ` value="${input.value}"` : '';
    
    return `
      <label>${input.label}: 
        <input id="${input.id}" type="${input.type}"${value}${attributes}>
      </label>
    `;
  }).join('');
  
  return `
    <div class="section-group">
      <h3>${title}</h3>
      ${inputElements}
    </div>
  `;
}

/**
 * Creates a slider input with value display
 * @param {string} label - The label text
 * @param {string} id - The input ID
 * @param {Object} config - Configuration {min, max, value, step, unit, oninput}
 * @returns {string} HTML string for the slider input
 */
function createSliderInput(label, id, config) {
  const {min = 0, max = 100, value = 50, step = 1, unit = '', oninput = ''} = config;
  const valueDisplayId = id.replace(/([A-Z])/g, c => c.toLowerCase()) + 'Val';
  const labelId = id.replace(/([A-Z])/g, c => c.toLowerCase()) + 'Label';
  
  const sliderOninput = oninput || `${valueDisplayId}.value=this.value; calculate${capitalize(id.replace(/[A-Z].*/, ''))}()`;
  const inputOninput = oninput || `${id}.value=this.value; calculate${capitalize(id.replace(/[A-Z].*/, ''))}()`;
  
  return `
    <label>
      ${label}:
      <input id="${id}" type="range" min="${min}" max="${max}" value="${value}" step="${step}" 
             oninput="${sliderOninput}">
      <input id="${valueDisplayId}" type="number" min="${min}" max="${max}" value="${value}" step="${step}" 
             oninput="${inputOninput}">
    </label>
  `;
}

/**
 * Creates a section group with title and content
 * @param {string} title - The section title
 * @param {string} content - The HTML content
 * @returns {string} HTML string for the section group
 */
function createSectionGroup(title, content) {
  return `
    <div class="section-group">
      <h3>${title}</h3>
      ${content}
    </div>
  `;
}

/**
 * Creates a tab header with title and action buttons
 * @param {string} title - The main title
 * @param {Array} actions - Array of action button objects {class, onclick, title, text}
 * @returns {string} HTML string for the tab header
 */
function createTabHeader(title, actions = []) {
  const actionButtons = actions.map(action => `
    <button type="button" class="${action.class}" onclick="${action.onclick}" title="${action.title}">
      ${action.text}
    </button>
  `).join('');
  
  return `
    <div class="tab-header">
      <h2>${title}</h2>
      <div class="tab-actions">
        ${actionButtons}
      </div>
    </div>
  `;
}

/**
 * Creates a collapsible section containing multiple charts
 * @param {string} title - The section title
 * @param {string} contentId - The ID for the collapsible content area
 * @param {Array} charts - Array of chart objects {chartId, height}
 * @param {boolean} expanded - Whether the section should be expanded by default
 * @returns {string} HTML string for the collapsible charts section
 */
function createCollapsibleCharts(title, contentId, charts, expanded = true) {
  const chartsContent = createChartsGrid(charts);
  return createCollapsibleSection(title, contentId, chartsContent, expanded);
}

/**
 * Creates a collapsible section containing a chart
 * @param {string} title - The section title
 * @param {string} contentId - The ID for the collapsible content area
 * @param {string} chartId - The ID for the chart canvas
 * @param {string} height - The height of the chart canvas
 * @param {boolean} expanded - Whether the section should be expanded by default
 * @returns {string} HTML string for the collapsible chart section
 */
function createCollapsibleChart(title, contentId, chartId, height = '180', expanded = true) {
  const chartContent = createChartContainer(chartId, height);
  return createCollapsibleSection(title, contentId, chartContent, expanded);
}

/**
 * Creates a collapsible section containing a breakdown table
 * @param {string} title - The section title
 * @param {string} contentId - The ID for the collapsible content area
 * @param {string} tableId - The ID for the table element
 * @param {Array} headers - Array of header strings for the table
 * @param {boolean} expanded - Whether the section should be expanded by default
 * @returns {string} HTML string for the collapsible table section
 */
function createCollapsibleTable(title, contentId, tableId, headers, expanded = true) {
  const tableContent = createBreakdownTable(tableId, headers);
  return createCollapsibleSection(title, contentId, tableContent, expanded);
}

/**
 * Helper function to capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) { 
  return str.charAt(0).toUpperCase() + str.slice(1); 
}