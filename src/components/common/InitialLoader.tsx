import React, { Fragment } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";
import Theme from "../../styles/Theme";

const InitialLoader = () => {
  return (
    <>
      <View style={[styles.loading]}></View>
      <View
        style={{
          position: "absolute",
          elevation: 101,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}>
        <LottieView
          source={require("../../assets/json/loader.json")}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
        {/* <ActivityIndicator
          style={{}}
          size="large"
          color={Theme.Colors.primary}
        /> */}
      </View>
    </>
  );
};

export default InitialLoader;

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    elevation: 100,
    left: 0,
    zIndex: 1,
    right: 0,
    top: 0,
    bottom: 0,
    // opacity: 0.5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
