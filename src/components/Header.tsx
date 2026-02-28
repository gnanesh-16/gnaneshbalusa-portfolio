import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icons } from './Icons';

export const Header: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#FBF9F6]/68 dark:bg-[#131313]/68 backdrop-blur-md transition-all duration-300 border-b border-transparent dark:border-zinc-800">
            <header className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('hero')}>
                        <img src="/brand-assets/favicon.png" alt="Logo" className="w-8 h-8 rounded-sm opacity-90 group-hover:opacity-100 transition-opacity mix-blend-multiply dark:mix-blend-normal" />
                        <div className="text-[16px] font-bold tracking-tight text-[#1a1a1a] dark:text-[#f0f0f0]">
                            Gnanesh Balusa
                        </div>
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="flex items-center gap-8">
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

                    {/* Theme Toggle */}
                    <button
                        onClick={cycleTheme}
                        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        title={`Theme: ${theme}`}
                    >
                        {theme === 'dark' ? <Icons.Moon className="w-4 h-4 text-[#a0a0a0]" /> : <Icons.Sun className="w-4 h-4 text-[#5f5f5f]" />}
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        {mobileMenuOpen ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#FBF9F6] dark:bg-[#131313] border-t border-[#e5e5e5] dark:border-zinc-800 px-6 py-4">
                    <nav className="flex flex-col gap-4 text-[15px] font-medium text-[#5f5f5f] dark:text-[#a0a0a0]">
                        {[
                            { label: 'About', id: 'about' },
                            { label: 'Experience', id: 'experience' },
                            { label: 'Projects', id: 'projects' },
                            { label: 'Publications', id: 'publications' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
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
