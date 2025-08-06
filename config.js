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

// Business type categories with their characteristics
const BUSINESS_TYPE_CATEGORIES = {
  'booking': {
    id: 'booking',
    name: 'Booking-based',
    description: 'Businesses that rent out time slots, spaces, or equipment',
    examples: ['Padel courts', 'Tennis courts', 'Coworking rooms', 'Meeting rooms', 'Equipment rental'],
    icon: '📅',
    keyMetrics: ['Utilization Rate', 'Peak vs Off-Peak Revenue', 'Booking Capacity', 'Average Session Price'],
    revenueModel: 'time-based',
    characteristics: ['time_slots', 'capacity_utilization', 'peak_pricing', 'scheduling']
  },
  'member': {
    id: 'member',
    name: 'Member-based',
    description: 'Subscription or membership-driven businesses',
    examples: ['Gym', 'Club', 'SaaS', 'Subscription services'],
    icon: '👥',
    keyMetrics: ['Member Count', 'Churn Rate', 'Average Revenue Per User', 'Member Lifetime Value'],
    revenueModel: 'subscription',
    characteristics: ['recurring_revenue', 'member_tiers', 'retention', 'growth_rate']
  },
  'event': {
    id: 'event',
    name: 'Event-based',
    description: 'Businesses that organize and sell tickets to events',
    examples: ['Conferences', 'Workshops', 'Seminars', 'Training sessions'],
    icon: '🎪',
    keyMetrics: ['Ticket Sales', 'Attendance Rate', 'Event Capacity', 'Revenue per Attendee'],
    revenueModel: 'event-tickets',
    characteristics: ['ticket_pricing', 'event_capacity', 'seasonal_events', 'speaker_costs']
  },
  'promotion': {
    id: 'promotion',
    name: 'Promotion-based',
    description: 'Businesses focused on coupon, discount, or promotion campaigns',
    examples: ['Coupon platforms', 'Deal aggregators', 'Promotional campaigns'],
    icon: '🎟️',
    keyMetrics: ['Redemption Rate', 'Conversion Rate', 'Campaign ROI', 'Customer Acquisition Cost'],
    revenueModel: 'commission',
    characteristics: ['redemption_tracking', 'campaign_cycles', 'partner_commissions', 'conversion_funnels']
  },
  'product': {
    id: 'product',
    name: 'Product-based',
    description: 'Businesses that sell physical or digital products',
    examples: ['Retail store', 'E-commerce', 'Manufacturing', 'Digital products'],
    icon: '📦',
    keyMetrics: ['Units Sold', 'Average Order Value', 'Inventory Turnover', 'Gross Margin'],
    revenueModel: 'product-sales',
    characteristics: ['inventory_management', 'cost_of_goods', 'order_fulfillment', 'product_mix']
  },
  'service': {
    id: 'service',
    name: 'Service-based',
    description: 'Businesses that provide professional or personal services',
    examples: ['Consulting', 'Repairs', 'Professional services', 'Personal training'],
    icon: '🔧',
    keyMetrics: ['Billable Hours', 'Hourly Rate', 'Client Retention', 'Project Profitability'],
    revenueModel: 'hourly-project',
    characteristics: ['hourly_billing', 'project_based', 'consultant_utilization', 'client_relationships']
  },
  'education': {
    id: 'education',
    name: 'Education-based',
    description: 'Educational institutions and training providers',
    examples: ['Courses', 'Training programs', 'Schools', 'Online education'],
    icon: '🎓',
    keyMetrics: ['Student Enrollment', 'Course Completion Rate', 'Revenue per Student', 'Teacher Utilization'],
    revenueModel: 'tuition-fees',
    characteristics: ['course_curriculum', 'student_capacity', 'instructor_costs', 'certification']
  },
  'rental': {
    id: 'rental',
    name: 'Rental-based',
    description: 'Businesses that rent out assets or equipment long-term',
    examples: ['Equipment rental', 'Property rental', 'Vehicle rental', 'Asset leasing'],
    icon: '🏠',
    keyMetrics: ['Rental Utilization', 'Average Rental Duration', 'Asset ROI', 'Maintenance Costs'],
    revenueModel: 'rental-income',
    characteristics: ['asset_depreciation', 'maintenance_cycles', 'rental_duration', 'asset_utilization']
  },
  'hybrid': {
    id: 'hybrid',
    name: 'Hybrid',
    description: 'Businesses that combine multiple revenue models',
    examples: ['Multi-service businesses', 'Complex business models', 'Mixed revenue streams'],
    icon: '🔀',
    keyMetrics: ['Revenue Mix', 'Cross-sell Rate', 'Customer Segment Value', 'Model Efficiency'],
    revenueModel: 'mixed',
    characteristics: ['multiple_revenue_streams', 'cross_selling', 'segment_analysis', 'model_optimization']
  }
};

