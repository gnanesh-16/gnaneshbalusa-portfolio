import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Footer } from '../components/Footer';
import { Icons } from '../components/Icons';

// ─── Types ────────────────────────────────────────────────────────────────────
type CourseDoc = {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    instructor?: string;
    level?: string;
    category?: string;
    sessions?: string;
    duration?: string;
    prerequisites?: string;
    link?: string;
    status?: string;
    order: number;
};

type CourseNav = 'overview' | 'sessions' | 'prerequisites' | 'resources';
type PageTheme = 'system' | 'light' | 'dark';

// ─── Inline monitor icon (for "system" theme option) ─────────────────────────
const MonitorIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
    </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseSessions = (raw: string | undefined): string[] => {
    if (!raw) return [];
    return raw.split('\n').map(s => s.trim()).filter(Boolean);
};

const getSystemDark = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

// ─── Local theme hook (independent of locked global ThemeContext) ─────────────
function usePageTheme() {
    const [pageTheme, setPageTheme] = useState<PageTheme>(() => {
        const saved = localStorage.getItem('courses_theme') as PageTheme | null;
        return saved ?? 'system';
    });

    const isDark =
        pageTheme === 'dark' ||
        (pageTheme === 'system' && getSystemDark());

    useEffect(() => {
        localStorage.setItem('courses_theme', pageTheme);
    }, [pageTheme]);

    useEffect(() => {
        if (pageTheme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => setPageTheme('system');
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [pageTheme]);

    return { pageTheme, setPageTheme, isDark };
}

// ─── Theme Switcher ───────────────────────────────────────────────────────────
const ThemeSwitcher: React.FC<{
    pageTheme: PageTheme;
    setPageTheme: (t: PageTheme) => void;
    isDark: boolean;
}> = ({ pageTheme, setPageTheme, isDark }) => {
    const options: { id: PageTheme; icon: React.ReactNode; label: string }[] = [
        { id: 'light', icon: <Icons.Sun className="w-4 h-4" />, label: 'Light' },
        { id: 'system', icon: <MonitorIcon className="w-4 h-4" />, label: 'System' },
        { id: 'dark', icon: <Icons.Moon className="w-4 h-4" />, label: 'Dark' },
    ];
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 12,
            padding: 4,
            background: isDark ? '#1a1a1a' : '#f0f0f0',
            border: `1px solid ${isDark ? '#2a2a2a' : '#e0e0e0'}`,
        }}>
            {options.map(opt => {
                const active = pageTheme === opt.id;
                return (
                    <button
                        key={opt.id}
                        onClick={() => setPageTheme(opt.id)}
                        title={opt.label}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 30, height: 30, borderRadius: 8,
                            background: active ? (isDark ? '#2f2f2f' : '#fff') : 'transparent',
                            color: active ? (isDark ? '#f0f0f0' : '#1a1a1a') : (isDark ? '#666' : '#aaa'),
                            border: 'none', cursor: 'pointer',
                            boxShadow: active ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                            transition: 'all 0.15s',
                        }}
                    >
                        {opt.icon}
                    </button>
                );
            })}
        </div>
    );
};

