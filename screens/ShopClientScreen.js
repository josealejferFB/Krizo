import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Searchbar, Switch, Button, Avatar, Chip } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatModal from '../components/ChatModal';
import { useAuth } from '../context/AuthContext';

const ShopClientScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]); // Nuevo estado para los filtrados
  const [loading, setLoading] = useState(true);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [serviceRequestModalVisible, setServiceRequestModalVisible] = useState(false);


  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  // Obtener trabajadores de la ruta o cargar desde API
 useEffect(() => {
    // Si no hay un usuario, redirige a la pantalla de inicio de sesión
    if (!user) {
      // Puedes mostrar un mensaje y luego redirigir
      Alert.alert('Sesión expirada', 'Por favor, inicia sesión de nuevo.', [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
      return;
    }

    if (route.params?.workers) {
      const shopWorkers = route.params.workers.filter(
        worker => worker.services.includes('repuestos')
      );
      setShops(shopWorkers);
      setLoading(false);
    } else {
      loadShops();
    }
  }, [route.params, user]);


  const loadShops = async () => {
    try {
      setLoading(true);
      // Incluye el token de autenticación en la cabecera de la petición si es necesario
      const response = await fetch(`${API_BASE_URL}/users/workers`, {
        headers: {
          'Authorization': `Bearer ${token}` // <--- Usa el token aquí
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const shopWorkers = result.data.filter(
            worker => worker.services.includes('repuestos')
          );
          setShops(shopWorkers);
        }
      }
    } catch (error) {
      console.error('Error cargando tiendas:', error);
      Alert.alert('Error', 'No se pudieron cargar las tiendas');
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const lowerCaseSearchQuery = searchQuery.toLowerCase();
  const newFilteredShops = shops.filter((shop) =>
    (shop.name && shop.name.toLowerCase().includes(lowerCaseSearchQuery)) ||
    (shop.descripcion && shop.descripcion.toLowerCase().includes(lowerCaseSearchQuery)) ||
    (shop.ciudad && shop.ciudad.toLowerCase().includes(lowerCaseSearchQuery)) ||
    (shop.services && Array.isArray(shop.services) &&
     shop.services.some(service => service && service.toLowerCase().includes(lowerCaseSearchQuery)))
  );
  setFilteredShops(newFilteredShops); // ¡Actualiza el estado filtrado!

  // Opcional: Actualizar el título de la navegación aquí
  if (navigation) {
    navigation.setOptions({
      title: `Tiendas: ${newFilteredShops.length}`,
    });
  }

}, [shops, searchQuery, navigation]);

  const onChangeSearch = (query) => setSearchQuery(query);

 const handleContactShop = (shop) => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para contactar a una tienda.');
      return;
    }
    Alert.alert(
      'Contactar Tienda',
      `¿Deseas contactar a ${shop.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Contactar', 
          onPress: () => {
            setSelectedShop(shop);
            setChatModalVisible(true);
          }
        }
      ]
    );
  };

  const handleRequestService = (shop) => {
    setSelectedShop(shop);
    setServiceRequestModalVisible(true);
  };

  const handleChatConfirm = (agreedPrice) => {
    setChatModalVisible(false);
    // Abrir modal de ubicación después del chat
    setLocationModalVisible(true);
    // Guardar el precio acordado
    setServiceDetails(prev => ({
      ...prev,
      agreedPrice: agreedPrice
    }));
  };

  return (
    <LinearGradient
      colors={['#FC5501', '#C24100']}
      style={styles.container}
    >
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

          <View style={styles.appBarTitleContent}>
            <Text style={styles.appBarTitle}>Empresa/</Text>
            <Text style={styles.appBarTitle}>Tienda </Text>
            <Icon name="storefront" size={24} color="white" /> 
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.manageProductsText}>Tiendas de Repuestos Disponibles</Text>

        <Searchbar
          placeholder="Buscar tienda o repuestos"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          iconColor="#FC5501" 
          placeholderTextColor="#999"
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FC5501" />
            <Text style={styles.loadingText}>Cargando tiendas...</Text>
          </View>
        ) : filteredShops.length > 0 ? (
          <View style={styles.productsGrid}>
            {filteredShops.map((shop) => (
              <Card key={shop.id} style={styles.productCard}>
                <View style={styles.productCardContent}>
                  <Avatar.Icon size={60} icon="store" style={styles.shopAvatar} color="white" />
                  <View style={styles.productDetails}>
                    <View style={styles.nameAndFeatured}>
                      <Text style={styles.productName}>{shop.name}</Text>
                      <Chip style={styles.availableChip} textStyle={styles.availableChipText}>
                        Disponible
                      </Chip>
                    </View>
                    <Text style={styles.productQuantity}>{shop.descripcion}</Text>
                    <Text style={styles.shopLocation}>{shop.ciudad} - {shop.zona}</Text>
                    <Text style={styles.shopAvailability}>Disponibilidad: {shop.disponibilidad}</Text>
                  </View>
                </View>
                <Button
                  mode="contained"
                  onPress={() => handleContactShop(shop)}
                  style={styles.buyButton}
                  labelStyle={styles.buyButtonLabel}
                >
                  Contactar
                </Button>
                {/* ... */}
                <ChatModal
                  visible={chatModalVisible}
                  onClose={() => setChatModalVisible(false)}
                  mechanic={selectedShop}
                  onConfirmService={handleChatConfirm}
                  userType="client"
                  // Podría pasa el ID del usuario aquí si el modal lo necesita
                  // currentUserId={user.id}
                />
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="store" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay tiendas disponibles</Text>
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
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 3,
    borderWidth: 2,
    position: 'absolute',
    borderColor: '#FC5501',
    left: 0,
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
    padding: 2,
  },
  buyButton: {
    backgroundColor: '#FC5501', // Orange color for the buy button
    borderRadius: 8, // Slightly less rounded than the 'Solicitar' button
    width: '100%', // Make it full width within the card
    marginTop: 5, // Small space above the button
    paddingVertical: 2, // Adjust vertical padding for the button
  },
  buyButtonLabel: {
    color: 'white',
    fontSize: 12, // Smaller font size to fit
    fontWeight: 'bold',
  },
  appBarTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  appBarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center', // Center content horizontally
  },
  manageProductsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501', // Orange color
    textAlign: 'left', // Aligned to the left as in the image
    width: '100%', // Take full width
    marginBottom: 15,
  },
  searchBar: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchBarInput: {
    minHeight: 0, // Override default minHeight for smaller searchbar
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute items evenly
    width: '100%',
  },
  productCard: {
    width: '48%', // Approx half width for two columns
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff', // White background for product cards
    padding: 10,
  },
  productCardContent: {
    alignItems: 'center', // Center image and details
    marginBottom: 10,
  },
  productImage: {
    width: '100%', // Image takes full width of card
    height: 160, // Fixed height for consistency
    borderRadius: 5,
    marginBottom: 5,
    resizeMode: 'cover',
  },
  productDetails: {
    alignItems: 'center', // Center product name and quantity
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FC5501', // Orange for price
    textAlign: 'center',
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5, // Small horizontal padding
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 10,
    marginLeft: 5,
    color: '#333',
  },
  editButton: {
    padding: 5,
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
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 5,
  },
  shopAvatar: {
    backgroundColor: '#FC5501',
    marginBottom: 10,
  },
  shopLocation: {
    fontSize: 13,
    color: '#888',
    marginBottom: 3,
  },
  shopAvailability: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ShopClientScreen;
