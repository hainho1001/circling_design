/**
 * Circling Logistics Navigation System
 * Centralized navigation management for all pages
 */

class CirclingNavigation {
    constructor() {
        this.currentRole = this.getUserRole();
        this.currentPage = this.getCurrentPage();
        this.navigationConfig = this.getNavigationConfig();
        this.breadcrumbConfig = this.getBreadcrumbConfig();
        
        this.init();
    }

    /**
     * Initialize the navigation system
     */
    init() {
        this.createNavigation();
        this.createBreadcrumb();
        this.setupMobileToggle();
        this.setupPageTransitions();
        this.setActiveNavItems();
        this.setupRoleBasedStyling();
    }

    /**
     * Get user role from localStorage or URL parameter
     */
    getUserRole() {
        const urlParams = new URLSearchParams(window.location.search);
        const roleFromUrl = urlParams.get('role');
        
        if (roleFromUrl) {
            localStorage.setItem('userRole', roleFromUrl);
            return roleFromUrl;
        }
        
        return localStorage.getItem('userRole') || 'shipper';
    }

    /**
     * Get current page from URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.replace('.html', '').replace('-european', '');
    }

    /**
     * Navigation configuration for different roles
     */
    getNavigationConfig() {
        const configs = {
            shipper: [
                { id: 'home', label: 'Trang chủ', url: '06-home-page-european.html', icon: '🏠' },
                { id: 'dashboard', label: 'Bảng điều khiển', url: '02-dashboard-european.html', icon: '📊' },
                { id: 'orders', label: 'Đơn hàng', url: '07-orders-european.html', icon: '📦' },
                { id: 'create-order', label: 'Tạo đơn mới', url: '09-create-order-european.html', icon: '➕' },
                { id: 'bidding', label: 'Đấu giá', url: '10-bidding-european.html', icon: '🔨' },
                { id: 'payment', label: 'Thanh toán', url: '11-payment-methods-european.html', icon: '💳' }
            ],
            carrier: [
                { id: 'home', label: 'Trang chủ', url: '06-home-page-european.html', icon: '🏠' },
                { id: 'dashboard-fleet', label: 'Bảng điều khiển', url: '03-dashboard-fleet-european.html', icon: '📊' },
                { id: 'orders', label: 'Tìm hàng', url: '07-orders-european.html', icon: '🔍' },
                { id: 'vehicles', label: 'Quản lý xe', url: '17-vehicle-management-european.html', icon: '🚛' },
                { id: 'bidding', label: 'Đấu giá', url: '10-bidding-european.html', icon: '🔨' }
            ],
            admin: [
                { id: 'dashboard', label: 'Bảng điều khiển', url: '02-dashboard-european.html', icon: '📊' },
                { id: 'orders', label: 'Quản lý đơn hàng', url: '07-orders-european.html', icon: '📦' },
                { id: 'vehicles', label: 'Quản lý xe', url: '17-vehicle-management-european.html', icon: '🚛' },
                { id: 'users', label: 'Quản lý người dùng', url: '14-profile-settings-european.html', icon: '👥' }
            ]
        };
        
        return configs[this.currentRole] || configs.shipper;
    }

