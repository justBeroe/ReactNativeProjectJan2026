import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Post } from '../../models';

export const usePosts = (limit: number = 5) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Post[]>(`http://localhost:3000/api/posts?limit=${limit}`)
      .then(res => setPosts(res.data))
      .finally(() => setLoading(false));
  }, [limit]);

  return { posts, loading };
};
