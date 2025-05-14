import { useState } from 'react';
import {
    TrendingUp, Target, CheckCircle2,
    ChevronDown, ChevronUp, Calendar, Award, DollarSign
} from 'lucide-react';

// Income Tracker Dashboard - 2026 Goals
// Apple HIG + Liquid Glass Design

interface IncomeStream {
    id: string;
    name: string;
    icon: string;
    color: string;
    conservativeTarget: number;
    stretchTarget: number;
    current: number;
    quarterlyBreakdown: number[];
    verificationChecklist: { item: string; verified: boolean }[];
    description: string;
}

const INCOME_STREAMS: IncomeStream[] = [
    {
        id: 'consulting',
        name: 'AI Consulting',
        icon: '🤖',
        color: '#007AFF',
        conservativeTarget: 38000,
        stretchTarget: 60000,
        current: 0,
        quarterlyBreakdown: [5000, 10000, 12000, 11000],
        verificationChecklist: [
            { item: 'First consulting gig secured', verified: false },
            { item: 'Rate increased to $150/hr', verified: false },
            { item: '10+ clients served', verified: false },
            { item: 'Testimonials collected', verified: false },
        ],
        description: 'AI/ML consulting for startups and enterprises'
    },
    {
        id: 'trading',
        name: 'Quantitative Trading',
        icon: '📈',
        color: '#30D158',
        conservativeTarget: 75000,
        stretchTarget: 150000,
        current: 0,
        quarterlyBreakdown: [10000, 20000, 25000, 20000],
        verificationChecklist: [
            { item: 'Trading account funded ($50K)', verified: false },
            { item: 'First profitable month', verified: false },
            { item: 'Consistent 3-month streak', verified: false },
            { item: 'Strategy backtested >2 years', verified: false },
        ],
        description: 'Algorithmic trading with ML strategies'
    },
    {
        id: 'digital',
        name: 'Digital Products',
        icon: '📦',
        color: '#FF9F0A',
        conservativeTarget: 18000,
        stretchTarget: 30000,
        current: 0,
        quarterlyBreakdown: [2000, 5000, 6000, 5000],
        verificationChecklist: [
            { item: 'First product launched', verified: false },
            { item: 'Email list >1000 subscribers', verified: false },
            { item: '100+ sales achieved', verified: false },
            { item: 'Product iteration based on feedback', verified: false },
        ],
        description: 'Courses, templates, and AI tools'
    },
    {
        id: 'github',
        name: 'GitHub Sponsors',
        icon: '💜',
        color: '#BF5AF2',
        conservativeTarget: 6000,
        stretchTarget: 12000,
        current: 0,
        quarterlyBreakdown: [500, 1500, 2000, 2000],
        verificationChecklist: [
            { item: 'Sponsors page set up', verified: false },
            { item: 'First sponsor acquired', verified: false },
            { item: '10+ sponsors', verified: false },
            { item: 'Featured project >1K stars', verified: false },
        ],
        description: 'Open source contributions and sponsorships'
    },
    {
        id: 'speaking',
        name: 'Speaking & Research',
        icon: '🎤',
        color: '#FF375F',
        conservativeTarget: 9000,
        stretchTarget: 18000,
        current: 0,
        quarterlyBreakdown: [1000, 2500, 3000, 2500],
        verificationChecklist: [
            { item: 'First paid talk booked', verified: false },
            { item: 'Research paper published', verified: false },
            { item: 'Conference speaker (top-tier)', verified: false },
            { item: 'Workshop facilitated', verified: false },
        ],
        description: 'Conference talks, workshops, and publications'
    },
    {
        id: 'internship',
        name: 'Summer Internship',
        icon: '🏢',
        color: '#5E5CE6',
        conservativeTarget: 35000,
        stretchTarget: 45000,
        current: 0,
        quarterlyBreakdown: [0, 0, 35000, 0],
        verificationChecklist: [
            { item: 'Applications submitted (10+)', verified: false },
            { item: 'Interview secured', verified: false },
            { item: 'Offer received', verified: false },
            { item: 'Internship completed', verified: false },
        ],
        description: 'FAANG/Quant internship (May-August)'
    },
];

const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
};

