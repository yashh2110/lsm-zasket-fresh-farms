import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, FlatList, Share } from 'react-native';
import Theme from '../../styles/Theme';
import { updateCartItemsApi } from '../../actions/cart'
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import { Icon } from 'native-base';
import firebase from '@react-native-firebase/app'
import Sharee from 'react-native-share';

const CardProductListScreen = ({ item, navigation, cartItems, updateCartItemsApi, isAuthenticated }) => {
    const [addButton, setAddButton] = useState(true)
    const [count, setCount] = useState(0)
    const [loadingCount, setLoadingCount] = useState(false)
    const [dynamicLink, setDynamicLink] = useState("")
    useEffect(() => {
        // alert(JSON.stringify(item, null, "    "))
        // generateLink()

    }, [])
    const generateLink = async (id) => {
        // alert(id)

    }

    const moreShare = async (imageiD, image, message) => {
        try {
            const link = await firebase.dynamicLinks().buildShortLink({
                link: `https://zasket.page.link?productDetails=${imageiD}`,
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
            const toDataURL = (url) => fetch(url)
                .then(response => response.blob())
                .then(blob => new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(blob)
                }))
            toDataURL(image)
                .then(dataUrl => {
                    let split = dataUrl.split("base64,")
                    let shareImage = {
                        title: "Zasket",//string
                        message: `${message}: ${link}`,
                        url: `data:image/png;base64,${split[1]}`,
                    }
                    Sharee.open(shareImage).catch(err => console.log(err));
                })
        } catch (error) {
            // alert(error)
        }
    }


    useEffect(() => {
        // alert(JSON.stringify(cartItems, null, "      "))
        let filteredItems = cartItems.filter(element => element?.id == item?.id);
        if (filteredItems.length == 1) {
            // alert(filteredItems[0].count)
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
            <TouchableOpacity
                onPress={() => { navigation.navigate("ProductDetailScreen", { item: item?.id }) }}
                style={styles.productCard}>
                <View style={{
                    backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: "#EFEFEF", borderRadius: 5
                }} onPress={() => { }}>
                    {item?.discountedPrice == 1 ?
                        <View style={[styles.offerButton, {}]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                                <Icon name="brightness-percent" type="MaterialCommunityIcons" style={{ fontSize: 12, color: '#ffffff' }} />
                                <Text style={{ color: "#ffffff", fontWeight: 'bold', fontSize: 11 }}>  OFFER </Text>
                            </View>
                        </View>
                        :
                        // (((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100) == 5 ?
                        (((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0) == 0 ?
                            <View style={{
                                height: 18, width: ("58%"),
                            }}>
                            </View>
                            :
                            <>
                                <View style={{
                                    height: 18, width: ("58%"), backgroundColor: "#7eb517", borderTopLeftRadius: 6, borderBottomRightRadius: 6, alignSelf: "flex-start",
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.18,
                                    shadowRadius: 1.00,
                                    elevation: 0.8,
                                    marginRight: -1,
                                    marginTop: -1,
                                    justifyContent: "center"
                                }}>
                                    <Text style={{ fontSize: 9, textAlign: "center", color: "#f7f7f7", fontWeight: 'bold' }}>{(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0)}% off</Text>

                                </View>
                            </>
                        // undefined


                    }
                    {/* <Text>{JSON.stringify(item?.itemImages[0]?.mediumImagePath, null, "         ")} </Text> */}
                    <Image
                        resizeMode="contain"
                        style={{ height: 110, width: 120, borderRadius: 5, }}
                        source={item?.itemImages[0]?.mediumImagePath ?
                            { uri: item?.itemImages[0]?.mediumImagePath } : require('../../assets/png/default.png')}
                    />
                </View>
                <View style={[{ padding: 10, flex: 1 }]}>
                    <View style={{}}>
                        <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.itemName} </Text>

                    </View>
                    <Text style={{ fontSize: 12, color: '#909090', marginVertical: 5 }}>{item?.itemSubName} </Text>
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹{item?.discountedPrice} </Text>
                        {item?.discountedPrice == item?.actualPrice ?
                            undefined :
                            <Text style={{ fontSize: 14, color: '#909090', textDecorationLine: 'line-through', marginLeft: 10 }}>₹{item?.actualPrice} </Text>
                        }
                        {(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0) == 0 ?
                            undefined :
                            <Text style={{ fontSize: 14, color: "#49c32c", marginLeft: 10, fontWeight: "bold" }}>You Save ₹{(((item?.actualPrice - item?.discountedPrice))).toFixed(0)} </Text>
                        }
                    </View>
                    {item?.onDemand == false && (item?.availableQuantity < 1) &&
                        <View style={[styles.outOfStockButton, {}]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={{ color: "#909090", fontWeight: 'bold' }}>Out of stock </Text>
                            </View>
                        </View>
                    }

                    <View style={{ flexDirection: "row", }}>
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
                        {item?.onDemand == false && (item?.availableQuantity < 1)
                            ?
                            null :
                            <TouchableOpacity onPress={() => { moreShare(item?.id, item?.itemImages[0]?.mediumImagePath, item?.shareInfo?.message) }} style={{ alignSelf: "flex-start", height: 40, marginLeft: 4 }}>
                                <Image
                                    source={require('../../assets/png/shareicons.png')}
                                    style={{ height: 30, width: 92, alignSelf: "flex-start" }} resizeMode="cover"
                                />
                            </TouchableOpacity>
                        }
                    </View>



                </View>
            </TouchableOpacity>

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
        width: 80,
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
