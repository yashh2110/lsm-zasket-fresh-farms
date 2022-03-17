import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";
import CustomHeader from "../common/CustomHeader";
import TipCard from "../common/TipCard";
const QuickTips = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <CustomHeader
        navigation={navigation}
        title={"Quick Tips"}
        showSearch={false}
      />
      <View style={styles.container}>
        <TipCard
          image={require("../../assets/png/whatsappTip.png")}
          title="Whatsapp"
          body="Create whatsapp group with your referrals."
        />
        <TipCard
          image={require("../../assets/png/shareTip.png")}
          title="Share"
          body="Share Zasket Products and Offers daily with your friends in WhatsApp group to get maximum commission from referral."
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
});
export default QuickTips;
