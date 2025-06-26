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
import Registration2Screen from './screens/Registration2Screen';
import Registration3Screen from './screens/Registration3Screen';
import Registration4Screen from './screens/Registration4Screen';
import Registration5Screen from './screens/Registration5Screen';
import KrizoWorkerLoginScreen from './screens/KrizoWorkerLoginScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import WalletScreen from './screens/WalletScreen'; // Agrega esta línea
import RegistrationWorkerScreen from './screens/RegistrationWorkerScreen';
import RegistrationWorkerScreen2 from './screens/RegistrationWorkerScreen2';

const Stack = createNativeStackNavigator();

function App() {
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
            name="Registration2"
            component={Registration2Screen}
            options={{ headerShown: false }} // Oculta el encabezado
          />
          <Stack.Screen
            name="Registration3"
            component={Registration3Screen}
            options={{ headerShown: false }} // Oculta el encabezado
          />
          <Stack.Screen
            name="Registration4"
            component={Registration4Screen}
            options={{ headerShown: false }} // Oculta el encabezado
          />
          <Stack.Screen
            name="Registration5"
            component={Registration5Screen}
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
          <Stack.Screen
            name="KrizoWorkerLogin"
            component={KrizoWorkerLoginScreen}
            options={{ headerShown: false }} // Oculta el encabezado
          />
          <Stack.Screen
            name="MyProfile"
            component={MyProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Wallet"
            component={WalletScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistrationWorker"
            component={RegistrationWorkerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistrationWorkerScreen2"
            component={RegistrationWorkerScreen2}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;