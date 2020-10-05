
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


const Login = ({ navigation, darkMode, setDarkMode, login, loginWithProvider, isAuthenticated }) => {

    const [mobileNumber, setMobileNumber] = useState("9898989898")

    const onSubmit = async () => {
        var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (filter.test(mobileNumber)) {
            if (mobileNumber.length == 10) {
                var validate = true;
            } else {
                Alert.alert('Please put 10  digit mobile number');
                console.warn('working')
                var validate = false;
            }
        }
        else {
            Alert.alert('Enter a valid mobile number');
            var validate = false;
        }
        if (validate) {
            try {
                // Alert.alert('success')
                // await login(mobileNumber, (response, status) => {
                //     alert(JSON.stringify(response, null, "      "))
                //     if (status) {
                //         loadingButton.showLoading(false)
                navigation.navigate('OtpScreen')
                //         navigation.navigate('DrawerRoute', { screen: 'Settings' })
                //     } else {

                //     }
                // })
            } catch {

            }

        }
    }

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
                    <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272" }}>Login or sign up to get started</Text>
                    <View style={{ flex: 1, marginTop: "15%" }}>
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
                                />
                            </View>
                        </View>
                        <Button full style={{ marginTop: "20%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text>Continue</Text></Button>
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Image
                            style={{ height: 300, width: 400, }}
                            resizeMode="contain"
                            source={require('../../assets/jpg/loginImage.jpg')}
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


export default connect(mapStateToProps, { setDarkMode, login, loginWithProvider })(Login)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
