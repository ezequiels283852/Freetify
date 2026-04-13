import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useJamendoTracks } from '../hooks/useJamendoTracks';
import { Heart, Play, Clock, Sparkles } from 'lucide-react';

const Library = () => {
    const { playSong } = usePlayer();
    const { tracks, loading, error } = useJamendoTracks({ limit: 20 });

    return (
        <div className="p-10 text-white rounded-[2rem] overflow-y-auto scroll-smooth h-full">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-brand rounded-[1rem] shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                   <Sparkles size={32} className="text-white" />
                </div>
                <div>
                   <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-md text-white">Your Collection</h2>
                   <p className="text-gray-400 mt-1 font-medium text-lg">Tracks that resonate with your soul.</p>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
                </div>
            )}

            {error && (
                <div className="text-center text-red-300 py-12 glass-panel border-red-500/20 bg-red-500/10 max-w-2xl mx-auto">
                    <p className="font-bold text-lg mb-2">Sync Error</p>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && tracks.length > 0 && (
                <div className="glass-panel p-6 shadow-2xl">
                    {/* Header Row */}
                    <div className="flex text-gray-400 text-sm font-bold uppercase tracking-widest px-6 pb-4 border-b border-white/10 mb-4">
                        <div className="w-12 text-center">#</div>
                        <div className="flex-1">Title</div>
                        <div className="w-24 text-right flex items-center justify-end gap-2"><Clock size={16}/> Time</div>
                    </div>

                    <div className="space-y-3">
                        {tracks.map((song, index) => (
                            <div
                                key={song.id}
                                className="flex items-center p-4 rounded-[1rem] hover:bg-white/5 transition-all duration-300 cursor-pointer group border border-transparent hover:border-white/10 hover:shadow-lg"
                                onClick={() => playSong(song, tracks)}
                            >
                                {/* Track Number */}
                                <div className="w-12 text-center text-gray-500 font-medium group-hover:text-white transition-colors">
                                   {index + 1}
                                </div>
                                
                                {/* Cover and Info */}
                                <div className="flex flex-1 items-center gap-5">
                                    <div className="relative overflow-hidden rounded-xl">
                                        <img src={song.cover} alt={song.title} className="w-14 h-14 object-cover shadow-md group-hover:scale-105 transition-transform" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                           <Play size={20} className="text-white fill-white shadow-lg" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-lg group-hover:text-brand transition-colors line-clamp-1">{song.title}</span>
                                        <span className="text-gray-400 text-sm font-medium">{song.artist}</span>
                                    </div>
                                </div>

                                {/* Actions / Duration */}
                                <div className="flex items-center gap-6 w-32 justify-end">
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95">
                                      <Heart size={20} className="text-violet-400 hover:fill-violet-400 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]" />
                                    </button>
                                    <span className="text-gray-400 font-medium text-sm w-12 text-right">{song.duration}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
