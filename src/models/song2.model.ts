export interface Song2 {
  id: number;
  title: string;
  preview: string;
  artist: {
    id: number;
    name: string;
    picture: string;
  };
  album: string;
}
