// ═══════════════════════════════════════════════════════════════════════════════
// POLYMATH METHODS DATA - The 5 Core Learning Techniques for Superhuman Growth
// ═══════════════════════════════════════════════════════════════════════════════

export interface PolymathMethod {
    id: number;
    name: string;
    shortName: string;
    master: string;
    description: string;
    howItWorks: string[];
    dailyPractice: string;
    resources: {
        name: string;
        url: string;
        type: 'video' | 'article' | 'book' | 'course';
    }[];
    color: string;
    emoji: string;
    estimatedMasteryWeeks: number;
}

export interface ResilienceActivity {
    id: number;
    name: string;
    category: 'physical' | 'mental' | 'breathing' | 'training';
    target: string;
    unit: string;
    description: string;
    benefit: string;
    emoji: string;
}

export interface BillionaireSkill {
    id: number;
    name: string;
    category: string;
    master: string;
    description: string;
    priority: 'core' | 'extended';
    resources: {
        name: string;
        url: string;
        type: 'video' | 'article' | 'book' | 'course';
    }[];
}

export interface IncomeStream {
    id: number;
    name: string;
    type: 'base' | 'bonus' | 'alternative';
    minAmount: number;
    maxAmount: number;
    description: string;
    stability: 'high' | 'medium' | 'low';
}

// ═══════════════════════════════════════════════════════════════════════════════
// POLYMATH METHODS - The 5 Core Learning Techniques
// ═══════════════════════════════════════════════════════════════════════════════

