import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, FlatList, Dimensions, Image, RefreshControl } from 'react-native';
import { Icon } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import CardMyOrders from "./CardMyOrders";
import Loader from "../common/Loader";
import moment from 'moment'
import { getOrderDetails, payOrder } from "../../actions/cart"
import AsyncStorage from "@react-native-community/async-storage";
import RazorpayCheckout from 'react-native-razorpay';
import { AppEventsLogger } from "react-native-fbsdk";
import { Radio, Toast, Root, Container, Content } from 'native-base';
const MyOrdersDetailScreen = ({ route, navigation, config, getOrderDetails, payOrder }) => {
    const { order_id } = route?.params;
    // const order_id = 514
    const [item, setItem] = useState({})
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [showCancelButton, setShowCancelButton] = useState(true)
    useEffect(() => {
        initialFunction()
    }, [])
    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth();
    }

    const initialFunction = async () => {
        setLoading(true)
        getOrderDetails(order_id, async (response, status) => {
            if (status) {
                setItem(response?.data)
                const yesterday = new Date(response?.data?.slotStartTime)
                yesterday.setDate(yesterday.getDate() - 1)
                var d1 = new Date();
                var d2 = new Date(yesterday);

                if (isSameDay(d1, d2)) {
                    if (new Date().getHours() >= config?.nextDayDeliveryCutOff) {
                        setShowCancelButton(false)
                    }
                } else if (d1 > d2) {
                    setShowCancelButton(false)
                }
                setLoading(false)
                setRefresh(false)
            } else {
                setLoading(false)
                setRefresh(false)
            }
        })
    }

    const onPressPayNow = () => {
        setLoading(true)
        payOrder(item?.id, async (res, status) => {
            setLoading(false)
            if (status) {
                let userDetails = await AsyncStorage.getItem('userDetails');
                let parsedUserDetails = await JSON.parse(userDetails);
                var options = {
                    description: 'Select the payment method',
                    image: 'https://d26w0wnuoojc4r.cloudfront.net/zasket_logo_3x.png',
                    currency: 'INR',
                    key: config?.razorpayApiKey,
                    amount: item?.payableAmount,
                    name: 'Zasket',
                    order_id: res?.data?.paymentResponseId,//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
                    prefill: {
                        email: parsedUserDetails?.customerDetails?.userEmail,
                        contact: parsedUserDetails?.customerDetails?.userMobileNumber,
                        name: parsedUserDetails?.customerDetails?.name
                    },
                    theme: { color: Theme.Colors.primary }
                }
                // console.warn(JSON.stringify(options, null, "        "))
                RazorpayCheckout.open(options).then(async (data) => {
                    // handle success
                    // alert(`Success: ${data.razorpay_payment_id}`);
                    initialFunction()
                    AppEventsLogger.logPurchase(item?.payableAmount, "INR", { param: "value" });
                    navigation.navigate('PaymentSuccessScreenOrderDetail')
                }).catch((error) => {
                    // handle failure
                    // alert(`Error: ${error.code} | ${error.description}`);
                    Toast.show({
                        text: "Payment failed",
                        buttonText: "Okay",
                        type: "danger",
                        buttonStyle: { backgroundColor: "#a52f2b" }
                    })
                })
            } else {
                setLoading(false)
                if (res?.response?.data?.description) {
                    Toast.show({
                        text: res?.response?.data?.description,
                        type: "danger",
                        duration: 3000,
                        buttonStyle: { backgroundColor: "#a52f2b" }
                    })
                }
                // if (__DEV__) {
                //     alert(JSON.stringify(res?.response, null, "        "))
                // }
            }
        })
    }
    const onRefresh = () => {
        // setRefresh(true)
        initialFunction()
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Orders Details"} showSearch={false} />
            <ScrollView style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={true}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }>
                <View style={{ backgroundColor: 'white', padding: 10, paddingHorizontal: 16, marginTop: 10, flex: 1 }}>
                    {/* <Text>{JSON.stringify(item, null, "         ")} </Text> */}
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>Vegetables & Fruits</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#909090', fontSize: 13 }}>{moment(item?.slotStartTime).format("DD MMM")} ({moment(item?.slotStartTime).add(1, 'minutes').format("hh:mm A")} - {moment(item?.slotEndTime).add(1, 'minutes').format("hh:mm A")})</Text>
                            {/* <Text></Text> */}
                        </View>
                        <View>
                            {item?.orderState == "IN_TRANSIT" &&
                                <Text style={{ color: "#2D87C9" }}>Out for delivery</Text>
                            }
                            {item?.orderState == "DELIVERED" &&
                                <Text style={{}}><Icon name="checkcircle" type="AntDesign" style={{ fontSize: 16, color: "#49C32C" }} /> Delivered</Text>
                            }
                            {item?.orderState == "CANCELLED" &&
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="cancel" type="MaterialIcons" style={{ fontSize: 16, color: "#E1171E" }} />
                                    <Text style={{ color: "#000000" }}> Cancelled</Text>
                                </View>
                            }
                            {item?.orderState == "REFUNDED" &&
                                <Text style={{}}>Refunded</Text>
                            }
                            {item?.orderState == "IN_INVENTORY" &&
                                <Text style={{ color: "#2D87C9" }}>Order placed</Text>
                            }
                            {item?.orderState == "ASSIGNED" &&
                                <Text style={{ color: "#2D87C9" }}>Assigned</Text>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: "#EAEAEC", marginTop: 15, paddingTop: 5 }}>
                        {showCancelButton ?
                            item?.orderState == "CANCELLED" || item?.orderState == "DELIVERED" || item?.orderState == "REFUNDED" ?
                                <View style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: "#F5B0B2", fontWeight: 'bold' }}>Cancel Order </Text>
                                </View>
                                :
                                <TouchableOpacity onPress={() => { navigation.navigate('CancelOrderScreen', { item: item }) }} style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Cancel Order </Text>
                                </TouchableOpacity>
                            :
                            <View style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: "#F5B0B2", fontWeight: 'bold' }}>Cancel Order </Text>
                            </View>
                        }
                        <View style={{ width: 1, backgroundColor: '#EAEAEC', }} />
                        <TouchableOpacity onPress={() => { navigation.navigate('SupportScreen') }} style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Need help?  </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 16, marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Delivery Address</Text>
                    <View style={{ backgroundColor: 'white', flexDirection: 'row', }}>
                        <View style={{ width: 60, height: 60, borderWidth: 1, borderRadius: 5, borderColor: Theme.Colors.primary, backgroundColor: '#FDEFEF', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ width: 30, height: 30, }}
                                source={require('../../assets/png/locationIcon.png')}
                            />
                        </View>
                        <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                {item?.associatedAddress?.saveAs == "Home" &&
                                    <View style={{ backgroundColor: "#FEF8FC", borderWidth: 1, borderRadius: 4, borderColor: "#FCD8EC", paddingVertical: 3, marginRight: 5 }}>
                                        <Text style={{ color: "#F464AD", fontSize: 12, marginHorizontal: 5 }}>Home</Text>
                                    </View>
                                }
                                {item?.associatedAddress?.saveAs == "Office" &&
                                    <View style={{ backgroundColor: "#FCF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#F0D4FA", paddingVertical: 3, marginRight: 5 }}>
                                        <Text style={{ color: "#CD64F4", fontSize: 12, marginHorizontal: 5 }}>Office</Text>
                                    </View>
                                }
                                {item?.associatedAddress?.saveAs == "Others" &&
                                    <View style={{ backgroundColor: "#EDF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#BEDCFF", paddingVertical: 3, marginRight: 5 }}>
                                        <Text style={{ color: "#64A6F4", fontSize: 12, marginHorizontal: 5 }}>Others</Text>
                                    </View>
                                }
                                {/* <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: 'bold', }}>Deliver to {
                                    ((item?.associatedAddress?.recepientName)?.length > 13) ?
                                        (((item?.associatedAddress?.recepientName).substring(0, 13 - 3)) + '...') :
                                        item?.associatedAddress?.recepientName
                                }
                                </Text> */}
                            </View>
                            <Text style={{ color: '#727272' }}>{item?.associatedAddress?.recepientMobileNumber} </Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, flexDirection: "row" }}>
                        {
                            item?.associatedAddress?.houseNo ?
                                <>
                                    <Text style={{ color: "#909090", fontSize: 13, marginRight: 5 }}>{item?.associatedAddress?.houseNo}</Text>
                                </>
                                :
                                undefined
                        }

                        {
                            item?.associatedAddress?.landmark ?
                                <>
                                    <Text style={{ color: "#909090", fontSize: 13, }}>{item?.associatedAddress?.landmark}</Text>
                                </>
                                :
                                undefined
                        }
                    </View>
                    <Text style={{ color: "#909090", fontSize: 13, }}>{item?.associatedAddress?.addressLine_1} </Text>
                </View>
                <View style={{ backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 16, marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Payment Details </Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={{ color: '#909090' }}>Order ID: </Text>
                        <Text style={{}}>{item?.id} </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text style={{ color: '#909090', }}>Order Items </Text>
                        <Text style={{ color: "#000000" }}>{item?.items?.length} items </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text style={{ color: '#909090', }}>Payment method </Text>
                        <Text style={{}}>{item?.paymentMethod == "PREPAID" ? "Online Payment" : "Cash on delivery"} </Text>
                    </View>
                </View>

                <View style={{ backgroundColor: 'white', marginTop: 10, padding: 10, paddingHorizontal: 15 }}>
                    <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>Bill Details</Text> <Text style={{ color: '#727272', fontSize: 14, }}>({item?.items?.length} items)</Text></Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, }}>
                        <Text style={{ color: '#727272' }}>Item Total</Text>
                        <Text style={{}}>₹ {(item?.totalPrice)?.toFixed(2)} </Text>
                    </View>
                    <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginTop: 5, marginBottom: 10 }} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={{ color: '#727272' }}>Delivery Charges</Text>
                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Free</Text>
                    </View>
                    {item?.refundedAmount > 0 ?
                        <>
                            <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginTop: 5, marginBottom: 10 }} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ color: '#727272' }}>Return/Refund Total</Text>
                                <Text style={{}}>₹ {item?.refundedAmount}</Text>
                            </View>
                        </>
                        : undefined}
                    {(item?.totalPrice - item?.offerPrice >= 0) ?
                        <>
                            <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginTop: 5, marginBottom: 10 }} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ color: '#35B332' }}>Coupon Discount ({item?.applied_offer?.offerCode ? item?.applied_offer?.offerCode : 0})</Text>
                                {(item?.totalPrice - item?.offerPrice)?.toFixed(2) == 0 ?
                                    null
                                    :
                                    <Text style={{ color: "#35B332", }}>- ₹{(item?.totalPrice - item?.offerPrice)?.toFixed(2)} </Text>
                                }
                            </View>
                        </>
                        : undefined}
                    <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginTop: 5, marginBottom: 10 }} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={{ fontWeight: 'bold' }}>Total Amount </Text>
                        <Text style={{ fontWeight: 'bold' }}>₹ {(item?.payableAmount)} </Text>
                    </View>
                </View>


                <View style={{ marginTop: 10, paddingVertical: 5, backgroundColor: 'white' }}>
                    <Text style={{ marginLeft: 10 }}>{item?.items?.length} items</Text>
                    <FlatList
                        data={item?.items}
                        renderItem={({ item }) =>
                            <View
                                // onPress={() => { navigation.navigate("ProductDetailScreen", { item: item }) }}
                                style={styles.productCard}>
                                <View style={{
                                    backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', padding: 10, borderWidth: 0.5, borderColor: "#EFEFEF", borderRadius: 5
                                }} onPress={() => { }}>
                                    <Image
                                        style={{ width: 100, height: 80, borderRadius: 5 }}
                                        resizeMode="contain"
                                        source={item?.item?.itemImages[0]?.mediumImagePath ?
                                            { uri: item?.item?.itemImages[0]?.mediumImagePath } : require('../../assets/png/default.png')}
                                    />
                                </View>
                                <View style={[{ padding: 10, flex: 1 }]}>
                                    <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.item?.itemName} </Text>
                                    <Text style={{ fontSize: 12, color: '#909090', marginVertical: 5 }}>{item?.item?.itemSubName} </Text>
                                    {item?.state == "RETURNED" ?
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                                            <View style={{ backgroundColor: '#F4F4F4', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 2 }}>
                                                <Text style={{ fontSize: 12, color: '#E1171E' }}>Returned</Text>
                                            </View>
                                        </View>
                                        : item?.state == "PARTIALLY_RETURNED" ?
                                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                                                <View style={{ backgroundColor: '#F4F4F4', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 2 }}>
                                                    <Text style={{ fontSize: 12, color: '#E1171E' }}>Partially Returned</Text>
                                                </View>
                                            </View>
                                            :
                                            null
                                    }
                                    <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'row', }}>
                                        <Text style={{ fontSize: 14, color: '#909090', }}>Quantity: {item?.quantity} </Text>
                                        <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹{item?.totalPrice} </Text>
                                    </View>
                                </View>
                            </View>
                        }
                        ItemSeparatorComponent={() => (
                            <View
                                style={{ height: 0.7, width: "90%", alignSelf: 'center', backgroundColor: '#EAEAEC', }}
                            />
                        )}
                        keyExtractor={item => item?.id.toString()}
                    />
                </View>
                {/* <Text Text style={{ marginBottom: 16 }}> {JSON.stringify(item, null, "       ")} </Text> */}
            </ScrollView >
            {item?.paymentMethod == "COD" ?
                item?.orderState == "DELIVERED" || item?.orderState == "CANCELLED" || item?.orderState == "RETURNED" || item?.paymentState == "PAID" || item?.paymentState == "REFUNDED" ? null :
                    <View View style={{ height: 55, width: "100%", backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {item?.payableAmount} </Text>
                            <View style={{}}>
                                <Text style={{ color: "#2D87C9" }}>Total Amount </Text>
                            </View>
                        </View>
                        <View style={{ height: 55, width: 150, backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => { onPressPayNow() }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                                <Text style={{ color: 'white', fontSize: 17 }}>Pay Now <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                : null
            }
            {
                loading ?
                    <Loader />
                    : undefined
            }
        </View >
    );
}


const mapStateToProps = (state) => ({
    config: state.config.config,
})


export default connect(mapStateToProps, { getOrderDetails, payOrder })(MyOrdersDetailScreen)

const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 5,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        flex: 1,
        padding: 0,
        overflow: "hidden",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    addButton: {
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: 'white',
        flexDirection: 'row',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        // position: 'absolute',
        // zIndex: 1,
        // right: 10,
        // bottom: 12,
    }
});
