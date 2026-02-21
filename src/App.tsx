import { StatusBar } from "expo-status-bar";
import RootNavigator from "./navigation/RootNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../src/core/services/AuthService";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function App() {
  return (
    <SafeAreaProvider>
    <AuthProvider>
    <NavigationContainer>
      <StatusBar style="auto" />
      
        <RootNavigator />
     
    </NavigationContainer>
     </AuthProvider>
     </SafeAreaProvider>
  );
}
