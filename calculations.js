// Generic P&L Calculation Engine
// This file contains the resource-agnostic calculation logic for any project type

class PLCalculationEngine {
  constructor() {
    this.projectTypes = new Map();
    this.calculations = new Map();
  }

  // Register a project type with its data
  registerProjectType(typeId, data) {
    this.projectTypes.set(typeId, data);
    this.calculations.set(typeId, this.calculateProjectPL(typeId, data));
    return this.calculations.get(typeId);
  }

  // Get calculation results for a project type
  getCalculation(typeId) {
    return this.calculations.get(typeId) || null;
  }

  // Calculate P&L for any project type
  calculateProjectPL(typeId, data) {
    const projectType = window.projectTypeManager.getProjectType(typeId);
    if (!projectType) {
      throw new Error(`Unknown project type: ${typeId}`);
    }

    const results = {
      typeId,
      typeName: projectType.name,
      formData: data, // Store form data for KPI calculations
      revenue: this.calculateRevenue(projectType, data),
      costs: this.calculateCosts(projectType, data),
      investment: this.calculateInvestment(projectType, data),
      breakdown: {
        revenue: this.calculateRevenueBreakdown(projectType, data),
        costs: this.calculateCostBreakdown(projectType, data),
        staffing: this.calculateStaffingBreakdown(projectType, data)
      }
    };

    results.profit = results.revenue.annual - results.costs.annual;
    results.monthlyProfit = results.profit / 12;
    results.roi = this.calculateROI(results);

    return results;
  }

  // Calculate total revenue based on project type configuration
  calculateRevenue(projectType, data) {
    const revenueConfig = projectType.categories.revenue;
    let annualRevenue = 0;

    // Handle different revenue calculation patterns
    if (projectType.id === 'padel') {
      annualRevenue = this.calculatePadelRevenue(revenueConfig, data);
    } else if (projectType.id === 'gym') {
      annualRevenue = this.calculateGymRevenue(revenueConfig, data);
    } else if (projectType.id === 'conference') {
      annualRevenue = this.calculateEventRevenue(revenueConfig, data);
    } else if (projectType.id === 'saas') {
      annualRevenue = this.calculateSaaSRevenue(revenueConfig, data);
    } else if (projectType.id === 'ecommerce') {
      annualRevenue = this.calculateEcommerceRevenue(revenueConfig, data);
    } else if (projectType.id === 'consulting') {
      annualRevenue = this.calculateConsultingRevenue(revenueConfig, data);
    } else if (projectType.id === 'workshop') {
      annualRevenue = this.calculateEducationRevenue(revenueConfig, data);
    } else if (projectType.id === 'carRental') {
      annualRevenue = this.calculateRentalRevenue(revenueConfig, data);
    } else if (projectType.id === 'couponPlatform') {
      annualRevenue = this.calculatePromotionRevenue(revenueConfig, data);
    } else {
      // Generic revenue calculation - sum all revenue fields
      annualRevenue = this.calculateGenericRevenue(revenueConfig, data);
    }

    return {
      annual: annualRevenue,
      monthly: annualRevenue / 12,
      daily: annualRevenue / 365
    };
  }

  // Padel-specific revenue calculation
  calculatePadelRevenue(config, data) {
    const peakHours = this.getValue(data, 'peakHours', 0);
    const peakRate = this.getValue(data, 'peakRate', 0);
    const peakUtil = this.getValue(data, 'peakUtil', 0) / 100;
    const offHours = this.getValue(data, 'offHours', 0);
    const offRate = this.getValue(data, 'offRate', 0);
    const offUtil = this.getValue(data, 'offUtil', 0) / 100;
    const courts = this.getValue(data, 'courts', 1);
    const days = this.getValue(data, 'days', 7);
    const weeks = this.getValue(data, 'weeks', 52);

    const peakRevenue = peakHours * peakRate * days * weeks * courts * peakUtil;
    const offRevenue = offHours * offRate * days * weeks * courts * offUtil;

    return peakRevenue + offRevenue;
  }

