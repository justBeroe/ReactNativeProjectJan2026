// navigation/types.ts

// ❌ Root stack should ONLY contain the auth flow
export type RootStackParamList = {
  Login: undefined;
  ArtistScreen: undefined; // no params for artist list
  
};

// ✅ Home stack contains all screens inside HomeNavigator
export type HomeStackParamList = {
  Home: undefined;
  Category: { categoryId: string };
  Details: { itemId: string };
  Song: { artistId: number; artistName: string };
  Song2: { artistId: number; artistName: string };
  Radio: undefined;
  ArtistScreen: undefined; // ✅ add this
};
