// Authentication Module
class Auth {
    constructor() {
        this.currentUser = null;
        this.authButtons = document.getElementById('authButtons');
        this.userProfile = document.getElementById('userProfile');
        this.userEmail = document.getElementById('userEmail');
        this.loginBtn = document.getElementById('loginBtn');
        this.signupBtn = document.getElementById('signupBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.authModal = document.getElementById('authModal');
        this.loginForm = document.getElementById('loginFormElement');
        this.signupForm = document.getElementById('signupFormElement');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.closeBtns = document.querySelectorAll('.close-btn');

        this.init();
    }

    init() {
        // Check if user is already logged in
        this.checkSession();

        // Event listeners
        this.loginBtn.addEventListener('click', () => this.openAuthModal('login'));
        this.signupBtn.addEventListener('click', () => this.openAuthModal('signup'));
        this.logoutBtn.addEventListener('click', () => this.logout());

        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Close modal
        this.closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Form submissions
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        this.signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.authModal) {
                this.closeModal();
            }
        });
    }

    async checkSession() {
        try {
            console.log('Checking session...');
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Session error:', error);
                throw error;
            }

            console.log('Session data:', data);

            if (data.session) {
                this.currentUser = data.session.user;
                console.log('User authenticated:', this.currentUser);
                this.updateUI(true);
            } else {
                console.log('No active session');
                this.currentUser = null;
                this.updateUI(false);
            }
        } catch (error) {
            console.error('Error checking session:', error);
            this.currentUser = null;
            this.updateUI(false);
        }
    }

    updateUI(isLoggedIn) {
        if (isLoggedIn && this.currentUser) {
            this.authButtons.classList.add('hidden');
            this.userProfile.classList.remove('hidden');
            this.userEmail.textContent = this.currentUser.email;

            // Enable save functionality
            document.getElementById('saveBtn').disabled = false;

            // Dispatch an event to notify the app that the user is logged in
            const event = new CustomEvent('userAuthenticated', {
                detail: { user: this.currentUser }
            });
            document.dispatchEvent(event);

            console.log('UI updated for logged in user:', this.currentUser.email);
        } else {
            this.authButtons.classList.remove('hidden');
            this.userProfile.classList.add('hidden');
            this.userEmail.textContent = '';

            // Disable save functionality for non-logged in users
            document.getElementById('saveBtn').disabled = true;

            // Dispatch an event to notify the app that the user is logged out
            const event = new CustomEvent('userLoggedOut');
            document.dispatchEvent(event);

            console.log('UI updated for logged out state');
        }
    }

    openAuthModal(tab) {
        this.authModal.classList.remove('hidden');
        this.switchTab(tab);
    }

    closeModal() {
        this.authModal.classList.add('hidden');
        this.loginForm.reset();
        this.signupForm.reset();
    }

    switchTab(tabName) {
        // Update tab buttons
        this.tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update tab contents
        this.tabContents.forEach(content => {
            if (content.id === `${tabName}Form`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log('Attempting login with email:', email);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            console.log('Login response:', { data, error });

            if (error) throw error;

            if (data && data.user) {
                this.currentUser = data.user;
                console.log('User logged in:', this.currentUser);
                this.updateUI(true);
                this.closeModal();
                showNotification('Logged in successfully!', 'success');
            } else {
                throw new Error('Login successful but user data is missing');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification(error.message || 'Login failed', 'error');
        }
    }

    async handleSignup() {
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        console.log('Attempting signup with email:', email);

        // Validate passwords match
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            console.log('Signup response:', { data, error });

            if (error) throw error;

            if (data) {
                console.log('Signup successful:', data);
                showNotification('Signup successful! Please check your email for verification.', 'success');
                this.switchTab('login');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showNotification(error.message || 'Signup failed', 'error');
        }
    }

    async logout() {
        try {
            console.log('Logging out user...');
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Logout API error:', error);
                throw error;
            }

            console.log('User logged out successfully');

            // Clear user data
            this.currentUser = null;

            // Update UI
            this.updateUI(false);

            showNotification('Logged out successfully!', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            showNotification(error.message || 'Logout failed', 'error');
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Helper function for notifications
function showNotification(message, type = 'info') {
    // This function will be implemented in app.js
    if (window.app && window.app.showNotification) {
        window.app.showNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}
