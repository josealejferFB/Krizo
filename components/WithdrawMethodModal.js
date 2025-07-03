import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';

export default function WithdrawMethodModal({ visible, onClose, onSelect }) {
  const [step, setStep] = useState('select'); // select | paypal | pagomovil | binance
  const [paypalEmail, setPaypalEmail] = useState('');
  const [pagomovil, setPagomovil] = useState({
    name: '',
    bank: '',
    doc: '',
    phone: '',
  });

  // Reset modal state when closed
  React.useEffect(() => {
    if (!visible) {
      setStep('select');
      setPaypalEmail('');
      setPagomovil({ name: '', bank: '', doc: '', phone: '' });
    }
  }, [visible]);

  // Selección de método
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
            <Text style={styles.title}>Selecciona un método de retiro</Text>
            <TouchableOpacity style={styles.option} onPress={() => setStep('paypal')}>
              <FontAwesome name="paypal" size={28} color="#003087" style={styles.icon} />
              <Text style={styles.optionText}>PayPal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => setStep('pagomovil')}>
              <MaterialCommunityIcons name="cellphone-message" size={28} color="#1BC100" style={styles.icon} />
              <Text style={styles.optionText}>PagoMóvil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => setStep('binance')}>
              <FontAwesome5 name="bitcoin" size={28} color="#F3BA2F" style={styles.icon} />
              <Text style={styles.optionText}>Binance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setStep('select');
                onClose();
              }}
            >
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // PayPal
  if (step === 'paypal') {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>Retiro por PayPal</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo de PayPal"
              value={paypalEmail}
              onChangeText={setPaypalEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />
            <Button
              mode="contained"
              onPress={() => onSelect({ type: 'paypal', email: paypalEmail })}
              style={{ marginTop: 12, backgroundColor: '#003087' }}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              disabled={!paypalEmail}
            >
              Solicitar retiro
            </Button>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep('select')}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FC5501" />
              <Text style={styles.backText}>Volver</Text>
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
            <Text style={styles.title}>Retiro por PagoMóvil</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del titular"
              value={pagomovil.name}
              onChangeText={t => setPagomovil({ ...pagomovil, name: t })}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Código del banco (4 dígitos)"
              value={pagomovil.bank}
              onChangeText={t => setPagomovil({ ...pagomovil, bank: t.replace(/[^0-9]/g, '').slice(0,4) })}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Documento de identidad"
              value={pagomovil.doc}
              onChangeText={t => setPagomovil({ ...pagomovil, doc: t.replace(/[^0-9]/g, '') })}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono (ej: 04121234567)"
              value={pagomovil.phone}
              onChangeText={t => setPagomovil({ ...pagomovil, phone: t.replace(/[^0-9]/g, '').slice(0,11) })}
              keyboardType="phone-pad"
              maxLength={11}
              placeholderTextColor="#aaa"
            />
            <Button
              mode="contained"
              onPress={() => onSelect({ type: 'pagomovil', ...pagomovil })}
              style={{ marginTop: 12, backgroundColor: '#1BC100' }}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              disabled={
                !pagomovil.name ||
                pagomovil.bank.length !== 4 ||
                !pagomovil.doc ||
                pagomovil.phone.length !== 11
              }
            >
              Solicitar retiro
            </Button>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep('select')}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FC5501" />
              <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Binance (simulación de integración)
  if (step === 'binance') {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>Retiro por Binance</Text>
            <Text style={{ textAlign: 'center', marginBottom: 18 }}>
              Aquí se conectaría la API de Binance para procesar el retiro.
            </Text>
            <Button
              mode="contained"
              onPress={() => onSelect({ type: 'binance' })}
              style={{ marginBottom: 12, backgroundColor: '#F3BA2F' }}
              labelStyle={{ color: '#262525', fontWeight: 'bold' }}
            >
              Continuar con Binance
            </Button>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep('select')}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FC5501" />
              <Text style={styles.backText}>Volver</Text>
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
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FC5501',
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FFD6B8',
  },
  backText: {
    color: '#FC5501',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF5ED',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    color: '#262525',
  },
});