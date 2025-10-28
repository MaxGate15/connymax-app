import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Order {
  id: string;
  customerName: string;
  items: string;
  total: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  time: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'John Doe',
      items: '2x Burger, 1x Fries, 1x Coke',
      total: '₵95.00',
      status: 'pending',
      time: '5 min ago',
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      items: '1x Pizza, 2x Salad',
      total: '₵85.00',
      status: 'preparing',
      time: '15 min ago',
    },
    {
      id: '3',
      customerName: 'Mike Johnson',
      items: '3x Tacos, 1x Nachos',
      total: '₵75.00',
      status: 'ready',
      time: '20 min ago',
    },
    {
      id: '4',
      customerName: 'Sarah Wilson',
      items: '1x Pasta, 1x Garlic Bread',
      total: '₵60.00',
      status: 'completed',
      time: '30 min ago',
    },
  ]);

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return '#FFD93D';
      case 'preparing':
        return '#FF6B6B';
      case 'ready':
        return '#4ECDC4';
      case 'completed':
        return '#00B386';
      default:
        return '#999';
    }
  };

  const getNextStatus = (status: string): string | null => {
    switch (status) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'completed';
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Orders will appear here when customers place them</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.customerName}>{item.customerName}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.orderBody}>
                <Ionicons name="bag-outline" size={20} color="#666" />
                <Text style={styles.orderItems}>{item.items}</Text>
              </View>
              
              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>{item.total}</Text>
                {getNextStatus(item.status) && (
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => handleStatusUpdate(item.id, getNextStatus(item.status) as Order['status'])}
                  >
                    <Text style={styles.updateButtonText}>
                      Mark as {getNextStatus(item.status)?.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 15,
    gap: 10,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    gap: 8,
  },
  orderItems: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00B386',
  },
  updateButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#00B386',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});