// Default project type templates (mapped to business categories)
const DEFAULT_PROJECT_TYPES = {
  padel: {
    id: 'padel',
    name: 'Padel Club',
    description: 'Padel court business with rental and coaching services',
    icon: '🏸',
    businessType: 'booking',
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
    businessType: 'member',
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

  // Business type templates for the new categories
  conference: {
    id: 'conference',
    name: 'Conference/Event',
    description: 'Event-based business with ticket sales and venue management',
    icon: '🎪',
    businessType: 'event',
    categories: {
      investment: [
        { id: 'venue', name: 'Venue Setup', type: 'currency', defaultValue: 15000, unit: '€', group: 'Infrastructure' },
        { id: 'equipment', name: 'AV Equipment', type: 'currency', defaultValue: 8000, unit: '€', group: 'Equipment' },
        { id: 'technology', name: 'Technology Platform', type: 'currency', defaultValue: 5000, unit: '€', group: 'Technology' }
      ],
      revenue: [
        { id: 'capacity', name: 'Event Capacity', type: 'number', defaultValue: 200, unit: 'attendees', group: 'Event Specs' },
        { id: 'ticketPrice', name: 'Average Ticket Price', type: 'currency', defaultValue: 150, unit: '€', group: 'Pricing' },
        { id: 'occupancyRate', name: 'Expected Occupancy', type: 'percentage', defaultValue: 80, unit: '%', group: 'Attendance' },
        { id: 'eventsPerYear', name: 'Events per Year', type: 'number', defaultValue: 12, unit: 'events', group: 'Schedule' },
        { id: 'sponsorship', name: 'Sponsorship Revenue', type: 'currency', defaultValue: 10000, unit: '€/year', group: 'Additional Revenue' }
      ],
      operating: [
        { id: 'venueRental', name: 'Venue Rental/year', type: 'currency', defaultValue: 24000, unit: '€', group: 'Fixed Costs' },
        { id: 'catering', name: 'Catering/event', type: 'currency', defaultValue: 2000, unit: '€', group: 'Variable Costs' },
        { id: 'marketing', name: 'Marketing/year', type: 'currency', defaultValue: 8000, unit: '€', group: 'Variable Costs' },
        { id: 'insurance', name: 'Insurance/year', type: 'currency', defaultValue: 2000, unit: '€', group: 'Fixed Costs' },
        { id: 'materials', name: 'Materials/event', type: 'currency', defaultValue: 500, unit: '€', group: 'Variable Costs' }
      ],
      staffing: [
        { id: 'eventManager', name: 'Event Manager', type: 'number', defaultValue: 1, unit: 'people', group: 'Management' },
        { id: 'eventManagerSal', name: 'Event Manager Salary', type: 'currency', defaultValue: 40000, unit: '€/year', group: 'Management' },
        { id: 'speakers', name: 'Speaker Fees/event', type: 'currency', defaultValue: 3000, unit: '€', group: 'Speakers' },
        { id: 'support', name: 'Support Staff/event', type: 'number', defaultValue: 3, unit: 'people', group: 'Operations' },
        { id: 'supportSal', name: 'Support Staff Cost/event', type: 'currency', defaultValue: 800, unit: '€', group: 'Operations' }
      ]
    }
  },

  saas: {
    id: 'saas',
    name: 'SaaS Platform',
    description: 'Software as a Service with subscription-based revenue',
    icon: '💻',
    businessType: 'member',
    categories: {
      investment: [
        { id: 'development', name: 'Initial Development', type: 'currency', defaultValue: 50000, unit: '€', group: 'Technology' },
        { id: 'infrastructure', name: 'Cloud Infrastructure', type: 'currency', defaultValue: 10000, unit: '€', group: 'Technology' },
        { id: 'licenses', name: 'Software Licenses', type: 'currency', defaultValue: 5000, unit: '€', group: 'Technology' }
      ],
      revenue: [
        { id: 'basicUsers', name: 'Basic Plan Users', type: 'number', defaultValue: 100, unit: 'users', group: 'Subscriptions' },
        { id: 'basicPrice', name: 'Basic Plan Price', type: 'currency', defaultValue: 29, unit: '€/month', group: 'Subscriptions' },
        { id: 'proUsers', name: 'Pro Plan Users', type: 'number', defaultValue: 50, unit: 'users', group: 'Subscriptions' },
        { id: 'proPrice', name: 'Pro Plan Price', type: 'currency', defaultValue: 79, unit: '€/month', group: 'Subscriptions' },
        { id: 'churnRate', name: 'Monthly Churn Rate', type: 'percentage', defaultValue: 5, unit: '%', group: 'Retention' },
        { id: 'growthRate', name: 'Monthly Growth Rate', type: 'percentage', defaultValue: 10, unit: '%', group: 'Growth' }
      ],
      operating: [
        { id: 'hosting', name: 'Hosting/month', type: 'currency', defaultValue: 2000, unit: '€', group: 'Technology' },
        { id: 'support', name: 'Customer Support/year', type: 'currency', defaultValue: 15000, unit: '€', group: 'Operations' },
        { id: 'marketing', name: 'Marketing/year', type: 'currency', defaultValue: 20000, unit: '€', group: 'Growth' },
        { id: 'maintenance', name: 'Maintenance/year', type: 'currency', defaultValue: 8000, unit: '€', group: 'Technology' }
      ],
      staffing: [
        { id: 'developers', name: 'Developers', type: 'number', defaultValue: 2, unit: 'people', group: 'Development' },
        { id: 'developerSal', name: 'Developer Salary', type: 'currency', defaultValue: 60000, unit: '€/year', group: 'Development' },
        { id: 'customer', name: 'Customer Success', type: 'number', defaultValue: 1, unit: 'people', group: 'Operations' },
        { id: 'customerSal', name: 'Customer Success Salary', type: 'currency', defaultValue: 45000, unit: '€/year', group: 'Operations' }
      ]
    }
  },

  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Online retail business with product sales',
    icon: '🛒',
    businessType: 'product',
    categories: {
      investment: [
        { id: 'website', name: 'Website Development', type: 'currency', defaultValue: 15000, unit: '€', group: 'Technology' },
        { id: 'inventory', name: 'Initial Inventory', type: 'currency', defaultValue: 30000, unit: '€', group: 'Inventory' },
        { id: 'warehouse', name: 'Warehouse Setup', type: 'currency', defaultValue: 10000, unit: '€', group: 'Infrastructure' }
      ],
      revenue: [
        { id: 'avgOrderValue', name: 'Average Order Value', type: 'currency', defaultValue: 75, unit: '€', group: 'Sales' },
        { id: 'ordersPerMonth', name: 'Orders per Month', type: 'number', defaultValue: 500, unit: 'orders', group: 'Sales' },
        { id: 'grossMargin', name: 'Gross Margin', type: 'percentage', defaultValue: 40, unit: '%', group: 'Profitability' },
        { id: 'returnRate', name: 'Return Rate', type: 'percentage', defaultValue: 8, unit: '%', group: 'Operations' }
      ],
      operating: [
        { id: 'hosting', name: 'Website Hosting/year', type: 'currency', defaultValue: 2000, unit: '€', group: 'Technology' },
        { id: 'shipping', name: 'Shipping Costs/year', type: 'currency', defaultValue: 8000, unit: '€', group: 'Logistics' },
        { id: 'payment', name: 'Payment Processing/year', type: 'currency', defaultValue: 3000, unit: '€', group: 'Financial' },
        { id: 'marketing', name: 'Digital Marketing/year', type: 'currency', defaultValue: 15000, unit: '€', group: 'Marketing' },
        { id: 'warehouse', name: 'Warehouse Costs/year', type: 'currency', defaultValue: 12000, unit: '€', group: 'Logistics' }
      ],
      staffing: [
        { id: 'manager', name: 'Store Manager', type: 'number', defaultValue: 1, unit: 'people', group: 'Management' },
        { id: 'managerSal', name: 'Manager Salary', type: 'currency', defaultValue: 35000, unit: '€/year', group: 'Management' },
        { id: 'fulfillment', name: 'Fulfillment Staff', type: 'number', defaultValue: 2, unit: 'people', group: 'Operations' },
        { id: 'fulfillmentSal', name: 'Fulfillment Salary', type: 'currency', defaultValue: 25000, unit: '€/year', group: 'Operations' }
      ]
    }
  },

  consulting: {
    id: 'consulting',
    name: 'Consulting Services',
    description: 'Professional services with hourly or project-based billing',
    icon: '💼',
    businessType: 'service',
    categories: {
      investment: [
        { id: 'office', name: 'Office Setup', type: 'currency', defaultValue: 8000, unit: '€', group: 'Infrastructure' },
        { id: 'equipment', name: 'Equipment & Software', type: 'currency', defaultValue: 5000, unit: '€', group: 'Technology' },
        { id: 'certification', name: 'Certifications', type: 'currency', defaultValue: 3000, unit: '€', group: 'Professional' }
      ],
      revenue: [
        { id: 'hourlyRate', name: 'Hourly Rate', type: 'currency', defaultValue: 120, unit: '€/hour', group: 'Pricing' },
        { id: 'billableHours', name: 'Billable Hours/week', type: 'number', defaultValue: 30, unit: 'hours', group: 'Utilization' },
        { id: 'utilizationRate', name: 'Utilization Rate', type: 'percentage', defaultValue: 75, unit: '%', group: 'Utilization' },
        { id: 'weeksPerYear', name: 'Working Weeks/year', type: 'number', defaultValue: 48, unit: 'weeks', group: 'Schedule' }
      ],
      operating: [
        { id: 'office', name: 'Office Rent/year', type: 'currency', defaultValue: 8000, unit: '€', group: 'Fixed Costs' },
        { id: 'insurance', name: 'Professional Insurance/year', type: 'currency', defaultValue: 2500, unit: '€', group: 'Fixed Costs' },
        { id: 'marketing', name: 'Marketing/year', type: 'currency', defaultValue: 5000, unit: '€', group: 'Business Development' },
        { id: 'professional', name: 'Professional Development/year', type: 'currency', defaultValue: 3000, unit: '€', group: 'Professional' },
        { id: 'equipment', name: 'Equipment Maintenance/year', type: 'currency', defaultValue: 1000, unit: '€', group: 'Operations' }
      ],
      staffing: [
        { id: 'consultant', name: 'Senior Consultants', type: 'number', defaultValue: 1, unit: 'people', group: 'Consultants' },
        { id: 'consultantSal', name: 'Consultant Salary', type: 'currency', defaultValue: 70000, unit: '€/year', group: 'Consultants' },
        { id: 'junior', name: 'Junior Consultants', type: 'number', defaultValue: 1, unit: 'people', group: 'Consultants' },
        { id: 'juniorSal', name: 'Junior Salary', type: 'currency', defaultValue: 40000, unit: '€/year', group: 'Consultants' }
      ]
    }
  },

  // Generic business template
  generic: {
    id: 'generic',
    name: 'Generic Business',
    description: 'Customizable business model template',
    icon: '🏢',
    businessType: 'hybrid',
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

  // Get all available project types grouped by business category
  getAllProjectTypesByCategory() {
    const allTypes = this.getAllProjectTypes();
    const categories = {};
    
    for (const [id, type] of Object.entries(allTypes)) {
      const businessType = type.businessType || 'hybrid';
      if (!categories[businessType]) {
        categories[businessType] = [];
      }
      categories[businessType].push(type);
    }
    
    return categories;
  }

  // Get business type category information
  getBusinessTypeCategory(categoryId) {
    return BUSINESS_TYPE_CATEGORIES[categoryId] || null;
  }

  // Get all business type categories
  getAllBusinessTypeCategories() {
    return BUSINESS_TYPE_CATEGORIES;
  }

  // Get projects by business type
  getProjectsByBusinessType(businessType) {
    const allTypes = this.getAllProjectTypes();
    return Object.values(allTypes).filter(type => type.businessType === businessType);
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

// Export business type categories
window.BUSINESS_TYPE_CATEGORIES = BUSINESS_TYPE_CATEGORIES;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROJECT_TYPE_SCHEMA,
    CATEGORY_SCHEMA,
    DEFAULT_PROJECT_TYPES,
    BUSINESS_TYPE_CATEGORIES,
    ProjectTypeManager
  };
}