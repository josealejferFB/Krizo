import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import BackgroundGradient from '../components/BackgroundGradient'; // ¡Importa el nuevo componente!

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <BackgroundGradient> {/* Envuelve tu contenido con el degradado */}
      <Text style={styles.title}>¡Bienvenido! Inicia Sesión</Text>

      <TextInput
        label="Usuario"
        value={username}
        onChangeText={text => setUsername(text)}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        right={<TextInput.Icon icon="eye" onPress={() => console.log('Toggle password visibility')} />}
      />

      <Button
        mode="contained"
        onPress={() => {
          console.log('Usuario:', username, 'Contraseña:', password);
          navigation.replace('Home');
        }}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        icon="login"
      >
        Ingresar
      </Button>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
 
  title: {
    fontSize: 28,
    marginBottom: 30,
    color: '#FFFFFF', 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
  }
});