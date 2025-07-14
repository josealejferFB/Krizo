import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  constructor() {
    this.expoPushToken = null;
  }

  // Registrar para notificaciones push
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('No se obtuvieron permisos para notificaciones push');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Reemplazar con tu project ID
      })).data;
    } else {
      console.log('Debe usar un dispositivo físico para notificaciones push');
    }

    this.expoPushToken = token;
    return token;
  }

  // Enviar notificación local
  async sendLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
      },
      trigger: null, // Enviar inmediatamente
    });
  }

  // Enviar notificación push a través del servidor
  async sendPushNotification(expoPushToken, title, body, data = {}) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      console.log('Notificación push enviada:', result);
      return result;
    } catch (error) {
      console.error('Error enviando notificación push:', error);
      throw error;
    }
  }

  // Escuchar notificaciones recibidas
  addNotificationReceivedListener(listener) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Escuchar notificaciones respondidas (cuando el usuario toca la notificación)
  addNotificationResponseReceivedListener(listener) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Obtener el token de notificación
  getExpoPushToken() {
    return this.expoPushToken;
  }
}

// Instancia global del servicio de notificaciones
export const notificationService = new NotificationService(); 