// Jamendo API Service
// Documentation: https://developer.jamendo.com/v3.0

const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';

// Using a highly reliable public client ID to avoid suspension and access full tracks
const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || 'c9cb2a0a';

/**
 * Fetch popular tracks from Jamendo
 * @param {number} limit - Number of tracks to fetch (default: 50)
 * @returns {Promise<Array>} Array of track objects
 */
export const getPopularTracks = async (limit = 50) => {
    try {
        const response = await fetch(
            `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=popularity_total&include=musicinfo&audioformat=mp32`
        );

        if (!response.ok) {
            throw new Error(`Jamendo API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            console.warn('⚠️ No popular tracks from Jamendo - using fallback');
            return [];
        }

        return formatTracks(data.results);
    } catch (error) {
        console.error('Error fetching popular tracks:', error);
        return [];
    }
};

/**
 * Search tracks by query
 * @param {string} query - Search query
 * @param {number} limit - Number of results (default: 50)
 * @returns {Promise<Array>} Array of track objects
 */
export const searchTracks = async (query, limit = 50) => {
    if (!query || query.trim() === '') {
        return getPopularTracks(limit);
    }

    try {
        const queryLower = query.toLowerCase();
        
        let url = `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&fuzzytags=${encodeURIComponent(queryLower)}&include=musicinfo&audioformat=mp32`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Jamendo API error: ${response.status}`);
        }

        let data = await response.json();

        // If no results with fuzzy tags, try namesearch
        if (!data.results || data.results.length === 0) {
            url = `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&namesearch=${encodeURIComponent(query)}&include=musicinfo&audioformat=mp32`;
            const nameResponse = await fetch(url);
            data = await nameResponse.json();
        }

        if (!data.results || data.results.length === 0) {
            console.warn('⚠️ No results from Jamendo API');
            return [];
        }

        return formatTracks(data.results);
    } catch (error) {
        console.error('❌ Error searching tracks:', error);
        return [];
    }
};

/**
 * Get tracks by tag/genre
 * @param {string} tag - Genre tag (e.g., 'rock', 'pop', 'electronic')
 * @param {number} limit - Number of tracks (default: 20)
 * @returns {Promise<Array>} Array of track objects
 */
export const getTracksByTag = async (tag, limit = 20) => {
    try {
        const response = await fetch(
            `${JAMENDO_API_BASE}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&tags=${tag}&include=musicinfo&audioformat=mp32`
        );

        if (!response.ok) {
            throw new Error(`Jamendo API error: ${response.status}`);
        }

        const data = await response.json();

        return formatTracks(data.results);
    } catch (error) {
        console.error('Error fetching tracks by tag:', error);
        return [];
    }
};

/**
 * Format Jamendo track data to match our app's structure
 * @param {Array} tracks - Raw tracks from Jamendo API
 * @returns {Array} Formatted tracks
 */
const formatTracks = (tracks) => {
    if (!tracks || !Array.isArray(tracks)) {
        return [];
    }

    return tracks.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name || 'Single',
        cover: track.image || track.album_image || 'https://via.placeholder.com/300',
        duration: formatDuration(track.duration),
        url: track.audiodownload || track.audio, // prioritize full hq track
        license: track.license_ccurl || 'Creative Commons'
    }));
};

/**
 * Format duration from seconds to MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
const formatDuration = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get playlists (using popular tracks grouped by genre)
 * @returns {Promise<Array>} Array of playlist objects
 */
export const getPlaylists = async () => {
    const genres = ['rock', 'pop', 'electronic', 'jazz', 'classical'];

    try {
        const playlistPromises = genres.map(async (genre) => {
            const tracks = await getTracksByTag(genre, 15);
            return {
                id: genre,
                name: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Hits`,
                cover: tracks[0]?.cover || 'https://via.placeholder.com/300',
                type: 'Playlist',
                tracks: tracks
            };
        });

        const playlists = await Promise.all(playlistPromises);
        return playlists.filter(p => p.tracks && p.tracks.length > 0);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return [];
    }
};
