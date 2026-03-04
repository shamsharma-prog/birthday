// ===== Birthday Configuration =====
const BIRTHDAY_DATE = new Date(new Date().getFullYear(), 0, 1); // January 1st
if (BIRTHDAY_DATE < new Date()) {
    BIRTHDAY_DATE.setFullYear(new Date().getFullYear() + 1);
}

// ===== Game Configuration =====
const puzzles = {
    1: {
        answer: "apple watch",
        errorMessages: [
            "Hmm, close but not quite. Try ROT5 first, then ROT3...",
            "Remember, it's a DOUBLE shift. Total shift is 8!",
            "First shift backwards by 5, then by 3 more. Keep trying!",
            "Think: Apple product for your wrist. The shift is double!"
        ]
    },
    2: {
        answer: "protein",
        errorMessages: [
            "Not quite! This riddle hints at muscle building...",
            "Think about what helps athletes grow stronger...",
            "It's essential for fitness and building yourself up!",
            "A nutritional compound found in foods and supplements..."
        ]
    },
    3: {
        answer: "fizz",
        errorMessages: [
            "Hmm, not quite. Did you check the console?",
            "The Developer Console has the secret message waiting...",
            "Open DevTools and look for the glowing message!",
            "Check the browser console for a hidden clue..."
        ]
    },
    4: {
        answer: "diet coke",
        errorMessages: [
            "Not quite. Try decoding that Base64...",
            "Use a Base64 decoder or browser console to decode!",
            "Remember: atob('ZGlldCBjb2tl') reveals the answer!",
            "It's a fizzy drink you might enjoy. Decode and try again!"
        ]
    }
};

let currentStage = 1;
let errorAttempts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0
};

// ===== Keyboard Shortcuts =====
const shortcuts = {
    'h': () => showHint(currentStage),
    'shift+h': () => console.log("Press 'H' for a stage hint!"),
    'shift+s': () => skipPuzzle(currentStage + 1),
    'shift+d': () => toggleDebugMode(),
};

let debugMode = false;

// ===== Initialize Game =====
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

document.addEventListener('keydown', (e) => {
    const key = e.shiftKey ? 'shift+' + e.key.toLowerCase() : e.key.toLowerCase();
    if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
    }
});

function initializeGame() {
    // Start countdown timer
    startBirthdayCountdown();
    
    // Log console messages for Stage 3
    console.log("%c🎂 Birthday Mystery Escape 🎁", "color: #ff69b4; font-size: 18px; font-weight: bold;");
    console.log("%cYou're solving puzzles to reveal birthday gifts!", "color: #d946a6; font-size: 14px;");
    console.log("%c🔐 Gate 3 Secret Clue 🔐", "color: #ff69b4; font-size: 16px; font-weight: bold;");
    console.log("%cThe answer to Gate 3 is: fizz", "color: #d946a6; font-size: 14px; background: #fff5f7; padding: 10px;");
    console.log("%c(Now go back and enter this answer!)", "color: #ffb6c1; font-size: 12px;");
    console.log("%c", "background: linear-gradient(135deg, #ff69b4, #ff1493); padding: 20px; border-radius: 10px;");
    console.log("%cSecret: Press 'H' for hints! Press Shift+S to skip puzzles (cheat mode)!", "color: #ff69b4; font-size: 12px; font-weight: bold;");
    
    // Show first stage
    showStage(1);
    
    // Add enter key listener to all inputs
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`answer-${i}`);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    checkAnswer(i);
                }
            });
        }
    }
}

