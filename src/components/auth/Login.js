
import LottieView from 'lottie-react-native';
import { Button, Icon, Input, Item, Label, Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Keyboard, Linking, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { requestOtp, trueCallerSign } from '../../actions/auth';
import { verifyOtp, resendOtp, saveUserDetails, onLogin } from '../../actions/auth';
import { setDarkMode } from "../../actions/dark";
import Theme from "../../styles/Theme";
import { Validation } from "../../utils/validate";
import DarkModeToggle from '../common/DarkModeToggle';
import RNUxcam from 'react-native-ux-cam';
import { getV2Config } from '../../actions/home'
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
// import TRUECALLER, {
// TRUECALLER_EVENT,
// TRUECALLER_CONSENT_MODE,
// TRUECALLER_CONSENT_TITLE,
// TRUECALLER_FOOTER_TYPE
// } from 'react-native-truecaller-sdk'
// const NullComponent = (props) => null;
let TRUECALLER;
let TRUECALLERDEFAULT
// if (Platform.OS == 'android') {
//     TRUECALLER = require('react-native-truecaller-sdk');
//     TRUECALLERDEFAULT = require('react-native-truecaller-sdk').default;
// }
const Login = ({ navigation, darkMode, requestOtp, trueCallerSign, homeScreenLocation, getV2Config, onLogin }) => {
    const [mobileNumber, setMobileNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [truecallerLoading, setTruecallerLoading] = useState(false)
    const [trueCallerButtonVisiable, setTrueCallerButtonVisiable] = useState(false)
    const [banner, setBanner] = useState("")

    useEffect(() => {
        if (Platform.OS == "android") {
            return
            TRUECALLERDEFAULT.initializeClient(
                TRUECALLER.TRUECALLER_CONSENT_MODE.Popup,
                TRUECALLER.TRUECALLER_CONSENT_TITLE.Login,
                TRUECALLER.TRUECALLER_FOOTER_TYPE.Continue
            );
            TRUECALLERDEFAULT.on(TRUECALLER.TRUECALLER_EVENT.TrueProfileResponse, profile => { //callback executed 
                console.log('Profile', profile);
                trueCallerLogin(profile)
            });
            TRUECALLERDEFAULT.isUsable(result => {
                if (result === true) {
                    // alert("gfhf")
                    setTrueCallerButtonVisiable(true)
                }
                else {
                    // alert("falsee")
                    setTrueCallerButtonVisiable(false)
                    console.log('Either truecaller app is not installed or user is not logged in')

                }
            });
            TRUECALLERDEFAULT.on(TRUECALLER.TRUECALLER_EVENT.TrueProfileResponseError, error => {
                console.log('User rejected the truecaller consent request! ', error);

                if (error && error.errorCode) {
                    switch (error.errorCode) {
                        case 1: {
                            //Network Failure
                            // alert("Something went wrong', 'please try again")
                            console.log('Something went wrong', 'please try again1')
                            setTruecallerLoading(false)
                            break;
                        }
                        case 2: {
                            //User pressed back
                            // console.log('Something went wrong', 'please try again2')
                            setTruecallerLoading(false)
                            break;
                        }
                        case 3: {
                            //Incorrect Partner Key
                            // alert("Something went wrong', 'please try again")
                            console.log('Something went wrong', 'please try again3')
                            setTruecallerLoading(false)
                            break;
                        }
                        case 4: {
                            // alert("User Not Verified on Truecaller")
                            //User Not Verified on Truecaller
                            console.log('Something went wrong', 'please try again4')
                            setTruecallerLoading(false)
                            break;
                        }
                        case 5: {
                            //Truecaller App Internal Error
                            // alert("Something went wrong', 'please try again")
                            console.log('Something went wrong', 'please try again5')
                            setTruecallerLoading(false)
                            break;
                        }
                        case 10: {
                            alert("User Not Verified on Truecaller")
                            //User Not Verified on Truecaller
                            console.log('Something went wrong', 'please try again6')
                            setTruecallerLoading(false)
                            break;
                        }
                        case 13: {
                            //User pressed back while verification in process
                            console.log('Something went wrong', 'please try again7')
                            setTruecallerLoading(false)
                            break;
                        }
                        case 14: {
                            //User pressed SKIP or USE ANOTHER NUMBER
                            console.log('Something went wrong', 'please try again8')
                            setTruecallerLoading(false)
                            break;
                        }
                        default: {

                        }
                    }
                }
            });
        }
    }, [])


    const trueCallerLogin = async (trueCallerResponse) => {
        if (trueCallerResponse) {
            let payLoad = {
                "type": "TRUE_CALLER",
                "payload": trueCallerResponse?.payload,
                "signature": trueCallerResponse?.signature,
                "signatureAlgorithm": trueCallerResponse?.signatureAlgorithm
            }
            // return
            try {
                await trueCallerSign(payLoad, async (response, status) => {
                    // Alert.alert(JSON.stringify(response, null, "     "))
                    if (status) {
                        getV2Config((res, status) => { })
                        setTruecallerLoading(false)
                        console.log("detailssssssssssssssssss", JSON.stringify(response?.data, null, "          "))
                        await AsyncStorage.setItem('userDetails', JSON.stringify(response?.data))
                        let userDetails = await AsyncStorage.getItem('userDetails');
                        let parsedUserDetails = await JSON.parse(userDetails);
                        let customerId = await parsedUserDetails?.customerDetails?.id
                        RNUxcam.setUserIdentity("" + customerId)
                        onLogin(response?.data)
                        if (homeScreenLocation?.lat == undefined || homeScreenLocation?.lat == "") {
                            navigation.dispatch(StackActions.popToTop());
                            navigation.goBack();
                            navigation.navigate("SwitchNavigator")
                        } else {
                            navigation.navigate("BottomTabRoute")
                        }
                    } else {
                        setTruecallerLoading(false)
                        if (response?.response?.data?.description == "Customer with details doesn't exist!!. Please sign Up") {
                            // alert("signnnnnnnnnnnnnnnnnnnnnnnnnn")
                            // Alert.alert(JSON.stringify(response?.response, null, "        "));
                            // Toast.show({
                            //     text: "Welcome To Zasket",
                            //     buttonText: "Okay",
                            //     type: "success"
                            // })
                            navigation.navigate('EmailScreen', { mode: "trueCaller", payLoadRes: trueCallerResponse?.payload, signature: trueCallerResponse?.signature, signatureAlgorithm: trueCallerResponse?.signatureAlgorithm, firstName: trueCallerResponse?.firstName })
                        }
                    }
                })
            } catch {
                setTruecallerLoading(false)
            }
        } else {
            // Alert.alert('Please enter otp')
            setTruecallerLoading(false)
        }
        // alert(JSON.stringify(payload, null, "       "))
    }

    const onSubmitTrueCaller = () => {
        TRUECALLERDEFAULT.isUsable(result => {
            if (result === true) {
                setTruecallerLoading(false)
                console.log('Authenticate via truecaller flow can be used')
                TRUECALLERDEFAULT.requestTrueProfile();
            }
            else {
                setTruecallerLoading(false)
                alert('Either truecaller app is not installed or user is not logged in')
                console.log('Either truecaller app is not installed or user is not logged in')

            }
        });
    }
    const onSubmit = async () => {
        // navigation.navigate('EmailScreen', { mobileNumber: "23r23r3r234r34", otp: 6868 })
        // return
        setLoading(true)
        let number = mobileNumber
        var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (filter.test(number)) {
            if (number.length == 10) {
                var validate = true;
            } else {
                Alert.alert('Please put 10  digit mobile number');
                setLoading(false)
                var validate = false;
            }
        } else {
            Alert.alert('Please enter 10 digit mobile Number');
            setLoading(false)
            var validate = false;
        }
        if (validate) {
            try {
                let number = "+91" + mobileNumber
                navigation.navigate('OtpScreen', { mobileNumber: number })
                await requestOtp(number, (response, status) => {
                    if (status) {
                        setLoading(false)
                    } else {
                        setLoading(false)
                        Alert.alert('Internal server error')  //only if api fails
                    }
                })
            } catch (err) {
                setLoading(false)
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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {/* <Text>dcsdu</Text> */}
            <View style={[styles.container, (darkMode) ? styles.darkBackGroundColor : null]}>
                {
                    (Platform.OS == "android" && trueCallerButtonVisiable == true) ?
                        <ScrollView
                            contentContainerStyle={{ width: "90%", alignSelf: "center", flex: 1, }}
                            keyboardShouldPersistTaps="always"
                            showsVerticalScrollIndicator={false}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10, width: 40, height: 40, justifyContent: 'center' }}>
                                <Image
                                    style={{ width: 20, height: 20, }}
                                    resizeMode="contain"
                                    source={require('../../assets/png/backIcon.png')}
                                />
                            </TouchableOpacity>
                            <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .5 }}>Enter Mobile Number</Text>
                            <Text style={{ marginTop: "2%", fontSize: 13, color: "#727272" }}>Login or Sign up to get started</Text>
                            <View style={{}}>
                                {truecallerLoading ?
                                    <ActivityIndicator style={{ marginTop: "5%", }} color={"#0086fe"} size="large" />
                                    :
                                    <Button full style={{ marginTop: "5%", zIndex: 1, backgroundColor: "#0086fe", borderRadius: 25, }} onPress={() => {
                                        setTruecallerLoading(true)
                                        setTimeout(() => {
                                            onSubmitTrueCaller()
                                        }, 100);
                                    }}>
                                        <Image
                                            style={{ height: 45, width: 120, zIndex: 0, }}
                                            resizeMode="contain"
                                            source={require('../../assets/png/truecaller.png')}
                                        />
                                    </Button>
                                }
                            </View>
                            <View style={{ alignItems: "center", marginTop: 25 }}>
                                <Image
                                    style={{ height: 40, width: 85, zIndex: 0, }}
                                    resizeMode="contain"
                                    source={require('../../assets/png/orIcon.png')}
                                />
                            </View>
                            <View style={{ flex: 1, marginTop: "9%", zIndex: 1, }}>
                                <Text style={{ fontSize: 14, color: "#727272" }}>Phone Number</Text>
                                <View style={{ borderBottomColor: Theme.Colors.primary, flexDirection: 'row', borderBottomWidth: 1 }}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>+91</Text>
                                    </View>
                                    <View style={{ backgroundColor: "grey", width: 0.5, margin: 13 }} />
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            style={{ height: 40, fontWeight: 'bold' }}
                                            onChangeText={text => setMobileNumber(text)}
                                            value={mobileNumber}
                                            maxLength={10}
                                            keyboardType={"number-pad"}
                                        />
                                    </View>
                                </View>
                                {loading ?
                                    <ActivityIndicator style={{ marginTop: "12%", }} color={Theme.Colors.primary} size="large" />
                                    :
                                    <Button full style={{ marginTop: "12%", zIndex: 1, backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 4, }} onPress={() => {
                                        setLoading(true)
                                        setTimeout(() => {
                                            onSubmit()
                                        }, 100);
                                    }}><Text style={{ textTransform: 'capitalize' }}>Continue</Text></Button>

                                }
                                <View style={{ marginTop: 18, zIndex: 1 }}>
                                    <Text style={{ fontSize: 12, color: "#727272", textAlign: 'center', letterSpacing: 0.2 }}>By proceeding to create your account you are agreeing</Text>
                                    <Text onPress={() => handleClick("TERMS")} style={{ fontSize: 12, color: "#727272", textAlign: 'center', marginVertical: 1 }}> to our  <Text onPress={() => handleClick("PRIVACY")} style={{ fontWeight: 'bold', fontSize: 13 }}>Terms of Services</Text> and <Text onPress={() => handleClick("PRIVACY")} style={{ fontWeight: 'bold', fontSize: 13 }}>Privacy Policy</Text></Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center", bottom: -92, height: 210 }}>
                                <Image
                                    style={{ height: 360 }}
                                    resizeMode="contain"
                                    source={require('../../assets/jpg/loginImage.jpg')}
                                />
                            </View>
                        </ScrollView>
                        :
                        <ScrollView
                            contentContainerStyle={{ width: "90%", alignSelf: "center", flex: 1, }}
                            keyboardShouldPersistTaps="always"
                            showsVerticalScrollIndicator={false}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10, width: 40, height: 40, justifyContent: 'center', }}>
                                <Image
                                    style={{ width: 20, height: 20, }}
                                    resizeMode="contain"
                                    source={require('../../assets/png/backIcon.png')}
                                />
                            </TouchableOpacity>
                            <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .5 }}>Enter Mobile Number</Text>
                            <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272" }}>Login or Sign up to get started</Text>
                            <View style={{ flex: 1, marginTop: "15%", zIndex: 1, }}>
                                <Text style={{ fontSize: 14, color: "#727272" }}>Mobile Number</Text>
                                <View style={{ borderBottomColor: Theme.Colors.primary, flexDirection: 'row', borderBottomWidth: 1 }}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>+91</Text>
                                    </View>
                                    <View style={{ backgroundColor: "grey", width: 0.5, margin: 13 }} />
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            style={{ height: 40, fontWeight: 'bold' }}
                                            onChangeText={text => setMobileNumber(text)}
                                            value={mobileNumber}
                                            maxLength={10}
                                            keyboardType={"number-pad"}
                                        />
                                    </View>
                                </View>
                                {loading ?
                                    <ActivityIndicator style={{ marginTop: "20%", }} color={Theme.Colors.primary} size="large" />
                                    :
                                    <Button full style={{ marginTop: "10%", zIndex: 1, backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => {
                                        setLoading(true)
                                        setTimeout(() => {
                                            onSubmit()
                                        }, 100);
                                    }}><Text style={{ textTransform: 'capitalize' }}>Continue</Text></Button>
                                }
                                <View style={{ marginTop: 10, zIndex: 1 }}>
                                    <Text style={{ fontSize: 12, color: "#727272", textAlign: 'center' }}>By proceeding to create your account you are agreeing to our <Text onPress={() => handleClick("TERMS")} style={{ fontWeight: 'bold', fontSize: 13 }}>Terms of Service</Text> and <Text onPress={() => handleClick("PRIVACY")} style={{ fontWeight: 'bold', fontSize: 14 }}>Privacy Policy</Text></Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'flex-end', alignItems: 'center', zIndex: 0, }}>
                                <Image
                                    style={{ height: 300, width: 400, zIndex: 0, }}
                                    resizeMode="contain"
                                    source={require('../../assets/jpg/loginImage.jpg')}
                                />
                            </View>
                        </ScrollView>

                }
            </View>
        </TouchableWithoutFeedback >
    );
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    isAuthenticated: state.auth.isAuthenticated,
    homeScreenLocation: state.homeScreenLocation,

})


export default connect(mapStateToProps, { setDarkMode, requestOtp, trueCallerSign, onLogin, getV2Config })(Login)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