  // Gym-specific revenue calculation
  calculateGymRevenue(config, data) {
    const weeklyRevenue = this.getValue(data, 'weekMembers', 0) * this.getValue(data, 'weekFee', 0) * 52;
    const monthlyRevenue = this.getValue(data, 'monthMembers', 0) * this.getValue(data, 'monthFee', 0) * 12;
    const annualRevenue = this.getValue(data, 'annualMembers', 0) * this.getValue(data, 'annualFee', 0);
    
    let totalRevenue = weeklyRevenue + monthlyRevenue + annualRevenue;

    // Apply ramp-up if enabled
    if (this.getValue(data, 'rampUp', false)) {
      const rampDuration = this.getValue(data, 'rampDuration', 0);
      const rampEffect = this.getValue(data, 'rampEffect', 100) / 100;
      
      const monthlyBase = totalRevenue / 12;
      let adjustedRevenue = 0;
      
      for (let month = 1; month <= 12; month++) {
        if (month <= rampDuration) {
          adjustedRevenue += monthlyBase * rampEffect;
        } else {
          adjustedRevenue += monthlyBase;
        }
      }
      
      totalRevenue = adjustedRevenue;
    }

    return totalRevenue;
  }

  // Generic revenue calculation for custom project types
  calculateGenericRevenue(config, data) {
    let totalRevenue = 0;
    
    for (const field of config) {
      if (field.type === 'currency' && field.id.toLowerCase().includes('revenue')) {
        totalRevenue += this.getValue(data, field.id, field.defaultValue || 0);
      }
    }
    
    return totalRevenue;
  }

  // Event-specific revenue calculation (conferences, workshops)
  calculateEventRevenue(config, data) {
    const capacity = this.getValue(data, 'capacity', 0);
    const ticketPrice = this.getValue(data, 'ticketPrice', 0);
    const occupancyRate = this.getValue(data, 'occupancyRate', 100) / 100;
    const eventsPerYear = this.getValue(data, 'eventsPerYear', 1);
    const sponsorship = this.getValue(data, 'sponsorship', 0);
    
    const ticketRevenue = capacity * ticketPrice * occupancyRate * eventsPerYear;
    
    return ticketRevenue + sponsorship;
  }

  // SaaS-specific revenue calculation
  calculateSaaSRevenue(config, data) {
    const basicUsers = this.getValue(data, 'basicUsers', 0);
    const basicPrice = this.getValue(data, 'basicPrice', 0);
    const proUsers = this.getValue(data, 'proUsers', 0);
    const proPrice = this.getValue(data, 'proPrice', 0);
    const churnRate = this.getValue(data, 'churnRate', 0) / 100;
    const growthRate = this.getValue(data, 'growthRate', 0) / 100;
    
    // Basic calculation: assume average throughout the year
    // This could be enhanced with month-by-month projections
    const avgBasicUsers = basicUsers * (1 - churnRate / 2); // Simple approximation
    const avgProUsers = proUsers * (1 - churnRate / 2);
    
    const monthlyRevenue = (avgBasicUsers * basicPrice) + (avgProUsers * proPrice);
    
    return monthlyRevenue * 12;
  }

  // E-commerce revenue calculation
  calculateEcommerceRevenue(config, data) {
    const avgOrderValue = this.getValue(data, 'avgOrderValue', 0);
    const ordersPerMonth = this.getValue(data, 'ordersPerMonth', 0);
    const grossMargin = this.getValue(data, 'grossMargin', 100) / 100; // Apply margin
    const returnRate = this.getValue(data, 'returnRate', 0) / 100;
    
    const grossRevenue = avgOrderValue * ordersPerMonth * 12;
    const netRevenue = grossRevenue * (1 - returnRate) * grossMargin;
    
    return netRevenue;
  }

  // Consulting revenue calculation
  calculateConsultingRevenue(config, data) {
    const hourlyRate = this.getValue(data, 'hourlyRate', 0);
    const billableHours = this.getValue(data, 'billableHours', 0);
    const utilizationRate = this.getValue(data, 'utilizationRate', 100) / 100;
    const weeksPerYear = this.getValue(data, 'weeksPerYear', 50);
    
    const totalBillableHours = billableHours * weeksPerYear * utilizationRate;
    
    return totalBillableHours * hourlyRate;
  }

