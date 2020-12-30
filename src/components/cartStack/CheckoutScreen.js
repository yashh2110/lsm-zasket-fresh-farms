import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList, ScrollView, Image, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { clearCart } from '../../actions/cart'
import Theme from '../../styles/Theme';
import CustomHeader from '../common/CustomHeader';
import CardCartScreen from './CardCartScreen';
import { Button, Icon } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
import { getV2DeliverySlots, addOrder } from '../../actions/cart'
import moment from 'moment'
import { Radio, Toast } from 'native-base';
import RazorpayCheckout from 'react-native-razorpay';
import Modal from 'react-native-modal';

const CheckoutScreen = ({ route, navigation, cartItems, clearCart, getV2DeliverySlots, addOrder, userLocation, config }) => {
    const scrollViewRef = useRef();
    const [totalCartValue, setTotalCartValue] = useState(0)
    const [nextDayBuffer, setNextDayBuffer] = useState(undefined)
    const [savedValue, setSavedValue] = useState(0)
    const [marketPrice, setMarketPrice] = useState(0)
    const [slotsArray, setSlotsArray] = useState([])
    const [slot, setSlot] = useState({})
    const [disableTomorrowSlot, setDisableTomorrowSlot] = useState(false)
    const [paymentSelectionActionScreen, setPaymentSelectionActionScreen] = useState(false)
    const { offerPrice, selectedOffer } = route.params;
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("PREPAID")
    useEffect(() => {
        if (cartItems.length > 0) {
            let total = cartItems.reduce(function (sum, item) {
                return sum + (item.discountedPrice * item.count);
            }, 0);
            setTotalCartValue(total)

            let saved = cartItems.reduce(function (sum, item) {
                return sum + ((item.actualPrice - item.discountedPrice) * item.count);
            }, 0);
            setSavedValue(saved)

            let marketPriceValue = cartItems.reduce(function (sum, item) {
                return sum + ((item.actualPrice) * item.count);
            }, 0);

            setMarketPrice(marketPriceValue)
        } else {
            setTotalCartValue(0)
            setSavedValue(0)
        }
    }, [cartItems])

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
                if (status) {
                    onClearCart()
                    navigation.pop()
                    navigation.navigate('PaymentSuccessScreen', { date: nextDayBuffer })
                }
            })
        } else if (option == "PREPAID") {
            // alert(JSON.stringify(payload, null, "     "))
            let prepaidPayload = {
                ...payload,
                "paymentMethod": "PREPAID"
            }
            console.warn(JSON.stringify(payload, null, "     "))
            addOrder(prepaidPayload, async (res, status) => {
                if (status) {
                    console.warn(JSON.stringify(res?.data, null, "        "))
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
                    RazorpayCheckout.open(options).then((data) => {
                        // handle success
                        // alert(`Success: ${data.razorpay_payment_id}`);
                        onClearCart()
                        navigation.pop()
                        navigation.navigate('PaymentSuccessScreen', { date: nextDayBuffer })
                        // navigation.navigate('AccountStack', { screen: 'MyOrders' })
                    }).catch((error) => {
                        // handle failure
                        // alert(`Error: ${error.code} | ${error.description}`);
                        Toast.show({
                            text: "Payment failed",
                            buttonText: "Okay",
                            type: "danger"
                        })
                    })
                } else {
                    if (__DEV__) {
                        alert(JSON.stringify(res?.response, null, "        "))
                    }
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


    const onPressContinue = () => {
        if (selectedPaymentMethod == "PREPAID") {
            setPaymentSelectionActionScreen(false)
            onSelectPaymentMethod("PREPAID")
        } else if (selectedPaymentMethod == "COD") {
            onSelectPaymentMethod("COD")
        }
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
                            <TouchableOpacity onPress={() => { navigation.navigate('MapScreen', { fromScreen: "CartScreen" }) }} style={{}}>
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Radio selected={true} disabled selectedColor={Theme.Colors.primary} />
                            <Text style={{ marginLeft: 10 }}>{slot?.description} </Text>
                        </View>
                        : undefined}
                </View>

                <View style={{ backgroundColor: 'white', marginTop: 10, padding: 10, paddingHorizontal: 15 }}>
                    <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>Bill Details</Text> <Text style={{ color: '#727272', fontSize: 14, }}>({cartItems?.length} item)</Text></Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, }}>
                        <Text style={{ color: '#727272' }}>Item Total</Text>
                        <Text style={{}}>₹ {(totalCartValue).toFixed(2)} </Text>
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
            {cartItems?.length > 0 ?
                <View style={{ height: 55, width: "100%", backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {(offerPrice > 0 ? offerPrice : totalCartValue).toFixed(2)} </Text>
                        {/* <TouchableOpacity onPress={() => { scrollViewRef.current.scrollToEnd({ animated: true }); }} style={{}}>
                            <Text style={{ color: "#2D87C9" }}>View bill details <Icon name="down" type="AntDesign" style={{ fontSize: 12, color: '#2D87C9' }} /></Text>
                        </TouchableOpacity> */}
                    </View>
                    {nextDayBuffer == undefined || nextDayBuffer == null ?
                        <View style={{ flex: 1.2, backgroundColor: "#F5B0B2", margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Make a Payment <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                        </View>
                        :
                        <TouchableOpacity onPress={() => { onPressMakePayment() }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Make a Payment <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                        </TouchableOpacity>
                    }
                </View>
                : undefined}
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
                                <Radio selected={selectedPaymentMethod == "PREPAID" ? true : false} color={Theme.Colors.primary} selectedColor={Theme.Colors.primary} />
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
                                <Radio selected={selectedPaymentMethod == "COD" ? true : false} color={Theme.Colors.primary} selectedColor={Theme.Colors.primary} />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ color: 'black', fontSize: 16 }}>Cash on delivery </Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity onPress={onPressContinue} style={{ height: 50, backgroundColor: Theme.Colors.primary, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{selectedPaymentMethod == "COD" ? "Place Order" : "Continue"} </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </View >
    );
}

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    darkMode: state.dark,
    categories: state.home.categories,
    config: state.config.config,
    userLocation: state.location
})

export default connect(mapStateToProps, { clearCart, getV2DeliverySlots, addOrder })(CheckoutScreen)

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
});
