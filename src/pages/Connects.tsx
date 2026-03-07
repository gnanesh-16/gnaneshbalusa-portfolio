import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Icons } from '../components/Icons';

/* ── gradient per slot index ── */
const GRADIENTS = [
    'linear-gradient(to right, #3d2a1a, #7a5a2a, #c8922a)',
    'linear-gradient(to right, #2a2a2a, #4a4a4a, #6a6a6a)',
    'linear-gradient(to right, #1a3a1a, #3a6a1a, #8ab42a)',
    'linear-gradient(to right, #0a2a4a, #1a4a8a, #2a7abd)',
    'linear-gradient(to right, #2a1a3a, #5a2a6a, #ba5a8a, #da7a9a)',
    'linear-gradient(to right, #1a2a1a, #2a5a3a, #4aaa6a)',
];

/* ── right-icon config per slot ── */
const RIGHT_ICONS: Array<{ phone?: true; email?: true; globe?: number }> = [
    { phone: true, email: true, globe: 5 },
    { phone: true, email: true },
    { phone: true, email: true },
    { email: true },
    { email: true, globe: 2 },
    { phone: true, email: true },
];

/* ── tiny inline SVG icons (avoids TS issues with wrapper types) ── */
const SvgPhone = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.17 21 3 13.83 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.2 1.02L6.6 10.8z" />
    </svg>
);
const SvgMail = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
);
const SvgGlobe = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
);
const SvgHeart = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);
const SvgUser = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
);
const SvgCrown = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 3a1 1 0 000 2h14a1 1 0 000-2H5z" />
    </svg>
);

/* ── MiniCard ── */
const MiniCard = ({
    card, idx, isDefault, isSelected, onClick,
}: {
    card: { _id: string; title?: string };
    idx: number;
    isDefault: boolean;
    isSelected: boolean;
    onClick: () => void;
}) => {
    const ri = RIGHT_ICONS[idx % RIGHT_ICONS.length];
    const title = (card.title ?? '').toLowerCase();
    const LeftIcon =
        idx === 0 ? <SvgHeart /> :
            (title.includes('angel') || title.includes('business') || title.includes('investor'))
                ? <SvgCrown /> : <SvgUser />;

    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 58,
                borderRadius: 16,
                padding: '0 16px',
                background: isDefault ? '#1a1a1a' : GRADIENTS[idx % GRADIENTS.length],
                border: isSelected
                    ? '1.5px solid rgba(255,255,255,0.5)'
                    : (isDefault ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.08)'),
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                width: '100%',
                userSelect: 'none',
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = ''; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onTouchEnd={e => { e.currentTarget.style.transform = ''; }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {LeftIcon}
                <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{card.title}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {isDefault ? (
                    <span style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: '#fff' }}>
                        Default
                    </span>
                ) : (
                    <>
                        {ri.phone && <SvgPhone />}
                        {ri.email && <SvgMail />}
                        {ri.globe !== undefined && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <SvgGlobe />
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{ri.globe}</span>
                            </span>
                        )}
                    </>
                )}
            </div>
        </button>
    );
};

