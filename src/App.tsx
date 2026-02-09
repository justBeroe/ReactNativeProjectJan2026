import { StatusBar } from "expo-status-bar";
import RootNavigator from "./navigation/RootNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../src/core/services/AuthService";

export default function App() {
  return (
    <AuthProvider>
    <NavigationContainer>
      <StatusBar style="auto" />
      
        <RootNavigator />
     
    </NavigationContainer>
     </AuthProvider>
  );
}
