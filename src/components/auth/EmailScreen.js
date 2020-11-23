
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
import { getConfig } from '../../actions/home'

const EmailScreen = ({ navigation, darkMode, route, createNewCustomer, saveUserDetails, onLogin, loginWithProvider, isAuthenticated, getConfig }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [emailErrorText, setemailErrorText] = useState("")
    const [nameErrorText, setNameErrorText] = useState("")
    const [loading, setLoading] = useState(false)
    const { mobileNumber, otp } = route.params;

    const validate = () => {
        let status = true
        if (email == undefined || email.trim() == "") {
            setemailErrorText("Email ID Required")
            status = false
            setLoading(false)
        } else {
            if (email.indexOf('@') > -1) {
                let validation = new Validation()
                if (!validation.validEmail(email)) {
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
        if (name == undefined || name.trim() == "") {
            setNameErrorText("Name required")
            status = false
            setLoading(false)
        }
        return status
    }


    const onSubmit = async () => {
        setLoading(true)
        if (validate()) {
            let payLoad = {
                "name": name,
                "otp": otp,
                "userEmail": email,
                "userMobileNumber": mobileNumber
            }
            try {
                await createNewCustomer(payLoad, (response, status) => {
                    // Alert.alert(JSON.stringify(response?.response?.data?.description, null, "     "))
                    if (status) {
                        // Alert.alert(JSON.stringify(response));
                        onLogin(response?.data)
                        navigation.navigate('BottomTabRoute')
                        getConfig((res, status) => { })
                        setLoading(false)
                    } else {
                        setLoading(false)
                        // Alert.alert(response?.response?.data?.description);
                        if (response?.response?.data?.description == "Customer with details already exist!. Please sign in") {
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
                        <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .5 }}>Welcome onboard!</Text>
                        <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272" }}>This will help us to serve better</Text>
                        <View style={{ flex: 1, marginTop: "15%" }}>
                            <View style={{ borderBottomColor: "#D8D8D8", flexDirection: 'row', borderBottomWidth: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={{ height: 40, }}
                                        onChangeText={text => setName(text)}
                                        value={name}
                                        placeholder={"Name"}
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
                                    <Text style={{ color: 'red', fontSize: 14 }}>{nameErrorText}</Text>
                                </>
                                : undefined}

                            <View style={{ marginTop: "10%", borderBottomColor: "#D8D8D8", flexDirection: 'row', borderBottomWidth: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={{ height: 40, }}
                                        onChangeText={text => setEmail(text.toLowerCase())}
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
                            </View>
                            {emailErrorText ?
                                <>
                                    <Text style={{ color: 'red', fontSize: 14 }}>{emailErrorText}</Text>
                                </>
                                : undefined}
                            {loading ?
                                <ActivityIndicator style={{ marginTop: "10%", }} color={Theme.Colors.primary} size="large" />
                                :
                                <Button full style={{ marginTop: "10%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text>Sign Up</Text></Button>}
                            <Text style={{ marginTop: "10%", fontSize: 12, color: "#727272", textAlign: 'center' }}>By proceeding to create your account you are agreeing to our <Text onPress={() => handleClick("TERMS")} style={{ fontWeight: 'bold', fontSize: 13 }}>Terms of Service</Text> and <Text onPress={() => handleClick("PRIVACY")} style={{ fontWeight: 'bold', fontSize: 13 }}>Privacy Policy</Text></Text>
                        </View>


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


export default connect(mapStateToProps, { setDarkMode, saveUserDetails, onLogin, createNewCustomer, getConfig })(EmailScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
