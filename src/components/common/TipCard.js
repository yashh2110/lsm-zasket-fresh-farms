import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
const { width, height } = Dimensions.get("screen");

const TipCard = ({ image, title, body }) => {
  return (
    <View style={styles.card}>
      <View>
        <Image
          source={image}
          style={{ width: 88, height: 88 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={{ fontWeight: "bold", padding: 2 }}>{title}</Text>
        <Text style={{ fontSize: 13, padding: 2, lineHeight: 17 }}>{body}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginTop: 10,
    flexDirection: "row",
    height: 120,
    paddingHorizontal: 14,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    width: width - 110,
    marginHorizontal: 10,
    paddingRight: 10,
  },
});

export default TipCard;
