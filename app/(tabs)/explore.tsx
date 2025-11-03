import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ExploreScreen() {
  const handleAddToCart = () => {
    Alert.alert('Added to cart!', 'Your item has been added to cart');
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity>
          <Text style={styles.navText}>◄ Camera</Text>
        </TouchableOpacity>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Floating Action Buttons */}
      <TouchableOpacity style={styles.floatingBtn}>
        <Ionicons name="reorder-three-outline" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.floatingBtn, styles.searchBtn]}>
        <Ionicons name="search" size={24} color="#333" />
      </TouchableOpacity>

      {/* Food Image with Overlay */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=1200' }}
          style={styles.foodImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <View style={styles.overlayContent}>
            <View style={styles.overlayHeader}>
              <Text style={styles.foodTitle}>Lettuce Wraps</Text>
              <View style={styles.engagementMetrics}>
                <View style={styles.metric}>
                  <Ionicons name="heart" size={20} color="#fff" />
                  <Text style={styles.metricText}>123.6K</Text>
                </View>
                <View style={styles.metric}>
                  <Ionicons name="send" size={20} color="#fff" />
                  <Text style={styles.metricText}>12.5K</Text>
                </View>
                <Ionicons name="bookmark-outline" size={20} color="#fff" />
              </View>
            </View>
            
            <Text style={styles.description}>
              Crisp lettuce leaves filled with seasoned beef, fresh...
            </Text>

            <View style={styles.restaurantInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="storefront-outline" size={18} color="#fff" />
                <Text style={styles.infoText}>Fresh Wraps Co.</Text>
                <Text style={styles.distance}>1.2 miles away</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={18} color="#00B386" />
                <Text style={styles.infoText}>East Legon, Accra</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="star" size={18} color="#FF6B6B" />
                <Text style={styles.infoText}>4.1 (1310+)</Text>
                <View style={styles.popularTag}>
                  <Ionicons name="flame" size={12} color="#fff" />
                  <Text style={styles.popularText}>POPULAR</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Add to Cart Button */}
      <View style={styles.cartContainer}>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart" size={24} color="#fff" />
          <Text style={styles.addToCartText}>Add to cart</Text>
          <Text style={styles.price}>₵45.00</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10, zIndex: 10 },
  navText: { fontSize: 16, color: '#fff' },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 20 },
  floatingBtn: { position: 'absolute', top: 60, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, zIndex: 10 },
  searchBtn: { left: 'auto', right: 20 },
  imageContainer: { position: 'relative', width: '100%', height: height * 0.75 },
  foodImage: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 },
  overlayContent: { gap: 15 },
  overlayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  foodTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', flex: 1 },
  engagementMetrics: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metricText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  description: { fontSize: 14, color: '#fff', lineHeight: 20 },
  restaurantInfo: { gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  distance: { marginLeft: 'auto', fontSize: 12, color: '#fff', opacity: 0.8 },
  popularTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF8C00', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 4 },
  popularText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  cartContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 },
  addToCartBtn: { backgroundColor: '#00B386', borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  addToCartText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});