    /**
     * Breadcrumb configuration
     */
    getBreadcrumbConfig() {
        return {
            'home': [{ label: 'Trang chủ', url: '06-home-page-european.html' }],
            'dashboard': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Bảng điều khiển', url: '02-dashboard-european.html' }
            ],
            'dashboard-fleet': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Bảng điều khiển', url: '03-dashboard-fleet-european.html' }
            ],
            'orders': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Bảng điều khiển', url: this.currentRole === 'carrier' ? '03-dashboard-fleet-european.html' : '02-dashboard-european.html' },
                { label: this.currentRole === 'carrier' ? 'Tìm hàng' : 'Đơn hàng', url: '07-orders-european.html' }
            ],
            'order-details': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Đơn hàng', url: '07-orders-european.html' },
                { label: 'Chi tiết đơn hàng', url: '08-order-details-european.html' }
            ],
            'create-order': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Đơn hàng', url: '07-orders-european.html' },
                { label: 'Tạo đơn mới', url: '09-create-order-european.html' }
            ],
            'bidding': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Đấu giá', url: '10-bidding-european.html' }
            ],
            'payment-methods': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Thanh toán', url: '11-payment-methods-european.html' }
            ],
            'vehicle-management': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Quản lý xe', url: '17-vehicle-management-european.html' }
            ],
            'profile-settings': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Cài đặt', url: '14-profile-settings-european.html' }
            ],
            'notifications': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Thông báo', url: '15-notifications-european.html' }
            ],
            'help-support': [
                { label: 'Trang chủ', url: '06-home-page-european.html' },
                { label: 'Hỗ trợ', url: '16-help-support-european.html' }
            ]
        };
    }

    /**
     * Create navigation HTML
     */
    createNavigation() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;

        const navContainer = nav.querySelector('.nav-container') || document.createElement('div');
        navContainer.className = 'nav-container';

        // Brand
        const brand = document.createElement('a');
        brand.href = '06-home-page-european.html';
        brand.className = 'nav-brand';
        brand.textContent = 'Circling Logistics';

        // Mobile toggle
        const toggle = document.createElement('button');
        toggle.className = 'nav-toggle';
        toggle.innerHTML = '☰';
        toggle.setAttribute('aria-label', 'Toggle navigation');

        // Navigation menu
        const menu = document.createElement('ul');
        menu.className = 'nav-menu';

        this.navigationConfig.forEach(item => {
            const li = document.createElement('li');
            li.className = 'nav-item';

            const a = document.createElement('a');
            a.href = item.url;
            a.className = 'nav-link';
            a.innerHTML = `${item.icon} ${item.label}`;
            a.dataset.pageId = item.id;

            li.appendChild(a);
            menu.appendChild(li);
        });

        // Settings dropdown
        const settingsItem = document.createElement('li');
        settingsItem.className = 'nav-item';
        const settingsLink = document.createElement('a');
        settingsLink.href = '14-profile-settings-european.html';
        settingsLink.className = 'nav-link';
        settingsLink.innerHTML = '⚙️ Cài đặt';
        settingsItem.appendChild(settingsLink);
        menu.appendChild(settingsItem);

        navContainer.innerHTML = '';
        navContainer.appendChild(brand);
        navContainer.appendChild(menu);
        navContainer.appendChild(toggle);

        if (!nav.querySelector('.nav-container')) {
            nav.appendChild(navContainer);
        }
    }

    /**
     * Create breadcrumb navigation
     */
    createBreadcrumb() {
        let breadcrumbContainer = document.querySelector('.breadcrumb');
        
        if (!breadcrumbContainer) {
            breadcrumbContainer = document.createElement('nav');
            breadcrumbContainer.className = 'breadcrumb';
            
            // Insert after main navigation
            const mainNav = document.querySelector('.main-nav');
            if (mainNav && mainNav.nextSibling) {
                mainNav.parentNode.insertBefore(breadcrumbContainer, mainNav.nextSibling);
            } else if (mainNav) {
                mainNav.parentNode.appendChild(breadcrumbContainer);
            } else {
                document.body.insertBefore(breadcrumbContainer, document.body.firstChild);
            }
        }

        const container = document.createElement('div');
        container.className = 'breadcrumb-container';

        const list = document.createElement('ol');
        list.className = 'breadcrumb-list';

        const breadcrumbs = this.breadcrumbConfig[this.currentPage] || [
            { label: 'Trang chủ', url: '06-home-page-european.html' }
        ];

        breadcrumbs.forEach((crumb, index) => {
            const item = document.createElement('li');
            item.className = 'breadcrumb-item';

            if (index < breadcrumbs.length - 1) {
                const link = document.createElement('a');
                link.href = crumb.url;
                link.className = 'breadcrumb-link';
                link.textContent = crumb.label;
                item.appendChild(link);

                // Add separator
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = '›';
                item.appendChild(separator);
            } else {
                const current = document.createElement('span');
                current.className = 'breadcrumb-current';
                current.textContent = crumb.label;
                item.appendChild(current);
            }

            list.appendChild(item);
        });

        container.appendChild(list);
        breadcrumbContainer.innerHTML = '';
        breadcrumbContainer.appendChild(container);
    }

    /**
     * Setup mobile navigation toggle
     */
    setupMobileToggle() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('show');
                toggle.setAttribute('aria-expanded', menu.classList.contains('show'));
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('show');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    /**
     * Setup page transitions with loading states
     */
    setupPageTransitions() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.isInternalLink(link.href)) {
                this.showLoadingState();
            }
        });

        // Hide loading state when page loads
        window.addEventListener('load', () => {
            this.hideLoadingState();
        });
    }

    /**
     * Check if link is internal
     */
    isInternalLink(href) {
        try {
            const url = new URL(href, window.location.origin);
            return url.origin === window.location.origin && 
                   (href.includes('-european.html') || href.includes('.html'));
        } catch {
            return false;
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        document.body.classList.add('loading');
        
        // Add loading spinner to nav
        const nav = document.querySelector('.nav-container');
        if (nav) {
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.id = 'nav-loading-spinner';
            nav.appendChild(spinner);
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        document.body.classList.remove('loading');
        
        // Remove loading spinner
        const spinner = document.getElementById('nav-loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    /**
     * Set active navigation items
     */
    setActiveNavItems() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            const currentHref = window.location.pathname.split('/').pop();
            
            if (href === currentHref || 
                (link.dataset.pageId && link.dataset.pageId === this.currentPage)) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Setup role-based styling
     */
    setupRoleBasedStyling() {
        document.body.className = document.body.className
            .replace(/role-\w+/g, '') + ` role-${this.currentRole}`;
    }

    /**
     * Navigate to page with role parameter
     */
    navigateToPage(url, options = {}) {
        const urlObj = new URL(url, window.location.origin);
        urlObj.searchParams.set('role', this.currentRole);
        
        if (options.replace) {
            window.location.replace(urlObj.toString());
        } else {
            window.location.href = urlObj.toString();
        }
    }

    /**
     * Update navigation for role change
     */
    updateNavigationForRole(newRole) {
        this.currentRole = newRole;
        localStorage.setItem('userRole', newRole);
        this.navigationConfig = this.getNavigationConfig();
        this.breadcrumbConfig = this.getBreadcrumbConfig();
        
        this.createNavigation();
        this.createBreadcrumb();
        this.setActiveNavItems();
        this.setupRoleBasedStyling();
    }

    /**
     * Get navigation history for back button
     */
    getNavigationHistory() {
        const history = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
        return history;
    }

    /**
     * Add current page to navigation history
     */
    addToHistory() {
        const history = this.getNavigationHistory();
        const currentEntry = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now()
        };

        // Remove if already exists and add to end
        const filtered = history.filter(item => item.url !== currentEntry.url);
        filtered.push(currentEntry);

        // Keep only last 10 entries
        const updated = filtered.slice(-10);
        localStorage.setItem('navigationHistory', JSON.stringify(updated));
    }

    /**
     * Go back to previous page
     */
    goBack() {
        const history = this.getNavigationHistory();
        if (history.length > 1) {
            // Remove current page and go to previous
            history.pop();
            const previous = history[history.length - 1];
            if (previous) {
                window.location.href = previous.url;
                return;
            }
        }
        
        // Fallback to browser back or home
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.navigateToPage('06-home-page-european.html');
        }
    }
}

// Initialize navigation system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.circlingNav = new CirclingNavigation();
    
    // Add current page to history
    window.circlingNav.addToHistory();
});

// Utility functions for external use
window.CirclingNavUtils = {
    changeRole: (role) => {
        if (window.circlingNav) {
            window.circlingNav.updateNavigationForRole(role);
        }
    },
    
    navigateTo: (url) => {
        if (window.circlingNav) {
            window.circlingNav.navigateToPage(url);
        }
    },
    
    goBack: () => {
        if (window.circlingNav) {
            window.circlingNav.goBack();
        }
    }
};