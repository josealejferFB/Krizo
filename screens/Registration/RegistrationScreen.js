import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Appbar, TextInput, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../../assets/logo.svg';

import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';
import { ThemedInput, ThemedButton } from '../../components/ThemedUIElements';
import { useAuth } from '../../context/AuthContext';

const { height } = Dimensions.get('window');

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { register } = useAuth();

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (nombres && apellidos && cedula && email && telefono && password && confirmPassword) {
      if (password !== confirmPassword) {
        return Alert.alert('Error', 'Verificar que su contraseña coincida');
      }
      
      // Validar formato de cédula (solo números)
      if (!/^\d+$/.test(cedula)) {
        return Alert.alert('Error', 'La cédula debe contener solo números');
      }
      
      // Validar formato de teléfono (solo números)
      if (!/^\d+$/.test(telefono)) {
        return Alert.alert('Error', 'El teléfono debe contener solo números');
      }
      
      setIsLoading(true);
      try {
        console.log('Enviando datos de registro:', { nombres, apellidos, cedula, email, telefono, password });
        
        const result = await register({
          nombres,
          apellidos,
          cedula,
          email,
          telefono,
          password,
          tipo: 'cliente'
        });
        
        if (result.success) {
          Alert.alert('Éxito', 'Usuario registrado correctamente. Revisa tu email para el código de verificación.', [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Registration3', {
                userId: result.user.id,
                userEmail: result.user.email
              })
            }
          ]);
        } else {
          Alert.alert('Error', result.error || 'Error en el registro');
        }
      } catch (error) {
        console.error('Error en registro:', error);
        Alert.alert('Error', 'Error al registrar usuario');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  return (
    <ThemedBackgroundGradient>
      <View style={styles.container}>
        {/* Botón volver igual que en KrizoWorkerLoginScreen */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" style={styles.backIcon} />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Logo width={150} height={100} style={styles.logo} />

          <ThemedInput
            label="Nombres"
            value={nombres}
            onChangeText={setNombres}
            style={styles.themedInputOverride}
          />

          <ThemedInput
            label="Apellidos"
            value={apellidos}
            onChangeText={setApellidos}
            style={styles.themedInputOverride}
          />

          <ThemedInput
            label="Cédula"
            value={cedula}
            onChangeText={setCedula}
            keyboardType="numeric"
            style={styles.themedInputOverride}
          />
          <Text style={styles.helperText}>
            Asegúrate de que tu nombre y apellido coincida con tu cédula de identidad.
          </Text>

          <ThemedInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.themedInputOverride}
          />
          <Text style={styles.helperText}>
            Te mandaremos un Email para completar tu registro.
          </Text>

          <ThemedInput
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            style={styles.themedInputOverride}
          />
          <Text style={styles.helperText}>
            Ingresa tu número de teléfono sin espacios ni guiones.
          </Text>

          <ThemedInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.themedInputOverride} // <-- Asegura que este style esté aquí
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                color={theme.colors.onSurfaceVariant}
              />
            }
          />
          <ThemedInput
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.themedInputOverride} // <-- Asegura que este style esté aquí
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}c
                color={theme.colors.onSurfaceVariant}
              />
            }
          />
          <Text style={styles.termsText}>
            Al presionar "Continuar Registro" te comprometes a haber leído los{' '}
            <Text style={styles.linkText}>Términos de Servicio</Text>,{' '}
            <Text style={styles.linkText}>Términos de Pago</Text> y las{' '}
            <Text style={styles.linkText}>Políticas de Privacidad</Text>.
          </Text>

          <ThemedButton
            onPress={handleRegister}
            style={[styles.themedButtonOverride, { marginBottom: 50 }]}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Continuar Registro'}
          </ThemedButton>
        </ScrollView>
      </View>
    </ThemedBackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  appBar: {
    backgroundColor: '#FF6F00',
    elevation: 0,
    height: 70,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  appBarTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  appBarContentCentered: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 100, // Agregar padding extra abajo para el botón
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: height,
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 40,
    marginTop: 20,
  },
  themedInputOverride: {
    width: '100%',
  },
  helperText: {
    color: '#F5F2F0',
    fontSize: 14, // <--- AJUSTADO AQUÍ
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
  },
  termsText: {
    color: '#F5F2F0',
    fontSize: 14, // <--- AJUSTADO AQUÍ
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    lineHeight: 18,
  },
  linkText: {
    color: '#262525',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  themedButtonOverride: {
    width: '100%',
    marginTop: 20,
    borderRadius: 12,
  },
});

export default RegistrationScreen;
