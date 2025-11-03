import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function HomeScreen() {
  const { user } = useUser();
  const restaurants = [
    { id: 1, name: "Mamy's Dishes", image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150' },
    { id: 2, name: "Coco Cuisine", image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150' },
    { id: 3, name: "Mr Bolat Pizza", image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150' },
    { id: 4, name: "Abacha Cuisine", image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150' },
    { id: 5, name: "Esther's Kitchen", image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150' },
  ];

  const popularMeals = [
    { id: 1, name: 'Fish and Chips', price: '₵100.00', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', rating: 5.0, time: '20-30 mins' },
    { id: 2, name: 'Roasted chicken', price: '₵90.00', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', rating: 4.8, time: '20-30 mins' },
    { id: 3, name: 'Grilled Fish', price: '₵85.00', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', rating: 4.9, time: '15-25 mins' },
  ];

  const categories = ['All', 'Restaurant', 'Local', 'Fine dinning'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={50} color="#00B386" />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.username}>{user?.name || 'Customer'}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="#666" />
          <Text style={styles.searchPlaceholder}>Search for Restaurants and dishes...</Text>
          <TouchableOpacity>
            <Ionicons name="options-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Promotional Banner */}
        <TouchableOpacity style={styles.bannerContainer} onPress={() => router.push('/(tabs)/explore')}>
          <LinearGradient colors={['#2C3E50', '#34495E']} style={styles.banner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Free delivery today</Text>
                <Text style={styles.bannerDescription}>
                  For every meals order today, you'll get free deliveries with no hidden charges.
                </Text>
                <TouchableOpacity style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>Order Now</Text>
                </TouchableOpacity>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' }} 
                style={styles.bannerImage}
                contentFit="cover"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, cat === 'All' && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryText, cat === 'All' && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Explore Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Restaurants</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {restaurants.map((restaurant) => (
              <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Meals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {popularMeals.map((meal) => (
              <TouchableOpacity 
                key={meal.id} 
                style={styles.mealCard}
                onPress={() => router.push('/(tabs)/explore')}
              >
                <View style={styles.mealImageContainer}>
                  <Image source={{ uri: meal.image }} style={styles.mealImage} />
                  <TouchableOpacity style={styles.favoriteBtn}>
                    <Ionicons name="heart-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <View style={styles.mealRow}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{meal.rating}</Text>
                    </View>
                    <Text style={styles.timeText}>{meal.time}</Text>
                  </View>
                  <Text style={styles.mealPrice}>{meal.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  greetingSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarContainer: { justifyContent: 'center', alignItems: 'center' },
  welcomeText: { fontSize: 12, color: '#666' },
  username: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 12, marginHorizontal: 20, marginBottom: 20, gap: 10 },
  searchPlaceholder: { flex: 1, fontSize: 14, color: '#999' },
  bannerContainer: { marginHorizontal: 20, marginBottom: 25, borderRadius: 20, overflow: 'hidden' },
  banner: { padding: 20 },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between' },
  bannerText: { flex: 1, marginRight: 15 },
  bannerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  bannerDescription: { fontSize: 12, color: '#fff', marginBottom: 20, lineHeight: 18 },
  bannerButton: { backgroundColor: '#00B386', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-start' },
  bannerButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  bannerImage: { width: 120, height: 120, borderRadius: 10 },
  categoriesContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 25, gap: 10 },
  categoryChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f8f9fa' },
  categoryChipActive: { backgroundColor: '#00B386' },
  categoryText: { fontSize: 14, color: '#666', fontWeight: '600' },
  categoryTextActive: { color: '#fff' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15, paddingHorizontal: 20 },
  horizontalScroll: { paddingLeft: 20 },
  restaurantCard: { alignItems: 'center', marginRight: 20 },
  restaurantImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  restaurantName: { fontSize: 12, color: '#333', textAlign: 'center' },
  mealCard: { width: 180, backgroundColor: '#f8f9fa', borderRadius: 15, marginRight: 15, overflow: 'hidden' },
  mealImageContainer: { position: 'relative' },
  mealImage: { width: 180, height: 120, borderRadius: 15 },
  favoriteBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 15, padding: 5 },
  mealInfo: { padding: 12 },
  mealName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  mealRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12, fontWeight: '600', color: '#333' },
  timeText: { fontSize: 11, color: '#666' },
  mealPrice: { fontSize: 16, fontWeight: 'bold', color: '#00B386' },
});
