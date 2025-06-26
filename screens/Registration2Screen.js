import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Modal } from 'react-native';
import { ThemedInput, ThemedButton } from '../components/ThemedUIElements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

export default function Registration2Screen({ navigation }) {
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Formatea la fecha a DD/MM/AAAA
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
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
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="calendar" size={24} color="#FC5501" style={{ marginRight: 10 }} />
          <Text style={[styles.dateText, !birthDate && { color: '#877063' }]}>
            {birthDate ? formatDate(birthDate) : 'Fecha de nacimiento'}
          </Text>
        </TouchableOpacity>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={birthDate ? new Date(birthDate) : new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setBirthDate(selectedDate);
            }}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            accentColor="#FC5501"
            themeVariant="light"
          />
        )}

        <ThemedButton
          onPress={() => navigation.navigate('Registration3')}
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