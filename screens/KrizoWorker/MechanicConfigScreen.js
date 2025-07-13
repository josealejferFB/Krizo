import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Switch, Button } from 'react-native-paper'; // Note: Slider from React Native Paper is basic, consider @react-native-community/slider for more features
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CraneConfigScreen = () => {
  const navigation = useNavigation();

  // State variables for form fields
  const [isServiceActive, setIsServiceActive] = useState(true);
  const [pricePerKm, setPricePerKm] = useState('30');
  const [basePriceForTransfer, setBasePriceForTransfer] = useState('15');
  const [suggestionRadius, setSuggestionRadius] = useState(25); // Default value as in image
  const [workingHours, setWorkingHours] = useState('Lunes a Sábado, 8am - 5pm');

  const handleSaveChanges = () => {
    if (!pricePerKm || !basePriceForTransfer || !workingHours) {
      alert('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    const kmPrice = parseFloat(pricePerKm);
    const basePrice = parseFloat(basePriceForTransfer);

    if (isNaN(kmPrice) || isNaN(basePrice)) {
      alert('Por favor, introduce valores numéricos válidos para los precios.');
      return;
    }

    const configData = {
      isServiceActive,
      pricePerKm: kmPrice,
      basePriceForTransfer: basePrice,
      suggestionRadius,
      workingHours,
    };

    console.log('Guardando configuración de servicio de grúa:', configData);
    alert('Configuración guardada exitosamente!');

    // In a real app, you would send this data to your backend API
    // e.g., fetch('/api/crane-config', { method: 'POST', body: JSON.stringify(configData) });
  };

  return (
    <LinearGradient
      colors={['#FC5501', '#C24100']}
      style={styles.container}
    >
      <View style={styles.headerOrangeContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Icon
                  name="arrow-left-bold-circle"
                  size={38}
                  color="#FC5501"
                  style={styles.backIcon}
                />
              </TouchableOpacity>

          <View style={styles.appBarTitleContent}>
            <Text style={styles.appBarTitle}>Mecánico a</Text>
            <Text style={styles.appBarTitle}>Domicilio</Text>
            <Icon name="tools" size={24} color="white" /> 
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Configuración de</Text>
        <Text style={styles.sectionTitle}>Servicio de Mecánica</Text>
        {/* Price per Kilometer */}
        <Text style={styles.inputLabel}>Precio por Visita a Domicilio (bs)</Text>
        <TextInput
          value={pricePerKm}
          onChangeText={setPricePerKm}
          keyboardType="numeric"
          placeholder="Ej: 30bs"
          mode="outlined"
          style={styles.textInput}
          outlineColor="#ccc"
          activeOutlineColor="#FC5501"
          theme={{ colors: { text: '#333', primary: '#FC5501', placeholder: '#666' } }}
        />

        {/* Base Price for Transfer */}
        <Text style={styles.inputLabel}>Precio Base por Traslado (bs)</Text>
        <TextInput
          value={basePriceForTransfer}
          onChangeText={setBasePriceForTransfer}
          keyboardType="numeric"
          placeholder="Ej: 15bs"
          mode="outlined"
          style={styles.textInput}
          outlineColor="#ccc"
          activeOutlineColor="#FC5501"
          theme={{ colors: { text: '#333', primary: '#FC5501', placeholder: '#666' } }}
        />
        <Text style={styles.descriptionText}>
          Este es un cobro único solo por el hecho de trasladarse a la ubicación del cliente.
        </Text>

        <Text style={styles.inputLabel}>Radio límite de sugerencia (km)</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100} // Example max value
            step={1}
            value={suggestionRadius}
            onValueChange={setSuggestionRadius}
            minimumTrackTintColor="#FC5501" // Orange color for the active part
            maximumTrackTintColor="#ccc" // Gray color for the inactive part
            thumbTintColor="#FC5501" // Orange color for the thumb
          />
          <Text style={styles.sliderValue}>{suggestionRadius} km</Text>
        </View>

        {/* Working Hours */}
        <Text style={styles.inputLabel}>Horarios de trabajo</Text>
        <TextInput
          value={workingHours}
          onChangeText={setWorkingHours}
          placeholder="Ej: Lunes a Sábado, 8am - 5pm"
          mode="outlined"
          style={styles.textInput}
          outlineColor="#ccc"
          activeOutlineColor="#FC5501"
          theme={{ colors: { text: '#333', primary: '#FC5501', placeholder: '#666' } }}
        />

        {/* Save Changes Button */}
        <Button
          mode="contained"
          onPress={handleSaveChanges}
          style={styles.saveChangesButton}
          labelStyle={styles.saveChangesButtonLabel}
        >
          Guardar cambios
        </Button>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOrangeContainer: {
    width: '100%',
    marginBottom: 18,
    borderRadius: 22,
    overflow: 'hidden',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 3,
    borderWidth: 2,
    position: 'absolute',
    borderColor: '#FC5501',
    left: 0,
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
    padding: 2,
  },
  appBarTitleContent: {
    flexDirection: 'column', // Changed to column to stack "Servicio de" and "Grúa"
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center',
    flex: 1,
  },
  appBarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28, // Adjust line height for stacked text
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    margin: 'auto',
    // alignItems: 'center', // Removed as components fill width
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501',
    textAlign: 'center', // Centered as in image
    width: '100%',
    marginBottom: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'white', // White background for the toggle row
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  toggleStatus: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
    flex: 1, // Allow text to take remaining space
    textAlign: 'right', // Align status text to the right
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15, // Space between sections
    width: '100%', // Take full width
  },
  textInput: {
    width: '100%',
    marginBottom: 15, // Space between input and next label/input
    backgroundColor: 'white',
  },
  descriptionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    width: '100%',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    height: 40, // Height for better touch area
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  saveChangesButton: {
    backgroundColor: '#FC5501',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 8,
    marginTop: 20, // Space above the button
  },
  saveChangesButtonLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CraneConfigScreen;
