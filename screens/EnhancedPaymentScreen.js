import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, RadioButton, TextInput, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import { useAuth } from '../context/AuthContext';

export default function EnhancedPaymentScreen({ route, navigation }) {
  const { quote } = route.params;
  const { token } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState(quote.total_price.toString());
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentTime, setPaymentTime] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [workerInfo, setWorkerInfo] = useState(null);
  const [loadingWorkerInfo, setLoadingWorkerInfo] = useState(true);

  // Cargar información del worker
  useEffect(() => {
    loadWorkerInfo();
  }, []);

  const loadWorkerInfo = async () => {
    try {
      const response = await fetch(`http://192.168.1.14:5000/api/payments/worker-info/${quote.worker_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success && data.worker) {
        console.log('📱 Worker info recibida:', data.worker);
        setWorkerInfo(data.worker);
        // Seleccionar el primer método de pago por defecto
        if (data.worker.paymentMethods && data.worker.paymentMethods.length > 0) {
          setPaymentMethod(data.worker.paymentMethods[0].method);
        }
      } else {
        console.error('Error cargando información del worker:', data.message);
      }
    } catch (error) {
      console.error('Error cargando información del worker:', error);
    } finally {
      setLoadingWorkerInfo(false);
    }
  };

  // Funciones auxiliares para métodos de pago
  const getPaymentIcon = (method) => {
    switch (method) {
      case 'transfer':
        return 'bank-transfer';
      case 'binance':
        return 'currency-btc';
      case 'cash':
        return 'cash';
      case 'zelle':
        return 'bank';
      case 'paypal':
        return 'paypal';
      default:
        return 'credit-card';
    }
  };

  const getPaymentColor = (method) => {
    switch (method) {
      case 'transfer':
        return '#0070BA';
      case 'binance':
        return '#F7931A';
      case 'cash':
        return '#4CAF50';
      case 'zelle':
        return '#6B4EFF';
      case 'paypal':
        return '#003087';
      default:
        return '#666';
    }
  };

  // Función para seleccionar imagen
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu galería para seleccionar la imagen del comprobante.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setScreenshotPreview(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Función para tomar foto
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu cámara para tomar la foto del comprobante.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setScreenshotPreview(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  // Función para subir imagen al backend
  const uploadImage = async (imageUri) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', {
        uri: imageUri,
        name: 'comprobante.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch('http://192.168.1.14:5000/api/payments/upload-screenshot', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setScreenshotUrl(data.url);
        Alert.alert('Éxito', 'Comprobante subido correctamente');
      } else {
        Alert.alert('Error', data.message || 'Error subiendo el comprobante');
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      Alert.alert('Error', 'Error de conexión al subir el comprobante');
    } finally {
      setUploadingImage(false);
    }
  };

  // Función para mostrar opciones de imagen
  const showImageOptions = () => {
    Alert.alert(
      'Seleccionar Comprobante',
      '¿Cómo quieres agregar el comprobante de pago?',
      [
        {
          text: 'Tomar Foto',
          onPress: takePhoto,
        },
        {
          text: 'Galería',
          onPress: pickImage,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  // Función para enviar el pago
  const handlePayment = async () => {
    console.log('🔧 Iniciando proceso de pago...');
    console.log('🔧 Payment method:', paymentMethod);
    console.log('🔧 Reference:', reference);
    console.log('🔧 Amount:', amount);
    console.log('🔧 Date:', paymentDate);
    console.log('🔧 Time:', paymentTime);
    console.log('🔧 Screenshot URL:', screenshotUrl);
    
    if (!paymentMethod) {
      Alert.alert('Error', 'Selecciona un método de pago');
      return;
    }

    if (!reference) {
      Alert.alert('Error', 'Ingresa la referencia del pago');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    if (!paymentDate) {
      Alert.alert('Error', 'Ingresa la fecha del pago');
      return;
    }

    if (!paymentTime) {
      Alert.alert('Error', 'Ingresa la hora del pago');
      return;
    }

    if (!screenshotUrl) {
      Alert.alert('Error', 'Debes subir el comprobante de pago');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        quote_id: quote.id,
        payment_method: paymentMethod,
        amount: parseFloat(amount),
        reference: reference,
        payment_date: paymentDate,
        payment_time: paymentTime,
        payment_screenshot: screenshotUrl
      };

      console.log('🔧 Enviando pago con datos:', paymentData);
      console.log('🔧 URL:', 'http://192.168.1.14:5000/api/payments/submit');

      const response = await fetch('http://192.168.1.14:5000/api/payments/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      console.log('🔧 Response status:', response.status);
      console.log('🔧 Response ok:', response.ok);

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          'Pago Enviado',
          'El comprobante de pago ha sido enviado correctamente. El trabajador será notificado.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Error enviando el pago');
      }
    } catch (error) {
      console.error('Error enviando pago:', error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedBackgroundGradient>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Enviar Comprobante de Pago</Text>
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

          {/* Información del Worker */}
          {loadingWorkerInfo ? (
            <Card style={styles.paymentCard}>
              <Card.Content>
                <Text style={styles.paymentTitle}>Cargando información del trabajador...</Text>
              </Card.Content>
            </Card>
          ) : workerInfo ? (
            <Card style={styles.paymentCard}>
              <Card.Content>
                <Text style={styles.paymentTitle}>Información del Trabajador</Text>
                
                <View style={styles.workerInfo}>
                  <Text style={styles.workerName}>
                    {workerInfo.nombres} {workerInfo.apellidos}
                  </Text>
                  <Text style={styles.workerContact}>
                    📞 {workerInfo.telefono} | 📧 {workerInfo.email}
                  </Text>
                </View>

                <Divider style={styles.divider} />

                <Text style={styles.paymentTitle}>Métodos de Pago Disponibles</Text>
                
                {workerInfo.paymentMethods && workerInfo.paymentMethods.length > 0 ? (
                  <View>
                    <Text style={styles.debugText}>Debug: {workerInfo.paymentMethods.length} métodos encontrados</Text>
                    <RadioButton.Group onValueChange={value => setPaymentMethod(value)} value={paymentMethod}>
                      {workerInfo.paymentMethods.map((method, index) => (
                        <View key={index} style={styles.radioItem}>
                          <RadioButton value={method.method} />
                          <View style={styles.radioContent}>
                            <MaterialCommunityIcons 
                              name={getPaymentIcon(method.method)} 
                              size={24} 
                              color={getPaymentColor(method.method)} 
                            />
                            <View style={styles.methodInfo}>
                              <Text style={styles.radioText}>{method.name}</Text>
                              {method.email && (
                                <Text style={styles.paymentDetails}>
                                  Email: {method.email}
                                </Text>
                              )}
                              {method.id && (
                                <Text style={styles.paymentDetails}>
                                  ID: {method.id}
                                </Text>
                              )}
                              {method.phone && (
                                <Text style={styles.paymentDetails}>
                                  Teléfono: {method.phone}
                                </Text>
                              )}
                              {method.account && (
                                <Text style={styles.paymentDetails}>
                                  Cuenta: {method.account}
                                </Text>
                              )}
                              {method.bank && (
                                <Text style={styles.paymentDetails}>
                                  Banco: {method.bank}
                                </Text>
                              )}
                              {method.holder && (
                                <Text style={styles.paymentDetails}>
                                  Titular: {method.holder}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      ))}
                    </RadioButton.Group>
                  </View>
                ) : (
                  <Text style={styles.noMethodsText}>
                    No hay métodos de pago configurados para este trabajador.
                  </Text>
                )}
              </Card.Content>
            </Card>
          ) : (
            <Card style={styles.paymentCard}>
              <Card.Content>
                <Text style={styles.paymentTitle}>Error</Text>
                <Text style={styles.errorText}>
                  No se pudo cargar la información del trabajador.
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Detalles del pago */}
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Text style={styles.detailsTitle}>Detalles del Pago</Text>
              
              <TextInput
                label="Monto Pagado"
                value={amount}
                onChangeText={setAmount}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <TextInput
                label="Referencia del Pago"
                value={reference}
                onChangeText={setReference}
                mode="outlined"
                placeholder="Ej: TRF-001-2025"
                style={styles.input}
              />

              <TextInput
                label="Fecha del Pago (YYYY-MM-DD)"
                value={paymentDate}
                onChangeText={setPaymentDate}
                mode="outlined"
                placeholder="2025-01-15"
                style={styles.input}
              />

              <TextInput
                label="Hora del Pago (HH:MM:SS)"
                value={paymentTime}
                onChangeText={setPaymentTime}
                mode="outlined"
                placeholder="14:30:00"
                style={styles.input}
              />
            </Card.Content>
          </Card>

          {/* Comprobante de pago */}
          <Card style={styles.screenshotCard}>
            <Card.Content>
              <Text style={styles.screenshotTitle}>Comprobante de Pago</Text>
              
              {screenshotPreview ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: screenshotPreview }} style={styles.previewImage} />
                  <View style={styles.previewOverlay}>
                    <MaterialCommunityIcons name="check-circle" size={32} color="#4CAF50" />
                    <Text style={styles.previewText}>Comprobante subido</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={showImageOptions}>
                  <MaterialCommunityIcons name="camera-plus" size={48} color="#666" />
                  <Text style={styles.uploadText}>
                    {uploadingImage ? 'Subiendo...' : 'Agregar Comprobante'}
                  </Text>
                  <Text style={styles.uploadSubtext}>Toma una foto o selecciona de la galería</Text>
                </TouchableOpacity>
              )}

              {screenshotPreview && (
                <Button
                  mode="outlined"
                  onPress={showImageOptions}
                  style={styles.changeButton}
                >
                  Cambiar Comprobante
                </Button>
              )}
            </Card.Content>
          </Card>

          {/* Botón de envío */}
          <Button
            mode="contained"
            onPress={handlePayment}
            loading={loading}
            disabled={loading || uploadingImage || !screenshotUrl}
            style={styles.submitButton}
            labelStyle={styles.submitButtonText}
          >
            Enviar Comprobante
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
  screenshotCard: {
    marginBottom: 16,
    elevation: 4,
  },
  screenshotTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  changeButton: {
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workerInfo: {
    marginBottom: 16,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  workerContact: {
    fontSize: 14,
    color: '#666',
  },
  methodInfo: {
    marginLeft: 8,
    flex: 1,
  },
  paymentDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  noMethodsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#f44336',
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#FF6B35',
    backgroundColor: '#FFE6D6',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
}); 