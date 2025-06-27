import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ThemedButton } from '../components/ThemedUIElements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';

// Importa CheckBox de react-native-paper o react-native-elements según tu stack
import { Checkbox } from 'react-native-paper';

export default function RegistrationWorkerScreen2({ navigation }) {
  const [rifImage, setRifImage] = useState(null);

  // Estado para los servicios
  const [services, setServices] = useState({
    mecanico: false,
    grua: false,
    repuestos: false,
  });

  // Simulación de función para subir imagen
  const pickImage = async () => {

    // Aquí deberías usar expo-image-picker o similar
    // setRifImage(uri);
  };

  const handleServiceChange = (key) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { width, height } = useWindowDimensions();

  // Define un breakpoint para considerar una pantalla "grande"
  const isLargeScreen = width > 768; // Puedes ajustar este valor según tus necesidades

  const bottomPosition = isLargeScreen ? 64 : '1%'; // Más arriba en pantallas grandes, más abajo en pequeñas

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
            Sube una foto clara y legible o un documento PDF del documento RIF de tu empresa.
          </Text>
          <View style={styles.imageUploadBox}>
            {rifImage ? (
              <Image source={{ uri: rifImage }} style={styles.imagePreview} />
            ) : (
              <MaterialCommunityIcons name="file-upload-outline" size={48} color="#FC5501" />
            )}
            <View style={styles.uploadRow}>
              <ThemedButton
                style={styles.uploadButton}
                onPress={pickImage}
              >
                Subir foto
              </ThemedButton>
              <ThemedButton
                style={[styles.uploadButton, styles.pdfButton]}
                onPress={() => {
                  // Aquí deberías implementar la lógica para subir PDF
                }}
              >
                Subir PDF
              </ThemedButton>
            </View>
          </View>
          {/* Apartado de checkbox de servicios */}
          <View style={styles.servicesSection}>
            <Text style={styles.servicesTitle}>Selecciona los servicios que brinda la empresa:</Text>
            <View style={styles.checkboxRow}>
              <Checkbox
                status={services.mecanico ? 'checked' : 'unchecked'}
                onPress={() => handleServiceChange('mecanico')}
                color="#FC5501"
              />
              <Text style={styles.checkboxLabel}>Servicio Mecánico Vehícular</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox
                status={services.grua ? 'checked' : 'unchecked'}
                onPress={() => handleServiceChange('grua')}
                color="#FC5501"
              />
              <Text style={styles.checkboxLabel}>Servicio de Grúa</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox
                status={services.repuestos ? 'checked' : 'unchecked'}
                onPress={() => handleServiceChange('repuestos')}
                color="#FC5501"
              />
              <Text style={styles.checkboxLabel}>Venta de Repuestos</Text>
            </View>
          </View>
          <ThemedButton
            style={styles.button}
            onPress={() => navigation.replace('Home')}
          >
            Finalizar registro
          </ThemedButton>
        </View>
      </View>
      <View style={{
          flexDirection: 'row',
          alignItems: 'center',
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
          left: 0,
            bottom: bottomPosition,
            backgroundColor: '#C24100',
          }}>
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
    justifyContent: 'center',
    paddingTop: 0,      // Sube aún más el contenedor blanco (antes: 24)
    paddingBottom: 100, // Mantén el espacio para el banner
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '100%',      // Antes: '92%'. Ahora más angosto para que no ocupe tanto ancho.
    maxWidth: 360,     // Antes: 400. Más pequeño para mejor ajuste en móviles.
    alignItems: 'stretch',
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
    paddingHorizontal: 0,
    marginTop: 6,
    flex: 1,
    minWidth: 0,
    marginRight: 8, // Espacio entre los botones
    maxWidth: 160,  // Limita el ancho para que ambos quepan
  },
  pdfButton: {
    backgroundColor: '#262525', // Fondo negro
    borderColor: '#FC5501',
    borderWidth: 2,
    marginLeft: 0,
    marginRight: 0,
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#262525', // Fondo negro
    paddingVertical: 12,
    width: '100%', // Ocupa todo el ancho del contenedor blanco
    borderWidth: 2,
    borderColor: '#FC5501', // Borde naranja
    alignSelf: 'center',
    marginBottom: 10,
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
  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 0, // Si tu versión de React Native no soporta gap, usa marginRight en el primer botón
  },
  servicesSection: {
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  servicesTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#262525',
    marginLeft: 8,
  },
});
