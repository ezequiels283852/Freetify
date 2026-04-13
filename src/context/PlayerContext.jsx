import React, { createContext, useState, useContext, useEffect } from 'react';
import { getPopularTracks } from '../services/jamendoApi';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // Initial load: Fetch some popular tracks to initialize the player correctly
    useEffect(() => {
        let isMounted = true;
        const loadInitial = async () => {
             const tracks = await getPopularTracks(50);
             if (isMounted && tracks && tracks.length > 0) {
                 setCurrentSong(tracks[0]);
                 setQueue(tracks);
             }
        };
        loadInitial();
        return () => { isMounted = false; };
    }, []);

    const playSong = (song, currentQueue = []) => {
        if (currentSong?.id === song.id) {
            togglePlay();
        } else {
            setCurrentSong(song);
            if (currentQueue && currentQueue.length > 0) {
                setQueue(currentQueue);
            }
            setIsPlaying(true);
            setIsLiked(false);
        }
    };

    const pauseSong = () => {
        setIsPlaying(false);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    return (
        <PlayerContext.Provider value={{
            currentSong,
            setCurrentSong,
            isPlaying,
            setIsPlaying,
            isLiked,
            setIsLiked,
            queue,
            setQueue,
            playSong,
            pauseSong,
            togglePlay,
            toggleLike
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
