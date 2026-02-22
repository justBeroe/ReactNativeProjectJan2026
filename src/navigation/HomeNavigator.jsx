import React from "react";
import { Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../screens/HomeScreen";
import { SongBoard } from "../screens/SongBoard";
import { SongBoard2 } from "../screens/SongBoard2";
import { RadioBoard } from "../screens/RadioBoard";

const Drawer = createDrawerNavigator();

export default function HomeNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true, // show top headers
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "Home",
          headerRight: () => (
            <Text
              style={{ marginRight: 12, color: "blue", fontSize: 16 }}
              onPress={() => navigation.navigate("Song")}
            >
              Song
            </Text>
          ),
        })}
      />

      <Drawer.Screen
        name="Song"
        component={SongBoard}
        options={({ navigation }) => ({
          title: "Song",
          headerRight: () => (
            <Text
              style={{ marginRight: 12, color: "blue", fontSize: 16 }}
              onPress={() => navigation.navigate("Song2")}
            >
              Song2
            </Text>
          ),
        })}
      />

      <Drawer.Screen
        name="Song2"
        component={SongBoard2}
        options={({ navigation }) => ({
          title: "Song2",
          headerRight: () => (
            <Text
              style={{ marginRight: 12, color: "blue", fontSize: 16 }}
              onPress={() => navigation.navigate("Radio")}
            >
              Radio
            </Text>
          ),
        })}
      />

      <Drawer.Screen name="Radio" component={RadioBoard} />
    </Drawer.Navigator>
  );
}