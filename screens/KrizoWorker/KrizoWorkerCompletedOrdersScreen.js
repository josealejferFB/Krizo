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
import { Text, Card, Button, Chip, Divider, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';
import { useAuth } from '../../context/AuthContext';

export default function KrizoWorkerCompletedOrdersScreen({ navigation }) {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('payments');
  const [acceptedPayments, setAcceptedPayments] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [screenshotModalVisible, setScreenshotModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAcceptedPayments(),
        loadCompletedRequests()
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const loadAcceptedPayments = async () => {
    try {
      const response = await fetch(`http://192.168.1.14:5000/api/payments/worker/${user.id}?status=verified`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setAcceptedPayments(result.payments || []);
      }
    } catch (error) {
      console.error('Error cargando pagos aceptados:', error);
    }
  };

  const loadCompletedRequests = async () => {
    try {
      const response = await fetch(`http://192.168.1.14:5000/api/requests/worker/${user.id}/completed`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCompletedRequests(result.data || []);
      }
    } catch (error) {
      console.error('Error cargando solicitudes finalizadas:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'paypal': return 'credit-card';
      case 'binance': return 'currency-btc';
      case 'transfer': return 'bank-transfer';
      case 'cash': return 'cash';
      case 'zelle': return 'bank';
      default: return 'cash';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'paypal': return '#0070BA';
      case 'binance': return '#F7931A';
      case 'transfer': return '#0070BA';
      case 'cash': return '#4CAF50';
      case 'zelle': return '#6B4EFF';
      default: return '#666';
    }
  };

  const getMethodName = (method) => {
    switch (method) {
      case 'paypal': return 'PayPal';
      case 'binance': return 'Binance Pay';
      case 'transfer': return 'Transferencia';
      case 'cash': return 'Efectivo';
      case 'zelle': return 'Zelle';
      default: return method;
    }
  };

  const renderAcceptedPayment = (payment) => (
    <Card key={payment.id} style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              {payment.client_firstName} {payment.client_lastName}
            </Text>
            <Text style={styles.dateText}>
              {formatDate(payment.created_at)}
            </Text>
          </View>
          <Chip 
            mode="outlined" 
            style={[styles.statusChip, { borderColor: '#4CAF50' }]}
            textStyle={{ color: '#4CAF50' }}
          >
            Verificado
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.paymentDetails}>
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Monto Recibido:</Text>
            <Text style={styles.amountValue}>${payment.payment_amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</Text>
          </View>

          <View style={styles.methodSection}>
            <MaterialCommunityIcons 
              name={getMethodIcon(payment.payment_method)} 
              size={20} 
              color={getMethodColor(payment.payment_method)} 
            />
            <Text style={styles.methodText}>
              {getMethodName(payment.payment_method)}
            </Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Referencia:</Text>
            <Text style={styles.detailValue}>{payment.payment_reference}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Fecha Pago:</Text>
            <Text style={styles.detailValue}>{payment.payment_date}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Hora Pago:</Text>
            <Text style={styles.detailValue}>{payment.payment_time}</Text>
          </View>
        </View>

        {payment.payment_screenshot && (
          <View style={styles.screenshotSection}>
            <Text style={styles.screenshotLabel}>Comprobante:</Text>
            <TouchableOpacity 
              style={styles.screenshotButton}
              onPress={() => {
                setSelectedScreenshot(payment.payment_screenshot);
                setScreenshotModalVisible(true);
              }}
            >
              <MaterialCommunityIcons name="image" size={20} color="#FC5501" />
              <Text style={styles.screenshotButtonText}>Ver Comprobante</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderCompletedRequest = (request) => (
    <Card key={request.id} style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              {request.client_nombres} {request.client_apellidos}
            </Text>
            <Text style={styles.dateText}>
              {formatDate(request.created_at)}
            </Text>
          </View>
          <Chip 
            mode="outlined" 
            style={[styles.statusChip, { borderColor: '#4CAF50' }]}
            textStyle={{ color: '#4CAF50' }}
          >
            Finalizada
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.requestDetails}>
          <Text style={styles.serviceTitle}>{request.service_type || 'Servicio'}</Text>
          <Text style={styles.descriptionText}>{request.problem_description || 'Sin descripción'}</Text>
          
          {request.client_location && (
            <View style={styles.locationSection}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
              <Text style={styles.locationText}>{request.client_location}</Text>
            </View>
          )}

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Tipo de Servicio:</Text>
            <Text style={styles.detailValue}>{request.service_type || 'No especificado'}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Vehículo:</Text>
            <Text style={styles.detailValue}>{request.vehicle_info || 'No especificado'}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Estado:</Text>
            <Text style={styles.detailValue}>Completado</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ThemedBackgroundGradient>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="check-circle" size={32} color="#4CAF50" />
          <Text style={styles.title}>Órdenes Finalizadas</Text>
        </View>

        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            {
              value: 'payments',
              label: 'Pagos Aceptados',
              icon: 'cash-check',
            },
            {
              value: 'requests',
              label: 'Solicitudes Finalizadas',
              icon: 'clipboard-check',
            },
          ]}
          style={styles.segmentedButtons}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {activeTab === 'payments' ? (
              acceptedPayments.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="cash-check" size={64} color="#ccc" />
                  <Text style={styles.emptyText}>No hay pagos aceptados</Text>
                  <Text style={styles.emptySubtext}>Los pagos verificados aparecerán aquí</Text>
                </View>
              ) : (
                <View style={styles.cardsContainer}>
                  {acceptedPayments.map(renderAcceptedPayment)}
                </View>
              )
            ) : (
              completedRequests.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="clipboard-check" size={64} color="#ccc" />
                  <Text style={styles.emptyText}>No hay solicitudes finalizadas</Text>
                  <Text style={styles.emptySubtext}>Las solicitudes completadas aparecerán aquí</Text>
                </View>
              ) : (
                <View style={styles.cardsContainer}>
                  {completedRequests.map(renderCompletedRequest)}
                </View>
              )
            )}
          </ScrollView>
        )}

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadData}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="white" />
          <Text style={styles.refreshButtonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

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
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 12,
  },
  segmentedButtons: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
  cardsContainer: {
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  statusChip: {
    backgroundColor: 'transparent',
  },
  divider: {
    marginVertical: 12,
  },
  paymentDetails: {
    marginBottom: 12,
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  methodSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  screenshotSection: {
    marginTop: 12,
  },
  screenshotLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  screenshotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  screenshotButtonText: {
    fontSize: 14,
    color: '#FC5501',
    marginLeft: 8,
    fontWeight: '500',
  },
  requestDetails: {
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#FC5501',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  refreshButtonText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  screenshotImage: {
    width: '100%',
    height: 400,
  },
  noImageContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
}); 