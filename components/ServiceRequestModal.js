import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Button, Card, Avatar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import * as Location from 'expo-location';

const ServiceRequestModal = ({ visible, onClose, mechanic, onRequestSent }) => {
  const { token, user } = useAuth();
  const [problemDescription, setProblemDescription] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [urgency, setUrgency] = useState('normal'); // low, normal, high, emergency
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  const urgencyOptions = [
    { key: 'low', label: 'Baja', color: '#4CAF50', icon: 'clock-outline' },
    { key: 'normal', label: 'Normal', color: '#FF9800', icon: 'clock' },
    { key: 'high', label: 'Alta', color: '#F44336', icon: 'clock-alert' },
    { key: 'emergency', label: 'Emergencia', color: '#D32F2F', icon: 'car-emergency' }
  ];

  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso para acceder a la ubicación');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
      
      Alert.alert('Éxito', 'Ubicación obtenida correctamente');
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const sendServiceRequest = async () => {
    if (!problemDescription.trim()) {
      Alert.alert('Error', 'Por favor describe el problema con tu vehículo');
      return;
    }

    if (!vehicleInfo.trim()) {
      Alert.alert('Error', 'Por favor ingresa la información de tu vehículo');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Por favor obtén tu ubicación actual');
      return;
    }

    try {
      setIsLoading(true);

      const requestData = {
        worker_id: mechanic.id,
        client_id: user.id,
        service_type: 'mecanico',
        problem_description: problemDescription,
        vehicle_info: vehicleInfo,
        urgency_level: urgency,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        status: 'pending'
      };

      console.log('🚀 Enviando solicitud con datos:', JSON.stringify(requestData, null, 2));

      const response = await fetch('${API_BASE_URL}/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      console.log('📥 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('📥 Datos de respuesta:', JSON.stringify(result, null, 2));
        
        if (result.success) {
          Alert.alert(
            'Solicitud Enviada',
            'Tu solicitud de servicio ha sido enviada al mecánico. Te notificaremos cuando responda.',
            [
              {
                text: 'OK',
                onPress: () => {
                  onRequestSent(result.data);
                  onClose();
                  // Limpiar formulario
                  setProblemDescription('');
                  setVehicleInfo('');
                  setUrgency('normal');
                  setLocation(null);
                }
              }
            ]
          );
        } else {
          Alert.alert('Error', result.message || 'No se pudo enviar la solicitud');
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        Alert.alert('Error', 'No se pudo enviar la solicitud');
      }
    } catch (error) {
      console.error('❌ Error enviando solicitud:', error);
      Alert.alert('Error', 'No se pudo enviar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#FC5501', '#C24100']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.mechanicInfo}>
              <Avatar.Text size={40} label={mechanic?.name?.charAt(0) || 'M'} style={styles.avatar} />
              <View style={styles.mechanicDetails}>
                <Text style={styles.mechanicName}>{mechanic?.name || 'Mecánico'}</Text>
                <Text style={styles.mechanicStatus}>Solicitar Servicio</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Descripción del Problema</Text>
              <TextInput
                style={styles.textArea}
                value={problemDescription}
                onChangeText={setProblemDescription}
                placeholder="Describe detalladamente el problema con tu vehículo..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Información del Vehículo</Text>
              <TextInput
                style={styles.textInput}
                value={vehicleInfo}
                onChangeText={setVehicleInfo}
                placeholder="Marca, modelo, año, color..."
                placeholderTextColor="#999"
                maxLength={200}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Nivel de Urgencia</Text>
              <View style={styles.urgencyContainer}>
                {urgencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.urgencyChip,
                      urgency === option.key && styles.urgencyChipSelected,
                      { borderColor: option.color }
                    ]}
                    onPress={() => setUrgency(option.key)}
                  >
                    <Icon 
                      name={option.icon} 
                      size={16} 
                      color={urgency === option.key ? 'white' : option.color} 
                    />
                    <Text style={[
                      styles.urgencyText,
                      urgency === option.key && styles.urgencyTextSelected,
                      { color: urgency === option.key ? 'white' : option.color }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Ubicación</Text>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={getCurrentLocation}
                disabled={isGettingLocation}
              >
                <Icon 
                  name={isGettingLocation ? "loading" : "map-marker"} 
                  size={20} 
                  color="white" 
                />
                <Text style={styles.locationButtonText}>
                  {isGettingLocation ? 'Obteniendo ubicación...' : 'Obtener ubicación actual'}
                </Text>
              </TouchableOpacity>
              
              {location && (
                <View style={styles.locationInfo}>
                  <Icon name="check-circle" size={16} color="#4CAF50" />
                  <Text style={styles.locationText}>
                    Ubicación obtenida: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={sendServiceRequest}
            loading={isLoading}
            disabled={isLoading || !problemDescription.trim() || !vehicleInfo.trim() || !location}
            style={styles.sendButton}
            labelStyle={styles.sendButtonText}
          >
            Enviar Solicitud
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    marginRight: 16,
    padding: 4,
  },
  mechanicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  mechanicDetails: {
    marginLeft: 12,
  },
  mechanicName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mechanicStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  urgencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  urgencyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  urgencyChipSelected: {
    backgroundColor: '#FC5501',
    borderColor: '#FC5501',
  },
  urgencyText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  urgencyTextSelected: {
    color: 'white',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FC5501',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  locationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2E7D32',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sendButton: {
    backgroundColor: '#FC5501',
    borderRadius: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceRequestModal; 
