# Frontend de Krizo - React Native + Expo

Este es el frontend de la aplicación Krizo, desarrollado con React Native y Expo para conectar clientes con trabajadores automotrices.

## 🚀 Características

- **React Native 0.79.4** con Expo 53.0.11
- **Navegación fluida** con React Navigation 7
- **UI moderna** con React Native Paper
- **Autenticación JWT** con contexto global
- **Subida de imágenes** con Expo Image Picker
- **Almacenamiento local** con AsyncStorage
- **Chat en tiempo real** con Socket.IO
- **Geolocalización** para servicios cercanos

## 📋 Requisitos

- Node.js (v18 o superior)
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (para Android) o Xcode (para iOS)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Krizo-master
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

4. **Configurar IP del servidor**
En `context/AuthContext.js`, cambiar la IP del servidor:
```javascript
const API_BASE_URL = 'http://TU_IP:5000/api';
```

## 📱 Ejecutar la Aplicación

### **Desarrollo**
```bash
# Iniciar Expo
npm start

# O específicamente
npx expo start
```

### **Plataformas Específicas**
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🗂️ Estructura del Proyecto

```
screens/
├── KrizoWorker/              # Pantallas del trabajador
│   ├── KrizoWorkerHomeScreen.js
│   ├── KrizoWorkerRequestsScreen.js
│   ├── KrizoWorkerProfileScreen.js
│   ├── KrizoWorkerPaymentsScreen.js
│   └── KrizoWorkerCompletedOrdersScreen.js
├── Registration/             # Pantallas de registro
│   ├── RegistrationScreen.js
│   ├── RegistrationWorkerScreen.js
│   └── EmailVerificationScreen.js
├── HomeScreen.js             # Pantalla principal del cliente
├── ServicesScreen.js         # Servicios disponibles
├── PaymentScreen.js          # Pantalla de pagos
└── EnhancedPaymentScreen.js  # Pantalla de pagos mejorada

components/
├── ChatModal.js              # Modal de chat
├── PaymentModal.js           # Modal de pagos
├── QuoteModal.js             # Modal de cotizaciones
├── ServiceRequestModal.js    # Modal de solicitudes
├── DocumentUpload.js         # Subida de documentos
├── LocationPicker.js         # Selector de ubicación
└── ThemedUIElements.js       # Elementos de UI temáticos

context/
├── AuthContext.js            # Contexto de autenticación
└── DimensionsContext.js      # Contexto de dimensiones

utils/
├── emailService.js           # Servicio de email
├── geolocation.js            # Utilidades de geolocalización
└── notifications.js          # Notificaciones push
```

## 🔐 Autenticación

### **Flujo de Registro**
1. **Registro de Cliente**: Datos básicos + verificación de email
2. **Registro de Trabajador**: Datos extendidos + configuración de servicios
3. **Verificación de Email**: Código enviado por email
4. **Login**: Autenticación con JWT

### **Contexto de Autenticación**
```javascript
import { useAuth } from '../context/AuthContext';

const { user, login, logout, register } = useAuth();
```

## 📱 Pantallas Principales

### **Cliente**
- **HomeScreen**: Dashboard principal con servicios
- **ServicesScreen**: Lista de servicios disponibles
- **PaymentScreen**: Sistema de pagos
- **ClientQuotesScreen**: Cotizaciones recibidas

### **Trabajador**
- **KrizoWorkerHomeScreen**: Dashboard del trabajador
- **KrizoWorkerRequestsScreen**: Solicitudes pendientes
- **KrizoWorkerPaymentsScreen**: Gestión de pagos
- **KrizoWorkerProfileScreen**: Perfil y configuración

## 💳 Sistema de Pagos

### **Métodos Soportados**
- PayPal
- Binance
- Transferencia bancaria
- Efectivo
- Zelle

### **Flujo de Pago**
1. Seleccionar método de pago
2. Subir comprobante (imagen)
3. Enviar pago al servidor
4. Esperar verificación del trabajador

## 📸 Subida de Archivos

### **Imágenes de Comprobantes**
```javascript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
};
```

## 🎨 UI/UX

### **Tema Principal**
- **Color primario**: #FC5501 (Naranja Krizo)
- **Color secundario**: #1BC100 (Verde éxito)
- **Color error**: #FF3D00 (Rojo error)

### **Componentes Reutilizables**
- **ThemedBackgroundGradient**: Fondo degradado
- **ThemedUIElements**: Botones y elementos temáticos
- **CustomDatePicker**: Selector de fechas personalizado

## 🔧 Configuración

### **Expo Config**
```json
{
  "expo": {
    "name": "Krizo",
    "slug": "krizo-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FC5501"
    }
  }
}
```

### **Navegación**
```javascript
// Stack Navigator principal
<Stack.Navigator>
  <Stack.Screen name="Splash" component={SplashScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="KrizoWorkerHome" component={KrizoWorkerHomeScreen} />
</Stack.Navigator>
```

## 🧪 Testing

### **Ejecutar Tests**
```bash
npm test
```

### **Testing de Componentes**
```bash
npm run test:components
```

## 📦 Build y Despliegue

### **Android**
```bash
expo build:android
```

### **iOS**
```bash
expo build:ios
```

### **Publicar en Expo**
```bash
expo publish
```

## 🔍 Debugging

### **React Native Debugger**
```bash
npm install -g react-native-debugger
react-native-debugger
```

### **Flipper**
```bash
# Instalar Flipper
# Conectar con la app en desarrollo
```

## 📚 Recursos

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

**Desarrollado con ❤️ para la comunidad automotriz** 