import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";

// Import API Call and Token Storage
import saveToken from "../api/Token/SetToken";
import Otp from "../api/Otp";

const { width } = Dimensions.get("window");

const OtpVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { form } = route.params;
  const email = form.email;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Handle OTP input change
  const handleChange = (text, index) => {
    if (text.length > 1) text = text.charAt(text.length - 1);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to the next input field
    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle backspace key
  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length === 4) {
      console.log("OTP entered:", enteredOtp);

      try {
        const response = await Otp({ email, otp: enteredOtp }); // Pass correct OTP format
        const data = await response.json(); // Parse JSON response

        console.log("Backend Response:", data);

        if (response.ok) {
          await saveToken(data.token,data.userId); // Save token
          navigation.navigate("Main"); // Navigate on success
        } else {
          Alert.alert("Invalid OTP", data.message || "Please try again.");
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } else {
      Alert.alert("Invalid OTP", "Please enter a 4-digit OTP.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        We have sent a 4-digit OTP to{" "}
        <Text style={{ fontWeight: "bold" }}>{email}</Text>
      </Text>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
          />
        ))}
      </View>

      {/* Verify OTP Button */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
        <Text style={styles.verifyText}>Verify OTP</Text>
      </TouchableOpacity>

      {/* Not your email? */}
      <View style={styles.notYourEmail}>
        <Text>Not your email? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}>Go back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#018749",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.6,
    marginVertical: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#018749",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#F0F8FF",
  },
  verifyButton: {
    backgroundColor: "#018749",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  verifyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  notYourEmail: {
    flexDirection: "row",
    marginTop: 20,
  },
  signupText: {
    color: "#018749",
    fontWeight: "bold",
  },
});
