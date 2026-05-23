import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen, Terminal, Briefcase, Cpu, Code, Shield, Globe, Layers, Sliders,
  Search, Check, Clock, Sparkles, Play, Square, Volume2, VolumeX,
  Info, ExternalLink, X, CheckCircle2, Circle
} from 'lucide-react';
import { DEV_HUB_CATEGORIES, DEV_HUB_REPOS } from './data/devHubData';
import { triggerFeedback } from './services/feedback';
import './DevHub.css';

// ═══════════════════════════════════════════════════════════════════════════════
// APPLE-STYLE DARK COLORS
// ═══════════════════════════════════════════════════════════════════════════════
const AppleColors = {
  blue: '#007AFF',
  green: '#34C759',
  indigo: '#5856D6',
  orange: '#FF9500',
  pink: '#FF2D55',
  purple: '#AF52DE',
  red: '#FF3B30',
  teal: '#5AC8FA',
  yellow: '#FFCC00',
  labelPrimary: 'var(--text-primary, #ffffff)',
  labelSecondary: 'var(--text-secondary, rgba(255, 255, 255, 0.7))',
  labelTertiary: 'var(--text-tertiary, rgba(255, 255, 255, 0.4))',
  glassBorder: 'var(--glass-border, rgba(255, 255, 255, 0.08))',
  separator: 'rgba(255, 255, 255, 0.1)',
};

const CATEGORY_ACCENT: Record<string, string> = {
  'learning-paths': AppleColors.blue,
  'system-design': AppleColors.purple,
  'interview': AppleColors.orange,
  'projects': AppleColors.green,
  'resources': AppleColors.indigo,
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFETTI PHYSICS SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE STATE KEYS
// ═══════════════════════════════════════════════════════════════════════════════
const STATE_KEYS = {
  COMPLETED_TOPICS: 'devhub:completed_topics:v1',
  XP: 'devhub:xp:v1',
  STREAK: 'devhub:streak:v1',
  LAST_ACTIVE: 'devhub:last_active:v1',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MERMAID DIAGRAM INJECTION
// ═══════════════════════════════════════════════════════════════════════════════
let mermaidPromise: Promise<any> | null = null;
function loadMermaid(): Promise<any> {
  if ((window as any).mermaid) {
    return Promise.resolve((window as any).mermaid);
  }
  if (mermaidPromise) {
    return mermaidPromise;
  }
  mermaidPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
    script.async = true;
    script.onload = () => {
      const mermaid = (window as any).mermaid;
      if (mermaid) {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          themeVariables: {
            background: '#121318',
            primaryColor: '#007AFF',
            primaryTextColor: '#ffffff',
            lineColor: 'rgba(255,255,255,0.2)',
          }
        });
        resolve(mermaid);
      }
    };
    document.body.appendChild(script);
  });
  return mermaidPromise;
}

