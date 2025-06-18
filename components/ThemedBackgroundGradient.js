import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper'; // Importamos useTheme de react-native-paper

const ThemedBackgroundGradient = ({ children }) => {
  const theme = useTheme(); // Obtenemos el tema actual (claro u oscuro)

  // Definimos los colores del degradado según el tema
  const gradientColors = theme.dark // 'theme.dark' es true si es modo oscuro
    ? ['#FC5501', '#C24100'] // Colores para el modo oscuro (ejemplo: morado oscuro a rojo oscuro)
    : ['#FC5501', '#C24100']; // Tus colores originales para el modo claro

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors} // Usamos los colores definidos dinámicamente
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemedBackgroundGradient; // Exportamos el nuevo nombre