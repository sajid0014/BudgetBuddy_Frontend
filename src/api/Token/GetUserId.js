import AsyncStorage from "@react-native-async-storage/async-storage";
import {ASYNC_USERID} from '@env'
const userId=ASYNC_USERID

const getUserId=async ()=>{
    const userId = await AsyncStorage.getItem(userId);
      if (userId) {
        return userId;
      } else {
        return "No token found.";
      }
}

export default getUserId;