import { User } from "./user.model";

export interface Song {
  _id: number;
  id: number;
  title: string;
  preview: string;
  artist: {
    id: number;
    name: string;
    picture: string;
  };
  album: {
    id: number;
    title: string;
    cover: string;
  };
}
