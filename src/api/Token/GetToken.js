import AsyncStorage from "@react-native-async-storage/async-storage";
import {ASYNC_TOKEN} from '@env'
const tokenName=ASYNC_TOKEN

const getToken=async ()=>{
    const token = await AsyncStorage.getItem(tokenName);
      if (token) {
        return token;
      } else {
        return "No token found.";
      }
}

export default getToken