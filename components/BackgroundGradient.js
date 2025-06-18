import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BackgroundGradient = ({ children }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FC5501', '#C24100']} // Los colores del degradado
        start={{ x: 0, y: 1 }}           // Abajo a la izquierda
        end={{ x: 1, y: 0 }}             // Arriba a la derecha
        style={StyleSheet.absoluteFillObject} // Ocupa todo el espacio
      />
      {/* 'children' es donde se renderizará el contenido de la pantalla */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    // Aseguramos que el contenido se centre si lo deseas
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackgroundGradient;