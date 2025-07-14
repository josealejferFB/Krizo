import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';
import { useAuth } from '../../context/AuthContext';

export default function KrizoWorkerProfileScreen({ navigation }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, apiRequest } = useAuth();
  
  // Estados para edición
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    telefono: user?.telefono || ''
  });

  // Actualizar editData cuando cambie el usuario
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        telefono: user.telefono || ''
      });
    }
  }, [user]);

  console.log('KrizoWorkerProfileScreen - user:', user);

  // Función para guardar cambios
  const saveChanges = async () => {
    setIsLoading(true);
    
    try {
      // Validar campos requeridos
      if (!editData.firstName.trim() || !editData.lastName.trim() || !editData.telefono.trim()) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
      }

      // Validar formato de teléfono (al menos 10 dígitos)
      if (editData.telefono.length < 10) {
        Alert.alert('Error', 'El teléfono debe tener al menos 10 dígitos');
        return;
      }

      console.log('🔄 Actualizando perfil del usuario:', user.id);
      console.log('📤 Datos a enviar:', editData);

      // Llamada real al API para actualizar el perfil
      const result = await apiRequest(`/users/${user.id}/update`, {
        method: 'PUT',
        body: JSON.stringify({
          nombres: editData.firstName,
          apellidos: editData.lastName,
          telefono: editData.telefono
        })
      });

      console.log('📥 Respuesta del servidor:', result);

      if (result.success) {
        // Actualizar el estado local del usuario
        if (user) {
          user.firstName = editData.firstName;
          user.lastName = editData.lastName;
          user.telefono = editData.telefono;
        }
        
        Alert.alert(
          'Éxito',
          'Perfil actualizado correctamente',
          [{ text: 'OK', onPress: () => {
            setIsEditModalVisible(false);
            setRefreshKey(prev => prev + 1); // Forzar actualización
          }}]
        );
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
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
          <Text style={styles.title}>Mi Perfil</Text>
          <Text style={styles.subtitle}>
            Información personal y datos de contacto.
          </Text>

          {/* Información del usuario */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="account" size={24} color="#FC5501" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombres</Text>
                <Text style={styles.infoValue} key={`firstName-${refreshKey}`}>{user?.firstName || 'No disponible'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="account" size={24} color="#FC5501" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Apellidos</Text>
                <Text style={styles.infoValue} key={`lastName-${refreshKey}`}>{user?.lastName || 'No disponible'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="card-account-details" size={24} color="#FC5501" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Cédula</Text>
                <Text style={styles.infoValue}>{user?.cedula || 'No disponible'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="email" size={24} color="#FC5501" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'No disponible'}</Text>
                <View style={styles.verificationStatus}>
                  <MaterialCommunityIcons 
                    name={user?.isEmailVerified ? "check-circle" : "alert-circle"} 
                    size={16} 
                    color={user?.isEmailVerified ? "#1BC100" : "#FF3D00"} 
                  />
                  <Text style={[
                    styles.verificationText,
                    { color: user?.isEmailVerified ? "#1BC100" : "#FF3D00" }
                  ]}>
                    {user?.isEmailVerified ? 'Verificado' : 'No verificado'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="phone" size={24} color="#FC5501" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue} key={`telefono-${refreshKey}`}>{user?.telefono || 'No disponible'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="account-tie" size={24} color="#FC5501" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Tipo de Usuario</Text>
                <Text style={styles.infoValue}>
                  {user?.userType === 'mechanic' ? 'Mecánico' : 
                   user?.userType === 'client' ? 'Cliente' : 
                   user?.userType || 'No disponible'}
                </Text>
              </View>
            </View>
          </View>

          {/* Botón de editar */}
          <TouchableOpacity 
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={() => setIsEditModalVisible(true)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de edición */}
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nombres</Text>
                <TextInput
                  style={styles.textInput}
                  value={editData.firstName}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, firstName: text }))}
                  placeholder="Ingresa tus nombres"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Apellidos</Text>
                <TextInput
                  style={styles.textInput}
                  value={editData.lastName}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, lastName: text }))}
                  placeholder="Ingresa tus apellidos"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Teléfono</Text>
                <TextInput
                  style={styles.textInput}
                  value={editData.telefono}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, telefono: text }))}
                  placeholder="Ingresa tu teléfono"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                  onPress={saveChanges}
                  disabled={isLoading}
                >
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'Guardando...' : 'Guardar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 36,
    paddingHorizontal: 0,
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
  infoSection: {
    width: '100%',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD6B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#262525',
    fontWeight: '600',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FC5501',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 3,
    shadowColor: '#FC5501',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF3D00',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '40%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#1BC100',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '40%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
