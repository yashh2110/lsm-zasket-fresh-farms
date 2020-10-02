import React, { Fragment } from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import LottieView from 'lottie-react-native';

const Loader = () => {
    return (
        <>
            <View style={[styles.loading]}>
            </View>
            <View style={{ position: 'absolute', elevation: 101, left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView source={require('../../assets/json/Loader1.json')} autoPlay loop style={{ width: 150, height: 150 }} />
            </View>
        </>
    )
}

export default Loader

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        elevation: 100,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
})