export const POLYMATH_METHODS: PolymathMethod[] = [
    {
        id: 1,
        name: "First Principles Thinking",
        shortName: "First Principles",
        master: "Elon Musk / Aristotle",
        description: "Break complex problems into fundamental truths and reason up from there. Question every assumption until you reach undeniable facts.",
        howItWorks: [
            "Identify and define your current assumptions",
            "Break down the problem into its fundamental truths",
            "Create new solutions from scratch based on these truths"
        ],
        dailyPractice: "Take one problem you're facing and ask 'Why?' five times until you reach the fundamental truth.",
        resources: [
            { name: "Elon Musk First Principles Explained", url: "https://www.youtube.com/watch?v=NV3sBlRgzTI", type: "video" },
            { name: "First Principles: The Building Blocks of True Knowledge", url: "https://jamesclear.com/first-principles", type: "article" },
            { name: "The Great Mental Models Vol. 1", url: "https://www.amazon.com/Great-Mental-Models-Thinking-Concepts/dp/1999449002", type: "book" }
        ],
        color: "#007AFF",
        emoji: "🧠",
        estimatedMasteryWeeks: 8
    },
    {
        id: 2,
        name: "The 5-Hour Rule",
        shortName: "5-Hour Rule",
        master: "Bill Gates / Warren Buffett",
        description: "Dedicate at least 1 hour per day (5 hours per week) to deliberate learning. Billionaires protect their learning time religiously.",
        howItWorks: [
            "Block 1 hour daily for learning (non-negotiable)",
            "Read at least 30 minutes every day",
            "Reflect and apply what you learn immediately"
        ],
        dailyPractice: "Schedule a 60-minute deep learning block at the same time every day. No phone, no interruptions.",
        resources: [
            { name: "Warren Buffett's Reading Habits", url: "https://www.youtube.com/watch?v=_8DJGVc0SfE", type: "video" },
            { name: "Bill Gates' Think Week Explained", url: "https://www.youtube.com/watch?v=eTFy-8YRz0Q", type: "video" },
            { name: "Michael Simmons: The 5-Hour Rule", url: "https://medium.com/accelerated-intelligence/the-5-hour-rule-if-youre-not-spending-5-hours-per-week-learning-you-re-being-irresponsible-791c3f18f5e6", type: "article" }
        ],
        color: "#34C759",
        emoji: "📚",
        estimatedMasteryWeeks: 4
    },
    {
        id: 3,
        name: "T-Shaped Learning",
        shortName: "T-Shaped",
        master: "IDEO / Tim Brown",
        description: "Develop deep expertise in one area (the vertical bar) while maintaining broad knowledge across many fields (the horizontal bar).",
        howItWorks: [
            "Choose ONE primary domain for deep expertise (AI, Finance, etc.)",
            "Allocate 70% of learning time to your primary domain",
            "Spend 30% exploring adjacent and unrelated fields"
        ],
        dailyPractice: "Spend 45 minutes on your core skill, then 15 minutes learning something completely outside your field.",
        resources: [
            { name: "Tim Brown on T-Shaped People", url: "https://www.youtube.com/watch?v=OVpYSbV6w54", type: "video" },
            { name: "IDEO Design Thinking", url: "https://designthinking.ideo.com/", type: "course" },
            { name: "Range: Why Generalists Triumph", url: "https://www.amazon.com/Range-Generalists-Triumph-Specialized-World/dp/0735214506", type: "book" }
        ],
        color: "#AF52DE",
        emoji: "📊",
        estimatedMasteryWeeks: 12
    },
    {
        id: 4,
        name: "The Feynman Technique",
        shortName: "Feynman Technique",
        master: "Richard Feynman",
        description: "Explain concepts simply enough that a child could understand. If you can't explain it simply, you don't understand it well enough.",
        howItWorks: [
            "Choose a concept you want to learn",
            "Explain it in simple terms as if teaching a child",
            "Identify gaps in your explanation and go back to learn more",
            "Simplify and use analogies"
        ],
        dailyPractice: "After learning something new, write a one-paragraph explanation using only simple words. No jargon.",
        resources: [
            { name: "Richard Feynman's Technique Explained", url: "https://www.youtube.com/watch?v=tkm0TNFzIeg", type: "video" },
            { name: "Surely You're Joking, Mr. Feynman!", url: "https://www.amazon.com/Surely-Youre-Joking-Mr-Feynman/dp/0393316041", type: "book" },
            { name: "The Feynman Lectures on Physics", url: "https://www.feynmanlectures.caltech.edu/", type: "course" }
        ],
        color: "#FF9500",
        emoji: "✏️",
        estimatedMasteryWeeks: 6
    },
    {
        id: 5,
        name: "Interleaved Practice",
        shortName: "Interleaving",
        master: "Research-Backed (Roediger, Karpicke)",
        description: "Mix different subjects or skills in a single study session instead of focusing on just one. This strengthens retention and transfer.",
        howItWorks: [
            "Instead of blocking one topic at a time, switch between topics",
            "Practice different skills in alternating order",
            "Space your learning across multiple sessions over time"
        ],
        dailyPractice: "During your learning hour, switch topics every 20 minutes. 20 min AI → 20 min Finance → 20 min Leadership.",
        resources: [
            { name: "Make It Stick: The Science of Learning", url: "https://www.amazon.com/Make-Stick-Science-Successful-Learning/dp/0674729013", type: "book" },
            { name: "Barbara Oakley: Learning How to Learn", url: "https://www.coursera.org/learn/learning-how-to-learn", type: "course" },
            { name: "Spaced Repetition & Interleaving", url: "https://www.youtube.com/watch?v=Z-zNHHpXoMM", type: "video" }
        ],
        color: "#FF2D55",
        emoji: "🔄",
        estimatedMasteryWeeks: 4
    }
];

// ═══════════════════════════════════════════════════════════════════════════════
// RESILIENCE ACTIVITIES - Elite Training Protocol
// ═══════════════════════════════════════════════════════════════════════════════

