// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
// import moment from 'moment';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import Share from 'react-native-share';
// import getTypeSum from '../api/ChartAPI/getTypeSum';
// import categorySorted from '../api/CategorySorted';
// import TopExpenses from '../api/ChartAPI/TopExpenses';
// import getMonthlyTransaction from '../api/ChartAPI/getMonthlyTransaction';
// import GetBudget from '../api/Budget/GetBudget';

// const FinancialReportScreen = () => {
//   const [expense, setExpense] = useState(0);
//   const [category, setCategory] = useState({});
//   const [topExpense, setTopExpense] = useState([]);
//   const [transaction, setTransaction] = useState([]);
//   const [netSaving, setNetSaving] = useState(0);
//   const [netSavingPercentage, setNetSavingPercentage] = useState(0);
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState(0);

//   const [food, setFood] = useState(0);
//   const [academics, setAcademics] = useState(0);
//   const [entertainment, setEntertainment] = useState(0);
//   const [fashion, setFashion] = useState(0);
//   const [tourTravel, setTourTravel] = useState(0);
//   const [totalBudget, setTotalBudget] = useState(0);

//   useEffect(() => {
//     const date = new Date();

//     const month = date.toLocaleString('default', { month: 'long' }); // e.g., "April"
//     setMonth(month);
//     const year = date.getFullYear(); // e.g., 2025
//     setYear(year);

//     const getData = async () => {
//       const res1 = await getTypeSum("debit");
//       setExpense(res1[month]);

//       const netSavings = (20000 - res1[month]);
//       setNetSaving(netSaving);
//       const netSavingsPercentage = (netSavings / financialData.budget) * 100;
//       setNetSavingPercentage(netSavingsPercentage);

//       const res2 = await categorySorted();
//       const res2updated = await res2.json();
//       setCategory(res2updated);

//       const res3 = await TopExpenses();
//       setTopExpense(res3);

//       const res4 = await getMonthlyTransaction(month, year);
//       setTransaction(res4);
//     }
//     getData();

//     const getBudget = async () => {
//       const res1 = await GetBudget();
//       const data = res1[0];
//       setAcademics(data.academics);
//       setEntertainment(data.entertainment);
//       setFashion(data.fashion);
//       setFood(data.food);
//       setTourTravel(data["tour/travel"]);
//       setTotalBudget(data.Budget);
//     }
//     getBudget();

//     const decidedAmounts = {
//       Food: food,
//       Academics: academics,
//       Entertainment: entertainment,
//       Fashion: fashion,
//       "Tour/Travel": tourTravel,
//     };
//   }, [])

//   const financialData = {
//     budget: 20000,
//     expenses: 3500,
//     savings: 1500,
//     savingsChange: "+8%",
//     highestCategory: "Rent",
//     expenseBreakdown: [
//       { label: "Food & Dining", amount: 500, emoji: "🥘", decidedAmount: 200 },
//       { label: "Rent/Mortgage", amount: 1200, emoji: "🏠", decidedAmount: 200 },
//       { label: "Utilities", amount: 300, emoji: "💡", decidedAmount: 200 },
//       { label: "Transportation", amount: 200, emoji: "🚗", decidedAmount: 200 },
//       { label: "Entertainment", amount: 400, emoji: "🎉", decidedAmount: 200 },
//       { label: "Others", amount: 900, emoji: "📌", decidedAmount: 200 },
//     ],
//   };



//   const generatePDF = async () => {
//     const htmlContent = `
//       <h1>Monthly Financial Report - ${month}, ${year}</h1>
//       <h2>📊 Summary Overview</h2>
//       <p>Total Budget: ₹${financialData.budget}</p>
//       <p>Total Expenses: ₹${expense}</p>
//       <p>Net Savings: ₹(${netSaving}) (${netSavingPercentage})</p>
//       <p>Highest Expense Category: ${topExpense.length > 0 ? topExpense[0].category : "N/A"}</p>

