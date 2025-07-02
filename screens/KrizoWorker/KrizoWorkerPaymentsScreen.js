import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';

export default function KrizoWorkerPaymentsScreen() {
  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mis pagos</Text>
        <Text style={styles.subtitle}>Consulta aquí tu historial de pagos y movimientos.</Text>
        {/* Aquí puedes agregar la lógica/listado de pagos */}
      </ScrollView>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 36,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#262525',
    textAlign: 'center',
    marginBottom: 20,
  },
});
