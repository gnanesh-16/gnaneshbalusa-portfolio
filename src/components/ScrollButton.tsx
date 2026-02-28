import React, { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { Icons } from './Icons';

export const ScrollButton: React.FC = () => {
    const lenis = useLenis();
    const [isAtTop, setIsAtTop] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!lenis) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

            // Show the button after scrolling down a bit (e.g., 100px)
            setIsVisible(scrollY > 100);

            // If we are halfway down, pointing to top, else point to bottom
            setIsAtTop(scrollY < maxScroll / 2);
        };

        // Attach listener
        lenis.on('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => {
            lenis.off('scroll', handleScroll);
        };
    }, [lenis]);

    const handleClick = () => {
        if (isAtTop) {
            // Scroll to bottom
            lenis?.scrollTo('bottom');
        } else {
            // Scroll to top
            lenis?.scrollTo(0);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`fixed bottom-6 right-6 z-50 p-2 md:p-3 rounded-full 
                bg-[#B0B0B0]/20 dark:bg-[#B0B0B0]/10 
                backdrop-blur-xl 
                text-[#1a1a1a] dark:text-[#f0f0f0] 
                shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] 
                border border-white/40 dark:border-white/10 
                hover:bg-[#B0B0B0]/30 dark:hover:bg-[#B0B0B0]/20 
                transition-all duration-500 transform hover:scale-110 
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            aria-label={isAtTop ? "Scroll to bottom" : "Scroll to top"}
        >
            {isAtTop ? (
                <Icons.ArrowDown className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
                <Icons.ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
            )}
        </button>
    );
};
