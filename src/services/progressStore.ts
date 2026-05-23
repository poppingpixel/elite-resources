// Progress Store - LocalStorage Persistence for Roadmap 2026
// Tracks progress for AI Topics, CEO Skills, Books, and Polymath Methods

const STORAGE_KEYS = {
    TOPICS: 'elite_roadmap_topics_progress',
    SKILLS: 'elite_roadmap_skills_progress',
    BOOKS: 'elite_roadmap_books_progress',
    METHODS: 'elite_roadmap_methods_progress',
    RESILIENCE: 'elite_roadmap_resilience_progress',
    LAST_UPDATED: 'elite_roadmap_last_updated',
};

// Type definitions matching the data files
export type TopicStatus = 'not_started' | 'in_progress' | 'completed';
export type BookStatus = 'not_started' | 'in_progress' | 'completed';

export interface TopicProgress {
    id: number;
    status: TopicStatus;
    hasImplementation: boolean;
    hasBlogPost: boolean;
    completedDate?: string;
    notes?: string;
}

export interface SkillProgress {
    id: number;
    currentLevel: number;
    lastPracticed?: string;
    notes?: string;
}

export interface BookProgress {
    id: number;
    status: BookStatus;
    currentPage?: number;
    completedDate?: string;
    notes?: string;
    rating?: number; // 1-5
}

export interface MethodProgress {
    id: number;
    practiceCount: number;
    lastPracticed?: string;
    mastered: boolean;
    notes?: string;
}

export interface ResilienceProgress {
    id: number;
    completedToday: boolean;
    streak: number;
    lastCompleted?: string;
    totalCompletions: number;
}

// Load from localStorage
function loadProgress<T>(key: string): Record<number, T> {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : {};
    } catch (err) {
        console.error(`Failed to load progress from ${key}:`, err);
        return {};
    }
}

// Save to localStorage
function saveProgress<T>(key: string, progress: Record<number, T>): void {
    try {
        localStorage.setItem(key, JSON.stringify(progress));
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
    } catch (err) {
        console.error(`Failed to save progress to ${key}:`, err);
    }
}

// ============= TOPICS PROGRESS =============
export function getTopicProgress(id: number): TopicProgress | undefined {
    const progress = loadProgress<TopicProgress>(STORAGE_KEYS.TOPICS);
    return progress[id];
}

export function getAllTopicsProgress(): Record<number, TopicProgress> {
    return loadProgress<TopicProgress>(STORAGE_KEYS.TOPICS);
}

export function updateTopicProgress(id: number, updates: Partial<TopicProgress>): void {
    const progress = loadProgress<TopicProgress>(STORAGE_KEYS.TOPICS);
    const current = progress[id] || { id, status: 'not_started', hasImplementation: false, hasBlogPost: false };
    progress[id] = { ...current, ...updates, id };

    // Auto-set completed date
    if (updates.status === 'completed' && !progress[id].completedDate) {
        progress[id].completedDate = new Date().toISOString();
    }

    saveProgress(STORAGE_KEYS.TOPICS, progress);
}

export function setTopicStatus(id: number, status: TopicStatus): void {
    updateTopicProgress(id, { status });
}

export function toggleTopicImplementation(id: number): void {
    const current = getTopicProgress(id);
    updateTopicProgress(id, { hasImplementation: !current?.hasImplementation });
}

export function toggleTopicBlogPost(id: number): void {
    const current = getTopicProgress(id);
    updateTopicProgress(id, { hasBlogPost: !current?.hasBlogPost });
}

// ============= SKILLS PROGRESS =============
export function getSkillProgress(id: number): SkillProgress | undefined {
    const progress = loadProgress<SkillProgress>(STORAGE_KEYS.SKILLS);
    return progress[id];
}

export function getAllSkillsProgress(): Record<number, SkillProgress> {
    return loadProgress<SkillProgress>(STORAGE_KEYS.SKILLS);
}

