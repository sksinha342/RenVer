// Simple test to verify Vue is working
console.log('Main.js loaded successfully!');
console.log('Vue version:', typeof Vue);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Vue...');
    
    // Check if Vue is available
    if (typeof Vue === 'undefined') {
        console.error('Vue is not loaded!');
        document.body.innerHTML = '<h1 style="color:red">Error: Vue.js not loaded. Check CDN.</h1>';
        return;
    }
    
    // Initialize Vue app
    new Vue({
        el: '#app',
        data: {
            isAuthenticated: false,
            isLoading: false,
            user: null,
            loginForm: {
                email: '',
                password: ''
            },
            errorMessage: ''
        },
        mounted() {
            console.log('Vue app mounted!');
            this.checkAuthStatus();
        },
        methods: {
            async checkAuthStatus() {
                console.log('Checking auth status...');
                // For testing - just show login form
                this.isAuthenticated = false;
            },
            
            async handleLogin() {
                console.log('Login attempted with:', this.loginForm.email);
                this.isLoading = true;
                this.errorMessage = '';
                
                // Demo login - client side only for testing
                setTimeout(() => {
                    if (this.loginForm.email === 'admin@example.com' && this.loginForm.password === 'admin123') {
                        this.isAuthenticated = true;
                        this.user = { name: 'Admin User', email: this.loginForm.email };
                        this.errorMessage = '';
                        console.log('Login successful!');
                    } else if (this.loginForm.email === 'user@example.com' && this.loginForm.password === 'user123') {
                        this.isAuthenticated = true;
                        this.user = { name: 'Regular User', email: this.loginForm.email };
                        this.errorMessage = '';
                        console.log('Login successful!');
                    } else {
                        this.errorMessage = 'Invalid credentials. Use demo credentials.';
                        console.log('Login failed');
                    }
                    this.isLoading = false;
                }, 500);
            },
            
            async handleLogout() {
                this.isAuthenticated = false;
                this.user = null;
                this.loginForm = { email: '', password: '' };
                console.log('Logged out');
            }
        }
    });
});