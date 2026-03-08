import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Icons } from '../components/Icons';

const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const COURSE_CATEGORIES = ['AI / ML', 'Deep Learning', 'Web Development', 'Data Science', 'Computer Vision', 'NLP', 'Robotics', 'Mathematics', 'Research', 'Other'];

const courseFields: { name: string; label: string; type?: string; textarea?: boolean; required?: boolean; options?: string[] }[] = [
    { name: 'title', label: 'Course Title', required: true },
    { name: 'description', label: 'Description', textarea: true, required: true },
    { name: 'instructor', label: 'Instructor Name' },
    { name: 'category', label: 'Category', options: COURSE_CATEGORIES },
    { name: 'level', label: 'Level', options: COURSE_LEVELS },
    { name: 'duration', label: 'Duration (e.g. "8 weeks", "12 hours")' },
    { name: 'prerequisites', label: 'Prerequisites', textarea: true },
    { name: 'sessions', label: 'Sessions / Modules (one per line)', textarea: true },
    { name: 'thumbnail', label: 'Thumbnail Image URL' },
    { name: 'link', label: 'Course Link / URL (optional)' },
    { name: 'status', label: 'Status', options: ['published', 'draft'] },
    { name: 'order', label: 'Display Order', type: 'number', required: true },
];

const inputClass =
    'w-full bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC] text-[#1D1D1F] dark:text-[#F5F5F7]';

