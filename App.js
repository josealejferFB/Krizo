// App.js
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { DimensionsProvider } from './context/DimensionsContext';
import { AuthProvider } from './context/AuthContext';
import 'react-native-gesture-handler';

// Importa tus pantallas principales
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ServicesScreen from './screens/ServicesScreen';
import RegistrationScreen from './screens/Registration/RegistrationScreen';
import Registration2Screen from './screens/Registration/Registration2Screen';
import Registration3Screen from './screens/Registration/Registration3Screen';
import Registration4Screen from './screens/Registration/Registration4Screen';
import Registration5Screen from './screens/Registration/Registration5Screen';
import RegistrationWorkerScreen from './screens/Registration/RegistrationWorkerScreen';
import RegistrationWorkerScreen2 from './screens/Registration/RegistrationWorkerScreen2';
import EmailVerificationScreen from './screens/EmailVerificationScreen';

import KrizoWorkerLoginScreen from './screens/KrizoWorker/KrizoWorkerLoginScreen';
import KrizoWorkerHomeScreen from './screens/KrizoWorker/KrizoWorkerHomeScreen';
import KrizoWorkerRequestsScreen from './screens/KrizoWorker/KrizoWorkerRequestsScreen';
import KrizoWorkerPaymentsScreen from './screens/KrizoWorker/KrizoWorkerPaymentsScreen';
import KrizoWorkerProfileScreen from './screens/KrizoWorker/KrizoWorkerProfileScreen';
import KrizoWorkerServiceConfigScreen from './screens/KrizoWorker/KrizoWorkerServiceConfigScreen';
import KrizoWorkerServiceProfileScreen from './screens/KrizoWorker/KrizoWorkerServiceProfileScreen';
import KrizoWorkerPaymentMethodsScreen from './screens/KrizoWorker/KrizoWorkerPaymentMethodsScreen';
import MechanicRequestsScreen from './screens/KrizoWorker/MechanicRequestsScreen';
import ChatScreen from './screens/KrizoWorker/ChatScreen';
import MechanicConfigScreen from './screens/KrizoWorker/MechanicConfigScreen';
import CraneConfigScreen from './screens/KrizoWorker/CraneConfigScreen';
import ShopConfigScreen from './screens/KrizoWorker/ShopConfigScreen';
import KrizoWorkerChatListScreen from './screens/KrizoWorker/KrizoWorkerChatListScreen';
import KrizoWorkerChatScreen from './screens/KrizoWorker/KrizoWorkerChatScreen';
import KrizoWorkerPaymentsReceivedScreen from './screens/KrizoWorker/KrizoWorkerPaymentsReceivedScreen';
import KrizoWorkerCompletedOrdersScreen from './screens/KrizoWorker/KrizoWorkerCompletedOrdersScreen';

import MyProfileScreen from './screens/MyProfileScreen';
import CraneClientScreen from './screens/CraneClientScreen';
import MechanicClientScreen from './screens/MechanicClientScreen';
import ShopClientScreen from './screens/ShopClientScreen';
import ProductScreen from './screens/ProductScreen';
import WalletScreen from './screens/WalletScreen';
import PaymentScreen from './screens/PaymentScreen';
import ClientQuotesScreen from './screens/ClientQuotesScreen';
import EnhancedPaymentScreen from './screens/EnhancedPaymentScreen';

const Stack = createNativeStackNavigator();

function App() {
  const { width, height } = useWindowDimensions();
  const isLowerHeight = height > 800;
  const isLargerHeight = height > 850;
  const isLowerWidth = width > 600;
  const isLargerWidth = width > 760;
  const bottomPosition = isLargerHeight ? '4%' : isLowerHeight ? '2%' : '1%';
  const responsiveWidth = isLargerWidth ? '96%' : isLowerWidth ? '80%' : 350;
  const paddingAmount = isLargerHeight ? 24 : 14;

  return (
    <PaperProvider>
      <AuthProvider>
        <DimensionsProvider>
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
              name="Registration2"
              component={Registration2Screen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Registration3"
              component={Registration3Screen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Registration4"
              component={Registration4Screen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Registration5"
              component={Registration5Screen}
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
            <Stack.Screen
              name="EmailVerification"
              component={EmailVerificationScreen}
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
            <Stack.Screen
              name="Services"
              component={ServicesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MechanicClient"
              component={MechanicClientScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CraneClient"
              component={CraneClientScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ShopClient"
              component={ShopClientScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MechanicConfig"
              component={MechanicConfigScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CraneConfig"
              component={CraneConfigScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ShopConfig"
              component={ShopConfigScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerLogin"
              component={KrizoWorkerLoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerHome"
              component={KrizoWorkerHomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerRequests"
              component={KrizoWorkerRequestsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerPayments"
              component={KrizoWorkerPaymentsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerProfile"
              component={KrizoWorkerProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerServiceConfig"
              component={KrizoWorkerServiceConfigScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerServiceProfile"
              component={KrizoWorkerServiceProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerPaymentMethods"
              component={KrizoWorkerPaymentMethodsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerChatList"
              component={KrizoWorkerChatListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerChat"
              component={KrizoWorkerChatScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerPaymentsReceived"
              component={KrizoWorkerPaymentsReceivedScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KrizoWorkerCompletedOrders"
              component={KrizoWorkerCompletedOrdersScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MechanicRequests"
              component={MechanicRequestsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EnhancedPaymentScreen"
              component={EnhancedPaymentScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{ headerShown: false }}
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
              name="Product"
              component={ProductScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClientQuotes"
              component={ClientQuotesScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
                  </NavigationContainer>
        </DimensionsProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

export default App;
