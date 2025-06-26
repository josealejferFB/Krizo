import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { ThemedButton } from '../components/ThemedUIElements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';

export default function RegistrationWorkerScreen2({ navigation }) {
  const [rifImage, setRifImage] = useState(null);

  // Simulación de función para subir imagen
  const pickImage = async () => {
    // Aquí deberías usar expo-image-picker o similar
    // setRifImage(uri);
  };

  return (
    <ThemedBackgroundGradient>
      {/* Botón volver al login */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Login')}
      >
        <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" style={styles.backIcon} />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Documento RIF de la empresa</Text>
          <Text style={styles.subtitle}>
            Sube una foto clara y legible del documento RIF de tu empresa.
          </Text>
          <View style={styles.imageUploadBox}>
            {rifImage ? (
              <Image source={{ uri: rifImage }} style={styles.imagePreview} />
            ) : (
              <MaterialCommunityIcons name="file-upload-outline" size={48} color="#FC5501" />
            )}
            <ThemedButton
              style={styles.uploadButton}
              onPress={pickImage}
            >
              Subir foto RIF
            </ThemedButton>
          </View>
          <ThemedButton
            style={styles.button}
            onPress={() => navigation.replace('Home')}
          >
            Finalizar registro
          </ThemedButton>
        </View>
      </View>
      <View style={styles.exclusiveBanner}>
        <MaterialCommunityIcons name="lock" size={60} color="#262525" style={styles.lockIcon} />
        <Text style={styles.exclusiveBannerText}>Te estás registrando como trabajador</Text>
      </View>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Antes: 'flex-start'. Ahora centrado verticalmente.
    paddingTop: 0,           // Sin padding extra arriba.
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '80%',      // Antes: '90%'. Ahora menos ancho.
    maxWidth: 340,     // Antes: 400. Ahora menos ancho para mayor consistencia.
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#877063',
    marginBottom: 18,
    textAlign: 'center',
  },
  imageUploadBox: {
    alignItems: 'center',
    marginBottom: 18,
    width: '100%',
  },
  imagePreview: {
    width: 180,
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#FC5501',
  },
  uploadButton: {
    backgroundColor: '#FC5501',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 6,
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#262525', // Fondo negro
    paddingVertical: 12,
    width: 180, // Igual que el botón subir foto RIF
    borderWidth: 2,
    borderColor: '#FC5501', // Borde naranja
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#262525',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 28,
    marginLeft: 18,
    marginBottom: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#FC5501',
  },
  backIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  exclusiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C24100',
    borderRadius: 0,
    paddingVertical: 14,
    paddingHorizontal: 18,
    width: '100%',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    position: 'absolute',
    bottom: 64,
    left: 0,
  },
  exclusiveBannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginLeft: 14,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  lockIcon: {
    marginBottom: 4,
  },
});