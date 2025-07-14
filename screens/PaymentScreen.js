import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, RadioButton, TextInput, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import { useAuth } from '../context/AuthContext';

export default function PaymentScreen({ route, navigation }) {
  const { quote } = route.params;
  const { token } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  const handlePayment = async () => {
    if (!paymentMethod) {
      Alert.alert('Error', 'Selecciona un método de pago');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv)) {
      Alert.alert('Error', 'Completa todos los campos de la tarjeta');
      return;
    }

    if (paymentMethod === 'paypal' && !paypalEmail) {
      Alert.alert('Error', 'Ingresa tu email de PayPal');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        quote_id: quote.id,
        amount: quote.total_price,
        payment_method: paymentMethod,
        payment_details: paymentMethod === 'card' ? {
          card_number: cardNumber,
          expiry_date: expiryDate,
          cvv: cvv
        } : {
          paypal_email: paypalEmail
        }
      };

      const response = await fetch(`http://192.168.1.14:5000/api/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          'Pago Exitoso',
          'El pago ha sido procesado correctamente. El trabajador será notificado.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('HomeScreen')
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Error procesando el pago');
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <ThemedBackgroundGradient>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Procesar Pago</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Resumen de la cotización */}
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.summaryTitle}>Resumen de la Cotización</Text>
              <Divider style={styles.divider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Trabajador:</Text>
                <Text style={styles.summaryValue}>{quote.worker_name}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Servicios:</Text>
                <Text style={styles.summaryValue}>{quote.services?.length || 0} servicios</Text>
              </View>
              
              {quote.transport_fee > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Transporte:</Text>
                  <Text style={styles.summaryValue}>${quote.transport_fee}</Text>
                </View>
              )}
              
              <Divider style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total a Pagar:</Text>
                <Text style={styles.totalValue}>${quote.total_price}</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Método de pago */}
          <Card style={styles.paymentCard}>
            <Card.Content>
              <Text style={styles.paymentTitle}>Método de Pago</Text>
              
              <RadioButton.Group onValueChange={value => setPaymentMethod(value)} value={paymentMethod}>
                <View style={styles.radioItem}>
                  <RadioButton value="paypal" />
                  <View style={styles.radioContent}>
                    <MaterialCommunityIcons name="paypal" size={24} color="#0070BA" />
                    <Text style={styles.radioText}>PayPal</Text>
                  </View>
                </View>
                
                <RadioButton.Group onValueChange={value => setPaymentMethod(value)} value={paymentMethod}>
                  <View style={styles.radioItem}>
                    <RadioButton value="card" />
                    <View style={styles.radioContent}>
                      <MaterialCommunityIcons name="credit-card" size={24} color="#FF6B35" />
                      <Text style={styles.radioText}>Tarjeta de Crédito/Débito</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </RadioButton.Group>
            </Card.Content>
          </Card>

          {/* Detalles del pago */}
          {paymentMethod === 'paypal' && (
            <Card style={styles.detailsCard}>
              <Card.Content>
                <Text style={styles.detailsTitle}>Detalles de PayPal</Text>
                <TextInput
                  label="Email de PayPal"
                  value={paypalEmail}
                  onChangeText={setPaypalEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </Card.Content>
            </Card>
          )}

          {paymentMethod === 'card' && (
            <Card style={styles.detailsCard}>
              <Card.Content>
                <Text style={styles.detailsTitle}>Detalles de la Tarjeta</Text>
                <TextInput
                  label="Número de Tarjeta"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={19}
                  style={styles.input}
                />
                <View style={styles.cardRow}>
                  <TextInput
                    label="MM/AA"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    mode="outlined"
                    keyboardType="numeric"
                    maxLength={5}
                    style={[styles.input, styles.halfInput]}
                  />
                  <TextInput
                    label="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    mode="outlined"
                    keyboardType="numeric"
                    maxLength={4}
                    style={[styles.input, styles.halfInput]}
                  />
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Botón de pago */}
          <Button
            mode="contained"
            onPress={handlePayment}
            loading={loading}
            disabled={loading}
            style={styles.payButton}
            labelStyle={styles.payButtonText}
          >
            Pagar ${quote.total_price}
          </Button>
        </ScrollView>
      </View>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  divider: {
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  paymentCard: {
    marginBottom: 16,
    elevation: 4,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  detailsCard: {
    marginBottom: 16,
    elevation: 4,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  payButton: {
    backgroundColor: '#FF6B35',
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 