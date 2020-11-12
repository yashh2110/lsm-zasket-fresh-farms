
import LottieView from 'lottie-react-native';
import { Button, Icon, Input, Item, Label, Text, Toast } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Keyboard, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { verifyOtp } from '../../actions/auth';
import { setDarkMode } from "../../actions/dark";
import AnimateLoadingButton from '../../lib/ButtonAnimated';
import alert from '../../reducers/alert';
import Theme from "../../styles/Theme";
import { Validation } from "../../utils/validate";
import DarkModeToggle from '../common/DarkModeToggle';
import CodeInput from 'react-native-confirmation-code-input';
import RF from "react-native-responsive-fontsize";
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "../../navigation/Routes"
import { getConfig } from '../../actions/home'

const OtpScreen = ({ navigation, darkMode, setDarkMode, getConfig, verifyOtp, route }) => {

    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)

    const { mobileNumber } = route.params;
    const { signIn } = React.useContext(AuthContext);
    const onSubmit = async () => {
        setLoading(true)
        if (otp) {
            let payLoad = {
                "otp": otp,
                "userMobileNumber": mobileNumber
            }
            try {
                await verifyOtp(payLoad, async (response, status) => {
                    // Alert.alert(JSON.stringify(response, null, "     "))
                    if (status) {
                        setLoading(false)
                        await AsyncStorage.setItem('userDetails', JSON.stringify(response?.data))
                        signIn(response?.data)
                        getConfig((res, status) => { })
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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, (darkMode) ? styles.darkBackGroundColor : null]}>
                <ScrollView
                    contentContainerStyle={{ flex: 1, }}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}>
                    <View style={{ width: "90%", alignSelf: "center", flex: 1, }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10, width: 40, height: 40, justifyContent: 'center', }}>
                            <Image
                                style={{ width: 20, height: 20, }}
                                resizeMode="contain"
                                source={require('../../assets/png/backIcon.png')}
                            />
                        </TouchableOpacity>
                        <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .5 }}>Enter OTP</Text>
                        <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272" }}>We sent an SMS with OTP to {mobileNumber}</Text>
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
                            {/* <Text style={{ fontSize: 14, color: "#727272", alignSelf: 'center' }}>00:36</Text> */}
                            {loading ?
                                <ActivityIndicator style={{ marginTop: "5%", }} color={Theme.Colors.primary} size="large" />
                                :
                                <Button full style={{ marginTop: "5%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text>Confirm</Text></Button>
                            }


                        </View>
                    </View>
                    <View style={{}}>
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
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { setDarkMode, verifyOtp, getConfig })(OtpScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
