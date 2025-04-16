import React, { useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import getToken from '../api/Token/GetToken';

const StartUpScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();

      if (token) {
        // You can decode token if it contains user email, or fetch user info if needed
        Alert.alert(
          'Continue',
          'Continue as logged in user?',
          [
            {
              text: 'No',
              onPress: () => navigation.replace('Login'), // Replace so user can't go back
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => navigation.replace('Main'),
            },
          ],
          { cancelable: false }
        );
      } else {
        navigation.replace('Login');
      }
    };

    checkToken();
  }, [ ]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#018749" />
      <Text style={{ marginTop: 10 }}>Checking authentication...</Text>
    </View>
  );
};

export default StartUpScreen;