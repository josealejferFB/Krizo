import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Asegúrate de importar si usas íconos aquí
import Layout from '../components/Layout.js'; // Importa el Layout

export default function HomeScreen({ navigation }) {
  return (
    <Layout navigation={navigation}> {/* HomeScreen envuelve su contenido con Layout */}
      <View style={styles.innerContent}> {/* Este es el contenido REAL de la Home Screen */}
        <Text style={styles.mainTitle}>Bienvenido a Krizo</Text>
        <Text style={styles.subtitle}>Tu panel de control está listo.</Text>
        <MaterialCommunityIcons name="star" size={50} color="gold" style={{ marginTop: 20 }} />
        {/* Aquí iría el resto del contenido específico de tu pantalla de inicio */}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  // No necesitas un 'homeContent' aquí, ya que 'content' en Layout maneja el padding general
  innerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // No necesitas paddingTop aquí, ya que el Layout lo gestiona
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white', 
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white', 
    textAlign: 'center',
  },
});