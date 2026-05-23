import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
    Target, BookOpen, Brain, Trophy, ChevronRight, Search, X,
    Clock, Zap, Play, Minus, Plus, FileText, ExternalLink, Sparkles,
    Cpu, Terminal, CheckCircle2, Circle, Map, ArrowLeft, Code2
} from 'lucide-react';
import CsDevHub from './CsDevHub';
import { ALL_AI_TOPICS, type AITopic } from './data/aiTopics';
import { CEO_SKILLS, type CEOSkill } from './data/ceoSkills';
import { ALL_BOOKS, type Book } from './data/books';
import { POLYMATH_METHODS, RESILIENCE_ACTIVITIES, TOP_BILLIONAIRE_SKILLS, type PolymathMethod } from './data/polymathMethods';
import { getResourcesForTopic } from './data/topicResources';
import { getResourcesForSkill } from './data/skillResources';
import { ALL_PAPERS, type Paper } from './data/papers';
import { AI_ENGINEERING_PHASES, AI_ENGINEERING_GLOSSARY } from './data/aiEngineering';
import { AI_BEGINNERS_PHASES } from './data/aiBeginnersData';
import { MADE_WITH_ML_PHASES } from './data/madeWithMlData';
import {
    getAllTopicsProgress, getAllSkillsProgress, getAllBooksProgress, getAllMethodsProgress,
    getAllResilienceProgress, completeResilienceActivity,
    setTopicStatus, setSkillLevel, setBookStatus, updateBookPage,
    getAIFSProgress, setAIFSLessonStatus, extractAIFSPath,
    getDevRoadmapProgress, setDevRoadmapNodeStatus, isDevRoadmapNodeComplete,
    incrementMethodPractice, setMethodMastered,
    getAIBeginnersProgress, setAIBeginnersLessonStatus,
    getMadeWithMlProgress, setMadeWithMlLessonStatus,
    type TopicProgress, type SkillProgress, type BookProgress, type TopicStatus, type BookStatus,
    type MethodProgress, type ResilienceProgress
} from './services/progressStore';
import { triggerFeedback } from './services/feedback';

// Breakpoints for responsiveness - handled via responsive class styles

type RoadmapTab = 'topics' | 'skills' | 'books' | 'polymath' | 'milestones' | 'papers' | 'ai-engineering' | 'ai-glossary' | 'dev-roadmaps' | 'ai-beginners' | 'made-with-ml' | 'cs-dev';

export interface AIFSLesson {
    name: string;
    status: string;
    type: string;
    lang: string;
    url: string;
    summary: string;
    keywords: string;
    phaseId?: number;
    phaseName?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// APPLE HIG COLOR SYSTEM - Uses CSS variables for dark mode support
// ═══════════════════════════════════════════════════════════════════════════════

const AppleColors = {
    // System Colors (iOS 17+)
    blue: '#007AFF',
    green: '#34C759',
    indigo: '#5856D6',
    orange: '#FF9500',
    pink: '#FF2D55',
    purple: '#AF52DE',
    red: '#FF3B30',
    teal: '#5AC8FA',
    yellow: '#FFCC00',

    // Use CSS variables for theme-aware colors
    labelPrimary: 'var(--text-primary)',
    labelSecondary: 'var(--text-secondary)',
    labelTertiary: 'var(--text-tertiary)',

    // Glass backgrounds using CSS variables
    glass: 'var(--glass-bg)',
    glassBorder: 'var(--glass-border)',
    glassBorderLight: 'var(--glass-border-light)',

    // Fills
    fillPrimary: 'rgba(255, 255, 255, 0.12)',
    fillSecondary: 'rgba(255, 255, 255, 0.08)',
    fillTertiary: 'rgba(255, 255, 255, 0.06)',
    fillQuaternary: 'rgba(255, 255, 255, 0.04)',

    // Separator
    separator: 'rgba(255, 255, 255, 0.1)',
};

// ═══════════════════════════════════════════════════════════════════════════════
// APPLE-STYLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Circular Progress Ring - Apple Fitness style
function ProgressRing({
    progress,
    color = AppleColors.blue,
    size = 80,
    strokeWidth = 8,
    showLabel = true
}: {
    progress: number;
    color?: string;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                {/* Background ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={AppleColors.fillTertiary}
                    strokeWidth={strokeWidth}
                />
                {/* Progress ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                />
            </svg>
            {showLabel && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}>
                    <span style={{
                        fontSize: size * 0.25,
                        fontWeight: 700,
                        color: AppleColors.labelPrimary,
                        fontVariantNumeric: 'tabular-nums',
                    }}>
                        {Math.round(progress)}%
                    </span>
                </div>
            )}
        </div>
    );
}

// Linear Progress Bar - Apple style
function ProgressBar({
    value,
    max,
    color = AppleColors.blue,
    height = 6,
}: {
    value: number;
    max: number;
    color?: string;
    height?: number;
}) {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

    return (
        <div style={{
            width: '100%',
            height,
            background: AppleColors.fillTertiary,
            borderRadius: height / 2,
            overflow: 'hidden',
        }}>
            <div style={{
                width: `${percentage}%`,
                height: '100%',
                background: color,
                borderRadius: height / 2,
                transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }} />
        </div>
    );
}

// Status Pill - Apple style
function StatusPill({ status }: { status: string }) {
    const configs: Record<string, { bg: string; color: string; label: string }> = {
        not_started: {
            bg: AppleColors.fillSecondary,
            color: AppleColors.labelSecondary,
            label: 'Not Started'
        },
        in_progress: {
            bg: 'rgba(255, 149, 0, 0.15)',
            color: AppleColors.orange,
            label: 'In Progress'
        },
        completed: {
            bg: 'rgba(52, 199, 89, 0.15)',
            color: AppleColors.green,
            label: 'Completed'
        },
    };
    const config = configs[status] || configs.not_started;

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            background: config.bg,
            color: config.color,
        }}>
            {config.label}
        </span>
    );
}

// Glass Card - Apple Liquid Glass style
function GlassCard({
    children,
    onClick,
    padding = 16,
    hoverable = false,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    padding?: number;
    hoverable?: boolean;
}) {
    return (
        <div
            onClick={() => {
                if (onClick) {
                    triggerFeedback('light');
                    onClick();
                }
            }}
            style={{
                background: AppleColors.glass,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: 16,
                border: `0.5px solid ${AppleColors.separator}`,
                padding,
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transformOrigin: 'center center',
            }}
            onMouseEnter={(e) => {
                if (hoverable) {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
            }}
            onMouseLeave={(e) => {
                if (hoverable) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.borderColor = AppleColors.separator;
                }
            }}
            onMouseDown={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = 'scale(0.98)';
                }
            }}
            onMouseUp={(e) => {
                if (onClick && hoverable) {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                } else if (onClick) {
                    e.currentTarget.style.transform = 'scale(1)';
                }
            }}
        >
            {children}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOPIC CARD - Minimal Apple Design
// ═══════════════════════════════════════════════════════════════════════════════

function TopicCard({ topic, progress, onClick }: {
    topic: AITopic;
    progress?: TopicProgress;
    onClick: () => void;
}) {
    const status = progress?.status || topic.status || 'not_started';
    const difficultyColor = topic.difficulty >= 8 ? AppleColors.red :
        topic.difficulty >= 6 ? AppleColors.orange :
            topic.difficulty >= 4 ? AppleColors.yellow : AppleColors.green;

    return (
        <GlassCard onClick={onClick} hoverable padding={16}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 12,
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6
                    }}>
                        <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: AppleColors.blue,
                            background: 'rgba(0, 122, 255, 0.10)',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontFamily: 'SF Mono, monospace',
                        }}>
                            #{topic.id}
                        </span>
                        <span style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: AppleColors.purple,
                        }}>
                            {topic.quarter}
                        </span>
                    </div>
                    <h4 style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: AppleColors.labelPrimary,
                        lineHeight: 1.35,
                        marginBottom: 4,
                    }}>
                        {topic.name}
                    </h4>
                    <p style={{
                        fontSize: 13,
                        color: AppleColors.labelSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                    }}>
                        <Brain size={12} />
                        {topic.category}
                    </p>
                </div>
                <StatusPill status={status} />
            </div>

            {/* Meta info */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                paddingTop: 12,
                borderTop: `1px solid ${AppleColors.separator}`,
            }}>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    color: AppleColors.labelTertiary,
                }}>
                    <Clock size={12} />
                    {topic.estimatedHours}h
                </span>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    color: difficultyColor,
                    fontWeight: 500,
                }}>
                    <Zap size={12} />
                    {topic.difficulty}/10
                </span>
                {topic.keyPapers.length > 0 && (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: AppleColors.labelTertiary,
                    }}>
                        <FileText size={12} />
                        {topic.keyPapers.length} papers
                    </span>
                )}
            </div>
        </GlassCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKILL CARD - Apple Design
// ═══════════════════════════════════════════════════════════════════════════════

function SkillCard({ skill, progress, onClick }: {
    skill: CEOSkill;
    progress?: SkillProgress;
    onClick: () => void;
}) {
    const level = progress?.currentLevel ?? skill.currentLevel ?? 0;
    const percentage = (level / 10) * 100;

    return (
        <GlassCard onClick={onClick} hoverable padding={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <ProgressRing
                    progress={percentage}
                    color={AppleColors.purple}
                    size={56}
                    strokeWidth={5}
                    showLabel={false}
                />
                <div style={{ flex: 1 }}>
                    <h4 style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: AppleColors.labelPrimary,
                        marginBottom: 4,
                    }}>
                        {skill.name}
                    </h4>
                    <p style={{
                        fontSize: 12,
                        color: AppleColors.labelSecondary,
                        marginBottom: 6,
                    }}>
                        {skill.category}
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}>
                        <span style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: AppleColors.purple,
                        }}>
                            {level}
                        </span>
                        <span style={{
                            fontSize: 12,
                            color: AppleColors.labelTertiary,
                        }}>
                            / 10
                        </span>
                    </div>
                </div>
                <ChevronRight size={20} color={AppleColors.separator} />
            </div>
        </GlassCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOK CARD - Apple Design
// ═══════════════════════════════════════════════════════════════════════════════

