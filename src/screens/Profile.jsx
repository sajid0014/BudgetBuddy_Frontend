import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import categorySorted from '../api/CategorySorted';
import UserGreeting from '../components/Name';
import BudgetModal from '../components/BudgetModal';
import SetBudget from '../api/Budget/SetBudget';
import { useNavigation } from '@react-navigation/native';
import GetBudget from '../api/Budget/GetBudget';

const screenWidth = Dimensions.get('window').width;

const Profile = () => {
  const [pieChart, setPieChart] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getPieChart = async () => {
      const response = await categorySorted();
      if (response.ok) {
        const res = await response.json();
        console.log('PieChart Data: ', res);
        setPieChart(res);
      } else {
        const errorData = await response.json();
        console.log('Error occurred');
        console.log(errorData);
      }
      const data = await GetBudget();
      console.log(data);

    };
    getPieChart();
  }, []);

  const handleApply = async (values) => {
    console.log('Applied values:', values);
    const Budget = values.Budget;
    const Food = values.Food;
    const Entertainment = values.Entertainment;
    const TourTravels = values.TourTravels;
    const Fashion = values.Fashion;
    const Academics = values.Academic;
    try{
      const response = await SetBudget({Budget,Food,Entertainment,TourTravels,Fashion,Academics});
      console.log("Budget Setting Response: ",response.json());
    }
    catch(error){
      console.log("Error Occured while setting Budget: ",error);
    }
    setModalVisible(false);
  };

  const data = [
    {
      name: 'Academics',
      amount: pieChart.academics || 0,
      color: '#3498db',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Entertainment',
      amount: pieChart.entertainment || 0,
      color: '#2ecc71',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Fashion',
      amount: pieChart.fashion || 0,
      color: '#e74c3c',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Food',
      amount: pieChart.food || 0,
      color: '#ecff33',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Travel',
      amount: pieChart.travel || 0,
      color: '#33ffd4',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Others',
      amount: pieChart.others || 0,
      color: '#33ff7a',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={styles.Screen}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={styles.header}>
            <UserGreeting styles={styles} />
            <Text style={styles.tagline}>
              Take charge of your financial health
            </Text>
          </View>

          <View style={styles.buttoncontainer}>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>Update Budget</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttoncontainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("FinancialReportScreen")}>
              <Text style={styles.buttonText}>Generate Report</Text>
            </TouchableOpacity>
          </View>

          <View>
            <BudgetModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onApply={handleApply}
            />
          </View>

          {/* Budget Overview */}
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Budget Overview</Text>
            <PieChart
              data={data}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={'amount'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              absolute
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  Screen: { backgroundColor: 'white', flex: 1 },
  header: {
    backgroundColor: '#018749',
    padding: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingLeft: 20,
    marginBottom: 10
  },
  greet: { fontSize: 30, fontWeight: 'bold', color: 'white' },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  tagline: { color: '#d3d3d3', fontSize: 16, marginTop: 5 },
  section: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  goalCard: {
    backgroundColor: '#f3f3f3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  transactionInfo: { flexDirection: 'row', alignItems: 'center' },
  transactionTo: { fontSize: 18, fontWeight: 'bold' },
  transactionAmount: { fontSize: 18, fontWeight: 'bold', color: '#FF5733' },
  buttoncontainer: {
    paddingHorizontal: 16,
    paddingVertical: 7
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'flex-start', // Align text to left
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
  },
});