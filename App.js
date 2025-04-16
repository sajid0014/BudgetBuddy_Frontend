/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { View, Dimensions, NativeEventEmitter, NativeModules, PermissionsAndroid } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import StartUpScreen from "./src/screens/StartUpScreen"
import Home from "./src/screens/Home";
import Login from "./src/screens/Login";
import Profile from "./src/screens/Profile";
import Resources from "./src/screens/Resources";
import Signup from "./src/screens/Signup";
import Transaction from "./src/screens/Transaction";
import Upload from "./src/screens/Upload";
import Otp from "./src/screens/Otp";
import Camera from "./src/screens/Camera"; // Adjusted import paths
import FinancialReportScreen from "./src/screens/FinancialReportScreen";
import { useState, useEffect } from 'react'
import SMSAndroid from 'react-native-get-sms-android';
import BackgroundService from 'react-native-background-actions';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const { SMSReceiverModule } = NativeModules;
const smsEventEmitter = new NativeEventEmitter(SMSReceiverModule);

function BottomTabs() {
  const windowWidth = Dimensions.get("window").width;
  const widthPercentage = 90;
  const width = (windowWidth * widthPercentage) / 100;

  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { display: "flex" } }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={28} color="#1CAC78" />
            ) : (
              <AntDesign name="home" size={28} color="#1CAC78" />
            ),
        }}
      />

      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialIcons
                name="playlist-add-circle"
                size={35}
                color="#1CAC78"
              />
            ) : (
              <MaterialIcons name="playlist-add" size={35} color="#1CAC78" />
            ),
        }}
      />

      <Tab.Screen
        name="OCR"
        component={Upload}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarItemStyle: {
            backgroundColor: "#1CAC78",
            marginBottom: 10,
            marginTop: -25,
            borderRadius: 35,
            paddingTop: 10,
            shadowColor: "#000",
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 0.83,
            shadowRadius: 6,
            elevation: 6,
            position:"relative"
          },
          tabBarIcon: () => (
            <MaterialIcons name="control-camera" size={35} style={{position:"absolute",}} color="white" />
          ),
        }}
      />

      <Tab.Screen
        name="Resources"
        component={Resources}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome5 name="book" size={24} color="#1CAC78" />
            ) : (
              <Feather name="book" size={24} color="#1CAC78" />
            ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person-sharp" size={24} color="#1CAC78" />
            ) : (
              <View
                style={{
                  width: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="person-outline" size={24} color="#1CAC78" />
              </View>
            ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  // const [smsList, setSmsList] = useState([]);
  // const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  // const veryIntensiveTask = async (taskDataArguments) => {
  //   const { delay } = taskDataArguments;

  //   await new Promise(async (resolve) => {
  //     while (BackgroundService.isRunning()) {
  //       console.log('📩 Listening for incoming SMS...');
  //       // SMSAndroid.list(
  //       //   JSON.stringify({ box: 'inbox', maxCount: 1 }),  // Only fetch the latest SMS
  //       //   (fail) => console.error('Failed to fetch SMS:', fail),
  //       //   (count, smsList) => {
  //       //     const messages = JSON.parse(smsList);
  //       //     if (messages && messages.length > 0) {
  //       //       const latestMessage = messages[0];
  //       //       setSmsList((prevSmsList) => [latestMessage, ...prevSmsList]);
  //       //     }
  //       //   }
  //       // );

  //       await BackgroundService.updateNotification({
  //         taskDesc: '📡 Listening for SMS in background...'
  //       });

  //       await sleep(delay);  // Delay to reduce battery consumption
  //     }
  //   });
  // };

  // const options = {
  //   taskName: 'SMS Listener',
  //   taskTitle: 'SMS Listener Running',
  //   taskDesc: 'Listening for new SMS messages',
  //   taskIcon: {
  //     name: 'ic_launcher',
  //     type: 'mipmap',
  //   },
  //   color: '#841584',
  //   parameters: {
  //     delay: 5000, // 5 seconds delay for background checks
  //   },
  // };

  // async function getPermissions() {
  //   try {
  //     const granted = await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  //       PermissionsAndroid.PERMISSIONS.READ_SMS,
  //     ]);

  //     return (
  //       granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
  //       granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED
  //     );
  //   } catch (error) {
  //     console.error("Error requesting SMS permission:", error);
  //     return false;
  //   }
  // }

  // useEffect(() => {
  //   async function fetchSMS() {
  //     const hasPermission = await getPermissions();

  //     if (hasPermission) {
  //       SMSAndroid.list(
  //         JSON.stringify({ box: 'inbox', maxCount: 1 }),
  //         (fail) => console.error('Failed to fetch SMS:', fail),
  //         (count, smsList) => {
  //           const messages = JSON.parse(smsList);
  //           setSmsList(messages);
  //         }
  //       );
  //     }
  //   }

  //   const runBackgroundTask = async () => {
  //     await BackgroundService.start(veryIntensiveTask, options);
  //     await BackgroundService.updateNotification({
  //       taskDesc: '📡 Listening for SMS in background...'
  //     });
  //   };

  //   const stopBackgroundTask = async () => {
  //     await BackgroundService.stop();
  //   };

  //   const smsSubscription = smsEventEmitter.addListener('onNewSMS', (newSms) => {
  //     console.log("New SMS Received: ",newSms);
  //     setSmsList((prevSmsList) => [newSms, ...prevSmsList]);
  //   });
  //   console.log("UseEffect Executed");

  //   fetchSMS();

  //   stopBackgroundTask();
  //   runBackgroundTask();

  //   return () => {
  //     smsSubscription.remove();
  //   };
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartUpScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="FinancialReportScreen" component={FinancialReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;