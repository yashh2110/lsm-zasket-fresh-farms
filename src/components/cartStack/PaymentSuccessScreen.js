import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList, Share, Image } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Text } from 'native-base';
import LottieView from 'lottie-react-native';
import Theme from '../../styles/Theme';
import moment from 'moment'
import InAppReview from "react-native-in-app-review";

const PaymentSuccessScreen = ({ navigation, route }) => {
    const { date, slotTime } = route.params;

    useEffect(() => {
        // alert(slotTime)
        // const initialFunction = async () => {
        //     try {
        //         const isAvailable = await InAppReview.isAvailable();
        //         if (!isAvailable) {
        //             return;
        //         }
        //         InAppReview.RequestInAppReview();
        //     } catch (e) { }
        // }
        // initialFunction()
    }, [])

    const onShare = async () => {
        let appUrl
        if (Platform.OS == "ios") {
            appUrl = "https://apps.apple.com/in/app/zasket/id1541056118"
        }
        if (Platform.OS == "android") {
            appUrl = "https://play.google.com/store/apps/details?id=com.zasket"
        }
        try {
            const result = await Share.share({
                message: appUrl,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            // alert(error.message);
        }
    };
    return (
        <>
            <View style={{ backgroundColor: 'white', alignItems: 'center', flex: 1 }}>
                {/* <LottieView
                style={{ width: 100, height: 100 }}
                source={require("../../assets/animations/success.json")}
                autoPlay={true}
                loop={false}
            /> */}
                <Image
                    style={{ width: 100, height: 100, marginTop: "25%" }}
                    resizeMode={"contain"}
                    source={require('../../assets/png/tickGreen.png')}
                />
                <Text style={{ color: "#449005", fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Thank you for your order</Text>
                <Text style={{ color: "#727272", fontSize: 14, textAlign: 'center', width: '80%' }}>We are currently processing your order.
                    You can find updates to your order under <Text onPress={() => {
                        navigation.navigate('CartStack', { screen: 'MyOrders' })
                        navigation.pop()
                    }} style={{ color: Theme.Colors.primary }}>My orders</Text>.</Text>
                <Text style={{ fontSize: 14, color: "#727272", marginTop: 20 }}>Your order will arrive on </Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{moment().add(date + 1, 'days').format("DD MMM")} ( <Text style={{ fontSize: 14, fontWeight: 'bold' }}>0{slotTime}</Text> )</Text>
                {/* <Text>afasfasfas</Text> */}
                <TouchableOpacity activeOpacity={0.8} onPress={() => { onShare() }} style={{ height: 200, marginTop: "6%" }}>
                    <Image
                        style={{ height: 200, marginTop: "6%" }}
                        resizeMode={"contain"}
                        source={require('../../assets/png/ReferralImage.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginTop: "10%" }}
                    onPress={() => {
                        navigation.navigate('Home')
                        navigation.pop()
                    }}>
                    <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>No Thanks</Text>
                </TouchableOpacity>
            </View>
            {/* ReferralImage */}
            {/* <View style={{ flex: 1.5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: "#727272", marginTop: 50, textAlign: "center", marginHorizontal: 20 }}>If you like the app experience share it
                    with your Friends Now! </Text>
                <Button full style={{ marginVertical: 20, backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => {
                    onShare()
                }}><Image
                        style={{ width: 20, height: 20, }}
                        source={require('../../assets/png/shareIcon.png')}
                    /><Text>Share</Text></Button>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Home')
                    navigation.pop()
                }}>
                    <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>No Thanks</Text>
                </TouchableOpacity>
            </View> */}
        </>
    );
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {})(PaymentSuccessScreen)

const styles = StyleSheet.create({

});