export function updateSkillProgress(id: number, updates: Partial<SkillProgress>): void {
    const progress = loadProgress<SkillProgress>(STORAGE_KEYS.SKILLS);
    const current = progress[id] || { id, currentLevel: 0 };
    progress[id] = { ...current, ...updates, id };

    // Set last practiced date when updating level
    if (updates.currentLevel !== undefined) {
        progress[id].lastPracticed = new Date().toISOString();
    }

    saveProgress(STORAGE_KEYS.SKILLS, progress);
}

export function setSkillLevel(id: number, level: number): void {
    const clampedLevel = Math.max(1, Math.min(10, level));
    updateSkillProgress(id, { currentLevel: clampedLevel });
}

export function incrementSkillLevel(id: number, defaultStart: number = 1): void {
    const current = getSkillProgress(id);
    const currentLevel = current?.currentLevel ?? defaultStart;
    if (currentLevel < 10) {
        setSkillLevel(id, currentLevel + 1);
    }
}

// ============= BOOKS PROGRESS =============
export function getBookProgress(id: number): BookProgress | undefined {
    const progress = loadProgress<BookProgress>(STORAGE_KEYS.BOOKS);
    return progress[id];
}

export function getAllBooksProgress(): Record<number, BookProgress> {
    return loadProgress<BookProgress>(STORAGE_KEYS.BOOKS);
}

export function updateBookProgress(id: number, updates: Partial<BookProgress>): void {
    const progress = loadProgress<BookProgress>(STORAGE_KEYS.BOOKS);
    const current = progress[id] || { id, status: 'not_started' };
    progress[id] = { ...current, ...updates, id };

    // Auto-set completed date
    if (updates.status === 'completed' && !progress[id].completedDate) {
        progress[id].completedDate = new Date().toISOString();
    }

    saveProgress(STORAGE_KEYS.BOOKS, progress);
}

export function setBookStatus(id: number, status: BookStatus): void {
    updateBookProgress(id, { status });
}

export function updateBookPage(id: number, page: number): void {
    const current = getBookProgress(id);
    updateBookProgress(id, {
        currentPage: page,
        status: current?.status === 'not_started' ? 'in_progress' : current?.status
    });
}

export function rateBook(id: number, rating: number): void {
    const clampedRating = Math.max(1, Math.min(5, rating));
    updateBookProgress(id, { rating: clampedRating });
}

// ============= STATS & ANALYTICS =============
export interface OverallProgress {
    topics: { completed: number; inProgress: number; total: number; percentage: number };
    skills: { totalProgress: number; maxProgress: number; percentage: number };
    books: { completed: number; inProgress: number; total: number; percentage: number };
    lastUpdated: string | null;
}

export function getOverallProgress(
    totalTopics: number,
    totalBooks: number,
    skillsData: Array<{ id: number; targetLevel: number }>
): OverallProgress {
    const topicsProgress = getAllTopicsProgress();
    const skillsProgress = getAllSkillsProgress();
    const booksProgress = getAllBooksProgress();

    // Topics stats
    const completedTopics = Object.values(topicsProgress).filter(t => t.status === 'completed').length;
    const inProgressTopics = Object.values(topicsProgress).filter(t => t.status === 'in_progress').length;

    // Skills stats
    let totalSkillProgress = 0;
    let maxSkillProgress = 0;
    skillsData.forEach(skill => {
        const progress = skillsProgress[skill.id];
        totalSkillProgress += progress?.currentLevel ?? 0;
        maxSkillProgress += skill.targetLevel;
    });

    // Books stats
    const completedBooks = Object.values(booksProgress).filter(b => b.status === 'completed').length;
    const inProgressBooks = Object.values(booksProgress).filter(b => b.status === 'in_progress').length;

    return {
        topics: {
            completed: completedTopics,
            inProgress: inProgressTopics,
            total: totalTopics,
            percentage: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
        },
        skills: {
            totalProgress: totalSkillProgress,
            maxProgress: maxSkillProgress,
            percentage: maxSkillProgress > 0 ? Math.round((totalSkillProgress / maxSkillProgress) * 100) : 0,
        },
        books: {
            completed: completedBooks,
            inProgress: inProgressBooks,
            total: totalBooks,
            percentage: totalBooks > 0 ? Math.round((completedBooks / totalBooks) * 100) : 0,
        },
        lastUpdated: localStorage.getItem(STORAGE_KEYS.LAST_UPDATED),
    };
}

