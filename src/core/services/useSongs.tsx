import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Song } from '../../models/song.model';
import type { Song2 } from '../../models/song2.model';

const fetchDeezerUrl = 'https://deezerapi2.onrender.com/api/fetch-deezer';
const fetchJamendoUrl = 'https://deezerapi2.onrender.com/api/fetch-jamendo';
const apiUrl = 'https://deezerapi2.onrender.com/api/songs';
const apiUrl2 = 'https://deezerapi2.onrender.com/api/songs2';

/**
 * Hook to fetch songs. Mirrors Angular getSongs / getSongsWithID.
 * - If artistId is provided, triggers Deezer fetch then loads from MongoDB.
 * - If no artistId, triggers global Deezer fetch then loads all songs.
 */
export const useSongs = (artistId?: number) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        if (artistId) {
          // ✅ First trigger backend fetch, then get from DB
          await axios.get(`${fetchDeezerUrl}?artistId=${artistId}`);
          const res = await axios.get<Song[]>(`${apiUrl}?artistId=${artistId}`);
          setSongs(res.data);
        } else {
          await axios.get(fetchDeezerUrl);
          const res = await axios.get<Song[]>(apiUrl);
          setSongs(res.data);
        }
      } catch (err) {
        console.error('Error fetching songs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [artistId]);

  return { songs, loading };
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
export const updateSong = async (songId: number, updatedData: Partial<Song>): Promise<Song> => {
  const res = await axios.put<Song>(`${apiUrl}/${songId}`, updatedData);
  return res.data; // ✅ FIXED: return Song, not AxiosResponse
};

/**
 * ✅ Delete a song by ID
 */
export const deleteSong = async (songId: number): Promise<void> => {
  await axios.delete(`${apiUrl}/${songId}`); // ✅ FIXED: correct URL
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
