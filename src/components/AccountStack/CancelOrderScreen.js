import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, FlatList, Dimensions, Image, RefreshControl, Alert } from 'react-native';
import { Icon } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import CardMyOrders from "./CardMyOrders";
import Loader from "../common/Loader";
import moment from 'moment'
import { Radio, Toast } from 'native-base';
import { TextInput } from "react-native";
import { cancelOrder } from '../../actions/cart';
import { EventRegister } from 'react-native-event-listeners'
let cancelReasons = [
    {
        id: 6,
        reason: "Wrong order"
    },
    {
        id: 2,
        reason: "Ordered by mistake"
    },
    {
        id: 3,
        reason: "Delivery Address Issue"
    },
    {
        id: 4,
        reason: "Change my mind"
    },
    {
        id: 5,
        reason: "Duplicate Order"
    },
    {
        id: 1,
        reason: "Others"
    },
]
const CancelOrderScreen = ({ route, navigation, cancelOrder }) => {
    const { item } = route?.params;
    const [selectedReason, setSelectedReason] = useState({})
    const [customReason, setCustomReason] = useState("")
    const [errorColor, setErrorColor] = useState("#909090")
    const [loading, setLoading] = useState(false)
    const validate = () => {
        let status = true
        if (selectedReason?.id == 1) {
            if (customReason == undefined || customReason.trim() == "") {
                setErrorColor("red")
                status = false
            }
        }
        return status
    }
    const onPressConfirm = () => {
        if (validate()) {
            let payload = {
                cancellation_reason: selectedReason?.id == 1 ? customReason : selectedReason?.reason
            }
            setLoading(true)
            cancelOrder(item?.id, payload, (res, status) => {
                if (status) {
                    if (res?.data?.isCancelled) {
                        Alert.alert(
                            "Alert",
                            `${res?.data?.cancellationComment}`,
                            [
                                { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: true }
                        );
                        // Toast.show({
                        //     text: `${res?.data?.cancellationComment}`,
                        //     buttonText: "Okay",
                        //     type: "success",
                        //     duration: 5000
                        // })
                        EventRegister.emit('successWallet', 'it works!!!')
                        navigation.pop(2)
                        setLoading(false)
                    } else {
                        // alert(`${res?.data?.cancellationComment}`);
                        setLoading(false)
                    }
                } else {
                    setLoading(false)
                    // alert(JSON.stringify(res, null, "       "))
                    // console.warn(JSON.stringify(res?.response, null, "      "))
                }
            })
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Cancel Order"} showSearch={false} />
            <ScrollView style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={true}>
                <View style={{ backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 16, marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Are you sure you want to cancel your order? </Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', }}>
                        <Text style={{ color: '#909090', fontSize: 13 }}>Qty : </Text>
                        <Text style={{ color: '#909090', fontSize: 13 }}>{item?.items?.length} items</Text>
                        <Text style={{ color: '#909090', marginLeft: 25 }}>₹ {(item?.offerPrice > 0 ? item?.offerPrice : item?.totalPrice).toFixed(2)}  </Text>
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 16, marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Reason for cancellation </Text>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={{ color: '#909090', fontSize: 13 }}>Please tell us the reason for cancellation. This information is only used to improve our service </Text>
                    </View>
                    {cancelReasons?.map((el, index) => {
                        return (
                            <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10 }} onPress={() => { setSelectedReason(el) }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Radio selected={selectedReason?.id == el?.id ? true : false} color={Theme.Colors.primary} selectedColor={Theme.Colors.primary} onPress={() => { setSelectedReason(el) }} />
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ color: 'black', fontSize: 14 }}>{el?.reason} </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {selectedReason?.id == 1 ?
                    <View style={{ backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 16, marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Or Write to us  </Text>
                        <View style={[styles.textAreaContainer, { borderColor: errorColor, }]}>
                            <TextInput
                                onTouchStart={() => { setErrorColor("#909090") }}
                                onChangeText={(text) => { setCustomReason(text) }}
                                value={customReason}
                                style={styles.textArea}
                                underlineColorAndroid="transparent"
                                placeholder="Write your reason here…."
                                placeholderTextColor={errorColor}
                                numberOfLines={10}
                                multiline={true}
                            />
                        </View>
                    </View>
                    : null}
                <View style={{ backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 16, marginTop: 10 }}>
                    <Text style={{ marginBottom: 10, color: '#909090', fontSize: 14 }}><Text style={{ marginLeft: 25, color: 'black', fontWeight: 'bold', }}>₹ {(item?.offerPrice > 0 ? item?.offerPrice : item?.totalPrice).toFixed(2)} </Text> will be refunded to you with in 4-5 working days </Text>
                </View>
                {/* <Text Text style={{ marginBottom: 16 }}> {JSON.stringify(item, null, "       ")} </Text> */}
            </ScrollView>
            <View style={{ height: 55, width: "100%", backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {(item?.offerPrice > 0 ? item?.offerPrice : item?.totalPrice).toFixed(2)} </Text>
                    <View style={{}}>
                        <Text style={{ color: "#2D87C9" }}>Refund Amount</Text>
                    </View>
                </View>
                {!selectedReason?.id ?
                    <View style={{ flex: 1.2, backgroundColor: "#F5B0B2", margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Confirm <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                    </View>
                    :
                    loading ?
                        <View style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                            <ActivityIndicator color={"white"} />
                        </View>
                        :
                        <TouchableOpacity onPress={() => { onPressConfirm() }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Confirm <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                        </TouchableOpacity>
                }
            </View>
        </View>
    );
}


const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, { cancelOrder })(CancelOrderScreen)

const styles = StyleSheet.create({
    textAreaContainer: {
        borderWidth: 1,
        padding: 5
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top'
    }
});
