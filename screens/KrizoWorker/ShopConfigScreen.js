import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Appbar, Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// If you're using Expo, you would typically import ImagePicker like this:
// import * as ImagePicker from 'expo-image-picker';
// If not using Expo, you'd use a different library like react-native-image-picker
// For this example, we'll just simulate the image pick.

const ShopConfigScreen = () => {
  const navigation = useNavigation();

  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImageUri, setProductImageUri] = useState(null); // State to store image URI

  // Function to handle picking an image (simulated for now)
  const pickImage = async () => {
    // In a real app with expo-image-picker:
    /*
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProductImageUri(result.assets[0].uri);
    }
    */
    Alert.alert(
      "Subir Imagen",
      "Esto simularía la apertura de la galería/cámara. Selecciona una imagen de prueba.",
      [
        {
          text: "Seleccionar Imagen",
          onPress: () => setProductImageUri('https://via.placeholder.com/150/0000FF/FFFFFF?text=Tu+Producto'),
        },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const handleSaveChanges = () => {
    if (!productName || !productBrand || !productQuantity || !productPrice || !productImageUri) {
      Alert.alert('Campos Incompletos', 'Por favor, rellena todos los campos y selecciona una imagen.');
      return;
    }

    // Here you would typically send this data to your backend API
    const newProduct = {
      name: productName,
      brand: productBrand,
      quantity: parseInt(productQuantity), // Convert to number
      price: parseFloat(productPrice), // Convert to number
      imageUri: productImageUri,
      // You might also add a unique ID, timestamp, etc.
    };

    console.log('Guardando nuevo producto:', newProduct);
    Alert.alert('Producto Añadido', 'El producto ha sido guardado exitosamente.');

    // Optionally, reset form fields after saving
    setProductName('');
    setProductBrand('');
    setProductQuantity('');
    setProductPrice('');
    setProductImageUri(null);

    // You might also nigate back or to a product list screen
    // navigation.goBack();
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
    justifyContent: 'center', // Center title
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
    // Adjust margin to counteract back button and center title
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
    // alignItems: 'center', // Removed as inputs should be left-aligned by default now
  },
  textInput: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white', // Ensure white background for inputs
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // Light gray background
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 20, // Space before save button
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  imagePickerButtonText: {
    fontSize: 16,
    color: '#FC5501', // Orange text
    marginLeft: 10,
    fontWeight: 'bold',
  },
  selectedImagePreview: {
    width: 150,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 20, // Space between image preview and button
    alignSelf: 'center', // Center the image preview
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
