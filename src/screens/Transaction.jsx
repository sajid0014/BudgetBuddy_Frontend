import Ionicons from "react-native-vector-icons/Ionicons";
import mapper from "../components/Map";
import { React, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import TransactionModal from "../components/TransactionModal";
import { BarChart } from "react-native-chart-kit";

import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import getAllTransactions from "../api/Transaction/AllTransactions";
import createTransaction from "../api/Transaction/PostTransaction";
import DropDownPicker from 'react-native-dropdown-picker';
import YearlySpending from "../api/ChartAPI/YearlySpending";
import getTypeSum from '../api/ChartAPI/getTypeSum'
import getCategorySum from "../api/ChartAPI/getCategorySum";
import getTypeTransaction from "../api/ChartAPI/getTypeTransaction";
import getCategoryTransaction from "../api/ChartAPI/getCategoryTransaction";
import moment from "moment";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Transaction = () => {
  const [Amount, setAmount] = useState("");
  const [To, setTo] = useState("");
  const [From, setFrom] = useState("");
  const [category, setCategory] = useState("");
  const [isSelfCredit, setisSelfCredit] = useState(true);
  const [transaction, setTransaction] = useState([]);
  const [type, setType] = useState("");
  const [time, setTime] = useState(moment().format("h:mm A"));
  const [date, setDate] = useState(moment().format("D MMMM YYYY"));
  const [barData, setBarData] = useState([]);
  const [monthlySpending, setmonthlySpending] = useState({});
  const CHUNK_SIZE = 6;
  const [startIndex, setStartIndex] = useState(0);
  const [paginatedData, setPaginatedData] = useState(null);

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

  const [filterTypeOpen, setFilterTypeOpen] = useState(false);
  const [filterOptionOpen, setFilterOptionOpen] = useState(false);

  const [filterType, setFilterType] = useState(null); // 'type' or 'category'
  const [filterOption, setFilterOption] = useState(null);

  const [filterTypeItems, setFilterTypeItems] = useState([
    { label: 'Clear Filter', value: 'clear' },
    { label: 'Type', value: 'type' },
    { label: 'Category', value: 'category' },
  ]);

  const typeOptions = [
    { label: 'All', value: 'all' },
    { label: 'Credit', value: 'credit' },
    { label: 'Debit', value: 'debit' },
  ];

  const categoryOptions = [
    { label: 'All', value: '' },
    { label: 'Food', value: 'food' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Tour/Travel', value: 'tour/travel' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Academics', value: 'academics' },
    { label: 'Others', value: 'others' },
  ];

  const getOptions = () => {
    if (filterType === 'type') return typeOptions;
    if (filterType === 'category') return categoryOptions;
    return [];
  };

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

  const getYearlySpending = async () => {
    const response = await YearlySpending();
    if (response.ok) {
      const data = await response.json();
      console.log("Yearly Spending", data);
      setmonthlySpending(data);
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

  useEffect(() => {
    getYearlySpending();
    getTransaction();
  }, []);

  useEffect(() => {
    if (Object.keys(monthlySpending).length > 0) {
      const labels = Object.keys(monthlySpending);
      const values = Object.values(monthlySpending);

      const paginatedLabels = labels.slice(startIndex, startIndex + CHUNK_SIZE);
      const paginatedValues = values.slice(startIndex, startIndex + CHUNK_SIZE);

      setPaginatedData({
        labels: paginatedLabels,
        datasets: [{ data: paginatedValues }],
      });

      setBarData({ labels, datasets: [{ data: values }] }); // Full chart data (optional)
    }
  }, [monthlySpending, startIndex]);

  useEffect(() => {
    console.log("Filter Option:", filterOption);
    const fetchDetails = async () => {
      if (filterType == 'type') {
        const res1 = await getTypeSum(filterOption);
        const res2 = await getTypeTransaction(filterOption);
        setmonthlySpending(res1);
        setTransaction(res2);
      }
      else if (filterType == 'category') {
        const res1 = await getCategorySum(filterOption);
        const res2 = await getCategoryTransaction(filterOption);
        setmonthlySpending(res1);
        setTransaction(res2);
      }
    }
    fetchDetails();
  }, [filterOption])

  const toggleChartData = () => {
    const totalLength = Object.keys(monthlySpending).length;
    if (startIndex + CHUNK_SIZE < totalLength) {
      setStartIndex(startIndex + CHUNK_SIZE);
    } else {
      setStartIndex(0); // loop back to start
    }
  };

  const shouldPaginate = Object.keys(monthlySpending).length > CHUNK_SIZE;
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Statistics</Text>
        <TouchableOpacity onPress={handleOpenModal}>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
            <Ionicons name="add-sharp" size={24} color="white" />
          </View>
        </TouchableOpacity>

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

      <View style={styles.filterRow}>
        <View style={styles.filterWrapper}>
          <DropDownPicker
            open={filterTypeOpen}
            value={filterType}
            items={filterTypeItems}
            setOpen={setFilterTypeOpen}
            setValue={setFilterType}
            setItems={setFilterTypeItems}
            placeholder="Filter by..."
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
            zIndexInverse={1000}
          />
        </View>

        {filterType !== "clear" && (
          <View style={styles.filterWrapper}>
            <DropDownPicker
              open={filterOptionOpen}
              value={filterOption}
              items={getOptions()}
              setOpen={setFilterOptionOpen}
              setValue={setFilterOption}
              setItems={() => { }}
              placeholder={`Select ${filterType === 'type' ? 'Type' : 'Category'}`}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>
        )}
      </View>

      <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
        <Text style={{ fontWeight: "700", fontSize: 20, marginBottom: 10 }}>
          Yearly Spending Overview
        </Text>

        {barData && barData.labels && barData.datasets && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BarChart
              data={paginatedData}
              width={340}
              height={260}
              yAxisLabel="₹"
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              }}
              style={{ borderRadius: 16 }}
              showValuesOnTopOfBars
            />

            {/* Show button only if more than 6 labels exist */}
            {shouldPaginate && (
              <View style={{
                marginLeft: "0", backgroundColor: "rgba(107, 114, 128, 0.2)", width: 35,
                height: 35,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}>
                {/* <Button
                  title={startIndex === 0 ? "Next" : "Previous"}
                  onPress={toggleChartData}
                /> */}
                <TouchableOpacity onPress={toggleChartData}>
                  {
                    startIndex === 0 ? (<MaterialIcons name="arrow-right" size={30} color="rgba(37, 99, 235,1)" />) :
                      (<MaterialIcons name="arrow-left" size={30} color="rgba(37, 99, 235,1)" />)
                  }


                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>


      {/* Transactions List */}
      <View style={{ flex: 1 }}>
        <Text style={styles.transactionsHeader}>All Transactions</Text>

        <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {transaction.length === 0 ? (
            <View style={styles.noTransaction}>
              <Text style={styles.noTransactionText}>No transactions to display</Text>
            </View>
          ) : (
            mapper(transaction, styles)
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 25,
    fontFamily: "serif",
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1CAC78",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 20,
    fontFamily: "serif",
    fontWeight: "bold",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  transactionsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: "8%",
    fontFamily: "serif",
    marginTop: 0,
  },
  // transactionItem: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   paddingHorizontal: 20,
  //   marginTop: 15,
  // },
  // transactionTo: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   color: "#3F3844",
  // },
  // transactionDate: {
  //   color: "#848884",
  // },
  // transactionAmount: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   color: "#FF5733",
  // },


  //Below is updated style that was working correctly
  // transactionItem: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 20,
  //   marginTop: 15,
  //   marginHorizontal: 5,
  //   padding: 2,
  //   paddingTop: 4,
  //   borderRadius: 2,
  // },
  // transactionDetails: {
  //   flexDirection: 'row',
  // },
  // iconContainer: {
  //   backgroundColor: '#FDF4E1',
  //   padding: 7,
  //   borderRadius: 3,
  //   marginRight: 10,
  //   height: 45
  // },
  // transactionTitle: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: '#3F3844',
  //   width: "180",
  //   fontFamily: 'serif',
  // },
  // transactionDate: {
  //   color: '#848884',
  //   fontFamily: 'serif',
  // },
  // transactionAmount: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: '#FF5733',
  //   fontFamily: 'serif',
  // },

  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },

  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB', // light gray
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  transactionDate: {
    fontSize: 13,
    color: '#6B7280',
  },

  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
  },

  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  monthTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22C55E',
  },


  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    zIndex: 999,
  },
  
  filterWrapper: {
    flex: 1,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 5,
  },
  noTransaction: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  noTransactionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5733',
    fontFamily: 'serif',
  },
});