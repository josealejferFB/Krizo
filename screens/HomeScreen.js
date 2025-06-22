import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';

// Importa tu componente Layout que envuelve esta pantalla
import Layout from '../components/Layout.js';

const { width: viewportWidth } = Dimensions.get('window'); // Obtener el ancho de la ventana del dispositivo

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

export default function HomeScreen({ navigation }) {
  const carouselRef = useRef(null); // Referencia para controlar el carrusel programáticamente
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0); // Estado para el índice actual de la tarjeta visible

  // Función para renderizar cada tarjeta del carrusel
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Card.Content style={styles.cardContent}>
        <Title style={styles.cardTitle}>{item.title}</Title>
        <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  // Funciones para navegar en el carrusel con los botones de flecha
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

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FC5501" /> {/* Asegura que la barra de estado se vea bien con el color naranja */}
        
        {/* Icono de usuario circular */}
        <View style={styles.userIconContainer}>
          <MaterialCommunityIcons name="account-circle" size={100} color="white" />
        </View>

        {/* Sección de Bienvenida al Usuario */}
        <Text style={styles.welcomeText}>Bienvenido, Usuario</Text>

        {/* --- Contenedor del Carrusel y sus botones de navegación --- */}
        <View style={styles.carouselWrapper}>
          {/* Botón de flecha izquierda */}
          <TouchableOpacity onPress={goToPrevPage} style={styles.arrowButton}>
            <MaterialCommunityIcons name="chevron-left-circle" size={40} color="#262525" />
          </TouchableOpacity>

          {/* Componente Carrusel */}
          <Carousel
            ref={carouselRef}
            width={viewportWidth * 0.75}
            height={viewportWidth * 0.9}
            data={carouselData}
            renderItem={renderItem}
            loop={true}
            onProgressChange={(_, absoluteProgress) => {
              setCurrentCarouselIndex(Math.round(absoluteProgress));
            }}
            style={styles.carousel}
          />

          {/* Botón de flecha derecha */}
          <TouchableOpacity onPress={goToNextPage} style={styles.arrowButton}>
            <MaterialCommunityIcons name="chevron-right-circle" size={40} color="#262525" />
          </TouchableOpacity>
        </View>

        {/* --- Indicadores de Paginación (puntos debajo del carrusel) --- */}
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
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80, // Mantenemos el paddingTop para respetar el botón del menú de Layout
  },
  userIconContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'white',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold', 
    color: 'white',
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'center',
  },
  carouselWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  carousel: {
    flexGrow: 0,
    width: viewportWidth * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: 10,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
    backgroundColor: 'white',
    height: '40%',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#262525',
    marginHorizontal: 5,
  },
});