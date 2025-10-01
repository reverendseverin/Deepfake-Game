// Firebase configuration - Same as main game
const firebaseConfig = {
  apiKey: "AIzaSyCT2FuEHX1FBasVsYPuMtqJUjrVGQVw05M",
  authDomain: "ai-day-ecd5e.firebaseapp.com",
  databaseURL: "https://ai-day-ecd5e-default-rtdb.firebaseio.com",
  projectId: "ai-day-ecd5e",
  storageBucket: "ai-day-ecd5e.firebasestorage.app",
  messagingSenderId: "26705685009",
  appId: "1:26705685009:web:3932d41260805a2c939fb0",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Leaderboard class
class Leaderboard {
  constructor() {
    this.scores = [];
    this.isLoading = true;
    this.initializeElements();
    this.initializeEventListeners();
    this.loadScores();
  }

  initializeElements() {
    this.leaderboardList = document.getElementById("leaderboard-list");
    this.totalScoresElement = document.getElementById("total-scores");
    this.loadingState = document.getElementById("loading-state");
    this.errorState = document.getElementById("error-state");
    this.emptyState = document.getElementById("empty-state");
  }

  initializeEventListeners() {
    // No interactive elements needed for static display
  }

  async loadScores() {
    this.showLoading();

    try {
      // Fetch all scores from Firebase
      const snapshot = await database.ref("scores").once("value");
      const scoresData = snapshot.val();

      if (!scoresData) {
        this.showEmpty();
        return;
      }

      // Convert to array and sort by score
      this.scores = Object.entries(scoresData)
        .map(([key, value]) => ({
          id: key,
          name: value.name || "Anonymous",
          score: value.score || 0,
          timestamp: value.timestamp || Date.now(),
        }))
        .sort((a, b) => b.score - a.score);

      this.displayScores();
      this.hideLoading();
    } catch (error) {
      console.error("Error loading scores:", error);
      this.showError();
    }
  }

  displayScores() {
    if (this.scores.length === 0) {
      this.showEmpty();
      return;
    }

    // Update total count
    this.totalScoresElement.textContent = this.scores.length;

    // Display all scores in a single list with top 5 sticky
    this.displayLeaderboard();
  }

  displayLeaderboard() {
    // Check if this is the first load or a refresh
    if (this.leaderboardList.children.length === 0) {
      // First load - render all entries
      this.leaderboardList.innerHTML = this.scores
        .map((score, index) => this.createScoreEntry(score, index + 1))
        .join("");

      // Add staggered animations to score entries
      this.addStaggeredAnimations();
    } else {
      // Update existing entries and add new ones with animation
      this.updateLeaderboardWithAnimation();
    }
  }

  updateLeaderboardWithAnimation() {
    const currentEntries = Array.from(this.leaderboardList.children);
    const newScores = this.scores;

    // Create a map of existing entries by score ID
    const existingEntries = new Map();
    currentEntries.forEach((entry) => {
      const scoreId = entry.dataset.scoreId;
      if (scoreId) {
        existingEntries.set(scoreId, entry);
      }
    });

    // Clear the list
    this.leaderboardList.innerHTML = "";

    // Rebuild the list with animations
    newScores.forEach((score, index) => {
      const rank = index + 1;
      const existingEntry = existingEntries.get(score.id);

      if (existingEntry) {
        // Update existing entry
        this.updateExistingEntry(existingEntry, score, rank);
        this.leaderboardList.appendChild(existingEntry);
      } else {
        // Create new entry with slide-in animation
        const newEntry = this.createAnimatedScoreEntry(score, rank);
        this.leaderboardList.appendChild(newEntry);
      }
    });
  }

  updateExistingEntry(entry, score, rank) {
    const rankClass = this.getRankClass(rank);
    const formattedDate = this.formatDate(score.timestamp);
    const rankIcon = this.getRankIcon(rank);
    const stickyClass = rank <= 5 ? "sticky" : "";

    entry.className = `score-entry ${rankClass} ${stickyClass}`;
    entry.dataset.scoreId = score.id;
    entry.innerHTML = `
      <span class="player-rank">${rankIcon}${rank}</span>
      <span class="player-name">${this.escapeHtml(score.name)}</span>
      <span class="player-score">${score.score.toLocaleString()}</span>
      <span class="player-timestamp">${formattedDate}</span>
    `;

    // Add slide down animation for rank changes
    entry.style.animation = "slideDown 0.5s ease-out";
  }

  createAnimatedScoreEntry(score, rank) {
    const rankClass = this.getRankClass(rank);
    const formattedDate = this.formatDate(score.timestamp);
    const rankIcon = this.getRankIcon(rank);
    const stickyClass = rank <= 5 ? "sticky" : "";

    const entry = document.createElement("div");
    entry.className = `score-entry ${rankClass} ${stickyClass} slide-in`;
    entry.dataset.scoreId = score.id;
    entry.innerHTML = `
      <span class="player-rank">${rankIcon}${rank}</span>
      <span class="player-name">${this.escapeHtml(score.name)}</span>
      <span class="player-score">${score.score.toLocaleString()}</span>
      <span class="player-timestamp">${formattedDate}</span>
    `;

    return entry;
  }

  addStaggeredAnimations() {
    const scoreEntries = this.leaderboardList.querySelectorAll(".score-entry");
    scoreEntries.forEach((entry, index) => {
      entry.style.animationDelay = `${0.6 + index * 0.1}s`;
    });
  }

  createScoreEntry(score, rank) {
    const rankClass = this.getRankClass(rank);
    const formattedDate = this.formatDate(score.timestamp);
    const rankIcon = this.getRankIcon(rank);
    const stickyClass = rank <= 5 ? "sticky" : "";

    return `
            <div class="score-entry ${rankClass} ${stickyClass}" data-score-id="${
      score.id
    }">
                <span class="player-rank">${rankIcon}${rank}</span>
                <span class="player-name">${this.escapeHtml(score.name)}</span>
                <span class="player-score">${score.score.toLocaleString()}</span>
                <span class="player-timestamp">${formattedDate}</span>
            </div>
        `;
  }

  getRankClass(rank) {
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "";
  }

  getRankIcon(rank) {
    if (rank === 1) return "🥇 ";
    if (rank === 2) return "🥈 ";
    if (rank === 3) return "🥉 ";
    return "";
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  }

  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  showLoading() {
    this.isLoading = true;
    this.loadingState.classList.remove("hidden");
    this.errorState.classList.add("hidden");
    this.emptyState.classList.add("hidden");
    this.leaderboardList.innerHTML = "";
  }

  hideLoading() {
    this.isLoading = false;
    this.loadingState.classList.add("hidden");
  }

  showError() {
    this.isLoading = false;
    this.loadingState.classList.add("hidden");
    this.errorState.classList.remove("hidden");
    this.emptyState.classList.add("hidden");
  }

  showEmpty() {
    this.isLoading = false;
    this.loadingState.classList.add("hidden");
    this.errorState.classList.add("hidden");
    this.emptyState.classList.remove("hidden");
  }

  // Clean up when page is unloaded
  destroy() {
    // No cleanup needed for static display
  }
}

// Real-time updates listener
class RealTimeLeaderboard extends Leaderboard {
  constructor() {
    super();
    this.setupRealTimeListener();
  }

  setupRealTimeListener() {
    // Listen for new scores in real-time
    database.ref("scores").on("child_added", (snapshot) => {
      if (!this.isLoading) {
        const newScore = {
          id: snapshot.key,
          name: snapshot.val().name || "Anonymous",
          score: snapshot.val().score || 0,
          timestamp: snapshot.val().timestamp || Date.now(),
        };
        this.addNewScore(newScore);
      }
    });

    // Listen for score updates
    database.ref("scores").on("child_changed", (snapshot) => {
      if (!this.isLoading) {
        const updatedScore = {
          id: snapshot.key,
          name: snapshot.val().name || "Anonymous",
          score: snapshot.val().score || 0,
          timestamp: snapshot.val().timestamp || Date.now(),
        };
        this.updateExistingScore(updatedScore);
      }
    });

    // Listen for score deletions
    database.ref("scores").on("child_removed", (snapshot) => {
      if (!this.isLoading) {
        this.removeScore(snapshot.key);
      }
    });
  }

  addNewScore(newScore) {
    // Add the new score to our array
    this.scores.push(newScore);

    // Sort the scores
    this.scores.sort((a, b) => b.score - a.score);

    // Update total count
    this.totalScoresElement.textContent = this.scores.length;

    // Find the new position of the score
    const newRank =
      this.scores.findIndex((score) => score.id === newScore.id) + 1;

    // Add the new score with slide-in animation
    this.addScoreWithAnimation(newScore, newRank);
  }

  updateExistingScore(updatedScore) {
    // Find and update the existing score
    const oldIndex = this.scores.findIndex(
      (score) => score.id === updatedScore.id
    );
    if (oldIndex !== -1) {
      this.scores[oldIndex] = updatedScore;

      // Sort the scores
      this.scores.sort((a, b) => b.score - a.score);

      // Find new position
      const newRank =
        this.scores.findIndex((score) => score.id === updatedScore.id) + 1;

      // Update the existing entry
      this.updateScoreWithAnimation(
        updatedScore,
        newRank,
        oldIndex !== newRank - 1
      );
    }
  }

  removeScore(scoreId) {
    // Remove the score from our array
    this.scores = this.scores.filter((score) => score.id !== scoreId);

    // Update total count
    this.totalScoresElement.textContent = this.scores.length;

    // Remove the score from the display
    this.removeScoreWithAnimation(scoreId);
  }

  addScoreWithAnimation(score, rank) {
    const newEntry = this.createAnimatedScoreEntry(score, rank);

    // Insert at the correct position
    const existingEntries = Array.from(this.leaderboardList.children);
    const insertIndex = rank - 1;

    if (insertIndex >= existingEntries.length) {
      // Add to end
      this.leaderboardList.appendChild(newEntry);
    } else {
      // Insert before existing entry
      this.leaderboardList.insertBefore(newEntry, existingEntries[insertIndex]);
    }

    // Update ranks of all entries after the inserted one
    this.updateRanksAfterInsert(insertIndex);
  }

  updateScoreWithAnimation(score, newRank, rankChanged) {
    const existingEntry = this.leaderboardList.querySelector(
      `[data-score-id="${score.id}"]`
    );
    if (!existingEntry) return;

    const oldRank = parseInt(
      existingEntry
        .querySelector(".player-rank")
        .textContent.replace(/[^\d]/g, "")
    );

    // Update the entry content
    this.updateExistingEntry(existingEntry, score, newRank);

    if (rankChanged) {
      // Move the entry to the correct position
      this.moveEntryToPosition(existingEntry, newRank - 1);
      // Update ranks of affected entries
      this.updateRanksAfterMove(oldRank - 1, newRank - 1);
    }
  }

  removeScoreWithAnimation(scoreId) {
    const entry = this.leaderboardList.querySelector(
      `[data-score-id="${scoreId}"]`
    );
    if (!entry) return;

    // Add slide-out animation
    entry.style.animation = "slideOutLeft 0.5s ease-in forwards";

    // Remove after animation
    setTimeout(() => {
      if (entry.parentNode) {
        entry.parentNode.removeChild(entry);
      }
      // Update ranks of remaining entries
      this.updateAllRanks();
    }, 500);
  }

  moveEntryToPosition(entry, newIndex) {
    const existingEntries = Array.from(this.leaderboardList.children);
    const currentIndex = existingEntries.indexOf(entry);

    if (currentIndex !== newIndex) {
      if (newIndex >= existingEntries.length) {
        this.leaderboardList.appendChild(entry);
      } else {
        this.leaderboardList.insertBefore(entry, existingEntries[newIndex]);
      }
    }
  }

  updateRanksAfterInsert(insertIndex) {
    const entries = Array.from(this.leaderboardList.children);
    entries.forEach((entry, index) => {
      if (index > insertIndex) {
        const rank = index + 1;
        const rankElement = entry.querySelector(".player-rank");
        const rankIcon = this.getRankIcon(rank);
        if (rankElement) {
          rankElement.textContent = `${rankIcon}${rank}`;
        }

        // Update classes
        const rankClass = this.getRankClass(rank);
        const stickyClass = rank <= 5 ? "sticky" : "";
        entry.className = `score-entry ${rankClass} ${stickyClass}`;
      }
    });
  }

  updateRanksAfterMove(oldIndex, newIndex) {
    const entries = Array.from(this.leaderboardList.children);
    const startIndex = Math.min(oldIndex, newIndex);

    entries.forEach((entry, index) => {
      if (index >= startIndex) {
        const rank = index + 1;
        const rankElement = entry.querySelector(".player-rank");
        const rankIcon = this.getRankIcon(rank);
        if (rankElement) {
          rankElement.textContent = `${rankIcon}${rank}`;
        }

        // Update classes
        const rankClass = this.getRankClass(rank);
        const stickyClass = rank <= 5 ? "sticky" : "";
        entry.className = `score-entry ${rankClass} ${stickyClass}`;
      }
    });
  }

  updateAllRanks() {
    const entries = Array.from(this.leaderboardList.children);
    entries.forEach((entry, index) => {
      const rank = index + 1;
      const rankElement = entry.querySelector(".player-rank");
      const rankIcon = this.getRankIcon(rank);
      if (rankElement) {
        rankElement.textContent = `${rankIcon}${rank}`;
      }

      // Update classes
      const rankClass = this.getRankClass(rank);
      const stickyClass = rank <= 5 ? "sticky" : "";
      entry.className = `score-entry ${rankClass} ${stickyClass}`;
    });
  }

  destroy() {
    super.destroy();
    // Remove Firebase listeners
    database.ref("scores").off();
  }
}

// Initialize leaderboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const leaderboard = new RealTimeLeaderboard();

  // Clean up when page is unloaded
  window.addEventListener("beforeunload", () => {
    leaderboard.destroy();
  });

  // Add smooth scrolling for better UX
  const leaderboardList = document.getElementById("leaderboard-list");
  if (leaderboardList) {
    leaderboardList.style.scrollBehavior = "smooth";
  }
});

// Add some performance optimizations
document.addEventListener("DOMContentLoaded", () => {
  // Preload critical resources
  const link = document.createElement("link");
  link.rel = "preload";
  link.href =
    "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@300;400;600;700&display=swap";
  link.as = "style";
  document.head.appendChild(link);

  // Add intersection observer for lazy loading if needed
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    });

    // Observe score entries for animations
    document.querySelectorAll(".score-entry").forEach((entry) => {
      observer.observe(entry);
    });
  }
});

// Add error handling for offline scenarios
window.addEventListener("online", () => {
  console.log("Connection restored");
  // Try to reload scores when connection is restored
  if (window.leaderboard && !window.leaderboard.isLoading) {
    window.leaderboard.loadScores();
  }
});

window.addEventListener("offline", () => {
  console.log("Connection lost");
  // Could show a notification or update UI to indicate offline status
});

// Export for potential use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Leaderboard, RealTimeLeaderboard };
}
