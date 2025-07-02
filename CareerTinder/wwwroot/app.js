class CareerTinder {
    constructor() {
        this.jobs = [];
        this.currentJobIndex = 0;
        // Clear old localStorage data to fix undefined issues
        localStorage.removeItem('savedJobs');
        this.savedJobs = [];
        this.isAnimating = false;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;

        this.init();
    }

    async init() {
        console.log('🚀 Initializing CareerTinder...');
        await this.loadJobs();
        this.setupEventListeners();
        this.showCards();
    }

    async loadJobs() {
        try {
            console.log('📡 Loading jobs from API...');
            const response = await fetch('/api/job');
            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.jobs = await response.json();
            console.log('✅ Loaded jobs:', this.jobs.length, 'jobs');
            console.log('📄 First job:', this.jobs[0]);
        } catch (error) {
            console.error('❌ Error loading jobs:', error);
            // Fallback to mock data if API fails
            console.log('🔄 Using fallback mock data...');
            this.jobs = this.getMockJobs();
        }
    }

    getMockJobs() {
        return [
            {
                id: 1,
                title: "Senior Frontend Developer",
                company: "TechCorp",
                description: "Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern frontend technologies. Work on challenging projects that impact millions of users.",
                location: "San Francisco, CA",
                salary: "$120,000 - $160,000",
                tags: ["Remote", "Full-Time", "Senior", "React", "TypeScript"],
                logoText: "TC",
                logoColor: "#4F46E5"
            },
            {
                id: 2,
                title: "Full Stack Engineer",
                company: "StartupXYZ",
                description: "Be part of a fast-growing startup building the next generation of SaaS tools. Work with Node.js, Python, and cloud technologies in an agile environment.",
                location: "New York, NY",
                salary: "$100,000 - $140,000",
                tags: ["Hybrid", "Full-Time", "Mid-Level", "Node.js", "Python", "AWS"],
                logoText: "SX",
                logoColor: "#059669"
            },
            {
                id: 3,
                title: "DevOps Engineer",
                company: "CloudTech Solutions",
                description: "Manage and optimize cloud infrastructure, CI/CD pipelines, and containerized applications. Work with Kubernetes, Docker, and major cloud providers.",
                location: "Austin, TX",
                salary: "$110,000 - $150,000",
                tags: ["Remote", "Full-Time", "DevOps", "Kubernetes", "Docker", "CI/CD"],
                logoText: "CT",
                logoColor: "#DC2626"
            },
            {
                id: 4,
                title: "UX/UI Designer",
                company: "DesignStudio",
                description: "Create beautiful and intuitive user experiences for web and mobile applications. Collaborate with product teams to design user-centered solutions.",
                location: "Los Angeles, CA",
                salary: "$90,000 - $120,000",
                tags: ["Remote", "Full-Time", "Design", "Figma", "Prototyping"],
                logoText: "DS",
                logoColor: "#7C3AED"
            },
            {
                id: 5,
                title: "Data Scientist",
                company: "AI Innovations",
                description: "Apply machine learning and statistical analysis to solve complex business problems. Work with large datasets and build predictive models.",
                location: "Seattle, WA",
                salary: "$130,000 - $170,000",
                tags: ["Hybrid", "Full-Time", "Data Science", "Python", "ML", "Senior"],
                logoText: "AI",
                logoColor: "#EA580C"
            }
        ];
    }

    setupEventListeners() {
        // Button listeners
        document.getElementById('skip-btn').addEventListener('click', () => this.skipJob());
        document.getElementById('save-btn').addEventListener('click', () => this.saveJob());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('restart-empty-btn').addEventListener('click', () => this.restart());

        // Keyboard listeners
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;

            if (e.key === 'ArrowLeft' || e.key === 'x' || e.key === 'X') {
                this.skipJob();
            } else if (e.key === 'ArrowRight' || e.key === 's' || e.key === 'S') {
                this.saveJob();
            }
        });
    }

    showCards() {
        console.log('🎴 Showing cards, jobs count:', this.jobs.length);
        document.getElementById('loading').style.display = 'none';

        if (this.jobs.length === 0) {
            console.log('❌ No jobs found, showing empty state');
            this.showEmptyState();
            return;
        }

        console.log('✅ Displaying cards container');
        document.getElementById('cards-container').style.display = 'flex';
        this.renderCards();
        this.updateStats();
        this.enableButtons();
    }

    renderCards() {
        console.log('🎨 Rendering cards, current index:', this.currentJobIndex);
        const cardStack = document.getElementById('card-stack');

        // Clean up any existing event listeners before clearing
        const existingCards = cardStack.querySelectorAll('.job-card');
        existingCards.forEach(card => {
            if (card._cleanup) {
                card._cleanup();
            }
        });

        cardStack.innerHTML = '';

        // Render up to 3 cards for stacking effect
        for (let i = 0; i < Math.min(3, this.jobs.length - this.currentJobIndex); i++) {
            const jobIndex = this.currentJobIndex + i;
            const job = this.jobs[jobIndex];
            if (!job) continue;

            console.log(`📋 Creating card ${i} for job:`, job.title);
            const card = this.createJobCard(job, i === 0);
            cardStack.appendChild(card);
        }

        console.log('✅ Cards rendered successfully');
    }

    createJobCard(job, isTopCard) {
        const card = document.createElement('div');
        card.className = `job-card ${isTopCard ? 'new' : ''}`;
        card.dataset.jobId = job.id;

        card.innerHTML = `
            <div class="card-header">
                <div class="company-logo" style="background: linear-gradient(135deg, ${job.logoColor}, ${job.logoColor}DD); color: white; font-weight: 800; font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                    ${job.logoText || job.company.substring(0, 2).toUpperCase()}
                </div>
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <div class="company">${job.company}</div>
                </div>
            </div>
            
            <div class="card-body">
                <div class="job-description">
                    ${job.description}
                </div>
                
                <div class="job-details">
                    <div class="detail-row">
                        <span>📍</span>
                        <span>${job.location}</span>
                    </div>
                    <div class="detail-row">
                        <span>💰</span>
                        <span>${job.salary}</span>
                    </div>
                </div>
                
                <div class="job-tags">
                    ${job.tags.map(tag => `
                        <span class="tag ${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}">${tag}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="swipe-indicator like">SAVE</div>
            <div class="swipe-indicator pass">SKIP</div>
        `;

        // Add interaction only to the top card and return the processed card
        if (isTopCard) {
            return this.addCardInteraction(card);
        }

        return card;
    }

    addCardInteraction(card) {
        // Mouse events - using this reference for proper context
        const handleMouseDown = (e) => this.startDrag(e, card);
        const handleMouseMove = (e) => this.drag(e, card);
        const handleMouseUp = (e) => this.endDrag(e, card);

        card.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Touch events - with better handling
        const handleTouchStart = (e) => this.startDrag(e, card);
        const handleTouchMove = (e) => this.drag(e, card);
        const handleTouchEnd = (e) => this.endDrag(e, card);

        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd, { passive: false });

        // Store cleanup function for later removal
        card._cleanup = () => {
            card.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            card.removeEventListener('touchstart', handleTouchStart);
            card.removeEventListener('touchmove', handleTouchMove);
            card.removeEventListener('touchend', handleTouchEnd);
        };

        console.log('✅ Added interaction to card:', card.dataset.jobId);
        return card;
    }

    startDrag(e, card) {
        if (this.isAnimating) return;

        this.isDragging = true;
        card.classList.add('dragging');

        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

        this.startX = clientX;
        this.startY = clientY;
        this.currentX = clientX;
        this.currentY = clientY;

        // Prevent default to stop scrolling on mobile
        e.preventDefault();
    }

    drag(e, card) {
        if (!this.isDragging || this.isAnimating) return;

        // Make sure we're only dragging the top card
        const topCard = document.querySelector('.job-card:first-child');
        if (card !== topCard) return;

        e.preventDefault();

        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

        this.currentX = clientX;
        this.currentY = clientY;

        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;

        // Enhanced rotation calculation for more natural feel
        const rotation = deltaX * 0.15;
        const scale = Math.max(0.95, 1 - Math.abs(deltaX) * 0.0005);

        // Apply transform with improved physics
        card.style.transform = `translate(${deltaX}px, ${deltaY * 0.5}px) rotate(${rotation}deg) scale(${scale})`;

        // Enhanced swipe indicators with smooth transitions
        const likeIndicator = card.querySelector('.swipe-indicator.like');
        const passIndicator = card.querySelector('.swipe-indicator.pass');

        const threshold = 80;
        const opacity = Math.min(0.9, Math.abs(deltaX) / threshold);

        if (deltaX > 30) {
            likeIndicator.style.opacity = opacity;
            likeIndicator.classList.add('show');
            passIndicator.style.opacity = 0;
            passIndicator.classList.remove('show');

            // Add visual feedback to card
            card.style.boxShadow = `0 20px 40px rgba(5, 150, 105, ${opacity * 0.3})`;
            card.style.borderColor = `rgba(5, 150, 105, ${opacity * 0.5})`;
        } else if (deltaX < -30) {
            passIndicator.style.opacity = opacity;
            passIndicator.classList.add('show');
            likeIndicator.style.opacity = 0;
            likeIndicator.classList.remove('show');

            // Add visual feedback to card
            card.style.boxShadow = `0 20px 40px rgba(220, 38, 38, ${opacity * 0.3})`;
            card.style.borderColor = `rgba(220, 38, 38, ${opacity * 0.5})`;
        } else {
            likeIndicator.style.opacity = 0;
            passIndicator.style.opacity = 0;
            likeIndicator.classList.remove('show');
            passIndicator.classList.remove('show');

            // Reset card appearance
            card.style.boxShadow = '';
            card.style.borderColor = '';
        }
    }

    endDrag(e, card) {
        if (!this.isDragging) return;

        this.isDragging = false;
        card.classList.remove('dragging');

        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        const threshold = 120;
        const velocity = Math.abs(deltaX) / 10; // Simple velocity calculation

        // Hide indicators with smooth transition
        const likeIndicator = card.querySelector('.swipe-indicator.like');
        const passIndicator = card.querySelector('.swipe-indicator.pass');
        likeIndicator.style.opacity = 0;
        passIndicator.style.opacity = 0;
        likeIndicator.classList.remove('show');
        passIndicator.classList.remove('show');

        // Reset card styling
        card.style.boxShadow = '';
        card.style.borderColor = '';

        if (Math.abs(deltaX) > threshold || velocity > 5) {
            // Swipe action with enhanced animation
            if (deltaX > 0) {
                console.log('👍 Manual swipe RIGHT detected');
                this.performSave();
            } else {
                console.log('👎 Manual swipe LEFT detected');
                this.performSkip();
            }
        } else {
            // Smooth snap back animation
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = '';

            setTimeout(() => {
                card.style.transition = '';
            }, 400);
        }
    }

    performSkip() {
        if (this.isAnimating || this.currentJobIndex >= this.jobs.length) return;

        console.log('⏭️ Performing skip for job:', this.currentJobIndex);
        const topCard = document.querySelector('.job-card:first-child');
        if (topCard) {
            this.animateSwipe(topCard, 'left', () => {
                this.nextJob();
            });
        }
    }

    performSave() {
        if (this.isAnimating || this.currentJobIndex >= this.jobs.length) return;

        console.log('💾 Performing save for job:', this.currentJobIndex);
        const currentJob = this.jobs[this.currentJobIndex];
        if (currentJob && !this.savedJobs.find(job => job.id === currentJob.id)) {
            this.savedJobs.push(currentJob);
            localStorage.setItem('savedJobs', JSON.stringify(this.savedJobs));
            this.showSuccessFeedback();
        }

        const topCard = document.querySelector('.job-card:first-child');
        if (topCard) {
            this.animateSwipe(topCard, 'right', () => {
                this.nextJob();
            });
        }
    }

    animateSwipe(card, direction, callback) {
        this.isAnimating = true;
        this.disableButtons();

        console.log(`🎬 Starting ${direction} swipe animation`);

        // Enhanced swipe animation
        const exitX = direction === 'right' ? window.innerWidth : -window.innerWidth;
        const rotation = direction === 'right' ? 30 : -30;

        card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.transform = `translateX(${exitX}px) rotate(${rotation}deg) scale(0.8)`;
        card.style.opacity = '0';

        // Add class for additional styling
        card.classList.add(`swiped-${direction}`);

        setTimeout(() => {
            console.log('🎬 Animation complete, executing callback');
            this.isAnimating = false;
            callback();
        }, 600);
    }

    skipJob() {
        if (this.isAnimating || this.currentJobIndex >= this.jobs.length) return;

        console.log('⏭️ Button skip job:', this.currentJobIndex);
        this.performSkip();
    }

    saveJob() {
        if (this.isAnimating || this.currentJobIndex >= this.jobs.length) return;

        console.log('💾 Button save job:', this.currentJobIndex);
        this.performSave();
    }

    showSuccessFeedback() {
        // Create and show a brief "Saved!" message
        const feedback = document.createElement('div');
        feedback.textContent = '💾 Saved!';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1rem;
            z-index: 1000;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
            animation: feedbackPop 0.6s ease-out;
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 600);
    }

    nextJob() {
        this.currentJobIndex++;
        console.log('📈 Moving to next job, index:', this.currentJobIndex);

        if (this.currentJobIndex >= this.jobs.length) {
            console.log('🏁 No more jobs, showing matches');
            this.showMatches();
        } else {
            // Small delay to ensure smooth transition
            setTimeout(() => {
                this.renderCards();
                this.updateStats();
                this.enableButtons();
                console.log('🎯 Next job ready for interaction');
            }, 100);
        }
    }

    showMatches() {
        document.getElementById('cards-container').style.display = 'none';
        document.getElementById('matches-view').style.display = 'block';

        this.renderMatches();
    }

    renderMatches() {
        const matchesList = document.getElementById('matches-list');

        if (this.savedJobs.length === 0) {
            matchesList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">😅</div>
                    <h3>No Matches Yet</h3>
                    <p>You didn't save any jobs. Try again and find your perfect match!</p>
                </div>
            `;
        } else {
            matchesList.innerHTML = this.savedJobs.map(job => `
                <div class="match-card">
                    <div class="match-header">
                        <div class="match-logo" style="background: linear-gradient(135deg, ${job.logoColor || '#4F46E5'}, ${job.logoColor || '#4F46E5'}DD); color: white; font-weight: 800; font-size: 1.2rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            ${job.logoText || job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div class="match-info">
                            <h4>${job.title}</h4>
                            <div class="company">${job.company}</div>
                        </div>
                    </div>
                    <div class="match-details">
                        <div class="match-detail">📍 ${job.location}</div>
                        <div class="match-detail">💰 ${job.salary}</div>
                    </div>
                    <div class="match-tags">
                        ${job.tags.map(tag => `
                            <span class="tag ${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }

    showEmptyState() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('empty-state').style.display = 'block';
    }

    showError(message) {
        console.log('❌ Showing error:', message);
        const loadingDiv = document.getElementById('loading');
        loadingDiv.innerHTML = `
            <div style="color: #dc2626; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
                <h3 style="margin-bottom: 15px; color: #dc2626;">Oops! Something went wrong</h3>
                <p style="margin-bottom: 20px; color: #64748b;">${message}</p>
                <button onclick="location.reload()" style="
                    padding: 12px 24px; 
                    background: linear-gradient(135deg, #667eea, #764ba2); 
                    color: white; 
                    border: none; 
                    border-radius: 12px; 
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9rem;
                ">
                    🔄 Try Again
                </button>
            </div>
        `;
    }

    updateStats() {
        const remaining = this.jobs.length - this.currentJobIndex;
        const statsElement = document.getElementById('remaining-count');
        if (statsElement) {
            statsElement.textContent = `${remaining} jobs remaining`;
            console.log('📊 Stats updated:', remaining, 'jobs remaining');
        }
    }

    enableButtons() {
        const skipBtn = document.getElementById('skip-btn');
        const saveBtn = document.getElementById('save-btn');

        if (skipBtn && saveBtn) {
            skipBtn.disabled = false;
            saveBtn.disabled = false;
            console.log('✅ Buttons enabled');
        }
    }

    disableButtons() {
        const skipBtn = document.getElementById('skip-btn');
        const saveBtn = document.getElementById('save-btn');

        if (skipBtn && saveBtn) {
            skipBtn.disabled = true;
            saveBtn.disabled = true;
            console.log('❌ Buttons disabled');
        }
    }

    restart() {
        this.currentJobIndex = 0;
        this.isAnimating = false;
        this.isDragging = false;

        // Hide all views
        document.getElementById('matches-view').style.display = 'none';
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('loading').style.display = 'block';

        // Reload and show cards
        setTimeout(() => {
            this.showCards();
        }, 500);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM Content Loaded - Starting CareerTinder');

    // Check if all required elements exist
    const requiredElements = [
        'loading',
        'cards-container',
        'card-stack',
        'skip-btn',
        'save-btn',
        'remaining-count'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));

    if (missingElements.length > 0) {
        console.error('❌ Missing DOM elements:', missingElements);
        return;
    }

    console.log('✅ All required DOM elements found');

    // Initialize the app
    try {
        window.careerTinder = new CareerTinder();
        console.log('🎉 CareerTinder initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize CareerTinder:', error);
    }
});

// Add some utility functions for better UX
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Save state when tab becomes hidden
        const currentState = {
            currentJobIndex: window.careerTinder?.currentJobIndex || 0,
            savedJobs: JSON.parse(localStorage.getItem('savedJobs') || '[]')
        };
        localStorage.setItem('appState', JSON.stringify(currentState));
    }
});

// Prevent accidental refresh
window.addEventListener('beforeunload', (e) => {
    const hasUnsavedProgress = window.careerTinder?.currentJobIndex > 0;
    if (hasUnsavedProgress) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Debug helper
window.addEventListener('load', () => {
    console.log('🔧 Window loaded, CareerTinder instance:', window.careerTinder);

    // Add debug info to console
    if (window.careerTinder) {
        console.log('📊 Debug Info:');
        console.log('- Jobs loaded:', window.careerTinder.jobs.length);
        console.log('- Current index:', window.careerTinder.currentJobIndex);
        console.log('- Saved jobs:', window.careerTinder.savedJobs.length);
    }
});