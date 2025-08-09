/**
 * User Session Management for Circling Logistics
 * Handles user authentication, role management, and session persistence
 */

class UserSession {
    constructor() {
        this.storageKey = 'circling_user_session';
        this.currentUser = null;
        this.eventListeners = new Map();
        this.init();
    }

    /**
     * Initialize session management
     */
    init() {
        this.loadSession();
        this.setupEventListeners();
    }

    /**
     * Set up event listeners for session management
     */
    setupEventListeners() {
        // Listen for storage changes (for multi-tab session sync)
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.loadSession();
                this.emit('sessionChanged', this.currentUser);
            }
        });

        // Listen for beforeunload to update session timestamp
        window.addEventListener('beforeunload', () => {
            if (this.currentUser) {
                this.updateLastActivity();
            }
        });
    }

    /**
     * Load session from localStorage
     */
    loadSession() {
        try {
            const sessionData = localStorage.getItem(this.storageKey);
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                
                // Check if session is still valid (24 hours)
                const now = new Date().getTime();
                const sessionAge = now - parsed.lastActivity;
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours
                
                if (sessionAge < maxAge) {
                    this.currentUser = parsed;
                    this.updateLastActivity();
                } else {
                    this.clearSession();
                }
            }
        } catch (error) {
            console.error('Error loading session:', error);
            this.clearSession();
        }
    }

    /**
     * Save session to localStorage
     */
    saveSession() {
        try {
            if (this.currentUser) {
                localStorage.setItem(this.storageKey, JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }

    /**
     * Create a new user session
     */
    login(userData) {
        const user = {
            id: userData.id || this.generateUserId(),
            email: userData.email,
            name: userData.name,
            role: userData.role, // 'cargo_owner', 'fleet_owner', 'admin'
            avatar: userData.avatar || this.generateAvatar(userData.name),
            permissions: this.getRolePermissions(userData.role),
            loginTime: new Date().getTime(),
            lastActivity: new Date().getTime(),
            preferences: userData.preferences || {}
        };

        this.currentUser = user;
        this.saveSession();
        this.emit('login', user);
        
        return user;
    }

    /**
     * End user session
     */
    logout() {
        const user = this.currentUser;
        this.currentUser = null;
        this.clearSession();
        this.emit('logout', user);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Get current user data
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get user role
     */
    getUserRole() {
        return this.currentUser ? this.currentUser.role : null;
    }

    /**
     * Check if user has specific permission
     */
    hasPermission(permission) {
        if (!this.currentUser || !this.currentUser.permissions) {
            return false;
        }
        return this.currentUser.permissions.includes(permission);
    }

    /**
     * Check if user has specific role
     */
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    /**
     * Update user preferences
     */
    updatePreferences(preferences) {
        if (this.currentUser) {
            this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
            this.saveSession();
            this.emit('preferencesChanged', this.currentUser.preferences);
        }
    }

    /**
     * Update last activity timestamp
     */
    updateLastActivity() {
        if (this.currentUser) {
            this.currentUser.lastActivity = new Date().getTime();
            this.saveSession();
        }
    }

    /**
     * Clear session from localStorage
     */
    clearSession() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Get role-based permissions
     */
    getRolePermissions(role) {
        const permissions = {
            admin: [
                'manage_users',
                'manage_orders',
                'manage_vehicles',
                'manage_drivers',
                'view_analytics',
                'manage_settings',
                'manage_payments',
                'view_all_data'
            ],
            cargo_owner: [
                'create_orders',
                'view_orders',
                'edit_orders',
                'manage_payments',
                'view_order_tracking',
                'manage_profile'
            ],
            fleet_owner: [
                'view_available_orders',
                'bid_on_orders',
                'manage_vehicles',
                'manage_drivers',
                'view_earnings',
                'manage_profile'
            ]
        };

        return permissions[role] || [];
    }

    /**
     * Generate a unique user ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate avatar initials from name
     */
    generateAvatar(name) {
        if (!name) return '?';
        
        const names = name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        } else {
            return name.substr(0, 2).toUpperCase();
        }
    }

    /**
     * Get role display information
     */
    getRoleInfo(role = null) {
        const userRole = role || this.getUserRole();
        
        const roleInfo = {
            cargo_owner: {
                name: 'Chủ hàng',
                nameEn: 'Cargo Owner',
                color: 'primary',
                icon: '📦',
                description: 'Tạo và quản lý đơn hàng vận chuyển'
            },
            fleet_owner: {
                name: 'Chủ xe',
                nameEn: 'Fleet Owner', 
                color: 'orange',
                icon: '🚛',
                description: 'Quản lý đội xe và nhận đơn hàng'
            },
            admin: {
                name: 'Quản trị viên',
                nameEn: 'Administrator',
                color: 'green',
                icon: '⚙️',
                description: 'Quản lý hệ thống và người dùng'
            }
        };

        return roleInfo[userRole] || {
            name: 'Người dùng',
            nameEn: 'User',
            color: 'gray',
            icon: '👤',
            description: 'Người dùng hệ thống'
        };
    }

    /**
     * Event system for session changes
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Emit event to listeners
     */
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
    }

    /**
     * Demo login methods for testing
     */
    loginAsCargoOwner(name = 'John Doe', email = 'john@example.com') {
        return this.login({
            name,
            email,
            role: 'cargo_owner'
        });
    }

    loginAsFleetOwner(name = 'Jane Smith', email = 'jane@example.com') {
        return this.login({
            name,
            email,
            role: 'fleet_owner'
        });
    }

    loginAsAdmin(name = 'Admin User', email = 'admin@circling.com') {
        return this.login({
            name,
            email,
            role: 'admin'
        });
    }
}

// Create global instance
window.userSession = new UserSession();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserSession;
}