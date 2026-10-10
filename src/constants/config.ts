import { Platform } from 'react-native';

const PC_IP = '10.97.91.30'; // Wi-Fi IPv4 from ipconfig

export const API_URL = Platform.select({
  web: 'http://localhost:8000/api',    // browser on your PC
  default: `http://${PC_IP}:8000/api`, // Expo Go on your phone
})!;