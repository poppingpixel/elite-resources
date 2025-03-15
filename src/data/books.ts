// 40 Core Books - Master Reading List 2026
// Organized by tier (priority) and domain

export interface Book {
    id: number;
    title: string;
    author: string;
    tier: number; // 1-7 (1 = highest priority)
    domain: BookDomain;
    status: 'not_started' | 'in_progress' | 'completed';
    priority: 'critical' | 'high' | 'medium';
    pages: number;
    estimatedHours: number;
    keyTakeaways: string[];
    deadline?: string;
    completedDate?: string;
    coverUrl?: string; // URL to book cover image
    link?: string; // URL to purchase or view book
}

export type BookDomain =
    | 'AI/ML'
    | 'Quantitative Finance'
    | 'Probability & Mathematics'
    | 'Leadership & Strategy'
    | 'Psychology & Performance'
    | 'Writing & Communication'
    | 'Resilience';

// Tier 1: Foundation Books (Complete by Jan-Feb)
export const TIER_1_BOOKS: Book[] = [
    {
        id: 1,
        title: 'Deep Learning',
        author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
        tier: 1,
        domain: 'AI/ML',
        status: 'not_started',
        priority: 'critical',
        pages: 800,
        estimatedHours: 80,
        keyTakeaways: ['Neural network foundations', 'Optimization theory', 'Regularization'],
        deadline: '2026-02-28',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780262035613-L.jpg',
        link: 'https://www.deeplearningbook.org/'
    },
    {
        id: 2,
        title: 'Reinforcement Learning: An Introduction',
        author: 'Richard Sutton, Andrew Barto',
        tier: 1,
        domain: 'AI/ML',
        status: 'not_started',
        priority: 'critical',
        pages: 552,
        estimatedHours: 60,
        keyTakeaways: ['MDPs', 'Value functions', 'Policy gradient', 'TD learning'],
        deadline: '2026-03-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780262039246-L.jpg',
        link: 'http://incompleteideas.net/book/the-book-2nd.html'
    },
    {
        id: 3,
        title: 'An Introduction to Probability Theory Vol 1',
        author: 'William Feller',
        tier: 1,
        domain: 'Probability & Mathematics',
        status: 'not_started',
        priority: 'critical',
        pages: 509,
        estimatedHours: 60,
        keyTakeaways: ['Probability fundamentals', 'Random variables', 'Limit theorems'],
        deadline: '2026-02-28',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780471257080-L.jpg',
        link: 'https://www.probabilitycourse.com/'
    },
    {
        id: 4,
        title: 'An Introduction to Probability Theory Vol 2',
        author: 'William Feller',
        tier: 1,
        domain: 'Probability & Mathematics',
        status: 'not_started',
        priority: 'critical',
        pages: 669,
        estimatedHours: 70,
        keyTakeaways: ['Advanced probability', 'Stochastic processes'],
        deadline: '2026-03-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780471257097-L.jpg',
        link: 'https://www.probabilitycourse.com/'
    },
    {
        id: 5,
        title: 'High Output Management',
        author: 'Andrew Grove',
        tier: 1,
        domain: 'Leadership & Strategy',
        status: 'not_started',
        priority: 'critical',
        pages: 272,
        estimatedHours: 8,
        keyTakeaways: ['OKRs', 'Leverage', 'Production principle', 'Meetings'],
        deadline: '2026-01-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780679762881-L.jpg',
        link: 'https://www.amazon.com/High-Output-Management-Andrew-Grove/dp/0679762884'
    },
];

