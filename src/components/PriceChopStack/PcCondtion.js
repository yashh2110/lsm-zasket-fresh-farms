import { View, Text } from "react-native";
import React from "react";

const PcCondtion = ({ condition }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 9,
      }}>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 6,
          marginTop: 6.5,
          marginHorizontal: 6,
          backgroundColor: "#005c74",
        }}></View>
      <Text style={{ fontSize: 14, textAlign: "left", letterSpacing: 0.5 }}>
        {condition}
      </Text>
    </View>
  );
};

export default PcCondtion;
