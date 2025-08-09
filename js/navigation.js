/**
 * CIRCLING LOGISTICS - NAVIGATION SYSTEM
 * Master Navigation Controller with Role-Based Menus
 */

class NavigationController {
  constructor() {
    this.currentUser = null;
    this.currentPage = '';
    this.navigationData = {};
    this.mobileMenuOpen = false;
    
    this.init();
  }

  /**
   * Initialize the navigation system
   */
  init() {
    this.detectCurrentPage();
    this.loadUserSession();
    this.setupNavigationData();
    this.renderNavigation();
    this.setupEventListeners();
    this.setupMobileMenu();
    this.setupPageTransitions();
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
   * Load user session data
   */
  loadUserSession() {
    const session = sessionStorage.getItem('circling_user_session');
    if (session) {
      this.currentUser = JSON.parse(session);
    } else {
      // Default session for demo purposes
      this.currentUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'shipper', // shipper, fleet, admin
        avatar: 'JD',
        permissions: ['orders:view', 'orders:create', 'profile:edit']
      };
    }
  }

  /**
   * Setup navigation menu data based on user roles
   */
  setupNavigationData() {
    this.navigationData = {
      shipper: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'nav-icon-dashboard',
          href: '02-dashboard-european.html',
          active: ['dashboard']
        },
        {
          id: 'orders',
          label: 'Orders',
          icon: 'nav-icon-orders',
          href: '07-orders-european.html',
          active: ['orders', 'order-details', 'create-order'],
          children: [
            { label: 'View Orders', href: '07-orders-european.html' },
            { label: 'Create Order', href: '09-create-order-european.html' },
            { label: 'Order Tracking', href: '20-order-tracking-european.html' }
          ]
        },
        {
          id: 'bidding',
          label: 'Bidding',
          icon: 'nav-icon-bidding',
          href: '10-bidding-european.html',
          active: ['bidding']
        },
        {
          id: 'payments',
          label: 'Payments',
          icon: 'nav-icon-financial',
          href: '11-payment-methods-european.html',
          active: ['payment-methods', 'payment-confirmation', 'payment-success']
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: 'nav-icon-analytics',
          href: '22-analytics-reports-european.html',
          active: ['analytics-reports']
        },
        {
          id: 'financial',
          label: 'Financial',
          icon: 'nav-icon-financial',
          href: '21-financial-dashboard-european.html',
          active: ['financial-dashboard']
        }
      ],
      fleet: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'nav-icon-dashboard',
          href: '03-dashboard-fleet-european.html',
          active: ['dashboard-fleet']
        },
        {
          id: 'fleet-overview',
          label: 'Fleet Overview',
          icon: 'nav-icon-fleet',
          href: '19-fleet-dashboard-european.html',
          active: ['fleet-dashboard']
        },
        {
          id: 'vehicles',
          label: 'Vehicles',
          icon: 'nav-icon-fleet',
          href: '17-vehicle-management-european.html',
          active: ['vehicle-management']
        },
        {
          id: 'drivers',
          label: 'Drivers',
          icon: 'nav-icon-drivers',
          href: '18-driver-management-european.html',
          active: ['driver-management']
        },
        {
          id: 'orders',
          label: 'Available Orders',
          icon: 'nav-icon-orders',
          href: '07-orders-european.html',
          active: ['orders']
        },
        {
          id: 'bidding',
          label: 'Bidding',
          icon: 'nav-icon-bidding',
          href: '10-bidding-european.html',
          active: ['bidding']
        },
        {
          id: 'tracking',
          label: 'Tracking',
          icon: 'nav-icon-tracking',
          href: '20-order-tracking-european.html',
          active: ['order-tracking']
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: 'nav-icon-analytics',
          href: '22-analytics-reports-european.html',
          active: ['analytics-reports']
        },
        {
          id: 'financial',
          label: 'Financial',
          icon: 'nav-icon-financial',
          href: '21-financial-dashboard-european.html',
          active: ['financial-dashboard']
        }
      ],
      admin: [
        {
          id: 'admin-dashboard',
          label: 'Admin Dashboard',
          icon: 'nav-icon-admin',
          href: '05-admin-european.html',
          active: ['admin']
        },
        {
          id: 'users',
          label: 'User Management',
          icon: 'nav-icon-users',
          href: '05-admin-european.html',
          active: ['admin']
        },
        {
          id: 'fleet-overview',
          label: 'Fleet Overview',
          icon: 'nav-icon-fleet',
          href: '19-fleet-dashboard-european.html',
          active: ['fleet-dashboard']
        },
        {
          id: 'analytics',
          label: 'System Analytics',
          icon: 'nav-icon-analytics',
          href: '22-analytics-reports-european.html',
          active: ['analytics-reports']
        },
        {
          id: 'financial',
          label: 'Financial Reports',
          icon: 'nav-icon-financial',
          href: '21-financial-dashboard-european.html',
          active: ['financial-dashboard']
        }
      ],
      common: [
        {
          id: 'notifications',
          label: 'Notifications',
          icon: 'nav-icon-notifications',
          href: '15-notifications-european.html',
          active: ['notifications'],
          badge: this.getNotificationCount()
        },
        {
          id: 'profile',
          label: 'Profile',
          icon: 'nav-icon-settings',
          href: '14-profile-settings-european.html',
          active: ['profile-settings']
        },
        {
          id: 'support',
          label: 'Help & Support',
          icon: 'nav-icon-support',
          href: '16-help-support-european.html',
          active: ['help-support']
        }
      ]
    };
  }

  /**
   * Get current notification count
   */
  getNotificationCount() {
    const notifications = JSON.parse(localStorage.getItem('circling_notifications') || '[]');
    return notifications.filter(n => !n.read).length;
  }

  /**
   * Render the navigation menu
   */
  renderNavigation() {
    this.renderDesktopNavigation();
    this.renderMobileNavigation();
    this.renderUserProfile();
    this.updateActiveStates();
  }

  /**
   * Render desktop navigation
   */
  renderDesktopNavigation() {
    const navContainer = document.querySelector('.navbar-nav');
    if (!navContainer) return;

    const userRole = this.currentUser.role;
    const menuItems = [...this.navigationData[userRole], ...this.navigationData.common];

    navContainer.innerHTML = menuItems.map(item => {
      const isActive = item.active.includes(this.currentPage);
      const badgeHtml = item.badge ? `<span class="notification-badge">${item.badge}</span>` : '';
      
      return `
        <li class="nav-item">
          <a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}" data-page="${item.id}">
            <span class="nav-icon ${item.icon}"></span>
            ${item.label}
            ${badgeHtml}
          </a>
        </li>
      `;
    }).join('');
  }

  /**
   * Render mobile bottom navigation
   */
  renderMobileNavigation() {
    const bottomNav = document.querySelector('.bottom-nav-items');
    if (!bottomNav) return;

    const userRole = this.currentUser.role;
    const primaryItems = this.navigationData[userRole].slice(0, 4);
    const moreItem = {
      id: 'more',
      label: 'More',
      icon: 'nav-icon-more',
      href: '#'
    };

    const items = [...primaryItems, moreItem];

    bottomNav.innerHTML = items.map(item => {
      const isActive = item.active ? item.active.includes(this.currentPage) : false;
      const badgeHtml = item.badge ? `<span class="notification-badge">${item.badge}</span>` : '';
      
      return `
        <a href="${item.href}" class="bottom-nav-item ${isActive ? 'active' : ''}" data-page="${item.id}">
          <div class="bottom-nav-icon ${item.icon}">
            ${badgeHtml}
          </div>
          <span class="bottom-nav-label">${item.label}</span>
        </a>
      `;
    }).join('');
  }

  /**
   * Render user profile section
   */
  renderUserProfile() {
    const userProfileContainer = document.querySelector('.user-profile');
    if (!userProfileContainer) return;

    userProfileContainer.innerHTML = `
      <div class="user-avatar">${this.currentUser.avatar}</div>
      <div class="user-info">
        <div class="user-name">${this.currentUser.name}</div>
        <div class="user-role">${this.currentUser.role}</div>
      </div>
    `;
  }

  /**
   * Update active navigation states
   */
  updateActiveStates() {
    // Remove all active states
    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
      link.classList.remove('active');
    });

    // Add active state to current page
    document.querySelectorAll(`[data-page]`).forEach(link => {
      const pageId = link.getAttribute('data-page');
      const userRole = this.currentUser.role;
      const allItems = [...this.navigationData[userRole], ...this.navigationData.common];
      
      const item = allItems.find(item => item.id === pageId);
      if (item && item.active.includes(this.currentPage)) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Navigation click handlers
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('.nav-link, .bottom-nav-item');
      if (navLink && !navLink.href.includes('#')) {
        this.handleNavigation(navLink.href);
      }

      // User profile dropdown
      const userProfile = e.target.closest('.user-profile');
      if (userProfile) {
        this.toggleUserDropdown();
      }

      // Close dropdown when clicking outside
      if (!e.target.closest('.navbar-user')) {
        this.closeUserDropdown();
      }
    });

    // Handle back/forward browser navigation
    window.addEventListener('popstate', () => {
      this.detectCurrentPage();
      this.updateActiveStates();
    });

    // Update notification badges periodically
    setInterval(() => {
      this.updateNotificationBadges();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Handle navigation with page transitions
   */
  handleNavigation(href) {
    if (href === window.location.href) return;

    // Add loading state
    document.body.classList.add('nav-loading');
    
    // Smooth transition
    setTimeout(() => {
      window.location.href = href;
    }, 150);
  }

  /**
   * Setup mobile menu functionality
   */
  setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar') && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    if (mobileToggle) {
      mobileToggle.classList.toggle('active');
    }
    
    if (mobileMenu) {
      mobileMenu.classList.toggle('show');
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    this.mobileMenuOpen = false;
    
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
    }
    
    if (mobileMenu) {
      mobileMenu.classList.remove('show');
    }
  }

  /**
   * Toggle user profile dropdown
   */
  toggleUserDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  /**
   * Close user profile dropdown
   */
  closeUserDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  /**
   * Setup page transitions
   */
  setupPageTransitions() {
    // Add transition class to main content
    const mainContent = document.querySelector('main, .main-content, .page-content');
    if (mainContent) {
      mainContent.classList.add('page-transition');
      
      // Trigger transition after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          mainContent.classList.add('loaded');
        }, 100);
      });
    }
  }

  /**
   * Update notification badges
   */
  updateNotificationBadges() {
    const notificationCount = this.getNotificationCount();
    const badges = document.querySelectorAll('.notification-badge');
    
    badges.forEach(badge => {
      if (notificationCount > 0) {
        badge.textContent = notificationCount > 99 ? '99+' : notificationCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  /**
   * Update user role and refresh navigation
   */
  updateUserRole(newRole) {
    this.currentUser.role = newRole;
    sessionStorage.setItem('circling_user_session', JSON.stringify(this.currentUser));
    this.renderNavigation();
  }

  /**
   * Get navigation data for current user
   */
  getNavigationData() {
    const userRole = this.currentUser.role;
    return {
      primary: this.navigationData[userRole],
      common: this.navigationData.common,
      user: this.currentUser
    };
  }

  /**
   * Search functionality
   */
  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
  }

  /**
   * Handle search functionality
   */
  handleSearch(query) {
    if (query.length < 2) return;

    // Implement search logic here
    console.log('Searching for:', query);
    
    // This would typically make an API call
    // For now, we'll just filter navigation items
    const userRole = this.currentUser.role;
    const allItems = [...this.navigationData[userRole], ...this.navigationData.common];
    
    const results = allItems.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase())
    );
    
    console.log('Search results:', results);
  }

  /**
   * Logout functionality
   */
  logout() {
    sessionStorage.removeItem('circling_user_session');
    localStorage.removeItem('circling_notifications');
    window.location.href = '01-login-european.html';
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.navigationController = new NavigationController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationController;
}