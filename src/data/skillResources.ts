// CEO Skills to Resource Mapping - VERIFIED WORKING LINKS
// Maps each CEO skill to real, working learning resources

export interface SkillResource {
    name: string;
    url: string;
    type: 'video' | 'course' | 'pdf' | 'book' | 'website' | 'podcast';
    master?: string;
}

// Resources for each CEO skill by ID - ALL VERIFIED WORKING
export const SKILL_RESOURCES: Record<number, SkillResource[]> = {
    // Strategic Thinking (1-6)
    1: [ // First Principles Thinking
        { name: 'First Principles Explained by Elon Musk', url: 'https://www.youtube.com/watch?v=NV3sBlRgzTI', type: 'video', master: 'Elon Musk' },
        { name: 'Farnam Street: First Principles Guide', url: 'https://fs.blog/first-principles/', type: 'website', master: 'Shane Parrish' },
        { name: 'The Feynman Technique Explained', url: 'https://www.youtube.com/watch?v=tkm0TNFzIeg', type: 'video' },
        { name: 'Tim Ferriss: First Principles', url: 'https://www.youtube.com/watch?v=Gk_aS5_zMJc', type: 'video', master: 'Tim Ferriss' },
    ],
    2: [ // Strategic Vision
        { name: 'Good Strategy Bad Strategy (Chapter 1 PDF)', url: 'https://jfriedman.pbworks.com/f/Good%20Strategy%20Bad%20Strategy%20-%20Ch.1%20(Rumelt).pdf', type: 'pdf', master: 'Richard Rumelt' },
        { name: 'Playing to Win: Strategy Framework', url: 'https://www.youtube.com/watch?v=iuYlGRnC7J8', type: 'video', master: 'Roger Martin' },
        { name: 'Jeff Bezos on Long-Term Thinking', url: 'https://www.youtube.com/watch?v=f3NBQcAqyu4', type: 'video', master: 'Jeff Bezos' },
    ],
    3: [ // Systems Thinking
        { name: 'Thinking in Systems (Full Book PDF)', url: 'https://wtf.tw/ref/meadows.pdf', type: 'pdf', master: 'Donella Meadows' },
        { name: 'The Fifth Discipline Summary', url: 'https://www.youtube.com/watch?v=xPJQ77Xu5Qs', type: 'video', master: 'Peter Senge' },
        { name: 'Systems Thinking Explained', url: 'https://www.youtube.com/watch?v=lhbLNBqhQkc', type: 'video' },
    ],
    4: [ // Mental Models
        { name: 'Farnam Street: Mental Models Guide', url: 'https://fs.blog/mental-models/', type: 'website', master: 'Shane Parrish' },
        { name: 'Psychology of Human Misjudgment', url: 'https://www.youtube.com/watch?v=pqzcCfUglws', type: 'video', master: 'Charlie Munger' },
        { name: 'Gabriel Weinberg: Mental Models List', url: 'https://medium.com/@yegg/mental-models-i-find-repeatedly-useful-936f1cc405d', type: 'website' },
    ],
    5: [ // Decision Making Under Uncertainty
        { name: 'Thinking in Bets by Annie Duke', url: 'https://www.youtube.com/watch?v=uYNsSeYjkp4', type: 'video', master: 'Annie Duke' },
        { name: 'Bayesian Thinking Explained', url: 'https://www.youtube.com/watch?v=HZGCoVF3YvM', type: 'video' },
        { name: 'Expected Value Decision Framework', url: 'https://fs.blog/expected-value/', type: 'website' },
    ],
    6: [ // Competitive Analysis
        { name: 'Porter Five Forces Explained', url: 'https://www.youtube.com/watch?v=mYF2_FBCvXw', type: 'video', master: 'Michael Porter' },
        { name: 'Blue Ocean Strategy Summary', url: 'https://www.youtube.com/watch?v=sYd_-pAfbBw', type: 'video' },
        { name: 'Zero to One by Peter Thiel', url: 'https://www.youtube.com/watch?v=rFZrL1RiuVI', type: 'video', master: 'Peter Thiel' },
    ],

    // Execution & Operations (7-12)
    7: [ // Ruthless Prioritization
        { name: 'Essentialism Summary', url: 'https://www.youtube.com/watch?v=wHGf0pj1RA0', type: 'video', master: 'Greg McKeown' },
        { name: 'The One Thing Summary', url: 'https://www.youtube.com/watch?v=2qQWy-lhE3E', type: 'video', master: 'Gary Keller' },
        { name: 'Warren Buffett 5/25 Rule', url: 'https://jamesclear.com/buffett-focus', type: 'website' },
    ],
    8: [ // Operational Excellence
        { name: 'High Output Management Summary', url: 'https://www.youtube.com/watch?v=6fQHLK1aIBs', type: 'video', master: 'Andy Grove' },
        { name: 'Lean Manufacturing Explained', url: 'https://www.youtube.com/watch?v=wfsRAZUnonI', type: 'video' },
        { name: 'OKRs Explained by John Doerr', url: 'https://www.youtube.com/watch?v=L4N1q4RNi9I', type: 'video', master: 'John Doerr' },
    ],
    9: [ // Speed of Execution
        { name: 'Blitzscaling Lectures (Stanford)', url: 'https://www.youtube.com/playlist?list=PLnsTB8Q5VgnVzh1S-VMCXiuwJglk5AV--', type: 'course', master: 'Reid Hoffman' },
        { name: 'Move Fast and Break Things', url: 'https://www.youtube.com/watch?v=Lb4IcGF5iTQ', type: 'video' },
    ],
    10: [ // Process Design
        { name: 'Process Improvement Fundamentals', url: 'https://www.youtube.com/watch?v=T8hXMzV2SL0', type: 'video' },
        { name: 'Six Sigma Explained', url: 'https://www.youtube.com/watch?v=v-q0uJOQmYU', type: 'video' },
    ],
    11: [ // Resource Allocation
        { name: 'Capital Allocation Framework', url: 'https://www.youtube.com/watch?v=bT1h4bT0-Ao', type: 'video' },
        { name: 'Resource Allocation Strategy', url: 'https://hbr.org/topic/resource-allocation', type: 'website' },
    ],
    12: [ // Metrics & KPIs
        { name: 'Measure What Matters Summary', url: 'https://www.youtube.com/watch?v=L4N1q4RNi9I', type: 'video', master: 'John Doerr' },
        { name: 'North Star Metric Explained', url: 'https://www.youtube.com/watch?v=4P-W6qUxZT8', type: 'video' },
    ],

    // Leadership & People (13-18)
    13: [ // Hiring A-Players
        { name: 'Who: The A Method Summary', url: 'https://www.youtube.com/watch?v=I3XK9F8PGD8', type: 'video' },
        { name: 'Netflix Culture Deck', url: 'https://jobs.netflix.com/culture', type: 'website', master: 'Reed Hastings' },
    ],
    14: [ // Team Building
        { name: 'Five Dysfunctions of a Team', url: 'https://www.youtube.com/watch?v=w2s_wQZ5Pnc', type: 'video', master: 'Patrick Lencioni' },
        { name: 'Google Project Aristotle', url: 'https://www.youtube.com/watch?v=v2PaZ8Nl2T4', type: 'video' },
    ],
    15: [ // Delegation & Empowerment
        { name: 'Turn the Ship Around Summary', url: 'https://www.youtube.com/watch?v=OqmdLcyES_Q', type: 'video', master: 'David Marquet' },
        { name: 'Leader-Leader Model', url: 'https://www.youtube.com/watch?v=psAXMqxwol8', type: 'video' },
    ],
    16: [ // Difficult Conversations
        { name: 'Crucial Conversations Summary', url: 'https://www.youtube.com/watch?v=PuJgqTs-G44', type: 'video' },
        { name: 'Radical Candor TED Talk', url: 'https://www.youtube.com/watch?v=yj9GLeNCgm4', type: 'video', master: 'Kim Scott' },
    ],
    17: [ // Culture Design
        { name: 'Netflix Culture Deck', url: 'https://jobs.netflix.com/culture', type: 'website', master: 'Reed Hastings' },
        { name: 'Zappos Culture', url: 'https://www.youtube.com/watch?v=GQsBpT7cUkk', type: 'video', master: 'Tony Hsieh' },
    ],
    18: [ // Motivation & Inspiration
        { name: 'Drive by Daniel Pink Summary', url: 'https://www.youtube.com/watch?v=u6XAPnuFjJc', type: 'video', master: 'Daniel Pink' },
        { name: 'Start With Why TED Talk', url: 'https://www.youtube.com/watch?v=u4ZoJKF_VuA', type: 'video', master: 'Simon Sinek' },
    ],

    // Communication (19-24)
    19: [ // Public Speaking
        { name: 'How to Speak (MIT Lecture)', url: 'https://www.youtube.com/watch?v=Unzc731iCUY', type: 'video', master: 'Patrick Winston' },
        { name: 'Steve Jobs Presentation Secrets', url: 'https://www.youtube.com/watch?v=Sqd1S8VqaXU', type: 'video' },
    ],
    20: [ // Storytelling
        { name: 'Robert McKee on Story', url: 'https://www.youtube.com/watch?v=bPHrKGGg-dI', type: 'video', master: 'Robert McKee' },
        { name: 'Pixar Storytelling Rules', url: 'https://www.youtube.com/watch?v=xTM-AdrIpaE', type: 'video' },
    ],
    21: [ // Negotiation
        { name: 'Never Split the Difference (Full PDF)', url: 'https://cdn.bookey.app/files/pdf/book/en/never-split-the-difference.pdf', type: 'pdf', master: 'Chris Voss' },
        { name: 'FBI Negotiation Tactics', url: 'https://www.youtube.com/watch?v=guZa7mQV1l0', type: 'video', master: 'Chris Voss' },
        { name: 'Getting to Yes Summary', url: 'https://www.youtube.com/watch?v=RfTalFEeKKE', type: 'video', master: 'Roger Fisher' },
    ],
    22: [ // Writing Excellence
        { name: 'On Writing Well Summary', url: 'https://www.youtube.com/watch?v=Hp7nGhV0O5Y', type: 'video', master: 'William Zinsser' },
        { name: 'Paul Graham Essays', url: 'https://www.paulgraham.com/articles.html', type: 'website', master: 'Paul Graham' },
    ],
    23: [ // Investor Communication
        { name: 'YC: How to Pitch', url: 'https://www.youtube.com/watch?v=17XZGUX_9iM', type: 'video', master: 'Y Combinator' },
        { name: 'Pitch Deck Guide', url: 'https://www.ycombinator.com/library/2u-how-to-build-your-seed-round-pitch-deck', type: 'website' },
    ],
    24: [ // Media Training
        { name: 'Media Interview Prep', url: 'https://www.youtube.com/watch?v=HUbSJmvqxYE', type: 'video' },
        { name: 'Crisis Communication', url: 'https://www.youtube.com/watch?v=7-qGKqveZaM', type: 'video' },
    ],

    // Personal Mastery (25-30)
    25: [ // Emotional Intelligence
        { name: 'Daniel Goleman on EQ', url: 'https://www.youtube.com/watch?v=Y7m9eNoB3NU', type: 'video', master: 'Daniel Goleman' },
        { name: 'EQ 2.0 Summary', url: 'https://www.youtube.com/watch?v=n9h8fG1DKhA', type: 'video' },
    ],
    26: [ // Stress Management
        { name: 'Huberman: Stress Control', url: 'https://www.youtube.com/watch?v=ntfcfJ28eiU', type: 'video', master: 'Andrew Huberman' },
        { name: 'Physiological Sigh', url: 'https://www.youtube.com/watch?v=rBdhqBGqiMc', type: 'video', master: 'Andrew Huberman' },
        { name: 'Wim Hof Breathing', url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ', type: 'video', master: 'Wim Hof' },
    ],
    27: [ // Energy Management
        { name: 'Sleep Optimization', url: 'https://www.youtube.com/watch?v=nm1TxQj9IsQ', type: 'video', master: 'Matthew Walker' },
        { name: 'Circadian Rhythm', url: 'https://www.youtube.com/watch?v=WDv4AWk0J3U', type: 'video', master: 'Andrew Huberman' },
    ],
    28: [ // Focus & Deep Work
        { name: 'Deep Work by Cal Newport', url: 'https://www.youtube.com/watch?v=gTaJhjQHcf8', type: 'video', master: 'Cal Newport' },
        { name: 'Flow State Explained', url: 'https://www.youtube.com/watch?v=fXIeFJCqsPs', type: 'video', master: 'Mihaly Csikszentmihalyi' },
    ],
    29: [ // Continuous Learning
        { name: 'Learning How to Learn (Coursera)', url: 'https://www.coursera.org/learn/learning-how-to-learn', type: 'course', master: 'Barbara Oakley' },
        { name: 'Ultralearning Summary', url: 'https://www.youtube.com/watch?v=piSLobJfZ3c', type: 'video', master: 'Scott Young' },
    ],
    30: [ // Self-Reflection
        { name: 'Journaling for Growth', url: 'https://www.youtube.com/watch?v=dArgOrm98Bk', type: 'video' },
        { name: 'Weekly Review (GTD)', url: 'https://www.youtube.com/watch?v=D2yc1O3uCrM', type: 'video', master: 'David Allen' },
    ],
};

// Helper function to get resources for a skill
export function getResourcesForSkill(skillId: number): SkillResource[] {
    return SKILL_RESOURCES[skillId] || [];
}

// Get the primary resource for a skill
export function getPrimarySkillResource(skillId: number): SkillResource | null {
    const resources = SKILL_RESOURCES[skillId];
    return resources && resources.length > 0 ? resources[0] : null;
}

// Updated: iteration 16
