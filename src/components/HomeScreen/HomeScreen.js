import React, { useEffect, useContext, useState, useLayoutEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  SectionList,
  FlatList,
  RefreshControl,
  BackHandler,
  Platform,
  PermissionsAndroid,
  DeviceEventEmitter,
  Linking,
} from "react-native";
import { Icon } from "native-base";
import { AuthContext } from "../../navigation/Routes";
import Swiper from "react-native-swiper";
import Theme from "../../styles/Theme";
import {
  getAllCategories,
  isPincodeServiceable,
  getCustomerDetailsLanAndLon,
  getAllBanners,
  addCustomerDeviceDetails,
  setShowPriceChopIcon,
} from "../../actions/home";
import { getBillingDetails } from "../../actions/cart";
import { onLogout } from "../../actions/auth";
import { connect } from "react-redux";
import CategorySectionListItem from "./CategorySectionListItem";
import Loader from "../common/Loader";
import DarkModeToggle from "../common/DarkModeToggle";
import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from "@react-native-community/geolocation";
import { addHomeScreenLocation } from "../../actions/homeScreenLocation";
import { getCartItemsApi } from "../../actions/cart";
import FeatherIcons from "react-native-vector-icons/Feather";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import InAppReview from "react-native-in-app-review";
import OneSignal from "react-native-onesignal";
import DeviceInfo from "react-native-device-info";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import GPSState from "react-native-gps-state";
import { CheckGpsState, CheckPermissions } from "../../utils/utils";
import { useIsFocused } from "@react-navigation/native";
import AddressModal from "../common/AddressModal";
import { getAllUserAddress, geocodeing } from "../../actions/map";
import Modal from "react-native-modal";
import SetDeliveryLocationModal from "../common/SetDeliveryLocationModal";
import { EventRegister } from "react-native-event-listeners";
import RNUxcam from "react-native-ux-cam";
import firebase from "@react-native-firebase/app";
import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import CartDown from "../common/cartDown";
import appsFlyer from "react-native-appsflyer";
import LinearGradient from "react-native-linear-gradient";
import analytics from "@react-native-firebase/analytics";
import InitialLoader from "../common/InitialLoader";
import Config from "react-native-config";
import Carousel, {
  Pagination,
  PaginationLight,
} from "react-native-x2-carousel";
import { getPriceChopList } from "../../actions/priceChop";
RNUxcam.startWithKey("qercwheqrlqze96"); // Add this line after RNUxcam.optIntoSchematicRecordings();
RNUxcam.optIntoSchematicRecordings();
RNUxcam.tagScreenName("homeScreen");
const HomeScreen = ({
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
  setShowPriceChopIcon,
  allUserAddress,
  bannerImages,
  addCustomerDeviceDetails,
  categories,
  navigation,
  userLocation,
  onLogout,
  config,
  getCartItemsApi,
}) => {
  const { setOnBoardKey, removeOnBoardKey } = React.useContext(AuthContext);
  const [dynamicLink, setDynamicLink] = useState("");
  const [productId, setProductId] = useState("");
  const [subBanners, setSubBanners] = useState("");
  const [partnerDetails, setPartnerDetails] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [modelSwip, setModelSwip] = useState("");
  const [priorityCategories, setPriorityCategories] = useState([]);
  const [fixedCategories, setFixedCategories] = useState({
    vegitables: null,
    fruits: null,
  });
  const mapApiKey = Config.MAP_API_KEY;
  const oneSignalAppId = Config.ONESIGNAL_APP_ID;
  // useEffect(() => {
  //     // let userDetails = await AsyncStorage.getItem('ProductId');
  //     // alert(userDetails)
  //     getIntialFunction()

  // })
  // const getIntialFunction = async () => {
  //     let userDetails = await AsyncStorage.getItem('ProductId');
  //     alert(userDetails)

  // }
  const { width: screenWidth } = Dimensions.get("window");
  // useEffect(() => {
  //   // alert(JSON.stringify(getOrdersBillingDetails, null, "      "))
  //   initalCustomerDetails();
  //   // const eventName = 'af_login'
  //   // appsFlyer.logEvent(
  //   //     eventName,
  //   //     (res) => {
  //   //         console.log(res);
  //   //     },
  //   //     (err) => {
  //   //         console.error(err);
  //   //     }
  //   // );

  //   // alert(JSON.stringify(homeScreenLocation, null, "   "))
  // }, []);

  useEffect(() => {
    addToCard();
  }, [cartItems]);

  const addToCard = async () => {
    // let productIdArray = []
    // console.log("cartItemscartItemscartItemscartItems", JSON.stringify(cartItems, null, "    "))
    // await cartItems?.forEach((el, index) => {
    //     productIdArray.push(
    //         el?.id
    //     )
    // })

    // alert(JSON.stringify(cartItems, null, "    "))

    let productNameArray = [];
    let productIdArray = [];
    let productCountArray = [];
    let categoryArray = [];
    await cartItems?.forEach((el, index) => {
      productNameArray.push(el?.itemName);
      productIdArray.push(el?.id);
      productCountArray.push(el?.count);
      categoryArray.push(el?.categoryName);
    });
    let categorys = categoryArray.join(",");
    let removedDuplicateCategors = Array.from(
      new Set(categorys.split(","))
    ).toString();
    const eventAddName = "af_add_to_cart";
    const eventValues = {
      af_price: getOrdersBillingDetails?.finalPrice,
      af_content: productNameArray.join(","),
      af_content_id: productIdArray.join(","),
      af_content_type: removedDuplicateCategors,
      af_currency: "INR",
      af_quantity: productCountArray.join(","),
    };
    appsFlyer.logEvent(
      eventAddName,
      eventValues,
      (res) => {},
      (err) => {}
    );
    analytics().logEvent("add_to_cart", {
      price: getOrdersBillingDetails?.finalPrice,
      content: productNameArray.join(","),
      content_id: productIdArray.join(","),
      content_type: removedDuplicateCategors,
      currency: "INR",
      quantity: productCountArray.join(","),
    });
  };

  const initalCustomerDetails = async () => {
    getCustomerDetailsLanAndLon(homeScreenLocation, async (res, status) => {
      // alert("asdkfhiu")
      if (status) {
        // alert(JSON.stringify(res?.data ?, null, "   "))
        // alert(JSON.stringify(res?.data, null, "       "))
        setPartnerDetails(res?.data?.assignedPartnerInfo);
        // setUserDetails(res?.data)
        await AsyncStorage.setItem("userDetails", JSON.stringify(res?.data));
        setRefresh(false);
      } else {
        // setUserDetails({})
        setRefresh(false);
      }
    });
  };
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
          while ((match = regex.exec(link.url))) {
            params[match[1]] = match[2];
          }
          console.warn("params?.referralCodeparams?.referralCode", params);
          // if (params?.referralCode) {
          //     console.warn("params?.referralCodeparams?.referralCode", params?.referralCode)
          //     AsyncStorage.setItem('referralCode', params?.referralCode);
          // }
          if (params?.productDetails) {
            // alert(JSON.stringify(params))
            navigation.navigate("ProductDetailScreen", {
              item: params?.productDetails,
            });
          }
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);
  const handleDynamicLink = (link) => {
    if (link) {
      spreatereferral(link);
    }
  };
  const spreatereferral = (link) => {
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;
    while ((match = regex.exec(link.url))) {
      params[match[1]] = match[2];
    }
    // console.log(params.referralCode)
    if (params?.productDetails) {
      // alert(JSON.stringify(params))
      navigation.navigate("ProductDetailScreen", {
        item: params?.productDetails,
      });
    }
    // setReferralCode(params.referralCode)
  };
  useEffect(() => {
    // alert(JSON.stringify(route, null, "        "))
    generateLink();
  }, []);
  const generateLink = async () => {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let referralCode = await parsedUserDetails?.customerDetails?.referralCode;
    try {
      const link = await firebase.dynamicLinks().buildShortLink({
        link: `https://zasket.page.link?banner=${"HomePage"}`,
        // link: `https://play.google.com/store/apps/details?id=com.zasket/?${SENDER_UID}`,
        android: {
          packageName: "com.zasket",
        },
        ios: {
          bundleId: "com.freshleaftechnolgies.zasket",
          appStoreId: "1541056118",
        },
        domainUriPrefix: "https://zasket.page.link",
      });
      setDynamicLink(link);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    // alert(JSON.stringify(bannerImages, null, "       "))
    const onReceived = (notification) => {
      // console.log("Notification received: ", notification);
    };
    const onOpened = (openResult) => {
      // alert(JSON.stringify(openResult.notification.isAppInFocus, null, "       "))
      if (
        openResult.notification.payload.additionalData?.redirect_to ==
        "MyOrdersDetailScreen"
      ) {
        navigation.navigate(
          openResult.notification.payload.additionalData?.redirect_to,
          { order_id: openResult.notification.payload.additionalData?.order_id }
        );
        // navigation.navigate("AccountStack", {
        //     screen: 'MyOrders',
        //     params: {
        //         screen: openResult.notification.payload.additionalData?.redirect_to,
        //         params: {
        //             order_id: openResult.notification.payload.additionalData?.order_id
        //         },
        //     },
        // });
      }
      // console.log("Message: ", openResult.notification.payload.body);
      // console.log("Data: ", openResult.notification.payload.additionalData);
      // console.log("isActive: ", openResult.notification.isAppInFocus);
      // console.log("openResult: ", openResult);
    };
    const onIds = (device) => {
      // console.log("Device info: ", device);
    };
    OneSignal.addEventListener("received", onReceived);
    OneSignal.addEventListener("opened", onOpened);
    OneSignal.addEventListener("ids", onIds);
    return () => {
      OneSignal.removeEventListener("received", onReceived);
      OneSignal.removeEventListener("opened", onOpened);
      OneSignal.removeEventListener("ids", onIds);
    };
  }, []);

  useEffect(() => {
    const listener = EventRegister.addEventListener(
      "SessionExpiryEvent",
      (data) => {
        if (data == "logOut") {
          Alert.alert(
            "Session Expired",
            "Please login again",
            [{ text: "OK", onPress: () => onPressLogout() }],
            { cancelable: false }
          );
        }
      }
    );
    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, []);

  const [showAppUpdate, setShowAppUpdate] = useState(false);
  useEffect(() => {
    if (config?.appVersion !== undefined) {
      if (config?.appVersion !== Config.appVersion) {
        setShowAppUpdate(true);
      }
    }
  }, [config]);

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [pincodeError, setPincodeError] = useState(false);
  const [showAppReviewCard, setShowAppReviewCard] = useState(true);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [images, setImages] = useState([
    { img: require("../../assets/png/searchBanner1.png"), id: 1 },
    { img: require("../../assets/png/searchBanner2.png"), id: 2 },
    { img: require("../../assets/png/searchBanner3.png"), id: 3 },
  ]);
  const [
    deliveryLocationModalVisible,
    setDeliveryLocationModalVisible,
  ] = useState(false);
  const [
    isHomeScreenLocationAvailable,
    setIsHomeScreenLocationAvailable,
  ] = useState(false);
  const [addressResult, setAddressResult] = useState([]);
  useEffect(() => {
    setLoading(true);
    const initial = async () => {
      await initialFunction();
      await initalCustomerDetails();
      setLoading(false);
    };
    initial();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setRefresh(true);
      getCartItemsApi((res, status) => {
        if (status) {
          setRefresh(false);
        } else {
          setRefresh(false);
        }
      });

      let userID;
      OneSignal.init(oneSignalAppId, {
        kOSSettingsKeyAutoPrompt: true,
      });
      OneSignal.getPermissionSubscriptionState(async (status) => {
        userID = await status.userId;
        var deviceId = DeviceInfo.getUniqueId();
        let getBrand = DeviceInfo.getBrand();
        let version = DeviceInfo.getVersion();
        let model = DeviceInfo.getModel();
        let payload = {
          appVersion: Config.appVersion,
          deviceId: deviceId,
          mobileOS: Platform.OS == "android" ? "android" : "ios",
          phoneModel:
            getBrand + "-" + model + "   StoreBuildVersion-" + version,
          playerId: userID,
        };
        // alert(JSON.stringify(userID, null, "       "));
        console.log(userID, "playerid");

        if (userID) {
          addCustomerDeviceDetails(payload, (res, status) => {});
        }
      });
    }
  }, [isAuthenticated]);
  useEffect(() => {
    console.log(categories);
    setPriorityCategories([]);
    categories.map((el) => {
      if (!(el.categoryName == "VEGETABLES" || el.categoryName == "FRUITS")) {
        setPriorityCategories((e) => [...e, el]);
      } else if (el.categoryName == "VEGETABLES") {
        setFixedCategories((e) => ({ ...e, vegitables: el }));
      } else {
        setFixedCategories((e) => ({ ...e, fruits: el }));
      }
    });
  }, [categories]);
  console.log(fixedCategories, priorityCategories);
  const initialFunction = async () => {
    await getAllCategories((res, status) => {
      if (status) {
        // alert(JSON.stringify(res.data, null, "      "))
        setRefresh(false);
      } else {
        setRefresh(false);
      }
    });
    await getAllBanners((res, status) => {
      if (status) {
        // alert(JSON.stringify(res?.data?.subBanners[0], null, "      "))
        setSubBanners(res?.data?.subBanners[0]);
        setRefresh(false);
      } else {
        setRefresh(false);
      }
    });
    await getPriceChopList((res, status) => {
      console.log(res?.data?.length, "resss");
      if (status) {
        if (res?.data?.length > 0) {
          setShowPriceChopIcon(true);
        } else {
          setShowPriceChopIcon(false);
        }
        setRefresh(false);
      } else {
        setRefresh(false);
      }
    });
  };

  useEffect(() => {
    if (userLocation?.lat) {
      setPincodeError(false);
    }
  }, [userLocation]);

  useEffect(() => {
    if (homeScreenLocation?.lat) {
      const latitude = -18.406655;
      const longitude = 46.40625;

      appsFlyer.logLocation(
        homeScreenLocation?.lon,
        homeScreenLocation?.lat,
        (err, coords) => {
          if (err) {
            console.error(err);
          } else {
            //...
          }
        }
      );
      analytics().logEvent("location", {
        longitude: homeScreenLocation?.lon,
        latitude: homeScreenLocation?.lat,
      });
      // .then((res) => console.log("firebase_location_event"));
      setTimeout(() => {
        setDeliveryLocationModalVisible(false);
      }, 1000);
      isPincodeServiceable(
        homeScreenLocation?.lat,
        homeScreenLocation?.lon,
        (res, status) => {
          if (status) {
            setPincodeError(false);
          } else {
            setPincodeError(true);
          }
        }
      );
    }
  }, [homeScreenLocation?.lat]);
  useEffect(() => {
    if (homeScreenLocation?.lat) {
      setDeliveryLocationModalVisible(false);
      // setAddressModalVisible(false)
    }
  }, [homeScreenLocation?.lat]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      checkForHomescreenLocationAddress();
    });
    return unsubscribe;
    // Return the function to unsubscribe from the event so it gets removed on unmount
  }, [navigation]);

  const checkForHomescreenLocationAddress = async () => {
    let isHomeScreenLocationAvailable = await AsyncStorage.getItem(
      "homeScreenLocation"
    );
    if (!isHomeScreenLocationAvailable) {
      if (
        homeScreenLocation?.lat == undefined ||
        homeScreenLocation?.lat == ""
      ) {
        await CheckPermissions(async (status) => {
          if (!status)
            return await getAllUserAddress(async (response, status) => {
              if (status) {
                let newArray = [];
                await response?.data?.forEach((el, index) => {
                  if (el?.isActive) newArray.push(el);
                });
                if (newArray?.length > 0) {
                  setAddressModalVisible(true);
                } else {
                  setDeliveryLocationModalVisible(true);
                }
              } else {
                setDeliveryLocationModalVisible(true);
              }
            });
          return await getCurrentPosition();
        }, false);
      } else {
        setDeliveryLocationModalVisible(false);
      }
    }
  };
  const getCurrentPosition = async () => {
    console.log("geoloaction api hit");

    Geolocation.getCurrentPosition(
      async (position) => {
        geocodeing(position.coords.latitude, position.coords.longitude)
          .then((response) => {
            response.json().then(async (json) => {
              let postal_code = json?.results?.[0]?.address_components?.find(
                (o) =>
                  JSON.stringify(o.types) == JSON.stringify(["postal_code"])
              );
              let address_components = json?.results?.[0].address_components;
              let value = address_components.filter((product) =>
                product.types.some(
                  (item) =>
                    item === "route" ||
                    item === "sublocality_level_1" ||
                    item === "sublocality_level_2" ||
                    item === "locality" ||
                    item === "administrative_area_level_2" ||
                    item === "administrative_area_level_1" ||
                    item === "postal_code" ||
                    item === "country"
                )
              );
              await setAddressResult(value);
              // console.log("addressResultaddressResultaddressResult", addressResult)
              let address = addressResult.map((el, index) => {
                return el.long_name;
              });
              addHomeScreenLocation({
                addressLine_1: address.toString(),
                pincode: postal_code?.long_name,
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              });
              // await this.setLocation(json?.results?.[2]?.formatted_address, position.coords.latitude, position.coords.longitude, postal_code?.long_name)
              isPincodeServiceable(
                position.coords.latitude,
                position.coords.longitude,
                (res, status) => {
                  if (status) {
                  } else {
                    setPincodeError(true);
                  }
                }
              );
            });
          })
          .catch((err) => {
            console.warn(err);
            if (Platform.OS == "android") {
              checkForLocationAccess();
            }
          });
      },
      (error) => {
        if (
          error?.message == "Location permission was not granted." ||
          error?.message == "Location services disabled." ||
          error?.message == "User denied access to location services."
        ) {
          // navigation.navigate('AccessPermissionScreen')
        }
        console.warn(error);
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  };

  const onRefresh = () => {
    setRefresh(true);
    // getCurrentPosition()
    initialFunction();
  };

  const onPressLogout = async () => {
    await onLogout();
    removeOnBoardKey();
  };
  const onPressUpdate = () => {
    if (Platform.OS == "ios") {
      Linking.canOpenURL(
        "itms-apps://itunes.apple.com/us/app/apple-store/id1541056118?mt=8"
      ).then((supported) => {
        if (supported) {
          Linking.openURL(
            "itms-apps://itunes.apple.com/us/app/apple-store/id1541056118?mt=8"
          );
        } else {
          Linking.openURL("https://apps.apple.com/in/app/zasket/id1541056118");
          console.warn("Don't know how to open URI");
        }
      });
    }
    if (Platform.OS == "android") {
      Linking.canOpenURL("market://details?id=com.zasket").then((supported) => {
        if (supported) {
          Linking.openURL("market://details?id=com.zasket");
        } else {
          console.warn("Don't know how to open URI");
        }
      });
    }
  };
  const rateNow = async () => {
    onPressUpdate();
    // try {
    //     const isAvailable = await InAppReview.isAvailable
    //     if (!isAvailable) {
    //         onPressUpdate()
    //         return;
    //     }
    //     InAppReview.RequestInAppReview();
    // } catch (e) { }
  };
  useEffect(() => {
    // alert(cartItems.length)
    // alert(JSON.stringify(cartItems, null, "     "))
    if (cartItems.length > 0) {
      initialBillingFunction();
    }
  }, [cartItems]);

  const initialBillingFunction = async () => {
    let itemCreateRequests = [];
    let validateOrders = {
      // itemCreateRequests,
      useWallet: false,
    };
    await cartItems?.forEach((el, index) => {
      itemCreateRequests.push({
        itemId: el?.id,
        quantity: el?.count,
        // "totalPrice": el?.discountedPrice * el?.count,
        // "unitPrice": el?.discountedPrice
      });
    });
    // console.log("allll", JSON.stringify(validateOrder, null, "      "))
    // alert(JSON.stringify(validateOrder, null, "      "))
    getBillingDetails(validateOrders, async (res, status) => {
      if (status) {
        // console.log(
        //   "getorderssssssss",
        //   JSON.stringify(res.data, null, "      ")
        // );
        // setLoading(false);
        setRefresh(false);
      } else {
        setRefresh(false);
        // setLoading(false);
      }
    });
  };
  const shareBanner = (id) => {
    alert(id);
  };
  const moreShare = async (imagePath, shareMessage) => {
    // alert(shareMessage)
    // return
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
    await toDataURL(imagePath).then(async (dataUrl) => {
      let split = dataUrl.split("base64,");
      // await setbase64Image(split[1])
      let shareImage = {
        title: "Zasket", //string
        message: `${shareMessage}: ` + dynamicLink,
        url: `data:image/png;base64,${split[1]}`,
      };
      // alert(JSON.stringify(shareImage, null, "            "))
      Share.open(shareImage)
        .then((res) => {})
        .catch((err) => {});
    });
  };
  // const { productId } = route?.params;

  const OnPressWhatsUpGrups = (Url) => {
    Linking.openURL(Url);
    setIsVisible(false);
    setModelSwip("up");
    // alert(Url)
    // Linking.openURL('whatsapp://send?text=' + this.state.msg + '&phone=91' + this.state.mobile_no);
    // if (Platform.OS == "android") {
    // Linking.canOpenURL('https://chat.whatsapp.com/I6YikomYujr0v9b9JeI2wp').then(supported => {
    //     if (supported) {

    //     } else {
    //         // alert("nott")
    //         console.warn("Don't know how to open URI");
    //     }
    // });
    // }
  };

  const OnPressWhatsUpIcon = () => {
    Alert.alert("No whatsApp group found for your store parner.");
  };

  const onPressWhatsApp = () => {
    setIsVisible(true);
    setModelSwip("down");
  };

  // rendering image item for the corousel after category section
  const renderImageItem = (data) => {
    return (
      <View key={data.id} style={styles.item}>
        <Image source={data.img} style={{ height: 100 }} resizeMode="contain" />
      </View>
    );
  };
  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }>
        {/* <Text>{partnerDetails?.partnerStoreName}</Text> */}
        {partnerDetails?.partnerStoreName == "" ||
        partnerDetails?.partnerStoreName == null ||
        partnerDetails?.partnerStoreName == undefined ? (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                flexWrap: "wrap",
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AutoCompleteLocationScreen", {
                    navigateTo: "MapScreenGrabPincode",
                  });
                }}
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <Icon
                  name="location-pin"
                  type="Entypo"
                  style={{ fontSize: 22 }}
                />
                <Text numberOfLines={1} style={{ maxWidth: "50%" }}>
                  {homeScreenLocation?.addressLine_1}
                </Text>
                <Icon
                  name="arrow-drop-down"
                  type="MaterialIcons"
                  style={{ fontSize: 22 }}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 1,
              paddingRight: 2,
            }}>
            <View style={{ width: "60%", paddingLeft: 7 }}>
              <View style={{}}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("AutoCompleteLocationScreen", {
                      navigateTo: "MapScreenGrabPincode",
                    });
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#000000",
                      fontWeight: "bold",
                    }}>
                    <Image
                      style={{
                        height: 14,
                        width: 20,
                      }}
                      resizeMode="center"
                      source={require("../../assets/png/StoreIcon.png")}
                    />
                    {partnerDetails?.partnerStoreName}
                  </Text>
                  <Icon
                    name="arrow-drop-down"
                    type="MaterialIcons"
                    style={{ fontSize: 22 }}
                  />
                </TouchableOpacity>
              </View>

              {/* <TouchableOpacity onPress={() => { onPressWhatsApp() }} style={{ position: "absolute", right: 0, top: 0, height: 50 }}>
                                <Image
                                    style={{ height: 25, }}
                                    resizeMode="center"
                                    source={require('../../assets/png/aaaaaa.png')}
                                />
                            </TouchableOpacity> */}
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("AutoCompleteLocationScreen", {
                      navigateTo: "MapScreenGrabPincode",
                    });
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    marginLeft: 3,
                    marginTop: 2,
                  }}>
                  {/* <Icon name="location-pin" type="Entypo" style={{ fontSize: 22 }} /> */}
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#808080",
                      fontSize: 12.5,
                    }}>
                    {homeScreenLocation?.addressLine_1}
                  </Text>
                  {/* <Icon name="arrow-drop-down" type="MaterialIcons" style={{ fontSize: 22 }} /> */}
                </TouchableOpacity>
              </View>
            </View>
            {partnerDetails?.partnerWhatsappGroupLink == "" ||
            partnerDetails?.partnerWhatsappGroupLink == undefined ||
            partnerDetails?.partnerWhatsappGroupLink == null ? null : (
              // <TouchableOpacity onPress={() => { OnPressWhatsUpIcon() }} style={{ position: "absolute", right: 0, top: 0, height: 50 }}>
              //     <Image
              //         style={{ height: 25, }}
              //         resizeMode="center"
              //         source={require('../../assets/png/aaaaaa.png')}
              //     />
              // </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onPressWhatsApp();
                }}
                style={{ marginRight: 3 }}>
                <Image
                  style={{ height: 40, width: 80, marginHorizontal: 5 }}
                  resizeMode="contain"
                  source={require("../../assets/png/joinwp.png")}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        {pincodeError ? (
          <View
            style={{
              backgroundColor: "#F65C65",
              width: "95%",
              alignSelf: "center",
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 3,
            }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                marginRight: 5,
              }}>
              <Text style={{ color: "white" }}>
                <Icon
                  name="warning"
                  type="AntDesign"
                  style={{ fontSize: 22, color: "white" }}
                />{" "}
                We are not available at this location!
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AutoCompleteLocationScreen", {
                  navigateTo: "MapScreenGrabPincode",
                });
              }}
              style={{
                backgroundColor: "#DD4C55",
                paddingHorizontal: 5,
                paddingVertical: 4,
                borderRadius: 5,
              }}>
              <Text style={{ color: "white" }}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : undefined}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            padding: 10,
            marginTop: 5,
            paddingBottom: 0,
          }}>
          {bannerImages?.map((el, index) => {
            return (
              <>
                {/* <Text>{index}</Text> */}
                <View style={{}} key={el.id.toString()}>
                  <View style={{}}>
                    <View
                      style={{
                        height: 150,
                        width: screenWidth - 50,
                        borderRadius: 5,
                        marginRight: index == 0 ? 18 : 15,
                        marginLeft: index == 0 ? 0 : 2,
                      }}>
                      {el?.imagePath ? (
                        <Image
                          style={{
                            height: 150,
                            width: screenWidth - 50,
                            borderRadius: 5,
                            alignSelf: "center",
                          }}
                          resizeMode={"stretch"}
                          source={{ uri: el?.imagePath }}
                        />
                      ) : null}
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>
                          moreShare(el?.imagePath, el?.shareMessage)
                        }
                        style={{
                          position: "absolute",
                          right: 5,
                          bottom: 2,
                          width: 110,
                          height: 45,
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <View
                          style={{
                            borderRadius: 25,
                            backgroundColor: "#F7F7F7",
                            width: 80,
                            height: 24,
                            justifyContent: "center",
                            alignItems: "center",
                          }}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginHorizontal: 1,
                              padding: 5,
                              justifyContent: "center",
                              alignItems: "center",
                              opacity: 0.8,
                            }}>
                            <FastImage
                              style={{ width: 15, height: 15 }}
                              source={require("../../assets/png/share.png")}
                              resizeMode={FastImage.resizeMode.contain}
                            />
                            <Text
                              style={{
                                marginHorizontal: 2,
                                fontWeight: "bold",
                                fontSize: 15,
                              }}>
                              Share
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            );
          })}
        </ScrollView>
        {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 10, backgroundColor: "blue", flex: 1, justifyContent: "center" }}>
                    {bannerImages?.map((el, index) => {
                        return (
                            <>
                                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "orange", minWidth: 30 }}>
                                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "red", }}>

                                    </View>
                                </View>
                            </>
                        )
                    })}
                </ScrollView> */}
        {/* <View style={{ width: ("100%"), marginRight: 30 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 5 }}>
                        {bannerImages?.map((el, index) => {
                            return (
                                <>
                                    <Image
                                        style={{ height: 150, marginLeft: 7, width: 352, borderRadius: 10, borderRightWidth: 50, alignSelf: 'center', marginRight: bannerImages.length - 1 == index ? 0 : 8 }}
                                        source={{ uri: el?.imagePath }}
                                    />
                                </>
                            )
                        })}
                    </ScrollView> */}
        {/* <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", }}>
                        {bannerImages?.map((el, index) => {
                            return (
                                <>

                                    <View style={{ width: 10, height: 10, backgroundColor: "#e6e6e6", marginRight: 10, borderRadius: 5 }}>
                                    </View>

                                    <View style={{ width: 10, height: 10, backgroundColor: "#505d68", marginRight: 10, borderRadius: 5 }}>
                                    </View>
                                </>
                            )
                        })}
                    </View> */}
        {/* </View> */}
        {subBanners ? (
          <FastImage
            style={{
              borderRadius: 5,
              alignSelf: "center",
              borderRadius: 5,
              backgroundColor: "white",
              height: 125,
              width: "112.5%",
              // aspectRatio: 3,
            }}
            source={subBanners ? { uri: subBanners } : null}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : undefined}
        <View style={{ marginTop: -12 }}>
          {fixedCategories.fruits && fixedCategories.vegitables ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 5,
                padding: 5,
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  navigation.navigate("ProductListScreen", {
                    item: fixedCategories.vegitables,
                  });
                }}
                style={{
                  width: "48.5%",
                  aspectRatio: 167 / 99,
                  position: "relative",
                }}>
                {fixedCategories.vegitables?.categoryTag ? (
                  <>
                    <View
                      style={{
                        height: 18,
                        width: "44%",
                        position: "absolute",
                        backgroundColor: "#7eb517",
                        borderTopRightRadius: 6,
                        borderBottomLeftRadius: 6,
                        alignSelf: "flex-end",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.18,
                        shadowRadius: 1.0,
                        elevation: 0.8,
                        marginRight: -1,
                        // marginTop: -1,
                        justifyContent: "center",
                      }}>
                      <Text
                        style={{
                          fontSize: 9,
                          textAlign: "center",
                          color: "#f7f7f7",
                          fontWeight: "bold",
                        }}>
                        {fixedCategories.vegitables.categoryTag}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View
                    style={{
                      height: 18,
                      width: "58%",
                    }}></View>
                )}
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={require("../../assets/png/freshVegitables.png")}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  navigation.navigate("ProductListScreen", {
                    item: fixedCategories.fruits,
                  });
                }}
                style={{
                  width: "48.5%",
                  aspectRatio: 167 / 99,
                  position: "relative",
                }}>
                {fixedCategories.fruits?.categoryTag ? (
                  <>
                    <View
                      style={{
                        height: 18,
                        width: "44%",
                        position: "absolute",
                        backgroundColor: "#7eb517",
                        borderTopRightRadius: 6,
                        borderBottomLeftRadius: 6,
                        alignSelf: "flex-end",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.18,
                        shadowRadius: 1.0,
                        elevation: 0.8,
                        marginRight: -1,
                        // marginTop: -1,
                        justifyContent: "center",
                      }}>
                      <Text
                        style={{
                          fontSize: 9,
                          textAlign: "center",
                          color: "#f7f7f7",
                          fontWeight: "bold",
                        }}>
                        {fixedCategories.fruits.categoryTag}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View
                    style={{
                      height: 18,
                      width: "58%",
                    }}></View>
                )}
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={require("../../assets/png/freshFruits.png")}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              padding: 5,
              marginTop: 2,
            }}>
            {priorityCategories.length > 0 ? (
              <FlatList
                data={priorityCategories}
                numColumns={3}
                renderItem={({ item }) => (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        navigation.navigate("ProductListScreen", {
                          item: item,
                        });
                      }}
                      style={{
                        // justifyContent: 'center',
                        // flex: 1,
                        minHeight: 100,
                        width: "31%",
                        // alignItems: 'center',
                        margin: 5,
                        // backgroundColor: '#00BCD4'
                      }}>
                      <View
                        style={{
                          backgroundColor: "#F7F7F7",
                          borderRadius: 6,
                          borderColor: "#EDEDED",
                          borderWidth: 1,
                        }}>
                        {item.categoryTag ? (
                          <>
                            <View
                              style={{
                                height: 18,
                                width: "58%",
                                backgroundColor: "#7eb517",
                                borderTopRightRadius: 6,
                                borderBottomLeftRadius: 6,
                                alignSelf: "flex-end",
                                shadowColor: "#000",
                                shadowOffset: {
                                  width: 0,
                                  height: 1,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 1.0,
                                elevation: 0.8,
                                marginRight: -1,
                                marginTop: -1,
                                justifyContent: "center",
                              }}>
                              <Text
                                style={{
                                  fontSize: 9,
                                  textAlign: "center",
                                  color: "#f7f7f7",
                                  fontWeight: "bold",
                                }}>
                                {item.categoryTag}
                              </Text>
                            </View>
                          </>
                        ) : (
                          <View
                            style={{
                              height: 18,
                              width: "58%",
                            }}></View>
                        )}
                        {/* <View style={[styles.categoriesCard, item.categories ? { padding: 9, marginTop: -5 } : undefined]}> */}

                        <View style={{ padding: 10, marginTop: -8 }}>
                          <Image
                            style={{ aspectRatio: 1.3 }}
                            // source={require('../../assets/png/HomeScreenVegetable.png')}
                            resizeMode="contain"
                            source={
                              item?.categoryImage
                                ? { uri: item?.categoryImage }
                                : require("../../assets/png/default.png")
                            }
                          />
                        </View>
                      </View>
                      <Text
                        style={{
                          alignSelf: "center",
                          textAlign: "center",
                          marginVertical: 5,
                          fontWeight: "bold",
                          fontSize: 13,
                        }}>
                        {item?.categoryDisplayName}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                keyExtractor={(item) => item?.id.toString()}
              />
            ) : null}
          </View>
        </View>

        <View style={{ alignItems: "center", flex: 1, marginVertical: 13 }}>
          {/* <SliderBox
                images={images}
                sliderBoxHeight={125}
                circleLoop
                resizeMethod={"resize"}
                resizeMode={"contain"}
                autoplay
                parentWidth={width * 0.95}
                ImageComponent={FastImage}
                ImageComponentStyle={{
                  width: "97%",
                  alignSelf: "center",
                }}
                dotColor={Theme.Colors.primary}
                inactiveDotColor="#fff"
                paginationBoxVerticalPadding={20}
                dotStyle={{
                  width: 7,
                  height: 7,
                  borderRadius: 7,
                  marginHorizontal: 0,
                  padding: 0,
                  margin: 0,
                  backgroundColor: "rgba(128, 128, 128, 0.92)",
                }}
              /> */}

          {/* <Carousel
            pagination={(Pagination, PaginationLight)}
            renderItem={renderImageItem}
            data={images}
            autoplay
            loop
            autoplayInterval={2000}
          /> */}
        </View>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <CategorySectionListItem item={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item?.id.toString()}
        />
        {showAppReviewCard ? (
          <View
            style={{
              width: "90%",
              padding: 15,
              marginVertical: 10,
              backgroundColor: "white",
              alignSelf: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
            }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, justifyContent: "space-evenly" }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Like using our app?
                </Text>
                <Text style={{ color: "#727272", fontSize: 13 }}>
                  Recommend us to others by rating us 5 stars on the play store
                </Text>
              </View>
              <View style={{ backgroundColor: "white" }}>
                <Image
                  style={{ height: 100, width: 80 }}
                  resizeMode="center"
                  source={require("../../assets/png/appReview.png")}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}>
              <TouchableOpacity
                onPress={() => setShowAppReviewCard(false)}
                style={{
                  padding: 10,
                  borderRadius: 4,
                  backgroundColor: "#FDEFEF",
                  width: "47%",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={{ color: "#E1171E", fontSize: 13 }}>
                  No, Thanks
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => rateNow()}
                style={{
                  padding: 10,
                  borderRadius: 4,
                  backgroundColor: "#E1171E",
                  width: "47%",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={{ color: "white", fontSize: 13 }}>
                  Rate the app
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {/* <Text>{JSON.stringify(sectionlistData, null, "      ")} </Text> */}
      </ScrollView>
      <View style={{ position: "relative" }}>
        <CartDown navigation={navigation} />
      </View>
      {showAppUpdate ? (
        <View
          style={{
            height: 55,
            width: "100%",
            backgroundColor: "#F5F5F5",
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <View
            style={{
              flex: 1,
              paddingLeft: 10,
              flexDirection: "row",
              alignItems: "center",
            }}>
            <FeatherIcons name="info" color={"#C8C8C8"} size={18} />
            <Text style={{}}> App update available</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowAppUpdate(false);
            }}
            style={{
              backgroundColor: "#F5F5F5",
              width: 25,
              height: 25,
              borderRadius: 50,
              position: "absolute",
              right: 10,
              top: -10,
              zIndex: 1,
              elevation: 5,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
            }}>
            <Icon name="close" style={{ color: "#AAAAAA", fontSize: 20 }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onPressUpdate();
            }}
            style={{
              margin: 5,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                fontSize: 14,
                color: Theme.Colors.primary,
                fontWeight: "bold",
                marginRight: 10,
              }}>
              UPDATE NOW
            </Text>
          </TouchableOpacity>
        </View>
      ) : undefined}
      {loading ? <Loader /> : undefined}
      <Modal
        isVisible={isVisible}
        onSwipeComplete={() => setIsVisible(false)}
        swipeDirection={modelSwip}
        style={{}}
        onBackButtonPress={() => setIsVisible(false)}
        onBackdropPress={() => setIsVisible(false)}>
        <LinearGradient
          colors={["#16c3a1", "#116c5c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            position: "relative",
            width: "85%",
            height: "50%",
            backgroundColor: "grey",
            alignSelf: "center",
            borderRadius: 6,
            overflow: "visible",
          }}>
          <Image
            source={require("../../assets/png/whatsappcreative.png")}
            style={{
              width: "100%",
              height: "50%",
              position: "absolute",
              top: "-20%",
              //   backgroundColor: "black",
            }}
            // resizeMode="contain"
          />
          <View
            style={{
              marginTop: "35%",
              paddingLeft: 5,
              height: "50%",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 28,
                fontFamily: "Montserrat",
                paddingHorizontal: 10,
                letterSpacing: 0.7,
                marginTop: 10,
              }}>
              Join our{" "}
              <Text style={{ fontSize: 30, color: "#3ce75c" }}>
                WhatsApp Groups For
              </Text>
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 33,
                fontFamily: "Montserrat",
                paddingHorizontal: 10,
                letterSpacing: 0.4,
                marginTop: 5,
              }}>
              Daily Exclusive Offers
            </Text>
          </View>
          <View
            style={{
              height: "25%",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <TouchableOpacity
              style={{
                width: "95%",
                padding: 15,
                borderRadius: 7,
                backgroundColor: "#2bc948",
              }}
              onPress={() => {
                OnPressWhatsUpGrups(partnerDetails?.partnerWhatsappGroupLink);
              }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "center",
                  fontSize: 16,
                }}>
                <Image
                  source={require("../../assets/png/wpicon-white.png")}
                  style={{ width: 16, height: 16, marginRight: 5 }}
                />{" "}
                Join now
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {/* <SafeAreaView
          style={{ height: 165, backgroundColor: "white", borderRadius: 8 }}
        >
          <View style={{ alignSelf: "center", marginTop: -25 }}>
            <Image
              style={{ height: 52, width: 80 }}
              resizeMode="center"
              source={require("../../assets/png/whatsApp.png")}
            />
          </View>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="never"
          >
            <View style={{ flex: 1, width: "90%", alignSelf: "center" }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#000000",
                  textAlign: "center",
                  paddingTop: 18,
                  letterSpacing: 0.4,
                  fontWeight: "bold",
                }}
              >
                Join our partner Whatsapp group {"\n"} for exclusive offers and
                deals
              </Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              OnPressWhatsUpGrups(partnerDetails?.partnerWhatsappGroupLink);
            }}
            style={{
              padding: 14,
              backgroundColor: "#fdefef",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#e1171e",
                fontWeight: "bold",
                fontSize: 17,
                letterSpacing: 0.4,
              }}
            >
              Join Now
            </Text>
          </TouchableOpacity>
        </SafeAreaView> */}
      </Modal>

      <AddressModal
        addressModalVisible={addressModalVisible}
        setAddressModalVisible={(option) => setAddressModalVisible(option)}
        navigation={navigation}
        navigateTo="MapScreenGrabPincode"
      />
      <SetDeliveryLocationModal
        navigation={navigation}
        deliveryLocationModalVisible={deliveryLocationModalVisible}
        setDeliveryLocationModalVisible={(option) =>
          setDeliveryLocationModalVisible(option)
        }
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  categories: state.home.categories,
  bannerImages: state.home.bannerImages,
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
  setShowPriceChopIcon,
  getAllBanners,
  addHomeScreenLocation,
  getCartItemsApi,
  addCustomerDeviceDetails,
})(HomeScreen);
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
