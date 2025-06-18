import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, marginBottom: 20 }}>¡Bienvenido! Inicia Sesión</Text>
      <Button
        title="Ingresar (Simulado)"
        onPress={() => {
          // Aquí iría tu lógica de autenticación
          // Por ahora, simplemente navegamos a HomeScreen (o donde quieras ir después del login)
          navigation.replace('Home'); // Usamos replace para que no puedan volver al login fácilmente
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});