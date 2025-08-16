import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform
} from 'react-native';
import { Card, Avatar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

const KrizoWorkerChatListScreen = ({ navigation }) => {
  const { token, user } = useAuth();
  const [chatSessions, setChatSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chat/sessions/worker/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setChatSessions(result.data);
        }
      }
    } catch (error) {
      console.error('Error cargando sesiones de chat:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChatSessions();
  };

  const getServiceTypeIcon = (serviceType) => {
    switch (serviceType) {
      case 'mecanico':
        return 'wrench';
      case 'grua':
        return 'truck-delivery';
      case 'taller':
        return 'garage';
      default:
        return 'car-wrench';
    }
  };

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case 'mecanico':
        return '#FF6B35';
      case 'grua':
        return '#4ECDC4';
      case 'taller':
        return '#45B7D1';
      default:
        return '#96CEB4';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const renderChatSession = ({ item }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => navigation.navigate('KrizoWorkerChat', {
        sessionId: item.id,
        clientInfo: {
          firstName: item.client_firstName,
          lastName: item.client_lastName,
          id: item.client_id,
                  imageUrl: item.client_image_url
        }
      })}
    >
      <View style={styles.chatHeader}>
      {item.client_image_url ? (
        <Avatar.Image
          size={50}
          source={{ uri: item.client_image_url }}
          style={styles.avatar}
        />
      ) : (
        <Avatar.Text
          size={50}
          label={`${item.client_firstName?.charAt(0) || 'C'}${item.client_lastName?.charAt(0) || ''}`}
          style={styles.avatar}
        />
      )}
        <View style={styles.chatInfo}>
          <Text style={styles.clientName}>
            {item.client_firstName} {item.client_lastName}
          </Text>
          <Text style={styles.serviceType}>
            Servicio: {item.service_type}
          </Text>
          {item.last_message ? (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.last_message}
            </Text>
          ) : (
            <Text style={styles.noMessages}>Sin mensajes aún</Text>
          )}
          <Text style={styles.date}>
            {item.last_message_time 
              ? new Date(item.last_message_time).toLocaleDateString() + ' ' + new Date(item.last_message_time).toLocaleTimeString()
              : new Date(item.created_at).toLocaleDateString()
            }
          </Text>
        </View>
        <View style={styles.chatActions}>
          <Chip 
            mode="outlined"
            style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {item.status}
          </Chip>
          {item.message_count > 0 && (
            <Chip 
              mode="outlined"
              style={styles.messageCountChip}
              textStyle={{ color: '#FC5501' }}
            >
              {item.message_count} msj
            </Chip>
          )}
          <Icon 
            name={getServiceTypeIcon(item.service_type)} 
            size={24} 
            color={getServiceTypeColor(item.service_type)} 
            style={styles.serviceIcon}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FC5501', '#C24100']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Chats</Text>
          <Text style={styles.headerSubtitle}>Conversaciones con clientes</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={chatSessions}
        renderItem={renderChatSession}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FC5501']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="chat-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay conversaciones activas</Text>
            <Text style={styles.emptySubtext}>Los chats aparecerán aquí cuando los clientes te contacten</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  chatCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#FC5501',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  chatActions: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 8,
  },
  serviceIcon: {
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  noMessages: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  messageCountChip: {
    marginBottom: 8,
    borderColor: '#FC5501',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default KrizoWorkerChatListScreen; 
