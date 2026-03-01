import React from 'react';
import { useLenis } from 'lenis/react';

interface HeroSectionProps {
    onAboutClick?: () => void;
    onResumeClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onAboutClick, onResumeClick }) => {
    const lenis = useLenis();
    const handleResumeClick = () => {
        // Direct download link from Google Drive
        const downloadUrl = "https://drive.google.com/uc?export=download&id=16AKWcSpsPhDa2G9kIBxZ-Wb_2E7eYnB8";

        // Trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'Gnanesh_Balusa_Resume.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Open modal
        onResumeClick?.();
    };

    return (
        <section id="hero" className="hidden md:grid px-6 pt-32 pb-32 max-w-[1200px] mx-auto grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] dark:text-[#f0f0f0] leading-[1.05]">
                    Building AI<br />
                    systems that<br />
                    understand.
                </h1>
                <p className="text-base md:text-lg text-[#4a4a4a] dark:text-[#a0a0a0] max-w-md leading-relaxed font-medium">
                    Machine Learning Engineer 2 at Amazon. I build AI systems that understand, adapt, and scale from research to real world production deployment.
                </p>

                {/* At-a-Glance Impact Metrics */}
                <div className="flex flex-wrap gap-4 md:gap-8 pt-2 animate-in slide-in-from-left-4 fade-in duration-700 delay-300">
                    <div className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-black text-[#1a1a1a] dark:text-white tracking-tighter">3+</span>
                        <span className="text-xs md:text-sm font-semibold text-[#86868b] uppercase tracking-wider">Years Exp</span>
                    </div>
                    <div className="w-[1px] h-12 bg-[#e5e5e5] dark:bg-zinc-800"></div>
                    <div className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-black text-[#1a1a1a] dark:text-white tracking-tighter">14.73k+</span>
                        <span className="text-xs md:text-sm font-semibold text-[#86868b] uppercase tracking-wider">Downloads</span>
                    </div>
                    <div className="w-[1px] h-12 bg-[#e5e5e5] dark:bg-zinc-800"></div>
                    <div className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-black text-[#1a1a1a] dark:text-white tracking-tighter">1</span>
                        <span className="text-xs md:text-sm font-semibold text-[#86868b] uppercase tracking-wider">Patents</span>
                    </div>
                </div>

                <div className="pt-4 flex gap-4 animate-in slide-in-from-left-4 fade-in duration-700 delay-500">
                    <button
                        onClick={handleResumeClick}
                        className="px-8 py-4 bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-black rounded-[4px] font-bold hover:opacity-90 transition-all text-sm shadow-sm flex items-center gap-2"
                    >
                        View Resume

                    </button>
                    <button
                        onClick={() => {
                            // Tell App.tsx to unhide the About section on desktop
                            onAboutClick?.();

                            // Wait a short moment for React to actually render the section 
                            // before telling Lenis to calculate its offset position
                            setTimeout(() => {
                                if (lenis) {
                                    lenis.scrollTo('#about', { offset: -50, duration: 1.2 });
                                } else {
                                    const element = document.getElementById('about');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }
                            }, 100);
                        }}
                        className="px-8 py-4 border border-[#1a1a1a] dark:border-[#f0f0f0] text-[#1a1a1a] dark:text-[#f0f0f0] rounded-[4px] font-bold hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-[#f0f0f0] dark:hover:text-black transition-all text-sm"
                    >
                        Learn More
                    </button>
                </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[500px] w-full flex items-center justify-center animate-in fade-in duration-1000 delay-200">
                <div className="relative group cursor-pointer w-full max-w-[500px]">
                    <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                        <img
                            src="/brand-assets/portfolio-gnaneshbalusa-amazon.jpg"
                            alt="Gnanesh Balusa"
                            className="w-full h-full object-cover object-top"
                            loading="eager"
                            decoding="async"
                            width="500"
                            height="650"
                        />
                    </div>
                </div>
            </div>

            {/* Tech Stack Marquee */}
            <div className="md:col-span-2 w-full mt-12 mb-4 overflow-hidden relative animate-in fade-in duration-1000 delay-500">
                <div className="absolute inset-x-0 w-full h-full pointer-events-none z-10 
                              bg-gradient-to-r from-[#FDFBF7] via-transparent to-[#FDFBF7] 
                              dark:from-[#131313] dark:via-transparent dark:to-[#131313]"></div>
                <div className="flex w-[200%] animate-marquee whitespace-nowrap gap-4 items-center opacity-80 hover:opacity-100 transition-opacity duration-300">
                    {/* Double the array for seamless infinite scroll */}
                    {[...['React', 'Next.js', 'PyTorch', 'AWS', 'System Design', 'MLOps', 'Node.js', 'Python', 'LLMs', 'SQL'],
                    ...['React', 'Next.js', 'PyTorch', 'AWS', 'System Design', 'MLOps', 'Node.js', 'Python', 'LLMs', 'SQL']].map((tech, i) => (
                        <div key={i} className="px-6 py-3 bg-[#e5e5e5]/50 dark:bg-zinc-800/50 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-sm text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-300">
                            {tech}
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
};
