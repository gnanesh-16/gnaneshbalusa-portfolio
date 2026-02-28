import React from 'react';
import { Icons } from './Icons';

export const HeroSection: React.FC = () => {
    const scrollToAbout = () => {
        const element = document.getElementById('about');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="hero" className="px-6 pt-32 pb-32 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] dark:text-[#f0f0f0] leading-[1.05]">
                    Building AI<br />
                    systems that<br />
                    understand.
                </h1>
                <p className="text-base md:text-lg text-[#4a4a4a] dark:text-[#a0a0a0] max-w-md leading-relaxed font-medium">
                    Machine Learning Data Scientist at Amazon. I build AI systems that understand, adapt, and scale — from research to real-world deployment.
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

            {/* Hero Illustration - Fibonacci SVG */}
            <div className="relative h-[500px] w-full flex items-center justify-center animate-in fade-in duration-1000 delay-200">
                <style>
                    {`
                        @keyframes tentacle-float {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-30px); }
                        }
                        .animate-tentacle {
                            animation: tentacle-float 6s ease-in-out infinite;
                        }
                        @media (min-width: 768px) {
                            .animate-tentacle {
                                animation: none;
                            }
                        }
                    `}
                </style>

                <svg viewBox="0 0 500 500" className="w-full h-full max-w-[500px] drop-shadow-sm relative z-10">
                    {/* Main Body - Static */}
                    <path
                        d="M220 280 C 220 250, 240 230, 270 230 C 310 230, 310 290, 270 310 C 210 340, 160 250, 220 200 C 300 140, 380 250, 320 350"
                        className="stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[8px] fill-none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Staggered Floating Tentacles */}
                    <g className="animate-tentacle" style={{ animationDelay: '0s' }}>
                        <path d="M160 250 L 100 200" className="stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[8px] fill-none" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="100" cy="200" r="10" className="fill-[#FBF9F6] dark:fill-[#131313] stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[6px]" />
                    </g>

                    <g className="animate-tentacle" style={{ animationDelay: '1s' }}>
                        <path d="M220 200 L 180 120" className="stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[8px] fill-none" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="180" cy="120" r="10" className="fill-[#FBF9F6] dark:fill-[#131313] stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[6px]" />
                    </g>

                    <g className="animate-tentacle" style={{ animationDelay: '0.5s' }}>
                        <path d="M300 140 L 350 80" className="stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[8px] fill-none" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="350" cy="80" r="10" className="fill-[#FBF9F6] dark:fill-[#131313] stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[6px]" />
                    </g>

                    <g className="animate-tentacle" style={{ animationDelay: '1.5s' }}>
                        <path d="M380 250 L 440 220" className="stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[8px] fill-none" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="440" cy="220" r="10" className="fill-[#FBF9F6] dark:fill-[#131313] stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[6px]" />
                    </g>

                    {/* Spiral Terminals - Static center nodes */}
                    <circle cx="220" cy="280" r="8" className="fill-[#1a1a1a] dark:fill-[#f0f0f0]" />
                    <circle cx="320" cy="350" r="12" className="fill-[#FBF9F6] dark:fill-[#131313] stroke-[#1a1a1a] dark:stroke-[#f0f0f0] stroke-[6px]" />
                </svg>
            </div>
        </section>
    );
};
