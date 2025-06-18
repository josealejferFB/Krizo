import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient'; // ¡Importa el nuevo componente!

export default function HomeScreen({ navigation }) {
  return (
    <ThemedBackgroundGradient> {/* Envuelve tu contenido con el degradado */}
      <Text style={styles.title}>¡Estás en la pantalla principal!</Text>
      <Button
        title="Ir a Detalles"
        onPress={() => navigation.navigate('Details')}
        color="#FFFFFF" // Color del texto del botón para que contraste
      />
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  // Similar al LoginScreen, el container base no necesita fondo ni flex aquí.
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#FFFFFF', // ¡Cambia el color del texto a blanco!
    textAlign: 'center',
  },
});