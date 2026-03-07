import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface AboutSectionProps {
    showAboutHeroDesktop?: boolean;
    onResumeClick?: () => void;
}

// Custom SVG Icons for Projects
const ProjectIcons = {
    React: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="2.5" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
    ),
    Cursor: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 3l14 9-6 1-3 6-5-16z" />
            <path d="M14 14l5 5" strokeLinecap="round" />
        </svg>
    ),
    Voice: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M5 10v1a7 7 0 0014 0v-1" />
            <path d="M12 18v4M8 22h8" strokeLinecap="round" />
        </svg>
    ),
    Eye: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    Brain: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2a4 4 0 00-4 4v1a3 3 0 00-3 3v1a3 3 0 000 6v1a3 3 0 003 3h1a4 4 0 008 0h1a3 3 0 003-3v-1a3 3 0 000-6v-1a3 3 0 00-3-3V6a4 4 0 00-4-4z" />
            <path d="M12 2v20M8 8h8M8 12h8M8 16h8" strokeLinecap="round" />
        </svg>
    ),
    Pipeline: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="6" height="6" rx="1" />
            <rect x="16" y="3" width="6" height="6" rx="1" />
            <rect x="9" y="15" width="6" height="6" rx="1" />
            <path d="M5 9v3a3 3 0 003 3h1M19 9v3a3 3 0 01-3 3h-1" strokeLinecap="round" />
        </svg>
    ),
    Trophy: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 9H3a1 1 0 01-1-1V5a1 1 0 011-1h3M18 9h3a1 1 0 001-1V5a1 1 0 00-1-1h-3" />
            <path d="M6 4h12v6a6 6 0 11-12 0V4z" />
            <path d="M12 16v3M8 22h8M8 19h8" strokeLinecap="round" />
        </svg>
    )
};

