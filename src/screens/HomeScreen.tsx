import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/types';

import { featuredItems, getItemsByCategory } from '../data/menuItems';
import Card from '../components/Card';
import { categories } from '../data/categoriesData';
import CategoryCard from '../components/CategoryCard';
import { SongBoard } from "./SongBoard";
import { RadioBoard } from './RadioBoard';

// 👇 type the navigation prop
type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const categoryPressHandler = (categoryId: string) => {
    navigation.navigate('Category', { categoryId });
  };

  const itemPressHandler = (itemId: string) => {
    navigation.navigate('Details', { itemId });
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.songName}>Song shop</Text>

        <View style={styles.headerInfo}>
          <Text style={styles.infoText}>⭐ Highest Rating</Text>
        </View>

        <Text style={styles.tagline}>
          Listen your free favourite song
        </Text>
      </View>

      {/* Featured Section */}
      <View style={styles.section}>
        {/* <Text style={styles.sectionTitle}>Featured Items</Text>

        <ScrollView horizontal style={styles.featuredList}>
          {featuredItems.map((item) => (
            <View key={item.id} style={styles.featuredCard}>
              <Card
                {...item}
                subtitle={item.description}
                onPress={itemPressHandler}
              />
            </View>
          ))}
        </ScrollView> */}

        
      </View>

      {/* Category Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>

        {categories.map((category) => {
          const itemCount = getItemsByCategory(category.id).length;

          return (
            <CategoryCard
              key={category.id}
              itemCount={itemCount}
              {...category}
              onPress={categoryPressHandler}
            />
          );
        })}
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        backgroundColor: '#007AFF',
        padding: 24,
        paddingTop: 16,
        paddingBottom: 28,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    songName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    infoDot: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.6,
        marginHorizontal: 8,
    },
    tagline: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.8,
    },
    section: {
        padding: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
    },
    featuredList: {
        paddingRight: 16,
        flexDirection: 'row',
    },
    featuredCard: {
        width: 200,
        marginRight: 12,
    },
    bottomPadding: {
        height: 24,
    },
});