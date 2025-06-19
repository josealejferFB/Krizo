import React from 'react';
import { StyleSheet, View } from 'react-native'; // Asegúrate de que View esté aquí y Text NO
import { Text, TextInput } from 'react-native-paper'; // ¡Asegúrate que Text se importa de react-native-paper!
import { ThemedInput, ThemedButton } from '../components/ThemedUIElements';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import Logo from "../assets/logo.svg";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <ThemedBackgroundGradient>
      {/* Logo en la parte superior central */}
      <View style={styles.logoContainer}>
        <Logo width={150} height={150} />
      </View>

      <Text style={styles.title}>¡Bienvenido! Inicia Sesión</Text>

      <ThemedInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        left={<TextInput.Icon icon="account" color="#262525" />}
      />
      <ThemedInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        right={<TextInput.Icon icon="eye" color="#262525" onPress={() => console.log('Toggle password visibility')} />}
      />

      <ThemedButton
        onPress={() => {
          console.log('Usuario:', username, 'Contraseña:', password);
          navigation.replace('Home');
        }}
        icon="login"
      >
        Ingresar
      </ThemedButton>

      {/* Botón "Ingresar como KrizoWorker" */}
      <ThemedButton
        onPress={() => {
          console.log('Ingresando como KrizoWorker');
          navigation.replace('Home');
        }}
        style={styles.krizoWorkerButton}
        labelStyle={styles.krizoWorkerButtonLabel}
        mode="contained"
      >
        Ingresar como KrizoWorker
      </ThemedButton>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  krizoWorkerButton: {
    height: 70,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  krizoWorkerButtonLabel: {
    color: '#FC5501',
    fontSize: 18,
    fontWeight: 'bold',
  }
});