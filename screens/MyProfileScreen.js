import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useResponsiveDimensions } from '../context/DimensionsContext'; // Ajusta la ruta si es diferente
import { Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import { ThemedInput, ThemedButton } from '../components/ThemedUIElements';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

export default function MyProfileScreen({ navigation }) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [editing, setEditing] = useState(false);

  // Datos de vehículo (puedes adaptarlo a tu modelo real)
  const [carBrand, setCarBrand] = useState('Toyota');
  const [carModel, setCarModel] = useState('Corolla');
  const [carYear, setCarYear] = useState('2020');
  const [carPlate, setCarPlate] = useState('ABC-1234');
  const [carColor, setCarColor] = useState('Rojo');
  const { paddingAmount, bottomPosition, responsiveWidth, width, height } = useResponsiveDimensions();

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      // Usar firstName/lastName si están disponibles (formato nuevo)
      if (user.firstName && user.lastName) {
        setFirstName(user.firstName);
        setLastName(user.lastName);
      } else if (user.nombres && user.apellidos) {
        // Usar nombres/apellidos si están disponibles (formato antiguo)
        setFirstName(user.nombres);
        setLastName(user.apellidos);
      }
      
      setEmail(user.email || '');
      setCedula(user.cedula || '');
      setTelefono(user.telefono || '');
      setTipo(user.userType || user.tipo || '');
    }
  }, [user]);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={{
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 16,
    width: responsiveWidth, // Más ancho que antes
    maxWidth: 420, // Más ancho que antes
    alignSelf: 'center',
    marginTop: 38,
    marginBottom: 18,
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    alignItems: 'center',
    justifyContent: 'start',
    overflow: 'hidden',
    display: 'flex',
  }}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true} // Permite scroll anidado si es necesario
            >
              {/* Encabezado */}
              <View style={styles.headerRow}>
                <TouchableOpacity
                  style={styles.backButton}
                  activeOpacity={0.7}
                  onPress={() => navigation.goBack()}
                >
                  <MaterialCommunityIcons
                    name="arrow-left-bold-circle"
                    size={38}
                    color="#FC5501"
                    style={styles.backIcon}
                  />
                  <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
                <View style={styles.profileTitleBox}>
                  <MaterialCommunityIcons name="account-star" size={32} color="#fff" style={{ marginRight: 6 }} />
                  <View>
                    <Text style={styles.profileTitle}>Mi Perfil</Text>
                    <Text style={styles.profileSubtitle}>Tu información</Text>
                  </View>
                </View>
              </View>

              {/* Foto de perfil */}
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={editing ? pickImage : undefined}
                activeOpacity={editing ? 0.7 : 1}
              >
                <View style={styles.avatarShadow}>
                  <View style={styles.avatarWrapper}>
                    {profileImage ? (
                      <Image source={{ uri: profileImage }} style={styles.avatar} />
                    ) : (
                      <MaterialCommunityIcons name="account-circle" size={105} color="#FC5501" />
                    )}
                    {editing && (
                      <View style={styles.editAvatarIcon}>
                        <MaterialCommunityIcons name="camera" size={28} color="#fff" />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Información de usuario */}
              <Text style={styles.sectionTitle}>Tus datos</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="account" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Nombre</Text>
                    {editing ? (
                      <TextInput
                        value={firstName}
                        onChangeText={setFirstName}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                      />
                    ) : (
                      <Text style={styles.infoValue}>{firstName}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="account-outline" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Apellido</Text>
                    {editing ? (
                      <TextInput
                        value={lastName}
                        onChangeText={setLastName}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                      />
                    ) : (
                      <Text style={styles.infoValue}>{lastName}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="email" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Correo electrónico</Text>
                    {editing ? (
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    ) : (
                      <Text style={styles.infoValue}>{email}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="card-account-details" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Cédula</Text>
                    {editing ? (
                      <TextInput
                        value={cedula}
                        onChangeText={setCedula}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                        keyboardType="numeric"
                      />
                    ) : (
                      <Text style={styles.infoValue}>{cedula}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="phone" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Teléfono</Text>
                    {editing ? (
                      <TextInput
                        value={telefono}
                        onChangeText={setTelefono}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                        keyboardType="phone-pad"
                      />
                    ) : (
                      <Text style={styles.infoValue}>{telefono}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="account-group" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Tipo de usuario</Text>
                    <Text style={styles.infoValue}>
                      {tipo === 'client' ? 'Cliente' : 
                       tipo === 'krizoworker' ? 'Trabajador Krizo' : 
                       tipo === 'cliente' ? 'Cliente' : 
                       tipo === 'trabajador' ? 'Trabajador' : 
                       tipo || 'No especificado'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Estado de verificación */}
              <Text style={styles.sectionTitle}>Estado de cuenta</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="email-check" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Email verificado</Text>
                    <View style={styles.verificationStatus}>
                      <MaterialCommunityIcons 
                        name={user?.isEmailVerified ? "check-circle" : "alert-circle"} 
                        size={20} 
                        color={user?.isEmailVerified ? "#4CAF50" : "#FF9800"} 
                      />
                      <Text style={[
                        styles.verificationText,
                        { color: user?.isEmailVerified ? "#4CAF50" : "#FF9800" }
                      ]}>
                        {user?.isEmailVerified ? "Verificado" : "Pendiente de verificación"}
                      </Text>
                    </View>
                  </View>
                </View>
                {user?.document_url && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="file-document" size={26} color="#FC5501" style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Documento de identidad</Text>
                      <View style={styles.verificationStatus}>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                        <Text style={[styles.verificationText, { color: "#4CAF50" }]}>
                          Subido
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              {/* Ficha de información del vehículo */}
              <Text style={styles.sectionTitle}>Tu vehículo</Text>
              <View style={styles.vehicleCard}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="car" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Marca</Text>
                    {editing ? (
                      <TextInput
                        value={carBrand}
                        onChangeText={setCarBrand}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                      />
                    ) : (
                      <Text style={styles.infoValue}>{carBrand}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="car-cog" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Modelo</Text>
                    {editing ? (
                      <TextInput
                        value={carModel}
                        onChangeText={setCarModel}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                      />
                    ) : (
                      <Text style={styles.infoValue}>{carModel}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="calendar-range" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Año</Text>
                    {editing ? (
                      <TextInput
                        value={carYear}
                        onChangeText={setCarYear}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                        keyboardType="numeric"
                      />
                    ) : (
                      <Text style={styles.infoValue}>{carYear}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="card-text" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Placa</Text>
                    {editing ? (
                      <TextInput
                        value={carPlate}
                        onChangeText={setCarPlate}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                        autoCapitalize="characters"
                      />
                    ) : (
                      <Text style={styles.infoValue}>{carPlate}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="palette" size={26} color="#FC5501" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Color</Text>
                    {editing ? (
                      <TextInput
                        value={carColor}
                        onChangeText={setCarColor}
                        style={styles.editInput}
                        mode="flat"
                        underlineColor="#FC5501"
                        activeUnderlineColor="#FC5501"
                        theme={{
                          colors: {
                            background: '#fff',
                            text: '#262525', // Color de texto oscuro
                            primary: '#FC5501',
                            placeholder: '#C24100',
                          }
                        }}
                      />
                    ) : (
                      <Text style={styles.infoValue}>{carColor}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Botón para editar */}
              <ThemedButton
                style={styles.editButton}
                icon={editing ? 'content-save' : 'pencil'}
                onPress={() => setEditing(!editing)}
              >
                {editing ? 'Guardar cambios' : 'Editar perfil'}
              </ThemedButton>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
  display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40, // Espacio extra para ver el final
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row', // Para que el icono y el texto estén en línea
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FC5501',
    alignSelf: 'flex-start',
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
    marginRight: 4,
  },
  backButtonText: {
    color: '#FC5501',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginLeft: 2,
  },

  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
    marginTop: 0,
  },
  profileTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FC5501', // Naranja principal
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginLeft: 8,
  },
  profileTitle: {
    color: '#fff', // Texto blanco
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  profileSubtitle: {
    color: '#FFD6B8', // Igual que el subtítulo en ServicesScreen
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: -2,
    fontStyle: 'italic',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    zIndex: 1, // <-- Añade esto para traer al frente
    elevation: 1, // <-- Añade esto para Android
  },
  avatarShadow: {
    position: 'relative',
    shadowColor: '#FC5501',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    borderRadius: 60,
    backgroundColor: 'transparent',
    zIndex: 10, // <-- Añade esto para traer al frente
    elevation: 10, // <-- Añade esto para Android
  },
  avatarWrapper: {
    position: 'relative',
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#FC5501',
    zIndex: 11, 
    elevation: 11, 
  },
  avatar: {
    position: 'relative',
    borderRadius: 55,
    backgroundColor: '#fff',
  },
  editAvatarIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#262525',
    borderRadius: 20,
    padding: 3,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 999, 
    elevation: 999,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FC5501', // Naranja principal
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 18,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  vehicleCard: {
    width: '100%',
    backgroundColor: '#262525', // Igual que infoCard
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD6B8',
    paddingBottom: 10,
  },
  infoIcon: {
    marginRight: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
  },
  infoLabel: {
    color: '#fff', // Texto blanco sobre naranja
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 1,
    letterSpacing: 0.2,
  },
  infoValue: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  editButton: {
    marginTop: 12,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#262525',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderWidth: 1.5, // Igual que el botón volver
    borderColor: '#FC5501', // Borde naranja
  },
  editInput: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Fondo blanco para los inputs al editar
    color: '#262525',        // Texto oscuro para contraste
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 8,
    height: 30,
  },
  sectionTitle: {
    width: '100%',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 8,
    marginTop: 8,
    letterSpacing: 0.5,
    textAlign: 'left',
    paddingLeft: 2,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 0.3,
  },
});
