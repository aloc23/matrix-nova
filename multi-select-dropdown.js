// Multi-Select Dropdown Component for Business/Project Type Selection
// Creates a dropdown with checkboxes for selecting multiple project types

/**
 * Multi-Select Dropdown Component
 * 
 * Features:
 * - Checkboxes for multiple selection
 * - Search/filter functionality
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Screen reader accessible
 * - Live updates to dependent calculations
 */
class MultiSelectDropdown {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container element with id '${containerId}' not found`);
    }
    
    // Configuration options
    this.options = {
      placeholder: options.placeholder || 'Select projects...',
      searchPlaceholder: options.searchPlaceholder || 'Search projects...',
      maxHeight: options.maxHeight || '300px',
      enableSearch: options.enableSearch !== false,
      selectAllOption: options.selectAllOption !== false,
      onSelectionChange: options.onSelectionChange || (() => {}),
      label: options.label || 'Select Projects',
      ...options
    };
    
    // State
    this.isOpen = false;
    this.selectedItems = new Set();
    this.availableItems = [];
    this.filteredItems = [];
    this.focusedIndex = -1;
    
    // DOM elements (will be created)
    this.dropdown = null;
    this.toggleButton = null;
    this.dropdownList = null;
    this.searchInput = null;
    
    this.init();
  }
  
  init() {
    this.createStructure();
    this.bindEvents();
    this.updateDisplay();
  }
  
  createStructure() {
    this.container.innerHTML = '';
    this.container.className = 'multi-select-container';
    
    // Main structure
    this.container.innerHTML = `
      <div class="multi-select-wrapper">
        <label class="multi-select-label" for="${this.containerId}-toggle">
          ${this.options.label}
        </label>
        <div class="multi-select-dropdown" role="combobox" aria-expanded="false" aria-haspopup="listbox">
          <button type="button" class="multi-select-toggle" id="${this.containerId}-toggle" 
                  aria-label="${this.options.label}">
            <span class="multi-select-selected-text">${this.options.placeholder}</span>
            <span class="multi-select-arrow" aria-hidden="true">▼</span>
          </button>
          <div class="multi-select-dropdown-content" style="max-height: ${this.options.maxHeight}">
            ${this.options.enableSearch ? `
              <div class="multi-select-search">
                <input type="text" class="multi-select-search-input" 
                       placeholder="${this.options.searchPlaceholder}"
                       aria-label="Search projects">
              </div>
            ` : ''}
            <ul class="multi-select-list" role="listbox" aria-multiselectable="true">
              <!-- Items will be populated here -->
            </ul>
          </div>
        </div>
      </div>
    `;
    
    // Get references to created elements
    this.dropdown = this.container.querySelector('.multi-select-dropdown');
    this.toggleButton = this.container.querySelector('.multi-select-toggle');
    this.dropdownList = this.container.querySelector('.multi-select-list');
    this.searchInput = this.container.querySelector('.multi-select-search-input');
    this.selectedText = this.container.querySelector('.multi-select-selected-text');
    this.dropdownContent = this.container.querySelector('.multi-select-dropdown-content');
  }
  
  bindEvents() {
    // Toggle dropdown
    this.toggleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.filterItems(e.target.value);
      });
      
      this.searchInput.addEventListener('keydown', (e) => {
        this.handleKeydown(e);
      });
    }
    
    // Keyboard navigation
    this.toggleButton.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.close();
      }
    });
    
    // Prevent dropdown from closing when clicking inside
    this.dropdownContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  handleKeydown(e) {
    if (!this.isOpen && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      this.open();
      return;
    }
    
    if (!this.isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.close();
        this.toggleButton.focus();
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        this.focusedIndex = Math.min(this.focusedIndex + 1, this.filteredItems.length - 1);
        this.updateFocus();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        this.updateFocus();
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < this.filteredItems.length) {
          const item = this.filteredItems[this.focusedIndex];
          this.toggleSelection(item.id);
        }
        break;
    }
  }
  
  setItems(items) {
    this.availableItems = items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      icon: item.icon || '',
      disabled: item.disabled || false
    }));
    this.filteredItems = [...this.availableItems];
    this.renderItems();
  }
  
  filterItems(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredItems = [...this.availableItems];
    } else {
      this.filteredItems = this.availableItems.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }
    this.focusedIndex = -1;
    this.renderItems();
  }
  
  renderItems() {
    if (!this.dropdownList) return;
    
    this.dropdownList.innerHTML = '';
    
    // Add "Select All" option if enabled
    if (this.options.selectAllOption && this.availableItems.length > 1) {
      const selectAllItem = this.createSelectAllItem();
      this.dropdownList.appendChild(selectAllItem);
    }
    
    // Add filtered items
    this.filteredItems.forEach((item, index) => {
      const listItem = this.createListItem(item, index);
      this.dropdownList.appendChild(listItem);
    });
    
    if (this.filteredItems.length === 0) {
      this.dropdownList.innerHTML = '<li class="multi-select-no-results">No projects found</li>';
    }
  }
  
  createSelectAllItem() {
    const allSelected = this.availableItems.length > 0 && 
                       this.availableItems.every(item => this.selectedItems.has(item.id));
    const someSelected = this.availableItems.some(item => this.selectedItems.has(item.id));
    
    const li = document.createElement('li');
    li.className = 'multi-select-item multi-select-select-all';
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', allSelected ? 'true' : 'false');
    
    li.innerHTML = `
      <label class="multi-select-checkbox-label">
        <input type="checkbox" ${allSelected ? 'checked' : ''} 
               ${someSelected && !allSelected ? 'data-indeterminate="true"' : ''}>
        <span class="multi-select-checkbox-text">Select All</span>
      </label>
    `;
    
    const checkbox = li.querySelector('input[type="checkbox"]');
    if (someSelected && !allSelected) {
      checkbox.indeterminate = true;
    }
    
    li.addEventListener('click', () => {
      if (allSelected) {
        this.clearSelection();
      } else {
        this.selectAll();
      }
    });
    
    return li;
  }
  
  createListItem(item, index) {
    const isSelected = this.selectedItems.has(item.id);
    
    const li = document.createElement('li');
    li.className = `multi-select-item ${item.disabled ? 'disabled' : ''}`;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    li.setAttribute('data-item-id', item.id);
    li.setAttribute('data-index', index);
    
    li.innerHTML = `
      <label class="multi-select-checkbox-label">
        <input type="checkbox" ${isSelected ? 'checked' : ''} ${item.disabled ? 'disabled' : ''}>
        <span class="multi-select-item-content">
          ${item.icon ? `<span class="multi-select-item-icon">${item.icon}</span>` : ''}
          <span class="multi-select-item-text">
            <span class="multi-select-item-name">${item.name}</span>
            ${item.description ? `<span class="multi-select-item-description">${item.description}</span>` : ''}
          </span>
        </span>
      </label>
    `;
    
    if (!item.disabled) {
      li.addEventListener('click', () => {
        this.toggleSelection(item.id);
      });
    }
    
    return li;
  }
  
  toggleSelection(itemId) {
    if (this.selectedItems.has(itemId)) {
      this.selectedItems.delete(itemId);
    } else {
      this.selectedItems.add(itemId);
    }
    
    this.updateDisplay();
    this.renderItems(); // Re-render to update checkboxes
    this.options.onSelectionChange(Array.from(this.selectedItems));
  }
  
  selectAll() {
    this.availableItems.forEach(item => {
      if (!item.disabled) {
        this.selectedItems.add(item.id);
      }
    });
    this.updateDisplay();
    this.renderItems();
    this.options.onSelectionChange(Array.from(this.selectedItems));
  }
  
  clearSelection() {
    this.selectedItems.clear();
    this.updateDisplay();
    this.renderItems();
    this.options.onSelectionChange(Array.from(this.selectedItems));
  }
  
  setSelectedItems(itemIds) {
    this.selectedItems = new Set(itemIds);
    this.updateDisplay();
    this.renderItems();
  }
  
  getSelectedItems() {
    return Array.from(this.selectedItems);
  }
  
  updateDisplay() {
    const selectedCount = this.selectedItems.size;
    
    if (selectedCount === 0) {
      this.selectedText.textContent = this.options.placeholder;
      this.selectedText.className = 'multi-select-selected-text placeholder';
    } else if (selectedCount === 1) {
      const selectedItem = this.availableItems.find(item => this.selectedItems.has(item.id));
      this.selectedText.textContent = selectedItem ? selectedItem.name : '1 project selected';
      this.selectedText.className = 'multi-select-selected-text';
    } else {
      this.selectedText.textContent = `${selectedCount} projects selected`;
      this.selectedText.className = 'multi-select-selected-text';
    }
  }
  
  updateFocus() {
    // Remove previous focus
    this.dropdownList.querySelectorAll('.multi-select-item').forEach(item => {
      item.classList.remove('focused');
    });
    
    // Add focus to current item
    if (this.focusedIndex >= 0) {
      const items = this.dropdownList.querySelectorAll('.multi-select-item:not(.multi-select-select-all)');
      if (items[this.focusedIndex]) {
        items[this.focusedIndex].classList.add('focused');
        items[this.focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }
  
  open() {
    this.isOpen = true;
    this.dropdown.classList.add('open');
    this.dropdown.setAttribute('aria-expanded', 'true');
    this.focusedIndex = -1;
    
    // Focus search input if available
    if (this.searchInput) {
      setTimeout(() => this.searchInput.focus(), 0);
    }
  }
  
  close() {
    this.isOpen = false;
    this.dropdown.classList.remove('open');
    this.dropdown.setAttribute('aria-expanded', 'false');
    this.focusedIndex = -1;
    
    // Clear search
    if (this.searchInput) {
      this.searchInput.value = '';
      this.filterItems('');
    }
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  destroy() {
    // Remove event listeners and clean up
    this.container.innerHTML = '';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MultiSelectDropdown;
} else {
  window.MultiSelectDropdown = MultiSelectDropdown;
}