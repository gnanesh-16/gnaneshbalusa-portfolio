import React from 'react';

interface HeroSectionProps {
    onAboutClick?: () => void;
    onResumeClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onAboutClick, onResumeClick }) => {
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
                <div className="pt-4 flex gap-4">
                    <button
                        onClick={handleResumeClick}
                        className="px-8 py-4 bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-black rounded-[4px] font-bold hover:opacity-90 transition-all text-sm shadow-sm"
                    >
                        Resume
                    </button>
                    <button
                        onClick={() => {
                            onAboutClick?.();
                            const element = document.getElementById('about');
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
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
        </section>
    );
};
