import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Appbar, TextInput, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../assets/logo.svg';

import { ThemedInput, ThemedButton } from '../components/ThemedUIElements';

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
        <Logo width={150} height={100} style={styles.logo} />

        <ThemedInput
          label="Primer Nombre"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.themedInputOverride}
        />

        <ThemedInput
          label="Primer Apellido"
          value={lastName}
          onChangeText={setLastName}
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
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
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
          style={styles.themedButtonOverride}
        >
          Continuar Registro
        </ThemedButton>
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