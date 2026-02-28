import React from 'react';
import { Icons } from './Icons';

interface ResumeViewerProps {
    onClose: () => void;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({ onClose }) => {
    // Google Drive preview link
    const previewUrl = "https://drive.google.com/file/d/16AKWcSpsPhDa2G9kIBxZ-Wb_2E7eYnB8/preview";

    return (
        <section className="w-full bg-[#f8f6f2] dark:bg-[#0f0f0f] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-[1200px] mx-auto px-6 py-4 md:py-6">
                {/* Header for the viewer */}
                <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 mb-4 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg md:text-xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0]">Curriculum Vitae</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-black rounded-full font-bold hover:opacity-90 transition-all text-xs shadow-sm"
                    >
                        <Icons.X className="w-4 h-4" />
                        Exit Preview
                    </button>
                </div>

                {/* PDF Viewer Container */}
                <div className="relative w-full aspect-[1/1.4] md:h-[1000px] bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden">

                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-none"
                        title="Resume Preview"
                        allow="autoplay"
                    />
                </div>

                {/* Bottom spacer instead of hint */}
                <div className="mt-8"></div>
            </div>
        </section>
    );
};