  // Education-specific revenue calculation (workshops, courses)
  calculateEducationRevenue(config, data) {
    const studentCapacity = this.getValue(data, 'studentCapacity', 0);
    const tuitionFee = this.getValue(data, 'tuitionFee', 0);
    const sessionsPerYear = this.getValue(data, 'sessionsPerYear', 1);
    const occupancyRate = this.getValue(data, 'occupancyRate', 100) / 100;
    
    return studentCapacity * tuitionFee * sessionsPerYear * occupancyRate;
  }

  // Rental-specific revenue calculation
  calculateRentalRevenue(config, data) {
    const vehicles = this.getValue(data, 'vehicles', 0);
    const dailyRate = this.getValue(data, 'dailyRate', 0);
    const utilizationRate = this.getValue(data, 'utilizationRate', 100) / 100;
    const averageRental = this.getValue(data, 'averageRental', 1);
    
    // Calculate annual rental days
    const totalPossibleDays = vehicles * 365;
    const utilizedDays = totalPossibleDays * utilizationRate;
    
    return utilizedDays * dailyRate;
  }

  // Promotion-specific revenue calculation (coupon platforms)
  calculatePromotionRevenue(config, data) {
    const merchants = this.getValue(data, 'merchants', 0);
    const avgDealValue = this.getValue(data, 'avgDealValue', 0);
    const dealsPerMonth = this.getValue(data, 'dealsPerMonth', 0);
    const commission = this.getValue(data, 'commission', 0) / 100;
    const redemptionRate = this.getValue(data, 'redemptionRate', 100) / 100;
    
    const monthlyDeals = merchants * dealsPerMonth;
    const redeemedDeals = monthlyDeals * redemptionRate;
    const monthlyRevenue = redeemedDeals * avgDealValue * commission;
    
    return monthlyRevenue * 12;
  }

  // Calculate total costs (operating + staffing)
  calculateCosts(projectType, data) {
    const operatingCosts = this.calculateOperatingCosts(projectType.categories.operating, data);
    const staffingCosts = this.calculateStaffingCosts(projectType.categories.staffing, data);
    
    const totalAnnual = operatingCosts + staffingCosts;
    
    return {
      annual: totalAnnual,
      monthly: totalAnnual / 12,
      operating: operatingCosts,
      staffing: staffingCosts
    };
  }

  // Calculate operating costs
  calculateOperatingCosts(operatingConfig, data) {
    let totalCosts = 0;
    
    for (const field of operatingConfig) {
      if (field.type === 'currency') {
        let cost = this.getValue(data, field.id, field.defaultValue || 0);
        
        // Handle per-event costs for event-based businesses
        if (field.id.includes('event') && data.eventsPerYear) {
          cost *= this.getValue(data, 'eventsPerYear', 1);
        }
        
        totalCosts += cost;
      }
    }
    
    return totalCosts;
  }

  // Calculate staffing costs
  calculateStaffingCosts(staffingConfig, data) {
    let totalCosts = 0;
    
    // Group staffing fields by role (assuming pairs: count + salary)
    const roles = new Map();
    
    for (const field of staffingConfig) {
      const baseName = field.id.replace(/Sal$/, ''); // Remove 'Sal' suffix if present
      
      if (!roles.has(baseName)) {
        roles.set(baseName, { count: 0, salary: 0 });
      }
      
      if (field.id.endsWith('Sal') || field.id.includes('Salary')) {
        let salary = this.getValue(data, field.id, field.defaultValue || 0);
        
        // Handle per-event costs for speakers and support staff
        if (field.id.includes('event') && data.eventsPerYear) {
          salary *= this.getValue(data, 'eventsPerYear', 1);
        }
        
        roles.get(baseName).salary = salary;
      } else if (field.type === 'number') {
        roles.get(baseName).count = this.getValue(data, field.id, field.defaultValue || 0);
      }
    }
    
    // Calculate total staffing costs
    for (const [roleName, role] of roles) {
      totalCosts += role.count * role.salary;
    }
    
    return totalCosts;
  }

