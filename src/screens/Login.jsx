import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";

// Import API Calls
import login from "../api/Login";
import saveToken from "../api/Token/SetToken";

const { width } = Dimensions.get("window");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // Navigate to Signup
  const gotoSignup = () => {
    navigation.navigate("Signup");
  };

  // Handle Login
  const handleLogin = async () => {
    try {
      console.log(email,password);
      const response = await login({ email, password });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful", "Welcome back", data);

        await saveToken(data.token,data.userId);
        navigation.navigate("Main");
      } else {
        const errorData = await response.json();
        Alert.alert("Login Failed", errorData.message || "An error occurred");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Login</Text>
      </View>

      {/* Lottie Animation */}
      <View style={styles.lottie}>
        <LottieView
          style={styles.animation}
          source={require("../assets/Images/Login.json")}
          autoPlay
          loop
        />
      </View>

      {/* Login Form */}
      <View style={styles.form}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          style={styles.input}
        />

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Sign Up Redirect */}
        <View style={styles.signupRedirect}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={gotoSignup}>
            <Text style={styles.signupText}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingTop: 50,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#018749",
  },
  lottie: {
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: width * 0.8,
    height: width * 0.8,
  },
  form: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  input: {
    backgroundColor: "#F0F8FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#018749",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  signupRedirect: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#018749",
    marginLeft: 5,
  },
});
