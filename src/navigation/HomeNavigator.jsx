import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import DetailsScreen from "../screens/DetailsScreen";
import { SongBoard} from "../screens/SongBoard";
import { SongBoard2 } from "../screens/SongBoard2";
import { Text } from "react-native";
import { RadioBoard } from "../screens/RadioBoard";
import { LoginScreen } from "../screens/LoginScreen";

export default function HomeNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={({ navigation }) => ({ title: "Home",
            headerRight: () => ( <Text style={{ marginRight: 12, color: "blue", fontSize: 16 }} 
            onPress={() => navigation.navigate("Song")} > Song </Text> ),              

            })}

             />
            <Stack.Screen 
            name="Song" 
            component={SongBoard} 
            options={({ navigation }) => ({ title: "Song",
            headerRight: () => ( <Text style={{ marginRight: 12, color: "blue", fontSize: 16 }} 
            onPress={() => navigation.navigate("Song2")} > Song2 </Text> ),              

            })}
            />
            
            <Stack.Screen 
            name="Song2" 
            component={SongBoard2}
              options={({ navigation }) => ({ title: "Song2",
            headerRight: () => ( <Text style={{ marginRight: 12, color: "blue", fontSize: 16 }} 
            onPress={() => navigation.navigate("Radio")} > Radio </Text> ),              

            })}            

            />

            <Stack.Screen 
            name="Radio" 
            component={RadioBoard}
            />


            
        </Stack.Navigator>
    );
}
