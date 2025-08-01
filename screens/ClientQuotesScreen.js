import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import { useAuth } from '../context/AuthContext';

export default function ClientQuotesScreen({ navigation }) {
  const { token, user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/quotes/client`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();

      if (response.ok) {
        setQuotes(result.data || []);
      } else {
        setError(result.message || 'Error cargando cotizaciones');
      }
    } catch (error) {
      console.error('Error cargando cotizaciones:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadQuotes();
  };

  const handleAcceptQuote = async (quote) => {
    Alert.alert(
      'Aceptar Cotización',
      `¿Estás seguro de que quieres aceptar esta cotización por $${quote.total_price}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/quotes/${quote.id}/accept`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.ok) {
                Alert.alert('Cotización Aceptada', 'La cotización ha sido aceptada. Procede con el pago.');
                loadQuotes(); // Recargar lista
                // Aquí podrías navegar a la pantalla de pago
                navigation.navigate('EnhancedPaymentScreen', { 
                  quote: quote,
                  workerId: quote.worker_id 
                });
              } else {
                Alert.alert('Error', 'No se pudo aceptar la cotización');
              }
            } catch (error) {
              console.error('Error aceptando cotización:', error);
              Alert.alert('Error', 'No se pudo aceptar la cotización');
            }
          }
        }
      ]
    );
  };

  const handleRejectQuote = async (quote) => {
    Alert.alert(
      'Rechazar Cotización',
      '¿Estás seguro de que quieres rechazar esta cotización?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/quotes/${quote.id}/reject`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.ok) {
                Alert.alert('Cotización Rechazada', 'La cotización ha sido rechazada.');
                loadQuotes(); // Recargar lista
              } else {
                Alert.alert('Error', 'No se pudo rechazar la cotización');
              }
            } catch (error) {
              console.error('Error rechazando cotización:', error);
              Alert.alert('Error', 'No se pudo rechazar la cotización');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'accepted': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'completed': return '#2196F3';
      default: return '#FF9800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'completed': return 'Completada';
      default: return 'Pendiente';
    }
  };

  const renderQuote = (quote) => (
    <Card key={quote.id} style={styles.quoteCard}>
      <Card.Content>
        <View style={styles.quoteHeader}>
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>
              {quote.worker_name || 'Trabajador'}
            </Text>
            <Text style={styles.quoteDate}>
              {new Date(quote.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Chip 
            mode="outlined" 
            style={[styles.statusChip, { borderColor: getStatusColor(quote.status) }]}
            textStyle={{ color: getStatusColor(quote.status) }}
          >
            {getStatusText(quote.status)}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Precio Total:</Text>
          <Text style={styles.priceValue}>${quote.total_price}</Text>
        </View>

        {quote.transport_fee > 0 && (
          <View style={styles.transportSection}>
            <Text style={styles.transportLabel}>Costo de Transporte:</Text>
            <Text style={styles.transportValue}>${quote.transport_fee}</Text>
          </View>
        )}

        {quote.estimated_time && (
          <View style={styles.timeSection}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
            <Text style={styles.timeText}>Tiempo estimado: {quote.estimated_time}</Text>
          </View>
        )}

        {quote.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notas:</Text>
            <Text style={styles.notesText}>{quote.notes}</Text>
          </View>
        )}

        {quote.services && quote.services.length > 0 && (
          <View style={styles.servicesSection}>
            <Text style={styles.servicesLabel}>Servicios:</Text>
            {quote.services.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <Text style={styles.servicePrice}>${service.price}</Text>
              </View>
            ))}
          </View>
        )}

        {quote.status === 'pending' && (
          <View style={styles.actionsSection}>
            <Button
              mode="contained"
              onPress={() => handleAcceptQuote(quote)}
              style={[styles.actionButton, styles.acceptButton]}
              labelStyle={styles.acceptButtonText}
            >
              Aceptar y Pagar
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleRejectQuote(quote)}
              style={[styles.actionButton, styles.rejectButton]}
              labelStyle={styles.rejectButtonText}
            >
              Rechazar
            </Button>
          </View>
        )}

        {quote.status === 'accepted' && (
          <View style={styles.acceptedSection}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.acceptedText}>Cotización aceptada - Procede con el pago</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <ThemedBackgroundGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Cargando cotizaciones...</Text>
        </View>
      </ThemedBackgroundGradient>
    );
  }

  return (
    <ThemedBackgroundGradient>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Cotizaciones</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <MaterialCommunityIcons name="refresh" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {quotes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="file-document-outline" size={64} color="#999" />
              <Text style={styles.emptyTitle}>No hay cotizaciones</Text>
              <Text style={styles.emptyText}>
                Cuando los trabajadores envíen cotizaciones para tus solicitudes, aparecerán aquí.
              </Text>
            </View>
          ) : (
            quotes.map(renderQuote)
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    color: '#D32F2F',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  quoteCard: {
    marginBottom: 16,
    elevation: 4,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quoteDate: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 12,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#333',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  transportSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transportLabel: {
    fontSize: 16,
    color: '#666',
  },
  transportValue: {
    fontSize: 18,
    color: '#666',
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  notesSection: {
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 17,
    color: '#666',
  },
  servicesSection: {
    marginBottom: 16,
  },
  servicesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  serviceDescription: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  servicePrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  acceptButtonText: {
    color: 'white',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
  rejectButtonText: {
    color: '#F44336',
  },
  acceptedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
  },
  acceptedText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
}); 
