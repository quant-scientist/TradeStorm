import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.API_URL || 'http://localhost:8000';

interface LoginResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/token`, formData);
    if (response.data.access_token) {
      await AsyncStorage.setItem('access_token', response.data.access_token);
      await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  }

  async getCurrentToken(): Promise<string | null> {
    return await AsyncStorage.getItem('access_token');
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) return null;

      const response = await axios.post(`${API_URL}/refresh-token`, null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.data.access_token) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        return response.data.access_token;
      }
      return null;
    } catch (error) {
      await this.logout();
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getCurrentToken();
    return !!token;
  }
}

export const authService = new AuthService(); 