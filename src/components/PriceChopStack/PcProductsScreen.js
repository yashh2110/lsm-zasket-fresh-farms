import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import CustomHeader from "../common/CustomHeader";

const PcProductsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="Get Free Items" />
      <FlatList
        data={[1, 2, 3]}
        renderItem={({ item }) => (
          <View>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(i) => i.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
export default PcProductsScreen;
