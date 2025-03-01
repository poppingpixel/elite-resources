// Elite Resource Library - Complete Data
// All resources curated by masters in their respective fields.
// Strictly maps every skill domain to a "Master" of that field.

export interface Resource {
    id: string;
    skill: string;
    master: string;
    bookOrCourse: string;
    freeResource: string;
    resourceUrl: string;
    why: string;
    category: string;
    resourceType: 'youtube' | 'website' | 'book' | 'pdf' | 'course';
}

export interface Category {
    id: string;
    name: string;
    emoji: string;
    color: string;
    description: string;
}

export const CATEGORIES: Category[] = [
    { id: 'all', name: 'All Resources', emoji: '✨', color: '#007AFF', description: 'View all resources' },
    { id: 'books', name: 'The Library', emoji: '📚', color: '#FF9500', description: 'All curated books & PDFs' },
    { id: 'ai', name: 'AI & Machine Learning', emoji: '🤖', color: '#007AFF', description: 'The Zero to 1 Master Plan' },
    { id: 'combat', name: 'Combat & Martial Arts', emoji: '🥋', color: '#FF3B30', description: 'Grappling, Striking & Lethality' },
    { id: 'weapons', name: 'Weapons & Tactics', emoji: '🎯', color: '#8E8E93', description: 'Firearms, Blades & Ballistics' },
    { id: 'stealth', name: 'Stealth & Espionage', emoji: '🕵️', color: '#1C1C1E', description: 'Surveillance, Entry & Cyber' },
    { id: 'intel', name: 'Intelligence & Memory', emoji: '🔍', color: '#34C759', description: 'OSINT, Analysis & Recall' },
    { id: 'mindset', name: 'Mindset & Psychology', emoji: '🧠', color: '#5856D6', description: 'Stoicism & Stress Control' },
    { id: 'survival', name: 'Survival Skills', emoji: '⚔️', color: '#34C759', description: 'Wilderness & Tactical Survival' },
    { id: 'polymath', name: 'Renaissance Skills', emoji: '🎭', color: '#AF52DE', description: 'Art, Forgery & Skills' },
    { id: 'seduction', name: 'Social Mastery', emoji: '✨', color: '#FF2D55', description: 'Influence, Charisma & Psychology' },
    { id: 'mastery', name: 'Physical Mastery', emoji: '💫', color: '#FF9500', description: 'Intimacy & Biological Mastery' },
    { id: 'ceo', name: 'CEO Mastery', emoji: '👑', color: '#D97706', description: 'Strategy & Leadership' },
];

const getResourceType = (url: string): 'youtube' | 'website' | 'book' | 'pdf' | 'course' => {
    const u = url.toLowerCase();
    if (u.includes('youtube') || u.includes('youtu.be')) return 'youtube';
    if (u.includes('.pdf')) return 'pdf';
    if (u.includes('coursera') || u.includes('udemy') || u.includes('edx') || u.includes('khan') || u.includes('course') || u.includes('stanford') || u.includes('mit') || u.includes('ocw')) return 'course';
    if (u.includes('gutenberg') || u.includes('archive.org') || u.includes('amazon') || u.includes('book')) return 'book';
    return 'website';
};

let resourceId = 0;
const createResource = (
    skill: string,
    master: string,
    bookOrCourse: string,
    freeResource: string,
    resourceUrl: string,
    why: string,
    category: string
): Resource => ({
    id: `resource-${++resourceId}`,
    skill,
    master,
    bookOrCourse,
    freeResource,
    resourceUrl,
    why,
    category,
    resourceType: getResourceType(resourceUrl),
});

