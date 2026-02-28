import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ResumeViewer } from './components/ResumeViewer';
import { ScrollButton } from './components/ScrollButton';
import { ReactLenis } from 'lenis/react';

const App: React.FC = () => {
    const [showAboutDesktop, setShowAboutDesktop] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    const handleAboutClick = () => {
        // Native scroll removed, handled via Lenis in Header.tsx
        setShowAboutDesktop(true);
    };

    return (
        <ThemeProvider>
            <ReactLenis root>
                <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#131313] text-[#1a1a1a] dark:text-white font-[Manrope] transition-colors duration-300">
                    <Header onAboutClick={handleAboutClick} onNavClick={() => setIsResumeOpen(false)} />

                    <main className="flex-col w-full pt-16">
                        {isResumeOpen ? (
                            <ResumeViewer onClose={() => setIsResumeOpen(false)} />
                        ) : (
                            <>
                                <HeroSection onAboutClick={handleAboutClick} onResumeClick={() => setIsResumeOpen(true)} />
                                <AboutSection showAboutHeroDesktop={showAboutDesktop} onResumeClick={() => setIsResumeOpen(true)} />
                            </>
                        )}
                        <Footer onNavClick={() => setIsResumeOpen(false)} />
                    </main>
                    <ScrollButton />
                </div>
            </ReactLenis>
        </ThemeProvider>
    );
};

export default App;