/* ── Preview card ── */
const PreviewCard = ({ card, vCardData }: { card: any; vCardData: string }) => {
    const liLink = card.linkedin
        ? (card.linkedin.startsWith('http') ? card.linkedin : `https://in.linkedin.com/in/${card.linkedin}`)
        : null;
    const ghLink = card.github
        ? (card.github.startsWith('http') ? card.github : `https://github.com/${card.github}`)
        : null;
    const igLink = card.instagram
        ? (card.instagram.startsWith('http') ? card.instagram : `https://instagram.com/${card.instagram}`)
        : null;

    return (
        <div style={{ background: '#1a1a1a', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                {/* text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{card.name}</h2>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 0 1px' }}>{card.role}</p>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 0 16px' }}>{card.company}</p>

                    {/* social icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {liLink && (
                            <a href={liLink} target="_blank" rel="noreferrer" style={socialCircle('#0A66C2')}>
                                <Icons.LinkedIn className="w-4 h-4 text-white" />
                            </a>
                        )}
                        {igLink && (
                            <a href={igLink} target="_blank" rel="noreferrer" style={socialCircle('linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', true)}>
                                <Icons.Instagram className="w-4 h-4 text-white" />
                            </a>
                        )}
                        <a href="https://x.com/Gnaneshbalusa" target="_blank" rel="noreferrer" style={{ ...socialCircle('#000'), border: '1px solid rgba(255,255,255,0.2)' }}>
                            <Icons.Twitter className="w-3.5 h-3.5 text-white" />
                        </a>
                        {ghLink && (
                            <a href={ghLink} target="_blank" rel="noreferrer" style={socialCircle('#24292F')}>
                                <Icons.GitHub className="w-4 h-4 text-white" />
                            </a>
                        )}
                    </div>
                </div>

                {/* QR */}
                <div style={{ background: '#fff', padding: 8, borderRadius: 12, flexShrink: 0, width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QRCode value={vCardData} size={80} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} viewBox="0 0 80 80" />
                </div>
            </div>
        </div>
    );
};

function socialCircle(bg: string, isGradient = false): React.CSSProperties {
    return {
        width: 30, height: 30, borderRadius: '50%',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, textDecoration: 'none',
    };
}

/* ── Page ── */
export const Connects: React.FC = () => {
    const fetchedCards = useQuery(api.portfolio.getConnectsCards);
    const [selectedIdx, setSelectedIdx] = useState(0);

    const cards = fetchedCards
        ? [...fetchedCards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : null;

    const selectedCard = cards ? (cards[selectedIdx] ?? cards[0]) : null;
    const total = cards?.length ?? 0;

    const vCardData = selectedCard ? [
        'BEGIN:VCARD', 'VERSION:3.0',
        `FN:${selectedCard.name || ''}`,
        `ORG:${selectedCard.company || ''}`,
        `TITLE:${selectedCard.role || ''}`,
        selectedCard.email ? `EMAIL;TYPE=WORK:${selectedCard.email}` : '',
        selectedCard.phone ? `TEL;TYPE=CELL:${selectedCard.phone}` : '',
        selectedCard.website ? `URL:${selectedCard.website}` : '',
        selectedCard.github ? `URL:${selectedCard.github.startsWith('http') ? selectedCard.github : `https://github.com/${selectedCard.github}`}` : '',
        selectedCard.linkedin ? `URL:${selectedCard.linkedin.startsWith('http') ? selectedCard.linkedin : `https://in.linkedin.com/in/${selectedCard.linkedin}`}` : '',
        'END:VCARD',
    ].filter(Boolean).join('\n') : 'https://gnaneshbalusa.com';

    return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex', justifyContent: 'center', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif", padding: '0 0 60px' }}>
            <style>{`
                @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
                @keyframes spin { to { transform:rotate(360deg); } }
                * { box-sizing:border-box; }
            `}</style>

            <div style={{ width: '100%', maxWidth: 430, padding: '52px 22px 32px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>My Cards</span>
                        <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '4px 10px', fontSize: 14, fontWeight: 500, color: '#fff' }}>
                            {cards ? `${total}/10` : '—'}
                        </span>
                    </div>
                    <a href="/" title="Back to Portfolio" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: 22, fontWeight: 300, lineHeight: 1 }}>
                        ×
                    </a>
                </div>

                {/* Loading */}
                {cards === null && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 80 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading cards…</span>
                    </div>
                )}

                {/* Empty */}
                {cards !== null && cards.length === 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', marginTop: 80 }}>
                        No cards yet.<br />
                        <span style={{ fontSize: 12 }}>Add from Dashboard → Connects Cards.</span>
                    </p>
                )}

                {/* Card list + preview */}
                {cards !== null && cards.length > 0 && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {cards.map((card, idx) => (
                                <MiniCard
                                    key={card._id}
                                    card={card}
                                    idx={idx}
                                    isDefault={idx === cards.length - 1}
                                    isSelected={idx === selectedIdx}
                                    onClick={() => setSelectedIdx(idx)}
                                />
                            ))}
                        </div>
                        {selectedCard && (
                            <PreviewCard key={selectedCard._id} card={selectedCard} vCardData={vCardData} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
