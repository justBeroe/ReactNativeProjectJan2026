// navigation/types.ts

// ❌ Root stack should ONLY contain the auth flow
export type RootStackParamList = {
  Login: undefined;
};

// ✅ Home stack contains all screens inside HomeNavigator
export type HomeStackParamList = {
  Home: undefined;
  Category: { categoryId: string };
  Details: { itemId: string };
  Song: undefined;
  Song2: undefined;
  Radio: undefined;
};
