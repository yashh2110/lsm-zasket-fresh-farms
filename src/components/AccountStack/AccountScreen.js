import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, Dimensions, TextInput, RefreshControl, Platform, Share } from 'react-native';
import { Icon } from 'native-base'
import AsyncStorage from "@react-native-community/async-storage";
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { profileUpdate, verifyEmail } from '../../actions/account'
import { ActivityIndicator } from "react-native";
import { Validation } from "../../utils/validate";
import { getCustomerDetails } from "../../actions/home";
import { onLogout } from '../../actions/auth'
import { AuthContext } from "../../navigation/Routes";
import { getCreditTransactions } from "../../actions/wallet";
import Loader from '../common/Loader';
import { EventRegister } from 'react-native-event-listeners'



const AccountScreen = ({ profileUpdate, getCustomerDetails, verifyEmail, navigation, onLogout, getCreditTransactions, walletbalance }) => {
    const { setOnBoardKey, removeOnBoardKey } = React.useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const [isVisible, setIsVisible] = useState(false)
    const [emailErrorText, setemailErrorText] = useState("")
    const [nameErrorText, setNameErrorText] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [creditBalance, SetCreditBalance] = useState(0)

    useEffect(() => {
        // alert(walletbalance)
        initialFunction()
        // initialFunctions()
    }, [isVisible])

    useEffect(() => {
        initialFunctions()
        let listener = EventRegister.addEventListener('successWallet', async (data) => {
            console.warn("datadatadata", data)
            initialFunctions()
        })
        return () => {
            // alert("failll")
            EventRegister.removeEventListener('successWallet');
        };
    }, [])

    const initialFunctions = async () => {
        setLoading(true)
        // alert(JSON.stringify(walletbalance, null, "       "))
        // SetCreditBalance(walletbalance.auth.userDetails.customerDetails.creditBalance)
        getCreditTransactions((res, status) => {
            if (status) {
                // alert(res.data[0]?.customer?.creditBalance)
                SetCreditBalance(res.data[0]?.customer?.creditBalance)
                setLoading(false)

            } else {
                setLoading(false)

            }
        })

    }

    const initialFunction = async () => {
        setLoading(true)
        // alert(JSON.stringify(walletbalance.auth.userDetails.customerDetails.creditBalance, null, "       "))
        // let userDetails = await AsyncStorage.getItem('userDetails');
        // let parsedUserDetails = await JSON.parse(userDetails);
        // setUserDetails(parsedUserDetails)
        getCustomerDetails(async (res, status) => {
            // alert("asdkfhiu")
            if (status) {
                // alert(JSON.stringify(res?.data, null, "       "))
                setUserDetails(res?.data)
                await AsyncStorage.setItem('userDetails', JSON.stringify(res?.data))
                setRefresh(false)
                setLoading(false)

            } else {
                setUserDetails({})
                setRefresh(false)
                setLoading(false)

            }
        })
    }


    const onRefresh = () => {
        setRefresh(true)
        initialFunction()
        initialFunctions()
    }


    const onPressUpdate = async () => {
        setLoading(true)
        if (validate()) {
            try {
                let payload = {
                    "name": userDetails?.customerDetails?.name,
                    "userEmail": userDetails?.customerDetails?.userEmail.toLowerCase()
                }
                await profileUpdate(payload, async (response, status) => {
                    if (status) {
                        await AsyncStorage.setItem('userDetails', JSON.stringify(response?.data))
                        setIsVisible(false)
                        setLoading(false)
                    } else {
                        setLoading(false)
                    }
                })
            } catch {
                setLoading(false)
            }
        }
    }

    const validate = () => {
        let status = true
        if (userDetails?.customerDetails?.userEmail == undefined || userDetails?.customerDetails?.userEmail.trim() == "") {
            setemailErrorText("Email ID Required")
            status = false
            setLoading(false)
        } else {
            if (userDetails?.customerDetails?.userEmail.indexOf('@') > -1) {
                let validation = new Validation()
                if (!validation.validEmail(userDetails?.customerDetails?.userEmail)) {
                    setemailErrorText("Please enter a valid email address")
                    status = false
                    setLoading(false)
                }
            } else {
                setemailErrorText("Please enter a valid email address")
                status = false
                setLoading(false)
            }
        }
        if (userDetails?.customerDetails?.name == undefined || userDetails?.customerDetails?.name.trim() == "") {
            setNameErrorText("Name required")
            status = false
            setLoading(false)
        }
        return status
    }

    const validateEmailOnly = () => {
        let status = true
        if (userDetails?.customerDetails?.userEmail == undefined || userDetails?.customerDetails?.userEmail.trim() == "") {
            setemailErrorText("Email ID Required")
            status = false
            setLoading(false)
        } else {
            if (userDetails?.customerDetails?.userEmail.indexOf('@') > -1) {
                let validation = new Validation()
                if (!validation.validEmail(userDetails?.customerDetails?.userEmail)) {
                    setemailErrorText("Please enter a valid email address")
                    status = false
                    setLoading(false)
                }
            } else {
                setemailErrorText("Please enter a valid email address")
                status = false
                setLoading(false)
            }
        }
        return status
    }

    // const onVerifyEmail = async () => {
    //     setLoading(true)
    //     if (validateEmailOnly()) {
    //         try {
    //             await verifyEmail(userDetails?.customerDetails?.userEmail, (response, status) => {
    //                 // alert(JSON.stringify(response, null, "       "))
    //                 if (status) {
    //                     alert(`A confirmation link has been sent to ${userDetails?.customerDetails?.userEmail}`)
    //                     setLoading(false)
    //                 } else {
    //                     setLoading(false)
    //                 }
    //             })
    //         } catch {
    //             setLoading(false)
    //         }
    //     }
    // }

    const onPressLogout = async () => {
        // navigation.navigate("HomeStack")
        // navigation.navigate("OnBoardScreen")
        await onLogout()
        removeOnBoardKey()
    }
    const onShare = async () => {
        let appUrl
        if (Platform.OS == "ios") {
            appUrl = "https://apps.apple.com/in/app/zasket/id1541056118"
        }
        if (Platform.OS == "android") {
            appUrl = "https://play.google.com/store/apps/details?id=com.zasket"
        }
        try {
            const result = await Share.share({
                message: "Hi there! We've been using the Zasket App and find it really useful. It's for ordering Groceries online and provides \"Lifetime free delivery\" at \"Least prices\". " + appUrl,
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
    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: '#F8F8F8' }} refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }>
                <View style={{ backgroundColor: 'white', padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Account</Text>
                    <Text style={{ color: '#909090' }}>Edit  and manage your account details</Text>
                </View>

                <View style={{ backgroundColor: 'white', padding: 10, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => {
                        setIsVisible(true)
                    }} style={{ paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ color: '#909090', fontSize: 12 }}>Name</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}>{userDetails?.customerDetails?.name} </Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setIsVisible(true) }} style={{ paddingTop: 5, paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ color: '#909090', fontSize: 12 }}>Mobile Number</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}>{userDetails?.customerDetails?.userMobileNumber} </Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setIsVisible(true) }} style={{ paddingTop: 5, paddingBottom: 5, flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ color: '#909090', fontSize: 12 }}>Email</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, textTransform: 'lowercase' }}>{userDetails?.customerDetails?.userEmail} </Text>
                            {/* <Text>{JSON.stringify(userDetails, null, "       ")} </Text> */}
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={{ backgroundColor: 'white', padding: 15, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('MyOrders') }} style={{ paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}>My Orders</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={() => { navigation.navigate('MyWallet') }} style={{ paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}>My Wallet</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                    </View>
                </TouchableOpacity> */}


                    <TouchableOpacity onPress={() => { navigation.navigate('MyWallet') }} style={{ paddingTop: 10, paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}>My Wallet </Text>
                            <Text style={{ color: '#909090', fontSize: 12 }}>Available Balance ₹ {creditBalance ? creditBalance : 0} </Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigation.navigate('ManageAddressScreen') }} style={{ paddingTop: 10, paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}>Manage Addresses</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigation.navigate('SupportScreen') }} style={{ paddingTop: 10, paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}>Support</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { onShare() }} style={{ paddingTop: 10, paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}>Share app </Text>
                            <Text style={{ color: '#909090', fontSize: 12 }}>with your Family & Friends Now! </Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onPressLogout()} style={{ paddingTop: 10, paddingBottom: 0, flexDirection: 'row' }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5, }}>Logout</Text>
                        </View>
                        {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                    </View> */}
                    </TouchableOpacity>


                </View>

                <Modal
                    isVisible={isVisible}
                    onSwipeComplete={() => setIsVisible(false)}
                    swipeDirection="down"
                    style={{ margin: 0, justifyContent: 'flex-end' }}
                    onBackButtonPress={() => setIsVisible(false)}
                    onBackdropPress={() => setIsVisible(false)}
                >
                    <SafeAreaView style={{ height: 350, backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="never">
                            <View style={{ flex: 1, padding: 20 }}>
                                <View style={{ alignSelf: 'center', height: 5, width: 50, backgroundColor: '#E2E2E2', borderRadius: 50 }} />
                                <Text style={{ fontSize: 12, color: '#727272', marginTop: 20 }}>Name</Text>
                                <TextInput
                                    style={{ height: 40, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#D8D8D8' }}
                                    onChangeText={text => setUserDetails({ ...userDetails, customerDetails: { ...userDetails?.customerDetails, name: text } })}
                                    value={userDetails?.customerDetails?.name}
                                    onTouchStart={() => {
                                        setNameErrorText("")
                                    }}
                                />
                                {nameErrorText ?
                                    <>
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{nameErrorText} </Text>
                                    </>
                                    : undefined}

                                <Text style={{ fontSize: 12, color: '#727272', marginTop: 20 }}>Mobile Number</Text>
                                <TextInput
                                    style={{ height: 40, color: 'grey', fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#D8D8D8' }}
                                    onChangeText={text => setUserDetails({ ...userDetails, customerDetails: { ...userDetails?.customerDetails, userMobileNumber: text } })}
                                    value={userDetails?.customerDetails?.userMobileNumber}
                                    keyboardType={"number-pad"}
                                    editable={false}
                                />

                                <Text style={{ color: '#727272', fontSize: 12, marginTop: 20 }}>Email</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput
                                        style={{ height: 40, flex: 1, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#D8D8D8' }}
                                        onChangeText={text => setUserDetails({ ...userDetails, customerDetails: { ...userDetails?.customerDetails, userEmail: text } })}
                                        value={userDetails?.customerDetails?.userEmail}
                                        onTouchStart={() => {
                                            setemailErrorText("")
                                        }}
                                    />
                                </View>
                                {emailErrorText ?
                                    <>
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{emailErrorText} </Text>
                                    </>
                                    : undefined}
                            </View>
                        </ScrollView>
                        <TouchableOpacity onPress={() => { onPressUpdate() }} style={{ height: 50, backgroundColor: Theme.Colors.primary, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 18 }}>{loading ? <ActivityIndicator /> : "Update"} </Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Modal>
            </ScrollView>
            {loading ?
                <Loader /> : undefined}

        </>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({
    walletbalance: state


})


export default connect(mapStateToProps, { profileUpdate, verifyEmail, getCustomerDetails, onLogout, getCreditTransactions })(AccountScreen)