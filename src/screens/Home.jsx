import mapper from '../components/Map';
import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import getRecentTransaction from '../api/Transaction/RecentTransaction';
import UserGreeting from '../components/Name';
import GetBudget from '../api/Budget/GetBudget';

const screenWidth = Dimensions.get('window').width;

const Home = () => {
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState(0);
  const [academics, setAcademics] = useState(0);
  const [entertainment, setEntertainment] = useState(0);
  const [fashion, setFashion] = useState(0);
  const [tourTravel, setTourTravel] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  const filteredData = [
    {
      name: 'Food',
      amount: food,
      color: '#3498db',
    },
    {
      name: 'Academics',
      amount: academics,
      color: '#9b59b6',
    },
    {
      name: 'Entertainment',
      amount: entertainment,
      color: '#e74c3c',
    },
    {
      name: 'Tour and Travels',
      amount: tourTravel,
      color: '#f1c40f',
    },
    {
      name: 'Fashion',
      amount: fashion,
      color: '#1abc9c',
    },
  ].filter(item => item.amount > 0); // Removes zero-value items

  const data = filteredData.map(item => ({
    ...item,
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getRecentTransaction();
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransaction(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    const getBudget = async () => {
      const res1 = await GetBudget();
      const data = res1[0];
      setAcademics(data.academics);
      setEntertainment(data.entertainment);
      setFashion(data.fashion);
      setFood(data.food);
      setTourTravel(data["tour/travel"]);
      setTotalBudget(data.Budget);
    }
    getBudget();

    const interval = setInterval(fetchTransactions, 5000);
    const secondInterval = setInterval(getBudget, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(secondInterval);
    }

  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.greet}>Welcome!!</Text>
        <UserGreeting styles={styles} />
      </View>

      {/* Horizontal ScrollView */}
      <View style={styles.chart}>
        <View style={styles.incomeDetails}>
          <Text style={styles.cardTitle}>Budget Overview</Text>
          <Text style={styles.cardTitle}>Total Budget: ₹{totalBudget}</Text>
          {totalBudget > 0 && filteredData.map(item => {
            const percent = ((item.amount / totalBudget) * 100).toFixed(1);
            return (
              <Text key={item.name} style={styles.percentage}>
                {item.name}: ₹{item.amount} ({percent}%)
              </Text>
            );
          })}
        </View>

        <PieChart
          style={styles.graph}
          data={data}
          width={screenWidth - 73}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={'amount'}
          backgroundColor={'transparent'}
          paddingLeft={'0'}
          absolute
        />
      </View>

      {/* Recent Transactions Section */}
      <View style={{ flex: 1 }}>
        <Text style={styles.head}>Recent Transactions</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {transaction.length === 0 ? (
            <View style={styles.noTransaction}>
              <Text style={styles.noTransactionText}>
                No transactions to display
              </Text>
            </View>
          ) : (
            mapper(transaction, styles)
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    height: 250,
    backgroundColor: '#018749',
    width: '100%',
    borderRadius: 20,
    borderTopEndRadius: 0,
    borderTopLeftRadius: 0,
    position: 'absolute',
  },
  greet: {
    paddingTop: 10,
    marginLeft: '5%',
    marginTop: 40,
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'serif',
  },
  name: {
    padding: 10,
    marginLeft: '3%',
    fontSize: 20,
    color: 'white',
    fontFamily: 'serif',
  },
  chart: {
    marginTop: 180,
    width: screenWidth - 20,
    height: 200,
    marginLeft: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    marginLeft: 12,
    marginTop: 10,
    fontFamily: 'serif',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F25D07',
    marginBottom: 10,
    marginLeft: 12,
  },
  percentage: {
    fontSize: 14,
    color: '#999',
    marginLeft: 12,
    fontFamily: 'serif',
  },
  incomeDetails: {
    // flex: 1,
    paddingRight: 0,
  },
  head: {
    fontSize: 20,
    marginLeft: '4%',
    fontWeight: 'bold',
    fontFamily: 'serif',
    paddingTop: 20,
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
  // },
  // transactionTitle: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: '#3F3844',
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

});