export const RESOURCES: Resource[] = [
    // ═══════════════════════════════════════════════════════════════════════════════
    // AI & MACHINE LEARNING (The Zero to 1 Master Plan)
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Linear Algebra', 'Gilbert Strang (MIT)', 'Introduction to Linear Algebra', 'MIT 18.06 Linear Algebra (YouTube)', 'https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D', 'The "Teacher of Teachers." Deep Learning is just Linear Algebra at scale.', 'ai'),
    createResource('Probability & Optimization', 'Christopher Bishop', 'Pattern Recognition and ML', 'PDF Version (Official Microsoft)', 'https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf', 'The "Bible" of mathematical ML. Used by every top researcher.', 'ai'),
    createResource('Deep Learning Architecture', 'Yann LeCun', 'Deep Learning (NYU CDS)', 'Yann LeCun NYU Deep Learning Course', 'https://cds.nyu.edu/deep-learning/', 'LeCun invented the CNN. Learn directly from the source.', 'ai'),
    createResource('Deep Learning Theory', 'Ian Goodfellow / Y. Bengio', 'Deep Learning (The Book)', 'DeepLearningBook.org (Free HTML)', 'https://www.deeplearningbook.org/', 'The single most authoritative text in the field.', 'ai'),
    createResource('Large Language Models', 'Andrej Karpathy', 'Neural Networks: Zero to Hero', 'Karpathy GitHub & YouTube Series', 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhSvMB', 'He builds GPT from scratch in code. No "magic," just raw engineering.', 'ai'),
    createResource('LLM Scaling & Strategy', 'Ilya Sutskever', 'Ilya 30 Paper Reading List', 'The 30 Papers List (Annotated)', 'https://arc.net/folder/D0472A20-9C20-4D3F-8C45-56D60A0E1629', 'If you really learn all of these, you will know 90% of what matters.', 'ai'),
    createResource('Reinforcement Learning', 'David Silver', 'Reinforcement Learning (UCL)', 'UCL Course on RL (YouTube)', 'https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ', 'Silver led the team that beat the world champion at Go.', 'ai'),
    createResource('RL Foundations', 'Rich Sutton', 'Reinforcement Learning: An Introduction', 'Draft PDF (Official)', 'http://incompleteideas.net/book/the-book-2nd.html', 'The foundational text of the entire field.', 'ai'),
    createResource('Multimodal & Vision', 'Justin Johnson / Fei-Fei Li', 'CS231n: CNNs for Visual Recognition', 'Stanford CS231n (YouTube)', 'https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv', 'The "Gold Standard" university course.', 'ai'),
    createResource('Generative AI', 'Hugging Face Community', 'Hugging Face Diffusion Course', 'GitHub / Hugging Face Course', 'https://github.com/huggingface/diffusion-models-class', 'Practical, code-first mastery of Stable Diffusion.', 'ai'),
    createResource('Engineering & Systems', 'Jeff Dean', 'The Datacenter as a Computer', 'The Datacenter as a Computer (PDF)', 'https://research.google/pubs/pub35290/', 'Learn how to think at "Google Scale."', 'ai'),
    createResource('Hardware & Acceleration', 'Jeremy Howard', 'Practical Deep Learning for Coders', 'Part 2: Deep Learning from Foundations', 'https://course.fast.ai/', 'Teaches you how to write the backend of PyTorch.', 'ai'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // COMBAT & MARTIAL ARTS
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('BJJ (Joint Locks & Chokes)', 'John Danaher', 'New Wave Jiu Jitsu (BJJ Fanatics)', 'John Danaher: Mechanics of Jiu Jitsu', 'https://www.youtube.com/results?search_query=john+danaher+mechanics+jiu+jitsu', 'He explains the physics of why a limb breaks, not just "how" to do it.', 'combat'),
    createResource('Judo (Throws & Grip Fighting)', 'Jimmy Pedro', 'The American Judo System', 'Jimmy Pedro: Grip Fighting Concepts', 'https://www.youtube.com/results?search_query=jimmy+pedro+grip+fighting', 'Teaches how to control an opponent hands so they cannot draw a weapon or defend.', 'combat'),
    createResource('Krav Maga (Lethality)', 'Eyal Yanilov', 'Max Krav Maga Online', 'Krav Maga Global: Official Techniques', 'https://www.youtube.com/user/KravMagaGlobal', 'Focuses purely on "Dirty Fighting"—groin strikes, eye gouges, and weapon disarms.', 'combat'),
    createResource('Boxing (Head Movement)', 'Teddy Atlas', 'The World of Boxing', 'Teddy Atlas: Fight Breakdown & Analysis', 'https://www.youtube.com/results?search_query=teddy+atlas+fight+breakdown', 'Teaches "Peek-a-Boo" boxing—how to be unhittable.', 'combat'),
    createResource('Karate (Evasive Striking)', 'Lyoto Machida', 'Machida Virtual Dojo', 'Lyoto Machida: Karate for MMA', 'https://www.youtube.com/results?search_query=lyoto+machida+karate+mma', 'Proves traditional Karate footwork works in lethal cage fighting.', 'combat'),
    createResource('Vital Points (Dim-Mak)', 'Dr. Michael Kelly', 'Death Touch: The Science Behind The Legend', 'Kyusho Jitsu: Medical Analysis', 'https://www.youtube.com/results?search_query=kyusho+jitsu+medical+analysis', 'A medical doctor analyzes the Carotid Sinus and Vagus Nerve.', 'combat'),
    createResource('Kenjutsu (Combat Sword)', 'Risuke Otake', 'Katori Shinto-ryu Curriculum', 'Katori Shinto Ryu: Risuke Otake Demo', 'https://www.youtube.com/results?search_query=risuke+otake+katori+shinto+ryu', 'The Headmaster of the oldest samurai school demonstrates speed.', 'combat'),
    createResource('Iaijutsu (Lightning Draw)', 'Isao Machii', 'Modern Samurai', 'Isao Machii: World Record BB Cut', 'https://www.youtube.com/watch?v=Qzhs1Z8Rwnk', 'Holds the record for cutting a BB pellet in mid-air.', 'combat'),
    createResource('Dual Wielding (Niten Ichi)', 'Kajiya Takanori', 'Niten Ichi-ryu Seminars', 'Hyoho Niten Ichi Ryu: Official Channel', 'https://www.youtube.com/results?search_query=hyoho+niten+ichi+ryu', 'The 12th Headmaster of Musashi actual school demonstrates the "Cross Block".', 'combat'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // WEAPONS & TACTICS
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Pistol Mastery (Speed)', 'Jerry Miculek', 'Shoot Like A Pro', 'Jerry Miculek: How to Shoot Fast', 'https://www.youtube.com/user/MiculekDotCom', 'The fastest shooter of all time teaches grip and trigger control.', 'weapons'),
    createResource('Tactical Shooting (CQB)', 'Kyle Defoor', 'Defoor Proformance Shooting', 'Kyle Defoor: Pistol Standards & Drills', 'https://www.youtube.com/results?search_query=kyle+defoor+pistol+standards', 'The industry standard for "Combat Accuracy".', 'weapons'),
    createResource('Gun-Fu & Transition', 'Travis Haley', 'Haley Strategic D5 Handgun', 'Haley Strategic: Handgun Mechanics', 'https://www.youtube.com/user/HaleyStrategic', 'Teaches the biomechanics of shooting, reloading, and transitioning.', 'weapons'),
    createResource('Subsonic Ballistics', 'Silencer Shop', 'N/A (Hardware)', 'Subsonic vs Supersonic Ammo', 'https://www.youtube.com/results?search_query=subsonic+vs+supersonic+ammo', 'Explains why you must use heavy bullets for true silence.', 'weapons'),
    createResource('Edged Weapons (Kali)', 'Doug Marcaida', 'Marcaida Kali Online', 'Doug Marcaida Official', 'https://dougmarcaida.com/where-is-doug/', 'Teaches "Flow" with a blade and targeting arteries.', 'weapons'),
    createResource('Improvised Weapons', 'Tim Larkin', 'When Violence Is The Answer', 'Target Focus Training: Physics of Violence', 'https://www.youtube.com/results?search_query=tim+larkin+target+focus', 'Teaches how to use physics to destroy the human body with any object.', 'weapons'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // STEALTH & ESPIONAGE
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Target Acquisition (Stalk)', 'Peter Jenkins', 'Covert Surveillance Tradecraft', 'Surveillance Tradecraft (Book)', 'https://www.amazon.com/Surveillance-Tradecraft-Professional-Covert-Training/dp/1903579040', 'Standard procedure for the UK SRR on how to follow targets unseen.', 'stealth'),
    createResource('Surveillance Detection (SDR)', 'Scott Stewart', 'Stratfor Worldview', 'Stratfor: Art of Surveillance Detection', 'https://www.youtube.com/results?search_query=stratfor+surveillance+detection', 'Explains the "Cleaning Route"—how to verify you are not being followed.', 'stealth'),
    createResource('Silent Movement (Fox Walk)', 'Tom Brown Jr', 'The Science and Art of Tracking', 'Tom Brown Jr: Pressure Releases', 'https://www.youtube.com/results?search_query=tom+brown+jr+tracking', 'Teaches rolling the foot to feel for twigs before committing weight.', 'stealth'),
    createResource('Social Engineering', 'Christopher Hadnagy', 'Social Engineering: Human Hacking', 'The Social-Engineer Podcast', 'https://www.social-engineer.org/podcast/', 'Teaches "Pretexting"—how to clone a persona to bypass security.', 'stealth'),
    createResource('Disguise & Masks', 'Jonna Mendez', 'The Moscow Rules', 'Jonna Mendez: CIA Disguise Breakdown', 'https://www.jonnamendez.com/blog/news/wired-former-cia-chief-of-disguise-breaks-down-cold-war-spy-gadgets', 'Explains the "Semblance of Normalcy"—changing silhouette in 45 seconds.', 'stealth'),
    createResource('Lock Picking (Covert)', 'Deviant Ollam', 'Practical Lock Picking', 'Deviant Ollam: Elevator Hacking', 'https://www.youtube.com/results?search_query=deviant+ollam+lock+picking', 'Teaches "Non-Destructive Entry" that leaves zero forensic trace.', 'stealth'),
    createResource('Digital Cloning (RFID)', 'Iceman', 'Proxmark3 RDV4 Kit', 'Proxmark3: RFID Cloning Tutorial', 'https://www.youtube.com/results?search_query=proxmark3+rfid+cloning', 'Shows how to "clone" a secure access badge.', 'stealth'),
    createResource('Urban Evasion (Parkour)', 'Storror', 'Parkour Generations', 'STORROR: POV Parkour Escapes', 'https://www.youtube.com/user/StorrorBlog', 'Shows how to navigate rooftops and urban gaps realistically.', 'stealth'),
    createResource('Digital Dust (Timestomping)', 'Rob Lee', 'SANS FOR508', 'SANS: Timestomping Whitepaper', 'https://www.sans.org/white-papers/1122/', 'Teaches how to alter file creation dates to hide access.', 'stealth'),
    createResource('Steganography', 'Computerphile', 'N/A (Academic)', 'Computerphile: Steganography', 'https://www.youtube.com/watch?v=TWEXCYQKyDc', 'Explains hiding encrypted messages inside images.', 'stealth'),
    createResource('Identity Backstopping', 'Michael Bazzell', 'Extreme Privacy', 'The Privacy, Security, & OSINT Show', 'https://inteltechniques.com/podcast.html', 'The Bible of creating a "Legend"—fake history that passes background checks.', 'stealth'),
    createResource('Software Cracking', 'El Hacker', 'Cracking Manuals', 'ElHacker.info Archive', 'https://elhacker.info/manuales/Cracking/', 'Comprehensive archive of reverse engineering manuals.', 'stealth'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // INTELLIGENCE & MEMORY
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Digital Spying (OSINT)', 'Michael Bazzell', 'Open Source Intelligence Techniques', 'IntelTechniques: Free Online Tools', 'https://inteltechniques.com/tools/', 'The exact tools spies use to find home addresses from a username.', 'intel'),
    createResource('Technical Bugs', 'CIA (Office of Tech Service)', 'CIA Flaps and Seals Manual', 'CIA Flaps and Seals Manual (Archive.org)', 'https://archive.org/details/cia-flaps-and-seals', 'Teaches opening letters and planting bugs without leaving a trace.', 'intel'),
    createResource('Memory (Mind Palace)', 'Nelson Dellis', 'Remember It!', 'Nelson Dellis: Memory Palace Tutorial', 'https://www.youtube.com/results?search_query=nelson+dellis+memory+palace', 'Teaches how to memorize a deck of cards or room layout instantly.', 'intel'),
    createResource('Poisons (Toxicology)', 'Lewis Nelson, MD', 'Goldfrank Toxicologic Emergencies', 'Forensic Files: Thallium Cases', 'https://www.youtube.com/results?search_query=forensic+files+thallium', 'Watch Forensic Files to see which poisons are missed by coroners.', 'intel'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // MINDSET & PSYCHOLOGY
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Kill Psychology', 'Lt. Col. Dave Grossman', 'On Killing', 'Dave Grossman: Bulletproof Mind', 'https://www.youtube.com/results?search_query=dave+grossman+bulletproof+mind', 'Explains "Operant Conditioning"—bypassing human resistance to killing.', 'mindset'),
    createResource('Stress Inoculation', 'Andrew Huberman', 'Huberman Lab', 'Andrew Huberman: The Physiological Sigh', 'https://www.youtube.com/watch?v=rBdhqBGqiMc', 'Teaches the fastest way to lower heart rate to restore fine motor skills.', 'mindset'),
    createResource('Stoicism (Calm)', 'Marcus Aurelius', 'Meditations', 'The Daily Stoic', 'https://dailystoic.com/', 'The philosophy of "Unshakeable Calm" used by emperors and warriors.', 'mindset'),
    createResource('Pain Suppression', 'Wim Hof', 'The Wim Hof Method', 'Wim Hof Method: Guided Breathing', 'https://www.youtube.com/playlist?list=PLH85N50IXcES53UEDGQBAEokgcSyUzTVR', 'Breathing techniques to suppress pain response and survive extreme cold.', 'mindset'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // SURVIVAL SKILLS
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Wilderness Survival', 'Lofty Wiseman', 'SAS Survival Guide', 'Survivorman: Les Stroud Official', 'https://www.youtube.com/user/survivaborman', 'Focuses on the psychology of being alone and surviving with zero resources.', 'survival'),
    createResource('Tactical Driving', 'Team O Neil', '5-Day Rally Course', 'Team O Neil: Left Foot Braking', 'https://www.youtube.com/results?search_query=team+o+neil+rally+driving', 'Teaches physics of "Left Foot Braking" and J-Turns for escaping ambushes.', 'survival'),
    createResource('Combat Medicine (TCCC)', 'NAEMT', 'TCCC Certification', 'TCCC Guidelines (Allogy Books)', 'https://books.allogy.com/web/tenant/8/books/b729b76a-1a34-4bf7-b76b-66bb2072b2a7/', 'The military standard for treating gunshot wounds under fire.', 'survival'),
    createResource('Strategic Philosophy', 'Miyamoto Musashi', 'The Book of Five Rings', 'The Book of Five Rings (Project Gutenberg)', 'https://www.gutenberg.org/ebooks/7343', 'The original text on strategy, timing, and "The Void" by the undefeated duelist.', 'survival'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // RENAISSANCE SKILLS (The Polymath)
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Mad Art Skills', 'Charles Bargue', 'Charles Bargue Drawing Course', 'Full Book (PDF)', 'https://ia802907.us.archive.org/17/items/CharlesBargueDrawingCourse/Charles_Bargue_Drawing_Course_text.pdf', 'The gold standard for classical realism used by ateliers worldwide.', 'polymath'),
    createResource('Excellent Forger (Art Copying)', 'Eric Hebborn', 'The Art Forger Handbook', 'Google Arts & Culture: The Art Forger', 'https://artsandculture.google.com/story/YwUBYYizzwQHKQ', 'Pixel-level study of brushstrokes from masters.', 'polymath'),
    createResource('Extremely Resourceful', 'Tim Ferriss', 'The 4-Hour Chef (Meta-learning)', 'Tim Ferriss Blog: Art of Letting Bad Things Happen', 'https://tim.blog/', 'Focuses on "hacking" problems and deconstructing skills rapidly.', 'polymath'),

    createResource('Speaks 8 Languages', 'Benny Lewis / Michel Thomas', 'Fluent in 3 Months', 'FSI Language Courses (Public Domain)', 'https://www.fsi-language-courses.org/', 'The FSI courses are what US diplomats use.', 'polymath'),
    createResource('Great Pick-pocketer', 'Apollo Robbins', 'Whizmob Inc.', 'Apollo Robbins TED Talk: Art of Misdirection', 'https://www.youtube.com/watch?v=GZGY0wPAnus', 'Robbins is the world leading expert on theatrical theft.', 'polymath'),
    createResource('Safe Cracking', 'Richard Feynman', 'Surely You Joking, Mr. Feynman!', 'MIT Guide to Lock Picking (HTML)', 'https://www.lysator.liu.se/mit-guide/mit-guide.html', 'Feynman famously cracked safes at Los Alamos using psychology and math.', 'polymath'),
    createResource('Great Sleight of Hand', 'Dai Vernon', 'The Royal Road to Card Magic', 'YouTube: 52Kards Channel', 'https://www.youtube.com/user/DecksAndContests', 'Vernon fooled Houdini. Royal Road is the bible of card manipulation.', 'polymath'),
    createResource('Human Calculator', 'Arthur Benjamin', 'Secrets of Mental Math', 'Arthur Benjamin TED Talk', 'https://www.youtube.com/watch?v=e4PTvXtz4GM', 'Teaches algorithms to do 3-digit multiplication in your head.', 'polymath'),
    createResource('Alias Savant (Impersonation)', 'Frank Abagnale', 'Catch Me If You Can', 'Talks at Google: Frank Abagnale', 'https://www.youtube.com/watch?v=vsMydMDi3rI', 'Learn the psychology of the "confidence man".', 'polymath'),
    createResource('Adrenaline Junkie (Fear)', 'Alex Honnold', 'Alone on the Wall', 'Free Solo (Documentary Excerpts)', 'https://www.youtube.com/results?search_query=free+solo+alex+honnold', 'Teaches suppression of the amygdala response.', 'polymath'),
    createResource('Super Fit / Swimming', 'Michael Phelps / Navy SEALs', 'No Limits: The Will to Succeed', 'Darebee.com', 'https://darebee.com/', 'Free, high-quality, no-equipment workout plans.', 'polymath'),
    createResource('Great Actor', 'Konstantin Stanislavski', 'An Actor Prepares', 'Full Book (PDF)', 'https://cdn.bookey.app/files/pdf/book/en/an-actor-prepares.pdf', 'The foundation of "Method" acting.', 'polymath'),
    createResource('Great at Pool', 'Dr. Dave Alciatore', 'The Illustrated Principles of Pool', 'YouTube: DrDaveBilliards', 'https://www.youtube.com/user/DrDaveBilliards', 'Physics-based approach to billiards.', 'polymath'),
    createResource('Great Driver', 'Ben Collins (The Stig)', 'How to Drive: Real World Survival', 'Team O Neil Rally School', 'https://www.youtube.com/results?search_query=team+oneil+rally', 'Teaches car control, drifting, and limit handling.', 'polymath'),
    createResource('Poker / Card Games', 'Doyle Brunson', 'Super/System', 'PokerStars School', 'https://www.pokerstars.com/poker/school/', 'Brunson book is the bible of aggressive poker.', 'polymath'),

    createResource('Charm / Charisma', 'Dale Carnegie', 'How to Win Friends and Influence People', 'Farnam Street: Carnegie Summary', 'https://fs.blog/how-to-win-friends-and-influence-people/', 'Timeless manual on making people love you.', 'polymath'),
    createResource('Passable ID Cards (Graphics)', 'Massimo Vignelli', 'The Vignelli Canon', 'Full Book (PDF)', 'https://www.rit.edu/vignellicenter/sites/rit.edu.vignellicenter/files/documents/The%20Vignelli%20Canon.pdf', 'Typography and layout precision for high-end design.', 'polymath'),
    createResource('Identify Forged Paintings', 'Thomas Hoving', 'False Impressions: Art Fakes', 'Full Book (PDF)', 'https://archive.org/details/falseimpressions00thom', 'Hoving was legendary for spotting fakes "The Hoving Eye".', 'polymath'),
    createResource('Identify Counterfeit Money', 'US Secret Service', 'Know Your Money', 'US Secret Service: Know Your Money (PDF)', 'https://www.secretservice.gov/investigation/counterfeit', 'Official guide on intaglio printing, watermarks, and security fibers.', 'polymath'),
    createResource('Pick Handcuffs / Escapology', 'Harry Houdini', 'Houdini on Magic', 'YouTube: The Lockpicking Lawyer', 'https://www.youtube.com/c/lockpickinglawyer', 'Demonstrates mechanical weaknesses of almost all restraints.', 'polymath'),
    createResource('Sing Amazingly', 'Luciano Pavarotti', 'Set Your Voice Free (Roger Love)', 'YouTube: New York Vocal Coaching', 'https://www.youtube.com/user/NewYorkVocalCoaching', 'Justin Stoney offers pro-grade techniques for free.', 'polymath'),
    createResource('Dance', 'Fred Astaire', 'Fred Astaire Dance Studio', 'YouTube: Passion4Dancing', 'https://www.youtube.com/user/Passion4dancing', 'Clear breakdown of ballroom basics.', 'polymath'),
    createResource('Fence', 'Aldo Nadi', 'Nadi on Fencing', 'YouTube: The Fencing Channel (FIE)', 'https://www.youtube.com/results?search_query=fencing+channel+fie', 'Nadi was arguably the greatest fencer of all time.', 'polymath'),
    createResource('Buttle (Service)', 'Steven Ferry', 'Butlers & Household Managers', 'Gentleman Gazette (YouTube)', 'https://www.youtube.com/c/GentlemansGazette', 'Covers etiquette and service standards.', 'polymath'),
    createResource('Origami', 'Akira Yoshizawa', 'Creative Origami', 'YouTube: Jo Nakashima', 'https://www.youtube.com/user/jonakashima', 'Yoshizawa created the notation system used today.', 'polymath'),
    createResource('Build NY Skyline (Sculpting)', 'Ray Villafane', 'Sand Sculpting 101', 'YouTube: SandCastles 101', 'https://www.youtube.com/results?search_query=sand+sculpting+101', 'Water-to-sand ratios and "pancaking" techniques.', 'polymath'),
    createResource('Use a Gun (Marksmanship)', 'Jeff Cooper', 'The Art of the Rifle', 'YouTube: Warrior Poet Society', 'https://www.youtube.com/c/WarriorPoetSociety', 'Focuses on safety, stance, and defensive mindset.', 'polymath'),
    createResource('Box', 'Jack Dempsey', 'Championship Fighting', 'YouTube: Precision Striking', 'https://www.youtube.com/user/PrecisionStriking', 'The bible of power generation (The Falling Step).', 'polymath'),
    createResource('Knowledge: Art / Antiquities', 'E.H. Gombrich', 'The Story of Art', 'Smarthistory (Khan Academy)', 'https://smarthistory.org/', 'The most widely read art history book.', 'polymath'),
    createResource('Cook (Chef Level)', 'Auguste Escoffier', 'Le Guide Culinaire', 'YouTube: French Cooking Academy', 'https://www.youtube.com/c/FrenchCookingAcademy', 'Escoffier codified French cuisine.', 'polymath'),
    createResource('Mixology (Bartending)', 'Jerry Thomas', 'The Bar-Tender Guide', 'YouTube: How to Drink', 'https://www.youtube.com/c/HowToDrink', 'Thomas is the father of American mixology.', 'polymath'),
    createResource('Wine (Sommelier)', 'Jancis Robinson', 'The Oxford Companion to Wine', 'Wine Folly Guides', 'https://winefolly.com/guides/', 'Wine Folly turns complex oenology into visual charts.', 'polymath'),
    createResource('Haute Couture', 'Christian Dior', 'The Little Dictionary of Fashion', 'YouTube: V&A Museum', 'https://www.youtube.com/user/vaabormuseum', 'V&A has the best archives of fashion construction.', 'polymath'),
    createResource('Music / Musical Instruments', 'Leonard Bernstein', 'The Joy of Music', 'Coursera: Fundamentals of Music Theory', 'https://www.coursera.org/learn/edinburgh-music-theory', 'Bernstein explains the "why" of music.', 'polymath'),
    createResource('Disarm Bombs (Chemistry)', 'Alfred Nobel', 'Chemistry: The Central Science', 'MIT OCW: Chemistry Courses', 'https://ocw.mit.edu/search/?d=Chemistry&s=department_course_numbers.sort_coursenum', 'To disarm, you must understand chemical bonds first.', 'polymath'),
    createResource('History', 'Will Durant', 'The Story of Civilization', 'Hardcore History (Dan Carlin)', 'https://www.dancarlin.com/hardcore-history-series/', 'Dan Carlin makes history visceral and memorable.', 'polymath'),
    createResource('Philosophy', 'Plato / Marcus Aurelius', 'Meditations', 'Stanford Encyclopedia of Philosophy', 'https://plato.stanford.edu/', 'The most rigorous, peer-reviewed free philosophy resource.', 'polymath'),
    createResource('Law', 'Blackstone', 'Blackstone Commentaries', 'Harvard Law: H2O Open Casebooks', 'https://h2o.law.harvard.edu/', 'Read actual case law.', 'polymath'),
    createResource('Politics', 'Machiavelli', 'The Prince', 'YouTube: Yale Courses Power and Politics', 'https://www.youtube.com/results?search_query=yale+power+politics', 'Machiavelli is essential for the darker arts of politics.', 'polymath'),
    createResource('Economics', 'Adam Smith', 'The Wealth of Nations', 'Full Book (PDF)', 'https://www.rrojasdatabank.info/Wealth-Nations.pdf', 'Run by top economists covering micro and macro.', 'polymath'),
    createResource('Marketing', 'Seth Godin', 'This Is Marketing', 'HubSpot Academy', 'https://academy.hubspot.com/', 'Godin is the master of "permission marketing".', 'polymath'),
    createResource('Management', 'Peter Drucker', 'The Effective Executive', 'MIT OpenCourseWare: Management', 'https://ocw.mit.edu/courses/sloan-school-of-management/', 'Drucker invented modern management.', 'polymath'),
    createResource('English Literature', 'Harold Bloom', 'The Western Canon', 'Project Gutenberg', 'https://www.gutenberg.org/', 'Access all the classics for free.', 'polymath'),
    createResource('Mechanics', 'J.E. Gordon', 'Structures: Or Why Things Don Fall Down', 'YouTube: The Engineering Mindset', 'https://www.youtube.com/c/Theengineeringmindset', 'Gordon book is a classic on how physical forces work.', 'polymath'),
    createResource('Electrical Engineering', 'Nikola Tesla', 'The Art of Electronics (Horowitz)', 'Khan Academy: Electrical Engineering', 'https://www.khanacademy.org/science/electrical-engineering', 'Horowitz is the industry standard text.', 'polymath'),
    createResource('Cars (Automotive)', 'Enzo Ferrari', 'Bosch Automotive Handbook', 'YouTube: Engineering Explained', 'https://www.youtube.com/user/EngineeringExplained', 'Jason Fenske breaks down combustion, aero, and suspension.', 'polymath'),
    createResource('Chemistry / Biochemistry', 'Linus Pauling', 'General Chemistry', 'Khan Academy: Chemistry', 'https://www.khanacademy.org/science/chemistry', 'Pauling is the only person to win two unshared Nobel Prizes.', 'polymath'),
    createResource('Architecture', 'Le Corbusier', 'Towards a New Architecture', 'ArchDaily', 'https://www.archdaily.com/', 'The world most visited architecture website.', 'polymath'),
    createResource('Science (General)', 'Carl Sagan', 'The Demon-Haunted World', 'Feynman Lectures on Physics (Caltech)', 'https://www.feynmanlectures.caltech.edu/', 'Feynman teaches the laws of the universe.', 'polymath'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // SOCIAL MASTERY (The Seducer)
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Visual Anchor (Micro-Expressions)', 'Paul Ekman', 'Emotions Revealed', 'Paul Ekman Group: Micro-Expressions', 'https://www.paulekman.com/resources/micro-expressions/', 'Ekman mapped every facial muscle movement humans can make.', 'seduction'),
    createResource('The Triangular Gaze', 'Leil Lowndes', 'How to Talk to Anyone', 'Full Book (PDF)', 'https://cdn.bookey.app/files/pdf/book/en/how-to-talk-to-anyone.pdf', 'Subconscious effects of eye movement on intimacy.', 'seduction'),
    createResource('Copulatory Gaze (Pupil Dilation)', 'Eckhard Hess', 'The Telltale Eye', 'ScienceDirect: Pupillometry', 'https://www.sciencedirect.com/topics/medicine-and-dentistry/pupillometry', 'Hess discovered that pupil dilation is the most accurate signal.', 'seduction'),
    createResource('The Slow Blink', 'Michael Caine', 'Acting in Film', 'Full Book (PDF)', 'https://archive.org/details/actinginfilmacto0000cain', 'Caine teaches how not blinking conveys absolute power.', 'seduction'),
    createResource('Visual Peacocking / Sprezzatura', 'Baldassare Castiglione', 'The Book of the Courtier', 'Full Book (PDF)', 'https://resources.warburg.sas.ac.uk/pdf/enh660b2449259.pdf', 'Castiglione invented Sprezzatura in 1528 - studied carelessness.', 'seduction'),
    createResource('Non-Verbal Dominance (Posture)', 'Joe Navarro', 'The Dictionary of Body Language', 'YouTube: Joe Navarro for WIRED', 'https://www.youtube.com/watch?v=4jwUXV4QaTw', 'Explains "territorial displays" as hard-wired primate signals.', 'seduction'),
    createResource('The Pivot Rule', 'Erik von Markovik (Mystery)', 'The Mystery Method', 'Full Book (PDF)', 'https://ia800204.us.archive.org/28/items/2ndmysteryerikvonmarkoviktheoriginalmysterymethodvenusianartshandbook2ndedition_201907/(2nd)%20Mystery%20Erik%20Von%20Markovik%20-%20The%20Original%20Mystery%20Method%20_%20Venusian%20Arts%20Handbook%202nd%20Edition.pdf', 'Codified "protecting your value" by turning body away while speaking.', 'seduction'),
    createResource('Tactile Escalation (Kino)', 'Vin DiCarlo', 'The DiCarlo Escalation Ladder', 'Google PDF: DiCarlo Escalation Ladder', 'https://www.google.com/search?q=dicarlo+escalation+ladder+pdf', 'The definitive guide on precise timing of touch.', 'seduction'),
    createResource('Voice of God (Resonance)', 'Roger Love', 'Set Your Voice Free', 'YouTube: Roger Love Speaking Voice Tips', 'https://www.youtube.com/results?search_query=roger+love+speaking+voice', 'Love teaches Tony Robbins and Bradley Cooper how to use "chest voice".', 'seduction'),
    createResource('Controlled Tempo', 'Robert Greene', 'The 48 Laws of Power (Law 4)', 'YouTube: Robert Greene Always Say Less', 'https://www.youtube.com/results?search_query=robert+greene+say+less', 'Speaking slowly signals authority.', 'seduction'),
    createResource('The Power of the Pause', 'Chris Voss', 'Never Split the Difference', 'YouTube: Chris Voss Effective Pauses', 'https://www.youtube.com/results?search_query=chris+voss+pauses', 'Voss uses "effective pauses" in life-or-death situations.', 'seduction'),
    createResource('Cold Reading (Barnum)', 'Ian Rowland', 'The Full Facts Book of Cold Reading', 'Full Book (PDF)', 'https://cdn.bookey.app/files/pdf/book/en/the-full-facts-book-of-cold-reading.pdf', 'Rowland is the authority used by FBI and magicians.', 'seduction'),
    createResource('Push-Pull Technique', 'Robert Greene', 'The Art of Seduction', 'Full Book (PDF)', 'https://cdn.bookey.app/files/pdf/book/en/the-art-of-seduction.pdf', 'Explains alternating hot/cold behavior to create addiction.', 'seduction'),
    createResource('Social Dynamics / Pre-Selection', 'Dr. David Buss', 'The Evolution of Desire', 'Google Scholar: Mate Choice Copying', 'https://scholar.google.com/scholar?q=mate+choice+copying', 'Buss is the No. 1 academic on why women value pre-selected men.', 'seduction'),
    createResource('Social Proof (Environment)', 'Robert Cialdini', 'Influence: The Psychology of Persuasion', 'Fs.blog: Social Proof Summary', 'https://fs.blog/influence-psychology-persuasion/', 'Cialdini coined the term "Social Proof".', 'seduction'),
    createResource('The Rake Psychology', 'Robert Greene', 'The Art of Seduction (The Rake)', 'YouTube: Robert Greene The Rake Analysis', 'https://www.youtube.com/results?search_query=robert+greene+the+rake', 'Defines the archetype that offers danger and short-term intensity.', 'seduction'),
    createResource('Total Insouciance (Outcome Independence)', 'Seneca / Marcus Aurelius', 'Letters from a Stoic', 'DailyStoic.com', 'https://dailystoic.com/', 'The origin of "not caring about the outcome".', 'seduction'),
    createResource('Emotional Contagion', 'Daniel Goleman', 'Social Intelligence', 'HBR: Social Intelligence and Biology of Leadership', 'https://hbr.org/2006/09/social-intelligence-and-the-biology-of-leadership', 'Goleman explains the "Mirror Neuron" system.', 'seduction'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHYSICAL MASTERY (Sexual Mastery)
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Biological Mastery (Clitoral Literacy)', 'Ian Kerner, PhD', 'She Comes First', 'HarperCollins: She Comes First Excerpts', 'https://www.harpercollins.com/', 'Kerner is the undisputed authority that the clitoris is the center.', 'mastery'),
    createResource('Coital Alignment Technique (CAT)', 'Edward Eichel', 'The Perfect Fit', 'Healthline: How to Do CAT', 'https://www.healthline.com/health/healthy-sex/coital-alignment-technique', 'Eichel medically codified this technique.', 'mastery'),
    createResource('The Kivin Method (Oral)', 'Dr. Lindsey Doe', 'Sexplanations', 'YouTube: Sexplanations Cunnilingus', 'https://www.youtube.com/user/sexplanations', 'Dr. Doe provides clinical, shame-free breakdowns.', 'mastery'),
    createResource('Dual-Focus Attention (Bridging)', 'Dr. Laurie Mintz', 'Becoming Cliterate', 'TEDx: The Orgasm Gap - Dr. Laurie Mintz', 'https://www.youtube.com/results?search_query=laurie+mintz+orgasm+gap', 'Mintz proves "bridging" is required for over 70% of women.', 'mastery'),
    createResource('Come Hither Motion (G-Spot)', 'Dr. Beverly Whipple', 'The G Spot and Other Discoveries', 'YouTube: Sex with Emily G-Spot', 'https://www.youtube.com/results?search_query=sex+with+emily+g+spot', 'Whipple literally co-coined the term "G-Spot".', 'mastery'),
    createResource('Rhythmic Discipline', 'Mantak Chia', 'The Multi-Orgasmic Man', 'Mantak Chia Official YouTube', 'https://www.youtube.com/results?search_query=mantak+chia+sexual+energy', 'Taoist practices focus on controlling rhythm and delaying ejaculation.', 'mastery'),
    createResource('Feather-to-Firm Calibration', 'Betty Dodson, PhD', 'Sex for One', 'Dodsonandross.com', 'https://www.dodsonandross.com/', 'Dodson taught thousands that pressure calibration is more important than speed.', 'mastery'),
    createResource('Angulation (Lazy Dog)', 'Vatsyayana', 'The Kama Sutra (Modern Translation)', 'KamaSutra.org (Educational Archive)', 'http://www.kamasutra.org/', 'The original source of all angulation geometry.', 'mastery'),
    createResource('Proprioceptive Feedback (Prone Bone)', 'Dr. Emily Morse', 'Hot Sex: Over 200 Things You Can Try', 'YouTube: Sex with Emily', 'https://www.youtube.com/user/SexWithEmily', 'Morse explains the psychology of "fullness".', 'mastery'),
    createResource('The Deck Chair (V-Shape)', 'Anne Hooper', 'Kama Sutra for 21st Century Lovers', 'NetDoctor: Best Sex Positions', 'https://www.netdoctor.co.uk/', 'Hooper illustrated how leg position alters vaginal depth.', 'mastery'),
    createResource('Trance Induction (The Voice)', 'David Deida', 'The Way of the Superior Man', 'YouTube: David Deida Art of Polarity', 'https://www.youtube.com/results?search_query=david+deida+polarity', 'Deida teaches how masculine vocal resonance creates safety.', 'mastery'),
    createResource('Anticipatory Anxiety (Teasing)', 'Esther Perel', 'Mating in Captivity', 'YouTube: Esther Perel Secret to Desire', 'https://www.youtube.com/watch?v=sa0RUmGTCYY', 'Perel explains that desire creates anxiety tension.', 'mastery'),
    createResource('Aftercare & Emotional Safety', 'Dr. Emily Nagoski', 'Come As You Are', 'TED Talk: Truth About Unwanted Arousal', 'https://www.ted.com/talks/emily_nagoski_the_truth_about_unwanted_arousal', 'Nagoski explains "Completion of the Stress Cycle".', 'mastery'),
    createResource('Alphabet Technique', 'Dr. Ruth Westheimer', 'Dr. Ruth Encyclopedia of Sex', 'YouTube: Dr. Ruth Advice Archives', 'https://www.youtube.com/results?search_query=dr+ruth', 'The "Alphabet" is a classic technique popularized by Dr. Ruth.', 'mastery'),
    createResource('Suction vs Licking', 'OMGYes', 'OMGYes.com (The Pleasure Report)', 'NPR: The Science of Female Pleasure', 'https://www.npr.org/sections/health-shots/', 'OMGYes scientifically proved suction beats friction.', 'mastery'),
    createResource('The Sensory Map (Foreplay)', 'Helen Singer Kaplan', 'The New Sex Therapy', 'Psychology Today: Sensate Focus', 'https://www.psychologytoday.com/us/therapy-types/sensate-focus-therapy', 'Kaplan developed "Sensate Focus" for mapping non-genital pleasure zones.', 'mastery'),
    createResource('The Perineum', 'Dr. Tristan Taormino', 'The Ultimate Guide to Anal Sex for Women', 'Healthline: Guide to the Perineum', 'https://www.healthline.com/', 'Taormino is the expert on nerve density of the pelvic floor.', 'mastery'),
    createResource('Scalp & Ears (ASMR)', 'Jennifer Allen', 'Brain Tingles', 'YouTube: Gibi ASMR', 'https://www.youtube.com/c/GibiASMR', 'Allen and ASMR community mastered neurology of scalp/ear stimulation.', 'mastery'),
    createResource('Inner Thighs (Proximity Tension)', 'Robert Greene', 'The Art of Seduction', 'YouTube: Art of Seduction The Siren', 'https://www.youtube.com/results?search_query=art+of+seduction+siren', 'Greene discusses power of "hovering" near a target.', 'mastery'),
    createResource('The Assisted Missionary', 'Lou Paget', 'The Great Lover Playbook', 'Cosmopolitan: Coital Alignment Guide', 'https://www.cosmopolitan.com/', 'Paget focuses on "hand skills" during intercourse.', 'mastery'),
    createResource('Vocal Command', 'David Deida', 'The Way of the Superior Man', 'YouTube: Deida Masculinity', 'https://www.youtube.com/results?search_query=david+deida+masculinity', 'Deida provides philosophy on "Directive Masculinity".', 'mastery'),
    createResource('Eye Contact (The Finish)', 'Michael Ellsberg', 'The Power of Eye Contact', 'Psychology Today: Eye Contact and Intimacy', 'https://www.psychologytoday.com/us/blog/the-power-eye-contact', 'Ellsberg explains how maintaining gaze spikes oxytocin.', 'mastery'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // CEO MASTERY (Strategy, Mental Models, Systems) - With Working PDFs
    // ═══════════════════════════════════════════════════════════════════════════════
    createResource('Strategic Thinking', 'Richard Rumelt', 'Good Strategy Bad Strategy', 'Chapter 1 PDF (Stanford)', 'https://jfriedman.pbworks.com/f/Good%20Strategy%20Bad%20Strategy%20-%20Ch.1%20(Rumelt).pdf', 'The definitive guide to diagnosing problems and guiding policies.', 'ceo'),
    createResource('Decision Making & Cognitive Psychology', 'Daniel Kahneman', 'Thinking Fast and Slow', 'Summary PDF (Official)', 'https://paulminors.com/wp-content/uploads/2022/01/Thinking-Fast-and-Slow-Book-Summary-PDF.pdf', 'Topics: Biases, heuristics, mental models.', 'ceo'),
    createResource('Leadership & Emotional Intelligence', 'Kim Scott', 'Radical Candor', 'TED Talk: Radical Candor', 'https://www.youtube.com/watch?v=yj9GLeNCgm4', 'Managing up/down, team dynamics.', 'ceo'),
    createResource('Systems Thinking', 'Donella Meadows', 'Thinking in Systems', 'Full Book (PDF)', 'https://wtf.tw/ref/meadows.pdf', 'Feedback loops, leverage points, emergence.', 'ceo'),
    createResource('Business Models', 'Alexander Osterwalder', 'Business Model Generation', 'Business Model Canvas (Free)', 'https://www.strategyzer.com/canvas/business-model-canvas', 'Value creation, revenue streams, distribution.', 'ceo'),
    createResource('Negotiation & Sales', 'Chris Voss', 'Never Split the Difference', 'Full Book (PDF)', 'https://cdn.bookey.app/files/pdf/book/en/never-split-the-difference.pdf', 'Win critical conversations with tactical empathy.', 'ceo'),
    createResource('First Principles', 'Elon Musk / Shane Parrish', 'First Principles Thinking', 'Farnam Street Article', 'https://fs.blog/first-principles/', 'Break down complex problems to fundamental truths.', 'ceo'),
    createResource('Mental Models', 'Charlie Munger', 'Poor Charlies Almanack', 'Farnam Street: Mental Models', 'https://fs.blog/mental-models/', 'Apply 80+ mental models fluently from Munger.', 'ceo'),
    createResource('High Output Management', 'Andy Grove', 'High Output Management', 'Full Book Summary', 'https://www.youtube.com/watch?v=6fQHLK1aIBs', 'OKRs, leverage, production principle, meetings.', 'ceo'),
    createResource('Execution Excellence', 'Patrick Lencioni', 'The Five Dysfunctions of a Team', 'Full Summary Video', 'https://www.youtube.com/watch?v=w2s_wQZ5Pnc', 'Trust, conflict, commitment, accountability, results.', 'ceo'),
    createResource('Stoic Wisdom', 'Seneca', 'Letters from a Stoic', 'Full Book (PDF)', 'https://ia601500.us.archive.org/10/items/in.ernet.dli.2015.65471/2015.65471.Letters-From-A-Stoic_text.pdf', 'The origin of "not caring about the outcome".', 'mindset'),
    createResource('Polymath Notebooks', 'Leonardo da Vinci', 'The Complete Notebooks', 'Full Book (PDF)', 'https://www.holybooks.com/wp-content/uploads/The-Complete-Works-of-Leonardo-Da-Vinci.pdf', 'The unedited notes of history greatest genius.', 'polymath'),

    // ═══════════════════════════════════════════════════════════════════════════════
    // THE LIBRARY - All 40 Roadmap Books with PDFs
    // ═══════════════════════════════════════════════════════════════════════════════
    // TIER 1: Foundation (Critical)
    createResource('Deep Learning Theory', 'Ian Goodfellow', 'Deep Learning (The Book)', 'Full Book Online (Free)', 'https://www.deeplearningbook.org/', 'The most authoritative deep learning text. 800 pages of foundations.', 'books'),
    createResource('RL Foundations', 'Richard Sutton', 'Reinforcement Learning: An Introduction', 'Full Book (Free PDF)', 'http://incompleteideas.net/book/the-book-2nd.html', 'The foundational text of the entire RL field. Free from author.', 'books'),
    createResource('Probability Theory', 'William Feller', 'An Introduction to Probability Theory Vol 1', 'Probability Course (Free)', 'https://www.probabilitycourse.com/', 'Probability fundamentals, random variables, limit theorems.', 'books'),
    createResource('Advanced Probability', 'William Feller', 'An Introduction to Probability Theory Vol 2', 'Probability Course (Free)', 'https://www.probabilitycourse.com/', 'Advanced probability and stochastic processes.', 'books'),
    createResource('CEO Management', 'Andy Grove', 'High Output Management', 'Summary Video', 'https://www.youtube.com/watch?v=6fQHLK1aIBs', 'OKRs, leverage, production principle, meetings.', 'books'),

    // TIER 2: Advanced Theory
    createResource('Quantitative Finance I', 'Steven Shreve', 'Stochastic Calculus for Finance I', 'MIT OCW Finance', 'https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/', 'Binomial model, risk-neutral pricing, discrete finance.', 'books'),
    createResource('Quantitative Finance II', 'Steven Shreve', 'Stochastic Calculus for Finance II', 'MIT OCW Finance', 'https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/', 'Continuous-time finance, Black-Scholes, Itô calculus.', 'books'),
    createResource('Derivatives', 'John Hull', 'Options, Futures, and Other Derivatives', 'Hull Book Slides', 'https://www-2.rotman.utoronto.ca/~hull/ofodslides/index.html', 'Derivatives pricing, risk management, Black-Scholes.', 'books'),
    createResource('Statistical Learning', 'Hastie/Tibshirani', 'The Elements of Statistical Learning', 'Full Book (Free PDF)', 'https://hastie.su.domains/ElemStatLearn/ElemStatLearn_print12.pdf', 'Statistical learning theory, regularization, ensemble methods.', 'books'),
    createResource('Pattern Recognition', 'Christopher Bishop', 'Pattern Recognition and Machine Learning', 'Full Book (Free PDF)', 'https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf', 'Bayesian methods, graphical models, neural networks.', 'books'),
    createResource('Software Craft', 'David Thomas', 'The Pragmatic Programmer', 'Summary Guide', 'https://www.youtube.com/watch?v=DJtef410XaM', 'Software craft and best practices.', 'books'),
    createResource('Code Quality', 'Robert Martin', 'Clean Code', 'Clean Code Summary', 'https://www.youtube.com/watch?v=7EmboKQH8lM', 'Code quality and refactoring principles.', 'books'),

    // TIER 3: Execution & Performance
    createResource('Deep Focus', 'Cal Newport', 'Deep Work', 'TED Talk Summary', 'https://www.youtube.com/watch?v=gTaJhjQHcf8', 'Focus, distraction elimination, high-value work.', 'books'),
    createResource('Habit Formation', 'James Clear', 'Atomic Habits', 'Summary Video', 'https://www.youtube.com/watch?v=YT7tQzmGRLA', 'Habit formation, 1% improvement, systems over goals.', 'books'),
    createResource('Perseverance', 'Angela Duckworth', 'Grit', 'TED Talk', 'https://www.youtube.com/watch?v=H14bBuluwB8', 'Passion + perseverance, deliberate practice.', 'books'),
    createResource('Sleep Science', 'Matthew Walker', 'Why We Sleep', 'Summary Video', 'https://www.youtube.com/watch?v=5MuIMqhT8DM', 'Sleep science, cognitive performance, recovery.', 'books'),
    createResource('Decision Making', 'Daniel Kahneman', 'Thinking Fast and Slow', 'Summary PDF', 'https://paulminors.com/wp-content/uploads/2022/01/Thinking-Fast-and-Slow-Book-Summary-PDF.pdf', 'System 1 & 2, cognitive biases, decision making.', 'books'),
    createResource('Less But Better', 'Greg McKeown', 'Essentialism', 'Summary Video', 'https://www.youtube.com/watch?v=wHGf0pj1RA0', 'Less but better, trade-offs, disciplined pursuit.', 'books'),
    createResource('Flow State', 'Mihaly Csikszentmihalyi', 'Flow', 'TED Talk', 'https://www.youtube.com/watch?v=fXIeFJCqsPs', 'Flow state, optimal experience.', 'books'),

    // TIER 4: Leadership & Strategy
    createResource('Monopoly Thinking', 'Peter Thiel', 'Zero to One', 'Summary Video', 'https://www.youtube.com/watch?v=rFZrL1RiuVI', 'Monopoly thinking, innovation, contrarian ideas.', 'books'),
    createResource('CEO Struggles', 'Ben Horowitz', 'The Hard Thing About Hard Things', 'Summary Video', 'https://www.youtube.com/watch?v=uODrtTU8SyE', 'CEO struggles, leadership in crisis.', 'books'),
    createResource('Strategy', 'Richard Rumelt', 'Good Strategy Bad Strategy', 'Chapter 1 PDF', 'https://jfriedman.pbworks.com/f/Good%20Strategy%20Bad%20Strategy%20-%20Ch.1%20(Rumelt).pdf', 'Strategy kernel, diagnosis, coherent action.', 'books'),
    createResource('Lean Startup', 'Eric Ries', 'The Lean Startup', 'Summary Video', 'https://www.youtube.com/watch?v=fEvKo90qBns', 'Build-measure-learn, MVP, pivot.', 'books'),
    createResource('OKRs', 'John Doerr', 'Measure What Matters', 'Summary Video', 'https://www.youtube.com/watch?v=L4N1q4RNi9I', 'OKRs, goal setting, alignment.', 'books'),
    createResource('Mental Models', 'Charlie Munger', 'Poor Charlies Almanack', 'Farnam Street Summary', 'https://fs.blog/mental-models/', 'Mental models, worldly wisdom.', 'books'),
    createResource('Purpose', 'Simon Sinek', 'Start with Why', 'TED Talk (Original)', 'https://www.youtube.com/watch?v=u4ZoJKF_VuA', 'Purpose, Golden Circle.', 'books'),

    // TIER 5: Communication & Persuasion
    createResource('Negotiation', 'Chris Voss', 'Never Split the Difference', 'Full Book (PDF)', 'https://cdn.bookey.app/files/pdf/book/en/never-split-the-difference.pdf', 'Tactical empathy, labeling, mirroring.', 'books'),
    createResource('Sticky Ideas', 'Chip & Dan Heath', 'Made to Stick', 'Summary Video', 'https://www.youtube.com/watch?v=dBV4hfXU6fA', 'SUCCES framework, sticky ideas, storytelling.', 'books'),
    createResource('Writing', 'William Zinsser', 'On Writing Well', 'Summary Video', 'https://www.youtube.com/watch?v=Hp7nGhV0O5Y', 'Clarity, simplicity, rewriting.', 'books'),
    createResource('Persuasion', 'Robert Cialdini', 'Influence', 'Summary Video', 'https://www.youtube.com/watch?v=cFdCzN7RYbw', '6 principles of persuasion, social proof.', 'books'),

    // TIER 6: Resilience & Mindset
    createResource('Purpose', 'Viktor Frankl', 'Mans Search for Meaning', 'Full Audiobook (Free)', 'https://www.youtube.com/watch?v=LUd5Btg8mJc', 'Purpose, suffering, meaning.', 'books'),
    createResource('Stoicism', 'Marcus Aurelius', 'Meditations', 'Full Book (Gutenberg)', 'https://www.gutenberg.org/ebooks/2680', 'Stoicism, self-discipline, perspective.', 'books'),
    createResource('Stoic Action', 'Ryan Holiday', 'The Obstacle Is the Way', 'Summary Video', 'https://www.youtube.com/watch?v=e2S1SjgD8HU', 'Adversity advantage, perception, action.', 'books'),
    createResource('Mental Toughness', 'David Goggins', 'Cant Hurt Me', 'Summary Video', 'https://www.youtube.com/watch?v=78I9dTB9vqM', 'Mental toughness, 40% rule, callusing mind.', 'books'),
    createResource('Cold Exposure', 'Wim Hof', 'The Wim Hof Method', 'Official Guide (Free)', 'https://www.wimhofmethod.com/practice-the-method', 'Cold exposure, breathing, mindset.', 'books'),

    // TIER 7: Advanced Specialization
    createResource('ML for Finance', 'Marcos Lopez de Prado', 'Advances in Financial Machine Learning', 'Author Lectures', 'https://www.youtube.com/results?search_query=marcos+lopez+de+prado+lecture', 'ML for finance, backtesting, feature engineering.', 'books'),
    createResource('Algo Trading', 'Ernest Chan', 'Quantitative Trading', 'Summary Video', 'https://www.youtube.com/watch?v=oN36M2G7g5E', 'Algo trading, mean reversion, momentum.', 'books'),
    createResource('Python Finance', 'Yves Hilpisch', 'Python for Finance', 'Free Lectures', 'https://www.youtube.com/results?search_query=yves+hilpisch+python+finance', 'Financial programming, data analysis.', 'books'),
    createResource('Value Investing', 'Benjamin Graham', 'The Intelligent Investor', 'Summary Video', 'https://www.youtube.com/watch?v=npoyc_X5zO8', 'Value investing, margin of safety, Mr. Market.', 'books'),
    createResource('AI Risk', 'Nick Bostrom', 'Superintelligence', 'Summary Video', 'https://www.youtube.com/watch?v=MnT1xgZgkpk', 'AI risk, control problem.', 'books'),
];
