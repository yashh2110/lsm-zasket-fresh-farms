import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, FlatList } from 'react-native';
import Theme from '../../styles/Theme';
import { updateCartItemsApi } from '../../actions/cart'
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import { Icon } from 'native-base';

const CardProductListScreen = ({ item, navigation, cartItems, updateCartItemsApi, isAuthenticated }) => {
    const [addButton, setAddButton] = useState(true)
    const [count, setCount] = useState(0)
    const [loadingCount, setLoadingCount] = useState(false)

    useEffect(() => {
        let filteredItems = cartItems.filter(element => element?.id == item?.id);
        if (filteredItems.length == 1) {
            setAddButton(false)
            setCount(filteredItems[0].count)
            setLoadingCount(false)
        } else {
            setAddButton(true)
            setCount(0)
            setLoadingCount(false)
        }

    }, [cartItems])

    const onAddToCart = async () => {
        if (isAuthenticated) {
            setLoadingCount(true)
            updateCartItemsApi(item?.id, 1, (res, status) => {
                setAddButton(!addButton)
                setCount(1)
            })
        } else {
            navigation.navigate("AuthRoute", { screen: 'Login' })
        }
    }

    const onCartUpdate = async (option) => {
        if (option == "DECREASE") {
            if (count >= 0) {
                onUpdateCartItemApi(count - 1)
                // setCount(count - 1)
            }
            // setCount(count - 1)
        }
        if (option == "INCREASE") {
            if (count < item?.maxAllowedQuantity) {
                onUpdateCartItemApi(count + 1)
                // setCount(count + 1)
            }
        }
    }

    const onUpdateCartItemApi = (quantity) => {
        setLoadingCount(true)
        updateCartItemsApi(item?.id, quantity, (res, status) => {
            // alert(JSON.stringify(res, null, "     "))
        })
    }

    return (
        <View style={{ flex: 1, width: "90%", marginBottom: 5, alignSelf: 'center' }}>
            <View
                // onPress={() => { navigation.navigate("ProductDetailScreen", { item: item }) }}
                style={styles.productCard}>
                <View style={{
                    backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: "#EFEFEF", borderRadius: 5
                }} onPress={() => { }}>
                    {/* <Text>{JSON.stringify(item?.itemImages[0]?.mediumImagePath, null, "         ")} </Text> */}
                    <Image
                        resizeMode="contain"
                        style={{ height: 130, width: 120, borderRadius: 5, }}
                        source={item?.itemImages[0]?.mediumImagePath ?
                            { uri: item?.itemImages[0]?.mediumImagePath } : require('../../assets/png/default.png')}
                    // style={{ height: 130, borderRadius: 5, width: 100 }}
                    // source={require('../../assets/png/verticalImage.jpg')}
                    />
                    {item?.discountedPrice == 1 &&
                        <View style={[styles.offerButton, {}]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                                <Icon name="brightness-percent" type="MaterialCommunityIcons" style={{ fontSize: 12, color: '#ffffff' }} />
                                <Text style={{ color: "#ffffff", fontWeight: 'bold', fontSize: 11 }}>  OFFER </Text>
                            </View>
                        </View>
                    }
                </View>
                <View style={[{ padding: 10, flex: 1 }]}>
                    <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.itemName} </Text>
                    <Text style={{ fontSize: 12, color: '#909090', marginVertical: 5 }}>{item?.itemSubName} </Text>
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹{item?.discountedPrice} </Text>
                        {item?.discountedPrice == item?.actualPrice ?
                            undefined :
                            <Text style={{ fontSize: 14, color: '#909090', textDecorationLine: 'line-through', marginLeft: 10 }}>₹{item?.actualPrice} </Text>
                        }
                        {(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0) == 0 ?
                            undefined :
                            <Text style={{ fontSize: 15, color: "green", marginLeft: 10 }}>{(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0)}% off</Text>
                        }
                    </View>
                    {item?.onDemand == false && (item?.availableQuantity < 1) &&
                        <View style={[styles.outOfStockButton, {}]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={{ color: "#909090", fontWeight: 'bold' }}>Out of stock </Text>
                            </View>
                        </View>
                    }
                    {item?.onDemand == false && (item?.availableQuantity < 1) ?
                        null
                        : !loadingCount ?
                            addButton ?
                                <TouchableOpacity
                                    onPress={() => onAddToCart()}
                                    style={[styles.addButton, {}]}
                                >
                                    <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold', padding: 5, }}>+ Add </Text>
                                </TouchableOpacity>
                                :
                                <View style={[styles.addButton, {}]}>
                                    <TouchableOpacity onPress={() => onCartUpdate('DECREASE')} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5, }}>
                                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>-</Text>
                                    </TouchableOpacity>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>{count} </Text>
                                    </View>

                                    {count < item?.maxAllowedQuantity ?
                                        <TouchableOpacity onPress={() => onCartUpdate('INCREASE')} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5, }}>
                                            <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold', }}>+</Text>
                                        </TouchableOpacity>
                                        : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
                                            <Text style={{ color: "#E1E1E1", fontWeight: 'bold' }}>+</Text>
                                        </View>
                                    }
                                </View>
                            :
                            <View style={[styles.addButton, {}]}>
                                <LottieView
                                    style={{ height: 50, }}
                                    source={require("../../assets/json/countLoading.json")}
                                    autoPlay
                                />
                            </View>
                    }
                </View>
            </View>

        </View>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { updateCartItemsApi })(CardProductListScreen)
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
    },
    addButton: {
        // padding: 5,
        height: 28,
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
        zIndex: 1,
        // position: 'absolute',
        // right: 7,
        // bottom: 7,
    },
    outOfStockButton: {
        height: 28,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: '#FBFBFB',
        flexDirection: 'row',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        zIndex: 1,
        // position: 'absolute',
    },
    offerButton: {
        height: 19,
        width: 68,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: '#E1171E',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        zIndex: 1,
        position: 'absolute',
        top: 5,
        right: 5
    }
});
