import React from 'react';
import { StyleSheet, View } from 'react-native'; // Se quita Image si ya no se usa directamente aquí
import { Text, TextInput } from 'react-native-paper';
import { ThemedInput, ThemedButton } from '../components/ThemedUIElements';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import Logo from "../assets/logo.svg"; // ¡Descomentado y usando logo.svg!

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <ThemedBackgroundGradient>
      {/* Logo en la parte superior central */}
      <View style={styles.logoContainer}>
        {/* Cambiado para usar el componente Logo importado directamente para SVG */}
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

      {/* NUEVO: Botón para Registrarse */}
      <ThemedButton
        onPress={() => {
          console.log('Navegando a Registro');
          navigation.navigate('Registration'); // Navega a la pantalla de Registro
        }}
        style={styles.registerButton}
        labelStyle={styles.registerButtonLabel}
        mode="text" // Puedes usar 'text' para que sea un enlace, o 'outlined'
      >
        ¿No tienes cuenta? Regístrate
      </ThemedButton>

    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center', // Centra el logo si es más pequeño que el contenedor
    justifyContent: 'center',
  },
  logo: { // ESTILO PARA EL LOGO SVG (Nota: los estilos de Image como width/height/resizeMode se aplican directamente al componente SVG)
    width: 150, // O el tamaño que necesites para tu logo
    height: 150,
    // resizeMode: 'contain', // No aplica directamente a SVG de esta forma, se maneja con width/height
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
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  }
});