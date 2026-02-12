/**
 * Database Layer for Kano Gym App
 * Handles persistence using localStorage with a simple JSON structure.
 */

const KEYS = {
    USER_PROFILE: 'kano_user_profile',
    EXERCISES: 'kano_exercises',
    ROUTINES: 'kano_routines',
    WORKOUTS: 'kano_workouts'
};

// --- Core Storage Helpers ---

/**
 * Save data to localStorage
 * @param {string} key 
 * @param {any} data 
 */
export function saveData(key, data) {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(key, serialized);
        // console.log(`[DB] Saved ${key}`);
    } catch (error) {
        console.error(`[DB] Error saving ${key}:`, error);
        alert("Quota exceeded! Cannot save data.");
    }
}

/**
 * Load data from localStorage
 * @param {string} key 
 * @returns {any|null} Parsed data or null
 */
export function loadData(key) {
    try {
        const serialized = localStorage.getItem(key);
        return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
        console.error(`[DB] Error loading ${key}:`, error);
        return null;
    }
}

/**
 * Delete data from localStorage
 * @param {string} key 
 */
export function deleteData(key) {
    localStorage.removeItem(key);
}

/**
 * Update data using a callback function
 * @param {string} key 
 * @param {function} updateFn (currentData) => newData
 */
export function updateData(key, updateFn) {
    const current = loadData(key);
    const updated = updateFn(current);
    saveData(key, updated);
    return updated;
}

// --- Init & Seed Data ---

export function initDB() {
    console.log('[DB] Initializing...');

    // 1. Check & Seed Exercises
    if (!loadData(KEYS.EXERCISES)) {
        console.log('[DB] Seeding Exercises...');
        saveData(KEYS.EXERCISES, MOCK_DATA.exercises);
    }

    // 2. Check & Seed Routines
    if (!loadData(KEYS.ROUTINES)) {
        console.log('[DB] Seeding Routines...');
        saveData(KEYS.ROUTINES, MOCK_DATA.routines);
    }

    // 3. Check & Seed User Profile
    let user = loadData(KEYS.USER_PROFILE);
    if (!user) {
        console.log('[DB] Seeding User Profile...');
        saveData(KEYS.USER_PROFILE, MOCK_DATA.userProfile);
    } else if (!user.gamification) {
        // Migration: Add gamification if missing
        console.log('[DB] Migrating User Profile (Adding Gamification)...');
        user.gamification = MOCK_DATA.userProfile.gamification;
        saveData(KEYS.USER_PROFILE, user);
    }

    // 4. Check & Seed Workouts (History)
    if (!loadData(KEYS.WORKOUTS)) {
        console.log('[DB] Seeding Workouts...'); // Start empty or with 1 sample
        saveData(KEYS.WORKOUTS, MOCK_DATA.workouts);
    }

    console.log('[DB] Initialization Complete.');
}


// --- Data Collections Helpers ---

export const DB = {
    KEYS,

    // Generic Getters
    getExercises: () => loadData(KEYS.EXERCISES) || [],
    getRoutines: () => loadData(KEYS.ROUTINES) || [],
    getWorkouts: () => loadData(KEYS.WORKOUTS) || [],
    getUserProfile: () => loadData(KEYS.USER_PROFILE),

    // Specific Actions
    saveWorkout: (workout) => {
        const history = loadData(KEYS.WORKOUTS) || [];
        history.unshift(workout); // Add to beginning
        saveData(KEYS.WORKOUTS, history);
    },

    createRoutine: (routine) => {
        const routines = loadData(KEYS.ROUTINES) || [];
        routines.push(routine);
        saveData(KEYS.ROUTINES, routines);
    },

    updateUserProfile: (profile) => {
        saveData(KEYS.USER_PROFILE, profile);
    },

    // Reset for testing
    clearAll: () => {
        Object.values(KEYS).forEach(k => deleteData(k));
        console.warn('[DB] All data cleared.');
    },

    // --- Data Management (Backup/Restore) ---
    exportData: () => {
        const data = {
            timestamp: Date.now(),
            version: 1,
            userProfile: loadData(KEYS.USER_PROFILE),
            exercises: loadData(KEYS.EXERCISES),
            routines: loadData(KEYS.ROUTINES),
            workouts: loadData(KEYS.WORKOUTS)
        };
        return JSON.stringify(data, null, 2);
    },

    importData: (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            if (!data.userProfile || !data.routines) {
                throw new Error("Invalid structure");
            }
            saveData(KEYS.USER_PROFILE, data.userProfile);
            saveData(KEYS.EXERCISES, data.exercises);
            saveData(KEYS.ROUTINES, data.routines);
            saveData(KEYS.WORKOUTS, data.workouts || []);
            return true;
        } catch (e) {
            console.error("Import failed", e);
            return false;
        }
    },

    hardReset: () => {
        Object.values(KEYS).forEach(k => deleteData(k));
        window.location.reload();
    }
};

// --- Mock Data Definitions ---

const MOCK_DATA = {
    userProfile: {
        name: "New Athlete",
        weight: 75, // kg
        height: 180, // cm
        experienceLevel: "Beginner", // Beginner, Intermediate, Advanced
        goals: ["Strength", "Hypertrophy"],
        gamification: {
            currentStreak: 0,
            maxStreak: 0,
            totalXP: 0,
            level: 1,
            lastWorkoutTimestamp: null
        }
    },
    exercises: [
        { id: "ex_001", name: "Push Up", muscleGroup: "Chest", type: "Bodyweight", equipment: "None" },
        { id: "ex_002", name: "Squat", muscleGroup: "Legs", type: "Compound", equipment: "None" },
        { id: "ex_003", name: "Pull Up", muscleGroup: "Back", type: "Bodyweight", equipment: "Bar" },
        { id: "ex_004", name: "Plank", muscleGroup: "Core", type: "Isometric", equipment: "None" },
        { id: "ex_005", name: "Lunge", muscleGroup: "Legs", type: "Unilateral", equipment: "None" },
        { id: "ex_006", name: "Dumbbell Press", muscleGroup: "Shoulders", type: "Compound", equipment: "Dumbbells" },
        { id: "ex_007", name: "Deadlift", muscleGroup: "Back/Legs", type: "Compound", equipment: "Barbell" }
    ],
    routines: [
        {
            id: "rt_001",
            name: "Full Body Starter",
            description: "A simple routine to get moving.",
            exercises: [
                { exerciseId: "ex_002", sets: 3, reps: "12" }, // Squat
                { exerciseId: "ex_001", sets: 3, reps: "10" }, // Pushup
                { exerciseId: "ex_004", sets: 3, time: "30s" } // Plank
            ]
        }
    ],
    workouts: [
        // One sample past workout
        {
            id: "wk_past_01",
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            routineId: "rt_001",
            routineName: "Full Body Starter",
            duration: 1800, // seconds
            exercises: [
                { exerciseId: "ex_002", setsCompleted: 3, bestSet: "15 reps" },
                { exerciseId: "ex_001", setsCompleted: 3, bestSet: "12 reps" },
                { exerciseId: "ex_004", setsCompleted: 3, bestSet: "45s" }
            ],
            notes: "Felt good, first workout!"
        }
    ]
};
