import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ResizeMode, Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, Image, Linking, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

interface MenuItemCardProps {
  image?: any;
  video?: string;
  vendor: string;
  location: string;
  likes: number;
  shares: number;
  saves: number;
  distance: string;
  rating: number;
  ratingCount: number;
  isPopular: boolean;
  title: string;
  description: string;
  price: string;
  onAddToCart: () => void;
  cartItemCount?: number;
  onCartPress?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  image,
  video,
  vendor,
  location,
  likes,
  shares,
  saves,
  distance,
  rating,
  ratingCount,
  isPopular,
  title,
  description,
  price,
  onAddToCart,
  cartItemCount = 0,
  onCartPress,
}) => {
  const { width, height } = Dimensions.get('window');
  const tabBarHeight = useBottomTabBarHeight();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [selectedDistance, setSelectedDistance] = useState(distance);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [isShared, setIsShared] = useState(false);
  const videoRef = useRef<Video>(null);
  const [distanceValue, setDistanceValue] = useState(5); // Default 5 miles
  const distanceSliderRef = useRef(null);

  // Page content data
  const pages = [
    {
      type: 'image',
      source: { uri: 'https://images.unsplash.com/photo-1595331506998-955704de9a1e?w=800&h=1200&fit=crop' },
      title: "Shawarma Wrap",
      description: "Crisp lettuce leaves filled with seasoned beef, fresh veggies, and a tangy sauce."
    },
    {
      type: 'image',
      source: { uri: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=1200&fit=crop' },
      title: "Margherita Pizza",
      description: "Colorful mixed greens with cherry tomatoes, cucumber, and balsamic dressing."
    },
    {
      type: 'image',
      source: { uri: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=1200&fit=crop' },
      title: "Grilled Chicken",
      description: "Juicy grilled chicken breast with herbs and spices, served with roasted vegetables."
    },
    {
      type: 'image',
      source: { uri: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&h=1200&fit=crop' },
      title: "BBQ Chicken",
      description: "Creamy pasta with crispy bacon, parmesan cheese, and perfectly cooked eggs."
    }
  ];

  const currentPageData = pages[currentPage];

  // Debug logging
  console.log('Current page:', currentPage, 'Type:', currentPageData.type, 'Source:', currentPageData.source);

  // Audio setup - DISABLED
  // useEffect(() => {
  //   setupAudio();
  //   return () => {
  //     if (audioRef.current) {
  //       audioRef.current.unloadAsync();
  //     }
  //   };
  // }, [currentPage, isMuted]);

  // const setupAudio = async () => {
  //   // Stop any existing audio first
  //   if (videoRef.current) {
  //     try {
  //       await videoRef.current.stopAsync();
  //       await videoRef.current.unloadAsync();
  //     } catch (error) {
  //       console.log('Audio cleanup error:', error);
  //     }
  //     videoRef.current = null;
  //   }

  //   // No audio to play since we removed the bell sound
  //   // Audio functionality is now disabled
  // };
  
  const openGoogleMaps = () => {
    console.log('Opening Google Maps for:', vendor, location);
    const address = `${vendor}, ${location}`;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    
    console.log('Google Maps URL:', url);
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Google Maps is not available on this device');
        }
      })
      .catch((err) => {
        console.log('Google Maps error:', err);
        Alert.alert('Error', 'Could not open Google Maps');
      });
  };

  const shareFood = async () => {
    try {
      const shareMessage = `🍽️ Check out this amazing ${currentPageData.title} from ${vendor}! 

📍 Location: ${location}
⭐ Rating: ${rating}/5 (${ratingCount}+ reviews)
💰 Price: ${price}

${currentPageData.description}

#FoodDelivery #${vendor.replace(/\s+/g, '')} #DeliciousFood`;

      const result = await Share.share({
        message: shareMessage,
        title: `${currentPageData.title} - ${vendor}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
        setIsShared(true);
        // Reset the shared state after 2 seconds
        setTimeout(() => setIsShared(false), 2000);
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.log('Error sharing:', error);
      Alert.alert('Error', 'Could not share this item');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      {/* Full Screen Background - Video or Image */}
      {currentPageData.type === 'youtube' ? (
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={height}
            width={width}
            videoId={currentPageData.source}
            play={true}
            mute={false}
            loop={true}
          />
          {/* Subtle Dark Overlay for Better Contrast */}
          <View style={styles.overlay} />
          </View>
      ) : currentPageData.type === 'video' ? (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: typeof currentPageData.source === 'string' ? currentPageData.source : currentPageData.source.uri }}
            style={styles.videoBackground}
            resizeMode={ResizeMode.COVER}
            shouldPlay={true}
            isLooping={true}
            isMuted={false}
          />
          {/* Subtle Dark Overlay for Better Contrast */}
          <View style={styles.overlay} />
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Image 
            source={currentPageData.source} 
            style={styles.imageBackground}
            resizeMode="cover"
            onError={(error) => console.log('Image error:', error)}
            onLoad={() => console.log('Image loaded successfully')}
          />
          {/* Subtle Dark Overlay for Better Contrast */}
          <View style={styles.overlay} />
        </View>
      )}
      
      {/* Navigation Touch Areas */}
      <TouchableOpacity 
        style={styles.leftNavArea} 
        onPress={() => setCurrentPage(Math.max(0, currentPage - 1))}
      />
      <TouchableOpacity 
        style={styles.rightNavArea} 
        onPress={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
      />
        
        {/* Page Navigation Dots */}
        <View style={styles.pageDots}>
          <TouchableOpacity 
            style={[styles.dot, currentPage === 0 && styles.activeDot]} 
            onPress={() => setCurrentPage(0)}
          />
          <TouchableOpacity 
            style={[styles.dot, currentPage === 1 && styles.activeDot]} 
            onPress={() => setCurrentPage(1)}
          />
          <TouchableOpacity 
            style={[styles.dot, currentPage === 2 && styles.activeDot]} 
            onPress={() => setCurrentPage(2)}
          />
          <TouchableOpacity 
            style={[styles.dot, currentPage === 3 && styles.activeDot]} 
            onPress={() => setCurrentPage(3)}
          />
        </View>
        
        {/* Search Input Field */}
        {isSearchVisible && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for food..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />
            <TouchableOpacity 
              style={styles.closeSearch} 
              onPress={() => {
                setIsSearchVisible(false);
                setSearchText('');
              }}
            >
              <Ionicons name="close" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Glassmorphism Content Card */}
        <View style={[styles.glassCard, { bottom: tabBarHeight, paddingBottom: 20 }]}>
          <View style={styles.cardContent}>
            
            {/* Food Title and Social Stats Row */}
            <View style={styles.titleRow}>
              <Text style={styles.foodTitle}>{currentPageData.title}</Text>
              <View style={styles.socialStats}>
                <View style={styles.statItem}>
                  <FontAwesome name="heart" size={22} color="#fff" />
                  <Text style={styles.statText}>{likes}K</Text>
                </View>
                <TouchableOpacity style={styles.statItem} onPress={() => {
                  console.log('Share button tapped');
                  shareFood();
                }}>
                  <Ionicons 
                    name="paper-plane" 
                    size={22} 
                    color={isShared ? "#00B386" : "#fff"} 
                  />
                  <Text style={[styles.statText, isShared && { color: "#00B386" }]}>{shares}K</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statItem} onPress={() => {
                  console.log('Star button tapped');
                  setIsFavorite(!isFavorite);
                }}>
                  <FontAwesome 
                    name={isFavorite ? "star" : "star-o"} 
                    size={22} 
                    color={isFavorite ? "#FFD700" : "#fff"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Food Description */}
            <View style={styles.foodInfo}>
              <TouchableOpacity onPress={() => {
                console.log('Description tapped');
                setIsDescriptionExpanded(!isDescriptionExpanded);
              }}>
                <Text 
                  style={styles.foodDescription}
                  numberOfLines={isDescriptionExpanded ? undefined : 1}
                >
                  {currentPageData.description}
                </Text>
              </TouchableOpacity>
            </View>
          
          {/* Restaurant Information */}
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantContainer}>
              <MaterialIcons name="storefront" size={16} color="#fff" />
              <Text style={styles.vendorName}>{vendor}</Text>
            </View>
            <Text style={styles.distanceText}>{distance} away</Text>
          </View>
          
          {/* Rating Row */}
          <View style={styles.ratingRow}>
            <TouchableOpacity style={styles.ratingItem} onPress={() => {
              console.log('Location tapped');
              openGoogleMaps();
            }}>
              <View style={styles.ratingIcon}>
                <Ionicons name="location" size={12} color="#fff" />
              </View>
              <Text style={styles.ratingText}>
                {location}
              </Text>
            </TouchableOpacity>
            <View style={styles.ratingItem}>
              <View style={[styles.ratingIcon, { backgroundColor: '#FF4444' }]}>
                <Text style={styles.ratingIconText}>★</Text>
              </View>
              <Text style={styles.ratingText}>4.1</Text>
              <FontAwesome name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingCount}>(1310+)</Text>
            </View>
            {isPopular && (
              <View style={styles.popularBadge}>
                <Ionicons name="flame" size={12} color="#FF6B35" />
                <Text style={styles.popularText}>POPULAR</Text>
              </View>
            )}
          </View>
          
          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addToCartButton} onPress={() => {
            console.log('Add to cart tapped');
            onAddToCart();
          }}>
            <View style={styles.buttonLeft}>
              <Ionicons name="cart" size={16} color="#fff" />
              <Text style={styles.addToCartText}>Add to cart</Text>
            </View>
            
            {/* Cart Button in Middle */}
            {cartItemCount > 0 && onCartPress && (
              <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
                <Ionicons name="cart" size={16} color="#fff" />
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </View>
              </TouchableOpacity>
            )}
            
            <Text style={styles.priceText}>{price}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Filter Modal */}
      {isFilterVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {/* Location Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Location</Text>
              <View style={styles.filterOptions}>
                {['East Legon', 'Accra Central', 'Osu', 'Airport', 'Tema'].map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.filterOption, selectedLocation === loc && styles.selectedOption]}
                    onPress={() => setSelectedLocation(loc)}
                  >
                    <Text style={[styles.filterOptionText, selectedLocation === loc && styles.selectedOptionText]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Distance Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Distance: {distanceValue} miles</Text>
              <GestureHandlerRootView style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${(distanceValue / 20) * 100}%` }]} />
                  <PanGestureHandler
                    ref={distanceSliderRef}
                    onGestureEvent={(event) => {
                      const { translationX } = event.nativeEvent;
                      const sliderWidth = 250; // Approximate slider width
                      const newValue = Math.max(0.5, Math.min(20, (translationX / sliderWidth) * 20 + 5));
                      setDistanceValue(Math.round(newValue * 2) / 2); // Round to nearest 0.5
                    }}
                    onHandlerStateChange={(event) => {
                      if (event.nativeEvent.state === State.END) {
                        // Slider released
                      }
                    }}
                  >
                    <View style={[styles.sliderHandle, { left: `${(distanceValue / 20) * 100}%` }]} />
                  </PanGestureHandler>
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>0.5</Text>
                  <Text style={styles.sliderLabel}>10</Text>
                  <Text style={styles.sliderLabel}>20</Text>
                </View>
              </GestureHandlerRootView>
            </View>
            
            {/* Cuisine Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Cuisine</Text>
              <View style={styles.filterOptions}>
                {['All', 'Italian', 'Chinese', 'Indian', 'African', 'American', 'Mexican'].map((cuisine) => (
                  <TouchableOpacity
                    key={cuisine}
                    style={[styles.filterOption, selectedCuisine === cuisine && styles.selectedOption]}
                    onPress={() => setSelectedCuisine(cuisine)}
                  >
                    <Text style={[styles.filterOptionText, selectedCuisine === cuisine && styles.selectedOptionText]}>
                      {cuisine}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Price Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.filterOptions}>
                {['All', '₵0-50', '₵50-100', '₵100-200', '₵200+'].map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[styles.filterOption, selectedPrice === price && styles.selectedOption]}
                    onPress={() => setSelectedPrice(price)}
                  >
                    <Text style={[styles.filterOptionText, selectedPrice === price && styles.selectedOptionText]}>
                      {price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Rating</Text>
              <View style={styles.filterOptions}>
                {['All', '4.5+', '4.0+', '3.5+', '3.0+'].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[styles.filterOption, selectedRating === rating && styles.selectedOption]}
                    onPress={() => setSelectedRating(rating)}
                  >
                    <Text style={[styles.filterOptionText, selectedRating === rating && styles.selectedOptionText]}>
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Apply Filters Button */}
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => {
                setIsFilterVisible(false);
                // Here you would apply the filters to your data
                console.log('Applied filters:', {
                  location: selectedLocation,
                  distance: selectedDistance,
                  cuisine: selectedCuisine,
                  price: selectedPrice,
                  rating: selectedRating
                });
              }}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoBackground: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  topLeftBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1,
  },
  topRightBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1,
  },
  audioButton: {
    position: 'absolute',
    top: 20,
    right: 80,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1,
  },
  leftNavArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '15%',
    height: '100%',
    zIndex: 0,
  },
  rightNavArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '15%',
    height: '100%',
    zIndex: 0,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  closeSearch: {
    padding: 5,
  },
  pageDots: {
    position: 'absolute',
    top: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    transform: [{ scale: 1.2 }],
  },
  glassCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 0,
    paddingTop: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Glassmorphism effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 999, // Very high zIndex to ensure it's on top
  },
  cardContent: {
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  statText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  restaurantInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15,
    gap: 15,
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  distanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginRight: 5,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularText: {
    fontSize: 10,
    color: '#FF6B35',
    fontWeight: '600',
    marginLeft: 5,
  },
  foodInfo: {
    marginBottom: 12,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  foodDescription: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 20,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  priceContainer: {
    backgroundColor: 'rgba(0, 179, 134, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  addToCartButton: {
    backgroundColor: '#00B386',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#00B386',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B386',
    marginRight: 5,
  },
  ratingIconText: {
    fontSize: 12,
    color: '#fff',
  },
  ratingCount: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 5,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  filterModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    // Glassmorphism effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1001,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#00B386',
    borderColor: '#00B386',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#00B386',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  sliderTrack: {
    width: 250,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#00B386',
    borderRadius: 5,
  },
  sliderHandle: {
    width: 20,
    height: 20,
    backgroundColor: '#00B386',
    borderRadius: 10,
    position: 'absolute',
    top: -5,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    marginTop: 10,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  cartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default MenuItemCard; 