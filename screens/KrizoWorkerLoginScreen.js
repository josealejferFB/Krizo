import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { ThemedInput, ThemedButton } from '../components/ThemedUIElements';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import Logo from "../assets/logo.svg";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function KrizoWorkerLoginScreen({ navigation }) {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <ThemedBackgroundGradient>
      {/* Botón volver al inicio de sesión, claro y destacado */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Login')}
      >
        <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" style={styles.backIcon} />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingBottom: 40, // espacio para el aviso
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo en la parte superior central */}
          <View style={styles.logoContainer}>
            <Logo width={120} height={120} />
          </View>

          {/* Título con ícono de grúa a la derecha */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>KrizoWorker</Text>
            <MaterialCommunityIcons name="tow-truck" size={40} color="#fff" style={styles.titleIconRight} />
          </View>

          <View style={styles.formCard}>
            <ThemedInput
              label="Ingresa tu correo o teléfono"
              value={user}
              onChangeText={setUser}
              left={<TextInput.Icon icon="account" color="#262525" />}
            />
            <ThemedInput
              label="Tu clave segura"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  color="#262525"
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <ThemedButton
              onPress={() => {
                // Aquí iría la lógica de login de KrizoWorker
                navigation.replace('Home');
              }}
              icon="login"
              style={styles.loginButton}
            >
              Ingresar
            </ThemedButton>
          </View>
        </ScrollView>

        {/* Aviso de acceso exclusivo para trabajadores, fijo abajo */}
        <View style={styles.exclusiveBanner}>
          <MaterialCommunityIcons name="lock" size={60} color="#262525" style={styles.lockIcon} />
          <Text style={styles.exclusiveBannerText}>Acceso exclusivo para trabajadores</Text>
        </View>
      </View>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#262525', // Color oscuro
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
    color: '#fff', // Texto blanco para contraste
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: '#FC5501',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginRight: 12,
  },
  titleIconRight: {
    marginLeft: 0,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 10,
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FC5501',
  },
  exclusiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C24100',
    borderRadius: 0,
    paddingVertical: 30,
    paddingHorizontal: 18,
    width: '100%',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    position: 'absolute',
    bottom: 64, // <-- Antes: bottom: 32. Ahora sube el aviso aún más
    left: 0,
  },
  exclusiveBannerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginLeft: 14,
  },
  lockIcon: {
    marginRight: 0,
  },
});