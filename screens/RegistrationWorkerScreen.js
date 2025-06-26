import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { ThemedButton, ThemedInput } from '../components/ThemedUIElements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';

export default function RegistrationWorkerScreen({ navigation }) {
  const [clave, setClave] = useState('');
  const [confirmClave, setConfirmClave] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [direccion, setDireccion] = useState('');

  return (
    <ThemedBackgroundGradient>
      {/* Botón volver al login */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Login')}
      >
        <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" style={styles.backIcon} />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Registro de KrizoWorker</Text>
        <View style={styles.card}>
          <ThemedInput
            label="Clave segura (8 dígitos)"
            value={clave}
            onChangeText={setClave}
            placeholder="Clave segura"
            secureTextEntry
            maxLength={8}
            keyboardType="numeric"
            left={<TextInput.Icon icon="lock" color="#262525" />}
          />
          <ThemedInput
            label="Confirmar clave segura"
            value={confirmClave}
            onChangeText={setConfirmClave}
            placeholder="Confirmar clave"
            secureTextEntry
            maxLength={8}
            keyboardType="numeric"
            left={<TextInput.Icon icon="lock-check" color="#262525" />}
          />
          <ThemedInput
            label="Nombre de la empresa"
            value={empresa}
            onChangeText={setEmpresa}
            placeholder="Nombre de la empresa"
            left={<TextInput.Icon icon="office-building" color="#FC5501" />}
          />
          <Text style={styles.label}>Dirección del local</Text>
          <ThemedInput
            label="Dirección de la empresa"
            value={direccion}
            onChangeText={setDireccion}
            placeholder="Dirección de la empresa"
            multiline
            numberOfLines={6}
            left={<TextInput.Icon icon="map-marker" color="#FC5501" />}
            style={{ minHeight: 110, textAlignVertical: 'top' }}
          />
          <ThemedButton
            style={styles.button}
            onPress={() => navigation.navigate('RegistrationWorkerScreen2')}
          >
            Continuar
          </ThemedButton>
        </View>
      </View>
      {/* Aviso de acceso exclusivo para trabajadores */}
      <View style={styles.exclusiveBanner}>
        <MaterialCommunityIcons name="lock" size={60} color="#262525" style={styles.lockIcon} />
        <Text style={styles.exclusiveBannerText}>Te estás regristrando como trabajador</Text>
      </View>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24, // Antes: 48. Reduce el padding para subir el contenedor blanco
    justifyContent: 'flex-start', // Asegura que el contenido se mantenga arriba
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: '#FC5501AA',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '98%',
    maxWidth: 500,
    alignItems: 'stretch',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 0,
    display: 'flex',
    justifyContent: 'center', // Añade esto para centrar verticalmente
    flexDirection: 'row',     // Añade esto para asegurar el centrado horizontal
  },
  button: {
    borderRadius: 20,
    backgroundColor: '#FC5501',
    paddingVertical: 12,
    width: 300, // Más largo, igual que otros botones de la app
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: '#FC5501',
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  exclusiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C24100',
    borderRadius: 0,
    paddingVertical: 14, // Antes: 30. Menos alto
    paddingHorizontal: 18,
    width: '100%',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    position: 'absolute',
    bottom: 64,
    left: 0,
  },
  exclusiveBannerText: {
    color: '#fff',
    fontSize: 18, // Más pequeño para que quepa mejor
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginLeft: 14,
    flexShrink: 1, // Permite que el texto se ajuste
    flexWrap: 'wrap', // Permite salto de línea
    maxWidth: '80%', // Limita el ancho del texto
  },
  lockIcon: {
    marginRight: 0,
  },
});