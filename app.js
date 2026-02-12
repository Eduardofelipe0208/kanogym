
import { initDB, DB, saveData, updateData } from './db.js';
import { calculateXP, calculateLevel, updateStreak, getInitialGamificationState } from './gamification.js';
import { createPersonalizedRoutine } from './logic.js';

class App {
    constructor() {
        this.currentView = 'view-dashboard';
        this.builderState = { exercises: [] };
        this.activeWorkout = null;
        this.timerInterval = null;
        this.charts = {};

        this.init();
    }

    async init() {
        console.log("App Initializing...");
        initDB();

        const user = DB.getUserProfile();
        // Fallback if migration missed or reset
        if (!user.gamification) {
            user.gamification = getInitialGamificationState();
            DB.updateUserProfile(user);
        }

        if (user.name === "New Athlete") {
            this.showOnboarding();
        } else {
            this.loadProfileData(); // Load first to update header stats if needed
            this.loadDashboard();
        }

        this.setupNavigation();
        this.setupForms();
        this.setupHandlers();

        // Setup Modal Close (Background Click)
        window.onclick = (event) => {
            const modal = document.getElementById('overlay-detail');
            if (event.target == modal) {
                this.closeDetail();
            }
        }

        window.app = this;
    }

    // --- Navigation ---

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (this.activeWorkout && !confirm("¿Salir del entrenamiento? Se perderá el progreso.")) {
                    return;
                }
                const targetId = item.getAttribute('data-target');
                this.navigateTo(targetId);
            });
        });
    }

    navigateTo(viewId) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');

        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-target="${viewId}"]`);
        if (activeNav) activeNav.classList.add('active');

        this.currentView = viewId;

        if (viewId === 'view-profile') this.loadProfileData();
        if (viewId === 'view-dashboard') this.loadDashboard();
        if (viewId === 'view-routines') this.renderRoutinesList();
        if (viewId === 'view-workout') this.renderWorkoutSelection();
    }

    // --- Dashboard ---
    loadDashboard() {
        const user = DB.getUserProfile();
        const workouts = DB.getWorkouts();
        if (user) document.getElementById('dash-username').textContent = user.name;
        document.getElementById('stat-total-workouts').textContent = workouts.length;

        // Streak Logic handled by Gamification State
        const currentStreak = user.gamification?.currentStreak || 0;
        document.getElementById('stat-streak').textContent = currentStreak;

        // Header Badge
        const headerBadge = document.getElementById('header-streak');
        if (currentStreak > 0) {
            headerBadge.classList.remove('hidden');
            document.getElementById('header-streak-val').textContent = currentStreak;
        } else {
            headerBadge.classList.add('hidden');
        }

        this.renderCharts(user, workouts);
    }

    // calculateStreak removed, using persisted state now

    renderCharts(user, workouts) {
        if (this.charts.weight) this.charts.weight.destroy();
        if (this.charts.frequency) this.charts.frequency.destroy();

        const weightCtx = document.getElementById('weightChart').getContext('2d');
        this.charts.weight = new Chart(weightCtx, {
            type: 'line',
            data: { labels: ['Inicio', 'Actual'], datasets: [{ label: 'Peso', data: [user.weight + 2, user.weight], borderColor: '#00E676', tension: 0.4 }] },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });

        const workoutCtx = document.getElementById('workoutChart').getContext('2d');
        this.charts.frequency = new Chart(workoutCtx, {
            type: 'bar',
            data: { labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'], datasets: [{ label: 'Sesiones', data: [1, 2, 0, 1, 0, 1, 0], backgroundColor: '#BB86FC' }] }, // Mock
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    // --- Routines ---
    renderRoutinesList() {
        const list = document.getElementById('routines-list');
        const routines = DB.getRoutines();
        if (routines.length === 0) { list.innerHTML = '<p class="empty-state">No hay rutinas.</p>'; return; }
        list.innerHTML = routines.map(r => `
            <div class="routine-item" onclick="app.startWorkoutSetup('${r.id}')">
                <div><h4>${r.name}</h4><p>${r.exercises.length} Ejercicios</p></div><span>▶</span>
            </div>
        `).join('');
    }
    openRoutineBuilder() {
        this.builderState = { exercises: [] };
        document.getElementById('builder-name').value = "";
        document.getElementById('builder-desc').value = "";
        this.renderBuilderExercises();
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.getElementById('view-routine-builder').classList.add('active');
    }
    openCatalog() {
        const overlay = document.getElementById('overlay-catalog');
        overlay.classList.remove('hidden');
        this.renderCatalog('All');
        document.querySelectorAll('.filter-chips .chip').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-chips .chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderCatalog(btn.dataset.filter);
            };
        });
    }

    // UPDATED: Render Catalog with Thumbnails
    renderCatalog(filter) {
        const list = document.getElementById('catalog-list');
        let exercises = DB.getExercises();
        if (filter !== 'All') exercises = exercises.filter(e => e.muscleGroup.includes(filter) || e.muscleGroup === filter);

        list.innerHTML = exercises.map(ex => `
            <div class="exercise-item" onclick="app.openExerciseDetail('${ex.id}')">
                <img src="${ex.thumbnailUrl}" alt="${ex.name}" class="ex-thumb" loading="lazy" onerror="this.src='https://via.placeholder.com/60?text=Icon'">
                <div>
                    <h4>${ex.name}</h4>
                    <p>${this.formatTags(ex.target)}</p>
                </div>
                <button class="btn-secondary" onclick="event.stopPropagation(); app.addExerciseToBuilder('${ex.id}')">Añadir</button>
            </div>
        `).join('');
    }

    addExerciseToBuilder(exId) {
        const ex = DB.getExercises().find(e => e.id === exId);
        this.builderState.exercises.push({ ...ex, sets: 3, reps: 10 });
        this.renderBuilderExercises();
        // Don't close catalog automatically to allow multi-select
        alert(`${ex.name} añadido`);
    }

    renderBuilderExercises() {
        const list = document.getElementById('builder-exercises-list');
        list.innerHTML = this.builderState.exercises.map((ex, idx) => `
            <div class="builder-exercise">
                <h4>${ex.name}</h4>
                <div class="set-inputs">
                    <input type="number" value="${ex.sets}" onchange="app.updateBuilderEx(${idx}, 'sets', this.value)">
                    <input type="text" value="${ex.reps}" onchange="app.updateBuilderEx(${idx}, 'reps', this.value)">
                </div>
            </div>
        `).join('');
    }
    updateBuilderEx(idx, field, val) { this.builderState.exercises[idx][field] = val; }
    saveRoutine() {
        const name = document.getElementById('builder-name').value;
        if (!name) return alert("Ponle nombre");
        const newRoutine = { id: 'rt_' + Date.now(), name, description: document.getElementById('builder-desc').value, exercises: this.builderState.exercises.map(e => ({ exerciseId: e.id, sets: e.sets, reps: e.reps })) };
        DB.createRoutine(newRoutine);
        this.navigateTo('view-routines');
    }

    // --- Training ---
    renderWorkoutSelection() {
        const list = document.getElementById('workout-routines-list');
        const routines = DB.getRoutines();
        list.innerHTML = routines.map(r => `<div class="routine-item" onclick="app.startWorkout('${r.id}')"><div><h4>${r.name}</h4><p>${r.exercises.length} Ejercicios</p></div><button class="btn-primary">Empezar</button></div>`).join('');
    }
    startWorkout(routineId) {
        const routine = DB.getRoutines().find(r => r.id === routineId);
        this.activeWorkout = {
            id: 'wk_' + Date.now(), routineId: routine.id, routineName: routine.name, startTime: Date.now(),
            exercises: routine.exercises.map(exRef => {
                const exDef = DB.getExercises().find(e => e.id === exRef.exerciseId) || { name: 'Unknown', thumbnailUrl: '' };
                return { ...exDef, targetSets: exRef.sets, targetReps: exRef.reps, setsCompleted: [] };
            })
        };
        document.getElementById('active-routine-name').textContent = routine.name;
        this.renderActiveExercises();
        this.startSessionTimer();
        this.navigateTo('view-active-workout');
    }

    // UPDATED: Active Exercises with Thumbnails
    renderActiveExercises() {
        const container = document.getElementById('active-exercises-container');
        container.innerHTML = this.activeWorkout.exercises.map((ex, exIdx) => {
            const numSets = parseInt(ex.targetSets) || 3;
            let setsHtml = '';
            for (let i = 0; i < numSets; i++) setsHtml += `
                <div class="set-row">
                    <span class="set-num">${i + 1}</span>
                    <input type="number" placeholder="kg" class="inp-w-${exIdx}-${i}">
                    <input type="number" placeholder="${ex.targetReps}" class="inp-r-${exIdx}-${i}">
                    <div class="check-box-container" onclick="app.completeSet(this)">✓</div>
                </div>`;

            return `
                <div class="active-exercise-card">
                    <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;" onclick="app.openExerciseDetail('${ex.id}')">
                        <img src="${ex.thumbnailUrl}" class="ex-thumb" onerror="this.style.display='none'">
                        <h4>${ex.name}</h4>
                    </div>
                    ${setsHtml}
                </div>
            `;
        }).join('');
    }
    completeSet(el) {
        if (el.classList.contains('checked')) return;
        el.classList.add('checked');

        // Track completion in activeWorkout (simplified: just count checks)
        // Ideally we would map this back to specific index, but for XP calc we iterate DOM or rely on assumption
        // For robustness, let's update data model if possible, but for MVP UI driven is fine.
        // Actually, let's look at `startRestTimer` call.

        this.startRestTimer(60);
    }
    startSessionTimer() {
        const timerEl = document.getElementById('active-timer');
        if (this.sessionInterval) clearInterval(this.sessionInterval);
        this.sessionInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.activeWorkout.startTime) / 1000);
            timerEl.textContent = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;
        }, 1000);
    }

    // --- FINISH WORKOUT & GAMIFICATION ---
    finishWorkout() {
        if (!confirm("¿Terminar?")) return;
        clearInterval(this.sessionInterval);
        this.activeWorkout.endTime = Date.now();

        // 1. Capture completed sets for XP
        // Iterate UI to update activeWorkout.exercises.setsCompleted
        const container = document.getElementById('active-exercises-container');
        const cards = container.querySelectorAll('.active-exercise-card');

        cards.forEach((card, exIdx) => {
            const checks = card.querySelectorAll('.check-box-container.checked');
            // Just store indices [0, 1, 2] etc
            const completedIndices = Array.from(checks).map((_, i) => i);
            this.activeWorkout.exercises[exIdx].setsCompleted = completedIndices;
        });

        DB.saveWorkout(this.activeWorkout);

        // 2. GAMIFICATION LOGIC
        const user = DB.getUserProfile();
        const gainedXP = calculateXP(this.activeWorkout);

        // Update Streak
        const streakStats = updateStreak(
            user.gamification,
            user.gamification.lastWorkoutTimestamp,
            this.activeWorkout.endTime
        );

        // Save New State
        user.gamification.currentStreak = streakStats.currentStreak;
        user.gamification.maxStreak = streakStats.maxStreak;
        user.gamification.lastWorkoutTimestamp = this.activeWorkout.endTime;
        user.gamification.totalXP += gainedXP;
        user.gamification.level = calculateLevel(user.gamification.totalXP);

        DB.updateUserProfile(user);

        this.activeWorkout = null;

        // 3. Show Reward
        this.showReward(gainedXP, streakStats.currentStreak);
    }

    showReward(xp, streak) {
        const modal = document.getElementById('overlay-reward');
        document.getElementById('reward-xp').textContent = xp;

        const streakEl = document.getElementById('reward-streak-bonus');
        if (streak > 1) {
            streakEl.classList.remove('hidden');
            document.getElementById('reward-streak-val').textContent = streak;
        } else {
            streakEl.classList.add('hidden');
        }

        modal.classList.remove('hidden');

        // Confetti!
        if (window.confetti) {
            window.confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    closeReward() {
        document.getElementById('overlay-reward').classList.add('hidden');
        this.navigateTo('view-dashboard');
    }


    // --- Detail Modal ---
    openExerciseDetail(exId) {
        const ex = DB.getExercises().find(e => e.id === exId);
        if (!ex) return;

        document.getElementById('detail-title').textContent = ex.name;
        document.getElementById('detail-tags').innerHTML = this.formatTags(ex.target) + ` <span class="chip active">${ex.type}</span>`;
        document.getElementById('detail-explanation').textContent = ex.explanation_tag;
        document.getElementById('detail-equipment').textContent = ex.equipment.join(', ');

        // Media Handling
        const mediaContainer = document.getElementById('detail-media');
        mediaContainer.innerHTML = `<img src="${ex.gifUrl}" alt="${ex.name}" loop autoplay>`;

        document.getElementById('overlay-detail').classList.remove('hidden');
    }
    closeDetail() { document.getElementById('overlay-detail').classList.add('hidden'); }

    // --- Helpers ---
    formatTags(tags) {
        if (Array.isArray(tags)) return tags.map(t => `<span class="chip">${t}</span>`).join(' ');
        return '';
    }

    // --- Rest Timer & Forms ---
    startRestTimer(sec) {
        const overlay = document.getElementById('overlay-timer');
        overlay.classList.remove('hidden');
        let rem = sec;
        document.getElementById('timer-display').textContent = `00:${rem}`;
        if (this.restInterval) clearInterval(this.restInterval);
        this.restInterval = setInterval(() => { rem--; if (rem < 0) { this.stopRestTimer(); return; } document.getElementById('timer-display').textContent = `00:${rem < 10 ? '0' + rem : rem}`; }, 1000);
    }
    stopRestTimer() { document.getElementById('overlay-timer').classList.add('hidden'); clearInterval(this.restInterval); }
    adjustTimer(s) { this.stopRestTimer(); this.startRestTimer(30); } // Reset to 30s
    showOnboarding() { document.getElementById('view-onboarding').classList.remove('hidden'); }
    setupForms() {
        document.getElementById('onboarding-form').addEventListener('submit', (e) => { e.preventDefault(); this.handleOnboarding(); });
        document.getElementById('profile-form').addEventListener('submit', (e) => { e.preventDefault(); this.handleProfileUpdate(); });
    }
    handleOnboarding() {
        const name = document.getElementById('ob-name').value;
        const weight = parseFloat(document.getElementById('ob-weight').value);
        const height = parseFloat(document.getElementById('ob-height').value);
        DB.updateUserProfile({
            name, weight, height,
            goals: [document.getElementById('ob-goal').value],
            gamification: getInitialGamificationState()
        });
        document.getElementById('view-onboarding').classList.add('hidden');
        this.loadProfileData();
        this.navigateTo('view-dashboard');
    }
    handleProfileUpdate() {
        const w = parseFloat(document.getElementById('p-weight').value);
        const h = parseFloat(document.getElementById('p-height').value);
        updateData(DB.KEYS.USER_PROFILE, u => { u.weight = w; u.height = h; return u; });
        alert("Actualizado"); this.loadProfileData();
    }

    // --- Data Management Handlers ---
    setupHandlers() {
        this.handlers = {
            exportData: () => {
                const json = DB.exportData();
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `kano_backup_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
            },
            triggerImport: () => document.getElementById('import-file').click(),
            importData: (input) => {
                const file = input.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const success = DB.importData(e.target.result);
                    if (success) { alert("¡Datos restaurados!"); window.location.reload(); }
                    else alert("Error: Archivo inválido");
                };
                reader.readAsText(file);
            },
            hardReset: () => {
                if (confirm("¿Estás seguro? Se borrarán TODOS los datos de rutinas y progreso.")) {
                    if (confirm("ACCIÓN IRREVERSIBLE. ¿Confirmar borrado de fábrica?")) {
                        DB.hardReset();
                    }
                }
            },

            // AI HANDLERS
            startAIGeneration: () => {
                const loadingOverlay = document.getElementById('overlay-loading');
                const loadingText = document.getElementById('loading-text');
                const messages = [
                    "Analizando fatiga neuromuscular...",
                    "Calculando volumen óptimo para hipertrofia...",
                    "Ajustando curvas de fuerza...",
                    "Optimizando selección de ejercicios...",
                    "Sincronizando con tu perfil biológico..."
                ];

                loadingOverlay.classList.remove('hidden');

                let step = 0;
                const interval = setInterval(() => {
                    loadingText.textContent = messages[step % messages.length];
                    step++;
                }, 800);

                setTimeout(() => {
                    clearInterval(interval);
                    loadingOverlay.classList.add('hidden');
                    this.handlers.showAIResult();
                }, 4000); // 4 seconds total drama
            },

            showAIResult: () => {
                const user = DB.getUserProfile();
                // Mock equipment/days if not set in profile (Profile doesn't have these fields in UI yet, assume defaults)
                const profileForAI = {
                    goal: user.goals[0]?.toLowerCase() || 'hypertrophy',
                    daysAvailable: 4, // Default
                    experience: 'intermediate',
                    equipment: ['gym']
                };

                const routines = createPersonalizedRoutine(profileForAI);
                this.aiResultState = routines;

                // Show in Overlay
                const overlay = document.getElementById('overlay-ai-result');
                const rationalText = routines[0].rationale; // Use first day's rationale as summary
                const list = document.getElementById('ai-routines-preview');

                document.getElementById('ai-rationale-text').textContent = rationalText;

                list.innerHTML = routines.map(r => `
                    <div class="card" style="border-left: 3px solid var(--primary);">
                        <h4>${r.name}</h4>
                        <p class="text-muted text-small">${r.description}</p>
                        <p class="text-small mt-2">${r.exercises.length} Ejercicios: ${r.exercises.map(e => e.name).slice(0, 3).join(', ')}...</p>
                    </div>
                `).join('');

                overlay.classList.remove('hidden');
            },

            closeAIResult: () => {
                document.getElementById('overlay-ai-result').classList.add('hidden');
                this.aiResultState = null;
            },

            saveAIResult: () => {
                if (!this.aiResultState) return;
                this.aiResultState.forEach(r => DB.createRoutine(r));
                alert("¡Plan Guardado! Tus nuevas rutinas están listas.");
                this.handlers.closeAIResult();
                this.navigateTo('view-routines');
            }
        };
    }

    loadProfileData() {
        const u = DB.getUserProfile();
        if (!u) return;
        document.getElementById('profile-name').textContent = u.name;
        document.getElementById('p-weight').value = u.weight;
        document.getElementById('p-height').value = u.height;
        document.getElementById('profile-goal').textContent = u.goals[0];

        // Gamification Stats
        if (u.gamification) {
            document.getElementById('profile-level').textContent = `Nivel ${u.gamification.level}`;
            document.getElementById('profile-xp-val').textContent = u.gamification.totalXP;

            // Calc Progress to Top of Level??
            // Level = sqrt(XP/50) + 1  => XP = 50 * (Level-1)^2
            const currentLevelXP = 50 * Math.pow(u.gamification.level - 1, 2);
            const nextLevelXP = 50 * Math.pow(u.gamification.level, 2);
            const levelRange = nextLevelXP - currentLevelXP;
            const progress = u.gamification.totalXP - currentLevelXP;
            const pct = Math.min(100, (progress / levelRange) * 100);

            document.getElementById('profile-xp-fill').style.width = `${pct}%`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => { new App(); });