// Tier 2: Advanced Theory (Complete by March-April)
export const TIER_2_BOOKS: Book[] = [
    {
        id: 6,
        title: 'Stochastic Calculus for Finance I',
        author: 'Steven Shreve',
        tier: 2,
        domain: 'Quantitative Finance',
        status: 'not_started',
        priority: 'critical',
        pages: 187,
        estimatedHours: 25,
        keyTakeaways: ['Binomial model', 'Risk-neutral pricing', 'Discrete finance'],
        deadline: '2026-03-15',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780387249681-L.jpg',
        link: 'https://www.amazon.com/Stochastic-Calculus-Finance-Binomial-Models/dp/0387249680'
    },
    {
        id: 7,
        title: 'Stochastic Calculus for Finance II',
        author: 'Steven Shreve',
        tier: 2,
        domain: 'Quantitative Finance',
        status: 'not_started',
        priority: 'critical',
        pages: 550,
        estimatedHours: 60,
        keyTakeaways: ['Continuous-time finance', 'Black-Scholes', 'Itô calculus'],
        deadline: '2026-04-30',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780387401010-L.jpg',
        link: 'https://www.amazon.com/Stochastic-Calculus-Finance-II-Continuous-Time/dp/0387401016'
    },
    {
        id: 8,
        title: 'Options, Futures, and Other Derivatives',
        author: 'John Hull',
        tier: 2,
        domain: 'Quantitative Finance',
        status: 'not_started',
        priority: 'high',
        pages: 896,
        estimatedHours: 80,
        keyTakeaways: ['Derivatives pricing', 'Risk management', 'Black-Scholes'],
        deadline: '2026-05-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780133456318-L.jpg',
        link: 'https://www.amazon.com/Options-Futures-Other-Derivatives-9th/dp/0133456315'
    },
    {
        id: 9,
        title: 'The Elements of Statistical Learning',
        author: 'Hastie, Tibshirani, Friedman',
        tier: 2,
        domain: 'AI/ML',
        status: 'not_started',
        priority: 'high',
        pages: 745,
        estimatedHours: 80,
        keyTakeaways: ['Statistical learning theory', 'Regularization', 'Ensemble methods'],
        deadline: '2026-04-30',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780387848570-L.jpg',
        link: 'https://hastie.su.domains/ElemStatLearn/ElemStatLearn_print12.pdf'
    },
    {
        id: 10,
        title: 'Pattern Recognition and Machine Learning',
        author: 'Christopher Bishop',
        tier: 2,
        domain: 'AI/ML',
        status: 'not_started',
        priority: 'high',
        pages: 738,
        estimatedHours: 80,
        keyTakeaways: ['Bayesian methods', 'Graphical models', 'Neural networks'],
        deadline: '2026-05-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780387310732-L.jpg',
        link: 'https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf'
    },
];

// Tier 3: Execution & Performance
export const TIER_3_BOOKS: Book[] = [
    {
        id: 11,
        title: 'Deep Work',
        author: 'Cal Newport',
        tier: 3,
        domain: 'Psychology & Performance',
        status: 'not_started',
        priority: 'high',
        pages: 296,
        estimatedHours: 8,
        keyTakeaways: ['Focus', 'Distraction elimination', 'High-value work'],
        deadline: '2026-01-15',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
        link: 'https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692'
    },
    {
        id: 12,
        title: 'Atomic Habits',
        author: 'James Clear',
        tier: 3,
        domain: 'Psychology & Performance',
        status: 'not_started',
        priority: 'high',
        pages: 320,
        estimatedHours: 8,
        keyTakeaways: ['Habit formation', '1% improvement', 'Systems over goals'],
        deadline: '2026-01-20',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
        link: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299'
    },
    {
        id: 13,
        title: 'Grit',
        author: 'Angela Duckworth',
        tier: 3,
        domain: 'Resilience',
        status: 'not_started',
        priority: 'high',
        pages: 352,
        estimatedHours: 10,
        keyTakeaways: ['Passion + perseverance', 'Deliberate practice', 'Growth mindset'],
        deadline: '2026-02-01',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781501111105-L.jpg',
        link: 'https://www.amazon.com/Grit-Passion-Perseverance-Angela-Duckworth/dp/1501111108'
    },
    {
        id: 14,
        title: 'Why We Sleep',
        author: 'Matthew Walker',
        tier: 3,
        domain: 'Psychology & Performance',
        status: 'not_started',
        priority: 'medium',
        pages: 368,
        estimatedHours: 12,
        keyTakeaways: ['Sleep science', 'Cognitive performance', 'Recovery'],
        deadline: '2026-02-15',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781501144318-L.jpg',
        link: 'https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316'
    },
    {
        id: 15,
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        tier: 3,
        domain: 'Psychology & Performance',
        status: 'not_started',
        priority: 'high',
        pages: 499,
        estimatedHours: 20,
        keyTakeaways: ['System 1 & 2', 'Cognitive biases', 'Decision making'],
        deadline: '2026-03-15',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780374275631-L.jpg',
        link: 'https://paulminors.com/wp-content/uploads/2022/01/Thinking-Fast-and-Slow-Book-Summary-PDF.pdf'
    },
];

