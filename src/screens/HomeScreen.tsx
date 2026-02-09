import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../core/services/AuthService";

// ❗ FIXED: Use HomeStackParamList instead of RootStackParamList
// RootStackParamList contains ONLY Login now
import { HomeStackParamList } from "../navigation/types";

// 👇 FIXED: HomeScreen now uses the correct navigator type
type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Home"
>;

export default function HomeScreen() {
  // 👇 FIXED: navigation now correctly typed
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const { logout } = useAuth();

  const categoryPressHandler = (categoryId: string) => {
    navigation.navigate("Category", { categoryId });
  };

  const itemPressHandler = (itemId: string) => {
    navigation.navigate("Details", { itemId });
  };

  return (
    <View>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={async () => {
            // 👇 FIXED: logout alone triggers RootNavigator to switch to Login
            console.log("Logout button pressed");
            await logout();
            console.log("Logout finished");
          }}
          style={{
            backgroundColor: "red",
            padding: 12,
            borderRadius: 8,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.songName}>Song shop</Text>

        <View style={styles.headerInfo}>
          <Text style={styles.infoText}>⭐ Highest Rating</Text>
        </View>

        <Text style={styles.tagline}>Listen your free favourite song</Text>
      </View>

      {/* Featured Section */}
      <View style={styles.section}>
        {/* Your featured items UI (commented out) */}
      </View>

      {/* Category Section */}
      {/* Your category UI (commented out) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 24,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  songName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  infoDot: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.6,
    marginHorizontal: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  featuredList: {
    paddingRight: 16,
    flexDirection: "row",
  },
  featuredCard: {
    width: 200,
    marginRight: 12,
  },
  bottomPadding: {
    height: 24,
  },
});
