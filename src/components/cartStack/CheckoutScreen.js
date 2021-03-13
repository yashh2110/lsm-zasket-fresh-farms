import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, TextInput, ScrollView, Image, SafeAreaView, ActivityIndicator, Modal as NativeModal, FlatList, Pressable, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { clearCart } from '../../actions/cart'
import Theme from '../../styles/Theme';
import CustomHeader from '../common/CustomHeader';
import CardCartScreen from './CardCartScreen';
import { Button, Icon } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
import { getV2DeliverySlots, addOrder } from '../../actions/cart'
import moment from 'moment'
import { Radio, Toast, Root, Container, Content } from 'native-base';
import RazorpayCheckout from 'react-native-razorpay';
import Modal from 'react-native-modal';
import { applyOffer, getAvailableOffers, } from '../../actions/cart'
import Loader from '../common/Loader';
import AddressModal from '../common/AddressModal';
import { AppEventsLogger } from "react-native-fbsdk";
const CheckoutScreen = ({ route, navigation, cartItems, allUserAddress, offerDetails, clearCart, getV2DeliverySlots, addOrder, userLocation, config, applyOffer, getAvailableOffers }) => {
    const scrollViewRef = useRef();
    const [coupon, setCoupon] = useState("")
    const [totalCartValue, setTotalCartValue] = useState(0)
    const [loading, setLoading] = useState(false)
    const [nextDayBuffer, setNextDayBuffer] = useState(undefined)
    const [savedValue, setSavedValue] = useState(0)
    const [marketPrice, setMarketPrice] = useState(0)
    const [slotsArray, setSlotsArray] = useState([])
    const [slot, setSlot] = useState({})
    const [disableTomorrowSlot, setDisableTomorrowSlot] = useState(false)
    const [paymentSelectionActionScreen, setPaymentSelectionActionScreen] = useState(false)
    const [couponLoading, setCouponLoading] = useState(false)
    const [selectedOffer, setSelectedOffer] = useState({})
    const [offerPrice, setOfferPrice] = useState(0)
    const [proceedPaymentMethod, setProceedPaymentMethod] = useState(false)
    const [addressModalVisible, setAddressModalVisible] = useState(false)
    const [couponModalVisible, setCouponModalVisible] = useState(false)
    const [availableCouponList, setAvailableCouponList] = useState([])
    const [couponSuccessModal, setCouponSuccessModal] = useState(false)
    const [appliedCoupon, setAppliedCoupon] = useState({})
    // const { offerPrice, selectedOffer } = route.params;
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("PREPAID")

    const totalCartValueRef = useRef(totalCartValue);

    const setTotalCartValueRef = newText => {
        totalCartValueRef.current = newText;
        setTotalCartValue(newText);
    };


    useEffect(() => {
        if (cartItems.length > 0) {
            let total = cartItems.reduce(function (sum, item) {
                return sum + (item.discountedPrice * item.count);
            }, 0);
            setTotalCartValueRef(total)

            let saved = cartItems.reduce(function (sum, item) {
                return sum + ((item.actualPrice - item.discountedPrice) * item.count);
            }, 0);
            setSavedValue(saved)

            let marketPriceValue = cartItems.reduce(function (sum, item) {
                return sum + ((item.actualPrice) * item.count);
            }, 0);

            setMarketPrice(marketPriceValue)
        } else {
            setTotalCartValueRef(0)
            setSavedValue(0)
        }
    }, [cartItems])

    useEffect(() => {
        getAvailableOffers(totalCartValue, (res, status) => {
            if (status) {
                let newArray = []
                res?.data?.forEach((el, index) => {
                    if (el?.isActive) newArray.push(el)
                })
                setAvailableCouponList(newArray)
            } else {

            }
        })
    }, [totalCartValue])

    useEffect(() => {
        // alert(JSON.stringify(userLocation, null, "    "))
        getV2DeliverySlots(4, userLocation?.lat, userLocation?.lon, (res, status) => {
            if (status) {
                setSlotsArray(res?.data)
            } else {
                setSlotsArray([])
            }
        })
    }, [userLocation])

    useEffect(() => {
        // alert(JSON.stringify(slotsArray, null, "         "))

        for (var i = 0; i < slotsArray?.length; i++) {
            if (slotsArray[i]?.availableOrdersCount > 0) {
                setNextDayBuffer(slotsArray[i]?.nextDayBuffer)
                break;
            }
        }
        // slotsArray?.map((el, index) => {
        //     if (el?.availableOrdersCount > 0) {
        //         setNextDayBuffer(el?.nextDayBuffer)
        //         return false
        //     }
        // })
    }, [slotsArray])

    useEffect(() => {
        if (slotsArray?.length > 0) {
            slotsArray?.forEach((el, index) => {
                if (el?.nextDayBuffer == nextDayBuffer) {
                    setSlot(el)
                }
            })
        }
        var today = new Date();
        var hour = today.getHours();
        if (hour >= config?.nextDayDeliveryCutOff) {
            setDisableTomorrowSlot(true)
            let newArray = slotsArray.slice(1)
            for (var i = 0; i < newArray?.length; i++) {
                if (newArray[i]?.availableOrdersCount > 0) {
                    setNextDayBuffer(newArray[i]?.nextDayBuffer)
                    break;
                }
            }
        }
    }, [userLocation, slotsArray])

    useEffect(() => {
        if (slotsArray?.length > 0) {
            slotsArray?.forEach((el, index) => {
                if (el?.nextDayBuffer == nextDayBuffer) {
                    setSlot(el)
                }
            })
        }
    }, [nextDayBuffer])

    useEffect(() => {
        var today = new Date();
        var hour = today.getHours();
        if (hour >= config?.nextDayDeliveryCutOff) {
            // alert(hour)
            setDisableTomorrowSlot(true)

            let newArray = slotsArray.slice(1)
            for (var i = 0; i < newArray?.length; i++) {
                if (newArray[i]?.availableOrdersCount > 0) {
                    setNextDayBuffer(newArray[i]?.nextDayBuffer)
                    break;
                }
            }
        }
    }, [])

    const onClearCart = async () => {
        clearCart()
    }

    const onPressSlot = (option) => {
        setNextDayBuffer(option)
    }

    const onPressMakePayment = async () => {
        if (config?.enableCOD) {
            setPaymentSelectionActionScreen(true)
        } else {
            onSelectPaymentMethod("PREPAID")
        }
    }
    const onPressSelectAddress = () => {
        let newArray = []
        allUserAddress?.forEach((el, index) => {
            if (el?.isActive) newArray.push(el)
        })
        if (newArray?.length > 0) {
            setAddressModalVisible(true)
        } else {
            navigation.navigate('MapScreen', { fromScreen: "CartScreen" })
        }
    }
    const onPressContinue = async () => {
        await setLoading(true)
        if (selectedPaymentMethod == "PREPAID") {
            await onSelectPaymentMethod("PREPAID")
        } else if (selectedPaymentMethod == "COD") {
            await onSelectPaymentMethod("COD")
        }
    }

    const onSelectPaymentMethod = async (option) => {
        let itemCreateRequests = []
        await cartItems?.forEach((el, index) => {
            itemCreateRequests.push({
                "itemId": el?.id,
                "quantity": el?.count,
                "totalPrice": el?.discountedPrice * el?.count,
                "unitPrice": el?.discountedPrice
            })
        })
        let userLocation = await AsyncStorage.getItem('location');
        let parsedUserLocation = await JSON.parse(userLocation);
        let payload = {
            "billingAddressId": parsedUserLocation?.id,
            "deliverySlotId": slot?.id,
            "itemCreateRequests": itemCreateRequests,
            "nextDayBuffer": nextDayBuffer,
            "slotEndHours": slot?.endHours,
            "slotStartHours": slot?.startHours,
            "totalPrice": totalCartValue,
            "marketPrice": marketPrice,
            "offerId": selectedOffer?.offer?.id > 0 ? selectedOffer?.offer?.id : undefined,
            "offerPrice": offerPrice > 0 ? offerPrice : undefined,
        }
        if (option === "COD") {
            let codPayload = {
                ...payload,
                "paymentMethod": "COD"
            }
            addOrder(codPayload, async (res, status) => {
                setLoading(false)
                if (status) {
                    setPaymentSelectionActionScreen(false)
                    onClearCart()
                    await AsyncStorage.removeItem('appliedCoupon')
                    navigation.pop()
                    AppEventsLogger.logPurchase(totalCartValue, "INR", { param: "value" });
                    navigation.navigate('PaymentSuccessScreen', { date: nextDayBuffer })
                } else {
                    if (__DEV__) {
                        alert(JSON.stringify(res?.response))
                    }
                    if (res?.response?.data?.description) {
                        Toast.show({
                            text: res?.response?.data?.description,
                            type: "danger",
                            duration: 3000,
                            buttonStyle: { backgroundColor: "#a52f2b" }
                        })
                    }
                }
            })
        } else if (option == "PREPAID") {
            // alert(JSON.stringify(payload, null, "     "))
            let prepaidPayload = {
                ...payload,
                "paymentMethod": "PREPAID"
            }
            // console.warn(JSON.stringify(payload, null, "     "))
            addOrder(prepaidPayload, async (res, status) => {
                setLoading(false)
                if (status) {
                    setPaymentSelectionActionScreen(false)
                    let userDetails = await AsyncStorage.getItem('userDetails');
                    let parsedUserDetails = await JSON.parse(userDetails);
                    var options = {
                        description: 'Select the payment method',
                        image: 'https://d26w0wnuoojc4r.cloudfront.net/zasket_logo_3x.png',
                        currency: 'INR',
                        key: config?.razorpayApiKey,
                        amount: totalCartValue,
                        name: 'Zasket',
                        order_id: res?.data?.paymentResponseId,//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
                        prefill: {
                            email: parsedUserDetails?.customerDetails?.userEmail,
                            contact: parsedUserDetails?.customerDetails?.userMobileNumber,
                            name: parsedUserDetails?.customerDetails?.name
                        },
                        theme: { color: Theme.Colors.primary }
                    }
                    // console.warn(JSON.stringify(options, null, "        "))
                    RazorpayCheckout.open(options).then(async (data) => {
                        // handle success
                        // alert(`Success: ${data.razorpay_payment_id}`);
                        onClearCart()
                        await AsyncStorage.removeItem('appliedCoupon')
                        navigation.pop()
                        AppEventsLogger.logPurchase(totalCartValue, "INR", { param: "value" });
                        navigation.navigate('PaymentSuccessScreen', { date: nextDayBuffer })
                        // navigation.navigate('AccountStack', { screen: 'MyOrders' })
                    }).catch((error) => {
                        // handle failure
                        // alert(`Error: ${error.code} | ${error.description}`);
                        Toast.show({
                            text: "Payment failed",
                            buttonText: "Okay",
                            type: "danger",
                            buttonStyle: { backgroundColor: "#a52f2b" }
                        })
                    })
                } else {
                    setLoading(false)
                    if (res?.response?.data?.description) {
                        Toast.show({
                            text: res?.response?.data?.description,
                            type: "danger",
                            duration: 3000,
                            buttonStyle: { backgroundColor: "#a52f2b" }
                        })
                    }
                    // if (__DEV__) {
                    //     alert(JSON.stringify(res?.response, null, "        "))
                    // }
                    let errorItems = []
                    if (res?.response?.data?.length > 0) {
                        if (cartItems.length > 0) {
                            res?.response?.data?.forEach((resEl, resIndex) => {
                                cartItems?.forEach((cartEl, cartIndex) => {
                                    if (cartEl?.id == resEl?.id) {
                                        errorItems.push(cartEl?.itemName)
                                    }
                                })
                            })
                        }
                        alert(errorItems.toString() + " are requested more than available quantity")
                    }
                }
            })
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            let offerDetail = await AsyncStorage.getItem('appliedCoupon');
            let parsedCouponDetails = await JSON.parse(offerDetail);
            // console.warn(JSON.stringify(parsedCouponDetails?.offer?.offerCode))
            if (parsedCouponDetails !== null) {
                if (parsedCouponDetails?.offer?.offerCode) {
                    onPressApplyCoupon(parsedCouponDetails?.offer?.offerCode, totalCartValueRef.current, false)
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
    //         console.warn('removed here')
    //         removeOffer()
    //     }
    // }, [totalCartValue])


    const onPressApplyCoupon = async (option = undefined, optionalTotalCartValue = undefined, showAlert = true) => {
        setCouponLoading(true)
        let couponValue = option ? option : coupon
        let cartValue = optionalTotalCartValue ? optionalTotalCartValue : totalCartValue
        // console.warn(couponValue + "         " + cartValue)
        applyOffer(couponValue, cartValue, (res, status) => {
            if (status) {
                setCouponLoading(false)
                // alert(JSON.stringify(res?.data?.isEligible, null, "     "))
                if (res?.data?.isEligible) {
                    setAppliedCoupon(res?.data)
                    if (showAlert) {
                        setCouponSuccessModal(true)
                    }
                    setOfferPrice(res?.data?.offerPrice)
                    setSelectedOffer(res?.data)
                    // Toast.show({
                    //     text: res?.data?.comments,
                    //     buttonText: "Okay",
                    //     type: "success",
                    //     duration: 3000
                    // })
                    setCouponModalVisible(false)
                    setCouponLoading(false)
                } else {
                    // alert(res?.data?.comments)
                    removeOffer()
                    if (showAlert) {
                        Toast.show({
                            text: res?.data?.comments,
                            buttonText: "Okay",
                            type: "danger",
                            duration: 3000,
                            buttonStyle: { backgroundColor: "#a52f2b" }
                        })
                    }
                }
            } else {
                if (__DEV__) {
                    alert(JSON.stringify(res.response, null, "     "))
                }
                setCouponLoading(false)
                removeOffer()
                if (showAlert) {
                    Toast.show({
                        text: res?.response?.comments,
                        buttonText: "Okay",
                        type: "danger"
                    })
                }
            }
        })
    }
    const removeOffer = async () => {
        setOfferPrice(0)
        setCoupon("")
        setSelectedOffer([])
        await AsyncStorage.removeItem('appliedCoupon')
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Checkout"} showSearch={false} />
            <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={false}>
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>{JSON.stringify(location, null, "       ")} </Text> */}

                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 16, marginTop: 10 }}>
                    <View style={{ width: 60, height: 60, borderWidth: 1, borderRadius: 5, borderColor: Theme.Colors.primary, backgroundColor: '#FDEFEF', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{ width: 30, height: 30, }}
                            source={require('../../assets/png/locationIcon.png')}
                        />
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {userLocation?.saveAs == "Home" &&
                                    <View style={{ backgroundColor: "#FEF8FC", borderWidth: 1, borderRadius: 4, borderColor: "#FCD8EC", paddingVertical: 3, marginRight: 5 }}>
                                        <Text style={{ color: "#F464AD", fontSize: 12, marginHorizontal: 5 }}>Home</Text>
                                    </View>
                                }
                                {userLocation?.saveAs == "Office" &&
                                    <View style={{ backgroundColor: "#FCF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#F0D4FA", paddingVertical: 3, marginRight: 5 }}>
                                        <Text style={{ color: "#CD64F4", fontSize: 12, marginHorizontal: 5 }}>Office</Text>
                                    </View>
                                }
                                {userLocation?.saveAs == "Others" &&
                                    <View style={{ backgroundColor: "#EDF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#BEDCFF", paddingVertical: 3, marginRight: 5 }}>
                                        <Text style={{ color: "#64A6F4", fontSize: 12, marginHorizontal: 5 }}>Others</Text>
                                    </View>
                                }
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Deliver to {
                                    ((userLocation?.recepientName).length > 13) ?
                                        (((userLocation?.recepientName).substring(0, 13 - 3)) + '...') :
                                        userLocation?.recepientName
                                } </Text>
                            </View>
                            <TouchableOpacity onPress={() => { onPressSelectAddress() }} style={{}}>
                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <Text numberOfLines={2} style={{ color: "#909090", fontSize: 13, marginTop: 5 }}>{userLocation?.addressLine_1} </Text>
                    </View>
                </View>

                <View style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 16, marginTop: 10, paddingBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Book a slot</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: 60 }}>
                        {disableTomorrowSlot ?
                            <View style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: "#EFEFEF", backgroundColor: "#F1F1F1", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#727272', fontSize: 12 }}>Tomorrow</Text>
                                <Text style={{ color: '#727272', fontSize: 12, fontWeight: 'bold' }}>{moment().add(1, 'days').format("DD MMM")} </Text>
                            </View>
                            :
                            slotsArray[0]?.availableOrdersCount > 0 ?
                                <TouchableOpacity activeOpacity={0.7} onPress={() => { onPressSlot(0) }} style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: nextDayBuffer == 0 ? Theme.Colors.primary : "#EFEFEF", backgroundColor: nextDayBuffer == 0 ? '#FDEFEF' : "white", justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#727272', fontSize: 12 }}>Tomorrow</Text>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment().add(1, 'days').format("DD MMM")} </Text>
                                </TouchableOpacity>
                                :
                                <View style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: "#EFEFEF", backgroundColor: "#F1F1F1", justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#727272', fontSize: 12 }}>Tomorrow</Text>
                                    <Text style={{ color: '#727272', fontSize: 12, fontWeight: 'bold' }}>{moment().add(1, 'days').format("DD MMM")} </Text>
                                </View>
                        }
                        {slotsArray[1]?.availableOrdersCount > 0 ?
                            <TouchableOpacity activeOpacity={0.7} onPress={() => { onPressSlot(1) }} style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: nextDayBuffer == 1 ? Theme.Colors.primary : "#EFEFEF", backgroundColor: nextDayBuffer == 1 ? '#FDEFEF' : "white", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#727272', fontSize: 12 }}>{moment().add(2, 'days').format("ddd")} </Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment().add(2, 'days').format("DD MMM")} </Text>
                            </TouchableOpacity>
                            :
                            <View style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: "#EFEFEF", backgroundColor: "#F1F1F1", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#727272', fontSize: 12 }}>{moment().add(2, 'days').format("ddd")} </Text>
                                <Text style={{ color: '#727272', fontSize: 12, fontWeight: 'bold' }}>{moment().add(2, 'days').format("DD MMM")} </Text>
                            </View>
                        }
                        {slotsArray[2]?.availableOrdersCount > 0 ?
                            <TouchableOpacity activeOpacity={0.7} onPress={() => { onPressSlot(2) }} style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: nextDayBuffer == 2 ? Theme.Colors.primary : "#EFEFEF", backgroundColor: nextDayBuffer == 2 ? '#FDEFEF' : "white", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#727272', fontSize: 12 }}>{moment().add(3, 'days').format("ddd")} </Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment().add(3, 'days').format("DD MMM")} </Text>
                            </TouchableOpacity>
                            :
                            <View style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: "#EFEFEF", backgroundColor: "#F1F1F1", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#727272', fontSize: 12 }}>{moment().add(3, 'days').format("ddd")} </Text>
                                <Text style={{ color: '#727272', fontSize: 12, fontWeight: 'bold' }}>{moment().add(3, 'days').format("DD MMM")} </Text>
                            </View>
                        }
                        {slotsArray[3]?.availableOrdersCount > 0 ?
                            <TouchableOpacity activeOpacity={0.7} onPress={() => { onPressSlot(3) }} style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: nextDayBuffer == 3 ? Theme.Colors.primary : "#EFEFEF", backgroundColor: nextDayBuffer == 3 ? '#FDEFEF' : "white", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#727272', fontSize: 12 }}>{moment().add(4, 'days').format("ddd")} </Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment().add(4, 'days').format("DD MMM")} </Text>
                            </TouchableOpacity>
                            :
                            <View style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: "#EFEFEF", backgroundColor: "#F1F1F1", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#727272', fontSize: 12 }}>{moment().add(4, 'days').format("ddd")} </Text>
                                <Text style={{ color: '#727272', fontSize: 12, fontWeight: 'bold' }}>{moment().add(4, 'days').format("DD MMM")} </Text>
                            </View>
                        }
                    </View>
                    {/* <Text>{(JSON.stringify(cartItems, null, "        "))} </Text> */}
                    {nextDayBuffer == undefined || nextDayBuffer == null ?
                        <Text style={{ marginTop: 10, color: 'red' }}>No slots available</Text> : undefined}
                    {slot?.description ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, }}>
                            <Image
                                style={{ alignSelf: 'flex-end', width: 15, height: 15, }}
                                resizeMode="contain"
                                source={require('../../assets/png/timer.png')}
                            />
                            <Text style={{ marginLeft: 10 }}>{slot?.description} </Text>
                        </View>
                        : undefined}
                </View>
                {selectedOffer?.offer?.displayName ?
                    <View style={{ backgroundColor: 'white', marginTop: 10, paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ backgroundColor: '#FDEFEF', borderWidth: 1, borderColor: "#F5C4C6", borderTopLeftRadius: 4, borderBottomLeftRadius: 4, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                                <Image
                                    style={{ height: 16, width: 50, }}
                                    resizeMode={"contain"}
                                    source={require('../../assets/png/couponImage.png')}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', borderStyle: 'dashed', borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: "#FAFAFA", alignItems: "center", borderWidth: 1.5, borderColor: '#E3E3E3', zIndex: 0, marginLeft: -1 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, color: "#E1171E", marginLeft: 10, fontWeight: 'bold' }}>{selectedOffer?.offer?.displayName} </Text>
                                    <Text style={{ fontSize: 12, color: '#727272', marginLeft: 10 }}>Coupon applied on the bill</Text>
                                </View>
                                <TouchableOpacity onPress={() => { removeOffer() }} style={{ justifyContent: 'center', alignItems: 'center', height: 50, width: 50 }}>
                                    <Icon name="closecircle" type="AntDesign" style={{ fontSize: 18, color: '#c9c9c9' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    :
                    <TouchableOpacity
                        onPress={() => { setCouponModalVisible(true) }}
                        style={{
                            backgroundColor: 'white', marginTop: 10, paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'center',
                            // borderTopWidth: 1, borderBottomWidth: 1, borderColor: Theme.Colors.primary,
                        }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ backgroundColor: '#FDEFEF', borderWidth: 1, borderColor: "#F5C4C6", borderTopLeftRadius: 4, borderBottomLeftRadius: 4, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                                <Image
                                    style={{ height: 16, width: 50, }}
                                    resizeMode={"contain"}
                                    source={require('../../assets/png/couponImage.png')}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', borderStyle: 'dashed', borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: "#FAFAFA", alignItems: "center", borderWidth: 1.5, borderColor: '#E3E3E3', zIndex: 0, marginLeft: -1 }}>
                                <Text style={{ fontSize: 15, marginLeft: 10, flex: 1 }}>Apply Coupon Code</Text>

                                <View style={{ justifyContent: 'center', alignItems: 'center', height: 40 }}>
                                    <Icon name="chevron-small-right" type="Entypo" style={[{ color: 'black', fontSize: 26 }]} />
                                </View>

                            </View>
                        </View>
                    </TouchableOpacity>
                }
                <View style={{ backgroundColor: 'white', marginTop: 10, paddingHorizontal: 15 }}>
                    <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Select payment method </Text>
                    <TouchableOpacity activeOpacity={0.8} style={{
                        flexDirection: 'row', backgroundColor: "white", borderRadius: 5, alignItems: "center", padding: 10, marginTop: 10, borderWidth: 1, borderColor: '#EFEFEF'
                    }} onPress={() => {
                        setSelectedPaymentMethod("PREPAID")
                    }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Radio style={{ width: 20 }} selected={selectedPaymentMethod == "PREPAID" ? true : false} color={Theme.Colors.primary} selectedColor={Theme.Colors.primary} onPress={() => { setSelectedPaymentMethod("PREPAID") }} />
                        </View>
                        <View style={{ marginLeft: 10, flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: 'black', fontSize: 14, fontWeight: "bold" }}>Make Online Payment </Text>
                                <Text style={{ color: '#727272', fontSize: 12, fontWeight: null }}>Preferred payment due to covid </Text>
                            </View>
                            <View style={{}}>
                                <Image
                                    style={{ alignSelf: 'flex-end', width: 80, height: 30, }}
                                    resizeMode="contain"
                                    source={require('../../assets/png/paymentImages.png')}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{
                        flexDirection: 'row', backgroundColor: "white", borderRadius: 5, alignItems: "center", padding: 10, marginTop: 10, marginBottom: 10, minHeight: 50, borderWidth: 1, borderColor: '#EFEFEF'
                    }} onPress={() => { setSelectedPaymentMethod("COD") }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Radio style={{ width: 20 }} selected={selectedPaymentMethod == "COD" ? true : false} color={Theme.Colors.primary} selectedColor={Theme.Colors.primary} onPress={() => { setSelectedPaymentMethod("COD") }} />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ color: 'black', fontSize: 14, fontWeight: "bold" }}>Cash on delivery </Text>
                            {/* <Text style={{ color: '#727272', fontSize: 12, fontWeight: null }}>Coupon Codes not applicable for COD </Text> */}
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: 'white', marginTop: 10, padding: 10, paddingHorizontal: 15 }}>
                    <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>Bill Details</Text> <Text style={{ color: '#727272', fontSize: 14, }}>({cartItems?.length} item)</Text></Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, }}>
                        <Text style={{ color: '#727272' }}>Item Total</Text>
                        <Text style={{}}>₹ {(totalCartValue)?.toFixed(2)} </Text>
                    </View>
                    <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={{ color: '#727272' }}>Delivery Charges</Text>
                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Free </Text>
                    </View>
                    {offerPrice > 0 ?
                        <>
                            <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ color: '#35B332' }}>Coupon Discount</Text>
                                <Text style={{ color: "#35B332", }}>- ₹{(totalCartValue - offerPrice).toFixed(2)} </Text>
                            </View>
                        </>
                        : undefined}
                    <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={{ fontWeight: 'bold' }}>Total Payable Amount</Text>
                        <Text style={{ fontWeight: 'bold' }}>₹ {(offerPrice > 0 ? offerPrice : totalCartValue).toFixed(2)} </Text>
                    </View>
                    {savedValue > 0 ?
                        <View style={{ height: 40, width: "100%", flexDirection: 'column', justifyContent: 'center', borderColor: "#C2E2A9", alignSelf: 'center', marginTop: 20, borderStyle: 'dashed', borderWidth: 1.5, borderRadius: 4, backgroundColor: "#F1FAEA", alignItems: "center" }}>
                            <Text style={{ color: "#60B11F" }}>😊 You have saved ₹{(savedValue + ((offerPrice > 0) ? (totalCartValue - offerPrice) : 0)).toFixed(2)} in this purchase</Text>
                        </View>
                        : undefined}
                </View>
            </ScrollView>
            {
                cartItems?.length > 0 ?
                    <View style={{ height: 55, width: "100%", backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {(offerPrice > 0 ? offerPrice : totalCartValue).toFixed(2)} </Text>
                            <TouchableOpacity onPress={() => { scrollViewRef.current.scrollToEnd({ animated: true }); }} style={{}}>
                                <Text style={{ color: "#2D87C9" }}>View bill details <Icon name="down" type="AntDesign" style={{ fontSize: 12, color: '#2D87C9' }} /></Text>
                            </TouchableOpacity>
                        </View>
                        {nextDayBuffer == undefined || nextDayBuffer == null ?
                            <View style={{ flex: 1.2, backgroundColor: "#F5B0B2", margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                                <Text style={{ color: 'white', fontSize: 17 }}>Make a Payment <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                            </View>
                            :
                            <>
                                {/* <TouchableOpacity onPress={() => { onPressMakePayment() }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Make a Payment <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                        </TouchableOpacity> */}
                                {loading ?
                                    <View style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                                        <ActivityIndicator color="white" />
                                    </View>
                                    :
                                    <TouchableOpacity onPress={() => onPressContinue()} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{selectedPaymentMethod == "COD" ? "Place Order" : "Continue"} </Text>
                                    </TouchableOpacity>
                                }
                            </>
                        }
                    </View>
                    : undefined
            }
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
                style={{ margin: 0, justifyContent: 'flex-end' }}
                onBackButtonPress={() => setPaymentSelectionActionScreen(false)}
                onBackdropPress={() => setPaymentSelectionActionScreen(false)}
            >
                <SafeAreaView style={{ height: "50%", backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                    <View style={{ alignSelf: 'center', height: 5, width: 50, backgroundColor: '#E2E2E2', borderRadius: 50, marginVertical: 15 }} />
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, margin: 4, width: "90%", marginBottom: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Select payment method</Text>
                            <Text style={{ color: '#727272', marginTop: 10 }}>Two easy ways to make payment</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={{
                            flexDirection: 'row', marginTop: "5%", backgroundColor: "white", borderRadius: 5, marginHorizontal: 20, padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3, alignItems: "center"
                        }} onPress={() => {
                            setSelectedPaymentMethod("PREPAID")
                        }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Radio selected={selectedPaymentMethod == "PREPAID" ? true : false} color={Theme.Colors.primary} selectedColor={Theme.Colors.primary} onPress={() => { setSelectedPaymentMethod("PREPAID") }} />
                            </View>
                            <View style={{ marginLeft: 10, flexDirection: 'row', flex: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ textTransform: 'capitalize', color: 'black', fontSize: 14 }}>Make Online Payment </Text>
                                    <Text style={{ color: '#727272', fontSize: 12, }}>Preferred payment due to covid </Text>
                                </View>
                                <View style={{}}>
                                    <Image
                                        style={{ alignSelf: 'flex-end', width: 80, height: 30, }}
                                        resizeMode="contain"
                                        source={require('../../assets/png/paymentImages.png')}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} style={{
                            flexDirection: 'row', marginTop: "5%", marginBottom: 10, backgroundColor: "white", borderRadius: 5, marginHorizontal: 20, padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3, minHeight: 50, alignItems: "center"
                        }} onPress={() => { setSelectedPaymentMethod("COD") }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Radio selected={selectedPaymentMethod == "COD" ? true : false} color={Theme.Colors.primary} selectedColor={Theme.Colors.primary} onPress={() => { setSelectedPaymentMethod("COD") }} />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ color: 'black', fontSize: 16 }}>Cash on delivery </Text>
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
                onRequestClose={() => setCouponModalVisible(false)}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <Root>
                        <Container>
                            <Content>
                                <View style={{ flexDirection: 'row', minHeight: 50 }}>
                                    <TouchableOpacity
                                        onPress={() => { setCouponModalVisible(false) }}
                                        style={{ width: 60, justifyContent: 'center', alignItems: 'center', }}
                                    >
                                        <Icon name="chevron-small-left" type="Entypo" style={[{ color: 'black', fontSize: 36 }]} />
                                    </TouchableOpacity>
                                    <View style={{ flex: 1, justifyContent: 'center', }}>
                                        <Text style={{ fontSize: 18, color: 'black', textTransform: 'capitalize', fontWeight: 'bold' }}>Apply Coupon </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, backgroundColor: '#F8F8F8' }} >
                                    {selectedOffer?.offer?.displayName ?
                                        <View style={{ backgroundColor: 'white', marginTop: 10, paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'center' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                                <View style={{ backgroundColor: '#FDEFEF', borderWidth: 1, borderColor: "#F5C4C6", borderTopLeftRadius: 4, borderBottomLeftRadius: 4, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                                                    <Image
                                                        style={{ height: 16, width: 50, }}
                                                        resizeMode={"contain"}
                                                        source={require('../../assets/png/couponImage.png')}
                                                    />
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', borderStyle: 'dashed', borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: "#FAFAFA", alignItems: "center", borderWidth: 1.5, borderColor: '#E3E3E3', zIndex: 0, marginLeft: -1 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: 14, color: "#E1171E", marginLeft: 10, fontWeight: 'bold' }}>{selectedOffer?.offer?.displayName} </Text>
                                                        <Text style={{ fontSize: 12, color: '#727272', marginLeft: 10 }}>Coupon applied on the bill</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => { removeOffer() }} style={{ justifyContent: 'center', alignItems: 'center', height: 50, width: 50 }}>
                                                        <Icon name="closecircle" type="AntDesign" style={{ fontSize: 18, color: '#c9c9c9' }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        <View style={{
                                            backgroundColor: 'white', marginTop: 10, paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'center', height: 65
                                            // borderTopWidth: 1, borderBottomWidth: 1, borderColor: Theme.Colors.primary,
                                        }}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                {/* <View style={{ backgroundColor: '#FDEFEF', borderWidth: 1, borderColor: "#F5C4C6", borderTopLeftRadius: 4, borderBottomLeftRadius: 4, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                                                <Image
                                                    style={{ height: 16, width: 50, }}
                                                    resizeMode={"contain"}
                                                    source={require('../../assets/png/couponImage.png')}
                                                />
                                            </View> */}
                                                <View style={{ flex: 1, flexDirection: 'row', borderStyle: 'dashed', borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: "#FAFAFA", alignItems: "center", borderWidth: 1.5, borderColor: '#E3E3E3', zIndex: 0, marginLeft: -1 }}>
                                                    <TextInput
                                                        style={{ height: 40, flex: 1, marginLeft: 8, }}
                                                        onChangeText={text => setCoupon(text)}
                                                        placeholder="Apply Coupon Code"
                                                        value={coupon}
                                                        placeholderTextColor="black"
                                                        autoCapitalize="characters"
                                                    />

                                                    <TouchableOpacity onPress={() => onPressApplyCoupon()} style={{ justifyContent: 'center', alignItems: 'center', height: 40 }}>
                                                        <Text style={{ marginHorizontal: 5, color: Theme.Colors.primary, fontWeight: 'bold' }}>Apply</Text>
                                                    </TouchableOpacity>

                                                </View>
                                            </View>
                                        </View>}

                                    <View style={{ backgroundColor: 'white', marginTop: 10 }}>
                                        {availableCouponList?.length > 0 ?
                                            <Text style={{ paddingLeft: 20, paddingTop: 10, fontWeight: 'bold' }}>Available Coupons for you</Text>
                                            : null}
                                        <FlatList
                                            data={availableCouponList}
                                            renderItem={({ item }) =>
                                                <View
                                                    // onPress={() => { navigation.navigate("ProductDetailScreen", { item: item }) }}
                                                    style={styles.productCard}>
                                                    {/* <Text>{JSON.stringify(item, null, "         ")} </Text> */}
                                                    <View style={[{ padding: 10, flex: 1 }]}>
                                                        <Text style={{ fontSize: 16, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.uiListDisplayNameHeader} </Text>
                                                        <Text style={{ fontSize: 14, color: '#909090', marginVertical: 5 }}>{item?.uiListDisplayNameSubHeader} </Text>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <View style={{ justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'row', borderWidth: 1, borderColor: "#F77E82", borderStyle: 'dashed', backgroundColor: '#FDEFEF', padding: 7, borderRadius: 4 }}>
                                                                <Text style={{ fontSize: 14, color: '#E1171E', fontWeight: 'bold' }}>{item?.offerCode} </Text>
                                                            </View>
                                                            <TouchableOpacity onPress={() => {
                                                                setCoupon(item?.offerCode)
                                                                onPressApplyCoupon(item?.offerCode)
                                                            }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ marginHorizontal: 5, color: Theme.Colors.primary, fontWeight: 'bold' }}>Apply</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            }
                                            ItemSeparatorComponent={() => (
                                                <View
                                                    style={{ height: 0.7, width: "90%", alignSelf: 'center', backgroundColor: '#EAEAEC', }}
                                                />
                                            )}
                                            keyExtractor={item => item?.id.toString()}
                                        />
                                    </View>

                                </View>
                            </Content>
                        </Container>
                    </Root>
                    {couponLoading &&
                        <Loader />
                    }
                </SafeAreaView>
            </NativeModal>
            <NativeModal
                animationType="fade"
                transparent={true}
                visible={couponSuccessModal}
                onRequestClose={() => setCouponSuccessModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => { setCouponSuccessModal(false) }} >
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.modalView}>
                                <View style={{ backgroundColor: '#FDEFEF', borderWidth: 1, borderColor: "#F77E82", justifyContent: 'center', alignItems: 'center', zIndex: 1, borderRadius: 50, height: 50, width: 50, alignSelf: 'center', marginTop: -25 }}>
                                    <Image
                                        style={{ height: 16, width: 50, }}
                                        resizeMode={"contain"}
                                        source={require('../../assets/png/couponImage.png')}
                                    />
                                </View>
                                <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                                    <Text style={styles.modalText}>{appliedCoupon?.offer?.uiListDisplayNameHeader}</Text>
                                    <Text style={{ color: '#909090', textAlign: "center", fontSize: 14 }}>Saving with this coupon</Text>
                                    <Text style={{ color: '#909090', fontWeight: 'bold', textAlign: "center", marginVertical: 10 }}>“{appliedCoupon?.offer?.offerCode}” Applied</Text>
                                </View>
                                <TouchableOpacity onPress={() => { setCouponSuccessModal(false) }} style={{ backgroundColor: '#FDEFEF', justifyContent: 'center', alignItems: 'center', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                    <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>OK </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </NativeModal>
        </View>
    );
}

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    offerDetails: state.cart.couponDetails,
    darkMode: state.dark,
    categories: state.home.categories,
    config: state.config.config,
    allUserAddress: state.auth.allUserAddress,
    userLocation: state.location,
})

export default connect(mapStateToProps, { clearCart, getV2DeliverySlots, addOrder, applyOffer, getAvailableOffers, })(CheckoutScreen)

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        // padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
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
        textAlign: "center"
    },
    modalText: {
        color: "#E1171E",
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: "center"
    }
});
