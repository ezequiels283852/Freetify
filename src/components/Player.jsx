// Freetify Player
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Mic2, ListMusic, Maximize2, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Player = () => {
    const { currentSong, setCurrentSong, isPlaying, setIsPlaying, isLiked, toggleLike, togglePlay, queue } = usePlayer();
    const [volume, setVolume] = useState(50);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying && currentSong) {
            audioRef.current.play().catch(error => console.log("Playback failed:", error));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentSong]);

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if(audioRef.current) audioRef.current.volume = newVolume / 100;
    };

    const handleSeek = (e) => {
        const newTime = e.target.value;
        if(audioRef.current) audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleNext = () => {
        if (queue.length === 0 || !currentSong) return;
        const currentIndex = queue.findIndex(song => song.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % queue.length;
        setCurrentSong(queue[nextIndex]);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        if (queue.length === 0 || !currentSong) return;
        const currentIndex = queue.findIndex(song => song.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        setCurrentSong(queue[prevIndex]);
        setIsPlaying(true);
    };

    if (!currentSong) {
        return (
            <div className="h-28 glass-panel px-8 flex items-center justify-between text-white shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] z-50 rounded-[2rem] mx-2 mb-2 relative overflow-hidden backdrop-blur-3xl bg-white/5 border border-white/10 opacity-50">
               <span className="m-auto text-gray-400 font-bold tracking-widest">LOADING FREETIFY ENGINE...</span>
            </div>
        );
    }

    return (
        <div className="h-28 glass-panel px-8 flex items-center justify-between text-white shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] z-50 rounded-[2rem] mx-2 mb-2 relative overflow-hidden backdrop-blur-3xl bg-white/5 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-violet-900/10 pointer-events-none"></div>
            <audio
                key={currentSong.id}
                ref={audioRef}
                src={currentSong.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleNext}
            />

            {/* Left: Song Info */}
            <div className="flex items-center gap-5 w-[30%] group z-10">
                <div className="relative overflow-hidden rounded-[1.25rem] shadow-xl">
                   <img src={currentSong.cover} alt={currentSong.title} className="w-16 h-16 object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-extrabold hover:text-brand cursor-pointer transition-colors line-clamp-1">{currentSong.title}</span>
                    <span className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors font-medium">{currentSong.artist}</span>
                </div>
                <button onClick={toggleLike} className="ml-2 hover:scale-110 transition-transform active:scale-95">
                    {isLiked ? (
                        <Heart size={26} className="text-rose-500 fill-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                    ) : (
                        <Heart size={26} className="text-gray-400 hover:text-white transition-colors" />
                    )}
                </button>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center gap-3 w-[40%] z-10">
                <div className="flex items-center gap-8">
                    <Shuffle size={20} className="text-gray-400 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer transition-all" />
                    <SkipBack
                        size={28}
                        className="text-gray-300 hover:text-white cursor-pointer transition-colors fill-current"
                        onClick={handlePrev}
                    />
                    <button
                        onClick={togglePlay}
                        className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-brand hover:border-transparent transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group-btn"
                    >
                        {isPlaying ? <Pause size={26} className="text-white fill-white" /> : <Play size={26} className="text-white fill-white mx-auto translate-x-[2px]" />}
                    </button>
                    <SkipForward
                        size={28}
                        className="text-gray-300 hover:text-white cursor-pointer transition-colors fill-current"
                        onClick={handleNext}
                    />
                    <Repeat size={20} className="text-gray-400 hover:text-violet-400 hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] cursor-pointer transition-all" />
                </div>
                <div className="w-full flex items-center gap-4 text-[13px] text-gray-400 font-semibold tracking-wide">
                    <span className="w-10 text-right">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        style={{
                            background: `linear-gradient(to right, #22d3ee ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)`
                        }}
                        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full range-thumb-brand transition-all shadow-inner"
                    />
                    <span className="w-10">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume & Extras */}
            <div className="flex items-center justify-end gap-5 w-[30%] text-gray-400 z-10">
                <Mic2 size={20} className="hover:text-white cursor-pointer transition-colors" />
                <ListMusic size={20} className="hover:text-white cursor-pointer transition-colors" />
                <div className="flex items-center gap-2 w-32 group">
                    <Volume2 size={20} className="hover:text-white cursor-pointer transition-colors" />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                            background: `linear-gradient(to right, #8b5cf6 ${volume}%, rgba(255,255,255,0.1) ${volume}%)`
                        }}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 group-hover:[&::-webkit-slider-thumb]:w-3 group-hover:[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full transition-all"
                    />
                </div>
                <Maximize2 size={20} className="hover:text-white cursor-pointer transition-colors" />
            </div>
        </div>
    );
};

export default Player;
