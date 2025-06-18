import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// ¡Importa PaperProvider desde react-native-paper!
import { PaperProvider } from 'react-native-paper';

// Importa tus pantallas
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';

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
            options={{ title: 'Iniciar Sesión' }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Principal' }}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen}
            options={{ title: 'Detalles' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}