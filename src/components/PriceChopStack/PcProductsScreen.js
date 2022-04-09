import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../common/CustomHeader";
import PcProductCard from "./PcProductCard";
import Loader from "../common/Loader";
import { getPriceChopList } from "../../actions/priceChop";
import Theme from "../../styles/Theme";
const { height, width } = Dimensions.get("screen");
const PcProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const initialFunction = async () => {
    setLoading(true);
    await getPriceChopList((res, status) => {
      console.log(res);
      if (status) {
        setLoading(false);
        setProducts(res?.data);
      } else {
        console.log(res.response);
        setLoading(false);
      }
    });
    setLoading(false);
  };
  useEffect(() => {
    initialFunction();
  }, []);

  return (
    <>
      {!loading ? (
        <View style={styles.container}>
          <CustomHeader navigation={navigation} title="Get Free Items" />

          <FlatList
            data={products}
            renderItem={({ item }) => (
              <PcProductCard item={item} navigation={navigation} />
            )}
            ListHeaderComponent={() => {
              return (
                <View
                  style={{
                    aspectRatio: 348 / 190,
                    position: "relative",
                    width: width,
                    height: 151,
                    // marginTop: 5,
                    marginBottom: -5,
                  }}>
                  <Image
                    source={require("../../assets/png/freeItemsCreative.png")}
                    style={{ width: width, height: "100%" }}
                    // resizeMode="cover"
                  />
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    height: height - 120,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Text style={{ fontSize: 17 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: Theme.Colors.primary,
                      }}>
                      Oops!
                    </Text>{" "}
                    no free items now
                  </Text>
                </View>
              );
            }}
            keyExtractor={(i) => i.promotionId.toString()}
            // ItemSeparatorComponent={() => (
            //   <View
            //     style={{
            //       height: 0.7,
            //       width: "90%",
            //       alignSelf: "center",
            //       backgroundColor: "#EAEAEC",
            //       marginBottom: 5,
            //     }}
            //   />
            // )}
          />
        </View>
      ) : (
        <Loader />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
    width,
  },
});
export default PcProductsScreen;