export const AboutSection: React.FC<AboutSectionProps> = ({ showAboutHeroDesktop = true, onResumeClick }) => {
    const handleResumeClick = () => {
        // Direct download link from Google Drive
        const downloadUrl = "https://drive.google.com/uc?export=download&id=1djByBNoM1_vANUHEz8xMEzMWV1dbKuHs&confirm=t";

        // Trigger download in a new tab/hidden window to prevent redirection
        window.open(downloadUrl, '_blank');

        // Open the internal resume viewer
        onResumeClick?.();
    };

    // Live Data Queries
    const liveExperiences = useQuery(api.portfolio.getExperiences);
    const liveWritings = useQuery(api.portfolio.getWritings);
    const liveProjects = useQuery(api.portfolio.getProjects);
    const livePatents = useQuery(api.portfolio.getPatents);
    const livePublications = useQuery(api.portfolio.getPublications);

    // Fallbacks while loading or if empty
    const defaultExperiences = [
        {
            company: 'Amazon',
            logo: '/brand-assets/amazonlogo-.png',
            period: '2025 -',
            role: 'DS Machine Learning Associate 2',
            description: 'Building AI-powered solutions that translate complex data into measurable business outcomes. My work centers on developing systems that remain robust at scale while preserving the nuance required for real-world deployment.'
        },
        {
            company: 'McKinsey & Company',
            logo: '/brand-assets/mcksiney&coampnt-logo.png',
            period: '2024 - 2025',
            role: 'Business Analyst',
            description: 'Guided cross-functional teams through data analysis initiatives that reshaped how the organization captures and interprets information. Applied structured problem-solving frameworks to inform executive strategy.'
        },
        {
            company: 'TiHAN IIT Hyderabad',
            logo: '/brand-assets/iith-logo.png',
            period: '2024 - 2024',
            role: 'AI Research Software Engineer',
            description: 'Designed and implemented AI/ML systems with an emphasis on production readiness. Balanced research ambition with engineering pragmatism to deliver solutions that meet demanding performance requirements.'
        },
        {
            company: 'Microsoft',
            logo: '/brand-assets/microsoftlogo.png',
            period: '2024 - 2024',
            role: 'Microsoft Student Ambassador',
            description: 'Led community initiatives that brought emerging technologies to peers through hands-on workshops and collaborative projects. Fostered an environment where curiosity and technical rigor could coexist.'
        }
    ];

    const defaultFeaturedWriting = [
        { year: '2025', title: 'Your LLM Might Already Be Backdoored and You Dont Even Know It' },
        { year: '2025', title: 'The 15 Git Commands Every Developer Needs to Join $2B+ Companies' },
        { year: '2024', title: 'Cracking the Code: How I Mastered REST API Interviews at Amazon' },
        { year: '2024', title: 'My Journey Learning React, Electron, and Building MuteMemo' },
        { year: '2024', title: 'SOAP vs REST: Understanding the Differences' },
        { year: '2023', title: 'The Hidden Algorithm That 90% of Software Engineers Miss' },
        { year: '2023', title: 'Why 99% of AI Projects Fail And the AWS Blueprint to Save Yours' },
        { year: '2022', title: 'Dhvagna-NPI: Lightweight English Speech Transcription for Developers' }
    ];

    const defaultPreviousProjects = [
        {
            icon: ProjectIcons.Pipeline,
            name: 'ML Pipeline Development',
            year: '2026',
            description: 'Scalable machine learning systems built for production environments—encompassing data preprocessing, model training, and deployment strategies for enterprise-grade reliability.'
        },
        {
            icon: ProjectIcons.Cursor,
            name: 'BrogsCursor',
            year: '2025',
            description: 'An open-source Python package enabling precise recording and replay of mouse movements, clicks, and keyboard inputs with pixel-perfect accuracy. No paid browser APIs—just straightforward automation for everyone.'
        },
        {
            icon: ProjectIcons.React,
            name: 'MuteMemo',
            year: '2024',
            description: 'An invisible overlay application for online meetings built with React and Electron. Enables seamless note-taking, action item tracking, and image capture—entirely hidden from screen sharing.'
        },
        {
            icon: ProjectIcons.Eye,
            name: 'Computer Vision Applications',
            year: '2024',
            description: 'Production implementations including object detection, image classification, and real-time processing systems. Demonstrates practical applications of deep learning in visual recognition.'
        },
        {
            icon: ProjectIcons.Voice,
            name: 'Speech Emotion Recognition',
            year: '2023',
            description: 'A deep learning system for temporal sequence analysis in detecting human emotions from speech patterns. Applications span human-computer interaction and mental health monitoring.'
        },
        {
            icon: ProjectIcons.Brain,
            name: 'NLP Solutions',
            year: '2023',
            description: 'Natural language processing projects focusing on text analysis, sentiment detection, and language model applications. Showcases advanced techniques in processing and understanding human language.'
        },
        {
            icon: ProjectIcons.Trophy,
            name: 'Hackathon Winning Solutions',
            year: '2023',
            description: 'A collection of innovative projects that secured victories across multiple hackathons. Demonstrates rapid prototyping capabilities and creative problem-solving across AI, web, and mobile domains.'
        }
    ];

    const defaultPatents = [
        {
            year: '2024',
            title: 'MuteMemo: Invisible Overlay System for Real-Time Meeting Annotation',
            description: 'A novel system enabling real-time note-taking during video conferences with complete invisibility to screen sharing protocols.'
        }
    ];

    const defaultPublications = [
        {
            year: '2025',
            title: 'Comparative Analysis of Different Operational Logic Gates for Cutting-Edge Technology',
            description: 'Published in IEEE. Authored with Vijay Rao Kumbhare, Tallam Sai Nithin, M Sahil Krishna, Ashwini Kumar Varma, Bittu Kumar.'
        },
        {
            year: '2024',
            title: 'Evaluating Gesture Based Text Generator Gloves System on Arduino Platform',
            description: 'Published in IEEE Gujarat. Authored with Vijay Rao Kumbhare, Bittu Kumar, Amit Kumar Shrivastava, Ashwini Kumar Varma, Aditya Japa.'
        }
    ];

    // Use live data if available, else fallback
    const experiences = liveExperiences && liveExperiences.length > 0 ? liveExperiences : defaultExperiences;
    const featuredWriting = liveWritings && liveWritings.length > 0 ? liveWritings : defaultFeaturedWriting;
    const previousProjectsRaw = liveProjects && liveProjects.length > 0 ? liveProjects : defaultPreviousProjects;
    const patents = livePatents && livePatents.length > 0 ? livePatents : defaultPatents;
    const publications = livePublications && livePublications.length > 0 ? livePublications : defaultPublications;

    // Project icons mapping for live data
    const mappedProjects = previousProjectsRaw.map(p => ({
        ...p,
        icon: typeof p.icon === 'string' ? (ProjectIcons[p.icon as keyof typeof ProjectIcons] || ProjectIcons.Pipeline) : p.icon,
    }));

    return (
        <>
            {/* About Hero Section */}
            <section
                id="about"
                className={`${showAboutHeroDesktop ? 'block' : 'md:hidden'} pt-2 pb-32 md:py-32 border-t border-[#e5e5e5] dark:border-zinc-800`}
            >
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
                        {/* Profile Image - Left */}
                        <div className="md:w-[45%]">
                            <div className="relative group cursor-pointer">
                                <div className="relative w-full aspect-[4/5] md:aspect-square max-w-[380px] overflow-hidden rounded-lg">
                                    {/* Desktop image */}
                                    <div className="relative hidden md:block w-full h-[130%]">
                                        <img
                                            src="/brand-assets/gnaneshbalusaprofileamazon_webp.webp"
                                            alt="Gnanesh Balusa"
                                            className="w-full h-full object-cover object-[center_15%]"
                                            loading="eager"
                                            decoding="async"
                                            width="380"
                                            height="494"
                                        />
                                        {/* CSS Grain Overlay */}
                                        <div className="absolute inset-0 bg-grain opacity-[0.14] mix-blend-overlay pointer-events-none rounded-lg"></div>
                                        {/* Optional dark tint if requested for contrast */}
                                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none rounded-lg"></div>
                                    </div>
                                    {/* Mobile image - taller aspect ratio to show more of the photo (zoom out) */}
                                    <img
                                        src="/brand-assets/portfolio-gnaneshbalusa-amazon.jpg"
                                        alt="Gnanesh Balusa"
                                        className="md:hidden w-full h-full object-cover object-[center_5%]"
                                        loading="eager"
                                        decoding="async"
                                        width="380"
                                        height="475"
                                    />
                                </div>

                                {/* Mobile UI: Name + Resume Button (Side-by-side on mobile) */}
                                <div className="mt-5 flex items-center justify-between w-full max-w-[380px]">
                                    <div className="text-sm text-[#444] dark:text-[#a0a0a0] font-bold tracking-tight uppercase">
                                        Gnanesh Balusa
                                    </div>
                                    <div className="md:hidden">
                                        <button
                                            onClick={handleResumeClick}
                                            className="px-5 py-2.5 bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-black rounded-full font-bold hover:opacity-90 transition-all text-[11px] uppercase tracking-wider shadow-md inline-block"
                                        >
                                            Resume
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile At-a-Glance Impact Metrics */}
                                <div className="md:hidden mt-6 mb-2 flex justify-between items-center w-full max-w-[380px] px-2 py-4 bg-[#f8f8f8] dark:bg-[#1a1a1a] rounded-xl border border-[#e5e5e5] dark:border-zinc-800 shadow-sm">
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-lg font-black text-[#1a1a1a] dark:text-white tracking-tighter">3+</span>
                                        <span className="text-[9px] font-bold text-[#86868b] uppercase tracking-wider mt-0.5 text-center">Years Exp</span>
                                    </div>
                                    <div className="w-[1px] h-8 bg-[#e5e5e5] dark:bg-zinc-800"></div>
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-lg font-black text-[#1a1a1a] dark:text-white tracking-tighter">14.73k+</span>
                                        <span className="text-[9px] font-bold text-[#86868b] uppercase tracking-wider mt-0.5 text-center">Downloads</span>
                                    </div>
                                    <div className="w-[1px] h-8 bg-[#e5e5e5] dark:bg-zinc-800"></div>
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-lg font-black text-[#1a1a1a] dark:text-white tracking-tighter">1</span>
                                        <span className="text-[9px] font-bold text-[#86868b] uppercase tracking-wider mt-0.5 text-center">Patents</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Text - Right */}
                        <div className="md:w-1/2 space-y-6">
                            <h2 className="text-6xl md:text-7xl font-bold tracking-tight text-[#1a1a1a] dark:text-[#f0f0f0]">
                                About
                            </h2>
                            <p className="text-xl md:text-2xl font-medium leading-relaxed text-[#1a1a1a] dark:text-[#f0f0f0] opacity-90">
                                I build AI systems that understand, adapt, and scale. With over two years of experience spanning Amazon, McKinsey, and academic research at IIT Hyderabad, my work focuses on the intersection of machine learning infrastructure and real-world deployment.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm font-medium pt-2">
                                <span className="text-[#666] dark:text-[#999]">Focus Areas:</span>
                                {['Machine Learning', 'Full Stack Development', 'AI Research', 'System Reliability'].map((area) => (
                                    <span key={area} className="text-[#1a1a1a] dark:text-[#a0a0a0]">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-6">
                <div className="border-t border-[#e5e5e5] dark:border-zinc-800"></div>
            </div>

            {/* Experience Section */}
            <section id="experience" className="py-24">
                <div className="max-w-[1200px] mx-auto px-6">
                    <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0] mb-12">Experience</h2>
                    {/* Mobile: previous layout */}
                    <div className="grid grid-cols-1 gap-y-12 md:hidden">
                        {experiences.map((exp, index) => (
                            <div key={index} className="space-y-4">
                                <div className="text-xs font-medium text-[#666] dark:text-[#999] tracking-wide uppercase">
                                    {exp.period}
                                </div>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={exp.logo}
                                        alt={`${exp.company} logo`}
                                        className={`${exp.company === 'Microsoft' ? 'w-8 h-8' : 'w-12 h-12'} rounded-md object-contain`}
                                    />
                                    <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0]">{exp.company}</h3>
                                </div>
                                <div className="text-sm font-medium text-[#444] dark:text-[#b0b0b0]">{exp.role}</div>
                                <p className="text-sm leading-relaxed text-[#555] dark:text-[#a0a0a0]">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: new card design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {experiences.map((exp, index) => (
                            <div key={index} className="space-y-4">
                                <div className="text-xs font-medium text-[#666] dark:text-[#999] tracking-wide uppercase">
                                    {exp.period}
                                </div>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={exp.logo}
                                        alt={`${exp.company} logo`}
                                        className={`${exp.company === 'Microsoft' ? 'w-8 h-8' : 'w-12 h-12'} rounded-md object-contain`}
                                    />
                                    <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0]">{exp.company}</h3>
                                </div>
                                <div className="text-sm font-medium text-[#444] dark:text-[#b0b0b0]">{exp.role}</div>
                                <p className="text-sm leading-relaxed text-[#555] dark:text-[#a0a0a0]">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-6">
                <div className="border-t border-[#e5e5e5] dark:border-zinc-800"></div>
            </div>

            {/* Featured Writing */}
            <section id="writing" className="py-24">
                <div className="max-w-[1200px] mx-auto px-6">
                    <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0] mb-12">Featured Writing</h2>
                    <div className="space-y-4">
                        {featuredWriting.map((article, index) => (
                            <div key={index} className="flex items-baseline gap-4 group cursor-pointer">
                                <span className="text-sm font-medium text-[#666] dark:text-[#999] min-w-[50px]">
                                    {article.year}
                                </span>
                                <span className="text-[#1a1a1a] dark:text-[#f0f0f0] group-hover:underline decoration-1 underline-offset-4 transition-all">
                                    {article.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-6">
                <div className="border-t border-[#e5e5e5] dark:border-zinc-800"></div>
            </div>

            {/* Previous Projects */}
            <section id="projects" className="py-24">
                <div className="max-w-[1200px] mx-auto px-6">
                    <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0] mb-12">Previous Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {mappedProjects.map((project: any, index: number) => {
                            const IconComponent = project.icon;
                            return (
                                <div key={index} className="space-y-4 group cursor-pointer">
                                    <div className="text-[#555] dark:text-[#a0a0a0] group-hover:text-[#1a1a1a] dark:group-hover:text-[#f0f0f0] transition-colors">
                                        <IconComponent />
                                    </div>
                                    <div className="flex items-baseline gap-3">
                                        <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0] group-hover:underline decoration-1 underline-offset-4">
                                            {project.name}
                                        </h3>
                                        <span className="text-xs font-medium text-[#666] dark:text-[#999]">
                                            {project.year}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-[#555] dark:text-[#a0a0a0]">
                                        {project.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-6">
                <div className="border-t border-[#e5e5e5] dark:border-zinc-800"></div>
            </div>

            {/* Patents and Publications */}
            <section id="publications" className="py-24">
                <div className="max-w-[1200px] mx-auto px-6">
                    <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0] mb-12">Patents and Publications</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Patents Column */}
                        <div>
                            <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0] mb-6 pb-3 border-b border-[#e5e5e5] dark:border-zinc-800">
                                Patents
                            </h3>
                            <div className="space-y-6">
                                {patents.map((patent, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="text-xs font-medium text-[#666] dark:text-[#999] tracking-wide uppercase">
                                            {patent.year}
                                        </div>
                                        <h4 className="text-base font-bold text-[#1a1a1a] dark:text-[#f0f0f0]">
                                            {patent.title}
                                        </h4>
                                        <p className="text-sm leading-relaxed text-[#555] dark:text-[#a0a0a0]">
                                            {patent.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Publications Column */}
                        <div>
                            <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0] mb-6 pb-3 border-b border-[#e5e5e5] dark:border-zinc-800">
                                Publications
                            </h3>
                            <div className="space-y-6">
                                {publications.map((pub, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="text-xs font-medium text-[#666] dark:text-[#999] tracking-wide uppercase">
                                            {pub.year}
                                        </div>
                                        <h4 className="text-base font-bold text-[#1a1a1a] dark:text-[#f0f0f0]">
                                            {pub.title}
                                        </h4>
                                        <p className="text-sm leading-relaxed text-[#555] dark:text-[#a0a0a0]">
                                            {pub.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
