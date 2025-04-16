// import React from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";

// const TransactionModal = ({
//   visible,
//   onClose,
//   onSubmit,
//   Amount = "",
//   setAmount,
//   To = "",
//   setTo,
//   type = "",
//   setType,
//   category = "",
//   setCategory,
// }) => {
//   return (
//     <Modal
//       visible={visible}
//       onRequestClose={onClose}
//       animationType="slide"
//       transparent={true}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.title}>Enter Details</Text>

//           <TextInput
//             placeholder="Amount"
//             value={Amount}
//             onChangeText={setAmount}
//             style={styles.input}
//             keyboardType="numeric"
//           />

//           <TextInput
//             placeholder="To"
//             value={To}
//             onChangeText={setTo}
//             style={styles.input}
//           />

//           <Picker
//             selectedValue={type}
//             onValueChange={(itemValue) => setType(itemValue)}
//             style={styles.input}
//           >
//             <Picker.Item label="Select Type" value="" />
//             <Picker.Item label="Credit" value="credit" />
//             <Picker.Item label="Debit" value="debit" />
//           </Picker>

//           <Picker
//             selectedValue={category}
//             onValueChange={(itemValue) => setCategory(itemValue)}
//             style={styles.input}
//           >
//             <Picker.Item label="Select Category" value="" />
//             <Picker.Item label="Food" value="food" />
//             <Picker.Item label="Entertainment" value="entertainment" />
//             <Picker.Item label="Tour/Travel" value="tour/travel" />
//             <Picker.Item label="Fashion" value="fashion" />
//             <Picker.Item label="Academics" value="academics" />
//             <Picker.Item label="Others" value="others" />
//           </Picker>

//           <View style={styles.buttonContainer}>
//             <Button title="Cancel" onPress={onClose} color="red" />
//             <Button title="Submit" onPress={onSubmit} color="green" />
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default TransactionModal;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: "80%",
//     padding: 20,
//     backgroundColor: "white",
//     borderRadius: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
// });





import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Profile from '../api/profile'
import moment from 'moment';

const TransactionModal = ({ visible, onClose, onSubmit, Amount = "", setAmount, To = "", setTo, type = "", setType, category = "", setCategory, From = "", setFrom, isSelfCredit = false, setisSelfCredit, time, setTime, date, setDate }) => {
  const [typeOpen, setTypeOpen] = useState(false);
  const [isSelfCreditOpen, setIsSelfCreditOpen] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isSelfCreditValue, setIsSelfCreditValue] = useState(null);

  const typeItems = [
    { label: "Credit", value: "credit" },
    { label: "Debit", value: "debit" },
  ];

  const isSelfCreditItems = [
    { label: "Self", value: "self" },
    { label: "Others", value: "others" },
  ];

  const categoryItems = [
    { label: "Food", value: "food" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Tour/Travel", value: "tour/travel" },
    { label: "Fashion", value: "fashion" },
    { label: "Academics", value: "academics" },
    { label: "Others", value: "others" },
  ];

  // useEffect(() => {
  //   if (visible) {
  //     setType("");
  //     setisSelfCredit("");
  //     setTo("");
  //     setFrom("");
  //     setAmount("");
  //     setCategory("");
  //     setTypeOpen(false);
  //     setIsSelfCreditOpen(false);
  //     setCategoryOpen(false);
  //     setDate(moment().format("D MMMM YYYY"));
  //     setTime(moment().format("h:mm A"));

  //   }
  // }, [visible]);

  useEffect(() => {
    const getName = async () => {
      const response = await Profile();
      if (response.ok) {
        const data = await response.json();
        const fullName = data.firstName + " " + data.lastName;
        setFrom(fullName)

      }
    }
    if (isSelfCreditValue === "self") {
      setisSelfCredit(true);
      getName(); // Optional: also set From field automatically
    } else if (isSelfCreditValue === "others") {
      setisSelfCredit(false);
      setFrom(""); // clear the From field if needed
    }
  }, [isSelfCreditValue]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Text style={styles.title}>Enter Transaction Details</Text>

            {/* Transaction Type */}
            <DropDownPicker
              open={typeOpen}
              value={type}
              items={typeItems}
              setOpen={setTypeOpen}
              setValue={setType}
              setItems={() => { }}
              placeholder="Select Type"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownBox}
              zIndex={3000}
            />

            {/* Self/Others only if Credit */}
            {type === "credit" && (
              <DropDownPicker
                open={isSelfCreditOpen}
                value={isSelfCreditValue}
                items={[
                  { label: "Self", value: "self" },
                  { label: "Others", value: "others" },
                ]}
                setOpen={setIsSelfCreditOpen}
                setValue={setIsSelfCreditValue}
                setItems={() => { }}
                placeholder="Credit: Self or Others?"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownBox}
                zIndex={2500}
              />
            )}


            {/* To / From Fields */}
            {type === "credit" && !isSelfCredit && (
              <TextInput
                placeholder="From"
                value={From}
                onChangeText={setFrom}
                style={styles.input}
              />
            )}

            {type === "debit" && (
              <TextInput
                placeholder="To"
                value={To}
                onChangeText={setTo}
                style={styles.input}
              />
            )}

            {/* Amount */}
            {(type === "credit" || type === "debit") && (
              <TextInput
                placeholder="Amount"
                value={Amount}
                onChangeText={setAmount}
                style={styles.input}
                keyboardType="numeric"
              />
            )}

            {/* Category only for debit */}
            {(type === "debit" || type === "credit") && (
              <DropDownPicker
                open={categoryOpen}
                value={category}
                items={categoryItems}
                setOpen={setCategoryOpen}
                setValue={setCategory}
                setItems={() => { }}
                placeholder="Select Category"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownBox}
                zIndex={2000}
              />
            )}

            {(type === "credit" || type === "debit") && (
              <TextInput
                placeholder="Date (DD MMMM YYYY)"
                value={date}
                onChangeText={setDate}
                style={styles.input}
              />
            )}
            {(type === "credit" || type === "debit") && (
              <TextInput
                placeholder="Time (HH:MM AM)"
                value={time}
                onChangeText={setTime}
                style={styles.input}
              />
            )}


            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 10,
  },
  dropdownBox: {
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
