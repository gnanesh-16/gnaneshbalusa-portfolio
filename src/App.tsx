/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { VideosSection } from './components/VideosSection';
import { ResumeViewer } from './components/ResumeViewer';
import { ScrollButton } from './components/ScrollButton';
import { SocialSidebar } from './components/SocialSidebar';
import { ContactModal } from './components/ContactModal';
import { ReactLenis } from 'lenis/react';
import { Analytics } from '@vercel/analytics/react';

// Import newly created pages (we will build these next)
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const SECTION_TITLES: Record<string, string> = {
    hero: 'Portfolio',
    about: 'About',
    experience: 'Experience',
    writing: 'Writing',
    projects: 'Projects',
    publications: 'Publications',
    videos: 'Talks & Tutorials'
};

const useActiveSectionTitle = (isResumeOpen: boolean) => {
    useEffect(() => {
        if (isResumeOpen) {
            document.title = 'Gnanesh Balusa / Resume';
            return;
        }

        const handleScroll = () => {
            const sections = Array.from(document.querySelectorAll('section[id]'));

            let maxVisibleArea = 0;
            let currentSection = '';

            if (window.scrollY < 100) {
                currentSection = 'hero';
            } else {
                sections.forEach((section) => {
                    const rect = section.getBoundingClientRect();
                    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

                    if (visibleHeight > maxVisibleArea && visibleHeight > 0) {
                        maxVisibleArea = visibleHeight;
                        currentSection = section.id;
                    }
                });
            }

            if (currentSection && SECTION_TITLES[currentSection]) {
                const newTitle = `Gnanesh Balusa / ${SECTION_TITLES[currentSection]}`;
                if (document.title !== newTitle) {
                    document.title = newTitle;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check and when the DOM changes length slightly (hacky but works for initial load)
        setTimeout(handleScroll, 100);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isResumeOpen]);
};

const MainPortfolio: React.FC = () => {
    const [showAboutDesktop, setShowAboutDesktop] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    useActiveSectionTitle(isResumeOpen);

    const handleAboutClick = () => {
        setShowAboutDesktop(true);
    };

    return (
        <ReactLenis root options={{
            lerp: 0.1,
            duration: 1.5,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        }}>
            <div className={`min-h-screen bg-[#FDFBF7] dark:bg-[#131313] text-[#1a1a1a] dark:text-white font-[Manrope] transition-colors duration-300 ${isContactOpen ? 'overflow-hidden' : ''}`}>
                <Header
                    onAboutClick={handleAboutClick}
                    onNavClick={() => setIsResumeOpen(false)}
                    isContactOpen={isContactOpen}
                    onContactClick={() => setIsContactOpen(true)}
                />

                <main className="flex-col w-full pt-16">
                    {isResumeOpen ? (
                        <ResumeViewer onClose={() => setIsResumeOpen(false)} />
                    ) : (
                        <>
                            <HeroSection onAboutClick={handleAboutClick} onResumeClick={() => setIsResumeOpen(true)} />
                            <AboutSection showAboutHeroDesktop={showAboutDesktop} onResumeClick={() => setIsResumeOpen(true)} />
                            <VideosSection />
                        </>
                    )}
                    <Footer onNavClick={() => setIsResumeOpen(false)} />
                </main>
                <SocialSidebar />
                <ScrollButton />
                <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            </div>
        </ReactLenis>
    );
};

import { Connects } from './pages/Connects';

const App: React.FC = () => {
    return (
        <ConvexProvider client={convex}>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Main Portfolio Route */}
                        <Route path="/" element={<MainPortfolio />} />

                        {/* Public Digital Wallet */}
                        <Route path="/connects" element={<Connects />} />

                        {/* Admin Routes */}
                        <Route path="/dashboard/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </BrowserRouter>
                <Analytics />
            </ThemeProvider>
        </ConvexProvider>
    );
};

export default App;
