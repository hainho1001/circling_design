/**
 * Navigation System for Circling Logistics
 * Handles role-based navigation, active states, and mobile responsiveness
 */

class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.navigationData = new Map();
        this.mobileMenuOpen = false;
        this.init();
    }

    /**
     * Initialize navigation system
     */
    init() {
        this.setupNavigationRoutes();
        this.createNavigationStructure();
        this.setupEventListeners();
        this.updateNavigation();
        this.updateActiveStates();
    }

    /**
     * Setup navigation route definitions
     */
    setupNavigationRoutes() {
        // Cargo Owner Navigation
        this.navigationData.set('cargo_owner', [
            {
                label: 'Trang chủ',
                labelEn: 'Dashboard',
                icon: '🏠',
                url: '02-dashboard-european.html',
                active: ['02-dashboard-european.html']
            },
            {
                label: 'Đơn hàng',
                labelEn: 'Orders',
                icon: '📦',
                url: '07-orders-european.html',
                active: ['07-orders-european.html', '08-order-details-european.html']
            },
            {
                label: 'Tạo đơn mới',
                labelEn: 'Create Order',
                icon: '➕',
                url: '09-create-order-european.html',
                active: ['09-create-order-european.html']
            },
            {
                label: 'Thanh toán',
                labelEn: 'Payments',
                icon: '💳',
                url: '11-payment-methods-european.html',
                active: ['11-payment-methods-european.html', '12-payment-confirmation-european.html', '13-payment-success-european.html']
            }
        ]);

        // Fleet Owner Navigation
        this.navigationData.set('fleet_owner', [
            {
                label: 'Trang chủ',
                labelEn: 'Dashboard',
                icon: '🏠',
                url: '03-dashboard-fleet-european.html',
                active: ['03-dashboard-fleet-european.html']
            },
            {
                label: 'Tìm hàng',
                labelEn: 'Find Cargo',
                icon: '🔍',
                url: '07-orders-european.html',
                active: ['07-orders-european.html', '19-cargo-search-european.html']
            },
            {
                label: 'Đấu giá',
                labelEn: 'Bidding',
                icon: '🏷️',
                url: '10-bidding-european.html',
                active: ['10-bidding-european.html']
            },
            {
                label: 'Đội xe',
                labelEn: 'Fleet',
                icon: '🚛',
                url: '17-vehicle-management-european.html',
                active: ['17-vehicle-management-european.html']
            },
            {
                label: 'Tài xế',
                labelEn: 'Drivers',
                icon: '👤',
                url: '18-driver-management-european.html',
                active: ['18-driver-management-european.html']
            }
        ]);

        // Admin Navigation
        this.navigationData.set('admin', [
            {
                label: 'Trang chủ',
                labelEn: 'Dashboard',
                icon: '🏠',
                url: '05-admin-european.html',
                active: ['05-admin-european.html']
            },
            {
                label: 'Quản lý người dùng',
                labelEn: 'User Management',
                icon: '👥',
                url: '#',
                active: []
            },
            {
                label: 'Cài đặt hệ thống',
                labelEn: 'System Settings',
                icon: '⚙️',
                url: '#',
                active: []
            }
        ]);

        // Shared navigation items (appear for all roles)
        this.sharedNavigation = [
            {
                label: 'Thông báo',
                labelEn: 'Notifications',
                icon: '🔔',
                url: '15-notifications-european.html',
                active: ['15-notifications-european.html'],
                type: 'user-action'
            },
            {
                label: 'Cài đặt',
                labelEn: 'Settings',
                icon: '👤',
                url: '14-profile-settings-european.html',
                active: ['14-profile-settings-european.html'],
                type: 'user-action'
            },
            {
                label: 'Hỗ trợ',
                labelEn: 'Help',
                icon: '❓',
                url: '16-help-support-european.html',
                active: ['16-help-support-european.html'],
                type: 'user-action'
            }
        ];
    }

    /**
     * Create navigation HTML structure
     */
    createNavigationStructure() {
        // Check if header already exists
        let header = document.querySelector('.main-header');
        
        if (!header) {
            header = document.createElement('header');
            header.className = 'main-header';
            header.innerHTML = this.getHeaderHTML();
            document.body.insertBefore(header, document.body.firstChild);
        } else {
            // Update existing header
            header.innerHTML = this.getHeaderHTML();
        }

        this.header = header;
    }

    /**
     * Get header HTML structure
     */
    getHeaderHTML() {
        return `
            <div class="header-container">
                <!-- Logo -->
                <a href="#" class="logo" onclick="navigationManager.navigateToHome()">
                    <div class="logo-icon">CL</div>
                    <span>Circling Logistics</span>
                </a>

                <!-- Desktop Navigation -->
                <nav class="main-nav">
                    <ul class="nav-menu" id="nav-menu">
                        <!-- Navigation items will be inserted here -->
                    </ul>
                </nav>

                <!-- Search Bar -->
                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="search-input" placeholder="Tìm kiếm..." id="global-search">
                </div>

                <!-- User Actions -->
                <div class="user-actions">
                    <!-- Notifications -->
                    <button class="notification-btn" onclick="navigationManager.showNotifications()">
                        <span class="nav-icon">🔔</span>
                        <span class="notification-badge" id="notification-count">3</span>
                    </button>

                    <!-- User Menu -->
                    <div class="user-menu">
                        <div class="user-avatar" id="user-avatar" onclick="navigationManager.toggleUserMenu()">
                            <!-- User initials will be inserted here -->
                        </div>
                    </div>

                    <!-- Mobile Menu Toggle -->
                    <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                        <div class="hamburger">
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                        </div>
                    </button>
                </div>

                <!-- Mobile Navigation -->
                <nav class="mobile-nav" id="mobile-nav">
                    <ul class="mobile-nav-menu" id="mobile-nav-menu">
                        <!-- Mobile navigation items will be inserted here -->
                    </ul>
                </nav>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Global search
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.executeSearch(e.target.value);
                }
            });
        }

        // User session changes
        if (window.userSession) {
            window.userSession.on('login', () => this.updateNavigation());
            window.userSession.on('logout', () => this.updateNavigation());
            window.userSession.on('sessionChanged', () => this.updateNavigation());
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileNav = document.getElementById('mobile-nav');
            const mobileToggle = document.getElementById('mobile-menu-toggle');
            
            if (this.mobileMenuOpen && 
                !mobileNav.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Update navigation based on user role
     */
    updateNavigation() {
        const userRole = window.userSession ? window.userSession.getUserRole() : null;
        const isAuthenticated = window.userSession ? window.userSession.isAuthenticated() : false;

        if (!isAuthenticated) {
            this.showLoginPrompt();
            return;
        }

        this.updateMainNavigation(userRole);
        this.updateUserInfo();
        this.updateActiveStates();
    }

    /**
     * Update main navigation menu
     */
    updateMainNavigation(role) {
        const navMenu = document.getElementById('nav-menu');
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        
        if (!navMenu || !mobileNavMenu) return;

        const navigationItems = this.navigationData.get(role) || [];
        
        // Generate navigation HTML
        const navHTML = navigationItems.map(item => 
            `<li class="nav-item">
                <a href="${item.url}" class="nav-link" data-page="${item.url}">
                    <span class="nav-icon">${item.icon}</span>
                    <span>${item.label}</span>
                </a>
            </li>`
        ).join('');

        const mobileNavHTML = navigationItems.map(item => 
            `<li class="mobile-nav-item">
                <a href="${item.url}" class="mobile-nav-link" data-page="${item.url}">
                    <span class="nav-icon">${item.icon}</span>
                    <span>${item.label}</span>
                </a>
            </li>`
        ).join('');

        navMenu.innerHTML = navHTML;
        mobileNavMenu.innerHTML = mobileNavHTML;

        // Add click handlers
        this.addNavigationHandlers();
    }

    /**
     * Add click handlers to navigation links
     */
    addNavigationHandlers() {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                    return;
                }
                
                // Close mobile menu if open
                if (this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Update last activity
                if (window.userSession) {
                    window.userSession.updateLastActivity();
                }
            });
        });
    }

    /**
     * Update user information in header
     */
    updateUserInfo() {
        const userAvatar = document.getElementById('user-avatar');
        if (!userAvatar) return;

        if (window.userSession && window.userSession.isAuthenticated()) {
            const user = window.userSession.getCurrentUser();
            userAvatar.textContent = user.avatar;
            userAvatar.title = `${user.name} (${window.userSession.getRoleInfo().name})`;
        } else {
            userAvatar.textContent = '?';
            userAvatar.title = 'Chưa đăng nhập';
        }
    }

    /**
     * Update active navigation states
     */
    updateActiveStates() {
        const currentPage = this.getCurrentPage();
        const userRole = window.userSession ? window.userSession.getUserRole() : null;
        const navigationItems = this.navigationData.get(userRole) || [];

        // Remove all active classes
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Find and set active navigation item
        navigationItems.forEach(item => {
            if (item.active.includes(currentPage)) {
                const selector = `[data-page="${item.url}"]`;
                document.querySelectorAll(selector).forEach(link => {
                    link.classList.add('active');
                });
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const mobileNav = document.getElementById('mobile-nav');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        
        if (mobileNav && mobileToggle) {
            mobileNav.classList.add('active');
            mobileToggle.classList.add('active');
            this.mobileMenuOpen = true;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const mobileNav = document.getElementById('mobile-nav');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        
        if (mobileNav && mobileToggle) {
            mobileNav.classList.remove('active');
            mobileToggle.classList.remove('active');
            this.mobileMenuOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    /**
     * Navigate to home based on user role
     */
    navigateToHome() {
        const userRole = window.userSession ? window.userSession.getUserRole() : null;
        
        let homeUrl = '02-dashboard-european.html'; // Default
        
        switch (userRole) {
            case 'fleet_owner':
                homeUrl = '03-dashboard-fleet-european.html';
                break;
            case 'admin':
                homeUrl = '05-admin-european.html';
                break;
            default:
                homeUrl = '02-dashboard-european.html';
        }
        
        window.location.href = homeUrl;
    }

    /**
     * Show notifications
     */
    showNotifications() {
        window.location.href = '15-notifications-european.html';
    }

    /**
     * Toggle user menu (placeholder for dropdown)
     */
    toggleUserMenu() {
        // For now, navigate to profile settings
        window.location.href = '14-profile-settings-european.html';
    }

    /**
     * Handle search input
     */
    handleSearch(query) {
        // Implement search suggestions/autocomplete here
        console.log('Searching for:', query);
    }

    /**
     * Execute search
     */
    executeSearch(query) {
        if (query.trim()) {
            // Implement search functionality
            console.log('Executing search for:', query);
            // Could navigate to search results page
        }
    }

    /**
     * Show login prompt for unauthenticated users
     */
    showLoginPrompt() {
        const navMenu = document.getElementById('nav-menu');
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        
        if (navMenu) {
            navMenu.innerHTML = `
                <li class="nav-item">
                    <a href="01-login-european.html" class="nav-link">
                        <span class="nav-icon">🔐</span>
                        <span>Đăng nhập</span>
                    </a>
                </li>
            `;
        }
        
        if (mobileNavMenu) {
            mobileNavMenu.innerHTML = `
                <li class="mobile-nav-item">
                    <a href="01-login-european.html" class="mobile-nav-link">
                        <span class="nav-icon">🔐</span>
                        <span>Đăng nhập</span>
                    </a>
                </li>
            `;
        }

        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.textContent = '?';
            userAvatar.title = 'Chưa đăng nhập';
        }
    }

    /**
     * Get current page filename
     */
    getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    /**
     * Get navigation data for role
     */
    getNavigationForRole(role) {
        return this.navigationData.get(role) || [];
    }

    /**
     * Add custom navigation item
     */
    addNavigationItem(role, item) {
        if (!this.navigationData.has(role)) {
            this.navigationData.set(role, []);
        }
        this.navigationData.get(role).push(item);
    }

    /**
     * Update notification count
     */
    updateNotificationCount(count) {
        const badge = document.getElementById('notification-count');
        if (badge) {
            badge.textContent = count || '0';
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}

// Create global instance
window.navigationManager = new NavigationManager();

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager.updateNavigation();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}