// ============= DATA EXPORT/IMPORT =============
export interface ExportData {
    topics: Record<number, TopicProgress>;
    skills: Record<number, SkillProgress>;
    books: Record<number, BookProgress>;
    exportedAt: string;
    version: string;
}

export function exportAllProgress(): ExportData {
    return {
        topics: getAllTopicsProgress(),
        skills: getAllSkillsProgress(),
        books: getAllBooksProgress(),
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
    };
}

export function importProgress(data: ExportData): boolean {
    try {
        if (!data.topics || !data.skills || !data.books) {
            throw new Error('Invalid import data structure');
        }

        saveProgress(STORAGE_KEYS.TOPICS, data.topics);
        saveProgress(STORAGE_KEYS.SKILLS, data.skills);
        saveProgress(STORAGE_KEYS.BOOKS, data.books);

        return true;
    } catch (err) {
        console.error('Failed to import progress:', err);
        return false;
    }
}

export function downloadProgressAsJSON(): void {
    const data = exportAllProgress();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elite_roadmap_progress_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============= RESET =============
export function resetAllProgress(): void {
    localStorage.removeItem(STORAGE_KEYS.TOPICS);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.BOOKS);
    localStorage.removeItem(STORAGE_KEYS.METHODS);
    localStorage.removeItem(STORAGE_KEYS.RESILIENCE);
    localStorage.removeItem(STORAGE_KEYS.LAST_UPDATED);
}

export function resetTopicsProgress(): void {
    localStorage.removeItem(STORAGE_KEYS.TOPICS);
}

export function resetSkillsProgress(): void {
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
}

export function resetBooksProgress(): void {
    localStorage.removeItem(STORAGE_KEYS.BOOKS);
}

// ============= METHODS PROGRESS =============
export function getAllMethodsProgress(): Record<number, MethodProgress> {
    return loadProgress<MethodProgress>(STORAGE_KEYS.METHODS);
}

export function getMethodProgress(id: number): MethodProgress | undefined {
    const progress = loadProgress<MethodProgress>(STORAGE_KEYS.METHODS);
    return progress[id];
}

export function updateMethodProgress(id: number, updates: Partial<MethodProgress>): void {
    const progress = loadProgress<MethodProgress>(STORAGE_KEYS.METHODS);
    const current = progress[id] || { id, practiceCount: 0, mastered: false };
    progress[id] = { ...current, ...updates, id };

    // Set last practiced date when updating practice count
    if (updates.practiceCount !== undefined) {
        progress[id].lastPracticed = new Date().toISOString();
    }

    saveProgress(STORAGE_KEYS.METHODS, progress);
}

export function incrementMethodPractice(id: number): void {
    const current = getMethodProgress(id);
    const practiceCount = (current?.practiceCount ?? 0) + 1;
    updateMethodProgress(id, { practiceCount });
}

export function setMethodMastered(id: number, mastered: boolean): void {
    updateMethodProgress(id, { mastered });
}

// ============= RESILIENCE PROGRESS =============
export function getAllResilienceProgress(): Record<number, ResilienceProgress> {
    return loadProgress<ResilienceProgress>(STORAGE_KEYS.RESILIENCE);
}

export function getResilienceProgress(id: number): ResilienceProgress | undefined {
    const progress = loadProgress<ResilienceProgress>(STORAGE_KEYS.RESILIENCE);
    return progress[id];
}

