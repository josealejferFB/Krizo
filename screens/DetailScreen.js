import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native'; // Asegúrate de importar View si vas a usarlo internamente
import BackgroundGradient from '../components/BackgroundGradient'; // Importa el componente de degradado

export default function DetailScreen({ navigation }) {
  return (
    // ¡Aquí está el cambio clave! El BackgroundGradient es ahora el elemento raíz.
    <BackgroundGradient>
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
    color: '#FFFFFF', // El color blanco es ideal para el degradado
    textAlign: 'center',
  },
  // Si tienes más estilos para elementos específicos dentro de DetailScreen, agrégalos aquí.
  // El 'container' que tenías antes ya no es necesario aquí porque BackgroundGradient maneja el fondo.
});