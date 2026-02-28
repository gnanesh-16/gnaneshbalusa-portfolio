import React from 'react';
import { Icons } from './Icons';

interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Google Drive preview link
    const previewUrl = "https://drive.google.com/file/d/16AKWcSpsPhDa2G9kIBxZ-Wb_2E7eYnB8/preview";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            {/* Backdrop with heavy blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-[#131313] rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#e5e5e5] dark:border-zinc-800 bg-white/50 dark:bg-[#131313]/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#f5f5f5] dark:bg-zinc-800 rounded-lg">
                            <Icons.Briefcase className="w-5 h-5 text-[#1a1a1a] dark:text-[#f0f0f0]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#f0f0f0]">Curriculum Vitae</h3>
                            <p className="text-xs text-[#666] dark:text-[#999] font-medium tracking-wide border-l-2 border-[#B0B0B0] pl-2 ml-1">GNANESH BALUSA</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#f5f5f5] dark:hover:bg-zinc-800 rounded-full transition-colors group"
                        aria-label="Close modal"
                    >
                        <Icons.X className="w-6 h-6 text-[#666] dark:text-[#999] group-hover:text-[#1a1a1a] dark:group-hover:text-white" />
                    </button>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 bg-[#f0f0f0] dark:bg-zinc-900 relative">
                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-none"
                        title="Resume Preview"
                        allow="autoplay"
                    />
                </div>

                {/* Footer / Status bar */}
                <div className="p-3 bg-white/50 dark:bg-[#131313]/50 backdrop-blur-md border-t border-[#e5e5e5] dark:border-zinc-800 flex justify-center">
                    <p className="text-[10px] text-[#666] dark:text-[#999] font-bold uppercase tracking-[0.2em]">Press ESC or click backdrop to close</p>
                </div>
            </div>
        </div>
    );
};