// ─── Catalog Card ─────────────────────────────────────────────────────────────
const CourseCard: React.FC<{ course: CourseDoc; onClick: () => void; isDark: boolean }> = ({ course, onClick, isDark }) => {
    const sessions = parseSessions(course.sessions);
    const border = isDark ? '#2a2a2a' : '#e5e5e5';
    const textMain = isDark ? '#f0f0f0' : '#1a1a1a';
    const textMuted = isDark ? '#a0a0a0' : '#666';
    return (
        <button
            onClick={onClick}
            className="group text-left w-full flex flex-col overflow-hidden transition-all duration-200"
            style={{
                background: isDark ? '#1a1a1a' : '#fff',
                border: `1px solid ${border}`,
                borderRadius: 16,
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = isDark ? '#444' : '#1a1a1a';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.09)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = border;
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
        >
            {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
                <div className="w-full h-44 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%)' }}>
                    <Icons.BookOpen className="w-12 h-12" style={{ color: 'rgba(255,255,255,0.12)' }} />
                </div>
            )}
            <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex flex-wrap gap-1.5">
                    {course.category && (
                        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 10px', borderRadius: 9999, background: isDark ? '#2a2a2a' : '#f5f5f5', color: textMuted }}>
                            {course.category}
                        </span>
                    )}
                    {course.level && (
                        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 10px', borderRadius: 9999, background: isDark ? '#2a1a1a' : '#fff0f0', color: isDark ? '#f87171' : '#c0392b' }}>
                            {course.level}
                        </span>
                    )}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4, color: textMain }}>{course.title}</h3>
                <p style={{ fontSize: 13, color: textMuted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                    {course.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 12, color: isDark ? '#555' : '#aaa', paddingTop: 10, borderTop: `1px solid ${isDark ? '#242424' : '#f0f0f0'}` }}>
                    {course.instructor && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icons.Eye className="w-3.5 h-3.5" />{course.instructor}</span>}
                    {course.duration && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icons.Clock className="w-3.5 h-3.5" />{course.duration}</span>}
                    {sessions.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icons.Layers className="w-3.5 h-3.5" />{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>}
                </div>
            </div>
        </button>
    );
};

