import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, Dimensions, Image, Linking, FlatList, TextInput } from 'react-native';
import { Icon, Toast } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import call from 'react-native-phone-call';
import { getCustomerDetails } from "../../actions/home";
import { addMoneyWallet, paymentConfirm, rejectPaymentByAPI } from "../../actions/wallet";
import { clearCart } from '../../actions/cart'
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-community/async-storage';


const AddMoney = ({ route, navigation, getCustomerDetails, addMoneyWallet, clearCart, config, paymentConfirm, rejectPaymentByAPI }) => {
    const [loading, setLoading] = useState(false)
    const [datas, setDatas] = useState([])
    const [amount, setAmount] = useState("₹")
    const [userDetails, setUserDetails] = useState({})
    const [disabled, setDisabled] = useState(false)



    useEffect(() => {
        initialFunction()
    }, [])

    const initialFunction = async () => {
        // let userDetails = await AsyncStorage.getItem('userDetails');
        // let parsedUserDetails = await JSON.parse(userDetails);
        // setUserDetails(parsedUserDetails)
        getCustomerDetails(async (res, status) => {
            if (status) {
                // alert(JSON.stringify(res?.data, null, "       "))
                setUserDetails(res?.data)
                await AsyncStorage.setItem('userDetails', JSON.stringify(res?.data))
                // setRefresh(false)
            } else {
                setUserDetails({})
                // setRefresh(false)
            }
        })
    }
    const onClearCart = async () => {
        clearCart()
    }

    const AddMoney = async () => {
        let sub = amount.substring(1)
        try {
            await addMoneyWallet(sub, async (response, status) => {
                if (status) {
                    // alert(JSON.stringify(response, null, "     "))
                    // await AsyncStorage.setItem('userDetails', JSON.stringify(response?.data))
                    setLoading(false)
                    let userDetails = await AsyncStorage.getItem('userDetails');
                    let parsedUserDetails = await JSON.parse(userDetails);
                    // alert(JSON.stringify(parsedUserDetails, null, "     "))

                    var options = {
                        description: 'Select the payment method',
                        image: 'https://d26w0wnuoojc4r.cloudfront.net/zasket_logo_3x.png',
                        currency: 'INR',
                        key: config?.razorpayApiKey,
                        amount: sub,
                        name: 'Zasket',
                        order_id: response?.data?.paymentResponseId,//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
                        prefill: {
                            email: parsedUserDetails?.customerDetails?.userEmail,
                            contact: parsedUserDetails?.customerDetails?.userMobileNumber,
                            name: parsedUserDetails?.customerDetails?.name
                        },
                        theme: { color: Theme.Colors.primary }
                    }
                    RazorpayCheckout.open(options).then(async (data) => {
                        // handle success
                        // alert(JSON.stringify(data, null, "      "));
                        // onClearCart()
                        // await AsyncStorage.removeItem('appliedCoupon')
                        // AppEventsLogger.logPurchase(totalCartValue, "INR", { param: "value" });
                        // navigation.navigate('PaymentSuccessScreen', { date: nextDayBuffer })
                        let paymentInfo = {
                            "paymentType": "WALLET",
                            "razorpayPaymentId": data.razorpay_payment_id,
                            "razorpaySignature": data.razorpay_signature,
                            "zasketPaymentOrderId": response?.data?.paymentResponseId
                        }
                        paymentConfirm(paymentInfo, (res, status) => {
                            if (status) {
                                // alert(JSON.stringify(res))
                                navigation.pop()
                                navigation.navigate('WalletSuccessScreen', { "amount": sub })
                                // navigation.goBack()
                            } else {
                                Toast.show({
                                    text: "Payment failed",
                                    buttonText: "Okay",
                                    type: "danger",
                                    buttonStyle: { backgroundColor: "#a52f2b" }
                                })

                            }
                        })
                    }).catch((error) => {
                        let paymentInfo = {
                            "paymentType": "WALLET",
                            "zasketPaymentOrderId": response?.data?.paymentResponseId
                        }
                        rejectPaymentByAPI(paymentInfo, (res, status) => {
                            if (status) {

                                // alert(JSON.stringify(res))
                                // navigation.goBack()
                                Toast.show({
                                    text: "Payment failed",
                                    buttonText: "Okay",
                                    type: "danger",
                                    buttonStyle: { backgroundColor: "#a52f2b" }
                                })
                            } else {
                                Toast.show({
                                    text: "Payment failed",
                                    buttonText: "Okay",
                                    type: "danger",
                                    buttonStyle: { backgroundColor: "#a52f2b" }
                                })
                            }
                        })
                        Toast.show({
                            text: "Payment failed",
                            buttonText: "Okay",
                            type: "danger",
                            buttonStyle: { backgroundColor: "#a52f2b" }
                        })
                    })
                } else {
                    setLoading(false)
                }
            })
            // navigation.navigate('WalletSuccessScreen')
        } catch {
            setLoading(false)
        }
    }

    const amountChange = async (text) => {
        let str1 = "₹";
        let str2 = text;
        if (text.length >= 1) {
            setAmount(text)
        } else {
            let res = str1.concat(str2)
            setAmount(res)
        }
        if (text.length > 1) {
            setDisabled(true)
        } else {
            setDisabled(false)

        }

    }


    const { creditBalance } = route?.params;
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Add Money"} showSearch={false} />
            <View style={{ flex: 1, backgroundColor: '#f4f4f4' }} showsVerticalScrollIndicator={false}>
                <View style={{ height: "56%", backgroundColor: 'white', marginTop: 10, }} showsVerticalScrollIndicator={false}>
                    <View style={{ width: "90%", alignSelf: "center", marginTop: 15, }}>
                        <View style={{ flexDirection: "row", }}>
                            <Image
                                style={{ width: 125, height: 40, }}
                                resizeMode="contain"
                                source={require('../../assets/png/logo.png')}
                            />
                            <View style={{ justifyContent: "flex-end", alignItems: "center", }}>
                                <Text style={{ fontSize: 22, color: "#0f0f0f" }}>Wallet </Text>
                            </View>

                        </View>
                        <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ color: "#727272", fontSize: 12, marginRight: 10 }}>Available Balance </Text>
                            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 15 }}>₹ {creditBalance ? creditBalance : 0} </Text>
                        </View>
                        <View style={{ marginTop: ("12%"), }}>
                            <Text style={{ color: "#727272", fontSize: 12, }}>Enter Amount </Text>
                            <TextInput
                                style={{ height: 40, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#D8D8D8', }}
                                // onChangeText={text => setAmount(text)}
                                onChangeText={text => amountChange(text)}
                                value={amount}
                                placeholder={"₹"}
                                placeholderTextColor={"#000000"}
                            />
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", backgroundColor: 'white', marginTop: 50 }}>
                        {

                            disabled ?
                                <TouchableOpacity style={{ height: 48, backgroundColor: "#e1171e", alignSelf: "center", width: ("90%"), justifyContent: "center", marginBottom: 10, marginTop: 6, borderRadius: 30 }} onPress={() => { AddMoney() }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "27%", alignSelf: "center" }}>
                                        <Text style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: 16, letterSpacing: 0.2, color: "#ffffff", textAlign: "center" }}><Text style={{ fontSize: 18, color: "#ffffff" }}></Text>Proceed </Text>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: -5 }}>
                                            <Icon name="chevron-small-right" type="Entypo" style={[{ color: '#ffffff', fontSize: 24, }]} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity disabled={true} style={{ height: 48, backgroundColor: "#F5B0B2", alignSelf: "center", width: ("90%"), justifyContent: "center", marginBottom: 10, marginTop: 6, borderRadius: 30 }} onPress={() => { }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "27%", alignSelf: "center" }}>
                                        <Text style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: 16, letterSpacing: 0.2, color: "#ffffff", textAlign: "center" }}><Text style={{ fontSize: 18, color: "#ffffff" }}></Text>Proceed </Text>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: -5 }}>
                                            <Icon name="chevron-small-right" type="Entypo" style={[{ color: '#ffffff', fontSize: 24, }]} />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                        }
                        {/* <View style={{ width: "90%", alignSelf: "center" }}> */}
                        {/* <Text style={{ fontSize: 12, color: "#727272", textAlign: "center", marginTop: 10 }}>*Paying through zasket wallet will get extra discounts</Text> */}
                        {/* </View> */}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({
    config: state.config.config,
})


export default connect(mapStateToProps, { getCustomerDetails, addMoneyWallet, clearCart, paymentConfirm, rejectPaymentByAPI })(AddMoney)