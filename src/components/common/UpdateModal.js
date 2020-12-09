import React from 'react'
import { StyleSheet, View, Image, Platform, Linking } from 'react-native'
import LottieView from 'lottie-react-native';
import { Dimensions } from "react-native";
import { connect } from 'react-redux';
import Theme from '../../styles/Theme';
import Draggable from './Draggable';
import { SafeAreaView } from 'react-native';
import { Button, Text } from 'native-base';

const UpdateModal = ({ darkMode }) => {
    const onPressUpdate = () => {
        if (Platform.OS == "ios") {
            Linking.canOpenURL("itms-apps://itunes.apple.com/us/app/apple-store/id1541056118?mt=8").then(supported => {
                if (supported) {
                    Linking.openURL("itms-apps://itunes.apple.com/us/app/apple-store/id1541056118?mt=8");
                } else {
                    Linking.openURL("https://apps.apple.com/in/app/zasket/id1541056118");
                    console.warn("Don't know how to open URI");
                }
            });
        }
        if (Platform.OS == "android") {
            Linking.canOpenURL("market://details?id=com.zasket").then(supported => {
                if (supported) {
                    Linking.openURL("market://details?id=com.zasket");
                } else {
                    console.warn("Don't know how to open URI");
                }
            });
        }
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'white',
            }}
        >
            <Image
                style={{ width: "100%", }}
                resizeMode="center"
                source={require('../../assets/png/logo.png')}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Zasket needs an update</Text>
                <Text style={{ color: "#727272", alignSelf: 'center', textAlign: 'center', paddingHorizontal: 20 }}>Please update to the newer version available in {Platform.OS == "android" && "Play store"}{Platform.OS == "ios" && "App store"} to continue</Text>
                <Button full style={{ marginTop: "10%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onPressUpdate()}><Text style={{ textTransform: 'capitalize' }}>Update</Text></Button>
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
})


export default connect(mapStateToProps)(UpdateModal)


const styles = StyleSheet.create({})
