import React, { useState, useEffect } from 'react';
import { Play, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { useJamendoTracks } from '../hooks/useJamendoTracks';
import { useJamendoPlaylists } from '../hooks/useJamendoPlaylists';
import { usePlayer } from '../context/PlayerContext';
import DeveloperModal from './DeveloperModal';

const MainContent = () => {
    const { playlists, loading: loadingPlaylists } = useJamendoPlaylists();
    const { tracks, loading, error } = useJamendoTracks({ limit: 50 });
    const { playSong } = usePlayer();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    const openModal = (title) => {
        setModalTitle(title);
        setIsModalOpen(true);
    };

    const handleSongClick = (song) => {
        playSong(song, tracks);
    };

    return (
        <div className="flex-1 overflow-y-auto relative scroll-smooth rounded-[2rem]">
            {/* Header */}
            <div className="sticky top-0 bg-black/10 backdrop-blur-xl px-10 py-5 flex items-center justify-end z-20 transition-all border-b border-white/5 shadow-sm">
                <div className="flex items-center gap-8">
                    <button 
                        onClick={() => openModal('Crear cuenta')}
                        className="text-gray-300 font-semibold tracking-wide hover:text-white transition-colors text-lg"
                    >
                        Sign up
                    </button>
                    <button 
                        onClick={() => openModal('Iniciar sesión')}
                        className="bg-brand text-white font-bold px-10 py-3 rounded-full hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all transform hover:-translate-y-1 text-lg"
                    >
                        Log in
                    </button>
                </div>
            </div>

            <DeveloperModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={modalTitle} 
            />

            <div className="p-10 pb-32">
                {/* Hero Section */}
                <div className="relative mb-14 rounded-[2.5rem] overflow-hidden bg-brand p-12 flex items-center justify-between shadow-2xl">
                    <div className="relative z-10 w-full lg:w-2/3">
                        <div className="flex items-center gap-2 mb-3 text-white/90">
                            <Sparkles size={22} className="text-cyan-200" />
                            <span className="uppercase tracking-[0.2em] text-sm font-bold text-cyan-50">Featured Hub</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">Elevate Your Audio <br/>Experience</h1>
                        <p className="text-xl text-white/90 mb-10 font-light max-w-xl leading-relaxed">Explore a world of high-fidelity sound, tailored perfectly to your unique taste. Free your music completely.</p>
                        <button className="bg-white text-violet-600 font-bold px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform flex items-center gap-3 text-lg"
                                onClick={() => {
                                   if(tracks && tracks.length > 0) {
                                       playSong(tracks[0], tracks);
                                   }
                                }}
                        >
                           Start Listening <Play size={20} className="fill-violet-600" />
                        </button>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-black/10 backdrop-blur-[2px] -skew-x-12 translate-x-32 hidden lg:block"></div>
                </div>

                {/* Jamendo Dynamic Playlists */}
                <div className="mb-14">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                           <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Tailored for You</h2>
                           <p className="text-gray-400 font-medium text-lg">Daily mixes and personalized picks right from the API.</p>
                        </div>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 text-sm font-bold hover:opacity-80 cursor-pointer tracking-wider uppercase transition-opacity">See all</span>
                    </div>

                    {loadingPlaylists ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="animate-spin text-cyan-400" size={32} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                            {playlists.map((playlist) => (
                                <div key={playlist.id} 
                                     className="glass-panel p-5 hover:bg-white/10 transition-all duration-300 cursor-pointer group hover:-translate-y-2 border-white/10"
                                     onClick={() => {
                                        if(playlist.tracks && playlist.tracks.length > 0) {
                                            playSong(playlist.tracks[0], playlist.tracks);
                                        }
                                     }}
                                >
                                    <div className="relative mb-5 overflow-hidden rounded-[1.25rem]">
                                        <img src={playlist.cover} alt={playlist.name} className="w-full aspect-square object-cover shadow-lg group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-4 right-4 w-14 h-14 bg-brand rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.6)] z-10 hover:scale-110">
                                            <Play size={24} className="text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-1 truncate">{playlist.name}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-2 font-light">Curated exclusively for you by Freetify.</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trending Tracks Section - Jamendo API  */}
                <div className="mb-8">
                    <div className="flex items-end justify-between mb-8">
                         <div className="flex items-center gap-4">
                           <TrendingUp className="text-cyan-400 mb-1" size={36} />
                           <div>
                              <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Global Hits</h2>
                              <p className="text-gray-400 font-medium text-lg">The hottest trending tracks from Jamendo API.</p>
                           </div>
                         </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-300 py-10 glass-panel border border-red-500/20 bg-red-500/5">
                            <p className="text-lg">Oops! Something went wrong: {error}</p>
                        </div>
                    )}

                    {!loading && !error && tracks.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                            {tracks.map((song) => (
                                <div
                                    key={song.id}
                                    className="glass-panel p-5 hover:bg-white/10 transition-all duration-300 cursor-pointer group hover:-translate-y-2 border-white/10"
                                    onClick={() => handleSongClick(song)}
                                >
                                    <div className="relative mb-5 overflow-hidden rounded-[1.25rem]">
                                        <img src={song.cover} alt={song.title} className="w-full aspect-square object-cover shadow-lg group-hover:scale-110 transition-transform duration-500" />
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-4 right-4 w-14 h-14 bg-brand rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-[0_0_20px_rgba(139,92,246,0.6)] duration-300 z-10 hover:scale-110">
                                            <Play size={24} className="text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-1 truncate">{song.title}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-1 font-light opacity-80">{song.artist}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainContent;
