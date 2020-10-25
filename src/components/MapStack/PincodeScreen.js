
import LottieView from 'lottie-react-native';
import { Button, Icon, Input, Item, Label, Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
const PincodeScreen = ({ navigation, darkMode, setDarkMode, login, loginWithProvider, isAuthenticated }) => {

    const Mode = {
        "DEFAULT": "DEFAULT",
        "AVAILABLE": "AVAILABLE",
        "NOTAVAILABLE": "NOTAVAILABLE",
    }

    const [pinCode, setPinCode] = useState("")
    const [availablity, setAvailablity] = useState(Mode.AVAILABLE)


    const onSubmit = async () => {
        try {
            navigation.navigate('MapScreen')
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
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : null}
            style={styles.container}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={{ width: "90%", alignSelf: "center", flex: 1, }}>
                        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10, width: 40, height: 40, justifyContent: 'center', }}>
                            <Image
                                style={{ width: 20, height: 20, }}
                                resizeMode="contain"
                                source={require('../../assets/png/backIcon.png')}
                            />
                        </TouchableOpacity> */}
                        <View style={{ marginTop: "10%" }}>
                            {availablity == "DEFAULT" || availablity == "AVAILABLE" ?
                                <Image
                                    style={{ width: "100%", height: 250, }}
                                    resizeMode="contain"
                                    source={require('../../assets/png/pinCodeScreenImage.png')}
                                />
                                :
                                <Image
                                    style={{ width: "100%", height: 250, }}
                                    resizeMode="contain"
                                    source={require('../../assets/png/pinCodeScreenImage2.png')}
                                />}
                        </View>
                        {availablity == "DEFAULT" ?
                            <View>
                                <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .3, textAlign: 'center' }}>Enter your pincode</Text>
                                <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272", textAlign: 'center' }}>Let’s first check our service is available at your location or not? Because We Value your time!</Text>
                                <View style={{ flex: 1, marginTop: "10%" }}>
                                    <View style={{ marginTop: "5%", borderBottomColor: "#D8D8D8", flexDirection: 'row', borderBottomWidth: 1 }}>
                                        <View style={{ flex: 1 }}>
                                            <TextInput
                                                style={{ height: 40, }}
                                                onChangeText={text => setPinCode(text)}
                                                value={pinCode}
                                                placeholder={"Pin code"}
                                                placeholderTextColor={"#727272"}
                                            />
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Icon name='location-sharp' style={{ color: '#C3C3C3', fontSize: 20 }} />
                                        </View>
                                    </View>
                                    <Button full style={{ marginTop: "20%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text>Check</Text></Button>
                                </View>
                            </View> : undefined}

                        {availablity == "AVAILABLE" ?
                            <View>
                                <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .3, textAlign: 'center', color: "#5CA123" }}>Choose your Delivery Address</Text>
                                <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272", textAlign: 'center' }}>Let’s first check our service is available at
                                your location or not? Because We Value your time!</Text>
                                {/* <Text style={{ marginTop: "2%", fontSize: 14, color: "#2B2E30", textAlign: 'center', fontWeight: 'bold' }}>Now Choose your Delivery Address</Text> */}
                                <Button full style={{ marginTop: "15%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text><Icon name='location-sharp' style={{ color: '#ffffff', fontSize: 20 }} /> Use My Current Location</Text></Button>
                            </View>
                            : undefined}

                        {availablity == "NOTAVAILABLE" ?
                            <View>
                                <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .3, textAlign: 'center', color: "#BB0E0D" }}>Sorry!</Text>
                                <Text style={{ marginTop: "2%", fontSize: 14, color: "#2B2E30", textAlign: 'center', fontWeight: 'bold' }}>We are not available at your location.</Text>
                                <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272", textAlign: 'center' }}>We are expanding, very soon you can come back</Text>
                                <Button full style={{ marginTop: "15%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text>See products</Text></Button>
                            </View>
                            : undefined}

                    </View>

                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { setDarkMode, login, loginWithProvider })(PincodeScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
