import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../common/CustomHeader";
import { FlatList } from "react-native-gesture-handler";
import { getPromotionStats } from "../../actions/priceChop";
import PcProductDetailCard from "./PcProductDetailCard";
import CountDown from "react-native-countdown-component";
import moment from "moment";
import Theme from "../../styles/Theme";
import LinearGradient from "react-native-linear-gradient";
import Loader from "../common/Loader";
import * as Progress from "react-native-progress";
import PcCondtion from "./PcCondtion";
const { width, height } = Dimensions.get("screen");
const PcProductDetailsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const { promotionId, item } = route.params;
  const date = moment().valueOf();
  const offerEndsIn = (item.expiresAt - date) / 1000;
  useEffect(() => {
    initialFunction();
  }, []);
  const initialFunction = async () => {
    setLoading(true);
    await getPromotionStats(promotionId, (res, status) => {
      if (status) {
        console.log(res.data);
        setProduct(res.data);
      } else {
        console.log(res.response);
      }
    });
    setLoading(false);
  };
  return (
    <>
      {!loading && product ? (
        <>
          <View style={{ backgroundColor: "#fff" }}>
            <CustomHeader navigation={navigation} title="Offer only for you" />
          </View>
          <ScrollView
            style={{ flex: 1, backgroundColor: "#f4f4f4" }}
            showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <View style={{ backgroundColor: "#f4f4f4", flex: 1 }}>
                <PcProductDetailCard item={item} product={product} />
                {product.cashbackState == "NOT_CREDITED" ? (
                  <View style={styles.counter}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#e1171e",
                        fontWeight: "bold",
                        marginHorizontal: 10,
                      }}>
                      Offer Ends In
                    </Text>
                    <CountDown
                      until={offerEndsIn}
                      size={17}
                      onFinish={() => {}}
                      timeToShow={["H", "M", "S"]}
                      separatorStyle={{ color: "#1CC625" }}
                      digitStyle={{
                        backgroundColor: Theme.Colors.primary,
                        borderWidth: 2,
                        borderColor: Theme.Colors.primary,
                      }}
                      digitTxtStyle={{ color: "#fff", fontWeight: "bold" }}
                      showSeparator
                      timeLabels={{ m: null, s: null }}
                    />
                  </View>
                ) : null}
                <LinearGradient
                  colors={["#005773", "#006175"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.targetCreative}>
                  <View style={styles.targetView}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={require("../../assets/png/click.png")}
                        style={{ width: 16, height: 24, marginRight: 7 }}
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#fff",
                          letterSpacing: 0.55,
                        }}>
                        Share & Get More Clicks
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={initialFunction}
                      style={{
                        padding: 5,
                        paddingHorizontal: 17,
                        borderRadius: 4,
                        backgroundColor: "#007590",
                      }}>
                      <Text style={{ color: "#ffc800" }}>Refresh</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginTop: 12, paddingVertical: 10 }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 15,
                      }}>
                      <Text
                        style={{
                          color: "#ffc800",
                          fontWeight: "bold",
                          fontSize: 17,
                        }}>
                        {product?.completedClicks}
                      </Text>
                      /{item.targetClicks} Clicks
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}>
                      <Progress.Bar
                        progress={product.completedClicks / item.targetClicks}
                        // progress={0.3}
                        width={width * 0.92 - 30 - 62.8}
                        borderWidth={0}
                        unfilledColor="rgba(217,217,217,0.16)"
                        color="#ffc800"
                      />
                      <Image
                        source={require("../../assets/png/free.png")}
                        style={{
                          width: 62.8,
                          height: 44.2,
                          marginLeft: -5,
                          marginTop: -10,
                        }}
                      />
                    </View>
                  </View>
                </LinearGradient>
                {product?.termsAndConditions?.length > 0 ? (
                  <View
                    style={{
                      justifyContent: "center",
                      // alignItems: "center",
                      marginTop: 28,
                      width: width * 0.92,
                      alignSelf: "center",
                      padding: 10,
                      paddingBottom: 20,
                      borderRadius: 10,
                      backgroundColor: "#fff",
                    }}>
                    <Text
                      style={{
                        color: "white",
                        backgroundColor: "#005d75",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 20,
                        padding: 7,
                        marginTop: -24,
                        marginBottom: 9,
                        fontSize: 16,
                        borderRadius: 16,
                        textAlign: "center",
                        alignSelf: "center",
                      }}>
                      Terms & Conditions
                    </Text>
                    <View style={{ padding: 10 }}>
                      {product?.termsAndConditions.map((e) => (
                        <PcCondtion condition={e} />
                      ))}
                      {/* <PcCondtion condition="One click from one friend will only be counted." />
                    <PcCondtion
                      condition="Once you achieved the clicks within the time, 
the amount will be added to your wallet."
                    />
                    <PcCondtion
                      condition="Any fraudulent activity Zasket has the right 
not to add money to the wallet."
                    />
                    <PcCondtion
                      condition="Clicks have to come from the people of 
the Vijayawada and Guntur regions."
                    /> */}
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </>
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
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: width * 0.92,
    alignSelf: "center",
    padding: 12,
    borderRadius: 6,
    marginVertical: 10,
  },
  targetView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  targetCreative: {
    position: "relative",
    width: width * 0.92,
    padding: 10,
    // height: "50%",
    backgroundColor: "grey",
    alignSelf: "center",
    borderRadius: 6,
    overflow: "visible",
    marginTop: 5,
    paddingHorizontal: 15,
  },
});
export default PcProductDetailsScreen;
