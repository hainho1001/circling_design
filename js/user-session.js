/**
 * CIRCLING LOGISTICS - USER SESSION MANAGEMENT
 * Session handling, role management, and user preferences
 */

class UserSessionController {
  constructor() {
    this.currentUser = null;
    this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    this.warningTimeout = 23 * 60 * 60 * 1000; // 23 hours
    this.autoSaveInterval = 30 * 1000; // 30 seconds
    this.sessionKey = 'circling_user_session';
    this.preferencesKey = 'circling_user_preferences';
    this.rememberKey = 'circling_remember_user';
    
    this.init();
  }

  /**
   * Initialize session management
   */
  init() {
    this.loadSession();
    this.setupSessionMonitoring();
    this.setupAutoSave();
    this.setupEventListeners();
    this.validateSession();
  }

  /**
   * Load existing session from storage
   */
  loadSession() {
    // Check session storage first
    const sessionData = sessionStorage.getItem(this.sessionKey);
    if (sessionData) {
      try {
        this.currentUser = JSON.parse(sessionData);
        this.validateSessionExpiry();
        return;
      } catch (error) {
        console.error('Error parsing session data:', error);
        this.clearSession();
      }
    }

    // Check for remembered user in localStorage
    const rememberData = localStorage.getItem(this.rememberKey);
    if (rememberData) {
      try {
        const remembered = JSON.parse(rememberData);
        if (this.isValidRememberedSession(remembered)) {
          this.restoreRememberedSession(remembered);
          return;
        }
      } catch (error) {
        console.error('Error parsing remembered session:', error);
        localStorage.removeItem(this.rememberKey);
      }
    }

    // No valid session found
    this.handleNoSession();
  }

