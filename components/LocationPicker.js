import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Text, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LocationPicker = ({ onLocationSelected, showMap = false }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Solicitar permisos de ubicación
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Se requieren permisos de ubicación para esta función');
        return false;
      }
      return true;
    } catch (err) {
      setError('Error solicitando permisos de ubicación');
      return false;
    }
  };

  // Obtener ubicación actual
  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
        maximumAge: 10000,
      });

      const { latitude, longitude } = currentLocation.coords;
      
      setLocation({
        latitude,
        longitude,
        timestamp: currentLocation.timestamp
      });

      if (onLocationSelected) {
        onLocationSelected({
          latitude,
          longitude,
          timestamp: currentLocation.timestamp
        });
      }

    } catch (err) {
      console.error('Error obteniendo ubicación:', err);
      setError('No se pudo obtener tu ubicación. Verifica que el GPS esté activado.');
    } finally {
      setLoading(false);
    }
  };

  // Obtener dirección desde coordenadas
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        return {
          street: address.street || '',
          city: address.city || '',
          state: address.region || '',
          zipCode: address.postalCode || '',
          country: address.country || ''
        };
      }
      return null;
    } catch (err) {
      console.error('Error obteniendo dirección:', err);
      return null;
    }
  };

  // Formatear coordenadas para mostrar
  const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="map-marker" size={24} color="#FC5501" />
        <Text style={styles.title}>Ubicación</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={20} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {location ? (
        <View style={styles.locationInfo}>
          <View style={styles.coordinatesContainer}>
            <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#4caf50" />
            <Text style={styles.coordinatesText}>
              {formatCoordinates(location.latitude, location.longitude)}
            </Text>
          </View>
          
          <Button
            mode="outlined"
            onPress={getCurrentLocation}
            loading={loading}
            style={styles.updateButton}
            icon="refresh"
          >
            Actualizar ubicación
          </Button>
        </View>
      ) : (
        <View style={styles.noLocation}>
          <MaterialCommunityIcons name="map-marker-off" size={48} color="#9e9e9e" />
          <Text style={styles.noLocationText}>
            No se ha obtenido la ubicación
          </Text>
          <Button
            mode="contained"
            onPress={getCurrentLocation}
            loading={loading}
            style={styles.getLocationButton}
            icon="crosshairs-gps"
          >
            Obtener mi ubicación
          </Button>
        </View>
      )}

      {showMap && location && (
        <View style={styles.mapPlaceholder}>
          <MaterialCommunityIcons name="map" size={48} color="#9e9e9e" />
          <Text style={styles.mapText}>
            Mapa interactivo aquí
          </Text>
          <Text style={styles.mapSubtext}>
            (Integrar con react-native-maps)
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#262525',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#d32f2f',
    marginLeft: 8,
    flex: 1,
  },
  locationInfo: {
    alignItems: 'center',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  coordinatesText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginLeft: 8,
    color: '#4caf50',
  },
  updateButton: {
    borderColor: '#FC5501',
    borderWidth: 1,
  },
  noLocation: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noLocationText: {
    fontSize: 16,
    color: '#9e9e9e',
    marginTop: 8,
    marginBottom: 16,
  },
  getLocationButton: {
    backgroundColor: '#FC5501',
  },
  mapPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  mapText: {
    fontSize: 16,
    color: '#9e9e9e',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#bdbdbd',
    marginTop: 4,
  },
});

export default LocationPicker; 