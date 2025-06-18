import React from 'react';
import { View, StyleSheet } from 'react-native';
// ¡Importa los componentes directamente desde react-native-paper!
import { Text, Button, TextInput } from 'react-native-paper';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View style={styles.container}>
      {/* Usa el componente Text de Paper */}
      <Text style={styles.title}>¡Bienvenido! Inicia Sesión</Text>

      {/* Usa el componente TextInput de Paper */}
      <TextInput
        label="Usuario" // El 'label' flota al escribir
        value={username}
        onChangeText={text => setUsername(text)}
        mode="outlined" // Opciones: 'flat' (por defecto) o 'outlined'
        style={styles.input}
        left={<TextInput.Icon icon="account" />} // Ejemplo de cómo añadir un ícono
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry // Para ocultar el texto
        mode="outlined"
        style={styles.input}
        right={<TextInput.Icon icon="eye" onPress={() => console.log('Toggle password visibility')} />} // Ícono para visibilidad
      />

      {/* Usa el componente Button de Paper */}
      <Button
        mode="contained" // Opciones: 'text', 'outlined', 'contained'
        onPress={() => {
          console.log('Usuario:', username, 'Contraseña:', password);
          // Después de la lógica de autenticación, navega
          navigation.replace('Home');
        }}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        icon="login" // Ejemplo de cómo añadir un ícono al botón
      >
        Ingresar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, // Añadir padding para los inputs no estén pegados a los bordes
  },
  title: {
    fontSize: 28, // Tamaño de fuente para el título
    marginBottom: 30,
    color: '#333',
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
    paddingVertical: 8, // Aumenta el padding para hacer el botón más alto
  },
  buttonLabel: {
    fontSize: 18, // Tamaño del texto dentro del botón
  }
});