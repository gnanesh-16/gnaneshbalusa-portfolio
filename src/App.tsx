import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#131313] text-[#1a1a1a] dark:text-white font-[Manrope] transition-colors duration-300">
                <Header />

                <main className="flex-col w-full">
                    <HeroSection />
                    <AboutSection />
                    <Footer />
                </main>
            </div>
        </ThemeProvider>
    );
};

export default App;
