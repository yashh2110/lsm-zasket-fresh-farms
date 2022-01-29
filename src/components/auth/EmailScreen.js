
import LottieView from 'lottie-react-native';
import { Button, Icon, Input, Item, Label, Text, Toast } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Linking, Keyboard, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { createNewCustomer, saveUserDetails, onLogin } from '../../actions/auth';
import { setDarkMode } from "../../actions/dark";
import Theme from "../../styles/Theme";
import { Validation } from "../../utils/validate";
import DarkModeToggle from '../common/DarkModeToggle';
import CodeInput from 'react-native-confirmation-code-input';
import RF from "react-native-responsive-fontsize";
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "../../navigation/Routes"
import { getV2Config } from '../../actions/home'
import { StackActions } from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { CheckBox } from 'react-native-elements';


const EmailScreen = ({ navigation, darkMode, route, createNewCustomer, homeScreenLocation, onLogin, loginWithProvider, isAuthenticated, getV2Config }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [referralCode, setReferralCode] = useState("")
    const [emailErrorText, setemailErrorText] = useState("")
    const [nameErrorText, setNameErrorText] = useState("")
    const [loading, setLoading] = useState(false)
    const [nameValidation, setnameValidation] = useState(false)
    const [referralValidation, setreferralValidation] = useState(false)
    const { mobileNumber, otp } = route.params;
    const [visiableReferralCode, setVisiableReferralCode] = useState(true)
    const [whatsUpCheck, setWhatsUpCheck] = useState(true)
    const { mode, payLoadRes, signature, signatureAlgorithm, firstName } = route.params
    useEffect(() => {
        initalFunction()
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
        dynamicLinks()
            .getInitialLink()
            .then(link => {
                console.log("limkkkk", link)
                if (link) {
                    var regex = /[?&]([^=#]+)=([^&#]*)/g,
                        params = {},
                        match;
                    while (match = regex.exec(link.url)) {
                        params[match[1]] = match[2];
                    }
                    console.log("aaaaaaaaaa", params)
                    setReferralCode(params.referralCode)
                    if (params.referralCode) {
                        setVisiableReferralCode(false)
                    }
                }
            });
        setName(firstName)
        return () => {
            unsubscribe()
        }
    }, [])
    const initalFunction = async () => {
        let referralCode = await AsyncStorage.getItem('referralCode');
        if (referralCode) {
            setReferralCode(referralCode)

        }

    }
    const handleDynamicLink = (link) => {
        if (link) {
            spreatereferral(link)

        }
    };
    const spreatereferral = (link) => {
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
        while (match = regex.exec(link.url)) {
            params[match[1]] = match[2];
        }
        // console.log(params.referralCode)
        setReferralCode(params.referralCode)
    }
    const validate = () => {
        let status = true
        // if (email == undefined || email.trim() == "") {
        //     setemailErrorText("Email ID Required")
        //     status = false
        //     setLoading(false)
        // } else {
        //     if (email.indexOf('@') > -1) {
        //         let validation = new Validation()
        //         if (!validation.validEmail(email)) {
        //             setemailErrorText("Please enter a valid email address")
        //             status = false
        //             setLoading(false)
        //         }
        //     } else {
        //         setemailErrorText("Please enter a valid email address")
        //         status = false
        //         setLoading(false)
        //     }
        // }
        if (name == undefined || name.trim() == "") {
            setNameErrorText("Name required")
            status = false
            setLoading(false)
        }
        return status
    }

    const onSubmit = async () => {
        setLoading(true)
        if (mode == "trueCaller") {
            if (validate()) {
                let payLoad = {
                    "type": "TRUE_CALLER",
                    "name": name,
                    "referralCode": referralCode.toUpperCase(),
                    "payload": payLoadRes,
                    "signature": signature,
                    "signatureAlgorithm": signatureAlgorithm,
                    "isWhatAppAlertsEnabled": whatsUpCheck
                }
                console.log("payLoadpayLoadpayLoad", payLoad)
                try {
                    await createNewCustomer(payLoad, (response, status) => {
                        // Alert.alert(JSON.stringify(response?.response?.data?.description, null, "     "))
                        if (status) {
                            // Alert.alert(JSON.stringify(response));
                            onLogin(response?.data)
                            getV2Config((res, status) => { })
                            setLoading(false)
                            // navigation.navigate('BottomTabRoute')

                            if (homeScreenLocation?.lat == undefined || homeScreenLocation?.lat == "") {
                                navigation.dispatch(StackActions.popToTop());
                                navigation.goBack();
                                navigation.navigate("SwitchNavigator")
                            } else {
                                navigation.navigate("BottomTabRoute")
                            }
                        } else {
                            setLoading(false)
                            // Alert.alert(response?.response?.data?.description);
                            if (response?.response?.data?.description == "Customer with details already exist!!. Please sign in") {
                                navigation.navigate("Login")
                                Toast.show({
                                    text: "Customer with email or mobile number already exist!. Please sign in",
                                    buttonText: "Okay",
                                    type: "danger"
                                })
                            }
                            if (response?.response?.data?.description == "OTP validation failed") {
                                Alert.alert(response?.response?.data?.description);
                                navigation.goBack()
                            }
                        }
                    })
                } catch {
                    setLoading(false)
                }

            }

        } else {
            if (validate()) {
                let payLoad = {
                    "type": "MOBILE_OTP",
                    "name": name,
                    "otp": otp,
                    "referralCode": referralCode.toUpperCase(),
                    // "userEmail": email.toLowerCase(),
                    "userMobileNumber": mobileNumber,
                    "isWhatAppAlertsEnabled": whatsUpCheck

                }

                try {
                    await createNewCustomer(payLoad, (response, status) => {
                        // Alert.alert(JSON.stringify(response?.response?.data?.description, null, "     "))
                        if (status) {
                            // Alert.alert(JSON.stringify(response));
                            onLogin(response?.data)
                            getV2Config((res, status) => { })
                            setLoading(false)
                            // navigation.navigate('BottomTabRoute')

                            if (homeScreenLocation?.lat == undefined || homeScreenLocation?.lat == "") {
                                navigation.dispatch(StackActions.popToTop());
                                navigation.goBack();
                                navigation.navigate("SwitchNavigator")
                            } else {
                                navigation.navigate("BottomTabRoute")
                            }
                        } else {
                            setLoading(false)
                            // Alert.alert(response?.response?.data?.description);
                            if (response?.response?.data?.description == "Customer with details already exist!!. Please sign in") {
                                navigation.navigate("Login")
                                Toast.show({
                                    text: "Customer with email or mobile number already exist!. Please sign in",
                                    buttonText: "Okay",
                                    type: "danger"
                                })
                            }
                            if (response?.response?.data?.description == "OTP validation failed") {
                                Alert.alert(response?.response?.data?.description);
                                navigation.goBack()
                            }
                        }
                    })
                } catch {
                    setLoading(false)
                }

            }

        }
    }


    const handleClick = (option) => {
        if (option == "TERMS") {
            Linking.canOpenURL("https://www.zasket.in/terms-and-conditions.html").then(supported => {
                if (supported) {
                    Linking.openURL("https://www.zasket.in/terms-and-conditions.html");
                } else {
                    console.warn("Don't know how to open URI");
                }
            });
        } else if (option == "PRIVACY") {
            Linking.canOpenURL("https://www.zasket.in/privacy-policy.html").then(supported => {
                if (supported) {
                    Linking.openURL("https://www.zasket.in/privacy-policy.html");
                } else {
                    console.warn("Don't know how to open URI");
                }
            });
        }
    };

    const OnChangeName = (text) => {
        setName(text)
        setnameValidation(true)


    }


    const OnChangeReferral = async (text) => {
        // let upperCaseText = text.toUpperCase()
        setReferralCode(text)
        setreferralValidation(true)
    }



    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, (darkMode) ? styles.darkBackGroundColor : null]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10, width: 40, height: 40, justifyContent: 'center', marginLeft: 5 }}>
                    <Image
                        style={{ width: 20, height: 20, alignSelf: "center" }}
                        resizeMode="contain"
                        source={require('../../assets/png/backIcon.png')}
                    />
                </TouchableOpacity>
                <ScrollView
                    contentContainerStyle={{ flex: 1, }}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}>
                    <View style={{ width: "90%", alignSelf: "center", flex: 1, }}>
                        <Text style={{ marginTop: "8%", fontSize: 19, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .2 }}>Welcome onboard!</Text>
                        <Text style={{ marginTop: "2%", fontSize: 13, color: "#727272", letterSpacing: 0.2 }}>This will help us to serve better</Text>
                        <View style={{ flex: 1, marginTop: "15%" }}>
                            <View style={{ borderBottomColor: "#D8D8D8", flexDirection: 'row', borderBottomWidth: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={nameValidation ? { color: '#e1171e', fontSize: 12 } : { color: '#727272', fontSize: 12 }}>Name*</Text>
                                    <TextInput
                                        style={{ height: 42, color: "#000000", fontWeight: "bold", fontSize: 15, }}
                                        onChangeText={text => OnChangeName(text)}
                                        value={name}
                                        // placeholder={"Name"}
                                        placeholderTextColor={"#727272"}
                                        onTouchStart={() => {
                                            setemailErrorText("")
                                            setNameErrorText("")
                                        }}
                                    />
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Icon name='user' type="Entypo" style={{ color: '#C3C3C3', fontSize: 20 }} />
                                </View>
                            </View>
                            {nameErrorText ?
                                <>
                                    <Text style={{ color: 'red', fontSize: 14 }}>{nameErrorText} </Text>
                                </>
                                : undefined}
                            {/* <View style={{ marginTop: "10%", borderBottomColor: "#D8D8D8", flexDirection: 'row', borderBottomWidth: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={{ height: 40, }}
                                        onChangeText={text => setEmail(text)}
                                        value={email}
                                        keyboardType={"email-address"}
                                        placeholder={"Email Address"}
                                        placeholderTextColor={"#727272"}
                                        onTouchStart={() => {
                                            setemailErrorText("")
                                            setNameErrorText("")
                                        }}
                                    />
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Icon name='mail' style={{ color: '#C3C3C3', fontSize: 20 }} />
                                </View>
                            </View> */}
                            {/* {emailErrorText ?
                                <>
                                    <Text style={{ color: 'red', fontSize: 14 }}>{emailErrorText} </Text>
                                </>
                                : undefined} */}
                            {
                                visiableReferralCode ?
                                    <View style={{ borderBottomColor: "#D8D8D8", flexDirection: 'row', borderBottomWidth: 1, marginTop: "11%" }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={referralValidation ? { color: '#e1171e', fontSize: 12 } : { color: '#727272', fontSize: 12 }}>Referral code</Text>
                                            <TextInput
                                                style={{ height: 42, color: "#000000", fontWeight: "bold", fontSize: 15, }}
                                                // onChangeText={text => setReferralCode(text)}
                                                // onChangeText={text => {
                                                //     setReferralCode(text)
                                                // }}
                                                onChangeText={(t) => OnChangeReferral(t)}
                                                value={referralCode}
                                                // placeholder={"Name"}
                                                autoCapitalize={"characters"}
                                                placeholderTextColor={"#727272"}
                                                onTouchStart={() => {
                                                    setemailErrorText("")
                                                    setNameErrorText("")
                                                }}
                                            />
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Image
                                                style={{ width: 20, height: 20, alignSelf: "center" }}
                                                resizeMode="contain"
                                                source={require('../../assets/png/referralIcon.png')}
                                            />
                                        </View>
                                    </View>
                                    :
                                    undefined


                            }

                            <View style={{ backgroundColor: "#f5fff7", borderRadius: 8, borderColor: "#b3cbae", padding: 10, borderWidth: 0.9, marginTop: "10%" }}>
                                <View style={{ justifyContent: 'center', flexDirection: "row", justifyContent: "space-between" }}>
                                    <TouchableOpacity onPress={() => setWhatsUpCheck(!whatsUpCheck)} style={{ width: 30, height: 35, justifyContent: "center", alignItems: "center" }}>
                                        <CheckBox
                                            containerStyle={{ backgroundColor: "white", borderWidth: 0, width: 0, height: 0, marginLeft: -10 }}
                                            checkedIcon={
                                                <Image
                                                    style={{ width: 24, height: 24, }}
                                                    resizeMode="contain"
                                                    source={require('../../assets/png/checkedCheckbox.png')}
                                                />
                                            }
                                            textStyle={{ fontSize: 5 }}
                                            uncheckedIcon={
                                                <>
                                                    <View style={{ padding: 7, borderColor: "red", borderRadius: 2, borderWidth: 2, borderColor: "red" }}>

                                                    </View>
                                                </>
                                            }
                                            checked={whatsUpCheck}
                                            onPress={() => setWhatsUpCheck(!whatsUpCheck)}
                                            // disabled={false}
                                            checkedColor={Theme.Colors.primary}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ flex: 1, marginLeft: -8 }}>
                                        <Text style={{ textAlign: "center", fontSize: 14 }}>Get updates on your orders and other important notifications on WhatsApp</Text>
                                    </View>
                                    <View style={{ alignSelf: "center" }}>
                                        <Image
                                            style={{ width: 30, height: 32 }}
                                            resizeMode="center"
                                            source={require('../../assets/png/aaaaaa.png')}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* <View style={{ marginTop: "10%", borderBottomColor: "#D8D8D8", flexDirection: 'row', borderBottomWidth: 1 }}>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <Text style={{ fontSize: 12, color: "#727272" }}>Referral code</Text>
                                    <TextInput
                                        style={{ height: 55, color: "#000000", fontWeight: "bold", fontSize: 15, flex: 1 }}
                                        onChangeText={text => setReferralCode(text)}
                                        value={referralCode}
                                        placeholderTextColor={"#727272"}
                                    />
                                    <Image
                                        style={{ width: 20, height: 20, alignSelf: "center" }}
                                        resizeMode="contain"
                                        source={require('../../assets/png/referralIcon.png')}
                                    />
                                </View>
                            </View> */}

                            {/* referralIcon */}
                            {/* <View style={{ justifyContent: 'center' }}>
                                    <Icon name='mail' style={{ color: '#C3C3C3', fontSize: 20 }} />
                                </View> */}
                            {loading ?
                                <ActivityIndicator style={{ marginTop: "15%", }} color={Theme.Colors.primary} size="large" />
                                :
                                <Button full style={{ marginTop: "15%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 10, }} onPress={() => onSubmit()}><Text style={{ textTransform: 'capitalize' }}>Sign Up</Text></Button>}
                            {/* <Text style={{ marginTop: "10%", fontSize: 12, color: "#727272", textAlign: 'center' }}>By proceeding to create your account you are agreeing to our <Text onPress={() => handleClick("TERMS")} style={{ fontWeight: 'bold', fontSize: 13 }}>Terms of Service</Text> and <Text onPress={() => handleClick("PRIVACY")} style={{ fontWeight: 'bold', fontSize: 13 }}>Privacy Policy</Text></Text> */}
                            <View style={{ marginTop: 35, zIndex: 1 }}>
                                <Text style={{ fontSize: 12, color: "#727272", textAlign: 'center', letterSpacing: 0.2 }}>By proceeding to create your account you are agreeing</Text>
                                <Text onPress={() => handleClick("TERMS")} style={{ fontSize: 12, color: "#727272", textAlign: 'center', marginVertical: 1 }}> to our  <Text onPress={() => handleClick("PRIVACY")} style={{ fontWeight: 'bold', fontSize: 13 }}>Terms of Services</Text> and <Text onPress={() => handleClick("PRIVACY")} style={{ fontWeight: 'bold', fontSize: 13 }}>Privacy Policy</Text></Text>
                            </View>
                        </View>


                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    isAuthenticated: state.auth.isAuthenticated,
    homeScreenLocation: state.homeScreenLocation,
})


export default connect(mapStateToProps, { setDarkMode, saveUserDetails, onLogin, createNewCustomer, getV2Config })(EmailScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
