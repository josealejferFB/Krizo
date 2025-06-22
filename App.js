// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper'; 
import 'react-native-gesture-handler'; // ¡IMPORTANTE! Esta línea debe ser la PRIMERA


// Importa tus pantallas
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ServicesScreen from './screens/ServicesScreen'; 
import RegistrationScreen from './screens/RegistrationScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }} // Oculta el encabezado para esta pantalla
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }} // Oculta el encabezado
          />
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{ headerShown: false }} // Oculta el encabezado
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen} 
            options={{ headerShown: false }} // HomeScreen usará su propio Layout, así que oculta el de la navegación
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen} 
            options={{ headerShown: false }} // Oculta el encabezado
          />
          <Stack.Screen
            name="Services"
            component={ServicesScreen} 
            options={{ headerShown: false }} // Oculta el encabezado
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}