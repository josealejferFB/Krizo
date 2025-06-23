import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 30;

const services = [
  {
    name: 'Servicio Mecánico',
    image: require('../assets/car_repair.png'),
    icon: 'tools',
    color: '#FC5501',
  },
  {
    name: 'Solicitar Grúa',
    image: require('../assets/tow_truck.png'),
    icon: 'tow-truck',
    color: '#FC5501',
  },
  {
    name: 'Solicitar Repuesto',
    image: require('../assets/car_parts.png'),
    icon: 'car-cog',
    color: '#FC5501',
  },
  {
    name: 'Otro Servicio Mecánico',
    image: require('../assets/car_repair_2.png'),
    icon: 'car-wrench',
    color: '#FC5501',
  },
];

const ServicesScreen = () => {
  const navigation = useNavigation();

  const handleServicePress = (serviceName) => {
    console.log(`Navegar a detalles de: ${serviceName}`);
    alert(`Has seleccionado: ${serviceName}. Próximamente se abrirá su detalle.`);
  };

  return (
    <LinearGradient
      colors={['#fff7f0', '#ffe0c2', '#ffd6b8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content
          title="Servicios"
          titleStyle={styles.headerTitle}
          style={styles.headerContentCentered}
        />
        <View style={styles.serviceIconContainer}>
          <Icon name="tools" size={30} color="white" />
        </View>
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Elige un servicio de Krizo</Text>
        <View style={styles.cardsContainer}>
          {services.map((service, idx) => (
            <TouchableOpacity
              key={service.name}
              style={styles.cardWrapper}
              onPress={() => handleServicePress(service.name)}
              activeOpacity={0.85}
            >
              <View style={styles.card}>
                <Image source={service.image} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Icon name={service.icon} size={28} color={service.color} style={{ marginBottom: 6 }} />
                  <Text style={styles.cardTitle}>{service.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  appBar: {
    backgroundColor: '#FF6F00',
    elevation: 0,
    height: 90,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContentCentered: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 18,
    marginTop: 8,
    textAlign: 'center',
    width: '100%',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  cardWrapper: {
    width: cardWidth,
    marginVertical: 12,
    marginHorizontal: 5,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 210,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardImage: {
    height: 110,
    width: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FC5501',
    marginTop: 2,
  },
});

export default ServicesScreen;