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
                            <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border border-[#e5e5e5] dark:border-zinc-800 p-4 z-50 bg-[#131313]">
                                <div className="flex items-center gap-2 mb-4">
                                    <button className="flex items-center gap-2" onClick={() => setActiveProfile('github')}>
                                        <Icons.GitHub className="w-6 h-6 text-[#f0f0f0]" />
                                        <span className="font-medium text-[#f0f0f0]">gnanesh-16</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <button className="flex items-center gap-2" onClick={() => setActiveProfile('linkedin')}>
                                        <Icons.LinkedIn className="w-6 h-6 text-[#f0f0f0]" />
                                        <span className="font-medium text-[#f0f0f0]">gnaneshbalusa</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type here..."
                                        className="flex-1 px-2 py-1 rounded border border-[#e5e5e5] dark:border-zinc-800 bg-[#191919] text-[#f0f0f0]"
                                    />
                                    <button className="p-2 rounded bg-[#191919] hover:bg-[#111] transition-colors">
                                        <svg width="12" height="12" fill="none" stroke="#f0f0f0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M22 2L11 13" />
                                            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                                            <circle cx="19" cy="5" r="1" fill="#f0f0f0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {/* Mobile Menu */}
            {/* Mobile menu navigation removed as requested */}
            {/* Modal for blurred background and link preview */}
            {/* Show profile info directly in dropdown for mobile */}
            {activeProfile === 'github' && (
                <div className="w-full bg-[#131313] rounded-xl p-4 mt-4 flex flex-col items-center justify-center">
                    <Icons.GitHub className="w-10 h-10 text-[#f0f0f0] mb-2" />
                    <span className="font-medium text-[#f0f0f0] text-base mb-2">gnanesh-16</span>
                    <p className="text-[#f0f0f0] text-sm mb-2">GitHub profile shown here.</p>
                    <button className="mt-2 text-[#f0f0f0] underline text-sm w-full text-center" onClick={() => setActiveProfile('')}>Close</button>
                </div>
            )}
            {activeProfile === 'linkedin' && (
                <div className="w-full bg-[#131313] rounded-xl p-4 mt-4 flex flex-col items-center justify-center">
                    <Icons.LinkedIn className="w-10 h-10 text-[#f0f0f0] mb-2" />
                    <span className="font-medium text-[#f0f0f0] text-base mb-2">gnaneshbalusa</span>
                    <p className="text-[#f0f0f0] text-sm mb-2">LinkedIn profile shown here.</p>
                    <button className="mt-2 text-[#f0f0f0] underline text-sm w-full text-center" onClick={() => setActiveProfile('')}>Close</button>
                </div>
            )}
        </div>
    );
};