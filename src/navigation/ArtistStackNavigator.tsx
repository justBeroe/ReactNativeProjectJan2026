import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ArtistScreen from "../screens/ArtistsScreen";
import { SongBoard } from "../screens/SongBoard";
import { SongBoard2 } from "../screens/SongBoard2";
import { Song2 } from "../models/song2.model";
import { Song } from "../models/song.model";
import { DetailsComponentSong } from "../screens/DetailsComponentSong";


// ✅ Stack param list
export type ArtistStackParamList = {
  ArtistList: undefined; // main list of artists
  Song: { artistId: number; artistName: string }; // navigate to SongBoard
  Song2: { artistId: number; artistName: string }; // navigate to SongBoard2
  DetailsSong: { song?: Song; song2?: Song2 }; // song details
};

// ✅ Create stack with typed params
const Stack = createNativeStackNavigator<ArtistStackParamList>();

export default function ArtistStackNavigator() {
  return (
    <Stack.Navigator id="">
      {/* Main artist list */}
      <Stack.Screen
        name="ArtistList"
        component={ArtistScreen}
        options={{ title: "Artists" }}
      />
      {/* SongBoard (first type) */}
      <Stack.Screen
        name="Song"
        component={SongBoard}
        options={({ route }) => ({
          title: `Songs by ${route.params.artistName}`,
        })}
      />
      {/* SongBoard2 (alternative) */}
      <Stack.Screen
        name="Song2"
        component={SongBoard2}
        options={({ route }) => ({
          title: `Songs by ${route.params.artistName}`,
        })}
      />
        {/* Details screen for both Song and Song2 */}
      <Stack.Screen
        name="DetailsSong"
        component={DetailsComponentSong}
        options={{ title: "Song Details" }}
      />
    </Stack.Navigator>
  );
}
