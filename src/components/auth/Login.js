
import LottieView from 'lottie-react-native';
import { Icon, Input, Item, Label, Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, Image, Keyboard, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { login, loginWithProvider } from '../../actions/auth';
import { setDarkMode } from "../../actions/dark";
import AnimateLoadingButton from '../../lib/ButtonAnimated';
import Theme from "../../styles/Theme";
import { Validation } from "../../utils/validate";
import DarkModeToggle from '../common/DarkModeToggle';


const Login = ({ navigation, darkMode, setDarkMode, login, loginWithProvider, isAuthenticated }) => {

    const [loginData, setLoginData] =
        useState({
            email: "manidevaemail@gmail.com",
            password: "Test@123"
        })
    let loadingButton = useRef();

    const [passwordEye, setPasswordEye] = useState(false);
    const [emailBorderColor, setEmailBorderColor] = useState(Theme.Colors.borderColor);
    const [passwordBorderColor, setPasswordBorderColor] = useState(Theme.Colors.borderColor);
    const [passwordErrorText, setPasswordErrorText] = useState("")
    const [emailErrorText, setemailErrorText] = useState("")
    const [animation, setAnimation] = useState({
        logo: "zoomIn",
        email_field: "slideInLeft",
        password_field: "slideInRight",
        fb_btn: "slideInLeft",
        google_btn: "slideInRight",
        signUp_txt: "slideInUp"
    })
    const onBackButtonPress = () => {
        setAnimation({
            ...animation,
            logo: "zoomOut",
            email_field: "fadeOutLeft",
            password_field: "fadeOutRight",
            fb_btn: "fadeOutLeft",
            google_btn: "fadeOutRight",
            signUp_txt: "fadeOutDown"
        })
        return true
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", onBackButtonPress);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", onBackButtonPress);
    }, []);

    const loginWithFacebook = async () => {
        loadingButton.showLoading(true)
        await loginWithProvider(loginData.email, loginData.password, (response, status) => {
            loadingButton.showLoading(false)
            // alert(JSON.stringify(response, null, "      "))
            // if (status) {
            //     loadingButton.showLoading(false)
            //     navigation.pop()
            //     navigation.navigate('DrawerRoute')
            // } else {
            //     loadingButton.showLoading(false)
            // }
        })
    };

    const goToSignup = () => {
        navigation.navigate('SignUp')

    }
    const validate = () => {
        let status = true
        if (loginData.email == undefined || loginData.email.trim() == "") {
            setemailErrorText("Email ID Required")
            setEmailBorderColor("red")
            status = false
        }
        if (loginData.password == undefined || loginData.password.trim() == "") {
            setPasswordErrorText("Password required")
            setPasswordBorderColor("red")
            status = false
        }
        if (loginData.email.indexOf('@') > -1) {
            let validate = new Validation()
            if (!validate.validEmail(loginData.email)) {
                status = false
            }
        }
        return status
    }
    const onSubmit = async () => {
        loadingButton.showLoading(true)
        if (validate()) {
            try {
                await login(loginData.email, loginData.password, (response, status) => {
                    alert(JSON.stringify(response, null, "      "))
                    if (status) {
                        loadingButton.showLoading(false)
                        // navigation.navigate('DrawerRoute')
                        navigation.navigate('DrawerRoute', { screen: 'Settings' })
                    } else {
                        loadingButton.showLoading(false)
                    }
                })
            } catch {
                loadingButton.showLoading(false)
            }
        } else {
            loadingButton.showLoading(false)
        }
    }
    if (isAuthenticated) {
        console.warn("isAuthenticated", isAuthenticated)

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, (darkMode) ? styles.darkBackGroundColor : null]}>
                <ScrollView
                    contentContainerStyle={{ width: "90%", alignSelf: "center", flex: 1, }}
                    keyboardShouldPersistTaps="always"
                    ref={(scroll) => { scroll = scroll; }}
                    showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => console.warn('pressed')} style={{ width: 40, height: 40, justifyContent: 'center', }}>
                        <Image
                            style={{ width: 25, height: 25, }}
                            resizeMode="contain"
                            source={require('../../assets/png/backIcon.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700" }}>Enter Mobile Number</Text>
                    <Text style={{ fontSize: 14, color: "#727272" }}>Login or sign up to get started</Text>
                    <View style={{ marginTop: 20, flex: 1, backgroundColor: 'red' }}>
                        <Text style={{ fontSize: 14, color: "#727272" }}>Login or sign up to get started</Text>
                        <TextInput
                            style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1 }}
                            //   onChangeText={text => onChangeText(text)}
                            value={"value"}
                        />
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{ height: 300, width: 300, }}
                            resizeMode="contain"
                            source={require('../../assets/jpg/loginImage.jpg')}
                        />
                    </View>
                </ScrollView>
            </View >
        </TouchableWithoutFeedback>
    );
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { setDarkMode, login, loginWithProvider })(Login)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    darkBackGroundColor: {
        backgroundColor: Theme.Dark.backgroundColor
    },
    eyeIcon: {
        fontSize: 20,
        color: 'gray',
    },
    mailIcon: {
        color: 'gray',
        fontSize: 20,
    },
    darkMailIcon: {
        fontSize: 20,
        color: Theme.Colors.backgroundColor,

    },
    darkEyeIcon: {
        fontSize: 20,
        color: Theme.Colors.backgroundColor,

    },
    placeholder: {
        fontSize: Theme.fontSize[24],
        borderWidth: 1,
        marginVertical: 5,
        borderRadius: 8
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    Inputs: {
        borderRadius: 25,
        backgroundColor: 'white',
        marginVertical: 10,
        marginBottom: 15,
        height: 55,
        flexDirection: "row",
        borderWidth: 0.2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.41,
        shadowRadius: 7,
        elevation: 4,
    },
    darkTextBox: {
        backgroundColor: "#5A6169",
        borderColor: Theme.Colors.borderColor
    },
    textColor: {
        flex: 1,

    },
    darkText: {
        color: Theme.Dark.text,
    },
    welcomeText: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 24,
        letterSpacing: 1
    },
    darkWelcometext: {
        color: "#ffffff",
        fontWeight: "bold",
        textAlign: "center"

    },
    loginText: {
        color: "#8B8B8B",
        letterSpacing: 0.5,
        marginTop: 10
    },
    darklogintext: {
        color: "#ffffff",
    },
    forgotText: {

    },
    darkforgottext: {
        color: "#ffffff",

    },
    connectText: {
        fontSize: Theme.fontSize[20],
        color: 'gray',
    },
    darkconnecttext: {
        color: "#ffffff",
    },
    signUp: {


    },
    darksignUptext: {
        color: "#ffffff"
    }
});