export function completeResilienceActivity(id: number): void {
    const progress = loadProgress<ResilienceProgress>(STORAGE_KEYS.RESILIENCE);
    const current = progress[id] || { id, completedToday: false, streak: 0, totalCompletions: 0 };
    const today = new Date().toDateString();
    const lastCompleted = current.lastCompleted ? new Date(current.lastCompleted).toDateString() : null;

    // Check if completed today already
    if (lastCompleted === today) {
        return; // Already completed today
    }

    // Check if streak continues (completed yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = lastCompleted === yesterday.toDateString();

    progress[id] = {
        ...current,
        id,
        completedToday: true,
        streak: isConsecutive ? current.streak + 1 : 1,
        totalCompletions: current.totalCompletions + 1,
        lastCompleted: new Date().toISOString(),
    };

    saveProgress(STORAGE_KEYS.RESILIENCE, progress);
}

export function resetDailyResilienceProgress(): void {
    const progress = loadProgress<ResilienceProgress>(STORAGE_KEYS.RESILIENCE);
    const today = new Date().toDateString();

    Object.keys(progress).forEach(key => {
        const id = parseInt(key);
        const lastCompleted = progress[id].lastCompleted ? new Date(progress[id].lastCompleted).toDateString() : null;
        if (lastCompleted !== today) {
            progress[id].completedToday = false;
        }
    });

    saveProgress(STORAGE_KEYS.RESILIENCE, progress);
}

// Updated: iteration 17

// ============= AIFS PROGRESS =============
const AIFS_STORAGE_KEY = 'aifs:progress:v1';

export interface AIFSLessonProgress {
    completedAt: number | null;
    visitedAt?: number;
    answers?: Record<string, any>;
}

export interface AIFSProgressState {
    lessons: Record<string, AIFSLessonProgress>;
    updatedAt: number;
}

