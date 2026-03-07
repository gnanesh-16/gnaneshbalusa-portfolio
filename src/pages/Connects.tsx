import React from 'react';
import QRCode from 'react-qr-code';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Icons } from '../components/Icons';

export const Connects: React.FC = () => {
    const fetchedCards = useQuery(api.portfolio.getConnectsCards);

    // Safe sorted array, null while loading
    const cards = fetchedCards
        ? [...fetchedCards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : null;

    // Build a real vCard from the primary card's data
    const primaryCard = cards ? cards[0] : null;
    const vCardData = primaryCard
        ? [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${primaryCard.name || ''}`,
            `ORG:${primaryCard.company || ''}`,
            `TITLE:${primaryCard.role || ''}`,
            primaryCard.email ? `EMAIL;TYPE=WORK:${primaryCard.email}` : '',
            primaryCard.phone ? `TEL;TYPE=CELL:${primaryCard.phone}` : '',
            primaryCard.website ? `URL:${primaryCard.website}` : '',
            primaryCard.github ? `URL:${primaryCard.github.startsWith('http') ? primaryCard.github : `https://github.com/${primaryCard.github}`}` : '',
            primaryCard.linkedin ? `URL:${primaryCard.linkedin.startsWith('http') ? primaryCard.linkedin : `https://in.linkedin.com/in/${primaryCard.linkedin}`}` : '',
            'END:VCARD',
        ].filter(Boolean).join('\n')
        : 'https://gnaneshbalusa.com';

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">

            {/* Wallet Stack Container */}
            <div className="relative w-full max-w-[400px] h-[650px] flex items-end justify-center">

                {/* Header above stack */}
                <div className="absolute -top-12 inset-x-0 flex items-center justify-between z-50">
                    <div className="flex items-center gap-2 text-white">
                        <span className="text-xl font-bold tracking-tight">My Cards</span>
                        <div className="bg-white/20 text-xs px-2 py-0.5 rounded-md backdrop-blur-md">
                            {cards ? cards.length : '—'}
                        </div>
                    </div>
                    <a
                        href="/"
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors backdrop-blur-md"
                        title="Back to Portfolio"
                    >
                        <Icons.X className="w-4 h-4" />
                    </a>
                </div>

                {/* Loading State */}
                {cards === null && (
                    <div className="m-auto flex flex-col items-center gap-4 text-white pb-20">
                        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span className="text-sm text-white/60">Loading cards...</span>
                    </div>
                )}

                {/* Empty State */}
                {cards !== null && cards.length === 0 && (
                    <div className="m-auto text-white/50 text-sm text-center px-8 pb-20">
                        No cards yet.<br />
                        <span className="text-white/30 text-xs">Add some from the Dashboard → Connects Cards.</span>
                    </div>
                )}

                {/* Cards */}
                {cards !== null && cards.length > 0 && (
                    <>
                        {/* Background Stacked Cards (all except first) */}
                        {cards.slice(1).map((card, idx) => {
                            const topOffset = idx * 45;
                            const abbr = (card.title ?? 'C').substring(0, 2).toUpperCase();
                            return (
                                <div
                                    key={card._id}
                                    className="absolute w-full h-[180px] rounded-[32px] shadow-[0_-10px_20px_rgba(0,0,0,0.3)] flex items-start justify-between p-6 text-white border-t border-white/20 transition-transform hover:-translate-y-2 duration-300"
                                    style={{
                                        top: `${topOffset}px`,
                                        zIndex: idx,
                                        background: `linear-gradient(to right, ${card.colorFrom || '#94969E'}, ${card.colorTo || '#B5BAC0'})`
                                    }}
                                >
                                    <div className="flex items-center gap-2 font-medium">
                                        <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px] uppercase font-bold">
                                            {abbr}
                                        </div>
                                        {card.title}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Icons.Award className="w-4 h-4 opacity-70" />
                                        <Icons.Mail className="w-4 h-4 opacity-70" />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Main Active Card */}
                        {cards[0] && (() => {
                            const c = cards[0];
                            const liLink = c.linkedin
                                ? (c.linkedin.startsWith('http') ? c.linkedin : `https://in.linkedin.com/in/${c.linkedin}`)
                                : null;
                            const ghLink = c.github
                                ? (c.github.startsWith('http') ? c.github : `https://github.com/${c.github}`)
                                : null;

                            return (
                                <div
                                    className="relative w-full h-[380px] rounded-[32px] border-t border-white/20 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col text-white backdrop-blur-xl mt-auto z-[60]"
                                    style={{
                                        background: `linear-gradient(to bottom, ${c.colorFrom || '#2A2B2E'}, ${c.colorTo || '#121213'})`
                                    }}
                                >
                                    {/* Top Header */}
                                    <div className="absolute top-0 inset-x-0 p-6 flex items-start justify-between z-20">
                                        <div className="flex items-center gap-2 font-medium tracking-wide">
                                            <Icons.Award className="w-5 h-5 text-white" />
                                            {c.title}
                                        </div>
                                        <div className="px-4 py-1.5 rounded-full border border-white/30 text-xs font-semibold bg-transparent">
                                            Default
                                        </div>
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="mt-auto p-6 md:p-8 flex items-end justify-between z-20 w-full pb-8">
                                        <div className="flex flex-col gap-0.5">
                                            <h2 className="text-[26px] font-bold tracking-tight mb-2 truncate max-w-[200px]">{c.name}</h2>
                                            <p className="text-[#a1a1a6] text-sm truncate max-w-[200px]">{c.role}</p>
                                            <p className="text-[#a1a1a6] text-sm mb-4 truncate max-w-[200px]">{c.company}</p>

                                            <div className="flex items-center gap-3">
                                                {liLink && (
                                                    <a href={liLink} target="_blank" rel="noreferrer" className="w-6 h-6 rounded flex items-center justify-center text-[#0A66C2] bg-white hover:scale-110 transition-transform">
                                                        <Icons.LinkedIn className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {c.email && (
                                                    <a href={`mailto:${c.email}`} className="w-6 h-6 rounded flex items-center justify-center text-white bg-gradient-to-tr from-[#FD1D1D] to-[#F56040] hover:scale-110 transition-transform">
                                                        <Icons.Mail className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                                {ghLink && (
                                                    <a href={ghLink} target="_blank" rel="noreferrer" className="w-6 h-6 rounded flex items-center justify-center text-white bg-black hover:scale-110 transition-transform">
                                                        <Icons.GitHub className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Real scannable QR Code */}
                                        <div className="bg-white p-2 rounded-xl shrink-0 w-[100px] h-[100px] ml-4 flex items-center justify-center">
                                            <QRCode
                                                value={vCardData}
                                                size={84}
                                                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                                viewBox="0 0 84 84"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </>
                )}
            </div>
        </div>
    );
};
