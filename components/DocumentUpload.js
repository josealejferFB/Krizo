import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DocumentUpload({ onImageSelected, style }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos de cámara y galería para subir fotos de documentos.'
        );
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setUploading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const image = result.assets[0];
        setSelectedImage(image.uri);
        onImageSelected(image);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al tomar la foto. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const image = result.assets[0];
        setSelectedImage(image.uri);
        onImageSelected(image);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al seleccionar la imagen. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Subir documento de identidad',
      'Selecciona una opción para subir tu documento:',
      [
        {
          text: 'Tomar foto',
          onPress: takePhoto,
        },
        {
          text: 'Seleccionar de galería',
          onPress: pickImage,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const removeImage = () => {
    setSelectedImage(null);
    onImageSelected(null);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Foto del documento de identidad</Text>
      
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <MaterialCommunityIcons name="close-circle" size={24} color="#FF4444" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.changeButton} 
            onPress={showImageOptions}
            disabled={uploading}
          >
            <Text style={styles.changeButtonText}>
              {uploading ? 'Procesando...' : 'Cambiar foto'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={showImageOptions}
          disabled={uploading}
        >
          <MaterialCommunityIcons 
            name="camera-plus" 
            size={48} 
            color="#FC5501" 
          />
          <Text style={styles.uploadText}>
            {uploading ? 'Procesando...' : 'Toca para subir foto'}
          </Text>
          <Text style={styles.uploadSubtext}>
            Cédula, pasaporte o documento de identidad
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262525',
    marginBottom: 10,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#FC5501',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FC5501',
    marginTop: 10,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  changeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FC5501',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 