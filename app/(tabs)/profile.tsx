import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '@/contexts/UserContext';

export default function ProfileScreen() {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          setUser(null);
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#00B386" />
          </View>
          <Text style={styles.name}>{user?.name || 'Customer'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  content: { flex: 1, padding: 20 },
  profileSection: { alignItems: 'center', marginVertical: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#00B38620', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  email: { fontSize: 16, color: '#666' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 15, padding: 18, borderWidth: 1, borderColor: '#FF6B6B' },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#FF6B6B' },
});

