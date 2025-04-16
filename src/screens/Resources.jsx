import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

const Resources = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "#018749", flex: 1 }}>
      <View>
        <Text style={styles.h1}>Welcome to,</Text>
        <Text style={styles.h2}>Budget Resources</Text>
      </View>

      <ScrollView>
        <View style={styles.section2}>
          <Text style={styles.sectionTitle}>Courses for you</Text>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.rowdiv}>
              {/* Course 1 */}
              <View style={[styles.section21, { backgroundColor: "#bb0160" }]}>
                <Text style={styles.metadata}>Monthly saving strategy</Text>
                <Image
                  source={require("../assets/Images/Analysis.gif")}
                  style={styles.image}
                />
              </View>

              {/* Course 2 */}
              <View style={[styles.section21, { backgroundColor: "#124ac4" }]}>
                <Text style={styles.metadata}>Business strategy</Text>
                <Image
                  source={require("../assets/Images/Analysis.gif")}
                  style={styles.image}
                />
              </View>

              {/* Course 3 */}
              <View style={[styles.section21, { backgroundColor: "#f9d48a" }]}>
                <Text style={styles.metadata}>Business strategy</Text>
                <Image
                  source={require("../assets/Images/Analysis.gif")}
                  style={styles.image}
                />
              </View>

              {/* Course 4 */}
              <View style={[styles.section21, { backgroundColor: "#f2808d" }]}>
                <Text style={styles.metadata}>Business strategy</Text>
                <Image
                  source={require("../assets/Images/Analysis.gif")}
                  style={styles.image}
                />
              </View>
            </View>
          </ScrollView>

          {/* Courses by Category */}
          <Text style={styles.sectionTitle}>Courses by Category</Text>
          <View style={styles.iconContainer}>
            {/* Budget */}
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="account-balance-wallet" size={40} color="#335fa5" />
              <Text style={[styles.iconLabel, { color: "#335fa5" }]}>
                Budget
              </Text>
            </TouchableOpacity>

            {/* Investment */}
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="trending-up" size={40} color="#ec7c34" />
              <Text style={[styles.iconLabel, { color: "#ec7c34" }]}>
                Investment
              </Text>
            </TouchableOpacity>

            {/* Insurance */}
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="security" size={40} color="#0c2c44" />
              <Text style={[styles.iconLabel, { color: "#0c2c44" }]}>
                Insurance
              </Text>
            </TouchableOpacity>

            {/* Taxes */}
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="attach-money" size={40} color="#e91a10" />
              <Text style={[styles.iconLabel, { color: "#e91a10" }]}>
                Taxes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Resources;

const styles = StyleSheet.create({
  h1: {
    paddingTop: 10,
    marginLeft: "5%",
    marginTop: 40,
    fontSize: 35,
    fontWeight: "300",
    color: "#ffffff",
    fontFamily: "serif",
  },
  h2: {
    color: "#ffffff",
    marginLeft: "5%",
    marginTop: 5,
    fontSize: 35,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  section2: {
    backgroundColor: "#fefefe",
    width: "100%",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: 60,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#018749",
    marginTop: 20,
    marginLeft: 20,
  },
  section21: {
    height: 280,
    width: 200,
    borderRadius: 20,
    marginTop: 20,
    marginLeft: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowdiv: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metadata: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fdfdfd",
    padding: 10,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 180,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  iconButton: {
    alignItems: "center",
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 14,
  },
});
