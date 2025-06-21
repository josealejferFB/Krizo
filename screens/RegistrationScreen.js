import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Appbar, TextInput, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../assets/logo.svg'; // ¡Importa tu logo SVG!

const { height } = Dimensions.get('window');

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (firstName && lastName && email && password) {
      console.log('Datos de Registro:', { firstName, lastName, email, password });
      alert('Registro en progreso... (funcionalidad de registro real aquí)');
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content
          title="Volver al Inicio de Sesión"
          titleStyle={styles.appBarTitle}
          style={styles.appBarContentCentered}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Logo de Krizo SVG */}
        <Logo width={150} height={100} style={styles.logo} /> {/* Usa el componente Logo */}

        <TextInput
          label="Primer Nombre"
          value={firstName}
          onChangeText={setFirstName}
          mode="flat"
          style={styles.input}
          theme={{ colors: { primary: theme.colors.onSurface, background: 'white' } }}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          placeholderTextColor="#888"
        />

        <TextInput
          label="Primer Apellido"
          value={lastName}
          onChangeText={setLastName}
          mode="flat"
          style={styles.input}
          theme={{ colors: { primary: theme.colors.onSurface, background: 'white' } }}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          placeholderTextColor="#888"
        />
        <Text style={styles.helperText}>
          Asegúrate de que tu nombre y apellido coincida con tu cédula de identidad.
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="flat"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          theme={{ colors: { primary: theme.colors.onSurface, background: 'white' } }}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          placeholderTextColor="#888"
        />
        <Text style={styles.helperText}>
          Te mandaremos un Email para completar tu registro.
        </Text>

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="flat"
          secureTextEntry={!showPassword}
          style={styles.input}
          theme={{ colors: { primary: theme.colors.onSurface, background: 'white' } }}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          placeholderTextColor="#888"
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
              color="#888"
            />
          }
        />

        <Text style={styles.termsText}>
          Al presionar "Continuar Registro" te comprometes a haber leído los{' '}
          <Text style={styles.linkText}>Términos de Servicio</Text>,{' '}
          <Text style={styles.linkText}>Términos de Pago</Text> y las{' '}
          <Text style={styles.linkText}>Políticas de Privacidad</Text>.
        </Text>

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.registerButton}
          labelStyle={styles.registerButtonLabel}
          contentStyle={styles.registerButtonContent}
        >
          Continuar Registro
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6F00',
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: height,
  },
  logo: { // Estilos para tu componente SVG
    width: 150,
    height: 100,
    marginBottom: 40,
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    borderColor: 'transparent',
    overflow: 'hidden',
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  helperText: {
    color: '#333',
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
  },
  termsText: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    lineHeight: 18,
  },
  linkText: {
    color: 'blue', // Usar un color de enlace explícito o theme.colors.primary
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  registerButton: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'black',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  registerButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButtonContent: {
    height: 50,
  },
});

export default RegistrationScreen;