import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import { ThemedInput, ThemedButton } from '../components/ThemedUIElements';
import * as ImagePicker from 'expo-image-picker';

export default function MyProfileScreen({ navigation }) {
  const [firstName, setFirstName] = useState('Juan');
  const [lastName, setLastName] = useState('Pérez');
  const [email, setEmail] = useState('juan.perez@email.com');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [profileImage, setProfileImage] = useState(null);
  const [editing, setEditing] = useState(false);

  // Datos de vehículo (puedes adaptarlo a tu modelo real)
  const [carBrand, setCarBrand] = useState('Toyota');
  const [carModel, setCarModel] = useState('Corolla');
  const [carYear, setCarYear] = useState('2020');
  const [carPlate, setCarPlate] = useState('ABC-1234');
  const [carColor, setCarColor] = useState('Rojo');

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
      <View style={styles.container}>
        <View style={styles.mainCard}>
          <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
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
                <MaterialCommunityIcons name="calendar" size={26} color="#FC5501" style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Fecha de nacimiento</Text>
                  {editing ? (
                    <TextInput
                      value={birthDate}
                      onChangeText={setBirthDate}
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
                    <Text style={styles.infoValue}>{birthDate}</Text>
                  )}
                </View>
              </View>
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
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 16,
    width: '92%',
    maxWidth: 370,
    alignSelf: 'center',
    marginTop: 38, // Antes: 18. Ahora más abajo, igual que ServicesScreen
    marginBottom: 18,
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
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
});
