import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { AuthContext } from "../../navigation/Routes";
import {
  getAllCategories,
  isPincodeServiceable,
  getCustomerDetailsLanAndLon,
  getAllBanners,
  addCustomerDeviceDetails,
} from "../../actions/home";
import { getBillingDetails } from "../../actions/cart";
import { onLogout } from "../../actions/auth";
import { connect } from "react-redux";
import { addHomeScreenLocation } from "../../actions/homeScreenLocation";
import { getCartItemsApi } from "../../actions/cart";
import { getAllUserAddress } from "../../actions/map";
import RNUxcam from "react-native-ux-cam";
import { getPriceChopList } from "../../actions/priceChop";
import analytics from "@react-native-firebase/analytics";
RNUxcam.startWithKey("qercwheqrlqze96"); // Add this line after RNUxcam.optIntoSchematicRecordings();
RNUxcam.optIntoSchematicRecordings();
RNUxcam.tagScreenName("homeScreen");
const CartDown = ({
  route,
  cartItems,
  homeScreenLocation,
  getCustomerDetailsLanAndLon,
  getOrdersBillingDetails,
  addHomeScreenLocation,
  getBillingDetails,
  getAllCategories,
  getAllUserAddress,
  isPincodeServiceable,
  getAllBanners,
  isAuthenticated,
  allUserAddress,
  bannerImages,
  addCustomerDeviceDetails,
  categories,
  navigation,
  userLocation,
  onLogout,
  showPriceChopIcon,
  config,
  getCartItemsApi,
}) => {
  const { setOnBoardKey, removeOnBoardKey } = React.useContext(AuthContext);
  const [dynamicLink, setDynamicLink] = useState("");
  const [productId, setProductId] = useState("");
  const [subBanners, setSubBanners] = useState("");
  const [partnerDetails, setPartnerDetails] = useState("");

  const { width: screenWidth } = Dimensions.get("window");

  return (
    <>
      {showPriceChopIcon ? (
        <TouchableOpacity
          onPress={() => {
            analytics().logEvent("free_items_clicked");
            navigation.navigate("PriceChopStack");
          }}
          style={{
            // width: 100,
            position: "absolute",
            // top: -100,
            bottom: cartItems.length >= 1 ? 55 : 0,
            right: 0,
            margin: 10,
          }}>
          <Image
            source={require("../../assets/png/priceChop.png")}
            style={{ width: 68, height: 68 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : null}
      {cartItems.length >= 1 ? (
        <View style={{ width: "100%", backgroundColor: "white" }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("CartStack");
            }}
            style={{
              height: 55,
              width: "95%",
              backgroundColor: "#6ba040",
              flexDirection: "row",
              borderRadius: 5,
              marginBottom: 8,
              alignSelf: "center",
              justifyContent: "space-between",
              padding: 8,
            }}>
            <View style={{ marginLeft: 5 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  fontSize: 16,
                }}>{`₹ ${getOrdersBillingDetails.finalPrice}`}</Text>
              <Text style={{ color: "#ffffff" }}>{`${
                cartItems.length
              } | Saved ₹ ${
                getOrdersBillingDetails?.marketPrice -
                getOrdersBillingDetails?.discountedPrice
              }`}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{ height: 40, width: 30, alignSelf: "center" }}
                resizeMode="center"
                source={require("../../assets/png/bagIcon.png")}
              />
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    textAlign: "center",
                    alignSelf: "center",
                    color: "#ffffff",
                    fontWeight: "bold",
                    letterSpacing: 0.3,
                    fontSize: 16,
                  }}>
                  Checkout
                </Text>
                <Image
                  style={{ height: 54, width: 20, alignSelf: "center" }}
                  resizeMode="center"
                  source={require("../../assets/png/rightWhiteIcon.png")}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ) : // rightWhiteIcon
      undefined}
    </>
  );
};

const mapStateToProps = (state) => ({
  categories: state.home.categories,
  bannerImages: state.home.bannerImages,
  showPriceChopIcon: state.home.showPriceChopIcon,
  config: state.config.config,
  userLocation: state.location,
  homeScreenLocation: state.homeScreenLocation,
  isAuthenticated: state.auth.isAuthenticated,
  allUserAddress: state.auth.allUserAddress,
  cartItems: state.cart.cartItems,
  getOrdersBillingDetails: state.cart.getOrdersBillingDetails,
});

export default connect(mapStateToProps, {
  getBillingDetails,
  getAllCategories,
  getAllUserAddress,
  isPincodeServiceable,
  getCustomerDetailsLanAndLon,
  onLogout,
  getAllBanners,
  addHomeScreenLocation,
  getCartItemsApi,
  addCustomerDeviceDetails,
})(CartDown);
const styles = StyleSheet.create({
  scrollChildParent: {
    paddingHorizontal: 8,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  categoriesCard: {
    padding: 10,
    marginTop: -5,
  },
});
