import { useState } from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { featuredItems } from '../data/menuItems';
import CartItem from '../components/CartItem';

export default function CartScreen() {
    const [cartItems, setCartItems] = useState(() => {
        return featuredItems.map(item => ({ ...item, quantity: 2 }));
    });

    return (
        <View style={styles.container}>
            {cartItems.map(item => (
                <CartItem key={item.id} {...item} />
            ))}
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f8f8f8',
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
    },
    list: {
        padding: 16,
        paddingBottom: 8,
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 15,
        color: '#666',
    },
    summaryValue: {
        fontSize: 15,
        color: '#333',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    checkoutButton: {
        marginTop: 16,
    },
});
