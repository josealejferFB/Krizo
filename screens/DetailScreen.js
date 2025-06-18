import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BackgroundGradient from '../components/BackgroundGradient'; // ¡Importa el nuevo componente!

export default function DetailScreen({ navigation }) {
  return (
    <BackgroundGradient> {/* Envuelve tu contenido con el degradado */}
      <Text style={styles.title}>Esta es la pantalla de Detalles</Text>
      <Button
        title="Volver a Inicio"
        onPress={() => navigation.goBack()}
        color="#FFFFFF" // Color del texto del botón para que contraste
      />
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#FFFFFF', // ¡Cambia el color del texto a blanco!
    textAlign: 'center',
  },
});