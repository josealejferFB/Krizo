import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { Text, Card, Searchbar, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../components/ShopStyles'; 

const ProductsManagementScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';
  const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

  // Obtener productos
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
        setFilteredProducts(result.data); // Inicialmente, todos los productos son filtrados
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const newFilteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseSearchQuery) ||
      product.brand.toLowerCase().includes(lowerCaseSearchQuery) ||
      product.category.toLowerCase().includes(lowerCaseSearchQuery)
    );
    setFilteredProducts(newFilteredProducts);
  }, [searchQuery, products]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const handleEditProduct = (product) => {
    navigation.navigate('KrizoWorkerProductList', { product });
  };
  
const FloatingButton = () => {
  return (
    <TouchableOpacity 
      style={styles.floatingButton}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('KrizoWorkerShopConfig')}
    >
      <MaterialCommunityIcons name="plus" size={28} color="white" />
    </TouchableOpacity>
  );
};

  return (
    <LinearGradient colors={['#FC5501', '#C24100']} style={styles.container}>
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
            <Text style={styles.appBarTitle}>Productos</Text>
          </View>
        </View>
      </View>
      <FloatingButton />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Searchbar
          placeholder="Buscar producto"
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
            <Text style={styles.loadingText}>Cargando productos...</Text>
          </View>
        ) : filteredProducts.length > 0 ? (
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <Card key={product.id} style={styles.productCard}>
                <View style={styles.productCardContent}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productCategory}>Categoría: {product.category}</Text>
                  <Text style={styles.productPrice}>Precio: ${product.price.toFixed(2)}</Text>
                  <Text style={styles.productQuantity}>Cantidad: {product.quantity}</Text>
				<Image source={{ uri: `${SERVER_URL}${product.imageUri}` }} style={styles.selectedImagePreview} />
				
                </View>
                <Card.Actions>
<Button
                  mode="contained"
                  onPress={() => handleEditProduct()}
                  style={styles.buyButton}
                  labelStyle={styles.buyButtonLabel}
                >
                  Editar
                </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="package-variant" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay productos disponibles</Text>
            <Text style={styles.emptySubtext}>Intenta más tarde</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default ProductsManagementScreen;

