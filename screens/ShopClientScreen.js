import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Searchbar, Button, Chip, Avatar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatModal from './ChatModal';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta

const ShopClientScreen = () => {
  const navigation = useNavigation();
  const { user, token } = useAuth();
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('shops');
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';
const SERVER_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || 'http://192.168.1.14:5000/'
  
  useEffect(() => {
    if (!user) {
      Alert.alert('Sesión expirada', 'Por favor, inicia sesión de nuevo.', [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [shopsResponse, productsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/users/workers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/products`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const shopsResult = await shopsResponse.json();
      if (shopsResult.success) {
        const shopWorkers = shopsResult.data.filter(worker => worker.services.includes('repuestos'));
        setShops(shopWorkers);
      }

      const productsResult = await productsResponse.json();
      if (productsResult.success) {
        setProducts(productsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    if (viewMode === 'shops') {
      const newFilteredShops = shops.filter(shop =>
        (shop.name && shop.name.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (shop.descripcion && shop.descripcion.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (shop.ciudad && shop.ciudad.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (shop.services && Array.isArray(shop.services) && shop.services.some(service => service && service.toLowerCase().includes(lowerCaseSearchQuery)))
      );
      setFilteredShops(newFilteredShops);
    } else {
      const newFilteredProducts = products.filter(product =>
        (product.name && product.name.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (product.brand && product.brand.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (product.category && product.category.toLowerCase().includes(lowerCaseSearchQuery))
      );
      setFilteredProducts(newFilteredProducts);
    }
  }, [searchQuery, viewMode, shops, products]);

  // Nueva función unificada para manejar el contacto
  const handleContact = (item) => {
    let shopToContact;
    if (viewMode === 'shops') {
      // Si estamos en la vista de tiendas, el item es la tienda
      shopToContact = item;
    } else {
      // Si estamos en la vista de productos, el item es el producto
      // Buscamos la tienda dueña de ese producto
      shopToContact = shops.find(shop => shop.id === item.ownerId);
      if (!shopToContact) {
        Alert.alert('Error', 'No se pudo encontrar la tienda asociada a este producto.');
        return;
      }
    }

    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para contactar.');
      return;
    }

    setSelectedShop(shopToContact);
    setChatModalVisible(true);
  };


  const getCardToRender = () => {
    if (viewMode === 'shops') {
      return (
        <View style={styles.productsGrid}>
          {filteredShops.length > 0 ? filteredShops.map((shop) => (
            <Card key={shop.id} style={styles.card}>
              <View style={styles.cardContent}>
                <Avatar.Icon size={60} icon="store" style={styles.shopAvatar} color="white" />
                <View style={styles.details}>
                  <Text style={styles.name}>{shop.name}</Text>
                  <Text style={styles.description}>{shop.descripcion}</Text>
                  <Text style={styles.location}>{shop.ciudad} - {shop.zona}</Text>
                  <Text style={styles.availability}>Disponibilidad: {shop.disponibilidad}</Text>
                </View>
              </View>
              <Button mode="contained" onPress={() => handleContact(shop)} style={styles.button}>
                Contactar
              </Button>
            </Card>
          )) : (
            <View style={styles.emptyContainer}>
              <Icon name="store" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay tiendas disponibles</Text>
              <Text style={styles.emptySubtext}>Intenta con otra búsqueda</Text>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.productsGrid}>
          {filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <Card key={product.id} style={styles.card}>
              <View style={styles.cardContent}>
                {product.imageUri ? (
                  <Image source={{ uri: `{SERVER_URL}{product.imageUri}` }} style={styles.image} />
                ) : (
                  <Icon name="image-off-outline" size={100} color="#ccc" style={styles.noImagePlaceholder} />
                )}
                <View style={styles.details}>
                  <Text style={styles.name}>{product.name}</Text>
                  <Text style={styles.brand}>{product.brand}</Text>
                  <Text style={styles.price}>${product.price}</Text>

                </View>
              </View>
              <Button mode="contained" onPress={() => handleContact(product)} style={styles.button}>
                Contactar
              </Button>
            </Card>
          )) : (
            <View style={styles.emptyContainer}>
              <Icon name="engine" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No se encontraron productos</Text>
              <Text style={styles.emptySubtext}>Intenta con otra búsqueda</Text>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <LinearGradient colors={['#FC5501', '#C24100']} style={styles.container}>
      <View style={styles.headerOrangeContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Icon name="arrow-left-bold-circle" size={38} color="#FC5501" style={styles.backIcon} />
          </TouchableOpacity>
          <View style={styles.appBarTitleContent}>
            <Text style={styles.appBarTitle}>
              {viewMode === 'shops' ? 'Tiendas' : 'Productos'}
            </Text>
            <Icon name={viewMode === 'shops' ? 'storefront' : 'car-cog'} size={24} color="white" />
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.toggleContainer}>
          <Chip
            icon={viewMode === 'shops' ? 'storefront' : null}
            selected={viewMode === 'shops'}
            onPress={() => setViewMode('shops')}
            style={viewMode === 'shops' ? styles.toggleChipActive : styles.toggleChipInactive}
            textStyle={viewMode === 'shops' ? styles.toggleChipTextActive : styles.toggleChipTextInactive}
          >
            Buscar Tiendas
          </Chip>
          <Chip
            icon={viewMode === 'products' ? 'car-cog' : null}
            selected={viewMode === 'products'}
            onPress={() => setViewMode('products')}
            style={viewMode === 'products' ? styles.toggleChipActive : styles.toggleChipInactive}
            textStyle={viewMode === 'products' ? styles.toggleChipTextActive : styles.toggleChipTextInactive}
          >
            Buscar Productos
          </Chip>
        </View>

        <Searchbar
          placeholder={viewMode === 'shops' ? 'Buscar tienda...' : 'Buscar producto...'}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          iconColor="#FC5501"
          placeholderTextColor="#999"
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FC5501" />
            <Text style={styles.loadingText}>Cargando datos...</Text>
          </View>
        ) : getCardToRender()}
      </ScrollView>
      <ChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
        mechanic={selectedShop}
        userType="client"
      />
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
    alignItems: 'center',
  },
  manageProductsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501',
    textAlign: 'left',
    width: '100%',
    marginBottom: 15,
  },
  searchBar: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchBarInput: {
    minHeight: 0,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  toggleChipActive: {
    backgroundColor: '#FC5501',
  },
  toggleChipInactive: {
    backgroundColor: '#f0f0f0',
  },
  toggleChipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  toggleChipTextInactive: {
    color: '#333',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'space-between',
  },
  cardContent: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  noImagePlaceholder: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  details: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  brand: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FC5501',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FC5501',
    borderRadius: 8,
    width: '100%',
    marginTop: 5,
    paddingVertical: 2,
  },
  emptyContainer: {
    width: '100%',
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
  shopAvatar: {
    backgroundColor: '#FC5501',
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  location: {
    fontSize: 13,
    color: '#888',
    marginBottom: 3,
  },
  availability: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ShopClientScreen;
