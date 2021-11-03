import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, Dimensions, Image, Linking, TextInput } from 'react-native';
import { Icon, Button } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import call from 'react-native-phone-call';
import { getSupportDetails } from '../../actions/home'
import Loader from '../common/Loader';


const SupportScreen = ({ navigation, getSupportDetails }) => {
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState("")
    const [supportData, setSupportData] = useState({})

    useEffect(() => {
        initialFunction()
    }, [])

    const initialFunction = () => {
        setLoading(true)
        getSupportDetails((res, status) => {
            if (status) {
                setLoading(false)
                console.log(JSON.stringify(res, null, "       "))
                // alert(JSON.stringify(res, null, "       "))
                setSupportData(res)
                // alert(res.data[0]?.customer?.creditBalance)
                // SetCreditBalance(res.data[0]?.customer?.creditBalance)
                setLoading(false)
            } else {
                setLoading(false)
            }
        })
    }

    const callToThisNumber = (erl) => {
        //handler to make a call
        const args = {
            number: erl,
            prompt: false,
        };
        call(args).catch(console.error);
    };
    const onPressWhatsapp = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.warn("Don't know how to open URI");
            }
        });
    }
    const onSendMessage = () => {

    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Support"} showSearch={false} />
            <ScrollView style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: 'white', padding: 15, marginTop: 10 }}>
                    <View style={{ width: "80%" }}>
                        <Text style={{ color: "#000000", fontWeight: "bold", fontSize: 15, letterSpacing: 0.3 }}>{supportData?.message} </Text>
                    </View>
                    {/* <Text style={{ color: "#000000", fontWeight: "bold", fontSize: 15, letterSpacing: 0.2 }}>10AM - 7PM on all days</Text> */}
                    <TouchableOpacity onPress={() => onPressWhatsapp(supportData?.whatsAppUrl)} style={{ borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 6, padding: 10, flexDirection: 'row', marginTop: 15 }}>
                        <View style={{ backgroundColor: '#FDEFEF', borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="whatsapp" type="FontAwesome" style={{ fontSize: 24, color: Theme.Colors.primary }} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 15, }}>
                            <Text style={{ color: '#727272', fontSize: 12.5, marginTop: -5 }}>Send message</Text>
                            <Text style={{ fontWeight: 'bold', marginTop: 6 }}>Whats app</Text>
                        </View>
                        <Image
                            style={{ width: 17, height: 17, alignSelf: "center" }}
                            resizeMode="contain"
                            source={require('../../assets/png/rightIcon.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${supportData?.email}`)} style={{ borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 6, padding: 10, flexDirection: 'row', marginTop: 15 }}>
                        <View style={{ backgroundColor: '#FDEFEF', borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                            {/* rightIcon */}
                            <Image
                                style={{ width: 20, height: 20, }}
                                resizeMode="contain"
                                source={require('../../assets/png/SupportScreenMessage.png')}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 15 }}>
                            <Text style={{ color: '#727272', fontSize: 12.5, marginTop: -5 }}>Email Us</Text>
                            <Text style={{ fontWeight: 'bold', marginTop: 6 }}>{supportData?.email}</Text>
                        </View>
                        <Image
                            style={{ width: 17, height: 17, alignSelf: "center" }}
                            resizeMode="contain"
                            source={require('../../assets/png/rightIcon.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => callToThisNumber(supportData?.contactNumber)} style={{ borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 6, padding: 10, flexDirection: 'row', marginTop: 15 }}>
                        <View style={{ backgroundColor: '#FDEFEF', borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ width: 20, height: 20, }}
                                resizeMode="contain"
                                source={require('../../assets/png/SupportScreenPhone.png')}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 15 }}>
                            <Text style={{ color: '#727272', fontSize: 12.5, marginTop: -5 }}>{supportData?.callUsMessage} </Text>
                            <Text style={{ fontWeight: 'bold', marginTop: 6 }}>{supportData?.contactNumber}</Text>
                        </View>
                        <Image
                            style={{ width: 17, height: 17, alignSelf: "center" }}
                            resizeMode="contain"
                            source={require('../../assets/png/rightIcon.png')}
                        />
                    </TouchableOpacity>
                </View>
                {/* <View style={{ backgroundColor: 'white', padding: 15, marginTop: 10 }}>
                    <Text style={{ color: "#000000", fontSize: 16, letterSpacing: 0.2, fontWeight: "bold" }}>Or Write to us </Text>
                    <Text style={{ color: "#000000", fontSize: 14, letterSpacing: 0.2, marginTop: 8 }}>Write in to us here. We’ll get back to </Text>
                    <Text style={{ color: "#000000", fontSize: 14, letterSpacing: 0.2 }}>you within 24 hrs </Text>
                    <View style={{ marginTop: 15 }}>
                        <View style={{ borderColor: "#eaecef", flexDirection: 'row', borderWidth: 0.8, borderRadius: 5, height: 140, elevation: 0.2 }}>
                            <View style={{}}>
                                <TextInput
                                    style={{ height: 40, padding: 10, fontSize: 16, flex: 1 }}
                                    placeholder="Write your query here…."
                                    onChangeText={text => setQuery(text)}
                                    value={query}
                                    multiline={true}
                                    keyboardType={"default"}
                                />
                            </View>
                        </View>
                    </View>
                    <Button full style={{ marginTop: "12%", zIndex: 1, backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 4, }} onPress={() => {
                        setTimeout(() => {
                            onSendMessage()
                        }, 100);
                    }}><Text style={{ color: "white", fontSize: 16, fontWeight: "bold", letterSpacing: 0.4 }}>Submit</Text></Button>
                </View> */}
            </ScrollView>
            {loading ?
                <Loader /> : undefined}
        </View>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, { getSupportDetails })(SupportScreen)