import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Icons } from './Icons';

interface Video {
    _id?: any;
    title: string;
    url: string;
    description: string;
    order: number;
}

export const VideosSection: React.FC = () => {
    const liveVideos = useQuery(api.portfolio.getVideos);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const defaultVideos: Video[] = [
        {
            _id: undefined,
            title: 'Build AI Agents with Groq',
            url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
            description: 'A complete tutorial on building blazing fast LLM agents.',
            order: 1
        }
    ];

    const videos: Video[] = (liveVideos && liveVideos.length > 0 ? liveVideos : defaultVideos) as Video[];

    console.log("VideosSection Render:", {
        liveVideosStatus: liveVideos === undefined ? "loading" : "ready",
        liveVideosCount: liveVideos?.length,
        usingDefault: !(liveVideos && liveVideos.length > 0)
    });

    const getYouTubeId = (url: any) => {
        if (!url || typeof url !== 'string') return null;
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2] && match[2].length === 11) ? match[2] : null;
        } catch (e) {
            console.error("Error parsing YouTube ID:", e);
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

    if (!videos || !Array.isArray(videos)) return null;

    return (
        <>
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="border-t border-[#e5e5e5] dark:border-zinc-800"></div>
            </div>

            <section id="videos" className="py-24">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="flex items-center gap-3 mb-10">
                        <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-[#f0f0f0]">Talks & Tutorials</h2>
                    </div>

                    {/* Featured Section: The "Wide Thing" */}
                    <div className="mb-16 group relative w-full aspect-[21/9] md:aspect-[25/9] rounded-2xl overflow-hidden shadow-xl border border-[#e5e5e5] dark:border-zinc-800 transition-all duration-500">
                        <img
                            src="/tedx_vibe.png"
                            alt="TEDx Speaker"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF0000] text-white text-xs font-bold uppercase tracking-wider">
                                    Featured
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
                                    Ted<span className="text-[#FF0000]">X</span>
                                </h3>
                                <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl leading-relaxed">
                                    Going as a speaker at TedX
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video, index) => {
                            if (!video) return null;
                            const videoId = getYouTubeId(video.url);
                            const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

                            return (
                                <div
                                    key={video._id?.toString() || index}
                                    onClick={() => videoId && setSelectedVideo(videoId)}
                                    className="group cursor-pointer flex flex-col space-y-4"
                                >
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-800 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors">
                                        {thumbnailUrl ? (
                                            <img
                                                src={thumbnailUrl}
                                                alt={video.title || 'Video thumbnail'}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    // Fallback if maxresdefault fails
                                                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                <Icons.YouTube className="w-12 h-12 opacity-50" />
                                            </div>
                                        )}

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
                                        {video.description && (
                                            <p className="text-sm text-[#555] dark:text-[#a0a0a0] line-clamp-2 leading-relaxed">
                                                {video.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedVideo(null)}
                    />

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
                            src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="bg-black relative z-0"
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
};
