import { View, Text, StyleSheet, Image, Touchable, TouchableOpacity } from "react-native";

export default function Card({
    id,
    name,
    imageUrl,
    price,
    subtitle,
    onPress,
}) {
    return (
        <TouchableOpacity onPress={() => onPress(id)}>
            <View style={[styles.container]}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />

                <View style={styles.content}>
                    <Text style={styles.title}>{name}</Text>

                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

                    <Text style={styles.price}>{price.toFixed(2)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 12,
    },
    containerHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 140,
    },
    imageHorizontal: {
        width: 80,
        height: 80,
        borderRadius: 8,
        margin: 12,
    },
    content: {
        padding: 12,
    },
    contentHorizontal: {
        flex: 1,
        paddingLeft: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: '#007AFF',
    },
    rightAction: {
        paddingRight: 12,
    },
});
