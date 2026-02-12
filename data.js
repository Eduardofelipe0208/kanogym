/**
 * Exercise Database for Kano Gym Recommendation Engine.
 * Contains 33 detailed exercises with metadata for filtering and logic.
 * Updated with Visual Assets (Placeholders).
 */
export const EXERCISE_DB = [
    // --- CHEST ---
    {
        id: "ch_001",
        name: "Press de Banca con Barra",
        target: ["chest", "triceps", "front_delt"],
        type: "compound",
        equipment: ["gym", "barbell", "bench"],
        difficulty: "intermediate",
        explanation_tag: "El rey para desarrollar fuerza y masa en el pecho.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Bench+Press+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Bench+Press"
    },
    {
        id: "ch_002",
        name: "Flexiones (Push Ups)",
        target: ["chest", "triceps", "core"],
        type: "compound",
        equipment: ["bodyweight", "home", "park"],
        difficulty: "beginner",
        explanation_tag: "Fundamental para control corporal y empuje horizontal.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Push+Ups+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Push+Ups"
    },
    {
        id: "ch_003",
        name: "Press Inclinado con Mancuernas",
        target: ["upper_chest", "front_delt", "triceps"],
        type: "compound",
        equipment: ["gym", "dumbbells", "bench"],
        difficulty: "intermediate",
        explanation_tag: "Enfatiza la porción clavicular (superior) del pectoral.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Incline+DB+Press+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Incline+DB"
    },
    {
        id: "ch_004",
        name: "Fondos en Paralelas (Dips)",
        target: ["lower_chest", "triceps", "front_delt"],
        type: "compound",
        equipment: ["gym", "bars", "park"],
        difficulty: "advanced",
        explanation_tag: "Excelente para el desarrollo del pecho inferior y tríceps.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Dips+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Dips"
    },
    {
        id: "ch_005",
        name: "Aperturas en Polea (Cable Flys)",
        target: ["chest"],
        type: "isolation",
        equipment: ["gym", "cables"],
        difficulty: "intermediate",
        explanation_tag: "Tensión constante en todo el rango de movimiento.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Cable+Flys+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Cable+Flys"
    },

    // --- BACK ---
    {
        id: "bk_001",
        name: "Dominadas (Pull Ups)",
        target: ["lats", "biceps", "upper_back"],
        type: "compound",
        equipment: ["gym", "bar", "park"],
        difficulty: "advanced",
        explanation_tag: "El mejor constructor de amplitud de espalda.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Pull+Ups+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Pull+Ups"
    },
    {
        id: "bk_002",
        name: "Remo con Barra (Bent Over Row)",
        target: ["lats", "rhomboids", "rear_delt"],
        type: "compound",
        equipment: ["gym", "barbell"],
        difficulty: "intermediate",
        explanation_tag: "Desarrolla densidad y grosor en la espalda media.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Barbell+Row+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Barbell+Row"
    },
    {
        id: "bk_003",
        name: "Jalón al Pecho (Lat Pulldown)",
        target: ["lats", "biceps"],
        type: "compound",
        equipment: ["gym", "cables"],
        difficulty: "beginner",
        explanation_tag: "Alternativa controlada a las dominadas para amplitud.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Lat+Pulldown+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Lat+Pulldown"
    },
    {
        id: "bk_004",
        name: "Peso Muerto Convencional",
        target: ["lower_back", "hamstrings", "glutes", "traps"],
        type: "compound",
        equipment: ["gym", "barbell"],
        difficulty: "advanced",
        explanation_tag: "Ejercicio sistémico total para fuerza bruta.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Deadlift+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Deadlift"
    },
    {
        id: "bk_005",
        name: "Face Pulls",
        target: ["rear_delt", "rotator_cuff", "upper_back"],
        type: "isolation",
        equipment: ["gym", "cables", "bands"],
        difficulty: "beginner",
        explanation_tag: "Crucial para la salud de hombros y postura.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Face+Pulls+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Face+Pulls"
    },

    // --- LEGS (QUADS/GLUTES/HAMS) ---
    {
        id: "lg_001",
        name: "Sentadilla Trasera (Barbell Squat)",
        target: ["quads", "glutes", "core"],
        type: "compound",
        equipment: ["gym", "barbell", "rack"],
        difficulty: "intermediate",
        explanation_tag: "El movimiento fundamental para el tren inferior.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Squat+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Squat"
    },
    {
        id: "lg_002",
        name: "Prensa de Piernas (Leg Press)",
        target: ["quads", "glutes"],
        type: "compound",
        equipment: ["gym", "machine"],
        difficulty: "beginner",
        explanation_tag: "Volumen de pierna seguro sin cargar la columna.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Leg+Press+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Leg+Press"
    },
    {
        id: "lg_003",
        name: "Zancadas Búlgaras",
        target: ["quads", "glutes", "balance"],
        type: "compound",
        equipment: ["gym", "bench", "dumbbells", "home"],
        difficulty: "advanced",
        explanation_tag: "Corrige desequilibrios y construye glúteos potentes.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Bulgarian+Split+Squat+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Bulgarian"
    },
    {
        id: "lg_004",
        name: "Extensiones de Cuádriceps",
        target: ["quads"],
        type: "isolation",
        equipment: ["gym", "machine"],
        difficulty: "beginner",
        explanation_tag: "Aísla el recto femoral para detalle muscular.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Leg+Extension+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Leg+Extension"
    },
    {
        id: "lg_005",
        name: "Peso Muerto Rumano",
        target: ["hamstrings", "glutes", "lower_back"],
        type: "compound",
        equipment: ["gym", "barbell", "dumbbells"],
        difficulty: "intermediate",
        explanation_tag: "Enfocado en la cadena posterior y flexibilidad isquiosural.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=RDL+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=RDL"
    },
    {
        id: "lg_006",
        name: "Curl Femoral Tumbado",
        target: ["hamstrings"],
        type: "isolation",
        equipment: ["gym", "machine"],
        difficulty: "beginner",
        explanation_tag: "Aislamiento directo para la parte trasera del muslo.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Hamstring+Curl+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Ham+Curl"
    },
    {
        id: "lg_007",
        name: "Elevación de Talones de Pie",
        target: ["calves"],
        type: "isolation",
        equipment: ["gym", "machine", "dumbbells"],
        difficulty: "beginner",
        explanation_tag: "Esencial para el desarrollo de los gemelos.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Calf+Raise+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Calf+Raise"
    },

    // --- SHOULDERS ---
    {
        id: "sh_001",
        name: "Press Militar (Overhead Press)",
        target: ["front_delt", "triceps", "core"],
        type: "compound",
        equipment: ["gym", "barbell"],
        difficulty: "intermediate",
        explanation_tag: "Fuerza vertical y estabilidad del core.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Overhead+Press+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=OHP"
    },
    {
        id: "sh_002",
        name: "Elevaciones Laterales",
        target: ["side_delt"],
        type: "isolation",
        equipment: ["gym", "dumbbells", "cables"],
        difficulty: "beginner",
        explanation_tag: "La clave para unos hombros anchos y redondos.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Lateral+Raise+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Lateral+Raise"
    },
    {
        id: "sh_003",
        name: "Press Arnold",
        target: ["front_delt", "side_delt", "triceps"],
        type: "compound",
        equipment: ["gym", "dumbbells"],
        difficulty: "intermediate",
        explanation_tag: "Rango de movimiento extendido para deltoides completo.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Arnold+Press+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Arnold+Press"
    },
    {
        id: "sh_004",
        name: "Pájaros (Rear Delt Fly)",
        target: ["rear_delt"],
        type: "isolation",
        equipment: ["gym", "dumbbells", "machine"],
        difficulty: "beginner",
        explanation_tag: "Desarrolla la parte posterior del hombro para un look 3D.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Rear+Delt+Fly+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Rear+Delt"
    },

    // --- ARMS (BICEPS/TRICEPS) ---
    {
        id: "ar_001",
        name: "Curl con Barra (Barbell Curl)",
        target: ["biceps"],
        type: "isolation",
        equipment: ["gym", "barbell"],
        difficulty: "beginner",
        explanation_tag: "El constructor básico de masa para bíceps.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Barbell+Curl+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Barbell+Curl"
    },
    {
        id: "ar_002",
        name: "Curl Martillo (Hammer Curl)",
        target: ["biceps", "brachialis", "forearms"],
        type: "isolation",
        equipment: ["gym", "dumbbells"],
        difficulty: "beginner",
        explanation_tag: "Añade anchura al brazo trabajando el braquial.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Hammer+Curl+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Hammer+Curl"
    },
    {
        id: "ar_003",
        name: "Extensión de Tríceps en Polea",
        target: ["triceps"],
        type: "isolation",
        equipment: ["gym", "cables"],
        difficulty: "beginner",
        explanation_tag: "Tensión constante para la cabeza lateral del tríceps.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Tricep+Pushdown+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Tricep+Pushdown"
    },
    {
        id: "ar_004",
        name: "Rompecráneos (Skullcrushers)",
        target: ["triceps"],
        type: "isolation",
        equipment: ["gym", "barbell", "bench"],
        difficulty: "intermediate",
        explanation_tag: "Enfocado en la cabeza larga del tríceps para volumen.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Skullcrushers+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Skullcrushers"
    },

    // --- CORE ---
    {
        id: "cr_001",
        name: "Plancha Abdominal (Plank)",
        target: ["core", "abs"],
        type: "isometric",
        equipment: ["bodyweight", "anywhere"],
        difficulty: "beginner",
        explanation_tag: "Estabilidad y resistencia del núcleo.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Plank+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Plank"
    },
    {
        id: "cr_002",
        name: "Elevación de Piernas Colgado",
        target: ["abs", "hip_flexors"],
        type: "isolation",
        equipment: ["gym", "bar"],
        difficulty: "advanced",
        explanation_tag: "Uno de los mejores ejercicios para el abdomen inferior.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Hanging+Leg+Raise+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Leg+Raise"
    },
    {
        id: "cr_003",
        name: "Russian Twists",
        target: ["obliques", "core"],
        type: "isolation",
        equipment: ["bodyweight", "dumbbells"],
        difficulty: "intermediate",
        explanation_tag: "Fortalece los oblicuos y la rotación del tronco.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Russian+Twist+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Russian+Twist"
    },
    {
        id: "cr_004",
        name: "Rueda Abdominal (Ab Wheel)",
        target: ["core", "abs", "lats"],
        type: "compound",
        equipment: ["gym", "ab_wheel"],
        difficulty: "advanced",
        explanation_tag: "Desafiante ejercicio anti-extensión para un core de acero.",
        gifUrl: "https://via.placeholder.com/400x300/1e1e1e/00e676?text=Ab+Wheel+GIF",
        thumbnailUrl: "https://via.placeholder.com/150/1e1e1e/00e676?text=Ab+Wheel"
    }
];
