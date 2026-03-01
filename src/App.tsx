/// <reference types="vite/client" />
import React, { useState } from 'react';
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
import { ReactLenis } from 'lenis/react';
import { Analytics } from '@vercel/analytics/react';

// Import newly created pages (we will build these next)
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const MainPortfolio: React.FC = () => {
    const [showAboutDesktop, setShowAboutDesktop] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    const handleAboutClick = () => {
        setShowAboutDesktop(true);
    };

    return (
        <ReactLenis root options={{
            lerp: 0.08,
            duration: 1.5,
            smoothWheel: true,
            syncTouch: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            infinite: false,
        }}>
            <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#131313] text-[#1a1a1a] dark:text-white font-[Manrope] transition-colors duration-300">
                <Header onAboutClick={handleAboutClick} onNavClick={() => setIsResumeOpen(false)} />

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
                <ScrollButton />
            </div>
        </ReactLenis>
    );
};

const App: React.FC = () => {
    return (
        <ConvexProvider client={convex}>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Main Portfolio Route */}
                        <Route path="/" element={<MainPortfolio />} />

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
