
import { Button, Icon, Text } from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { BackHandler, Keyboard, ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ripple from 'react-native-material-ripple';
import Icons from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { setDarkMode } from "../../actions/dark";
import Theme from "../../styles/Theme";
import { Validation } from '../../utils/validate';
import DarkModeToggle from '../common/DarkModeToggle';
import AnimateLoadingButton from '../../lib/ButtonAnimated';
import { register } from '../../actions/auth';



const SignUp = ({ navigation, darkMode, setDarkMode, register }: any) => {
    const [signData, setSignData] =
        useState({
            userName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
        })
    const [passwordEye, setPasswordEye] = useState(false);
    const [confirmpasswordEye, setConfirmPasswordEye] = useState(false);

    const [userNameErrorText, setuserNameErrorText] = useState("");
    const [emailErrorText, setemailErrorText] = useState("");
    const [passwordErrorText, setpasswordErrorText] = useState("");
    const [confirmpasswordErrorText, setconfirmpasswordErrorText] = useState("");

    const [emailBorderColor, setEmailBorderColor] = useState(Theme.Colors.borderColor);
    const [userNameBorderColor, setUserNameBorderColor] = useState(Theme.Colors.borderColor);
    const [passwordBorderColor, setPasswordBorderColor] = useState(Theme.Colors.borderColor);
    const [confirmPasswordBorderColor, setConfirmPasswordBorderColor] = useState(Theme.Colors.borderColor);
    const [phoneBorderColor, setPhoneBorderColor] = useState(Theme.Colors.borderColor);



    const [animation, setAnimation] = useState({
        letStart: "slideInDown",
        userName: "slideInRight",
        email_field: "slideInRight",
        phoneNum: "slideInRight",
        password: "slideInRight",
        confirmPassword: "slideInRight",
        signUp_txt: "slideInUp"


    })

    const onBackButtonPress = () => {
        setAnimation({
            ...animation,
            letStart: "fadeOutDown",
            userName: "fadeOutLeft",
            email_field: "fadeOutLeft",
            phoneNum: "fadeOutLeft",
            password: "fadeOutLeft",
            confirmPassword: "fadeOutLeft",
            signUp_txt: "fadeOutDown"
        })
        navigation.goBack()
        return true
    }
    let loadingButton: any = useRef();


    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", onBackButtonPress);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", onBackButtonPress);
    }, []);






    const validate = (): boolean => {
        let status = true

        if (signData.userName == undefined || signData.userName.trim() == "") {
            setuserNameErrorText("User Name Required")
            setUserNameBorderColor("red")
            status = false
        }
        if (signData.email == undefined || signData.email.trim() == "") {
            setemailErrorText("Email ID Required")
            setEmailBorderColor("red")
            status = false
        }
        if (signData.password == undefined || signData.password.trim() == "") {
            setpasswordErrorText("Password required")
            setPasswordBorderColor("red")
            status = false
        }
        if (signData.confirmPassword == undefined || signData.confirmPassword.trim() == "") {
            setconfirmpasswordErrorText("Confirm Password required")
            setConfirmPasswordBorderColor("red")
            status = false
        }
        if (signData.email.indexOf('@') > -1) {
            let validate = new Validation()
            if (!validate.validEmail(signData.email!)) {
                status = false
            }
        }
        return status
    }


    const goToSignUp = async () => {
        loadingButton.showLoading(true)
        if (validate()) {
            try {
                await register(signData.userName, signData.email, signData.phone, signData.password, signData.confirmPassword, (response: any, status: boolean) => {
                    if (status) {
                        loadingButton.showLoading(false)
                        navigation.navigate('Login')
                    } else {
                        loadingButton.showLoading(false)
                    }
                })
            } catch{
                loadingButton.showLoading(false)
            }
        } else {
            loadingButton.showLoading(false)
        }
        // if (validate()) {
        // navigation.navigate('ProfilesRoute')

        // }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <>
                <View style={[styles.container, (darkMode) ? styles.darkBackGroundColor : null]}>
                    <DarkModeToggle />
                    <Ripple
                        onPress={() => onBackButtonPress()}
                        style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', padding: 20 }}
                        rippleContainerBorderRadius={50}
                        rippleCentered={true}
                    >
                        <Icons name="chevron-thin-left" size={20} style={[styles.backIcon, (darkMode) ? styles.darkBackIcon : null,]} />
                    </Ripple>
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        ref={(scroll) => { scroll = scroll; }}
                        showsVerticalScrollIndicator={false}>
                        <Animatable.View animation={animation.letStart} style={{ justifyContent: "center", alignItems: "center", marginVertical: 5 }}>
                            <Text style={[styles.GetStartText, (darkMode) ? styles.darkStartText : null]}>
                                Lets Get Started!
                        </Text>
                            <Text style={[styles.CreateText, (darkMode) ? styles.darkCreateText : null]}>
                                Create Your Account
                        </Text>
                        </Animatable.View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: ("95%"), alignSelf: "center", marginBottom: 12 }}>
                            <Animatable.View duration={600} animation={animation.userName} style={[styles.Inputs, (darkMode) ? styles.darkTextBox : null, { borderColor: userNameBorderColor, borderWidth: userNameBorderColor == "red" ? 2 : 0 }]}>
                                <View style={{ width: 40, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name='person' style={(darkMode) ? styles.darkMailIcon : styles.mailIcon} />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <TextInput
                                        onBlur={() => console.warn('js received blur')}
                                        onTouchStart={() => {
                                            setuserNameErrorText("")
                                            setemailErrorText("")
                                            setpasswordErrorText("")
                                            setconfirmpasswordErrorText("")

                                            setUserNameBorderColor(Theme.Colors.borderColor)
                                            setEmailBorderColor(Theme.Colors.borderColor)
                                            setPhoneBorderColor(Theme.Colors.borderColor)
                                            setPasswordBorderColor(Theme.Colors.borderColor)
                                            setConfirmPasswordBorderColor(Theme.Colors.borderColor)


                                        }}

                                        // onFocus={() => (setMailText(Theme.Colors.danger))}
                                        // onFocus={() => console.warn('js received onFocus')}
                                        style={[styles.textColor, (darkMode) ? styles.darkText : null]}
                                        placeholder={'UserName'}
                                        placeholderTextColor={(darkMode) ? Theme.Colors.backgroundColor : Theme.Colors.black}
                                        keyboardType='email-address'
                                        //returnKeyType='next'
                                        autoCorrect={false}
                                        onChangeText={text => setSignData({ ...signData, userName: text })}
                                    // onSubmitEditing={() => this.passwordInput!.focus()}
                                    // selectionColor={Theme.Colors.primary}
                                    />
                                </View>
                                {userNameErrorText ?
                                    <>
                                        <Animatable.Text animation="bounceIn" style={{ color: 'red', position: 'absolute', bottom: -20, fontSize: Theme.fontSize[20] }}>{userNameErrorText}</Animatable.Text>
                                    </>
                                    : undefined}

                            </Animatable.View>

                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: ("95%"), alignSelf: "center", marginBottom: 12 }}>
                            <Animatable.View duration={800} animation={animation.email_field} style={[styles.Inputs, (darkMode) ? styles.darkTextBox : null, { borderColor: emailBorderColor, borderWidth: emailBorderColor == "red" ? 2 : 0 }]}>
                                <View style={{ width: 40, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name='mail' style={(darkMode) ? styles.darkMailIcon : styles.mailIcon} />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <TextInput
                                        onBlur={() => console.warn('js received blur')}

                                        onTouchStart={() => {
                                            setuserNameErrorText("")
                                            setemailErrorText("")
                                            setpasswordErrorText("")
                                            setconfirmpasswordErrorText("")

                                            setUserNameBorderColor(Theme.Colors.borderColor)
                                            setEmailBorderColor(Theme.Colors.borderColor)
                                            setPhoneBorderColor(Theme.Colors.borderColor)
                                            setPasswordBorderColor(Theme.Colors.borderColor)
                                            setConfirmPasswordBorderColor(Theme.Colors.borderColor)


                                        }}
                                        // onFocus={() => (setMailText(Theme.Colors.danger))}
                                        // onFocus={() => console.warn('js received onFocus')}
                                        style={[styles.textColor, (darkMode) ? styles.darkText : null]}
                                        placeholder={'Email'}
                                        placeholderTextColor={(darkMode) ? Theme.Colors.backgroundColor : Theme.Colors.black}
                                        keyboardType='email-address'
                                        //returnKeyType='next'
                                        autoCorrect={false}
                                        onChangeText={text => setSignData({ ...signData, email: text })}
                                    // onSubmitEditing={() => this.passwordInput!.focus()}
                                    // selectionColor={Theme.Colors.primary}
                                    />
                                </View>
                                {emailErrorText ?
                                    <>
                                        <Animatable.Text animation="bounceIn" style={{ color: 'red', position: 'absolute', bottom: -20, fontSize: Theme.fontSize[20] }}>{emailErrorText}</Animatable.Text>
                                    </>
                                    : undefined}
                            </Animatable.View>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: ("95%"), alignSelf: "center", marginBottom: 12 }}>
                            <Animatable.View duration={1000} animation={animation.phoneNum} style={[styles.Inputs, (darkMode) ? styles.darkTextBox : null, { borderColor: phoneBorderColor, borderWidth: phoneBorderColor == "red" ? 2 : 0 }]}>
                                <View style={{ width: 40, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name='phone-portrait' style={(darkMode) ? styles.darkMailIcon : styles.mailIcon} />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <TextInput
                                        onBlur={() => console.warn('js received blur')}

                                        onTouchStart={() => {
                                            setuserNameErrorText("")
                                            setemailErrorText("")
                                            setpasswordErrorText("")
                                            setconfirmpasswordErrorText("")

                                            setUserNameBorderColor(Theme.Colors.borderColor)
                                            setEmailBorderColor(Theme.Colors.borderColor)
                                            setPhoneBorderColor(Theme.Colors.borderColor)
                                            setPasswordBorderColor(Theme.Colors.borderColor)
                                            setConfirmPasswordBorderColor(Theme.Colors.borderColor)


                                        }}
                                        // onFocus={() => (setMailText(Theme.Colors.danger))}
                                        // onFocus={() => console.warn('js received onFocus')}
                                        style={[styles.textColor, (darkMode) ? styles.darkText : null]}
                                        placeholder={'Phone'}
                                        placeholderTextColor={(darkMode) ? Theme.Colors.backgroundColor : Theme.Colors.black}
                                        keyboardType='email-address'
                                        //returnKeyType='next'
                                        autoCorrect={false}
                                        onChangeText={text => setSignData({ ...signData, phone: text })}
                                    // onSubmitEditing={() => this.passwordInput!.focus()}
                                    // selectionColor={Theme.Colors.primary}
                                    />
                                </View>
                            </Animatable.View>

                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: ("95%"), alignSelf: "center", marginBottom: 12 }}>

                            <Animatable.View duration={1200} animation={animation.password} style={[styles.Inputs, (darkMode) ? styles.darkTextBox : null, { borderColor: passwordBorderColor, borderWidth: passwordBorderColor == "red" ? 2 : 0 }]}>
                                <View style={{ width: 40, justifyContent: "center", alignItems: "center" }}>
                                    <Icon active name='lock' style={(darkMode) ? styles.darkMailIcon : styles.mailIcon} />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <TextInput
                                        // onFocus={() => this.onFocusPassword()}
                                        // onBlur={() => this.onBlurPassword()}
                                        style={[styles.textColor, (darkMode) ? styles.darkText : null]}
                                        placeholder={'Password'}
                                        placeholderTextColor={(darkMode) ? Theme.Colors.backgroundColor : Theme.Colors.black}
                                        //returnKeyType='go'
                                        secureTextEntry={!passwordEye}
                                        autoCorrect={false}
                                        onChangeText={text => setSignData({ ...signData, password: text })}
                                        // ref={component => this.passwordInput = component!}
                                        selectionColor={Theme.Colors.primary}
                                    // value={name}
                                    />
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={{ justifyContent: 'center', alignItems: 'center', width: 50 }}
                                    onPress={() => setPasswordEye(!passwordEye)}>
                                    {passwordEye ?
                                        <Icon name="eye" style={(darkMode) ? styles.darkEyeIcon : styles.eyeIcon} /> :
                                        <Icon name="eye-off" style={(darkMode) ? styles.darkEyeIcon : styles.eyeIcon} />
                                    }
                                </TouchableOpacity>
                                {passwordErrorText ?
                                    <>
                                        <Animatable.Text animation="bounceIn" style={{ color: 'red', position: 'absolute', bottom: -20, fontSize: Theme.fontSize[20] }}>{passwordErrorText}</Animatable.Text>
                                    </>
                                    : undefined}
                            </Animatable.View>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: ("95%"), alignSelf: "center", marginBottom: 12 }}>
                            <Animatable.View duration={1400} animation={animation.confirmPassword} style={[styles.Inputs, (darkMode) ? styles.darkTextBox : null, { borderColor: confirmPasswordBorderColor, borderWidth: confirmPasswordBorderColor == "red" ? 2 : 0 }]}>
                                <View style={{ width: 40, justifyContent: "center", alignItems: "center" }}>
                                    <Icon active name='lock' style={(darkMode) ? styles.darkMailIcon : styles.mailIcon} />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <TextInput
                                        // onFocus={() => this.onFocusPassword()}
                                        // onBlur={() => this.onBlurPassword()}
                                        style={[styles.textColor, (darkMode) ? styles.darkText : null]}
                                        placeholder={'Confirm Password'}
                                        placeholderTextColor={(darkMode) ? Theme.Colors.backgroundColor : Theme.Colors.black}
                                        //returnKeyType='go'
                                        secureTextEntry={!confirmpasswordEye}
                                        autoCorrect={false}
                                        onChangeText={text => setSignData({ ...signData, confirmPassword: text })}
                                        // ref={component => this.passwordInput = component!}
                                        selectionColor={Theme.Colors.primary}
                                    // value={name}
                                    />
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={{ justifyContent: 'center', alignItems: 'center', width: 50 }}
                                    onPress={() => setConfirmPasswordEye(!confirmpasswordEye)}>
                                    {confirmpasswordEye ?
                                        <Icon name="eye" style={(darkMode) ? styles.darkEyeIcon : styles.eyeIcon} /> :
                                        <Icon name="eye-off" style={(darkMode) ? styles.darkEyeIcon : styles.eyeIcon} />
                                    }
                                </TouchableOpacity>
                                {confirmpasswordErrorText ?
                                    <>
                                        <Animatable.Text animation="bounceIn" style={{ color: 'red', position: 'absolute', bottom: -20, fontSize: Theme.fontSize[20] }}>{confirmpasswordErrorText}</Animatable.Text>
                                    </>
                                    : undefined}
                            </Animatable.View>
                        </View>
                        <Animatable.View animation={animation.signUp_txt}>
                            <View style={{ marginVertical: 10 }}>
                                <AnimateLoadingButton
                                    ref={c => (loadingButton = c)}
                                    width={150}
                                    height={50}
                                    title="Create"
                                    // titleFontFamily={"bold"}
                                    titleColor="rgb(255,255,255)"
                                    titleFontSize={18}
                                    backgroundColor={Theme.Colors.primary}
                                    borderRadius={30}
                                    onPress={() => goToSignUp()}
                                />
                            </View>
                            {/* <Button
                                full
                                rounded
                                onPress={() => goToSignUp()}
                                style={{ backgroundColor: "#0148A4", width: '57.33%', marginTop: 10, alignSelf: 'center', marginBottom: 5 }}>
                                <Text style={{ color: "#fff", fontSize: Theme.fontSize[24] }}>Create</Text>
                            </Button> */}
                        </Animatable.View>

                        <Animatable.View animation={animation.signUp_txt}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {
                                    navigation.navigate('Login')
                                }}
                                style={{ alignSelf: 'center', marginVertical: 15 }}>
                                <Text style={[(darkMode) ? styles.darkforgottext : null]}>Already have an account?<Text style={[darkMode ? styles.darksignUptext : null]}> Login Here</Text></Text>
                            </TouchableOpacity>
                        </Animatable.View>

                    </ScrollView>
                </View>
            </>
        </TouchableWithoutFeedback>
    );
}

