import React, { useState } from 'react';
import { useLenis } from 'lenis/react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Icons } from './Icons';
interface HeaderProps {
    onAboutClick?: () => void;
    onNavClick?: () => void;
    isContactOpen?: boolean;
    onContactClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onNavClick, isContactOpen, onContactClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
                <div className="flex-1 flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('hero')}>
                    <div className="flex items-center gap-1">
                        <span className="text-[16px] font-bold tracking-tight text-[#1a1a1a] dark:text-[#f0f0f0]">Gnanesh</span>
                        <span className="text-[16px] font-bold tracking-tight text-[#1a1a1a] dark:text-[#f0f0f0]">Balusa</span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="flex items-center gap-6 justify-center">
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
                                className="hover:text-[#1a1a1a] dark:hover:text-white transition-colors whitespace-nowrap"
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Desktop "Contact Me" - Perfectly aligned with right-side portrait image in Hero section */}
                <div className="flex-1 hidden md:flex justify-end relative">
                    <button
                        onClick={onContactClick}
                        className={`font-medium text-[15px] hover:text-[#1a1a1a] dark:hover:text-white transition-all cursor-pointer whitespace-nowrap lg:mr-4 xl:mr-8 pb-1 ${isContactOpen
                            ? 'text-[#1a1a1a] dark:text-white border-b-2 border-[#1a1a1a] dark:border-white'
                            : 'text-[#5f5f5f] dark:text-[#a0a0a0] border-b-2 border-transparent'
                            }`}
                    >
                        Contact Me
                    </button>
                </div>

                {/* Hamburger for Mobile */}
                <div className="md:hidden ml-auto flex items-center gap-4" style={{ position: 'absolute', right: 24 }}>
                    <div className="relative">
                        <button
                            onClick={onContactClick}
                            aria-label="Contact Me"
                            className="flex items-center justify-center p-2 rounded focus:outline-none text-[15px] font-bold text-[#1a1a1a] dark:text-[#f0f0f0] bg-transparent"
                        >
                            Contact Me
                        </button>
                    </div>
                </div>
            </header>
            {/* Mobile Menu */}
            {/* Mobile menu navigation removed as requested */}
            {/* Modal for blurred background and link preview */}

        </div>
    );
};