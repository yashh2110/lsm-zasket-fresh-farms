import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import { Container, Content, Icon, Radio, Root, Toast } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal as NativeModal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import appsFlyer from "react-native-appsflyer";
import analytics from "@react-native-firebase/analytics";

import { CheckBox } from "react-native-elements";
import { EventRegister } from "react-native-event-listeners";
import { AppEventsLogger } from "react-native-fbsdk";
import Modal from "react-native-modal";
import RazorpayCheckout from "react-native-razorpay";
import RNUxcam from "react-native-ux-cam";
import { connect } from "react-redux";
import {
  addOrder,
  applyOffer,
  clearCart,
  getAvailableOffers,
  getBillingDetails,
  getV2DeliverySlots,
} from "../../actions/cart";
import { getCustomerDetails, getV2Config } from "../../actions/home";
import { paymentConfirm, rejectPaymentByAPI } from "../../actions/wallet";
import Theme from "../../styles/Theme";
import AddressModal from "../common/AddressModal";
import CustomHeader from "../common/CustomHeader";
import Loader from "../common/Loader";
import { getCustomerOrders } from "../../actions/cart";
RNUxcam.startWithKey("qercwheqrlqze96"); // Add this line after RNUxcam.optIntoSchematicRecordings();
RNUxcam.optIntoSchematicRecordings();
RNUxcam.tagScreenName("Checkout");

