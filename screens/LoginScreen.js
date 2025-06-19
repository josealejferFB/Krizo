import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { ThemedInput, ThemedButton } from '../components/ThemedUIElements';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <ThemedBackgroundGradient>
      <Text style={styles.title}>¡Bienvenido! Inicia Sesión</Text>

      <ThemedInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        // Aquí pasamos el color directamente al ícono
        left={<TextInput.Icon icon="account" color="#262525" />}
      />
      <ThemedInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        // Aquí pasamos el color directamente al ícono
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
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
});