import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Theme from '../../styles/Theme';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import Modal from 'react-native-modal';
import moment from 'moment'
import Icons from 'react-native-vector-icons/FontAwesome';

const CardMyOrders = ({ item, navigation, cartItems, }) => {
    const [addButton, setAddButton] = useState(true)
    const [isUpdate, setIsUpdate] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [productItem, setProductItem] = useState([])

    useEffect(() => {
        setProductItem(item?.items)
    }, [item])

    return (
        <TouchableOpacity onPress={() => navigation.navigate('MyOrdersDetailScreen', { order_id: item?.id })} style={{ backgroundColor: 'white', padding: 10, paddingHorizontal: 16, marginTop: 10, flex: 1 }}>
            {/* <Text>{JSON.stringify(item, null, "         ")} </Text> */}
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>Vegetables & Fruits  <Icon name="right" type="AntDesign" style={{ fontSize: 12, }} /></Text>
                </View>
                <View>
                    <Text>₹ {item?.offerPrice ? item?.offerPrice : item?.totalPrice} </Text>
                </View>
            </View>
            <View
                //  onPress={() => setIsVisible(true)} 
                style={{ marginTop: 10, width: 100 }}>
                <Text style={{ color: '#000000' }}>{productItem?.length} items <Icon name="right" type="AntDesign" style={{ fontSize: 12, color: "#000000" }} /></Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#909090', fontSize: 13 }}>{moment(item?.slotStartTime).format("DD MMM")} ({item?.deliverySlot?.description})</Text>
                </View>
                <View>
                    {item?.orderState == "IN_TRANSIT" &&
                        <Text style={{ color: "#2D87C9" }}>In transit</Text>
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
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EAEAEC', marginTop: 10 }}>
                {item?.orderState == "DELIVERED" ?
                    <>
                        {item?.rateOrder?.rated ?
                            <View style={{ backgroundColor: 'white', flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: "#909090" }}>You have Rated <Text style={{ color: "#000000", fontWeight: 'bold' }}><Icon name="star" type="AntDesign" style={{ fontSize: 12, color: '#E1A318', }} /> {item?.rateOrder?.rated}</Text></Text>
                            </View>
                            :
                            <TouchableOpacity onPress={() => navigation.navigate('RateOrdersScreen', { item: item })} style={{ backgroundColor: 'white', flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Rate your order</Text>
                            </TouchableOpacity>
                        }
                        <View style={{ backgroundColor: "#EAEAEC", height: 40, width: 1, marginTop: 5 }} />
                    </>
                    :
                    null
                }
                <TouchableOpacity onPress={() => navigation.navigate('MyOrdersDetailScreen', { order_id: item?.id })} style={{ backgroundColor: 'white', flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Order Details</Text>
                </TouchableOpacity>
            </TouchableOpacity>

            <Modal
                isVisible={isVisible}
                onSwipeComplete={() => setIsVisible(false)}
                swipeDirection="down"
                style={{ margin: 0, justifyContent: 'flex-end' }}
                onBackButtonPress={() => setIsVisible(false)}
                onBackdropPress={() => setIsVisible(false)}
            >
                <SafeAreaView style={{ height: "80%", backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                    <View style={{ alignSelf: 'center', height: 5, width: 50, backgroundColor: '#E2E2E2', borderRadius: 50, marginVertical: 15 }} />
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, margin: 4, width: "90%", marginBottom: 10, alignSelf: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>{productItem?.length} items</Text>
                            <FlatList
                                data={productItem}
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        // onPress={() => { navigation.navigate("ProductDetailScreen", { item: item }) }}
                                        style={styles.productCard}>
                                        <View style={{
                                            backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', padding: 10, borderWidth: 0.5, borderColor: "#EFEFEF", borderRadius: 5
                                        }} onPress={() => { }}>
                                            {/* <Text>{JSON.stringify(item, null, "         ")} </Text> */}
                                            <Image
                                                style={{ width: 100, height: 80, borderRadius: 5 }}
                                                resizeMode="contain"
                                                source={item?.item?.itemImages[0]?.mediumImagePath ?
                                                    { uri: item?.item?.itemImages[0]?.mediumImagePath } : require('../../assets/png/default.png')}
                                            // source={{ uri: "https://i.picsum.photos/id/390/500/300.jpg?hmac=MTvu05oUf6PaVif2NTqWv7mLAYEYslPgtVOyjSZe-pk" }}
                                            />
                                        </View>
                                        <View style={[{ padding: 10, flex: 1 }]}>
                                            <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.item?.itemName} </Text>
                                            <Text style={{ fontSize: 12, color: '#909090', marginVertical: 5 }}>{item?.item?.itemSubName} </Text>
                                            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'row', }}>
                                                <Text style={{ fontSize: 14, color: '#909090', }}>Quantity: {item?.quantity} </Text>
                                                <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹{item?.totalPrice} </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={item => item?.id.toString()}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </TouchableOpacity>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
})


export default connect(mapStateToProps, {})(CardMyOrders)
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
        margin: 2,
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
        marginVertical: 5
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
