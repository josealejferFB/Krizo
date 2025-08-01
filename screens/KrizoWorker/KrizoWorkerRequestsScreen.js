import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Text, Badge, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';
import QuoteModal from '../../components/QuoteModal';
import { useAuth } from '../../context/AuthContext';

export default function KrizoWorkerRequestsScreen({ navigation }) {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  // ID del trabajador (Armando Delgado - ID 6 según los logs)
  const workerId = user?.id || 6;

  useEffect(() => {
    loadWorkerProfile();
  }, []);

  useEffect(() => {
    if (workerProfile) {
      loadRequests();
    }
  }, [workerProfile]);

  const loadWorkerProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${workerId}`);
      const result = await response.json();

      if (response.ok) {
        setWorkerProfile(result.user);
      } else {
        setError('Error cargando perfil del trabajador');
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setError('Error de conexión');
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      console.log('🔄 Recargando solicitudes pendientes del worker...');
      const response = await fetch(`${API_BASE_URL}/requests?status=pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();

      if (response.ok) {
        console.log('📋 Solicitudes pendientes del worker recibidas:', JSON.stringify(result.data, null, 2));
        setRequests(result.data || []);
      } else {
        console.error('Error al cargar solicitudes:', response.status);
        setError(result.error || 'Error cargando solicitudes');
      }
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = (request) => {
    setSelectedRequest(request);
    setQuoteModalVisible(true);
  };

  const handleQuoteSent = (quoteData) => {
    setQuoteModalVisible(false);
    setSelectedRequest(null);
    
    // Recargar solicitudes para mostrar el estado actualizado
    loadRequests();
    
    Alert.alert(
      'Cotización Enviada',
      'La cotización ha sido enviada al cliente exitosamente.',
      [{ text: 'OK' }]
    );
  };

  const handleAcceptRequest = async (request) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${request.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'accepted' })
      });

      if (response.ok) {
        Alert.alert('Solicitud Aceptada', 'Has aceptado la solicitud del cliente.');
        loadRequests(); // Recargar lista
      } else {
        Alert.alert('Error', 'No se pudo aceptar la solicitud');
      }
    } catch (error) {
      console.error('Error aceptando solicitud:', error);
      Alert.alert('Error', 'No se pudo aceptar la solicitud');
    }
  };

  const handleRejectRequest = async (request) => {
    Alert.alert(
      'Rechazar Solicitud',
      '¿Estás seguro de que quieres rechazar esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/requests/${request.id}/status`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'rejected' })
              });

              if (response.ok) {
                Alert.alert('Solicitud Rechazada', 'Has rechazado la solicitud del cliente.');
                loadRequests(); // Recargar lista
              } else {
                Alert.alert('Error', 'No se pudo rechazar la solicitud');
              }
            } catch (error) {
              console.error('Error rechazando solicitud:', error);
              Alert.alert('Error', 'No se pudo rechazar la solicitud');
            }
          }
        }
      ]
    );
  };

  const renderRequest = (request) => {
    const getUrgencyColor = (urgency) => {
      switch (urgency) {
        case 'emergency': return '#D32F2F';
        case 'high': return '#F44336';
        case 'normal': return '#FF9800';
        case 'low': return '#4CAF50';
        default: return '#FF9800';
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'pending': return '#FF9800';
        case 'accepted': return '#4CAF50';
        case 'rejected': return '#F44336';
        case 'in_progress': return '#2196F3';
        case 'completed': return '#4CAF50';
        default: return '#FF9800';
      }
    };

    return (
      <Card key={request.id} style={styles.requestCard}>
        <Card.Content>
          <View style={styles.requestHeader}>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>
                {request.client_name || 'Cliente'}
              </Text>
              <Text style={styles.requestDate}>
                {new Date(request.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                <Text style={styles.statusText}>
                  {request.status === 'pending' ? 'Pendiente' :
                   request.status === 'accepted' ? 'Aceptada' :
                   request.status === 'rejected' ? 'Rechazada' :
                   request.status === 'in_progress' ? 'En Progreso' :
                   request.status === 'completed' ? 'Completada' : 'Pendiente'}
                </Text>
              </View>
              <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(request.urgency_level) }]}>
                <Text style={styles.urgencyText}>
                  {request.urgency_level === 'emergency' ? 'Emergencia' :
                   request.urgency_level === 'high' ? 'Alta' :
                   request.urgency_level === 'normal' ? 'Normal' :
                   request.urgency_level === 'low' ? 'Baja' : 'Normal'}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.problemTitle}>Problema:</Text>
          <Text style={styles.problemDescription}>{request.problem_description}</Text>

          <Text style={styles.vehicleTitle}>Vehículo:</Text>
          <Text style={styles.vehicleInfo}>{request.vehicle_info}</Text>

          {request.location_lat && request.location_lng && (
            <View style={styles.locationContainer}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
              <Text style={styles.locationText}>
                Ubicación: {request.location_lat.toFixed(4)}, {request.location_lng.toFixed(4)}
              </Text>
            </View>
          )}

          <View style={styles.requestActionsRow}>
            {request.status === 'pending' && (
              <>
                <Button
                  mode="outlined"
                  onPress={() => handleAcceptRequest(request)}
                  style={[styles.actionButton, styles.acceptButton]}
                  labelStyle={styles.acceptButtonText}
                >
                  Aceptar
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleRejectRequest(request)}
                  style={[styles.actionButton, styles.rejectButton]}
                  labelStyle={styles.rejectButtonText}
                >
                  Rechazar
                </Button>
                {!request.has_quote && (
                  <Button
                    mode="contained"
                    onPress={() => handleSendQuote(request)}
                    style={[styles.actionButton, styles.quoteButton]}
                    labelStyle={styles.quoteButtonText}
                  >
                    Enviar Cotización
                  </Button>
                )}
              </>
            )}
            
            {request.status === 'accepted' && !request.has_quote && (
              <Button
                mode="contained"
                onPress={() => handleSendQuote(request)}
                style={[styles.actionButton, styles.quoteButton]}
                labelStyle={styles.quoteButtonText}
              >
                Enviar Cotización
              </Button>
            )}

            {request.has_quote && (
              <View style={styles.quoteSentContainer}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.quoteSentText}>Cotización enviada</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Obtener servicios configurados del trabajador
  const getWorkerServices = () => {
    if (!workerProfile || !workerProfile.services) return [];
    try {
      return JSON.parse(workerProfile.services);
    } catch (error) {
      console.error('Error parseando servicios:', error);
      return [];
    }
  };

  // Contar solicitudes solo por los servicios configurados
  const workerServices = getWorkerServices();
  const mechanicRequests = workerServices.includes('mecanico') ? 
    requests.filter(req => req.service_type === 'mecanico').length : 0;
  const craneRequests = workerServices.includes('grua') ? 
    requests.filter(req => req.service_type === 'grua').length : 0;
  const storeRequests = workerServices.includes('repuestos') ? 
    requests.filter(req => req.service_type === 'repuestos').length : 0;

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
          <Text style={styles.title}>Solicitudes de Servicio</Text>
          <Text style={styles.subtitle}>Gestiona las solicitudes de los clientes y envía cotizaciones.</Text>

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

          {!loading && !error && requests.length > 0 && (
            <View style={styles.requestsList}>
              {requests.map(renderRequest)}
            </View>
          )}

          {!loading && !error && requests.length === 0 && (
            <View style={styles.noRequestsContainer}>
              <MaterialCommunityIcons name="clipboard-text" size={48} color="#4CAF50" />
              <Text style={styles.noRequestsText}>No hay solicitudes pendientes</Text>
              <Text style={styles.noRequestsSubtext}>
                Las solicitudes aparecerán aquí cuando los clientes las envíen
              </Text>
            </View>
          )}

          {workerServices.length === 0 && (
            <View style={styles.noServicesContainer}>
              <MaterialCommunityIcons name="alert-circle" size={48} color="#FF9800" />
              <Text style={styles.noServicesText}>No tienes servicios configurados</Text>
              <Text style={styles.noServicesSubtext}>
                Ve a "Perfil de servicios" para configurar los servicios que ofreces
              </Text>
            </View>
          )}
        </View>

        {/* Modal de Cotización */}
        <QuoteModal
          visible={quoteModalVisible}
          onClose={() => setQuoteModalVisible(false)}
          request={selectedRequest}
          onQuoteSent={handleQuoteSent}
        />
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
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262525',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    width: '100%',
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    position: 'relative',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFD6B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textBox: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFD6B8',
    marginBottom: 2,
  },
  serviceSubText: {
    fontSize: 13,
    color: '#FFD6B8',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  badge: {
    backgroundColor: '#FC5501',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
    marginLeft: 8,
    marginRight: 4,
    minWidth: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
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
  noServicesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noServicesText: {
    color: '#C24100',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  noServicesSubtext: {
    color: '#C24100',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  noRequestsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noRequestsText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  noRequestsSubtext: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  requestCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    backgroundColor: '#262525',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clientInfo: {
    flex: 1,
    marginRight: 10,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD6B8',
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 13,
    color: '#FFD6B8',
    opacity: 0.8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  urgencyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  urgencyText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD6B8',
    marginBottom: 5,
  },
  problemDescription: {
    fontSize: 14,
    color: '#FFD6B8',
    marginBottom: 10,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD6B8',
    marginBottom: 5,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#FFD6B8',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 13,
    color: '#FFD6B8',
    opacity: 0.8,
    marginLeft: 5,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    minWidth: 110,
    maxWidth: 120,
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 8,
    paddingVertical: 8,
    flex: 0,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  rejectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quoteButton: {
    backgroundColor: '#FC5501',
    borderColor: '#FC5501',
  },
  quoteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  requestsList: {
    width: '100%',
  },
  requestActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  quoteSentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    flex: 1,
    justifyContent: 'center',
  },
  quoteSentText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },

});
