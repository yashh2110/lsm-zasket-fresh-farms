import React, { useEffect, useContext, useState } from 'react';
import { RefreshControl, ScrollView, Text, View, SafeAreaView, Image, Share, StyleSheet } from 'react-native';
import CustomHeader from '../common/CustomHeader';
import BannerImages from './BannerImages';
import { getItem } from '../../actions/home'
import { connect } from 'react-redux';
import Loader from '../common/Loader';
import Theme from '../../styles/Theme';
import { TouchableOpacity } from 'react-native';
import { updateCartItemsApi } from '../../actions/cart'
import CartFloatingCard from '../cartStack/CartFloatingCard';
import { ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Sharee from 'react-native-share';
import firebase from '@react-native-firebase/app'
import appsFlyer from 'react-native-appsflyer';


const ProductDetailScreen = ({ navigation, route, getItem, cartItems, updateCartItemsApi, isAuthenticated }) => {
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [item, setItem] = useState({})
    const [isVisible, setIsVisible] = useState(true)
    const [dynamicLink, setDynamicLink] = useState("")
    const [animationType, setAnimationType] = useState("fadeIn")

    // const { item } = route?.params;
    const [loadingCount, setLoadingCount] = useState(false)

    useEffect(() => {
        // alert(JSON.stringify(paramsItem, null, "      "))
        initialFunction()
    }, [])

    const initialFunction = () => {
        getItem(route?.params?.item, async (res, status) => {
            if (status) {
                setItem(res?.data)
                // alert(JSON.stringify(res?.data, null, "      "))
                let response = res?.data
                const eventName = 'af_content_view';
                const eventValues = {
                    af_price: response?.actualPrice,
                    af_content: response?.itemName,
                    af_content_id: response?.id,
                    af_content_type: response?.categoryName,
                    af_currency: 'INR',
                };
                appsFlyer.logEvent(
                    eventName,
                    eventValues,
                    (res) => {
                    },
                    (err) => {
                        console.error(err);
                    }
                );
                setLoading(false)
                setRefresh(false)
            } else {
                setLoading(false)
                setRefresh(false)
            }
        })
    }
    const onRefresh = () => {
        setRefresh(true)
        initialFunction()
    }



    //CART FUNCTIONALITY
    const [addButton, setAddButton] = useState(true)
    const [count, setCount] = useState(0)

    useEffect(() => {
        let filteredItems = cartItems.filter(element => element?.id == route?.params?.item);
        if (filteredItems.length == 1) {
            setAddButton(false)
            setLoadingCount(false)
            setCount(filteredItems[0].count)
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

    const whatsAppShare = async (imageiD, image, message) => {
        // alert(JSON.stringify(imageiD, null, "   "))
        // return
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
                    const shareOptions = {
                        title: 'Zasket',
                        message: `${message}: ${link}`,
                        url: `data:image/png;base64,${split[1]}`,
                        failOnCancel: false,
                    };
                    try {
                        // alert("passs")
                        Share.open(shareOptions);
                    } catch (err) {
                        // alert("faill")
                        moreShare(imageiD, image, message)
                        // alert("notwhats app")
                        // do something
                    }
                })
        } catch (error) {
            // alert(error)
        }

    }
    const onGoBack = () => {
        setAnimationType("fadeOut")
        setIsVisible(false)
        navigation.goBack()
    }
    return (
        <TouchableOpacity
            style={{ flex: 1, }}
            onPress={() => { navigation.goBack() }}>
            {/* <CustomHeader navigation={navigation} title={"Back"} /> */}
            {/* <ScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }>
                <View style={[{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }]}>
                    <Text style={{ fontSize: 18, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.itemName} </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹{item?.discountedPrice} </Text>
                        {item?.discountedPrice == item?.actualPrice ?
                            undefined :
                            <Text style={{ fontSize: 14, color: '#909090', textDecorationLine: 'line-through', marginLeft: 10 }}>₹{item?.actualPrice} </Text>
                        }
                        {(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0) == 0 ?
                            undefined :
                            <Text style={{ fontSize: 14, color: "#49c32c", marginLeft: 10, fontWeight: "bold" }}>{(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0)}% off</Text>
                        }
                    </View>
                    <Text style={{ color: '#909090', }}>{item?.itemSubName} </Text>
                    <Text style={{ marginTop: 5, color: '#727272', }}>{item?.itemDescription} </Text>
                </View>
            </ScrollView> */}
            <Modal
                // backdropTransitionOutTiming={6}
                animationInTiming={500}
                backdropTransitionOutTiming={0}
                animationIn={animationType}
                // animationOut="fadeOut"
                isVisible={isVisible}
                hideModalContentWhileAnimating={true}
                onSwipeComplete={() => setIsVisible(false)}
                // swipeDirection="down"
                style={{ margin: 0, justifyContent: 'flex-end' }}
                onBackButtonPress={() => onGoBack()}
                onBackdropPress={() => onGoBack()}>
                <SafeAreaView style={{ backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                    <View style={{ height: 300 }}>
                        <BannerImages navigation={navigation} item={item} />
                    </View>
                    <View style={{}}>
                        <View style={[{ paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 10 }]}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                                <Text style={{ fontSize: 18, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize', width: "75%" }}>{item?.itemName} </Text>
                                <TouchableOpacity onPress={() => { moreShare(item?.id, item?.itemImages?.[0]?.largeImagePath, item?.shareInfo?.message) }} style={{ position: "absolute", right: 0 }}>
                                    <Image
                                        source={require('../../assets/png/shareicons.png')}
                                        style={{ height: 45, width: 100, }} resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹{item?.discountedPrice} </Text>
                                {item?.discountedPrice == item?.actualPrice ?
                                    undefined :
                                    <Text style={{ fontSize: 14, color: '#909090', textDecorationLine: 'line-through', marginLeft: 10 }}>₹{item?.actualPrice} </Text>
                                }
                                {(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0) == 0 ?
                                    undefined :
                                    <Text style={{ fontSize: 14, color: "#49c32c", marginLeft: 10, fontWeight: "bold" }}>{(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0)}% off</Text>
                                }
                            </View>
                            <Text style={{ color: '#909090', }}>{item?.itemSubName} </Text>
                            <Text style={{ marginTop: 5, color: '#727272', }}>{item?.itemDescription} </Text>
                        </View>
                    </View>
                    {item?.onDemand == false && (item?.availableQuantity < 1) &&
                        <View style={[styles.outOfStockButton, {}]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
                                <Text style={{ color: "#909090", fontWeight: 'bold', fontSize: 18, textAlign: "center" }}>Out of stock </Text>
                            </View>
                        </View>
                    }
                    {
                        item?.onDemand == false && (item?.availableQuantity < 1) ?
                            null :
                            addButton ?
                                <TouchableOpacity onPress={() => onAddToCart()} style={{ backgroundColor: Theme.Colors.primary, height: 45, justifyContent: "center", marginHorizontal: 20, marginBottom: 15, borderRadius: 30 }}>
                                    <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 16 }}>+  Add </Text>
                                </TouchableOpacity>
                                :
                                <View style={{ backgroundColor: Theme.Colors.primary, height: 45, flexDirection: 'row', justifyContent: 'space-evenly', marginHorizontal: 20, marginBottom: 15, borderRadius: 30 }}>
                                    <TouchableOpacity onPress={() => onCartUpdate('DECREASE')} style={{ width: 35, height: 35, backgroundColor: "#B90E14", borderRadius: 4, justifyContent: 'center', alignSelf: 'center' }}>
                                        <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20 }}>-</Text>
                                    </TouchableOpacity>
                                    {loadingCount ?
                                        <ActivityIndicator color="white" /> :
                                        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 18 }}>{count} </Text>
                                    }
                                    {count < item?.maxAllowedQuantity ?
                                        <TouchableOpacity onPress={() => onCartUpdate('INCREASE')} style={{ width: 35, height: 35, backgroundColor: "#B90E14", borderRadius: 4, justifyContent: 'center', alignSelf: 'center' }}>
                                            <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20 }}>+</Text>
                                        </TouchableOpacity>
                                        :
                                        <View style={{ width: 35, height: 35, backgroundColor: "#B90E14", borderRadius: 4, justifyContent: 'center', alignSelf: 'center' }}>
                                            <Text style={{ alignSelf: 'center', color: '#979197', fontWeight: 'bold', fontSize: 20 }}>+</Text>
                                        </View>
                                    }
                                </View>
                    }


                </SafeAreaView>
            </Modal>


            {loading ?
                <Loader />
                : undefined}
        </TouchableOpacity>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { getItem, updateCartItemsApi })(ProductDetailScreen)

const styles = StyleSheet.create({
    outOfStockButton: {
        // height: 28,
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
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        zIndex: 1,
        alignSelf: "center",
        borderRadius: 10,
        height: 40,
        marginBottom: 20
        // position: 'absolute',
    },
});

{/* {cartItems?.length > 0 ?
                <View style={{ position: 'absolute', bottom: 50, width: "100%", alignSelf: 'center' }}>
                    <CartFloatingCard navigation={navigation} />
                </View>
                : undefined
            } */}