  // Calculate total investment
  calculateInvestment(projectType, data) {
    let totalInvestment = 0;
    
    for (const field of projectType.categories.investment) {
      if (field.type === 'currency') {
        let value = this.getValue(data, field.id, field.defaultValue || 0);
        
        // Handle special cases like courts calculation
        if (field.id === 'courtCost' && data.courts) {
          value *= this.getValue(data, 'courts', 1);
        }
        
        totalInvestment += value;
      }
    }
    
    return totalInvestment;
  }

  // Calculate ROI metrics
  calculateROI(results) {
    const investment = results.investment;
    const annualProfit = results.profit;
    
    if (investment <= 0) {
      return {
        paybackYears: Infinity,
        roiPercentage: 0,
        breakEvenMonth: Infinity
      };
    }
    
    const paybackYears = annualProfit > 0 ? Math.ceil(investment / annualProfit) : Infinity;
    const roiPercentage = (annualProfit / investment) * 100;
    const breakEvenMonth = annualProfit > 0 ? Math.ceil(investment / (annualProfit / 12)) : Infinity;
    
    return {
      paybackYears,
      roiPercentage,
      breakEvenMonth,
      investment,
      annualProfit
    };
  }

  // Calculate detailed revenue breakdown
  calculateRevenueBreakdown(projectType, data) {
    const breakdown = {};
    
    if (projectType.id === 'padel') {
      const courts = this.getValue(data, 'courts', 1);
      const days = this.getValue(data, 'days', 7);
      const weeks = this.getValue(data, 'weeks', 52);
      
      breakdown.peak = {
        hours: this.getValue(data, 'peakHours', 0),
        rate: this.getValue(data, 'peakRate', 0),
        utilization: this.getValue(data, 'peakUtil', 0),
        totalHours: this.getValue(data, 'peakHours', 0) * days * weeks,
        utilizedHours: this.getValue(data, 'peakHours', 0) * days * weeks * (this.getValue(data, 'peakUtil', 0) / 100),
        revenue: this.getValue(data, 'peakHours', 0) * this.getValue(data, 'peakRate', 0) * days * weeks * courts * (this.getValue(data, 'peakUtil', 0) / 100)
      };
      
      breakdown.offPeak = {
        hours: this.getValue(data, 'offHours', 0),
        rate: this.getValue(data, 'offRate', 0),
        utilization: this.getValue(data, 'offUtil', 0),
        totalHours: this.getValue(data, 'offHours', 0) * days * weeks,
        utilizedHours: this.getValue(data, 'offHours', 0) * days * weeks * (this.getValue(data, 'offUtil', 0) / 100),
        revenue: this.getValue(data, 'offHours', 0) * this.getValue(data, 'offRate', 0) * days * weeks * courts * (this.getValue(data, 'offUtil', 0) / 100)
      };
    } else if (projectType.id === 'gym') {
      breakdown.memberships = {
        weekly: {
          members: this.getValue(data, 'weekMembers', 0),
          fee: this.getValue(data, 'weekFee', 0),
          revenue: this.getValue(data, 'weekMembers', 0) * this.getValue(data, 'weekFee', 0) * 52
        },
        monthly: {
          members: this.getValue(data, 'monthMembers', 0),
          fee: this.getValue(data, 'monthFee', 0),
          revenue: this.getValue(data, 'monthMembers', 0) * this.getValue(data, 'monthFee', 0) * 12
        },
        annual: {
          members: this.getValue(data, 'annualMembers', 0),
          fee: this.getValue(data, 'annualFee', 0),
          revenue: this.getValue(data, 'annualMembers', 0) * this.getValue(data, 'annualFee', 0)
        }
      };
    }
    
    return breakdown;
  }

  // Calculate cost breakdown by category
  calculateCostBreakdown(projectType, data) {
    const breakdown = {
      operating: {},
      groups: {}
    };
    
    // Group operating costs
    for (const field of projectType.categories.operating) {
      const group = field.group || 'Other';
      if (!breakdown.groups[group]) {
        breakdown.groups[group] = 0;
      }
      
      const value = this.getValue(data, field.id, field.defaultValue || 0);
      breakdown.operating[field.id] = {
        name: field.name,
        value: value,
        group: group
      };
      breakdown.groups[group] += value;
    }
    
    return breakdown;
  }

