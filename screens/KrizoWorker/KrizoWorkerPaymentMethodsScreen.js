import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';

export default function KrizoWorkerPaymentMethodsScreen({ navigation }) {
  const [paypalEmail, setPaypalEmail] = useState('');
  const [binanceId, setBinanceId] = useState('');
  const [savedPaypalEmail, setSavedPaypalEmail] = useState('');
  const [savedBinanceId, setSavedBinanceId] = useState('');
  const [isLoadingPaypal, setIsLoadingPaypal] = useState(false);
  const [isLoadingBinance, setIsLoadingBinance] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  // Cargar datos guardados al abrir la pantalla
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  // Función para cargar métodos de pago guardados
  const loadPaymentMethods = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/6/payment-methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer test-token`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSavedPaypalEmail(result.data.paypalEmail || '');
          setSavedBinanceId(result.data.binanceId || '');
          // También llenar los inputs con los datos guardados
          setPaypalEmail(result.data.paypalEmail || '');
          setBinanceId(result.data.binanceId || '');
        }
      }
    } catch (error) {
      console.error('Error cargando métodos de pago:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Validar formato de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Guardar método PayPal
  const savePaypalMethod = async () => {
    if (!paypalEmail.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo de PayPal');
      return;
    }

    if (!isValidEmail(paypalEmail.trim())) {
      Alert.alert('Error', 'Por favor ingresa un correo válido');
      return;
    }

    setIsLoadingPaypal(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/6/payment-methods`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer test-token`
        },
        body: JSON.stringify({
          paypalEmail: paypalEmail.trim(),
          binanceId: null
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setSavedPaypalEmail(paypalEmail.trim());
        Alert.alert(
          'Éxito',
          result.message || 'Método PayPal guardado correctamente',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', result.message || 'No se pudo guardar el método PayPal');
      }
    } catch (error) {
      console.error('Error guardando PayPal:', error);
      Alert.alert('Error', 'No se pudo guardar el método PayPal');
    } finally {
      setIsLoadingPaypal(false);
    }
  };

  // Guardar método Binance
  const saveBinanceMethod = async () => {
    if (!binanceId.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu ID de Binance Pay');
      return;
    }

    setIsLoadingBinance(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/6/payment-methods`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer test-token`
        },
        body: JSON.stringify({
          paypalEmail: null,
          binanceId: binanceId.trim()
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setSavedBinanceId(binanceId.trim());
        Alert.alert(
          'Éxito',
          result.message || 'Método Binance Pay guardado correctamente',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', result.message || 'No se pudo guardar el método Binance Pay');
      }
    } catch (error) {
      console.error('Error guardando Binance:', error);
      Alert.alert('Error', 'No se pudo guardar el método Binance Pay');
    } finally {
      setIsLoadingBinance(false);
    }
  };

  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón volver elegante */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backIconCircle}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" />
          </View>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Métodos de Pago</Text>
          <Text style={styles.subtitle}>
            Configura tus métodos de pago para recibir pagos de clientes.
          </Text>

          {/* Sección PayPal */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="credit-card" size={32} color="#003087" />
              <Text style={styles.sectionTitle}>PayPal</Text>
            </View>
            
            {/* Mostrar datos guardados */}
            {savedPaypalEmail && (
              <View style={styles.savedDataContainer}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.savedDataText}>
                  Método guardado: {savedPaypalEmail}
                </Text>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo de PayPal *</Text>
              <TextInput
                style={styles.textInput}
                value={paypalEmail}
                onChangeText={setPaypalEmail}
                placeholder="ejemplo@paypal.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isLoadingPaypal && styles.saveButtonDisabled]}
              activeOpacity={0.8}
              onPress={savePaypalMethod}
              disabled={isLoadingPaypal}
            >
              <MaterialCommunityIcons 
                name={isLoadingPaypal ? "loading" : "content-save"} 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.saveButtonText}>
                {isLoadingPaypal ? 'Guardando...' : 'Guardar método'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Separador */}
          <View style={styles.separator} />

          {/* Sección Binance Pay */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="currency-btc" size={32} color="#F3BA2F" />
              <Text style={styles.sectionTitle}>Binance Pay</Text>
            </View>
            
            {/* Mostrar datos guardados */}
            {savedBinanceId && (
              <View style={styles.savedDataContainer}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.savedDataText}>
                  Método guardado: {savedBinanceId}
                </Text>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>ID de Binance Pay *</Text>
              <TextInput
                style={styles.textInput}
                value={binanceId}
                onChangeText={setBinanceId}
                placeholder="Ingresa tu ID de Binance Pay"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              <Text style={styles.helpText}>
                Puedes obtener tu ID desde la app de Binance {'>'} Binance Pay {'>'} Recibir
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isLoadingBinance && styles.saveButtonDisabled]}
              activeOpacity={0.8}
              onPress={saveBinanceMethod}
              disabled={isLoadingBinance}
            >
              <MaterialCommunityIcons 
                name={isLoadingBinance ? "loading" : "content-save"} 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.saveButtonText}>
                {isLoadingBinance ? 'Guardando...' : 'Guardar método'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#FC5501',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FC5501',
  },
  backIconCircle: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 6,
    padding: 2,
  },
  backButtonText: {
    color: '#FC5501',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 18,
    width: '92%',
    maxWidth: 370,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 18,
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 6,
    marginTop: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#C24100',
    textAlign: 'center',
    marginBottom: 28,
    fontStyle: 'italic',
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262525',
    marginLeft: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262525',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#262525',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FC5501',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    elevation: 3,
    shadowColor: '#FC5501',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 24,
  },
  savedDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  savedDataText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 8,
  },
}); 
