import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 80) / 2;

const services = [
  {
    name: 'Servicio Mecánico',
    subtitle: 'Reparación y mantenimiento vehicular',
    image: require('../assets/car_repair.png'),
    icon: 'tools',
    color: '#FC5501',
  },
  {
    name: 'Solicitar Grúa',
    subtitle: 'Asistencia de remolque 24/7',
    image: require('../assets/tow_truck.png'),
    icon: 'tow-truck',
    color: '#FC5501',
  },
  {
    name: 'Solicitar Repuesto',
    subtitle: 'Compra de repuestos y accesorios',
    image: require('../assets/car_parts.png'),
    icon: 'store',
    color: '#FC5501',
  },
];

const ServicesScreen = () => {
  const navigation = useNavigation();

  const handleServicePress = (serviceName) => {
    alert(`Has seleccionado: ${serviceName}. Próximamente se abrirá su detalle.`);
  };

  return (
    <LinearGradient
      colors={['#FC5501', '#C24100']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={StyleSheet.absoluteFillObject}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          {/* Header vistoso y creativo, ahora con fondo naranja */}
          <View style={styles.headerOrangeContainer}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Icon
                  name="arrow-left-bold-circle"
                  size={38}
                  color="#FC5501"
                  style={styles.backIcon}
                />
              </TouchableOpacity>
              <View style={styles.headerTitleBox}>
                <Text style={styles.headerTitleCustom}>Servicios</Text>
                <Text style={styles.headerSubtitleCustom}>¡Todo lo que tu auto necesita!</Text>
              </View>
              <View style={styles.headerRightIcon}>
                <View style={styles.iconCircle}>
                  <Icon name="car-multiple" size={28} color="#fff" />
                </View>
              </View>
            </View>
            <View style={styles.headerDecor}>
              <Icon name="star" size={18} color="#fff" style={{ marginHorizontal: 2, opacity: 0.7 }} />
              <Icon name="star" size={14} color="#fff" style={{ marginHorizontal: 2, opacity: 0.5 }} />
              <Icon name="star" size={10} color="#fff" style={{ marginHorizontal: 2, opacity: 0.3 }} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
          <View style={styles.gridContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <TouchableOpacity
                key={services[0].name}
                style={[styles.gridItem, { marginRight: 12 }]}
                onPress={() => handleServicePress(services[0].name)}
                activeOpacity={0.85}
              >
                <View style={styles.cardContent}>
                  <Image source={services[0].image} style={styles.cardImage} />
                  <Icon name="tools" size={32} color="#FC5501" style={{ marginVertical: 8 }} />
                  <Text style={styles.cardTitle}>{services[0].name}</Text>
                  <Text style={styles.cardSubtitle}>{services[0].subtitle}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                key={services[1].name}
                style={styles.gridItem}
                onPress={() => handleServicePress(services[1].name)}
                activeOpacity={0.85}
              >
                <View style={styles.cardContent}>
                  <Image source={services[1].image} style={styles.cardImage} />
                  <Icon name="tow-truck" size={32} color="#FC5501" style={{ marginVertical: 8 }} />
                  <Text style={styles.cardTitle}>{services[1].name}</Text>
                  <Text style={styles.cardSubtitle}>{services[1].subtitle}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <TouchableOpacity
                key={services[2].name}
                style={styles.gridItem}
                onPress={() => handleServicePress(services[2].name)}
                activeOpacity={0.85}
              >
                <View style={styles.cardContent}>
                  <Image source={services[2].image} style={styles.cardImage} />
                  <Icon name="store" size={32} color="#FC5501" style={{ marginVertical: 8 }} /> {/* Icono de tienda/repuestos */}
                  <Text style={styles.cardTitle}>{services[2].name}</Text>
                  <Text style={styles.cardSubtitle}>{services[2].subtitle}</Text> {/* Subtítulo del servicio */}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 10,
    minHeight: '100%',
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '99%',
    maxWidth: 600,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    marginBottom: 20,
    position: 'relative',
  },
  headerOrangeContainer: {
    width: '100%',
    marginBottom: 18,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#FC5501',
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FC5501',
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
  },
  shadowIcon: {
    elevation: 3,
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
    marginRight: 0,
  },
  headerTitleCustom: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System',
    letterSpacing: 1,
  },
  headerSubtitleCustom: {
    fontSize: 14,
    color: '#FFD6B8',
    fontFamily: 'System',
    marginTop: 2,
    fontStyle: 'italic',
  },
  headerRightIcon: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 0,
    elevation: 0,
    marginLeft: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C24100',
  },
  headerDecor: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501',
    marginLeft: 8,
    marginBottom: 18,
    marginTop: 8,
    alignSelf: 'flex-start',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Cambia de 'space-between' a 'center' para centrar el botón si queda solo
    width: '100%',
    marginTop: 10,
  },
  gridItem: {
    width: CARD_SIZE,
    height: CARD_SIZE + 30,
    backgroundColor: '#262525',
    borderRadius: 18,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    marginRight: 12, // Agrega espacio horizontal entre los botones
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 8,
  },
  cardImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco para contraste
    textAlign: 'center',
    marginTop: 2,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#FFD6B8',
    textAlign: 'center',
    marginTop: 2,
    fontStyle: 'italic',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
});

export default ServicesScreen;