export const RESILIENCE_ACTIVITIES: ResilienceActivity[] = [
    {
        id: 1,
        name: "Cold Exposure",
        category: "physical",
        target: "60-120",
        unit: "seconds",
        description: "Cold shower or ice bath to build mental resilience and reduce inflammation",
        benefit: "Increases dopamine 250-300%, builds willpower, reduces inflammation",
        emoji: "🧊"
    },
    {
        id: 2,
        name: "Wim Hof Breathing",
        category: "breathing",
        target: "3-4",
        unit: "rounds",
        description: "30 deep breaths, exhale and hold, repeat. Oxygenates body and calms mind.",
        benefit: "Reduces stress hormones, increases focus, boosts immune system",
        emoji: "💨"
    },
    {
        id: 3,
        name: "Meditation",
        category: "mental",
        target: "10-15",
        unit: "minutes",
        description: "Mindfulness meditation focusing on breath",
        benefit: "Increases gray matter, reduces anxiety, improves decision-making",
        emoji: "🧘"
    },
    {
        id: 4,
        name: "Box Breathing",
        category: "breathing",
        target: "5",
        unit: "minutes",
        description: "Inhale 4s, hold 4s, exhale 4s, hold 4s. Navy SEAL technique.",
        benefit: "Activates parasympathetic nervous system, instant calm",
        emoji: "📦"
    },
    {
        id: 5,
        name: "Kalarippayattu / BJJ",
        category: "training",
        target: "60-90",
        unit: "minutes",
        description: "Martial arts training session for combat readiness",
        benefit: "Full body conditioning, mental discipline, self-defense",
        emoji: "🥋"
    },
    {
        id: 6,
        name: "Deep Work Block",
        category: "mental",
        target: "90-120",
        unit: "minutes",
        description: "Uninterrupted focus on cognitively demanding work",
        benefit: "4x productivity, flow state activation, skill acceleration",
        emoji: "🎯"
    }
];

// ═══════════════════════════════════════════════════════════════════════════════
// TOP 10 BILLIONAIRE SKILLS (Core Priority)
// ═══════════════════════════════════════════════════════════════════════════════

export const TOP_BILLIONAIRE_SKILLS: BillionaireSkill[] = [
    {
        id: 1,
        name: "First Principles Thinking",
        category: "Cognitive",
        master: "Elon Musk",
        description: "Break down complex problems to fundamental truths",
        priority: "core",
        resources: [
            { name: "Elon Musk Masterclass", url: "https://www.youtube.com/watch?v=NV3sBlRgzTI", type: "video" }
        ]
    },
    {
        id: 2,
        name: "Communication & Persuasion",
        category: "Influence",
        master: "Chris Voss",
        description: "Convince, inspire, and lead through words",
        priority: "core",
        resources: [
            { name: "Never Split the Difference", url: "https://www.amazon.com/Never-Split-Difference-Negotiating-Depended/dp/0062407805", type: "book" }
        ]
    },
    {
        id: 3,
        name: "Financial Literacy",
        category: "Finance",
        master: "Warren Buffett",
        description: "Understand money, investing, and compound growth",
        priority: "core",
        resources: [
            { name: "The Intelligent Investor", url: "https://www.amazon.com/Intelligent-Investor-Definitive-Investing-Essentials/dp/0060555661", type: "book" }
        ]
    },
    {
        id: 4,
        name: "Long-Term Vision",
        category: "Strategy",
        master: "Jeff Bezos",
        description: "Think in decades, not days. Regret minimization.",
        priority: "core",
        resources: [
            { name: "Jeff Bezos Shareholder Letters", url: "https://www.aboutamazon.com/news/company-news/2020-letter-to-shareholders", type: "article" }
        ]
    },
    {
        id: 5,
        name: "Voracious Learning",
        category: "Growth",
        master: "Bill Gates",
        description: "Read 50+ books per year, learn continuously",
        priority: "core",
        resources: [
            { name: "Gates Notes Book Reviews", url: "https://www.gatesnotes.com/Books", type: "article" }
        ]
    },
    {
        id: 6,
        name: "Emotional Resilience",
        category: "Psychology",
        master: "Ray Dalio",
        description: "Embrace failure, learn from pain, stay calm under pressure",
        priority: "core",
        resources: [
            { name: "Principles by Ray Dalio", url: "https://www.principles.com/", type: "book" }
        ]
    },
    {
        id: 7,
        name: "Strategic Decision-Making",
        category: "Cognitive",
        master: "Charlie Munger",
        description: "Use mental models to make better decisions",
        priority: "core",
        resources: [
            { name: "Poor Charlie's Almanack", url: "https://www.amazon.com/Poor-Charlies-Almanack-Charles-Munger/dp/1578645018", type: "book" }
        ]
    },
    {
        id: 8,
        name: "Leadership & Team Building",
        category: "Leadership",
        master: "Steve Jobs",
        description: "Inspire A-players and create reality distortion fields",
        priority: "core",
        resources: [
            { name: "Steve Jobs Documentary", url: "https://www.youtube.com/watch?v=sBqnsoQ0Lck", type: "video" }
        ]
    },
    {
        id: 9,
        name: "Innovation & Customer Obsession",
        category: "Business",
        master: "Jeff Bezos",
        description: "Work backwards from customer needs",
        priority: "core",
        resources: [
            { name: "Working Backwards", url: "https://www.amazon.com/Working-Backwards-Insights-Stories-Secrets/dp/1250267595", type: "book" }
        ]
    },
    {
        id: 10,
        name: "Strategic Networking",
        category: "Relationships",
        master: "Keith Ferrazzi",
        description: "Build genuine relationships that compound over decades",
        priority: "core",
        resources: [
            { name: "Never Eat Alone", url: "https://www.amazon.com/Never-Eat-Alone-Expanded-Updated/dp/0385346654", type: "book" }
        ]
    }
];

