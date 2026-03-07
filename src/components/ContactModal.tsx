import React, { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Icons } from './Icons';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PROFILES = [
    {
        id: 'linkedin',
        label: 'LinkedIn',
        description: 'Connect professionally',
        href: 'https://in.linkedin.com/in/gnaneshbalusa',
        icon: Icons.LinkedIn,
        bg: 'bg-[#0A66C2]',
    },
    {
        id: 'github',
        label: 'GitHub',
        description: 'Check out my code',
        href: 'https://github.com/gnanesh-16',
        icon: Icons.GitHub,
        bg: 'bg-[#24292F] dark:bg-[#e6edf3]',
    },
];

const MAX_CHARS = 280;

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [activeProfile, setActiveProfile] = useState('');
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);

    const sendConvexMessage = useMutation(api.portfolio.sendMessage);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
        } else {
            setAnimating(false);
            const t = setTimeout(() => {
                setVisible(false);
                setActiveProfile('');
                setMessage('');
                setIsSent(false);
            }, 350);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    if (!visible) return null;

    const activeProfileData = PROFILES.find(p => p.id === activeProfile);

    const handleSend = async () => {
        if (!message.trim() || isSending) return;
        setIsSending(true);
        let locationData = '';
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            locationData = JSON.stringify({ city: data.city, region: data.region, country: data.country_name, ip: data.ip });
        } catch { }
        try {
            await sendConvexMessage({ platform: activeProfile || 'general', message: message.trim(), locationData, userAgent: navigator.userAgent });
        } catch { }
        setIsSending(false);
        setIsSent(true);
        setTimeout(() => onClose(), 3000);
    };

    // ── Shared desktop right-panel content (kept minimal for desktop) ──
    const desktopRightContent = isSent ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Icons.Award className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">Message sent! 🎉</h3>
            <p className="text-[#86868B] text-sm text-center">Thanks for reaching out. I'll get back to you soon.</p>
        </div>
    ) : activeProfile ? (
        <div className="flex flex-col gap-5 flex-1">
            <button onClick={() => setActiveProfile('')} className="flex items-center gap-2 text-[#0066CC] dark:text-[#3B9EFF] text-sm font-medium w-fit">
                <Icons.ChevronDown className="w-4 h-4 rotate-90" />
                Back
            </button>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${activeProfileData?.bg}`}>
                    {activeProfileData && <activeProfileData.icon className="w-5 h-5" />}
                </div>
                <div>
                    <p className="font-semibold">{activeProfileData?.label}</p>
                    <p className="text-[#86868B] text-xs">{activeProfileData?.description}</p>
                </div>
            </div>
            <div className="relative flex-1">
                <textarea
                    autoFocus
                    value={message}
                    onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
                    placeholder={`Write a message for ${activeProfileData?.label}...`}
                    className="w-full h-full min-h-[120px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl px-4 py-3 pb-8 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0066CC] dark:focus:ring-[#3B9EFF] placeholder-[#C7C7CC]"
                />
                <span className={`absolute bottom-3 right-4 text-[11px] tabular-nums select-none ${message.length >= MAX_CHARS - 20 ? 'text-red-400' : 'text-[#C7C7CC]'}`}>
                    {message.length}/{MAX_CHARS}
                </span>
            </div>
            <div className="flex gap-3 mt-auto">
                <a href={activeProfileData?.href} target="_blank" rel="noreferrer"
                    className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-white text-sm font-semibold ${activeProfileData?.bg} hover:opacity-90 transition-opacity`}>
                    <activeProfileData.icon className="w-4 h-4" />
                    Open {activeProfileData?.label}
                </a>
                <button onClick={handleSend} disabled={!message.trim() || isSending}
                    className="flex-1 h-11 rounded-xl bg-[#1a1a1a] dark:bg-white text-white dark:text-black text-sm font-semibold disabled:opacity-40 hover:opacity-80 transition-opacity">
                    {isSending ? 'Sending…' : 'Send Note'}
                </button>
            </div>
        </div>
    ) : (
        <div className="flex flex-col gap-6 flex-1">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Let's connect!</h3>
                <p className="text-[#86868B] text-sm mt-1">Choose how you'd like to reach out</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {PROFILES.map(profile => (
                    <button key={profile.id} onClick={() => setActiveProfile(profile.id)}
                        className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-[#EBEBED] dark:bg-[#2C2C2E] hover:bg-[#E0E0E2] dark:hover:bg-[#38383A] transition-all text-left active:scale-[0.98]">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${profile.bg}`}>
                            <profile.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{profile.label}</p>
                            <p className="text-[#86868B] text-xs mt-0.5 leading-tight">{profile.description}</p>
                        </div>
                    </button>
                ))}
            </div>
            <p className="text-center text-[#86868B] text-xs">
                View my{' '}
                <a href="/connects" className="text-[#0066CC] dark:text-[#3B9EFF] underline underline-offset-2">digital card wallet →</a>
            </p>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${animating ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* ── DESKTOP: full-screen split layout ── */}
            <div className={`hidden md:flex absolute inset-0 transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${animating ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`}>

                {/* LEFT — hero image + info */}
                <div className="w-[42%] xl:w-[40%] h-full bg-[#0a0a0a] flex flex-col relative overflow-hidden">

                    {/* Close button */}
                    <button onClick={onClose}
                        className="absolute top-6 left-6 z-20 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                        aria-label="Close"
                    >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Hero photo fills top portion */}
                    <div className="flex-1 relative">
                        <img
                            src="/brand-assets/portfolio-gnaneshbalusa-amazon.jpg"
                            alt="Gnanesh Balusa"
                            className="w-full h-full object-cover object-top"
                        />
                        {/* Gradient overlay fading to dark at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                    </div>

                    {/* Info + social icons pinned to bottom */}
                    <div className="px-10 pb-10 pt-0 flex flex-col gap-5 relative z-10 -mt-20">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Gnanesh Balusa</h2>
                            <p className="text-white/50 text-sm mt-0.5">Machine Learning Engineer · Amazon</p>
                        </div>

                        {/* Social icons — same as footer */}
                        <div className="flex items-center gap-5">
                            <a href="https://x.com/Gnaneshbalusa" target="_blank" rel="noopener noreferrer" title="X (Twitter)"
                                className="text-white/35 hover:text-white transition-colors">
                                <Icons.Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://github.com/gnanesh-16" target="_blank" rel="noopener noreferrer" title="GitHub"
                                className="text-white/35 hover:text-white transition-colors">
                                <Icons.GitHub className="w-5 h-5" />
                            </a>
                            <a href="https://in.linkedin.com/in/gnaneshbalusa" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                                className="text-white/35 hover:text-white transition-colors">
                                <Icons.LinkedIn className="w-5 h-5" />
                            </a>
                            <a href="https://scholar.google.com/citations?user=3NC81YIAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" title="Google Scholar"
                                className="text-white/35 hover:text-white transition-colors">
                                <Icons.GoogleScholar className="w-5 h-5" />
                            </a>
                            <a href="https://youtube.com/@gnaneshbalusa?si=QKaiNh319Mjh66KG" target="_blank" rel="noopener noreferrer" title="YouTube"
                                className="text-white/35 hover:text-white transition-colors">
                                <Icons.YouTube className="w-5 h-5" />
                            </a>
                            <a href="https://medium.com/@GnaneshBalusa" target="_blank" rel="noopener noreferrer" title="Medium"
                                className="text-white/35 hover:text-white transition-colors">
                                <Icons.Medium className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* RIGHT — contact form */}
                <div className="flex-1 h-full bg-[#111111] flex flex-col items-center justify-center p-12 xl:p-16 overflow-y-auto">
                    {isSent ? (
                        <div className="flex flex-col items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Icons.Award className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Message sent! 🎉</h3>
                            <p className="text-white/40 text-sm text-center">Thanks for reaching out. I'll get back to you soon.</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-md flex flex-col gap-4">
                            <div className="mb-2">
                                <h3 className="text-3xl font-bold text-white tracking-tight">Let's connect</h3>
                                <p className="text-white/35 text-sm mt-1.5">Drop a message — I read every one.</p>
                            </div>

                            {/* 4 input fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.05)' }}
                                    id="contact-name"
                                />
                                <input
                                    type="text"
                                    placeholder="Company"
                                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.05)' }}
                                    id="contact-company"
                                />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.05)' }}
                                    id="contact-email"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone number"
                                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.05)' }}
                                    id="contact-phone"
                                />
                            </div>

                            {/* Message textarea */}
                            <div className="relative">
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
                                    placeholder="Write a message..."
                                    rows={5}
                                    className="w-full border border-white/10 rounded-2xl px-5 py-4 pb-10 text-sm text-white resize-none focus:outline-none focus:border-white/25 placeholder-white/20 transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.05)' }}
                                />
                                <span className={`absolute bottom-4 right-5 text-[11px] tabular-nums select-none transition-colors ${message.length >= MAX_CHARS - 20 ? 'text-red-400' : 'text-white/20'}`}>
                                    {message.length}/{MAX_CHARS}
                                </span>
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || isSending}
                                className="w-full rounded-2xl bg-white text-black text-sm font-semibold disabled:opacity-30 hover:bg-white/90 transition-all active:scale-[0.99] py-3.5"
                            >
                                {isSending ? 'Sending…' : 'Send a note'}
                            </button>
                        </div>
                    )}
                </div>
            </div>


            {/* ── MOBILE: dark draggable bottom-sheet ── */}
            <div
                className={`md:hidden absolute inset-x-0 bottom-0 transition-transform duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${animating ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div
                    className="bg-[#111111] rounded-t-[28px] shadow-[0_-24px_60px_rgba(0,0,0,0.6)] pb-10 overflow-hidden"
                    style={{ minHeight: 460 }}
                >
                    {/* Handle + title row */}
                    <div className="flex items-center justify-between px-5 pt-3 pb-3">
                        {/* Centered handle via absolute so title row stays clean */}
                        <div className="flex-1" />
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-3 w-9 h-1 rounded-full bg-white/20 cursor-grab active:cursor-grabbing"
                            onTouchStart={e => {
                                const startY = e.touches[0].clientY;
                                const wrapper = e.currentTarget.parentElement?.parentElement?.parentElement as HTMLElement;
                                const onMove = (me: TouchEvent) => {
                                    const delta = startY - me.touches[0].clientY;
                                    const clamped = Math.max(-120, Math.min(0, -delta));
                                    wrapper.style.transform = `translateY(${clamped}px)`;
                                };
                                const onEnd = () => {
                                    wrapper.style.transform = '';
                                    document.removeEventListener('touchmove', onMove);
                                    document.removeEventListener('touchend', onEnd);
                                };
                                document.addEventListener('touchmove', onMove, { passive: true });
                                document.addEventListener('touchend', onEnd);
                            }}
                        />
                        {/* ✕ perfectly right-aligned in the same row */}
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors"
                            aria-label="Close"
                        >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {isSent ? (
                        <div className="flex flex-col items-center gap-3 py-10 px-6">
                            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Icons.Award className="w-7 h-7 text-green-400" />
                            </div>
                            <p className="font-semibold text-center text-white">Message sent!</p>
                            <p className="text-white/40 text-sm text-center">Thanks for reaching out. I'll get back to you soon.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 px-5 pb-2">
                            {/* Message textarea with char counter */}
                            <div className="relative">
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
                                    placeholder="Write a message..."
                                    rows={5}
                                    className="w-full border border-white/10 rounded-2xl px-4 py-3 pb-8 text-sm text-white resize-none focus:outline-none focus:border-white/30 placeholder-white/25 transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.06)' }}
                                />
                                <span className={`absolute bottom-3 right-4 text-[11px] tabular-nums select-none transition-colors ${message.length >= MAX_CHARS - 20 ? 'text-red-400' : 'text-white/25'}`}>
                                    {message.length}/{MAX_CHARS}
                                </span>
                            </div>

                            {/* Send button */}
                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || isSending}
                                className="w-full h-12 rounded-2xl bg-white text-black text-sm font-semibold disabled:opacity-30 transition-all active:scale-[0.98]"
                            >
                                {isSending ? 'Sending…' : 'Send a note'}
                            </button>

                            {/* Recruiter contact info */}
                            <div className="mt-1 border-t border-white/8 pt-4 flex flex-col gap-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>

                                <a href="mailto:contact@gnaneshbalusa.com" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                                    <Icons.Mail className="w-4 h-4 shrink-0 text-white/30" />
                                    contact@gnaneshbalusa.com
                                </a>
                                <a href="https://in.linkedin.com/in/gnaneshbalusa" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                                    <Icons.LinkedIn className="w-4 h-4 shrink-0 text-white/30" />
                                    linkedin.com/in/gnaneshbalusa
                                </a>
                                <a href="https://github.com/gnanesh-16" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                                    <Icons.GitHub className="w-4 h-4 shrink-0 text-white/30" />
                                    github.com/gnanesh-16
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

