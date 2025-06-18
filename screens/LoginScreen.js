import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { ThemedInput, ThemedButton } from '../components/ThemedUIElements';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient'; // ¡Nombre corregido aquí!

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <ThemedBackgroundGradient> {/* Usando el componente con el nombre correcto */}
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
    color: '#FFFFFF', // Texto blanco para que contraste con el degradado
  },
});