//       <h2>💰 Expense Breakdown by Category</h2>
//       <table border="1" cellspacing="0" cellpadding="8">
//         <thead>
//           <tr>
//             <th>Category</th>
//             <th>Amount Spent</th>
//             <th>Amount Decided</th>
//             <th>% of Total Expense</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${Object.entries(category)
//         .map(([key, amount]) => {
//           const percentage = ((amount / expense) * 100).toFixed(2);
//           return `
//                 <tr>
//                   <td>${key}</td>
//                   <td>₹${amount}</td>
//                   <td>₹100</td>
//                   <td>${percentage}%</td>
//                 </tr>`;
//         })
//         .join('')}
//         </tbody>
//       </table>

//       <h2>🏆 Top Expenses & Vendors</h2>
//       <ul>
//         ${topExpense
//         .map(
//           item =>
//             `<li><strong>${item.To}</strong> - ₹${item.Amount} (Vendor: ${item.category})</li>`
//         )
//         .join('')}
//       </ul>

//       <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
//         <thead>
//           <tr>
//             <th>Type</th>
//             <th>To/From</th>
//             <th>Date (Sorted Order)</th>
//             <th>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${transaction
//         .map(t => `
//               <tr>
//                 <td>${t.type}</td>
//                 <td>${t.type === 'credit' ? t.From : t.To}</td>
//                 <td>${t.Date}</td>
//                 <td>₹${t.Amount}</td>
//               </tr>
//             `)
//         .join('')}
//         </tbody>
//       </table>

//     `;

//     const options = {
//       html: htmlContent,
//       fileName: `Financial_Report_${moment().format("MMM_YYYY")}`,
//       directory: 'Documents',
//     };

//     try {
//       const file = await RNHTMLtoPDF.convert(options);
//       await Share.open({ url: `file://${file.filePath}` });
//     } catch (error) {
//       console.error("PDF generation error:", error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Monthly Financial Report - {month}, {year}</Text>

//       <View style={styles.section}>
//         <Text style={styles.subHeader}>📊 Summary Overview</Text>
//         <Text>Total Budget: ₹{financialData.budget}</Text>
//         <Text>Total Expenses: ₹{expense}</Text>
//         <Text>Net Savings: ₹{netSaving} ({netSavingPercentage})</Text>
//         <Text>Highest Expense Category: {topExpense.length > 0 ? topExpense[0].category : "N/A"}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.subHeader}>💰 Expense Breakdown by Category</Text>

//         <View style={styles.tableHeader}>
//           <Text style={styles.tableCellHeader}>Category</Text>
//           <Text style={styles.tableCellHeader}>Spent</Text>
//           <Text style={styles.tableCellHeader}>Decided</Text>
//           <Text style={styles.tableCellHeader}>%</Text>
//         </View>

//         {Object.entries(category).map(([key, amount], index) => {
//           // const decidedAmount = decidedAmounts[key] || 0;
//           const percentage = ((amount / expense) * 100).toFixed(2);

//           return (
//             <View key={index} style={styles.tableRow}>
//               <Text style={styles.tableCell}>{key}</Text>
//               <Text style={styles.tableCell}>₹{amount}</Text>
//               <Text style={styles.tableCell}>₹100</Text>
//               <Text style={styles.tableCell}>{percentage}%</Text>
//             </View>
//           );
//         })}

//       </View>

//       <View style={styles.section}>
//         <Text style={styles.subHeader}>🏆 Top 5 Expenses</Text>
//         {topExpense.map((item, index) => (
//           <View key={index} style={styles.expenseRow}>
//             <Text style={styles.expenseItem}>
//               {index + 1}. {item.To} - ₹{item.Amount}
//             </Text>
//             <Text style={styles.expenseVendor}>Category: {item.category}</Text>
//           </View>
//         ))}
//       </View>

//       <View style={{ marginVertical: 20, padding: 10, borderWidth: 1, borderColor: '#000' }}>
//         <Text style={styles.subHeader}>List of Transactions</Text>
//         {/* Header Row */}
//         <View style={{ flexDirection: 'row', borderBottomWidth: 1, padding: 6, backgroundColor: '#f0f0f0' }}>
//           <Text style={{ flex: 1, fontWeight: 'bold' }}>Type</Text>
//           <Text style={{ flex: 1, fontWeight: 'bold' }}>To/From</Text>
//           <Text style={{ flex: 1, fontWeight: 'bold' }}>Date</Text>
//           <Text style={{ flex: 1, fontWeight: 'bold' }}>Amount</Text>
//         </View>

