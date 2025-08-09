import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Card, Button, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

// Datos de ejemplo para empezar
const DUMMY_PRODUCTS = [
  {
    id: '1',
    name: 'Auriculares Inalámbricos',
    price: '45.00',
    description: 'Auriculares con cancelación de ruido y batería de larga duración.',
    imageUri: 'https://images.unsplash.com/photo-1546435770-a3e430ef7597?q=80&w=2974&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Reloj Inteligente',
    price: '120.00',
    description: 'Monitor de ritmo cardíaco, GPS y notificaciones.',
    imageUri: 'https://images.unsplash.com/photo-1549420658-009951919864?q=80&w=3024&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Teclado Mecánico',
    price: '89.99',
    description: 'Switches táctiles para una experiencia de escritura superior.',
    imageUri: 'https://images.unsplash.com/photo-1616832873151-c03780517596?q=80&w=2970&auto=format&fit=crop',
  },
];

const ProductManager = () => {
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const clearForm = () => {
    setProductName('');
    setProductPrice('');
    setProductDescription('');
    setImageUri(null);
    setIsEditing(false);
    setEditingProductId(null);
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería para subir imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddProduct = () => {
    if (!productName || !productPrice || !imageUri) {
      Alert.alert('Error', 'Por favor, completa todos los campos y añade una imagen.');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      price: productPrice,
      description: productDescription,
      imageUri: imageUri,
    };

    setProducts([...products, newProduct]);
    clearForm();
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setEditingProductId(product.id);
    setProductName(product.name);
    setProductPrice(product.price);
    setProductDescription(product.description);
    setImageUri(product.imageUri);
  };

  const handleSaveEdit = () => {
    if (!productName || !productPrice || !imageUri) {
      Alert.alert('Error', 'Por favor, completa todos los campos y añade una imagen.');
      return;
    }

    const updatedProducts = products.map((product) =>
      product.id === editingProductId
        ? {
            ...product,
            name: productName,
            price: productPrice,
            description: productDescription,
            imageUri: imageUri,
          }
        : product
    );

    setProducts(updatedProducts);
    clearForm();
  };

  const handleDeleteProduct = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedProducts = products.filter((product) => product.id !== id);
            setProducts(updatedProducts);
            clearForm();
          },
        },
      ]
    );
  };

  const renderProductItem = ({ item }) => (
    <Card style={styles.productCard}>
      <Image source={{ uri: item.imageUri }} style={styles.productImage} />
      <Card.Content>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button
          mode="text"
          onPress={() => handleEditProduct(item)}
          icon="pencil-outline"
        >
          Editar
        </Button>
        <Button
          mode="text"
          onPress={() => handleDeleteProduct(item.id)}
          icon="delete-outline"
          color="#FC5501"
        >
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.headerTitle}>Gestión de Productos</Text>

        {/* --- Formulario para Añadir/Editar Producto --- */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}
          </Text>

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={handleImagePicker}
          >
            <Icon name="camera" size={20} color="#fff" />
            <Text style={styles.imagePickerButtonText}>
              {imageUri ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Nombre del producto"
            value={productName}
            onChangeText={setProductName}
          />
          <TextInput
            style={styles.input}
            placeholder="Precio"
            keyboardType="numeric"
            value={productPrice}
            onChangeText={setProductPrice}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción"
            multiline
            value={productDescription}
            onChangeText={setProductDescription}
          />

          <Button
            mode="contained"
            style={styles.actionButton}
            onPress={isEditing ? handleSaveEdit : handleAddProduct}
            icon={isEditing ? 'content-save' : 'plus-circle-outline'}
          >
            {isEditing ? 'Guardar Cambios' : 'Añadir Producto'}
          </Button>

          {isEditing && (
            <Button
              mode="outlined"
              style={styles.cancelButton}
              onPress={clearForm}
              icon="cancel"
              color="#333"
            >
              Cancelar
            </Button>
          )}
        </View>

        {/* --- Lista de Productos --- */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Tus Productos</Text>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            contentContainerStyle={styles.productList}
            nestedScrollEnabled
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#555',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  imagePickerButton: {
    flexDirection: 'row',
    backgroundColor: '#FC5501',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  actionButton: {
    backgroundColor: '#FC5501',
    borderRadius: 8,
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 10,
    borderColor: '#333',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  productImage: {
    height: 180,
    width: '100%',
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#FC5501',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});

export default ProductManager;