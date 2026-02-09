import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Song } from '../../models/song.model';
import type { Song2 } from '../../models/song2.model';

const fetchDeezerUrl = 'http://62.73.121.31:4000/api/fetch-deezer';
const fetchJamendoUrl = 'http://62.73.121.31:4000/api/fetch-jamendo';
const apiUrl = 'http://62.73.121.31:4000/api/songs';
const apiUrl2 = 'http://62.73.121.31:4000/api/songs2';

/**
 * Hook to fetch songs.
 * - If artistId is provided → fetch Deezer for that artist, then load from DB.
 * - If no artistId → fetch global Deezer, then load all songs.
 */
export const useSongs = (artistId?: number) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ⭐ FIX: fetchSongs must be defined OUTSIDE useEffect
  const fetchSongs = async () => {
    try {
      setLoading(true);

      if (artistId) {
        // Trigger backend fetch, then load from MongoDB
        await axios.get(`${fetchDeezerUrl}?artistId=${artistId}`);
        const res = await axios.get<Song[]>(`${apiUrl}?artistId=${artistId}`);
        setSongs(res.data);
      } else {
        await axios.get(fetchDeezerUrl);
        const res = await axios.get<Song[]>(apiUrl);
        setSongs(res.data);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching songs', err);
      setError('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  // Load on mount + when artistId changes
  useEffect(() => {
    fetchSongs();
  }, [artistId]);

  // ⭐ FIX: Proper return object
  return {
    songs,
    loading,
    error,
    refetch: fetchSongs,
  };
};

/**
 * ✅ Only fetch from MongoDB (no external refresh)
 */
export const getSongsWithIDMongoDB = async (artistId: number): Promise<Song[]> => {
  const res = await axios.get<Song[]>(`${apiUrl}?artistId=${artistId}`);
  return res.data;
};

/**
 * ✅ Fetch fresh data from Jamendo, then return songs from MongoDB
 */
export const getSongsWithID2 = async (artistId: number): Promise<Song2[]> => {
  await axios.get(`${fetchJamendoUrl}?artistId=${artistId}`);
  const res = await axios.get<Song2[]>(`${apiUrl2}?artistId=${artistId}`);
  return res.data;
};

/**
 * ✅ Update a song by ID
 */
export const updateSong = async (
  songId: number,
  updatedData: Partial<Song>
): Promise<Song> => {
  const res = await axios.put<Song>(`${apiUrl}/${songId}`, updatedData);
  return res.data;
};

/**
 * ✅ Delete a song by ID
 */
export const deleteSong = async (songId: number): Promise<void> => {
  await axios.delete(`${apiUrl}/${songId}`);
};

/**
 * ✅ Create a new song
 */
export const createSong = async (title: string, id: number): Promise<Song> => {
  const res = await axios.post<Song>(
    `${apiUrl}/themes`,
    { title, id },
    { withCredentials: true }
  );
  return res.data;
};
