import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper'; // Asegúrate de que TextInput esté aquí para TextInput.Icon
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
        left={<TextInput.Icon icon="account" />}
      />
      <ThemedInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        right={<TextInput.Icon icon="eye" onPress={() => console.log('Toggle password visibility')} />}
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