import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';

export default function KrizoWorkerServiceProfileScreen({ navigation }) {
  // Datos de prueba temporales
  const user = {
    id: 6,
    firstName: 'Armando',
    lastName: 'Delgado'
  };
  
  const token = 'test-token';
  
  console.log('KrizoWorkerServiceProfileScreen - user:', user);
  console.log('KrizoWorkerServiceProfileScreen - token:', token);
  
  // Estados para servicios seleccionados
  const [selectedServices, setSelectedServices] = useState({
    mecanico: false,
    grua: false,
    repuestos: false
  });

  // Estados para información del perfil
  const [ciudad, setCiudad] = useState('');
  const [zona, setZona] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [servicePhone, setServicePhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // Por defecto en modo edición
  const [hasData, setHasData] = useState(false);

  // Cargar datos guardados al abrir la pantalla
  useEffect(() => {
    console.log('useEffect ejecutado - cargando datos del perfil');
    loadProfileData();
  }, []);

  // Función para cargar datos del perfil
  const loadProfileData = async () => {
    try {
      console.log('Cargando datos del perfil para usuario:', user.id);
      
      const response = await fetch(`http://192.168.1.14:5000/api/users/${user.id}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Respuesta del servidor (status):', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Datos recibidos del servidor:', result);
        
        if (result.success && result.data) {
          // Llenar los campos con los datos guardados
          setCiudad(result.data.ciudad || '');
          setZona(result.data.zona || '');
          setDescripcion(result.data.descripcion || '');
          setDisponibilidad(result.data.disponibilidad || '');
          setServicePhone(result.data.servicePhone || '');
          
          // Configurar servicios seleccionados
          if (result.data.services && Array.isArray(result.data.services)) {
            const servicesState = {
              mecanico: result.data.services.includes('mecanico'),
              grua: result.data.services.includes('grua'),
              repuestos: result.data.services.includes('repuestos')
            };
            setSelectedServices(servicesState);
            console.log('Servicios configurados:', servicesState);
          }
          
          setHasData(true);
          setIsEditing(false); // Solo desactivar edición si hay datos
          console.log('Datos cargados exitosamente, modo visualización activado');
        } else {
          // Si no hay datos, mantener en modo edición
          setHasData(false);
          setIsEditing(true);
          console.log('No se encontraron datos, modo edición activado');
        }
      } else {
        // Si la respuesta no es exitosa, mantener en modo edición
        const errorText = await response.text();
        console.log('Error en respuesta del servidor:', response.status, errorText);
        setHasData(false);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setHasData(false);
      setIsEditing(true);
    }
  };

  // Función para seleccionar/deseleccionar servicios
  const toggleService = (serviceKey) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceKey]: !prev[serviceKey]
    }));
  };

  // Función para activar modo de edición
  const startEditing = () => {
    setIsEditing(true);
  };

  // Función para guardar perfil
  const saveProfile = async () => {
    // Validar que al menos un servicio esté seleccionado
    const hasSelectedService = Object.values(selectedServices).some(selected => selected);
    if (!hasSelectedService) {
      Alert.alert('Error', 'Debes seleccionar al menos un servicio');
      return;
    }

    // Validar campos requeridos
    if (!ciudad.trim() || !zona.trim() || !descripcion.trim() || !disponibilidad.trim() || !servicePhone.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos para enviar
      const profileData = {
        services: Object.keys(selectedServices).filter(key => selectedServices[key]),
        ciudad: ciudad.trim(),
        zona: zona.trim(),
        descripcion: descripcion.trim(),
        disponibilidad: disponibilidad.trim(),
        servicePhone: servicePhone.trim(),
        profileImage: null // Temporalmente sin imagen
      };

      console.log('Enviando datos:', profileData);

      // Llamada real al endpoint PUT /users/:id/profile
      const response = await fetch(`http://192.168.1.14:5000/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const result = await response.json();
      console.log('Respuesta del servidor:', result);

      if (response.ok) {
        setHasData(true);
        setIsEditing(false);
        
        // Recargar los datos del servidor para asegurar que se muestren los valores actualizados
        await loadProfileData();
        
        Alert.alert(
          'Éxito', 
          result.message || 'Perfil de servicios guardado correctamente',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', result.error || 'No se pudo guardar el perfil. Inténtalo de nuevo.');
      }

    } catch (error) {
      console.error('Error guardando perfil:', error);
      Alert.alert('Error', 'No se pudo guardar el perfil. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedBackgroundGradient>
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
          style={styles.scrollView}
        >
        {/* Botón volver elegante */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backIconCircle}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" />
          </View>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Perfil de Servicios</Text>
          <Text style={styles.subtitle}>
            Configura los servicios que ofreces y tu información de trabajo.
          </Text>

          {/* Selección de Servicios */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servicios Ofrecidos</Text>
            
            {/* Servicio Mecánico */}
            <TouchableOpacity 
              style={[
                styles.serviceOption,
                selectedServices.mecanico && styles.serviceOptionSelected
              ]}
              onPress={() => isEditing && toggleService('mecanico')}
              activeOpacity={isEditing ? 0.8 : 1}
              disabled={!isEditing}
            >
              <View style={styles.serviceOptionContent}>
                <MaterialCommunityIcons 
                  name="tools" 
                  size={24} 
                  color={selectedServices.mecanico ? "#FC5501" : "#666"} 
                />
                <Text style={[
                  styles.serviceOptionText,
                  selectedServices.mecanico && styles.serviceOptionTextSelected
                ]}>
                  Servicio Mecánico
                </Text>
              </View>
              {selectedServices.mecanico && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#FC5501" />
              )}
            </TouchableOpacity>

            {/* Servicio de Grúa */}
            <TouchableOpacity 
              style={[
                styles.serviceOption,
                selectedServices.grua && styles.serviceOptionSelected
              ]}
              onPress={() => isEditing && toggleService('grua')}
              activeOpacity={isEditing ? 0.8 : 1}
              disabled={!isEditing}
            >
              <View style={styles.serviceOptionContent}>
                <MaterialCommunityIcons 
                  name="tow-truck" 
                  size={24} 
                  color={selectedServices.grua ? "#FC5501" : "#666"} 
                />
                <Text style={[
                  styles.serviceOptionText,
                  selectedServices.grua && styles.serviceOptionTextSelected
                ]}>
                  Servicio de Grúa
                </Text>
              </View>
              {selectedServices.grua && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#FC5501" />
              )}
            </TouchableOpacity>

            {/* Repuestos Automotrices */}
            <TouchableOpacity 
              style={[
                styles.serviceOption,
                selectedServices.repuestos && styles.serviceOptionSelected
              ]}
              onPress={() => isEditing && toggleService('repuestos')}
              activeOpacity={isEditing ? 0.8 : 1}
              disabled={!isEditing}
            >
              <View style={styles.serviceOptionContent}>
                <MaterialCommunityIcons 
                  name="car-wrench" 
                  size={24} 
                  color={selectedServices.repuestos ? "#FC5501" : "#666"} 
                />
                <Text style={[
                  styles.serviceOptionText,
                  selectedServices.repuestos && styles.serviceOptionTextSelected
                ]}>
                  Repuestos Automotrices
                </Text>
              </View>
              {selectedServices.repuestos && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#FC5501" />
              )}
            </TouchableOpacity>
          </View>

          {/* Información de Trabajo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de Trabajo</Text>
            
            {/* Ciudad */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ciudad *</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                value={ciudad}
                onChangeText={setCiudad}
                placeholder="Ej: Bogotá, Medellín, Cali..."
                placeholderTextColor="#999"
                editable={isEditing}
              />
            </View>

            {/* Zona */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Zona o Sector *</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                value={zona}
                onChangeText={setZona}
                placeholder="Ej: Norte, Centro, Chapinero..."
                placeholderTextColor="#999"
                editable={isEditing}
              />
            </View>

            {/* Descripción */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descripción del Servicio *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, !isEditing && styles.textInputDisabled]}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Describe brevemente los servicios que ofreces..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={isEditing}
              />
            </View>

            {/* Disponibilidad */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Disponibilidad *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, !isEditing && styles.textInputDisabled]}
                value={disponibilidad}
                onChangeText={setDisponibilidad}
                placeholder="Ej: Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 8:00 AM - 2:00 PM..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={isEditing}
              />
            </View>

            {/* Teléfono de Servicio */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Teléfono de Servicio *</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.textInputDisabled]}
                value={servicePhone}
                onChangeText={setServicePhone}
                placeholder="Ej: 0424-303-1239"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                editable={isEditing}
              />
            </View>
          </View>

          {/* Botón de guardar/editar */}
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            activeOpacity={0.8}
            onPress={hasData && !isEditing ? startEditing : saveProfile}
            disabled={isLoading}
          >
            <MaterialCommunityIcons 
              name={isLoading ? "loading" : hasData && !isEditing ? "pencil" : "content-save"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Guardando...' : hasData && !isEditing ? 'Editar Perfil' : 'Guardar Perfil'}
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </ThemedBackgroundGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 36,
    paddingHorizontal: 0,
    paddingBottom: 150, // Más espacio extra para el teclado
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#FC5501',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FC5501',
  },
  backIconCircle: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 6,
    padding: 2,
  },
  backButtonText: {
    color: '#FC5501',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 18,
    width: '92%',
    maxWidth: 370,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 18,
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 6,
    marginTop: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#C24100',
    textAlign: 'center',
    marginBottom: 28,
    fontStyle: 'italic',
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262525',
    marginBottom: 16,
    textAlign: 'center',
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceOptionSelected: {
    backgroundColor: '#FFD6B8',
    borderColor: '#FC5501',
  },
  serviceOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 12,
  },
  serviceOptionTextSelected: {
    color: '#FC5501',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262525',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#262525',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textInputDisabled: {
    backgroundColor: '#F0F0F0',
    color: '#666',
    opacity: 0.8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FC5501',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#FC5501',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
}); 