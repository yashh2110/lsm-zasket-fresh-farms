import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, Dimensions, Image, Linking, FlatList, RefreshControl, Platform, Share, Clipboard } from 'react-native';
import { Icon, Button } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import call from 'react-native-phone-call';
import { getCreditTransactions } from "../../actions/wallet";
import moment from 'moment'
import Loader from '../common/Loader';
import { EventRegister } from 'react-native-event-listeners'
import RNUxcam from 'react-native-ux-cam';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import firebase from '@react-native-firebase/app'
RNUxcam.startWithKey('qercwheqrlqze96'); // Add this line after RNUxcam.optIntoSchematicRecordings();
RNUxcam.optIntoSchematicRecordings();
RNUxcam.tagScreenName('My Wallet');


const ReferalCodeScreen = ({ route, navigation, getCreditTransactions }) => {
    const [loading, setLoading] = useState(false)
    const [referal, setReferal] = useState("")
    const [copymessage, setCopymessage] = useState(false)
    const [dynamicLink, setDynamicLink] = useState("")

    useEffect(() => {
        initialFunction()
    }, [])
    const initialFunction = async () => {
        setLoading(true)
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let referralCode = await parsedUserDetails?.customerDetails?.referralCode
        setReferal(referralCode)
        setLoading(false)

    }
    useEffect(() => {
        generateLink()

    }, [])
    const generateLink = async () => {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let referralCode = await parsedUserDetails?.customerDetails?.referralCode
        const link = await firebase.dynamicLinks().buildShortLink({
            link: `https://zasket.page.link?referralCode=${referralCode}`,
            // link: `https://play.google.com/store/apps/details?id=com.zasket/?${SENDER_UID}`,
            android: {
                packageName: 'com.zasket',
            },
            ios: {
                bundleId: 'com.freshleaftechnolgies.zasket',
                appStoreId: '1541056118',
            },
            domainUriPrefix: 'https://zasket.page.link',
        });
        setDynamicLink(link)
        console.log("qqqqqqqqqqwqwqwqwq", link)
    }






    const whatsupShare = async () => {
        let appUrl
        let reff = "ZASKETZ8IBJM"
        if (Platform.OS == "ios") {
            appUrl = dynamicLink
        }
        if (Platform.OS == "android") {
            appUrl = dynamicLink
        }
        let url =
            'whatsapp://send?text=' +
            `Download Zasket, the one app for all your grocery needs. Get free 500g of Tomato, Onion, Potato on your first order  with my referral code ${referal}\. ` + appUrl
        Linking.openURL(url)
            .then((data) => {
                console.log('WhatsApp Opened', data);
            })
            .catch(() => {
                alert('Make sure Whatsapp installed on your device');
            });
    }

    const moreShare = async () => {
        let appUrl
        if (Platform.OS == "ios") {
            appUrl = dynamicLink
        }
        if (Platform.OS == "android") {
            appUrl = dynamicLink
        }
        try {
            const result = await Share.share({
                message: `Download Zasket, the one app for all your grocery needs. Get free 500g of Tomato, Onion, Potato on your first order  with my referral code ${referal}\. ` + appUrl,
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
    }


    const get_Text_From_Clipboard = (text) => {
        Clipboard.setString(text)
        setCopymessage(true)
        setTimeout(() => {
            setCopymessage(false)
        }, 4000)
    }

    return (
        <>

            {/* <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }></ScrollView> */}
            <SafeAreaView style={{ backgroundColor: 'white', flex: 1, width: ("100%"), alignSelf: "center" }}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="never">
                    <CustomHeader navigation={navigation} title={"Refer & Earn"} showSearch={false} />
                    <View style={{ flex: 1, backgroundColor: '#f4f4f4', }} >
                        <View style={{ flex: 1, }}>
                            <View style={{ backgroundColor: 'white', padding: 15, marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", marginTop: 2 }}>
                                    <Image
                                        style={{ width: 125, height: 125, }}
                                        resizeMode="contain"
                                        source={require('../../assets/png/referImage.png')}
                                    />
                                </View>
                                <View style={{ alignItems: "center", width: "65%", marginTop: 8 }}>
                                    <Text style={{ fontSize: 22, color: "#0f0f0f", fontWeight: "bold", textAlign: "center" }}>Earn ₹50 for each friend you refer </Text>
                                </View>
                                {/* <View style={{ alignItems: "center", width: "75%", marginTop: 8 }}>
                                    <Text style={{ color: "#727272", fontSize: 14, textAlign: "center", letterSpacing: 0.1 }}>Refer your friend to Zasket and both can get Zasket cash. It’s a win - win! </Text>
                                </View> */}
                                <View style={{ marginVertical: 10 }}>
                                    <Text style={{ color: "#0f0f0f", fontSize: 14, textAlign: "center", fontWeight: "bold", }}>REFERRAL CODE </Text>
                                </View>
                                {/* <View style={{ marginTop: 15 }}>
                            </View> */}
                                <View style={{ width: "95%", alignSelf: "center", flexDirection: 'row', borderStyle: 'dashed', borderRadius: 5, backgroundColor: "#ffeaea", alignItems: "center", borderWidth: 1.5, borderColor: '#e1171e', zIndex: 0, marginLeft: -1 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 20, color: "#E1171E", marginLeft: 20, fontWeight: 'bold', letterSpacing: 0.1 }}>{referal} </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { get_Text_From_Clipboard(referal) }} style={{ flexDirection: "row", height: 50, width: 70, justifyContent: "space-evenly", alignItems: "center", }}>
                                        <View style={{
                                            height: '60%',
                                            width: 1,
                                            backgroundColor: '#fabbbb',
                                        }}></View>
                                        <View style={{}}>
                                            <Icon name="copy" type="Entypo" style={{ fontSize: 24, color: '#e1171e' }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ backgroundColor: 'white', padding: 8, marginTop: 7, }}>
                                    <Text style={{ color: "#000000", fontSize: 15, fontWeight: "bold", letterSpacing: 0.1 }}>Share your referral code via </Text>
                                </View>
                                <View style={{ width: "90%", alignSelf: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                                    <TouchableOpacity onPress={() => { whatsupShare() }} style={{ width: "48%", height: 52, backgroundColor: "#1fa900", borderRadius: 25, justifyContent: "center", }}>
                                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                            <Image
                                                style={{ width: 20, height: 20, }}
                                                resizeMode="contain"
                                                source={require('../../assets/png/whatsup.png')}
                                            />
                                            <View style={{}}>
                                                <Text style={{ color: "#ffffff", marginHorizontal: 6, fontWeight: "bold" }}>WhatsApp</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { moreShare() }} style={{ width: "48%", height: 52, borderRadius: 25, justifyContent: "center", borderColor: "#1fa900", borderWidth: 1 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                            <Image
                                                style={{ width: 20, height: 20, }}
                                                resizeMode="contain"
                                                source={require('../../assets/png/more.png')}
                                            />
                                            <View style={{}}>
                                                <Text style={{ color: "#1fa900", marginHorizontal: 6, fontWeight: "bold" }}>More options</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {/* <View style={{ width: "49%", height: 52, backgroundColor: "orange", borderRadius: 25 }}>

                                </View> */}
                                </View>
                            </View>
                            <View style={{ backgroundColor: 'white', padding: 15, marginTop: 10, flex: 1 }}>
                                <View style={{ width: "95%", alignSelf: "center", }}>
                                    <Text style={{ color: "#000000", fontSize: 15, fontWeight: "bold", letterSpacing: 0.1 }}>How it works </Text>
                                    <Text style={{ marginVertical: 3 }}>1.  Share the referral link with your friends.</Text>
                                    <Text style={{ marginVertical: 3 }}>2. Your friends clicks on the link or signs up through the code</Text>
                                    <Text style={{ marginVertical: 3 }}>3. You get Rs 50 in your Zasket wallet, Rs 25 each on first & second orders placed by referee.</Text>
                                    <Text style={{ marginVertical: 3 }}>4. Maximum of Rs 500 can be earned by referrals.</Text>
                                    {
                                        copymessage ?
                                            <View style={{ position: 'absolute', top: 35, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: "#191919", padding: 10, borderRadius: 10 }}>
                                                    <Text style={{ color: "#DCDCDC", letterSpacing: 0.2 }}>Coiped to Clipboard</Text>
                                                </View>
                                            </View>
                                            :
                                            undefined
                                    }
                                </View>

                            </View>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
            {loading ?
                <Loader /> : undefined}
        </>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, { getCreditTransactions })(ReferalCodeScreen)