// Tier 4: Leadership & Strategy
export const TIER_4_BOOKS: Book[] = [
    {
        id: 16,
        title: 'Zero to One',
        author: 'Peter Thiel',
        tier: 4,
        domain: 'Leadership & Strategy',
        status: 'not_started',
        priority: 'high',
        pages: 224,
        estimatedHours: 6,
        keyTakeaways: ['Monopoly thinking', 'Innovation', 'Contrarian ideas'],
        deadline: '2026-02-28',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg',
        link: 'https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296'
    },
    {
        id: 17,
        title: 'The Hard Thing About Hard Things',
        author: 'Ben Horowitz',
        tier: 4,
        domain: 'Leadership & Strategy',
        status: 'not_started',
        priority: 'high',
        pages: 304,
        estimatedHours: 10,
        keyTakeaways: ['CEO struggles', 'Leadership in crisis', 'Company building'],
        deadline: '2026-03-15',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062273208-L.jpg',
        link: 'https://www.amazon.com/Hard-Thing-About-Things-Building/dp/0062273205'
    },
    {
        id: 18,
        title: 'Good Strategy Bad Strategy',
        author: 'Richard Rumelt',
        tier: 4,
        domain: 'Leadership & Strategy',
        status: 'not_started',
        priority: 'high',
        pages: 336,
        estimatedHours: 12,
        keyTakeaways: ['Strategy kernel', 'Diagnosis', 'Coherent action'],
        deadline: '2026-03-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780307886231-L.jpg',
        link: 'https://www.amazon.com/Good-Strategy-Bad-Difference-Matters/dp/0307886239'
    },
    {
        id: 19,
        title: 'The Lean Startup',
        author: 'Eric Ries',
        tier: 4,
        domain: 'Leadership & Strategy',
        status: 'not_started',
        priority: 'medium',
        pages: 336,
        estimatedHours: 10,
        keyTakeaways: ['Build-measure-learn', 'MVP', 'Pivot'],
        deadline: '2026-04-15',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780307887817-L.jpg',
        link: 'https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887818'
    },
    {
        id: 20,
        title: 'Measure What Matters',
        author: 'John Doerr',
        tier: 4,
        domain: 'Leadership & Strategy',
        status: 'not_started',
        priority: 'medium',
        pages: 320,
        estimatedHours: 10,
        keyTakeaways: ['OKRs', 'Goal setting', 'Alignment'],
        deadline: '2026-04-30',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780525536222-L.jpg',
        link: 'https://www.amazon.com/Measure-What-Matters-Google-Foundation/dp/0525536221'
    },
];

// Tier 5: Communication & Persuasion
export const TIER_5_BOOKS: Book[] = [
    {
        id: 21,
        title: 'Never Split the Difference',
        author: 'Chris Voss',
        tier: 5,
        domain: 'Writing & Communication',
        status: 'not_started',
        priority: 'medium',
        pages: 288,
        estimatedHours: 8,
        keyTakeaways: ['Tactical empathy', 'Labeling', 'Mirroring'],
        deadline: '2026-05-15',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062407801-L.jpg',
        link: 'https://www.amazon.com/Never-Split-Difference-Negotiating-Depended/dp/0062407805'
    },
    {
        id: 22,
        title: 'Made to Stick',
        author: 'Chip & Dan Heath',
        tier: 5,
        domain: 'Writing & Communication',
        status: 'not_started',
        priority: 'medium',
        pages: 336,
        estimatedHours: 10,
        keyTakeaways: ['SUCCES framework', 'Sticky ideas', 'Storytelling'],
        deadline: '2026-05-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781400064281-L.jpg',
        link: 'https://www.amazon.com/Made-Stick-Ideas-Survive-Others/dp/1400064287'
    },
    {
        id: 23,
        title: 'On Writing Well',
        author: 'William Zinsser',
        tier: 5,
        domain: 'Writing & Communication',
        status: 'not_started',
        priority: 'high',
        pages: 336,
        estimatedHours: 10,
        keyTakeaways: ['Clarity', 'Simplicity', 'Rewriting'],
        deadline: '2026-03-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780060891541-L.jpg',
        link: 'https://www.amazon.com/Writing-Well-Classic-Guide-Nonfiction/dp/0060891548'
    },
    {
        id: 24,
        title: 'Influence',
        author: 'Robert Cialdini',
        tier: 5,
        domain: 'Psychology & Performance',
        status: 'not_started',
        priority: 'medium',
        pages: 336,
        estimatedHours: 12,
        keyTakeaways: ['6 principles of persuasion', 'Social proof', 'Reciprocity'],
        deadline: '2026-06-15',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062937650-L.jpg',
        link: 'https://www.amazon.com/Influence-New-Expanded-Psychology-Persuasion/dp/0062937650'
    },
];

