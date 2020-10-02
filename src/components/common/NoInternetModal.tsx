import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';
import { Dimensions } from "react-native";
import { connect } from 'react-redux';
import Theme from '../../styles/Theme';
import { MyText2 } from './MyText';
import Draggable from './Draggable';
const NoInternetModal = ({ darkMode }: any) => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
            }}
        >
            <Draggable>
                <LottieView source={require('../../assets/json/UnPlug.json')} autoPlay loop style={{ width: 300, height: 200, transform: [{ rotate: '110deg' }] }} resizeMode="cover" />
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <MyText2 style={{ color: "white", fontSize: 26, letterSpacing: 2 }}>No Internet Connection</MyText2>
                </View>
            </Draggable>
        </View>
    )
}

const mapStateToProps = (state: any) => ({
    darkMode: state.dark,
})


export default connect(mapStateToProps)(NoInternetModal)


const styles = StyleSheet.create({})
