import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAsyncStorageItem = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);

    if (jsonValue) {
      return jsonValue;
    }

    return null;
  } catch (error) {
    console.error(error);
  }
};

export const setAsyncStorageItem = async (
  key: string,
  value: string | object,
) => {
  try {
    await AsyncStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    );
  } catch (error) {
    console.error(error);
  }
};

export const removeAsyncStorageItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
