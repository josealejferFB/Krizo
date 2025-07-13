import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { ThemedButton, ThemedInput } from '../../components/ThemedUIElements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';
import { useResponsiveDimensions } from '../../context/DimensionsContext';
import { useAuth } from '../../context/AuthContext';

export default function RegistrationWorkerScreen({ navigation }) {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { paddingAmount, bottomPosition } = useResponsiveDimensions();
  const { register } = useAuth();

  const handleRegister = async () => {
    // Validaciones
    if (!nombres.trim() || !apellidos.trim() || !cedula.trim() || !email.trim() || !telefono.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        cedula: cedula.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        password: password,
        tipo: 'krizoworker'
      });

      if (result.success) {
        Alert.alert('Éxito', 'Registro exitoso. Revisa tu email para verificar tu cuenta.', [
          { text: 'OK', onPress: () => navigation.navigate('KrizoWorkerLogin') }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Error en el registro');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

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
      <View style={{
        flex: 1,
    alignItems: 'center',
    paddingTop: paddingAmount, // Antes: 48. Reduce el padding para subir el contenedor blanco
    justifyContent: 'flex-start',
      }}>
        <Text style={styles.headerTitle}>Registro de KrizoWorker</Text>
        <View style={styles.card}>
          <ThemedInput
            label="Nombres"
            value={nombres}
            onChangeText={setNombres}
            placeholder="Ingresa tus nombres"
            left={<TextInput.Icon icon="account" color="#262525" />}
          />
          <ThemedInput
            label="Apellidos"
            value={apellidos}
            onChangeText={setApellidos}
            placeholder="Ingresa tus apellidos"
            left={<TextInput.Icon icon="account" color="#262525" />}
          />
          <ThemedInput
            label="Cédula"
            value={cedula}
            onChangeText={setCedula}
            placeholder="Ingresa tu cédula"
            keyboardType="numeric"
            left={<TextInput.Icon icon="card-account-details" color="#262525" />}
          />
          <ThemedInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Ingresa tu email"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" color="#262525" />}
          />
          <ThemedInput
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Ingresa tu teléfono"
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" color="#262525" />}
          />
          <ThemedInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contraseña"
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock" color="#262525" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                color="#262525"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <ThemedInput
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirma tu contraseña"
            secureTextEntry={!showConfirmPassword}
            left={<TextInput.Icon icon="lock-check" color="#262525" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                color="#262525"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          <ThemedButton
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </ThemedButton>
        </View>
      </View>
      {/* Aviso de acceso exclusivo para trabajadores */}
      <View style={{
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
    position: 'fixed',
    bottom: bottomPosition,
    left: 0,

      }}>
        <MaterialCommunityIcons name="lock" size={60} color="#262525" style={styles.lockIcon} />
        <Text style={styles.exclusiveBannerText}>Registro exclusivo para trabajadores</Text>
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
    maxWidth: 400,
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
