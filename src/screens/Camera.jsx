import React, { useState } from "react";
import { View, Button, Image, Text, PermissionsAndroid, Platform } from "react-native";
import { launchCamera } from "react-native-image-picker";
import UploadImage from "../api/UploadImage";
import TransactionModal from "../components/TransactionModal";
import moment from 'moment';

export default function CameraScreen() {
  const [image, setImage] = useState(null);
  const [transaction, setTransaction] = useState([]);
  const [Amount, setAmount] = useState("");
  const [To, setTo] = useState("");
  const [From, setFrom] = useState("");
  const [category, setCategory] = useState("");
  const [isSelfCredit, setisSelfCredit] = useState(true);
  const [type, setType] = useState("");
  const [time, setTime] = useState(moment().format("h:mm A"));
  const [date, setDate] = useState(moment().format("D MMMM YYYY"));

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
  
  // Request camera permissions (Android only)
  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "This app needs access to your camera to take photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Deny",
            buttonPositive: "Allow",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS automatically asks for permission
  };

  // Open the camera
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      alert("Camera permission denied.");
      return;
    }

    const options = {
      mediaType: "photo",
      quality: 1,
      saveToPhotos: true, // Saves the image to the gallery
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled camera");
      } else if (response.error) {
        console.log("Camera Error: ", response.error);
      } else {
        // setImage(response.assets[0]); // Save the image URI
        console.log("Captured Image URI: ", response.assets[0].uri);
        sendImage(response.assets[0]);
        setImage(response.assets[0]);
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
          console.log("Time: ", time12hr);
          console.log("Date: ", formattedDate);
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Open Camera" onPress={openCamera} />
      {image ? (
        <View>
          <Image
            source={{ uri: image.uri }}
            style={{ width: 200, height: 200, marginTop: 20 }}
          />
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
        </View>
      ) : (
        <Text style={{ marginTop: 20 }}>No image selected</Text>
      )}
    </View>
  );
}
