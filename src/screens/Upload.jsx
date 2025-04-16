import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, Platform, PermissionsAndroid } from "react-native";
import UploadImage from '../api/UploadImage';
import TransactionModal from "../components/TransactionModal";
import createTransaction from "../api/Transaction/PostTransaction";
import getAllTransactions from "../api/Transaction/AllTransactions";
import moment from "moment";

const Upload = () => {
  // const [image, setImage] = useState(null);
  const navigation = useNavigation();
  const [transaction, setTransaction] = useState([]);
  const [image, setImage] = useState(null);
  const [Amount, setAmount] = useState("");
  const [To, setTo] = useState("");
  const [From, setFrom] = useState("");
  const [category, setCategory] = useState("");
  const [isSelfCredit, setisSelfCredit] = useState(true);
  const [type, setType] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    await postTransaction();
    const formattedDate = time + " " + date;
    console.log(Amount, To, category, type, isSelfCredit, From, formattedDate);
    getTransaction(); // Fetch updated transactions

    setAmount("");
    setTo("");
    setCategory("");
    setType("");
    setFrom("");
    setisSelfCredit(true);
    setDate("");
    setTime("");
    onClose();

    navigation.navigate("Transaction");
  };

  const [isVisible, setIsVisible] = useState(false);
  const handleOpenModal = () => setIsVisible(true);
  const onClose = () => {
    setIsVisible(false);
    setAmount("");
    setTo("");
    setCategory("");
    setType("");
    setFrom("");
    setisSelfCredit(true);
    setDate("");
    setTime("");
  }

  const postTransaction = async () => {
    const inputString = time + " " + date;
    const response = await createTransaction({ Amount, To, category, type, From, isSelfCredit, inputString });
    if (response.ok) {
      const data = await response.json();
      console.log("Transaction created", data);
    } else {
      const errorData = await response.json();
      console.log("Response failed", errorData);
    }
  };

  const getTransaction = async () => {
    const response = await getAllTransactions();
    if (response.ok) {
      const data = await response.json();
      console.log("Transaction data", data);
      setTransaction(data);
    } else {
      const errorData = await response.json();
      console.log("Response failed", errorData);
    }
  };

  // Request permission for Android
  const requestGalleryPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, // Use READ_MEDIA_IMAGES for Android 13+
          {
            title: "Storage Permission Required",
            message: "This app needs access to your gallery to select photos.",
            buttonPositive: "OK",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Gallery permission granted");
          return true;
        } else {
          console.log("Gallery permission denied");
          return false;
        }
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    }
    return true; // iOS does not need this permission
  };

  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      console.log("Gallery permission denied");
      return;
    }

    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("Image Picker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        console.log("Selected Image:", response.assets[0]);
        // setImage(response.assets[0]);
        sendImage(response.assets[0]);
      }
    });

  };

  const sendImage = async (image) => {
    if (image) {
      try {
        const response = await UploadImage(image);
        if (response.ok) {
          const data = await response.json();
          console.log("OCR Data: ", data);

          // Set your form states here
          setType("debit"); // or derive from context
          setTo(data.supplier_name || "");
          setAmount(data.total_amount || "");
          setCategory(data.category || "");
          const time = data.time;
          const date = data.date;
          const time12hr = moment(time, 'HH:mm').format('h:mm A');
          const formattedDate = moment(date, 'YYYY-MM-DD').format('DD MMMM YYYY');

          setTime(time12hr);
          setDate(formattedDate);
          console.log("Time: ",time12hr);
          console.log("Date: ",formattedDate);

          // Open the transaction modal
          handleOpenModal();
        } else {
          const errorData = await response.json();
          console.log("Response failed", errorData);
        }
        // setImage(null)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("no inside imagee")
    }
  }

  return (
    <View style={styles.container}>
      {/* Upload Button */}
      <TouchableOpacity onPress={openGallery} style={styles.button}>
        <View style={styles.lottie}>
          <LottieView
            style={{ flex: 1 }}
            source={require("../assets/Images/upload.json")}
            autoPlay
            loop
          />
        </View>
        <Text style={styles.text}>Upload Photo</Text>
      </TouchableOpacity>

      <View>
        <TransactionModal
          visible={isVisible}
          onClose={onClose}
          onSubmit={handleSubmit}
          Amount={Amount}
          setAmount={setAmount}
          To={To}
          setTo={setTo}
          From={From}
          setFrom={setFrom}
          type={type}
          setType={setType}
          isSelfCredit={isSelfCredit}
          setisSelfCredit={setisSelfCredit}
          category={category}
          setCategory={setCategory}
          time={time}
          setTime={setTime}
          date={date}
          setDate={setDate}
        />
      </View>

      {/* Take Photo Button */}
      <TouchableOpacity onPress={() => navigation.navigate("Camera")} style={styles.button}>
        <View style={styles.lottie}>
          <LottieView
            style={{ flex: 1 }}
            source={require("../assets/Images/takePhoto.json")}
            autoPlay
            loop
          />
        </View>
        <Text style={styles.text}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
  },
  button: {
    display: "flex",
    paddingHorizontal: 40,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  text: {
    fontSize: 30,
    color: "#1CAC78",
    textAlign: "center",
    fontWeight: "bold",
  },
});
