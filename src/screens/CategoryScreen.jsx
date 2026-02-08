import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getItemsByCategory } from "../data/menuItems";
import Card from "../components/Card";

export default function CategoryScreen({ route, navigation }) {
    const { categoryId } = route.params;

    const items = getItemsByCategory(categoryId);

    const itemPressedHandler = (itemId) => {
        navigation.navigate('Details', { itemId });
    };

    return (
        <ScrollView style={styles.container}>
            {items.map((item) => (
                <Card
                    key={item.id}
                    {...item}
                    onPress={itemPressedHandler}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    list: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
