import { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Target, BookOpen, Brain, Trophy, ChevronRight, Search, X,
    Clock, Zap, Play, Minus, Plus, FileText, ExternalLink, Sparkles
} from 'lucide-react';
import { ALL_AI_TOPICS, type AITopic } from './data/aiTopics';
import { CEO_SKILLS, type CEOSkill } from './data/ceoSkills';
import { ALL_BOOKS, type Book } from './data/books';
import { POLYMATH_METHODS, RESILIENCE_ACTIVITIES, TOP_BILLIONAIRE_SKILLS, type PolymathMethod } from './data/polymathMethods';
import { getResourcesForTopic } from './data/topicResources';
import { getResourcesForSkill } from './data/skillResources';
import { ALL_PAPERS, type Paper } from './data/papers';
import {
    setTopicStatus, setSkillLevel, setBookStatus, updateBookPage,
    getAllTopicsProgress, getAllSkillsProgress, getAllBooksProgress,
    getAllMethodsProgress, incrementMethodPractice, setMethodMastered,
    getAllResilienceProgress, completeResilienceActivity,
    type TopicProgress, type SkillProgress, type BookProgress, type TopicStatus, type BookStatus,
    type MethodProgress, type ResilienceProgress
} from './services/progressStore';
import { triggerFeedback } from './services/feedback';

// Breakpoints for responsiveness - handled via responsive class styles

type RoadmapTab = 'topics' | 'skills' | 'books' | 'polymath' | 'milestones' | 'papers';

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
// DETAIL MODAL - Apple Sheet Style
// ═══════════════════════════════════════════════════════════════════════════════

function DetailModal({
    isOpen,
    onClose,
    type,
    data,
    storedProgress,
    onUpdate
}: {
    isOpen: boolean;
    onClose: () => void;
    type: 'topic' | 'skill' | 'book';
    data: AITopic | CEOSkill | Book | null;
    storedProgress: {
        topics: Record<number, TopicProgress>;
        skills: Record<number, SkillProgress>;
        books: Record<number, BookProgress>;
    };
    onUpdate: () => void;
}) {
    if (!isOpen || !data) return null;

    const topicData = type === 'topic' ? data as AITopic : null;
    const skillData = type === 'skill' ? data as CEOSkill : null;
    const bookData = type === 'book' ? data as Book : null;

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
                    maxWidth: 480,
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
                            type === 'skill' ? 'Skill Details' : 'Book Details'}
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

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ROADMAP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Roadmap() {
    const [activeTab, setActiveTab] = useState<RoadmapTab>('topics');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQuarter, setSelectedQuarter] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ type: 'topic' | 'skill' | 'book'; data: AITopic | CEOSkill | Book } | null>(null);

    // Progress state
    const [topicsProgressData, setTopicsProgressData] = useState(getAllTopicsProgress());
    const [skillsProgressData, setSkillsProgressData] = useState(getAllSkillsProgress());
    const [booksProgressData, setBooksProgressData] = useState(getAllBooksProgress());
    const [methodsProgressData, setMethodsProgressData] = useState(getAllMethodsProgress());
    const [resilienceProgressData, setResilienceProgressData] = useState(getAllResilienceProgress());

    const refreshProgress = useCallback(() => {
        setTopicsProgressData(getAllTopicsProgress());
        setSkillsProgressData(getAllSkillsProgress());
        setBooksProgressData(getAllBooksProgress());
        setMethodsProgressData(getAllMethodsProgress());
        setResilienceProgressData(getAllResilienceProgress());
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
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            topics = topics.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query)
            );
        }
        return topics;
    }, [selectedQuarter, selectedCategory, searchQuery]);

    // Filter skills
    const filteredSkills = useMemo(() => {
        let skills = CEO_SKILLS;
        if (selectedCategory !== 'all') {
            skills = skills.filter(s => s.category === selectedCategory);
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            skills = skills.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.category.toLowerCase().includes(query)
            );
        }
        return skills;
    }, [selectedCategory, searchQuery]);

    // Filter books
    const filteredBooks = useMemo(() => {
        let books = ALL_BOOKS;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            books = books.filter(b =>
                b.title.toLowerCase().includes(query) ||
                b.author.toLowerCase().includes(query)
            );
        }
        return books;
    }, [searchQuery]);

    const openModal = (type: 'topic' | 'skill' | 'book', data: AITopic | CEOSkill | Book) => {
        setSelectedItem({ type, data });
        setModalOpen(true);
    };

    const tabs = [
        { id: 'polymath' as RoadmapTab, label: 'Polymath', icon: <Sparkles size={18} />, count: 5 },
        { id: 'topics' as RoadmapTab, label: 'AI Topics', icon: <Brain size={18} />, count: topicsProgress.total },
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
            padding: '100px 20px 40px 20px',
            maxWidth: 1200,
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
            {activeTab !== 'milestones' && (
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
                    {Object.entries(ALL_PAPERS).map(([domain, papers], dIdx) => (
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
                                    <GlassCard key={pIdx} padding={16} hoverable>
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
                                                marginBottom: 'auto'
                                            }}>
                                                {paper.title}
                                            </h3>
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
            />
        </div>
    );
}

// Updated: iteration 4

// Updated: iteration 10

// Updated: iteration 14

// Updated: iteration 20

// Updated: iteration 24

// Updated: iteration 26