// ─── Course Detail — OCW-style left sidebar ───────────────────────────────────
const CourseDetail: React.FC<{ course: CourseDoc; onBack: () => void; isDark: boolean }> = ({ course, onBack, isDark }) => {
    const [activeNav, setActiveNav] = useState<CourseNav>('overview');
    const sessions = parseSessions(course.sessions);

    const navItems: { id: CourseNav; label: string }[] = [
        { id: 'overview', label: 'Overview' },
        ...(sessions.length > 0 ? [{ id: 'sessions' as CourseNav, label: 'Sessions' }] : []),
        ...(course.prerequisites ? [{ id: 'prerequisites' as CourseNav, label: 'Prerequisites' }] : []),
        ...(course.link ? [{ id: 'resources' as CourseNav, label: 'Resources' }] : []),
    ];

    // OCW crimson accent
    const ACCENT = '#c0392b';
    const border = isDark ? '#2a2a2a' : '#e5e5e5';
    const textMain = isDark ? '#f0f0f0' : '#1a1a1a';
    const textMuted = isDark ? '#a0a0a0' : '#666';
    const sidebarBg = isDark ? '#181818' : '#f9f9f9';

    return (
        <div style={{ display: 'flex', minHeight: '65vh' }}>

            {/* ── Left Sidebar (OCW style, desktop) ── */}
            <aside className="hidden md:flex flex-col" style={{
                width: 210,
                flexShrink: 0,
                borderRight: `1px solid ${border}`,
                paddingTop: 28,
                paddingBottom: 48,
                background: sidebarBg,
            }}>
                {navItems.map(item => {
                    const active = activeNav === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px 20px',
                                fontSize: 14,
                                fontWeight: active ? 700 : 400,
                                color: active ? ACCENT : textMuted,
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                borderLeft: `3px solid ${active ? ACCENT : 'transparent'}`,
                                transition: 'color 0.12s',
                                fontFamily: 'Manrope, sans-serif',
                            }}
                            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = textMain; }}
                            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = textMuted; }}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </aside>

            {/* ── Mobile nav pills ── */}
            <div className="md:hidden w-full absolute" style={{ position: 'initial' }}>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 4px 12px', borderBottom: `1px solid ${border}` }}>
                    {navItems.map(item => {
                        const active = activeNav === item.id;
                        return (
                            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
                                flexShrink: 0,
                                padding: '7px 16px',
                                borderRadius: 9999,
                                fontSize: 13,
                                fontWeight: active ? 700 : 500,
                                color: active ? '#fff' : textMuted,
                                background: active ? ACCENT : (isDark ? '#2a2a2a' : '#f0f0f0'),
                                border: 'none',
                                cursor: 'pointer',
                            }}>
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Main Content ── */}
            <div style={{ flex: 1, padding: '28px 40px 60px', maxWidth: 760, minWidth: 0, boxSizing: 'border-box' }} className="px-4 md:px-10">
                <h2 style={{ fontSize: 20, fontWeight: 700, color: textMain, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${border}` }}>
                    {navItems.find(n => n.id === activeNav)?.label}
                </h2>

                {/* Overview */}
                {activeNav === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <p style={{ color: textMuted, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: 15 }}>{course.description}</p>
                        {course.thumbnail && (
                            <img src={course.thumbnail} alt={course.title}
                                style={{ maxWidth: 480, width: '100%', borderRadius: 12, border: `1px solid ${border}` }}
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        )}
                        {course.link && (
                            <a href={course.link} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 20px', borderRadius: 9999, fontSize: 14, fontWeight: 600,
                                background: isDark ? '#fff' : '#1a1a1a', color: isDark ? '#1a1a1a' : '#fff',
                                textDecoration: 'none', width: 'fit-content', transition: 'opacity 0.15s',
                            }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                            >
                                <Icons.ArrowRight className="w-4 h-4" /> Access Course Materials
                            </a>
                        )}
                    </div>
                )}

                {/* Sessions */}
                {activeNav === 'sessions' && (
                    <div>
                        <p style={{ color: textMuted, fontSize: 13, marginBottom: 16 }}>{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
                        <ol style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
                            {sessions.map((s, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', background: isDark ? '#1a1a1a' : '#fafafa', border: `1px solid ${border}`, borderRadius: 10 }}>
                                    <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: isDark ? '#2a2a2a' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: textMuted }}>
                                        {i + 1}
                                    </span>
                                    <span style={{ fontSize: 14, fontWeight: 500, color: textMain, paddingTop: 5, lineHeight: 1.5 }}>{s}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* Prerequisites */}
                {activeNav === 'prerequisites' && (
                    <div style={{ padding: '18px 20px', background: isDark ? '#1a1a1a' : '#fafafa', border: `1px solid ${border}`, borderRadius: 10 }}>
                        <p style={{ color: textMuted, lineHeight: 1.75, whiteSpace: 'pre-wrap', fontSize: 14 }}>{course.prerequisites}</p>
                    </div>
                )}

                {/* Resources */}
                {activeNav === 'resources' && course.link && (
                    <a href={course.link} target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '18px 20px', background: isDark ? '#1a1a1a' : '#fafafa',
                        border: `1px solid ${border}`, borderRadius: 10, textDecoration: 'none', transition: 'border-color 0.15s',
                    }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = ACCENT}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = border}
                    >
                        <Icons.ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: ACCENT }} />
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: textMain, marginBottom: 2 }}>Course Materials</p>
                            <p style={{ fontSize: 12, color: textMuted, wordBreak: 'break-all' }}>{course.link}</p>
                        </div>
                    </a>
                )}
            </div>

            {/* ── Right "Course Info" panel (OCW style, xl+) ── */}
            <aside className="hidden xl:flex flex-col" style={{
                width: 220,
                flexShrink: 0,
                borderLeft: `1px solid ${border}`,
                padding: '28px 20px',
                gap: 22,
                background: sidebarBg,
            }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: textMain, paddingBottom: 14, borderBottom: `1px solid ${border}` }}>Course Info</p>
                <InfoRow label="INSTRUCTOR" value={course.instructor || 'Gnanesh Balusa'} accent={ACCENT} textMuted={textMuted} useAccent />
                {course.level && <InfoRow label="LEVEL" value={course.level} textMuted={textMuted} textMain={textMain} />}
                {course.duration && <InfoRow label="AS TAUGHT IN" value={course.duration} textMuted={textMuted} textMain={textMain} />}
                {course.category && <InfoRow label="TOPICS" value={course.category} accent={ACCENT} textMuted={textMuted} useAccent />}
                {sessions.length > 0 && <InfoRow label="SESSIONS" value={String(sessions.length)} textMuted={textMuted} textMain={textMain} />}
            </aside>
        </div>
    );
};

// Small helper for the right panel rows
const InfoRow: React.FC<{ label: string; value: string; textMuted: string; textMain?: string; accent?: string; useAccent?: boolean }> =
    ({ label, value, textMuted, textMain = '#f0f0f0', accent = '#c0392b', useAccent = false }) => (
        <div>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: 5 }}>{label}</p>
            <p style={{ fontSize: 13, color: useAccent ? accent : textMain }}>{value}</p>
        </div>
    );

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const CourseSkeleton: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <div style={{
        background: isDark ? '#1a1a1a' : '#fff',
        border: `1px solid ${isDark ? '#2a2a2a' : '#e5e5e5'}`,
        borderRadius: 16, overflow: 'hidden',
        animation: 'pulse 1.5s ease-in-out infinite',
    }}>
        <div style={{ width: '100%', height: 176, background: isDark ? '#2a2a2a' : '#f0f0f0' }} />
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ height: 20, width: 80, background: isDark ? '#2a2a2a' : '#f0f0f0', borderRadius: 9999 }} />
                <div style={{ height: 20, width: 60, background: isDark ? '#2a2a2a' : '#f0f0f0', borderRadius: 9999 }} />
            </div>
            <div style={{ height: 16, width: '75%', background: isDark ? '#2a2a2a' : '#f0f0f0', borderRadius: 6 }} />
            <div style={{ height: 12, width: '100%', background: isDark ? '#2a2a2a' : '#f0f0f0', borderRadius: 6 }} />
            <div style={{ height: 12, width: '60%', background: isDark ? '#2a2a2a' : '#f0f0f0', borderRadius: 6 }} />
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export const CoursesByGnanesh: React.FC = () => {
    const { pageTheme, setPageTheme, isDark } = usePageTheme();
    const rawCourses = useQuery(api.portfolio.getPublishedCourses);
    const isLoading = rawCourses === undefined;
    const courses = (rawCourses ?? []) as CourseDoc[];
    const [selectedCourse, setSelectedCourse] = useState<CourseDoc | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [filterLevel, setFilterLevel] = useState<string>('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        document.title = selectedCourse
            ? `${selectedCourse.title} | Courses by Gnanesh`
            : 'Courses by Gnanesh Balusa';
    }, [selectedCourse]);

    const categories = ['All', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean))) as string[]];
    const levels = ['All', ...Array.from(new Set(courses.map(c => c.level).filter(Boolean))) as string[]];

    const filtered = courses.filter(c => {
        const matchCat = filterCategory === 'All' || c.category === filterCategory;
        const matchLvl = filterLevel === 'All' || c.level === filterLevel;
        const matchSearch = !search
            || c.title.toLowerCase().includes(search.toLowerCase())
            || (c.description ?? '').toLowerCase().includes(search.toLowerCase());
        return matchCat && matchLvl && matchSearch;
    });

    // Style tokens
    const bg = isDark ? '#131313' : '#FDFBF7';
    const bgCard = isDark ? '#1a1a1a' : '#fff';
    const border = isDark ? '#2a2a2a' : '#e5e5e5';
    const textMain = isDark ? '#f0f0f0' : '#1a1a1a';
    const textMuted = isDark ? '#a0a0a0' : '#666';
    const ACCENT = '#c0392b';

    return (
        <div style={{ minHeight: '100vh', background: bg, color: textMain, fontFamily: 'Manrope, sans-serif', display: 'flex', flexDirection: 'column' }}>

            {/* ── Sticky Header ── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: isDark ? 'rgba(19,19,19,0.88)' : 'rgba(253,251,247,0.88)',
                backdropFilter: 'blur(14px)',
                borderBottom: `1px solid ${border}`,
            }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', padding: '13px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    {/* Brand */}
                    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: textMain }}>Gnanesh Balusa</span>
                        <span style={{ color: isDark ? '#383838' : '#ddd' }}>/</span>
                        <span style={{ fontSize: 15, fontWeight: 600, color: textMuted }}>Courses</span>
                    </a>

                    {/* Right controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        {selectedCourse && (
                            <button onClick={() => setSelectedCourse(null)} style={{
                                display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: textMuted,
                                background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s',
                            }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = textMain}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = textMuted}
                            >
                                <Icons.ArrowLeft className="w-4 h-4" /> All Courses
                            </button>
                        )}
                        <a href="/" style={{ fontSize: 13, fontWeight: 500, color: textMuted, textDecoration: 'none', transition: 'color 0.15s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = textMain}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = textMuted}
                        >
                            Portfolio
                        </a>
                        <ThemeSwitcher pageTheme={pageTheme} setPageTheme={setPageTheme} isDark={isDark} />
                    </div>
                </div>
            </header>

            {/* ── Course banner (when detail open) ── */}
            {selectedCourse && (
                <div style={{ background: isDark ? '#0d0d0d' : '#1a3a4a', color: '#fff', padding: '12px 24px 30px', borderBottom: `1px solid ${isDark ? '#222' : '#1a3a4a'}` }}>
                    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                            {[selectedCourse.level, selectedCourse.category].filter(Boolean).join(' · ')}
                        </p>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25, maxWidth: 700 }}>
                            {selectedCourse.title}
                        </h1>
                    </div>
                </div>
            )}

            {/* ── Main ── */}
            <div style={{ flex: 1, maxWidth: 1400, margin: '0 auto', width: '100%', padding: selectedCourse ? '0' : '32px 24px', boxSizing: 'border-box' }}>
                {selectedCourse ? (
                    <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} isDark={isDark} />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        {/* Heading */}
                        <div>
                            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', color: textMain, marginBottom: 8 }}>Courses</h1>
                            <p style={{ fontSize: 15, color: textMuted, lineHeight: 1.6 }}>
                                Learning resources, research notes, and course materials by Gnanesh Balusa.
                            </p>
                        </div>

                        {/* Filters */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                            {/* Search */}
                            <div style={{ position: 'relative', minWidth: 200, maxWidth: 300, flex: '1 1 200px' }}>
                                <Icons.Eye className="w-4 h-4" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }} />
                                <input type="text" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)}
                                    style={{
                                        width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                                        fontSize: 13, background: bgCard, border: `1px solid ${border}`, borderRadius: 10, color: textMain,
                                        outline: 'none', boxSizing: 'border-box', fontFamily: 'Manrope, sans-serif',
                                    }}
                                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = ACCENT}
                                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = border}
                                />
                            </div>

                            {/* Category chips */}
                            {categories.length > 1 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {categories.map(cat => {
                                        const active = filterCategory === cat;
                                        return (
                                            <button key={cat} onClick={() => setFilterCategory(cat)} style={{
                                                padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                                                border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Manrope, sans-serif',
                                                background: active ? (isDark ? '#f0f0f0' : '#1a1a1a') : (isDark ? '#2a2a2a' : '#f0f0f0'),
                                                color: active ? (isDark ? '#1a1a1a' : '#fff') : textMuted,
                                            }}>
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Level select */}
                            {levels.length > 1 && (
                                <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{
                                    padding: '8px 12px', fontSize: 13, fontFamily: 'Manrope, sans-serif',
                                    background: bgCard, border: `1px solid ${border}`, borderRadius: 10, color: textMuted, outline: 'none', cursor: 'pointer',
                                }}>
                                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            )}
                        </div>

                        {/* Grid */}
                        {isLoading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                                {Array.from({ length: 8 }).map((_, i) => <CourseSkeleton key={i} isDark={isDark} />)}
                            </div>
                        ) : courses.length === 0 ? (
                            <div style={{ textAlign: 'center', paddingTop: 100, paddingBottom: 100 }}>
                                <Icons.BookOpen className="w-14 h-14 mx-auto" style={{ color: isDark ? '#333' : '#ccc', marginBottom: 20 }} />
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: textMain, marginBottom: 8 }}>No courses yet</h2>
                                <p style={{ fontSize: 14, color: textMuted }}>Check back soon — courses are being added!</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 0', color: textMuted, fontSize: 14 }}>
                                No courses match your filters.{' '}
                                <button onClick={() => { setFilterCategory('All'); setFilterLevel('All'); setSearch(''); }}
                                    style={{ color: ACCENT, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'Manrope, sans-serif' }}>
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: 13, color: textMuted, marginBottom: 14 }}>
                                    Showing {filtered.length} of {courses.length} course{courses.length !== 1 ? 's' : ''}
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                                    {filtered.map(course => (
                                        <CourseCard key={course._id} course={course} isDark={isDark} onClick={() => setSelectedCourse(course)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <Footer />
        </div>
    );
};