const mapStateToProps = (state: any) => ({
    darkMode: state.dark
})


export default connect(mapStateToProps, { setDarkMode, register })(SignUp)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.Colors.light
    },
    darkBackGroundColor: {
        backgroundColor: Theme.Dark.backgroundColor
    },
    GetStartText: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 24,
        letterSpacing: 1

    },
    darkStartText: {
        color: "#ffffff",
        fontWeight: "bold",
        textAlign: "center"

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
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 4,
    },
    startText: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    },
    darkstartText: {
        color: "#ffffff"

    },
    CreateText: {
        color: "#8B8B8B",
        letterSpacing: 0.5,
        marginTop: 10,
        textAlign: "center"
    },
    darkCreateText: {
        color: "#ffffff",
    },
    // Inputs: {
    //     borderRadius: 25, backgroundColor: 'white', marginVertical: 5, marginBottom: 15, borderColor: Theme.Colors.borderColor, height: 55, flexDirection: "row", borderWidth: 0.2
    // },
    darkTextBox: {
        backgroundColor: "#5A6169",
        borderColor: Theme.Colors.borderColor
    },
    darkMailIcon: {
        fontSize: 20,
        color: Theme.Colors.backgroundColor,

    },
    textColor: {
        flex: 1,
    },
    mailIcon: {
        color: 'gray',
        fontSize: 20,
    },
    darkText: {
        color: Theme.Dark.text,
    },
    forgotText: {
        fontSize: Theme.fontSize[20]

    },
    darkforgottext: {
        color: "#ffffff",

    },
    signUp: {
        fontSize: Theme.fontSize[20],
        color: "#0148A4",
    },
    darksignUptext: {
        color: "#ffffff"
    },
    backIcon: {
        color: Theme.Colors.black

    },
    darkBackIcon: {
        color: "#ffffff"

    },
    darkEyeIcon: {
        fontSize: 20,
        color: Theme.Colors.backgroundColor,

    },
    eyeIcon: {
        fontSize: 20,
        color: 'gray',
    },

});
