import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Icons } from './Icons';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MAX_CHARS = 280;

// ──────────────── Desktop: 3-step calendar booking ────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

function isoDate(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

type BookingStep = 'calendar' | 'slots' | 'confirm' | 'success';

interface DesktopBookingPanelProps {
    onClose: () => void;
}

const MEET_TYPES = ['Interview', 'Coffee Chat', 'Connect', 'General Meeting'] as const;
type MeetType = typeof MEET_TYPES[number];

const DesktopBookingPanel: React.FC<DesktopBookingPanelProps> = ({ onClose }) => {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlotId, setSelectedSlotId] = useState<Id<'availableSlots'> | null>(null);
    const [step, setStep] = useState<BookingStep>('calendar');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [note, setNote] = useState('');
    const [meetType, setMeetType] = useState<MeetType>('Interview');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookedSlotClicked, setBookedSlotClicked] = useState(false);

    // Fetch ALL slots (including booked) so we can show them greyed out
    const allSlots = useQuery(api.portfolio.getAvailableSlots) ?? [];
    const requestBooking = useMutation(api.portfolio.requestBooking);

    // Group by date
    const slotsByDate = allSlots.reduce<Record<string, typeof allSlots>>((acc, slot) => {
        acc[slot.date] = acc[slot.date] ?? [];
        acc[slot.date].push(slot);
        return acc;
    }, {});

    // Calendar grid
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    const handleDayClick = (day: number) => {
        const d = isoDate(viewYear, viewMonth, day);
        if (!slotsByDate[d]?.length) return;
        setSelectedDate(d);
        setBookedSlotClicked(false);
        setStep('slots');
    };

    const handleSlotPick = (id: Id<'availableSlots'>, isBooked: boolean) => {
        if (isBooked) {
            setBookedSlotClicked(true);
            return;
        }
        setSelectedSlotId(id);
        setBookedSlotClicked(false);
        setStep('confirm');
    };

    const handleSubmit = async () => {
        if (!selectedSlotId || !name.trim() || !email.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await requestBooking({ slotId: selectedSlotId, name: name.trim(), email: email.trim(), note: note.trim() || undefined, meetType });
            setStep('success');
        } catch {
            alert('This slot is no longer available. Please pick another.');
            setStep('calendar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const slotsForDate = selectedDate ? (slotsByDate[selectedDate] ?? []) : [];
    const selectedSlot = allSlots.find(s => s._id === selectedSlotId);

    // ── Success ──
    if (step === 'success') {
        const label = meetType === 'Interview' ? 'Interview Scheduled! 🎉' :
            meetType === 'Coffee Chat' ? 'Coffee Chat Scheduled! ☕' :
                meetType === 'Connect' ? 'Connect Scheduled! 🤝' : 'Meeting Scheduled! 📅';
        return (
            <div className="flex flex-col items-center justify-center h-full gap-5 p-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Icons.Award className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white text-center">{label}</h3>
                <p className="text-white/40 text-sm text-center max-w-xs">
                    I'll review and confirm your slot shortly. You'll hear from me soon!
                </p>
                <button onClick={onClose} className="mt-2 px-6 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/15 transition-colors">
                    Close
                </button>
            </div>
        );
    }

    // ── Confirm ──
    if (step === 'confirm' && selectedSlot) {
        return (
            <div className="flex flex-col gap-5 p-8 h-full overflow-y-auto">
                <button onClick={() => setStep('slots')} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors w-fit">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Back
                </button>

                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Confirm your slot</h3>
                    <p className="text-white/35 text-sm mt-1">Name, email, and the type of meeting.</p>
                </div>

                {/* Slot summary */}
                <div className="rounded-2xl border border-white/10 p-4 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Icons.Briefcase className="w-5 h-5 text-white/60" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold">{selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        <p className="text-white/40 text-xs">{selectedSlot.startTime} – {selectedSlot.endTime}</p>
                    </div>
                </div>

                {/* Meeting type dropdown */}
                <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Meeting type</label>
                    <div className="relative">
                        <select
                            value={meetType}
                            onChange={e => setMeetType(e.target.value as MeetType)}
                            className="w-full appearance-none border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-white/25 transition-colors cursor-pointer"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                            {MEET_TYPES.map(t => (
                                <option key={t} value={t} style={{ background: '#1a1a1a', color: '#fff' }}>{t}</option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                />
                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                />
                <div className="relative">
                    <textarea
                        rows={2}
                        placeholder="Brief note (optional)"
                        value={note}
                        onChange={e => setNote(e.target.value.slice(0, 200))}
                        className="w-full border border-white/10 rounded-xl px-4 py-3 pb-8 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 resize-none transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                    />
                    <span className="absolute bottom-3 right-4 text-[11px] text-white/20 select-none">{note.length}/200</span>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!name.trim() || !email.trim() || isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-white text-black text-sm font-semibold disabled:opacity-30 hover:bg-white/90 transition-all active:scale-[0.99]"
                >
                    {isSubmitting ? 'Sending request…' : `Request ${meetType} →`}
                </button>
            </div>
        );
    }

    // ── Slots ──
    if (step === 'slots') {
        return (
            <div className="flex flex-col gap-5 p-8 h-full overflow-y-auto">
                <button onClick={() => { setStep('calendar'); setBookedSlotClicked(false); }} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors w-fit">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Back
                </button>

                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                        {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    <p className="text-white/35 text-sm mt-1">Pick a time that works for you</p>
                </div>

                {/* Booked-slot message */}
                {bookedSlotClicked && (
                    <div className="rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <span className="text-lg">📅</span>
                        <div>
                            <p className="text-white text-sm font-semibold">Interview Scheduled</p>
                            <p className="text-white/40 text-xs mt-0.5">This slot is already booked. Please choose another time.</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {slotsForDate.map(slot => {
                        const isBooked = (slot as any).isBooked === true;
                        return (
                            <button
                                key={slot._id}
                                onClick={() => handleSlotPick(slot._id, isBooked)}
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all text-left ${isBooked
                                    ? 'border-white/5 cursor-not-allowed opacity-40'
                                    : 'border-white/10 hover:border-white/25 active:scale-[0.98] cursor-pointer'
                                    }`}
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                            >
                                <div>
                                    <p className={`font-semibold text-sm ${isBooked ? 'text-white/50' : 'text-white'}`}>{slot.startTime} – {slot.endTime}</p>
                                    <p className="text-white/35 text-xs mt-0.5">{isBooked ? 'Already booked' : '30 min · Video call'}</p>
                                </div>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isBooked ? 'bg-white/5' : 'bg-white/10'}`}>
                                    {isBooked
                                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 17v-6M12 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                        : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    }
                                </div>
                            </button>
                        );
                    })}
                    {slotsForDate.length === 0 && (
                        <p className="text-white/30 text-sm text-center py-8">No slots available for this date.</p>
                    )}
                </div>
            </div>
        );
    }

    // ── Calendar (Step 1) ──
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    return (
        <div className="flex flex-col gap-5 p-8 h-full overflow-y-auto">
            <div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Book a call</h3>
                <p className="text-white/35 text-sm mt-1.5">Pick a day — I'll confirm the slot.</p>
            </div>

            {/* Month navigation */}
            <div className="flex items-center justify-between">
                <button onClick={prevMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <span className="text-white font-semibold text-sm">{MONTHS[viewMonth]} {viewYear}</span>
                <button onClick={nextMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
            </div>

            {/* Day labels + cells */}
            <div className="grid grid-cols-7 gap-1">
                {DAYS.map(d => (
                    <div key={d} className="text-center text-[11px] text-white/25 font-medium py-1">{d}</div>
                ))}
                {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const dateStr = isoDate(viewYear, viewMonth, day);
                    const todayStr = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
                    const isPast = dateStr < todayStr;
                    const hasSlots = !!slotsByDate[dateStr]?.length;
                    const isToday = dateStr === todayStr;
                    return (
                        <button
                            key={i}
                            disabled={isPast || !hasSlots}
                            onClick={() => handleDayClick(day)}
                            className={`relative aspect-square rounded-xl text-sm font-medium flex items-center justify-center transition-all
                                ${isPast ? 'text-white/15 cursor-not-allowed' :
                                    hasSlots ? 'text-white hover:bg-white/15 cursor-pointer active:scale-95' :
                                        'text-white/30 cursor-not-allowed'}
                                ${isToday ? 'ring-1 ring-white/30' : ''}
                            `}
                        >
                            {day}
                            {hasSlots && !isPast && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-400" />
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="text-white/20 text-xs text-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5 align-middle" />
                Green dot = slots available
            </p>
        </div>
    );
};




// ──────────────── Main Modal ────────────────

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);

    const sendConvexMessage = useMutation(api.portfolio.sendMessage);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
        } else {
            setAnimating(false);
            const t = setTimeout(() => {
                setVisible(false);
                setMessage('');
                setIsSent(false);
            }, 350);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    if (!visible) return null;

    const handleSend = async () => {
        if (!message.trim() || isSending) return;
        setIsSending(true);
        let locationData = '';
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            locationData = JSON.stringify({ city: data.city, region: data.region, country: data.country_name, ip: data.ip });
        } catch { }
        try {
            await sendConvexMessage({ platform: 'general', message: message.trim(), locationData, userAgent: navigator.userAgent });
        } catch { }
        setIsSending(false);
        setIsSent(true);
        setTimeout(() => onClose(), 3000);
    };

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${animating ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* ── DESKTOP: full-screen split layout ── */}
            <div className={`hidden md:flex absolute inset-0 transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${animating ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`}>

                {/* LEFT — hero image + info */}
                <div className="w-[42%] xl:w-[40%] h-full bg-[#0a0a0a] flex flex-col relative overflow-hidden">
                    {/* Close button */}
                    <button onClick={onClose}
                        className="absolute top-6 left-6 z-20 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                        aria-label="Close"
                    >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Hero photo */}
                    <div className="flex-1 relative">
                        <img
                            src="/brand-assets/portfolio-gnaneshbalusa-amazon.jpg"
                            alt="Gnanesh Balusa"
                            className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                    </div>

                    {/* Info + social icons */}
                    <div className="px-10 pb-10 pt-0 flex flex-col gap-5 relative z-10 -mt-20">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Gnanesh Balusa</h2>
                            <p className="text-white/50 text-sm mt-0.5">Machine Learning Engineer · Amazon</p>
                        </div>
                        <div className="flex items-center gap-5">
                            <a href="https://x.com/Gnaneshbalusa" target="_blank" rel="noopener noreferrer" title="X (Twitter)" className="text-white/35 hover:text-white transition-colors">
                                <Icons.Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://github.com/gnanesh-16" target="_blank" rel="noopener noreferrer" title="GitHub" className="text-white/35 hover:text-white transition-colors">
                                <Icons.GitHub className="w-5 h-5" />
                            </a>
                            <a href="https://in.linkedin.com/in/gnaneshbalusa" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-white/35 hover:text-white transition-colors">
                                <Icons.LinkedIn className="w-5 h-5" />
                            </a>
                            <a href="https://scholar.google.com/citations?user=3NC81YIAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" title="Google Scholar" className="text-white/35 hover:text-white transition-colors">
                                <Icons.GoogleScholar className="w-5 h-5" />
                            </a>
                            <a href="https://youtube.com/@gnaneshbalusa?si=QKaiNh319Mjh66KG" target="_blank" rel="noopener noreferrer" title="YouTube" className="text-white/35 hover:text-white transition-colors">
                                <Icons.YouTube className="w-5 h-5" />
                            </a>
                            <a href="https://medium.com/@GnaneshBalusa" target="_blank" rel="noopener noreferrer" title="Medium" className="text-white/35 hover:text-white transition-colors">
                                <Icons.Medium className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* RIGHT — calendar booking */}
                <div className="flex-1 h-full bg-[#111111] overflow-hidden">
                    <DesktopBookingPanel onClose={onClose} />
                </div>
            </div>

            {/* ── MOBILE: Contact Sheet ── */}
            <div className={`md:hidden absolute inset-0 transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${animating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <MobileContactForm
                    message={message}
                    setMessage={setMessage}
                    isSending={isSending}
                    isSent={isSent}
                    onSend={handleSend}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};

// ──────────────── Mobile: Enhanced Dual-Mode Sheet ────────────────

type MobileTab = 'message' | 'book';

interface MobileContactFormProps {
    message: string;
    setMessage: (val: string) => void;
    isSending: boolean;
    isSent: boolean;
    onSend: () => void;
    onClose: () => void;
}

const MobileContactForm: React.FC<MobileContactFormProps> = ({
    message, setMessage, isSending, isSent, onSend, onClose
}) => {
    const [activeTab, setActiveTab] = useState<MobileTab>('message');

    return (
        <div className="absolute inset-0 flex flex-col justify-end">
            <div className="bg-gradient-to-b from-[#1C1C1E] to-[#0A0A0A] rounded-t-[32px] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.8)] border-t border-white/10 max-h-[92vh]">
                {/* Drag Handle */}
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1" />

                {/* Header Actions */}
                <div className="flex justify-between items-center p-6 pb-2">
                    <div className="flex bg-white/5 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('message')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'message' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                        >
                            Message
                        </button>
                        <button
                            onClick={() => setActiveTab('book')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'book' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                        >
                            Book a Call
                        </button>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 pt-2 overflow-y-auto custom-scrollbar">
                    {activeTab === 'message' ? (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-2xl font-bold text-white tracking-tight">Let's connect</h3>
                                <p className="text-white/50 text-sm">Drop a message — I read every one.</p>
                            </div>

                            {isSent ? (
                                <div className="py-12 flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                        <Icons.Award className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white">Note sent!</h4>
                                    <p className="text-white/40 text-sm">Thanks for reaching out. I'll get back to you soon.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                                            placeholder="Write a message..."
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 text-base focus:outline-none focus:border-white/20 min-h-[160px] resize-none transition-all brightness-110"
                                        />
                                        <span className="absolute bottom-4 right-4 text-[11px] text-white/20 font-medium">
                                            {message.length}/{MAX_CHARS}
                                        </span>
                                    </div>

                                    <button
                                        onClick={onSend}
                                        disabled={!message.trim() || isSending}
                                        className="w-full py-4 rounded-2xl bg-white text-black font-bold text-base active:scale-[0.98] transition-all disabled:opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    >
                                        {isSending ? 'Sending...' : 'Send a note'}
                                    </button>

                                    <div className="h-[1px] bg-white/5 mt-2" />

                                    <div className="space-y-4 pb-6">
                                        <a href="https://linkedin.com/in/gnaneshbalusa" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors">
                                            <Icons.LinkedIn className="w-5 h-5 opacity-60" />
                                            <span className="text-sm font-medium">linkedin.com/in/gnaneshbalusa</span>
                                        </a>
                                        <a href="https://github.com/gnanesh-16" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors">
                                            <Icons.GitHub className="w-5 h-5 opacity-60" />
                                            <span className="text-sm font-medium">github.com/gnanesh-16</span>
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 min-h-[400px]">
                            <MobileBookingFlow onClose={onClose} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ──────────────── Mobile: Reduced Booking Flow ────────────────

const MobileBookingFlow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const formatDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });

    // Reuse mostly the same logic but styled for the mobile sheet
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlotId, setSelectedSlotId] = useState<Id<'availableSlots'> | null>(null);
    const [step, setStep] = useState<BookingStep>('calendar');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [note, setNote] = useState('');
    const [meetType, setMeetType] = useState<MeetType>('Interview');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const allSlots = useQuery(api.portfolio.getAvailableSlots) ?? [];
    const requestBooking = useMutation(api.portfolio.requestBooking);

    const slotsByDate = allSlots.reduce<Record<string, typeof allSlots>>((acc, slot) => {
        acc[slot.date] = acc[slot.date] ?? [];
        acc[slot.date].push(slot);
        return acc;
    }, {});

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    const handleDayClick = (day: number) => {
        const d = isoDate(viewYear, viewMonth, day);
        if (!slotsByDate[d]?.some(s => !(s as any).isBooked)) return;
        setSelectedDate(d);
        setStep('slots');
    };

    const handleSlotPick = (id: Id<'availableSlots'>) => {
        setSelectedSlotId(id);
        setStep('confirm');
    };

    const handleSubmit = async () => {
        if (!selectedSlotId || !name.trim() || !email.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await requestBooking({ slotId: selectedSlotId, name: name.trim(), email: email.trim(), note: note.trim() || undefined, meetType });
            setStep('success');
        } catch {
            alert('Slot is no longer available.');
            setStep('calendar');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <Icons.Award className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Confirmed!</h3>
                <p className="text-white/40 text-sm max-w-[240px]">I'll review and be in touch shortly. See you then!</p>
                <button onClick={onClose} className="mt-4 px-8 py-2.5 rounded-xl bg-white/10 text-white font-bold text-sm">Dismiss</button>
            </div>
        );
    }

    if (step === 'confirm') {
        return (
            <div className="flex flex-col gap-5">
                <button onClick={() => setStep('slots')} className="text-white/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1">← Back to times</button>
                <h3 className="text-xl font-bold text-white">{selectedDate && formatDate(selectedDate)}</h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1">
                    <p className="text-white text-sm font-bold">{selectedDate && formatDate(selectedDate)}</p>
                    <p className="text-white/40 text-xs">{allSlots.find(s => s._id === selectedSlotId)?.startTime} (30 min)</p>
                </div>
                <div className="flex flex-col gap-3">
                    <select value={meetType} onChange={e => setMeetType(e.target.value as MeetType)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none">
                        {MEET_TYPES.map(t => <option key={t} value={t} className="bg-[#1C1C1E]">{t}</option>)}
                    </select>
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" />
                    <textarea placeholder="Brief note" value={note} onChange={e => setNote(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none h-20 resize-none" />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!name.trim() || !email.trim() || isSubmitting}
                    className="w-full py-4 rounded-2xl bg-blue-500 text-white font-bold shadow-[0_4px_15px_rgba(59,130,246,0.3)] disabled:opacity-30"
                >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
            </div>
        );
    }



    if (step === 'slots') {
        const slots = selectedDate ? slotsByDate[selectedDate] || [] : [];
        return (
            <div className="flex flex-col gap-5">
                <button onClick={() => setStep('calendar')} className="text-white/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1">← Back to days</button>
                <h3 className="text-xl font-bold text-white">{selectedDate && formatDate(selectedDate)}</h3>
                <div className="grid grid-cols-1 gap-2">
                    {slots.map(s => {
                        const isBooked = (s as any).isBooked;
                        return (
                            <button
                                key={s._id}
                                disabled={isBooked}
                                onClick={() => handleSlotPick(s._id)}
                                className={`flex justify-between items-center p-4 rounded-xl border transition-all ${isBooked ? 'opacity-20 border-white/5' : 'bg-white/5 border-white/10 active:scale-95'}`}
                            >
                                <span className="text-white font-bold">{s.startTime}</span>
                                <span className="text-white/40 text-xs">{isBooked ? 'Booked' : '30 min'}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <h3 className="text-xl font-bold text-white">Pick a day</h3>

            {/* Nav */}
            <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                <button onClick={() => setViewMonth(m => m === 0 ? 11 : m - 1)} className="p-2 text-white/40 hover:text-white transition-colors">
                    <Icons.ArrowLeft className="w-4 h-4" />
                </button>
                <p className="text-white text-sm font-bold uppercase tracking-widest">{MONTHS[viewMonth]} {viewYear}</p>
                <button onClick={() => setViewMonth(m => m === 11 ? 0 : m + 1)} className="p-2 text-white/40 hover:text-white transition-colors">
                    <Icons.ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
                {DAYS.map(d => <div key={d} className="text-center text-[10px] font-bold text-white/20 pb-2">{d[0]}</div>)}
                {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const dStr = isoDate(viewYear, viewMonth, day);
                    const availability = slotsByDate[dStr] || [];
                    const hasOpen = availability.some(s => !(s as any).isBooked);
                    const isPast = dStr < isoDate(today.getFullYear(), today.getMonth(), today.getDate());

                    return (
                        <button
                            key={i}
                            disabled={!hasOpen || isPast}
                            onClick={() => handleDayClick(day)}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${hasOpen && !isPast
                                ? 'bg-white/10 text-white hover:bg-blue-500 active:scale-90 font-bold'
                                : 'text-white/10'
                                }`}
                        >
                            <span className="text-xs">{day}</span>
                            {hasOpen && !isPast && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-400" />}
                        </button>
                    );
                })}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Available for booking</p>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════
   Mobile My Cards UI — pixel-perfect match to screenshot
   ══════════════════════════════════════════════════════ */

const CARD_GRADIENTS = [
    'linear-gradient(to right, #3d2a1a, #7a5a2a, #c8922a)',
    'linear-gradient(to right, #2a2a2a, #4a4a4a, #6a6a6a)',
    'linear-gradient(to right, #1a3a1a, #3a6a1a, #8ab42a)',
    'linear-gradient(to right, #0a2a4a, #1a4a8a, #2a7abd)',
    'linear-gradient(to right, #2a1a3a, #5a2a6a, #ba5a8a, #da7a9a)',
    'linear-gradient(to right, #1a2a1a, #2a5a3a, #4aaa6a)',
];

const CARD_RIGHT_ICONS: Array<{ phone?: boolean; email?: boolean; globe?: number }> = [
    { phone: true, email: true, globe: 5 },
    { phone: true, email: true },
    { phone: true, email: true },
    { email: true },
    { email: true, globe: 2 },
    { phone: true, email: true },
];

/* tiny inline SVGs – avoids any type issues */
const IC = {
    Phone: () => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.17 21 3 13.83 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.2 1.02L6.6 10.8z" />
        </svg>
    ),
    Mail: () => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
    ),
    Globe: () => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
    ),
    Heart: () => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    ),
    User: () => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
    ),
    Crown: () => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 3a1 1 0 000 2h14a1 1 0 000-2H5z" />
        </svg>
    ),
};

