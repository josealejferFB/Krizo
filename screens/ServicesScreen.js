import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Appbar, Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 30;

const ServicesScreen = () => {
  const navigation = useNavigation();

  const handleServicePress = (serviceName) => {
    console.log(`Navegar a detalles de: ${serviceName}`);
    alert(`Has seleccionado: ${serviceName}. Próximamente se abrirá su detalle.`);
  };

  return (
    <View style={styles.container}>
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
        <View style={styles.cardsContainer}>
          {/* Tarjeta de Servicio Mecánico */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => handleServicePress('Servicio Mecánico')}
          >
            <Card style={styles.card}>
              <Card.Cover source={require('../assets/car_repair.png')} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>Servicio Mecánico</Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          {/* Tarjeta de Solicitar Grúa */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => handleServicePress('Solicitar Grúa')}
          >
            <Card style={styles.card}>
              <Card.Cover source={require('../assets/tow_truck.png')} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>Solicitar Grúa</Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          {/* Tarjeta de Solicitar Repuesto */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => handleServicePress('Solicitar Repuesto')}
          >
            <Card style={styles.card}>
              <Card.Cover source={require('../assets/car_parts.png')} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>Solicitar Repuesto</Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          {/* Otra Tarjeta de Servicio Mecánico (como en tu capture) */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => handleServicePress('Otro Servicio Mecánico')}
          >
            <Card style={styles.card}>
              <Card.Cover source={require('../assets/car_repair_2.png')} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>Servicio Mecánico</Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  appBar: {
    backgroundColor: '#FF6F00', // Naranja
    elevation: 0,
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContentCentered: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'white',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    overflow: 'hidden',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cardWrapper: {
    width: cardWidth,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    height: 220, // Altura fija para las tarjetas. Mantener si te funciona.
  },
  cardImage: {
    height: 140, // Altura de la imagen dentro de la tarjeta. Mantener si te funciona.
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    backgroundColor: 'black',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Permite que ocupe el espacio restante
    marginTop: 0,
    minHeight: 60, // **NUEVO: Asegura una altura mínima para el contenido del título**
    // overflow: 'visible', // **NUEVO: Intentar con 'visible' si el texto se recorta**
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    // lineHeight: 20, // Descomenta si sientes que el texto está muy pegado verticalmente o se corta
  },
});

export default ServicesScreen;