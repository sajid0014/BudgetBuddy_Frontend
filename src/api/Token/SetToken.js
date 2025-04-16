import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_TOKEN, ASYNC_USERID } from '@env'; // add a second env var

const tokenName = ASYNC_TOKEN;
const userIdKey = ASYNC_USERID;

const setToken = async (token, userId) => {
  try {
    await AsyncStorage.multiSet([
      [tokenName, token],
      [userIdKey, userId],
    ]);
    console.log("Token and UserID saved successfully.");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export default setToken;