/* QR placeholder */
import QRCode from 'react-qr-code';

const MobileMyCards: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const fetchedCards = useQuery(api.portfolio.getConnectsCards);
    const [selIdx, setSelIdx] = useState(0);

    const cards = fetchedCards
        ? [...fetchedCards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : null;

    const selCard = cards ? (cards[selIdx] ?? cards[0]) : null;

    const vCard = selCard ? [
        'BEGIN:VCARD', 'VERSION:3.0',
        `FN:${selCard.name || ''}`,
        `ORG:${selCard.company || ''}`,
        `TITLE:${selCard.role || ''}`,
        selCard.email ? `EMAIL;TYPE=WORK:${selCard.email}` : '',
        selCard.phone ? `TEL;TYPE=CELL:${selCard.phone}` : '',
        selCard.linkedin ? `URL:${selCard.linkedin.startsWith('http') ? selCard.linkedin : `https://in.linkedin.com/in/${selCard.linkedin}`}` : '',
        selCard.github ? `URL:${selCard.github.startsWith('http') ? selCard.github : `https://github.com/${selCard.github}`}` : '',
        'END:VCARD',
    ].filter(Boolean).join('\n') : 'https://gnaneshbalusa.com';

    return (
        <div style={{
            position: 'absolute', inset: 0, background: '#000',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
            overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
            <style>{`
                @keyframes mcFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
            `}</style>

            <div style={{ padding: '52px 22px 32px', display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>My Cards</span>
                        <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '4px 10px', fontSize: 14, fontWeight: 500, color: '#fff' }}>
                            {cards ? `${cards.length}/10` : '—'}
                        </span>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 300, lineHeight: 1 }}>
                        ×
                    </button>
                </div>

                {/* Loading */}
                {cards === null && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 60 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.12)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Loading…</span>
                        <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
                    </div>
                )}

                {/* Empty */}
                {cards !== null && cards.length === 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', marginTop: 60 }}>
                        No cards yet.<br />
                        <span style={{ fontSize: 12 }}>Add from Dashboard → Connects Cards.</span>
                    </p>
                )}

                {/* Card stack */}
                {cards !== null && cards.length > 0 && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {cards.map((card, idx) => {
                                const isDefault = idx === cards.length - 1;
                                const isSelected = idx === selIdx;
                                const ri = CARD_RIGHT_ICONS[idx % CARD_RIGHT_ICONS.length];
                                const t = (card.title ?? '').toLowerCase();
                                const LeftIcon = idx === 0
                                    ? <IC.Heart />
                                    : (t.includes('angel') || t.includes('business') || t.includes('investor'))
                                        ? <IC.Crown /> : <IC.User />;

                                return (
                                    <button
                                        key={card._id}
                                        onClick={() => setSelIdx(idx)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            height: 58, borderRadius: 16, padding: '0 16px',
                                            background: isDefault ? '#1a1a1a' : CARD_GRADIENTS[idx % CARD_GRADIENTS.length],
                                            border: isSelected ? '1.5px solid rgba(255,255,255,0.5)' : (isDefault ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.08)'),
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                            cursor: 'pointer', transition: 'transform 0.15s ease', width: '100%', userSelect: 'none',
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
                                                <span style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: '#fff' }}>Default</span>
                                            ) : (
                                                <>
                                                    {ri.phone && <IC.Phone />}
                                                    {ri.email && <IC.Mail />}
                                                    {ri.globe !== undefined && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                            <IC.Globe />
                                                            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{ri.globe}</span>
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Expanded preview card */}
                        {selCard && (() => {
                            const liLink = selCard.linkedin ? (selCard.linkedin.startsWith('http') ? selCard.linkedin : `https://in.linkedin.com/in/${selCard.linkedin}`) : null;
                            const ghLink = selCard.github ? (selCard.github.startsWith('http') ? selCard.github : `https://github.com/${selCard.github}`) : null;
                            const igLink = selCard.instagram ? (selCard.instagram.startsWith('http') ? selCard.instagram : `https://instagram.com/${selCard.instagram}`) : null;
                            const socialCircle = (bg: string): React.CSSProperties => ({ width: 30, height: 30, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' });
                            return (
                                <div key={selCard._id} style={{ background: '#1a1a1a', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, animation: 'mcFadeUp 0.3s ease' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                                        {/* left text */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{selCard.name}</h2>
                                            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 0 1px' }}>{selCard.role}</p>
                                            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 0 16px' }}>{selCard.company}</p>
                                            {/* social icons */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                {liLink && (
                                                    <a href={liLink} target="_blank" rel="noreferrer" style={socialCircle('#0A66C2')}>
                                                        <Icons.LinkedIn className="w-4 h-4 text-white" />
                                                    </a>
                                                )}
                                                {igLink && (
                                                    <a href={igLink} target="_blank" rel="noreferrer" style={socialCircle('linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)')}>
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
                                            <QRCode value={vCard} size={80} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} viewBox="0 0 80 80" />
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

