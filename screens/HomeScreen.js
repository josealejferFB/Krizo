import React, { useRef, useState } from 'react';
import { View, Dimensions, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../components/Layout';
import { themedStyles } from '../components/ThemedUIElements';

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
    <View style={themedStyles.carouselCard}>
      <Image source={item.image} style={themedStyles.cardImage} />
      <View style={themedStyles.carouselCardContent}>
        <Text style={themedStyles.carouselCardTitle}>{item.title}</Text>
        <Text style={themedStyles.carouselCardDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <Layout navigation={navigation}>
      {/* Fondo degradado como antes */}
      <LinearGradient
        colors={['#FC5501', '#C24100']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />

          <TouchableOpacity
            style={themedStyles.logoutButton}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#fff" />
          </TouchableOpacity>
      <ScrollView contentContainerStyle={themedStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Contenedor blanco tipo "card" para todo el contenido principal */}
        <View style={themedStyles.mainCard}>
          {/* Botón de logout arriba a la derecha, dentro del mainCard y con posición absoluta */}
          
          <View style={themedStyles.headerCard}>
            <MaterialCommunityIcons name="account-circle" size={60} color="#FC5501" style={themedStyles.headerIcon} />
            <View>
              <Text style={themedStyles.headerTitle}>¡Bienvenido, Usuario!</Text>
              <Text style={themedStyles.headerSubtitle}>¿Qué necesitas hoy?</Text>
            </View>
          </View>

          {/* Carrusel adaptado al nuevo diseño */}
          <View style={themedStyles.carouselSection}>
            <Text style={themedStyles.sectionTitle}>Promociones y novedades</Text>
            <View style={themedStyles.carouselWrapper}>
              <TouchableOpacity style={themedStyles.arrowButton} onPress={() => carouselRef.current?.prev()}>
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
                  style={themedStyles.carousel}
                  loop
                />
              </View>
              <TouchableOpacity style={themedStyles.arrowButton} onPress={() => carouselRef.current?.next()}>
                <MaterialCommunityIcons name="chevron-right" size={22} color="#FC5501" />
              </TouchableOpacity>
            </View>
            <View style={themedStyles.paginationDots}>
              {carouselData.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    themedStyles.dot,
                    { backgroundColor: idx === currentCarouselIndex ? '#FC5501' : '#FFD6B8' },
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={themedStyles.sectionTitleContainer}>
            <Text style={themedStyles.sectionTitle}>Servicios Destacados</Text>
          </View>

          <View style={themedStyles.cardsRow}>
            <TouchableOpacity style={themedStyles.serviceCard} onPress={() => navigation.navigate('Services')}>
              <MaterialCommunityIcons name="tools" size={40} color="#FC5501" />
              <Text style={themedStyles.cardTitle}>Servicios Mecánicos</Text>
              <Text style={themedStyles.cardDesc}>Reparación, mantenimiento y más</Text>
            </TouchableOpacity>
            <TouchableOpacity style={themedStyles.serviceCard} onPress={() => navigation.navigate('Services')}>
              <MaterialCommunityIcons name="tow-truck" size={40} color="#FC5501" />
              <Text style={themedStyles.cardTitle}>Solicitar Grúa</Text>
              <Text style={themedStyles.cardDesc}>Asistencia vial inmediata</Text>
            </TouchableOpacity>
          </View>

          <View style={themedStyles.cardsRow}>
            <TouchableOpacity style={themedStyles.serviceCard} onPress={() => navigation.navigate('Services')}>
              <MaterialCommunityIcons name="car-cog" size={40} color="#FC5501" />
              <Text style={themedStyles.cardTitle}>Repuestos</Text>
              <Text style={themedStyles.cardDesc}>Pide repuestos originales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={themedStyles.serviceCard} onPress={() => navigation.navigate('MyProfile')}>
              <MaterialCommunityIcons name="account" size={40} color="#FC5501" />
              <Text style={themedStyles.cardTitle}>Mi Perfil</Text>
              <Text style={themedStyles.cardDesc}>Gestiona tu información</Text>
            </TouchableOpacity>
          </View>

          <View style={themedStyles.sectionTitleContainer}>
            <Text style={themedStyles.sectionTitle}>Mi Vehículo</Text>
          </View>
          <View style={themedStyles.vehicleCard}>
            <MaterialCommunityIcons name="car" size={40} color="#FC5501" style={{ marginRight: 10 }} />
            <View>
              <Text style={themedStyles.vehicleText}>
                {vehicleInfo.make} {vehicleInfo.model} {vehicleInfo.year}
              </Text>
              <Text style={themedStyles.vehicleTextSmall}>
                Placa: {vehicleInfo.plate}  |  Color: {vehicleInfo.color}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
