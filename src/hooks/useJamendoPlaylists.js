import { useState, useEffect } from 'react';
import { getPlaylists } from '../services/jamendoApi';

export const useJamendoPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            const data = await getPlaylists();
            setPlaylists(data);
            setLoading(false);
        };
        fetchPlaylists();
    }, []);

    return { playlists, loading };
};
