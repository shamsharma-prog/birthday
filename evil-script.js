// ===== EVIL MODE - Twisted Puzzle Configuration with Daily Unlocks =====

const BIRTHDAY_DATE = new Date(2026, 2, 18); // March 18, 2026 (Apple Watch available on this date)
const START_DATE = new Date(2026, 2, 4); // March 4, 2026

const puzzles = {
    1: {
        correctAnswer: "max protein bar",
        errorMessages: [
            "Close, but not the exact brand of lies you're looking for...",
            "You're thinking of protein, but which brand deceives the gym curious?",
            "Protein is involved, but what's the deceptive name they use?",
            "Think of the brands that promise maximum gains. What's the actual name?",
            "It's a well-known gym bar brand. What word means 'greatest' or 'largest'?..."
        ],
        fakeAnswers: [
            "protein bar",
            "chocolate bar",
            "max bar",
            "whey protein",
            "energy bar",
            "fitness bar",
            "muscle bar",
            "protein candy"
        ]
    },
    2: {
        correctAnswer: "drag-and-drop",
        errorMessages: [
            "Not all meanings matched! Think about what these words mean to you.",
            "Some words aren't matched to their true meaning yet.",
            "Close! But are all the symbolic meanings matched correctly?",
            "You're almost there! Make sure each personal word is matched to its core meaning.",
            "These words hold special meaning. Match them wisely!"
        ],
        fakeAnswers: []
    },
    3: {
        correctAnswer: "diet coke",
        errorMessages: [
            "Base64 is just the beginning...",
            "First layer decoded. What's under it?",
            "The answer isn't what it seems.",
            "Two encodings? Three? How deep does it go?",
            "Inception of ciphers within ciphers..."
        ],
        fakeAnswers: [
            "zklia code",
            "v]lia code",
            "zkllia code",
            "base64 decode",
            "vjoakb Dpef"
        ]
    },
    4: {
        correctAnswer: "apple watch",
        errorMessages: [
            "Not quite. Analyze the requirements again. What body part? Which company?",
            "You're on the right track. It's [Company Name] + [Body Part]. Both lowercase.",
            "Close! Think of Apple's wearable ecosystem. What's it called?",
            "System design hint: Apple makes devices for every part of your life, including your wrist.",
            "🏗️ You're almost there! The product is worn on the wrist, made by Apple. What's its name?"
        ],
        fakeAnswers: [
            "apple wrist",
            "watch",
            "iwatch",
            "apple band",
            "fitness watch",
            "apple device",
            "wearable",
            "smartwatch",
            "apple tracker"
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

let wrongAnswersGiven = {
    1: [],
    2: [],
    3: [],
    4: []
};

// Drag-and-drop state - personal words
let dragAndDropMatches = {
    movie: null,
    kainchi: null,
    gymming: null,
    bali: null
};

let selectedScrambled = null; // Track which scrambled word is selected

// ===== Calculate available puzzles based on date =====
function getAvailablePuzzles() {
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDateOnly = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
    const birthdayDateOnly = new Date(BIRTHDAY_DATE.getFullYear(), BIRTHDAY_DATE.getMonth(), BIRTHDAY_DATE.getDate());

    // If before start date, no puzzles unlocked
    if (todayDateOnly < startDateOnly) return 0;

    // Calculate how many 3-day windows have passed since START_DATE
    const daysElapsed = Math.floor((todayDateOnly - startDateOnly) / (1000 * 60 * 60 * 24));
    // Each puzzle (1-3) unlocks every 3 days: puzzle 1 at day 0, puzzle 2 at day 3, puzzle 3 at day 6
    let available = Math.floor(daysElapsed / 3) + 1;

    // Cap available to 3 for the pre-birthday schedule
    if (available > 3) available = 3;

    // Puzzle 4 unlocks only on or after the birthday
    if (todayDateOnly >= birthdayDateOnly) available = 4;

    // Ensure bounds
    if (available < 0) available = 0;
    if (available > 4) available = 4;

    return available;
}

function getDayUntilUnlock(puzzleNum) {
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const birthdayDateOnly = new Date(BIRTHDAY_DATE.getFullYear(), BIRTHDAY_DATE.getMonth(), BIRTHDAY_DATE.getDate());
    
    // Puzzle 4 has special unlock on birthday
    if (puzzleNum === 4) {
        if (todayDateOnly >= birthdayDateOnly) {
            return 0; // Already unlocked
        }
        return Math.ceil((birthdayDateOnly - todayDateOnly) / (1000 * 60 * 60 * 24));
    }
    
    // Puzzles 1-3 unlock every 3 days
    const startDateOnly = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
    const daysElapsed = Math.floor((todayDateOnly - startDateOnly) / (1000 * 60 * 60 * 24));
    const unlockDay = (puzzleNum - 1) * 3;
    
    if (daysElapsed >= unlockDay) {
        return 0; // Already unlocked
    }
    
    return unlockDay - daysElapsed;
}

// ===== Initialize Game =====
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

document.addEventListener('keydown', (e) => {
    // Secret: Shift+D for debug mode
    if (e.shiftKey && e.key === 'D') {
        toggleDebugMode();
    }
    // Secret: Shift+S to skip
    if (e.shiftKey && e.key === 'S') {
        skipPuzzle(currentStage + 1);
    }
});

function initializeGame() {
    // Console message
    console.log("%c😈 EVIL MODE ACTIVATED 😈", "color: #ff1744; font-size: 18px; font-weight: bold;");
    console.log("%cWarning: Not everything you see is true.", "color: #ff5252; font-size: 14px;");
    console.log("%c", "background: linear-gradient(135deg, #ff1744, #ff5252); padding: 20px; border-radius: 10px;");
    console.log("%c🔐 Gate 2 hint: Drag the scrambled words to their correct matches...", "color: #ff1744; font-size: 12px; font-weight: bold;");
    console.log("%cMatch all four gifts to proceed to the next challenge!", "color: #ff5252; font-size: 11px;");
    // Print schedule of unlocks to the console for players
    console.log("%cUnlock Schedule:", "color: #ff69b4; font-size:14px; font-weight:bold;");
    for (let i = 1; i <= 4; i++) {
        const unlockDate = getUnlockDate(i);
        const daysLeft = getDayUntilUnlock(i);
        const status = daysLeft === 0 ? 'Unlocked' : `Unlocks in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
        // Special note for Gate 4
        if (i === 4) {
            console.log(`%cGate ${i}: ${unlockDate.toLocaleDateString()} — ${status} (Apple Watch available on this date)`, "color:#d946a6; font-size:12px;");
        } else {
            console.log(`%cGate ${i}: ${unlockDate.toLocaleDateString()} — ${status}` , "color:#d946a6; font-size:12px;");
        }
    }
    console.log("%cTip: Use the schedule to know when each gate becomes available.", "color:#ffb6c1; font-size:11px;");
    
    // Setup drag and drop
    setupDragAndDrop();
    
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
    
    // Check daily unlocks
    checkDailyUnlocks();
}

// ===== Show/Hide Stages =====
function showStage(stageNumber) {
    // Check if puzzle is unlocked
    const available = getAvailablePuzzles();
    if (stageNumber > available) {
        const daysLeft = getDayUntilUnlock(stageNumber);
        alert(`🔐 Gate ${stageNumber} unlocks in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!\nCome back on the ${getUnlockDate(stageNumber).toLocaleDateString()}.`);
        return;
    }
    
    // Hide all stages
    const stages = document.querySelectorAll('.stage:not(#stage-final)');
    stages.forEach(stage => stage.classList.add('hidden'));
    
    // Show specific stage
    const stageToShow = document.getElementById(`stage-${stageNumber}`);
    if (stageToShow) {
        stageToShow.classList.remove('hidden');
        const input = stageToShow.querySelector('.answer-input');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
        // Re-setup drag-and-drop if showing stage 2
        if (stageNumber === 2) {
            setTimeout(() => setupDragAndDrop(), 50);
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

// ===== Click-based matching functions =====
window.selectScrambled = function(element) {
    // Remove previous selection
    document.querySelectorAll('.scrambled-item').forEach(item => {
        item.style.borderColor = 'transparent';
        item.style.borderWidth = '2px';
        item.style.borderStyle = 'solid';
    });
    
    // Highlight selected item
    element.style.borderColor = '#4caf50';
    element.style.borderWidth = '3px';
    element.style.borderStyle = 'solid';
    selectedScrambled = element.getAttribute('data-word');
};

window.selectMatch = function(element) {
    if (!selectedScrambled) {
        alert('Please select a scrambled word first!');
        return;
    }
    
    const target = element.getAttribute('data-target');
    
    if (selectedScrambled === target) {
        // Correct match!
        dragAndDropMatches[target] = selectedScrambled;
        element.style.backgroundColor = 'rgba(76, 175, 80, 0.6)';
        element.style.color = '#4caf50';
        element.style.fontWeight = 'bold';
        element.style.borderColor = '#4caf50';
        element.style.borderWidth = '3px';
        element.style.borderStyle = 'solid';
        element.style.cursor = 'default';
        element.style.pointerEvents = 'none';
        
        // Hide and disable the matched scrambled item
        const matchedItem = document.querySelector(`.scrambled-item[data-word="${selectedScrambled}"]`);
        if (matchedItem) {
            matchedItem.style.display = 'none';
        }
        
        selectedScrambled = null;
        
        // Remove selection border from all
        document.querySelectorAll('.scrambled-item').forEach(item => {
            item.style.borderColor = 'transparent';
        });
    } else {
        // Wrong match - show error
        element.style.backgroundColor = 'rgba(255, 69, 0, 0.4)';
        element.style.borderColor = '#ff4500';
        element.style.borderWidth = '3px';
        element.style.borderStyle = 'solid';
        
        setTimeout(() => {
            element.style.backgroundColor = 'rgba(255, 105, 180, 0.05)';
            element.style.borderColor = 'rgba(255, 105, 180, 0.5)';
            element.style.borderWidth = '3px';
            element.style.borderStyle = 'dashed';
        }, 500);
    }
};

// ===== Setup Drag and Drop (no longer used, kept for compatibility) =====
function setupDragAndDrop() {
    // Click-based system now in place
}

// ===== Check Daily Unlocks =====
function checkDailyUnlocks() {
    for (let i = 1; i <= 4; i++) {
        const available = getAvailablePuzzles();
        const stageBtn = document.querySelector(`#stage-${i} .unlock-btn`);
        const timerDiv = document.getElementById(`timer-${i}`);
        const input = document.getElementById(`answer-${i}`);
        
        if (i > available) {
            // Locked
            if (input) input.disabled = true;
            const daysLeft = getDayUntilUnlock(i);
            if (timerDiv) {
                timerDiv.innerHTML = `🔒 Unlocks in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
                timerDiv.style.color = '#ff69b4';
                timerDiv.style.marginTop = '10px';
                timerDiv.style.fontWeight = 'bold';
            }
        } else {
            // Unlocked
            if (input) input.disabled = false;
            if (timerDiv) timerDiv.innerHTML = '✅ Unlocked!';
        }
    }
}

function getUnlockDate(puzzleNum) {
    if (puzzleNum === 4) {
        return new Date(BIRTHDAY_DATE);
    }
    
    const date = new Date(START_DATE);
    const daysToAdd = (puzzleNum - 1) * 3;
    date.setDate(date.getDate() + daysToAdd);
    return date;
}

// ===== Check System Design Answers =====
window.checkSystemDesignAnswers = function() {
    const finalSection = document.getElementById('final-answer-section');
    
    // If final section already visible, user is submitting final answer
    if (finalSection.style.display === 'block') {
        checkAnswer(4);
        return;
    }
    
    const ans1 = document.getElementById('answer-4-1').value.trim().toUpperCase();
    const ans2 = document.getElementById('answer-4-2').value.trim().toUpperCase();
    const ans3 = document.getElementById('answer-4-3').value.trim().toUpperCase();
    
    const status1 = document.getElementById('status-4-1');
    const status2 = document.getElementById('status-4-2');
    const status3 = document.getElementById('status-4-3');
    const errorDiv = document.getElementById('error-4');
    
    let allCorrect = true;
    
    // Correct answers: B, B, B (Event-Driven, Batch Sync, Load Balanced Microservices)
    if (ans1 === 'B') {
        status1.textContent = '✅ Correct! Event-Driven architecture chosen.';
        status1.style.color = '#4caf50';
    } else {
        status1.textContent = '❌ Incorrect. Need Event-Driven pattern for concurrent connections.';
        status1.style.color = '#ff5252';
        allCorrect = false;
    }
    
    if (ans2 === 'B') {
        status2.textContent = '✅ Correct! Batch sync + compression for battery life.';
        status2.style.color = '#4caf50';
    } else {
        status2.textContent = '❌ Incorrect. Battery constraints require batch syncing.';
        status2.style.color = '#ff5252';
        allCorrect = false;
    }
    
    if (ans3 === 'B') {
        status3.textContent = '✅ Correct! Load-balanced microservices for scale.';
        status3.style.color = '#4caf50';
    } else {
        status3.textContent = '❌ Incorrect. Need microservices + load balancing for 100M users.';
        status3.style.color = '#ff5252';
        allCorrect = false;
    }
    
    if (allCorrect) {
        errorDiv.textContent = '🏗️ Architecture validated! Now identify the product and submit your final answer.';
        errorDiv.style.color = '#4caf50';
        errorDiv.classList.add('error-visible');
        finalSection.style.display = 'block';
        setTimeout(() => document.getElementById('answer-4').focus(), 300);
    } else {
        errorDiv.textContent = '⚠️ Review your architectural decisions. Some answers need adjustment.';
        errorDiv.style.color = '#ff5252';
        errorDiv.classList.add('error-visible');
        finalSection.style.display = 'none';
    }
};

// ===== Check Answer =====
function checkAnswer(stageNumber) {
    // FIRST: Check if puzzle is unlocked
    const available = getAvailablePuzzles();
    if (stageNumber > available) {
        const daysLeft = getDayUntilUnlock(stageNumber);
        const errorDiv = document.getElementById(`error-${stageNumber}`);
        errorDiv.textContent = `🔐 Locked! Come back on ${getUnlockDate(stageNumber).toLocaleDateString()}`;
        errorDiv.classList.add('error-visible');
        return;
    }
    
    const errorDiv = document.getElementById(`error-${stageNumber}`);
    const fakeSuccessDiv = document.getElementById(`fake-success-${stageNumber}`);
    
    // Clear previous messages
    errorDiv.textContent = '';
    errorDiv.classList.remove('error-visible');
    if (fakeSuccessDiv) {
        fakeSuccessDiv.style.display = 'none';
    }
    
    // SPECIAL HANDLING FOR DRAG-AND-DROP PUZZLE (Stage 2)
    if (stageNumber === 2) {
        const allMatched = dragAndDropMatches.movie !== null && 
                          dragAndDropMatches.kainchi !== null && 
                          dragAndDropMatches.gymming !== null && 
                          dragAndDropMatches.bali !== null;
        
        console.log('Checking matches:', dragAndDropMatches, 'All matched:', allMatched);
        
        if (allMatched) {
            showSuccess(stageNumber);
            // Disable all items
            document.querySelectorAll('.scrambled-item').forEach(item => {
                item.style.pointerEvents = 'none';
                item.style.opacity = '0.5';
            });
            document.querySelectorAll('.drop-zone').forEach(zone => {
                zone.style.pointerEvents = 'none';
            });
            
            setTimeout(() => {
                currentStage = 3;
                showStage(3);
            }, 1000);
        } else {
            errorDiv.textContent = '❌ Match all 4 words before proceeding!';
            errorDiv.classList.add('error-visible');
        }
        return;
    }
    
    // NORMAL HANDLING FOR TEXT INPUT PUZZLES
    const input = document.getElementById(`answer-${stageNumber}`);
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = puzzles[stageNumber].correctAnswer.toLowerCase();
    const fakeAnswers = puzzles[stageNumber].fakeAnswers;
    
    // Track wrong answers
    wrongAnswersGiven[stageNumber].push(userAnswer);
    
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
                currentStage = 'final';
                showFinalScreen();
            }
        }, 600);
    } else if (fakeAnswers.includes(userAnswer)) {
        // Fake answer detected! Show fake success
        showFakeSuccess(stageNumber, fakeSuccessDiv, input);
    } else {
        // Wrong answer
        showError(stageNumber, errorDiv);
    }
}

// ===== Show Fake Success ===== 
function showFakeSuccess(stageNumber, fakeSuccessDiv, input) {
    const randomChance = Math.random();
    
    if (randomChance < 0.4) {
        // Show fake success message
        fakeSuccessDiv.style.display = 'block';
        
        // After 1 second, show error
        setTimeout(() => {
            fakeSuccessDiv.style.display = 'none';
            const errorDiv = document.getElementById(`error-${stageNumber}`);
            errorDiv.textContent = `❌ Wait... that was a red herring!`;
            errorDiv.classList.add('error-visible');
            
            // Subtle shake
            input.style.animation = 'none';
            setTimeout(() => {
                input.style.animation = 'shake 0.4s ease-out';
            }, 10);
        }, 1200);
    } else {
        // Just show error immediately - keeps them guessing
        const errorDiv = document.getElementById(`error-${stageNumber}`);
        errorDiv.textContent = `❌ That's a tempting answer, but not the truth...`;
        errorDiv.classList.add('error-visible');
        
        input.style.animation = 'none';
        setTimeout(() => {
            input.style.animation = 'shake 0.4s ease-out';
        }, 10);
    }
}

// ===== Show Success Animation =====
function showSuccess(stageNumber) {
    const stageCard = document.querySelector(`#stage-${stageNumber} .stage-card`);
    stageCard.classList.add('success');
    
    // Only style input if it exists (Stage 2 doesn't have text input)
    const input = document.getElementById(`answer-${stageNumber}`);
    if (input) {
        input.style.borderColor = '#4caf50';
        input.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    }
}

// ===== Show Error Message =====
function showError(stageNumber, errorDiv) {
    errorAttempts[stageNumber]++;
    const messages = puzzles[stageNumber].errorMessages;
    const msgIndex = Math.min(errorAttempts[stageNumber] - 1, messages.length - 1);
    
    errorDiv.textContent = `❌ ${messages[msgIndex]}`;
    errorDiv.classList.add('error-visible');
    
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
    
    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('progress-current').textContent = '4';
    
    setTimeout(() => {
        const header = document.querySelector('.header');
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ===== Restart Game =====
function restartGame() {
    location.reload();
}

// ===== Debug Mode =====
let debugMode = false;
function toggleDebugMode() {
    debugMode = !debugMode;
    console.log(`%cDebug Mode: ${debugMode ? 'ON' : 'OFF'}`, "color: #ff1744; font-weight: bold;");
    if (debugMode) {
        console.log("%cCorrect Answers:", "color: #ff5252; font-weight: bold;");
        for (let i = 1; i <= 4; i++) {
            console.log(`%cGate ${i}: ${puzzles[i].correctAnswer}`, "color: #ff1744;");
        }
        console.log("%cFake Answers (to mislead you):", "color: #ff5252; font-weight: bold;");
        for (let i = 1; i <= 4; i++) {
            console.log(`%cGate ${i}: ${puzzles[i].fakeAnswers.join(', ')}`, "color: #ff1744;");
        }
    }
}

// ===== Skip Puzzle ===== 
function skipPuzzle(stage) {
    if (stage <= 4) {
        currentStage = stage;
        showStage(stage);
        console.log(`%c⚠️ Skipped to Gate ${stage}!`, "color: #ff1744; font-weight: bold;");
    } else {
        showFinalScreen();
    }
}

// ===== Shake Animation =====
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .stage-card.success {
        animation: successPulse 0.6s ease-out;
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