// ═══════════════════════════════════════════════════════════════════════════════
// INCOME STREAMS - Stable & High-Growth
// ═══════════════════════════════════════════════════════════════════════════════

export const INCOME_STREAMS: IncomeStream[] = [
    // Base Compensation
    { id: 1, name: "AI Research Scientist Role", type: "base", minAmount: 180000, maxAmount: 250000, description: "Full-time role at top-tier AI lab", stability: "high" },
    { id: 2, name: "Quant Finance Full-Time", type: "base", minAmount: 150000, maxAmount: 200000, description: "Quantitative researcher position", stability: "high" },
    { id: 3, name: "AI/ML Consulting", type: "base", minAmount: 36000, maxAmount: 144000, description: "$150-300/hr × 20-40 hrs/month", stability: "medium" },

    // Bonuses & Equity
    { id: 4, name: "Signing Bonus", type: "bonus", minAmount: 50000, maxAmount: 100000, description: "One-time signing bonus (top firms)", stability: "medium" },
    { id: 5, name: "Performance Bonus", type: "bonus", minAmount: 36000, maxAmount: 125000, description: "20-50% of base salary", stability: "medium" },
    { id: 6, name: "Equity/RSUs", type: "bonus", minAmount: 50000, maxAmount: 200000, description: "Vesting stock grants per year", stability: "high" },
    { id: 7, name: "Research Bounties", type: "bonus", minAmount: 5000, maxAmount: 50000, description: "$5K-50K per accepted paper", stability: "low" },

    // Alternative Income (Stable)
    { id: 8, name: "AI Course Creation", type: "alternative", minAmount: 50000, maxAmount: 150000, description: "Udemy, Coursera royalties", stability: "high" },
    { id: 9, name: "Technical Writing/Books", type: "alternative", minAmount: 20000, maxAmount: 100000, description: "Blog sponsorships, book deals", stability: "medium" },
    { id: 10, name: "Conference Speaking", type: "alternative", minAmount: 15000, maxAmount: 75000, description: "$5K-25K per keynote", stability: "medium" },
    { id: 11, name: "Advisory Roles", type: "alternative", minAmount: 25000, maxAmount: 100000, description: "Startup advisor equity + cash", stability: "medium" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════════

export function getMethodById(id: number): PolymathMethod | undefined {
    return POLYMATH_METHODS.find(m => m.id === id);
}

export function getTotalBaseIncome(): { min: number; max: number } {
    const baseStreams = INCOME_STREAMS.filter(s => s.type === 'base');
    return {
        min: baseStreams.reduce((sum, s) => sum + s.minAmount, 0),
        max: baseStreams.reduce((sum, s) => sum + s.maxAmount, 0)
    };
}

export function getTotalBonusIncome(): { min: number; max: number } {
    const bonusStreams = INCOME_STREAMS.filter(s => s.type === 'bonus' || s.type === 'alternative');
    return {
        min: bonusStreams.reduce((sum, s) => sum + s.minAmount, 0),
        max: bonusStreams.reduce((sum, s) => sum + s.maxAmount, 0)
    };
}

// Updated: iteration 12
