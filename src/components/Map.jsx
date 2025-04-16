// import { View, Text } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import React from 'react';

// const mapper = (transaction, styles) => {
//   return transaction.map((item, index) => (
//     <View key={index} style={styles.transactionItem}>
//       <View style={styles.transactionDetails}>
//         <View style={styles.iconContainer}>
//           <MaterialIcons name="trending-down" size={30} color="#E77A26" />
//         </View>
//         <View>
//           <Text style={styles.transactionTitle}>
//             {item.type === "debit" ? item.To : item.From}
//           </Text>
//           <Text style={styles.transactionDate}>{item.Date}</Text>
//         </View>
//       </View>
//       <Text style={styles.transactionAmount}>
//         {item.type === "debit" ? `-₹${item.Amount}` : `+₹${item.Amount}`}
//       </Text>
//     </View>
//   ));
// };

// export default mapper;




import { View, Text } from 'react-native';
import React from 'react';

const getMonthYear = (dateString) => {
  const [time, meridian, date, month, year] = dateString.split(" ");
  return `${year} ${month}`;
};

const groupTransactions = (transactions) => {
  const grouped = {};

  transactions.forEach((item) => {
    const groupKey = getMonthYear(item.Date);
    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(item);
  });

  return grouped;
};

const mapper = (transactions, styles) => {
  const grouped = groupTransactions(transactions);

  return Object.entries(grouped).map(([monthYear, items], index) => {
    const total = items.reduce((sum, item) => {
      const amount = parseFloat(item.Amount);
      return item.type === 'credit' ? (sum + amount) : (sum - amount);
    }, 0);

    return (
      <View key={index}>
        {/* Month Header */}
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>{monthYear}</Text>
          <Text
            style={[
              styles.monthTotal,
              { color: total >= 0 ? '#22C55E' : '#EF4444' }, // green if positive, red if negative
            ]}
          >
            {total >= 0 ? `+₹${total}` : `-₹${Math.abs(total)}`}
          </Text>
        </View>

        {/* Individual Transactions */}
        {items.map((item, idx) => {
          const isCredit = item.type === 'credit';
          const initial = (isCredit ? item.From : item.To)?.charAt(0) ?? '?';

          return (
            <View key={idx} style={styles.transactionItem}>
              <View style={styles.transactionDetails}>
                <View style={styles.circleAvatar}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <View>
                  <Text style={styles.transactionTitle}>
                    {isCredit ? item.From : item.To}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {item.Date}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: isCredit ? '#22C55E' : '#000' }, // green for credit, black for debit
                ]}
              >
                {isCredit ? `+₹${item.Amount}` : `-₹${item.Amount}`}
              </Text>
            </View>
          );
        })}
      </View>
    );
  });
};

export default mapper;