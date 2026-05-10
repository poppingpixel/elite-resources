# 🚀 Elite Resources & Habit Tracker

A beautiful, high-fidelity React application designed to serve as a comprehensive roadmap and tracking system for mastering Artificial Intelligence, CEO-level leadership, cross-disciplinary polymath skills, and essential reading.

Built with an **Apple HIG (Human Interface Guidelines)** inspired design system, this application uses glassmorphism, dynamic animations, and vibrant color schemes to deliver a premium user experience.

---

## 🌟 Key Features

The platform is divided into distinct, meticulously curated roadmaps:

- **🧠 AI Topics**: A structured progression from Core Neural Networks to AGI Safety, tracking mastery across foundational and cutting-edge artificial intelligence domains.
- **📄 Research Papers**: A massive, categorized library of **1,100+ seminal and selected academic papers** spanning Computer Vision, NLP, Speech, Multimodal AI, Core ML, RecSys, Reinforcement Learning, and Graph ML.
- **🎯 CEO Skills**: Executive leadership, strategic thinking, and operational skills required to operate at the highest levels of management.
- **✨ Polymath Methods**: Frameworks and activities designed to foster cross-disciplinary knowledge and resilience.
- **📚 Book Library**: A curated reading list with reading progress tracking.
- **🏆 Milestones**: Quarterly goals and metric tracking across all disciplines.

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism, Animations)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the project directory:
   ```bash
   cd elite-resources
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/`.

## 📁 Project Structure

- `src/Roadmap.tsx`: The core UI component rendering the tabbed navigation and animated cards.
- `src/data/`: Contains all the raw data and type definitions powering the platform.
  - `papers.ts`: Extracted list of 1000+ AI papers.
  - `aiTopics.ts`: Curriculum for AI mastery.
  - `ceoSkills.ts`: Leadership and management skills.
  - `books.ts`: Curated reading list.
  - `polymathMethods.ts`: Interdisciplinary skills data.
- `src/services/progressStore.ts`: Manages the state and progress tracking across all modules.
- `index.css`: Global styles, CSS variables, and glassmorphism utility classes.
- `scripts/`: Python scripts used to autonomously scrape and structure data (e.g., `parse_html_v2.py`).

## 🎨 Design Philosophy

The application UI strictly adheres to modern, premium aesthetics:
- **Vibrant & Harmonious Palettes**: Avoids generic colors in favor of tailored Apple HIG system colors (`#007AFF` blue, `#FF2D55` pink, etc.).
- **Glassmorphism**: Utilizes translucent, blurred backgrounds for cards to create depth and a modern feel.
- **Micro-Animations**: Smooth, staggered `slideUp` animations and hover effects make the interface feel responsive and alive.
- **Information Architecture**: Complex data (like thousands of papers) is organized logically without overwhelming the user.

## 📄 Data Sources

- The **Research Papers** module aggregates its comprehensive list of over 1,100 papers dynamically, categorized structurally by domain and year. 

---
*Built to organize the journey to elite knowledge.*
