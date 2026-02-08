export interface Song2 {
  _id: string; // 👈 add this
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
