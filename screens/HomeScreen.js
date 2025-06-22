import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';

// Importa tu componente Layout que envuelve esta pantalla
import Layout from '../components/Layout.js';

const { width: viewportWidth } = Dimensions.get('window');

// --- Datos para las tarjetas del carrusel ---
const carouselData = [
  {
    id: '1',
    image: require('../assets/card_image_4.png'),
    title: 'Reparaciones del Hogar',
    description: 'Servicios rápidos y eficientes para tu auto.',
  },
  {
    id: '2',
    image: require('../assets/card_image_4.png'),
    title: 'Mantenimiento de Jardines',
    description: 'Deja tu vehículo impecable con nuestros expertos.',
  },
  {
    id: '3',
    image: require('../assets/card_image_4.png'),
    title: 'Servicios de Limpieza',
    description: 'Servicio de grúa 24/7.',
  },
  {
    id: '4',
    image: require('../assets/card_image_4.png'),
    title: 'Asistencia Vial Profesional',
    description: 'Soluciones rápidas para cualquier emergencia en carretera.',
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
        
        {/* Sección Superior: Bienvenida y Perfil */}
        <View style={styles.headerSection}>
          <View style={styles.profileInfo}>
            <View style={styles.userIconContainer}>
              <MaterialCommunityIcons name="account-circle" size={70} color="white" /> {/* Tamaño reducido */}
            </View>
            <View>
              <Text style={styles.welcomeTextSmall}>Bienvenido,</Text>
              <Text style={styles.userNameText}>Usuario</Text>
            </View>
          </View>
          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={20} color="white" /> {/* Tamaño reducido */}
            <Text style={styles.logoutButtonText}>Salir</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de Carrusel de Servicios */}
        <View style={styles.carouselSection}>
          <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
          <View style={styles.carouselWrapper}>
            <TouchableOpacity onPress={goToPrevPage} style={styles.arrowButton}>
              <MaterialCommunityIcons name="chevron-left-circle" size={35} color="#262525" /> {/* Tamaño reducido */}
            </TouchableOpacity>

            <Carousel
              ref={carouselRef}
              width={viewportWidth * 0.78} // Ancho ligeramente aumentado para compensar
              height={viewportWidth * 0.8} // <--- AJUSTE CLAVE: Altura reducida
              data={carouselData}
              renderItem={renderItem}
              loop={true}
              onProgressChange={(_, absoluteProgress) => {
                setCurrentCarouselIndex(Math.round(absoluteProgress));
              }}
              style={styles.carousel}
            />

            <TouchableOpacity onPress={goToNextPage} style={styles.arrowButton}>
              <MaterialCommunityIcons name="chevron-right-circle" size={35} color="#262525" /> {/* Tamaño reducido */}
            </TouchableOpacity>
          </View>

          <View style={styles.paginationDots}>
            {carouselData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { opacity: index === currentCarouselIndex % carouselData.length ? 1 : 0.4 },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Nueva Sección: Información de Mi Vehículo */}
        <View style={styles.vehicleInfoSection}>
          <Text style={styles.sectionTitle}>Mi Vehículo</Text>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="car" size={35} color="white" style={styles.carIcon} /> {/* Tamaño reducido */}
            <View style={styles.infoDetails}>
              <Text style={styles.infoText}>Marca: {vehicleInfo.make}</Text>
              <Text style={styles.infoText}>Modelo: {vehicleInfo.model}</Text>
              <Text style={styles.infoText}>Año: {vehicleInfo.year}</Text>
              <Text style={styles.infoText}>Matrícula: {vehicleInfo.plate}</Text>
              <Text style={styles.infoText}>Color: {vehicleInfo.color}</Text>
            </View>
          </View>
        </View>

      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 10, // <--- AJUSTE CLAVE: Muy reducido para subir todo
    paddingHorizontal: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15, // <--- AJUSTE CLAVE: Reducido para comprimir
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 80, // <--- AJUSTE CLAVE: Reducido
    height: 80, // <--- AJUSTE CLAVE: Reducido
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 10, // <--- AJUSTE CLAVE: Reducido
  },
  welcomeTextSmall: {
    fontSize: 16, // Ligeramente más pequeño
    color: 'white',
    opacity: 0.8,
  },
  userNameText: {
    fontSize: 22, // Ligeramente más pequeño
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6, // <--- AJUSTE CLAVE: Reducido
    paddingHorizontal: 10, // <--- AJUSTE CLAVE: Reducido
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'white',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14, // Ligeramente más pequeño
    fontWeight: '600',
    marginLeft: 5,
  },
  carouselSection: {
    alignItems: 'center',
    marginBottom: 20, // <--- AJUSTE CLAVE: Reducido
  },
  sectionTitle: {
    fontSize: 20, // Ligeramente más pequeño
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15, // <--- AJUSTE CLAVE: Reducido
    textAlign: 'center',
  },
  carouselWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10, // <--- AJUSTE CLAVE: Reducido
  },
  carousel: {
    flexGrow: 0,
    width: viewportWidth * 0.78, // Ligeramente más ancho para aprovechar el espacio horizontal
    height: viewportWidth * 0.8, // <--- AJUSTE CLAVE: Altura reducida
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: 8, // <--- AJUSTE CLAVE: Reducido
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12, // Ligeramente más pequeños los bordes
    elevation: 4, // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardImage: {
    width: '100%',
    height: '55%', // <--- AJUSTE CLAVE: Imagen un poco más pequeña
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12, // <--- AJUSTE CLAVE: Padding reducido
    backgroundColor: 'white',
    height: '45%', // <--- AJUSTE CLAVE: Contenido de texto un poco más grande
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16, // Ligeramente más pequeño
    fontWeight: 'bold',
    marginBottom: 3, // <--- AJUSTE CLAVE: Margen reducido
    color: '#333',
  },
  cardDescription: {
    fontSize: 12, // Ligeramente más pequeño
    color: '#666',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5, // <--- AJUSTE CLAVE: Reducido
  },
  dot: {
    width: 8, // <--- AJUSTE CLAVE: Reducido
    height: 8, // <--- AJUSTE CLAVE: Reducido
    borderRadius: 4,
    backgroundColor: '#262525',
    marginHorizontal: 3, // <--- AJUSTE CLAVE: Reducido
  },
  // --- Estilos para la Nueva Sección de Información del Vehículo ---
  vehicleInfoSection: {
    alignItems: 'center',
    marginBottom: 20, // <--- AJUSTE CLAVE: Reducido (se ajusta al final de la pantalla)
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12, // Ligeramente más pequeños los bordes
    padding: 15, // <--- AJUSTE CLAVE: Padding reducido
    width: '100%',
    maxWidth: 400,
    borderColor: 'white',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  carIcon: {
    marginRight: 10, // <--- AJUSTE CLAVE: Reducido
  },
  infoDetails: {
    flex: 1,
  },
  infoText: {
    color: 'white',
    fontSize: 14, // Ligeramente más pequeño
    marginBottom: 3, // <--- AJUSTE CLAVE: Margen reducido
  },
});