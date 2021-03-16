
import LottieView from 'lottie-react-native';
import { Button, Icon, Input, Item, Label, Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Keyboard, Linking, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { requestOtp } from '../../actions/auth';
import { setDarkMode } from "../../actions/dark";
import Theme from "../../styles/Theme";
import { Validation } from "../../utils/validate";
import DarkModeToggle from '../common/DarkModeToggle';


const Login = ({ navigation, darkMode, requestOtp }) => {

    const [mobileNumber, setMobileNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const onSubmit = async () => {
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
            <View style={[styles.container, (darkMode) ? styles.darkBackGroundColor : null]}>
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
            </View>
        </TouchableWithoutFeedback >
    );
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { setDarkMode, requestOtp })(Login)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
