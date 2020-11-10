import React from 'react'
import { StyleSheet, Text, View, Image, Platform } from 'react-native'
import LottieView from 'lottie-react-native';
import { Dimensions } from "react-native";
import { connect } from 'react-redux';
import Theme from '../../styles/Theme';
import { MyText2 } from './MyText';
import Draggable from './Draggable';
import { SafeAreaView } from 'react-native';

const UpdateModal = ({ darkMode }) => {
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
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
})


export default connect(mapStateToProps)(UpdateModal)


const styles = StyleSheet.create({})
