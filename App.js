import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper'; 

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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen} // HomeScreen ahora se encargará de su propio Layout
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen} // Si esta necesita Layout, lo importará
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Services"
            component={ServicesScreen} // Si esta necesita Layout, lo importará
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}