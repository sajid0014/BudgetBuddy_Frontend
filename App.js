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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
          // tabBarItemStyle: {
          //   backgroundColor: "#1CAC78",
          //   // marginBottom: 10,
          //   // marginTop: -25,
          //   // borderRadius: 35,
          //   // paddingTop: 10,
          //   // shadowColor: "#000",
          //   // shadowOffset: { width: 6, height: 6 },
          //   // shadowOpacity: 0.83,
          //   // shadowRadius: 6,
          //   // elevation: 6,
          //   // position:"relative"
          // },
          tabBarIcon: () => (
            <MaterialIcons name="control-camera" size={35} style={{position:"absolute",}} color="#1CAC78" />
          ),
        }}
      />

      {/* <Tab.Screen
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
      /> */}

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