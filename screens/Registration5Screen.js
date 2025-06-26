import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemedButton } from '../components/ThemedUIElements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Registration5Screen({ navigation }) {
  return (
    <LinearGradient
      colors={['#FC5501', '#C24100']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      {/* Botón volver al login */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Login')}
      >
        <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" style={styles.backIcon} />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <MaterialCommunityIcons name="card-account-details-outline" size={50} color="#FC5501" style={styles.icon} />
        <Text style={styles.title}>Sube una foto de tu documento de identidad</Text>
        <Text style={styles.subtitle}>
          Sube una foto clara y legible de tu cédula de identidad o documento oficial.
        </Text>
        {/* Aquí irá el componente para subir la foto */}
        <ThemedButton
          onPress={() => {/* lógica para subir foto */}}
          style={styles.button}
        >
          Subir foto
        </ThemedButton>
      </View>

      {/* Nuevo apartado para elegir tipo de registro */}
      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>¿Cómo deseas continuar?</Text>
        <Text style={styles.optionSubtitle}>
          Puedes terminar tu registro como usuario o continuar para registrarte como trabajador.
        </Text>
        <View style={styles.optionsRow}>
          <ThemedButton
            style={[
              styles.optionButton,
              { backgroundColor: '#FC5501', flexDirection: 'row', alignItems: 'center' }
            ]}
            onPress={() => navigation.replace('RegistrationWorker')}
            contentStyle={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 12 }}
            labelStyle={{ fontSize: 15, fontWeight: 'bold', color: '#fff', marginLeft: 10, flexShrink: 1, textAlign: 'left' }}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tow-truck" color="#fff" size={22} style={{ marginRight: 10, marginLeft: 0 }} />
            )}
          >
            Continuar como trabajador
          </ThemedButton>
          <ThemedButton
            style={[styles.optionButton, { backgroundColor: '#262525' }]}
            onPress={() => navigation.replace('Home')}
            labelStyle={{ fontSize: 15, fontWeight: 'bold', color: '#fff', flexShrink: 1, textAlign: 'center' }}
            contentStyle={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 }}
          >
            Terminar registro
          </ThemedButton>
        </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#262525',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 28,
    marginLeft: 18,
    marginBottom: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#FC5501',
  },
  backIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    marginTop: 20,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 10,
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#877063',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'column',
    width: '100%',
    gap: 14,
  },
  optionButton: {
    width: '100%',
    borderRadius: 20,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
});