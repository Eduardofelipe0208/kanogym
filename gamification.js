/**
 * Gamification Logic Module
 * Handles Streaks, XP, and Levels.
 */

// Constants
const XP_PER_ROUTINE = 100;
const XP_PER_REP = 1;
const RESET_HOURS = 48;

/**
 * Calculates user level based on Total XP.
 * Formula: Level = sqrt(XP / 50) + 1
 */
export function calculateLevel(totalXP) {
    if (!totalXP) return 1;
    return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}

/**
 * Calculates XP gained from a completed workout.
 * @param {Object} workout - The workout object containing exercises/sets.
 * @returns {number} XP gained.
 */
export function calculateXP(workout) {
    let repXP = 0;

    if (workout.exercises) {
        workout.exercises.forEach(ex => {
            // Count completed sets
            // In the app, we saved 'setsCompleted' as array of booleans or similar?
            // Actually app.js saves: setsCompleted: [] (indexes?)
            // Let's assume input workout has a way to know reps performed.
            // app.js logic:
            // "exercises: routine.exercises.map... return { ... targetSets, targetReps, setsCompleted: [] }"
            // When finishing, we should ideally know how many ACTUAL reps were done.
            // For now, let's assume if a set is completed, they did 'targetReps' amount.

            // Check app.js 'finishWorkout' -> calls DB.saveWorkout(this.activeWorkout)
            // activeWorkout has exercises with setsCompleted (indices of checked sets).

            if (ex.setsCompleted && Array.isArray(ex.setsCompleted)) {
                // ex.setsCompleted is likely just a list of indices like [0, 1]
                const completedCount = ex.setsCompleted.length;
                const repsPerSet = parseInt(ex.targetReps) || 0; // targetReps might be "8-12", parse int takes 8.
                repXP += (completedCount * repsPerSet * XP_PER_REP);
            }
        });
    }

    return XP_PER_ROUTINE + repXP;
}

/**
 * Updates streak based on last workout timestamp.
 * @param {Object} currentGamificationState 
 * @param {number} lastWorkoutTime (Timestamp)
 * @param {number} newWorkoutTime (Timestamp)
 * @returns {Object} Updated streak stats { currentStreak, maxStreak }
 */
export function updateStreak(state, lastWorkoutTime, newWorkoutTime) {
    let { currentStreak, maxStreak } = state;

    if (!lastWorkoutTime) {
        // First workout ever
        return { currentStreak: 1, maxStreak: 1 };
    }

    const lastDate = new Date(lastWorkoutTime);
    const newDate = new Date(newWorkoutTime);

    // Reset hours check (48h)
    const diffHours = (newDate - lastDate) / (1000 * 60 * 60);

    // Check if same day (no increase, just maintain)
    const isSameDay = lastDate.getDate() === newDate.getDate() &&
        lastDate.getMonth() === newDate.getMonth() &&
        lastDate.getFullYear() === newDate.getFullYear();

    if (isSameDay) {
        return { currentStreak, maxStreak }; // Maintain
    }

    if (diffHours > RESET_HOURS) {
        // Reset streak
        currentStreak = 1;
    } else {
        // Valid daily progression
        currentStreak += 1;
    }

    if (currentStreak > maxStreak) maxStreak = currentStreak;

    return { currentStreak, maxStreak };
}

export function getInitialGamificationState() {
    return {
        currentStreak: 0,
        maxStreak: 0,
        totalXP: 0,
        level: 1,
        lastWorkoutTimestamp: null
    };
}
