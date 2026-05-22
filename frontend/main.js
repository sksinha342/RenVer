// Backend URL - Render production
const BACKEND_URL = 'https://renver.onrender.com';  // ✅ Render backend URL

new Vue({
    el: '#app',
    data: {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginForm: { email: '', password: '' },
        errorMessage: ''
    },
    mounted() {
        this.checkAuthStatus();
    },
    methods: {
        async checkAuthStatus() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/check-auth`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.authenticated) {
                        this.isAuthenticated = true;
                        this.user = data.user;
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        },
        
        async handleLogin() {
            this.isLoading = true;
            this.errorMessage = '';
            
            try {
                const response = await fetch(`${BACKEND_URL}/api/login`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.loginForm)
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    this.isAuthenticated = true;
                    this.user = data.user;
                    this.loginForm = { email: '', password: '' };
                } else {
                    this.errorMessage = data.error || 'Login failed';
                }
            } catch (error) {
                this.errorMessage = 'Cannot connect to server';
            } finally {
                this.isLoading = false;
            }
        },
        
        async handleLogout() {
            try {
                await fetch(`${BACKEND_URL}/api/logout`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                this.isAuthenticated = false;
                this.user = null;
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    }
});