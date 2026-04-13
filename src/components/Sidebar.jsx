import React from 'react';
import { Home, Search, Library, PlayCircle, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useJamendoPlaylists } from '../hooks/useJamendoPlaylists';
import { usePlayer } from '../context/PlayerContext';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const { playlists, loading } = useJamendoPlaylists();
    const { playSong } = usePlayer();

    return (
        <div className="w-72 h-full flex flex-col glass-panel p-6 text-gray-400 shadow-[20px_0_30px_-15px_rgba(0,0,0,0.5)]">
            {/* Logo */}
            <div className="mb-10 mt-2 flex items-center justify-start px-2">
                <img src="/logo.png" alt="Freetify" className="h-10 w-auto drop-shadow-xl" />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-3 mb-10">
                <Link to="/" className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive('/') ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10' : 'hover:bg-white/5 hover:text-white'}`}>
                    <Home size={22} className={isActive('/') ? 'text-cyan-400' : ''} />
                    <span className="font-semibold tracking-wide text-lg">Home</span>
                </Link>
                <Link to="/search" className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive('/search') ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10' : 'hover:bg-white/5 hover:text-white'}`}>
                    <Search size={22} className={isActive('/search') ? 'text-cyan-400' : ''} />
                    <span className="font-semibold tracking-wide text-lg">Discover</span>
                </Link>
                <Link to="/library" className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive('/library') ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10' : 'hover:bg-white/5 hover:text-white'}`}>
                    <Library size={22} className={isActive('/library') ? 'text-violet-400' : ''} />
                    <span className="font-semibold tracking-wide text-lg">My Library</span>
                </Link>
            </nav>

            {/* Playlists */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-5 text-gray-500 pl-4">Your Playlists</h2>
                
                {loading ? (
                    <div className="flex items-center justify-center py-6">
                       <Loader2 className="animate-spin text-cyan-400" size={24} />
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {playlists.map((pl) => (
                            <li 
                                key={pl.id} 
                                className="flex items-center gap-4 hover:bg-white/5 p-2.5 rounded-2xl transition-all duration-300 cursor-pointer group"
                                onClick={() => {
                                    if(pl.tracks && pl.tracks.length > 0) {
                                        playSong(pl.tracks[0], pl.tracks);
                                    }
                                }}
                            >
                                <div className="relative">
                                    <img src={pl.cover} alt={pl.name} className="w-12 h-12 rounded-xl object-cover shadow-md group-hover:opacity-60 transition-opacity" />
                                    <PlayCircle size={24} className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] scale-75 group-hover:scale-100 duration-300" />
                                </div>
                                <div className="flex flex-col">
                                   <span className="truncate font-medium text-[15px] group-hover:text-white transition-colors">{pl.name}</span>
                                   <span className="text-xs opacity-60">Freetify Daily</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