function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMermaid()
      .then(async (mermaid) => {
        if (!mermaid) return;
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        try {
          const { svg: renderedSvg } = await mermaid.render(id, chart);
          setSvg(renderedSvg);
          setError(null);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Mermaid Render Error');
        }
      });
  }, [chart]);

  if (error) {
    return (
      <div style={{ padding: 12, background: 'rgba(255,59,48,0.1)', borderRadius: 8, color: AppleColors.red, fontSize: 12, margin: '12px 0' }}>
        <strong>Mermaid render error:</strong> {error}
      </div>
    );
  }

  if (!svg) {
    return <div style={{ fontSize: 11, color: AppleColors.labelTertiary }}>Loading diagram...</div>;
  }

  return (
    <div 
      className="mermaid-container" 
      style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', background: '#121318', padding: 16, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CODE BLOCK
// ═══════════════════════════════════════════════════════════════════════════════
function PremiumCodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    triggerFeedback('light');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: '#0e0f12', borderRadius: 10, border: `1px solid rgba(255, 255, 255, 0.08)`, margin: '18px 0', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid rgba(255, 255, 255, 0.06)` }}>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {lang || 'code'}
        </span>
        <button onClick={handleCopy} style={{ background: 'none', border: 'none', color: copied ? AppleColors.green : 'rgba(255,255,255,0.5)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: 16, overflowX: 'auto', fontFamily: 'monospace', fontSize: 13, color: '#e4e4e7', lineHeight: 1.5 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTWEIGHT MARKDOWN FORMATTER
// ═══════════════════════════════════════════════════════════════════════════════
const renderMarkdown = (text: string | null) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLang = '';
  let listItems: React.ReactNode[] = [];
  let tableRows: React.ReactNode[][] = [];

  const flushList = (key: string | number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} style={{ margin: '10px 0 16px 20px', padding: 0, listStyleType: 'disc' }}>
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = (key: string | number) => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={`table-container-${key}`} style={{ overflowX: 'auto', margin: '16px 0', borderRadius: 8, border: `1px solid ${AppleColors.separator}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, background: 'rgba(255,255,255,0.01)' }}>
            <tbody>
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: `1px solid ${AppleColors.separator}`, background: rIdx === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '8px 12px', fontWeight: rIdx === 0 ? 600 : 400, color: rIdx === 0 ? AppleColors.labelPrimary : AppleColors.labelSecondary, textAlign: 'left' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  const parseInlineStyles = (line: string, lineKey: string | number) => {
    const linkParts = line.split(/(\[.*?\]\(.*?\))/);
    return linkParts.map((part, pIdx) => {
      if (part.startsWith('[') && part.includes('](')) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const text = match[1];
          const url = match[2];
          return (
            <a 
              key={`${lineKey}-link-${pIdx}`} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: AppleColors.blue, textDecoration: 'none', fontWeight: 500 }}
              onClick={(e) => e.stopPropagation()}
            >
              {text}
            </a>
          );
        }
      }
      const subParts = part.split(/(\*\*.*?\*\*|`.*?`)/);
      return subParts.map((subPart, sIdx) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          return <strong key={`${lineKey}-${pIdx}-${sIdx}`} style={{ color: AppleColors.labelPrimary, fontWeight: 700 }}>{subPart.slice(2, -2)}</strong>;
        }
        if (subPart.startsWith('`') && subPart.endsWith('`')) {
          return (
            <code key={`${lineKey}-${pIdx}-${sIdx}`} style={{
              fontFamily: 'monospace',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: '0.9em',
              color: AppleColors.orange,
              border: `1px solid ${AppleColors.glassBorder}`
            }}>
              {subPart.slice(1, -1)}
            </code>
          );
        }
        return subPart;
      });
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const finalCode = codeContent.join('\n');
        if (codeLang.toLowerCase() === 'mermaid') {
          elements.push(<MermaidDiagram key={`mermaid-${i}`} chart={finalCode} />);
        } else {
          elements.push(<PremiumCodeBlock key={`code-${i}`} code={finalCode} lang={codeLang} />);
        }
        codeContent = [];
        codeLang = '';
      } else {
        flushList(i);
        flushTable(i);
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Image support
    if (line.trim().startsWith('![') && line.includes('](')) {
      flushList(i);
      flushTable(i);
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        const alt = match[1];
        const src = match[2];
        elements.push(
          <div key={`img-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
            <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 8, border: `1px solid ${AppleColors.glassBorder}` }} />
            {alt && <span style={{ fontSize: 12, color: AppleColors.labelSecondary, marginTop: 8, fontStyle: 'italic' }}>{alt}</span>}
          </div>
        );
        continue;
      }
    }

    if (line.startsWith('## ')) {
      flushList(i);
      flushTable(i);
      elements.push(
        <h3 key={i} style={{ fontSize: 18, fontWeight: 700, color: AppleColors.labelPrimary, marginTop: 24, marginBottom: 12 }}>
          {parseInlineStyles(line.slice(3), i)}
        </h3>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      flushList(i);
      flushTable(i);
      elements.push(
        <h4 key={i} style={{ fontSize: 15, fontWeight: 600, color: AppleColors.labelPrimary, marginTop: 18, marginBottom: 8 }}>
          {parseInlineStyles(line.slice(4), i)}
        </h4>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      flushList(i);
      flushTable(i);
      elements.push(
        <h2 key={i} style={{ fontSize: 22, fontWeight: 800, color: AppleColors.labelPrimary, marginTop: 28, marginBottom: 16 }}>
          {parseInlineStyles(line.slice(2), i)}
        </h2>
      );
      continue;
    }

    // Tables parsing
    if (line.startsWith('|')) {
      flushList(i);
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      // Skip alignment lines like |---|---|
      if (cells.length > 0 && !cells[0].includes('---')) {
        tableRows.push(cells.map(c => parseInlineStyles(c, `${i}-cell`)));
      }
      continue;
    } else {
      flushTable(i);
    }

    // Bullet list parsing
    const listMatch = line.match(/^(\s*)([-*+])\s(.*)/);
    if (listMatch) {
      const content = listMatch[3];
      listItems.push(
        <li key={`${i}-li`} style={{ margin: '4px 0', fontSize: 14, color: AppleColors.labelSecondary, lineHeight: 1.5 }}>
          {parseInlineStyles(content, i)}
        </li>
      );
    } else {
      flushList(i);

      if (line.trim() === '') {
        elements.push(<div key={`spacer-${i}`} style={{ height: 12 }} />);
      } else {
        elements.push(
          <p key={`p-${i}`} style={{ margin: '8px 0 12px 0', fontSize: 14.5, color: AppleColors.labelSecondary, lineHeight: 1.6 }}>
            {parseInlineStyles(line, i)}
          </p>
        );
      }
    }
  }

  // Flush remaining lists or tables
  flushList('end');
  flushTable('end');

  return elements;
};

// Get Repo icon helper
const getRepoIcon = (name: string, size = 18) => {
  switch (name) {
    case 'BookOpen': return <BookOpen size={size} />;
    case 'Terminal': return <Terminal size={size} />;
    case 'Briefcase': return <Briefcase size={size} />;
    case 'Cpu': return <Cpu size={size} />;
    case 'Code': return <Code size={size} />;
    case 'Shield': return <Shield size={size} />;
    case 'Globe': return <Globe size={size} />;
    case 'Layers': return <Layers size={size} />;
    case 'Sliders': return <Sliders size={size} />;
    default: return <BookOpen size={size} />;
  }
};

export default function DevHub() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedRepoId, setSelectedRepoId] = useState<string>('p1xt-guides');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('p1xt-intro');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Context Ref
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientRainNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // States for localstorage progress
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpName, setLevelUpName] = useState('');

  // Pomodoro States
  const [pomoTimeLeft, setPomoTimeLeft] = useState(25 * 60);
  const [isPomoActive, setIsPomoActive] = useState(false);
  const pomoTimerRef = useRef<any | null>(null);

  // Markdown fetch states
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [isMdLoading, setIsMdLoading] = useState(false);

  // Canvas elements
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pomoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Confetti animation list
  const confettiParticles = useRef<ConfettiParticle[]>([]);
  const confettiAnimId = useRef<number | null>(null);

  // Active repo
  const activeRepo = useMemo(() => {
    return DEV_HUB_REPOS.find(r => r.id === selectedRepoId) || DEV_HUB_REPOS[0];
  }, [selectedRepoId]);

  // Active topic
  const activeTopic = useMemo(() => {
    return activeRepo.topics.find(t => t.id === selectedTopicId) || activeRepo.topics[0];
  }, [activeRepo, selectedTopicId]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION / LOAD STATE
  // ═══════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const loadedCompleted = localStorage.getItem(STATE_KEYS.COMPLETED_TOPICS);
    const loadedXp = localStorage.getItem(STATE_KEYS.XP);
    const loadedStreak = localStorage.getItem(STATE_KEYS.STREAK);
    const loadedLastActive = localStorage.getItem(STATE_KEYS.LAST_ACTIVE);

    if (loadedCompleted) setCompletedTopics(JSON.parse(loadedCompleted));
    if (loadedXp) setXp(parseInt(loadedXp, 10));

    // Calculate streak
    if (loadedLastActive) {
      const lastActiveDate = new Date(loadedLastActive);
      const today = new Date();
      const differenceInMs = today.getTime() - lastActiveDate.getTime();
      const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

      if (differenceInDays < 1) {
        // Active today, maintain streak
        setStreak(loadedStreak ? parseInt(loadedStreak, 10) : 0);
      } else if (differenceInDays < 2) {
        // Yesterday was active, maintain streak
        setStreak(loadedStreak ? parseInt(loadedStreak, 10) : 0);
      } else {
        // Lost streak
        setStreak(0);
      }
    }
  }, []);

  // Update last active
  const markActive = useCallback(() => {
    const today = new Date().toISOString();
    localStorage.setItem(STATE_KEYS.LAST_ACTIVE, today);

    // Calculate if we need to update streak
    const loadedLastActive = localStorage.getItem(STATE_KEYS.LAST_ACTIVE);
    const loadedStreak = localStorage.getItem(STATE_KEYS.STREAK);
    let currentStreak = loadedStreak ? parseInt(loadedStreak, 10) : 0;

    if (loadedLastActive) {
      const lastActiveDate = new Date(loadedLastActive);
      const now = new Date();
      if (lastActiveDate.toDateString() !== now.toDateString()) {
        currentStreak += 1;
        setStreak(currentStreak);
        localStorage.setItem(STATE_KEYS.STREAK, currentStreak.toString());
      }
    } else {
      currentStreak = 1;
      setStreak(currentStreak);
      localStorage.setItem(STATE_KEYS.STREAK, '1');
    }
  }, []);

  // Level names
  const levelData = useMemo(() => {
    // Level formula: level = floor(xp / 500) + 1
    const lvl = Math.floor(xp / 500) + 1;
    const badges = [
      'Code Initiate ⚙️',
      'Terminal Wizard 🔮',
      'Git Architect 🏗️',
      'System Sage 🧠',
      'Polymath God ⚡'
    ];
    const badgeName = badges[Math.min(lvl - 1, badges.length - 1)];
    const xpNeededForNext = lvl * 500;
    const xpInCurrentLvl = xp - (lvl - 1) * 500;
    const progressPercent = Math.min((xpInCurrentLvl / 500) * 100, 100);

    return {
      level: lvl,
      badgeName,
      progressPercent,
      xpNeededForNext,
      xpInCurrentLvl
    };
  }, [xp]);

  // Audio Context Getter
  const getAudioContext = (): AudioContext | null => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    return audioContextRef.current;
  };

  // Play Success Sound Synth arpeggio
  const playSuccessSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  };

  // Play Level Up Laser Sound Synth
  const playLevelUpSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.4);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220, now);
    osc2.frequency.exponentialRampToValueAtTime(1100, now + 0.45);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.6);
    osc2.start(now);
    osc2.stop(now + 0.6);
  };

  // Play Rain Ambient Noise
  const toggleAmbientFocusAudio = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (isAmbientPlaying) {
      if (ambientRainNodeRef.current) {
        ambientRainNodeRef.current.stop();
        ambientRainNodeRef.current = null;
      }
      setIsAmbientPlaying(false);
      triggerFeedback('light');
    } else {
      // Generate Pinkish/White noise for rain focus
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      // Filter noise (Low-pass) to simulate gentle rain drone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      // Add gentle gain
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseNode.start();
      ambientRainNodeRef.current = noiseNode;
      setIsAmbientPlaying(true);
      triggerFeedback('medium');
    }
  };

  // Clean ambient audio on unmount
  useEffect(() => {
    return () => {
      if (ambientRainNodeRef.current) {
        ambientRainNodeRef.current.stop();
      }
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════════
  // CATEGORIES COMPLETIONS & RADAR CHART RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  const completionStats = useMemo(() => {
    // 5 Categories: learning-paths, system-design, interview, projects, resources
    const cats = ['learning-paths', 'system-design', 'interview', 'projects', 'resources'];
    const stats: Record<string, { total: number; completed: number; ratio: number }> = {};

    cats.forEach(cat => {
      const repos = DEV_HUB_REPOS.filter(r => r.category === cat);
      let total = 0;
      let completed = 0;
      repos.forEach(repo => {
        repo.topics.forEach(topic => {
          total += 1;
          if (completedTopics[topic.id]) {
            completed += 1;
          }
        });
      });
      stats[cat] = {
        total,
        completed,
        ratio: total > 0 ? completed / total : 0
      };
    });

    return stats;
  }, [completedTopics]);

  // Render Skill Radar Chart
  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 12;

    // Clear
    ctx.clearRect(0, 0, width, height);

    const categories = [
      { id: 'learning-paths', label: 'Paths', color: AppleColors.blue },
      { id: 'system-design', label: 'Arch', color: AppleColors.purple },
      { id: 'interview', label: 'Algo', color: AppleColors.orange },
      { id: 'projects', label: 'Code', color: AppleColors.green },
      { id: 'resources', label: 'Docs', color: AppleColors.indigo },
    ];

    const numPoints = categories.length;

    // Draw background concentric pentagons
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let j = 1; j <= 5; j++) {
      const levelRadius = radius * (j / 5);
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
        const x = centerX + Math.cos(angle) * levelRadius;
        const y = centerY + Math.sin(angle) * levelRadius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axis lines from center to outer points
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    }
    ctx.stroke();

    // Draw filled polygon of user completions
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const catId = categories[i].id;
      const progressRatio = completionStats[catId]?.ratio || 0;
      // Guarantee a tiny minimum so it always renders at least a small center shape
      const levelRadius = radius * Math.max(progressRatio, 0.1);

      const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
      const x = centerX + Math.cos(angle) * levelRadius;
      const y = centerY + Math.sin(angle) * levelRadius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Fill with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(88, 86, 214, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 122, 255, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Polygon stroke border
    ctx.strokeStyle = AppleColors.teal;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw vertices/dots
    for (let i = 0; i < numPoints; i++) {
      const catId = categories[i].id;
      const progressRatio = completionStats[catId]?.ratio || 0;
      const levelRadius = radius * Math.max(progressRatio, 0.1);
      const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
      const x = centerX + Math.cos(angle) * levelRadius;
      const y = centerY + Math.sin(angle) * levelRadius;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = categories[i].color;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Labels on outer bounds
      const labelAngle = angle;
      const lx = centerX + Math.cos(labelAngle) * (radius + 8);
      const ly = centerY + Math.sin(labelAngle) * (radius + 8);

      ctx.fillStyle = AppleColors.labelSecondary;
      ctx.font = '9.5px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(categories[i].label, lx, ly);
    }
  }, [completionStats]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONFETTI EFFECTS SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════
  const spawnConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    const h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    // Spawn 80 particles
    const colors = [AppleColors.blue, AppleColors.green, AppleColors.pink, AppleColors.orange, AppleColors.purple, AppleColors.teal];
    const particles: ConfettiParticle[] = [];

    for (let i = 0; i < 85; i++) {
      particles.push({
        x: w / 2 + (Math.random() * 40 - 20),
        y: h - 30, // shoot up from bottom center
        vx: (Math.random() * 14 - 7),
        vy: -(Math.random() * 15 + 8),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    confettiParticles.current = particles;

    // Trigger loop if not active
    if (confettiAnimId.current) cancelAnimationFrame(confettiAnimId.current);

    const loop = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, w, h);

      const activeParticles = confettiParticles.current.filter(p => p.alpha > 0.01);

      activeParticles.forEach(p => {
        // Gravity and physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // drag
        p.alpha -= p.decay;

        // Render
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      confettiParticles.current = activeParticles;

      if (activeParticles.length > 0) {
        confettiAnimId.current = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, w, h);
        confettiAnimId.current = null;
      }
    };

    confettiAnimId.current = requestAnimationFrame(loop);
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // TOGGLE TOPIC STATUS (XP SYSTEM)
  // ═══════════════════════════════════════════════════════════════════════════════
  const toggleTopicCompleted = (topicId: string) => {
    const isCompleted = !!completedTopics[topicId];
    const newCompleted = { ...completedTopics, [topicId]: !isCompleted };
    setCompletedTopics(newCompleted);
    localStorage.setItem(STATE_KEYS.COMPLETED_TOPICS, JSON.stringify(newCompleted));

    // Calculate XP delta
    let deltaXp = 0;
    if (!isCompleted) {
      // Completing topic
      deltaXp = 100;
      playSuccessSound();
      spawnConfetti();
      triggerFeedback('success');
      markActive(); // active today, streak update
    } else {
      // Unchecking
      deltaXp = -100;
      triggerFeedback('medium');
    }

    const nextXp = Math.max(0, xp + deltaXp);
    setXp(nextXp);
    localStorage.setItem(STATE_KEYS.XP, nextXp.toString());

    // Level up check
    const currentLevel = Math.floor(xp / 500) + 1;
    const nextLevel = Math.floor(nextXp / 500) + 1;
    if (nextLevel > currentLevel) {
      playLevelUpSound();
      setLevelUpName(
        nextLevel === 2 ? 'Terminal Wizard 🔮' :
        nextLevel === 3 ? 'Git Architect 🏗️' :
        nextLevel === 4 ? 'System Sage 🧠' : 'Polymath God ⚡'
      );
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // FETCH MARKDOWN CONTENT DYNAMICALLY
  // ═══════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!activeTopic) return;

    setIsMdLoading(true);
    setMarkdownContent(null);

    const mdUrl = `/elite-resources/devhub/${activeTopic.filePath}`;
    fetch(mdUrl)
      .then(res => {
        if (!res.ok) throw new Error('Markdown file not found');
        return res.text();
      })
      .then(text => {
        setMarkdownContent(text);
      })
      .catch(() => {
        setMarkdownContent(`# ${activeTopic.title}\n\nUnable to fetch detailed documentation from the local public repository.\n\nDescription: ${activeTopic.description}`);
      })
      .finally(() => {
        setIsMdLoading(false);
      });
  }, [activeTopic]);

  // Filter Repositories list based on categories and search query
  const filteredRepos = useMemo(() => {
    let result = DEV_HUB_REPOS;

    if (activeCategory !== 'all') {
      result = result.filter(r => r.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) || 
        r.author.toLowerCase().includes(q) ||
        r.topics.some(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  // Selected Repo completions ratio
  const repoProgress = useMemo(() => {
    const total = activeRepo.topics.length;
    let completed = 0;
    activeRepo.topics.forEach(t => {
      if (completedTopics[t.id]) completed += 1;
    });
    return {
      total,
      completed,
      percentage: total > 0 ? (completed / total) * 100 : 0
    };
  }, [activeRepo, completedTopics]);

  // Handle repository sidebar clicks
  const selectRepository = (repoId: string) => {
    setSelectedRepoId(repoId);
    triggerFeedback('light');
    // Default select first topic in the new repo
    const firstTopic = DEV_HUB_REPOS.find(r => r.id === repoId)?.topics[0];
    if (firstTopic) {
      setSelectedTopicId(firstTopic.id);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // POMODORO TIMER WORKSPACE & RENDERING
  // ═══════════════════════════════════════════════════════════════════════════════
  const togglePomoTimer = () => {
    if (isPomoActive) {
      // Pause
      if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
      setIsPomoActive(false);
      triggerFeedback('medium');
    } else {
      // Start
      setIsPomoActive(true);
      triggerFeedback('success');
      markActive(); // active streak check

      pomoTimerRef.current = setInterval(() => {
        setPomoTimeLeft(prev => {
          if (prev <= 1) {
            // Alarm finish
            clearInterval(pomoTimerRef.current!);
            setIsPomoActive(false);
            playSuccessSound();
            // Reward 200 XP for Focus completion
            const focusRewardXp = xp + 200;
            setXp(focusRewardXp);
            localStorage.setItem(STATE_KEYS.XP, focusRewardXp.toString());
            triggerFeedback('success');
            return 25 * 60; // reset
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const resetPomoTimer = () => {
    if (pomoTimerRef.current) clearInterval(pomoTimerRef.current);
    setIsPomoActive(false);
    setPomoTimeLeft(25 * 60);
    triggerFeedback('light');
  };

  // Draw Pomodoro circular ring
  useEffect(() => {
    const canvas = pomoCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cX = w / 2;
    const cY = h / 2;
    const r = Math.min(w, h) / 2 - 8;

    ctx.clearRect(0, 0, w, h);

    // Track total 25 mins ratio
    const totalPomoSecs = 25 * 60;
    const progressRatio = pomoTimeLeft / totalPomoSecs;

    // Draw background track
    ctx.beginPath();
    ctx.arc(cX, cY, r, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Draw active timer ring (decreasing red-pink gradient)
    ctx.beginPath();
    ctx.arc(cX, cY, r, -Math.PI / 2, (2 * Math.PI * progressRatio) - Math.PI / 2);
    ctx.strokeStyle = AppleColors.pink;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [pomoTimeLeft]);

  // Format pomo remaining
  const formattedPomoTime = useMemo(() => {
    const mins = Math.floor(pomoTimeLeft / 60);
    const secs = pomoTimeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [pomoTimeLeft]);

  return (
    <div className="devhub-container">
      {/* LEVEL UP POPUP */}
      {showLevelUp && (
        <div className="devhub-levelup-overlay">
          <div className="devhub-levelup-title">👑 Level Up!</div>
          <div className="devhub-levelup-desc">You are now a {levelUpName}!</div>
        </div>
      )}

      {/* LEFT SIDEBAR: CATEGORIES AND REPOS */}
      <aside className="devhub-sidebar">
        <div className="devhub-sidebar-header">
          <h2>Elite Dev Library</h2>
          
          {/* Daily Streak Flame Banner */}
          <div className="devhub-gamify-card">
            <div className="devhub-gamify-header">
              <span className="devhub-level-badge">Lv. {levelData.level} • {levelData.badgeName}</span>
              <span className="devhub-xp-text">{xp} XP</span>
            </div>
            <div className="devhub-xp-bar-bg">
              <div 
                className="devhub-xp-bar-fill" 
                style={{ width: `${levelData.progressPercent}%` }} 
              />
            </div>
            <div className="devhub-gamify-footer">
              <span style={{ color: AppleColors.labelTertiary }}>XP to Lv. {levelData.level + 1}</span>
              <span className="devhub-streak-badge">
                <span className="devhub-streak-fire">🔥</span>
                <span>{streak} day streak</span>
              </span>
            </div>
          </div>

          {/* Local search in sidebar */}
          <div className="devhub-search-box">
            <Search size={14} className="devhub-search-icon" />
            <input 
              type="text" 
              placeholder="Search library..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <X 
                size={14} 
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 16px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {DEV_HUB_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); triggerFeedback('light'); }}
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                border: activeCategory === cat.id ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                background: activeCategory === cat.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeCategory === cat.id ? '#fff' : AppleColors.labelSecondary,
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {cat.emoji} {cat.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Repo items list */}
        <div className="devhub-repo-list">
          {filteredRepos.length > 0 ? (
            filteredRepos.map(repo => {
              const accentColor = CATEGORY_ACCENT[repo.category] || AppleColors.blue;
              const isSelected = repo.id === selectedRepoId;

              // Compute completions per repo
              let completedCount = 0;
              repo.topics.forEach(t => { if (completedTopics[t.id]) completedCount += 1; });
              const completedAll = completedCount === repo.topics.length;

              return (
                <button
                  key={repo.id}
                  onClick={() => selectRepository(repo.id)}
                  className={`devhub-repo-item ${isSelected ? 'active' : ''}`}
                  style={{ '--active-accent': accentColor } as React.CSSProperties}
                >
                  <div className="devhub-repo-icon">
                    {getRepoIcon(repo.iconName, 16)}
                  </div>
                  <div className="devhub-repo-info">
                    <span className="devhub-repo-name">{repo.name}</span>
                    <span className="devhub-repo-meta">
                      <span>★ {repo.stars}</span>
                      <span>•</span>
                      <span style={{ color: completedAll ? AppleColors.green : AppleColors.labelTertiary }}>
                        {completedCount}/{repo.topics.length} completed
                      </span>
                    </span>
                  </div>
                  {completedAll && <CheckCircle2 size={14} style={{ color: AppleColors.green }} />}
                </button>
              );
            })
          ) : (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: AppleColors.labelTertiary }}>
              No resources match search query.
            </div>
          )}
        </div>
      </aside>

      {/* SECONDARY SIDEBAR: SELECTED REPO TOPICS */}
      <aside className="devhub-topic-sidebar">
        <div style={{ padding: '16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: AppleColors.labelTertiary }}>
            Topics Explorer
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: AppleColors.labelSecondary, fontWeight: 600 }}>
              {repoProgress.completed}/{repoProgress.total} Complete
            </span>
            <span style={{ fontSize: 11, color: AppleColors.green }}>
              {Math.round(repoProgress.percentage)}%
            </span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
            <div style={{ height: '100%', background: AppleColors.green, width: `${repoProgress.percentage}%`, borderRadius: 2 }} />
          </div>
        </div>

        <div className="devhub-topic-list">
          {activeRepo.topics.map(topic => {
            const isSelected = topic.id === selectedTopicId;
            const isCompleted = !!completedTopics[topic.id];

            return (
              <div
                key={topic.id}
                onClick={() => { setSelectedTopicId(topic.id); triggerFeedback('light'); }}
                className={`devhub-topic-item ${isSelected ? 'active' : ''}`}
              >
                <div className="devhub-topic-title-row">
                  <span className="devhub-topic-title" style={{ fontWeight: isSelected ? 600 : 400 }}>
                    {topic.title}
                  </span>
                  {isCompleted && <CheckCircle2 size={14} className="devhub-topic-check" />}
                </div>
                <span className="devhub-topic-desc">{topic.description}</span>
                <span style={{ fontSize: 9, color: AppleColors.labelTertiary, marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={10} /> {topic.duration}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* CORE WORKSPACE */}
      <div className="devhub-workspace">
        <main className="devhub-main-panel">
          {/* Confetti canvas overlay */}
          <canvas 
            ref={confettiCanvasRef} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}
          />

          {/* Active repo overview banner */}
          <div className="devhub-repo-overview">
            <div className="devhub-repo-overview-content">
              <div className="devhub-repo-overview-header">
                <h1 className="devhub-repo-overview-title">{activeRepo.name}</h1>
                <span className="devhub-repo-author">by {activeRepo.author}</span>
              </div>
              <p className="devhub-repo-desc">{activeRepo.description}</p>
              
              <div className="devhub-repo-links">
                <a 
                  href={activeRepo.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="devhub-btn devhub-btn-primary"
                  style={{ '--active-accent': CATEGORY_ACCENT[activeRepo.category] } as React.CSSProperties}
                  onClick={() => triggerFeedback('medium')}
                >
                  <ExternalLink size={14} />
                  <span>Open on GitHub</span>
                </a>
              </div>
            </div>

            {/* Gaming Radar chart */}
            <div className="devhub-radar-box">
              <canvas ref={radarCanvasRef} width={130} height={130} style={{ width: '130px', height: '130px' }} />
              <div style={{ position: 'absolute', bottom: 4, fontSize: 8, color: AppleColors.labelTertiary, textAlign: 'center', width: '100%' }}>
                Skill Balance
              </div>
            </div>
          </div>

          {/* Reading panel */}
          <div className="devhub-reader-workspace">
            {activeTopic ? (
              <>
                <div className="devhub-reader-header">
                  <div className="devhub-reader-title-info">
                    <h2 className="devhub-reader-title">{activeTopic.title}</h2>
                    <span className="devhub-reading-time">
                      <Clock size={12} />
                      <span>{activeTopic.duration} read</span>
                    </span>
                  </div>

                  <div className="devhub-reader-actions">
                    <button
                      className={`devhub-complete-btn ${completedTopics[activeTopic.id] ? 'completed' : ''}`}
                      onClick={() => toggleTopicCompleted(activeTopic.id)}
                    >
                      {completedTopics[activeTopic.id] ? (
                        <>
                          <Check size={14} />
                          <span>Topic Completed</span>
                        </>
                      ) : (
                        <>
                          <Circle size={14} />
                          <span>Mark as Complete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="devhub-reader-scroll">
                  {isMdLoading ? (
                    <div className="devhub-loader-container">
                      <div className="devhub-spinner" style={{ '--active-accent': CATEGORY_ACCENT[activeRepo.category] } as React.CSSProperties} />
                      <span>Syncing repository documentation...</span>
                    </div>
                  ) : (
                    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60 }}>
                      {renderMarkdown(markdownContent)}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="devhub-loader-container">
                <Info size={32} style={{ color: AppleColors.labelTertiary }} />
                <span>Select a topic to start learning.</span>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT PANEL: POMODORO TIMER AND AUDIO */}
        <aside className="devhub-pomodoro-panel">
          {/* POMODORO TIMER CARD */}
          <div className="devhub-pomodoro-card">
            <span className="devhub-pomodoro-title">
              <Clock size={12} style={{ color: AppleColors.pink }} /> Focus Companion
            </span>

            <div className="devhub-pomodoro-circle-box">
              <canvas ref={pomoCanvasRef} width={110} height={110} style={{ width: '110px', height: '110px', position: 'absolute', top: 0, left: 0 }} />
              <div className="devhub-pomodoro-time">{formattedPomoTime}</div>
            </div>

            <div className="devhub-pomodoro-actions">
              <button 
                className={`devhub-pomo-btn ${isPomoActive ? 'active' : ''}`} 
                onClick={togglePomoTimer}
              >
                {isPomoActive ? <Square size={14} /> : <Play size={14} />}
              </button>
              <button 
                className="devhub-pomo-btn"
                onClick={resetPomoTimer}
              >
                Reset
              </button>
            </div>
          </div>

          {/* FOCUS SOUND SYNTH CARD */}
          <div className="devhub-sound-card">
            <span className="devhub-sound-title">
              <Sparkles size={11} style={{ color: AppleColors.purple }} /> Sound Generator
            </span>
            <button 
              className={`devhub-sound-btn ${isAmbientPlaying ? 'playing' : ''}`}
              onClick={toggleAmbientFocusAudio}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {isAmbientPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>Synthesize Rain</span>
              </div>
              <span style={{ fontSize: 9, opacity: 0.7 }}>
                {isAmbientPlaying ? 'PLAYING' : 'OFF'}
              </span>
            </button>
            <div style={{ fontSize: 9, color: AppleColors.labelTertiary, marginTop: 6, lineHeight: 1.3, padding: '0 4px' }}>
              Deep binaural lowpass-filtered noise arpeggiated entirely via Web Audio API. No network bandwidth required.
            </div>
          </div>

          {/* GENERAL INFO BOX */}
          <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', fontSize: 10, color: AppleColors.labelTertiary, lineHeight: 1.4 }}>
            💡 Completing topics expands your Radar Chart. Completing focus sessions rewards +200 XP. Build your dev skills daily.
          </div>
        </aside>
      </div>
    </div>
  );
}