function BookCard({ book, progress, onClick }: {
    book: Book;
    progress?: BookProgress;
    onClick: () => void;
}) {
    const status = progress?.status || book.status || 'not_started';
    const currentPage = progress?.currentPage ?? 0;
    const readProgress = book.pages > 0 ? (currentPage / book.pages) * 100 : 0;

    return (
        <GlassCard onClick={onClick} hoverable padding={16}>
            <div style={{ display: 'flex', gap: 14 }}>
                {/* Book Cover */}
                {book.coverUrl ? (
                    <img
                        src={book.coverUrl}
                        alt={book.title}
                        style={{
                            width: 56,
                            height: 80,
                            borderRadius: 6,
                            objectFit: 'cover',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div style={{
                        width: 56,
                        height: 80,
                        borderRadius: 6,
                        background: `linear-gradient(135deg, ${AppleColors.orange}30, ${AppleColors.pink}30)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <BookOpen size={24} color={AppleColors.orange} />
                    </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 8,
                        marginBottom: 4,
                    }}>
                        <h4 style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: AppleColors.labelPrimary,
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}>
                            {book.title}
                        </h4>
                        <StatusPill status={status} />
                    </div>
                    <p style={{
                        fontSize: 12,
                        color: AppleColors.labelSecondary,
                        marginBottom: 8,
                    }}>
                        {book.author}
                    </p>

                    {/* Progress */}
                    <div style={{ marginTop: 8 }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 4,
                            fontSize: 11,
                            color: AppleColors.labelTertiary,
                        }}>
                            <span>{currentPage} / {book.pages} pages</span>
                            <span>{Math.round(readProgress)}%</span>
                        </div>
                        <ProgressBar value={currentPage} max={book.pages} color={AppleColors.green} />
                    </div>

                    {/* Link */}
                    {book.link && (
                        <a
                            href={book.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                marginTop: 8,
                                fontSize: 12,
                                color: AppleColors.blue,
                                textDecoration: 'none',
                            }}
                        >
                            <ExternalLink size={12} />
                            View Book
                        </a>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MILESTONE CARD - Apple Design
// ═══════════════════════════════════════════════════════════════════════════════

function MilestoneCard({ quarter, items }: {
    quarter: string;
    items: { label: string; target: string; color: string }[];
}) {
    return (
        <GlassCard padding={20}>
            <h3 style={{
                fontSize: 17,
                fontWeight: 700,
                color: AppleColors.labelPrimary,
                marginBottom: 16,
            }}>
                {quarter}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: `${item.color}08`,
                        borderRadius: 10,
                        borderLeft: `3px solid ${item.color}`,
                    }}>
                        <span style={{
                            fontSize: 13,
                            color: AppleColors.labelSecondary
                        }}>
                            {item.label}
                        </span>
                        <span style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: item.color,
                        }}>
                            {item.target}
                        </span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// METHOD CARD - Polymath Learning Methods (Apple Design)
// ═══════════════════════════════════════════════════════════════════════════════

function MethodCard({ method, progress, onPractice, onMasterToggle }: {
    method: PolymathMethod;
    progress?: MethodProgress;
    onPractice: () => void;
    onMasterToggle: () => void;
}) {
    const practiceCount = progress?.practiceCount ?? 0;
    const isMastered = progress?.mastered ?? false;

    return (
        <GlassCard hoverable padding={20}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 28, lineHeight: 1 }}>{method.emoji}</span>
                        <h4 style={{ fontSize: 17, fontWeight: 700, color: AppleColors.labelPrimary, lineHeight: 1.2 }}>
                            {method.shortName}
                        </h4>
                    </div>
                    <p style={{ fontSize: 12, color: method.color, fontWeight: 600, marginBottom: 4 }}>
                        {method.master}
                    </p>
                </div>
                {isMastered && (
                    <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: 'rgba(52, 199, 89, 0.15)', color: AppleColors.green }}>
                        ✓ Mastered
                    </span>
                )}
            </div>
            <p style={{ fontSize: 13, color: AppleColors.labelSecondary, lineHeight: 1.5, marginBottom: 16 }}>
                {method.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, paddingTop: 12, borderTop: `1px solid ${AppleColors.separator}` }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: AppleColors.labelTertiary }}>
                    <Clock size={12} />{method.estimatedMasteryWeeks} weeks
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: method.color, fontWeight: 500 }}>
                    <Zap size={12} />{practiceCount} practices
                </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); triggerFeedback('medium'); onPractice(); }}
                    style={{ flex: 1, padding: '10px 16px', borderRadius: 10, border: 'none', background: method.color, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Play size={14} />Log Practice
                </button>
                <button onClick={(e) => { e.stopPropagation(); triggerFeedback(isMastered ? 'light' : 'success'); onMasterToggle(); }}
                    style={{ padding: '10px 16px', borderRadius: 10, border: `1px solid ${isMastered ? AppleColors.green : AppleColors.separator}`, background: isMastered ? 'rgba(52, 199, 89, 0.12)' : AppleColors.fillQuaternary, color: isMastered ? AppleColors.green : AppleColors.labelSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {isMastered ? 'Unmaster' : 'Mark Mastered'}
                </button>
            </div>
        </GlassCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESILIENCE CARD - Daily Habits (Apple Design)
// ═══════════════════════════════════════════════════════════════════════════════

function ResilienceCard({ activity, progress, onComplete }: {
    activity: typeof RESILIENCE_ACTIVITIES[0];
    progress?: ResilienceProgress;
    onComplete: () => void;
}) {
    const completedToday = progress?.completedToday ?? false;
    const streak = progress?.streak ?? 0;

    return (
        <div onClick={() => { if (!completedToday) { triggerFeedback('success'); onComplete(); } }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: completedToday ? 'rgba(52, 199, 89, 0.08)' : AppleColors.fillQuaternary, borderRadius: 14, cursor: completedToday ? 'default' : 'pointer', border: completedToday ? `1px solid ${AppleColors.green}30` : `1px solid ${AppleColors.separator}`, transition: 'all 0.2s ease' }}>
            <span style={{ fontSize: 24, opacity: completedToday ? 1 : 0.6 }}>{activity.emoji}</span>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: completedToday ? AppleColors.green : AppleColors.labelPrimary, marginBottom: 2 }}>{activity.name}</div>
                <div style={{ fontSize: 12, color: AppleColors.labelTertiary }}>Target: {activity.target} {activity.unit}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                {completedToday ? <span style={{ fontSize: 20, color: AppleColors.green }}>✓</span> : <span style={{ fontSize: 12, color: AppleColors.labelTertiary }}>Tap</span>}
                {streak > 0 && <div style={{ fontSize: 11, color: AppleColors.orange, fontWeight: 600, marginTop: 2 }}>🔥 {streak} day streak</div>}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MERMAID DIAGRAM & PREMIUM CODE BLOCK RENDERERS
// ═══════════════════════════════════════════════════════════════════════════════

let mermaidPromise: Promise<any> | null = null;
function loadMermaid(): Promise<any> {
    if (typeof window === 'undefined') return Promise.resolve(null);
    if ((window as any).mermaid) {
        return Promise.resolve((window as any).mermaid);
    }
    if (mermaidPromise) {
        return mermaidPromise;
    }
    mermaidPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
        script.async = true;
        script.onload = () => {
            const mermaid = (window as any).mermaid;
            try {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'dark',
                    themeVariables: {
                        background: '#141416',
                        primaryColor: '#007aff',
                        primaryTextColor: '#fff',
                        lineColor: '#3a3a3c',
                    },
                    securityLevel: 'loose',
                });
                resolve(mermaid);
            } catch (err) {
                reject(err);
            }
        };
        script.onerror = (err) => {
            mermaidPromise = null;
            reject(err);
        };
        document.body.appendChild(script);
    });
    return mermaidPromise;
}

interface MermaidDiagramProps {
    chart: string;
}

function MermaidDiagram({ chart }: MermaidDiagramProps) {
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        loadMermaid()
            .then(async (mermaid) => {
                if (!mermaid) return;
                const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
                const { svg: renderedSvg } = await mermaid.render(id, chart);
                if (isMounted) {
                    setSvg(renderedSvg);
                    setError(null);
                }
            })
            .catch((err) => {
                console.error('Mermaid render failure:', err);
                if (isMounted) {
                    setError(err.message || 'Failed to render Mermaid chart');
                }
            });

        return () => {
            isMounted = false;
        };
    }, [chart]);

    if (error) {
        return (
            <div style={{
                background: 'rgba(255, 59, 48, 0.08)',
                border: '1px solid rgba(255, 59, 48, 0.2)',
                padding: '16px',
                borderRadius: '8px',
                color: '#ff453a',
                fontSize: '13px',
                fontFamily: 'monospace',
                margin: '16px 0',
                whiteSpace: 'pre-wrap'
            }}>
                <strong>Mermaid rendering error:</strong>
                <pre style={{ margin: '8px 0 0 0', opacity: 0.8, fontSize: '12px' }}>{chart}</pre>
            </div>
        );
    }

    if (!svg) {
        return (
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '30px',
                borderRadius: '8px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '13px',
                margin: '16px 0',
                border: '1px dashed rgba(255,255,255,0.1)'
            }}>
                Rendering diagram...
            </div>
        );
    }

    return (
        <div 
            dangerouslySetInnerHTML={{ __html: svg }}
            className="mermaid-container"
            style={{
                background: '#141416',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px',
                borderRadius: '12px',
                margin: '20px 0',
                display: 'flex',
                justifyContent: 'center',
                overflowX: 'auto',
            }}
        />
    );
}

interface PremiumCodeBlockProps {
    code: string;
    lang: string;
}

function PremiumCodeBlock({ code, lang }: PremiumCodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        triggerFeedback('light');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            background: '#0e0f12',
            borderRadius: 10,
            border: `1px solid rgba(255, 255, 255, 0.08)`,
            margin: '16px 0',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.02)',
                borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
            }}>
                <span style={{
                    fontSize: 11,
                    fontFamily: 'monospace',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                }}>
                    {lang || 'code'}
                </span>
                <button
                    onClick={handleCopy}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: copied ? AppleColors.green : 'rgba(255,255,255,0.5)',
                        fontSize: 11,
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                    }}
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre style={{
                margin: 0,
                padding: 16,
                overflowX: 'auto',
                fontFamily: 'monospace',
                fontSize: 13,
                color: '#e4e4e7',
                lineHeight: 1.5,
            }}>
                <code>{code}</code>
            </pre>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTWEIGHT MARKDOWN FORMATTER FOR PREMIUM UI
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTWEIGHT MARKDOWN FORMATTER FOR PREMIUM UI - WITH HTML PREPROCESSING & PARAGRAPH GROUPING
// ═══════════════════════════════════════════════════════════════════════════════

const preprocessMarkdown = (text: string): string => {
    if (!text) return '';
    let processed = text;
    
    // Replace HTML entities
    processed = processed.replace(/&nbsp;/g, ' ');
    processed = processed.replace(/&amp;/g, '&');
    
    // Replace <br> tags with newline
    processed = processed.replace(/<br\s*\/?>/gi, '\n');
    
    // Convert <h1>...</h1> to # ...
    processed = processed.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
    // Convert <h2>...</h2> to ## ...
    processed = processed.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
    // Convert <h3>...</h3> to ### ...
    processed = processed.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
    // Convert <h4>...</h4> to #### ...
    processed = processed.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');
    
    // Convert <img ... src="url" ...> to ![] (url)
    processed = processed.replace(/<img[^>]*src=["'](.*?)["'][^>]*>/gi, (match, src) => {
        const altMatch = match.match(/alt=["'](.*?)["']/i);
        const alt = altMatch ? altMatch[1] : '';
        return `![${alt}](${src})`;
    });

    // Convert <a href="url">text</a> to [text](url)
    processed = processed.replace(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

    // Strip other common block HTML tags but keep their contents
    processed = processed.replace(/<div[^>]*>/gi, '');
    processed = processed.replace(/<\/div>/gi, '\n');
    processed = processed.replace(/<p[^>]*>/gi, '');
    processed = processed.replace(/<\/p>/gi, '\n');
    processed = processed.replace(/<span[^>]*>/gi, '');
    processed = processed.replace(/<\/span>/gi, '');
    
    // Strip bold/strong/em tags if they are inside
    processed = processed.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
    processed = processed.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
    processed = processed.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
    processed = processed.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');
    
    // Replace html horizontal rule
    processed = processed.replace(/<hr\s*\/?>/gi, '\n---\n');

    // Collapse blank lines between consecutive lines that are inline links/images
    // This merges inline elements separated by blank lines into a single paragraph
    processed = processed.replace(/((?:\[|!\[)[^\n]*)\n+(?=\s*(?:\[|!\[))/gi, '$1 ');

    // Collapse three or more newlines into exactly two newlines
    processed = processed.replace(/\n{3,}/g, '\n\n');

    return processed;
};

const parseInlineStyles = (text: string, lineKey: string | number): React.ReactNode => {
    if (!text) return '';

    const tokens: React.ReactNode[] = [];
    let remaining = text;
    let keyCounter = 0;

    while (remaining.length > 0) {
        const linkedImgIndex = remaining.search(/\[!\[.*?\]\(.*?\)\]\(.*?\)/);
        const imgIndex = remaining.search(/!\[.*?\]\(.*?\)/);
        const linkIndex = remaining.search(/\[.*?\]\(.*?\)/);
        const boldIndex = remaining.search(/\*\*.*?\*\*/);
        const codeIndex = remaining.search(/`.*?`/);

        const indices = [
            { type: 'linkedImg', index: linkedImgIndex },
            { type: 'img', index: imgIndex },
            { type: 'link', index: linkIndex },
            { type: 'bold', index: boldIndex },
            { type: 'code', index: codeIndex }
        ].filter(item => item.index >= 0);

        if (indices.length === 0) {
            tokens.push(<span key={`text-${lineKey}-${keyCounter++}`}>{remaining}</span>);
            break;
        }

        indices.sort((a, b) => a.index - b.index);
        const earliest = indices[0];

        if (earliest.index > 0) {
            tokens.push(
                <span key={`text-${lineKey}-${keyCounter++}`}>
                    {remaining.substring(0, earliest.index)}
                </span>
            );
        }

        const matchedString = remaining.substring(earliest.index);
        if (earliest.type === 'linkedImg') {
            const match = matchedString.match(/^\[!\[(.*?)\]\((.*?)\)\]\((.*?)\)/);
            if (match) {
                const alt = match[1];
                const imgUrl = match[2];
                const linkUrl = match[3];
                tokens.push(
                    <a 
                        key={`linked-img-${lineKey}-${keyCounter++}`} 
                        href={linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}
                    >
                        <img 
                            src={imgUrl} 
                            alt={alt} 
                            style={{ maxHeight: 20, verticalAlign: 'middle', borderRadius: 4 }} 
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                    </a>
                );
                remaining = remaining.substring(earliest.index + match[0].length);
                continue;
            }
        } else if (earliest.type === 'img') {
            const match = matchedString.match(/^!\[(.*?)\]\((.*?)\)/);
            if (match) {
                const alt = match[1];
                const imgUrl = match[2];
                tokens.push(
                    <img 
                        key={`img-${lineKey}-${keyCounter++}`}
                        src={imgUrl} 
                        alt={alt} 
                        style={{ maxHeight: 20, verticalAlign: 'middle', margin: '0 4px', borderRadius: 4 }}
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                );
                remaining = remaining.substring(earliest.index + match[0].length);
                continue;
            }
        } else if (earliest.type === 'link') {
            const match = matchedString.match(/^\[(.*?)\]\((.*?)\)/);
            if (match) {
                const linkText = match[1];
                const linkUrl = match[2];
                tokens.push(
                    <a 
                        key={`link-${lineKey}-${keyCounter++}`} 
                        href={linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: AppleColors.blue, textDecoration: 'none', fontWeight: 500 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {parseInlineStyles(linkText, `sub-${lineKey}-${keyCounter}`)}
                    </a>
                );
                remaining = remaining.substring(earliest.index + match[0].length);
                continue;
            }
        } else if (earliest.type === 'bold') {
            const match = matchedString.match(/^\*\*(.*?)\*\*/);
            if (match) {
                const boldText = match[1];
                tokens.push(
                    <strong key={`bold-${lineKey}-${keyCounter++}`} style={{ color: AppleColors.labelPrimary, fontWeight: 700 }}>
                        {parseInlineStyles(boldText, `sub-${lineKey}-${keyCounter}`)}
                    </strong>
                );
                remaining = remaining.substring(earliest.index + match[0].length);
                continue;
            }
        } else if (earliest.type === 'code') {
            const match = matchedString.match(/^`(.*?)`/);
            if (match) {
                const codeText = match[1];
                tokens.push(
                    <code key={`code-${lineKey}-${keyCounter++}`} style={{
                        fontFamily: 'monospace',
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: '0.9em',
                        color: AppleColors.orange,
                        border: `1px solid ${AppleColors.glassBorder}`
                    }}>
                        {codeText}
                    </code>
                );
                remaining = remaining.substring(earliest.index + match[0].length);
                continue;
            }
        }

        tokens.push(<span key={`fallback-${lineKey}-${keyCounter++}`}>{remaining[0]}</span>);
        remaining = remaining.substring(1);
    }

    return tokens;
};

const renderMarkdown = (text: string | null) => {
    if (!text) return null;

    const cleanText = preprocessMarkdown(text);
    const lines = cleanText.split('\n');
    const elements: React.ReactNode[] = [];
    
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLang = '';
    let listItems: React.ReactNode[] = [];
    let tableRows: React.ReactNode[][] = [];
    let paragraphLines: string[] = [];

    const flushList = (key: string | number) => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`list-${key}`} style={{ margin: '12px 0 12px 20px', padding: 0, listStyleType: 'disc' }}>
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

    const flushParagraph = (key: string | number) => {
        if (paragraphLines.length > 0) {
            const paragraphText = paragraphLines.join(' ').trim();
            if (paragraphText) {
                if (paragraphText.startsWith('![') && paragraphText.endsWith(')') && !paragraphText.startsWith('[![')) {
                    const match = paragraphText.match(/^!\[(.*?)\]\((.*?)\)$/);
                    if (match) {
                        const alt = match[1];
                        const src = match[2];
                        elements.push(
                            <div key={`img-block-${key}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px 0' }}>
                                <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 8, border: `1px solid ${AppleColors.glassBorder}` }} />
                                {alt && <span style={{ fontSize: 12, color: AppleColors.labelSecondary, marginTop: 8, fontStyle: 'italic' }}>{alt}</span>}
                            </div>
                        );
                        paragraphLines = [];
                        return;
                    }
                }

                elements.push(
                    <p key={`p-${key}`} style={{ fontSize: 15, lineHeight: 1.6, color: AppleColors.labelSecondary, margin: '12px 0' }}>
                        {parseInlineStyles(paragraphText, key)}
                    </p>
                );
            }
            paragraphLines = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
                inCodeBlock = false;
                const finalCode = codeContent.join('\n');
                if (codeLang.toLowerCase() === 'mermaid') {
                    elements.push(
                        <MermaidDiagram key={`mermaid-${i}`} chart={finalCode} />
                    );
                } else {
                    elements.push(
                        <PremiumCodeBlock key={`code-${i}`} code={finalCode} lang={codeLang} />
                    );
                }
                codeContent = [];
                codeLang = '';
            } else {
                flushList(i);
                flushTable(i);
                flushParagraph(i);
                inCodeBlock = true;
                codeLang = trimmedLine.slice(3).trim();
            }
            continue;
        }

        if (inCodeBlock) {
            codeContent.push(line);
            continue;
        }

        if (trimmedLine === '---') {
            flushList(i);
            flushTable(i);
            flushParagraph(i);
            elements.push(
                <hr key={`hr-${i}`} style={{ border: 'none', height: 1, background: 'rgba(255, 255, 255, 0.08)', margin: '20px 0' }} />
            );
            continue;
        }

        if (trimmedLine.startsWith('![') && trimmedLine.endsWith(')') && !trimmedLine.startsWith('[![')) {
            const match = trimmedLine.match(/^!\[(.*?)\]\((.*?)\)$/);
            if (match) {
                flushList(i);
                flushTable(i);
                flushParagraph(i);
                const alt = match[1];
                const src = match[2];
                elements.push(
                    <div key={`img-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px 0' }}>
                        <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 8, border: `1px solid ${AppleColors.glassBorder}` }} />
                        {alt && <span style={{ fontSize: 12, color: AppleColors.labelSecondary, marginTop: 8, fontStyle: 'italic' }}>{alt}</span>}
                    </div>
                );
                continue;
            }
        }

        if (trimmedLine.startsWith('# ')) {
            flushList(i);
            flushTable(i);
            flushParagraph(i);
            elements.push(
                <h2 key={i} style={{ fontSize: 24, fontWeight: 800, color: AppleColors.labelPrimary, margin: '28px 0 14px 0', letterSpacing: '-0.5px' }}>
                    {parseInlineStyles(trimmedLine.slice(2), i)}
                </h2>
            );
            continue;
        }

        if (trimmedLine.startsWith('## ')) {
            flushList(i);
            flushTable(i);
            flushParagraph(i);
            elements.push(
                <h3 key={i} style={{ fontSize: 20, fontWeight: 700, color: AppleColors.labelPrimary, margin: '24px 0 10px 0', letterSpacing: '-0.3px' }}>
                    {parseInlineStyles(trimmedLine.slice(3), i)}
                </h3>
            );
            continue;
        }

        if (trimmedLine.startsWith('### ')) {
            flushList(i);
            flushTable(i);
            flushParagraph(i);
            elements.push(
                <h4 key={i} style={{ fontSize: 17, fontWeight: 600, color: AppleColors.labelPrimary, margin: '18px 0 8px 0' }}>
                    {parseInlineStyles(trimmedLine.slice(4), i)}
                </h4>
            );
            continue;
        }

        if (trimmedLine.startsWith('#### ')) {
            flushList(i);
            flushTable(i);
            flushParagraph(i);
            elements.push(
                <h5 key={i} style={{ fontSize: 12, fontWeight: 600, color: AppleColors.blue, margin: '14px 0 6px 0', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {parseInlineStyles(trimmedLine.slice(5), i)}
                </h5>
            );
            continue;
        }

        if (trimmedLine.startsWith('> ') || trimmedLine === '>') {
            flushList(i);
            flushTable(i);
            flushParagraph(i);
            
            // Collect all consecutive blockquote lines
            const rawQuoteLines: string[] = [trimmedLine === '>' ? '' : trimmedLine.slice(2)];
            while (i + 1 < lines.length) {
                const nextTrimmed = lines[i + 1].trim();
                if (nextTrimmed.startsWith('> ') || nextTrimmed === '>') {
                    i++;
                    rawQuoteLines.push(nextTrimmed === '>' ? '' : nextTrimmed.slice(2));
                } else {
                    break;
                }
            }

            // Reconstruct the body preserving code blocks inside blockquotes
            const quoteContent = rawQuoteLines.join('\n');
            const firstLine = rawQuoteLines[0].trim();

            if (firstLine.startsWith('**') && firstLine.endsWith('**')) {
                const title = firstLine.slice(2, -2).trim();
                const bodyContent = rawQuoteLines.slice(1).join('\n').trim();

                let headerBg = 'rgba(255, 255, 255, 0.04)';
                let borderCol = 'rgba(255, 255, 255, 0.08)';
                let titleCol = '#fff';

                if (title.includes('Local') || title.includes('💻')) {
                    headerBg = 'rgba(10, 132, 255, 0.06)';
                    borderCol = 'rgba(10, 132, 255, 0.15)';
                    titleCol = AppleColors.blue;
                } else if (title.includes('Anyscale') || title.includes('🚀')) {
                    headerBg = 'rgba(255, 159, 10, 0.06)';
                    borderCol = 'rgba(255, 159, 10, 0.15)';
                    titleCol = AppleColors.orange;
                } else if (title.includes('Caution') || title.includes('Warning') || title.includes('Danger') || title.includes('⚠')) {
                    headerBg = 'rgba(255, 69, 58, 0.06)';
                    borderCol = 'rgba(255, 69, 58, 0.15)';
                    titleCol = AppleColors.red;
                } else if (title.includes('Tip') || title.includes('Success') || title.includes('✅')) {
                    headerBg = 'rgba(52, 199, 89, 0.06)';
                    borderCol = 'rgba(52, 199, 89, 0.15)';
                    titleCol = AppleColors.green;
                } else if (title.includes('Note') || title.includes('ℹ')) {
                    headerBg = 'rgba(100, 210, 255, 0.06)';
                    borderCol = 'rgba(100, 210, 255, 0.15)';
                    titleCol = '#64d2ff';
                }

                elements.push(
                    <div key={`admonition-${i}`} style={{
                        margin: '18px 0',
                        borderRadius: 10,
                        border: `1px solid ${borderCol}`,
                        background: 'rgba(255, 255, 255, 0.01)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '8px 16px',
                            background: headerBg,
                            borderBottom: `1px solid ${borderCol}`,
                            fontWeight: 700,
                            fontSize: 13,
                            color: titleCol,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}>
                            {title}
                        </div>
                        <div style={{ padding: '16px 20px', fontSize: 14 }}>
                            {renderMarkdown(bodyContent)}
                        </div>
                    </div>
                );
            } else {
                // Check if first line is a simple note/tip marker
                const noteMatch = firstLine.match(/^\*?(Note|Tip|Warning|Caution|Important|Info)\*?:?$/i);
                if (noteMatch) {
                    const noteName = noteMatch[1];
                    const bodyContent = rawQuoteLines.slice(1).join('\n').trim();
                    let borderCol = AppleColors.blue;
                    if (/warning|caution/i.test(noteName)) borderCol = AppleColors.orange;
                    if (/danger/i.test(noteName)) borderCol = AppleColors.red;
                    if (/tip|success/i.test(noteName)) borderCol = AppleColors.green;
                    elements.push(
                        <div key={`note-${i}`} style={{
                            margin: '12px 0',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderLeft: `3px solid ${borderCol}`,
                            borderRadius: '0 8px 8px 0',
                        }}>
                            <span style={{ fontWeight: 700, color: borderCol, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{noteName} </span>
                            {renderMarkdown(bodyContent)}
                        </div>
                    );
                } else {
                    elements.push(
                        <blockquote key={i} style={{
                            margin: '12px 0',
                            padding: '8px 16px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderLeft: `3px solid ${AppleColors.blue}`,
                            color: AppleColors.labelSecondary,
                            fontStyle: 'italic',
                            borderRadius: '0 8px 8px 0',
                        }}>
                            {renderMarkdown(quoteContent)}
                        </blockquote>
                    );
                }
            }
            continue;
        }

        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            flushTable(i);
            flushParagraph(i);
            const content = trimmedLine.slice(2);
            listItems.push(
                <li key={`li-${i}`} style={{ fontSize: 14, color: AppleColors.labelSecondary, marginBottom: 6, lineHeight: 1.5 }}>
                    {parseInlineStyles(content, i)}
                </li>
            );
            continue;
        }

        // Ordered list: 1. 2. 3. etc.
        if (/^\d+\.\s/.test(trimmedLine)) {
            flushTable(i);
            flushParagraph(i);
            const content = trimmedLine.replace(/^\d+\.\s/, '');
            listItems.push(
                <li key={`oli-${i}`} style={{ fontSize: 14, color: AppleColors.labelSecondary, marginBottom: 6, lineHeight: 1.5 }}>
                    {parseInlineStyles(content, i)}
                </li>
            );
            continue;
        }

        if (trimmedLine.startsWith('|')) {
            flushList(i);
            flushParagraph(i);
            if (trimmedLine.includes('---')) {
                continue;
            }
            const cells = trimmedLine.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            if (cells.length > 0) {
                tableRows.push(cells.map((cell, cIdx) => parseInlineStyles(cell, `cell-${i}-${cIdx}`)));
            }
            continue;
        }

        if (trimmedLine === '') {
            flushList(i);
            flushTable(i);
            flushParagraph(i);
            continue;
        }

        paragraphLines.push(line);
    }

    flushList('final');
    flushTable('final');
    flushParagraph('final');

    return elements;
};

// ═══════════════════════════════════════════════════════════════════════════════
// DETAIL MODAL - Apple Sheet Style
// ═══════════════════════════════════════════════════════════════════════════════

function DetailModal({
    isOpen,
    onClose,
    type,
    data,
    storedProgress,
    onUpdate,
    onOpenPaper
}: {
    isOpen: boolean;
    onClose: () => void;
    type: 'topic' | 'skill' | 'book' | 'paper' | 'aifs-lesson' | 'dev-roadmap-node';
    data: AITopic | CEOSkill | Book | Paper | AIFSLesson | { id: string; label: string; roadmapId: string; roadmapName?: string } | null;
    storedProgress: {
        topics: Record<number, TopicProgress>;
        skills: Record<number, SkillProgress>;
        books: Record<number, BookProgress>;
    };
    onUpdate: () => void;
    onOpenPaper?: (paper: Paper) => void;
}) {
    if (!isOpen || !data) return null;

    const topicData = type === 'topic' ? data as AITopic : null;
    const skillData = type === 'skill' ? data as CEOSkill : null;
    const bookData = type === 'book' ? data as Book : null;
    const paperData = type === 'paper' ? data as Paper : null;
    const aifsData = type === 'aifs-lesson' ? data as AIFSLesson : null;
    const devRoadmapNodeData = type === 'dev-roadmap-node' ? data as { id: string; label: string; roadmapId: string; roadmapName?: string } : null;

    const [lessonMd, setLessonMd] = useState<string | null>(null);
    const [isMdLoading, setIsMdLoading] = useState(false);

    useEffect(() => {
        if (!data || (type !== 'dev-roadmap-node' && type !== 'aifs-lesson')) {
            setLessonMd(null);
            return;
        }

        setIsMdLoading(true);
        setLessonMd(null);

        if (type === 'dev-roadmap-node') {
            const node = data as any;
            const slug = slugify(node.label);
            const url = `/elite-resources/roadmaps/${node.roadmapId}/content/${slug}@${node.id}.md`;

            fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error('Not found');
                    return res.text();
                })
                .then(text => {
                    const cleanText = text.replace(/^#\s+.*?\n+/, '');
                    setLessonMd(cleanText);
                })
                .catch(() => {
                    setLessonMd(`Learn about **${node.label}** in the context of the **${node.roadmapName || node.roadmapId}** curriculum.`);
                })
                .finally(() => {
                    setIsMdLoading(false);
                });
        } else if (type === 'aifs-lesson') {
            const lesson = data as any;
            const relativePath = extractAIFSPath(lesson.url);
            if (!relativePath) {
                setLessonMd(lesson.summary || 'No detailed content available.');
                setIsMdLoading(false);
                return;
            }
            const url = `/elite-resources/aifs/${relativePath}/docs/en.md`;

            fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error('Not found');
                    return res.text();
                })
                .then(text => {
                    const cleanText = text.replace(/^#\s+.*?\n+/, '');
                    setLessonMd(cleanText);
                })
                .catch(() => {
                    setLessonMd(lesson.summary || 'No detailed content available.');
                })
                .finally(() => {
                    setIsMdLoading(false);
                });
        }
    }, [type, data]);

    const topicProgress = topicData ? storedProgress.topics[topicData.id] : null;
    const skillProgress = skillData ? storedProgress.skills[skillData.id] : null;
    const bookProgress = bookData ? storedProgress.books[bookData.id] : null;

    const handleTopicStatusChange = (status: TopicStatus) => {
        if (topicData) {
            setTopicStatus(topicData.id, status);
            onUpdate();
        }
    };

    const handleSkillLevelChange = (delta: number) => {
        if (skillData) {
            const currentLevel = skillProgress?.currentLevel ?? skillData.currentLevel ?? 0;
            const newLevel = Math.max(0, Math.min(10, currentLevel + delta));
            setSkillLevel(skillData.id, newLevel);
            onUpdate();
        }
    };

    const handleBookStatusChange = (status: BookStatus) => {
        if (bookData) {
            setBookStatus(bookData.id, status);
            onUpdate();
        }
    };

    // Get resources
    const resources = type === 'topic' && topicData
        ? getResourcesForTopic(topicData.id)
        : type === 'skill' && skillData
            ? getResourcesForSkill(skillData.id)
            : [];

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 24,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: AppleColors.glass,
                    borderRadius: 20,
                    width: '100%',
                    maxWidth: (type === 'paper' || type === 'dev-roadmap-node') ? 720 : 480,
                    maxHeight: '85vh',
                    overflow: 'hidden',
                    boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '16px 20px',
                    borderBottom: `1px solid ${AppleColors.separator}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <h2 style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: AppleColors.labelPrimary,
                    }}>
                        {type === 'topic' ? 'Topic Details' :
                            type === 'skill' ? 'Skill Details' :
                                type === 'book' ? 'Book Details' : 
                                    type === 'paper' ? 'Paper Details' : 
                                        type === 'dev-roadmap-node' ? 'Roadmap Node' : 'Lesson Details'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            background: AppleColors.fillTertiary,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <X size={16} color={AppleColors.labelSecondary} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    padding: 20,
                    maxHeight: 'calc(85vh - 60px)',
                    overflowY: 'auto'
                }}>
                    {/* Topic Details */}
                    {topicData && (
                        <>
                            <h3 style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: AppleColors.labelPrimary,
                                marginBottom: 8,
                            }}>
                                {topicData.name}
                            </h3>
                            <p style={{
                                fontSize: 14,
                                color: AppleColors.labelSecondary,
                                marginBottom: 20,
                            }}>
                                {topicData.category} • {topicData.quarter}
                            </p>

                            {/* Status Buttons */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.labelSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    marginBottom: 8,
                                    display: 'block',
                                }}>
                                    Status
                                </label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {(['not_started', 'in_progress', 'completed'] as TopicStatus[]).map(status => {
                                        const isActive = (topicProgress?.status || topicData.status) === status;
                                        const colors = {
                                            not_started: AppleColors.labelTertiary,
                                            in_progress: AppleColors.orange,
                                            completed: AppleColors.green,
                                        };
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => handleTopicStatusChange(status)}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px 12px',
                                                    borderRadius: 10,
                                                    border: isActive ? `2px solid ${colors[status]}` : '2px solid transparent',
                                                    background: isActive ? `${colors[status]}15` : AppleColors.fillQuaternary,
                                                    color: colors[status],
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Key Papers */}
                            {topicData.keyPapers && topicData.keyPapers.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: AppleColors.labelSecondary,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        marginBottom: 12,
                                        display: 'block',
                                    }}>
                                        Key Papers
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {topicData.keyPapers.map((paperStr, idx) => {
                                            const matchedPaper = findMatchedPaper(paperStr);
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        if (matchedPaper && onOpenPaper) {
                                                            onOpenPaper(matchedPaper);
                                                        } else {
                                                            window.open(`https://scholar.google.com/scholar?q=${encodeURIComponent(paperStr)}`, '_blank');
                                                        }
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '12px 16px',
                                                        background: AppleColors.fillQuaternary,
                                                        borderRadius: 12,
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        textAlign: 'left',
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = AppleColors.fillTertiary;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = AppleColors.fillQuaternary;
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                                        <div style={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: 8,
                                                            background: matchedPaper ? 'rgba(0, 122, 255, 0.12)' : 'rgba(142, 142, 147, 0.12)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0
                                                        }}>
                                                            <FileText size={16} color={matchedPaper ? AppleColors.blue : AppleColors.labelSecondary} />
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{
                                                                fontSize: 14,
                                                                fontWeight: 600,
                                                                color: AppleColors.labelPrimary,
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}>
                                                                {matchedPaper ? matchedPaper.title : paperStr}
                                                            </div>
                                                            {matchedPaper ? (
                                                                <div style={{
                                                                    fontSize: 12,
                                                                    color: AppleColors.labelTertiary,
                                                                    marginTop: 2
                                                                }}>
                                                                    {matchedPaper.year} • {matchedPaper.domain}
                                                                </div>
                                                            ) : (
                                                                <div style={{
                                                                    fontSize: 12,
                                                                    color: AppleColors.labelTertiary,
                                                                    marginTop: 2
                                                                }}>
                                                                    Search on Google Scholar
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div style={{ flexShrink: 0, marginLeft: 12 }}>
                                                        {matchedPaper ? (
                                                            <div style={{
                                                                padding: '4px 10px',
                                                                background: AppleColors.blue,
                                                                color: '#fff',
                                                                borderRadius: 20,
                                                                fontSize: 11,
                                                                fontWeight: 600
                                                            }}>
                                                                View
                                                            </div>
                                                        ) : (
                                                            <ExternalLink size={16} color={AppleColors.labelTertiary} />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Skill Details */}
                    {skillData && (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <ProgressRing
                                    progress={((skillProgress?.currentLevel ?? skillData.currentLevel) / 10) * 100}
                                    color={AppleColors.purple}
                                    size={100}
                                    strokeWidth={8}
                                />
                            </div>
                            <h3 style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: AppleColors.labelPrimary,
                                marginBottom: 8,
                                textAlign: 'center',
                            }}>
                                {skillData.name}
                            </h3>
                            <p style={{
                                fontSize: 14,
                                color: AppleColors.labelSecondary,
                                marginBottom: 24,
                                textAlign: 'center',
                            }}>
                                {skillData.description}
                            </p>

                            {/* Level Controls */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 24,
                                marginBottom: 24,
                            }}>
                                <button
                                    onClick={() => handleSkillLevelChange(-1)}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 22,
                                        background: AppleColors.fillSecondary,
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Minus size={20} color={AppleColors.labelPrimary} />
                                </button>
                                <span style={{
                                    fontSize: 48,
                                    fontWeight: 700,
                                    color: AppleColors.purple,
                                    minWidth: 60,
                                    textAlign: 'center',
                                }}>
                                    {skillProgress?.currentLevel ?? skillData.currentLevel}
                                </span>
                                <button
                                    onClick={() => handleSkillLevelChange(1)}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 22,
                                        background: AppleColors.purple,
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Plus size={20} color="#fff" />
                                </button>
                            </div>
                        </>
                    )}

                    {/* Book Details */}
                    {bookData && (
                        <>
                            <h3 style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: AppleColors.labelPrimary,
                                marginBottom: 4,
                            }}>
                                {bookData.title}
                            </h3>
                            <p style={{
                                fontSize: 14,
                                color: AppleColors.labelSecondary,
                                marginBottom: 20,
                            }}>
                                by {bookData.author}
                            </p>

                            {/* Status Buttons */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.labelSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    marginBottom: 8,
                                    display: 'block',
                                }}>
                                    Reading Status
                                </label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {(['not_started', 'in_progress', 'completed'] as BookStatus[]).map(status => {
                                        const isActive = (bookProgress?.status || bookData.status) === status;
                                        const colors = {
                                            not_started: AppleColors.labelTertiary,
                                            in_progress: AppleColors.orange,
                                            completed: AppleColors.green,
                                        };
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    triggerFeedback('medium');
                                                    handleBookStatusChange(status);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 12px',
                                                    borderRadius: 12,
                                                    border: isActive ? `2px solid ${colors[status]}` : '2px solid transparent',
                                                    background: isActive ? `${colors[status]}20` : AppleColors.fillQuaternary,
                                                    color: colors[status],
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                                }}
                                            >
                                                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Page Progress Slider */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.labelSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    marginBottom: 12,
                                    display: 'block',
                                }}>
                                    Reading Progress
                                </label>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    marginBottom: 12,
                                }}>
                                    <span style={{
                                        fontSize: 32,
                                        fontWeight: 700,
                                        color: AppleColors.green,
                                        minWidth: 80,
                                    }}>
                                        {bookProgress?.currentPage ?? 0}
                                    </span>
                                    <span style={{
                                        fontSize: 14,
                                        color: AppleColors.labelTertiary,
                                    }}>
                                        / {bookData.pages} pages
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={bookData.pages}
                                    value={bookProgress?.currentPage ?? 0}
                                    onChange={(e) => {
                                        const newPage = parseInt(e.target.value);
                                        triggerFeedback('light');
                                        updateBookPage(bookData.id, newPage);
                                        onUpdate();
                                    }}
                                    style={{
                                        width: '100%',
                                        height: 8,
                                        borderRadius: 4,
                                        background: AppleColors.fillSecondary,
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        accentColor: AppleColors.green,
                                    }}
                                />
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: 8,
                                    fontSize: 11,
                                    color: AppleColors.labelTertiary,
                                }}>
                                    <span>0</span>
                                    <span style={{ color: AppleColors.green, fontWeight: 600 }}>
                                        {bookData.pages > 0 ? Math.round(((bookProgress?.currentPage ?? 0) / bookData.pages) * 100) : 0}% complete
                                    </span>
                                    <span>{bookData.pages}</span>
                                </div>
                            </div>

                            {/* Book Link */}
                            {bookData.link && (
                                <a
                                    href={bookData.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => triggerFeedback('light')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        padding: '14px 20px',
                                        background: AppleColors.blue,
                                        color: '#fff',
                                        borderRadius: 12,
                                        textDecoration: 'none',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        marginBottom: 16,
                                        transition: 'transform 0.15s ease, opacity 0.15s ease',
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform = 'scale(0.97)';
                                        e.currentTarget.style.opacity = '0.9';
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.opacity = '1';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.opacity = '1';
                                    }}
                                >
                                    <ExternalLink size={16} />
                                    View / Purchase Book
                                </a>
                            )}
                        </>
                    )}

                    {/* Paper Details */}
                    {paperData && (
                        <>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.blue,
                                    background: 'rgba(0,122,255,0.1)',
                                    padding: '3px 10px',
                                    borderRadius: 12
                                }}>
                                    {paperData.year}
                                </span>
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.labelSecondary,
                                    background: 'rgba(128,128,128,0.1)',
                                    padding: '3px 10px',
                                    borderRadius: 12
                                }}>
                                    {paperData.domain}
                                </span>
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.labelSecondary,
                                    background: 'rgba(128,128,128,0.1)',
                                    padding: '3px 10px',
                                    borderRadius: 12
                                }}>
                                    {paperData.category}
                                </span>
                            </div>

                            <h3 style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: AppleColors.labelPrimary,
                                lineHeight: 1.3,
                                marginBottom: 20
                            }}>
                                {paperData.title}
                            </h3>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                                <a
                                    href={paperData.pdfLink || `https://scholar.google.com/scholar?q=${encodeURIComponent(paperData.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => triggerFeedback('light')}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        padding: '14px 20px',
                                        background: AppleColors.blue,
                                        color: '#fff',
                                        borderRadius: 12,
                                        textDecoration: 'none',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        transition: 'transform 0.15s ease, opacity 0.15s ease',
                                        boxShadow: '0 4px 12px rgba(0, 122, 255, 0.25)'
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform = 'scale(0.97)';
                                        e.currentTarget.style.opacity = '0.9';
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.opacity = '1';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.opacity = '1';
                                    }}
                                >
                                    <ExternalLink size={16} />
                                    Read PDF
                                </a>
                                <a
                                    href={getPaperLink(paperData)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => triggerFeedback('light')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '14px 16px',
                                        background: 'rgba(128,128,128,0.1)',
                                        border: `1px solid ${AppleColors.glassBorder}`,
                                        color: AppleColors.labelPrimary,
                                        borderRadius: 12,
                                        textDecoration: 'none',
                                        transition: 'transform 0.15s ease, background 0.15s ease',
                                    }}
                                    title="View on aman.ai"
                                >
                                    <BookOpen size={16} />
                                </a>
                                <a
                                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paperData.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => triggerFeedback('light')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '14px 16px',
                                        background: 'rgba(128,128,128,0.1)',
                                        border: `1px solid ${AppleColors.glassBorder}`,
                                        color: AppleColors.labelPrimary,
                                        borderRadius: 12,
                                        textDecoration: 'none',
                                        transition: 'transform 0.15s ease, background 0.15s ease',
                                    }}
                                    title="Search on Google Scholar"
                                >
                                    <Search size={16} />
                                </a>
                            </div>

                            {/* Summary Content */}
                            <div>
                                <label style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.labelSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    marginBottom: 12,
                                    display: 'block',
                                    borderBottom: `1px solid ${AppleColors.separator}`,
                                    paddingBottom: 6
                                }}>
                                    Paper Summary & Key Insights
                                </label>
                                {paperData.summaryHtml ? (
                                    <div
                                        className="paper-summary-html"
                                        style={{
                                            fontSize: 14,
                                            lineHeight: 1.6,
                                            color: AppleColors.labelPrimary,
                                        }}
                                        dangerouslySetInnerHTML={{ __html: paperData.summaryHtml }}
                                    />
                                ) : (
                                    <p style={{ fontSize: 14, color: AppleColors.labelTertiary, fontStyle: 'italic' }}>
                                        No detailed summary is available for this paper.
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Roadmap Node Details */}
                    {devRoadmapNodeData && (
                        <>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.blue,
                                    background: 'rgba(0,122,255,0.1)',
                                    padding: '3px 10px',
                                    borderRadius: 12
                                }}>
                                    Roadmap Node
                                </span>
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.labelSecondary,
                                    background: 'rgba(128,128,128,0.1)',
                                    padding: '3px 10px',
                                    borderRadius: 12
                                }}>
                                    {devRoadmapNodeData.roadmapName || devRoadmapNodeData.roadmapId}
                                </span>
                            </div>

                            <h2 style={{ fontSize: 24, fontWeight: 800, color: AppleColors.labelPrimary, marginBottom: 16 }}>
                                {devRoadmapNodeData.label}
                            </h2>

                            {/* Node status toggle in modal */}
                            <div style={{ marginBottom: 20 }}>
                                <button
                                    onClick={() => {
                                        triggerFeedback('light');
                                        const isComplete = isDevRoadmapNodeComplete(devRoadmapNodeData.roadmapId, devRoadmapNodeData.id);
                                        setDevRoadmapNodeStatus(devRoadmapNodeData.roadmapId, devRoadmapNodeData.id, !isComplete);
                                        onUpdate();
                                    }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '10px 16px',
                                        borderRadius: 10,
                                        border: `1px solid ${isDevRoadmapNodeComplete(devRoadmapNodeData.roadmapId, devRoadmapNodeData.id) ? AppleColors.green : AppleColors.glassBorder}`,
                                        background: isDevRoadmapNodeComplete(devRoadmapNodeData.roadmapId, devRoadmapNodeData.id) ? 'rgba(52, 199, 89, 0.15)' : 'rgba(128,128,128,0.1)',
                                        color: isDevRoadmapNodeComplete(devRoadmapNodeData.roadmapId, devRoadmapNodeData.id) ? AppleColors.green : AppleColors.labelPrimary,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {isDevRoadmapNodeComplete(devRoadmapNodeData.roadmapId, devRoadmapNodeData.id) ? (
                                        <>
                                            <CheckCircle2 size={16} color={AppleColors.green} />
                                            Completed
                                        </>
                                    ) : (
                                        <>
                                            <Circle size={16} color={AppleColors.labelSecondary} />
                                            Mark as Complete
                                        </>
                                    )}
                                </button>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 16,
                                maxHeight: '350px',
                                overflowY: 'auto',
                                paddingRight: 8,
                            }}>
                                <label style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.labelSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    marginBottom: 4,
                                    display: 'block',
                                    borderBottom: `1px solid ${AppleColors.separator}`,
                                    paddingBottom: 6
                                }}>
                                    Description & Guide
                                </label>
                                {isMdLoading ? (
                                    <div style={{ color: AppleColors.labelSecondary, fontSize: 14, fontStyle: 'italic', padding: '20px 0' }}>
                                        Loading guide content...
                                    </div>
                                ) : (
                                    <div>
                                        {renderMarkdown(lessonMd)}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* AIFS Lesson Details */}
                    {aifsData && (
                        <>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: AppleColors.purple,
                                    background: 'rgba(175, 82, 222, 0.1)',
                                    padding: '3px 10px',
                                    borderRadius: 12
                                }}>
                                    AI Scratch Lesson
                                </span>
                                {aifsData.phaseName && (
                                    <span style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: AppleColors.labelSecondary,
                                        background: 'rgba(128,128,128,0.1)',
                                        padding: '3px 10px',
                                        borderRadius: 12
                                    }}>
                                        {aifsData.phaseName}
                                    </span>
                                )}
                                {aifsData.type && (
                                    <span style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: AppleColors.orange,
                                        background: 'rgba(255, 149, 0, 0.1)',
                                        padding: '3px 10px',
                                        borderRadius: 12
                                    }}>
                                        {aifsData.type}
                                    </span>
                                )}
                                {aifsData.lang && (
                                    <span style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: AppleColors.blue,
                                        background: 'rgba(0, 122, 255, 0.1)',
                                        padding: '3px 10px',
                                        borderRadius: 12
                                    }}>
                                        {aifsData.lang}
                                    </span>
                                )}
                            </div>

                            <h2 style={{ fontSize: 24, fontWeight: 800, color: AppleColors.labelPrimary, marginBottom: 16 }}>
                                {aifsData.name}
                            </h2>

                            {/* Status toggle in modal */}
                            <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => {
                                        triggerFeedback('light');
                                        const path = extractAIFSPath(aifsData.url);
                                        if (path) {
                                            const state = getAIFSProgress();
                                            const isComplete = !!state.lessons[path]?.completedAt;
                                            setAIFSLessonStatus(path, !isComplete);
                                            onUpdate();
                                        }
                                    }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '10px 16px',
                                        borderRadius: 10,
                                        border: `1px solid ${(() => {
                                            const path = extractAIFSPath(aifsData.url);
                                            const state = getAIFSProgress();
                                            return path && state.lessons[path]?.completedAt ? AppleColors.green : AppleColors.glassBorder;
                                        })()}`,
                                        background: (() => {
                                            const path = extractAIFSPath(aifsData.url);
                                            const state = getAIFSProgress();
                                            return path && state.lessons[path]?.completedAt ? 'rgba(52, 199, 89, 0.15)' : 'rgba(128,128,128,0.1)';
                                        })(),
                                        color: (() => {
                                            const path = extractAIFSPath(aifsData.url);
                                            const state = getAIFSProgress();
                                            return path && state.lessons[path]?.completedAt ? AppleColors.green : AppleColors.labelPrimary;
                                        })(),
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {(() => {
                                        const path = extractAIFSPath(aifsData.url);
                                        const state = getAIFSProgress();
                                        return path && state.lessons[path]?.completedAt ? (
                                            <>
                                                <CheckCircle2 size={16} color={AppleColors.green} />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <Circle size={16} color={AppleColors.labelSecondary} />
                                                Mark as Complete
                                            </>
                                        );
                                    })()}
                                </button>

                                {aifsData.url && (
                                    <a
                                        href={aifsData.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => triggerFeedback('light')}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '10px 16px',
                                            borderRadius: 10,
                                            border: `1px solid ${AppleColors.glassBorder}`,
                                            background: AppleColors.blue,
                                            color: '#fff',
                                            fontSize: 13,
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <ExternalLink size={16} />
                                        Open on GitHub
                                    </a>
                                )}
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 16,
                                maxHeight: '350px',
                                overflowY: 'auto',
                                paddingRight: 8,
                            }}>
                                <div>
                                    <label style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: AppleColors.labelSecondary,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        marginBottom: 6,
                                        display: 'block',
                                        borderBottom: `1px solid ${AppleColors.separator}`,
                                        paddingBottom: 6
                                    }}>
                                        Lesson Guide & Concepts
                                    </label>
                                    {isMdLoading ? (
                                        <div style={{ color: AppleColors.labelSecondary, fontSize: 14, fontStyle: 'italic', padding: '20px 0' }}>
                                            Loading guide content...
                                        </div>
                                    ) : (
                                        <div>
                                            {renderMarkdown(lessonMd)}
                                        </div>
                                    )}
                                </div>

                                {aifsData.keywords && (
                                    <div>
                                        <label style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: AppleColors.labelSecondary,
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                            marginBottom: 6,
                                            display: 'block'
                                        }}>
                                            Keywords
                                        </label>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                            {aifsData.keywords.split(',').map((k, kIdx) => (
                                                <span key={kIdx} style={{
                                                    fontSize: 11,
                                                    color: AppleColors.labelSecondary,
                                                    background: 'rgba(255,255,255,0.05)',
                                                    padding: '2px 8px',
                                                    borderRadius: 8,
                                                    border: `1px solid ${AppleColors.glassBorder}`
                                                }}>
                                                    {k.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Resources */}
                    {resources.length > 0 && (
                        <div style={{ marginTop: 20 }}>
                            <label style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: AppleColors.labelSecondary,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                                marginBottom: 12,
                                display: 'block',
                            }}>
                                Learning Resources
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {resources.slice(0, 4).map((resource, idx) => (
                                    <a
                                        key={idx}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            padding: '12px 14px',
                                            background: AppleColors.fillQuaternary,
                                            borderRadius: 10,
                                            textDecoration: 'none',
                                            transition: 'background 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = AppleColors.fillTertiary;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = AppleColors.fillQuaternary;
                                        }}
                                    >
                                        <div style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            background: resource.type === 'video' ? 'rgba(255, 59, 48, 0.12)' :
                                                resource.type === 'pdf' ? 'rgba(255, 149, 0, 0.12)' :
                                                    resource.type === 'course' ? 'rgba(0, 122, 255, 0.12)' :
                                                        'rgba(88, 86, 214, 0.12)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {resource.type === 'video' ? <Play size={14} color={AppleColors.red} /> :
                                                resource.type === 'pdf' ? <FileText size={14} color={AppleColors.orange} /> :
                                                    resource.type === 'course' ? <BookOpen size={14} color={AppleColors.blue} /> :
                                                        <ExternalLink size={14} color={AppleColors.indigo} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: AppleColors.labelPrimary,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {resource.name}
                                            </div>
                                            {resource.master && (
                                                <div style={{
                                                    fontSize: 11,
                                                    color: AppleColors.labelTertiary,
                                                }}>
                                                    {resource.master}
                                                </div>
                                            )}
                                        </div>
                                        <ExternalLink size={14} color={AppleColors.labelTertiary} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper to find a matching paper in ALL_PAPERS from a citation string
const findMatchedPaper = (citation: string): Paper | null => {
    const flatPapers = Object.values(ALL_PAPERS).flat();
    const searchTerms = citation.toLowerCase().replace(/et al\.?/g, '').split(/[^a-z0-9]/).filter(s => s.trim().length > 0);
    
    for (const paper of flatPapers) {
        const textToSearch = (paper.title + " " + (paper.summaryHtml || "") + " " + paper.year).toLowerCase();
        let matchesAll = true;
        for (const term of searchTerms) {
            if (!textToSearch.includes(term)) {
                matchesAll = false;
                break;
            }
        }
        if (matchesAll) return paper;
    }
    
    // Fallback: try matching just the first word (usually author) and year
    if (searchTerms.length >= 2) {
        const author = searchTerms[0];
        const year = searchTerms.find(t => !isNaN(parseInt(t)) && t.length === 4);
        if (author && year) {
             for (const paper of flatPapers) {
                 const textToSearch = (paper.title + " " + (paper.summaryHtml || "") + " " + paper.year).toLowerCase();
                 if (textToSearch.includes(author) && textToSearch.includes(year)) {
                     return paper;
                 }
             }
        }
    }
    
    return null;
};

// Helper to slugify and link to aman.ai papers summary
const getPaperLink = (paper: { title: string }) => {
    const slug = paper.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    return `https://aman.ai/papers/#${slug}`;
};