// Tier 6: Resilience & Mindset
export const TIER_6_BOOKS: Book[] = [
    {
        id: 25,
        title: "Man's Search for Meaning",
        author: 'Viktor Frankl',
        tier: 6,
        domain: 'Resilience',
        status: 'not_started',
        priority: 'high',
        pages: 184,
        estimatedHours: 6,
        keyTakeaways: ['Purpose', 'Suffering', 'Meaning'],
        deadline: '2026-02-15',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780807014295-L.jpg',
        link: 'https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/0807014273'
    },
    {
        id: 26,
        title: 'Meditations',
        author: 'Marcus Aurelius',
        tier: 6,
        domain: 'Resilience',
        status: 'not_started',
        priority: 'high',
        pages: 256,
        estimatedHours: 8,
        keyTakeaways: ['Stoicism', 'Self-discipline', 'Perspective'],
        deadline: '2026-03-01',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg',
        link: 'https://www.gutenberg.org/ebooks/2680'
    },
    {
        id: 27,
        title: 'The Obstacle Is the Way',
        author: 'Ryan Holiday',
        tier: 6,
        domain: 'Resilience',
        status: 'not_started',
        priority: 'medium',
        pages: 224,
        estimatedHours: 6,
        keyTakeaways: ['Adversity advantage', 'Perception', 'Action'],
        deadline: '2026-04-01',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781591846352-L.jpg',
        link: 'https://www.amazon.com/Obstacle-Way-Timeless-Turning-Triumph/dp/1591846358'
    },
    {
        id: 28,
        title: 'Cant Hurt Me',
        author: 'David Goggins',
        tier: 6,
        domain: 'Resilience',
        status: 'not_started',
        priority: 'high',
        pages: 364,
        estimatedHours: 12,
        keyTakeaways: ['Mental toughness', '40% rule', 'Callusing mind'],
        deadline: '2026-02-28',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781544512273-L.jpg',
        link: 'https://www.amazon.com/Cant-Hurt-Me-Master-Your/dp/1544512279'
    },
];

// Tier 7: Advanced Specialization
export const TIER_7_BOOKS: Book[] = [
    {
        id: 29,
        title: 'Advances in Financial Machine Learning',
        author: 'Marcos Lopez de Prado',
        tier: 7,
        domain: 'Quantitative Finance',
        status: 'not_started',
        priority: 'high',
        pages: 400,
        estimatedHours: 50,
        keyTakeaways: ['ML for finance', 'Backtesting', 'Feature engineering'],
        deadline: '2026-06-30',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781119482086-L.jpg',
        link: 'https://www.amazon.com/Advances-Financial-Machine-Learning-Marcos/dp/1119482089'
    },
    {
        id: 30,
        title: 'Quantitative Trading',
        author: 'Ernest Chan',
        tier: 7,
        domain: 'Quantitative Finance',
        status: 'not_started',
        priority: 'medium',
        pages: 224,
        estimatedHours: 20,
        keyTakeaways: ['Algo trading', 'Mean reversion', 'Momentum'],
        deadline: '2026-07-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780470284889-L.jpg',
        link: 'https://www.amazon.com/Quantitative-Trading-Build-Algorithmic-Business/dp/0470284889'
    },
    {
        id: 31,
        title: 'Python for Finance',
        author: 'Yves Hilpisch',
        tier: 7,
        domain: 'Quantitative Finance',
        status: 'not_started',
        priority: 'medium',
        pages: 720,
        estimatedHours: 50,
        keyTakeaways: ['Financial programming', 'Data analysis', 'Derivatives'],
        deadline: '2026-08-31',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781492024330-L.jpg',
        link: 'https://www.amazon.com/Python-Finance-Mastering-Data-Driven/dp/1492024333'
    },
    {
        id: 32,
        title: 'The Intelligent Investor',
        author: 'Benjamin Graham',
        tier: 7,
        domain: 'Quantitative Finance',
        status: 'not_started',
        priority: 'medium',
        pages: 640,
        estimatedHours: 25,
        keyTakeaways: ['Value investing', 'Margin of safety', 'Mr. Market'],
        deadline: '2026-09-30',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg',
        link: 'https://www.amazon.com/Intelligent-Investor-Definitive-Investing-Essentials/dp/0060555661'
    },
];

