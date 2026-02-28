import React, { useState } from 'react';
import { Icons } from './Icons';

interface HeaderProps {
    onAboutClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        if (id === 'about') {
            onAboutClick?.();
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
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
                <button
                    className="md:hidden ml-auto flex items-center justify-center p-2 rounded focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Open menu"
                    style={{ position: 'absolute', right: 24 }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a1a1a] dark:text-[#f0f0f0]">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </header>
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-16 left-0 right-0 bg-[#FBF9F6] dark:bg-[#131313] border-t border-[#e5e5e5] dark:border-zinc-800 px-6 py-4 z-50 shadow-lg">
                    <nav className="flex flex-col gap-4 text-[15px] font-medium text-[#5f5f5f] dark:text-[#a0a0a0]">
                        {[{ label: 'About', id: 'about' },{ label: 'Experience', id: 'experience' },{ label: 'Projects', id: 'projects' },{ label: 'Publications', id: 'publications' }].map(item => (
                            <button
                                key={item.id}
                                onClick={() => { scrollToSection(item.id); setMobileMenuOpen(false); }}
                                className="text-left hover:text-[#1a1a1a] dark:hover:text-white transition-colors py-2"
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
};