import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import LottieView from 'lottie-react-native';
import { Dimensions } from "react-native";
import { connect } from 'react-redux';
import Theme from '../../styles/Theme';
import Draggable from './Draggable';
import { SafeAreaView } from 'react-native';

const NoInternetModal = ({ darkMode }: any) => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                // justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'white',
            }}
        >
            <Image
                style={{ width: "100%", height: 300 }}
                resizeMode="center"
                source={require('../../assets/png/noInternet.png')}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Connection Error</Text>
                <Text style={{ color: "#727272", alignSelf: 'center', textAlign: 'center', paddingHorizontal: 20 }}>Please try checking your internet connection & try again</Text>
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = (state: any) => ({
    darkMode: state.dark,
})


export default connect(mapStateToProps)(NoInternetModal)


const styles = StyleSheet.create({})
