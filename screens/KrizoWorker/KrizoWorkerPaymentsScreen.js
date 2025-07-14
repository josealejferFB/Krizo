import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function KrizoWorkerPaymentsScreen({ navigation }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [screenshotModalVisible, setScreenshotModalVisible] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = await AsyncStorage.getItem('krizo_token');
      console.log('🔐 Token obtenido de AsyncStorage:', token ? 'SÍ' : 'NO');
      console.log('🔐 Token completo:', token);
      
      // Solo obtener pagos pendientes de verificación
      const response = await fetch('http://192.168.1.14:5000/api/payments/worker?status=pending_verification', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Datos de pagos pendientes recibidos:', JSON.stringify(data.payments, null, 2));
        setPayments(data.payments || []);
      } else {
        console.error('Error al cargar pagos:', response.status);
      }
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'pending_verification': return '#FFA500';
      case 'verified': return '#4CAF50';
      case 'rejected': return '#F44336';
      default: return '#FFA500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
      case 'pending_verification': return 'Pendiente';
      case 'verified': return 'Verificado';
      case 'rejected': return 'Rechazado';
      default: return 'Pendiente';
    }
  };

  const showScreenshot = (screenshot) => {
    console.log('🖼️ Mostrando screenshot:', screenshot);
    setSelectedScreenshot(screenshot);
    setScreenshotModalVisible(true);
  };

  const handleVerifyPayment = async (paymentId, status) => {
    try {
      const token = await AsyncStorage.getItem('krizo_token');
      
      const response = await fetch(`http://192.168.1.14:5000/api/payments/${paymentId}/verify`, {
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
          [{ text: 'OK', onPress: fetchPayments }]
        );
      } else {
        Alert.alert('Error', 'No se pudo procesar la verificación');
      }
    } catch (error) {
      console.error('Error verificando pago:', error);
      Alert.alert('Error', 'No se pudo procesar la verificación');
    }
  };

  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="cash-check" size={32} color="#FC5501" />
          <Text style={styles.title}>Pagos Pendientes</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando pagos...</Text>
          </View>
        ) : payments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cash-remove" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay pagos pendientes</Text>
            <Text style={styles.emptySubtext}>Los pagos pendientes de verificación aparecerán aquí</Text>
          </View>
        ) : (
          <View style={styles.paymentsContainer}>
            {payments.map((payment) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.clientName}>
                      {payment.client_firstName} {payment.client_lastName}
                    </Text>
                    <Text style={styles.paymentDate}>
                      {formatDate(payment.created_at)}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
                    <Text style={styles.statusText}>
                      {getStatusText(payment.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.paymentDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Método:</Text>
                    <Text style={styles.detailValue}>{payment.payment_method}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Cantidad:</Text>
                    <Text style={styles.amountText}>
                      ${payment.payment_amount ? payment.payment_amount.toLocaleString('es-ES', { minimumFractionDigits: 2 }) : '0.00'}
                    </Text>
                  </View>
                  {payment.payment_reference && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Referencia:</Text>
                      <Text style={styles.detailValue}>{payment.payment_reference}</Text>
                    </View>
                  )}
                </View>

                {payment.payment_screenshot ? (
                  <TouchableOpacity
                    style={styles.screenshotButton}
                    onPress={() => showScreenshot(payment.payment_screenshot)}
                  >
                    <MaterialCommunityIcons name="image" size={20} color="#FC5501" />
                    <Text style={styles.screenshotButtonText}>Ver comprobante</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.noScreenshotContainer}>
                    <MaterialCommunityIcons name="image-off" size={20} color="#ccc" />
                    <Text style={styles.noScreenshotText}>Sin comprobante</Text>
                  </View>
                )}

                {/* Botones de acción para pagos pendientes */}
                {payment.status === 'pending_verification' && (
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => handleVerifyPayment(payment.id, 'verified')}
                    >
                      <MaterialCommunityIcons name="check" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleVerifyPayment(payment.id, 'rejected')}
                    >
                      <MaterialCommunityIcons name="close" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Rechazar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchPayments}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="white" />
          <Text style={styles.refreshButtonText}>Actualizar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para mostrar screenshot */}
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
                <MaterialCommunityIcons name="close" size={24} color="#FC5501" />
              </TouchableOpacity>
            </View>
            {selectedScreenshot ? (
              <Image
                source={{ uri: selectedScreenshot }}
                style={styles.screenshotImage}
                resizeMode="contain"
                onError={(error) => {
                  console.log('❌ Error cargando imagen:', error);
                  Alert.alert('Error', 'No se pudo cargar la imagen del comprobante');
                }}
                onLoad={() => {
                  console.log('✅ Imagen cargada correctamente:', selectedScreenshot);
                }}
              />
            ) : (
              <View style={styles.noImageContainer}>
                <MaterialCommunityIcons name="image-off" size={64} color="#ccc" />
                <Text style={styles.noImageText}>No hay imagen disponible</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 36,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC5501',
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#777',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  paymentsContainer: {
    width: '100%',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262525',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: '#777',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
  },
  detailValue: {
    fontSize: 14,
    color: '#262525',
    fontWeight: '500',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FC5501',
  },
  screenshotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FC5501',
  },
  screenshotButtonText: {
    color: '#FC5501',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  refreshButton: {
    backgroundColor: '#FC5501',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  noScreenshotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noScreenshotText: {
    color: '#999',
    fontSize: 14,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262525',
  },
  closeButton: {
    padding: 4,
  },
  screenshotImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  noImageText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
