// Circling Logistics - Application JavaScript
// Handles navigation, state management, and user interactions

class CirclingApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.init();
    }

    init() {
        this.loadUserSession();
        this.initNavigation();
        this.initMobileMenu();
        this.initForms();
        this.initPageSpecificFeatures();
        this.updateNavigationForRole();
    }

    // Session Management
    loadUserSession() {
        const userData = localStorage.getItem('circling_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.currentRole = this.currentUser.role;
        }
    }

    saveUserSession(user) {
        this.currentUser = user;
        this.currentRole = user.role;
        localStorage.setItem('circling_user', JSON.stringify(user));
        this.updateNavigationForRole();
    }

    logout() {
        this.currentUser = null;
        this.currentRole = null;
        localStorage.removeItem('circling_user');
        this.showNotification('Logged out successfully', 'success');
        window.location.href = '/';
    }

    // Navigation Management
    initNavigation() {
        // Handle navigation link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link') || e.target.matches('.btn[href]')) {
                const href = e.target.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                }
            }
        });

        // Update active navigation state
        this.updateActiveNavigation();
    }

    updateNavigationForRole() {
        const navbarNav = document.getElementById('navbarNav');
        const mobileNav = document.getElementById('mobileNav');
        
        if (!navbarNav) return;

        let navigationHTML = '';

        if (this.currentUser) {
            // Authenticated user navigation
            switch (this.currentRole) {
                case 'cargo':
                    navigationHTML = `
                        <li><a href="/dashboard/cargo-owner.html" class="nav-link">Dashboard</a></li>
                        <li><a href="/orders/create.html" class="nav-link">Create Order</a></li>
                        <li><a href="/orders/list.html" class="nav-link">My Orders</a></li>
                        <li><a href="/payment/methods.html" class="nav-link">Payment</a></li>
                        <li class="dropdown">
                            <a href="#" class="nav-link dropdown-toggle" id="userDropdown">
                                <img src="/assets/images/avatar-placeholder.png" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;">
                                ${this.currentUser.name}
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="/profile/settings.html" class="dropdown-item">Profile Settings</a></li>
                                <li><a href="/profile/notifications.html" class="dropdown-item">Notifications</a></li>
                                <li><a href="/profile/support.html" class="dropdown-item">Help & Support</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a href="#" class="dropdown-item" onclick="app.logout()">Logout</a></li>
                            </ul>
                        </li>
                    `;
                    break;
                case 'fleet':
                    navigationHTML = `
                        <li><a href="/dashboard/fleet-owner.html" class="nav-link">Dashboard</a></li>
                        <li><a href="/fleet/vehicles.html" class="nav-link">Vehicles</a></li>
                        <li><a href="/fleet/drivers.html" class="nav-link">Drivers</a></li>
                        <li><a href="/fleet/bidding.html" class="nav-link">Find Cargo</a></li>
                        <li class="dropdown">
                            <a href="#" class="nav-link dropdown-toggle" id="userDropdown">
                                <img src="/assets/images/avatar-placeholder.png" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;">
                                ${this.currentUser.name}
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="/profile/settings.html" class="dropdown-item">Profile Settings</a></li>
                                <li><a href="/profile/notifications.html" class="dropdown-item">Notifications</a></li>
                                <li><a href="/profile/support.html" class="dropdown-item">Help & Support</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a href="#" class="dropdown-item" onclick="app.logout()">Logout</a></li>
                            </ul>
                        </li>
                    `;
                    break;
                case 'admin':
                    navigationHTML = `
                        <li><a href="/admin/dashboard.html" class="nav-link">Admin Dashboard</a></li>
                        <li><a href="/admin/users.html" class="nav-link">Users</a></li>
                        <li><a href="/admin/orders.html" class="nav-link">Orders</a></li>
                        <li><a href="/admin/reports.html" class="nav-link">Reports</a></li>
                        <li class="dropdown">
                            <a href="#" class="nav-link dropdown-toggle" id="userDropdown">
                                <img src="/assets/images/avatar-placeholder.png" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;">
                                ${this.currentUser.name}
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="/profile/settings.html" class="dropdown-item">Profile Settings</a></li>
                                <li><a href="/profile/notifications.html" class="dropdown-item">Notifications</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a href="#" class="dropdown-item" onclick="app.logout()">Logout</a></li>
                            </ul>
                        </li>
                    `;
                    break;
            }
        } else {
            // Guest navigation
            navigationHTML = `
                <li><a href="#services" class="nav-link">Services</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
                <li><a href="/auth/login.html" class="nav-link">Login</a></li>
                <li><a href="/auth/register.html" class="btn btn-primary">Get Started</a></li>
            `;
        }

        navbarNav.innerHTML = navigationHTML;
        if (mobileNav) {
            const mobileNavUl = mobileNav.querySelector('.navbar-nav');
            if (mobileNavUl) {
                mobileNavUl.innerHTML = navigationHTML;
            }
        }
    }

    updateActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Mobile Menu
    initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');

        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
                const isActive = mobileNav.classList.contains('active');
                mobileMenuToggle.textContent = isActive ? '✕' : '☰';
                mobileMenuToggle.setAttribute('aria-expanded', isActive);
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                    mobileNav.classList.remove('active');
                    mobileMenuToggle.textContent = '☰';
                    mobileMenuToggle.setAttribute('aria-expanded', false);
                }
            });

            // Close mobile menu when clicking on a link
            mobileNav.addEventListener('click', (e) => {
                if (e.target.matches('.nav-link')) {
                    mobileNav.classList.remove('active');
                    mobileMenuToggle.textContent = '☰';
                    mobileMenuToggle.setAttribute('aria-expanded', false);
                }
            });
        }
    }

    // Form Handling
    initForms() {
        // Contact form
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Login form
        const loginForm = document.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Register form
        const registerForm = document.querySelector('#registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // Generic form validation
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', this.validateForm.bind(this));
        });
    }

    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Simulate form submission
        this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        e.target.reset();
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Simulate login (in real app, this would be an API call)
        if (email && password) {
            const mockUser = {
                id: 1,
                name: email.split('@')[0],
                email: email,
                role: this.getUserRoleFromURL() || 'cargo'
            };

            this.saveUserSession(mockUser);
            this.showNotification('Login successful!', 'success');
            
            // Redirect to appropriate dashboard
            setTimeout(() => {
                this.redirectToDashboard(mockUser.role);
            }, 1000);
        }
    }

    handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            role: formData.get('role') || this.getUserRoleFromURL() || 'cargo',
            company: formData.get('company')
        };

        // Simulate registration
        this.saveUserSession(userData);
        this.showNotification('Registration successful! Welcome to Circling Logistics.', 'success');
        
        setTimeout(() => {
            this.redirectToDashboard(userData.role);
        }, 1000);
    }

    getUserRoleFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('role');
    }

    redirectToDashboard(role) {
        const dashboardUrls = {
            cargo: '/dashboard/cargo-owner.html',
            fleet: '/dashboard/fleet-owner.html',
            admin: '/admin/dashboard.html'
        };
        
        window.location.href = dashboardUrls[role] || '/dashboard/cargo-owner.html';
    }

    validateForm(e) {
        const form = e.target;
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            this.clearFieldError(field);
            
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Page-specific Features
    initPageSpecificFeatures() {
        // Initialize based on current page
        const path = window.location.pathname;
        
        if (path.includes('dashboard')) {
            this.initDashboard();
        } else if (path.includes('orders')) {
            this.initOrderManagement();
        } else if (path.includes('fleet')) {
            this.initFleetManagement();
        } else if (path.includes('payment')) {
            this.initPaymentFlow();
        }
    }

    initDashboard() {
        // Dashboard-specific functionality
        this.loadDashboardData();
        this.initDashboardCharts();
    }

    initOrderManagement() {
        // Order management functionality
        this.loadOrders();
        this.initOrderFilters();
    }

    initFleetManagement() {
        // Fleet management functionality
        this.loadFleetData();
        this.initVehicleManagement();
    }

    initPaymentFlow() {
        // Payment flow functionality
        this.initPaymentMethods();
        this.initPaymentValidation();
    }

    // Utility Functions
    loadDashboardData() {
        // Simulate loading dashboard data
        const statsElements = document.querySelectorAll('.stat-value');
        statsElements.forEach((element, index) => {
            this.animateCounter(element, parseInt(element.textContent.replace(/[^0-9]/g, '')));
        });
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const suffix = element.textContent.replace(/[0-9,]/g, '');
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 20);
    }

    loadOrders() {
        // Simulate loading orders
        console.log('Loading orders...');
    }

    loadFleetData() {
        // Simulate loading fleet data
        console.log('Loading fleet data...');
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Authentication Guards
    requireAuth() {
        if (!this.currentUser) {
            this.showNotification('Please log in to access this page', 'warning');
            window.location.href = '/auth/login.html';
            return false;
        }
        return true;
    }

    requireRole(role) {
        if (!this.requireAuth()) return false;
        
        if (this.currentRole !== role) {
            this.showNotification('You don\'t have permission to access this page', 'error');
            this.redirectToDashboard(this.currentRole);
            return false;
        }
        return true;
    }
}

// Initialize the application
const app = new CirclingApp();

// Add some additional animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add custom CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        cursor: pointer;
    }
    
    .notification:hover {
        box-shadow: var(--shadow-lg);
    }
`;
document.head.appendChild(notificationStyles);