function StreamCard({ stream, onUpdate }: { stream: IncomeStream; onUpdate: (id: string, amount: number) => void }) {
    const [expanded, setExpanded] = useState(false);
    const [inputValue, setInputValue] = useState(stream.current.toString());

    const progress = (stream.current / stream.conservativeTarget) * 100;
    const verifiedCount = stream.verificationChecklist.filter(c => c.verified).length;

    return (
        <div className="income-item" style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer' }}>
            {/* Header */}
            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                }}
            >
                <div className="income-item-icon" style={{ background: `${stream.color}15`, color: stream.color }}>
                    <span style={{ fontSize: '1.5rem' }}>{stream.icon}</span>
                </div>
                <div className="income-item-details">
                    <div className="income-item-source">{stream.name}</div>
                    <div className="income-item-date">{stream.description}</div>
                </div>
                <div style={{ textAlign: 'right', marginRight: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: stream.color }}>
                        {formatCurrency(stream.current)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        / {formatCurrency(stream.conservativeTarget)}
                    </div>
                </div>
                {expanded ?
                    <ChevronUp size={20} color="var(--text-tertiary)" /> :
                    <ChevronDown size={20} color="var(--text-tertiary)" />
                }
            </div>

            {/* Progress Bar */}
            <div className="roadmap-card-progress" style={{ marginTop: '16px' }}>
                <div
                    className="roadmap-card-progress-bar"
                    style={{
                        width: `${Math.min(progress, 100)}%`,
                        background: `linear-gradient(90deg, ${stream.color}, ${stream.color}cc)`,
                    }}
                />
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
            }}>
                <span style={{ color: stream.color, fontWeight: 500 }}>{progress.toFixed(1)}% achieved</span>
                <span>Stretch: {formatCurrency(stream.stretchTarget)}</span>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div style={{
                    marginTop: '20px',
                    borderTop: '1px solid var(--glass-border-light)',
                    paddingTop: '20px'
                }}>
                    {/* Update Income */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '8px',
                            display: 'block',
                            fontWeight: 500
                        }}>
                            Update Current Income
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="0"
                                className="income-input"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdate(stream.id, parseFloat(inputValue) || 0);
                                }}
                                className="roadmap-btn roadmap-btn-primary"
                                style={{ flex: 'none', background: stream.color }}
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    {/* Quarterly Breakdown */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            marginBottom: '10px'
                        }}>
                            Quarterly Targets
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                            {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
                                <div key={q} style={{
                                    padding: '12px',
                                    background: 'rgba(0, 0, 0, 0.04)',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center',
                                }}>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-tertiary)',
                                        marginBottom: '4px'
                                    }}>{q}</div>
                                    <div style={{ fontWeight: 600, color: stream.color }}>
                                        {formatCurrency(stream.quarterlyBreakdown[i])}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verification Checklist */}
                    <div>
                        <div style={{
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            marginBottom: '10px'
                        }}>
                            Verification Checklist ({verifiedCount}/{stream.verificationChecklist.length})
                        </div>
                        {stream.verificationChecklist.map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 0',
                                borderBottom: i < stream.verificationChecklist.length - 1
                                    ? '1px solid var(--glass-border-light)'
                                    : 'none',
                            }}>
                                <CheckCircle2
                                    size={20}
                                    color={item.verified ? '#30D158' : 'var(--text-tertiary)'}
                                    fill={item.verified ? 'rgba(48, 209, 88, 0.15)' : 'transparent'}
                                />
                                <span style={{
                                    fontSize: '0.875rem',
                                    color: item.verified ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    textDecoration: item.verified ? 'line-through' : 'none',
                                }}>
                                    {item.item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function IncomeTracker() {
    const [streams, setStreams] = useState(INCOME_STREAMS);

    const totalConservative = streams.reduce((s, st) => s + st.conservativeTarget, 0);
    const totalStretch = streams.reduce((s, st) => s + st.stretchTarget, 0);
    const totalCurrent = streams.reduce((s, st) => s + st.current, 0);
    const overallProgress = (totalCurrent / totalConservative) * 100;

    const handleUpdate = (id: string, amount: number) => {
        setStreams(prev => prev.map(s => s.id === id ? { ...s, current: amount } : s));
    };

    return (
        <div className="income-container">
            {/* Header */}
            <div className="income-header">
                <h1>
                    💰 2026 Income Tracker
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    6 Verified Income Streams • Track Your Progress to $300K
                </p>
            </div>

            {/* Total Income Card - Hero */}
            <div className="income-total-card">
                <div className="income-total-label">
                    TOTAL EARNED
                </div>
                <div className="income-total-value">
                    {formatCurrency(totalCurrent)}
                </div>
                <div className="income-goal">
                    Goal: <strong>{formatCurrency(totalConservative)}</strong> (Stretch: {formatCurrency(totalStretch)})
                </div>

                {/* Progress Bar */}
                <div style={{
                    marginTop: '24px',
                    height: '12px',
                    background: 'rgba(255,255,255,0.25)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(overallProgress, 100)}%`,
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.7))',
                        borderRadius: '6px',
                        transition: 'width 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                    }} />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.85)',
                }}>
                    <span style={{ fontWeight: 600 }}>{overallProgress.toFixed(1)}% achieved</span>
                    <span style={{ opacity: 0.7 }}>
                        {formatCurrency(totalConservative - totalCurrent)} remaining
                    </span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="roadmap-stats" style={{ marginBottom: 'var(--space-8)' }}>
                <div className="roadmap-stat-card">
                    <div className="roadmap-stat-icon blue">
                        <Target size={22} />
                    </div>
                    <div className="roadmap-stat-content">
                        <div className="roadmap-stat-value">{formatCurrency(totalConservative)}</div>
                        <div className="roadmap-stat-label">Conservative Goal</div>
                    </div>
                </div>
                <div className="roadmap-stat-card">
                    <div className="roadmap-stat-icon orange">
                        <Award size={22} />
                    </div>
                    <div className="roadmap-stat-content">
                        <div className="roadmap-stat-value">{formatCurrency(totalStretch)}</div>
                        <div className="roadmap-stat-label">Stretch Goal</div>
                    </div>
                </div>
                <div className="roadmap-stat-card">
                    <div className="roadmap-stat-icon green">
                        <TrendingUp size={22} />
                    </div>
                    <div className="roadmap-stat-content">
                        <div className="roadmap-stat-value">{streams.length}</div>
                        <div className="roadmap-stat-label">Income Streams</div>
                    </div>
                </div>
            </div>

            {/* Income Streams */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <DollarSign size={22} color="var(--color-green)" />
                    Income Streams
                </h2>
                <div className="income-list">
                    {streams.map(stream => (
                        <StreamCard key={stream.id} stream={stream} onUpdate={handleUpdate} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                padding: '24px',
                color: 'var(--text-tertiary)',
                fontSize: '0.8125rem',
            }}>
                <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Updated: {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </div>
        </div>
    );
}
