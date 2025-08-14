import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking, Platform } from 'react-native';
import { Appbar, Text, TextInput, Button } from 'react-native-paper'; // Asegúrate de importar Picker
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const ShopConfigScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';
  const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://192.168.1.14:5000/api';

  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImageUri, setProductImageUri] = useState(null);
  const [productCategory, setProductCategory] = useState(''); // Estado para la categoría

  // Definir las categorías
  const categories = [
    { label: 'Selecciona una categoría', value: '' },
    { label: 'Motores', value: 'motores' },
    { label: 'Pastillas', value: 'pastillas' },
    { label: 'Baterías', value: 'baterias' },
    { label: 'Aceites', value: 'aceites' },
    { label: 'Filtros', value: 'filtros' },
    // Agrega más categorías según sea necesario
  ];

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permisos requeridos',
            'Por favor otorga permisos para acceder a tu galería',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Abrir configuración', onPress: () => Linking.openSettings() }
            ]
          );
          return;
        }
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        setProductImageUri(result.assets[0].uri);
        Alert.alert('Imagen seleccionada', 'La imagen se ha cargado correctamente');
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSaveChanges = async () => {
    if (!productName || !productBrand || !productQuantity || !productPrice || !productImageUri || !productCategory) {
      Alert.alert('Campos Incompletos', 'Por favor, rellena todos los campos y selecciona una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('brand', productBrand);
    formData.append('quantity', parseInt(productQuantity));
    formData.append('price', parseFloat(productPrice));
    formData.append('category', productCategory); // Agregar la categoría al FormData

    // Agregar la imagen como archivo
    formData.append('image', {
      uri: productImageUri,
      name: `product_${Date.now()}.jpg`, // Nombre único
      type: 'image/jpeg'
    });

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`        
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Producto Añadido', 'El producto ha sido guardado exitosamente.');
        // Reiniciar campos después de guardar
        setProductName('');
        setProductBrand('');
        setProductQuantity('');
        setProductPrice('');
        setProductCategory(''); // Reiniciar categoría
        setProductImageUri(null);
      } else {
        Alert.alert('Error', data.message || 'Error al guardar el producto.');
      }
    } catch (error) {
      console.error('Error al registrar el producto:', error);
      Alert.alert('Error', 'Error al registrar el producto.');
    }
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
            <Text style={styles.appBarTitle}>Añadir producto</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TextInput
          label="Nombre del producto"
          value={productName}
          onChangeText={setProductName}
          mode="outlined"
          style={styles.textInput}
          outlineColor="#ccc"
          activeOutlineColor="#FC5501"
          theme={{ colors: { text: '#333', primary: '#FC5501', placeholder: '#666' } }}
        />

        <TextInput
          label="Marca del producto"
          value={productBrand}
          onChangeText={setProductBrand}
          mode="outlined"
          style={styles.textInput}
          outlineColor="#ccc"
          activeOutlineColor="#FC5501"
          theme={{ colors: { text: '#333', primary: '#FC5501', placeholder: '#666' } }}
        />

        <TextInput
          label="Cantidad del producto"
          value={productQuantity}
          onChangeText={setProductQuantity}
          keyboardType="numeric" 
          mode="outlined"
          style={styles.textInput}
          outlineColor="#ccc"
          activeOutlineColor="#FC5501"
          theme={{ colors: { text: '#333', primary: '#FC5501', placeholder: '#666' } }}
        />

        <TextInput
          label="Precio del producto (bs)"
          value={productPrice}
          onChangeText={setProductPrice}
          keyboardType="numeric" 
          mode="outlined"
          style={styles.textInput}
          outlineColor="#ccc"
          activeOutlineColor="#FC5501"
          theme={{ colors: { text: '#333', primary: '#FC5501', placeholder: '#666' } }}
        />

        {/* Selector de categoría */}
        <Picker
  selectedValue={productCategory}
  onValueChange={(itemValue) => setProductCategory(itemValue)}
  style={styles.picker}
>
  {categories.map((cat) => (
    <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
  ))}
</Picker>

        <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
          <Icon name="camera-plus" size={24} color="#FC5501" />
          <Text style={styles.imagePickerButtonText}>
            {productImageUri ? 'Imagen seleccionada' : 'Subir imagen del producto'}
          </Text>
        </TouchableOpacity>
        {productImageUri && (
          <Image source={{ uri: productImageUri }} style={styles.selectedImagePreview} />
        )}

        <Button
          mode="contained"
          onPress={handleSaveChanges}
          style={styles.saveChangesButton}
          labelStyle={styles.saveChangesButtonLabel}
        >
          Guardar cambios
        </Button>
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
  },
  textInput: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white',
  },
  picker: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  imagePickerButtonText: {
    fontSize: 16,
    color: '#FC5501',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  selectedImagePreview: {
    width: 150,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 20,
    alignSelf: 'center',
  },
  saveChangesButton: {
    backgroundColor: '#FC5501',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 8,
    marginTop: 10,
  },
  saveChangesButtonLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShopConfigScreen;
