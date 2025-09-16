// Java Learning Roadmap Application with Fixed Button Event Listeners
class JavaRoadmapApp {
    constructor() {
        this.roadmapData = [
            {
                "phase": "Phase 1: Getting Started",
                "topics": [
                    {"id": 1, "name": "Start with JDK & IDE", "description": "Install Java Development Kit and an Integrated Development Environment"},
                    {"id": 2, "name": "Learn Java Fundamentals", "description": "Basic syntax, program structure, and core concepts"},
                    {"id": 3, "name": "Version Control (Git & GitHub)", "description": "Learn version control systems for code management"},
                    {"id": 4, "name": "Practice Code Daily", "description": "Establish a consistent coding practice routine"}
                ]
            },
            {
                "phase": "Phase 2: Core Java Basics",
                "topics": [
                    {"id": 5, "name": "Variables, Data Types, Operators", "description": "Primitive data types, variables declaration, and operators"},
                    {"id": 6, "name": "Control Flow & Switch, Loops", "description": "if-else, switch statements, for/while loops"},
                    {"id": 7, "name": "Arrays & Strings", "description": "Array manipulation and String handling"},
                    {"id": 8, "name": "Object-Oriented Programming", "description": "OOP principles and concepts"},
                    {"id": 9, "name": "Classes & Objects", "description": "Class definition, object creation, and methods"},
                    {"id": 10, "name": "Data Structures & Algorithms", "description": "Basic data structures and algorithmic thinking"},
                    {"id": 11, "name": "Inheritance & Polymorphism", "description": "Inheritance relationships and polymorphic behavior"},
                    {"id": 12, "name": "Encapsulation & Abstraction", "description": "Data hiding and abstract concepts"}
                ]
            },
            {
                "phase": "Phase 3: Advanced Core Java",
                "topics": [
                    {"id": 13, "name": "Core Java APIs", "description": "Essential Java libraries and APIs"},
                    {"id": 14, "name": "Collections Framework", "description": "Lists, Sets, Maps and collection utilities"},
                    {"id": 15, "name": "Exception Handling", "description": "Try-catch blocks, custom exceptions, and error handling"},
                    {"id": 16, "name": "I/O Streams", "description": "File I/O, streams, and data persistence"},
                    {"id": 17, "name": "Multithreading", "description": "Thread creation, synchronization, and concurrent programming"},
                    {"id": 18, "name": "Master Concurrency", "description": "Advanced concurrency concepts and patterns"},
                    {"id": 19, "name": "Threads & Synchronization", "description": "Thread safety and synchronization mechanisms"},
                    {"id": 20, "name": "Executors & Futures", "description": "Thread pools and asynchronous programming"}
                ]
            },
            {
                "phase": "Phase 4: Java 8+ Features",
                "topics": [
                    {"id": 21, "name": "Advanced Java", "description": "Advanced Java concepts and best practices"},
                    {"id": 22, "name": "Lambda & Streams (Java 8+)", "description": "Functional programming with lambdas and streams"},
                    {"id": 23, "name": "Modern JDK & IDEs", "description": "IntelliJ, Eclipse, VSCode, and modern Java features"},
                    {"id": 24, "name": "Keep Learning & Join Community", "description": "Continuous learning and community engagement"}
                ]
            },
            {
                "phase": "Phase 5: Database & Web Development",
                "topics": [
                    {"id": 25, "name": "JDBC & Database Connectivity", "description": "Database connections and SQL operations"},
                    {"id": 26, "name": "Web Development", "description": "Web application development concepts"},
                    {"id": 27, "name": "Servlets & JSP", "description": "Server-side Java web technologies"},
                    {"id": 28, "name": "Spring Framework & Boot", "description": "Spring ecosystem for enterprise applications"},
                    {"id": 29, "name": "REST APIs & Microservices", "description": "RESTful services and microservice architecture"},
                    {"id": 30, "name": "Security - JWT, OAuth", "description": "Web application security and authentication"}
                ]
            },
            {
                "phase": "Phase 6: Build Tools & Testing",
                "topics": [
                    {"id": 31, "name": "Maven", "description": "Maven build tool and dependency management"},
                    {"id": 32, "name": "Gradle", "description": "Gradle build automation"},
                    {"id": 33, "name": "Build Tools", "description": "General build and deployment tools"},
                    {"id": 34, "name": "Testing", "description": "Unit testing and test-driven development"},
                    {"id": 35, "name": "Mockito", "description": "Mocking framework for unit tests"},
                    {"id": 36, "name": "DevOps & Deployment", "description": "Deployment strategies and DevOps practices"}
                ]
            },
            {
                "phase": "Phase 7: Advanced Topics & Tools",
                "topics": [
                    {"id": 37, "name": "Docker", "description": "Containerization with Docker"},
                    {"id": 38, "name": "Kubernetes", "description": "Container orchestration and deployment"},
                    {"id": 39, "name": "CI/CD - Jenkins, GitHub Actions", "description": "Continuous integration and deployment pipelines"},
                    {"id": 40, "name": "Cloud Platforms - AWS, Azure, GCP", "description": "Cloud services and deployment"}
                ]
            }
        ];

        // Simulated user database with test users
        this.users = new Map([
            ['test@example.com', {
                id: 'user1',
                email: 'test@example.com',
                hashedPassword: this.hashPassword('Test123!'),
                profile: { name: 'Test User', joinDate: '2024-01-15' },
                progress: { topicStatuses: new Map([[1, 'completed'], [2, 'completed'], [3, 'learning']]), completedTopics: 2, totalTopics: 40 }
            }],
            ['demo@example.com', {
                id: 'user2',
                email: 'demo@example.com',
                hashedPassword: this.hashPassword('Password123'),
                profile: { name: 'Demo User', joinDate: '2024-01-10' },
                progress: { topicStatuses: new Map([[1, 'completed'], [2, 'learning']]), completedTopics: 1, totalTopics: 40 }
            }]
        ]);

        // Application state
        this.currentUser = null;
        this.currentPage = 'landing';
        this.topicStatuses = new Map();
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.selectedTopicId = null;
        
        this.statusIcons = {
            'pending': '⏳',
            'learning': '📚',
            'onhold': '⏸️',
            'completed': '✅',
            'ignore': '❌'
        };

        this.init();
    }

