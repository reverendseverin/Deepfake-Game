// Firebase configuration - Replace with your Firebase config
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Game state
class GameState {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.timeRemaining = 10;
        this.gameActive = false;
        this.timer = null;
        this.imagePairs = [];
        this.selectedPairs = [];
        this.startTime = 0;
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.currentQuestion = 0;
        this.timeRemaining = 10;
        this.gameActive = false;
        this.timer = null;
        this.selectedPairs = [];
        this.startTime = 0;
    }

    generateImagePairs() {
        // Generate array of 20 unique image pairs (using PNG images from real dataset)
        this.imagePairs = [];
        for (let i = 1; i <= 20; i++) {
            this.imagePairs.push({
                id: i,
                real: `images/${i}_real.png`,
                ai: `images/${i}_ai.png`
            });
        }
        
        // Shuffle and select 10 pairs
        this.shuffleArray(this.imagePairs);
        this.selectedPairs = this.imagePairs.slice(0, this.totalQuestions);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    calculateScore(remainingMs) {
        // Score based on remaining milliseconds
        // 15000ms = 150 points, 12000ms = 120 points, 8500ms = 85 points, etc.
        return Math.floor(remainingMs / 100);
    }
}

// Game controller
class DeepfakeGame {
    constructor() {
        this.gameState = new GameState();
        this.currentPair = null;
        this.feedbackModal = document.getElementById('feedback-modal');
        this.initializeEventListeners();
        this.showScreen('start-screen');
    }

    initializeEventListeners() {
        // Start game button
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        // Image selection
        document.getElementById('image-1').addEventListener('click', () => {
            this.selectImage('image-1');
        });

        document.getElementById('image-2').addEventListener('click', () => {
            this.selectImage('image-2');
        });

        // Submit score
        document.getElementById('submit-score').addEventListener('click', () => {
            this.submitScore();
        });

        // Play again
        document.getElementById('play-again').addEventListener('click', () => {
            this.resetGame();
        });

        // Back to start
        document.getElementById('back-to-start').addEventListener('click', () => {
            this.showScreen('start-screen');
        });

        // Prevent context menu on touch
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
    }

    startGame() {
        this.gameState.reset();
        this.gameState.generateImagePairs();
        this.gameState.gameActive = true;
        this.gameState.currentQuestion = 0;
        
        this.showScreen('game-screen');
        this.loadNextQuestion();
    }

    loadNextQuestion() {
        if (this.gameState.currentQuestion >= this.gameState.totalQuestions) {
            this.endGame();
            return;
        }

        // Clear previous feedback styles and overlays
        document.querySelectorAll('.image-option').forEach(img => {
            img.classList.remove('correct', 'incorrect');
        });
        
        // Clear any existing overlays
        document.querySelectorAll('.image-overlay').forEach(overlay => {
            overlay.classList.remove('show', 'correct', 'incorrect');
        });

        this.currentPair = this.gameState.selectedPairs[this.gameState.currentQuestion];
        
        // Randomly assign which image goes to which position
        const positions = Math.random() < 0.5 ? ['real', 'ai'] : ['ai', 'real'];
        
        const img1 = document.getElementById('img-1');
        const img2 = document.getElementById('img-2');
        const option1 = document.getElementById('image-1');
        const option2 = document.getElementById('image-2');

        // Set images
        img1.src = this.currentPair[positions[0]];
        img2.src = this.currentPair[positions[1]];
        
        // Set data attributes for checking correct answer
        option1.setAttribute('data-type', positions[0]);
        option2.setAttribute('data-type', positions[1]);

        // Reactivate game for new question
        this.gameState.gameActive = true;

        // Update UI
        this.updateGameUI();
        this.startTimer();
    }

    updateGameUI() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('question-number').textContent = 
            `${this.gameState.currentQuestion + 1} / ${this.gameState.totalQuestions}`;
        
        // Update progress bar
        const progressPercentage = ((this.gameState.currentQuestion + 1) / this.gameState.totalQuestions) * 100;
        document.getElementById('progress').style.width = `${progressPercentage}%`;
        