  /**
   * Create new user session
   */
  createSession(userData, rememberMe = false) {
    const sessionData = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: this.generateAvatar(userData.name),
      permissions: this.getRolePermissions(userData.role),
      loginTime: Date.now(),
      lastActivity: Date.now(),
      sessionId: this.generateSessionId(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.currentUser = sessionData;
    this.saveSession();

    if (rememberMe) {
      this.saveRememberedSession();
    }

    this.loadUserPreferences();
    this.trackSessionStart();
    
    return sessionData;
  }

  /**
   * Save session to storage
   */
  saveSession() {
    if (this.currentUser) {
      this.currentUser.lastActivity = Date.now();
      sessionStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
    }
  }

  /**
   * Save remembered session to localStorage
   */
  saveRememberedSession() {
    if (this.currentUser) {
      const rememberData = {
        userId: this.currentUser.id,
        email: this.currentUser.email,
        rememberToken: this.generateRememberToken(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      };
      localStorage.setItem(this.rememberKey, JSON.stringify(rememberData));
    }
  }

  /**
   * Get role-based permissions
   */
  getRolePermissions(role) {
    const permissions = {
      shipper: [
        'orders:view', 'orders:create', 'orders:edit',
        'bidding:view', 'bidding:participate',
        'payments:view', 'payments:process',
        'tracking:view', 'analytics:view',
        'profile:edit', 'notifications:manage'
      ],
      fleet: [
        'orders:view', 'bidding:view', 'bidding:participate',
        'fleet:view', 'fleet:manage',
        'vehicles:view', 'vehicles:manage',
        'drivers:view', 'drivers:manage',
        'tracking:view', 'tracking:manage',
        'analytics:view', 'analytics:fleet',
        'financial:view', 'profile:edit',
        'notifications:manage'
      ],
      admin: [
        'admin:access', 'users:view', 'users:manage',
        'system:view', 'system:manage',
        'analytics:all', 'financial:all',
        'settings:manage', 'reports:all',
        'audit:view', 'permissions:manage'
      ]
    };

    return permissions[role] || [];
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission) {
    return this.currentUser?.permissions?.includes(permission) || false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasRole(roles) {
    if (typeof roles === 'string') {
      return this.currentUser?.role === roles;
    }
    return Array.isArray(roles) && roles.includes(this.currentUser?.role);
  }

  /**
   * Update user activity timestamp
   */
  updateActivity() {
    if (this.currentUser) {
      this.currentUser.lastActivity = Date.now();
      this.saveSession();
    }
  }

  /**
   * Validate session expiry
   */
  validateSessionExpiry() {
    if (!this.currentUser) return false;

    const now = Date.now();
    const lastActivity = this.currentUser.lastActivity || this.currentUser.loginTime;
    const timeSinceActivity = now - lastActivity;

    if (timeSinceActivity > this.sessionTimeout) {
      this.handleSessionExpired();
      return false;
    }

    if (timeSinceActivity > this.warningTimeout) {
      this.showSessionWarning();
    }

    return true;
  }

  /**
   * Handle session expiration
   */
  handleSessionExpired() {
    this.showNotification('Session expired. Please log in again.', 'warning');
    this.logout();
  }

  /**
   * Show session expiration warning
   */
  showSessionWarning() {
    const remaining = this.sessionTimeout - (Date.now() - this.currentUser.lastActivity);
    const minutes = Math.floor(remaining / (1000 * 60));
    
    this.showNotification(
      `Your session will expire in ${minutes} minutes. Click to extend.`,
      'warning',
      () => this.extendSession()
    );
  }

  /**
   * Extend current session
   */
  extendSession() {
    if (this.currentUser) {
      this.updateActivity();
      this.showNotification('Session extended successfully.', 'success');
    }
  }

  /**
   * Generate avatar initials
   */
  generateAvatar(name) {
    if (!name) return '??';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate remember token
   */
  generateRememberToken() {
    return 'rem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
  }

  /**
   * Get client IP address (simplified)
   */
  getClientIP() {
    // This would typically be done server-side
    return 'client_ip';
  }

  /**
   * Validate remembered session
   */
  isValidRememberedSession(remembered) {
    return remembered.expiresAt > Date.now() && 
           remembered.userId && 
           remembered.rememberToken;
  }

  /**
   * Restore session from remembered data
   */
  restoreRememberedSession(remembered) {
    // This would typically involve server validation
    // For demo purposes, we'll create a basic session
    const userData = {
      id: remembered.userId,
      email: remembered.email,
      name: 'Remembered User',
      role: 'shipper' // Default role
    };
    
    this.createSession(userData, false);
  }

  /**
   * Load user preferences
   */
  loadUserPreferences() {
    const preferencesData = localStorage.getItem(this.preferencesKey);
    if (preferencesData) {
      try {
        this.currentUser.preferences = JSON.parse(preferencesData);
      } catch (error) {
        console.error('Error loading preferences:', error);
        this.currentUser.preferences = this.getDefaultPreferences();
      }
    } else {
      this.currentUser.preferences = this.getDefaultPreferences();
    }
  }

  /**
   * Get default user preferences
   */
  getDefaultPreferences() {
    return {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        orderUpdates: true,
        biddingAlerts: true,
        systemMessages: true
      },
      dashboard: {
        layout: 'default',
        widgets: ['orders', 'analytics', 'notifications'],
        refreshInterval: 30000
      },
      privacy: {
        profileVisibility: 'contacts',
        trackingConsent: true,
        analyticsConsent: true
      }
    };
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences) {
    if (this.currentUser) {
      this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
      localStorage.setItem(this.preferencesKey, JSON.stringify(this.currentUser.preferences));
      this.saveSession();
      this.triggerPreferencesUpdate();
    }
  }

  /**
   * Setup session monitoring
   */
  setupSessionMonitoring() {
    // Monitor for user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    let activityTimeout;
    const handleActivity = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        this.updateActivity();
      }, 1000);
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Periodic session validation
    setInterval(() => {
      this.validateSession();
    }, 60000); // Check every minute
  }

  /**
   * Setup auto-save functionality
   */
  setupAutoSave() {
    setInterval(() => {
      if (this.currentUser) {
        this.saveSession();
      }
    }, this.autoSaveInterval);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActivity();
        this.validateSession();
      }
    });

    // Handle beforeunload
    window.addEventListener('beforeunload', () => {
      this.saveSession();
    });

    // Handle storage events (for multi-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === this.sessionKey) {
        this.handleSessionChange(e.newValue);
      }
    });
  }

  /**
   * Handle session changes from other tabs
   */
  handleSessionChange(newSessionData) {
    if (!newSessionData) {
      // Session was cleared in another tab
      this.logout();
    } else {
      try {
        this.currentUser = JSON.parse(newSessionData);
      } catch (error) {
        console.error('Error syncing session from other tab:', error);
      }
    }
  }

  /**
   * Validate current session
   */
  validateSession() {
    if (!this.currentUser) {
      this.handleNoSession();
      return false;
    }

    return this.validateSessionExpiry();
  }

  /**
   * Handle when no valid session exists
   */
  handleNoSession() {
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['01-login-european.html', '04-register-european.html', '06-home-page-european.html'];
    
    if (!publicPages.includes(currentPage)) {
      this.redirectToLogin();
    }
  }

  /**
   * Redirect to login page
   */
  redirectToLogin() {
    const currentUrl = window.location.href;
    const returnUrl = encodeURIComponent(currentUrl);
    window.location.href = `01-login-european.html?return=${returnUrl}`;
  }

  /**
   * Logout user
   */
  logout() {
    this.trackSessionEnd();
    this.clearSession();
    this.redirectToLogin();
  }

  /**
   * Clear all session data
   */
  clearSession() {
    this.currentUser = null;
    sessionStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.preferencesKey);
    // Keep remember token if user wants to be remembered
  }

  /**
   * Clear remember token
   */
  clearRememberToken() {
    localStorage.removeItem(this.rememberKey);
  }

  /**
   * Get current user data
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Update user profile
   */
  updateProfile(profileData) {
    if (this.currentUser) {
      Object.assign(this.currentUser, profileData);
      this.saveSession();
      this.triggerProfileUpdate();
    }
  }

  /**
   * Switch user role (for admin users)
   */
  switchRole(newRole) {
    if (this.hasPermission('admin:access') && this.currentUser) {
      this.currentUser.role = newRole;
      this.currentUser.permissions = this.getRolePermissions(newRole);
      this.saveSession();
      this.triggerRoleSwitch();
    }
  }

  /**
   * Track session start
   */
  trackSessionStart() {
    // This would typically send analytics data
    console.log('Session started:', {
      userId: this.currentUser?.id,
      role: this.currentUser?.role,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track session end
   */
  trackSessionEnd() {
    if (this.currentUser) {
      const sessionDuration = Date.now() - this.currentUser.loginTime;
      console.log('Session ended:', {
        userId: this.currentUser.id,
        duration: sessionDuration,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Show notification to user
   */
  showNotification(message, type = 'info', action = null) {
    // This would integrate with the notification system
    console.log(`${type.toUpperCase()}: ${message}`);
    
    if (action && typeof action === 'function') {
      // Add click handler for notification action
      setTimeout(action, 100);
    }
  }

  /**
   * Trigger preference update event
   */
  triggerPreferencesUpdate() {
    const event = new CustomEvent('userPreferencesUpdated', {
      detail: this.currentUser.preferences
    });
    document.dispatchEvent(event);
  }

  /**
   * Trigger profile update event
   */
  triggerProfileUpdate() {
    const event = new CustomEvent('userProfileUpdated', {
      detail: this.currentUser
    });
    document.dispatchEvent(event);
  }

  /**
   * Trigger role switch event
   */
  triggerRoleSwitch() {
    const event = new CustomEvent('userRoleSwitched', {
      detail: { role: this.currentUser.role, permissions: this.currentUser.permissions }
    });
    document.dispatchEvent(event);
  }

  /**
   * Get session info for debugging
   */
  getSessionInfo() {
    return {
      isLoggedIn: !!this.currentUser,
      user: this.currentUser,
      sessionAge: this.currentUser ? Date.now() - this.currentUser.loginTime : 0,
      timeSinceActivity: this.currentUser ? Date.now() - this.currentUser.lastActivity : 0
    };
  }
}

// Initialize session management when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.userSessionController = new UserSessionController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserSessionController;
}