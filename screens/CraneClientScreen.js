import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Button, Avatar, Chip } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CraneClientScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [cranes, setCranes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  // Obtener trabajadores de la ruta o cargar desde API
  useEffect(() => {
    if (route.params?.workers) {
      // Filtrar solo grúas
      const craneWorkers = route.params.workers.filter(
        worker => worker.services.includes('grua')
      );
      setCranes(craneWorkers);
      setLoading(false);
    } else {
      loadCranes();
    }
  }, [route.params]);

  const loadCranes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/workers`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Filtrar solo grúas
          const craneWorkers = result.data.filter(
            worker => worker.services.includes('grua')
          );
          setCranes(craneWorkers);
        }
      }
    } catch (error) {
      console.error('Error cargando grúas:', error);
      Alert.alert('Error', 'No se pudieron cargar las grúas');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => (
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

  const handleRequestService = (crane) => {
    Alert.alert(
      'Solicitar Grúa',
      `¿Deseas solicitar el servicio de grúa de ${crane.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Solicitar', 
          onPress: () => {
            // Aquí se implementaría la lógica para crear la solicitud
            Alert.alert('Éxito', 'Solicitud de grúa enviada correctamente');
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={['#FC5501', '#C24100']} style={styles.container}>
      <View style={styles.headerOrangeContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <View style={styles.backIcon}>
              <Icon name="arrow-left-bold-circle" size={38} color="#FC5501" />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.appBarTitle}>Servicio de Grúa</Text>
            <Icon name="tow-truck" size={24} color="white" style={{ marginLeft: 8 }} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.mechanicsList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FC5501" />
            <Text style={styles.loadingText}>Cargando grúas...</Text>
          </View>
        ) : cranes.length > 0 ? (
          cranes.map((crane) => (
            <Card key={crane.id} style={styles.mechanicCard}>
              <View style={styles.cardContent}>
                <View style={styles.mechanicAvatarContainer}>
                  <Avatar.Icon size={60} icon="truck" style={styles.avatar} color="white" />
                </View>
                <View style={styles.mechanicInfo}>
                  <View style={styles.nameAndFeatured}>
                    <Text style={styles.mechanicName}>{crane.name}</Text>
                    <Chip style={styles.availableChip} textStyle={styles.availableChipText}>
                      Disponible
                    </Chip>
                  </View>
                  <Text style={styles.mechanicSpecialty}>{crane.descripcion}</Text>
                  <Text style={styles.mechanicLocation}>{crane.ciudad} - {crane.zona}</Text>
                  <Text style={styles.mechanicAvailability}>Disponibilidad: {crane.disponibilidad}</Text>
                </View>
              </View>
              <Button
                mode="contained"
                onPress={() => handleRequestService(crane)}
                style={styles.requestButton}
                labelStyle={styles.requestButtonLabel}
              >
                Solicitar
              </Button>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="tow-truck" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay grúas disponibles</Text>
            <Text style={styles.emptySubtext}>Intenta más tarde</Text>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    maxWidth: 370,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 10,
    borderWidth: 2,
    top: 0,
    position: 'relative',
    borderColor: '#FC5501',
    marginRight: 10,
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
    padding: 2,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 0,
  },
  appBarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mechanicsList: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  mechanicCard: {
    width: '92%',
    maxWidth: 370,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  mechanicAvatarContainer: {
    position: 'relative',
    marginRight: 12,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#FC5501',
    marginBottom: 5,
  },
  mechanicInfo: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mechanicName: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 2,
    color: '#222',
  },
  mechanicSpecialty: {
    fontSize: 13,
    color: '#666',
    textAlign: 'left',
    marginBottom: 5,
  },
  mechanicImage: {
    width: 120,
    height: 80,
    borderRadius: 5,
    resizeMode: 'cover',
    marginBottom: 10,
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  mechanicExperience: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  requestButton: {
    backgroundColor: '#FC5501',
    borderRadius: 20,
    width: '96%',
    alignSelf: 'center',
    paddingVertical: 7,
    marginTop: 5,
  },
  requestButtonLabel: {
    color: 'white',
    fontSize: 16,
  },
  featuredChipContainer: {
    position: 'absolute',
    top: -14,
    right: -14,
    zIndex: 20,
    elevation: 10,
  },
  featuredChip: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  featuredChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
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
  nameAndFeatured: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
});

export default CraneClientScreen;
