import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Icons } from '../components/Icons';

type Tab = 'Experiences' | 'Writings' | 'Projects' | 'Patents' | 'Publications' | 'Videos' | 'Connects Cards' | 'Deleted' | 'ExportImport' | 'Analytics' | 'Settings' | 'ReplyDMs' | 'Calendly';

// --- Generic Data List Component ---
const DataList: React.FC<{ tab: Tab; token: string }> = ({ tab, token }) => {
    // Determine which API methods to use based on the tab
    let getQuery: any, saveMut: any, delMut: any;
    let fields: { name: string, label: string, type?: string }[] = [];

    switch (tab) {
        case 'Experiences':
            getQuery = api.portfolio.getExperiences;
            saveMut = api.portfolio.saveExperience;
            delMut = api.portfolio.softDeleteExperience;
            fields = [
                { name: 'company', label: 'Company' },
                { name: 'logo', label: 'Logo URL' },
                { name: 'period', label: 'Period' },
                { name: 'role', label: 'Role' },
                { name: 'description', label: 'Description' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
        case 'Writings':
            getQuery = api.portfolio.getWritings;
            saveMut = api.portfolio.saveWriting;
            delMut = api.portfolio.softDeleteWriting;
            fields = [
                { name: 'year', label: 'Year' },
                { name: 'title', label: 'Title' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
        case 'Projects':
            getQuery = api.portfolio.getProjects;
            saveMut = api.portfolio.saveProject;
            delMut = api.portfolio.softDeleteProject;
            fields = [
                { name: 'name', label: 'Name' },
                { name: 'icon', label: 'Icon URL' },
                { name: 'year', label: 'Year' },
                { name: 'description', label: 'Description' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
        case 'Patents':
            getQuery = api.portfolio.getPatents;
            saveMut = api.portfolio.savePatent;
            delMut = api.portfolio.softDeletePatent;
            fields = [
                { name: 'title', label: 'Title' },
                { name: 'year', label: 'Year' },
                { name: 'description', label: 'Description' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
        case 'Publications':
            getQuery = api.portfolio.getPublications;
            saveMut = api.portfolio.savePublication;
            delMut = api.portfolio.softDeletePublication;
            fields = [
                { name: 'title', label: 'Title' },
                { name: 'year', label: 'Year' },
                { name: 'description', label: 'Description' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
        case 'Videos':
            getQuery = api.portfolio.getVideos;
            saveMut = api.portfolio.saveVideo;
            delMut = api.portfolio.softDeleteVideo;
            fields = [
                { name: 'title', label: 'Title' },
                { name: 'url', label: 'YouTube URL' },
                { name: 'description', label: 'Description' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
        case 'Connects Cards':
            getQuery = api.portfolio.getConnectsCards;
            saveMut = api.portfolio.saveConnectsCard;
            delMut = api.portfolio.softDeleteConnectsCard;
            fields = [
                { name: 'title', label: 'Card Title' },
                { name: 'colorFrom', label: 'Gradient Start (Hex - e.g., #2A2B2E)' },
                { name: 'colorTo', label: 'Gradient End (Hex - e.g., #121213)' },
                { name: 'name', label: 'Full Name' },
                { name: 'role', label: 'Role / Title' },
                { name: 'company', label: 'Company' },
                { name: 'email', label: 'Email' },
                { name: 'phone', label: 'Phone' },
                { name: 'website', label: 'Website (Optional)' },
                { name: 'linkedin', label: 'LinkedIn Handle (Optional)' },
                { name: 'github', label: 'GitHub Handle (Optional)' },
                { name: 'instagram', label: 'Instagram Handle (Optional)' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
    }

    const items = useQuery(getQuery) || [];
    const saveItem = useMutation(saveMut);
    const deleteItem = useMutation(delMut);

    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteClicks, setDeleteClicks] = useState<Record<string, number>>({});

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { _id, _creationTime, isDeleted, ...cleanData } = formData;
            await saveItem({ token, ...cleanData, id: editingId || undefined });
            setFormData({});
            setIsAdding(false);
            setEditingId(null);
        } catch (error) {
            console.error(error);
            alert('Error saving item. Ensure all fields are filled.');
        }
    };

    const handleAddClick = () => {
        const nextOrder = Math.max(...items.map((i: any) => i.order || 0), 0) + 1;
        setFormData({ order: nextOrder });
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEdit = (item: any) => {
        setFormData(item);
        setEditingId(item._id);
        setIsAdding(true);
        // Scroll to top where form is
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({});
        setDeleteClicks({});
    };

    const handleDeleteClick = async (id: string) => {
        const currentClicks = deleteClicks[id] || 0;

        if (currentClicks >= 2) {
            // 3rd click, actually delete
            await deleteItem({ token, id: id as any });
            const newClicks = { ...deleteClicks };
            delete newClicks[id];
            setDeleteClicks(newClicks);
        } else {
            setDeleteClicks({ ...deleteClicks, [id]: currentClicks + 1 });

            // Reset click count after 3 seconds if not clicked again
            setTimeout(() => {
                setDeleteClicks(prev => {
                    const next = { ...prev };
                    if (next[id] === currentClicks + 1) {
                        delete next[id];
                    }
                    return next;
                });
            }, 3000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#F5F5F7] dark:bg-[#1C1C1E] p-4 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A]">
                <h3 className="font-semibold text-lg">{tab} List</h3>
                <button
                    onClick={isAdding ? handleCancel : handleAddClick}
                    className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-sm font-medium transition-colors"
                >
                    {isAdding ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {isAdding && (
                <div className={`gap-6 ${tab === 'Connects Cards' ? 'grid grid-cols-1 xl:grid-cols-2' : ''}`}>
                    <form onSubmit={handleSave} className={`bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] space-y-4 animate-in fade-in slide-in-from-top-4 ${tab === 'Connects Cards' ? 'order-2 xl:order-1' : ''}`}>
                        <h4 className="font-semibold mb-4">{editingId ? 'Edit' : 'Add new'} {tab === 'Connects Cards' ? 'Card' : tab.slice(0, -1)}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map(f => (
                                <div key={f.name}>
                                    <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1.5 pl-1">{f.label}</label>
                                    {f.name === 'description' ? (
                                        <textarea
                                            value={formData[f.name] || ''}
                                            onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                                            className="w-full bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                                            rows={3}
                                            required
                                        />
                                    ) : (
                                        <input
                                            type={f.type || (f.name.startsWith('color') ? 'color' : 'text')}
                                            value={formData[f.name] || (f.name === 'colorFrom' ? '#2A2B2E' : f.name === 'colorTo' ? '#121213' : '')}
                                            onChange={e => setFormData({ ...formData, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                                            className={`w-full h-12 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC] ${f.name === 'order' ? 'opacity-60 cursor-not-allowed' : ''} ${f.name.startsWith('color') ? 'p-1 cursor-pointer' : ''}`}
                                            required={!['website', 'github', 'linkedin', 'instagram'].includes(f.name)}
                                            readOnly={f.name === 'order'}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-80 transition-opacity mt-4">
                            {editingId ? 'Update Item' : 'Save Item'}
                        </button>
                    </form>

                    {tab === 'Connects Cards' && (
                        <div className="bg-[#F5F5F7]/50 dark:bg-[#1C1C1E]/50 p-6 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4 order-1 xl:order-2 py-10 overflow-hidden relative">
                            <h4 className="absolute top-6 left-6 font-semibold mb-4 text-[#86868B] z-10">Live Preview</h4>

                            {/* Card Wrapper for scaling */}
                            <div className="w-full max-w-[380px] mx-auto transform scale-[0.85] sm:scale-100 origin-center transition-transform">
                                <div
                                    className="relative w-full h-[380px] rounded-[32px] border-t border-white/20 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col text-white backdrop-blur-xl"
                                    style={{
                                        background: `linear-gradient(to bottom, ${formData.colorFrom || '#2A2B2E'}, ${formData.colorTo || '#121213'})`
                                    }}
                                >
                                    {/* Top Card Header */}
                                    <div className="absolute top-0 inset-x-0 p-6 flex items-start justify-between z-20">
                                        <div className="flex items-center gap-2 font-medium tracking-wide">
                                            <Icons.Award className="w-5 h-5 text-white" />
                                            {formData.title || 'Card Title'}
                                        </div>
                                    </div>

                                    {/* Bottom Content Area */}
                                    <div className="mt-auto p-6 md:p-8 flex items-end justify-between z-20 w-full pb-8">
                                        <div className="flex flex-col gap-0.5">
                                            <h2 className="text-[26px] font-bold tracking-tight mb-2 truncate max-w-[180px]">{formData.name || 'Your Name'}</h2>
                                            <p className="text-[#a1a1a6] text-sm truncate max-w-[180px]">{formData.role || 'Your Role'}</p>
                                            <p className="text-[#a1a1a6] text-sm mb-4 truncate max-w-[180px]">{formData.company || 'Your Company'}</p>

                                            <div className="flex items-center gap-3">
                                                {formData.linkedin && (
                                                    <div className="w-6 h-6 rounded flex items-center justify-center text-[#0A66C2] bg-white">
                                                        <Icons.LinkedIn className="w-4 h-4" />
                                                    </div>
                                                )}
                                                {formData.email && (
                                                    <div className="w-6 h-6 rounded flex items-center justify-center text-white bg-gradient-to-tr from-[#FD1D1D] to-[#F56040]">
                                                        <Icons.Mail className="w-3.5 h-3.5" />
                                                    </div>
                                                )}
                                                {formData.github && (
                                                    <div className="w-6 h-6 rounded flex items-center justify-center text-white bg-black">
                                                        <Icons.GitHub className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white p-2 rounded-xl shrink-0 w-[100px] h-[100px] ml-4">
                                            <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
                                                <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="3" />
                                                <rect x="10" y="10" width="15" height="15" />
                                                <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="3" />
                                                <rect x="75" y="10" width="15" height="15" />
                                                <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="3" />
                                                <rect x="10" y="75" width="15" height="15" />
                                                <rect x="40" y="5" width="20" height="10" />
                                                <rect x="5" y="40" width="10" height="20" />
                                                <rect x="25" y="45" width="15" height="15" />
                                                <rect x="45" y="25" width="10" height="20" />
                                                <rect x="65" y="40" width="15" height="10" />
                                                <rect x="85" y="45" width="10" height="15" />
                                                <rect x="40" y="55" width="20" height="10" />
                                                <rect x="70" y="65" width="25" height="10" />
                                                <rect x="55" y="75" width="10" height="20" />
                                                <rect x="80" y="85" width="15" height="10" />
                                                <rect x="70" y="80" width="5" height="15" />
                                                <rect x="40" y="80" width="10" height="15" />
                                                <rect x="35" y="65" width="5" height="5" />
                                                <rect x="60" y="15" width="5" height="5" />
                                                <rect x="20" y="32" width="15" height="5" />
                                                <rect x="45" y="45" width="15" height="5" />
                                                <rect x="80" y="35" width="15" height="5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-4 max-h-[660px] overflow-y-auto pr-2 custom-scrollbar">
                {items.length === 0 ? (
                    <div className="text-center py-10 text-[#86868B] text-sm">No items found. Click "Add New" to create one.</div>
                ) : (
                    items.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group flex-shrink-0">
                            <div className="flex-1 space-y-1">
                                <div className="font-semibold text-lg">{item.title || item.company || item.name}</div>
                                <div className="text-sm text-[#86868B]">{item.period || item.year} {item.role ? `- ${item.role}` : ''}</div>
                                {item.description && <div className="text-sm mt-2 text-[#555] dark:text-[#a0a0a0] line-clamp-2">{item.description}</div>}
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-[#D2D2D7] dark:border-[#38383A] md:border-t-0 justify-between md:justify-end">
                                <span className="text-xs text-[#86868B] font-mono bg-[#F5F5F7] dark:bg-[#2C2C2E] px-2 py-1 rounded-md mr-2">Order: {item.order}</span>

                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-[#0071E3] hover:text-[#0077ED] text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-[#0071E3]/10 transition-colors"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDeleteClick(item._id)}
                                    className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${(deleteClicks[item._id] || 0) > 0
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
                                        }`}
                                >
                                    {(deleteClicks[item._id] || 0) === 0 ? 'Delete' :
                                        (deleteClicks[item._id] === 1) ? 'Click again' :
                                            'Confirm delete'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────── CalendlyView ───────────────────────────────
// ─────────────────────────────── CalendlyView ───────────────────────────────
const CalendlyView: React.FC<{ token: string }> = ({ token }) => {
    const allSlots = useQuery(api.portfolio.getAllSlots, { token }) ?? [];
    const bookingRequests = useQuery(api.portfolio.getBookingRequests, { token }) ?? [];
    const createSlot = useMutation(api.portfolio.createSlot);
    const deleteSlot = useMutation(api.portfolio.deleteSlot);
    const bulkDeleteSlots = useMutation(api.portfolio.bulkDeleteSlots as any);
    const setBookingStatus = useMutation(api.portfolio.setBookingStatus as any);
    const updateBooking = useMutation(api.portfolio.updateBooking);

    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [bulkSelectedDates, setBulkSelectedDates] = useState<Set<string>>(new Set());

    // Day Panel State
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [newStart, setNewStart] = useState('10:00');
    const [newEnd, setNewEnd] = useState('10:30');
    const [slotFrequency, setSlotFrequency] = useState(1);
    const [isCreating, setIsCreating] = useState(false);

    // Edit Request State
    const [editingRequest, setEditingRequest] = useState<string | null>(null);
    const [editMeetType, setEditMeetType] = useState('');
    const [editGMeet, setEditGMeet] = useState('');

    const isoDate = (y: number, m: number, d: number) => {
        const mm = (m + 1).toString().padStart(2, '0');
        const dd = d.toString().padStart(2, '0');
        return `${y}-${mm}-${dd}`;
    };

    const parseTimeToMinutes = (time: string) => {
        const trimmed = time.trim();
        const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (ampmMatch) {
            let hours = Number(ampmMatch[1]);
            const minutes = Number(ampmMatch[2]);
            const period = ampmMatch[3].toUpperCase();
            if (Number.isNaN(hours) || Number.isNaN(minutes)) return Number.MAX_SAFE_INTEGER;
            if (period === 'AM' && hours === 12) hours = 0;
            if (period === 'PM' && hours !== 12) hours += 12;
            return hours * 60 + minutes;
        }
        const basicMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
        if (!basicMatch) return Number.MAX_SAFE_INTEGER;
        const hours = Number(basicMatch[1]);
        const minutes = Number(basicMatch[2]);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) return Number.MAX_SAFE_INTEGER;
        return hours * 60 + minutes;
    };

    const formatTime12 = (time: string) => {
        const mins = parseTimeToMinutes(time);
        if (mins === Number.MAX_SAFE_INTEGER) return time;
        const hours24 = Math.floor(mins / 60);
        const minutes = mins % 60;
        const period = hours24 >= 12 ? 'PM' : 'AM';
        const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
        return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const slotsByDate = allSlots.reduce<Record<string, typeof allSlots>>((acc, slot) => {
        acc[slot.date] = acc[slot.date] ?? [];
        acc[slot.date].push(slot);
        return acc;
    }, {});

    Object.keys(slotsByDate).forEach((dateKey) => {
        slotsByDate[dateKey].sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
    });

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
    const isRangeInvalid = !newStart || !newEnd || newEnd <= newStart;

    const handleCreateSlot = async (date: string) => {
        if (!newStart || !newEnd || isCreating || isRangeInvalid) return;
        setIsCreating(true);
        try {
            await createSlot({ token, date, startTime: newStart, endTime: newEnd, frequencyMins: slotFrequency });
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Failed to add slots');
        } finally {
            setIsCreating(false);
        }
    };

    const handleBulkCreate = async () => {
        if (bulkSelectedDates.size === 0 || !newStart || !newEnd || isCreating || isRangeInvalid) return;
        setIsCreating(true);
        try {
            for (const date of Array.from(bulkSelectedDates)) {
                await createSlot({ token, date, startTime: newStart, endTime: newEnd, frequencyMins: slotFrequency });
            }
            setBulkSelectedDates(new Set());
            setIsBulkMode(false);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Failed to bulk add slots');
        } finally {
            setIsCreating(false);
        }
    };

    const handleBulkDelete = async () => {
        if (bulkSelectedDates.size === 0 || isCreating) return;
        setIsCreating(true);
        try {
            await bulkDeleteSlots({ token, dates: Array.from(bulkSelectedDates) });
            setBulkSelectedDates(new Set());
            setIsBulkMode(false);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Failed to remove selected slots');
        } finally {
            setIsCreating(false);
        }
    };

    const handleClearAllOpenSlots = async () => {
        if (isCreating) return;
        setIsCreating(true);
        try {
            await bulkDeleteSlots({ token });
            setBulkSelectedDates(new Set());
            setIsBulkMode(false);
            setSelectedDate(null);
            setIsPanelOpen(false);
            setNewStart('10:00');
            setNewEnd('10:30');
            setSlotFrequency(1);
            setViewYear(today.getFullYear());
            setViewMonth(today.getMonth());
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Failed to clear open slots');
        } finally {
            setIsCreating(false);
        }
    };

    const startEdit = (req: any) => {
        setEditingRequest(req._id);
        setEditMeetType(req.meetType || 'Interview');
        setEditGMeet(req.gmeetLink || '');
    };

    const saveEdit = async (requestId: Id<'bookingRequests'>) => {
        await updateBooking({ token, requestId, meetType: editMeetType, gmeetLink: editGMeet });
        setEditingRequest(null);
    };

    const formatDate = (d: string) => {
        try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
        catch { return d; }
    };

    const statusColor: Record<string, string> = {
        pending: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
        approved: 'bg-green-500/20 text-green-600 dark:text-green-400',
        rejected: 'bg-red-500/20 text-red-600 dark:text-red-400',
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
            {/* LEFT: Calendar Slot Manager */}
            <div className="xl:col-span-12 2xl:col-span-7 flex flex-col gap-6 ">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Manage Availability</h2>
                        <p className="text-[#86868B] text-sm mt-1">Calendar-based slot planning</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={handleClearAllOpenSlots}
                            disabled={isCreating}
                            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-red-500/10 text-red-500 hover:bg-red-500/15 disabled:opacity-40"
                        >
                            Clear All Open Slots
                        </button>
                        <button
                            onClick={() => { setIsBulkMode(!isBulkMode); setBulkSelectedDates(new Set()); }}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${isBulkMode ? 'bg-blue-500 text-white shadow-lg' : 'bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] text-[#86868B]'}`}
                        >
                            {isBulkMode ? 'Cancel Bulk' : 'Bulk Select'}
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-[#D2D2D7] dark:border-[#38383A] p-6 shadow-sm">
                    {/* Month Nav */}
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex gap-4 items-center">
                            <h3 className="text-lg font-bold min-w-[140px]">{MONTHS[viewMonth]} {viewYear}</h3>
                            <div className="flex gap-1">
                                <button onClick={() => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); }}
                                    className="p-1.5 hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] rounded-lg text-[#86868B] transition-colors"><Icons.ArrowLeft className="w-5 h-5" /></button>
                                <button onClick={() => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); }}
                                    className="p-1.5 hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] rounded-lg text-[#86868B] transition-colors"><Icons.ArrowRight className="w-5 h-5" /></button>
                                <button
                                    onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelectedDate(todayIso); }}
                                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#86868B] hover:opacity-80 transition-all"
                                >
                                    Today
                                </button>
                            </div>
                        </div>
                    </div>

                    {isBulkMode && (
                        <div className="mb-6 p-4 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] bg-[#F5F5F7] dark:bg-[#2C2C2E] animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-xs font-semibold text-[#555] dark:text-[#c8c8cc]">{bulkSelectedDates.size} date(s) selected</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                                    <input type="time" value={newStart} onChange={e => setNewStart(e.target.value)} className="bg-white dark:bg-[#1C1C1E] text-xs border border-[#D2D2D7] dark:border-[#38383A] rounded-lg px-2.5 py-2" />
                                    <input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="bg-white dark:bg-[#1C1C1E] text-xs border border-[#D2D2D7] dark:border-[#38383A] rounded-lg px-2.5 py-2" />
                                    <select value={slotFrequency} onChange={e => setSlotFrequency(Number(e.target.value))} className="bg-white dark:bg-[#1C1C1E] text-xs border border-[#D2D2D7] dark:border-[#38383A] rounded-lg px-2.5 py-2">
                                        {[1, 2, 5, 10, 15, 30].map(freq => (
                                            <option key={freq} value={freq}>{freq} min</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button onClick={handleBulkCreate} disabled={bulkSelectedDates.size === 0 || isCreating || isRangeInvalid} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-[11px] font-bold hover:bg-blue-600 disabled:opacity-40 transition-all">
                                        {isCreating ? 'Adding…' : 'Add Slots'}
                                    </button>
                                    <button onClick={handleBulkDelete} disabled={bulkSelectedDates.size === 0 || isCreating} className="bg-red-500/10 text-red-500 px-3 py-2 rounded-lg text-[11px] font-bold hover:bg-red-500/20 disabled:opacity-40 transition-all">
                                        Remove Selected
                                    </button>
                                </div>
                            </div>
                            {isRangeInvalid && <p className="text-[11px] text-red-500 font-semibold mt-2">End time must be greater than start time</p>}
                        </div>
                    )}

                    <div className="grid grid-cols-7 gap-2">
                        {DAYS.map(d => <div key={d} className="text-center text-[10px] uppercase font-bold text-[#86868B] tracking-wider py-2">{d}</div>)}
                        {cells.map((day, i) => {
                            if (!day) return <div key={i} />;
                            const dStr = isoDate(viewYear, viewMonth, day);
                            const daySlots = slotsByDate[dStr] || [];
                            const isSelected = selectedDate === dStr;
                            const isBulkSelected = bulkSelectedDates.has(dStr);
                            const hasBooked = daySlots.some(s => s.isBooked);
                            const isToday = dStr === todayIso;

                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (isBulkMode) {
                                            const next = new Set(bulkSelectedDates);
                                            if (next.has(dStr)) next.delete(dStr); else next.add(dStr);
                                            setBulkSelectedDates(next);
                                        } else {
                                            setSelectedDate(dStr);
                                            setIsPanelOpen(true);
                                        }
                                    }}
                                    className={`aspect-square relative flex flex-col items-center justify-center rounded-2xl transition-all border
                                        ${isBulkSelected ? 'bg-blue-500/10 border-blue-500 dark:border-blue-400' :
                                            isSelected ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-lg scale-105' :
                                                isToday ? 'bg-[#F5F5F7] dark:bg-[#2C2C2E] border-[#86868B]/60 hover:bg-[#EFEEF1] dark:hover:bg-[#38383A]' :
                                                    'bg-[#F5F5F7] dark:bg-[#2C2C2E] border-transparent hover:bg-[#EFEEF1] dark:hover:bg-[#38383A]'}
                                    `}
                                >
                                    <span className="text-sm font-semibold">{day}</span>
                                    {isToday && !isSelected && (
                                        <span className="text-[9px] mt-0.5 uppercase tracking-wider text-[#86868B] font-bold">Today</span>
                                    )}
                                    {daySlots.length > 0 && (
                                        <div className="flex gap-0.5 mt-1">
                                            {daySlots.slice(0, 3).map((_, idx) => (
                                                <div key={idx} className={`w-1 h-1 rounded-full ${hasBooked ? 'bg-green-500' : 'bg-blue-500'}`} />
                                            ))}
                                            {daySlots.length > 3 && <div className="w-1 h-1 rounded-full bg-gray-400" />}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* RIGHT: Booking Requests & Day Details */}
            <div className="xl:col-span-12 2xl:col-span-5 flex flex-col gap-8">
                {/* Day Details (Floating or side) */}
                {isPanelOpen && selectedDate && (
                    <div className="bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-3xl p-6 shadow-xl animate-in slide-in-from-right-4">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold">{formatDate(selectedDate)}</h3>
                                <p className="text-xs text-[#86868B] mt-0.5">{slotsByDate[selectedDate]?.length || 0} slots available</p>
                            </div>
                            <button onClick={() => setIsPanelOpen(false)} className="p-1.5 hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] rounded-xl text-[#86868B]"><Icons.X className="w-5 h-5" /></button>
                        </div>

                        {/* Add Slot */}
                        <div className="mb-6 p-4 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-2xl border border-[#D2D2D7]/60 dark:border-[#38383A] space-y-3 sticky top-0 z-10">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-[#86868B] font-bold">Start</p>
                                    <input type="time" value={newStart} onChange={e => setNewStart(e.target.value)} className="w-full bg-white dark:bg-[#1C1C1E] text-sm border border-[#D2D2D7] dark:border-[#38383A] rounded-xl px-3 py-2.5 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-[#86868B] font-bold">End</p>
                                    <input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="w-full bg-white dark:bg-[#1C1C1E] text-sm border border-[#D2D2D7] dark:border-[#38383A] rounded-xl px-3 py-2.5 font-medium" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-[#86868B] font-bold">Frequency</p>
                                    <select value={slotFrequency} onChange={e => setSlotFrequency(Number(e.target.value))} className="w-full bg-white dark:bg-[#1C1C1E] text-sm border border-[#D2D2D7] dark:border-[#38383A] rounded-xl px-3 py-2.5 font-medium">
                                        {[1, 2, 5, 10, 15, 30].map(freq => (
                                            <option key={freq} value={freq}>{freq} min</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[11px] text-[#86868B]">Creates time slots between selected start and end.</p>
                                <button onClick={() => handleCreateSlot(selectedDate)} disabled={isCreating || isRangeInvalid} className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 disabled:opacity-40 transition-all whitespace-nowrap">
                                    {isCreating ? 'Adding…' : '+ Add Slots'}
                                </button>
                            </div>

                            {isRangeInvalid && (
                                <p className="text-[11px] text-red-500 font-semibold">End time must be greater than start time.</p>
                            )}
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {(slotsByDate[selectedDate] || []).map(slot => (
                                <div key={slot._id} className="flex items-center justify-between p-3.5 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] bg-white dark:bg-[#1C1C1E]">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${slot.isBooked ? 'bg-green-500' : 'bg-blue-500'}`} />
                                        <span className="text-sm font-medium">{formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {slot.isBooked && <span className="text-[10px] font-bold text-green-600 uppercase">Booked</span>}
                                        {!slot.isBooked && (
                                            <button onClick={() => deleteSlot({ token, id: slot._id as Id<'availableSlots'> })}
                                                className="w-8 h-8 rounded-xl hover:bg-red-500/10 flex items-center justify-center text-[#86868B] hover:text-red-500 transition-all">
                                                <Icons.X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Booking Requests */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Recruiter Hooks</h2>
                        <p className="text-[#86868B] text-sm mt-1">{bookingRequests.filter(r => r.status === 'pending').length} needing attention</p>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {bookingRequests.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-[#1C1C1E] border border-dashed border-[#D2D2D7] dark:border-[#38383A] rounded-3xl text-[#86868B]">No requests yet.</div>
                        ) : (
                            [...bookingRequests].sort((a, b) => b.createdAt - a.createdAt).map(req => {
                                const slot = allSlots.find(s => s._id === req.slotId);
                                const isEditing = editingRequest === req._id;
                                return (
                                    <div key={req._id} className="group rounded-3xl border border-[#D2D2D7] dark:border-[#38383A] p-5 bg-white dark:bg-[#1C1C1E] shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-base leading-tight">{req.name}</p>
                                                <p className="text-sm text-[#86868B]">{req.email}</p>
                                            </div>
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${statusColor[req.status]}`}>
                                                {req.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 px-3 py-2 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-xl flex items-center gap-2 text-xs font-medium">
                                                <Icons.Briefcase className="w-3.5 h-3.5 text-[#86868B]" />
                                                <span>{slot ? `${formatDate(slot.date)} · ${formatTime12(slot.startTime)}` : 'Date/Time Unknown'}</span>
                                            </div>
                                            <div className="px-3 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-tight">
                                                {req.meetType || 'Interview'}
                                            </div>
                                        </div>

                                        {req.note && <p className="text-xs text-[#555] dark:text-[#a0a0a0] leading-relaxed italic border-l-2 border-[#D2D2D7] dark:border-[#38383A] pl-3 py-0.5">{req.note}</p>}

                                        {/* Approved/Actions Section */}
                                        <div className="pt-2 border-t border-[#F5F5F7] dark:border-[#2C2C2E] flex flex-col gap-3">
                                            {isEditing ? (
                                                <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select value={editMeetType} onChange={e => setEditMeetType(e.target.value)} className="bg-[#F5F5F7] dark:bg-[#2C2C2E] border-none rounded-xl text-xs py-2">
                                                            {['Interview', 'Coffee Chat', 'Connect', 'General Meeting'].map(t => <option key={t} value={t}>{t}</option>)}
                                                        </select>
                                                        <input value={editGMeet} onChange={e => setEditGMeet(e.target.value)} placeholder="GMeet / Zoom Link" className="bg-[#F5F5F7] dark:bg-[#2C2C2E] border-none rounded-xl text-xs py-2" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => saveEdit(req._id)} className="flex-1 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-bold">Save Changes</button>
                                                        <button onClick={() => setEditingRequest(null)} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-[10px] font-bold">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                    <div className="flex items-center gap-2 text-[10px] flex-wrap">
                                                        {req.gmeetLink ? (
                                                            <button onClick={() => window.open(req.gmeetLink, '_blank')} className="text-blue-500 hover:underline flex items-center gap-1">
                                                                <Icons.Video className="w-3 h-3" /> GMeet Link Attached
                                                            </button>
                                                        ) : (
                                                            <span className="text-[#86868B] italic">No meeting link yet</span>
                                                        )}
                                                        <button onClick={() => startEdit(req)} className="w-6 h-6 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg flex items-center justify-center text-[#86868B] transition-all"><Icons.PenTool className="w-3 h-3" /></button>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 md:ml-auto">
                                                        {req.status !== 'approved' && (
                                                            <button onClick={() => setBookingStatus({ token, requestId: req._id, status: 'approved' })}
                                                                className="px-3 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase hover:opacity-80 transition-all">Approve</button>
                                                        )}
                                                        {req.status !== 'rejected' && (
                                                            <button onClick={() => setBookingStatus({ token, requestId: req._id, status: 'rejected' })}
                                                                className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase hover:bg-red-500/20 transition-all">Reject</button>
                                                        )}
                                                        {req.status !== 'pending' && (
                                                            <button onClick={() => setBookingStatus({ token, requestId: req._id, status: 'pending' })}
                                                                className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase hover:bg-blue-500/20 transition-all">Move to Pending</button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="absolute bottom-2 right-4 text-[9px] text-[#86868B] opacity-40">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    useEffect(() => {
        if (!token) {
            navigate('/dashboard/login');
        }
    }, [token, navigate]);

    const [activeTab, setActiveTab] = useState<Tab>('Experiences');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/');
    };

    if (!token) return null;

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] font-[Inter,sans-serif] flex overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed md:relative z-20 h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'} bg-[#F5F5F7]/80 dark:bg-[#1C1C1E]/80 backdrop-blur-3xl border-r border-[#D2D2D7] dark:border-[#38383A] flex flex-col`}>
                <div className="p-4 flex items-center justify-between border-b border-[#D2D2D7] dark:border-[#38383A] h-16">
                    <h2 className={`font-semibold tracking-tight transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden md:block'}`}>
                        {sidebarOpen ? 'Dashboard' : ''}
                    </h2>

                    {/* Toggle Button - always shown on desktop, hidden on mobile */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors hidden md:flex items-center justify-center ${!sidebarOpen && 'w-full'}`}
                        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <Icons.ArrowRight className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Mobile close button */}
                    <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors md:hidden">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                    {(['Experiences', 'Writings', 'Projects', 'Patents', 'Publications', 'Videos', 'Connects Cards'] as Tab[]).map((tab) => {
                        let IconComponent;
                        switch (tab) {
                            case 'Experiences': IconComponent = Icons.Briefcase; break;
                            case 'Writings': IconComponent = Icons.PenTool; break;
                            case 'Projects': IconComponent = Icons.Code; break;
                            case 'Patents': IconComponent = Icons.Award; break;
                            case 'Publications': IconComponent = Icons.BookOpen; break;
                            case 'Videos': IconComponent = Icons.YouTube; break;
                            case 'Connects Cards': IconComponent = Icons.Award; break;
                            default: IconComponent = Icons.Layers;
                        }

                        return (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); if (window.innerWidth < 768) setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === tab
                                    ? 'bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-md'
                                    : 'text-[#555] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/10'
                                    } ${!sidebarOpen ? 'justify-center' : ''}`}
                                title={!sidebarOpen ? tab : undefined}
                            >
                                <IconComponent className={`w-5 h-5 flex-shrink-0 ${activeTab === tab ? 'opacity-100' : 'opacity-70'}`} />
                                <span className={`${sidebarOpen ? 'block' : 'hidden md:hidden'} truncate`}>
                                    {tab}
                                </span>
                            </button>
                        );
                    })}

                    <div className="h-[1px] bg-[#D2D2D7] dark:bg-[#38383A] my-4" />

                    {/* Reply DMs */}
                    <button
                        onClick={() => { setActiveTab('ReplyDMs'); if (window.innerWidth < 768) setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'ReplyDMs'
                            ? 'bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-md'
                            : 'text-[#555] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/10'
                            } ${!sidebarOpen ? 'justify-center' : ''}`}
                        title={!sidebarOpen ? 'Reply DMs' : undefined}
                    >
                        <Icons.ArrowRight className={`w-5 h-5 flex-shrink-0 ${activeTab === 'ReplyDMs' ? 'opacity-100' : 'opacity-70'}`} />
                        <span className={`${sidebarOpen ? 'block' : 'hidden md:block truncate'}`}>Reply DMs</span>
                    </button>

                    {/* Calendly */}
                    <button
                        onClick={() => { setActiveTab('Calendly'); if (window.innerWidth < 768) setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'Calendly'
                            ? 'bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-md'
                            : 'text-[#555] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/10'
                            } ${!sidebarOpen ? 'justify-center' : ''}`}
                        title={!sidebarOpen ? 'Calendly' : undefined}
                    >
                        <Icons.Briefcase className={`w-5 h-5 flex-shrink-0 ${activeTab === 'Calendly' ? 'opacity-100' : 'opacity-70'}`} />
                        <span className={`${sidebarOpen ? 'block' : 'hidden md:hidden'} truncate`}>Calendly</span>
                    </button>

                    {/* Courses */}
                    <Link
                        to="/dashboard/courseadding"
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-[#555] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/10 ${!sidebarOpen ? 'justify-center' : ''}`}
                        title={!sidebarOpen ? 'Courses' : undefined}
                    >
                        <Icons.BookOpen className="w-5 h-5 flex-shrink-0 opacity-70" />
                        <span className={`${sidebarOpen ? 'block' : 'hidden md:hidden'} truncate`}>Courses</span>
                    </Link>

                    {/* Settings Tabs */}
                    <button
                        onClick={() => { setActiveTab('Analytics'); if (window.innerWidth < 768) setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'Analytics'
                            ? 'bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-md'
                            : 'text-[#555] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/10'
                            } ${!sidebarOpen ? 'justify-center' : ''}`}
                        title={!sidebarOpen ? 'Analytics' : undefined}
                    >
                        <Icons.Layers className={`w-5 h-5 flex-shrink-0 ${activeTab === 'Analytics' ? 'opacity-100' : 'opacity-70'}`} />
                        <span className={`${sidebarOpen ? 'block' : 'hidden md:hidden'} truncate`}>Analytics</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('Deleted'); if (window.innerWidth < 768) setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'Deleted'
                            ? 'bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-md'
                            : 'text-[#555] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/10'
                            } ${!sidebarOpen ? 'justify-center' : ''}`}
                        title={!sidebarOpen ? 'Deleted' : undefined}
                    >
                        <Icons.X className={`w-5 h-5 flex-shrink-0 ${activeTab === 'Deleted' ? 'opacity-100' : 'opacity-70'}`} />
                        <span className={`${sidebarOpen ? 'block' : 'hidden md:hidden'} truncate`}>Deleted Items</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('Settings'); if (window.innerWidth < 768) setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'Settings'
                            ? 'bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-md'
                            : 'text-[#555] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/10'
                            } ${!sidebarOpen ? 'justify-center' : ''}`}
                        title={!sidebarOpen ? 'Settings' : undefined}
                    >
                        <Icons.Sun className={`w-5 h-5 flex-shrink-0 ${activeTab === 'Settings' ? 'opacity-100' : 'opacity-70'}`} />
                        <span className={`${sidebarOpen ? 'block' : 'hidden md:hidden'} truncate`}>Settings</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('ExportImport'); if (window.innerWidth < 768) setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'ExportImport'
                            ? 'bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-md'
                            : 'text-[#555] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/10'
                            } ${!sidebarOpen ? 'justify-center' : ''}`}
                        title={!sidebarOpen ? 'Export / Import' : undefined}
                    >
                        <Icons.Layers className={`w-5 h-5 flex-shrink-0 ${activeTab === 'ExportImport' ? 'opacity-100' : 'opacity-70'}`} />
                        <span className={`${sidebarOpen ? 'block' : 'hidden md:hidden'} truncate`}>Export / Import</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-[#D2D2D7] dark:border-[#38383A]">
                    <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium ${!sidebarOpen && 'md:justify-center'}`}>
                        <span className={`${sidebarOpen ? 'block' : 'hidden md:block'}`}>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative bg-white dark:bg-[#000000]">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center p-4 border-b border-[#D2D2D7] dark:border-[#38383A] sticky top-0 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-xl z-10">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 mr-2">
                        <Icons.ArrowRight className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold tracking-tight">{activeTab}</h1>
                </header>

                <div className="p-6 md:p-10 max-w-5xl mx-auto">
                    <div className="hidden md:flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">{
                            activeTab === 'ExportImport' ? 'Export / Import' :
                                activeTab === 'Deleted' ? 'Deleted Items' :
                                    activeTab
                        }</h1>
                    </div>

                    {activeTab === 'ExportImport' ? (
                        <ExportImportView token={token} />
                    ) : activeTab === 'Deleted' ? (
                        <DeletedList token={token} />
                    ) : activeTab === 'Analytics' ? (
                        <AnalyticsView token={token} />
                    ) : activeTab === 'Settings' ? (
                        <SettingsView token={token} />
                    ) : activeTab === 'ReplyDMs' ? (
                        <ReplyDMsView token={token} />
                    ) : activeTab === 'Calendly' ? (
                        <CalendlyView token={token} />
                    ) : (
                        <DataList tab={activeTab as Tab} token={token} />
                    )}
                </div>
            </main>
        </div>
    );
};

const SettingsView: React.FC<{ token: string }> = ({ token }) => {
    const settings = useQuery(api.portfolio.getSettings) || [];
    const updateSetting = useMutation(api.portfolio.updateSetting);

    const showVideos = settings.find(s => s.key === 'showVideos')?.value ?? true;

    const handleToggleVideos = async () => {
        await updateSetting({ token, key: 'showVideos', value: !showVideos });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A]">
                <h3 className="text-xl font-bold mb-6">Feature Toggles</h3>

                <div className="flex items-center justify-between p-4 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-xl border border-[#D2D2D7]/50 dark:border-[#38383A]/50">
                    <div className="space-y-1">
                        <div className="font-semibold">Show YouTube Videos</div>
                        <div className="text-sm text-[#86868B]">Toggle the visibility of the "Talks & Tutorials" grid on the home page.</div>
                    </div>
                    <button
                        onClick={handleToggleVideos}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showVideos ? 'bg-[#34C759]' : 'bg-[#D1D1D6] dark:bg-[#38383A]'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showVideos ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AnalyticsView: React.FC<{ token: string }> = ({ token }) => {
    const allData = useQuery(api.portfolio.getAllData);

    // Calculate stats
    const stats = [
        { label: 'Experiences', count: allData?.experiences.length || 0 },
        { label: 'Writings', count: allData?.writings.length || 0 },
        { label: 'Projects', count: allData?.projects.length || 0 },
        { label: 'Patents', count: allData?.patents.length || 0 },
        { label: 'Publications', count: allData?.publications.length || 0 },
        { label: 'Videos', count: allData?.videos?.length || 0 },
        { label: 'Connects Cards', count: allData?.connectsCards?.length || 0 },
    ];

    const total = stats.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A]">
                <h3 className="text-xl font-bold mb-6">Database Overview</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#F5F5F7] dark:bg-[#2C2C2E] p-4 rounded-xl border border-[#D2D2D7]/50 dark:border-[#38383A]/50">
                        <div className="text-sm text-[#86868B] font-semibold mb-1">Total Records</div>
                        <div className="text-3xl font-bold">{total}</div>
                    </div>
                    {stats.map(s => (
                        <div key={s.label} className="bg-[#F5F5F7] dark:bg-[#2C2C2E] p-4 rounded-xl border border-[#D2D2D7]/50 dark:border-[#38383A]/50">
                            <div className="text-sm text-[#86868B] font-semibold mb-1">{s.label}</div>
                            <div className="text-2xl font-bold">{s.count}</div>
                        </div>
                    ))}
                </div>

                <div className="h-[1px] bg-[#D2D2D7] dark:bg-[#38383A] w-full mb-8" />

                <h3 className="text-xl font-bold mb-4">Traffic & Web Analytics</h3>
                <p className="text-[#86868B] text-sm mb-6">
                    Real-time audience analytics, page views, and performance metrics are tracked securely via Vercel Web Analytics.
                </p>
                <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-80 transition-opacity"
                >
                    Open Vercel Dashboard
                </a>
            </div>
        </div>
    );
};

const ExportImportView: React.FC<{ token: string }> = ({ token }) => {
    const allData = useQuery(api.portfolio.getAllData);
    const importDataMut = useMutation(api.portfolio.importData);
    const [isImporting, setIsImporting] = useState(false);

    const handleExport = () => {
        if (!allData) return;
        const dataStr = JSON.stringify(allData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'portfolio-backup.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                setIsImporting(true);
                const jsonData = JSON.parse(event.target?.result as string);
                await importDataMut({ token, data: jsonData });
                alert("Import successful!");
            } catch (err) {
                alert("Error importing file. Invalid format.");
            } finally {
                setIsImporting(false);
                if (e.target) e.target.value = ''; // Reset file input
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] text-center space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Export Data</h3>
                    <p className="text-[#86868B] text-sm mb-6">Download a complete JSON backup of all your portfolio data.</p>
                    <button
                        onClick={handleExport}
                        disabled={!allData}
                        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                        Download JSON Backup
                    </button>
                </div>

                <div className="h-[1px] bg-[#D2D2D7] dark:bg-[#38383A] w-full max-w-md mx-auto" />

                <div>
                    <h3 className="text-xl font-bold mb-2">Import Data</h3>
                    <p className="text-[#86868B] text-sm mb-6">Upload a JSON backup file to append records to your database.</p>

                    <label className="relative cursor-pointer transition-opacity text-[#0071E3] font-medium border-2 border-[#0071E3] px-6 py-3 rounded-full hover:bg-[#0071E3]/10 inline-block">
                        {isImporting ? 'Importing...' : 'Upload JSON Backup'}
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={handleImport}
                            disabled={isImporting}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

const DeletedList: React.FC<{ token: string }> = ({ token }) => {
    // Collect all deleted items
    const deletedExperiences = useQuery(api.portfolio.getDeletedExperiences) || [];
    const deletedWritings = useQuery(api.portfolio.getDeletedWritings) || [];
    const deletedProjects = useQuery(api.portfolio.getDeletedProjects) || [];
    const deletedPatents = useQuery(api.portfolio.getDeletedPatents) || [];
    const deletedPublications = useQuery(api.portfolio.getDeletedPublications) || [];
    const deletedVideos = useQuery(api.portfolio.getDeletedVideos) || [];
    const deletedConnectsCards = useQuery(api.portfolio.getDeletedConnectsCards) || [];

    const restoreExp = useMutation(api.portfolio.restoreExperience);
    const hardDelExp = useMutation(api.portfolio.hardDeleteExperience);
    const restoreWrit = useMutation(api.portfolio.restoreWriting);
    const hardDelWrit = useMutation(api.portfolio.hardDeleteWriting);
    const restoreProj = useMutation(api.portfolio.restoreProject);
    const hardDelProj = useMutation(api.portfolio.hardDeleteProject);
    const restorePat = useMutation(api.portfolio.restorePatent);
    const hardDelPat = useMutation(api.portfolio.hardDeletePatent);
    const restorePub = useMutation(api.portfolio.restorePublication);
    const hardDelPub = useMutation(api.portfolio.hardDeletePublication);
    const restoreVid = useMutation(api.portfolio.restoreVideo);
    const hardDelVid = useMutation(api.portfolio.hardDeleteVideo);
    const restoreConnectsCard = useMutation(api.portfolio.restoreConnectsCard);
    const hardDelConnectsCard = useMutation(api.portfolio.hardDeleteConnectsCard);

    const [deleteClicks, setDeleteClicks] = useState<Record<string, number>>({});

    const handleRestore = async (type: string, id: string) => {
        switch (type) {
            case 'Experiences': await restoreExp({ token, id: id as any }); break;
            case 'Writings': await restoreWrit({ token, id: id as any }); break;
            case 'Projects': await restoreProj({ token, id: id as any }); break;
            case 'Patents': await restorePat({ token, id: id as any }); break;
            case 'Publications': await restorePub({ token, id: id as any }); break;
            case 'Videos': await restoreVid({ token, id: id as any }); break;
            case 'Connects Cards': await restoreConnectsCard({ token, id: id as any }); break;
        }
    };

    const handleHardDelete = async (type: string, id: string) => {
        const currentClicks = deleteClicks[id] || 0;

        if (currentClicks >= 2) {
            switch (type) {
                case 'Experiences': await hardDelExp({ token, id: id as any }); break;
                case 'Writings': await hardDelWrit({ token, id: id as any }); break;
                case 'Projects': await hardDelProj({ token, id: id as any }); break;
                case 'Patents': await hardDelPat({ token, id: id as any }); break;
                case 'Publications': await hardDelPub({ token, id: id as any }); break;
                case 'Videos': await hardDelVid({ token, id: id as any }); break;
                case 'Connects Cards': await hardDelConnectsCard({ token, id: id as any }); break;
            }
            const newClicks = { ...deleteClicks };
            delete newClicks[id];
            setDeleteClicks(newClicks);
        } else {
            setDeleteClicks({ ...deleteClicks, [id]: currentClicks + 1 });
            setTimeout(() => {
                setDeleteClicks(prev => {
                    const next = { ...prev };
                    if (next[id] === currentClicks + 1) delete next[id];
                    return next;
                });
            }, 3000);
        }
    };

    const allDeleted = [
        ...deletedExperiences.map(i => ({ ...i, type: 'Experiences' })),
        ...deletedWritings.map(i => ({ ...i, type: 'Writings' })),
        ...deletedProjects.map(i => ({ ...i, type: 'Projects' })),
        ...deletedPatents.map(i => ({ ...i, type: 'Patents' })),
        ...deletedPublications.map(i => ({ ...i, type: 'Publications' })),
        ...deletedVideos.map(i => ({ ...i, type: 'Videos' })),
        ...deletedConnectsCards.map(i => ({ ...i, type: 'Connects Cards' }))
    ].sort((a, b) => b._creationTime - a._creationTime);

    return (
        <div className="space-y-4 max-h-[660px] overflow-y-auto pr-2 custom-scrollbar">
            {allDeleted.length === 0 ? (
                <div className="text-center py-20 text-[#86868B]">Trash is empty.</div>
            ) : (
                allDeleted.map((item: any) => (
                    <div key={item._id} className="bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-red-500/20 dark:border-red-500/20 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">{item.type}</span>
                                <div className="font-semibold text-lg line-through">{item.title || item.company || item.name}</div>
                            </div>
                            <div className="text-sm text-[#86868B]">{item.period || item.year}</div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-[#D2D2D7] dark:border-[#38383A] md:border-t-0 justify-between md:justify-end">
                            <button
                                onClick={() => handleRestore(item.type, item._id)}
                                className="text-green-600 hover:text-green-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-green-600/10 transition-colors"
                            >
                                Restore
                            </button>

                            <button
                                onClick={() => handleHardDelete(item.type, item._id)}
                                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${(deleteClicks[item._id] || 0) > 0
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
                                    }`}
                            >
                                {(deleteClicks[item._id] || 0) === 0 ? 'Delete Permanently' :
                                    (deleteClicks[item._id] === 1) ? 'Click again' :
                                        'Confirm delete'}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const ReplyDMsView: React.FC<{ token: string }> = ({ token }) => {
    const messages = useQuery(api.portfolio.getMessages, { token }) || [];

    const formatTime = (ts: number | undefined) => {
        if (!ts) return '';
        return new Date(ts).toLocaleString();
    };

    const parseLocation = (locStr: string | undefined) => {
        if (!locStr) return 'Unknown Location';
        try {
            const data = JSON.parse(locStr);
            return `${data.city || 'Unknown'}, ${data.country || 'Unknown'} (IP: ${data.ip || 'Unknown'})`;
        } catch {
            return 'Invalid Location Data';
        }
    };

    const renderMessageText = (text: string | undefined) => {
        if (!text) return <span className="italic text-gray-500">No message content.</span>;
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
        const parts = text.split(emailRegex);
        return parts.map((part, i) => {
            if (part && part.match(emailRegex)) {
                return <a key={i} href={`mailto:${part}`} className="text-[#0071E3] hover:underline" onClick={(e) => e.stopPropagation()}>{part}</a>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="space-y-4 max-h-[660px] overflow-y-auto pr-2 custom-scrollbar">
            {messages.length === 0 ? (
                <div className="text-center py-20 text-[#86868B]">No messages yet.</div>
            ) : (
                messages.map((msg: any) => (
                    <div key={msg._id} className="bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] flex flex-col gap-3 group relative">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                                    {msg.platform || 'Unknown'}
                                </span>
                                <span className="text-xs text-[#86868B]">{formatTime(msg._creationTime)}</span>
                            </div>
                        </div>
                        <div className="text-sm font-medium whitespace-pre-wrap break-words text-[#1D1D1F] dark:text-[#f0f0f0]">
                            {renderMessageText(msg.message)}
                        </div>
                        <div className="pt-3 mt-1 border-t border-[#D2D2D7] dark:border-[#38383A] text-xs text-[#86868B] flex items-center gap-2">
                            {parseLocation(msg.locationData)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

