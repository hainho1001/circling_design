/**
 * CIRCLING LOGISTICS - SMART BREADCRUMB SYSTEM
 * Dynamic breadcrumb generation with role-aware navigation paths
 */

class BreadcrumbController {
  constructor() {
    this.currentPage = '';
    this.currentUser = null;
    this.breadcrumbMappings = {};
    this.pageHierarchy = {};
    
    this.init();
  }

  /**
   * Initialize the breadcrumb system
   */
  init() {
    this.loadUserSession();
    this.detectCurrentPage();
    this.setupBreadcrumbMappings();
    this.setupPageHierarchy();
    this.renderBreadcrumb();
  }

  /**
   * Load user session data
   */
  loadUserSession() {
    const session = sessionStorage.getItem('circling_user_session');
    if (session) {
      this.currentUser = JSON.parse(session);
    } else {
      this.currentUser = {
        role: 'shipper'
      };
    }
  }

  /**
   * Detect current page from URL
   */
  detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    this.currentPage = filename.replace('.html', '').replace(/^\d{2}-/, '');
  }

  /**
   * Setup breadcrumb mappings for all pages
   */
  setupBreadcrumbMappings() {
    this.breadcrumbMappings = {
      // Authentication pages
      'login': [
        { label: 'Login', href: null, current: true }
      ],
      'register': [
        { label: 'Registration', href: null, current: true }
      ],

      // Dashboard pages
      'dashboard': [
        { label: 'Dashboard', href: null, current: true }
      ],
      'dashboard-fleet': [
        { label: 'Fleet Dashboard', href: null, current: true }
      ],
      'admin': [
        { label: 'Admin Dashboard', href: null, current: true }
      ],

      // Home page
      'home-page': [
        { label: 'Home', href: null, current: true }
      ],

      // Order management
      'orders': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Orders', href: null, current: true }
      ],
      'order-details': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Orders', href: '07-orders-european.html' },
        { label: 'Order Details', href: null, current: true }
      ],
      'create-order': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Orders', href: '07-orders-european.html' },
        { label: 'Create Order', href: null, current: true }
      ],
      'order-tracking': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Orders', href: '07-orders-european.html' },
        { label: 'Order Tracking', href: null, current: true }
      ],

      // Bidding system
      'bidding': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Bidding', href: null, current: true }
      ],

      // Payment system
      'payment-methods': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Orders', href: '07-orders-european.html' },
        { label: 'Payment Methods', href: null, current: true }
      ],
      'payment-confirmation': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Orders', href: '07-orders-european.html' },
        { label: 'Payment Methods', href: '11-payment-methods-european.html' },
        { label: 'Payment Confirmation', href: null, current: true }
      ],
      'payment-success': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Orders', href: '07-orders-european.html' },
        { label: 'Payment Success', href: null, current: true }
      ],

      // Fleet management
      'vehicle-management': [
        { label: 'Fleet Dashboard', href: '03-dashboard-fleet-european.html' },
        { label: 'Vehicle Management', href: null, current: true }
      ],
      'driver-management': [
        { label: 'Fleet Dashboard', href: '03-dashboard-fleet-european.html' },
        { label: 'Driver Management', href: null, current: true }
      ],
      'fleet-dashboard': [
        { label: 'Fleet Dashboard', href: '03-dashboard-fleet-european.html' },
        { label: 'Fleet Overview', href: null, current: true }
      ],

      // Analytics and Reports
      'analytics-reports': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Analytics & Reports', href: null, current: true }
      ],
      'financial-dashboard': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Financial Dashboard', href: null, current: true }
      ],

      // User management
      'profile-settings': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Profile Settings', href: null, current: true }
      ],
      'notifications': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Notifications', href: null, current: true }
      ],

      // Support
      'help-support': [
        { label: 'Dashboard', href: this.getDashboardUrl() },
        { label: 'Help & Support', href: null, current: true }
      ]
    };
  }

  /**
   * Setup page hierarchy for dynamic breadcrumb generation
   */
  setupPageHierarchy() {
    this.pageHierarchy = {
      // Top level pages
      'dashboard': { parent: null, title: 'Dashboard' },
      'dashboard-fleet': { parent: null, title: 'Fleet Dashboard' },
      'admin': { parent: null, title: 'Admin Dashboard' },
      'home-page': { parent: null, title: 'Home' },

      // Order flow
      'orders': { parent: 'dashboard', title: 'Orders' },
      'create-order': { parent: 'orders', title: 'Create Order' },
      'order-details': { parent: 'orders', title: 'Order Details' },
      'order-tracking': { parent: 'orders', title: 'Order Tracking' },

      // Payment flow
      'payment-methods': { parent: 'orders', title: 'Payment Methods' },
      'payment-confirmation': { parent: 'payment-methods', title: 'Payment Confirmation' },
      'payment-success': { parent: 'orders', title: 'Payment Success' },

      // Fleet management
      'vehicle-management': { parent: 'dashboard-fleet', title: 'Vehicle Management' },
      'driver-management': { parent: 'dashboard-fleet', title: 'Driver Management' },
      'fleet-dashboard': { parent: 'dashboard-fleet', title: 'Fleet Overview' },

      // Bidding
      'bidding': { parent: 'dashboard', title: 'Bidding' },

      // Analytics
      'analytics-reports': { parent: 'dashboard', title: 'Analytics & Reports' },
      'financial-dashboard': { parent: 'dashboard', title: 'Financial Dashboard' },

      // User pages
      'profile-settings': { parent: 'dashboard', title: 'Profile Settings' },
      'notifications': { parent: 'dashboard', title: 'Notifications' },
      'help-support': { parent: 'dashboard', title: 'Help & Support' }
    };
  }

  /**
   * Get dashboard URL based on user role
   */
  getDashboardUrl() {
    switch (this.currentUser?.role) {
      case 'fleet':
        return '03-dashboard-fleet-european.html';
      case 'admin':
        return '05-admin-european.html';
      default:
        return '02-dashboard-european.html';
    }
  }

  /**
   * Generate breadcrumb from page hierarchy
   */
  generateBreadcrumbFromHierarchy(pageKey) {
    const breadcrumb = [];
    let currentPage = pageKey;

    while (currentPage) {
      const pageInfo = this.pageHierarchy[currentPage];
      if (!pageInfo) break;

      breadcrumb.unshift({
        label: pageInfo.title,
        href: currentPage === pageKey ? null : this.getPageUrl(currentPage),
        current: currentPage === pageKey
      });

      currentPage = pageInfo.parent;
    }

    return breadcrumb;
  }

  /**
   * Get page URL from page key
   */
  getPageUrl(pageKey) {
    const urlMappings = {
      'dashboard': '02-dashboard-european.html',
      'dashboard-fleet': '03-dashboard-fleet-european.html',
      'admin': '05-admin-european.html',
      'home-page': '06-home-page-european.html',
      'orders': '07-orders-european.html',
      'order-details': '08-order-details-european.html',
      'create-order': '09-create-order-european.html',
      'bidding': '10-bidding-european.html',
      'payment-methods': '11-payment-methods-european.html',
      'payment-confirmation': '12-payment-confirmation-european.html',
      'payment-success': '13-payment-success-european.html',
      'profile-settings': '14-profile-settings-european.html',
      'notifications': '15-notifications-european.html',
      'help-support': '16-help-support-european.html',
      'vehicle-management': '17-vehicle-management-european.html',
      'driver-management': '18-driver-management-european.html',
      'fleet-dashboard': '19-fleet-dashboard-european.html',
      'order-tracking': '20-order-tracking-european.html',
      'financial-dashboard': '21-financial-dashboard-european.html',
      'analytics-reports': '22-analytics-reports-european.html'
    };

    return urlMappings[pageKey] || '#';
  }

  /**
   * Get breadcrumb for current page
   */
  getCurrentBreadcrumb() {
    // First try predefined mappings
    if (this.breadcrumbMappings[this.currentPage]) {
      return this.breadcrumbMappings[this.currentPage];
    }

    // Fallback to hierarchy-based generation
    if (this.pageHierarchy[this.currentPage]) {
      return this.generateBreadcrumbFromHierarchy(this.currentPage);
    }

    // Default breadcrumb for unknown pages
    return [
      { label: 'Dashboard', href: this.getDashboardUrl() },
      { label: this.formatPageTitle(this.currentPage), href: null, current: true }
    ];
  }

  /**
   * Format page title from page key
   */
  formatPageTitle(pageKey) {
    return pageKey
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Render breadcrumb navigation
   */
  renderBreadcrumb() {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer) return;

    const breadcrumbItems = this.getCurrentBreadcrumb();
    
    breadcrumbContainer.innerHTML = breadcrumbItems.map((item, index) => {
      if (item.current) {
        return `
          <li class="breadcrumb-item">
            <span class="breadcrumb-current">${item.label}</span>
          </li>
        `;
      } else {
        return `
          <li class="breadcrumb-item">
            <a href="${item.href}" class="breadcrumb-link">${item.label}</a>
          </li>
        `;
      }
    }).join('');

    // Add accessibility attributes
    breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb navigation');
    
    // Update page title
    this.updatePageTitle(breadcrumbItems);
  }

  /**
   * Update page title based on breadcrumb
   */
  updatePageTitle(breadcrumbItems) {
    const currentPageTitle = breadcrumbItems[breadcrumbItems.length - 1]?.label;
    if (currentPageTitle) {
      document.title = `${currentPageTitle} - Circling Logistics`;
    }
  }

  /**
   * Navigate to parent page
   */
  navigateToParent() {
    const breadcrumbItems = this.getCurrentBreadcrumb();
    if (breadcrumbItems.length > 1) {
      const parentItem = breadcrumbItems[breadcrumbItems.length - 2];
      if (parentItem.href) {
        window.location.href = parentItem.href;
      }
    }
  }

  /**
   * Get breadcrumb data for external use
   */
  getBreadcrumbData() {
    return {
      items: this.getCurrentBreadcrumb(),
      currentPage: this.currentPage,
      userRole: this.currentUser?.role
    };
  }

  /**
   * Add custom breadcrumb item
   */
  addCustomBreadcrumb(label, href = null, position = -1) {
    const breadcrumbItems = this.getCurrentBreadcrumb();
    
    // Remove current flag from existing items
    breadcrumbItems.forEach(item => item.current = false);
    
    const newItem = {
      label: label,
      href: href,
      current: href === null
    };

    if (position === -1) {
      breadcrumbItems.push(newItem);
    } else {
      breadcrumbItems.splice(position, 0, newItem);
    }

    // Re-render breadcrumb
    this.renderCustomBreadcrumb(breadcrumbItems);
  }

  /**
   * Render custom breadcrumb
   */
  renderCustomBreadcrumb(items) {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer) return;

    breadcrumbContainer.innerHTML = items.map((item, index) => {
      if (item.current) {
        return `
          <li class="breadcrumb-item">
            <span class="breadcrumb-current">${item.label}</span>
          </li>
        `;
      } else {
        return `
          <li class="breadcrumb-item">
            <a href="${item.href}" class="breadcrumb-link">${item.label}</a>
          </li>
        `;
      }
    }).join('');
  }

  /**
   * Handle breadcrumb click events
   */
  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const breadcrumbLink = e.target.closest('.breadcrumb-link');
      if (breadcrumbLink) {
        e.preventDefault();
        
        // Add loading state
        breadcrumbLink.classList.add('loading');
        
        // Navigate after short delay for smooth transition
        setTimeout(() => {
          window.location.href = breadcrumbLink.href;
        }, 150);
      }
    });

    // Keyboard navigation for breadcrumbs
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateToParent();
      }
    });
  }

  /**
   * Update breadcrumb when page changes
   */
  updateBreadcrumb() {
    this.detectCurrentPage();
    this.renderBreadcrumb();
  }

  /**
   * Get breadcrumb schema for SEO
   */
  getBreadcrumbSchema() {
    const breadcrumbItems = this.getCurrentBreadcrumb();
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.href ? `${window.location.origin}/${item.href}` : window.location.href
      }))
    };
  }

  /**
   * Inject breadcrumb schema into page head
   */
  injectBreadcrumbSchema() {
    const schema = this.getBreadcrumbSchema();
    
    // Remove existing breadcrumb schema
    const existingSchema = document.querySelector('script[type="application/ld+json"][data-breadcrumb]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new breadcrumb schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

// Initialize breadcrumb system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.breadcrumbController = new BreadcrumbController();
  window.breadcrumbController.setupEventListeners();
  window.breadcrumbController.injectBreadcrumbSchema();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BreadcrumbController;
}