import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DetailScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Esta es la pantalla de Detalles</Text>
      <Text style={{ fontSize: 30, marginBottom: 20 }}>Probando conexion con el proyecto</Text>
      <Button
        title="Volver a Inicio"
        onPress={() => navigation.goBack()}
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
