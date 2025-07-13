import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Searchbar, Switch, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ShopClientScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Filtro de aceite Corolla 2000',
      quantity: 10,
      price: '1.000Bs',
      image: 'https://http2.mlstatic.com/D_NQ_NP_689607-MLV69641010806_052023-O.webp',
      available: true,
    },
    {
      id: 2,
      name: 'Pastillas de freno',
      quantity: 5,
      price: '700Bs',
      image: 'https://www.ro-des.com/wp-content/uploads/2014/04/Pastillas-de-freno.jpg',
      available: false,
    },
    {
      id: 3,
      name: 'Bujías Iridium',
      quantity: 12,
      price: '500Bs',
      image: 'https://www.championautoparts.com/content/loc-na/loc-us/fmmp-champion/es_US/Products/Spark-Plugs/Automotive-Spark-Plugs/Iridium-Spark-Plug/_jcr_content/product-feature/featureContent1/image.img.png/Champion-Iridium-Spark-Plug-Assortment-Hi-Res-1493226273888.png',
      available: true,
    },
    {
      id: 4,
      name: 'Amortiguador Trasero',
      quantity: 3,
      price: '3.500Bs',
      image: 'https://megarepuestosing.com/35615-large_default/amortiguador-delantero-aveo.jpg',
      available: true,
    },
  ]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const toggleProductAvailability = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, available: !product.available } : product
      )
    );
  };

  const handleEditProduct = (product) => {
    console.log('Edit product:', product.name);
  };

const handleBuyProduct = (product) => {
    console.log('Comprar producto:', product.name, 'Precio:', product.price);
    // Aquí puedes implementar la lógica de compra:
    // - Añadir al carrito
    // - Navegar a una pantalla de confirmación de compra
    // - Mostrar un mensaje de éxito/error
    if (product.available) {
      alert(`¡${product.name} añadido al carrito por ${product.price}!`);
    } else {
      alert(`${product.name} no está disponible actualmente.`);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.manageProductsText}>Administrar Productos y Repuestos</Text>

        <Searchbar
          placeholder="Buscar producto"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          iconColor="#FC5501" 
          placeholderTextColor="#999"
        />

        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <Card key={product.id} style={styles.productCard}>
              <View style={styles.productCardContent}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productQuantity}>Cantidad: {product.quantity}</Text>
                </View>
              </View>
              <Text style={styles.productPrice}>{product.price}</Text>
              <View style={styles.cardActions}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>
                    {product.available ? 'Disponible' : 'Agotado'}
                  </Text>
                </View>
              </View>
              <Button
                mode="contained"
                onPress={() => handleBuyProduct(product)}
                style={styles.buyButton}
                labelStyle={styles.buyButtonLabel}
                disabled={!product.available} 
              >
                Comprar
              </Button>
            </Card>
          ))}
        </View>
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
});

export default ShopClientScreen;