//         {/* Dynamic Rows */}
//         {transaction.map((item, index) => (
//           <View key={index} style={{ flexDirection: 'row', padding: 6, borderBottomWidth: 0.5 }}>
//             <Text style={{ flex: 1 }}>{item.type}</Text>
//             {item.type === 'credit' && <Text style={{ flex: 1 }}>{item.From}</Text>}
//             {item.type === 'debit' && <Text style={{ flex: 1 }}>{item.To}</Text>}
//             <Text style={{ flex: 1 }}>{item.Date}</Text>
//             <Text style={{ flex: 1 }}>₹{item.Amount}</Text>
//           </View>
//         ))}
//       </View>

//       <Button title="Download PDF" onPress={generatePDF} />
//     </ScrollView>
//   );
// };

// export default FinancialReportScreen;

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#fff',
//     flexGrow: 1,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   subHeader: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     paddingVertical: 8,
//     backgroundColor: '#f0f0f0',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 6,
//     borderBottomWidth: 0.5,
//     borderColor: '#ddd',
//   },
//   tableCellHeader: {
//     flex: 1,
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 14,
//   },
//   expenseRow: {
//     marginBottom: 10,
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     elevation: 1,
//   },
//   expenseItem: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   expenseVendor: {
//     fontSize: 14,
//     color: '#666',
//   },
// });


import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import getTypeSum from '../api/ChartAPI/getTypeSum';
import categorySorted from '../api/CategorySorted';
import TopExpenses from '../api/ChartAPI/TopExpenses';
import getMonthlyTransaction from '../api/ChartAPI/getMonthlyTransaction';
import GetBudget from '../api/Budget/GetBudget';

