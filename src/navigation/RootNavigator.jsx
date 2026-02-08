import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeNavigator from "./HomeNavigator";
import InfoScreen from "../screens/InfoScreen";
import { Ionicons } from "@expo/vector-icons";
import { SongBoard} from "../screens/SongBoard";
import { SongBoard2 } from "../screens/SongBoard2";


export default function RootNavigator() {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator
            screenOptions={{
            }}
        >
            <Tabs.Screen
                name="HomeTab"
                component={SongBoard2}
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                    headerShown: true
                }}
            />

            <Tabs.Screen
                name="Song"
                component={SongBoard}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="musical-note-outline" size={size} color={color} />,
                }}
            />

               <Tabs.Screen
                name="Song2"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="musical-notes-outline" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="Info"
                component={InfoScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" size={size} color={color} />,
                }}
            />
        </Tabs.Navigator>
    );
}
