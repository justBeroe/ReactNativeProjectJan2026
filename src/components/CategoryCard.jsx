import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function CategoryCard({
    id,
    title,
    itemCount = 0,
    onPress,
}) {
    return (
        <TouchableOpacity onPress={() => onPress(id)} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>

                <Text style={styles.itemCount}>{itemCount} items</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    itemCount: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    arrow: {
        fontSize: 24,
        color: '#ccc',
        marginLeft: 8,
    },
});
