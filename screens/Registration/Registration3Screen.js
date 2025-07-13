import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedButton } from '../../components/ThemedUIElements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

export default function Registration3Screen({ navigation, route }) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verifyEmail, resendVerification } = useAuth();
  
  // Obtener datos del usuario desde la navegación
  const userId = route.params?.userId;
  const userEmail = route.params?.userEmail;

  // Permite solo 6 dígitos
  const handleChange = (text) => {
    const sanitized = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(sanitized);
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Por favor ingresa el código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyEmail(userId, code);
      if (result.success) {
        Alert.alert('¡Éxito!', 'Email verificado correctamente', [
          { text: 'OK', onPress: () => navigation.navigate('Registration4') }
        ]);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al verificar el email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const result = await resendVerification(userId);
      if (result.success) {
        Alert.alert('Código reenviado', 'Se ha enviado un nuevo código a tu email');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al reenviar el código');
    } finally {
      setIsLoading(false);
    }
  };

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
        <MaterialCommunityIcons name="email-check-outline" size={50} color="#FC5501" style={styles.icon} />
        <Text style={styles.title}>Confirma tu correo electrónico</Text>
        <Text style={styles.subtitle}>
          Ingresa el código de 6 dígitos que te enviamos a {userEmail || 'tu email'}.
        </Text>
        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={handleChange}
            keyboardType="numeric"
            maxLength={6}
            placeholder="______"
            placeholderTextColor="#D1BFAF"
            textAlign="center"
            selectionColor="#FC5501"
            autoFocus
          />
        </View>
        <ThemedButton
          onPress={handleVerify}
          style={styles.button}
          disabled={code.length !== 6 || isLoading}
        >
          {isLoading ? 'Verificando...' : 'Verificar Email'}
        </ThemedButton>
        <Text style={styles.resendText}>
          ¿No recibiste el código? <Text style={styles.resendLink} onPress={handleResend}>Reenviar</Text>
        </Text>
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
  codeInputContainer: {
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  codeInput: {
    fontSize: 32,
    letterSpacing: 16,
    color: '#262525',
    backgroundColor: '#F5F2F0',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FC5501',
    width: 220,
    height: 60,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    width: 300,
    borderRadius: 20,
    backgroundColor: '#262525',
    marginBottom: 10,
  },
  resendText: {
    color: '#877063',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  resendLink: {
    color: '#FC5501',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
