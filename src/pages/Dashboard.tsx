import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Icons } from '../components/Icons';

type Tab = 'Experiences' | 'Writings' | 'Projects' | 'Patents' | 'Publications';

// --- Generic Data List Component ---
const DataList: React.FC<{ tab: Tab; token: string }> = ({ tab, token }) => {
    // Determine which API methods to use based on the tab
    let getQuery: any, addMut: any, delMut: any;
    let fields: { name: string, label: string, type?: string }[] = [];

    switch (tab) {
        case 'Experiences':
            getQuery = api.portfolio.getExperiences;
            addMut = api.portfolio.addExperience;
            delMut = api.portfolio.deleteExperience;
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
            addMut = api.portfolio.addWriting;
            delMut = api.portfolio.deleteWriting;
            fields = [
                { name: 'year', label: 'Year' },
                { name: 'title', label: 'Title' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
        case 'Projects':
            getQuery = api.portfolio.getProjects;
            addMut = api.portfolio.addProject;
            delMut = api.portfolio.deleteProject;
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
            addMut = api.portfolio.addPatent;
            delMut = api.portfolio.deletePatent;
            fields = [
                { name: 'title', label: 'Title' },
                { name: 'year', label: 'Year' },
                { name: 'description', label: 'Description' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
        case 'Publications':
            getQuery = api.portfolio.getPublications;
            addMut = api.portfolio.addPublication;
            delMut = api.portfolio.deletePublication;
            fields = [
                { name: 'title', label: 'Title' },
                { name: 'year', label: 'Year' },
                { name: 'description', label: 'Description' },
                { name: 'order', label: 'Order', type: 'number' }
            ];
            break;
    }

    const items = useQuery(getQuery) || [];
    const addItem = useMutation(addMut);
    const deleteItem = useMutation(delMut);

    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addItem({ token, ...formData });
            setFormData({});
            setIsAdding(false);
        } catch (error) {
            alert('Error adding item. Ensure all fields are filled.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            await deleteItem({ token, id: id as any });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#F5F5F7] dark:bg-[#1C1C1E] p-4 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A]">
                <h3 className="font-semibold text-lg">{tab} List</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-sm font-medium transition-colors"
                >
                    {isAdding ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h4 className="font-semibold mb-4">Add new {tab.slice(0, -1)}</h4>

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
                                        type={f.type || 'text'}
                                        value={formData[f.name] || ''}
                                        onChange={e => setFormData({ ...formData, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                                        className="w-full h-12 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                                        required
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-80 transition-opacity">
                        Save Item
                    </button>
                </form>
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
                            <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-[#D2D2D7] dark:border-[#38383A] md:border-t-0 justify-between md:justify-end">
                                <span className="text-xs text-[#86868B] font-mono bg-[#F5F5F7] dark:bg-[#2C2C2E] px-2 py-1 rounded-md">Order: {item.order}</span>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-500 hover:text-red-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    Delete
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
                    {(['Experiences', 'Writings', 'Projects', 'Patents', 'Publications'] as Tab[]).map((tab) => {
                        let IconComponent;
                        switch (tab) {
                            case 'Experiences': IconComponent = Icons.Briefcase; break;
                            case 'Writings': IconComponent = Icons.PenTool; break;
                            case 'Projects': IconComponent = Icons.Code; break;
                            case 'Patents': IconComponent = Icons.Award; break;
                            case 'Publications': IconComponent = Icons.BookOpen; break;
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
                        <h1 className="text-3xl font-bold tracking-tight">{activeTab}</h1>
                    </div>

                    <DataList tab={activeTab} token={token} />
                </div>
            </main>
        </div>
    );
};