// Additional books for complete 40
export const ADDITIONAL_BOOKS: Book[] = [
    { id: 33, title: 'Superintelligence', author: 'Nick Bostrom', tier: 7, domain: 'AI/ML', status: 'not_started', priority: 'medium', pages: 352, estimatedHours: 15, keyTakeaways: ['AI risk', 'Control problem'], deadline: '2026-10-31', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780198739838-L.jpg', link: 'https://www.amazon.com/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0198739834' },
    { id: 34, title: 'Poor Charlies Almanack', author: 'Charlie Munger', tier: 4, domain: 'Leadership & Strategy', status: 'not_started', priority: 'high', pages: 548, estimatedHours: 20, keyTakeaways: ['Mental models', 'Worldly wisdom'], deadline: '2026-05-15', coverUrl: 'https://covers.openlibrary.org/b/isbn/9781578645015-L.jpg', link: 'https://www.amazon.com/Poor-Charlies-Almanack-Charles-Expanded/dp/1578645018' },
    { id: 35, title: 'Essentialism', author: 'Greg McKeown', tier: 3, domain: 'Psychology & Performance', status: 'not_started', priority: 'high', pages: 272, estimatedHours: 8, keyTakeaways: ['Less but better', 'Trade-offs'], deadline: '2026-02-10', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780804137386-L.jpg', link: 'https://www.amazon.com/Essentialism-Disciplined-Pursuit-Greg-McKeown/dp/0804137382' },
    { id: 36, title: 'The Pragmatic Programmer', author: 'David Thomas', tier: 2, domain: 'AI/ML', status: 'not_started', priority: 'high', pages: 352, estimatedHours: 15, keyTakeaways: ['Software craft', 'Best practices'], deadline: '2026-04-15', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg', link: 'https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052' },
    { id: 37, title: 'Clean Code', author: 'Robert Martin', tier: 2, domain: 'AI/ML', status: 'not_started', priority: 'high', pages: 464, estimatedHours: 20, keyTakeaways: ['Code quality', 'Refactoring'], deadline: '2026-03-31', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', link: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882' },
    { id: 38, title: 'Start with Why', author: 'Simon Sinek', tier: 4, domain: 'Leadership & Strategy', status: 'not_started', priority: 'medium', pages: 256, estimatedHours: 8, keyTakeaways: ['Purpose', 'Golden Circle'], deadline: '2026-05-31', coverUrl: 'https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg', link: 'https://www.amazon.com/Start-Why-Leaders-Inspire-Everyone/dp/1591846447' },
    { id: 39, title: 'The Wim Hof Method', author: 'Wim Hof', tier: 6, domain: 'Resilience', status: 'not_started', priority: 'medium', pages: 232, estimatedHours: 8, keyTakeaways: ['Cold exposure', 'Breathing', 'Mindset'], deadline: '2026-01-31', coverUrl: 'https://covers.openlibrary.org/b/isbn/9781683644095-L.jpg', link: 'https://www.amazon.com/Wim-Hof-Method-Activate-Potential/dp/1683644093' },
    { id: 40, title: 'Flow', author: 'Mihaly Csikszentmihalyi', tier: 3, domain: 'Psychology & Performance', status: 'not_started', priority: 'medium', pages: 303, estimatedHours: 12, keyTakeaways: ['Flow state', 'Optimal experience'], deadline: '2026-04-30', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780061339202-L.jpg', link: 'https://www.amazon.com/Flow-Psychology-Experience-Perennial-Classics/dp/0061339202' },
];

// Combined all books
export const ALL_BOOKS: Book[] = [
    ...TIER_1_BOOKS,
    ...TIER_2_BOOKS,
    ...TIER_3_BOOKS,
    ...TIER_4_BOOKS,
    ...TIER_5_BOOKS,
    ...TIER_6_BOOKS,
    ...TIER_7_BOOKS,
    ...ADDITIONAL_BOOKS,
].sort((a, b) => a.tier - b.tier);

// Helper functions
export function getBooksByTier(tier: number): Book[] {
    return ALL_BOOKS.filter(b => b.tier === tier);
}

export function getBooksByDomain(domain: BookDomain): Book[] {
    return ALL_BOOKS.filter(b => b.domain === domain);
}

export function getBooksByStatus(status: 'not_started' | 'in_progress' | 'completed'): Book[] {
    return ALL_BOOKS.filter(b => b.status === status);
}

export function getBooksProgress(): { completed: number; inProgress: number; total: number; percentage: number } {
    const completed = ALL_BOOKS.filter(b => b.status === 'completed').length;
    const inProgress = ALL_BOOKS.filter(b => b.status === 'in_progress').length;
    const total = ALL_BOOKS.length;
    return {
        completed,
        inProgress,
        total,
        percentage: Math.round((completed / total) * 100),
    };
}

export function getUpcomingBooks(): Book[] {
    const now = new Date();
    return ALL_BOOKS
        .filter(b => b.status !== 'completed' && b.deadline)
        .filter(b => new Date(b.deadline!) > now)
        .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
        .slice(0, 5);
}

export function getOverdueBooks(): Book[] {
    const now = new Date();
    return ALL_BOOKS
        .filter(b => b.status !== 'completed' && b.deadline)
        .filter(b => new Date(b.deadline!) < now);
}
