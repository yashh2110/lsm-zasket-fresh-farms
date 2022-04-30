import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
const { width, height } = Dimensions.get("screen");
import CountDown from "react-native-countdown-component";
import Theme from "../../styles/Theme";
import moment from "moment";
import Share from "react-native-share";
import { getPcShareInfo } from "../../actions/priceChop";
import Config from "react-native-config";
import { Button } from "react-native-paper";
import analytics from "@react-native-firebase/analytics";
const PcProductCard = ({ item, navigation }) => {
  const PRICE_CHOP_WEB_URL = Config.PRICE_CHOP_WEB_URL;
  const date = moment().valueOf();
  const offerEndsIn = (item.expiresAt - date) / 1000;
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
    analytics().logEvent("free_item_share", {
      free_item_share: item.name,
    });
    Share.open(shareInfo)
      // .then((res) => alert(res))
      .catch((err) => console.log(err));
  };
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("PcProductDetailsScreen", {
          promotionId: item.promotionId,
          item: item,
        })
      }>
      <View
        style={{
          position: "relative",
          alignItems: "center",
        }}>
        <View
          style={{
            backgroundColor: Theme.Colors.productBackground,
            borderRadius: 6,
          }}>
          <Image
            source={
              item.imageUrl
                ? { uri: item.imageUrl }
                : require("../../assets/png/default.png")
            }
            style={{ width: 120, height: 130, borderRadius: 6 }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            backgroundColor: Theme.Colors.primary,
            padding: 4,
            paddingHorizontal: 5,
            width: 130,
            borderRadius: 4,
            marginTop: -4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Image
            source={require("../../assets/png/click.png")}
            style={{ width: 12, height: 17 }}
          />
          <Text
            style={{
              color: "white",
              paddingHorizontal: 5,
              fontSize: 13,
              fontWeight: "bold",
            }}>
            {item.targetClicks} Clicks Needed
          </Text>
        </View>
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
          }}>
          <Text style={{ fontSize: 12, color: "#e1171e", marginRight: 7 }}>
            Offer Ends In
          </Text>
          <CountDown
            until={offerEndsIn}
            size={12}
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
        {/* <Button onPress={()=>console.log("asd")}>yash</Button> */}
        {shareInfo != null ? (
          <Button
            style={{
              // shadowColor: "grey",
              width: "93%",
              marginTop: 7,
            }}
            rippleColor="rgba(255,0,0, 1)"
            mode="outlined"
            color="#1fa900"
            uppercase={false}
            onPress={() => {
              onShare();
            }}>
            <Image
              source={require("../../assets/png/whatsappGreenIcon.png")}
              style={{ width: 13, height: 13, marginLeft: 4 }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                marginHorizontal: 3,
                color: "#1fa900",
              }}>
              {" "}
              Share
            </Text>
          </Button>
        ) : (
          <Button
            style={{
              // shadowColor: "grey",
              width: "93%",
              marginTop: 7,
            }}>
            <ActivityIndicator size="large" color={Theme.Colors.primary} />
          </Button>
        )}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginVertical: 5,
    padding: 10,
    paddingHorizontal: 14,
  },
  cardContent: {
    width: width - 150,
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
export default PcProductCard;
