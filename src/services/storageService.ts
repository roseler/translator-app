import AsyncStorage from '@react-native-async-storage/async-storage';
import { Translation } from '../types';

const HISTORY_KEY = '@harmony_app_history';
const OFFLINE_MODE_KEY = '@harmony_app_offline_mode';

export const saveTranslation = async (translation: Translation): Promise<void> => {
  try {
    const history = await getHistory();
    const newHistory = [translation, ...history].slice(0, 100); // Keep last 100 translations
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving translation:', error);
  }
};

export const getHistory = async (): Promise<Translation[]> => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};

export const deleteTranslation = async (id: string): Promise<void> => {
  try {
    const history = await getHistory();
    const newHistory = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error deleting translation:', error);
  }
};

export const getOfflineMode = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(OFFLINE_MODE_KEY);
    return value === 'true';
  } catch (error) {
    return false;
  }
};

export const setOfflineMode = async (value: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(OFFLINE_MODE_KEY, value.toString());
  } catch (error) {
    console.error('Error setting offline mode:', error);
  }
};

