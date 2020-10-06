
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
const EmailScreen = ({ navigation, darkMode, setDarkMode, login, loginWithProvider, isAuthenticated }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

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
                Alert.alert('success')
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
                                    />
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Icon name='user' type="Entypo" style={{ color: '#C3C3C3', fontSize: 20 }} />
                                </View>
                            </View>

                            <View style={{ marginTop: "10%", borderBottomColor: "#D8D8D8", flexDirection: 'row', borderBottomWidth: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={{ height: 40, }}
                                        onChangeText={text => setEmail(text)}
                                        value={email}
                                        placeholder={"Email Address"}
                                        placeholderTextColor={"#727272"}
                                    />
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Icon name='mail' style={{ color: '#C3C3C3', fontSize: 20 }} />
                                </View>
                            </View>


                            <Button full style={{ marginTop: "10%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => navigation.navigate('PincodeScreen')}><Text>Sign Up</Text></Button>
                            <Text style={{ marginTop: "10%", fontSize: 14, color: "#727272", textAlign: 'center' }}>By proceeding to create your account you are agreeing to our <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Terms of Service</Text> and <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Privacy Policy</Text></Text>
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


export default connect(mapStateToProps, { setDarkMode, login, loginWithProvider })(EmailScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
