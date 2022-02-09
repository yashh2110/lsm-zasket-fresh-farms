import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Linking,
  FlatList,
  Clipboard,
  PermissionsAndroid,
  ActivityIndicator,
  Share,
  SafeAreaView,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { Icon, Button } from "native-base";
import LottieView from "lottie-react-native";
import Theme from "../../styles/Theme";
import moment from "moment";
import InAppReview from "react-native-in-app-review";
import Loader from "../common/Loader";
import { getLeaderBoardList } from "../../actions/wallet";
import Sharee from "react-native-share";
import AsyncStorage from "@react-native-community/async-storage";
const PaymentSuccessScreenOrderDetail = ({
  navigation,
  route,
  getLeaderBoardList,
}) => {
  const { slotStartTime, slotEndTime } = route.params;
  const [loading, setLoading] = useState(false);
  const [appShareInfo, setAppShareInfo] = useState({});
  const [referal, setReferal] = useState("");
  const [copymessage, setCopymessage] = useState(false);
  const [invitecopymessage, setInviteCopymessage] = useState(false);
  const [firstOrderContent, setFirstOrderContent] = useState("");
  const [secondOrderContent, setFecondOrderContent] = useState("");
  const [commissionByOrder, setCommissionByOrder] = useState("");
  const [referalContent, setReferalContent] = useState("");
  // useEffect(() => {
  //     const initialFunction = async () => {
  //         try {
  //             const isAvailable = await InAppReview.isAvailable();
  //             if (!isAvailable) {
  //                 return;
  //             }
  //             InAppReview.RequestInAppReview();
  //         } catch (e) { }
  //     }
  //     initialFunction()
  // }, [])
  useEffect(() => {
    // alert(slotTime)
    // const initialFunction = async () => {
    //     try {
    //         const isAvailable = await InAppReview.isAvailable();
    //         if (!isAvailable) {
    //             return;
    //         }
    //         InAppReview.RequestInAppReview();
    //     } catch (e) { }
    // }
    initialFunction();
  }, []);
  const initialFunction = async () => {
    setLoading(true);
    getLeaderBoardList(async (res, status) => {
      if (status) {
        console.log(res?.referralContent?.v2ReferralContent?.amountPerReferral);
        // alert(JSON.stringify(res, null, "        "))
        setAppShareInfo(res?.appShareInfoResponse);
        setReferalContent(
          res?.referralContent?.v2ReferralContent?.amountPerReferral
        );
        setFirstOrderContent(
          res?.referralContent?.v2ReferralContent?.content[0]
        );
        setFecondOrderContent(
          res?.referralContent?.v2ReferralContent?.content[1]
        );
        setCommissionByOrder(
          res?.referralContent?.v2ReferralContent?.content[2]
        );
        setLoading(false);
        // setRefresh(false)
      } else {
        setLoading(false);
      }
    });
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let referralCode = await parsedUserDetails?.customerDetails?.referralCode;
    // alert(referralCode)
    setReferal(referralCode);
    setLoading(false);
  };
  const onShare = async () => {
    let appUrl;
    if (Platform.OS == "ios") {
      appUrl = "https://apps.apple.com/in/app/zasket/id1541056118";
    }
    if (Platform.OS == "android") {
      appUrl = "https://play.google.com/store/apps/details?id=com.zasket";
    }
    try {
      const result = await Share.share({
        message: appUrl,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // alert(error.message);
    }
  };
  const get_Text_From_Clipboard = (text) => {
    Clipboard.setString(text);
    setCopymessage(true);
    setTimeout(() => {
      setCopymessage(false);
    }, 4000);
  };
  const whatsAppShare = async () => {
    if (Platform.OS == "android") {
      try {
        const toDataURL = (url) =>
          fetch(url)
            .then((response) => response.blob())
            .then(
              (blob) =>
                new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                })
            );
        toDataURL(appShareInfo?.image).then((dataUrl) => {
          let split = dataUrl.split("base64,");
          const shareOptions = {
            title: "Zasket", //string
            message: `${appShareInfo?.content}`,
            url: `data:image/png;base64,${split[1]}`,
            failOnCancel: false,
            social: Sharee.Social.WHATSAPP,
          };
          try {
            Sharee.shareSingle(shareOptions).catch((err) => console.log(err));
          } catch (err) {
            moreShare();
            // alert("notwhats app")
            // do something
          }
        });
      } catch (error) {
        // alert(error)
      }
    } else {
      let url = "whatsapp://send?text=" + `${appShareInfo?.content}`;
      Linking.openURL(url)
        .then((data) => {
          console.log("WhatsApp Opened", data);
        })
        .catch(() => {
          alert("Make sure Whatsapp installed on your device");
        });
    }
  };
  return (
    <>
      <View
        style={{
          flex: 3,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <LottieView
                style={{ width: 100, height: 100 }}
                source={require("../../assets/animations/success.json")}
                autoPlay={true}
                loop={false}
            /> */}
        <Image
          style={{ width: 100, height: 100, marginTop: "15%" }}
          resizeMode={"contain"}
          source={require("../../assets/png/tickGreen.png")}
        />
        <Text
          style={{
            color: "#449005",
            fontSize: 18,
            fontWeight: "bold",
            marginTop: "10%",
          }}
        >
          Thanks for paying your order.
        </Text>
        <Text
          style={{
            color: "#727272",
            fontSize: 14,
            textAlign: "center",
            width: "80%",
          }}
        >
          We are currently processing your order. You can find updates to your
          order under{" "}
          <Text
            onPress={() => {
              navigation.navigate("CartStack", { screen: "MyOrders" });
              navigation.pop();
            }}
            style={{
              color: Theme.Colors.primary,
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            My orders
          </Text>
          .
        </Text>
        {slotStartTime && slotEndTime ? (
          <>
            <Text style={{ fontSize: 14, color: "#727272", marginTop: 30 }}>
              Your order will arrive on{" "}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {moment(slotStartTime).format("DD MMM")} ({" "}
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                {moment(slotStartTime).add(1, "minutes").format("hh:mm A")} -{" "}
                {moment(slotEndTime).add(1, "minutes").format("hh:mm A")}
              </Text>{" "}
              )
            </Text>
          </>
        ) : null}

        <View style={{ width: "98%", marginVertical: 15 }}>
          <View style={{ padding: 10 }}>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                borderColor: "#f7d395",
                padding: 18,
                borderWidth: 0.9,
              }}
            >
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: "bold",
                  letterSpacing: 0.6,
                  color: "#000001",
                }}
              >
                Refer Friends and earn
              </Text>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: "bold",
                  letterSpacing: 0.6,
                  color: "#000001",
                }}
              >
                up to{" "}
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: "bold",
                    letterSpacing: 0.6,
                    color: "#c89131",
                  }}
                >
                  Rs {referalContent}
                </Text>{" "}
                per referral
              </Text>
              <View style={{ marginVertical: 16 }}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("../../assets/png/ReferOrderSt1.png")}
                    style={{ height: 14, width: 14, marginTop: 2 }}
                    resizeMode="cover"
                  />
                  <Text style={{ marginHorizontal: 11, fontSize: 12.5 }}>
                    {firstOrderContent}
                  </Text>
                </View>
                <View style={{ marginTop: 20 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../assets/png/ReferOrderSt2.png")}
                      style={{ height: 23, width: 19 }}
                      resizeMode="cover"
                    />
                    <Text style={{ marginHorizontal: 11, fontSize: 12.5 }}>
                      {secondOrderContent}
                    </Text>
                  </View>
                </View>
                <View style={{ marginVertical: 15 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../assets/png/ReferOrderSt3.png")}
                      style={{ height: 19, width: 19 }}
                      resizeMode="cover"
                    />
                    <Text style={{ marginHorizontal: 11, fontSize: 12.5 }}>
                      {commissionByOrder}
                    </Text>
                  </View>
                </View>
                <View style={{}}>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 14,
                      letterSpacing: 0.5,
                    }}
                  >
                    Hurry up become a{" "}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        letterSpacing: 0.5,
                        color: "#c89131",
                      }}
                    >
                      ZASKET
                    </Text>{" "}
                    entrepreneur.
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    get_Text_From_Clipboard(referal);
                  }}
                  style={{
                    borderRadius: 10,
                    width: "50%",
                    alignSelf: "center",
                    flexDirection: "row",
                    borderStyle: "dashed",
                    borderRadius: 8,
                    backgroundColor: "#fff7ea",
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: "#d8ad00",
                    zIndex: 0,
                    marginLeft: -1,
                    height: 40,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#d8ad00",
                        marginLeft: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {referal}{" "}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      get_Text_From_Clipboard(referal);
                    }}
                    style={{
                      flexDirection: "row",
                      height: 40,
                      width: 30,
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <View style={{}}>
                      <Image
                        style={{ width: 25, height: 25 }}
                        resizeMode="contain"
                        source={require("../../assets/png/copyIcon.png")}
                      />
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    whatsAppShare();
                  }}
                  style={{
                    height: 40,
                    width: "46%",
                    height: 45,
                    borderRadius: 8,
                    justifyContent: "center",
                    borderColor: "#1fa900",
                    borderWidth: 1,
                    backgroundColor: "#1fa900",
                  }}
                >
                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ width: 19, height: 19 }}
                        resizeMode="contain"
                        source={require("../../assets/png/WhatIcon.png")}
                      />
                    </View>
                    <View style={{}}>
                      <Text
                        style={{
                          color: "#f8f8f8",
                          marginHorizontal: 6,
                          fontSize: 13,
                          fontWeight: "bold",
                        }}
                      >
                        WhatsApp
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* <TouchableOpacity activeOpacity={0.8} onPress={() => { onShare() }} style={{ height: 200, }}>
                        <Image
                            style={{ height: 200, }}
                            resizeMode={"contain"}
                            source={require('../../assets/png/ReferralImage.png')}
                        />
                    </TouchableOpacity> */}
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              navigation.navigate("Home");
              navigation.pop();
            }}
          >
            <Text style={{ color: Theme.Colors.primary, fontWeight: "bold" }}>
              No Thanks
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View style={{ flex: 1.5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: "#727272", marginTop: 50, textAlign: "center", marginHorizontal: 20 }}>If you like the app experience share it
                    with your Friends Now! </Text>
                <Button full style={{ marginVertical: 20, backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => {
                    onShare()
                }}><Image
                        style={{ width: 20, height: 20, }}
                        source={require('../../assets/png/shareIcon.png')}
                    /><Text>Share</Text></Button>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>No Thanks</Text>
                </TouchableOpacity>
            </View> */}

      {copymessage ? (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            left: 0,
            right: 0,
            bottom: 10,
          }}
        >
          <View
            style={{
              backgroundColor: "#191919",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#DCDCDC", letterSpacing: 0.2 }}>
              Copied to Clipboard
            </Text>
          </View>
        </View>
      ) : undefined}
      {invitecopymessage ? (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            left: 0,
            right: 0,
            bottom: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#191919",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#DCDCDC", letterSpacing: 0.2 }}>
              Invite message copied succcessfully
            </Text>
          </View>
        </View>
      ) : undefined}
    </>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { getLeaderBoardList })(
  PaymentSuccessScreenOrderDetail
);

const styles = StyleSheet.create({});
