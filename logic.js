
import { EXERCISE_DB } from './data.js';

/**
 * Generates a personalized routine plan based on user profile.
 * 
 * @param {Object} userProfile 
 * @param {string} userProfile.goal 'hypertrophy' | 'strength' | 'weight_loss'
 * @param {number} userProfile.daysAvailable 3 | 4 | 5
 * @param {string} userProfile.experience 'beginner' | 'advanced'
 * @param {string[]} userProfile.equipment ['gym'] | ['home', 'dumbbell'] etc.
 * @returns {Array} List of Routine objects
 */
export function createPersonalizedRoutine(userProfile) {
    console.log("Generating routine for:", userProfile);

    // 1. Determine Split
    const split = getSplitDistribution(userProfile.daysAvailable);

    // 2. Determine Rep Scheme
    const repScheme = getRepScheme(userProfile.goal);

    // 3. Generate Routines
    const routines = split.map((dayConfig, index) => {
        return generateRoutineForDay(dayConfig, userProfile, repScheme, index + 1);
    });

    return routines;
}

/**
 * Returns the split structure based on days available.
 */
function getSplitDistribution(days) {
    switch (days) {
        case 3:
            return [
                { name: "Full Body A", targets: ["chest", "back", "legs", "shoulders", "core"], justification: "Frecuencia sistémica 3x para máxima señalización anabólica." },
                { name: "Full Body B", targets: ["legs", "chest", "back", "shoulders", "arms"], justification: "Énfasis en cadenas cinéticas compuestas." },
                { name: "Full Body C", targets: ["back", "legs", "chest", "arms", "core"], justification: "Volumen residual para recuperación neurológica." }
            ];
        case 4:
            return [
                { name: "Torso A", targets: ["chest", "back", "shoulders", "triceps"], justification: "Sobrecarga progresiva en tren superior." },
                { name: "Pierna A", targets: ["quads", "hamstrings", "calves", "abs"], justification: "Estímulo de alto umbral para el tren inferior." },
                { name: "Torso B", targets: ["shoulders", "back", "chest", "biceps"], justification: "Variación de ángulos para reclutamiento fibrilar completo." },
                { name: "Pierna B", targets: ["glutes", "quads", "hamstrings", "calves"], justification: "Enfoque en cadena posterior y estabilizadores." }
            ];
        case 5:
            return [
                { name: "Empuje (Push)", targets: ["chest", "shoulders", "triceps"], justification: "Sinergia de empuje para eficiencia mecánica." },
                { name: "Tirón (Pull)", targets: ["back", "biceps", "rear_delt"], justification: "Tracción vertical y horizontal para densidad." },
                { name: "Pierna (Legs)", targets: ["quads", "hamstrings", "calves"], justification: "Día de alta intensidad para grandes grupos musculares." },
                { name: "Torso (Upper)", targets: ["chest", "back", "shoulders", "arms"], justification: "Volumen de acumulación para deltoides y brazos." },
                { name: "Pierna (Lower)", targets: ["glutes", "quads", "hamstrings", "abs"], justification: "Trabajo metabólico y aislamiento." }
            ];
        default:
            return [
                { name: "Full Body A", targets: ["chest", "back", "legs"], justification: "Activación general." },
                { name: "Full Body B", targets: ["legs", "chest", "back"], justification: "Consolidación de patrones motores." },
                { name: "Full Body C", targets: ["back", "legs", "chest"], justification: "Resistencia a la fatiga." }
            ];
    }
}

/**
 * Returns sets/reps object based on goal.
 */
function getRepScheme(goal) {
    if (goal === 'strength') {
        return { sets: 5, reps: "5", rest: 180, type: "Force", rationale: "Rango óptimo para adaptaciones neurológicas y reclutamiento de unidades motoras de alto umbral." };
    } else if (goal === 'weight_loss') {
        return { sets: 4, reps: "12-15", rest: 45, type: "Circuit", rationale: "Densidad de entrenamiento elevada para maximizar el EPOC (consumo de oxígeno post-ejercicio)." };
    } else {
        // Default Hypertrophy
        return { sets: 4, reps: "8-12", rest: 90, type: "Hypertrophy", rationale: "Volumen prescrito para maximizar el estrés metabólico y la tensión mecánica (Drivers de hipertrofia)." };
    }
}

/**
 * Generates a specific routine object for a given day configuration.
 */
function generateRoutineForDay(dayConfig, user, repScheme, dayNum) {
    const exercises = [];
    let keyExercises = [];

    dayConfig.targets.forEach(target => {
        const exercise = selectBestExercise(target, user, exercises);
        if (exercise) {
            let finalSets = repScheme.sets;
            let finalReps = repScheme.reps;

            if (exercise.type === 'isolation') {
                if (user.goal === 'strength') finalReps = "8-12";
                finalSets = Math.max(3, finalSets - 1);
            }

            // Keep track of compounds for rationale
            if (exercise.type === 'compound' && keyExercises.length < 2) {
                keyExercises.push(exercise.name);
            }

            exercises.push({
                exerciseId: exercise.id,
                name: exercise.name,
                sets: finalSets,
                reps: finalReps,
                rest: repScheme.rest,
                explanation: exercise.explanation_tag
            });
        }
    });

    const rationale = generateRationale(dayConfig, repScheme, keyExercises);

    return {
        id: `auto_${Date.now()}_${dayNum}`,
        name: dayConfig.name,
        description: `Plan IA: ${dayConfig.justification}`,
        rationale: rationale,
        exercises: exercises
    };
}

function generateRationale(dayConfig, repScheme, keyExercises) {
    return `
        HEMOS PRESCRITO este volumen para optimizar tu ${repScheme.type.toLowerCase()}. 
        La distribución '${dayConfig.name}' ha sido seleccionada para ${dayConfig.justification.toLowerCase()} 
        
        Se ha priorizado '${keyExercises[0]}' y '${keyExercises[1] || 'ejercicios compuestos'}' como ejes centrales 
        para garantizar una sobrecarga progresiva eficiente. 
        
        Rango de trabajo: ${repScheme.reps} reps.
        ${repScheme.rationale}
    `.trim().replace(/\s+/g, ' ');
}

/**
 * Selects the best available exercise for a target muscle.
 */
function selectBestExercise(target, user, currentList) {
    let candidates = EXERCISE_DB.filter(ex => {
        const hitsTarget = ex.target.includes(target) || ex.target.includes('all');

        const isBodyweight = ex.equipment.includes('bodyweight') || ex.equipment.includes('none');
        if (isBodyweight) return hitsTarget;

        const userHasGym = user.equipment.includes('gym');
        if (userHasGym) return hitsTarget;

        const hasTools = ex.equipment.some(tool => user.equipment.includes(tool));
        return hitsTarget && hasTools;
    });

    candidates = candidates.filter(c => !currentList.find(existing => existing.exerciseId === c.id));

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => {
        if (a.type === 'compound' && b.type === 'isolation') return -1;
        if (a.type === 'isolation' && b.type === 'compound') return 1;
        return 0.5 - Math.random();
    });

    return candidates[0];
}
