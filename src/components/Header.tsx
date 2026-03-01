import React, { useState } from 'react';
import { useLenis } from 'lenis/react';
import { Icons } from './Icons';

interface HeaderProps {
    onAboutClick?: () => void;
    onNavClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onNavClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeProfile, setActiveProfile] = useState('');
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);

    const lenis = useLenis();

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        onNavClick?.(); // Close resume if open
        if (id === 'about') {
            onAboutClick?.();
            lenis?.scrollTo('#about', { offset: -50 });
            return;
        }

        if (id === 'hero') {
            lenis?.scrollTo(0);
        } else {
            lenis?.scrollTo(`#${id}`, { offset: -50 });
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#FBF9F6]/68 dark:bg-[#131313]/68 backdrop-blur-md transition-all duration-300 border-b border-transparent dark:border-zinc-800">
            <header className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo and Name */}
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('hero')}>
                    <div className="flex items-center gap-1">
                        <span className="text-[16px] font-bold tracking-tight text-[#1a1a1a] dark:text-[#f0f0f0]">Gnanesh</span>
                        <span className="text-[16px] font-bold tracking-tight text-[#1a1a1a] dark:text-[#f0f0f0]">Balusa</span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="flex items-center gap-8 justify-center w-full">
                    <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[#5f5f5f] dark:text-[#a0a0a0]">
                        {[
                            { label: 'About', id: 'about' },
                            { label: 'Experience', id: 'experience' },
                            { label: 'Projects', id: 'projects' },
                            { label: 'Publications', id: 'publications' },
                            { label: 'Talks', id: 'videos' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Social Icons - Desktop Only */}
                <div className="hidden md:flex items-center gap-4 ml-4">
                    <a href="https://github.com/gnanesh-16" target="_blank" rel="noopener noreferrer" title="GitHub">
                        <Icons.GitHub className="w-6 h-6 text-[#555] dark:text-[#b0b0b0] hover:text-[#1a1a1a] dark:hover:text-white cursor-pointer transition-colors" />
                    </a>
                    <a href="https://in.linkedin.com/in/gnaneshbalusa" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                        <Icons.LinkedIn className="w-6 h-6 text-[#555] dark:text-[#b0b0b0] hover:text-[#1a1a1a] dark:hover:text-white cursor-pointer transition-colors" />
                    </a>
                </div>

                {/* Hamburger for Mobile */}
                <div className="md:hidden ml-auto flex items-center gap-4" style={{ position: 'absolute', right: 24 }}>
                    <div className="relative">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Contact Me"
                            className="flex items-center justify-center p-2 rounded focus:outline-none text-[15px] font-bold text-[#1a1a1a] dark:text-[#f0f0f0] bg-transparent"
                        >
                            Contact Me
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {mobileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border border-[#e5e5e5] dark:border-zinc-800 p-4 z-50 bg-[#131313] animate-in fade-in zoom-in-95 duration-200">
                                {!activeProfile ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-4">
                                            <button
                                                className="flex items-center justify-between w-full p-2 hover:bg-white/5 rounded-lg transition-colors"
                                                onClick={() => setActiveProfile('github')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Icons.GitHub className="w-6 h-6 text-[#f0f0f0]" />
                                                    <span className="font-medium text-[#f0f0f0]">GitHub</span>
                                                </div>
                                                <Icons.ChevronDown className="w-4 h-4 text-zinc-500 -rotate-90" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="flex items-center justify-between w-full p-2 hover:bg-white/5 rounded-lg transition-colors"
                                                onClick={() => setActiveProfile('linkedin')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Icons.LinkedIn className="w-6 h-6 text-[#f0f0f0]" />
                                                    <span className="font-medium text-[#f0f0f0]">LinkedIn</span>
                                                </div>
                                                <Icons.ChevronDown className="w-4 h-4 text-zinc-500 -rotate-90" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {activeProfile === 'github' ? <Icons.GitHub className="w-4 h-4 text-zinc-400" /> : <Icons.LinkedIn className="w-4 h-4 text-zinc-400" />}
                                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{activeProfile}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <a
                                                    href={activeProfile === 'github' ? "https://github.com/gnanesh-16" : "https://in.linkedin.com/in/gnaneshbalusa"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] text-zinc-500 hover:text-white transition-colors underline underline-offset-2"
                                                >
                                                    Click here to redirect to {activeProfile === 'github' ? 'GitHub' : 'LinkedIn'}
                                                </a>
                                                <button onClick={() => setActiveProfile('')} className="text-zinc-500 hover:text-white transition-colors">
                                                    <Icons.X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {!isSent ? (
                                            <>
                                                <textarea
                                                    maxLength={200}
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    placeholder="Type your message..."
                                                    className="w-full h-24 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-[#f0f0f0] text-sm focus:outline-none focus:border-white/20 resize-none transition-colors"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">{message.length}/200</span>
                                                    <button
                                                        disabled={!message.trim()}
                                                        onClick={() => {
                                                            setIsSent(true);

                                                            setTimeout(() => {
                                                                setMobileMenuOpen(false);
                                                                setIsSent(false);
                                                                setActiveProfile('');
                                                                setMessage('');
                                                            }, 3000);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors disabled:opacity-50"
                                                    >
                                                        <Icons.Send className="w-3 h-3" />
                                                        Send
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-500">
                                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Icons.Sun className="w-6 h-6 text-green-500" />
                                                </div>
                                                <h3 className="text-white font-bold text-sm mb-1">Message Sent</h3>
                                                <p className="text-zinc-400 text-[11px] leading-relaxed">
                                                    I'll get back to you within <span className="text-white font-bold">27 minutes</span> exactly.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {/* Mobile Menu */}
            {/* Mobile menu navigation removed as requested */}
            {/* Modal for blurred background and link preview */}

        </div>
    );
};