export function getAIFSProgress(): AIFSProgressState {
    try {
        const stored = localStorage.getItem(AIFS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { lessons: {}, updatedAt: 0 };
    } catch (err) {
        console.error('Failed to load AIFS progress:', err);
        return { lessons: {}, updatedAt: 0 };
    }
}

export function saveAIFSProgress(state: AIFSProgressState): void {
    try {
        state.updatedAt = Date.now();
        localStorage.setItem(AIFS_STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('elite_roadmap_last_updated', new Date().toISOString());
    } catch (err) {
        console.error('Failed to save AIFS progress:', err);
    }
}

export function setAIFSLessonStatus(lessonPath: string, completed: boolean): void {
    const state = getAIFSProgress();
    if (!state.lessons[lessonPath]) {
        state.lessons[lessonPath] = { completedAt: null };
    }
    state.lessons[lessonPath].completedAt = completed ? Date.now() : null;
    saveAIFSProgress(state);
}

export function isAIFSLessonComplete(lessonPath: string): boolean {
    const state = getAIFSProgress();
    return !!state.lessons[lessonPath]?.completedAt;
}

export function extractAIFSPath(url: string): string {
    if (!url) return '';
    const m = String(url).match(/(phases\/[^/]+\/[^/]+)\/?/);
    return m ? m[1] : '';
}

// ============= DEV ROADMAPS PROGRESS =============
const DEV_ROADMAPS_STORAGE_KEY = 'dev_roadmaps:progress:v1';

export interface DevRoadmapProgressState {
    completedNodes: Record<string, Record<string, number | null>>;
    updatedAt: number;
}

export function getDevRoadmapProgress(): DevRoadmapProgressState {
    try {
        const stored = localStorage.getItem(DEV_ROADMAPS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { completedNodes: {}, updatedAt: 0 };
    } catch (err) {
        console.error('Failed to load dev roadmap progress:', err);
        return { completedNodes: {}, updatedAt: 0 };
    }
}

export function saveDevRoadmapProgress(state: DevRoadmapProgressState): void {
    try {
        state.updatedAt = Date.now();
        localStorage.setItem(DEV_ROADMAPS_STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('elite_roadmap_last_updated', new Date().toISOString());
    } catch (err) {
        console.error('Failed to save dev roadmap progress:', err);
    }
}

export function setDevRoadmapNodeStatus(roadmapId: string, nodeId: string, completed: boolean): void {
    const state = getDevRoadmapProgress();
    if (!state.completedNodes[roadmapId]) {
        state.completedNodes[roadmapId] = {};
    }
    state.completedNodes[roadmapId][nodeId] = completed ? Date.now() : null;
    saveDevRoadmapProgress(state);
}

export function isDevRoadmapNodeComplete(roadmapId: string, nodeId: string): boolean {
    const state = getDevRoadmapProgress();
    return !!state.completedNodes[roadmapId]?.[nodeId];
}


// ============= AI BEGINNERS PROGRESS =============
const AI_BEGINNERS_STORAGE_KEY = 'ai_beginners:progress:v1';

export interface AIBeginnersProgressState {
    lessons: Record<string, AIFSLessonProgress>;
    updatedAt: number;
}

export function getAIBeginnersProgress(): AIBeginnersProgressState {
    try {
        const stored = localStorage.getItem(AI_BEGINNERS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { lessons: {}, updatedAt: 0 };
    } catch (err) {
        console.error('Failed to load AI Beginners progress:', err);
        return { lessons: {}, updatedAt: 0 };
    }
}

export function saveAIBeginnersProgress(state: AIBeginnersProgressState): void {
    try {
        state.updatedAt = Date.now();
        localStorage.setItem(AI_BEGINNERS_STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('elite_roadmap_last_updated', new Date().toISOString());
    } catch (err) {
        console.error('Failed to save AI Beginners progress:', err);
    }
}

export function setAIBeginnersLessonStatus(lessonPath: string, completed: boolean): void {
    const state = getAIBeginnersProgress();
    if (!state.lessons[lessonPath]) {
        state.lessons[lessonPath] = { completedAt: null };
    }
    state.lessons[lessonPath].completedAt = completed ? Date.now() : null;
    saveAIBeginnersProgress(state);
}

export function isAIBeginnersLessonComplete(lessonPath: string): boolean {
    const state = getAIBeginnersProgress();
    return !!state.lessons[lessonPath]?.completedAt;
}


// ============= MADE WITH ML PROGRESS =============
const MADE_WITH_ML_STORAGE_KEY = 'made_with_ml:progress:v1';

export interface MadeWithMlProgressState {
    lessons: Record<string, AIFSLessonProgress>;
    updatedAt: number;
}

export function getMadeWithMlProgress(): MadeWithMlProgressState {
    try {
        const stored = localStorage.getItem(MADE_WITH_ML_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { lessons: {}, updatedAt: 0 };
    } catch (err) {
        console.error('Failed to load Made With ML progress:', err);
        return { lessons: {}, updatedAt: 0 };
    }
}

export function saveMadeWithMlProgress(state: MadeWithMlProgressState): void {
    try {
        state.updatedAt = Date.now();
        localStorage.setItem(MADE_WITH_ML_STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('elite_roadmap_last_updated', new Date().toISOString());
    } catch (err) {
        console.error('Failed to save Made With ML progress:', err);
    }
}

export function setMadeWithMlLessonStatus(lessonPath: string, completed: boolean): void {
    const state = getMadeWithMlProgress();
    if (!state.lessons[lessonPath]) {
        state.lessons[lessonPath] = { completedAt: null };
    }
    state.lessons[lessonPath].completedAt = completed ? Date.now() : null;
    saveMadeWithMlProgress(state);
}

export function isMadeWithMlLessonComplete(lessonPath: string): boolean {
    const state = getMadeWithMlProgress();
    return !!state.lessons[lessonPath]?.completedAt;
}



