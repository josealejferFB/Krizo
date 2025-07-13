import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform, Modal } from 'react-native';
import { ThemedInput, ThemedButton } from '../../components/ThemedUIElements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Importar DateTimePicker solo si no estamos en web
let DateTimePicker = null;
if (Platform.OS !== 'web') {
  try {
    DateTimePicker = require('@react-native-community/datetimepicker').default;
  } catch (error) {
    console.log('DateTimePicker no disponible en esta plataforma');
  }
}

export default function Registration2Screen({ navigation }) {
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWebDatePicker, setShowWebDatePicker] = useState(false);

  const handleDatePress = () => {
    console.log('Date picker pressed');
    if (Platform.OS === 'web') {
      setShowWebDatePicker(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    console.log('Date picker change event:', event.type, selectedDate);
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate && event.type !== 'dismissed') {
      setBirthDate(selectedDate);
    }
  };

  const handleWebDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setBirthDate(selectedDate);
    setShowWebDatePicker(false);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <LinearGradient
      colors={['#FC5501', '#C24100']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      {/* Botón volver al login */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Login')}
      >
        <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" style={styles.backIcon} />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <MaterialCommunityIcons name="home-map-marker" size={50} color="#FC5501" style={styles.icon} />
        <Text style={styles.title}>¡Un paso más!</Text>
        <Text style={styles.subtitle}>Completa tus datos para continuar</Text>

        <ThemedInput
          label="Dirección de residencia"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          left={<MaterialCommunityIcons name="map-marker" size={24} color="#FC5501" style={{ marginTop: 15, marginLeft: 5 }} />}
        />

        <TouchableOpacity
          style={styles.dateInput}
          onPress={handleDatePress}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="calendar" size={24} color="#FC5501" style={{ marginRight: 10 }} />
          <Text style={styles.dateText}>
            {formatDate(birthDate)}
          </Text>
        </TouchableOpacity>

        {/* Botón de prueba para debug */}
        <TouchableOpacity
          style={[styles.dateInput, { backgroundColor: '#FFE0B2', marginTop: 10 }]}
          onPress={() => {
            console.log('Test button pressed');
            Alert.alert('Test', 'Botón de prueba funcionando');
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="bug" size={24} color="#FC5501" style={{ marginRight: 10 }} />
          <Text style={styles.dateText}>
            Botón de Prueba (Debug)
          </Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' ? (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.modalButton}>Cancelar</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Fecha de Nacimiento</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={[styles.modalButton, styles.confirmButton]}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  accentColor="#FC5501"
                  themeVariant="light"
                  style={styles.picker}
                />
              </View>
            </View>
          </Modal>
        ) : (
          showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              accentColor="#FC5501"
              themeVariant="light"
            />
          )
        )}

        <ThemedButton
          onPress={() => {
            if (!address.trim()) {
              Alert.alert('Error', 'Por favor ingresa tu dirección de residencia');
              return;
            }
            if (!birthDate) {
              Alert.alert('Error', 'Por favor selecciona tu fecha de nacimiento');
              return;
            }
            navigation.navigate('Registration3');
          }}
          style={styles.button}
        >
          Siguiente
        </ThemedButton>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#877063',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#F5F2F0',
    borderRadius: 12,
    width: 300,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F2F0',
    borderRadius: 12,
    height: 55,
    width: 300,
    marginBottom: 18,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#262525',
  },
  dateText: {
    fontSize: 16,
    color: '#262525',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262525',
  },
  modalButton: {
    fontSize: 16,
    color: '#877063',
  },
  confirmButton: {
    color: '#FC5501',
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
  },
  button: {
    marginTop: 10,
    width: 300,
    borderRadius: 20,
    backgroundColor: '#262525',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#262525',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 28,
    marginLeft: 18,
    marginBottom: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#FC5501',
  },
  backIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