        // Update lives display
        const hearts = document.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            if (index >= this.gameState.lives) {
                heart.classList.add('lost');
            } else {
                heart.classList.remove('lost');
            }
        });
    }

    startTimer() {
        this.gameState.timeRemaining = 15;
        this.gameState.startTime = Date.now();
        const timerElement = document.getElementById('timer');
        const timerCircle = document.getElementById('timer-circle');
        
        timerElement.textContent = this.gameState.timeRemaining;
        timerCircle.classList.remove('warning');
        
        // Set initial progress to 100%
        timerCircle.style.setProperty('--progress', '100');

        this.gameState.timer = setInterval(() => {
            this.gameState.timeRemaining--;
            timerElement.textContent = this.gameState.timeRemaining;
            
            // Update visual progress (percentage remaining)
            const progress = (this.gameState.timeRemaining / 15) * 100;
            timerCircle.style.setProperty('--progress', progress.toString());
            
            // Add warning animation when time is low
            if (this.gameState.timeRemaining <= 5) {
                timerCircle.classList.add('warning');
            }
            
            if (this.gameState.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
            this.gameState.timer = null;
        }
        document.getElementById('timer-circle').classList.remove('warning');
    }

    selectImage(imageId) {
        if (!this.gameState.gameActive) return;

        this.stopTimer();
        
        // Prevent multiple clicks during feedback display
        this.gameState.gameActive = false;
        
        const selectedElement = document.getElementById(imageId);
        const selectedType = selectedElement.getAttribute('data-type');
        const isCorrect = selectedType === 'ai';
        
        // Calculate remaining milliseconds when clicked
        const currentTime = Date.now();
        const elapsedMs = currentTime - this.gameState.startTime;
        const totalTimeMs = 15000; // 15 seconds in milliseconds
        const remainingMs = Math.max(totalTimeMs - elapsedMs, 0);
        
        // Calculate score based on remaining milliseconds
        const points = isCorrect ? this.gameState.calculateScore(remainingMs) : 0;
        
        // Show overlay feedback
        this.showImageOverlay(imageId, isCorrect, points);
        
        if (isCorrect) {
            this.gameState.score += points;
        } else {
            this.gameState.lives--;
            
            if (this.gameState.lives <= 0) {
                setTimeout(() => {
                    this.endGame();
                }, 2500);
                return;
            }
        }

        // Update displays
        this.updateGameUI();

        // Move to next question after delay
        setTimeout(() => {
            this.gameState.currentQuestion++;
            this.loadNextQuestion();
        }, 2500);
    }

    showImageOverlay(imageId, isCorrect, points = 0) {
        const overlayId = imageId === 'image-1' ? 'overlay-1' : 'overlay-2';
        const overlay = document.getElementById(overlayId);
        const overlayIcon = overlay.querySelector('.overlay-icon');
        const overlayText = overlay.querySelector('.overlay-text');
        
        // Set overlay content based on result
        if (isCorrect) {
            overlay.className = 'image-overlay correct show';
            overlayIcon.textContent = '✓';
            overlayText.textContent = `CORRECT! +${points}`;
        } else {
            overlay.className = 'image-overlay incorrect show';
            overlayIcon.textContent = '✗';
            overlayText.textContent = 'WRONG!';
            
            // Also show the correct answer on the other image (only if it's the AI image)
            const otherImageId = imageId === 'image-1' ? 'image-2' : 'image-1';
            const otherOverlayId = otherImageId === 'image-1' ? 'overlay-1' : 'overlay-2';
            const otherElement = document.getElementById(otherImageId);
            const otherOverlay = document.getElementById(otherOverlayId);
            const otherType = otherElement.getAttribute('data-type');
            
            if (otherType === 'ai') {
                // Show the AI image as the correct answer
                const otherIcon = otherOverlay.querySelector('.overlay-icon');
                const otherText = otherOverlay.querySelector('.overlay-text');
                
                otherOverlay.className = 'image-overlay correct show';
                otherIcon.textContent = '✓';
                otherText.textContent = 'AI IMAGE';
            }
        }
        
        // Hide overlays after delay
        setTimeout(() => {
            overlay.classList.remove('show');
            if (!isCorrect) {
                const otherOverlayId = imageId === 'image-1' ? 'overlay-2' : 'overlay-1';
                const otherOverlay = document.getElementById(otherOverlayId);
                otherOverlay.classList.remove('show');
            }
        }, 2000);
    }

    timeUp() {
        this.stopTimer();
        this.gameState.gameActive = false;
        this.gameState.lives--;
        
        // Show timeout feedback on both images
        const overlay1 = document.getElementById('overlay-1');
        const overlay2 = document.getElementById('overlay-2');
        
        // Determine which image was real and which was AI
        const realImageId = this.currentPair.realPosition === 'left' ? 'image-1' : 'image-2';
        const aiImageId = this.currentPair.realPosition === 'left' ? 'image-2' : 'image-1';
        
        // Show real image as correct (green)
        if (realImageId === 'image-1') {
            overlay1.className = 'image-overlay correct show';
            overlay1.querySelector('.overlay-icon').textContent = '✓';
            overlay1.querySelector('.overlay-text').textContent = 'REAL';
            
            overlay2.className = 'image-overlay incorrect show';
            overlay2.querySelector('.overlay-icon').textContent = '✗';
            overlay2.querySelector('.overlay-text').textContent = 'AI';
        } else {
            overlay1.className = 'image-overlay incorrect show';
            overlay1.querySelector('.overlay-icon').textContent = '✗';
            overlay1.querySelector('.overlay-text').textContent = 'AI';
            
            overlay2.className = 'image-overlay correct show';
            overlay2.querySelector('.overlay-icon').textContent = '✓';
            overlay2.querySelector('.overlay-text').textContent = 'REAL';
        }
        
        // Show "Time's Up!" message at the top
        this.showFeedback("⏰ Time's Up!", 'warning');
        
        this.updateGameUI();
        
        // Auto-proceed after 3 seconds
        setTimeout(() => {
            overlay1.classList.remove('show');
            overlay2.classList.remove('show');
            
            if (this.gameState.lives <= 0) {
                this.endGame();
            } else {
                this.gameState.currentQuestion++;
                this.loadNextQuestion();
            }
        }, 3000);
    }

    showFeedback(message, type) {
        const feedbackContent = document.getElementById('feedback-content');
        feedbackContent.innerHTML = `
            <div class="feedback-title ${type}">${type === 'success' ? '✅' : '❌'}</div>
            <div class="feedback-message">${message}</div>
        `;
        
        this.feedbackModal.classList.add('active');
        
        setTimeout(() => {
            this.feedbackModal.classList.remove('active');
        }, 1500);
    }

    endGame() {
        this.gameState.gameActive = false;
        this.stopTimer();
        
        // Update final score display
        document.getElementById('final-score').textContent = this.gameState.score;
        
        // Set game over title based on performance
        const gameOverTitle = document.getElementById('game-over-title');
        if (this.gameState.score >= 800) {
            gameOverTitle.textContent = 'AI Detective Master! 🏆';
        } else if (this.gameState.score >= 600) {
            gameOverTitle.textContent = 'Great Job! 🌟';
        } else if (this.gameState.score >= 400) {
            gameOverTitle.textContent = 'Not Bad! 👍';
        } else {
            gameOverTitle.textContent = 'Keep Practicing! 💪';
        }
        
        this.showScreen('game-over-screen');
    }

    async submitScore() {
        const playerName = document.getElementById('player-name').value.trim();
        
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }

        if (playerName.length > 20) {
            alert('Name must be 20 characters or less!');
            return;
        }

        try {
            // Submit score to Firebase
            await database.ref('scores').push({
                name: playerName,
                score: this.gameState.score,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });

            // Load and show scoreboard
            await this.loadScoreboard();
            this.showScreen('scoreboard-screen');
        } catch (error) {
            console.error('Error submitting score:', error);
            // Fallback to localStorage if Firebase fails
            this.saveScoreLocally(playerName, this.gameState.score);
            this.loadLocalScoreboard();
            this.showScreen('scoreboard-screen');
        }
    }

    saveScoreLocally(name, score) {
        let scores = JSON.parse(localStorage.getItem('deepfakeScores') || '[]');
        scores.push({
            name: name,
            score: score,
            timestamp: Date.now()
        });
        
        // Keep only top 10 scores
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 10);
        
        localStorage.setItem('deepfakeScores', JSON.stringify(scores));
    }

    loadLocalScoreboard() {
        const scores = JSON.parse(localStorage.getItem('deepfakeScores') || '[]');
        this.displayScoreboard(scores);
    }

    async loadScoreboard() {
        try {
            const snapshot = await database.ref('scores').orderByChild('score').limitToLast(10).once('value');
            const scores = [];
            
            snapshot.forEach((childSnapshot) => {
                scores.push(childSnapshot.val());
            });
            
            // Sort by score descending
            scores.sort((a, b) => b.score - a.score);
            
            this.displayScoreboard(scores);
        } catch (error) {
            console.error('Error loading scoreboard:', error);
            this.loadLocalScoreboard();
        }
    }

    displayScoreboard(scores) {
        const scoreboardList = document.getElementById('scoreboard-list');
        
        if (scores.length === 0) {
            scoreboardList.innerHTML = '<div class="no-scores">No scores yet! Be the first to play!</div>';
            return;
        }
        
        scoreboardList.innerHTML = scores.map((score, index) => `
            <div class="score-entry">
                <span class="player-rank">#${index + 1}</span>
                <span class="player-name">${this.escapeHtml(score.name)}</span>
                <span class="player-score">${score.score}</span>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    resetGame() {
        this.gameState.reset();
        document.getElementById('player-name').value = '';
        this.showScreen('start-screen');
    }

    // Modal Methods - keeping only what's needed
}

// Image preloader
class ImagePreloader {
    constructor() {
        this.loadedImages = new Set();
        this.imageCache = new Map();
    }

    preloadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.loadedImages.has(src)) {
                resolve(this.imageCache.get(src));
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.loadedImages.add(src);
                this.imageCache.set(src, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    async preloadGameImages() {
        const imagePromises = [];
        
        // Preload first 20 image pairs (using PNG from real dataset)
        for (let i = 1; i <= 20; i++) {
            imagePromises.push(this.preloadImage(`images/${i}_real.png`));
            imagePromises.push(this.preloadImage(`images/${i}_ai.png`));
        }

        try {
            await Promise.all(imagePromises);
            console.log('Images preloaded successfully');
        } catch (error) {
            console.warn('Some images failed to preload:', error);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new DeepfakeGame();
    const preloader = new ImagePreloader();
    
    // Start preloading images
    preloader.preloadGameImages();
    
    // Add service worker for offline functionality (optional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    }
});

// Touch event optimization for iPad
document.addEventListener('touchstart', () => {}, { passive: true });
document.addEventListener('touchmove', (e) => {
    // Prevent scrolling
    e.preventDefault();
}, { passive: false });

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);