
import LottieView from 'lottie-react-native';
import { Button, Icon, Input, Item, Label, Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Keyboard, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { login, loginWithProvider } from '../../actions/auth';
import { setDarkMode } from "../../actions/dark";
import AnimateLoadingButton from '../../lib/ButtonAnimated';
import alert from '../../reducers/alert';
import Theme from "../../styles/Theme";
import { Validation } from "../../utils/validate";
import DarkModeToggle from '../common/DarkModeToggle';
import CodeInput from 'react-native-confirmation-code-input';
import RF from "react-native-responsive-fontsize";
const OtpScreen = ({ navigation, darkMode, setDarkMode, login, loginWithProvider, isAuthenticated }) => {

    const [otp, setOtp] = useState("")

    const onSubmit = async () => {


        try {
            navigation.navigate('EmailScreen')
            // Alert.alert('success')
            // await login(mobileNumber, (response, status) => {
            //     alert(JSON.stringify(response, null, "      "))
            //     if (status) {
            //         loadingButton.showLoading(false)
            //         // navigation.navigate('DrawerRoute')
            //         navigation.navigate('DrawerRoute', { screen: 'Settings' })
            //     } else {

            //     }
            // })
        } catch {

        }

    }

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
                        <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272" }}>We sent an SMS with OTP to +919898989898</Text>
                        <View style={{ flex: 1, marginTop: "15%" }}>
                            <View style={{ height: 100 }}>
                                <CodeInput
                                    secureTextEntry
                                    activeColor={Theme.Colors.primary}
                                    inactiveColor={"#D8D8D8"}
                                    autoFocus={false}
                                    ignoreCase={true}
                                    space={20}
                                    codeLength={4}
                                    inputPosition='center'
                                    size={60}
                                    onFulfill={(otp) => setOtp(otp)}
                                    containerStyle={{}}
                                    codeInputStyle={{ borderWidth: 1, borderRadius: 4 }}
                                    keyboardType={"number-pad"}
                                />
                            </View>
                            <Text style={{ fontSize: 14, color: "#727272", alignSelf: 'center' }}>00:36</Text>
                            <Button full style={{ marginTop: "5%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text>Confirm</Text></Button>
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


export default connect(mapStateToProps, { setDarkMode, login, loginWithProvider })(OtpScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
