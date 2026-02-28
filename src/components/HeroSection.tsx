import React from 'react';

interface HeroSectionProps {
    onAboutClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onAboutClick }) => {
    const scrollToAbout = () => {
        onAboutClick?.();
        const element = document.getElementById('about');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
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
                <div className="pt-4 flex gap-4">
                    <button
                        onClick={scrollToAbout}
                        className="px-8 py-4 bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-black rounded-[4px] font-bold hover:opacity-90 transition-all text-sm shadow-sm"
                    >
                        Learn More
                    </button>
                    <a
                        href="https://github.com/gnanesh-16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 border border-[#1a1a1a] dark:border-[#f0f0f0] text-[#1a1a1a] dark:text-[#f0f0f0] rounded-[4px] font-bold hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-[#f0f0f0] dark:hover:text-black transition-all text-sm"
                    >
                        GitHub
                    </a>
                </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[500px] w-full flex items-center justify-center animate-in fade-in duration-1000 delay-200">
                <div className="relative group cursor-pointer w-full max-w-[500px]">
                    <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                        <img
                            src="/brand-assets/portfolio-gnaneshbalusa-amazon.jpg"
                            alt="Gnanesh Balusa"
                            className="w-full h-[130%] object-cover object-[center_15%] grayscale group-hover:grayscale-0 transition-all duration-500"
                            loading="eager"
                            decoding="async"
                            width="500"
                            height="650"
                        />
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-0 hidden dark:block"
                            style={{
                                backgroundImage: `radial-gradient(circle, rgba(19, 19, 19, 0.9) 0.8px, transparent 0.8px)`,
                                backgroundSize: '3px 3px',
                                backgroundColor: 'rgba(19, 19, 19, 0.2)'
                            }}
                        />
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-0 dark:hidden"
                            style={{
                                backgroundImage: `radial-gradient(circle, rgba(253, 251, 247, 0.9) 0.8px, transparent 0.8px)`,
                                backgroundSize: '3px 3px',
                                backgroundColor: 'rgba(253, 251, 247, 0.2)'
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
