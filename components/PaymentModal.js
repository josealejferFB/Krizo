import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { Button, Card, Avatar, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const PaymentModal = ({ visible, onClose, quote, onPaymentCompleted }) => {
  const { token, user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('paypal');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'paypal',
      color: '#0070BA',
      description: 'Paga de forma segura con PayPal'
    },
    {
      id: 'binance',
      name: 'Binance Pay',
      icon: 'currency-btc',
      color: '#F7931A',
      description: 'Paga con criptomonedas'
    }
  ];

  const processPayment = async () => {
    try {
      setIsProcessing(true);

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Actualizar estado de la cotización
      const response = await fetch(`http://192.168.1.14:5000/api/quotes/${quote.id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_method: selectedMethod,
          status: 'paid'
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Alert.alert(
            'Pago Exitoso',
            `Tu pago de $${quote.total_price} ha sido procesado correctamente. El mecánico será notificado.`,
            [
              {
                text: 'OK',
                onPress: () => {
                  onPaymentCompleted(result.data);
                  onClose();
                }
              }
            ]
          );
        } else {
          Alert.alert('Error', result.message || 'No se pudo procesar el pago');
        }
      } else {
        Alert.alert('Error', 'No se pudo procesar el pago');
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      Alert.alert('Error', 'No se pudo procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const openPaymentApp = () => {
    let url = '';
    if (selectedMethod === 'paypal') {
      url = 'https://www.paypal.com';
    } else if (selectedMethod === 'binance') {
      url = 'https://www.binance.com';
    }

    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'No se pudo abrir la aplicación de pago');
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#FC5501', '#C24100']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Icon name="credit-card" size={24} color="white" />
              <Text style={styles.headerTitle}>Procesar Pago</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <Card style={styles.quoteCard}>
            <Card.Content>
              <Text style={styles.quoteTitle}>Resumen de Cotización</Text>
              
              {quote.services?.map((service, index) => (
                <View key={index} style={styles.serviceRow}>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                  <Text style={styles.servicePrice}>${service.price}</Text>
                </View>
              ))}
              
              {quote.transport_fee > 0 && (
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceDescription}>Costo de traslado</Text>
                  <Text style={styles.servicePrice}>${quote.transport_fee}</Text>
                </View>
              )}
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total a pagar:</Text>
                <Text style={styles.totalAmount}>${quote.total_price}</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.methodsCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Método de Pago</Text>
              
              <RadioButton.Group
                onValueChange={value => setSelectedMethod(value)}
                value={selectedMethod}
              >
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.methodItem,
                      selectedMethod === method.id && styles.methodItemSelected
                    ]}
                    onPress={() => setSelectedMethod(method.id)}
                  >
                    <View style={styles.methodInfo}>
                      <Icon 
                        name={method.icon} 
                        size={24} 
                        color={method.color} 
                      />
                      <View style={styles.methodDetails}>
                        <Text style={styles.methodName}>{method.name}</Text>
                        <Text style={styles.methodDescription}>{method.description}</Text>
                      </View>
                    </View>
                    <RadioButton value={method.id} color="#FC5501" />
                  </TouchableOpacity>
                ))}
              </RadioButton.Group>
            </Card.Content>
          </Card>

          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoRow}>
                <Icon name="shield-check" size={20} color="#4CAF50" />
                <Text style={styles.infoText}>Pago 100% seguro y encriptado</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="clock-outline" size={20} color="#FF9800" />
                <Text style={styles.infoText}>Procesamiento instantáneo</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="receipt" size={20} color="#2196F3" />
                <Text style={styles.infoText}>Recibo digital incluido</Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={openPaymentApp}
              style={styles.appButton}
              labelStyle={styles.appButtonText}
            >
              Abrir App
            </Button>
            
            <Button
              mode="contained"
              onPress={processPayment}
              loading={isProcessing}
              disabled={isProcessing}
              style={styles.payButton}
              labelStyle={styles.payButtonText}
            >
              {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    marginRight: 16,
    padding: 4,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  quoteCard: {
    marginBottom: 16,
    elevation: 2,
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC5501',
  },
  methodsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  methodItemSelected: {
    borderColor: '#FC5501',
    backgroundColor: '#FFF3E0',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodDetails: {
    marginLeft: 12,
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  appButton: {
    flex: 1,
    borderColor: '#FC5501',
    borderWidth: 2,
  },
  appButtonText: {
    color: '#FC5501',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButton: {
    flex: 2,
    backgroundColor: '#FC5501',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentModal; 