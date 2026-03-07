import React from 'react';
import { Icons } from './Icons';

export const SocialSidebar: React.FC = () => {
    return (
        <div className="hidden md:flex flex-row items-center gap-4 fixed right-0 top-[24%] z-50 pl-4 pr-3 py-3 bg-white/10 dark:bg-black/10 backdrop-blur-md border hover:pr-4 transition-all duration-300 border-white/20 dark:border-white/10 border-r-0 rounded-l-full shadow-lg">
            <a
                href="https://github.com/gnanesh-16"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="group"
            >
                <Icons.GitHub className="w-6 h-6 text-[#555] dark:text-[#b0b0b0] group-hover:text-[#1a1a1a] dark:group-hover:text-white transition-all hover:scale-110" />
            </a>
            <a
                href="https://in.linkedin.com/in/gnaneshbalusa"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="group"
            >
                <Icons.LinkedIn className="w-6 h-6 text-[#555] dark:text-[#b0b0b0] group-hover:text-[#1a1a1a] dark:group-hover:text-white transition-all hover:scale-110" />
            </a>
        </div>
    );
};
