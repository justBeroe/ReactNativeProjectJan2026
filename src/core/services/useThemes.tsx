import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Theme } from '../../models';

export const useThemes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // axios.get<Theme[]>('http://localhost:4000/api/songs')
    axios.get<Theme[]>('https://deezerapi2.onrender.com/api/songs')
      .then(res => setThemes(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { themes, loading };
};

export const createTheme = async (themeName: string, postText: string) =>
  axios.post('https://deezerapi2.onrender.com/api/songs/themes', { themeName, postText }, { withCredentials: true });
