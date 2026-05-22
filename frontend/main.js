// 🔍 Environment Detection - Local या Production
function getBackendURL() {
    const hostname = window.location.hostname;
    
    // अगर localhost है तो local backend use करो
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }
    
    // Vercel पर हो तो production backend use करो
    return 'https://renver.onrender.com';
}

const BACKEND_URL = getBackendURL();
console.log('Backend URL:', BACKEND_URL);

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
                        console.log('✅ User already logged in:', data.user);
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
                    console.log('✅ Login successful!', this.user);
                } else {
                    this.errorMessage = data.error || 'Login failed';
                    console.error('❌ Login error:', this.errorMessage);
                }
            } catch (error) {
                this.errorMessage = 'Cannot connect to server: ' + error.message;
                console.error('❌ Network error:', error);
            } finally {
                this.isLoading = false;
            }
        },
        
        async handleLogout() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/logout`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    this.isAuthenticated = false;
                    this.user = null;
                    this.loginForm = { email: '', password: '' };
                    console.log('✅ Logged out successfully!');
                }
            } catch (error) {
                console.error('❌ Logout failed:', error);
            }
        }
    }
});