// ===== Show/Hide Stages =====
function showStage(stageNumber) {
    // Hide all stages
    const stages = document.querySelectorAll('.stage');
    stages.forEach(stage => stage.classList.add('hidden'));
    
    // Show specific stage
    const stageToShow = document.getElementById(`stage-${stageNumber}`);
    if (stageToShow) {
        stageToShow.classList.remove('hidden');
        // Focus input field
        const input = stageToShow.querySelector('.answer-input');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }
    
    // Update progress
    updateProgress(stageNumber);
    
    // Scroll to stage
    setTimeout(() => {
        const header = document.querySelector('.header');
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ===== Birthday Countdown Timer =====
function startBirthdayCountdown() {
    const countdownDiv = document.getElementById('birthday-countdown');
    
    function updateCountdown() {
        const now = new Date();
        const diff = BIRTHDAY_DATE - now;
        
        if (diff < 0) {
            countdownDiv.innerHTML = '<span class="countdown-text">🎉 Today\'s your birthday! 🎉</span>';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        countdownDiv.innerHTML = `<span class="countdown-text">⏳ Birthday in ${days}d ${hours}h ${minutes}m</span>`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
}

// ===== Show Hint =====
function showHint(stage) {
    const hints = {
        1: "The cipher is shifted by 8 total (ROT5 + ROT3). Try decoding backwards!",
        2: "Think about gym, nutrition, and muscle building. Common in fitness.",
        3: "Open your browser's Developer Console (F12). Look for the glowing message!",
        4: "Use atob('ZGlldCBjb2tl') in the console or find a Base64 decoder online."
    };
    alert(`💡 Hint for Gate ${stage}: ${hints[stage]}`);
}

// ===== Skip Puzzle (Cheat Mode) =====
function skipPuzzle(stage) {
    if (stage <= 4) {
        currentStage = stage;
        showStage(stage);
        console.log(`%c⚠️ Skipped to Gate ${stage}!`, "color: #ff1493; font-weight: bold;");
    } else {
        showFinalScreen();
    }
}

// ===== Toggle Debug Mode =====
function toggleDebugMode() {
    debugMode = !debugMode;
    console.log(`%cDebug Mode: ${debugMode ? 'ON' : 'OFF'}`, "color: #ff69b4; font-weight: bold;");
    if (debugMode) {
        console.log("%cAnswers:", "color: #d946a6; font-weight: bold;");
        for (let i = 1; i <= 4; i++) {
            console.log(`%cGate ${i}: ${puzzles[i].answer}`, "color: #ff69b4;");
        }
    }
}

// ===== Check Answer =====
function checkAnswer(stageNumber) {
    const input = document.getElementById(`answer-${stageNumber}`);
    const errorDiv = document.getElementById(`error-${stageNumber}`);
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = puzzles[stageNumber].answer.toLowerCase();
    
    // Clear previous error message
    errorDiv.textContent = '';
    errorDiv.classList.remove('error-visible');
    
    if (userAnswer === correctAnswer) {
        // Correct answer!
        showSuccess(stageNumber);
        input.disabled = true;
        
        // Unlock next stage after animation
        setTimeout(() => {
            if (stageNumber < 4) {
                currentStage = stageNumber + 1;
                showStage(currentStage);
            } else {
                // All puzzles solved!
                currentStage = 'final';
                showFinalScreen();
            }
        }, 600);
    } else {
        // Wrong answer - show error message
        showError(stageNumber, errorDiv);
    }
}

// ===== Show Success Animation =====
function showSuccess(stageNumber) {
    const stageCard = document.querySelector(`#stage-${stageNumber} .stage-card`);
    stageCard.classList.add('success');
    
    // Add checkmark or success visual
    const input = document.getElementById(`answer-${stageNumber}`);
    input.style.borderColor = '#90EE90';
    input.style.backgroundColor = '#f0fff0';
}

// ===== Show Error Message =====
function showError(stageNumber, errorDiv) {
    errorAttempts[stageNumber]++;
    const messages = puzzles[stageNumber].errorMessages;
    const msgIndex = Math.min(errorAttempts[stageNumber] - 1, messages.length - 1);
    
    errorDiv.textContent = `❌ ${messages[msgIndex]}`;
    errorDiv.classList.add('error-visible');
    
    // Shake animation for wrong answer
    const input = document.getElementById(`answer-${stageNumber}`);
    input.style.animation = 'none';
    setTimeout(() => {
        input.style.animation = 'shake 0.4s ease-out';
    }, 10);
}

// ===== Update Progress Bar =====
function updateProgress(stageNumber) {
    const percentage = (stageNumber / 4) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressCurrent = document.getElementById('progress-current');
    
    progressFill.style.width = percentage + '%';
    progressCurrent.textContent = Math.min(stageNumber, 4);
}

// ===== Show Final Screen =====
function showFinalScreen() {
    const stages = document.querySelectorAll('.stage:not(#stage-final)');
    stages.forEach(stage => stage.classList.add('hidden'));
    
    const finalStage = document.getElementById('stage-final');
    finalStage.classList.remove('hidden');
    
    // Update progress to 4/4
    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('progress-current').textContent = '4';
    
    // Scroll to final screen
    setTimeout(() => {
        const header = document.querySelector('.header');
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    // Trigger confetti or celebration animations
    triggerCelebration();
}

// ===== Celebration Effect =====
function triggerCelebration() {
    // Enhance sparkles animation
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach(sparkle => {
        sparkle.style.animation = 'twinkle 1s ease-in-out infinite';
    });
    
    // Enhance hearts animation
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        heart.style.opacity = '0.6';
        heart.style.fontSize = '3rem';
    });
}

// ===== Restart Game =====
function restartGame() {
    // Reset variables
    currentStage = 1;
    errorAttempts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    };
    
    // Reset all inputs
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`answer-${i}`);
        const errorDiv = document.getElementById(`error-${i}`);
        
        if (input) {
            input.value = '';
            input.disabled = false;
            input.style.borderColor = '';
            input.style.backgroundColor = '';
        }
        
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.classList.remove('error-visible');
        }
    }
    
    // Reset sparkles and hearts
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach(sparkle => {
        sparkle.style.animation = 'twinkle 3s ease-in-out infinite';
    });
    
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        heart.style.opacity = '0.3';
        heart.style.fontSize = '2rem';
    });
    
    // Remove success classes
    const stageCards = document.querySelectorAll('.stage-card');
    stageCards.forEach(card => {
        card.classList.remove('success');
    });
    
    // Show first stage
    showStage(1);
}

// ===== Shake Animation (for wrong answer) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ===== Console Easter Eggs =====
console.log("%c🎂 Welcome to Birthday Mystery Escape! 🎁", "color: #ff69b4; font-size: 18px; font-weight: bold;");
console.log("%cYou're solving puzzles to reveal birthday gifts!", "color: #d946a6; font-size: 14px;");
console.log("%c ", "background: linear-gradient(135deg, #ff69b4, #ff1493); padding: 20px; border-radius: 10px;");
