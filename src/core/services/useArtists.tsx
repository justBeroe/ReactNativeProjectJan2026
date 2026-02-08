import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Artist } from '../../models/artist.model';

export const useArtists = () => {
  const [deezerArtists, setDeezerArtists] = useState<Artist[]>([]);
  const [jamendoArtists, setJamendoArtists] = useState<Artist[]>([]);

  useEffect(() => {
    axios.get<Artist[]>('http://localhost:4000/api/deezer-artists').then(res => setDeezerArtists(res.data));
    axios.get<Artist[]>('http://localhost:4000/api/jamen-artists').then(res => setJamendoArtists(res.data));
  }, []);

  return { deezerArtists, jamendoArtists };
};
