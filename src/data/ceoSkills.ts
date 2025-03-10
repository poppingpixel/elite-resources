// 30 CEO/Leadership Skills - Master Blueprint 2026
// Skills for world-class leadership and execution

export interface CEOSkill {
    id: number;
    name: string;
    category: string;
    description: string;
    currentLevel: number; // 1-10
    targetLevel: number; // 1-10
    practiceAreas: string[];
    resources: string[];
    dailyPractice?: string;
}

export const CEO_SKILLS: CEOSkill[] = [
    // Strategic Thinking (1-6)
    {
        id: 1,
        name: 'First Principles Thinking',
        category: 'Strategic Thinking',
        description: 'Break down complex problems to fundamental truths and build up from there',
        currentLevel: 3,
        targetLevel: 9,
        practiceAreas: ['Problem decomposition', 'Root cause analysis', 'Novel solution generation'],
        resources: ['Elon Musk talks', 'Aristotle philosophy', 'Feynman method'],
        dailyPractice: 'Apply first principles to one decision/problem daily'
    },
    {
        id: 2,
        name: 'Strategic Vision',
        category: 'Strategic Thinking',
        description: 'See 10+ years ahead and work backwards to today',
        currentLevel: 3,
        targetLevel: 9,
        practiceAreas: ['Long-term planning', 'Market prediction', 'Trend analysis'],
        resources: ['Good Strategy Bad Strategy', 'Playing to Win'],
        dailyPractice: 'Review 5-year vision weekly, adjust quarterly'
    },
    {
        id: 3,
        name: 'Systems Thinking',
        category: 'Strategic Thinking',
        description: 'Understand complex systems, feedback loops, emergence',
        currentLevel: 4,
        targetLevel: 9,
        practiceAreas: ['Cause-effect mapping', 'Feedback identification', 'Leverage points'],
        resources: ['Thinking in Systems - Meadows', 'The Fifth Discipline'],
        dailyPractice: 'Map one system weekly'
    },
    {
        id: 4,
        name: 'Mental Models',
        category: 'Strategic Thinking',
        description: 'Apply 80+ mental models fluently',
        currentLevel: 3,
        targetLevel: 8,
        practiceAreas: ['Model application', 'Cross-domain transfer', 'Inversion thinking'],
        resources: ['Poor Charlie\'s Almanack', 'The Great Mental Models'],
        dailyPractice: 'Apply 3 mental models to daily decisions'
    },
    {
        id: 5,
        name: 'Decision Making Under Uncertainty',
        category: 'Strategic Thinking',
        description: 'Make high-quality decisions with incomplete information',
        currentLevel: 4,
        targetLevel: 9,
        practiceAreas: ['Probabilistic thinking', 'Expected value', 'Risk assessment'],
        resources: ['Thinking in Bets', 'Superforecasting'],
        dailyPractice: 'Log decisions with confidence levels'
    },
    {
        id: 6,
        name: 'Competitive Analysis',
        category: 'Strategic Thinking',
        description: 'Understand market dynamics, competitors, moats',
        currentLevel: 3,
        targetLevel: 8,
        practiceAreas: ['Porter\'s 5 forces', 'Moat analysis', 'Competitive positioning'],
        resources: ['Competition Demystified', 'Zero to One'],
        dailyPractice: 'Analyze one company/industry weekly'
    },

    // Execution & Operations (7-12)
    {
        id: 7,
        name: 'Ruthless Prioritization',
        category: 'Execution',
        description: 'Focus on 1-3 things that matter most, eliminate distractions',
        currentLevel: 5,
        targetLevel: 10,
        practiceAreas: ['Task elimination', 'Impact vs effort', 'Opportunity cost'],
        resources: ['Essentialism', 'The One Thing'],
        dailyPractice: 'Identify MIT (Most Important Task) every morning'
    },
    {
        id: 8,
        name: 'Operational Excellence',
        category: 'Execution',
        description: 'Design and run systems that scale',
        currentLevel: 3,
        targetLevel: 8,
        practiceAreas: ['Process design', 'Automation', 'Quality control'],
        resources: ['High Output Management', 'The Goal'],
        dailyPractice: 'Improve one process weekly'
    },
    {
        id: 9,
        name: 'Metrics & KPIs',
        category: 'Execution',
        description: 'Define and track what matters',
        currentLevel: 4,
        targetLevel: 9,
        practiceAreas: ['Leading indicators', 'OKRs', 'Data-driven decisions'],
        resources: ['Measure What Matters', 'Analytics for Leaders'],
        dailyPractice: 'Review personal KPIs daily'
    },
    {
        id: 10,
        name: 'Speed of Execution',
        category: 'Execution',
        description: 'Bias for action, ship fast, iterate',
        currentLevel: 4,
        targetLevel: 9,
        practiceAreas: ['Rapid prototyping', 'MVP mindset', 'Iteration cycles'],
        resources: ['The Lean Startup', 'Amazon 14 principles'],
        dailyPractice: 'Ship something small every day'
    },
    {
        id: 11,
        name: 'Quality & Excellence',
        category: 'Execution',
        description: 'Maintain high standards while moving fast',
        currentLevel: 4,
        targetLevel: 9,
        practiceAreas: ['Code quality', 'Documentation', 'Testing'],
        resources: ['Clean Code', 'The Pragmatic Programmer'],
        dailyPractice: 'Review and improve code quality'
    },
    {
        id: 12,
        name: 'Delegation & Leverage',
        category: 'Execution',
        description: 'Multiply output through others and tools',
        currentLevel: 2,
        targetLevel: 8,
        practiceAreas: ['Task delegation', 'Automation', 'Tools & systems'],
        resources: ['Who Not How', 'The 4-Hour Workweek'],
        dailyPractice: 'Delegate or automate one task weekly'
    },

    // Communication & Influence (13-18)
    {
        id: 13,
        name: 'Written Communication',
        category: 'Communication',
        description: 'Write clearly, concisely, persuasively',
        currentLevel: 5,
        targetLevel: 9,
        practiceAreas: ['Technical writing', 'Email', 'Documentation'],
        resources: ['On Writing Well', 'The Elements of Style'],
        dailyPractice: 'Write 500+ words daily (blogs, notes)'
    },
    {
        id: 14,
        name: 'Public Speaking',
        category: 'Communication',
        description: 'Present ideas compellingly to any audience',
        currentLevel: 4,
        targetLevel: 9,
        practiceAreas: ['Presentations', 'Podcasts', 'Interviews'],
        resources: ['TED Talks', 'Talk Like TED'],
        dailyPractice: 'Practice presentation or explanation daily'
    },
    {
        id: 15,
        name: 'Storytelling',
        category: 'Communication',
        description: 'Craft narratives that move people',
        currentLevel: 3,
        targetLevel: 8,
        practiceAreas: ['Personal narrative', 'Vision storytelling', 'Case studies'],
        resources: ['Building a StoryBrand', 'Made to Stick'],
        dailyPractice: 'Tell one story per conversation'
    },
    {
        id: 16,
        name: 'Negotiation',
        category: 'Communication',
        description: 'Get favorable outcomes in any negotiation',
        currentLevel: 3,
        targetLevel: 8,
        practiceAreas: ['BATNA analysis', 'Win-win solutions', 'Anchoring'],
        resources: ['Never Split the Difference', 'Getting to Yes'],
        dailyPractice: 'Practice negotiation techniques'
    },
    {
        id: 17,
        name: 'Networking',
        category: 'Communication',
        description: 'Build and maintain valuable relationships',
        currentLevel: 3,
        targetLevel: 8,
        practiceAreas: ['Cold outreach', 'Relationship maintenance', 'Value exchange'],
        resources: ['Never Eat Alone', 'Give and Take'],
        dailyPractice: 'Reach out to 1-2 people weekly'
    },
    {
        id: 18,
        name: 'Personal Branding',
        category: 'Communication',
        description: 'Build a recognized, respected personal brand',
        currentLevel: 2,
        targetLevel: 8,
        practiceAreas: ['Content creation', 'Social proof', 'Thought leadership'],
        resources: ['Building a Personal Brand', 'LinkedIn optimization'],
        dailyPractice: 'Post valuable content 3x/week'
    },

    // Leadership & People (19-24)
    {
        id: 19,
        name: 'Hiring & Talent',
        category: 'Leadership',
        description: 'Identify and attract A-players',
        currentLevel: 2,
        targetLevel: 8,
        practiceAreas: ['Interview techniques', 'Talent assessment', 'Culture fit'],
        resources: ['Who', 'Topgrading'],
        dailyPractice: 'Study great hiring practices'
    },
    {
        id: 20,
        name: 'Team Building',
        category: 'Leadership',
        description: 'Build high-performing teams',
        currentLevel: 3,
        targetLevel: 8,
        practiceAreas: ['Team dynamics', 'Psychological safety', 'Motivation'],
        resources: ['The Five Dysfunctions of a Team', 'Drive'],
        dailyPractice: 'Foster team collaboration'
    },
    {
        id: 21,
        name: 'Feedback & Coaching',
        category: 'Leadership',
        description: 'Give and receive feedback effectively',
        currentLevel: 3,
        targetLevel: 8,
        practiceAreas: ['Radical candor', 'Growth mindset', 'Mentoring'],
        resources: ['Radical Candor', 'Thanks for the Feedback'],
        dailyPractice: 'Give one piece of feedback daily'
    },
    {
        id: 22,
        name: 'Vision Casting',
        category: 'Leadership',
        description: 'Inspire others with compelling vision',
        currentLevel: 3,
        targetLevel: 9,
        practiceAreas: ['Vision articulation', 'Mission alignment', 'Purpose-driven leadership'],
        resources: ['Start with Why', 'Leaders Eat Last'],
        dailyPractice: 'Articulate vision regularly'
    },
    {
        id: 23,
        name: 'Conflict Resolution',
        category: 'Leadership',
        description: 'Navigate and resolve conflicts constructively',
        currentLevel: 3,
        targetLevel: 8,
        practiceAreas: ['Active listening', 'Mediation', 'Win-win solutions'],
        resources: ['Crucial Conversations', 'Nonviolent Communication'],
        dailyPractice: 'Practice empathetic listening'
    },
    {
        id: 24,
        name: 'Culture Building',
        category: 'Leadership',
        description: 'Create and maintain excellent culture',
        currentLevel: 2,
        targetLevel: 8,
        practiceAreas: ['Values definition', 'Rituals', 'Norm setting'],
        resources: ['What You Do Is Who You Are', 'Culture Code'],
        dailyPractice: 'Model desired behaviors'
    },

    // Personal Mastery (25-30)
    {
        id: 25,
        name: 'Emotional Intelligence',
        category: 'Personal Mastery',
        description: 'Understand and manage emotions (self & others)',
        currentLevel: 4,
        targetLevel: 9,
        practiceAreas: ['Self-awareness', 'Empathy', 'Emotional regulation'],
        resources: ['Emotional Intelligence - Goleman', 'Mindfulness'],
        dailyPractice: 'Daily emotion journaling'
    },
    {
        id: 26,
        name: 'Resilience & Grit',
        category: 'Personal Mastery',
        description: 'Persist through adversity, bounce back from failure',
        currentLevel: 5,
        targetLevel: 10,
        practiceAreas: ['Stress inoculation', 'Cold exposure', 'Embracing discomfort'],
        resources: ['Grit - Angela Duckworth', 'Man\'s Search for Meaning'],
        dailyPractice: 'Daily cold exposure + hard thing'
    },
    {
        id: 27,
        name: 'Energy Management',
        category: 'Personal Mastery',
        description: 'Optimize physical and mental energy',
        currentLevel: 4,
        targetLevel: 9,
        practiceAreas: ['Sleep optimization', 'Nutrition', 'Exercise', 'Recovery'],
        resources: ['Why We Sleep', 'The Power of Full Engagement'],
        dailyPractice: '8+ hours sleep, exercise, nutrition tracking'
    },
    {
        id: 28,
        name: 'Deep Focus',
        category: 'Personal Mastery',
        description: 'Concentrate intensely for extended periods',
        currentLevel: 5,
        targetLevel: 10,
        practiceAreas: ['Distraction elimination', 'Flow state', 'Time blocking'],
        resources: ['Deep Work - Cal Newport', 'Flow - Csikszentmihalyi'],
        dailyPractice: '4+ hours daily deep work'
    },
    {
        id: 29,
        name: 'Learning Velocity',
        category: 'Personal Mastery',
        description: 'Learn new skills rapidly',
        currentLevel: 5,
        targetLevel: 9,
        practiceAreas: ['Deliberate practice', 'Feedback loops', 'Skill decomposition'],
        resources: ['Ultralearning', 'The First 20 Hours'],
        dailyPractice: 'Learn something new daily'
    },
    {
        id: 30,
        name: 'Self-Discipline',
        category: 'Personal Mastery',
        description: 'Do what must be done regardless of feelings',
        currentLevel: 6,
        targetLevel: 10,
        practiceAreas: ['Habit formation', 'Commitment devices', 'Willpower'],
        resources: ['Atomic Habits', 'The Power of Habit'],
        dailyPractice: '100% schedule adherence'
    },
];

// Get skills by category
export function getSkillsByCategory(category: string): CEOSkill[] {
    return CEO_SKILLS.filter(s => s.category === category);
}

// Get all unique categories
export function getCEOSkillCategories(): string[] {
    return [...new Set(CEO_SKILLS.map(s => s.category))];
}

// Calculate overall progress
export function getCEOSkillsProgress(): { current: number; target: number; percentage: number } {
    const current = CEO_SKILLS.reduce((sum, s) => sum + s.currentLevel, 0);
    const target = CEO_SKILLS.reduce((sum, s) => sum + s.targetLevel, 0);
    return {
        current,
        target,
        percentage: Math.round((current / target) * 100),
    };
}

// Get skills needing most improvement
export function getSkillsNeedingImprovement(): CEOSkill[] {
    return [...CEO_SKILLS]
        .sort((a, b) => (b.targetLevel - b.currentLevel) - (a.targetLevel - a.currentLevel))
        .slice(0, 10);
}
