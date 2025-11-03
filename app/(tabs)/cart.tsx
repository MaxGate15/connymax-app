import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.subtitle}>Cart is empty</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 10 },
});