const CheckoutScreen = ({
  route,
  getCustomerOrders,
  navigation,
  getCustomerDetails,
  getBillingDetails,
  cartItems,
  getOrdersBillingDetails,
  allUserAddress,
  offerDetails,
  clearCart,
  getV2DeliverySlots,
  addOrder,
  userLocation,
  config,
  applyOffer,
  getAvailableOffers,
  paymentConfirm,
  rejectPaymentByAPI,
}) => {
  const scrollViewRef = useRef();
  const [coupon, setCoupon] = useState("");
  const [totalCartValue, setTotalCartValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nextDayBuffer, setNextDayBuffer] = useState(undefined);
  const [slotTime, setslotTime] = useState(undefined);
  const [savedValue, setSavedValue] = useState(0);
  const [marketPrice, setMarketPrice] = useState(0);
  const [slotsArray, setSlotsArray] = useState([]);
  const [slot, setSlot] = useState({});
  const [disableTomorrowSlot, setDisableTomorrowSlot] = useState(false);
  const [
    paymentSelectionActionScreen,
    setPaymentSelectionActionScreen,
  ] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});
  const [offerPrice, setOfferPrice] = useState(0);
  const [creditOfferPrice, setcreditOfferPrice] = useState(0);
  const [proceedPaymentMethod, setProceedPaymentMethod] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [availableCouponList, setAvailableCouponList] = useState([]);
  const [couponSuccessModal, setCouponSuccessModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [walletCheck, setWalletCheck] = useState(true);
  const [creditBalance, SetCreditBalance] = useState(0);
  const [walletAmount, setWalletAmount] = useState(0);
  const [totalAmountPay, setTotalAmountPay] = useState(0);
  const [loadinggg, setloadinggg] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [count, setCount] = useState(0);
  const [disableCheck, setDisableCheck] = useState(true);
  const [buttonHandle, SetButtonHandle] = useState(false);
  const [walletAmountBalance, SetwalletAmountBalance] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("PREPAID");
  const [OfferCode, setOfferCode] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);

  const totalCartValueRef = useRef(totalCartValue);

  useEffect(() => {
    let listener = EventRegister.addEventListener(
      "successWallet",
      async (data) => {
        initialFunction();
      }
    );
    return () => {
      listener = false;
      EventRegister.removeEventListener("successWallet");
    };
  }, []);

  const setTotalCartValueRef = (newText) => {
    totalCartValueRef.current = newText;
    setTotalCartValue(newText);
  };

  useEffect(() => {
    initialFunction();
    initialGetCustomerOrders();
  }, [cartItems]);
  const initialGetCustomerOrders = async () => {
    getCustomerOrders((res, status) => {
      if (status) {
        setOrderDetails(res?.data);
        setLoading(false);
        // alert(JSON.stringify(res?.data, null, "        "))
      } else {
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    if (getOrdersBillingDetails?.finalPrice == 0) {
      SetButtonHandle(true);
    } else {
      SetButtonHandle(false);
    }
  }, [getOrdersBillingDetails]);
  console.log(getOrdersBillingDetails?.finalPrice, "final_price");

  useEffect(() => {}, []);

  const initialFunction = async () => {
    let productNameArray = [];
    let productIdArray = [];
    let productCountArray = [];
    let categoryArray = [];
    await cartItems?.forEach(async (el, index) => {
      productNameArray.push(el?.itemName);
      productIdArray.push(el?.id);
      productCountArray.push(el?.count);
      categoryArray.push(el?.categoryName);
    });
    let categorys = categoryArray.join(",");
    let removedDuplicateCategors = Array.from(
      new Set(categorys.split(","))
    ).toString();

    if (cartItems.length > 0) {
      setloadinggg(true);
      let coupons = await AsyncStorage.getItem("appliedCoupon");
      let parsedCoupon = await JSON.parse(coupons);
      let appliedCoupon = await parsedCoupon?.offer?.offerCode;
      initialBillingFunction(walletCheck, appliedCoupon);
      getCustomerDetails(async (res, status) => {
        if (status) {
          setWalletCheck(true);
          // alert(getOrdersBillingDetails?.creditUsed)
          // alert(JSON.stringify(res?.data?.customerDetails, null, "       "))
          // alert(JSON.stringify(res?.data?.customerDetails?.creditBalance, null, "       "))
          await AsyncStorage.setItem("userDetails", JSON.stringify(res?.data));
          if (res?.data?.customerDetails?.creditBalance <= 0) {
            // alert("111111111111111")
            setWalletCheck(false);
            setDisableCheck(false);
          }
          SetCreditBalance(res?.data?.customerDetails?.creditBalance);
          // alert(res?.data?.customerDetails?.creditBalance)
          let total = cartItems.reduce(function (sum, item) {
            // alert(JSON.stringify(item, null, "       "))
            setDiscountedPrice(item.discountedPrice);
            setCount(item.count);
            return sum + item.discountedPrice * item.count;
          }, 0);
          if (getOrdersBillingDetails?.finalPrice == 0) {
            SetButtonHandle(true);
          } else {
            SetButtonHandle(false);
          }
          setloadinggg(false);
        } else {
          setloadinggg(false);
          setUserDetails({});
          // setRefresh(false)
        }
      });

      let total = cartItems.reduce(function (sum, item) {
        return sum + item.discountedPrice * item.count;
      }, 0);
      setTotalCartValueRef(total);

      let saved = cartItems.reduce(function (sum, item) {
        return sum + (item.actualPrice - item.discountedPrice) * item.count;
      }, 0);
      setSavedValue(saved);

      // alert(totalAmountPay)

      let marketPriceValue = cartItems.reduce(function (sum, item) {
        return sum + item.actualPrice * item.count;
      }, 0);

      setMarketPrice(marketPriceValue);
    } else {
      setTotalCartValueRef(0);
      setSavedValue(0);
      setloadinggg(false);
    }
  };

  const initialBillingFunction = async (wallet, offerCode) => {
    let itemCreateRequests = [];
    let validateOrders = {
      // itemCreateRequests,
      useWallet: wallet,
      offerCode: offerCode ? offerCode : undefined,
    };
    await cartItems?.forEach((el, index) => {
      itemCreateRequests.push({
        itemId: el?.id,
        quantity: el?.count,
        // "totalPrice": el?.discountedPrice * el?.count,
        // "unitPrice": el?.discountedPrice
      });
    });

    // alert(JSON.stringify(validateOrders, null, "      "))
    getBillingDetails(validateOrders, async (res, status) => {
      if (status) {
        // alert(JSON.stringify(res.data, null, "      "))
      } else {
      }
    });
  };

  useEffect(() => {
    if (totalCartValue > 0) {
      getAvailableOffers(totalCartValue, (res, status) => {
        if (status) {
          // alert(JSON.stringify(res.data, null, "     "))
          // let newArray = []
          // res?.data?.forEach((el, index) => {
          //     if (el?.isEligible) newArray.push(el)
          // })
          setAvailableCouponList(res?.data);
        } else {
          // alert(JSON.stringify(res, null, "     "))
        }
      });
    }
  }, [totalCartValue]);

  useEffect(() => {
    getV2DeliverySlots(
      4,
      userLocation?.lat,
      userLocation?.lon,
      (res, status) => {
        if (status) {
          // alert(JSON.stringify(res?.data, null, "    "))
          setSlotsArray(res?.data);
        } else {
          setSlotsArray([]);
        }
      }
    );
  }, [userLocation]);

  useEffect(() => {
    // alert(JSON.stringify(slotsArray, null, "         "))

    for (var i = 0; i < slotsArray?.length; i++) {
      if (slotsArray[i]?.availableOrdersCount > 0) {
        setNextDayBuffer(slotsArray[i]?.nextDayBuffer);
        setslotTime(slotsArray[i]?.description);
        // alert(slotsArray[i]?.nextDayBuffer)
        break;
      }
    }
    // slotsArray?.map((el, index) => {
    //     if (el?.availableOrdersCount > 0) {
    //         setNextDayBuffer(el?.nextDayBuffer)
    //         return false
    //     }
    // })
  }, [slotsArray]);

  useEffect(() => {
    if (slotsArray?.length > 0) {
      slotsArray?.forEach((el, index) => {
        if (el?.nextDayBuffer == nextDayBuffer) {
          setSlot(el);
        }
      });
    }
    var today = new Date();
    var hour = today.getHours();
    if (hour >= config?.nextDayDeliveryCutOff) {
      setDisableTomorrowSlot(true);
      let newArray = slotsArray.slice(1);
      for (var i = 0; i < newArray?.length; i++) {
        if (newArray[i]?.availableOrdersCount > 0) {
          setNextDayBuffer(newArray[i]?.nextDayBuffer);
          setslotTime(slotsArray[i]?.description);

          break;
        }
      }
    }
  }, [userLocation, slotsArray]);

  useEffect(() => {
    if (slotsArray?.length > 0) {
      slotsArray?.forEach((el, index) => {
        if (el?.nextDayBuffer == nextDayBuffer) {
          setSlot(el);
        }
      });
    }
  }, [nextDayBuffer]);

  useEffect(() => {
    getV2Config((res, status) => {});

    var today = new Date();
    var hour = today.getHours();
    if (hour >= config?.nextDayDeliveryCutOff) {
      // alert(hour)
      setDisableTomorrowSlot(true);

      let newArray = slotsArray.slice(1);
      for (var i = 0; i < newArray?.length; i++) {
        if (newArray[i]?.availableOrdersCount > 0) {
          setNextDayBuffer(newArray[i]?.nextDayBuffer);
          setslotTime(slotsArray[i]?.description);

          break;
        }
      }
    }
  }, []);

  const onClearCart = async () => {
    clearCart();
  };

  const onPressSlot = (option) => {
    setNextDayBuffer(option);
    setslotTime(slotsArray[option]?.description);
    // alert(slotsArray[option]?.description)
  };

  const onPressMakePayment = async () => {
    if (config?.enableCOD) {
      setPaymentSelectionActionScreen(true);
    } else {
      onSelectPaymentMethod("PREPAID");
    }
  };
  const onPressSelectAddress = () => {
    let newArray = [];
    allUserAddress?.forEach((el, index) => {
      if (el?.isActive) newArray.push(el);
    });
    if (newArray?.length > 0) {
      setAddressModalVisible(true);
    } else {
      navigation.navigate("AutoCompleteLocationScreen", {
        navigateTo: "MapScreen",
        fromScreen: "AddNew_SCREEN",
        backToCheckoutScreen: "CheckoutScreen",
      });
    }
  };
  const onPressContinue = async () => {
    await setLoading(true);
    if (config?.enableCOD) {
      if (selectedPaymentMethod == "PREPAID") {
        await onSelectPaymentMethod("PREPAID");
      } else if (selectedPaymentMethod == "COD") {
        await onSelectPaymentMethod("COD");
      }
    } else {
      await onSelectPaymentMethod("PREPAID");
    }
  };
  console.log(buttonHandle);
  const onSelectPaymentMethod = async (option) => {
    // alert(JSON.stringify(cartItems, null, "      "))
    let itemCreateRequests = [];
    let productNameArray = [];
    let productIdArray = [];
    let productCountArray = [];
    let categoryArray = [];
    await cartItems?.forEach((el, index) => {
      itemCreateRequests.push({
        itemId: el?.id,
        quantity: el?.count,
        // "totalPrice": el?.discountedPrice * el?.count,
        // "unitPrice": el?.discountedPrice
      });
      productNameArray.push(el?.itemName);
      productIdArray.push(el?.id);
      productCountArray.push(el?.count);
      categoryArray.push(el?.categoryName);
    });
    let categorys = categoryArray.join(",");
    let removedDuplicateCategors = Array.from(
      new Set(categorys.split(","))
    ).toString();
    // alert(JSON.stringify(itemCreateRequests, null, "      "))
    let userLocation = await AsyncStorage.getItem("location");
    let parsedUserLocation = await JSON.parse(userLocation);
    let payload = {
      billingAddressId: parsedUserLocation?.id,
      deliverySlotId: slot?.id,
      itemCreateRequests: itemCreateRequests,
      nextDayBuffer: nextDayBuffer,
      offerId:
        selectedOffer?.offer?.id > 0 ? selectedOffer?.offer?.id : undefined,
      itemTotalValue: getOrdersBillingDetails?.discountedPrice,
      couponDiscount: getOrdersBillingDetails?.couponDiscount,
      walletAmount: getOrdersBillingDetails?.creditUsed,
      totalPayableAmount: getOrdersBillingDetails?.finalPrice,
      useWallet: walletCheck ? true : false,
    };
    if (option === "COD") {
      let codPayload = {
        ...payload,
        paymentMethod: "COD",
      };
      addOrder(codPayload, async (res, status) => {
        setLoading(false);
        if (res?.data?.canBeOrdered == true) {
          if (status) {
            setPaymentSelectionActionScreen(false);
            onClearCart();
            await AsyncStorage.removeItem("appliedCoupon");
            navigation.pop();
            AppEventsLogger.logPurchase(totalCartValue, "INR", {
              param: "value",
            });
            const afEventParams = {
              af_revenue: getOrdersBillingDetails?.finalPrice * 0.2,
              af_price: getOrdersBillingDetails?.finalPrice,
              af_content: productNameArray.join(","),
              af_content_id: productIdArray.join(","),
              af_content_type: removedDuplicateCategors,
              af_currency: "INR",
              af_quantity: productCountArray.join(","),
              af_order_id: res?.data?.orderId,
              af_receipt_id: res?.data?.orderId,
            };
            const firebaseEventParams = {
              revenue: getOrdersBillingDetails?.finalPrice * 0.2,
              price: getOrdersBillingDetails?.finalPrice,
              content: productNameArray.join(","),
              content_id: productIdArray.join(","),
              content_type: removedDuplicateCategors,
              currency: "INR",
              quantity: productCountArray.join(","),
              order_id: res?.data?.orderId,
              receipt_id: res?.data?.orderId,
            };
            navigation.navigate("PaymentSuccessScreen", {
              date: nextDayBuffer,
              slotTime: slotTime,
              firebaseEventParams: firebaseEventParams,
              afEventParams: afEventParams,
            });
            EventRegister.emit("successWallet", "it works!!!");
          } else {
            if (res?.response?.data?.description) {
              Toast.show({
                text: res?.response?.data?.description,
                type: "danger",
                duration: 3000,
                buttonStyle: { backgroundColor: "#a52f2b" },
              });
            }
          }
        } else {
          Toast.show({
            text: res?.data?.comment,
            type: "danger",
            duration: 3000,
            buttonStyle: { backgroundColor: "#a52f2b" },
          });
        }
      });
    } else if (option == "PREPAID") {
      // alert(JSON.stringify(payload, null, "     "))
      let prepaidPayload = {
        ...payload,
        paymentMethod: "PREPAID",
      };
      addOrder(prepaidPayload, async (res, status) => {
        setLoading(false);
        if (status) {
          // alert(JSON.stringify(res null, "     "))
          // return
          console.log(res.data, "final_data");
          if (res?.data?.canBeOrdered == true) {
            if (res?.data?.finalPrice == 0) {
              if (status) {
                setPaymentSelectionActionScreen(false);
                onClearCart();
                await AsyncStorage.removeItem("appliedCoupon");
                navigation.pop();
                AppEventsLogger.logPurchase(totalCartValue, "INR", {
                  param: "value",
                });
                const afEventParams = {
                  af_revenue: getOrdersBillingDetails?.finalPrice * 0.2,
                  af_price: getOrdersBillingDetails?.finalPrice,
                  af_content: productNameArray.join(","),
                  af_content_id: productIdArray.join(","),
                  af_content_type: removedDuplicateCategors,
                  af_currency: "INR",
                  af_quantity: productCountArray.join(","),
                  af_order_id: res?.data?.orderId,
                  af_receipt_id: res?.data?.orderId,
                };
                const firebaseEventParams = {
                  revenue: getOrdersBillingDetails?.finalPrice * 0.2,
                  price: getOrdersBillingDetails?.finalPrice,
                  content: productNameArray.join(","),
                  content_id: productIdArray.join(","),
                  content_type: removedDuplicateCategors,
                  currency: "INR",
                  quantity: productCountArray.join(","),
                  order_id: res?.data?.orderId,
                  receipt_id: res?.data?.orderId,
                };

                navigation.navigate("PaymentSuccessScreen", {
                  date: nextDayBuffer,
                  slotTime: slotTime,
                  firebaseEventParams: firebaseEventParams,
                  afEventParams: afEventParams,
                });
                EventRegister.emit("successWallet", "it works!!!");
              } else {
                // if (_DEV_) {
                //     alert(JSON.stringify(res?.response))
                // }
                if (res?.response?.data?.description) {
                  Toast.show({
                    text: res?.response?.data?.description,
                    type: "danger",
                    duration: 3000,
                    buttonStyle: { backgroundColor: "#a52f2b" },
                  });
                }
              }
            } else {
              setPaymentSelectionActionScreen(false);
              let userDetails = await AsyncStorage.getItem("userDetails");
              let parsedUserDetails = await JSON.parse(userDetails);
              var options = {
                description: "Select the payment method",
                image:
                  "https://d26w0wnuoojc4r.cloudfront.net/zasket_logo_3x.png",
                currency: "INR",
                key: config?.razorpayApiKey,
                amount: totalAmountPay,
                name: "Zasket",
                order_id: res?.data?.paymentOrderId, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
                prefill: {
                  // email: parsedUserDetails?.customerDetails?.userEmail,
                  contact: parsedUserDetails?.customerDetails?.userMobileNumber,
                  name: parsedUserDetails?.customerDetails?.name,
                },
                theme: { color: Theme.Colors.primary },
              };
              RazorpayCheckout.open(options)
                .then(async (data) => {
                  let paymentInfo = {
                    paymentType: "ORDER",
                    razorpayPaymentId: data.razorpay_payment_id,
                    razorpaySignature: data.razorpay_signature,
                    zasketPaymentOrderId: res?.data?.paymentOrderId,
                  };
                  paymentConfirm(paymentInfo, (response, status) => {
                    if (status) {
                      onClearCart();
                      AsyncStorage.removeItem("appliedCoupon");
                      navigation.pop();

                      AppEventsLogger.logPurchase(500.0, "INR", {
                        param: "value",
                      });
                      const afEventParams = {
                        af_revenue: getOrdersBillingDetails?.finalPrice * 0.2,
                        af_price: getOrdersBillingDetails?.finalPrice,
                        af_content: productNameArray.join(","),
                        af_content_id: productIdArray.join(","),
                        af_content_type: removedDuplicateCategors,
                        af_currency: "INR",
                        af_quantity: productCountArray.join(","),
                        af_order_id: res?.data?.orderId,
                        af_receipt_id: res?.data?.orderId,
                      };
                      const firebaseEventParams = {
                        revenue: getOrdersBillingDetails?.finalPrice * 0.2,
                        price: getOrdersBillingDetails?.finalPrice,
                        content: productNameArray.join(","),
                        content_id: productIdArray.join(","),
                        content_type: removedDuplicateCategors,
                        currency: "INR",
                        quantity: productCountArray.join(","),
                        order_id: res?.data?.orderId,
                        receipt_id: res?.data?.orderId,
                      };
                      navigation.navigate("PaymentSuccessScreen", {
                        date: nextDayBuffer,
                        slotTime: slotTime,
                        firebaseEventParams: firebaseEventParams,
                        afEventParams: afEventParams,
                      });
                    } else {
                      Toast.show({
                        text: "Payment failed",
                        buttonText: "Okay",
                        type: "danger",
                        buttonStyle: { backgroundColor: "#a52f2b" },
                      });
                    }
                  });
                  // navigation.navigate('AccountStack', { screen: 'MyOrders' })
                })
                .catch((error) => {
                  // alert("failllllllllll")
                  let paymentInfo = {
                    paymentType: "ORDER",
                    zasketPaymentOrderId: res?.data?.paymentOrderId,
                  };
                  rejectPaymentByAPI(paymentInfo, (res, status) => {
                    if (status) {
                      Toast.show({
                        text: "Payment failed",
                        buttonText: "Okay",
                        type: "danger",
                        buttonStyle: { backgroundColor: "#a52f2b" },
                      });
                    } else {
                      Toast.show({
                        text: "Payment failed",
                        buttonText: "Okay",
                        type: "danger",
                        buttonStyle: { backgroundColor: "#a52f2b" },
                      });
                    }
                  });
                });
            }
          } else {
            Toast.show({
              text: res?.data?.comment,
              type: "danger",
              duration: 3000,
              buttonStyle: { backgroundColor: "#a52f2b" },
            });
          }
        } else {
          setLoading(false);
          if (res?.response?.data?.description) {
            Toast.show({
              text: res?.response?.data?.description,
              type: "danger",
              duration: 3000,
              buttonStyle: { backgroundColor: "#a52f2b" },
            });
          }
          // if (__DEV__) {
          //     alert(JSON.stringify(res?.response, null, "        "))
          // }
          let errorItems = [];
          if (res?.response?.data?.length > 0) {
            if (cartItems.length > 0) {
              res?.response?.data?.forEach((resEl, resIndex) => {
                cartItems?.forEach((cartEl, cartIndex) => {
                  if (cartEl?.id == resEl?.id) {
                    errorItems.push(cartEl?.itemName);
                  }
                });
              });
            }
            alert(
              errorItems.toString() +
                " are requested more than available quantity"
            );
          }
        }
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      let offerDetail = await AsyncStorage.getItem("appliedCoupon");
      let parsedCouponDetails = await JSON.parse(offerDetail);
      if (parsedCouponDetails !== null) {
        if (parsedCouponDetails?.offer?.offerCode) {
          onPressApplyCoupon(
            parsedCouponDetails?.offer?.offerCode,
            totalCartValueRef.current,
            false
          );
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //     if (totalCartValue > config?.freeDeliveryMinOrder) {
  //         if (offerPrice > 0) {
  //             onPressApplyCoupon()
  //         } else {
  //             removeOffer()
  //         }
  //     } else {
  //         removeOffer()
  //     }
  // }, [totalCartValue])

  const onPressApplyCoupon = async (
    option = undefined,
    optionalTotalCartValue = undefined,
    showAlert = true
  ) => {
    setCouponLoading(true);
    let couponValue = option ? option : coupon;
    let cartValue = optionalTotalCartValue
      ? optionalTotalCartValue
      : totalCartValue;
    applyOffer(couponValue, cartValue, async (res, status) => {
      if (status) {
        setCouponLoading(false);
        // alert(JSON.stringify(res?.data, null, "     "))
        // return
        if (res?.data?.isEligible) {
          setAppliedCoupon(res?.data);
          if (showAlert) {
            setCouponSuccessModal(true);
          }
          setOfferPrice(res?.data?.offerPrice);
          // alert(JSON.stringify(res?.data, null, "     "))
          setSelectedOffer(res?.data);
          setCouponModalVisible(false);
          setCouponLoading(false);
          let coupons = await AsyncStorage.getItem("appliedCoupon");
          let parsedCoupon = await JSON.parse(coupons);
          let appliedCoupon = await parsedCoupon?.offer?.offerCode;
          setOfferCode(appliedCoupon);
          initialBillingFunction(walletCheck, appliedCoupon);
        } else {
          // alert(res?.data?.comments)
          removeOffer();
          if (showAlert) {
            Toast.show({
              text: res?.data?.comments,
              buttonText: "Okay",
              type: "danger",
              duration: 3000,
              buttonStyle: { backgroundColor: "#a52f2b" },
            });
          }
        }
      } else {
        if (__DEV__) {
          alert(JSON.stringify(res.response, null, "     "));
        }
        setCouponLoading(false);
        removeOffer();
        if (showAlert) {
          Toast.show({
            text: res?.response?.comments,
            buttonText: "Okay",
            type: "danger",
          });
        }
      }
    });
  };
  const removeOffer = async () => {
    setOfferPrice(0);
    setOfferCode("");
    setCoupon("");
    setSelectedOffer([]);
    await AsyncStorage.removeItem("appliedCoupon");
    initialBillingFunction(walletCheck, "");
  };

  const onPressCheckbox = async () => {
    if (walletCheck == true) {
      // let coupons = await AsyncStorage.getItem('appliedCoupon');
      // let parsedCoupon = await JSON.parse(coupons);
      // let appliedCoupon = await parsedCoupon?.offer?.offerCode
      await initialBillingFunction(false, OfferCode);
      setWalletCheck(false);

      // if (getOrdersBillingDetails?.finalPrice == 0) {
      //     SetButtonHandle(true)
      // } else {
      //     SetButtonHandle(false)

      // }
    } else {
      // let coupons = await AsyncStorage.getItem('appliedCoupon');
      // let parsedCoupon = await JSON.parse(coupons);
      // let appliedCoupon = await parsedCoupon?.offer?.offerCode
      await initialBillingFunction(true, OfferCode);
      setWalletCheck(true);

      // if (getOrdersBillingDetails?.finalPrice == 0) {
      //     SetButtonHandle(true)
      // } else {
      //     SetButtonHandle(false)

      // }
    }
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {/* <Text>{getOrdersBillingDetails?.finalPrice}</Text> */}
        <CustomHeader
          navigation={navigation}
          title={"Checkout"}
          showSearch={false}
        />
        {/* <Text>{getOrdersBillingDetails?.discountedPrice}</Text> */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, backgroundColor: "#F8F8F8" }}
          showsVerticalScrollIndicator={false}>
          {/* <Text style={{ textAlign: 'center', marginBottom: 16, backgroundColor: "red" }}>{JSON.stringify(orderDetails.length, null, "       ")} </Text> */}

          <View
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              paddingVertical: 10,
              paddingHorizontal: 16,
              marginTop: 10,
            }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Theme.Colors.primary,
                backgroundColor: "#FDEFEF",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require("../../assets/png/locationIcon.png")}
              />
            </View>
            <View
              style={{ flex: 1, paddingLeft: 10, justifyContent: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {userLocation?.saveAs == "Home" && (
                    <View
                      style={{
                        backgroundColor: "#FEF8FC",
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: "#FCD8EC",
                        paddingVertical: 3,
                        marginRight: 5,
                      }}>
                      <Text
                        style={{
                          color: "#F464AD",
                          fontSize: 12,
                          marginHorizontal: 5,
                        }}>
                        Home
                      </Text>
                    </View>
                  )}
                  {userLocation?.saveAs == "Office" && (
                    <View
                      style={{
                        backgroundColor: "#FCF5FF",
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: "#F0D4FA",
                        paddingVertical: 3,
                        marginRight: 5,
                      }}>
                      <Text
                        style={{
                          color: "#CD64F4",
                          fontSize: 12,
                          marginHorizontal: 5,
                        }}>
                        Office
                      </Text>
                    </View>
                  )}
                  {userLocation?.saveAs == "Others" && (
                    <View
                      style={{
                        backgroundColor: "#EDF5FF",
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: "#BEDCFF",
                        paddingVertical: 3,
                        marginRight: 5,
                      }}>
                      <Text
                        style={{
                          color: "#64A6F4",
                          fontSize: 12,
                          marginHorizontal: 5,
                        }}>
                        Others
                      </Text>
                    </View>
                  )}
                  {/* <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Deliver to {
                                    ((userLocation?.recepientName).length > 13) ?
                                        (((userLocation?.recepientName).substring(0, 13 - 3)) + '...') :
                                        userLocation?.recepientName
                                } </Text> */}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    onPressSelectAddress();
                  }}
                  style={{}}>
                  <Text
                    style={{ color: Theme.Colors.primary, fontWeight: "bold" }}>
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 5, flexDirection: "row" }}>
                {userLocation?.houseNo ? (
                  <>
                    <Text
                      style={{
                        color: "#909090",
                        fontSize: 13,
                        marginRight: 5,
                      }}>
                      {userLocation?.houseNo}
                    </Text>
                  </>
                ) : undefined}

                {userLocation?.landmark ? (
                  <>
                    <Text style={{ color: "#909090", fontSize: 13 }}>
                      {userLocation?.landmark}
                    </Text>
                  </>
                ) : undefined}
              </View>
              <Text
                numberOfLines={2}
                style={{ color: "#909090", fontSize: 13 }}>
                {userLocation?.addressLine_1}{" "}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 5,
              paddingHorizontal: 16,
              marginTop: 10,
              paddingBottom: 10,
            }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Book a slot
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
                height: 60,
              }}>
              {disableTomorrowSlot ? (
                <View
                  style={{
                    padding: 10,
                    minWidth: 70,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#EFEFEF",
                    backgroundColor: "#F1F1F1",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#727272", fontSize: 12 }}>
                    Tomorrow
                  </Text>
                  <Text
                    style={{
                      color: "#727272",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}>
                    {moment().add(1, "days").format("DD MMM")}{" "}
                  </Text>
                </View>
              ) : slotsArray[0]?.availableOrdersCount > 0 ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    onPressSlot(0);
                  }}
                  style={{
                    padding: 10,
                    minWidth: 70,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor:
                      nextDayBuffer == 0 ? Theme.Colors.primary : "#EFEFEF",
                    backgroundColor: nextDayBuffer == 0 ? "#FDEFEF" : "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#727272", fontSize: 12 }}>
                    Tomorrow
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    {moment().add(1, "days").format("DD MMM")}{" "}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    padding: 10,
                    minWidth: 70,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#EFEFEF",
                    backgroundColor: "#F1F1F1",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#727272", fontSize: 12 }}>
                    Tomorrow
                  </Text>
                  <Text
                    style={{
                      color: "#727272",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}>
                    {moment().add(1, "days").format("DD MMM")}{" "}
                  </Text>
                </View>
              )}
              {slotsArray[1]?.availableOrdersCount > 0 ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    onPressSlot(1);
                  }}
                  style={{
                    padding: 10,
                    minWidth: 70,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor:
                      nextDayBuffer == 1 ? Theme.Colors.primary : "#EFEFEF",
                    backgroundColor: nextDayBuffer == 1 ? "#FDEFEF" : "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#727272", fontSize: 12 }}>
                    {moment().add(2, "days").format("ddd")}{" "}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    {moment().add(2, "days").format("DD MMM")}{" "}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    padding: 10,
                    minWidth: 70,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#EFEFEF",
                    backgroundColor: "#F1F1F1",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#727272", fontSize: 12 }}>
                    {moment().add(2, "days").format("ddd")}{" "}
                  </Text>
                  <Text
                    style={{
                      color: "#727272",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}>
                    {moment().add(2, "days").format("DD MMM")}{" "}
                  </Text>
                </View>
              )}
              {slotsArray[2]?.availableOrdersCount > 0 ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    onPressSlot(2);
                  }}
                  style={{
                    padding: 10,
                    minWidth: 70,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor:
                      nextDayBuffer == 2 ? Theme.Colors.primary : "#EFEFEF",
                    backgroundColor: nextDayBuffer == 2 ? "#FDEFEF" : "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#727272", fontSize: 12 }}>
                    {moment().add(3, "days").format("ddd")}{" "}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    {moment().add(3, "days").format("DD MMM")}{" "}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    padding: 10,
                    minWidth: 70,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#EFEFEF",
                    backgroundColor: "#F1F1F1",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#727272", fontSize: 12 }}>
                    {moment().add(3, "days").format("ddd")}{" "}
                  </Text>
                  <Text
                    style={{
                      color: "#727272",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}>
                    {moment().add(3, "days").format("DD MMM")}{" "}
                  </Text>
                </View>
              )}
              {slotsArray[3]?.availableOrdersCount > 0 ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    onPressSlot(3);
                  }}
                  style={{
                    padding: 10,
                    minWidth: 70,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor:
                      nextDayBuffer == 3 ? Theme.Colors.primary : "#EFEFEF",
                    backgroundColor: nextDayBuffer == 3 ? "#FDEFEF" : "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#727272", fontSize: 12 }}>
                    {moment().add(4, "days").format("ddd")}{" "}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    {moment().add(4, "days").format("DD MMM")}{" "}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    padding: 10,
                    minWidth: 70,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#EFEFEF",
                    backgroundColor: "#F1F1F1",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ color: "#727272", fontSize: 12 }}>
                    {moment().add(4, "days").format("ddd")}{" "}
                  </Text>
                  <Text
                    style={{
                      color: "#727272",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}>
                    {moment().add(4, "days").format("DD MMM")}{" "}
                  </Text>
                </View>
              )}
            </View>
            {/* <Text>{(JSON.stringify(cartItems, null, "        "))} </Text> */}
            {nextDayBuffer == undefined || nextDayBuffer == null ? (
              <Text style={{ marginTop: 10, color: "red" }}>
                No slots available
              </Text>
            ) : undefined}
            {slot?.description ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}>
                <Image
                  style={{ alignSelf: "flex-end", width: 15, height: 15 }}
                  resizeMode="contain"
                  source={require("../../assets/png/timer.png")}
                />
                <Text style={{ marginLeft: 10 }}>{slot?.description} </Text>
              </View>
            ) : undefined}
          </View>
          {selectedOffer?.offer?.displayName ? (
            <View
              style={{
                backgroundColor: "white",
                marginTop: 10,
                paddingHorizontal: 15,
                paddingVertical: 10,
                justifyContent: "center",
              }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#FDEFEF",
                    borderWidth: 1,
                    borderColor: "#F5C4C6",
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                  }}>
                  <Image
                    style={{ height: 16, width: 50 }}
                    resizeMode={"contain"}
                    source={require("../../assets/png/couponImage.png")}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    borderStyle: "dashed",
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    backgroundColor: "#FAFAFA",
                    alignItems: "center",
                    borderWidth: 1.5,
                    borderColor: "#E3E3E3",
                    zIndex: 0,
                    marginLeft: -1,
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#E1171E",
                        marginLeft: 10,
                        fontWeight: "bold",
                      }}>
                      {selectedOffer?.offer?.displayName}{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#727272",
                        marginLeft: 10,
                      }}>
                      Coupon applied on the bill
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      removeOffer();
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: 50,
                      width: 50,
                    }}>
                    <Icon
                      name="closecircle"
                      type="AntDesign"
                      style={{ fontSize: 18, color: "#c9c9c9" }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setCouponModalVisible(true);
              }}
              style={{
                backgroundColor: "white",
                marginTop: 10,
                paddingHorizontal: 15,
                paddingVertical: 10,
                justifyContent: "center",
                // borderTopWidth: 1, borderBottomWidth: 1, borderColor: Theme.Colors.primary,
              }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#FDEFEF",
                    borderWidth: 1,
                    borderColor: "#F5C4C6",
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                  }}>
                  <Image
                    style={{ height: 16, width: 50 }}
                    resizeMode={"contain"}
                    source={require("../../assets/png/couponImage.png")}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    borderStyle: "dashed",
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    backgroundColor: "#FAFAFA",
                    alignItems: "center",
                    borderWidth: 1.5,
                    borderColor: "#E3E3E3",
                    zIndex: 0,
                    marginLeft: -1,
                  }}>
                  <Text style={{ fontSize: 15, marginLeft: 10, flex: 1 }}>
                    Apply Coupon Code
                  </Text>

                  <View
                    style={{
                      justifyContent: "space-around",
                      alignItems: "center",
                      height: 40,
                      flexDirection: "row",
                      width: 60,
                    }}>
                    {availableCouponList?.length > 0 && (
                      <>
                        <View
                          style={{
                            minHeight: 19,
                            minWidth: 19,
                            backgroundColor: "#e1171e",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                          }}>
                          <Text style={{ color: "white", fontSize: 12 }}>
                            {availableCouponList?.length}
                          </Text>
                        </View>
                      </>
                    )}
                    <Icon
                      name="chevron-small-right"
                      type="Entypo"
                      style={[{ color: "black", fontSize: 30 }]}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          {config?.enableCOD ? (
            <View
              style={{
                backgroundColor: "white",
                marginTop: 10,
                paddingHorizontal: 15,
                paddingVertical: 12,
              }}>
              <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                Select payment method{" "}
              </Text>
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    borderRadius: 5,
                    alignItems: "center",
                    padding: 10,
                    marginTop: 10,
                    borderWidth: 1,
                    borderColor: "#EFEFEF",
                  }}
                  onPress={() => {
                    setSelectedPaymentMethod("PREPAID");
                  }}>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}>
                    <Radio
                      style={{ width: 20 }}
                      selected={
                        selectedPaymentMethod == "PREPAID" ? true : false
                      }
                      color={Theme.Colors.primary}
                      selectedColor={Theme.Colors.primary}
                      onPress={() => {
                        setSelectedPaymentMethod("PREPAID");
                      }}
                    />
                  </View>
                  <View
                    style={{ marginLeft: 10, flexDirection: "row", flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}>
                        Make Online Payment{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#727272",
                          fontSize: 12,
                          fontWeight: null,
                        }}>
                        Preferred payment due to covid{" "}
                      </Text>
                    </View>
                    <View style={{}}>
                      <Image
                        style={{
                          alignSelf: "flex-end",
                          width: 80,
                          height: 30,
                          marginLeft: -5,
                        }}
                        resizeMode="contain"
                        source={require("../../assets/png/paymentImages.png")}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  borderRadius: 5,
                  alignItems: "center",
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  minHeight: 50,
                  borderWidth: 1,
                  borderColor: "#EFEFEF",
                }}
                onPress={() => {
                  setSelectedPaymentMethod("COD");
                }}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}>
                  <Radio
                    style={{ width: 20 }}
                    selected={selectedPaymentMethod == "COD" ? true : false}
                    color={Theme.Colors.primary}
                    selectedColor={Theme.Colors.primary}
                    onPress={() => {
                      setSelectedPaymentMethod("COD");
                    }}
                  />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}>
                    Cash on delivery{" "}
                  </Text>
                  {/* <Text style={{ color: '#727272', fontSize: 12, fontWeight: null }}>Coupon Codes not applicable for COD </Text> */}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={disableCheck == false ? true : false}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  borderRadius: 5,
                  alignItems: "center",
                  padding: 10,
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: "#EFEFEF",
                }}
                onPress={() => onPressCheckbox()}>
                {/* <CheckBox
                                    containerStyle={{ backgroundColor: "white", borderWidth: 0, width: 0, height: 0, marginLeft: -10 }}
                                    checkedIcon='check-square'
                                    textStyle={{ fontSize: 5 }}
                                    uncheckedIcon='check-square'
                                    onPress={() => onPressCheckbox()}
                                    checked={walletCheck}
                                    checkedColor={Theme.Colors.primary}DisableCheckbox
                                /> */}
                <CheckBox
                  containerStyle={{
                    backgroundColor: "white",
                    borderWidth: 0,
                    width: 0,
                    height: 0,
                    marginLeft: -8,
                  }}
                  checkedIcon={
                    <Image
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                      source={require("../../assets/png/checkedCheckbox.png")}
                    />
                  }
                  textStyle={{ fontSize: 5 }}
                  uncheckedIcon={
                    <Image
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                      source={require("../../assets/png/DisableCheckbox.png")}
                    />
                  }
                  checked={walletCheck}
                  onPress={() => onPressCheckbox()}
                  // disabled={false}
                  disabled={disableCheck}
                  checkedColor={Theme.Colors.primary}
                />
                <View style={{ marginLeft: 11, flexDirection: "row", flex: 1 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}>
                      Use Zasket Wallet Money{" "}
                    </Text>
                    <Text
                      style={{
                        color: "#727272",
                        fontSize: 12,
                        fontWeight: null,
                      }}>
                      Available balance : ₹ {creditBalance}{" "}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {/* 
                        <TouchableOpacity activeOpacity={0.8} style={{
                            flexDirection: 'row', backgroundColor: "white", borderRadius: 5, alignItems: "center", padding: 10, marginTop: 10, marginBottom: 10, minHeight: 50, borderWidth: 1, borderColor: '#EFEFEF'
                        }} onPress={() => {
                            setSelectedPaymentMethod("PREPAID")
                        }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
                                <CheckBox
                                    containerStyle={{ backgroundColor: "transparent", borderWidth: 0, }}
                                    checkedIcon='check-square'
                                    textStyle={{ fontSize: 5 }}
                                    uncheckedIcon='check-square'
                                    checked={walletCheck}
                                    disabled={true}
                                    checkedColor={Theme.Colors.primary}
                                />
                                <View style={{ marginLeft: 10, flexDirection: 'row', }}>
                                    <View style={{}}>
                                        <Text style={{ color: 'black', fontSize: 14, fontWeight: "bold" }}>Use Zasket wallet Money </Text>
                                        <Text style={{ color: '#727272', fontSize: 12, fontWeight: null }}>Available balance :   400 </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity> */}
            </View>
          ) : null}
          <View
            style={{
              backgroundColor: "white",
              marginTop: 10,
              padding: 10,
              paddingHorizontal: 15,
            }}>
            <Text style={{ fontSize: 15 }}>
              <Text style={{ fontWeight: "bold" }}>Bill Details</Text>{" "}
              <Text style={{ color: "#727272", fontSize: 14 }}>
                ({cartItems?.length} items)
              </Text>
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}>
              <Text style={{ color: "#727272" }}>Item Total</Text>
              <Text style={{}}>
                ₹ {getOrdersBillingDetails?.discountedPrice?.toFixed(2)}{" "}
              </Text>
            </View>
            <View
              style={{
                marginTop: 3,
                height: 0.7,
                width: "100%",
                alignSelf: "center",
                backgroundColor: "#EAEAEC",
                marginBottom: 10,
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <Text style={{ color: "#727272" }}>Delivery Charges</Text>
              <Text style={{ color: Theme.Colors.primary, fontWeight: "bold" }}>
                {getOrdersBillingDetails?.deliveryCharges > 0
                  ? `${"₹"} ${getOrdersBillingDetails?.deliveryCharges}`
                  : "Free"}{" "}
              </Text>
            </View>
            {getOrdersBillingDetails?.offer?.displayName ? (
              <>
                <View
                  style={{
                    marginTop: 3,
                    height: 0.7,
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: "#EAEAEC",
                    marginBottom: 10,
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <Text style={{ color: "#35B332" }}>Coupon Discount</Text>
                  <Text style={{ color: "#35B332" }}>
                    - ₹ {(getOrdersBillingDetails?.couponDiscount).toFixed(2)}{" "}
                  </Text>
                </View>
              </>
            ) : undefined}
            <View
              style={{
                marginTop: 3,
                height: 0.7,
                width: "100%",
                alignSelf: "center",
                backgroundColor: "#EAEAEC",
                marginBottom: 5,
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}>
              <Text style={{ color: "#727272" }}>Zasket wallet</Text>
              <Text style={{}}>
                ₹ {getOrdersBillingDetails?.creditUsed?.toFixed(2)}{" "}
              </Text>
            </View>
            <View
              style={{
                marginTop: 3,
                height: 0.7,
                width: "100%",
                alignSelf: "center",
                backgroundColor: "#EAEAEC",
                marginBottom: 10,
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <Text style={{ fontWeight: "bold" }}>Total Amount </Text>
              <Text style={{ fontWeight: "bold" }}>
                ₹ {(getOrdersBillingDetails?.finalPrice).toFixed(2)}{" "}
              </Text>
            </View>
            {getOrdersBillingDetails.canBeOrdered == true &&
            getOrdersBillingDetails.comment ? (
              // <View style={{ height: 40, width: "100%", flexDirection: 'column', justifyContent: 'center', borderColor: "#C2E2A9", alignSelf: 'center', marginTop: 20, borderStyle: 'dashed', borderWidth: 1.5, borderRadius: 4, backgroundColor: "#F1FAEA", alignItems: "center", marginVertical: 25 }}>
              //     <Text style={{ color: "#60B11F" }}>😊 {getOrdersBillingDetails?.comment}jkdsfbskjdfgbklsdjfgbklsadjfgbklsadjfgblksdjfgbklsdjbgskjldfbgkljsdfbkgljsdfbkgljsfdbgkljsdfbkljgbsdfkljgbsdklfjgbskldfj</Text>
              // </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderColor: "#C2E2A9",
                  alignSelf: "center",
                  marginTop: 20,
                  borderStyle: "dashed",
                  borderWidth: 1.5,
                  borderRadius: 4,
                  backgroundColor: "#F1FAEA",
                  alignItems: "center",
                  marginVertical: 25,
                }}>
                <View
                  style={{
                    paddingLeft: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "90%",
                    marginVertical: 15,
                  }}>
                  <Text style={{ color: "#60B11F", textAlign: "center" }}>
                    😊 {getOrdersBillingDetails?.comment}{" "}
                  </Text>
                </View>
              </View>
            ) : undefined}
          </View>
        </ScrollView>

        {cartItems?.length > 0 ? (
          <View
            style={{
              height: 55,
              width: "100%",
              backgroundColor: "#F5F5F5",
              flexDirection: "row",
              justifyContent: "center",
            }}>
            <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                ₹ {(getOrdersBillingDetails?.finalPrice).toFixed(2)}{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  scrollViewRef.current.scrollToEnd({ animated: true });
                }}
                style={{}}>
                <Text style={{ color: "#2D87C9" }}>
                  View bill details{" "}
                  <Icon
                    name="down"
                    type="AntDesign"
                    style={{ fontSize: 12, color: "#2D87C9" }}
                  />
                </Text>
              </TouchableOpacity>
            </View>
            {nextDayBuffer == undefined || nextDayBuffer == null ? (
              <View
                style={{
                  flex: 1.2,
                  backgroundColor: "#F5B0B2",
                  margin: 5,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={{ color: "white", fontSize: 17 }}>
                  Make a Payment{" "}
                  <Icon
                    name="right"
                    type="AntDesign"
                    style={{ fontSize: 14, color: "white" }}
                  />
                </Text>
              </View>
            ) : (
              <>
                {/* <TouchableOpacity onPress={() => { onPressMakePayment() }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Make a Payment <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                        </TouchableOpacity> */}
                {loading ? (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: Theme.Colors.primary,
                      margin: 5,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <ActivityIndicator color="white" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => onPressContinue()}
                    style={{
                      flex: 1,
                      backgroundColor: Theme.Colors.primary,
                      margin: 5,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    {config?.enableCOD ? (
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}>
                        {selectedPaymentMethod == "COD"
                          ? "Place Order"
                          : "Continue"}{" "}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}>
                        Make payment{" "}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        ) : undefined}
        <AddressModal
          addressModalVisible={addressModalVisible}
          navigateTo="MapScreen"
          setAddressModalVisible={(option) => setAddressModalVisible(option)}
          navigation={navigation}
        />
        <Modal
          isVisible={paymentSelectionActionScreen}
          onSwipeComplete={() => setPaymentSelectionActionScreen(false)}
          swipeDirection="down"
          style={{ margin: 0, justifyContent: "flex-end" }}
          onBackButtonPress={() => setPaymentSelectionActionScreen(false)}
          onBackdropPress={() => setPaymentSelectionActionScreen(false)}>
          <SafeAreaView
            style={{
              height: "50%",
              backgroundColor: "white",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            }}>
            <View
              style={{
                alignSelf: "center",
                height: 5,
                width: 50,
                backgroundColor: "#E2E2E2",
                borderRadius: 50,
                marginVertical: 15,
              }}
            />
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flex: 1,
                  margin: 4,
                  width: "90%",
                  marginBottom: 10,
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                  Select payment method
                </Text>
                <Text style={{ color: "#727272", marginTop: 10 }}>
                  Two easy ways to make payment
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  marginTop: "5%",
                  backgroundColor: "white",
                  borderRadius: 5,
                  marginHorizontal: 20,
                  padding: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                  alignItems: "center",
                }}
                onPress={() => {
                  setSelectedPaymentMethod("PREPAID");
                }}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}>
                  <Radio
                    selected={selectedPaymentMethod == "PREPAID" ? true : false}
                    color={Theme.Colors.primary}
                    selectedColor={Theme.Colors.primary}
                    onPress={() => {
                      setSelectedPaymentMethod("PREPAID");
                    }}
                  />
                </View>
                <View style={{ marginLeft: 10, flexDirection: "row", flex: 1 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        textTransform: "capitalize",
                        color: "black",
                        fontSize: 14,
                      }}>
                      Make Online Payment{" "}
                    </Text>
                    <Text style={{ color: "#727272", fontSize: 12 }}>
                      Preferred payment due to covid{" "}
                    </Text>
                  </View>
                  <View style={{}}>
                    <Image
                      style={{ alignSelf: "flex-end", width: 80, height: 30 }}
                      resizeMode="contain"
                      source={require("../../assets/png/paymentImages.png")}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  marginTop: "5%",
                  marginBottom: 10,
                  backgroundColor: "white",
                  borderRadius: 5,
                  marginHorizontal: 20,
                  padding: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                  minHeight: 50,
                  alignItems: "center",
                }}
                onPress={() => {
                  setSelectedPaymentMethod("COD");
                }}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}>
                  <Radio
                    selected={selectedPaymentMethod == "COD" ? true : false}
                    color={Theme.Colors.primary}
                    selectedColor={Theme.Colors.primary}
                    onPress={() => {
                      setSelectedPaymentMethod("COD");
                    }}
                  />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ color: "black", fontSize: 16 }}>
                    Cash on delivery{" "}
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>

            {/* {loading ?
                        <Loader /> : <TouchableOpacity onPress={() => onPressContinue()} style={{ height: 50, backgroundColor: Theme.Colors.primary, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{selectedPaymentMethod == "COD" ? "Place Order" : "Continue"} </Text>
                        </TouchableOpacity>} */}
          </SafeAreaView>
        </Modal>

        <NativeModal
          animationType="slide"
          visible={couponModalVisible}
          onRequestClose={() => setCouponModalVisible(false)}>
          <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <Root>
              <Container>
                <Content>
                  <View style={{ flexDirection: "row", minHeight: 50 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setCouponModalVisible(false);
                      }}
                      style={{
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <Icon
                        name="chevron-small-left"
                        type="Entypo"
                        style={[{ color: "black", fontSize: 36 }]}
                      />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: "black",
                          textTransform: "capitalize",
                          fontWeight: "bold",
                        }}>
                        Apply Coupon{" "}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
                    {selectedOffer?.offer?.displayName ? (
                      <View
                        style={{
                          backgroundColor: "white",
                          marginTop: 10,
                          paddingHorizontal: 15,
                          paddingVertical: 10,
                          justifyContent: "center",
                        }}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{
                              backgroundColor: "#FDEFEF",
                              borderWidth: 1,
                              borderColor: "#F5C4C6",
                              borderTopLeftRadius: 4,
                              borderBottomLeftRadius: 4,
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 1,
                            }}>
                            <Image
                              style={{ height: 16, width: 50 }}
                              resizeMode={"contain"}
                              source={require("../../assets/png/couponImage.png")}
                            />
                          </View>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              borderStyle: "dashed",
                              borderTopRightRadius: 4,
                              borderBottomRightRadius: 4,
                              backgroundColor: "#FAFAFA",
                              alignItems: "center",
                              borderWidth: 1.5,
                              borderColor: "#E3E3E3",
                              zIndex: 0,
                              marginLeft: -1,
                            }}>
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: "#E1171E",
                                  marginLeft: 10,
                                  fontWeight: "bold",
                                }}>
                                {selectedOffer?.offer?.displayName}{" "}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: "#727272",
                                  marginLeft: 10,
                                }}>
                                Coupon applied on the bill
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                removeOffer();
                              }}
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: 50,
                                width: 50,
                              }}>
                              <Icon
                                name="closecircle"
                                type="AntDesign"
                                style={{ fontSize: 18, color: "#c9c9c9" }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          backgroundColor: "white",
                          marginTop: 10,
                          paddingHorizontal: 15,
                          paddingVertical: 10,
                          justifyContent: "center",
                          height: 65,
                          // borderTopWidth: 1, borderBottomWidth: 1, borderColor: Theme.Colors.primary,
                        }}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          {/* <View style={{ backgroundColor: '#FDEFEF', borderWidth: 1, borderColor: "#F5C4C6", borderTopLeftRadius: 4, borderBottomLeftRadius: 4, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                                                <Image
                                                    style={{ height: 16, width: 50, }}
                                                    resizeMode={"contain"}
                                                    source={require('../../assets/png/couponImage.png')}
                                                />
                                            </View> */}
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              borderStyle: "dashed",
                              borderTopRightRadius: 4,
                              borderBottomRightRadius: 4,
                              backgroundColor: "#FAFAFA",
                              alignItems: "center",
                              borderWidth: 1.5,
                              borderColor: "#E3E3E3",
                              zIndex: 0,
                              marginLeft: -1,
                            }}>
                            <TextInput
                              style={{ height: 40, flex: 1, marginLeft: 8 }}
                              onChangeText={(text) => setCoupon(text)}
                              placeholder="Apply Coupon Code"
                              value={coupon}
                              placeholderTextColor="black"
                              autoCapitalize="characters"
                            />

                            {coupon ? (
                              <TouchableOpacity
                                onPress={() => onPressApplyCoupon()}
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 40,
                                }}>
                                <Text
                                  style={{
                                    marginHorizontal: 5,
                                    color: Theme.Colors.primary,
                                    fontWeight: "bold",
                                  }}>
                                  Apply
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 40,
                                }}>
                                <Text
                                  style={{
                                    marginHorizontal: 5,
                                    color: "#F5C4C6",
                                    fontWeight: "bold",
                                  }}>
                                  Apply
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    )}

                    <View style={{ backgroundColor: "white", marginTop: 10 }}>
                      {availableCouponList?.length > 0 ? (
                        <Text
                          style={{
                            paddingLeft: 20,
                            paddingTop: 10,
                            fontWeight: "bold",
                          }}>
                          Available Coupons for you
                        </Text>
                      ) : null}
                      <FlatList
                        data={availableCouponList}
                        renderItem={({ item }) => (
                          <View
                            // onPress={() => { navigation.navigate("ProductDetailScreen", { item: item }) }}
                            style={styles.productCard}>
                            {/* <Text>{JSON.stringify(item, null, "         ")} </Text> */}
                            <View style={[{ padding: 10, flex: 1 }]}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}>
                                <View
                                  style={{
                                    justifyContent: "space-between",
                                    alignItems: "flex-end",
                                    flexDirection: "row",
                                    borderWidth: 1,
                                    borderColor: "#F77E82",
                                    borderStyle: "dashed",
                                    backgroundColor: "#FDEFEF",
                                    padding: 7,
                                    borderRadius: 4,
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      color: "#E1171E",
                                      fontWeight: "bold",
                                    }}>
                                    {item?.offerResponse?.offerCode}{" "}
                                  </Text>
                                </View>
                                {item?.isEligible ? (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setCoupon(item?.offerResponse?.offerCode);
                                      onPressApplyCoupon(
                                        item?.offerResponse?.offerCode
                                      );
                                    }}
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}>
                                    <Text
                                      style={{
                                        marginHorizontal: 5,
                                        color: Theme.Colors.primary,
                                        fontWeight: "bold",
                                      }}>
                                      Apply
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <View
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}>
                                    <Text
                                      style={{
                                        marginHorizontal: 5,
                                        color: "#F5C4C6",
                                        fontWeight: "bold",
                                      }}>
                                      Apply
                                    </Text>
                                  </View>
                                )}
                              </View>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: "#2E2E2E",
                                  fontWeight: "bold",
                                  textTransform: "capitalize",
                                  marginVertical: 5,
                                }}>
                                {item?.offerResponse?.uiListDisplayNameHeader}{" "}
                              </Text>
                              <Text style={{ fontSize: 14, color: "#909090" }}>
                                {
                                  item?.offerResponse
                                    ?.uiListDisplayNameSubHeader
                                }{" "}
                              </Text>
                              {!item?.isEligible ? (
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: "#E1171E",
                                    marginVertical: 10,
                                  }}>
                                  {item?.comment}{" "}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        )}
                        ItemSeparatorComponent={() => (
                          <View
                            style={{
                              height: 0.7,
                              width: "90%",
                              alignSelf: "center",
                              backgroundColor: "#EAEAEC",
                            }}
                          />
                        )}
                        keyExtractor={(item) =>
                          item?.offerResponse?.id.toString()
                        }
                      />
                    </View>
                  </View>
                </Content>
                {/* <View style={{ backgroundColor: "#FDEFEF", padding: 10, flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'center' }}>
                                <FeatherIcons name="info" color={'#E1271E'} size={18} />
                                <Text style={{ fontSize: 14, color: Theme.Colors.primary, fontWeight: 'bold' }}> Coupon codes not applicable for COD </Text>
                            </View> */}
              </Container>
            </Root>
            {couponLoading && <Loader />}
          </SafeAreaView>
        </NativeModal>
        <NativeModal
          animationType="fade"
          transparent={true}
          visible={couponSuccessModal}
          onRequestClose={() => setCouponSuccessModal(false)}>
          <TouchableWithoutFeedback
            onPress={() => {
              setCouponSuccessModal(false);
            }}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalView}>
                  <View
                    style={{
                      backgroundColor: "#FDEFEF",
                      borderWidth: 1,
                      borderColor: "#F77E82",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                      borderRadius: 50,
                      height: 50,
                      width: 50,
                      alignSelf: "center",
                      marginTop: -25,
                    }}>
                    <Image
                      style={{ height: 16, width: 50 }}
                      resizeMode={"contain"}
                      source={require("../../assets/png/couponImage.png")}
                    />
                  </View>
                  <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                    <Text style={styles.modalText}>
                      {appliedCoupon?.offer?.uiListDisplayNameHeader}
                    </Text>
                    <Text
                      style={{
                        color: "#909090",
                        textAlign: "center",
                        fontSize: 14,
                      }}>
                      Saving with this coupon
                    </Text>
                    <Text
                      style={{
                        color: "#909090",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginVertical: 10,
                      }}>
                      “{appliedCoupon?.offer?.offerCode}” Applied
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setCouponSuccessModal(false);
                    }}
                    style={{
                      backgroundColor: "#FDEFEF",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}>
                    <Text
                      style={{
                        color: Theme.Colors.primary,
                        fontWeight: "bold",
                      }}>
                      OK{" "}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </NativeModal>
        {loadinggg && (
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
              }}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          </>
        )}
      </View>
    </>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart.cartItems,
  offerDetails: state.cart.couponDetails,
  darkMode: state.dark,
  categories: state.home.categories,
  config: state.config.config,
  allUserAddress: state.auth.allUserAddress,
  userLocation: state.location,
  getOrdersBillingDetails: state.cart.getOrdersBillingDetails,
});

export default connect(mapStateToProps, {
  getCustomerOrders,
  getBillingDetails,
  getCustomerDetails,
  clearCart,
  getV2DeliverySlots,
  addOrder,
  applyOffer,
  getAvailableOffers,
  paymentConfirm,
  rejectPaymentByAPI,
})(CheckoutScreen);

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    // padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    color: "#E1171E",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  loading: {
    // flex: 1,
    position: "absolute",
    elevation: 100,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
