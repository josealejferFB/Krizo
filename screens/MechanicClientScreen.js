import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Appbar, Text, Card, Button, Avatar, Chip } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Linking from 'expo-linking';
import LocationRequestModal from './LocationRequestModal';
import ChatModal from '../components/ChatModal';
import ServiceRequestModal from '../components/ServiceRequestModal';
import { useAuth } from '../context/AuthContext';

const MechanicServiceRN = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token, user } = useAuth();
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [serviceRequestModalVisible, setServiceRequestModalVisible] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  // Obtener trabajadores de la ruta o cargar desde API
  useEffect(() => {
    if (route.params?.workers) {
      // Filtrar solo mecánicos
      const mechanicWorkers = route.params.workers.filter(
        worker => worker.services.includes('mecanico')
      );
      setMechanics(mechanicWorkers);
      setLoading(false);
    } else {
      loadMechanics();
    }
  }, [route.params]);

  const loadMechanics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/workers`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Filtrar solo mecánicos
          const mechanicWorkers = result.data.filter(
            worker => worker.services.includes('mecanico')
          );
          setMechanics(mechanicWorkers);
        }
      }
    } catch (error) {
      console.error('Error cargando mecánicos:', error);
      Alert.alert('Error', 'No se pudieron cargar los mecánicos');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name={i < rating ? 'star' : 'star-outline'}
            size={20}
            color={i < rating ? 'gold' : '#ccc'}
          />
        ))}
      </View>
    );
  };

  const handleRequestService = (mechanic) => {
    setSelectedMechanic(mechanic);
    setServiceRequestModalVisible(true);
  };

  const handleServiceRequestSent = (requestData) => {
    setServiceRequestModalVisible(false);
    setCurrentRequestId(requestData.id);
    
    // Mostrar mensaje de confirmación
    Alert.alert(
      'Solicitud Enviada',
      'Tu solicitud ha sido enviada al mecánico. Te notificaremos cuando responda.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Opcional: abrir chat directamente
            setChatModalVisible(true);
          }
        }
      ]
    );
  };

  const handleChatConfirm = (agreedPrice) => {
    setChatModalVisible(false);
    // Abrir modal de ubicación después del chat
    setLocationModalVisible(true);
    // Guardar el precio acordado
    setServiceDetails(prev => ({
      ...prev,
      agreedPrice: agreedPrice
    }));
  };

  const handleLocationConfirm = async (locationData) => {
    try {
      setLocationModalVisible(false);
      
      // Combinar datos de ubicación con precio acordado
      const finalServiceDetails = {
        ...locationData,
        agreedPrice: serviceDetails?.agreedPrice
      };

      // Crear la solicitud con el precio acordado
      const requestData = {
        client_id: 4, // ID del cliente Santo Delgado
        worker_id: selectedMechanic.id,
        service_type: 'mecanico',
        description: locationData.description || 'Solicitud de servicio mecánico',
        client_location: locationData.address,
        client_phone: '04243031238',
        client_name: 'Santo Delgado',
        worker_name: selectedMechanic.name,
        coordinates: locationData.coordinates,
        agreed_price: finalServiceDetails.agreedPrice
      };

      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (response.ok) {
        // Navegar a la pantalla de pago con el precio acordado
        navigation.navigate('PaymentScreen', {
          mechanic: selectedMechanic,
          serviceDetails: finalServiceDetails
        });
      } else {
        Alert.alert('Error', result.error || 'No se pudo crear la solicitud');
      }
    } catch (error) {
      console.error('Error procesando ubicación:', error);
      Alert.alert('Error', 'No se pudo procesar la ubicación. Inténtalo de nuevo.');
    }
  };

  const handleCallMechanic = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert('Error', 'No hay número de teléfono disponible');
      return;
    }

    Alert.alert(
      'Llamar al Mecánico',
      `¿Deseas llamar a ${phoneNumber}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Llamar', 
          onPress: () => {
            const phoneUrl = `tel:${phoneNumber}`;
            Linking.openURL(phoneUrl).catch(() => {
              Alert.alert('Error', 'No se pudo realizar la llamada');
            });
          }
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#FC5501', '#C24100']}
      style={styles.container}
    >
      <View style={styles.headerOrangeContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon
              name="arrow-left-bold-circle"
              size={38}
              color="#FC5501"
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.appBarTitle}>Mecánico a Domicilio</Text>
          </View>
          <Icon style={{ marginLeft: 30 }} name="tools" size={24} color="white" />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.mechanicsList}>
      
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FC5501" />
            <Text style={styles.loadingText}>Cargando mecánicos...</Text>
          </View>
        ) : mechanics.length > 0 ? (
          mechanics.map((mechanic) => (
            <Card key={mechanic.id} style={styles.mechanicCard}>
              <View style={styles.cardContent}>
                <Avatar.Icon size={60} icon="account" style={styles.avatar} color="white" />
                <View style={styles.mechanicInfo}>
                  <Text style={styles.mechanicName}>{mechanic.name}</Text>
                  <Text style={styles.mechanicSpecialty}>Mecánico Profesional</Text>
                  {renderStars(mechanic.rating || 4)}
                  <View style={styles.mechanicStats}>
                    <Text style={styles.mechanicStat}>⭐ {mechanic.rating || 4.5}</Text>
                    <Text style={styles.mechanicStat}>🔧 {mechanic.completedServices || 150} servicios</Text>
                  </View>
                </View>
                <View style={styles.mechanicActions}>
                  <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => {
                      setSelectedMechanic(mechanic);
                      setChatModalVisible(true);
                    }}
                  >
                    <Icon name="chat" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => handleCallMechanic(mechanic.telefono)}
                  >
                    <Icon name="phone" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.cardActions}>
                <Button
                  mode="contained"
                  onPress={() => handleRequestService(mechanic)}
                  style={styles.requestButton}
                  labelStyle={styles.requestButtonText}
                >
                  Solicitar Servicio
                </Button>
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="tools" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay mecánicos disponibles</Text>
            <Text style={styles.emptySubtext}>Intenta más tarde</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Solicitud de Servicio */}
      <ServiceRequestModal
        visible={serviceRequestModalVisible}
        onClose={() => setServiceRequestModalVisible(false)}
        mechanic={selectedMechanic}
        onRequestSent={handleServiceRequestSent}
      />

      {/* Modal de Chat */}
      <ChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
        mechanic={selectedMechanic}
        onConfirmService={handleChatConfirm}
        userType="client"
      />

      {/* Modal de Ubicación */}
      <LocationRequestModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onConfirm={handleLocationConfirm}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOrangeContainer: {
    width: '100%',
    marginBottom: 18,
    borderRadius: 22,
    overflow: 'hidden',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 3,
    borderWidth: 2,
    top: 5,
    position: 'relative',
    borderColor: '#FC5501',
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 30,
  },
  mechanicsList: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  mechanicCard: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    backgroundColor: '#ccc',
    marginRight: 15,
  },
  mechanicInfo: {
    flex: 1,
  },
  nameAndFeatured: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  featuredChip: {
    backgroundColor: '#ffd700',
    height: 30,
  },
  featuredChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  mechanicSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ratingAndPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  mechanicPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  mechanicExperience: {
    fontSize: 12,
    color: '#888',
  },
  requestButton: {
    backgroundColor: '#FC5501',
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  requestButtonLabel: {
    color: 'white',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FC5501',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  availableChip: {
    backgroundColor: '#4CAF50',
    height: 30,
  },
  availableChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  mechanicLocation: {
    fontSize: 13,
    color: '#888',
    marginBottom: 3,
  },
  mechanicAvailability: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  mechanicPhone: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 3,
  },
  mechanicActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  chatButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  callButton: {
    backgroundColor: '#28a745',
    borderRadius: 20,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  cardActions: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  requestButtonText: {
    color: 'white',
    fontSize: 16,
  },
  mechanicStats: {
    flexDirection: 'row',
    marginTop: 5,
  },
  mechanicStat: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
});

export default MechanicServiceRN;
