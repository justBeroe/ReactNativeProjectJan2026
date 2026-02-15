import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeNavigator from "./HomeNavigator";
import InfoScreen from "../screens/InfoScreen";
import { Ionicons } from "@expo/vector-icons";
import { SongBoard } from "../screens/SongBoard";
import { SongBoard2 } from "../screens/SongBoard2";
import { RadioBoard } from "../screens/RadioBoard";
import { ProfileScreen } from "../screens/ProfileScreen";
import CameraScreen from "../screens/CameraScreen";


export default function RootNavigator() {
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator screenOptions={{}}>
      <Tabs.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="Song"
        component={SongBoard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-note-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Picture"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