export const CourseAdding: React.FC = () => {
    const navigate = useNavigate();
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    useEffect(() => {
        if (!token) navigate('/dashboard/login');
    }, [token, navigate]);

    const courses = useQuery(api.portfolio.getCourses) ?? [];
    const saveCourse = useMutation(api.portfolio.saveCourse);
    const deleteCourse = useMutation(api.portfolio.softDeleteCourse);

    const [formData, setFormData] = useState<Record<string, any>>({ status: 'published', order: 1 });
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteClicks, setDeleteClicks] = useState<Record<string, number>>({});
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    if (!token) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // strip Convex internals
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _id, _creationTime, isDeleted, ...cleanData } = formData as Record<string, any>;
            await saveCourse({
                token: token!,
                id: editingId ? (editingId as any) : undefined,
                title: cleanData.title ?? '',
                description: cleanData.description ?? '',
                thumbnail: cleanData.thumbnail || undefined,
                instructor: cleanData.instructor || undefined,
                level: cleanData.level || undefined,
                category: cleanData.category || undefined,
                sessions: cleanData.sessions || undefined,
                duration: cleanData.duration || undefined,
                prerequisites: cleanData.prerequisites || undefined,
                link: cleanData.link || undefined,
                status: cleanData.status || 'published',
                order: Number(cleanData.order) || 1,
            });
            setFormData({ status: 'published', order: 1 });
            setIsAdding(false);
            setEditingId(null);
        } catch (err) {
            alert('Error saving course. Ensure required fields are filled.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item: any) => {
        setFormData(item);
        setEditingId(item._id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setFormData({ status: 'published', order: 1 });
        setIsAdding(false);
        setEditingId(null);
        setDeleteClicks({});
    };

    const handleDeleteClick = async (id: string) => {
        const cur = deleteClicks[id] || 0;
        if (cur >= 2) {
            await deleteCourse({ token: token!, id: id as any });
            const next = { ...deleteClicks };
            delete next[id];
            setDeleteClicks(next);
        } else {
            setDeleteClicks({ ...deleteClicks, [id]: cur + 1 });
            setTimeout(() => {
                setDeleteClicks(prev => {
                    const n = { ...prev };
                    if (n[id] === cur + 1) delete n[id];
                    return n;
                });
            }, 3000);
        }
    };

    const filtered = courses.filter((c: any) =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] font-[Inter,sans-serif]">
            {/* Top Bar */}
            <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-[#D2D2D7] dark:border-[#38383A]">
                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-sm font-medium text-[#555] dark:text-[#a0a0a0] hover:text-[#1D1D1F] dark:hover:text-white transition-colors"
                    >
                        <Icons.ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <span className="text-[#D2D2D7] dark:text-[#38383A]">/</span>
                    <span className="text-sm font-semibold">Courses</span>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/coursesbygnanesh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors"
                    >
                        <Icons.Eye className="w-4 h-4" />
                        View Public Page
                    </a>
                    <button
                        onClick={() => {
                            setFormData({ status: 'published', order: Math.max(...courses.map((c: any) => c.order || 0), 0) + 1 });
                            setIsAdding(true);
                            setEditingId(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-sm font-medium transition-colors"
                    >
                        + Add Course
                    </button>
                </div>
            </header>

            <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Courses Manager</h1>
                    <p className="text-sm text-[#86868B] mt-1">
                        Add, edit, and manage courses that appear on{' '}
                        <a href="/coursesbygnanesh" className="text-[#0071E3] hover:underline" target="_blank" rel="noopener noreferrer">/coursesbygnanesh</a>
                    </p>
                </div>

                {/* Add / Edit Form */}
                {isAdding && (
                    <form
                        onSubmit={handleSave}
                        className="bg-white dark:bg-[#1C1C1E] p-8 rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] space-y-6 animate-in fade-in slide-in-from-top-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">{editingId ? 'Edit Course' : 'Add New Course'}</h2>
                            <button type="button" onClick={handleCancel} className="text-sm text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                                Cancel
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {courseFields.map(f => (
                                <div key={f.name} className={f.textarea ? 'md:col-span-2' : ''}>
                                    <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1.5 pl-1">
                                        {f.label}
                                        {f.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    {f.textarea ? (
                                        <textarea
                                            value={formData[f.name] || ''}
                                            onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                                            className={inputClass}
                                            rows={f.name === 'sessions' ? 5 : 3}
                                            required={f.required}
                                            placeholder={f.name === 'sessions' ? 'Session 1: Introduction\nSession 2: Core Concepts\n...' : ''}
                                        />
                                    ) : f.options ? (
                                        <select
                                            value={formData[f.name] || ''}
                                            onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                                            className={inputClass}
                                        >
                                            <option value="">— Select —</option>
                                            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type={f.type || 'text'}
                                            value={formData[f.name] ?? ''}
                                            onChange={e => setFormData({ ...formData, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                                            className={inputClass}
                                            required={f.required}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Thumbnail Preview */}
                        {formData.thumbnail && (
                            <div className="mt-2">
                                <p className="text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2 pl-1">Thumbnail Preview</p>
                                <img
                                    src={formData.thumbnail}
                                    alt="Thumbnail preview"
                                    className="h-40 w-full max-w-sm object-cover rounded-xl border border-[#D2D2D7] dark:border-[#38383A]"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                            >
                                {saving ? 'Saving…' : editingId ? 'Update Course' : 'Save Course'}
                            </button>
                            <button type="button" onClick={handleCancel} className="px-6 py-2.5 text-sm font-medium text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Search + List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold">
                            All Courses <span className="text-[#86868B] font-normal text-base">({courses.length})</span>
                        </h2>
                        <input
                            type="text"
                            placeholder="Search courses…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-64 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        />
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-20 text-[#86868B] bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#D2D2D7] dark:border-[#38383A]">
                            {search ? 'No courses match your search.' : 'No courses yet. Click "+ Add Course" to create one.'}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((item: any) => (
                                <div
                                    key={item._id}
                                    className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-[#D2D2D7] dark:border-[#38383A] flex gap-4 overflow-hidden group"
                                >
                                    {/* Thumbnail */}
                                    {item.thumbnail ? (
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-28 h-full object-cover flex-shrink-0 min-h-[90px]"
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-28 flex-shrink-0 bg-gradient-to-br from-[#1a1a1a] to-[#333] flex items-center justify-center min-h-[90px]">
                                            <Icons.BookOpen className="w-7 h-7 text-white/30" />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-semibold text-base">{item.title}</span>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.status === 'published' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'}`}>
                                                    {item.status || 'published'}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-xs text-[#86868B]">
                                                {item.category && <span>{item.category}</span>}
                                                {item.level && <span>· {item.level}</span>}
                                                {item.duration && <span>· {item.duration}</span>}
                                                {item.instructor && <span>· by {item.instructor}</span>}
                                            </div>
                                            <p className="text-sm text-[#555] dark:text-[#a0a0a0] line-clamp-1">{item.description}</p>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xs text-[#86868B] font-mono bg-[#F5F5F7] dark:bg-[#2C2C2E] px-2 py-1 rounded-md">#{item.order}</span>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-[#0071E3] hover:text-[#0077ED] text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-[#0071E3]/10 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(item._id)}
                                                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${(deleteClicks[item._id] || 0) > 0 ? 'bg-red-500 text-white hover:bg-red-600' : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'}`}
                                            >
                                                {(deleteClicks[item._id] || 0) === 0 ? 'Delete' : (deleteClicks[item._id] === 1) ? 'Click again' : 'Confirm'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
