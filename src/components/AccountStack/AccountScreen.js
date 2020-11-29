import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, Dimensions, TextInput, RefreshControl } from 'react-native';
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


const AccountScreen = ({ profileUpdate, getCustomerDetails, verifyEmail, navigation }) => {
    const [loading, setLoading] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const [isVisible, setIsVisible] = useState(false)
    const [emailErrorText, setemailErrorText] = useState("")
    const [nameErrorText, setNameErrorText] = useState("")
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        initialFunction()
    }, [isVisible])

    const initialFunction = async () => {
        // let userDetails = await AsyncStorage.getItem('userDetails');
        // let parsedUserDetails = await JSON.parse(userDetails);
        // setUserDetails(parsedUserDetails)
        getCustomerDetails(async (res, status) => {
            if (status) {
                // alert(JSON.stringify(res?.data, null, "       "))
                setUserDetails(res?.data)
                await AsyncStorage.setItem('userDetails', JSON.stringify(res?.data))
                setRefresh(false)
            } else {
                setUserDetails({})
                setRefresh(false)
            }
        })
    }

    const onRefresh = () => {
        setRefresh(true)
        initialFunction()
    }


    const onPressUpdate = async () => {
        setLoading(true)
        if (validate()) {
            try {
                let payload = {
                    "name": userDetails?.customerDetails?.name,
                    "userEmail": userDetails?.customerDetails?.userEmail
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



    return (
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
                        <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}>{userDetails?.customerDetails?.name}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setIsVisible(true) }} style={{ paddingTop: 5, paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ color: '#909090', fontSize: 12 }}>Mobile Number</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}>{userDetails?.customerDetails?.userMobileNumber}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setIsVisible(true) }} style={{ paddingTop: 5, paddingBottom: 5, flexDirection: 'row' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ color: '#909090', fontSize: 12 }}>Email</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, textTransform: 'lowercase' }}>{userDetails?.customerDetails?.userEmail}</Text>
                        {/* <Text>{JSON.stringify(userDetails, null, "       ")}</Text> */}
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

                <TouchableOpacity onPress={() => { navigation.navigate('ManageAddressScreen') }} style={{ paddingTop: 10, paddingBottom: 10, borderBottomColor: '#EAEAEC', borderBottomWidth: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}>Manage Addresses</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate('SupportScreen') }} style={{ paddingTop: 10, paddingBottom: 10, flexDirection: 'row' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5, }}>Support</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: '#727272' }} />
                    </View>
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
                                    <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{nameErrorText}</Text>
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
                                    style={{ height: 40, flex: 1, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#D8D8D8', textTransform: 'lowercase' }}
                                    onChangeText={text => setUserDetails({ ...userDetails, customerDetails: { ...userDetails?.customerDetails, userEmail: text.toLowerCase() } })}
                                    value={userDetails?.customerDetails?.userEmail}
                                    onTouchStart={() => {
                                        setemailErrorText("")
                                    }}
                                />
                            </View>
                            {emailErrorText ?
                                <>
                                    <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{emailErrorText}</Text>
                                </>
                                : undefined}
                        </View>
                    </ScrollView>
                    <TouchableOpacity onPress={() => { onPressUpdate() }} style={{ height: 50, backgroundColor: Theme.Colors.primary, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>{loading ? <ActivityIndicator /> : "Update"}</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, { profileUpdate, verifyEmail, getCustomerDetails })(AccountScreen)