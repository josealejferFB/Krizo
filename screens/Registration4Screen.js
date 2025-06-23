import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ThemedButton } from '../components/ThemedUIElements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Registration4Screen({ navigation }) {
  return (
    <LinearGradient
      colors={['#FC5501', '#C24100']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.card}>
        <MaterialCommunityIcons name="face-recognition" size={50} color="#FC5501" style={styles.icon} />
        <Text style={styles.title}>Sube una foto de tu cara</Text>
        <Text style={styles.subtitle}>
          Tómate una selfie en un lugar bien iluminado. Esta foto servirá para validar tu identidad.
        </Text>
        {/* Aquí irá el componente para subir la foto */}
        <ThemedButton
          onPress={() => navigation.navigate('Registration5')}
          style={styles.button}
        >
          Siguiente
        </ThemedButton>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
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
    fontSize: 24,
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
  button: {
    width: 300,
    borderRadius: 20,
    backgroundColor: '#262525',
  },
});