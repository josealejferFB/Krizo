import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient'; // Importar LinearGradient

// Importa tu componente Layout que envuelve esta pantalla
import Layout from '../components/Layout.js';

const { width: viewportWidth } = Dimensions.get('window');

// --- Datos para las tarjetas del carrusel ---
const carouselData = [
  {
    id: '1',
    image: require('../assets/card_image_4.png'),
    title: 'Reparaciones del Hogar',
    description: 'Soluciones rápidas para el mantenimiento de tu casa.',
  },
  {
    id: '2',
    image: require('../assets/card_image_4.png'),
    title: 'Mantenimiento de Jardines',
    description: 'Servicios de jardinería profesional a tu alcance.',
  },
  {
    id: '3',
    image: require('../assets/card_image_4.png'),
    title: 'Servicios de Limpieza',
    description: 'Limpieza profunda para tu hogar u oficina.',
  },
  {
    id: '4',
    image: require('../assets/card_image_4.png'),
    title: 'Asistencia Vial Profesional',
    description: 'Ayuda inmediata en carretera para cualquier emergencia.',
  },
];

// --- Datos de ejemplo para el vehículo del usuario ---
const vehicleInfo = {
  make: 'Toyota',
  model: 'Corolla',
  year: 2020,
  plate: 'ABC-123',
  color: 'Negro',
};

export default function HomeScreen({ navigation }) {
  const carouselRef = useRef(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Card.Content style={styles.cardContent}>
        <Title style={styles.cardTitle}>{item.title}</Title>
        <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  const goToNextPage = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const goToPrevPage = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login'); // Redirige a la pantalla de Login
  };

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FC5501" />
        
        {/* Sección Superior: Bienvenida, Perfil y Botón de Cerrar Sesión */}
        <View style={styles.headerSection}>
          <View style={styles.profileInfo}>
            <View style={styles.userIconContainer}>
              <MaterialCommunityIcons name="account-circle" size={70} color="white" />
            </View>
            <View>
              <Text style={styles.welcomeTextSmall}>Bienvenido,</Text>
              <Text style={styles.userNameText}>Usuario</Text>
            </View>
          </View>
          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Salir</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de Carrusel de Servicios */}
        <View style={styles.carouselSection}>
          <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
          <View style={styles.carouselWrapper}>
            {/* Flechas del Carrusel ahora en color blanco */}
            <TouchableOpacity onPress={goToPrevPage} style={styles.arrowButton}>
              <MaterialCommunityIcons name="chevron-left-circle" size={35} color="white" /> 
            </TouchableOpacity>

            <Carousel
              ref={carouselRef}
              width={viewportWidth * 0.78}
              height={viewportWidth * 0.8}
              data={carouselData}
              renderItem={renderItem}
              loop={true}
              onProgressChange={(_, absoluteProgress) => {
                setCurrentCarouselIndex(Math.round(absoluteProgress));
              }}
              style={styles.carousel}
            />

            <TouchableOpacity onPress={goToNextPage} style={styles.arrowButton}>
              <MaterialCommunityIcons name="chevron-right-circle" size={35} color="white" /> 
            </TouchableOpacity>
          </View>

          {/* Indicadores de Paginación (puntos debajo del carrusel) ahora en blanco */}
          <View style={styles.paginationDots}>
            {carouselData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { opacity: index === currentCarouselIndex % carouselData.length ? 1 : 0.4, backgroundColor: 'white' }, // Puntos en blanco
                ]}
              />
            ))}
          </View>
        </View>

        {/* Nueva Sección: Información de Mi Vehículo con degradado */}
        <View style={styles.vehicleInfoSection}>
          <Text style={styles.sectionTitle}>Mi Vehículo</Text>
          {/* Usamos LinearGradient como fondo de la tarjeta de información */}
          <LinearGradient
            colors={['#FF8C00', '#FF4500']} // De naranja a naranja oscuro/rojo anaranjado
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoCardGradient} // Nuevo estilo para el gradiente
          >
            <MaterialCommunityIcons name="car" size={35} color="white" style={styles.carIcon} />
            <View style={styles.infoDetails}>
              <Text style={styles.infoText}>**Marca:** {vehicleInfo.make}</Text>
              <Text style={styles.infoText}>**Modelo:** {vehicleInfo.model}</Text>
              <Text style={styles.infoText}>**Año:** {vehicleInfo.year}</Text>
              <Text style={styles.infoText}>**Matrícula:** {vehicleInfo.plate}</Text>
              <Text style={styles.infoText}>**Color:** {vehicleInfo.color}</Text>
            </View>
          </LinearGradient>
        </View>

      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 10,
  },
  welcomeTextSmall: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  userNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'white',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  carouselSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  carouselWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  carousel: {
    flexGrow: 0,
    width: viewportWidth * 0.78,
    height: viewportWidth * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: 8,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardImage: {
    width: '100%',
    height: '55%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
    backgroundColor: 'white',
    height: '45%',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    // backgroundColor: 'white', // YA ESTÁ DEFINIDO INLINE EN EL JSX
    marginHorizontal: 3,
  },
  // --- Estilos para la Nueva Sección de Información del Vehículo ---
  vehicleInfoSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  infoCardGradient: { // Nuevo estilo para el LinearGradient
    borderRadius: 12,
    padding: 15,
    width: '100%',
    maxWidth: 400,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    flexDirection: 'row', // Para alinear icono y texto
    alignItems: 'center',
  },
  carIcon: {
    marginRight: 10,
  },
  infoDetails: {
    flex: 1,
  },
  infoText: {
    color: 'white', // Texto en blanco para contraste con el fondo naranja
    fontSize: 14,
    marginBottom: 3,
  },
});