import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Card, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';

export default function LocationRequestModal({ visible, onClose, onConfirm, mechanic }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos de ubicación',
          'Necesitamos acceso a tu ubicación para que el mecánico pueda llegar hasta ti.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configuración', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        return;
      }

      // Obtener ubicación actual
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      setLocation(currentLocation);

      // Obtener dirección a partir de las coordenadas
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addressData = reverseGeocode[0];
        const fullAddress = [
          addressData.street,
          addressData.district,
          addressData.city,
          addressData.region,
          addressData.country
        ].filter(Boolean).join(', ');
        
        setAddress(fullAddress || 'Ubicación actual');
      } else {
        setAddress('Ubicación actual');
      }

    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert(
        'Error de ubicación',
        'No se pudo obtener tu ubicación. Puedes ingresar tu dirección manualmente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!location && !address.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu ubicación o dirección');
      return;
    }

    const locationData = {
      coordinates: location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      } : null,
      address: address.trim(),
      description: description.trim(),
    };

    onConfirm(locationData);
  };

  const handleManualLocation = () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu dirección');
      return;
    }
    handleConfirm();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <ThemedBackgroundGradient>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              {/* Header */}
              <View style={styles.header}>
                <MaterialCommunityIcons name="map-marker" size={32} color="#FC5501" />
                <Text style={styles.title}>Ubicación del Servicio</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Comparte tu ubicación para que {mechanic?.name} pueda llegar hasta ti
              </Text>

              {/* Ubicación actual */}
              <View style={styles.locationSection}>
                <Text style={styles.sectionTitle}>📍 Ubicación Actual</Text>
                
                {locationLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FC5501" />
                    <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
                  </View>
                ) : location ? (
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationText}>{address}</Text>
                    <Text style={styles.coordinatesText}>
                      Lat: {location.coords.latitude.toFixed(6)}, 
                      Lng: {location.coords.longitude.toFixed(6)}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.noLocation}>
                    <MaterialCommunityIcons name="map-marker-off" size={24} color="#999" />
                    <Text style={styles.noLocationText}>No se pudo obtener la ubicación</Text>
                  </View>
                )}

                <Button
                  mode="outlined"
                  onPress={getCurrentLocation}
                  style={styles.refreshButton}
                  icon="refresh"
                  disabled={locationLoading}
                >
                  Actualizar ubicación
                </Button>
              </View>

              {/* Dirección manual */}
              <View style={styles.manualSection}>
                <Text style={styles.sectionTitle}>✏️ Dirección Manual</Text>
                <Text style={styles.sectionSubtitle}>
                  Si prefieres, puedes ingresar tu dirección manualmente
                </Text>
                
                <TextInput
                  mode="outlined"
                  label="Dirección completa"
                  value={address}
                  onChangeText={setAddress}
                  style={styles.addressInput}
                  multiline
                  numberOfLines={3}
                  placeholder="Ej: Av. Principal #123, San Juan de los Morros, Guárico"
                />
              </View>

              {/* Descripción adicional */}
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>📝 Descripción Adicional</Text>
                <Text style={styles.sectionSubtitle}>
                  Agrega detalles para que el mecánico te encuentre más fácilmente
                </Text>
                
                <TextInput
                  mode="outlined"
                  label="Descripción (opcional)"
                  value={description}
                  onChangeText={setDescription}
                  style={styles.descriptionInput}
                  multiline
                  numberOfLines={3}
                  placeholder="Ej: Casa azul con portón blanco, cerca del semáforo"
                />
              </View>

              {/* Botones de acción */}
              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  onPress={onClose}
                  style={styles.cancelButton}
                  labelStyle={styles.cancelButtonLabel}
                >
                  Cancelar
                </Button>
                
                <Button
                  mode="contained"
                  onPress={handleConfirm}
                  style={styles.confirmButton}
                  labelStyle={styles.confirmButtonLabel}
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Confirmar Ubicación'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ThemedBackgroundGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FC5501',
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  locationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262525',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  locationInfo: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  locationText: {
    fontSize: 14,
    color: '#262525',
    fontWeight: '500',
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  noLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  noLocationText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  refreshButton: {
    borderColor: '#FC5501',
    borderWidth: 1,
  },
  manualSection: {
    marginBottom: 24,
  },
  addressInput: {
    backgroundColor: '#fff',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionInput: {
    backgroundColor: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#666',
  },
  cancelButtonLabel: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FC5501',
  },
  confirmButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 