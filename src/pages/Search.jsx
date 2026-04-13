import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useJamendoTracks } from '../hooks/useJamendoTracks';
import { Play, Music2, Clock, Info, Search as SearchIcon } from 'lucide-react';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { playSong, currentSong, isPlaying } = usePlayer();
    const { tracks, loading, searchTracks } = useJamendoTracks({ autoFetch: false });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim()) {
                searchTracks(searchTerm);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSongClick = (song) => {
        playSong(song, tracks);
    };

    const isCurrentlyPlaying = (songId) => {
        return currentSong?.id === songId && isPlaying;
    };

    return (
        <div className="p-10 text-white rounded-[2rem] overflow-y-auto scroll-smooth h-full">
            {/* Search Header */}
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Discover New Sounds</h1>
                <p className="text-gray-300 text-lg">Search the expansive Jamendo catalog for royalty-free gems.</p>
            </div>

            {/* Search Input */}
            <div className="relative mb-12 max-w-4xl mx-auto lg:mx-0">
                <input
                    type="text"
                    placeholder="What's your mood today?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-5 pl-16 pr-6 rounded-full glass-panel text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all font-medium text-lg shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                    autoFocus
                />
                <SearchIcon size={24} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-cyan-400" />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 mb-6 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    <p className="text-gray-300 font-medium text-lg tracking-wide">Searching the frequencies...</p>
                </div>
            )}

            {/* Search Results */}
            {!loading && tracks.length > 0 && searchTerm && (
                <div className="space-y-6 max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
                        <h2 className="text-3xl font-extrabold text-white">
                            Search Results
                            <span className="text-brand text-xl font-bold ml-4 bg-white/5 px-4 py-1 rounded-full">({tracks.length})</span>
                        </h2>
                        <div className="hidden md:flex items-center gap-2 text-sm text-cyan-300 bg-cyan-900/20 px-4 py-2 rounded-full border border-cyan-500/20">
                            <Info size={16} />
                            <span>Creative Commons licensed</span>
                        </div>
                    </div>

                    {/* Song List */}
                    <div className="space-y-3">
                        {tracks.map((song, index) => (
                            <div
                                key={song.id}
                                className={`flex items-center p-4 rounded-2xl cursor-pointer group transition-all duration-300 border border-transparent ${isCurrentlyPlaying(song.id) ? 'glass-panel border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'hover:glass-panel hover:border-white/10'
                                    }`}
                                onClick={() => handleSongClick(song)}
                            >
                                {/* Track Number / Play Icon */}
                                <div className="w-10 mr-4 flex items-center justify-center font-medium">
                                    {isCurrentlyPlaying(song.id) ? (
                                        <div className="flex gap-1.5 items-end h-5">
                                            <div className="w-1.5 h-full bg-cyan-400 animate-[bounce_1s_infinite]"></div>
                                            <div className="w-1.5 h-full bg-cyan-400 animate-[bounce_1s_infinite_100ms]"></div>
                                            <div className="w-1.5 h-full bg-cyan-400 animate-[bounce_1s_infinite_200ms]"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-gray-500 group-hover:hidden text-lg">
                                                {index + 1}
                                            </span>
                                            <Play
                                                size={20}
                                                className="text-cyan-400 fill-cyan-400 hidden group-hover:block drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                                            />
                                        </>
                                    )}
                                </div>

                                {/* Album Cover */}
                                <div className="relative mr-6">
                                    <img
                                        src={song.cover}
                                        alt={song.title}
                                        className="w-16 h-16 rounded-[1rem] shadow-lg object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 rounded-[1rem] ring-1 ring-white/10"></div>
                                </div>

                                {/* Song Info */}
                                <div className="flex flex-col flex-1 min-w-0 pr-4">
                                    <span className={`font-bold text-lg truncate ${isCurrentlyPlaying(song.id) ? 'text-brand' : 'text-white'
                                        }`}>
                                        {song.title}
                                    </span>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span className="truncate hover:text-white transition-colors cursor-pointer">
                                            {song.artist}
                                        </span>
                                        {song.album && (
                                            <>
                                                <span className="text-gray-600">•</span>
                                                <span className="truncate">{song.album}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="flex items-center gap-2 text-gray-400 font-medium ml-4 w-20 justify-end">
                                    <Clock size={16} />
                                    <span>{song.duration}</span>
                                </div>

                                {/* Play Button on Hover */}
                                <div className="ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-brand hover:scale-110 transition-all shadow-lg border border-white/20">
                                        <Play size={22} className="text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {!loading && searchTerm && tracks.length === 0 && (
                <div className="text-center py-24 glass-panel max-w-2xl mx-auto border-dashed border-2 border-white/20">
                    <Music2 size={72} className="text-gray-500 mx-auto mb-6 opacity-50" />
                    <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Nothing Found</h3>
                    <p className="text-gray-400 mb-2 text-lg">
                        We couldn't connect with any tracks matching "<span className="text-white">{(searchTerm)}</span>"
                    </p>
                    <p className="text-gray-500">
                        Try exploring different genres or artists.
                    </p>
                </div>
            )}

            {/* Empty State - No Search */}
            {!searchTerm && (
                <div className="text-center py-32 flex flex-col items-center justify-center">
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-brand blur-3xl opacity-20 rounded-full w-32 h-32 mx-auto"></div>
                        <Music2 size={96} className="text-gray-600 mx-auto opacity-40 relative z-10" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
                        Start Your Journey
                    </h2>
                    <p className="text-gray-400 mb-10 text-lg max-w-md mx-auto leading-relaxed">
                        Find songs, artists, and albums from the massive Jamendo royalty-free library.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                        {['electronic', 'ambient', 'lofihits', 'synthwave', 'classical', 'indie', 'jazz'].map((genre) => (
                            <button
                                key={genre}
                                onClick={() => setSearchTerm(genre)}
                                className="px-6 py-3 glass-panel hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-200 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(34,211,238,0.2)]"
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
