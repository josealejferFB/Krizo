import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importa PaperProvider desde react-native-paper
import { PaperProvider } from 'react-native-paper'; // Quitamos Surface y Text ya que no se usan directamente aquí
// Importa tus pantallas
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ServicesScreen from './screens/ServicesScreen'; // Tu pantalla de servicios
import RegistrationScreen from './screens/RegistrationScreen'; // ¡NUEVA PANTALLA DE REGISTRO!

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // PaperProvider debe envolver todo el contenido de tu aplicación
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          {/* ¡Aquí se añade la pantalla de REGISTRO! */}
          <Stack.Screen
            name="Registration" // Nombre de la ruta para la pantalla de registro
            component={RegistrationScreen}
            options={{ headerShown: false }} // La pantalla de registro tiene su propia AppBar
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Services"
            component={ServicesScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
