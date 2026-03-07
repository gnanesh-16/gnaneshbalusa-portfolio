import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Icons } from './Icons';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PROFILES = [
    {
        id: 'linkedin',
        label: 'LinkedIn',
        description: 'Connect professionally',
        href: 'https://in.linkedin.com/in/gnaneshbalusa',
        icon: Icons.LinkedIn,
        bg: 'bg-[#0A66C2]',
        hover: 'hover:bg-[#0A66C2]/90',
    },
    {
        id: 'github',
        label: 'GitHub',
        description: 'Check out my code',
        href: 'https://github.com/gnanesh-16',
        icon: Icons.GitHub,
        bg: 'bg-[#24292F]',
        hover: 'hover:bg-[#24292F]/90',
    },
    {
        id: 'email',
        label: 'Email',
        description: 'contact@gnaneshbalusa.com',
        href: 'mailto:contact@gnaneshbalusa.com',
        icon: Icons.Mail,
        bg: 'bg-gradient-to-tr from-[#FD1D1D] to-[#F56040]',
        hover: 'hover:opacity-90',
    },
    {
        id: 'instagram',
        label: 'Instagram',
        description: '@gnaneshbalusa',
        href: 'https://instagram.com/gnaneshbalusa',
        icon: Icons.Instagram,
        bg: 'bg-gradient-to-tr from-[#405DE6] via-[#E1306C] to-[#FFDC80]',
        hover: 'hover:opacity-90',
    },
];

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [activeProfile, setActiveProfile] = useState('');
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const sendConvexMessage = useMutation(api.portfolio.sendMessage);

    if (!isOpen) return null;

    const activeProfileData = PROFILES.find(p => p.id === activeProfile);

    const handleSend = async () => {
        if (!message.trim() || isSending) return;
        setIsSending(true);

        let locationData = '';
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            locationData = JSON.stringify({
                city: data.city,
                region: data.region,
                country: data.country_name,
                ip: data.ip
            });
        } catch (e) {
            console.error('Failed to fetch location data');
        }

        try {
            await sendConvexMessage({
                platform: activeProfile,
                message: message.trim(),
                locationData,
                userAgent: navigator.userAgent
            });
        } catch (e) {
            console.error('Failed to send message', e);
        }

        setIsSending(false);
        setIsSent(true);

        setTimeout(() => {
            onClose();
            setIsSent(false);
            setActiveProfile('');
            setMessage('');
        }, 3000);
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className={`relative w-full sm:max-w-md bg-white dark:bg-[#1C1C1E] rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 sm:p-8 transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

                {/* Handle bar */}
                <div className="absolute top-3 inset-x-0 flex justify-center sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-[#D2D2D7] dark:bg-[#48484A]" />
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[#86868B] hover:bg-[#E8E8ED] dark:hover:bg-[#38383A] transition-colors"
                >
                    <Icons.X className="w-4 h-4" />
                </button>

                {isSent ? (
                    <div className="flex flex-col items-center gap-4 py-10">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Icons.Award className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-center">Message sent!</h3>
                        <p className="text-[#86868B] text-sm text-center">Thanks for reaching out. I'll get back to you soon.</p>
                    </div>
                ) : activeProfile ? (
                    <div className="mt-4 flex flex-col gap-5">
                        {/* Back */}
                        <button
                            onClick={() => setActiveProfile('')}
                            className="flex items-center gap-2 text-[#0066CC] dark:text-[#3B9EFF] text-sm font-medium"
                        >
                            <Icons.ChevronDown className="w-4 h-4 rotate-90" />
                            Back
                        </button>

                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${activeProfileData?.bg}`}>
                                {activeProfileData && <activeProfileData.icon className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-semibold">{activeProfileData?.label}</p>
                                <p className="text-[#86868B] text-xs">{activeProfileData?.description}</p>
                            </div>
                        </div>

                        <textarea
                            autoFocus
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder={`Write a message for ${activeProfileData?.label}...`}
                            className="w-full h-32 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0066CC] dark:focus:ring-[#3B9EFF] placeholder-[#C7C7CC]"
                        />

                        <div className="flex gap-3">
                            <a
                                href={activeProfileData?.href}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-white text-sm font-semibold ${activeProfileData?.bg} ${activeProfileData?.hover} transition-opacity`}
                            >
                                <activeProfileData.icon className="w-4 h-4" />
                                Open {activeProfileData?.label}
                            </a>
                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || isSending}
                                className="flex-1 h-12 rounded-2xl bg-[#1a1a1a] dark:bg-white text-white dark:text-black text-sm font-semibold disabled:opacity-40 hover:opacity-80 transition-opacity"
                            >
                                {isSending ? 'Sending...' : 'Send Note'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 flex flex-col gap-5">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Let's connect!</h3>
                            <p className="text-[#86868B] text-sm">Choose how you'd like to reach out</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {PROFILES.map(profile => (
                                <button
                                    key={profile.id}
                                    onClick={() => setActiveProfile(profile.id)}
                                    className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] hover:bg-[#E8E8ED] dark:hover:bg-[#38383A] transition-colors text-left"
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${profile.bg}`}>
                                        <profile.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{profile.label}</p>
                                        <p className="text-[#86868B] text-xs mt-0.5 leading-tight">{profile.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <p className="text-center text-[#86868B] text-xs">
                            You can also view my{' '}
                            <a href="/connects" className="text-[#0066CC] dark:text-[#3B9EFF] underline underline-offset-2">
                                digital card wallet →
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
