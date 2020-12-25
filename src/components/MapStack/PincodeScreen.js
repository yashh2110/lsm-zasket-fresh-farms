
import LottieView from 'lottie-react-native';
import { Button, Icon, Input, Item, Label, Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Linking, PermissionsAndroid, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { login, loginWithProvider } from '../../actions/auth';
import { setDarkMode } from "../../actions/dark";
import Theme from "../../styles/Theme";
import { Validation } from "../../utils/validate";
import DarkModeToggle from '../common/DarkModeToggle';
import CodeInput from 'react-native-confirmation-code-input';
import RF from "react-native-responsive-fontsize";
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { MapApiKey } from '../../../env';
import { addHomeScreenLocation } from '../../actions/homeScreenLocation'

const PincodeScreen = ({ navigation, darkMode, setDarkMode, login, addHomeScreenLocation, homeScreenLocation }) => {
    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp()
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const initialFunction = async () => {
        Alert.alert(
            "",
            "Zasket needs to access location. Please permit the permission through Settings screen. Select Permissions -> Enable permission",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => Linking.openSettings() }
            ],
            { cancelable: false }
        );

    }

    const onSubmit = async () => {
        try {
            if (Platform.OS === 'android') {
                // Calling the permission function
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Zasket App Location Permission',
                        message: 'Zasket App needs access to your location',
                        buttonPositive: "Ok"
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentPosition()
                    navigation.goBack()
                } else {
                    // Permission Denied
                    initialFunction()
                }
            } else if (Platform.OS === 'ios') {
                const granted = await request(
                    Platform.select({
                        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                    }),
                    {
                        title: 'Zasket App Location Permission',
                        message: 'Zasket App needs access to your location',
                    },
                );
                if (granted === RESULTS.GRANTED) {
                    getCurrentPosition()
                    navigation.goBack()
                } else {
                    // Permission Denied
                    initialFunction()
                }
            }
        } catch {

        }
    }
    const getCurrentPosition = async () => {
        try {
            if (homeScreenLocation?.addressLine_1 == undefined || homeScreenLocation?.addressLine_1 == "") {
                Geolocation.getCurrentPosition(
                    async (position) => {
                        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + MapApiKey)
                            .then((response) => {
                                response.json().then(async (json) => {
                                    let postal_code = json?.results?.[0]?.address_components?.find(o => JSON.stringify(o.types) == JSON.stringify(["postal_code"]));
                                    addHomeScreenLocation({
                                        addressLine_1: json?.results?.[0]?.formatted_address,
                                        pincode: postal_code?.long_name,
                                        lat: position.coords.latitude,
                                        lon: position.coords.longitude
                                    })
                                    // await this.setLocation(json?.results?.[0]?.formatted_address, position.coords.latitude, position.coords.longitude, postal_code?.long_name)
                                });
                            }).catch((err) => {
                                console.warn(err)
                            })
                    },
                    (error) => {

                    }
                );
            }
        } catch (e) {
            // alert(e.message || "");
        }
    };

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
                            <Image
                                style={{ width: "100%", height: 250, }}
                                resizeMode="contain"
                                source={require('../../assets/png/pinCodeScreenImage.png')}
                            />
                        </View>

                        <View>
                            <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .3, textAlign: 'center' }}>Turn on your device location</Text>
                            <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272", textAlign: 'center' }}>Allow Zasket to access this device's location</Text>
                            {/* <Text style={{ marginTop: "2%", fontSize: 14, color: "#2B2E30", textAlign: 'center', fontWeight: 'bold' }}>Now Choose your Delivery Address</Text> */}
                            <Button full style={{ marginTop: "15%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text style={{ textTransform: 'capitalize' }}><Icon name='location-sharp' style={{ color: '#ffffff', fontSize: 19 }} /> Access Location</Text></Button>
                        </View>



                    </View>

                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    isAuthenticated: state.auth.isAuthenticated,
    homeScreenLocation: state.homeScreenLocation,
})


export default connect(mapStateToProps, { setDarkMode, login, loginWithProvider, addHomeScreenLocation })(PincodeScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
