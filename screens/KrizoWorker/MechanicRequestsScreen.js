import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';

export default function MechanicRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ID del trabajador (Armando Delgado - ID 6 según los logs)
  const workerId = 6;

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.1.14:5000/api/requests/worker/${workerId}`);
      const result = await response.json();

      if (response.ok) {
        // Filtrar solo solicitudes de mecánico
        const mechanicRequests = (result.data || []).filter(req => req.service_type === 'mecanico');
        setRequests(mechanicRequests);
      } else {
        setError(result.error || 'Error cargando solicitudes');
      }
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(`http://192.168.1.14:5000/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Estado actualizado correctamente');
        loadRequests(); // Recargar solicitudes
      } else {
        Alert.alert('Error', result.error || 'No se pudo actualizar el estado');
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'accepted': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#9E9E9E';
      default: return '#FFA500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Pendiente';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openInMaps = (latitude, longitude, address) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir Google Maps');
    });
  };

  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón atrás elegante */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backIconCircle}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" />
          </View>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Solicitudes de Mecánico</Text>
          <Text style={styles.subtitle}>Gestiona las solicitudes de servicios mecánicos</Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FC5501" />
              <Text style={styles.loadingText}>Cargando solicitudes...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && requests.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="tools" size={64} color="#C24100" />
              <Text style={styles.emptyText}>No hay solicitudes de mecánico</Text>
              <Text style={styles.emptySubText}>Las solicitudes aparecerán aquí cuando los clientes las envíen</Text>
            </View>
          )}

          {!loading && !error && requests.map((request) => (
            <Card key={request.id} style={styles.requestCard}>
              <Card.Content>
                <View style={styles.requestHeader}>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{request.client_name}</Text>
                    <Text style={styles.clientPhone}>{request.client_phone}</Text>
                  </View>
                  <Chip 
                    mode="outlined" 
                    textStyle={{ color: getStatusColor(request.status) }}
                    style={[styles.statusChip, { borderColor: getStatusColor(request.status) }]}
                  >
                    {getStatusText(request.status)}
                  </Chip>
                </View>

                <View style={styles.requestDetails}>
                  <Text style={styles.description}>{request.description}</Text>
                  <Text style={styles.location}>📍 {request.client_location}</Text>
                  {request.latitude && request.longitude && (
                    <View style={styles.coordinatesContainer}>
                      <Text style={styles.coordinates}>
                        📍 Coordenadas: {request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}
                      </Text>
                      <TouchableOpacity
                        style={styles.mapsButton}
                        onPress={() => openInMaps(request.latitude, request.longitude, request.client_location)}
                      >
                        <MaterialCommunityIcons name="map-marker" size={16} color="#2196F3" />
                        <Text style={styles.mapsButtonText}>Abrir en Maps</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <Text style={styles.date}>📅 {formatDate(request.created_at)}</Text>
                </View>

                {request.status === 'pending' && (
                  <View style={styles.actionButtons}>
                    <Button
                      mode="contained"
                      onPress={() => updateRequestStatus(request.id, 'accepted')}
                      style={[styles.actionButton, styles.acceptButton]}
                      labelStyle={styles.buttonLabel}
                    >
                      Aceptar
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => updateRequestStatus(request.id, 'rejected')}
                      style={[styles.actionButton, styles.rejectButton]}
                      labelStyle={[styles.buttonLabel, { color: '#F44336' }]}
                    >
                      Rechazar
                    </Button>
                  </View>
                )}

                {/* Botón de chat para todas las solicitudes */}
                <View style={styles.chatButtonContainer}>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('ChatScreen', {
                      sessionId: request.chat_session_id || 1, // Por ahora usar ID 1 como ejemplo
                      clientName: request.client_name,
                      serviceType: request.service_type
                    })}
                    style={styles.chatButton}
                    labelStyle={styles.chatButtonLabel}
                    icon="chat"
                  >
                    Chat con {request.client_name}
                  </Button>
                </View>

                {request.status === 'accepted' && (
                  <View style={styles.actionButtons}>
                    <Button
                      mode="contained"
                      onPress={() => updateRequestStatus(request.id, 'completed')}
                      style={[styles.actionButton, styles.completeButton]}
                      labelStyle={styles.buttonLabel}
                    >
                      Marcar como Completada
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 36,
    paddingHorizontal: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#FC5501',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FC5501',
  },
  backIconCircle: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 6,
    padding: 2,
  },
  backButtonText: {
    color: '#FC5501',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 18,
    width: '92%',
    maxWidth: 370,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 18,
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 6,
    marginTop: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#C24100',
    textAlign: 'center',
    marginBottom: 28,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#C24100',
    fontSize: 16,
    marginTop: 10,
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#D63031',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#C24100',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    color: '#C24100',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  requestCard: {
    marginBottom: 16,
    width: '100%',
    elevation: 4,
    shadowColor: '#FC5501',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262525',
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: '#666',
  },
  statusChip: {
    backgroundColor: 'transparent',
  },
  requestDetails: {
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#262525',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 12,
    color: '#4CAF50',
    fontFamily: 'monospace',
    flex: 1,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  mapsButtonText: {
    fontSize: 11,
    color: '#2196F3',
    marginLeft: 4,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
  completeButton: {
    backgroundColor: '#2196F3',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatButtonContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  chatButton: {
    backgroundColor: '#FC5501',
    borderRadius: 12,
  },
  chatButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
}); 