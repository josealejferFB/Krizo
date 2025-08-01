import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Button, Card, Avatar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const QuoteModal = ({ visible, onClose, request, onQuoteSent }) => {
  const { token, user } = useAuth();
  const [services, setServices] = useState([{ description: '', price: '' }]);
  const [transportFee, setTransportFee] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';
	console.log(API_BASE_URL)
  const addService = () => {
    setServices([...services, { description: '', price: '' }]);
  };

  const removeService = (index) => {
    if (services.length > 1) {
      const newServices = services.filter((_, i) => i !== index);
      setServices(newServices);
    }
  };

  const updateService = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
    
    // Calcular total
    const servicesTotal = newServices.reduce((sum, service) => {
      return sum + (parseFloat(service.price) || 0);
    }, 0);
    const transport = parseFloat(transportFee) || 0;
    setTotalPrice(servicesTotal + transport);
  };

  const sendQuote = async () => {
    // Validar que todos los servicios tengan descripción y precio
    const validServices = services.filter(service => 
      service.description.trim() && service.price.trim()
    );

    if (validServices.length === 0) {
      Alert.alert('Error', 'Por favor agrega al menos un servicio con descripción y precio');
      return;
    }

    if (!estimatedTime.trim()) {
      Alert.alert('Error', 'Por favor ingresa el tiempo estimado del servicio');
      return;
    }

    try {
      setIsLoading(true);

      const quoteData = {
        request_id: request.id,
        worker_id: user.id,
        client_id: request.client_id,
        services: validServices.map(service => ({
          description: service.description,
          price: parseFloat(service.price)
        })),
        transport_fee: parseFloat(transportFee) || 0,
        total_price: totalPrice,
        estimated_time: estimatedTime,
        notes: notes,
        status: 'pending'
      };

      const response = await fetch('${API_BASE_URL}/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quoteData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Alert.alert(
            'Cotización Enviada',
            'La cotización ha sido enviada al cliente. Te notificaremos cuando responda.',
            [
              {
                text: 'OK',
                onPress: () => {
                  onQuoteSent(result.data);
                  onClose();
                  // Limpiar formulario
                  setServices([{ description: '', price: '' }]);
                  setTransportFee('');
                  setTotalPrice(0);
                  setEstimatedTime('');
                  setNotes('');
                }
              }
            ]
          );
        } else {
          Alert.alert('Error', result.message || 'No se pudo enviar la cotización');
        }
      } else {
        Alert.alert('Error', 'No se pudo enviar la cotización');
      }
    } catch (error) {
      console.error('Error enviando cotización:', error);
      Alert.alert('Error', 'No se pudo enviar la cotización');
    } finally {
      setIsLoading(false);
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
              <Icon name="calculator" size={24} color="white" />
              <Text style={styles.headerTitle}>Enviar Cotización</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Servicios</Text>
              {services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <View style={styles.serviceInputs}>
                    <TextInput
                      style={styles.serviceDescription}
                      value={service.description}
                      onChangeText={(value) => updateService(index, 'description', value)}
                      placeholder="Descripción del servicio..."
                      placeholderTextColor="#999"
                      multiline
                    />
                    <TextInput
                      style={styles.servicePrice}
                      value={service.price}
                      onChangeText={(value) => updateService(index, 'price', value)}
                      placeholder="$0"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  {services.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeService(index)}
                    >
                      <Icon name="delete" size={20} color="#F44336" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              
              <TouchableOpacity style={styles.addButton} onPress={addService}>
                <Icon name="plus" size={20} color="#FC5501" />
                <Text style={styles.addButtonText}>Agregar Servicio</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Costo de Traslado</Text>
              <TextInput
                style={styles.textInput}
                value={transportFee}
                onChangeText={(value) => {
                  setTransportFee(value);
                  const servicesTotal = services.reduce((sum, service) => {
                    return sum + (parseFloat(service.price) || 0);
                  }, 0);
                  setTotalPrice(servicesTotal + (parseFloat(value) || 0));
                }}
                placeholder="$0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Tiempo Estimado</Text>
              <TextInput
                style={styles.textInput}
                value={estimatedTime}
                onChangeText={setEstimatedTime}
                placeholder="Ej: 2 horas, 1 día..."
                placeholderTextColor="#999"
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Notas Adicionales</Text>
              <TextInput
                style={styles.textArea}
                value={notes}
                onChangeText={setNotes}
                placeholder="Información adicional, condiciones, garantías..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                maxLength={300}
              />
            </Card.Content>
          </Card>

          <Card style={styles.totalCard}>
            <Card.Content>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={sendQuote}
            loading={isLoading}
            disabled={isLoading || totalPrice === 0 || !estimatedTime.trim()}
            style={styles.sendButton}
            labelStyle={styles.sendButtonText}
          >
            Enviar Cotización
          </Button>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  serviceDescription: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 50,
  },
  servicePrice: {
    width: 80,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#FC5501',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#FC5501',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  totalCard: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sendButton: {
    backgroundColor: '#FC5501',
    borderRadius: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuoteModal; 
