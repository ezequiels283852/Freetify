import { useState, useEffect } from 'react';
import { getPopularTracks, searchTracks as searchJamendoTracks } from '../services/jamendoApi';

/**
 * Custom hook to fetch and manage Jamendo tracks
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Whether to fetch on mount (default: true)
 * @param {number} options.limit - Number of tracks to fetch (default: 20)
 * @returns {Object} { tracks, loading, error, refetch, searchTracks }
 */
export const useJamendoTracks = ({ autoFetch = true, limit = 20 } = {}) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    const fetchTracks = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getPopularTracks(limit);
            setTracks(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch tracks');
            console.error('Error in useJamendoTracks:', err);
        } finally {
            setLoading(false);
        }
    };

    const searchTracks = async (query) => {
        if (!query || query.trim() === '') {
            await fetchTracks(); // Reset to popular tracks
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await searchJamendoTracks(query, limit);
            setTracks(data);
        } catch (err) {
            setError(err.message || 'Failed to search tracks');
            console.error('Error searching tracks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchTracks();
        }
    }, [autoFetch, limit]);

    return {
        tracks,
        loading,
        error,
        refetch: fetchTracks,
        searchTracks
    };
};
