import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ThemedButton } from '../components/ThemedUIElements';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient'; // ¡Nombre corregido aquí!

export default function HomeScreen({ navigation }) {
  return (
    <ThemedBackgroundGradient> {/* Usando el componente con el nombre correcto */}
      <Text style={styles.title}>¡Estás en la pantalla principal!</Text>
      <ThemedButton
        onPress={() => navigation.navigate('Details')}
        mode="outlined"
      >
        Ir a Detalles
      </ThemedButton>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF', // Texto blanco para que contraste
  },
});