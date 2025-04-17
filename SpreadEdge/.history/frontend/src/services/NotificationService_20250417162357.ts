import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as Notification from 'expo-notifications';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.setupNotificationHandler();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private setupNotificationHandler() {
    if (Platform.OS === 'web') {
      // Web notifications are handled by the browser
      return;
    }
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  public async registerForPushNotifications() {
    try {
      if (Platform.OS === 'web') {
        // Request permission for web notifications
        const permission = await Notification.requestPermission();
        console.log('Web notification permission:', permission);
        return permission === 'granted';
      }

      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('Existing notification permission status:', existingStatus);
      
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('Requested notification permission status:', status);
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);
      return token;
    } catch (error) {
      console.error('Error in registerForPushNotifications:', error);
    }
  }

  public async sendLocalNotification(title: string, body: string, data?: any) {
    try {
      console.log('Attempting to send notification:', { title, body, data });
      
      if (Platform.OS === 'web') {
        // Use Web Notifications API
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
            data: data || {},
          });
          console.log('Web notification sent successfully');
        } else {
          console.log('Web notifications not permitted');
          throw new Error('Web notifications not permitted');
        }
      } else {
        // Use Expo notifications for native platforms
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: data || {},
          },
          trigger: null, // Send immediately
        });
        console.log('Native notification sent successfully');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
}

export default NotificationService; 