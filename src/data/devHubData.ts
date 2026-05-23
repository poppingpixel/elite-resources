export interface DevHubTopic {
  id: string;
  title: string;
  filePath: string;
  description: string;
  duration: string;
}

export interface DevHubRepo {
  id: string;
  name: string;
  author: string;
  stars: string;
  githubUrl: string;
  description: string;
  category: 'learning-paths' | 'interview' | 'system-design' | 'projects' | 'resources';
  iconName: 'BookOpen' | 'Terminal' | 'Briefcase' | 'Cpu' | 'Code' | 'Shield' | 'Globe' | 'Layers' | 'Sliders';
  topics: DevHubTopic[];
}

export const DEV_HUB_CATEGORIES = [
  { id: 'all', name: 'All Resources', emoji: '🌟' },
  { id: 'learning-paths', name: 'Learning Paths', emoji: '🧭' },
  { id: 'system-design', name: 'System Design', emoji: '🏗️' },
  { id: 'interview', name: 'Interview Prep', emoji: '💼' },
  { id: 'projects', name: 'Build Projects', emoji: '🛠️' },
  { id: 'resources', name: 'Books & Resources', emoji: '📚' }
] as const;

export const DEV_HUB_REPOS: DevHubRepo[] = [
  {
    id: 'p1xt-guides',
    name: 'P1xt Guides',
    author: 'P1xt',
    stars: '23.4k',
    githubUrl: 'https://github.com/P1xt/p1xt-guides',
    description: 'Highly structured, deep learning paths for modern software engineering, computer science, and web development with selected projects and textbooks.',
    category: 'learning-paths',
    iconName: 'BookOpen',
    topics: [
      {
        id: 'p1xt-intro',
        title: 'P1xt Guides Overview',
        filePath: 'p1xt-guides.md',
        description: 'Introduction to P1xt learning methodologies and core guides.',
        duration: '15 mins'
      },
      {
        id: 'p1xt-v4-guide',
        title: 'Web Development & CS (v4)',
        filePath: 'p1xt-guides-v4.md',
        description: 'Complete Tier 1 to Tier 4 guide covering computer science fundamentals, JavaScript, React, SQL, and advanced backend architectures.',
        duration: '45 mins'
      }
    ]
  },
  {
    id: 'become-full-stack',
    name: 'Become A Full-Stack Web Developer',
    author: 'bmorelli25',
    stars: '14.8k',
    githubUrl: 'https://github.com/bmorelli25/Become-A-Full-Stack-Web-Developer',
    description: 'An ultimate guide to mastering full-stack web development. Covers HTML, CSS, JavaScript, Node.js, databases, DevOps, and career resources.',
    category: 'learning-paths',
    iconName: 'Globe',
    topics: [
      {
        id: 'fullstack-roadmap',
        title: 'Full-Stack Developer Roadmap',
        filePath: 'become-full-stack.md',
        description: 'Detailed syllabus, tools, courses, and guides to become a full-stack engineer from scratch.',
        duration: '30 mins'
      }
    ]
  },
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp Curriculum',
    author: 'freeCodeCamp',
    stars: '394k',
    githubUrl: 'https://github.com/freeCodeCamp/freeCodeCamp',
    description: 'The curriculum roadmap for freeCodeCamp.org, featuring HTML5, CSS3, JavaScript, React, Node.js, Python, databases, and interview preparation.',
    category: 'learning-paths',
    iconName: 'Code',
    topics: [
      {
        id: 'fcc-curriculum',
        title: 'Curriculum & Certification Map',
        filePath: 'freecodecamp.md',
        description: 'Overview of all certifications, including Responsive Web Design, JS Data Structures, Relational Databases, and Machine Learning.',
        duration: '20 mins'
      }
    ]
  },
  {
    id: 'system-design-primer',
    name: 'System Design Primer',
    author: 'donnemartin',
    stars: '264k',
    githubUrl: 'https://github.com/donnemartin/system-design-primer',
    description: 'The golden standard study plan to learn how to design large-scale systems. Includes diagrams, flashcards, interview guides, and solutions.',
    category: 'system-design',
    iconName: 'Cpu',
    topics: [
      {
        id: 'sd-primer-core',
        title: 'System Design Primer Guide',
        filePath: 'system-design-primer.md',
        description: 'Comprehensive study guide covering scalability, latency vs throughput, load balancers, caching, sharding, CDN, and microservices.',
        duration: '60 mins'
      }
    ]
  },
  {
    id: 'system-design-cheatsheet',
    name: 'System Design Cheatsheet',
    author: 'vasanthk',
    stars: '21.5k',
    githubUrl: 'https://gist.github.com/vasanthk/485d1c25737e8e72759f',
    description: 'A high-impact, straight-to-the-point cheat sheet detailing core concepts, database partitioning, vertical/horizontal scaling, and platform layers.',
    category: 'system-design',
    iconName: 'Sliders',
    topics: [
      {
        id: 'sd-cheatsheet-gist',
        title: 'Architecting Systems for Scale',
        filePath: 'system-design-cheatsheet.md',
        description: 'Key cheatsheet covering concurrency, load balancing, replication, map-reduce, platform services, and front-end performance ops.',
        duration: '15 mins'
      }
    ]
  },
  {
    id: 'coding-interview-university',
    name: 'Coding Interview University',
    author: 'jwasham',
    stars: '286k',
    githubUrl: 'https://github.com/jwasham/coding-interview-university',
    description: 'A complete multi-month study plan to become a software engineer at top tech companies. Deep dive into algorithms, data structures, and computer science.',
    category: 'interview',
    iconName: 'Briefcase',
    topics: [
      {
        id: 'ciu-study-plan',
        title: 'Complete CS Study Guide',
        filePath: 'coding-interview-university.md',
        description: 'A massive reference of books, videos, and exercises for trees, sorting, graphs, recursion, OOP design, and salary negotiations.',
        duration: '90 mins'
      }
    ]
  },
  {
    id: 'tech-interview-handbook',
    name: 'Tech Interview Handbook',
    author: 'yangshun',
    stars: '115k',
    githubUrl: 'https://github.com/yangshun/tech-interview-handbook',
    description: 'Curated coding interview preparation materials for busy engineers, including Blind 75 / Grind 75 study plans, behavioral prep, and resume guides.',
    category: 'interview',
    iconName: 'Terminal',
    topics: [
      {
        id: 'tih-guide',
        title: 'Coding & Behavioral Guide',
        filePath: 'tech-interview-handbook.md',
        description: 'Curated algorithms cheatsheet, behavioral questions, resume templates, and coding interview best practices.',
        duration: '25 mins'
      }
    ]
  },
  {
    id: 'build-your-own-x',
    name: 'Build Your Own X',
    author: 'codecrafters-io',
    stars: '272k',
    githubUrl: 'https://github.com/codecrafters-io/build-your-own-x',
    description: 'A collection of tutorials teaching you how to recreate developer technologies (Git, Docker, databases, compilers, OS, neural networks) from scratch.',
    category: 'projects',
    iconName: 'Code',
    topics: [
      {
        id: 'byox-index',
        title: 'Recreate Dev Technologies Index',
        filePath: 'build-your-own-x.md',
        description: 'Comprehensive tutorials grouped by target (Git, Docker, Compiler, DB, Game Engine) with multi-language step-by-step guides.',
        duration: '40 mins'
      }
    ]
  },
  {
    id: 'project-based-learning',
    name: 'Project-Based Learning',
    author: 'practical-tutorials',
    stars: '175k',
    githubUrl: 'https://github.com/practical-tutorials/project-based-learning',
    description: 'A collection of programming tutorials grouped by language, where you build complete applications (CLI, Web, Mobile, Games) from scratch.',
    category: 'projects',
    iconName: 'Terminal',
    topics: [
      {
        id: 'pbl-tutorials',
        title: 'Language-Specific Projects',
        filePath: 'project-based-learning.md',
        description: 'Lists of tutorials in C, C++, Python, Rust, Go, JS, Ruby, Swift, and more to build checkers, servers, web browsers, and command-line tools.',
        duration: '35 mins'
      }
    ]
  },
  {
    id: 'karan-projects',
    name: 'Karan\'s Projects List',
    author: 'karan',
    stars: '11.8k',
    githubUrl: 'https://github.com/karan/Projects',
    description: 'A huge, classic list of practical programming project specs that can be implemented in any language. Divided by domain (networking, security, text).',
    category: 'projects',
    iconName: 'Layers',
    topics: [
      {
        id: 'karan-specs',
        title: 'Programming Project Specs',
        filePath: 'karan-projects.md',
        description: 'Specific problem statements for Text parsing, Numbers, Multithreading, Classic Algorithms, Graph/Trees, and Web Scrapers.',
        duration: '20 mins'
      }
    ]
  },
  {
    id: 'free-programming-books',
    name: 'Free Programming Books',
    author: 'EbookFoundation',
    stars: '318k',
    githubUrl: 'https://github.com/EbookFoundation/free-programming-books',
    description: 'A massive index of free programming books, courses, interactive tutorials, cheat sheets, and podcasts categorized by subjects and languages.',
    category: 'resources',
    iconName: 'BookOpen',
    topics: [
      {
        id: 'fpb-home',
        title: 'Ebooks & Courses Home',
        filePath: 'free-programming-books.md',
        description: 'Introduction and meta-information for the free programming books index.',
        duration: '10 mins'
      },
      {
        id: 'fpb-subjects',
        title: 'Ebooks by Subject',
        filePath: 'free-programming-books-subjects.md',
        description: 'Vast lists of free books covering topics from AI/ML, OS, Cloud, Web Dev, Mobile Dev, Security, to Game Engines.',
        duration: '40 mins'
      },
      {
        id: 'fpb-langs',
        title: 'Ebooks by Programming Language',
        filePath: 'free-programming-books-langs.md',
        description: 'Free books index organized alphabetically from Ada, C, Python, Rust, to Zig and Zsh.',
        duration: '45 mins'
      }
    ]
  },
  {
    id: 'book-of-secret-knowledge',
    name: 'The Book of Secret Knowledge',
    author: 'trimstray',
    stars: '124k',
    githubUrl: 'https://github.com/trimstray/the-book-of-secret-knowledge',
    description: 'An ultimate cheatsheet and toolbox for DevOps, Sysadmins, and Security researchers. Contains networks, hacks, commands, one-liners, and tools.',
    category: 'resources',
    iconName: 'Shield',
    topics: [
      {
        id: 'bsk-tools-cheatsheets',
        title: 'DevOps & Sysadmin Secrets',
        filePath: 'book-of-secret-knowledge.md',
        description: 'Cheatsheets and CLI manuals for Git, SSH, iptables, docker, system performance tuning, and cybersecurity resources.',
        duration: '50 mins'
      }
    ]
  },
  {
    id: 'awesome-react',
    name: 'Awesome React',
    author: 'enaqx',
    stars: '62.4k',
    githubUrl: 'https://github.com/enaqx/awesome-react',
    description: 'A curated list of awesome things regarding the React ecosystem, detailing styling solutions, state management, hooks, testing, and utilities.',
    category: 'resources',
    iconName: 'Code',
    topics: [
      {
        id: 'react-awesome-list',
        title: 'React Ecosystem Directory',
        filePath: 'awesome-react.md',
        description: 'Curated links, tutorials, components, state managers, hooks, utility libraries, boilerplate generators, and video channels.',
        duration: '20 mins'
      }
    ]
  },
  {
    id: 'best-websites',
    name: 'Best Websites a Programmer Should Visit',
    author: 'sdmg15',
    stars: '60.1k',
    githubUrl: 'https://github.com/sdmg15/Best-websites-a-programmer-should-visit',
    description: 'A categorized index of websites that every developer should bookmark, spanning competitive coding, blogs, podcasts, newsletters, and tools.',
    category: 'resources',
    iconName: 'Globe',
    topics: [
      {
        id: 'best-sites-list',
        title: 'Ultimate Developer Bookmarks',
        filePath: 'best-websites.md',
        description: 'Links to references, coding games, technical news, tech blogs, YouTube channels, and general utilities for daily work.',
        duration: '25 mins'
      }
    ]
  }
];
