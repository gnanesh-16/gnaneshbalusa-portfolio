import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Icons } from '../components/Icons';

type Tab = 'Experiences' | 'Writings' | 'Projects' | 'Patents' | 'Publications' | 'Videos' | 'Connects Cards' | 'Deleted' | 'ExportImport' | 'Analytics' | 'Settings' | 'ReplyDMs';

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

