import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Icons } from './Icons';

interface Video {
    _id: any;
    title: string;
    url: string;
    description: string;
    order: number;
}

export const VideosSection: React.FC = () => {
    const liveVideos = useQuery(api.portfolio.getVideos);
    const settings = useQuery(api.portfolio.getSettings) || [];
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const showVideos = settings.find(s => s.key === 'showVideos')?.value ?? true;

    const defaultVideos: Video[] = [
        {
            _id: 'default-1',
            title: 'Build AI Agents with Groq',
            url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
            description: 'A complete tutorial on building blazing fast LLM agents.',
            order: 1
        }
    ];

    const videos: Video[] = (liveVideos && liveVideos.length > 0 ? liveVideos : defaultVideos) as Video[];

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2] && match[2].length === 11) ? match[2] : null;
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        if (selectedVideo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [selectedVideo]);

    if (liveVideos === undefined) {
        return <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black/20 dark:border-white/20"></div>
        </div>;
    }

    return (
        <section id="videos" className={`py-24 bg-transparent relative overflow-hidden ${!showVideos ? 'pb-12' : ''}`}>
            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                <div className="flex flex-col gap-12">
                    {/* Header */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0] tracking-tight">
                                Talks & Tutorials
                            </h2>
                        </div>

                        {/* Featured TedX Wide Section */}
                        <div className="mb-16 group relative w-full aspect-[21/9] md:aspect-[25/9] rounded-2xl overflow-hidden shadow-xl border border-[#e5e5e5] dark:border-zinc-800 transition-all duration-500">
                            <img
                                src="/tedx_vibe.png"
                                alt="TedX Speaker"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                            />
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12" />

                            {/* Text Content */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 space-y-2 md:space-y-4">
                                <h3 className="text-3xl md:text-6xl font-black text-white tracking-tight uppercase">
                                    Ted<span className="text-[#FF0000]">X</span>
                                </h3>
                                <p className="text-base md:text-2xl text-white/90 font-medium max-w-2xl leading-relaxed">
                                    Upcoming Speaker
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Videos Grid */}
                    {showVideos && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.map((video) => {
                                const videoId = getYouTubeId(video.url);
                                if (!videoId) return null;

                                return (
                                    <div
                                        key={video._id?.toString()}
                                        className="group cursor-pointer flex flex-col space-y-4"
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-800 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors">
                                            <img
                                                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                                alt={video.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                                    <Icons.Play className="w-5 h-5 text-black translate-x-0.5" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-bold text-lg text-[#1a1a1a] dark:text-[#f0f0f0] group-hover:underline decoration-1 underline-offset-4 line-clamp-2">
                                                {video.title}
                                            </h3>
                                            <p className="text-sm text-[#555] dark:text-[#a0a0a0] line-clamp-2 leading-relaxed">
                                                {video.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedVideo(null)} />
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                            <Icons.X className="w-6 h-6" />
                        </button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="bg-black"
                        ></iframe>
                    </div>
                </div>
            )}
        </section>
    );
};
