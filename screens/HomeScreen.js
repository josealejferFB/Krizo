import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View style={styles.carouselCard}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.carouselCardContent}>
        <Text style={styles.carouselCardTitle}>{item.title}</Text>
        <Text style={styles.carouselCardDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <Layout navigation={navigation}>
      {/* Fondo degradado igual que ThemedBackgroundGradient */}
      <LinearGradient
        colors={['#FC5501', '#C24100']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Contenedor blanco tipo "card" para todo el contenido principal */}
        <View style={styles.mainCard}>
          {/* Botón de logout arriba a la derecha, dentro del mainCard y con posición absoluta */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#FC5501" />
          </TouchableOpacity>
          <View style={styles.headerCard}>
            <MaterialCommunityIcons name="account-circle" size={60} color="#FC5501" style={styles.headerIcon} />
            <View>
              <Text style={styles.headerTitle}>¡Bienvenido, Usuario!</Text>
              <Text style={styles.headerSubtitle}>¿Qué necesitas hoy?</Text>
            </View>
          </View>

          {/* Carrusel adaptado al nuevo diseño */}
          <View style={styles.carouselSection}>
            <Text style={styles.sectionTitle}>Promociones y novedades</Text>
            <View style={styles.carouselWrapper}>
              <TouchableOpacity style={styles.arrowButton} onPress={() => carouselRef.current?.prev()}>
                <MaterialCommunityIcons name="chevron-left" size={22} color="#FC5501" />
              </TouchableOpacity>
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                elevation: 6,
                shadowColor: '#FC5501',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.13,
                shadowRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 0,
                width: viewportWidth * 0.78,
                height: viewportWidth * 0.55,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 4,
              }}>
                <Carousel
                  ref={carouselRef}
                  width={viewportWidth * 0.78}
                  height={viewportWidth * 0.55}
                  data={carouselData}
                  renderItem={renderItem}
                  scrollAnimationDuration={600}
                  onSnapToItem={setCurrentCarouselIndex}
                  style={styles.carousel}
                  loop
                />
              </View>
              <TouchableOpacity style={styles.arrowButton} onPress={() => carouselRef.current?.next()}>
                <MaterialCommunityIcons name="chevron-right" size={22} color="#FC5501" />
              </TouchableOpacity>
            </View>
            <View style={styles.paginationDots}>
              {carouselData.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    { backgroundColor: idx === currentCarouselIndex ? '#FC5501' : '#FFD6B8' },
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Servicios Destacados</Text>
          </View>

          <View style={styles.cardsRow}>
            <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('Services')}>
              <MaterialCommunityIcons name="tools" size={40} color="#FC5501" />
              <Text style={styles.cardTitle}>Servicios Mecánicos</Text>
              <Text style={styles.cardDesc}>Reparación, mantenimiento y más</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('Services')}>
              <MaterialCommunityIcons name="tow-truck" size={40} color="#FC5501" />
              <Text style={styles.cardTitle}>Solicitar Grúa</Text>
              <Text style={styles.cardDesc}>Asistencia vial inmediata</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsRow}>
            <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('Services')}>
              <MaterialCommunityIcons name="car-cog" size={40} color="#FC5501" />
              <Text style={styles.cardTitle}>Repuestos</Text>
              <Text style={styles.cardDesc}>Pide repuestos originales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('Details')}>
              <MaterialCommunityIcons name="account" size={40} color="#FC5501" />
              <Text style={styles.cardTitle}>Mi Perfil</Text>
              <Text style={styles.cardDesc}>Gestiona tu información</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Mi Vehículo</Text>
          </View>
          <View style={styles.vehicleCard}>
            <MaterialCommunityIcons name="car" size={40} color="#FC5501" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.vehicleText}>
                {vehicleInfo.make} {vehicleInfo.model} {vehicleInfo.year}
              </Text>
              <Text style={styles.vehicleTextSmall}>
                Placa: {vehicleInfo.plate}  |  Color: {vehicleInfo.color}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32, // Más padding para separar el contenido del borde
    width: '99%', // Más ancho
    maxWidth: 600, // Más ancho para pantallas grandes
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    marginBottom: 20,
    position: 'relative',
  },
  logoutButton: {
    position: 'absolute',
    top: 18,
    right: 32, // Más separado del borde derecho
    zIndex: 10,
    backgroundColor: '#FFF7F0',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 0,
    width: '100%',
    maxWidth: 520, // Más ancho para que el texto no se cruce con el botón
    marginBottom: 30,
    elevation: 0,
    shadowColor: 'transparent',
    marginRight: 48, // Deja espacio para el botón de logout
  },
  headerIcon: {
    marginRight: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#877063',
  },
  sectionTitleContainer: {
    width: '95%',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501',
    marginLeft: 8,
    marginBottom: 6,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginBottom: 18,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    elevation: 6,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262525',
    marginTop: 10,
    marginBottom: 2,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 13,
    color: '#877063',
    textAlign: 'center',
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    width: '95%',
    maxWidth: 420,
    marginTop: 10,
    elevation: 6,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  vehicleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262525',
  },
  vehicleTextSmall: {
    fontSize: 13,
    color: '#877063',
    marginTop: 2,
  },
  // Carrusel adaptado
  carouselSection: {
    alignItems: 'center',
    marginBottom: 28,
    width: '100%',
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
    width: viewportWidth * 0.78, // Vuelve al tamaño original
    height: viewportWidth * 0.55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  carouselCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '55%',
    resizeMode: 'cover',
  },
  carouselCardContent: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  carouselCardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 6,
    textAlign: 'center',
  },
  carouselCardDescription: {
    fontSize: 14,
    color: '#877063',
    textAlign: 'center',
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