const FinancialReportScreen = () => {
  const [expense, setExpense] = useState(0);
  const [category, setCategory] = useState({});
  const [topExpense, setTopExpense] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [netSaving, setNetSaving] = useState(0);
  const [netSavingPercentage, setNetSavingPercentage] = useState(0);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(0);

  const [food, setFood] = useState(0);
  const [academics, setAcademics] = useState(0);
  const [entertainment, setEntertainment] = useState(0);
  const [fashion, setFashion] = useState(0);
  const [tourTravel, setTourTravel] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    setMonth(month);
    const year = date.getFullYear();
    setYear(year);

    const getData = async () => {
      const res1 = await getTypeSum("debit");
      setExpense(res1[month]);

      const res2 = await categorySorted();
      const res2updated = await res2.json();
      setCategory(res2updated);

      const res3 = await TopExpenses();
      setTopExpense(res3);

      const res4 = await getMonthlyTransaction(month, year);
      setTransaction(res4);
    };
    getData();

    const getBudget = async () => {
      const res1 = await GetBudget();
      const data = res1[0];
      setAcademics(data.academics);
      setEntertainment(data.entertainment);
      setFashion(data.fashion);
      setFood(data.food);
      setTourTravel(data["tour/travel"]);
      setTotalBudget(data.Budget);
    };
    getBudget();
  }, []);

  useEffect(() => {
    const netSavings = totalBudget - expense;
    setNetSaving(netSavings);
    const netSavingsPercentage = totalBudget ? ((netSavings / totalBudget) * 100).toFixed(2) : 0;
    setNetSavingPercentage(netSavingsPercentage);
  }, [totalBudget, expense]);

  const generatePDF = async () => {
    const htmlContent = `
      <h1>Monthly Financial Report - ${month}, ${year}</h1>
      <h2>📊 Summary Overview</h2>
      <p>Total Budget: ₹${totalBudget}</p>
      <p>Total Expenses: ₹${expense}</p>
      <p>Net Savings: ₹${netSaving} (${netSavingPercentage}%)</p>
      <p>Highest Expense Category: ${topExpense.length > 0 ? topExpense[0].category : "N/A"}</p>

      <h2>💰 Expense Breakdown by Category</h2>
      <table border="1" cellspacing="0" cellpadding="8">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount Spent</th>
            <th>% of Total Expense</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(category)
            .map(([key, amount]) => {
              const percentage = ((amount / expense) * 100).toFixed(2);
              return `
                <tr>
                  <td>${key}</td>
                  <td>₹${amount}</td>
                  <td>${percentage}%</td>
                </tr>`;
            })
            .join('')}
        </tbody>
      </table>

      <h2>🏆 Top Expenses & Vendors</h2>
      <ul>
        ${topExpense
          .map(item =>
            `<li><strong>${item.To}</strong> - ₹${item.Amount} (Vendor: ${item.category})</li>`
          )
          .join('')}
      </ul>

      <h2>📄 List of Transactions</h2>
      <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Type</th>
            <th>To/From</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${transaction
            .map(t => `
              <tr>
                <td>${t.type}</td>
                <td>${t.type === 'credit' ? t.From : t.To}</td>
                <td>${t.Date}</td>
                <td>₹${t.Amount}</td>
              </tr>`)
            .join('')}
        </tbody>
      </table>
    `;

    const options = {
      html: htmlContent,
      fileName: `Financial_Report_${moment().format("MMM_YYYY")}`,
      directory: 'Documents',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      await Share.open({ url: `file://${file.filePath}` });
    } catch (error) {
      console.error("PDF generation error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Monthly Financial Report - {month}, {year}</Text>

      <View style={styles.section}>
        <Text style={styles.subHeader}>📊 Summary Overview</Text>
        <Text>Total Budget: ₹{totalBudget}</Text>
        <Text>Total Expenses: ₹{expense}</Text>
        <Text>Net Savings: ₹{netSaving} ({netSavingPercentage}%)</Text>
        <Text>Highest Expense Category: {topExpense.length > 0 ? topExpense[0].category : "N/A"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>💰 Expense Breakdown by Category</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.tableCellHeader}>Category</Text>
          <Text style={styles.tableCellHeader}>Spent</Text>
          <Text style={styles.tableCellHeader}>%</Text>
        </View>

        {Object.entries(category).map(([key, amount], index) => {
          const percentage = ((amount / expense) * 100).toFixed(2);

          return (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{key}</Text>
              <Text style={styles.tableCell}>₹{amount}</Text>
              <Text style={styles.tableCell}>{percentage}%</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>🏆 Top 5 Expenses</Text>
        {topExpense.map((item, index) => (
          <View key={index} style={styles.expenseRow}>
            <Text style={styles.expenseItem}>
              {index + 1}. {item.To} - ₹{item.Amount}
            </Text>
            <Text style={styles.expenseVendor}>Category: {item.category}</Text>
          </View>
        ))}
      </View>

      <View style={styles.transactionContainer}>
        <Text style={styles.subHeader}>📄 List of Transactions</Text>

        {/* Header Row */}
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionCellHeader}>Type</Text>
          <Text style={styles.transactionCellHeader}>To/From</Text>
          <Text style={styles.transactionCellHeader}>Date</Text>
          <Text style={styles.transactionCellHeader}>Amount</Text>
        </View>

        {/* Dynamic Rows */}
        {transaction.map((item, index) => (
          <View key={index} style={styles.transactionRow}>
            <Text style={styles.transactionCell}>{item.type}</Text>
            <Text style={styles.transactionCell}>
              {item.type === 'credit' ? item.From : item.To}
            </Text>
            <Text style={styles.transactionCell}>{item.Date}</Text>
            <Text style={styles.transactionCell}>₹{item.Amount}</Text>
          </View>
        ))}
      </View>

      <Button title="Download PDF" onPress={generatePDF} />
    </ScrollView>
  );
};

export default FinancialReportScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
  },
  tableCellHeader: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
  },
  expenseRow: {
    marginVertical: 5,
  },
  expenseItem: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseVendor: {
    fontSize: 14,
    color: 'gray',
  },
  transactionContainer: {
    marginVertical: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
  },
  transactionRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
  },
  transactionCellHeader: {
    flex: 1,
    fontWeight: 'bold',
  },
  transactionCell: {
    flex: 1,
  },
});
