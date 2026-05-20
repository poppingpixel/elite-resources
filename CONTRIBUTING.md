# Contributing to Elite Resources

Thank you for your interest in contributing to Elite Resources! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies with `npm install`
4. **Run** the dev server with `npm run dev`

## 📁 Project Structure

```
elite-resources/
├── src/
│   ├── data/           # Data modules (AI topics, papers, books, skills)
│   ├── services/       # Progress tracking, feedback services
│   ├── Roadmap.tsx     # Main UI component
│   ├── App.tsx         # App shell with routing
│   └── index.css       # Apple HIG design system
├── public/             # Static assets
└── scripts/            # Build and data processing utilities
```

## 🎨 Design Guidelines

This project follows **Apple Human Interface Guidelines (HIG)** principles:

- Use CSS custom properties defined in `index.css` for all colors and spacing
- Maintain glassmorphism effects with `backdrop-filter` and semi-transparent backgrounds
- All animations should use `cubic-bezier` easing for smooth, natural motion
- Cards must use the `.glass-card` base class for consistent styling

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `style:` — CSS/styling changes
- `refactor:` — Code refactoring
- `docs:` — Documentation updates
- `perf:` — Performance improvements
- `chore:` — Build/tooling changes

## 🧪 Before Submitting

1. Ensure `npm run build` passes without errors
2. Verify the UI renders correctly on mobile and desktop
3. Test that progress tracking persists across page reloads
4. Check that all animations run at 60fps

## 📚 Adding New Papers

When adding research papers to `src/data/papers.ts`:

1. Include accurate `title`, `domain`, `year`, and `category`
2. Categorize into the correct domain (Computer Vision, NLP, Speech, Multimodal, Core ML, RecSys, RL, Graph ML)
3. Use "Seminal Papers / Need-to-know" or "Selected Papers / Good-to-know" for category

## 📖 Adding New Books

When adding books to `src/data/books.ts`:

1. Include `title`, `author`, `category`, and `coverUrl`
2. Provide a valid cover image URL
3. Categorize appropriately (AI/ML, Leadership, Philosophy, etc.)

## 🐛 Reporting Issues

- Use GitHub Issues to report bugs
- Include browser version, OS, and steps to reproduce
- Screenshots are highly appreciated

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.
