import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal
} from 'react-native';
import { Text, Card, Button, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

export default function KrizoWorkerPaymentsReceivedScreen({ navigation }) {
  const { token, user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [screenshotModalVisible, setScreenshotModalVisible] = useState(false);
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/payments/worker/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setPayments(result.data || []);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los pagos');
      }
    } catch (error) {
      console.error('Error cargando pagos:', error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        Alert.alert(
          'Éxito',
          `Pago ${status === 'verified' ? 'verificado' : 'rechazado'} correctamente`,
          [{ text: 'OK', onPress: loadPayments }]
        );
      } else {
        Alert.alert('Error', 'No se pudo procesar la verificación');
      }
    } catch (error) {
      console.error('Error verificando pago:', error);
      Alert.alert('Error', 'No se pudo procesar la verificación');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_verification': return '#FF9800';
      case 'verified': return '#4CAF50';
      case 'rejected': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_verification': return 'Pendiente';
      case 'verified': return 'Verificado';
      case 'rejected': return 'Rechazado';
      default: return 'Pendiente';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'paypal': return 'credit-card';
      case 'binance': return 'currency-btc';
      default: return 'cash';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'paypal': return '#0070BA';
      case 'binance': return '#F7931A';
      default: return '#666';
    }
  };

  const renderPayment = (payment) => (
    <Card key={payment.id} style={styles.paymentCard}>
      <Card.Content>
        <View style={styles.paymentHeader}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              {payment.client_name} {payment.client_lastName}
            </Text>
            <Text style={styles.paymentDate}>
              {new Date(payment.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Chip 
            mode="outlined" 
            style={[styles.statusChip, { borderColor: getStatusColor(payment.status) }]}
            textStyle={{ color: getStatusColor(payment.status) }}
          >
            {getStatusText(payment.status)}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.paymentDetails}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Monto Pagado:</Text>
            <Text style={styles.amountValue}>${payment.payment_amount}</Text>
          </View>

          <View style={styles.methodSection}>
            <MaterialCommunityIcons 
              name={getMethodIcon(payment.payment_method)} 
              size={20} 
              color={getMethodColor(payment.payment_method)} 
            />
            <Text style={styles.methodText}>
              {payment.payment_method === 'paypal' ? 'PayPal' : 'Binance Pay'}
            </Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Fecha:</Text>
            <Text style={styles.detailValue}>{payment.payment_date}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Hora:</Text>
            <Text style={styles.detailValue}>{payment.payment_time}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Referencia:</Text>
            <Text style={styles.detailValue}>{payment.payment_reference}</Text>
          </View>
        </View>

        {payment.payment_screenshot && (
          <View style={styles.screenshotSection}>
            <Text style={styles.screenshotLabel}>Comprobante:</Text>
            <TouchableOpacity 
              style={styles.screenshotButton}
              onPress={() => {
                setSelectedPayment(payment);
                setScreenshotModalVisible(true);
              }}
            >
              <MaterialCommunityIcons name="image" size={20} color="#FC5501" />
              <Text style={styles.screenshotButtonText}>Ver Comprobante</Text>
            </TouchableOpacity>
          </View>
        )}

        {payment.status === 'pending_verification' && (
          <View style={styles.actionsSection}>
            <Button
              mode="contained"
              onPress={() => handleVerifyPayment(payment.id, 'verified')}
              style={[styles.actionButton, styles.verifyButton]}
              labelStyle={styles.verifyButtonText}
            >
              Verificar Pago
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleVerifyPayment(payment.id, 'rejected')}
              style={[styles.actionButton, styles.rejectButton]}
              labelStyle={styles.rejectButtonText}
            >
              Rechazar
            </Button>
          </View>
        )}

        {payment.status === 'verified' && (
          <View style={styles.verifiedSection}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.verifiedText}>Pago verificado - Servicio completado</Text>
          </View>
        )}

        {payment.status === 'rejected' && (
          <View style={styles.rejectedSection}>
            <MaterialCommunityIcons name="close-circle" size={24} color="#F44336" />
            <Text style={styles.rejectedText}>Pago rechazado</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <LinearGradient colors={['#FC5501', '#C24100']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagos Recibidos</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <MaterialCommunityIcons name="loading" size={48} color="white" />
            <Text style={styles.loadingText}>Cargando pagos...</Text>
          </View>
        ) : payments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cash-multiple" size={64} color="#999" />
            <Text style={styles.emptyTitle}>No hay pagos recibidos</Text>
            <Text style={styles.emptyText}>
              Los pagos de tus clientes aparecerán aquí cuando envíen comprobantes.
            </Text>
          </View>
        ) : (
          payments.map(renderPayment)
        )}
      </ScrollView>

      {/* Modal para ver screenshot */}
      <Modal
        visible={screenshotModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setScreenshotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comprobante de Pago</Text>
              <TouchableOpacity 
                onPress={() => setScreenshotModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {selectedPayment?.payment_screenshot && (
              <Image 
                source={{ uri: selectedPayment.payment_screenshot }} 
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
            
            <View style={styles.modalInfo}>
              <Text style={styles.modalInfoText}>
                Cliente: {selectedPayment?.client_name} {selectedPayment?.client_lastName}
              </Text>
              <Text style={styles.modalInfoText}>
                Monto: ${selectedPayment?.payment_amount}
              </Text>
              <Text style={styles.modalInfoText}>
                Referencia: {selectedPayment?.payment_reference}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  paymentCard: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
  },
  statusChip: {
    height: 24,
  },
  divider: {
    marginVertical: 10,
  },
  paymentDetails: {
    marginBottom: 15,
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501',
  },
  methodSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  methodText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  screenshotSection: {
    marginBottom: 15,
  },
  screenshotLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  screenshotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  screenshotButtonText: {
    fontSize: 14,
    color: '#FC5501',
    marginLeft: 5,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
  },
  verifyButtonText: {
    color: 'white',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
  rejectButtonText: {
    color: '#F44336',
  },
  verifiedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 10,
    borderRadius: 5,
  },
  verifiedText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  rejectedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 5,
  },
  rejectedText: {
    fontSize: 14,
    color: '#F44336',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalInfo: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
}); 
