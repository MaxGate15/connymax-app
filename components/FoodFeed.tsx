import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import MenuItemCard from './cards/MenuItemCard';

const { height: screenHeight } = Dimensions.get('window');

// Sample food data - you can expand this
const foodItems = [
  {
    id: 1,
    image: { uri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=1200&fit=crop' },
    vendor: "Burger House",
    location: "East Legon, Accra",
    likes: 234.1,
    shares: 45.2,
    saves: 67.8,
    distance: "0.5 miles",
    rating: 4.8,
    ratingCount: 320,
    isPopular: true,
    title: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheese, fresh lettuce, tomatoes, and special sauce on a toasted bun.",
    price: "₵75.00"
  },
  {
    id: 2,
    image: { uri: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=1200&fit=crop' },
    vendor: "Pizza Express",
    location: "Osu, Accra",
    likes: 189.5,
    shares: 28.7,
    saves: 52.3,
    distance: "1.1 miles",
    rating: 4.7,
    ratingCount: 245,
    isPopular: true,
    title: "Margherita Pizza",
    description: "Traditional Italian pizza with fresh mozzarella, basil, and tomato sauce on crispy crust.",
    price: "₵85.00"
  },
  {
    id: 3,
    image: { uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=1200&fit=crop' },
    vendor: "Sushi Master",
    location: "Airport, Accra",
    likes: 312.8,
    shares: 89.4,
    saves: 123.6,
    distance: "2.3 miles",
    rating: 4.9,
    ratingCount: 456,
    isPopular: true,
    title: "Dragon Roll",
    description: "Premium sushi roll with eel, avocado, and cucumber, topped with spicy mayo and eel sauce.",
    price: "₵120.00"
  },
  {
    id: 4,
    image: { uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=1200&fit=crop' },
    vendor: "Healthy Bowl",
    location: "Tema, Accra",
    likes: 145.2,
    shares: 15.8,
    saves: 34.7,
    distance: "1.7 miles",
    rating: 4.6,
    ratingCount: 178,
    isPopular: false,
    title: "Acai Bowl",
    description: "Fresh acai berries blended with granola, banana, strawberries, and honey drizzle.",
    price: "₵55.00"
  },
  {
    id: 5,
    image: { uri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=1200&fit=crop' },
    vendor: "Taco Fiesta",
    location: "Accra Central",
    likes: 267.3,
    shares: 56.9,
    saves: 89.1,
    distance: "0.9 miles",
    rating: 4.8,
    ratingCount: 298,
    isPopular: true,
    title: "Street Tacos",
    description: "Authentic Mexican tacos with grilled chicken, fresh salsa, cilantro, and lime on corn tortillas.",
    price: "₵40.00"
  }
];

// Cart item interface
interface CartItem {
  id: number;
  title: string;
  price: string;
  image: any;
  vendor: string;
  quantity: number;
}

export default function FoodFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const panRef = useRef(null);

  const handleAddToCart = (foodItem: any) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === foodItem.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(item =>
          item.id === foodItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, {
          id: foodItem.id,
          title: foodItem.title,
          price: foodItem.price,
          image: foodItem.image,
          vendor: foodItem.vendor,
          quantity: 1
        }];
      }
    });
    
    Alert.alert('Added to cart!', `${foodItem.title} has been added to your cart.`);
  };

  const updateCartItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } else {
      // Update quantity
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('₵', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY } = event.nativeEvent;
      const shouldSwipeUp = translationY < -100 && currentIndex > 0;
      const shouldSwipeDown = translationY > 100 && currentIndex < foodItems.length - 1;

      if (shouldSwipeUp) {
        // Swipe up - go to previous item
        Animated.timing(translateY, {
          toValue: -screenHeight,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentIndex(currentIndex - 1);
          translateY.setValue(0);
        });
      } else if (shouldSwipeDown) {
        // Swipe down - go to next item
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentIndex(currentIndex + 1);
          translateY.setValue(0);
        });
      } else {
        // Snap back to center
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const currentFood = foodItems[currentIndex];

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={[styles.foodContainer, { transform: [{ translateY }] }]}>
          <MenuItemCard
            {...foodItems[currentIndex]}
            onAddToCart={() => handleAddToCart(foodItems[currentIndex])}
            cartItemCount={getCartItemCount()}
            onCartPress={() => setIsCartVisible(true)}
          />
        </Animated.View>
      </PanGestureHandler>
      
      {/* Cart Modal */}
      <Modal
        visible={isCartVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsCartVisible(false)}
      >
        <View style={styles.cartModal}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>Your Cart</Text>
            <TouchableOpacity onPress={() => setIsCartVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={64} color="#ccc" />
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
              <Text style={styles.emptyCartSubtext}>Add some delicious food to get started!</Text>
            </View>
          ) : (
            <>
              <ScrollView style={styles.cartItems}>
                {cartItems.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <Image source={item.image} style={styles.cartItemImage} />
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemTitle}>{item.title}</Text>
                      <Text style={styles.cartItemVendor}>{item.vendor}</Text>
                      <Text style={styles.cartItemPrice}>{item.price}</Text>
                    </View>
                    <View style={styles.cartItemActions}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={20} color="#00B386" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={20} color="#00B386" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              <View style={styles.cartFooter}>
                <View style={styles.totalSection}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalPrice}>₵{getTotalPrice().toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={() => {
                    Alert.alert('Checkout', 'Proceeding to checkout...');
                    setIsCartVisible(false);
                  }}
                >
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  foodContainer: {
    flex: 1,
  },
  cartModal: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyCart: {
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyCartText: {
    fontSize: 20,
    color: '#666',
    marginTop: 10,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
  },
  cartItems: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemVendor: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00B386',
    marginTop: 5,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
  },
  cartFooter: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00B386',
  },
  checkoutButton: {
    backgroundColor: '#00B386',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 