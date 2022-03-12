import LottieView from "lottie-react-native";
import { Button, Icon, Input, Item, Label, Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icons from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { login, loginWithProvider } from "../../actions/auth";
import { setDarkMode } from "../../actions/dark";
import Theme from "../../styles/Theme";
import { Validation } from "../../utils/validate";
import DarkModeToggle from "../common/DarkModeToggle";
import CodeInput from "react-native-confirmation-code-input";
import RF from "react-native-responsive-fontsize";
import Geolocation from "@react-native-community/geolocation";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { addHomeScreenLocation } from "../../actions/homeScreenLocation";
import { CheckGpsState } from "../../utils/utils";

const SetDeliveryLocationScreen = ({
  navigation,
  darkMode,
  setDarkMode,
  login,
  addHomeScreenLocation,
  homeScreenLocation,
}) => {
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const onSubmit = async () => {
    navigation.navigate("MapScreenGrabPincode", {
      fromScreen: "SetDeliveryLocationScreen",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : null}
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ width: "90%", alignSelf: "center", flex: 1 }}>
            {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10, width: 40, height: 40, justifyContent: 'center', }}>
                            <Image
                                style={{ width: 20, height: 20, }}
                                resizeMode="contain"
                                source={require('../../assets/png/backIcon.png')}
                            />
                        </TouchableOpacity> */}
            <View style={{ marginTop: "10%" }}>
              <Image
                style={{ width: "100%", height: 250 }}
                resizeMode="contain"
                source={require("../../assets/png/pinCodeScreenImage.png")}
              />
            </View>

            <View>
              <Text
                style={{
                  marginTop: "4%",
                  fontSize: 20,
                  fontWeight: Platform.OS == "ios" ? "500" : "700",
                  letterSpacing: 0.3,
                  textAlign: "center",
                }}>
                Choose your Delivery Address
              </Text>
              <Text
                style={{
                  marginTop: "2%",
                  fontSize: 14,
                  color: "#727272",
                  textAlign: "center",
                }}>
                Let’s first check our service is available at your location or
                not? Because We Value your time!
              </Text>
              {/* <Text style={{ marginTop: "2%", fontSize: 14, color: "#2B2E30", textAlign: 'center', fontWeight: 'bold' }}>Now Choose your Delivery Address</Text> */}
              <Button
                full
                style={{
                  marginTop: "15%",
                  backgroundColor: Theme.Colors.primary,
                  borderRadius: 25,
                  marginHorizontal: 20,
                }}
                onPress={() => onSubmit()}>
                <Text style={{ textTransform: "capitalize" }}>
                  <Icon
                    name="location-sharp"
                    style={{ color: "#ffffff", fontSize: 19 }}
                  />{" "}
                  SET DELIVERY LOCATION
                </Text>
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = (state) => ({
  darkMode: state.dark,
  isAuthenticated: state.auth.isAuthenticated,
  homeScreenLocation: state.homeScreenLocation,
});

export default connect(mapStateToProps, {
  setDarkMode,
  login,
  loginWithProvider,
  addHomeScreenLocation,
})(SetDeliveryLocationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
