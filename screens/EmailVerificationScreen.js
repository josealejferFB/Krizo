import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { ThemedButton } from '../components/ThemedUIElements';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import { useAuth } from '../context/AuthContext';
import { useResponsiveDimensions } from '../context/DimensionsContext';

export default function EmailVerificationScreen({ navigation, route }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { verifyEmailWithCode, resendVerificationCode } = useAuth();
  const { paddingAmount } = useResponsiveDimensions();
  
  const email = route.params?.email || '';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Por favor ingresa el código de verificación');
      return;
    }

    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'El código debe tener 6 dígitos');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyEmailWithCode(email, verificationCode);
      if (result.success) {
        Alert.alert(
          '¡Verificación exitosa!',
          'Tu email ha sido verificado correctamente.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('KrizoWorkerLogin')
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Error al verificar el código');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al verificar el código. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const result = await resendVerificationCode(email);
      if (result.success) {
        Alert.alert('Código reenviado', 'Se ha enviado un nuevo código de verificación a tu email.');
        setTimeLeft(60);
      } else {
        Alert.alert('Error', result.message || 'Error al reenviar el código');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al reenviar el código. Inténtalo de nuevo.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ThemedBackgroundGradient>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.content, { paddingHorizontal: paddingAmount }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Verificar Email</Text>
            <Text style={styles.subtitle}>
              Ingresa el código de 6 dígitos que enviamos a:
            </Text>
            <Text style={styles.email}>{email}</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Código de verificación"
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="123456"
              maxLength={6}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="email-check" color="#262525" />}
            />

            <ThemedButton
              onPress={handleVerification}
              style={styles.verifyButton}
              disabled={isLoading || !verificationCode.trim()}
              loading={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Verificar Email'}
            </ThemedButton>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>¿No recibiste el código?</Text>
              {timeLeft > 0 ? (
                <Text style={styles.timerText}>
                  Reenviar en {timeLeft}s
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={resendLoading}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendButtonText}>
                    {resendLoading ? 'Enviando...' : 'Reenviar código'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#262525',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#FC5501',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  verifyButton: {
    marginBottom: 20,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 14,
    color: '#999',
  },
  resendButton: {
    paddingVertical: 5,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#FC5501',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
  },
}); 