import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { clearCart } from '../../actions/cart'
import Theme from '../../styles/Theme';
import CustomHeader from '../common/CustomHeader';
import CardCartScreen from './CardCartScreen';
import { Icon } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
import { getDeliverySlots, addOrder } from '../../actions/cart'
import moment from 'moment'
import { Radio } from 'native-base';
import RazorpayCheckout from 'react-native-razorpay';
import { RazorpayApiKey } from '../../../env';

const CheckoutScreen = ({ navigation, cartItems, clearCart, getDeliverySlots, addOrder, userLocation }) => {
    const scrollViewRef = useRef();
    const [totalCartValue, settotalCartValue] = useState(0)
    const [nextDayBuffer, setNextDayBuffer] = useState(1)
    const [savedValue, setSavedValue] = useState(0)
    const [slot, setSlot] = useState({})
    const [disableTomorrowSlot, setDisableTomorrowSlot] = useState(false)
    useEffect(() => {
        if (cartItems.length > 0) {
            let total = cartItems.reduce(function (sum, item) {
                return sum + (item.discountedPrice * item.count);
            }, 0);
            settotalCartValue(total)

            let saved = cartItems.reduce(function (sum, item) {
                return sum + ((item.actualPrice - item.discountedPrice) * item.count);
            }, 0);
            setSavedValue(saved)
        } else {
            settotalCartValue(0)
            setSavedValue(0)
        }
    }, [cartItems])

    useEffect(() => {
        // alert(JSON.stringify(userLocation?.pincode, null, "        "))
        getDeliverySlots(nextDayBuffer, userLocation?.pincode, (res, status) => {
            if (status) {
                setSlot(res?.data)
            } else {
                setSlot({})
            }
        })
        var today = new Date();
        var hour = today.getHours();
        if (hour >= 21) {
            setDisableTomorrowSlot(true)
        }
    }, [nextDayBuffer, userLocation])

    useEffect(() => {
        var today = new Date();
        var hour = today.getHours();
        if (hour >= 21) {
            // alert(hour)
            setNextDayBuffer(2)
            setDisableTomorrowSlot(true)
        }
    }, [])

    const onClearCart = async () => {
        clearCart()
    }

    const onPressSlot = (option) => {
        setNextDayBuffer(option)
    }

    const onPressMakePayment = async () => {
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
            "totalPrice": totalCartValue
        }
        // alert(JSON.stringify(payload, null, "     "))
        addOrder(payload, async (res, status) => {
            if (status) {
                // alert(JSON.stringify(res?.data, null, "        "))
                let userDetails = await AsyncStorage.getItem('userDetails');
                let parsedUserDetails = await JSON.parse(userDetails);

                var options = {
                    description: 'Select the payment method',
                    image: 'https://d26w0wnuoojc4r.cloudfront.net/zasket_logo_3x.png',
                    currency: 'INR',
                    key: RazorpayApiKey,
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
                    alert(`Success: ${data.razorpay_payment_id}`);
                    onClearCart()
                    navigation.navigate('AccountStack', { screen: 'MyOrders' })
                }).catch((error) => {
                    // handle failure
                    alert(`Error: ${error.code} | ${error.description}`);
                })
            } else {
                alert(JSON.stringify(res?.response?.data?.description, null, "        "))
            }
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Checkout"} showSearch={false} />
            <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={false}>
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>{JSON.stringify(location, null, "       ")}</Text> */}

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
                                }</Text>
                            </View>
                            <TouchableOpacity onPress={() => { navigation.navigate('MapScreen', { fromScreen: "CartScreen" }) }} style={{}}>
                                <Text style={{ color: Theme.Colors.primary }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <Text numberOfLines={2} style={{ color: "#909090", fontSize: 13, marginTop: 5 }}>{userLocation?.addressLine_1}</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 16, marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Book a slot</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: 60 }}>
                        {disableTomorrowSlot ?
                            <View style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: "#EFEFEF", backgroundColor: "#F1F1F1", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#727272', fontSize: 12 }}>Tomorrow</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment().add(1, 'days').format("DD MMM")}</Text>
                            </View>
                            :
                            <TouchableOpacity activeOpacity={0.7} onPress={() => { onPressSlot(1) }} style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: nextDayBuffer == 1 ? Theme.Colors.primary : "#EFEFEF", backgroundColor: nextDayBuffer == 1 ? '#FDEFEF' : "white", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#727272', fontSize: 12 }}>Tomorrow</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment().add(1, 'days').format("DD MMM")}</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity activeOpacity={0.7} onPress={() => { onPressSlot(2) }} style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: nextDayBuffer == 2 ? Theme.Colors.primary : "#EFEFEF", backgroundColor: nextDayBuffer == 2 ? '#FDEFEF' : "white", justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#727272', fontSize: 12 }}>{moment().add(2, 'days').format("ddd")}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment().add(2, 'days').format("DD MMM")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => { onPressSlot(3) }} style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: nextDayBuffer == 3 ? Theme.Colors.primary : "#EFEFEF", backgroundColor: nextDayBuffer == 3 ? '#FDEFEF' : "white", justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#727272', fontSize: 12 }}>{moment().add(3, 'days').format("ddd")}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment().add(3, 'days').format("DD MMM")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => { onPressSlot(4) }} style={{ padding: 10, minWidth: 70, borderWidth: 1, borderRadius: 5, borderColor: nextDayBuffer == 4 ? Theme.Colors.primary : "#EFEFEF", backgroundColor: nextDayBuffer == 4 ? '#FDEFEF' : "white", justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#727272', fontSize: 12 }}>{moment().add(4, 'days').format("ddd")}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{moment().add(4, 'days').format("DD MMM")}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text>{(JSON.stringify(cartItems, null, "        "))}</Text> */}
                    {slot?.description ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Radio selected={true} disabled selectedColor={Theme.Colors.primary} />
                            <Text style={{ marginLeft: 10 }}>{slot?.description}</Text>
                        </View>
                        : undefined}
                </View>


                <View style={{ backgroundColor: 'white', marginTop: 10, padding: 10, paddingHorizontal: 15 }}>
                    <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>Bill Details</Text> <Text style={{ color: '#727272', fontSize: 14, }}>({cartItems?.length} item)</Text></Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, }}>
                        <Text style={{ color: '#727272' }}>Item Total</Text>
                        <Text style={{}}>₹ {totalCartValue}</Text>
                    </View>
                    <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={{ color: '#727272' }}>Delivery Charges</Text>
                        <Text style={{ color: Theme.Colors.primary }}>Free</Text>
                    </View>
                    <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={{ fontWeight: 'bold' }}>Total Payable Amount</Text>
                        <Text style={{ fontWeight: 'bold' }}>₹ {totalCartValue}</Text>
                    </View>
                    {savedValue > 0 ?
                        <View style={{ height: 40, width: "100%", flexDirection: 'column', justifyContent: 'center', borderColor: Theme.Colors.primary, alignSelf: 'center', marginTop: 20, borderStyle: 'dashed', borderWidth: 1.5, borderRadius: 4, backgroundColor: "#FDEFEF", alignItems: "center" }}>
                            <Text style={{ color: Theme.Colors.primary }}>😊 You have saved Rs {savedValue} in this purchase</Text>
                        </View>
                        : undefined}
                </View>
            </ScrollView>
            {cartItems?.length > 0 ?
                <View style={{ height: 55, width: "100%", backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {totalCartValue}</Text>
                        {/* <TouchableOpacity onPress={() => { scrollViewRef.current.scrollToEnd({ animated: true }); }} style={{}}>
                            <Text style={{ color: "#2D87C9" }}>View bill details <Icon name="down" type="AntDesign" style={{ fontSize: 12, color: '#2D87C9' }} /></Text>
                        </TouchableOpacity> */}
                    </View>
                    <TouchableOpacity onPress={() => { onPressMakePayment() }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Make a Payment <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                    </TouchableOpacity>
                </View>
                : undefined}
        </View>
    );
}

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    darkMode: state.dark,
    categories: state.home.categories,
    userLocation: state.location
})

export default connect(mapStateToProps, { clearCart, getDeliverySlots, addOrder })(CheckoutScreen)

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
});
