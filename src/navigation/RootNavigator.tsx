import { useAuth } from "../core/services/AuthService";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

export default function RootNavigator() {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <AppNavigator /> : <AuthNavigator />;
}
