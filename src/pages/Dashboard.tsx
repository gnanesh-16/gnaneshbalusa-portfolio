import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Icons } from '../components/Icons';

type Tab = 'Experiences' | 'Writings' | 'Projects' | 'Patents' | 'Publications' | 'Deleted' | 'ExportImport';

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
                    onClick={isAdding ? handleCancel : () => setIsAdding(true)}
                    className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-sm font-medium transition-colors"
                >
                    {isAdding ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSave} className="bg-white dark:bg-[#1C1C1E] p-6 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h4 className="font-semibold mb-4">{editingId ? 'Edit' : 'Add new'} {tab.slice(0, -1)}</h4>

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

                    <button type="submit" className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-80 transition-opacity mt-2">
                        {editingId ? 'Update Item' : 'Save Item'}
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

                    <div className="h-[1px] bg-[#D2D2D7] dark:bg-[#38383A] my-4" />

                    {/* Settings Tabs */}
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
                    ) : (
                        <DataList tab={activeTab as Tab} token={token} />
                    )}
                </div>
            </main>
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

    const [deleteClicks, setDeleteClicks] = useState<Record<string, number>>({});

    const handleRestore = async (type: string, id: string) => {
        switch (type) {
            case 'Experiences': await restoreExp({ token, id: id as any }); break;
            case 'Writings': await restoreWrit({ token, id: id as any }); break;
            case 'Projects': await restoreProj({ token, id: id as any }); break;
            case 'Patents': await restorePat({ token, id: id as any }); break;
            case 'Publications': await restorePub({ token, id: id as any }); break;
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
        ...deletedPublications.map(i => ({ ...i, type: 'Publications' }))
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

