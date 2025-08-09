/**
 * Breadcrumb Navigation Management for Circling Logistics
 * Handles dynamic breadcrumb generation and navigation
 */

class BreadcrumbManager {
    constructor() {
        this.breadcrumbContainer = null;
        this.breadcrumbData = new Map();
        this.currentPath = [];
        this.init();
    }

    /**
     * Initialize breadcrumb manager
     */
    init() {
        this.setupBreadcrumbRoutes();
        this.createBreadcrumbContainer();
        this.updateBreadcrumb();
    }

    /**
     * Create breadcrumb container if it doesn't exist
     */
    createBreadcrumbContainer() {
        let container = document.querySelector('.breadcrumb-container');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'breadcrumb-container';
            container.innerHTML = `
                <div class="container">
                    <nav aria-label="Breadcrumb">
                        <ol class="breadcrumb" id="breadcrumb-list">
                        </ol>
                    </nav>
                </div>
            `;
            
            // Insert after header
            const header = document.querySelector('.main-header');
            if (header) {
                header.insertAdjacentElement('afterend', container);
            } else {
                document.body.insertBefore(container, document.body.firstChild);
            }
        }
        
        this.breadcrumbContainer = container.querySelector('#breadcrumb-list');
    }

    /**
     * Setup breadcrumb route definitions
     */
    setupBreadcrumbRoutes() {
        this.breadcrumbData.set('01-login-european.html', {
            title: 'Đăng nhập',
            titleEn: 'Login',
            icon: '🔐',
            parent: null
        });

        // Dashboard routes
        this.breadcrumbData.set('02-dashboard-european.html', {
            title: 'Trang chủ',
            titleEn: 'Dashboard',
            icon: '🏠',
            parent: null,
            role: 'cargo_owner'
        });

        this.breadcrumbData.set('03-dashboard-fleet-european.html', {
            title: 'Trang chủ',
            titleEn: 'Dashboard',
            icon: '🏠',
            parent: null,
            role: 'fleet_owner'
        });

        this.breadcrumbData.set('05-admin-european.html', {
            title: 'Quản trị',
            titleEn: 'Admin Dashboard',
            icon: '⚙️',
            parent: null,
            role: 'admin'
        });

        // Order management routes
        this.breadcrumbData.set('07-orders-european.html', {
            title: 'Đơn hàng',
            titleEn: 'Orders',
            icon: '📦',
            parent: this.getDashboardForRole(),
            role: ['cargo_owner', 'fleet_owner']
        });

        this.breadcrumbData.set('08-order-details-european.html', {
            title: 'Chi tiết đơn hàng',
            titleEn: 'Order Details',
            icon: '📋',
            parent: '07-orders-european.html'
        });

        this.breadcrumbData.set('09-create-order-european.html', {
            title: 'Tạo đơn mới',
            titleEn: 'Create Order',
            icon: '➕',
            parent: '07-orders-european.html',
            role: 'cargo_owner'
        });

        this.breadcrumbData.set('10-bidding-european.html', {
            title: 'Đấu giá',
            titleEn: 'Bidding',
            icon: '🏷️',
            parent: '07-orders-european.html',
            role: 'fleet_owner'
        });

        // Payment routes
        this.breadcrumbData.set('11-payment-methods-european.html', {
            title: 'Phương thức thanh toán',
            titleEn: 'Payment Methods',
            icon: '💳',
            parent: '08-order-details-european.html',
            role: 'cargo_owner'
        });

        this.breadcrumbData.set('12-payment-confirmation-european.html', {
            title: 'Xác nhận thanh toán',
            titleEn: 'Payment Confirmation',
            icon: '✅',
            parent: '11-payment-methods-european.html',
            role: 'cargo_owner'
        });

        this.breadcrumbData.set('13-payment-success-european.html', {
            title: 'Thanh toán thành công',
            titleEn: 'Payment Success',
            icon: '🎉',
            parent: '12-payment-confirmation-european.html',
            role: 'cargo_owner'
        });

        // Profile and settings routes
        this.breadcrumbData.set('14-profile-settings-european.html', {
            title: 'Cài đặt tài khoản',
            titleEn: 'Profile Settings',
            icon: '👤',
            parent: this.getDashboardForRole()
        });

        this.breadcrumbData.set('15-notifications-european.html', {
            title: 'Thông báo',
            titleEn: 'Notifications',
            icon: '🔔',
            parent: this.getDashboardForRole()
        });

        this.breadcrumbData.set('16-help-support-european.html', {
            title: 'Hỗ trợ',
            titleEn: 'Help & Support',
            icon: '❓',
            parent: this.getDashboardForRole()
        });

        // Fleet management routes
        this.breadcrumbData.set('17-vehicle-management-european.html', {
            title: 'Quản lý đội xe',
            titleEn: 'Vehicle Management',
            icon: '🚛',
            parent: '03-dashboard-fleet-european.html',
            role: 'fleet_owner'
        });

        this.breadcrumbData.set('18-driver-management-european.html', {
            title: 'Quản lý tài xế',
            titleEn: 'Driver Management',
            icon: '👤',
            parent: '03-dashboard-fleet-european.html',
            role: 'fleet_owner'
        });

        // Additional search route
        this.breadcrumbData.set('19-cargo-search-european.html', {
            title: 'Tìm hàng',
            titleEn: 'Find Cargo',
            icon: '🔍',
            parent: '03-dashboard-fleet-european.html',
            role: 'fleet_owner'
        });
    }

    /**
     * Get dashboard route based on current user role
     */
    getDashboardForRole() {
        if (!window.userSession) return '02-dashboard-european.html';
        
        const role = window.userSession.getUserRole();
        switch (role) {
            case 'fleet_owner':
                return '03-dashboard-fleet-european.html';
            case 'admin':
                return '05-admin-european.html';
            default:
                return '02-dashboard-european.html';
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
     * Build breadcrumb path for current page
     */
    buildBreadcrumbPath(currentPage = null) {
        const page = currentPage || this.getCurrentPage();
        const path = [];
        let current = page;

        // Build path by following parent relationships
        while (current && this.breadcrumbData.has(current)) {
            const data = this.breadcrumbData.get(current);
            
            // Check role permissions
            if (this.hasRoleAccess(data)) {
                path.unshift({
                    page: current,
                    ...data
                });
            }
            
            current = data.parent;
        }

        // Always add home if not already present
        if (path.length === 0 || path[0].page !== this.getDashboardForRole()) {
            const dashboardPage = this.getDashboardForRole();
            if (this.breadcrumbData.has(dashboardPage)) {
                const dashboardData = this.breadcrumbData.get(dashboardPage);
                path.unshift({
                    page: dashboardPage,
                    ...dashboardData
                });
            }
        }

        return path;
    }

    /**
     * Check if user has role access to a breadcrumb item
     */
    hasRoleAccess(data) {
        if (!data.role) return true;
        if (!window.userSession) return true;
        
        const userRole = window.userSession.getUserRole();
        if (!userRole) return true;
        
        if (Array.isArray(data.role)) {
            return data.role.includes(userRole);
        }
        
        return data.role === userRole;
    }

    /**
     * Update breadcrumb display
     */
    updateBreadcrumb() {
        if (!this.breadcrumbContainer) {
            this.createBreadcrumbContainer();
        }

        const path = this.buildBreadcrumbPath();
        this.currentPath = path;
        
        this.breadcrumbContainer.innerHTML = '';

        path.forEach((item, index) => {
            const isLast = index === path.length - 1;
            const listItem = document.createElement('li');
            listItem.className = 'breadcrumb-item';

            if (isLast) {
                // Current page - not clickable
                listItem.innerHTML = `
                    <span class="breadcrumb-current">
                        <span class="nav-icon">${item.icon}</span>
                        ${item.title}
                    </span>
                `;
            } else {
                // Clickable breadcrumb item
                listItem.innerHTML = `
                    <a href="${item.page}" class="breadcrumb-link">
                        <span class="nav-icon">${item.icon}</span>
                        ${item.title}
                    </a>
                    <span class="breadcrumb-separator">›</span>
                `;
            }

            this.breadcrumbContainer.appendChild(listItem);
        });

        // Add fade-in animation
        this.breadcrumbContainer.classList.add('fade-in');
    }

    /**
     * Navigate to specific breadcrumb level
     */
    navigateTo(page) {
        if (this.breadcrumbData.has(page)) {
            window.location.href = page;
        }
    }

    /**
     * Get breadcrumb data for a specific page
     */
    getBreadcrumbData(page) {
        return this.breadcrumbData.get(page);
    }

    /**
     * Add custom breadcrumb route
     */
    addRoute(page, data) {
        this.breadcrumbData.set(page, data);
    }

    /**
     * Remove breadcrumb route
     */
    removeRoute(page) {
        this.breadcrumbData.delete(page);
    }

    /**
     * Update breadcrumb for dynamic content
     */
    updateDynamicBreadcrumb(title, titleEn = null) {
        const currentPage = this.getCurrentPage();
        if (this.breadcrumbData.has(currentPage)) {
            const data = this.breadcrumbData.get(currentPage);
            data.title = title;
            if (titleEn) {
                data.titleEn = titleEn;
            }
            this.updateBreadcrumb();
        }
    }

    /**
     * Show/hide breadcrumb container
     */
    setVisible(visible) {
        const container = document.querySelector('.breadcrumb-container');
        if (container) {
            container.style.display = visible ? 'block' : 'none';
        }
    }

    /**
     * Get current breadcrumb path
     */
    getCurrentPath() {
        return this.currentPath;
    }
}

// Create global instance
window.breadcrumbManager = new BreadcrumbManager();

// Auto-update breadcrumb when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.breadcrumbManager.updateBreadcrumb();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BreadcrumbManager;
}