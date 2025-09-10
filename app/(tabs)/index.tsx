import React from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';

import MenuItemCard from '@/components/cards/MenuItemCard';
import { useCallback } from 'react';

export default function HomeScreen() {
  const handleAddToCart = useCallback(() => {
    Alert.alert('Added to cart!');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 32 }}>
        <MenuItemCard
          image={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=1200&fit=crop&crop=center' }}
          vendor="Fresh Wraps Co."
          location="East Legon, Accra"
          likes={123.6}
          shares={12.5}
          saves={11.7}
          distance="1.2 miles"
          rating={4.9}
          ratingCount={180}
          isPopular={true}
          title="Lettuce Wraps"
          description="Crisp lettuce leaves filled with seasoned beef, fresh veggies, and a tangy sauce."
          price="₵45.00"
          onAddToCart={handleAddToCart}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
