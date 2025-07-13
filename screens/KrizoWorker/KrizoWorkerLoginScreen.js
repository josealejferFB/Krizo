import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { ThemedInput, ThemedButton } from '../../components/ThemedUIElements';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';
import Logo from "../../assets/logo.svg";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function KrizoWorkerLoginScreen({ navigation }) {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { workerLogin } = useAuth();

  const { width, height } = useWindowDimensions();
  const isSmallScreen = height > 800;
  const isLargeScreen = height > 850;
  const bottomPosition = isLargeScreen ? '4%' : isSmallScreen ? '2%' : '1%'; // Más arriba en pantallas grandes, más abajo en pequeñas

  const handleLogin = async () => {
    if (!user.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      const result = await workerLogin(user.trim(), password);
      if (result.success) {
        navigation.replace('KrizoWorkerHome');
      } else {
        Alert.alert('Error', result.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

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
              onPress={handleLogin}
              icon="login"
              style={styles.loginButton}
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </ThemedButton>

            {/* Enlace de registro */}
            <View style={styles.registerLinkContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('RegistrationWorker')}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>


        <View style={{
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
    bottom: bottomPosition, // <-- Antes: bottom: 32. Ahora sube el aviso aún más
    left: 0,
        }}>
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
  exclusiveBannerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginRight: '20%',
  },
  lockIcon: {
    marginLeft: '15%',
    marginRight: 0,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  registerText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  registerLink: {
    color: '#FC5501',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