  // Calculate staffing breakdown
  calculateStaffingBreakdown(projectType, data) {
    const breakdown = {
      roles: {},
      groups: {}
    };
    
    // Group staffing by roles
    const roles = new Map();
    
    for (const field of projectType.categories.staffing) {
      const baseName = field.id.replace(/Sal$/, '');
      const group = field.group || 'Staff';
      
      if (!roles.has(baseName)) {
        roles.set(baseName, { count: 0, salary: 0, group: group, name: '' });
      }
      
      if (field.id.endsWith('Sal') || field.id.includes('Salary')) {
        roles.get(baseName).salary = this.getValue(data, field.id, field.defaultValue || 0);
        roles.get(baseName).name = field.name.replace(' Salary', '');
      } else if (field.type === 'number') {
        roles.get(baseName).count = this.getValue(data, field.id, field.defaultValue || 0);
        if (!roles.get(baseName).name) {
          roles.get(baseName).name = field.name;
        }
      }
    }
    
    // Calculate totals by group
    for (const [roleName, role] of roles) {
      const totalCost = role.count * role.salary;
      
      breakdown.roles[roleName] = {
        name: role.name,
        count: role.count,
        salary: role.salary,
        totalCost: totalCost,
        group: role.group
      };
      
      if (!breakdown.groups[role.group]) {
        breakdown.groups[role.group] = 0;
      }
      breakdown.groups[role.group] += totalCost;
    }
    
    return breakdown;
  }

  // Helper to safely get value from data with fallback
  getValue(data, key, defaultValue = 0) {
    if (data && data.hasOwnProperty(key)) {
      const value = data[key];
      return typeof value === 'number' ? value : (parseFloat(value) || defaultValue);
    }
    return defaultValue;
  }

  // Calculate combined P&L for multiple project types
  calculateCombinedPL(projectTypeIds, adjustments = {}) {
    const projects = [];
    let totalRevenue = 0;
    let totalCosts = 0;
    let totalInvestment = 0;
    
    for (const typeId of projectTypeIds) {
      const calculation = this.getCalculation(typeId);
      if (calculation) {
        // Apply adjustments if provided
        const revAdjust = adjustments.revenue || 1;
        const costAdjust = adjustments.costs || 1;
        
        const adjustedRevenue = calculation.revenue.annual * revAdjust;
        const adjustedCosts = calculation.costs.annual * costAdjust;
        
        projects.push({
          typeId,
          typeName: calculation.typeName,
          revenue: adjustedRevenue,
          costs: adjustedCosts,
          profit: adjustedRevenue - adjustedCosts,
          investment: calculation.investment
        });
        
        totalRevenue += adjustedRevenue;
        totalCosts += adjustedCosts;
        totalInvestment += calculation.investment;
      }
    }
    
    return {
      projects,
      totals: {
        revenue: totalRevenue,
        costs: totalCosts,
        profit: totalRevenue - totalCosts,
        investment: totalInvestment,
        roi: totalInvestment > 0 ? ((totalRevenue - totalCosts) / totalInvestment) * 100 : 0,
        paybackYears: totalRevenue - totalCosts > 0 ? Math.ceil(totalInvestment / (totalRevenue - totalCosts)) : Infinity
      }
    };
  }

  // Generate monthly cash flow projections
  generateCashFlow(projectTypeIds, months = 12) {
    const combined = this.calculateCombinedPL(projectTypeIds);
    const monthlyRevenue = combined.totals.revenue / 12;
    const monthlyCosts = combined.totals.costs / 12;
    
    const cashFlow = [];
    let openingBalance = 0;
    
    for (let month = 1; month <= months; month++) {
      const inflow = monthlyRevenue;
      const outflow = monthlyCosts;
      const netFlow = inflow - outflow;
      const closingBalance = openingBalance + netFlow;
      
      cashFlow.push({
        month,
        opening: openingBalance,
        inflow,
        outflow,
        netFlow,
        closing: closingBalance
      });
      
      openingBalance = closingBalance;
    }
    
    return cashFlow;
  }
}

// Global calculation engine instance
window.calculationEngine = new PLCalculationEngine();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PLCalculationEngine };
}