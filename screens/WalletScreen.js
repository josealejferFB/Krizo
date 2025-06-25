import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WalletScreen() {
  return (
    <ThemedBackgroundGradient>
      <View style={styles.container}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="wallet" size={60} color="#FC5501" style={styles.icon} />
          <Text style={styles.title}>Mi Billetera</Text>
          <Text style={styles.subtitle}>
            Aquí podrás ver y gestionar tu saldo, movimientos y métodos de pago.
          </Text>
          {/* Aquí puedes agregar más componentes de saldo, movimientos, etc. */}
        </View>
      </View>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#877063',
    marginBottom: 24,
    textAlign: 'center',
  },
});