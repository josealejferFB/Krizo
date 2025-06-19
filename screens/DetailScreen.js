import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ThemedButton } from '../components/ThemedUIElements';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';

export default function DetailScreen({ navigation }) {
  return (
    <ThemedBackgroundGradient>
      <Text style={styles.title}>Esta es la pantalla de Detalles</Text>
      <ThemedButton
        onPress={() => navigation.goBack()}
        mode="text"
      >
        Volver a Inicio
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
    color: '#FFFFFF',
  },
});