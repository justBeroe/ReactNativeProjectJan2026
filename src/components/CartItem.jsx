import { View, Text, Image, StyleSheet } from "react-native";

export default function CartItem({
    imageUrl,
    name,
    quantity,
    price,
}) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                {/* <Text style={styles.options}>{formatOptions(line.options)}</Text> */}
                <View style={styles.priceRow}>
                    <Text style={styles.price}>${(quantity * price).toFixed(2)}</Text>
                    <Text style={styles.unitPrice}>
                        (${price.toFixed(2)} each)
                    </Text>
                </View>
            </View>
            <View style={styles.actions}>
                {/* Change quantity */}

                {/* remove item */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    options: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: '#007AFF',
    },
    unitPrice: {
        fontSize: 12,
        color: '#999',
        marginLeft: 6,
    },
    actions: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButton: {
        marginTop: 8,
        padding: 4,
    },
    removeText: {
        fontSize: 12,
        color: '#FF3B30',
        fontWeight: '500',
    },
});
