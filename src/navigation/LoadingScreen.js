import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Loader from "../components/common/Loader";
import { AuthContext } from "./Routes";
import { connect } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import Theme from "../styles/Theme";
import AsyncStorage from "@react-native-community/async-storage";
import LottieView from "lottie-react-native";

const LoadingScreen = ({ route, navigation }) => {
  const { setOnBoardKey, removeOnBoardKey } = React.useContext(AuthContext);
  // const { role } = route.params;

  // useEffect(() => {
  //     const _bootstrapAsync = async () => {
  //         const onBoardKey = await AsyncStorage.getItem('onBoardKey');
  //         if (!onBoardKey) {
  //             console.warn('onboardScreen')
  //             navigation.navigate('OnBoardScreen')
  //         } else {
  //             console.warn('bootomTabRoute')
  //             navigation.navigate('BottomTabRoute')
  //         }
  //     };
  //     _bootstrapAsync()
  // }, [])

  // const initialFunction = () => {
  //     if (role == "LOGIN") {
  //         setOnBoardKey('onBoardKey')
  //     } else if (role == "LOGOUT") {
  //         removeOnBoardKey()
  //     }
  // }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}>
      <LottieView
        source={require("../assets/json/loader.json")}
        autoPlay
        loop
        style={{ width: 100, height: 100 }}
      />
      {/* <ActivityIndicator size="large" color={Theme.Colors.primary} /> */}
    </View>
  );
};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(LoadingScreen);
