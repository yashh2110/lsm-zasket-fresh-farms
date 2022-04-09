import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Theme from "../../styles/Theme";
const { width, height } = Dimensions.get("screen");

import Share from "react-native-share";
import moment from "moment";
import { getPcShareInfo } from "../../actions/priceChop";
import IconAnt from "react-native-vector-icons/AntDesign";
import Config from "react-native-config";
import { Button } from "react-native-paper";
const PcProductDetailCard = ({ item, product }) => {
  const PRICE_CHOP_WEB_URL = Config.PRICE_CHOP_WEB_URL;
  const [shareInfo, setShareInfo] = useState(null);
  useEffect(() => {
    getPcShareInfo(item.promotionId, (res, status) => {
      if (status) {
        const userPromotionCode = res?.data?.userPromotionCode;
        const allowShare = res?.data?.allowShare;
        const message = res?.data?.shareInfo?.message;
        const link = `${PRICE_CHOP_WEB_URL}/pricechop.html?userPromotionCode=${userPromotionCode}`;
        if (allowShare) {
          setShareInfo({
            title: "Zasket",
            message: `${message} : ${link}`,
          });
        }
      }
    });
  }, []);
  const onShare = () => {
    console.log("presss");
    Share.open(shareInfo).catch((err) => console.log(err));
  };
  return (
    <View style={styles.card}>
      <View
        style={{
          position: "relative",
          alignItems: "center",
          backgroundColor: Theme.Colors.productBackground,
          borderRadius: 6,
        }}>
        <Image
          source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : require("../../assets/png/default.png")
          }
          style={{ width: 120, height: 140, borderRadius: 6 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.pricing}>
          <Text style={styles.price}>₹ {item.cashback}</Text>
          <Text style={styles.subName}>{item.subName}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 4,
          }}></View>
        {product.cashbackState === "NOT_CREDITED" ? (
          <View
            style={{
              backgroundColor: "#eaeaea",
              padding: 4,
              paddingHorizontal: 7,
              width: 134,
              borderRadius: 4,
              marginTop: -4,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5,
            }}>
            <Image
              source={require("../../assets/png/clickDark.png")}
              style={{ width: 12, height: 17 }}
            />
            <Text
              style={{
                color: "#000",
                paddingHorizontal: 5,
                fontSize: 13,
              }}>
              {item.targetClicks} Clicks Needed
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 4,
              paddingHorizontal: 7,
              width: 134,
              borderRadius: 4,
              marginTop: -4,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              elevation: 2,
              shadowColor: "grey",
              paddingVertical: 7,
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
            }}>
            <IconAnt
              name="checkcircleo"
              style={{ fontSize: 15, color: Theme.Colors.success }}
            />
            {/* <Image
              source={require("../../assets/png/clickDark.png")}
              style={{ width: 12, height: 17 }}
            /> */}
            <Text
              style={{
                color: Theme.Colors.success,
                paddingHorizontal: 5,
                fontSize: 13,
                fontWeight: "bold",
                //   fontWeight: "bold",
              }}>
              Credited
            </Text>
          </View>
        )}
        {/* <TouchableOpacity
          style={{ marginTop: 11 }}
          onPress={() => {
            onShare();
          }}>
          <Image
            source={require("../../assets/png/PcShareGreen.png")}
            style={{ width: 134, height: 30 }}
          />
        </TouchableOpacity> */}
        {shareInfo != null ? (
          <Button
            style={{
              // shadowColor: "grey",
              width: 137,
              marginTop: 11,
              backgroundColor: "#1fa900",
            }}
            rippleColor="rgba(255,0,0, 1)"
            mode="outlined"
            color="#fff"
            uppercase={false}
            onPress={() => {
              onShare();
            }}>
            <Image
              source={require("../../assets/png/WhatIcon.png")}
              style={{ width: 11, height: 11, marginLeft: 4 }}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "bold",
                marginHorizontal: 3,
                color: "#fff",
              }}>
              {" "}
              Share
            </Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginVertical: 5,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingVertical: 15,
  },
  cardContent: {
    width: width - 120,
    paddingHorizontal: 12,
    paddingTop: 2,
  },
  title: {
    fontWeight: "bold",
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  pricing: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  price: {
    fontWeight: "bold",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "#e1171e",
  },
  subName: {
    fontSize: 12,
    paddingHorizontal: 10,
    color: "#909090",
  },
});
export default PcProductDetailCard;
