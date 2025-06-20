import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importa PaperProvider desde react-native-paper
import { PaperProvider, Surface, Text } from 'react-native-paper';
// Importa tus pantallas
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ServicesScreen from './screens/ServicesScreen'; // ¡IMPORTACIÓN CORREGIDA!

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <PaperProvider> debe envolver todo el contenido de tu aplicación
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
          {/* Aquí se añade la pantalla de Servicios */}
          <Stack.Screen
            name="Services" // Este 'name' debe coincidir con el 'screen' en tu menuOptions
            component={ServicesScreen} // ¡NOMBRE DEL COMPONENTE CORREGIDO!
            options={{ headerShown: false }} // Ajusta esto si quieres que tenga un encabezado
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}