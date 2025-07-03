import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TextInput, Clipboard, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';

export default function DepositMethodModal({ visible, onClose, onSelect }) {
  const [step, setStep] = useState('select'); // select | paypal | tarjeta | pagomovil | binance
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [pagomovilImage, setPagomovilImage] = useState(null);

  // Reset modal state when closed
  React.useEffect(() => {
    if (!visible) {
      setStep('select');
      setCard({ number: '', name: '', expiry: '', cvc: '' });
      setPagomovilImage(null);
    }
  }, [visible]);

  // Copiar datos de PagoMóvil
  const handleCopyPagoMovil = () => {
    Clipboard.setString('0102 04121234567 12345678');
  };

  // Subir comprobante PagoMóvil
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPagomovilImage(result.assets[0].uri);
    }
  };

  // Renderiza la selección de método
  if (step === 'select') {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>Selecciona un método de depósito</Text>
            <TouchableOpacity style={styles.option} onPress={() => setStep('paypal')}>
              <FontAwesome name="paypal" size={28} color="#003087" style={styles.icon} />
              <Text style={styles.optionText}>PayPal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => setStep('tarjeta')}>
              <MaterialCommunityIcons name="credit-card-outline" size={28} color="#FC5501" style={styles.icon} />
              <Text style={styles.optionText}>Tarjeta de crédito</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => setStep('pagomovil')}>
              <MaterialCommunityIcons name="cellphone-message" size={28} color="#1BC100" style={styles.icon} />
              <Text style={styles.optionText}>PagoMóvil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => setStep('binance')}>
              <FontAwesome5 name="bitcoin" size={28} color="#F3BA2F" style={styles.icon} />
              <Text style={styles.optionText}>Binance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#FC5501" />
              <Text style={styles.closeText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // PayPal (simulación de integración)
  if (step === 'paypal') {
    // Aquí deberías integrar la API real de PayPal
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>Depósito con PayPal</Text>
            <Text style={{ textAlign: 'center', marginBottom: 18 }}>
              Aquí se conectaría la API de PayPal para procesar el pago.
            </Text>
            <Button mode="contained" onPress={() => onSelect('paypal')} style={{ marginBottom: 12, backgroundColor: '#003087' }}>
              Continuar con PayPal
            </Button>
            <TouchableOpacity style={styles.closeButton} onPress={() => setStep('select')}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FC5501" />
              <Text style={styles.closeText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Tarjeta de crédito
  if (step === 'tarjeta') {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>Datos de tarjeta de crédito</Text>
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              keyboardType="numeric"
              value={card.number}
              onChangeText={t => setCard({ ...card, number: t })}
              maxLength={19}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre en la tarjeta"
              value={card.name}
              onChangeText={t => setCard({ ...card, name: t })}
              placeholderTextColor="#aaa"
            />
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="MM/AA"
                value={card.expiry}
                onChangeText={t => setCard({ ...card, expiry: t })}
                maxLength={5}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="CVC"
                value={card.cvc}
                onChangeText={t => setCard({ ...card, cvc: t })}
                maxLength={4}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
              />
            </View>
            <Button
              mode="contained"
              onPress={() => onSelect({ type: 'tarjeta', ...card })}
              style={{ marginTop: 12, backgroundColor: '#FC5501' }}
            >
              Registrar tarjeta
            </Button>
            <TouchableOpacity style={styles.closeButton} onPress={() => setStep('select')}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FC5501" />
              <Text style={styles.closeText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // PagoMóvil
  if (step === 'pagomovil') {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>PagoMóvil</Text>
            <Text style={styles.pmLabel}>Nombre: <Text style={styles.pmValue}>Krizo Company</Text></Text>
            <Text style={styles.pmLabel}>Banco: <Text style={styles.pmValue}>0102 BDV</Text></Text>
            <Text style={styles.pmLabel}>Teléfono: <Text style={styles.pmValue}>04121234567</Text></Text>
            <Text style={styles.pmLabel}>Rif: <Text style={styles.pmValue}>J-12345678</Text></Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyPagoMovil}>
              <MaterialCommunityIcons name="content-copy" size={20} color="#FC5501" />
              <Text style={styles.copyText}>Copiar datos</Text>
            </TouchableOpacity>
            <Text style={{ marginTop: 18, marginBottom: 6, color: '#FC5501', fontWeight: 'bold' }}>
              Adjunta el comprobante de pago:
            </Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
              <MaterialCommunityIcons name="cloud-upload" size={22} color="#fff" />
              <Text style={styles.uploadText}>Subir comprobante</Text>
            </TouchableOpacity>
            {pagomovilImage && (
              <Image
                source={{ uri: pagomovilImage }}
                style={{ width: 120, height: 120, borderRadius: 12, marginTop: 8 }}
                resizeMode="cover"
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setStep('select')}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FC5501" />
              <Text style={styles.closeText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Binance (simulación de integración)
  if (step === 'binance') {
    // Aquí deberías integrar la API real de Binance
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>Depósito con Binance</Text>
            <Text style={{ textAlign: 'center', marginBottom: 18 }}>
              Aquí se conectaría la API de Binance para procesar el pago.
            </Text>
            <Button mode="contained" onPress={() => onSelect('binance')} style={{ marginBottom: 12, backgroundColor: '#F3BA2F' }}>
              Continuar con Binance
            </Button>
            <TouchableOpacity style={styles.closeButton} onPress={() => setStep('select')}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FC5501" />
              <Text style={styles.closeText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(38,37,37,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: 22,
    width: 320,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 18,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5ED',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: '100%',
  },
  icon: {
    marginRight: 14,
  },
  optionText: {
    fontSize: 16,
    color: '#262525',
    fontWeight: 'bold',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FFD6B8',
  },
  closeText: {
    color: '#FC5501',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  input: {
    height: 48,
    width: '100%',
    borderColor: '#FC5501',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#262525',
  },
  pmLabel: {
    fontSize: 14,
    color: '#262525',
    marginBottom: 4,
  },
  pmValue: {
    fontWeight: 'bold',
    color: '#FC5501',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD6B8',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  copyText: {
    color: '#FC5501',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1BC100',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});