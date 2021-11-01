
import LottieView from 'lottie-react-native';
import { Button, Icon, Input, Item, Label, Text, Toast } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Keyboard, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { verifyOtp, resendOtp, saveUserDetails, onLogin } from '../../actions/auth';
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
import CountDown from 'react-native-countdown-component';
import { StackActions } from '@react-navigation/native';
import RNUxcam from 'react-native-ux-cam';

const OtpScreen = ({ navigation, darkMode, setDarkMode, homeScreenLocation, onLogin, getV2Config, verifyOtp, resendOtp, route }) => {
    const { setOnBoardKey } = React.useContext(AuthContext);
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [counter, SetCounter] = useState(45); // Set here your own timer configurable
    const [random, setRandom] = useState(1);
    const [disabled, setDisabled] = useState(true)

    const { mobileNumber } = route.params;
    const onSubmit = async () => {
        setLoading(true)
        if (otp) {
            let payLoad = {
                "otp": otp,
                "userMobileNumber": mobileNumber,
                "type": "MOBILE_OTP",
            }
            try {
                await verifyOtp(payLoad, async (response, status) => {
                    // Alert.alert(JSON.stringify(response, null, "     "))
                    if (status) {
                        getV2Config((res, status) => { })
                        setLoading(false)
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
                        setLoading(false)
                        if (response?.response?.data?.description == "OTP validation failed") {
                            Alert.alert(response?.response?.data?.description);
                        }
                        if (response?.response?.data?.description == "Customer with details doesn't exist!!. Please sign Up") {
                            // Alert.alert(JSON.stringify(response?.response, null, "        "));
                            // Toast.show({
                            //     text: "Welcome To Zasket",
                            //     buttonText: "Okay",
                            //     type: "success"
                            // })
                            navigation.navigate('EmailScreen', { mobileNumber: mobileNumber, otp: otp })
                        }
                    }
                })
            } catch {
                setLoading(false)
            }
        } else {
            Alert.alert('Please enter otp')
            setLoading(false)
        }
    }
    useEffect(() => {
        if (otp) {
            onSubmit()
        }
    }, [otp])

    const handleResend = async () => {
        setRandom(random + 1)
        setDisabled(true)
        await resendOtp(mobileNumber, (response, status) => {
            if (status) {
                setLoading(false)
            } else {
                setLoading(false)
                Alert.alert('Internal server error')  //only if api fails
            }
        })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, (darkMode) ? styles.darkBackGroundColor : null]}>
                <ScrollView
                    contentContainerStyle={{ flex: 1, }}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}>
                    <View style={{ width: "90%", alignSelf: "center", flex: 1, zIndex: 1 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10, width: 40, height: 40, justifyContent: 'center', }}>
                            <Image
                                style={{ width: 20, height: 20, }}
                                resizeMode="contain"
                                source={require('../../assets/png/backIcon.png')}
                            />
                        </TouchableOpacity>
                        <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .5 }}>Enter OTP</Text>
                        <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272" }}>We sent an SMS with OTP to {mobileNumber} </Text>
                        <View style={{ flex: 1, marginTop: "15%" }}>
                            <View style={{ height: 100 }}>
                                <CodeInput
                                    secureTextEntry={false}
                                    activeColor={Theme.Colors.primary}
                                    inactiveColor={"#D8D8D8"}
                                    autoFocus={false}
                                    ignoreCase={true}
                                    space={20}
                                    codeLength={4}
                                    inputPosition='center'
                                    size={60}
                                    onFulfill={(otp) => { setOtp(otp) }}
                                    containerStyle={{}}
                                    codeInputStyle={{ borderWidth: 1, borderRadius: 4, color: "black", fontWeight: 'bold' }}
                                    keyboardType={"number-pad"}

                                />
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ alignSelf: 'center', color: '#727272' }}>Didn't receive OTP? </Text>
                            </View>
                            {disabled ?
                                <CountDown
                                    key={random}
                                    until={counter}
                                    size={15}
                                    onFinish={() => setDisabled(() => false)}
                                    separatorStyle={{ color: 'black' }}
                                    digitStyle={{ backgroundColor: '#FFF' }}
                                    digitTxtStyle={{ color: '#727272', fontWeight: undefined }}
                                    timeToShow={['M', 'S']}
                                    showSeparator
                                    timeLabels={{ m: '', s: '' }}
                                /> :
                                <TouchableOpacity onPress={handleResend} style={{ marginVertical: 11 }}>
                                    <Text style={{ alignSelf: 'center', color: '#c00000', }}>Resend OTP</Text>
                                </TouchableOpacity>
                            }
                            {/* <Text style={{ fontSize: 14, color: "#727272", alignSelf: 'center' }}>00:36</Text> */}
                            {loading ?
                                <ActivityIndicator style={{ marginTop: "5%", }} color={Theme.Colors.primary} size="large" />
                                :
                                <Button full style={{ marginTop: "5%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text style={{ textTransform: 'capitalize' }}>Confirm</Text></Button>
                            }


                        </View>
                    </View>
                    <View style={{ zIndex: 0 }}>
                        <Image
                            style={{ width: "70%", height: 100, marginLeft: "5%" }}
                            resizeMode="contain"
                            source={require('../../assets/png/otpScreenImage2.png')}
                        />
                        <Image
                            style={{ width: "100%", height: 130, }}
                            resizeMode="contain"
                            source={require('../../assets/png/otpScreenImage.png')}
                        />
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


export default connect(mapStateToProps, { setDarkMode, verifyOtp, getV2Config, saveUserDetails, onLogin, resendOtp })(OtpScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