const slugify = (value: string): string => {
  if (typeof value !== 'string') return '';
  return value.toLowerCase().replace(/[^A-Za-z0-9_\- ]/g, '').trim().replace(/ /g, '-');
};

interface GroupedRoadmapTopic {
    id: string;
    label: string;
    subtopics: Array<{
        id: string;
        label: string;
    }>;
}

const buildRoadmapTree = (nodes: any[], edges: any[]): GroupedRoadmapTopic[] => {
    const topicNodes = nodes.filter(n => n.type === 'topic');
    topicNodes.sort((a, b) => (a.position?.y - b.position?.y) || (a.position?.x - b.position?.x));

    return topicNodes.map(t => {
        const connectedSubIds = new Set(
            edges
                .filter(e => e.source === t.id || e.target === t.id)
                .map(e => e.source === t.id ? e.target : e.source)
        );

        const subtopics = nodes
            .filter(n => n.type === 'subtopic' && connectedSubIds.has(n.id))
            .sort((a, b) => (a.position?.y - b.position?.y) || (a.position?.x - b.position?.x))
            .map(s => ({
                id: s.id,
                label: s.data?.label || '',
            }));

        return {
            id: t.id,
            label: t.data?.label || '',
            subtopics
        };
    });
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ROADMAP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Roadmap() {
    const [activeTab, setActiveTab] = useState<RoadmapTab>(
        () => (localStorage.getItem('roadmap_activeTab') as RoadmapTab) || 'topics'
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 250);
        return () => clearTimeout(timer);
    }, [searchQuery]);
    const [selectedQuarter, setSelectedQuarter] = useState(
        () => localStorage.getItem('roadmap_selectedQuarter') || 'all'
    );
    const [selectedCategory, setSelectedCategory] = useState(
        () => localStorage.getItem('roadmap_selectedCategory') || 'all'
    );

    // Persist state to localStorage on every change
    useEffect(() => { localStorage.setItem('roadmap_activeTab', activeTab); }, [activeTab]);
    useEffect(() => { localStorage.setItem('roadmap_selectedQuarter', selectedQuarter); }, [selectedQuarter]);
    useEffect(() => { localStorage.setItem('roadmap_selectedCategory', selectedCategory); }, [selectedCategory]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ type: 'topic' | 'skill' | 'book' | 'paper' | 'aifs-lesson' | 'dev-roadmap-node'; data: any } | null>(null);

    // Dev Roadmaps state
    const [registry, setRegistry] = useState<Array<{ id: string; title: string }>>([]);
    const [selectedRoadmapId, setSelectedRoadmapId] = useState(() => localStorage.getItem('roadmap_selectedDevRoadmapId') || 'ai-engineer');
    const [roadmapData, setRoadmapData] = useState<any[] | null>(null);
    const [roadmapProgressData, setRoadmapProgressData] = useState(getDevRoadmapProgress());
    const [expandedRoadmapTopics, setExpandedRoadmapTopics] = useState<Record<string, boolean>>({});

    useEffect(() => {
        localStorage.setItem('roadmap_selectedDevRoadmapId', selectedRoadmapId);
    }, [selectedRoadmapId]);

    // Progress state
    const [topicsProgressData, setTopicsProgressData] = useState(getAllTopicsProgress());
    const [skillsProgressData, setSkillsProgressData] = useState(getAllSkillsProgress());
    const [booksProgressData, setBooksProgressData] = useState(getAllBooksProgress());
    const [methodsProgressData, setMethodsProgressData] = useState(getAllMethodsProgress());
    const [resilienceProgressData, setResilienceProgressData] = useState(getAllResilienceProgress());
    const [aifsProgressData, setAifsProgressData] = useState(getAIFSProgress());
    const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({});
    const [activeAIFSLesson, setActiveAIFSLesson] = useState<{ lesson: any; phase: any } | null>(null);

    const [aiBeginnersProgressData, setAiBeginnersProgressData] = useState(getAIBeginnersProgress());
    const [activeAIBeginnersLesson, setActiveAIBeginnersLesson] = useState<{ lesson: any; phase: any } | null>(null);
    const [expandedAIBeginnersPhases, setExpandedAIBeginnersPhases] = useState<Record<number, boolean>>({});

    const [madeWithMlProgressData, setMadeWithMlProgressData] = useState(getMadeWithMlProgress());
    const [activeMadeWithMlLesson, setActiveMadeWithMlLesson] = useState<{ lesson: any; phase: any } | null>(null);
    const [expandedMadeWithMlPhases, setExpandedMadeWithMlPhases] = useState<Record<number, boolean>>({});

    const togglePhase = (phaseId: number) => {
        setExpandedPhases(prev => ({
            ...prev,
            [phaseId]: !prev[phaseId]
        }));
    };

    const toggleAIBeginnersPhase = (phaseId: number) => {
        setExpandedAIBeginnersPhases(prev => ({
            ...prev,
            [phaseId]: !prev[phaseId]
        }));
    };

    const toggleMadeWithMlPhase = (phaseId: number) => {
        setExpandedMadeWithMlPhases(prev => ({
            ...prev,
            [phaseId]: !prev[phaseId]
        }));
    };

    // Filter AIFS phases and lessons
    const filteredAIFSPhases = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return AI_ENGINEERING_PHASES;
        }
        const query = debouncedSearchQuery.toLowerCase();
        return AI_ENGINEERING_PHASES.map(phase => {
            const matchingLessons = phase.lessons.filter((l: any) =>
                l.name.toLowerCase().includes(query) ||
                (l.summary && l.summary.toLowerCase().includes(query)) ||
                (l.keywords && l.keywords.toLowerCase().includes(query)) ||
                l.lang.toLowerCase().includes(query) ||
                l.type.toLowerCase().includes(query)
            );
            if (matchingLessons.length > 0 || phase.name.toLowerCase().includes(query) || (phase.desc && phase.desc.toLowerCase().includes(query))) {
                return { ...phase, lessons: matchingLessons };
            }
            return null;
        }).filter(Boolean) as typeof AI_ENGINEERING_PHASES;
    }, [debouncedSearchQuery]);

    // Filter AI Beginners phases and lessons
    const filteredAIBeginnersPhases = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return AI_BEGINNERS_PHASES;
        }
        const query = debouncedSearchQuery.toLowerCase();
        return AI_BEGINNERS_PHASES.map(phase => {
            const matchingLessons = phase.lessons.filter((l: any) =>
                l.name.toLowerCase().includes(query) ||
                (l.summary && l.summary.toLowerCase().includes(query)) ||
                (l.keywords && l.keywords.toLowerCase().includes(query)) ||
                l.lang.toLowerCase().includes(query) ||
                l.type.toLowerCase().includes(query)
            );
            if (matchingLessons.length > 0 || phase.name.toLowerCase().includes(query) || (phase.desc && phase.desc.toLowerCase().includes(query))) {
                return { ...phase, lessons: matchingLessons };
            }
            return null;
        }).filter(Boolean) as typeof AI_BEGINNERS_PHASES;
    }, [debouncedSearchQuery]);

    // Filter Made With ML phases and lessons
    const filteredMadeWithMlPhases = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return MADE_WITH_ML_PHASES;
        }
        const query = debouncedSearchQuery.toLowerCase();
        return MADE_WITH_ML_PHASES.map(phase => {
            const matchingLessons = phase.lessons.filter((l: any) =>
                l.name.toLowerCase().includes(query) ||
                (l.summary && l.summary.toLowerCase().includes(query)) ||
                (l.keywords && l.keywords.toLowerCase().includes(query)) ||
                l.lang.toLowerCase().includes(query) ||
                l.type.toLowerCase().includes(query)
            );
            if (matchingLessons.length > 0 || phase.name.toLowerCase().includes(query) || (phase.desc && phase.desc.toLowerCase().includes(query))) {
                return { ...phase, lessons: matchingLessons };
            }
            return null;
        }).filter(Boolean) as typeof MADE_WITH_ML_PHASES;
    }, [debouncedSearchQuery]);

    // Filter AIFS glossary terms
    const filteredAIFSGlossary = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return AI_ENGINEERING_GLOSSARY;
        }
        const query = debouncedSearchQuery.toLowerCase();
        return AI_ENGINEERING_GLOSSARY.filter((t: any) =>
            t.term.toLowerCase().includes(query) ||
            t.says.toLowerCase().includes(query) ||
            t.means.toLowerCase().includes(query)
        );
    }, [debouncedSearchQuery]);

    // Filter Dev Roadmaps data
    const filteredRoadmapData = useMemo(() => {
        if (!roadmapData) return null;
        if (!debouncedSearchQuery.trim()) return roadmapData;
        const query = debouncedSearchQuery.toLowerCase();
        
        return roadmapData.map(topic => {
            const matchingSubs = topic.subtopics.filter((s: any) =>
                s.label.toLowerCase().includes(query)
            );
            if (matchingSubs.length > 0 || topic.label.toLowerCase().includes(query)) {
                return { ...topic, subtopics: matchingSubs };
            }
            return null;
        }).filter(Boolean) as typeof roadmapData;
    }, [roadmapData, debouncedSearchQuery]);

    const effectiveExpandedRoadmapTopics = useMemo(() => {
        if (debouncedSearchQuery.trim() && filteredRoadmapData) {
            const expanded: Record<string, boolean> = {};
            filteredRoadmapData.forEach(t => {
                expanded[t.id] = true;
            });
            return expanded;
        }
        return expandedRoadmapTopics;
    }, [expandedRoadmapTopics, debouncedSearchQuery, filteredRoadmapData]);

    useEffect(() => {
        fetch('/elite-resources/roadmaps/registry.json')
            .then(res => res.json())
            .then(data => setRegistry(data))
            .catch(err => console.error('Failed to load registry:', err));
    }, []);

    useEffect(() => {
        if (!selectedRoadmapId) return;
        fetch(`/elite-resources/roadmaps/${selectedRoadmapId}/${selectedRoadmapId}.json`)
            .then(res => res.json())
            .then(data => {
                if (data && data.nodes && data.edges) {
                    const tree = buildRoadmapTree(data.nodes, data.edges);
                    setRoadmapData(tree);
                }
            })
            .catch(err => console.error('Failed to load roadmap JSON:', err));
    }, [selectedRoadmapId]);

    const effectiveExpandedPhases = useMemo(() => {
        if (debouncedSearchQuery.trim()) {
            const expanded: Record<number, boolean> = {};
            filteredAIFSPhases.forEach(phase => {
                expanded[phase.id] = true;
            });
            return expanded;
        }
        return expandedPhases;
    }, [expandedPhases, debouncedSearchQuery, filteredAIFSPhases]);

    const effectiveExpandedAIBeginnersPhases = useMemo(() => {
        if (debouncedSearchQuery.trim()) {
            const expanded: Record<number, boolean> = {};
            filteredAIBeginnersPhases.forEach(phase => {
                expanded[phase.id] = true;
            });
            return expanded;
        }
        return expandedAIBeginnersPhases;
    }, [expandedAIBeginnersPhases, debouncedSearchQuery, filteredAIBeginnersPhases]);

    const effectiveExpandedMadeWithMlPhases = useMemo(() => {
        if (debouncedSearchQuery.trim()) {
            const expanded: Record<number, boolean> = {};
            filteredMadeWithMlPhases.forEach(phase => {
                expanded[phase.id] = true;
            });
            return expanded;
        }
        return expandedMadeWithMlPhases;
    }, [expandedMadeWithMlPhases, debouncedSearchQuery, filteredMadeWithMlPhases]);

    const refreshProgress = useCallback(() => {
        setTopicsProgressData(getAllTopicsProgress());
        setSkillsProgressData(getAllSkillsProgress());
        setBooksProgressData(getAllBooksProgress());
        setMethodsProgressData(getAllMethodsProgress());
        setResilienceProgressData(getAllResilienceProgress());
        setAifsProgressData(getAIFSProgress());
        setRoadmapProgressData(getDevRoadmapProgress());
        setAiBeginnersProgressData(getAIBeginnersProgress());
        setMadeWithMlProgressData(getMadeWithMlProgress());
    }, []);

    useEffect(() => {
        refreshProgress();
    }, [refreshProgress]);

    // Calculate stats
    const topicsProgress = useMemo(() => {
        const completed = Object.values(topicsProgressData).filter(t => t.status === 'completed').length;
        const inProgress = Object.values(topicsProgressData).filter(t => t.status === 'in_progress').length;
        return { total: ALL_AI_TOPICS.length, completed, inProgress };
    }, [topicsProgressData]);

    const skillsProgress = useMemo(() => {
        let totalLevel = 0;
        CEO_SKILLS.forEach(skill => {
            totalLevel += skillsProgressData[skill.id]?.currentLevel ?? skill.currentLevel ?? 0;
        });
        return {
            averageLevel: CEO_SKILLS.length > 0 ? totalLevel / CEO_SKILLS.length : 0,
            percentage: Math.round((totalLevel / (CEO_SKILLS.length * 10)) * 100),
        };
    }, [skillsProgressData]);

    const booksProgress = useMemo(() => {
        const completed = Object.values(booksProgressData).filter(b => b.status === 'completed').length;
        return { total: ALL_BOOKS.length, completed };
    }, [booksProgressData]);

    // Filter topics
    const filteredTopics = useMemo(() => {
        let topics = ALL_AI_TOPICS;
        if (selectedQuarter !== 'all') {
            topics = topics.filter(t => t.quarter === selectedQuarter);
        }
        if (selectedCategory !== 'all') {
            topics = topics.filter(t => t.category === selectedCategory);
        }
        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            topics = topics.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query)
            );
        }
        return topics;
    }, [selectedQuarter, selectedCategory, debouncedSearchQuery]);

    // Filter skills
    const filteredSkills = useMemo(() => {
        let skills = CEO_SKILLS;
        if (selectedCategory !== 'all') {
            skills = skills.filter(s => s.category === selectedCategory);
        }
        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            skills = skills.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.category.toLowerCase().includes(query)
            );
        }
        return skills;
    }, [selectedCategory, debouncedSearchQuery]);

    // Filter books
    const filteredBooks = useMemo(() => {
        let books = ALL_BOOKS;
        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            books = books.filter(b =>
                b.title.toLowerCase().includes(query) ||
                b.author.toLowerCase().includes(query)
            );
        }
        return books;
    }, [debouncedSearchQuery]);

    // Filter papers
    const filteredPapers = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return ALL_PAPERS;
        }
        const query = debouncedSearchQuery.toLowerCase();
        const result: Record<string, typeof ALL_PAPERS[string]> = {};
        
        for (const [domain, papers] of Object.entries(ALL_PAPERS)) {
            const filtered = papers.filter(p => 
                p.title.toLowerCase().includes(query) ||
                p.year.includes(query) ||
                p.category.toLowerCase().includes(query) ||
                (p.summaryHtml && p.summaryHtml.toLowerCase().includes(query))
            );
            if (filtered.length > 0) {
                result[domain] = filtered;
            }
        }
        return result;
    }, [debouncedSearchQuery]);

    const aifsProgress = useMemo(() => {
        let total = 0;
        let completed = 0;
        AI_ENGINEERING_PHASES.forEach(phase => {
            phase.lessons.forEach((lesson: any) => {
                total++;
                const path = extractAIFSPath(lesson.url);
                if (path && aifsProgressData.lessons[path]?.completedAt) {
                    completed++;
                }
            });
        });
        return { total, completed };
    }, [aifsProgressData]);

    const aiBeginnersProgress = useMemo(() => {
        let total = 0;
        let completed = 0;
        AI_BEGINNERS_PHASES.forEach(phase => {
            phase.lessons.forEach((lesson: any) => {
                total++;
                const path = getCourseLessonPath(lesson);
                if (path && aiBeginnersProgressData.lessons[path]?.completedAt) {
                    completed++;
                }
            });
        });
        return { total, completed };
    }, [aiBeginnersProgressData]);

    const madeWithMlProgress = useMemo(() => {
        let total = 0;
        let completed = 0;
        MADE_WITH_ML_PHASES.forEach(phase => {
            phase.lessons.forEach((lesson: any) => {
                total++;
                const path = getCourseLessonPath(lesson);
                if (path && madeWithMlProgressData.lessons[path]?.completedAt) {
                    completed++;
                }
            });
        });
        return { total, completed };
    }, [madeWithMlProgressData]);

    const openModal = (
        type: 'topic' | 'skill' | 'book' | 'paper' | 'aifs-lesson' | 'dev-roadmap-node', 
        data: any
    ) => {
        setSelectedItem({ type, data });
        setModalOpen(true);
    };

    const tabs = [
        { id: 'polymath' as RoadmapTab, label: 'Polymath', icon: <Sparkles size={18} />, count: 5 },
        { id: 'topics' as RoadmapTab, label: 'AI Topics', icon: <Brain size={18} />, count: topicsProgress.total },
        { id: 'ai-engineering' as RoadmapTab, label: 'AI Scratch', icon: <Cpu size={18} />, count: aifsProgress.total },
        { id: 'ai-beginners' as RoadmapTab, label: 'AI Beginners', icon: <BookOpen size={18} />, count: aiBeginnersProgress.total },
        { id: 'made-with-ml' as RoadmapTab, label: 'Made with ML', icon: <Zap size={18} />, count: madeWithMlProgress.total },
        { id: 'cs-dev' as RoadmapTab, label: 'CS Dev', icon: <Code2 size={18} />, count: 5 },
        { id: 'ai-glossary' as RoadmapTab, label: 'AI Glossary', icon: <Terminal size={18} />, count: AI_ENGINEERING_GLOSSARY.length },
        { id: 'dev-roadmaps' as RoadmapTab, label: 'Dev Roadmaps', icon: <Map size={18} />, count: 62 },
        { id: 'skills' as RoadmapTab, label: 'CEO Skills', icon: <Target size={18} />, count: 30 },
        { id: 'books' as RoadmapTab, label: 'Books', icon: <BookOpen size={18} />, count: booksProgress.total },
        { id: 'papers' as RoadmapTab, label: 'Papers', icon: <FileText size={18} />, count: Object.values(ALL_PAPERS).reduce((acc, arr) => acc + arr.length, 0) },
        { id: 'milestones' as RoadmapTab, label: 'Milestones', icon: <Trophy size={18} />, count: 4 },
    ];

    const milestones = [
        {
            quarter: 'Q1 2026',
            items: [
                { label: 'AI Topics', target: '75+', color: AppleColors.blue },
                { label: 'CEO Skills', target: '5/10 avg', color: AppleColors.purple },
                { label: 'Books', target: '10', color: AppleColors.green },
                { label: 'Weight', target: '95kg', color: AppleColors.orange },
                { label: 'Income', target: '$15K', color: AppleColors.yellow },
            ]
        },
        {
            quarter: 'Q2 2026',
            items: [
                { label: 'AI Topics', target: '150+', color: AppleColors.blue },
                { label: 'CEO Skills', target: '6/10 avg', color: AppleColors.purple },
                { label: 'Books', target: '20', color: AppleColors.green },
                { label: 'Weight', target: '92kg', color: AppleColors.orange },
                { label: 'Income', target: '$50K', color: AppleColors.yellow },
            ]
        },
        {
            quarter: 'Q3 2026',
            items: [
                { label: 'AI Topics', target: '225+', color: AppleColors.blue },
                { label: 'CEO Skills', target: '7/10 avg', color: AppleColors.purple },
                { label: 'Books', target: '30', color: AppleColors.green },
                { label: 'Weight', target: '90kg', color: AppleColors.orange },
                { label: 'Income', target: '$100K', color: AppleColors.yellow },
            ]
        },
        {
            quarter: 'Q4 2026',
            items: [
                { label: 'AI Topics', target: '300+', color: AppleColors.blue },
                { label: 'CEO Skills', target: '8/10 avg', color: AppleColors.purple },
                { label: 'Books', target: '40', color: AppleColors.green },
                { label: 'Weight', target: '90kg lean', color: AppleColors.orange },
                { label: 'Income', target: '$300K+', color: AppleColors.yellow },
            ]
        },
    ];

    return (
        <div style={{
            padding: activeTab === 'cs-dev' ? '100px 0 40px 0' : '100px 20px 40px 20px',
            maxWidth: activeTab === 'cs-dev' ? '100%' : 1200,
            margin: '0 auto',
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h1 style={{
                    fontSize: 38,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #007AFF, #AF52DE)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: -1,
                    marginBottom: 12,
                }}>
                    🎯 2026 Roadmap
                </h1>
                <p style={{
                    fontSize: 17,
                    color: AppleColors.labelSecondary,
                }}>
                    World-class AI Scientist • $300K+ Income • Elite Physique
                </p>
            </div>

            {/* Responsive Styles */}
            <style>{`
                .roadmap-grid {
                    display: grid;
                    gap: 16px;
                    padding-bottom: 40px;
                }
                /* Mobile (Phones) */
                @media (max-width: 640px) {
                    .roadmap-grid {
                        grid-template-columns: 1fr;
                    }
                    .roadmap-stats-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                /* Tablet */
                @media (min-width: 641px) and (max-width: 1024px) {
                    .roadmap-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                /* Desktop */
                @media (min-width: 1025px) {
                    .roadmap-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>

            {/* Progress Overview */}
            <div className="roadmap-stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                marginBottom: 32,
            }}>
                <GlassCard padding={20}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <ProgressRing
                            progress={(topicsProgress.completed / topicsProgress.total) * 100}
                            color={AppleColors.blue}
                            size={64}
                            strokeWidth={6}
                        />
                        <div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: AppleColors.labelPrimary,
                            }}>
                                {topicsProgress.completed}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: AppleColors.labelSecondary,
                            }}>
                                of {topicsProgress.total} Topics
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard padding={20}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <ProgressRing
                            progress={skillsProgress.percentage}
                            color={AppleColors.purple}
                            size={64}
                            strokeWidth={6}
                        />
                        <div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: AppleColors.labelPrimary,
                            }}>
                                {skillsProgress.averageLevel.toFixed(1)}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: AppleColors.labelSecondary,
                            }}>
                                Avg Skill Level
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard padding={20}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <ProgressRing
                            progress={(booksProgress.completed / booksProgress.total) * 100}
                            color={AppleColors.green}
                            size={64}
                            strokeWidth={6}
                        />
                        <div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: AppleColors.labelPrimary,
                            }}>
                                {booksProgress.completed}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: AppleColors.labelSecondary,
                            }}>
                                of {booksProgress.total} Books
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 24,
                overflowX: 'auto',
                paddingBottom: 4,
            }}>
                <div style={{
                    display: 'inline-flex',
                    background: AppleColors.glass,
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderRadius: 16,
                    padding: 6,
                    gap: 6,
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                triggerFeedback('light');
                                setActiveTab(tab.id);
                                setSearchQuery('');
                                setSelectedQuarter('all');
                                setSelectedCategory('all');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 20px',
                                borderRadius: 12,
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: 600,
                                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                background: activeTab === tab.id ? AppleColors.glass : 'transparent',
                                color: activeTab === tab.id ? AppleColors.labelPrimary : AppleColors.labelSecondary,
                                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                                transform: activeTab === tab.id ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            {tab.icon}
                            <span style={{ whiteSpace: 'nowrap' }}>{tab.label}</span>
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: 8,
                                fontSize: 11,
                                fontWeight: 700,
                                background: activeTab === tab.id ? AppleColors.fillSecondary : AppleColors.fillTertiary,
                                transition: 'background 0.3s ease',
                            }}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            {activeTab !== 'milestones' && activeTab !== 'cs-dev' && (
                <div
                    style={{
                        maxWidth: 480,
                        margin: '0 auto 24px',
                        animation: 'scaleIn 0.4s ease backwards',
                        animationDelay: '0.1s',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 18px',
                        background: AppleColors.glass,
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: 16,
                        border: `1px solid ${AppleColors.separator}`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        transition: 'box-shadow 0.3s ease',
                    }}>
                        <Search size={20} color={AppleColors.labelTertiary} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                fontSize: 16,
                                color: AppleColors.labelPrimary,
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    triggerFeedback('light');
                                    setSearchQuery('');
                                }}
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    background: AppleColors.fillSecondary,
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <X size={14} color={AppleColors.labelSecondary} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            {activeTab === 'polymath' && (
                <div>
                    {/* Learning Methods Section */}
                    <div style={{ marginBottom: 32 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: AppleColors.labelPrimary, marginBottom: 16, paddingLeft: 4 }}>
                            <Sparkles size={18} style={{ marginRight: 8, display: 'inline', verticalAlign: 'middle' }} />
                            Core Learning Methods
                        </h3>
                        <div className="roadmap-grid">
                            {POLYMATH_METHODS.map((method, index) => (
                                <div key={method.id} style={{ animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, animationDelay: `${index * 0.1}s` }}>
                                    <MethodCard
                                        method={method}
                                        progress={methodsProgressData[method.id]}
                                        onPractice={() => { incrementMethodPractice(method.id); refreshProgress(); }}
                                        onMasterToggle={() => { setMethodMastered(method.id, !(methodsProgressData[method.id]?.mastered ?? false)); refreshProgress(); }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Daily Resilience Section */}
                    <div style={{ marginBottom: 32 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: AppleColors.labelPrimary, marginBottom: 16, paddingLeft: 4 }}>
                            🔥 Daily Resilience Protocol
                        </h3>
                        <GlassCard padding={20}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {RESILIENCE_ACTIVITIES.map((activity, index) => (
                                    <div key={activity.id} style={{ animation: `fadeIn 0.4s ease backwards`, animationDelay: `${0.3 + index * 0.05}s` }}>
                                        <ResilienceCard
                                            activity={activity}
                                            progress={resilienceProgressData[activity.id]}
                                            onComplete={() => { completeResilienceActivity(activity.id); refreshProgress(); }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Top 10 Billionaire Skills Quick Access */}
                    <div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: AppleColors.labelPrimary, marginBottom: 16, paddingLeft: 4 }}>
                            💎 Top 10 Billionaire Skills
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                            {TOP_BILLIONAIRE_SKILLS.slice(0, 10).map((skill, index) => (
                                <div key={skill.id} style={{ animation: `scaleIn 0.4s ease backwards`, animationDelay: `${0.5 + index * 0.05}s`, padding: '14px 16px', background: AppleColors.glass, backdropFilter: 'blur(20px)', borderRadius: 14, border: `1px solid ${AppleColors.separator}` }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: AppleColors.labelPrimary, marginBottom: 4 }}>{skill.name}</div>
                                    <div style={{ fontSize: 12, color: AppleColors.purple, fontWeight: 500, marginBottom: 6 }}>{skill.master}</div>
                                    <div style={{ fontSize: 12, color: AppleColors.labelTertiary, lineHeight: 1.4 }}>{skill.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ai-engineering' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
                    {/* Header stats bar */}
                    <GlassCard padding={20}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <ProgressRing progress={(aifsProgress.completed / aifsProgress.total) * 100} color={AppleColors.blue} size={70} strokeWidth={6} />
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: AppleColors.labelPrimary, marginBottom: 4 }}>
                                        AI Engineering from Scratch
                                    </h3>
                                    <p style={{ fontSize: 14, color: AppleColors.labelSecondary }}>
                                        {aifsProgress.completed} of {aifsProgress.total} lessons completed • ~320 hours curriculum
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <a 
                                    href="https://github.com/rohitg00/ai-engineering-from-scratch"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => triggerFeedback('light')}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#ffffff',
                                        background: AppleColors.blue,
                                        padding: '8px 16px',
                                        borderRadius: 10,
                                        textDecoration: 'none',
                                        transition: 'opacity 0.2s ease',
                                    }}
                                >
                                    <Terminal size={14} />
                                    GitHub Repo
                                </a>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Phase lists */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filteredAIFSPhases.map((phase, idx) => {
                            const isExpanded = !!effectiveExpandedPhases[phase.id];
                            const totalLessons = phase.lessons.length;
                            
                            // Calculate completed lessons in this phase
                            let completedInPhase = 0;
                            phase.lessons.forEach((l: any) => {
                                const path = extractAIFSPath(l.url);
                                if (path && aifsProgressData.lessons[path]?.completedAt) {
                                    completedInPhase++;
                                }
                            });

                            const phasePercentage = totalLessons > 0 ? (completedInPhase / totalLessons) * 100 : 0;
                            
                            // Determine phase status dynamically
                            const phaseStatus = completedInPhase === totalLessons && totalLessons > 0
                                ? 'completed'
                                : completedInPhase > 0
                                    ? 'in_progress'
                                    : 'not_started';

                            return (
                                <div 
                                    key={phase.id} 
                                    style={{ 
                                        animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, 
                                        animationDelay: `${Math.min(idx * 0.05, 0.5)}s` 
                                    }}
                                >
                                    <GlassCard padding={16}>
                                        {/* Phase Accordion Header */}
                                        <div 
                                            onClick={() => togglePhase(phase.id)}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between', 
                                                cursor: 'pointer',
                                                userSelect: 'none'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                                <div style={{ transform: 'scale(0.8)', flexShrink: 0 }}>
                                                    <ProgressRing 
                                                        progress={phasePercentage} 
                                                        color={phaseStatus === 'completed' ? AppleColors.green : AppleColors.orange} 
                                                        size={40} 
                                                        strokeWidth={4} 
                                                        showLabel={false} 
                                                    />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: 13, fontWeight: 700, color: AppleColors.blue, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                            Phase {phase.id}
                                                        </span>
                                                        <StatusPill status={phaseStatus} />
                                                    </div>
                                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: AppleColors.labelPrimary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {phase.name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: 13, color: AppleColors.labelSecondary, fontWeight: 500 }}>
                                                    {completedInPhase}/{totalLessons} lessons
                                                </span>
                                                <ChevronRight 
                                                    size={18} 
                                                    color={AppleColors.labelSecondary} 
                                                    style={{ 
                                                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', 
                                                        transition: 'transform 0.25s ease' 
                                                    }} 
                                                />
                                            </div>
                                        </div>

                                        {/* Expanded Phase Lessons */}
                                        {isExpanded && (
                                            <div style={{ 
                                                marginTop: 16, 
                                                paddingTop: 16, 
                                                borderTop: `1px solid ${AppleColors.separator}`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 12
                                            }}>
                                                {phase.desc && (
                                                    <p style={{ fontSize: 14, color: AppleColors.labelSecondary, marginBottom: 8, fontStyle: 'italic' }}>
                                                        {phase.desc}
                                                    </p>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    {phase.lessons.map((lesson: any, lIdx: number) => {
                                                        const path = extractAIFSPath(lesson.url);
                                                        const isCompleted = !!(path && aifsProgressData.lessons[path]?.completedAt);

                                                        // Parse keywords into list
                                                        const tags = lesson.keywords 
                                                            ? lesson.keywords.split('·').map((t: string) => t.trim()).filter(Boolean)
                                                            : [];

                                                        return (
                                                            <div 
                                                                key={lIdx}
                                                                style={{ 
                                                                    display: 'flex', 
                                                                    flexDirection: 'column',
                                                                    padding: 12,
                                                                    background: 'rgba(255, 255, 255, 0.02)',
                                                                    borderRadius: 10,
                                                                    border: `0.5px solid ${AppleColors.glassBorder}`,
                                                                    transition: 'background 0.2s ease',
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                triggerFeedback('light');
                                                                                setAIFSLessonStatus(path, !isCompleted);
                                                                                refreshProgress();
                                                                            }}
                                                                            style={{
                                                                                background: 'none',
                                                                                border: 'none',
                                                                                padding: 0,
                                                                                cursor: 'pointer',
                                                                                display: 'inline-flex',
                                                                                marginTop: 2,
                                                                                flexShrink: 0
                                                                            }}
                                                                        >
                                                                            {isCompleted ? (
                                                                                <CheckCircle2 size={18} color={AppleColors.green} />
                                                                            ) : (
                                                                                <Circle size={18} color={AppleColors.labelTertiary} />
                                                                            )}
                                                                        </button>
                                                                        <div style={{ minWidth: 0 }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                                                <span style={{ fontSize: 12, fontWeight: 600, color: AppleColors.labelTertiary }}>
                                                                                    {String(lIdx + 1).padStart(2, '0')}
                                                                                </span>
                                                                                <span 
                                                                                    onClick={() => {
                                                                                        triggerFeedback('light');
                                                                                        setActiveAIFSLesson({ lesson, phase });
                                                                                    }}
                                                                                    style={{ fontSize: 15, fontWeight: 600, color: AppleColors.labelPrimary, cursor: 'pointer', textDecoration: 'none' }}
                                                                                >
                                                                                    {lesson.name}
                                                                                </span>
                                                                                <span style={{ 
                                                                                    fontSize: 10, 
                                                                                    fontWeight: 700, 
                                                                                    color: lesson.type === 'Build' ? AppleColors.blue : AppleColors.purple,
                                                                                    background: lesson.type === 'Build' ? 'rgba(0,122,255,0.1)' : 'rgba(175,82,222,0.1)',
                                                                                    padding: '1px 6px',
                                                                                    borderRadius: 4
                                                                                }}>
                                                                                    {lesson.type}
                                                                                </span>
                                                                            </div>
                                                                            <p style={{ fontSize: 13, color: AppleColors.labelSecondary, marginTop: 4, lineHeight: 1.4 }}>
                                                                                {lesson.summary}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                                                        <span style={{ fontSize: 11, fontFamily: 'monospace', color: AppleColors.labelSecondary }}>
                                                                            {lesson.lang}
                                                                        </span>
                                                                        <a 
                                                                            href={lesson.url} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            style={{
                                                                                display: 'inline-flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                width: 28,
                                                                                height: 28,
                                                                                borderRadius: 14,
                                                                                background: AppleColors.fillTertiary,
                                                                                textDecoration: 'none',
                                                                                color: AppleColors.labelSecondary,
                                                                                transition: 'background 0.2s ease',
                                                                            }}
                                                                        >
                                                                            <ExternalLink size={12} />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Tags list */}
                                                                {tags.length > 0 && (
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, marginLeft: 28 }}>
                                                                        {tags.map((tag: string, tIdx: number) => (
                                                                            <span key={tIdx} style={{ fontSize: 10, color: AppleColors.labelSecondary, background: AppleColors.fillTertiary, padding: '2px 8px', borderRadius: 4 }}>
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </GlassCard>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'ai-beginners' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
                    {/* Header stats bar */}
                    <GlassCard padding={20}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <ProgressRing progress={(aiBeginnersProgress.completed / aiBeginnersProgress.total) * 100} color={AppleColors.blue} size={70} strokeWidth={6} />
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: AppleColors.labelPrimary, marginBottom: 4 }}>
                                        AI for Beginners
                                    </h3>
                                    <p style={{ fontSize: 14, color: AppleColors.labelSecondary }}>
                                        {aiBeginnersProgress.completed} of {aiBeginnersProgress.total} lessons completed • ~26 lessons curriculum
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <a 
                                    href="https://github.com/microsoft/AI-For-Beginners"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => triggerFeedback('light')}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#ffffff',
                                        background: AppleColors.blue,
                                        padding: '8px 16px',
                                        borderRadius: 10,
                                        textDecoration: 'none',
                                        transition: 'opacity 0.2s ease',
                                    }}
                                >
                                    <Terminal size={14} />
                                    GitHub Repo
                                </a>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Phase lists */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filteredAIBeginnersPhases.map((phase, idx) => {
                            const isExpanded = !!effectiveExpandedAIBeginnersPhases[phase.id];
                            const totalLessons = phase.lessons.length;
                            
                            // Calculate completed lessons in this phase
                            let completedInPhase = 0;
                            phase.lessons.forEach((l: any) => {
                                const path = getCourseLessonPath(l);
                                if (path && aiBeginnersProgressData.lessons[path]?.completedAt) {
                                    completedInPhase++;
                                }
                            });

                            const phasePercentage = totalLessons > 0 ? (completedInPhase / totalLessons) * 100 : 0;
                            
                            // Determine phase status dynamically
                            const phaseStatus = completedInPhase === totalLessons && totalLessons > 0
                                ? 'completed'
                                : completedInPhase > 0
                                    ? 'in_progress'
                                    : 'not_started';

                            return (
                                <div 
                                    key={phase.id} 
                                    style={{ 
                                        animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, 
                                        animationDelay: `${Math.min(idx * 0.05, 0.5)}s` 
                                    }}
                                >
                                    <GlassCard padding={16}>
                                        {/* Phase Accordion Header */}
                                        <div 
                                            onClick={() => toggleAIBeginnersPhase(phase.id)}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between', 
                                                cursor: 'pointer',
                                                userSelect: 'none'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                                <div style={{ transform: 'scale(0.8)', flexShrink: 0 }}>
                                                    <ProgressRing 
                                                        progress={phasePercentage} 
                                                        color={phaseStatus === 'completed' ? AppleColors.green : AppleColors.orange} 
                                                        size={40} 
                                                        strokeWidth={4} 
                                                        showLabel={false} 
                                                    />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: 13, fontWeight: 700, color: AppleColors.blue, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                            Phase {phase.id}
                                                        </span>
                                                        <StatusPill status={phaseStatus} />
                                                    </div>
                                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: AppleColors.labelPrimary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {phase.name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: 13, color: AppleColors.labelSecondary, fontWeight: 500 }}>
                                                    {completedInPhase}/{totalLessons} lessons
                                                </span>
                                                <ChevronRight 
                                                    size={18} 
                                                    color={AppleColors.labelSecondary} 
                                                    style={{ 
                                                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', 
                                                        transition: 'transform 0.25s ease' 
                                                    }} 
                                                />
                                            </div>
                                        </div>

                                        {/* Expanded Phase Lessons */}
                                        {isExpanded && (
                                            <div style={{ 
                                                marginTop: 16, 
                                                paddingTop: 16, 
                                                borderTop: `1px solid ${AppleColors.separator}`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 12
                                            }}>
                                                {phase.desc && (
                                                    <p style={{ fontSize: 14, color: AppleColors.labelSecondary, marginBottom: 8, fontStyle: 'italic' }}>
                                                        {phase.desc}
                                                    </p>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    {phase.lessons.map((lesson: any, lIdx: number) => {
                                                        const path = getCourseLessonPath(lesson);
                                                        const isCompleted = !!(path && aiBeginnersProgressData.lessons[path]?.completedAt);
                                                        const tags = lesson.keywords 
                                                            ? lesson.keywords.split('·').map((t: string) => t.trim()).filter(Boolean)
                                                            : [];

                                                        return (
                                                            <div 
                                                                key={lIdx}
                                                                style={{ 
                                                                    display: 'flex', 
                                                                    flexDirection: 'column',
                                                                    padding: 12,
                                                                    background: 'rgba(255, 255, 255, 0.02)',
                                                                    borderRadius: 10,
                                                                    border: `0.5px solid ${AppleColors.glassBorder}`,
                                                                    transition: 'background 0.2s ease',
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                triggerFeedback('light');
                                                                                setAIBeginnersLessonStatus(path, !isCompleted);
                                                                                refreshProgress();
                                                                            }}
                                                                            style={{
                                                                                background: 'none',
                                                                                border: 'none',
                                                                                padding: 0,
                                                                                cursor: 'pointer',
                                                                                display: 'inline-flex',
                                                                                marginTop: 2,
                                                                                flexShrink: 0
                                                                            }}
                                                                        >
                                                                            {isCompleted ? (
                                                                                <CheckCircle2 size={18} color={AppleColors.green} />
                                                                            ) : (
                                                                                <Circle size={18} color={AppleColors.labelTertiary} />
                                                                            )}
                                                                        </button>
                                                                        <div style={{ minWidth: 0 }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                                                <span style={{ fontSize: 12, fontWeight: 600, color: AppleColors.labelTertiary }}>
                                                                                    {String(lIdx + 1).padStart(2, '0')}
                                                                                </span>
                                                                                <span 
                                                                                    onClick={() => {
                                                                                        triggerFeedback('light');
                                                                                        setActiveAIBeginnersLesson({ lesson, phase });
                                                                                    }}
                                                                                    style={{ fontSize: 15, fontWeight: 600, color: AppleColors.labelPrimary, cursor: 'pointer', textDecoration: 'none' }}
                                                                                >
                                                                                    {lesson.name}
                                                                                </span>
                                                                                <span style={{ 
                                                                                    fontSize: 10, 
                                                                                    fontWeight: 700, 
                                                                                    color: lesson.type === 'Build' ? AppleColors.blue : AppleColors.purple,
                                                                                    background: lesson.type === 'Build' ? 'rgba(0,122,255,0.1)' : 'rgba(175,82,222,0.1)',
                                                                                    padding: '1px 6px',
                                                                                    borderRadius: 4
                                                                                }}>
                                                                                    {lesson.type}
                                                                                </span>
                                                                            </div>
                                                                            <p style={{ fontSize: 13, color: AppleColors.labelSecondary, marginTop: 4, lineHeight: 1.4 }}>
                                                                                {lesson.summary}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                                                        <span style={{ fontSize: 11, fontFamily: 'monospace', color: AppleColors.labelSecondary }}>
                                                                            {lesson.lang}
                                                                        </span>
                                                                        <a 
                                                                            href={lesson.url} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            style={{
                                                                                display: 'inline-flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                width: 28,
                                                                                height: 28,
                                                                                borderRadius: 14,
                                                                                background: AppleColors.fillTertiary,
                                                                                textDecoration: 'none',
                                                                                color: AppleColors.labelSecondary,
                                                                                transition: 'background 0.2s ease',
                                                                            }}
                                                                        >
                                                                            <ExternalLink size={12} />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Tags list */}
                                                                {tags.length > 0 && (
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, marginLeft: 28 }}>
                                                                        {tags.map((tag: string, tIdx: number) => (
                                                                            <span key={tIdx} style={{ fontSize: 10, color: AppleColors.labelSecondary, background: AppleColors.fillTertiary, padding: '2px 8px', borderRadius: 4 }}>
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </GlassCard>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'made-with-ml' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
                    {/* Header stats bar */}
                    <GlassCard padding={20}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <ProgressRing progress={(madeWithMlProgress.completed / madeWithMlProgress.total) * 100} color={AppleColors.blue} size={70} strokeWidth={6} />
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: AppleColors.labelPrimary, marginBottom: 4 }}>
                                        Made with ML
                                    </h3>
                                    <p style={{ fontSize: 14, color: AppleColors.labelSecondary }}>
                                        {madeWithMlProgress.completed} of {madeWithMlProgress.total} lessons completed • ~26 lessons curriculum
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <a 
                                    href="https://github.com/GokuMohandas/Made-With-ML"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => triggerFeedback('light')}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#ffffff',
                                        background: AppleColors.blue,
                                        padding: '8px 16px',
                                        borderRadius: 10,
                                        textDecoration: 'none',
                                        transition: 'opacity 0.2s ease',
                                    }}
                                >
                                    <Terminal size={14} />
                                    GitHub Repo
                                </a>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Phase lists */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filteredMadeWithMlPhases.map((phase, idx) => {
                            const isExpanded = !!effectiveExpandedMadeWithMlPhases[phase.id];
                            const totalLessons = phase.lessons.length;
                            
                            // Calculate completed lessons in this phase
                            let completedInPhase = 0;
                            phase.lessons.forEach((l: any) => {
                                const path = getCourseLessonPath(l);
                                if (path && madeWithMlProgressData.lessons[path]?.completedAt) {
                                    completedInPhase++;
                                }
                            });

                            const phasePercentage = totalLessons > 0 ? (completedInPhase / totalLessons) * 100 : 0;
                            
                            // Determine phase status dynamically
                            const phaseStatus = completedInPhase === totalLessons && totalLessons > 0
                                ? 'completed'
                                : completedInPhase > 0
                                    ? 'in_progress'
                                    : 'not_started';

                            return (
                                <div 
                                    key={phase.id} 
                                    style={{ 
                                        animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, 
                                        animationDelay: `${Math.min(idx * 0.05, 0.5)}s` 
                                    }}
                                >
                                    <GlassCard padding={16}>
                                        {/* Phase Accordion Header */}
                                        <div 
                                            onClick={() => toggleMadeWithMlPhase(phase.id)}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between', 
                                                cursor: 'pointer',
                                                userSelect: 'none'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                                <div style={{ transform: 'scale(0.8)', flexShrink: 0 }}>
                                                    <ProgressRing 
                                                        progress={phasePercentage} 
                                                        color={phaseStatus === 'completed' ? AppleColors.green : AppleColors.orange} 
                                                        size={40} 
                                                        strokeWidth={4} 
                                                        showLabel={false} 
                                                    />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: 13, fontWeight: 700, color: AppleColors.blue, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                            Phase {phase.id}
                                                        </span>
                                                        <StatusPill status={phaseStatus} />
                                                    </div>
                                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: AppleColors.labelPrimary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {phase.name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: 13, color: AppleColors.labelSecondary, fontWeight: 500 }}>
                                                    {completedInPhase}/{totalLessons} lessons
                                                </span>
                                                <ChevronRight 
                                                    size={18} 
                                                    color={AppleColors.labelSecondary} 
                                                    style={{ 
                                                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', 
                                                        transition: 'transform 0.25s ease' 
                                                    }} 
                                                />
                                            </div>
                                        </div>

                                        {/* Expanded Phase Lessons */}
                                        {isExpanded && (
                                            <div style={{ 
                                                marginTop: 16, 
                                                paddingTop: 16, 
                                                borderTop: `1px solid ${AppleColors.separator}`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 12
                                            }}>
                                                {phase.desc && (
                                                    <p style={{ fontSize: 14, color: AppleColors.labelSecondary, marginBottom: 8, fontStyle: 'italic' }}>
                                                        {phase.desc}
                                                    </p>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    {phase.lessons.map((lesson: any, lIdx: number) => {
                                                        const path = getCourseLessonPath(lesson);
                                                        const isCompleted = !!(path && madeWithMlProgressData.lessons[path]?.completedAt);
                                                        const tags = lesson.keywords 
                                                            ? lesson.keywords.split('·').map((t: string) => t.trim()).filter(Boolean)
                                                            : [];

                                                        return (
                                                            <div 
                                                                key={lIdx}
                                                                style={{ 
                                                                    display: 'flex', 
                                                                    flexDirection: 'column',
                                                                    padding: 12,
                                                                    background: 'rgba(255, 255, 255, 0.02)',
                                                                    borderRadius: 10,
                                                                    border: `0.5px solid ${AppleColors.glassBorder}`,
                                                                    transition: 'background 0.2s ease',
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                triggerFeedback('light');
                                                                                setMadeWithMlLessonStatus(path, !isCompleted);
                                                                                refreshProgress();
                                                                            }}
                                                                            style={{
                                                                                background: 'none',
                                                                                border: 'none',
                                                                                padding: 0,
                                                                                cursor: 'pointer',
                                                                                display: 'inline-flex',
                                                                                marginTop: 2,
                                                                                flexShrink: 0
                                                                            }}
                                                                        >
                                                                            {isCompleted ? (
                                                                                <CheckCircle2 size={18} color={AppleColors.green} />
                                                                            ) : (
                                                                                <Circle size={18} color={AppleColors.labelTertiary} />
                                                                            )}
                                                                        </button>
                                                                        <div style={{ minWidth: 0 }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                                                <span style={{ fontSize: 12, fontWeight: 600, color: AppleColors.labelTertiary }}>
                                                                                    {String(lIdx + 1).padStart(2, '0')}
                                                                                </span>
                                                                                <span 
                                                                                    onClick={() => {
                                                                                        triggerFeedback('light');
                                                                                        setActiveMadeWithMlLesson({ lesson, phase });
                                                                                    }}
                                                                                    style={{ fontSize: 15, fontWeight: 600, color: AppleColors.labelPrimary, cursor: 'pointer', textDecoration: 'none' }}
                                                                                >
                                                                                    {lesson.name}
                                                                                </span>
                                                                                <span style={{ 
                                                                                    fontSize: 10, 
                                                                                    fontWeight: 700, 
                                                                                    color: lesson.type === 'Build' ? AppleColors.blue : AppleColors.purple,
                                                                                    background: lesson.type === 'Build' ? 'rgba(0,122,255,0.1)' : 'rgba(175,82,222,0.1)',
                                                                                    padding: '1px 6px',
                                                                                    borderRadius: 4
                                                                                }}>
                                                                                    {lesson.type}
                                                                                </span>
                                                                            </div>
                                                                            <p style={{ fontSize: 13, color: AppleColors.labelSecondary, marginTop: 4, lineHeight: 1.4 }}>
                                                                                {lesson.summary}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                                                        <span style={{ fontSize: 11, fontFamily: 'monospace', color: AppleColors.labelSecondary }}>
                                                                            {lesson.lang}
                                                                        </span>
                                                                        <a 
                                                                            href={lesson.url} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            style={{
                                                                                display: 'inline-flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                width: 28,
                                                                                height: 28,
                                                                                borderRadius: 14,
                                                                                background: AppleColors.fillTertiary,
                                                                                textDecoration: 'none',
                                                                                color: AppleColors.labelSecondary,
                                                                                transition: 'background 0.2s ease',
                                                                            }}
                                                                        >
                                                                            <ExternalLink size={12} />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Tags list */}
                                                                {tags.length > 0 && (
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, marginLeft: 28 }}>
                                                                        {tags.map((tag: string, tIdx: number) => (
                                                                            <span key={tIdx} style={{ fontSize: 10, color: AppleColors.labelSecondary, background: AppleColors.fillTertiary, padding: '2px 8px', borderRadius: 4 }}>
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </GlassCard>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'cs-dev' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60, height: 'calc(100vh - 280px)', minHeight: 600 }}>
                    <CsDevHub />
                </div>
            )}

            {activeTab === 'dev-roadmaps' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
                    {/* Header stats bar */}
                    <GlassCard padding={20}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <ProgressRing 
                                    progress={
                                        roadmapData ? (() => {
                                            let total = 0;
                                            let completed = 0;
                                            roadmapData.forEach(topic => {
                                                total++; // the topic itself
                                                if (!!roadmapProgressData.completedNodes[selectedRoadmapId]?.[topic.id]) completed++;
                                                topic.subtopics.forEach((sub: any) => {
                                                    total++;
                                                    if (!!roadmapProgressData.completedNodes[selectedRoadmapId]?.[sub.id]) completed++;
                                                });
                                            });
                                            return total > 0 ? (completed / total) * 100 : 0;
                                        })() : 0
                                    } 
                                    color={AppleColors.blue} 
                                    size={70} 
                                    strokeWidth={6} 
                                />
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: AppleColors.labelPrimary, marginBottom: 4 }}>
                                        {registry.find(r => r.id === selectedRoadmapId)?.title || 'Developer Roadmap'}
                                    </h3>
                                    <p style={{ fontSize: 14, color: AppleColors.labelSecondary }}>
                                        {roadmapData ? (() => {
                                            let total = 0;
                                            let completed = 0;
                                            roadmapData.forEach(topic => {
                                                total++;
                                                if (!!roadmapProgressData.completedNodes[selectedRoadmapId]?.[topic.id]) completed++;
                                                topic.subtopics.forEach((sub: any) => {
                                                    total++;
                                                    if (!!roadmapProgressData.completedNodes[selectedRoadmapId]?.[sub.id]) completed++;
                                                });
                                            });
                                            return `${completed} of ${total} nodes completed`;
                                        })() : 'Loading nodes...'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Selector */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: AppleColors.labelSecondary }}>
                                    Select Roadmap
                                </label>
                                <select
                                    value={selectedRoadmapId}
                                    onChange={(e) => {
                                        triggerFeedback('light');
                                        setSelectedRoadmapId(e.target.value);
                                        setRoadmapData(null);
                                    }}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: 10,
                                        background: AppleColors.fillSecondary,
                                        border: `1px solid ${AppleColors.glassBorder}`,
                                        color: AppleColors.labelPrimary,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        outline: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {registry.map(r => (
                                        <option key={r.id} value={r.id} style={{ background: '#1c1c1e', color: '#fff' }}>
                                            {r.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Topics Accordion List */}
                    {!roadmapData ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: AppleColors.labelSecondary, fontStyle: 'italic' }}>
                            Loading roadmap structure...
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {filteredRoadmapData?.map((topic, idx) => {
                                const isExpanded = !!effectiveExpandedRoadmapTopics[topic.id];
                                const isTopicChecked = !!roadmapProgressData.completedNodes[selectedRoadmapId]?.[topic.id];
                                const totalSubs = topic.subtopics.length;
                                
                                // Calculate completed subtopics in this topic
                                let completedSubs = 0;
                                topic.subtopics.forEach((s: any) => {
                                    if (!!roadmapProgressData.completedNodes[selectedRoadmapId]?.[s.id]) {
                                        completedSubs++;
                                    }
                                });

                                const isAllComplete = (isTopicChecked && completedSubs === totalSubs);
                                const isSomeComplete = (isTopicChecked || completedSubs > 0);
                                const topicStatus = isAllComplete ? 'completed' : isSomeComplete ? 'in_progress' : 'not_started';

                                return (
                                    <div 
                                        key={topic.id} 
                                        style={{ 
                                            animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, 
                                            animationDelay: `${Math.min(idx * 0.05, 0.5)}s` 
                                        }}
                                    >
                                        <GlassCard padding={16}>
                                            {/* Topic Header */}
                                            <div 
                                                onClick={() => {
                                                    setExpandedRoadmapTopics(prev => ({
                                                        ...prev,
                                                        [topic.id]: !prev[topic.id]
                                                    }));
                                                }}
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'space-between', 
                                                    cursor: 'pointer',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            triggerFeedback('light');
                                                            setDevRoadmapNodeStatus(selectedRoadmapId, topic.id, !isTopicChecked);
                                                            refreshProgress();
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {isTopicChecked ? (
                                                            <CheckCircle2 size={20} color={AppleColors.green} />
                                                        ) : (
                                                            <Circle size={20} color={AppleColors.labelTertiary} />
                                                        )}
                                                    </button>
                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <span 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openModal('dev-roadmap-node', { ...topic, roadmapId: selectedRoadmapId, roadmapName: registry.find(r => r.id === selectedRoadmapId)?.title });
                                                                }}
                                                                style={{ fontSize: 17, fontWeight: 700, color: AppleColors.labelPrimary, cursor: 'pointer' }}
                                                            >
                                                                {topic.label}
                                                            </span>
                                                            <StatusPill status={topicStatus} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    {totalSubs > 0 && (
                                                        <span style={{ fontSize: 13, color: AppleColors.labelSecondary, fontWeight: 500 }}>
                                                            {completedSubs}/{totalSubs} steps
                                                        </span>
                                                    )}
                                                    <ChevronRight 
                                                        size={18} 
                                                        color={AppleColors.labelSecondary} 
                                                        style={{ 
                                                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', 
                                                            transition: 'transform 0.25s ease' 
                                                        }} 
                                                    />
                                                </div>
                                            </div>

                                            {/* Subtopics List */}
                                            {isExpanded && totalSubs > 0 && (
                                                <div style={{ 
                                                    marginTop: 16, 
                                                    paddingTop: 16, 
                                                    borderTop: `1px solid ${AppleColors.separator}`,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 10
                                                }}>
                                                    {topic.subtopics.map((sub: any) => {
                                                        const isSubChecked = !!roadmapProgressData.completedNodes[selectedRoadmapId]?.[sub.id];
                                                        return (
                                                            <div 
                                                                key={sub.id}
                                                                style={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    justifyContent: 'space-between',
                                                                    padding: '8px 12px',
                                                                    background: 'rgba(255, 255, 255, 0.02)',
                                                                    borderRadius: 8,
                                                                    border: `0.5px solid ${AppleColors.glassBorder}`,
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                                                    <button
                                                                        onClick={() => {
                                                                            triggerFeedback('light');
                                                                            setDevRoadmapNodeStatus(selectedRoadmapId, sub.id, !isSubChecked);
                                                                            refreshProgress();
                                                                        }}
                                                                        style={{
                                                                            background: 'none',
                                                                            border: 'none',
                                                                            padding: 0,
                                                                            cursor: 'pointer',
                                                                            display: 'inline-flex',
                                                                            flexShrink: 0
                                                                        }}
                                                                    >
                                                                        {isSubChecked ? (
                                                                            <CheckCircle2 size={18} color={AppleColors.green} />
                                                                        ) : (
                                                                            <Circle size={18} color={AppleColors.labelTertiary} />
                                                                        )}
                                                                    </button>
                                                                    <span 
                                                                        onClick={() => openModal('dev-roadmap-node', { ...sub, roadmapId: selectedRoadmapId, roadmapName: registry.find(r => r.id === selectedRoadmapId)?.title })}
                                                                        style={{ 
                                                                            fontSize: 14, 
                                                                            fontWeight: 500, 
                                                                            color: AppleColors.labelPrimary, 
                                                                            cursor: 'pointer',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}
                                                                    >
                                                                        {sub.label}
                                                                    </span>
                                                                </div>
                                                                <ChevronRight size={14} color={AppleColors.labelTertiary} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </GlassCard>
                                    </div>
                                );
                            })}
                            {filteredRoadmapData?.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: AppleColors.labelSecondary }}>
                                    No topics match your search.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'ai-glossary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 60 }}>
                    {/* Header stats bar */}
                    <GlassCard padding={20}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: AppleColors.labelPrimary, marginBottom: 4 }}>
                                    AI Glossary
                                </h3>
                                <p style={{ fontSize: 14, color: AppleColors.labelSecondary }}>
                                    What people <em>say</em> vs what things actually <em>mean</em> • {filteredAIFSGlossary.length} terms
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Glossary Terms List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filteredAIFSGlossary.map((t, idx) => (
                            <div 
                                key={idx}
                                style={{ 
                                    animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, 
                                    animationDelay: `${Math.min(idx * 0.03, 0.4)}s` 
                                }}
                            >
                                <GlassCard padding={20} hoverable>
                                    <div style={{ fontSize: 17, fontWeight: 700, color: AppleColors.blue, marginBottom: 12 }}>
                                        {t.term}
                                    </div>
                                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: AppleColors.labelTertiary, marginBottom: 4 }}>
                                                What they say
                                            </div>
                                            <div style={{ fontSize: 14, fontStyle: 'italic', color: AppleColors.labelSecondary, lineHeight: 1.5 }}>
                                                "{t.says}"
                                            </div>
                                        </div>
                                        <div style={{ flex: 1.5, minWidth: 280 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: AppleColors.labelTertiary, marginBottom: 4 }}>
                                                What it actually means
                                            </div>
                                            <div style={{ fontSize: 14, color: AppleColors.labelPrimary, lineHeight: 1.5 }}>
                                                {t.means}
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        ))}
                        {filteredAIFSGlossary.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: AppleColors.labelSecondary }}>
                                No glossary terms match your search.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'topics' && (
                <div className="roadmap-grid">
                    {filteredTopics.map((topic, index) => (
                        <div key={topic.id} style={{ animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
                            <TopicCard
                                topic={topic}
                                progress={topicsProgressData[topic.id]}
                                onClick={() => openModal('topic', topic)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'skills' && (
                <div className="roadmap-grid">
                    {filteredSkills.map((skill, index) => (
                        <div key={skill.id} style={{ animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
                            <SkillCard
                                skill={skill}
                                progress={skillsProgressData[skill.id]}
                                onClick={() => openModal('skill', skill)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'books' && (
                <div className="roadmap-grid">
                    {filteredBooks.map((book, index) => (
                        <div key={book.id} style={{ animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
                            <BookCard
                                book={book}
                                progress={booksProgressData[book.id]}
                                onClick={() => openModal('book', book)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'milestones' && (
                <div className="roadmap-grid">
                    {milestones.map((milestone, idx) => (
                        <div key={idx} style={{ animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, animationDelay: `${idx * 0.1}s` }}>
                            <MilestoneCard {...milestone} />
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'papers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 60 }}>
                    {Object.entries(filteredPapers).map(([domain, papers], dIdx) => (
                        <div key={domain} style={{ animation: `slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, animationDelay: `${Math.min(dIdx * 0.1, 0.5)}s` }}>
                            <h2 style={{
                                fontSize: 22,
                                fontWeight: 700,
                                marginBottom: 16,
                                color: AppleColors.labelPrimary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                <FileText size={20} color={AppleColors.blue} />
                                {domain} <span style={{ fontSize: 14, color: AppleColors.labelSecondary, fontWeight: 500 }}>({papers.length})</span>
                            </h2>
                            <div className="roadmap-grid">
                                {papers.map((paper, pIdx) => (
                                    <GlassCard key={pIdx} padding={16} hoverable onClick={() => openModal('paper', paper)}>
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                <span style={{ 
                                                    fontSize: 12, 
                                                    fontWeight: 600, 
                                                    color: AppleColors.blue,
                                                    background: 'rgba(0,122,255,0.1)',
                                                    padding: '2px 8px',
                                                    borderRadius: 12
                                                }}>
                                                    {paper.year}
                                                </span>
                                                <span style={{ fontSize: 11, color: AppleColors.labelTertiary }}>
                                                    {paper.category.split('/')[0].trim()}
                                                </span>
                                            </div>
                                            <h3 style={{ 
                                                fontSize: 15, 
                                                fontWeight: 600, 
                                                lineHeight: 1.4, 
                                                color: AppleColors.labelPrimary,
                                                marginBottom: 16
                                            }}>
                                                {paper.title}
                                            </h3>
                                            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openModal('paper', paper);
                                                    }}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                        fontSize: 11,
                                                        fontWeight: 500,
                                                        color: AppleColors.labelSecondary,
                                                        background: 'rgba(128,128,128,0.1)',
                                                        border: `1px solid ${AppleColors.glassBorder}`,
                                                        padding: '6px 12px',
                                                        borderRadius: 8,
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s ease',
                                                    }}
                                                >
                                                    <Sparkles size={12} color={AppleColors.blue} />
                                                    Summary
                                                </button>
                                                <a 
                                                    href={paper.pdfLink || `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                        fontSize: 11,
                                                        fontWeight: 500,
                                                        color: '#ffffff',
                                                        background: AppleColors.blue,
                                                        padding: '6px 12px',
                                                        borderRadius: 8,
                                                        textDecoration: 'none',
                                                        transition: 'opacity 0.2s ease',
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <FileText size={12} />
                                                    PDF
                                                </a>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <DetailModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                type={selectedItem?.type || 'topic'}
                data={selectedItem?.data || null}
                storedProgress={{
                    topics: topicsProgressData,
                    skills: skillsProgressData,
                    books: booksProgressData,
                }}
                onUpdate={refreshProgress}
                onOpenPaper={(paper) => openModal('paper', paper)}
            />

            {activeAIFSLesson && (
                <AIFSLearningWorkspace
                    activeLesson={activeAIFSLesson.lesson}
                    activePhase={activeAIFSLesson.phase}
                    allPhases={AI_ENGINEERING_PHASES}
                    aifsProgressData={aifsProgressData}
                    onSelectLesson={(lesson, phase) => {
                        setActiveAIFSLesson({ lesson, phase });
                    }}
                    onToggleComplete={(lesson) => {
                        const path = extractAIFSPath(lesson.url);
                        if (path) {
                            const isComplete = !!aifsProgressData.lessons[path]?.completedAt;
                            setAIFSLessonStatus(path, !isComplete);
                            refreshProgress();
                        }
                    }}
                    onClose={() => setActiveAIFSLesson(null)}
                />
            )}

            {activeAIBeginnersLesson && (
                <CourseLearningWorkspace
                    courseId="ai-beginners"
                    activeLesson={activeAIBeginnersLesson.lesson}
                    activePhase={activeAIBeginnersLesson.phase}
                    allPhases={AI_BEGINNERS_PHASES}
                    progressData={aiBeginnersProgressData}
                    onSelectLesson={(lesson, phase) => {
                        setActiveAIBeginnersLesson({ lesson, phase });
                    }}
                    onToggleComplete={(lesson) => {
                        const path = getCourseLessonPath(lesson);
                        if (path) {
                            const isComplete = !!aiBeginnersProgressData.lessons[path]?.completedAt;
                            setAIBeginnersLessonStatus(path, !isComplete);
                            refreshProgress();
                        }
                    }}
                    onClose={() => setActiveAIBeginnersLesson(null)}
                />
            )}

            {activeMadeWithMlLesson && (
                <CourseLearningWorkspace
                    courseId="made-with-ml"
                    activeLesson={activeMadeWithMlLesson.lesson}
                    activePhase={activeMadeWithMlLesson.phase}
                    allPhases={MADE_WITH_ML_PHASES}
                    progressData={madeWithMlProgressData}
                    onSelectLesson={(lesson, phase) => {
                        setActiveMadeWithMlLesson({ lesson, phase });
                    }}
                    onToggleComplete={(lesson) => {
                        const path = getCourseLessonPath(lesson);
                        if (path) {
                            const isComplete = !!madeWithMlProgressData.lessons[path]?.completedAt;
                            setMadeWithMlLessonStatus(path, !isComplete);
                            refreshProgress();
                        }
                    }}
                    onClose={() => setActiveMadeWithMlLesson(null)}
                />
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AIFS LEARNING WORKSPACE SUBCOMPONENTS & PARSER
// ═══════════════════════════════════════════════════════════════════════════════

interface AIFSLearningWorkspaceProps {
    activeLesson: AIFSLesson;
    activePhase: any;
    allPhases: any[];
    aifsProgressData: any;
    onSelectLesson: (lesson: AIFSLesson, phase: any) => void;
    onToggleComplete: (lesson: AIFSLesson) => void;
    onClose: () => void;
}

interface ParsedLesson {
    type: string;
    languages: string;
    prerequisites: string;
    time: string;
    objectives: string[];
    body: string;
}

function parseLessonMarkdown(mdText: string): ParsedLesson {
    const result: ParsedLesson = {
        type: 'Build',
        languages: 'Python',
        prerequisites: 'None',
        time: '~45 mins',
        objectives: [],
        body: mdText
    };

    // Extract Type
    const typeMatch = mdText.match(/\*\*Type:\*\*\s*(.*)/i);
    if (typeMatch) result.type = typeMatch[1].trim();

    // Extract Languages
    const langMatch = mdText.match(/\*\*Languages:\*\*\s*(.*)/i);
    if (langMatch) result.languages = langMatch[1].trim();

    // Extract Prerequisites
    const prereqMatch = mdText.match(/\*\*Prerequisites:\*\*\s*(.*)/i);
    if (prereqMatch) result.prerequisites = prereqMatch[1].trim();

    // Extract Time
    const timeMatch = mdText.match(/\*\*Time:\*\*\s*(.*)/i);
    if (timeMatch) result.time = timeMatch[1].trim();

    // Extract objectives
    const objectivesSection = mdText.match(/## Learning Objectives([\s\S]*?)(?=##)/i);
    if (objectivesSection) {
        const objLines = objectivesSection[1].split('\n');
        result.objectives = objLines
            .map(line => line.trim())
            .filter(line => line.startsWith('-') || line.startsWith('*'))
            .map(line => line.replace(/^[-*]\s*/, '').trim());
    }

    // Clean body
    let bodyText = mdText;
    bodyText = bodyText.replace(/^#\s+.*?\n+/m, '');
    bodyText = bodyText.replace(/^>\s+.*?\n+/m, '');
    bodyText = bodyText.replace(/^\*\*Type:\*\*.*?\n+/im, '');
    bodyText = bodyText.replace(/^\*\*Languages:\*\*.*?\n+/im, '');
    bodyText = bodyText.replace(/^\*\*Prerequisites:\*\*.*?\n+/im, '');
    bodyText = bodyText.replace(/^\*\*Time:\*\*.*?\n+/im, '');
    bodyText = bodyText.replace(/## Learning Objectives[\s\S]*?(?=##)/i, '');

    result.body = bodyText.trim();
    return result;
}

function QuizQuestion({ 
    question, 
    index, 
    total, 
    onAnswerSelected,
    selectedAnswer 
}: { 
    question: any; 
    index: number; 
    total: number;
    questionId: string;
    onAnswerSelected: (ansIdx: number) => void;
    selectedAnswer: number | undefined;
}) {
    const isAnswered = selectedAnswer !== undefined;

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: `1px solid rgba(255, 255, 255, 0.08)`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
        }}>
            <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 8
            }}>
                Question {index + 1} of {total}
            </div>
            
            <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#fff',
                marginBottom: 16,
                lineHeight: 1.4
            }}>
                {question.question}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {question.options.map((opt: string, oIdx: number) => {
                    const isSelected = selectedAnswer === oIdx;
                    const isCorrect = question.correct === oIdx;
                    
                    let bg = 'rgba(255, 255, 255, 0.03)';
                    let border = `1px solid rgba(255, 255, 255, 0.08)`;
                    let textColor = 'rgba(255,255,255,0.7)';

                    if (isAnswered) {
                        if (isCorrect) {
                            bg = 'rgba(52, 199, 89, 0.12)';
                            border = `1px solid ${AppleColors.green}`;
                            textColor = '#fff';
                        } else if (isSelected) {
                            bg = 'rgba(255, 59, 48, 0.12)';
                            border = `1px solid ${AppleColors.red}`;
                            textColor = '#fff';
                        } else {
                            textColor = 'rgba(255, 255, 255, 0.3)';
                        }
                    }

                    return (
                        <button
                            key={oIdx}
                            onClick={() => {
                                if (!isAnswered) {
                                    onAnswerSelected(oIdx);
                                    triggerFeedback('light');
                                }
                            }}
                            disabled={isAnswered}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                width: '100%',
                                textAlign: 'left',
                                padding: '12px 16px',
                                borderRadius: 8,
                                background: bg,
                                border: border,
                                color: textColor,
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: isAnswered ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                border: `1px solid ${isAnswered ? (isCorrect ? AppleColors.green : (isSelected ? AppleColors.red : 'rgba(255,255,255,0.15)')) : 'rgba(255,255,255,0.3)'}`,
                                background: isAnswered && isCorrect ? AppleColors.green : (isAnswered && isSelected ? AppleColors.red : 'transparent'),
                                color: isAnswered && (isCorrect || isSelected) ? '#fff' : 'rgba(255,255,255,0.7)',
                                fontSize: 11,
                                fontWeight: 700,
                                flexShrink: 0
                            }}>
                                {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span style={{ flex: 1 }}>{opt}</span>
                            
                            {isAnswered && isCorrect && (
                                <span style={{ color: AppleColors.green, fontWeight: 600, fontSize: 13 }}>✓</span>
                            )}
                            {isAnswered && isSelected && !isCorrect && (
                                <span style={{ color: AppleColors.red, fontWeight: 600, fontSize: 13 }}>✗</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {isAnswered && (
                <div style={{
                    marginTop: 16,
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderLeft: `3px solid ${selectedAnswer === question.correct ? AppleColors.green : AppleColors.orange}`,
                    borderRadius: '0 8px 8px 0',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.5,
                }}>
                    <strong style={{ color: selectedAnswer === question.correct ? AppleColors.green : AppleColors.orange, display: 'block', marginBottom: 4 }}>
                        {selectedAnswer === question.correct ? 'Correct!' : 'Incorrect'}
                    </strong>
                    {question.explanation}
                </div>
            )}
        </div>
    );
}

function QuizBlock({ 
    questions, 
    lessonPath, 
    stage 
}: { 
    questions: any[]; 
    lessonPath: string; 
    stage: 'pre' | 'post' 
}) {
    const [answers, setAnswers] = useState<Record<number, number>>({});

    useEffect(() => {
        setAnswers({});
    }, [lessonPath, stage]);

    return (
        <div>
            {questions.map((q, idx) => {
                const questionId = `${lessonPath}-${stage}-${idx}`;
                return (
                    <QuizQuestion
                        key={idx}
                        question={q}
                        index={idx}
                        total={questions.length}
                        questionId={questionId}
                        selectedAnswer={answers[idx]}
                        onAnswerSelected={(ansIdx) => {
                            setAnswers(prev => ({
                                ...prev,
                                [idx]: ansIdx
                            }));
                        }}
                    />
                );
            })}
        </div>
    );
}

function AIFSLearningWorkspace({
    activeLesson,
    activePhase,
    allPhases,
    aifsProgressData,
    onSelectLesson,
    onToggleComplete,
    onClose
}: AIFSLearningWorkspaceProps) {
    const [lessonMd, setLessonMd] = useState<string | null>(null);
    const [isMdLoading, setIsMdLoading] = useState(false);
    const [quizData, setQuizData] = useState<any | null>(null);
    const readerPanelRef = useRef<HTMLDivElement>(null);

    const relativePath = extractAIFSPath(activeLesson.url);

    const [expandedSidebarPhases, setExpandedSidebarPhases] = useState<Record<number, boolean>>({
        [activePhase.id]: true
    });

    const toggleSidebarPhase = (phaseId: number) => {
        setExpandedSidebarPhases(prev => ({
            ...prev,
            [phaseId]: !prev[phaseId]
        }));
    };

    useEffect(() => {
        if (!activeLesson) return;

        if (readerPanelRef.current) {
            readerPanelRef.current.scrollTop = 0;
        }

        if (!relativePath) {
            setLessonMd(activeLesson.summary || 'No detailed content available.');
            setQuizData(null);
            return;
        }

        setIsMdLoading(true);
        setLessonMd(null);
        setQuizData(null);

        const mdUrl = `/elite-resources/aifs/${relativePath}/docs/en.md`;
        fetch(mdUrl)
            .then(res => {
                if (!res.ok) throw new Error('Markdown not found');
                return res.text();
            })
            .then(text => {
                setLessonMd(text);
            })
            .catch(() => {
                setLessonMd(activeLesson.summary || 'No detailed content available.');
            })
            .finally(() => {
                setIsMdLoading(false);
            });

        const quizUrl = `/elite-resources/aifs/${relativePath}/quiz.json`;
        fetch(quizUrl)
            .then(res => {
                if (!res.ok) throw new Error('Quiz not found');
                return res.json();
            })
            .then(data => {
                setQuizData(data);
            })
            .catch(() => {
                setQuizData(null);
            });

    }, [activeLesson, relativePath]);

    const parsed = useMemo(() => {
        if (!lessonMd) return null;
        return parseLessonMarkdown(lessonMd);
    }, [lessonMd]);

    const isCurrentCompleted = !!(relativePath && aifsProgressData.lessons[relativePath]?.completedAt);

    const getNextLesson = () => {
        const currentLessons = activePhase.lessons;
        const currentIndex = currentLessons.findIndex((l: any) => l.url === activeLesson.url);
        if (currentIndex !== -1 && currentIndex < currentLessons.length - 1) {
            return { lesson: currentLessons[currentIndex + 1], phase: activePhase };
        }
        
        const nextPhaseIndex = allPhases.findIndex(p => p.id === activePhase.id) + 1;
        if (nextPhaseIndex < allPhases.length) {
            const nextPhase = allPhases[nextPhaseIndex];
            if (nextPhase.lessons.length > 0) {
                return { lesson: nextPhase.lessons[0], phase: nextPhase };
            }
        }
        return null;
    };

    const nextInfo = getNextLesson();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: '#07080a',
            display: 'flex',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}>
            {/* Sidebar */}
            <div style={{
                width: 280,
                height: '100%',
                background: 'rgba(15, 17, 23, 0.95)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 10,
            }}>
                <div style={{
                    padding: '20px 16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <ArrowLeft size={14} />
                        Back to Hub
                    </button>
                </div>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                }}>
                    {allPhases.map((phase) => {
                        const isPhaseActive = phase.id === activePhase.id;
                        const isExpanded = !!expandedSidebarPhases[phase.id];
                        
                        let completedCount = 0;
                        phase.lessons.forEach((l: any) => {
                            const path = extractAIFSPath(l.url);
                            if (path && aifsProgressData.lessons[path]?.completedAt) {
                                completedCount++;
                            }
                        });

                        return (
                            <div key={phase.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <div 
                                    onClick={() => toggleSidebarPhase(phase.id)}
                                    style={{
                                        padding: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderRadius: 6,
                                        userSelect: 'none',
                                        background: isPhaseActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                        <span style={{ 
                                            fontSize: 9, 
                                            fontWeight: 700, 
                                            color: isPhaseActive ? AppleColors.blue : 'rgba(255,255,255,0.3)',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5
                                        }}>
                                            Phase {String(phase.id).padStart(2, '0')}
                                        </span>
                                        <span style={{ 
                                            fontSize: 13, 
                                            fontWeight: 700, 
                                            color: isPhaseActive ? '#fff' : 'rgba(255,255,255,0.7)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {phase.name}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                                            {completedCount}/{phase.lessons.length}
                                        </span>
                                        <ChevronRight 
                                            size={12} 
                                            color="rgba(255,255,255,0.4)" 
                                            style={{ 
                                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s' 
                                            }} 
                                        />
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 4, marginTop: 4 }}>
                                        {phase.lessons.map((lesson: any, lIdx: number) => {
                                            const path = extractAIFSPath(lesson.url);
                                            const isLessonCompleted = !!(path && aifsProgressData.lessons[path]?.completedAt);
                                            const isLessonActive = lesson.url === activeLesson.url;

                                            return (
                                                <div
                                                    key={lIdx}
                                                    onClick={() => onSelectLesson(lesson, phase)}
                                                    style={{
                                                        padding: '8px 10px',
                                                        borderRadius: 8,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        background: isLessonActive ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                                                        borderLeft: `3px solid ${isLessonActive ? AppleColors.blue : 'transparent'}`,
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                >
                                                    {isLessonCompleted ? (
                                                        <CheckCircle2 size={13} color={AppleColors.green} style={{ flexShrink: 0 }} />
                                                    ) : (
                                                        <Circle size={13} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                                                    )}
                                                    <span style={{
                                                        fontSize: 13,
                                                        fontWeight: isLessonActive ? 600 : 400,
                                                        color: isLessonActive ? '#fff' : (isLessonCompleted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'),
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        flex: 1
                                                    }}>
                                                        {lesson.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reader Panel */}
            <div 
                ref={readerPanelRef}
                style={{
                    flex: 1,
                    height: '100%',
                    overflowY: 'auto',
                    position: 'relative',
                    background: '#0B0D13',
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    padding: '40px 60px',
                    scrollBehavior: 'smooth',
                }}
            >
                {/* Neon Glow backdrop */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '300px',
                    background: 'radial-gradient(circle at 50% 0%, rgba(10, 132, 255, 0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    {/* Breadcrumbs */}
                    <div style={{ 
                        fontSize: 12, 
                        fontWeight: 600, 
                        color: AppleColors.blue, 
                        textTransform: 'uppercase', 
                        letterSpacing: 1,
                        marginBottom: 8
                    }}>
                        {activePhase.name}
                    </div>

                    <h1 style={{ 
                        fontSize: 36, 
                        fontWeight: 800, 
                        color: '#fff', 
                        marginBottom: 16,
                        letterSpacing: '-0.5px' 
                    }}>
                        {activeLesson.name}
                    </h1>

                    <hr style={{ border: 'none', height: 1, background: 'rgba(255, 255, 255, 0.08)', marginBottom: 20 }} />

                    {isMdLoading ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '100px 0',
                            color: 'rgba(255,255,255,0.4)',
                            gap: 12
                        }}>
                            <div style={{
                                width: 24,
                                height: 24,
                                border: '2px solid rgba(255,255,255,0.1)',
                                borderTopColor: AppleColors.blue,
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            <span>Loading lesson guide...</span>
                        </div>
                    ) : (
                        parsed && (
                            <>
                                {/* Styled Subtitle Blockquote */}
                                {parsed.body.startsWith('>') && (
                                    <blockquote style={{
                                        margin: '0 0 24px 0',
                                        fontSize: 17,
                                        lineHeight: 1.6,
                                        fontStyle: 'italic',
                                        color: 'rgba(255, 255, 255, 0.85)',
                                        borderLeft: `4px solid ${AppleColors.blue}`,
                                        paddingLeft: 20
                                    }}>
                                        {parsed.body.split('\n')[0].replace(/^>\s*/, '')}
                                    </blockquote>
                                )}

                                {/* Metadata blocks with stylized drop-cap T */}
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: 12,
                                    padding: '20px 24px',
                                    margin: '24px 0',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15 }}>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: 56, fontWeight: 900, color: AppleColors.blue, lineHeight: 0.85, fontFamily: 'monospace', float: 'left', marginRight: 4 }}>T</span>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center', height: 48 }}>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>ype: <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{parsed.type}</span></div>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>Languages: <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{parsed.languages}</span></div>
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: 12, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <div style={{ fontWeight: 600, color: '#fff' }}>Prerequisites: <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{parsed.prerequisites}</span></div>
                                            <div style={{ fontWeight: 600, color: '#fff' }}>Time: <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{parsed.time}</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Objectives box */}
                                {parsed.objectives.length > 0 && (
                                    <div style={{
                                        border: `1px solid ${AppleColors.blue}`,
                                        background: 'rgba(0, 122, 255, 0.04)',
                                        borderRadius: 12,
                                        padding: '20px 24px',
                                        margin: '24px 0',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: AppleColors.blue, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span>🎯 LEARNING OBJECTIVES</span>
                                        </div>
                                        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {parsed.objectives.map((obj, oIdx) => (
                                                <li key={oIdx} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                                                    {obj}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Pre-Lesson Quiz */}
                                {quizData && quizData.questions && quizData.questions.some((q: any) => q.stage === 'pre') && (
                                    <div style={{ margin: '32px 0' }}>
                                        <h3 style={{ fontSize: 15, fontWeight: 700, color: AppleColors.blue, letterSpacing: 0.5, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span>✅ PRE-LESSON CHECK</span>
                                        </h3>
                                        <QuizBlock 
                                            questions={quizData.questions.filter((q: any) => q.stage === 'pre')} 
                                            lessonPath={relativePath}
                                            stage="pre"
                                        />
                                    </div>
                                )}

                                {/* Markdown body */}
                                <div style={{ margin: '24px 0' }}>
                                    {renderMarkdown(parsed.body)}
                                </div>

                                {/* Post-Lesson Quiz */}
                                {quizData && quizData.questions && quizData.questions.some((q: any) => q.stage === 'post') && (
                                    <div style={{ margin: '40px 0', borderTop: `1px solid rgba(255, 255, 255, 0.08)`, paddingTop: 32 }}>
                                        <h3 style={{ fontSize: 15, fontWeight: 700, color: AppleColors.green, letterSpacing: 0.5, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span>✅ POST-LESSON QUIZ</span>
                                        </h3>
                                        <QuizBlock 
                                            questions={quizData.questions.filter((q: any) => q.stage === 'post')} 
                                            lessonPath={relativePath}
                                            stage="post"
                                        />
                                    </div>
                                )}

                                {/* Bottom navigation action bars */}
                                <div style={{ 
                                    marginTop: 48,
                                    paddingTop: 32,
                                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 16,
                                    paddingBottom: 80
                                }}>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button
                                            onClick={() => {
                                                triggerFeedback('light');
                                                onToggleComplete(activeLesson);
                                            }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                padding: '12px 20px',
                                                borderRadius: 10,
                                                border: `1px solid ${isCurrentCompleted ? AppleColors.green : 'rgba(255, 255, 255, 0.08)'}`,
                                                background: isCurrentCompleted ? 'rgba(52, 199, 89, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                                                color: isCurrentCompleted ? AppleColors.green : '#fff',
                                                fontSize: 14,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {isCurrentCompleted ? (
                                                <>
                                                    <CheckCircle2 size={16} />
                                                    Completed
                                                </>
                                            ) : (
                                                <>
                                                    <Circle size={16} />
                                                    Mark as Complete
                                                </>
                                            )}
                                        </button>

                                        {activeLesson.url && (
                                            <a
                                                href={activeLesson.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => triggerFeedback('light')}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    padding: '12px 20px',
                                                    borderRadius: 10,
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    background: 'rgba(255, 255, 255, 0.04)',
                                                    color: 'rgba(255,255,255,0.8)',
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <ExternalLink size={16} />
                                                Open on GitHub
                                            </a>
                                        )}
                                    </div>

                                    {nextInfo && (
                                        <button
                                            onClick={() => {
                                                triggerFeedback('light');
                                                onSelectLesson(nextInfo.lesson, nextInfo.phase);
                                            }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                padding: '12px 24px',
                                                borderRadius: 10,
                                                border: 'none',
                                                background: AppleColors.blue,
                                                color: '#fff',
                                                fontSize: 14,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'opacity 0.2s ease',
                                            }}
                                        >
                                            Next Lesson
                                            <ChevronRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERIC COURSE LEARNING WORKSPACE SUBCOMPONENTS & PARSER
// ═══════════════════════════════════════════════════════════════════════════════

const getCourseLessonPath = (lesson: any) => {
    if (lesson.path) return lesson.path;
    if (!lesson.keywords) return '';
    const match = lesson.keywords.match(/Path:\s*([^\s,]+)/i);
    return match ? match[1] : '';
};

function parseGenericCourseLessonMarkdown(mdText: string, lesson: any): ParsedLesson {
    const result: ParsedLesson = {
        type: lesson.type || 'Learn',
        languages: lesson.lang || '—',
        prerequisites: 'None',
        time: '—',
        objectives: [],
        body: mdText
    };

    // Extract objectives if present
    const objectivesSection = mdText.match(/## Learning Objectives([\s\S]*?)(?=##)/i);
    if (objectivesSection) {
        const objLines = objectivesSection[1].split('\n');
        result.objectives = objLines
            .map(line => line.trim())
            .filter(line => line.startsWith('-') || line.startsWith('*'))
            .map(line => line.replace(/^[-*]\s*/, '').trim());
    }

    // Clean H1 Title and sketchnote attribution
    let bodyText = mdText;
    bodyText = bodyText.replace(/^#\s+.*?\n+/m, ''); // remove H1 title
    result.body = bodyText.trim();
    return result;
}

interface CourseLearningWorkspaceProps {
    courseId: 'ai-beginners' | 'made-with-ml';
    activeLesson: any;
    activePhase: any;
    allPhases: any[];
    progressData: any;
    onSelectLesson: (lesson: any, phase: any) => void;
    onToggleComplete: (lesson: any) => void;
    onClose: () => void;
}

function CourseLearningWorkspace({
    courseId,
    activeLesson,
    activePhase,
    allPhases,
    progressData,
    onSelectLesson,
    onToggleComplete,
    onClose
}: CourseLearningWorkspaceProps) {
    const [lessonMd, setLessonMd] = useState<string | null>(null);
    const [isMdLoading, setIsMdLoading] = useState(false);
    const readerPanelRef = useRef<HTMLDivElement>(null);

    const relativePath = getCourseLessonPath(activeLesson);

    const [expandedSidebarPhases, setExpandedSidebarPhases] = useState<Record<number, boolean>>({
        [activePhase.id]: true
    });

    const toggleSidebarPhase = (phaseId: number) => {
        setExpandedSidebarPhases(prev => ({
            ...prev,
            [phaseId]: !prev[phaseId]
        }));
    };

    useEffect(() => {
        if (!activeLesson) return;

        if (readerPanelRef.current) {
            readerPanelRef.current.scrollTop = 0;
        }

        if (!relativePath) {
            setLessonMd(activeLesson.summary || 'No detailed content available.');
            return;
        }

        setIsMdLoading(true);
        setLessonMd(null);

        const mdUrl = `/elite-resources/${courseId}/${relativePath}`;
        fetch(mdUrl)
            .then(res => {
                if (!res.ok) throw new Error('Markdown not found');
                return res.text();
            })
            .then(text => {
                setLessonMd(text);
            })
            .catch(() => {
                setLessonMd(activeLesson.summary || 'No detailed content available.');
            })
            .finally(() => {
                setIsMdLoading(false);
            });
    }, [activeLesson, relativePath, courseId]);

    const parsed = useMemo(() => {
        if (!lessonMd) return null;
        return parseGenericCourseLessonMarkdown(lessonMd, activeLesson);
    }, [lessonMd, activeLesson]);

    const isCurrentCompleted = !!(relativePath && progressData.lessons[relativePath]?.completedAt);

    const getNextLesson = () => {
        const currentLessons = activePhase.lessons;
        const currentIndex = currentLessons.findIndex((l: any) => l.url === activeLesson.url && l.name === activeLesson.name);
        if (currentIndex !== -1 && currentIndex < currentLessons.length - 1) {
            return { lesson: currentLessons[currentIndex + 1], phase: activePhase };
        }
        
        const nextPhaseIndex = allPhases.findIndex(p => p.id === activePhase.id) + 1;
        if (nextPhaseIndex < allPhases.length) {
            const nextPhase = allPhases[nextPhaseIndex];
            if (nextPhase.lessons.length > 0) {
                return { lesson: nextPhase.lessons[0], phase: nextPhase };
            }
        }
        return null;
    };

    const nextInfo = getNextLesson();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: '#07080a',
            display: 'flex',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}>
            {/* Sidebar */}
            <div style={{
                width: 280,
                height: '100%',
                background: 'rgba(15, 17, 23, 0.95)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{
                    padding: '24px 16px 16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: AppleColors.blue,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: 0,
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to Hub
                    </button>
                </div>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                }}>
                    {allPhases.map((phase) => {
                        const isPhaseActive = phase.id === activePhase.id;
                        const isExpanded = !!expandedSidebarPhases[phase.id];
                        
                        let completedCount = 0;
                        phase.lessons.forEach((l: any) => {
                            const path = getCourseLessonPath(l);
                            if (path && progressData.lessons[path]?.completedAt) {
                                completedCount++;
                            }
                        });

                        return (
                            <div key={phase.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <div 
                                    onClick={() => toggleSidebarPhase(phase.id)}
                                    style={{
                                        padding: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderRadius: 6,
                                        userSelect: 'none',
                                        background: isPhaseActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                        <span style={{ 
                                            fontSize: 9, 
                                            fontWeight: 700, 
                                            color: isPhaseActive ? AppleColors.blue : 'rgba(255,255,255,0.3)',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5
                                        }}>
                                            Phase {String(phase.id).padStart(2, '0')}
                                        </span>
                                        <span style={{ 
                                            fontSize: 13, 
                                            fontWeight: 700, 
                                            color: isPhaseActive ? '#fff' : 'rgba(255,255,255,0.7)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {phase.name}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                                            {completedCount}/{phase.lessons.length}
                                        </span>
                                        <ChevronRight 
                                            size={12} 
                                            color="rgba(255,255,255,0.4)" 
                                            style={{ 
                                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s' 
                                            }} 
                                        />
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 4, marginTop: 4 }}>
                                        {phase.lessons.map((lesson: any, lIdx: number) => {
                                            const path = getCourseLessonPath(lesson);
                                            const isLessonCompleted = !!(path && progressData.lessons[path]?.completedAt);
                                            const isLessonActive = lesson.url === activeLesson.url && lesson.name === activeLesson.name;

                                            return (
                                                <div
                                                    key={lIdx}
                                                    onClick={() => onSelectLesson(lesson, phase)}
                                                    style={{
                                                        padding: '8px 10px',
                                                        borderRadius: 8,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        background: isLessonActive ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                                                        borderLeft: `3px solid ${isLessonActive ? AppleColors.blue : 'transparent'}`,
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                >
                                                    {isLessonCompleted ? (
                                                        <CheckCircle2 size={13} color={AppleColors.green} style={{ flexShrink: 0 }} />
                                                    ) : (
                                                        <Circle size={13} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                                                    )}
                                                    <span style={{
                                                        fontSize: 13,
                                                        fontWeight: isLessonActive ? 600 : 400,
                                                        color: isLessonActive ? '#fff' : (isLessonCompleted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'),
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        flex: 1
                                                    }}>
                                                        {lesson.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reader Panel */}
            <div 
                ref={readerPanelRef}
                style={{
                    flex: 1,
                    height: '100%',
                    overflowY: 'auto',
                    position: 'relative',
                    background: '#0B0D13',
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    padding: '40px 60px',
                    scrollBehavior: 'smooth',
                }}
            >
                {/* Neon Glow backdrop */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '300px',
                    background: 'radial-gradient(circle at 50% 0%, rgba(10, 132, 255, 0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    {/* Breadcrumbs */}
                    <div style={{ 
                        fontSize: 12, 
                        fontWeight: 600, 
                        color: AppleColors.blue, 
                        textTransform: 'uppercase', 
                        letterSpacing: 1,
                        marginBottom: 8
                    }}>
                        {activePhase.name}
                    </div>

                    <h1 style={{ 
                        fontSize: 36, 
                        fontWeight: 800, 
                        color: '#fff', 
                        marginBottom: 16,
                        letterSpacing: '-0.5px' 
                    }}>
                        {activeLesson.name}
                    </h1>

                    <hr style={{ border: 'none', height: 1, background: 'rgba(255, 255, 255, 0.08)', marginBottom: 20 }} />

                    {isMdLoading ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '100px 0',
                            color: 'rgba(255,255,255,0.4)',
                            gap: 12
                        }}>
                            <div style={{
                                width: 24,
                                height: 24,
                                border: '2px solid rgba(255,255,255,0.1)',
                                borderTopColor: AppleColors.blue,
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            <span>Loading lesson guide...</span>
                        </div>
                    ) : (
                        parsed && (
                            <>
                                {/* Metadata blocks with stylized drop-cap T */}
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: 12,
                                    padding: '20px 24px',
                                    margin: '24px 0',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15 }}>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: 56, fontWeight: 900, color: AppleColors.blue, lineHeight: 0.85, fontFamily: 'monospace', float: 'left', marginRight: 4 }}>T</span>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center', height: 48 }}>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>ype: <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{parsed.type}</span></div>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>Languages: <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{parsed.languages}</span></div>
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: 12, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <div style={{ fontWeight: 600, color: '#fff' }}>Prerequisites: <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{parsed.prerequisites}</span></div>
                                            <div style={{ fontWeight: 600, color: '#fff' }}>Time: <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>{parsed.time}</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Markdown body */}
                                <div style={{ margin: '24px 0' }}>
                                    {renderMarkdown(parsed.body)}
                                </div>

                                {/* Bottom navigation action bars */}
                                <div style={{ 
                                    marginTop: 48,
                                    paddingTop: 32,
                                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 16,
                                    paddingBottom: 80
                                }}>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button
                                            onClick={() => {
                                                triggerFeedback('light');
                                                onToggleComplete(activeLesson);
                                            }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                padding: '12px 20px',
                                                borderRadius: 10,
                                                border: `1px solid ${isCurrentCompleted ? AppleColors.green : 'rgba(255, 255, 255, 0.08)'}`,
                                                background: isCurrentCompleted ? 'rgba(52, 199, 89, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                                                color: isCurrentCompleted ? AppleColors.green : '#fff',
                                                fontSize: 14,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {isCurrentCompleted ? (
                                                <>
                                                    <CheckCircle2 size={16} />
                                                    Completed
                                                </>
                                            ) : (
                                                <>
                                                    <Circle size={16} />
                                                    Mark as Complete
                                                </>
                                            )}
                                        </button>

                                        {activeLesson.url && (
                                            <a
                                                href={activeLesson.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => triggerFeedback('light')}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    padding: '12px 20px',
                                                    borderRadius: 10,
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    background: 'rgba(255, 255, 255, 0.04)',
                                                    color: 'rgba(255,255,255,0.8)',
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <ExternalLink size={16} />
                                                Open on GitHub
                                            </a>
                                        )}
                                    </div>

                                    {nextInfo && (
                                        <button
                                            onClick={() => {
                                                triggerFeedback('light');
                                                onSelectLesson(nextInfo.lesson, nextInfo.phase);
                                            }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                padding: '12px 24px',
                                                borderRadius: 10,
                                                border: 'none',
                                                background: AppleColors.blue,
                                                color: '#fff',
                                                fontSize: 14,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'opacity 0.2s ease',
                                            }}
                                        >
                                            Next Lesson
                                            <ChevronRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

// Updated: iteration 4
// Updated: iteration 10
// Updated: iteration 14
// Updated: iteration 20
// Updated: iteration 24

// Updated: iteration 26
// Updated: iteration 27
// Updated: iteration 28
