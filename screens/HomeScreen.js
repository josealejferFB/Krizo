import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel'; 

// Importa tu componente Layout que envuelve esta pantalla
import Layout from '../components/Layout.js';

const { width: viewportWidth } = Dimensions.get('window'); // Obtener el ancho de la ventana del dispositivo

// --- Datos de ejemplo para las tarjetas del carrusel ---
// ¡IMPORTANTE!: Reemplaza 'require(...)' con tus propias rutas de imágenes locales.
// Si usas URLs de internet, asegúrate de que sean accesibles y estables.
const carouselData = [
  {
    id: '1',
    image: require('../assets/card_image_4.png'), // <<-- ¡CAMBIA ESTO por tu imagen 1!
    title: 'Reparaciones Automotrices',
    description: 'Servicios rápidos y eficientes para tu auto.',
  },
  {
    id: '2',
    image: require('../assets/card_image_4.png'), // <<-- ¡CAMBIA ESTO por tu imagen 2!
    title: 'Mantenimiento de tu Vehículo',
    description: 'Deja tu vehículo impecable con nuestros expertos.',
  },
  {
    id: '3',
    image: require('../assets/card_image_4.png'), // <<-- ¡CAMBIA ESTO por tu imagen 3!
    title: 'Servicios de ayuda en carretera',
    description: 'Servicio de grúa 24/7.',
  },
  {
    id: '4',
    image: require('../assets/card_image_4.png'), // <<-- ¡CAMBIA ESTO por tu imagen 4!
    title: 'Mecánica Profesional',
    description: 'Soluciones rápidas para cualquier fuga o avería.',
  },
];

export default function HomeScreen({ navigation }) {
  const carouselRef = useRef(null); // Referencia para controlar el carrusel programáticamente
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0); // Estado para el índice actual de la tarjeta visible

  // Función para renderizar cada tarjeta del carrusel
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      {/* Usamos Image directamente para mayor control sobre el `resizeMode` */}
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
      carouselRef.current.next(); // Mueve el carrusel a la siguiente tarjeta
    }
  };

  const goToPrevPage = () => {
    if (carouselRef.current) {
      carouselRef.current.prev(); // Mueve el carrusel a la tarjeta anterior
    }
  };

  return (
    // Envuelve el contenido de esta pantalla con el componente Layout.
    // Esto provee el gradiente de fondo, el botón de menú y el menú lateral.
    <Layout navigation={navigation}>
      <View style={styles.container}>
        {/* Sección de Bienvenida al Usuario */}
        <Text style={styles.welcomeText}>Bienvenido, Usuario</Text>

        {/* --- Contenedor del Carrusel y sus botones de navegación --- */}
        <View style={styles.carouselWrapper}>
          {/* Botón de flecha izquierda */}
          <TouchableOpacity onPress={goToPrevPage} style={styles.arrowButton}>
            <MaterialCommunityIcons name="chevron-left-circle" size={40} color="#FC5501" />
          </TouchableOpacity>

          {/* Componente Carrusel */}
          <Carousel
            ref={carouselRef} // Asigna la referencia para control programático
            width={viewportWidth * 0.75} // Ancho de cada tarjeta (ej. 75% del ancho de la pantalla)
            height={viewportWidth * 0.9} // Altura de cada tarjeta
            data={carouselData} // Datos a mostrar en el carrusel
            renderItem={renderItem} // Función para renderizar cada tarjeta
            loop={true} // Permite que el carrusel se repita infinitamente
            onProgressChange={(_, absoluteProgress) => {
              // Actualiza el índice actual para los puntos de paginación
              setCurrentCarouselIndex(Math.round(absoluteProgress));
            }}
            style={styles.carousel} // Estilos para el contenedor del carrusel
          />

          {/* Botón de flecha derecha */}
          <TouchableOpacity onPress={goToNextPage} style={styles.arrowButton}>
            <MaterialCommunityIcons name="chevron-right-circle" size={40} color="#FC5501" />
          </TouchableOpacity>
        </View>

        {/* --- Indicadores de Paginación (puntos debajo del carrusel) --- */}
        <View style={styles.paginationDots}>
          {carouselData.map((_, index) => (
            <View
              key={index} // Key única para cada punto (usamos el índice, ya que la lista es estática)
              style={[
                styles.dot,
                // Resalta el punto si coincide con el índice de la tarjeta actual
                { opacity: index === currentCarouselIndex % carouselData.length ? 1 : 0.4 },
              ]}
            />
          ))}
        </View>

        {/* Puedes añadir más contenido específico para la pantalla de inicio aquí */}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Centra los elementos hijos horizontalmente
    // El paddingTop es crucial si tu Layout tiene un botón de menú o una barra superior fija.
    // Ajusta este valor si el contenido se superpone con el botón del menú de tu Layout.
    paddingTop: 80, 
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white', // Asume que tu fondo es oscuro debido al gradiente del Layout
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'center',
  },
  carouselWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centra el carrusel y los botones de flecha
    width: '100%', 
    marginBottom: 20,
  },
  carousel: {
    flexGrow: 0, // Evita que el carrusel ocupe todo el espacio, dejando lugar para los botones
    width: viewportWidth * 0.75, // Ancho de la parte visible de cada tarjeta del carrusel
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: 10, // Espaciado para los botones de flecha
  },
  card: {
    width: '100%', // La tarjeta ocupa todo el ancho del carrusel asignado
    height: '100%', // La tarjeta ocupa toda la altura del carrusel asignada
    borderRadius: 15,
    overflow: 'hidden', // Importante para que la imagen y el contenido respeten el `borderRadius`
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: '100%',
    height: '60%', // La imagen ocupa el 60% de la altura total de la tarjeta
    resizeMode: 'cover', // Escala la imagen para que cubra el área sin distorsionarse
  },
  cardContent: {
    padding: 15,
    backgroundColor: 'white',
    height: '40%', // El contenido ocupa el 40% restante de la altura de la tarjeta
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
    backgroundColor: '#FC5501', // Color principal de tu app para los puntos de paginación
    marginHorizontal: 5,
  },
});