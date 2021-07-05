import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList, Share, Image } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Text } from 'native-base';
import LottieView from 'lottie-react-native';
import Theme from '../../styles/Theme';
import moment from 'moment'
import InAppReview from "react-native-in-app-review";

const WalletSuccessScreen = ({ navigation, route }) => {

    useEffect(() => {
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
    const { amount } = route?.params;

    return (

        <>

            <View style={{ flex: 1, backgroundColor: "white" }}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('MyWallet', { reload: 0 }) }}
                    style={{ width: 70, justifyContent: 'center', alignItems: 'center', }}
                >
                    <>
                        <Icon name="chevron-small-left" type="Entypo" style={[{ color: 'black', fontSize: 40 }]} />
                    </>
                </TouchableOpacity>

                {/* <LottieView
                style={{ width: 100, height: 100 }}
                source={require("../../assets/animations/success.json")}
                autoPlay={true}
                loop={false}
            /> */}
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Image
                        style={{ width: 100, height: 100, }}
                        resizeMode={"contain"}
                        source={require('../../assets/png/tickGreen.png')}
                    />
                    <Text style={{ color: "#449005", fontSize: 21, fontWeight: 'bold', marginTop: 20, letterSpacing: 0.4 }}>₹ {amount} added to your</Text>
                    <View style={{ flexDirection: "row", marginTop: 8, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ flexDirection: "row" }}>
                            <Image
                                style={{ width: 122, height: 38, }}
                                resizeMode="contain"
                                source={require('../../assets/png/logo.png')}
                            />
                            <View style={{ justifyContent: "flex-end", alignItems: "center", }}>
                                <Text style={{ fontSize: 20, color: "#0f0f0f", letterSpacing: 0.2 }}>Wallet</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: "60%", marginTop: 25 }}>
                        <Text style={{ fontSize: 12, color: "#727272", textAlign: "center", letterSpacing: 0.1 }}>You can use this money to buy vegetables </Text>
                        <Text style={{ fontSize: 12, color: "#727272", textAlign: "center", letterSpacing: 0.1 }}>& groceries in zasket app</Text>
                    </View>

                </View>
            </View>

        </>
    );
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {})(WalletSuccessScreen)

const styles = StyleSheet.create({

});
