import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Force dark theme as the only option
    const theme: Theme = 'dark';

    useEffect(() => {
        const root = window.document.documentElement;
        // Always apply dark mode classes
        root.classList.add('dark');
        root.classList.remove('light');
        localStorage.setItem('theme', 'dark');
    }, []);

    // Empty functions to prevent errors if components try to switch themes
    const setTheme = (newTheme: Theme) => { };
    const toggleTheme = () => { };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
