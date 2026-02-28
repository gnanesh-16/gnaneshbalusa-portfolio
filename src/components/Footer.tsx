import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';

const PrivacyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-lg w-full mx-4 p-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-[#1a1a1a] dark:text-[#f0f0f0]">Privacy Policy</h2>
            <p className="text-sm text-[#555] dark:text-[#a0a0a0] leading-relaxed mb-4">
                This portfolio website does not collect, store, or process any personal data. No cookies are used for tracking purposes.
                Theme preferences are stored locally in your browser's localStorage and never transmitted to any server.
            </p>
            <p className="text-sm text-[#555] dark:text-[#a0a0a0] leading-relaxed mb-6">
                If you have any questions, feel free to reach out via the social links provided.
            </p>
            <button onClick={onClose} className="px-4 py-2 bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Close
            </button>
        </div>
    </div>
);

const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-lg w-full mx-4 p-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-[#1a1a1a] dark:text-[#f0f0f0]">Terms of Service</h2>
            <p className="text-sm text-[#555] dark:text-[#a0a0a0] leading-relaxed mb-4">
                This is a personal portfolio website. All content, including text, images, and project descriptions, is the intellectual property of Gnanesh Balusa unless otherwise stated.
            </p>
            <p className="text-sm text-[#555] dark:text-[#a0a0a0] leading-relaxed mb-6">
                You are welcome to view and reference the content for personal and professional purposes. Unauthorized reproduction or distribution of the content is prohibited.
            </p>
            <button onClick={onClose} className="px-4 py-2 bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Close
            </button>
        </div>
    </div>
);

interface FooterProps {
    onNavClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // Easter Egg State
    const [clickCount, setClickCount] = useState(0);
    const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const navigate = useNavigate();

    const handleCopyrightClick = () => {
        setClickCount((prev) => {
            const newCount = prev + 1;
            if (newCount >= 8) {
                navigate('/dashboard/login');
                return 0; // Reset after navigation
            }
            return newCount;
        });

        // Reset the counter if they stop clicking after a while
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = setTimeout(() => {
            setClickCount(0);
        }, 3000); // 3 seconds to complete the 8 clicks
    };

    const scrollToSection = (id: string) => {
        onNavClick?.(); // Close resume if open
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
            {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

            <footer className="bg-[#f5f5f5] dark:bg-[#131313] text-[#1a1a1a] dark:text-[#a0a0a0] pt-16 pb-10 px-6 border-t border-[#e5e5e5] dark:border-zinc-800">
                <div className="max-w-[1200px] mx-auto">
                    {/* Top Row - Logo & Links */}
                    <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8 mb-12">
                        <div className="text-2xl md:text-lg font-bold tracking-tight text-[#1a1a1a] dark:text-[#f0f0f0]">Gnanesh Balusa</div>

                        {/* Footer Links */}
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-8 text-sm md:text-sm font-medium text-[#555] dark:text-[#b0b0b0]">
                            <button onClick={() => scrollToSection('about')} className="hover:text-[#1a1a1a] dark:hover:text-white transition-colors">
                                About
                            </button>
                            <button onClick={() => scrollToSection('experience')} className="hover:text-[#1a1a1a] dark:hover:text-white transition-colors">
                                Experience
                            </button>
                            <button onClick={() => scrollToSection('projects')} className="hover:text-[#1a1a1a] dark:hover:text-white transition-colors">
                                Projects
                            </button>
                            <button onClick={() => scrollToSection('publications')} className="hover:text-[#1a1a1a] dark:hover:text-white transition-colors">
                                Publications
                            </button>
                        </div>

                        {/* Social Icons */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-4 mt-2 md:mt-0">
                            <a href="https://x.com/Gnaneshbalusa" target="_blank" rel="noopener noreferrer" title="X (Twitter)">
                                <Icons.Twitter className="w-5 h-5 text-[#555] dark:text-[#b0b0b0] hover:text-[#1a1a1a] dark:hover:text-white cursor-pointer transition-colors" />
                            </a>
                            <a href="https://github.com/gnanesh-16" target="_blank" rel="noopener noreferrer" title="GitHub">
                                <Icons.GitHub className="w-5 h-5 text-[#555] dark:text-[#b0b0b0] hover:text-[#1a1a1a] dark:hover:text-white cursor-pointer transition-colors" />
                            </a>
                            <a href="https://in.linkedin.com/in/gnaneshbalusa" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                <Icons.LinkedIn className="w-5 h-5 text-[#555] dark:text-[#b0b0b0] hover:text-[#1a1a1a] dark:hover:text-white cursor-pointer transition-colors" />
                            </a>
                            <a href="https://scholar.google.com/citations?user=3NC81YIAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" title="Google Scholar">
                                <Icons.GoogleScholar className="w-5 h-5 text-[#555] dark:text-[#b0b0b0] hover:text-[#1a1a1a] dark:hover:text-white cursor-pointer transition-colors" />
                            </a>
                            <a href="https://youtube.com/@gnaneshbalusa?si=QKaiNh319Mjh66KG" target="_blank" rel="noopener noreferrer" title="YouTube">
                                <Icons.YouTube className="w-5 h-5 text-[#555] dark:text-[#b0b0b0] hover:text-[#1a1a1a] dark:hover:text-white cursor-pointer transition-colors" />
                            </a>
                            <a href="https://medium.com/@GnaneshBalusa" target="_blank" rel="noopener noreferrer" title="Medium">
                                <Icons.Medium className="w-5 h-5 text-[#555] dark:text-[#b0b0b0] hover:text-[#1a1a1a] dark:hover:text-white cursor-pointer transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Bottom Row - Copyright & Legal */}
                    <div className="pt-8 border-t border-[#e5e5e5] dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 text-xs text-[#666] dark:text-[#999] font-medium text-center md:text-left">
                        <div>
                            <span
                                onClick={handleCopyrightClick}
                                className="cursor-pointer select-none"
                                title="Copyright"
                            >
                                &copy;
                            </span>
                            {' '}{new Date().getFullYear()} Gnanesh Balusa. All rights reserved.
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button onClick={() => setShowPrivacy(true)} className="hover:text-[#1a1a1a] dark:hover:text-[#a0a0a0] cursor-pointer transition-colors">
                                Privacy Policy
                            </button>
                            <button onClick={() => setShowTerms(true)} className="hover:text-[#1a1a1a] dark:hover:text-[#a0a0a0] cursor-pointer transition-colors">
                                Terms of Service
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};