    init() {
        console.log('🚀 Java Roadmap App initializing...');
        this.checkExistingSession();
        this.bindEvents();
        this.updateNavigation();
        this.showCurrentPage();
        console.log('✅ App initialization complete');
    }

    // Authentication Methods
    checkExistingSession() {
        const sessionData = sessionStorage.getItem('javaRoadmapSession');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                
                if (session.expiresAt > now) {
                    this.currentUser = this.users.get(session.email);
                    if (this.currentUser) {
                        this.currentPage = 'dashboard';
                        this.loadUserProgress();
                        return true;
                    }
                } else {
                    sessionStorage.removeItem('javaRoadmapSession');
                }
            } catch (e) {
                sessionStorage.removeItem('javaRoadmapSession');
            }
        }
        return false;
    }

    createSession(email, rememberMe = false) {
        const expirationTime = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const session = {
            email: email,
            expiresAt: new Date().getTime() + expirationTime,
            rememberMe: rememberMe
        };
        
        sessionStorage.setItem('javaRoadmapSession', JSON.stringify(session));
    }

    logout() {
        console.log('User logging out');
        sessionStorage.removeItem('javaRoadmapSession');
        this.currentUser = null;
        this.currentPage = 'landing';
        this.topicStatuses.clear();
        this.updateNavigation();
        this.showCurrentPage();
        this.showToast('Logged out successfully', 'success');
    }

    hashPassword(password) {
        // Simple hash simulation - in real app, use proper hashing
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        return {
            isValid: minLength && hasUpper && hasLower && hasNumber,
            minLength, hasUpper, hasLower, hasNumber,
            strength: this.getPasswordStrength(password)
        };
    }

    getPasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z\d]/.test(password)) score++;
        
        if (score < 3) return 'weak';
        if (score < 4) return 'medium';
        return 'strong';
    }

    // User Management
    registerUser(name, email, password) {
        if (this.users.has(email)) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: 'user_' + Date.now(),
            email: email,
            hashedPassword: this.hashPassword(password),
            profile: { name: name, joinDate: new Date().toISOString().split('T')[0] },
            progress: { topicStatuses: new Map(), completedTopics: 0, totalTopics: 40, lastUpdated: new Date() }
        };

        // Initialize all topics as pending
        this.roadmapData.forEach(phase => {
            phase.topics.forEach(topic => {
                newUser.progress.topicStatuses.set(topic.id, 'pending');
            });
        });

        this.users.set(email, newUser);
        return newUser;
    }

    authenticateUser(email, password) {
        const user = this.users.get(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const hashedInput = this.hashPassword(password);
        if (hashedInput !== user.hashedPassword) {
            throw new Error('Invalid email or password');
        }

        return user;
    }

    loadUserProgress() {
        if (!this.currentUser) return;
        
        this.topicStatuses.clear();
        for (const [topicId, status] of this.currentUser.progress.topicStatuses) {
            this.topicStatuses.set(topicId, status);
        }
    }

    saveUserProgress() {
        if (!this.currentUser) return;
        
        this.currentUser.progress.topicStatuses = new Map(this.topicStatuses);
        this.currentUser.progress.lastUpdated = new Date();
        
        const stats = this.calculateStats();
        this.currentUser.progress.completedTopics = stats.completed;
    }

    // Navigation and Page Management
    updateNavigation() {
        const navbarMenu = document.getElementById('navbarMenu');
        
        if (this.currentUser) {
            navbarMenu.innerHTML = `
                <span class="navbar__user">Welcome, ${this.currentUser.profile.name}</span>
                <button class="btn btn--outline btn--sm" onclick="window.javaRoadmapApp.logout()">Logout</button>
            `;
        } else {
            navbarMenu.innerHTML = `
                <button class="btn btn--outline btn--sm" onclick="window.javaRoadmapApp.showPage('login')">Login</button>
                <button class="btn btn--primary btn--sm" onclick="window.javaRoadmapApp.showPage('signup')">Sign Up</button>
            `;
        }
    }

    showPage(page) {
        console.log(`🎯 Navigating to page: ${page}`);
        this.currentPage = page;
        this.showCurrentPage();
    }

    showCurrentPage() {
        console.log(`📄 Showing page: ${this.currentPage}`);
        
        // Hide all sections
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('dashboardPage').classList.add('hidden');
        
        // Show current page
        switch (this.currentPage) {
            case 'landing':
                document.getElementById('landingPage').classList.remove('hidden');
                break;
            case 'login':
                document.getElementById('authContainer').classList.remove('hidden');
                document.getElementById('loginPage').classList.remove('hidden');
                document.getElementById('signupPage').classList.add('hidden');
                break;
            case 'signup':
                document.getElementById('authContainer').classList.remove('hidden');
                document.getElementById('loginPage').classList.add('hidden');
                document.getElementById('signupPage').classList.remove('hidden');
                break;
            case 'dashboard':
                if (this.currentUser) {
                    document.getElementById('dashboardPage').classList.remove('hidden');
                    this.renderRoadmap();
                    this.updateStats();
                    this.updateProgress();
                    document.getElementById('userName').textContent = this.currentUser.profile.name;
                } else {
                    this.currentPage = 'landing';
                    this.showCurrentPage();
                }
                break;
        }
    }

    // Event Binding - SIMPLIFIED AND FIXED
    bindEvents() {
        console.log('🔗 Binding event listeners...');

        // Landing page buttons - Use onclick for guaranteed execution
        const getStartedBtn = document.getElementById('getStartedBtn');
        if (getStartedBtn) {
            getStartedBtn.onclick = () => {
                console.log('✅ Get Started clicked');
                this.showPage('signup');
            };
        }

        const learnMoreBtn = document.getElementById('learnMoreBtn');
        if (learnMoreBtn) {
            learnMoreBtn.onclick = () => {
                console.log('✅ Learn More clicked');
                document.querySelector('.features')?.scrollIntoView({ behavior: 'smooth' });
            };
        }

        const signupCTA = document.getElementById('signupCTA');
        if (signupCTA) {
            signupCTA.onclick = () => {
                console.log('✅ Signup CTA clicked');
                this.showPage('signup');
            };
        }

        const loginCTA = document.getElementById('loginCTA');
        if (loginCTA) {
            loginCTA.onclick = () => {
                console.log('✅ Login CTA clicked');
                this.showPage('login');
            };
        }

        // Auth form switching
        const showSignupBtn = document.getElementById('showSignupBtn');
        if (showSignupBtn) {
            showSignupBtn.onclick = () => {
                console.log('✅ Show Signup clicked');
                this.showPage('signup');
            };
        }

        const showLoginBtn = document.getElementById('showLoginBtn');
        if (showLoginBtn) {
            showLoginBtn.onclick = () => {
                console.log('✅ Show Login clicked');
                this.showPage('login');
            };
        }

        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        if (forgotPasswordLink) {
            forgotPasswordLink.onclick = (e) => {
                e.preventDefault();
                this.showToast('Password reset feature coming soon!', 'info');
            };
        }

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                console.log('✅ Login form submitted');
                this.handleLogin();
            };
        }

        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.onsubmit = (e) => {
                e.preventDefault();
                console.log('✅ Signup form submitted');
                this.handleSignup();
            };
        }

        // Password strength checking
        const signupPassword = document.getElementById('signupPassword');
        if (signupPassword) {
            signupPassword.oninput = (e) => {
                this.updatePasswordStrength(e.target.value);
            };
        }

        // Dashboard/Roadmap events
        this.bindRoadmapEvents();

        // Toast close
        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.onclick = () => this.hideToast();
        }

        console.log('✅ All event listeners bound successfully');
    }

    bindRoadmapEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.oninput = (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndRenderTopics();
            };
        }

        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.status;
                this.filterAndRenderTopics();
            }
        });

        // Modal events
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.onclick = () => this.closeModal();
        }

        const modalBackdrop = document.querySelector('.modal__backdrop');
        if (modalBackdrop) {
            modalBackdrop.onclick = () => this.closeModal();
        }

        // Status selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.status-btn')) {
                const btn = e.target.closest('.status-btn');
                const status = btn.dataset.status;
                this.updateTopicStatus(this.selectedTopicId, status);
                this.closeModal();
            }
        });

        // Reset and export progress
        const resetProgress = document.getElementById('resetProgress');
        if (resetProgress) {
            resetProgress.onclick = () => {
                if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                    this.resetProgress();
                }
            };
        }

        const exportProgress = document.getElementById('exportProgress');
        if (exportProgress) {
            exportProgress.onclick = () => this.exportProgress();
        }

        // Phase toggle and topic clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.phase__header')) {
                const phase = e.target.closest('.phase');
                phase.classList.toggle('collapsed');
            }
            
            const topicCard = e.target.closest('.topic-card');
            if (topicCard) {
                const topicId = parseInt(topicCard.dataset.topicId);
                this.openStatusModal(topicId);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.hideToast();
            }
        });
    }

    // Authentication Handlers
    async handleLogin() {
        console.log('🔐 Handling login...');
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        this.clearFormErrors();
        
        if (!email || !password) {
            this.showFormError('loginFormError', 'Please fill in all fields');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showFormError('loginEmailError', 'Please enter a valid email address');
            return;
        }
        
        this.setFormLoading('loginSubmitBtn', true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.currentUser = this.authenticateUser(email, password);
            this.createSession(email, rememberMe);
            this.loadUserProgress();
            this.showPage('dashboard');
            this.updateNavigation();
            this.showToast(`Welcome back, ${this.currentUser.profile.name}!`, 'success');
            
        } catch (error) {
            this.showFormError('loginFormError', error.message);
            console.error('Login error:', error.message);
        } finally {
            this.setFormLoading('loginSubmitBtn', false);
        }
    }

    async handleSignup() {
        console.log('📝 Handling signup...');
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAccepted = document.getElementById('termsAccepted').checked;
        
        this.clearFormErrors();
        
        let hasErrors = false;
        
        if (!name) {
            this.showFormError('signupNameError', 'Full name is required');
            hasErrors = true;
        }
        
        if (!email) {
            this.showFormError('signupEmailError', 'Email is required');
            hasErrors = true;
        } else if (!this.validateEmail(email)) {
            this.showFormError('signupEmailError', 'Please enter a valid email address');
            hasErrors = true;
        }
        
        const passwordValidation = this.validatePassword(password);
        if (!password) {
            this.showFormError('signupPasswordError', 'Password is required');
            hasErrors = true;
        } else if (!passwordValidation.isValid) {
            this.showFormError('signupPasswordError', 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
            hasErrors = true;
        }
        
        if (password !== confirmPassword) {
            this.showFormError('confirmPasswordError', 'Passwords do not match');
            hasErrors = true;
        }
        
        if (!termsAccepted) {
            this.showFormError('termsError', 'You must accept the terms and conditions');
            hasErrors = true;
        }
        
        if (hasErrors) {
            console.log('❌ Signup validation errors found');
            return;
        }
        
        this.setFormLoading('createAccountBtn', true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.currentUser = this.registerUser(name, email, password);
            this.createSession(email, false);
            this.loadUserProgress();
            this.showPage('dashboard');
            this.updateNavigation();
            this.showToast(`Welcome to Java Roadmap, ${name}!`, 'success');
            console.log('✅ Signup successful for:', email);
            
        } catch (error) {
            this.showFormError('signupFormError', error.message);
            console.error('Signup error:', error.message);
        } finally {
            this.setFormLoading('createAccountBtn', false);
        }
    }

    updatePasswordStrength(password) {
        const strengthElement = document.getElementById('passwordStrength');
        if (!strengthElement) return;
        
        if (!password) {
            strengthElement.textContent = '';
            strengthElement.className = 'password-strength';
            return;
        }
        
        const validation = this.validatePassword(password);
        const requirements = [];
        
        if (!validation.minLength) requirements.push('8+ characters');
        if (!validation.hasUpper) requirements.push('uppercase letter');
        if (!validation.hasLower) requirements.push('lowercase letter');
        if (!validation.hasNumber) requirements.push('number');
        
        if (requirements.length === 0) {
            strengthElement.textContent = `✓ Strong password`;
            strengthElement.className = 'password-strength password-strength--strong';
        } else {
            strengthElement.textContent = `Missing: ${requirements.join(', ')}`;
            strengthElement.className = `password-strength password-strength--${validation.strength}`;
        }
    }

    // Form Utility Methods
    clearFormErrors() {
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    }

    showFormError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
        }
    }

    setFormLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        const textSpan = button.querySelector('.btn-text');
        const loadingSpan = button.querySelector('.btn-loading');
        
        button.disabled = loading;
        
        if (loading) {
            textSpan?.classList.add('hidden');
            loadingSpan?.classList.remove('hidden');
        } else {
            textSpan?.classList.remove('hidden');
            loadingSpan?.classList.add('hidden');
        }
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toastMessage');
        
        if (messageEl) messageEl.textContent = message;
        if (toast) {
            toast.className = `toast toast--${type}`;
            toast.classList.remove('hidden');
            
            setTimeout(() => this.hideToast(), 5000);
        }
    }

    hideToast() {
        document.getElementById('toast')?.classList.add('hidden');
    }

    // Roadmap Methods
    renderRoadmap() {
        if (!this.currentUser) return;
        
        const roadmapElement = document.getElementById('roadmap');
        if (!roadmapElement) return;
        
        roadmapElement.innerHTML = '';

        this.roadmapData.forEach((phase, index) => {
            const phaseElement = this.createPhaseElement(phase, index);
            roadmapElement.appendChild(phaseElement);
            
            this.renderTopicsForPhase(phase, index);
            this.updatePhaseProgress(phase, index);
        });
    }

    createPhaseElement(phase, index) {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = 'phase';
        phaseDiv.innerHTML = `
            <div class="phase__header">
                <div>
                    <h2 class="phase__title">
                        ${phase.phase}
                        <span class="phase__toggle">▼</span>
                    </h2>
                    <div class="phase__progress" id="phase-progress-${index}"></div>
                </div>
            </div>
            <div class="phase__content">
                <div class="topics-grid" id="phase-topics-${index}"></div>
            </div>
        `;
        return phaseDiv;
    }

    renderTopicsForPhase(phase, phaseIndex) {
        const topicsGrid = document.getElementById(`phase-topics-${phaseIndex}`);
        if (!topicsGrid) return;
        
        topicsGrid.innerHTML = '';
        const filteredTopics = this.filterTopics(phase.topics);
        
        filteredTopics.forEach(topic => {
            const topicCard = this.createTopicCard(topic);
            topicsGrid.appendChild(topicCard);
        });

        const phaseElement = topicsGrid.closest('.phase');
        if (phaseElement) {
            phaseElement.style.display = filteredTopics.length === 0 ? 'none' : 'block';
        }
    }

    createTopicCard(topic) {
        const status = this.topicStatuses.get(topic.id) || 'pending';
        const topicDiv = document.createElement('div');
        topicDiv.className = `topic-card topic-card--${status}`;
        topicDiv.dataset.topicId = topic.id;
        
        topicDiv.innerHTML = `
            <div class="topic-card__header">
                <h3 class="topic-card__title">${topic.name}</h3>
                <span class="topic-card__status">${this.statusIcons[status]}</span>
            </div>
            <p class="topic-card__description">${topic.description}</p>
        `;
        return topicDiv;
    }

    filterTopics(topics) {
        return topics.filter(topic => {
            const matchesSearch = this.searchTerm === '' || 
                topic.name.toLowerCase().includes(this.searchTerm) ||
                topic.description.toLowerCase().includes(this.searchTerm);
            
            const matchesFilter = this.currentFilter === 'all' || 
                (this.topicStatuses.get(topic.id) || 'pending') === this.currentFilter;
            
            return matchesSearch && matchesFilter;
        });
    }

    filterAndRenderTopics() {
        this.roadmapData.forEach((phase, index) => {
            this.renderTopicsForPhase(phase, index);
        });
    }

    openStatusModal(topicId) {
        this.selectedTopicId = topicId;
        const topic = this.findTopicById(topicId);
        
        if (!topic) return;
        
        document.getElementById('modalTitle').textContent = topic.name;
        document.getElementById('modalDescription').textContent = topic.description;
        document.getElementById('statusModal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('statusModal')?.classList.add('hidden');
        this.selectedTopicId = null;
    }

    updateTopicStatus(topicId, newStatus) {
        if (!topicId || !this.currentUser) return;
        
        const oldStatus = this.topicStatuses.get(topicId);
        this.topicStatuses.set(topicId, newStatus);
        
        this.saveUserProgress();
        this.filterAndRenderTopics();
        this.updateStats();
        this.updateProgress();
        this.updateAllPhaseProgress();
        
        this.checkMilestones(oldStatus, newStatus);
    }

    findTopicById(topicId) {
        for (const phase of this.roadmapData) {
            const topic = phase.topics.find(t => t.id === topicId);
            if (topic) return topic;
        }
        return null;
    }

    updateStats() {
        const stats = this.calculateStats();
        
        const completedEl = document.getElementById('completedCount');
        const learningEl = document.getElementById('learningCount');
        const totalEl = document.getElementById('totalCount');
        
        if (completedEl) completedEl.textContent = stats.completed;
        if (learningEl) learningEl.textContent = stats.learning;
        if (totalEl) totalEl.textContent = stats.total;
    }

    calculateStats() {
        const stats = { pending: 0, learning: 0, onhold: 0, completed: 0, ignore: 0, total: 0 };
        
        this.roadmapData.forEach(phase => {
            phase.topics.forEach(topic => {
                const status = this.topicStatuses.get(topic.id) || 'pending';
                stats[status]++;
                stats.total++;
            });
        });

        return stats;
    }

    updateProgress() {
        const stats = this.calculateStats();
        const completedPercentage = Math.round((stats.completed / stats.total) * 100);
        
        const progressEl = document.getElementById('progressPercentage');
        if (progressEl) progressEl.textContent = `${completedPercentage}%`;
        
        const circumference = 219.8;
        const offset = circumference - (completedPercentage / 100) * circumference;
        const progressCircle = document.getElementById('overallProgress');
        if (progressCircle) progressCircle.style.strokeDashoffset = offset;
    }

    updatePhaseProgress(phase, phaseIndex) {
        const phaseStats = { completed: 0, total: 0 };
        
        phase.topics.forEach(topic => {
            phaseStats.total++;
            if ((this.topicStatuses.get(topic.id) || 'pending') === 'completed') {
                phaseStats.completed++;
            }
        });

        const percentage = Math.round((phaseStats.completed / phaseStats.total) * 100);
        const progressElement = document.getElementById(`phase-progress-${phaseIndex}`);
        if (progressElement) {
            progressElement.textContent = `${phaseStats.completed}/${phaseStats.total} completed (${percentage}%)`;
        }
    }

    updateAllPhaseProgress() {
        this.roadmapData.forEach((phase, index) => {
            this.updatePhaseProgress(phase, index);
        });
    }

    checkMilestones(oldStatus, newStatus) {
        if (newStatus === 'completed' && oldStatus !== 'completed') {
            const stats = this.calculateStats();
            const milestones = [
                { count: 1, message: "Great start! You've completed your first topic!" },
                { count: 5, message: "Awesome! You've completed 5 topics!" },
                { count: 10, message: "Fantastic! You've completed 10 topics!" },
                { count: 20, message: "Incredible! You've completed 20 topics!" },
                { count: 30, message: "Outstanding! You've completed 30 topics!" },
                { count: 40, message: "Congratulations! You've completed the entire Java roadmap!" }
            ];

            const milestone = milestones.find(m => m.count === stats.completed);
            if (milestone) {
                this.showSuccessAnimation(milestone.message);
            }
        }
    }

    showSuccessAnimation(message) {
        const successMessage = document.getElementById('successMessage');
        const successAnimation = document.getElementById('successAnimation');
        
        if (successMessage && successAnimation) {
            successMessage.textContent = message;
            successAnimation.classList.remove('hidden');
            
            setTimeout(() => {
                successAnimation.classList.add('hidden');
            }, 3000);
        }
    }

    resetProgress() {
        if (!this.currentUser) return;
        
        this.topicStatuses.clear();
        this.roadmapData.forEach(phase => {
            phase.topics.forEach(topic => {
                this.topicStatuses.set(topic.id, 'pending');
            });
        });
        
        this.saveUserProgress();
        this.renderRoadmap();
        this.updateStats();
        this.updateProgress();
        this.updateAllPhaseProgress();
        this.showToast('Progress reset successfully', 'success');
    }

    exportProgress() {
        if (!this.currentUser) return;
        
        const progressData = {
            user: { name: this.currentUser.profile.name, email: this.currentUser.email, joinDate: this.currentUser.profile.joinDate },
            timestamp: new Date().toISOString(),
            roadmapVersion: "1.0",
            topicStatuses: Array.from(this.topicStatuses.entries()).map(([id, status]) => ({
                topicId: id, status: status, topicName: this.findTopicById(id)?.name
            })),
            statistics: this.calculateStats()
        };

        const blob = new Blob([JSON.stringify(progressData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `java-roadmap-progress-${this.currentUser.profile.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Progress exported successfully', 'success');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM fully loaded, initializing Java Roadmap App...');
    window.javaRoadmapApp = new JavaRoadmapApp();
    console.log('✨ Java Roadmap App ready! All buttons should work now.');
});