const START_DATE = new Date(2026, 2, 4); // March 4, 2026
const BIRTHDAY_DATE = new Date(2026, 2, 18); // March 18, 2026

function getUnlockDate(puzzleNum) {
    if (puzzleNum === 4) return new Date(BIRTHDAY_DATE);
    const date = new Date(START_DATE);
    const daysToAdd = (puzzleNum - 1) * 3;
    date.setDate(date.getDate() + daysToAdd);
    return date;
}

function getAvailablePuzzles(today = new Date()) {
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDateOnly = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
    const birthdayDateOnly = new Date(BIRTHDAY_DATE.getFullYear(), BIRTHDAY_DATE.getMonth(), BIRTHDAY_DATE.getDate());

    if (todayDateOnly < startDateOnly) return 0;
    const daysElapsed = Math.floor((todayDateOnly - startDateOnly) / (1000 * 60 * 60 * 24));
    let available = Math.floor(daysElapsed / 3) + 1;
    if (available > 3) available = 3;
    if (todayDateOnly >= birthdayDateOnly) available = 4;
    if (available < 0) available = 0;
    if (available > 4) available = 4;
    return available;
}

function getDayUntilUnlock(puzzleNum, today = new Date()) {
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (puzzleNum === 4) {
        const birthdayDateOnly = new Date(BIRTHDAY_DATE.getFullYear(), BIRTHDAY_DATE.getMonth(), BIRTHDAY_DATE.getDate());
        if (todayDateOnly >= birthdayDateOnly) return 0;
        return Math.ceil((birthdayDateOnly - todayDateOnly) / (1000 * 60 * 60 * 24));
    }
    const startDateOnly = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
    const daysElapsed = Math.floor((todayDateOnly - startDateOnly) / (1000 * 60 * 60 * 24));
    const unlockDay = (puzzleNum - 1) * 3;
    if (daysElapsed >= unlockDay) return 0;
    return unlockDay - daysElapsed;
}

const today = new Date(2026, 2, 4); // Simulate March 4, 2026
console.log('Today:', today.toDateString());
for (let i = 1; i <= 4; i++) {
    const unlockDate = getUnlockDate(i);
    const daysLeft = getDayUntilUnlock(i, today);
    console.log(`Gate ${i}: unlock date = ${unlockDate.toDateString()}, daysUntilUnlock = ${daysLeft}`);
}
console.log('Available puzzles today:', getAvailablePuzzles(today));
