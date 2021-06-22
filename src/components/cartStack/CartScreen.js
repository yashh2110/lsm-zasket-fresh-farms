import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList, ScrollView, Image, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { clearCart, getAllOffers, applyOffer } from '../../actions/cart'
import Theme from '../../styles/Theme';
import CustomHeader from '../common/CustomHeader';
import CardCartScreen from './CardCartScreen';
import { Icon, Toast } from 'native-base'
import { getCartItemsApi } from '../../actions/cart'
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment'
import { getV2Config } from '../../actions/home';
import AddressModal from '../common/AddressModal';
import { getAllUserAddress } from '../../actions/map'
import FeatherIcons from "react-native-vector-icons/Feather"

const CartScreen = ({ navigation, cartItems, clearCart, userLocation, config, allUserAddress, getAllUserAddress, applyOffer, getCartItemsApi, getV2Config }) => {
    const scrollViewRef = useRef();
    const [totalCartValue, setTotalCartValue] = useState(0)
    const [savedValue, setSavedValue] = useState(0)
    const [coupon, setCoupon] = useState("")
    const [couponLoading, setCouponLoading] = useState(false)
    const [offersList, setOffersList] = useState([])
    const [offerPrice, setOfferPrice] = useState(0)
    const [selectedOffer, setSelectedOffer] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [addressModalVisible, setAddressModalVisible] = useState(false)
    const [isCartIssue, setIsCartIssue] = useState(false)
    useEffect(() => {
        if (cartItems.length > 0) {
            let total = cartItems.reduce(function (sum, item) {
                return sum + (item.discountedPrice * item.count);
            }, 0);
            setTotalCartValue(total)

            let saved = cartItems.reduce(function (sum, item) {
                return sum + ((item.actualPrice - item.discountedPrice) * item.count);
            }, 0);
            setSavedValue(saved)


            for (var i = 0; i < cartItems.length; i++) {
                if (cartItems[i]?.count > cartItems[i]?.maxAllowedQuantity) {
                    setIsCartIssue(true)
                    break;
                } else if (cartItems[i]?.isActive == false) {
                    setIsCartIssue(true)
                    break;
                } else if (cartItems[i]?.onDemand == false && cartItems[i]?.availableQuantity < 1) {
                    setIsCartIssue(true)
                    break;
                } else if (cartItems[i]?.onDemand == false) {
                    if (cartItems[i]?.availableQuantity < cartItems[i]?.count) {
                        setIsCartIssue(true)
                        break;
                    } else {
                        setIsCartIssue(false)
                    }
                }
                else {
                    setIsCartIssue(false)
                }
            }

        } else {
            setTotalCartValue(0)
            setSavedValue(0)
            setIsCartIssue(false)
        }

    }, [cartItems])

    const initialFunction = () => {
        getCartItemsApi((res, status) => {
            if (status) {
                setRefresh(false)
            } else {
                setRefresh(false)
            }
        })
        getV2Config((res, status) => { })
        getAllUserAddress(async (response, status) => { })
    }

    useEffect(() => {
        initialFunction()
        // getAllOffers((res, status) => {
        //     if (status) {
        //         // alert(JSON.stringify(res.data, null, "     "))
        //         setOffersList(res?.data)
        //     } else {

        //     }
        // })
    }, [])

    const onClearCart = async () => {
        clearCart()
    }

    useEffect(() => {
        if (totalCartValue > config?.freeDeliveryMinOrder) {
            // if (offerPrice > 0) {
            //     onPressApplyCoupon()
            // } else {
            //     removeOffer()
            // }
            removeOffer()
        } else {
            removeOffer()
        }
    }, [totalCartValue])

    const onPressApplyCoupon = async () => {
        setCouponLoading(true)
        // console.warn(coupon + "         " + totalCartValue)
        applyOffer(coupon, totalCartValue, (res, status) => {
            if (status) {
                setCouponLoading(false)
                // alert(JSON.stringify(res?.data?.isEligible, null, "     "))
                if (res?.data?.isEligible) {
                    setOfferPrice(res?.data?.offerPrice)
                    setSelectedOffer(res?.data)
                    Toast.show({
                        text: res?.data?.comments,
                        buttonText: "Okay",
                        type: "success",
                        duration: 3000
                    })
                    setCouponLoading(false)
                } else {
                    Toast.show({
                        text: res?.data?.comments,
                        buttonText: "Okay",
                        type: "danger",
                        duration: 3000,
                        buttonStyle: { backgroundColor: "#a52f2b" }
                    })
                }
            } else {
                if (__DEV__) {
                    alert(JSON.stringify(res.response, null, "     "))
                }
                setCouponLoading(false)
                removeOffer()
                // Toast.show({
                //     text: res?.response?.comments,
                //     buttonText: "Okay",
                //     type: "danger"
                // })
            }
        })
    }

    const removeOffer = () => {
        setOfferPrice(0)
        setCoupon("")
        setSelectedOffer([])
    }
    const onRefresh = () => {
        setRefresh(true)
        initialFunction()
    }

    const onPressSelectAddress = () => {
        let newArray = []
        allUserAddress?.forEach((el, index) => {
            if (el?.isActive) newArray.push(el)
        })
        if (newArray?.length > 0) {
            setAddressModalVisible(true)
        } else {
            navigation.navigate('AutoCompleteLocationScreen', { navigateTo: "MapScreen", fromScreen: "AddNew_SCREEN", backToCardScreen: "CartScreen", })
        }
    }
    // const cartIssue = (option) => {
    //     setIsCartIssue(option)
    // }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Cart"} showSearch={false} />
            <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }>
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>{JSON.stringify(location, null, "       ")} </Text> */}
                {cartItems.length > 0 ?
                    <>
                        {userLocation?.lat ?
                            <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 16, marginTop: 10 }}>
                                <View style={{ width: 60, height: 60, borderWidth: 1, borderRadius: 5, borderColor: Theme.Colors.primary, backgroundColor: '#FDEFEF', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        style={{ width: 30, height: 30, }}
                                        source={require('../../assets/png/locationIcon.png')}
                                    />
                                </View>
                                <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                                            {userLocation?.saveAs == "Home" &&
                                                <View style={{ backgroundColor: "#FEF8FC", borderWidth: 1, borderRadius: 4, borderColor: "#FCD8EC", paddingVertical: 3, marginRight: 5 }}>
                                                    <Text style={{ color: "#F464AD", fontSize: 12, marginHorizontal: 5 }}>Home</Text>
                                                </View>
                                            }
                                            {userLocation?.saveAs == "Office" &&
                                                <View style={{ backgroundColor: "#FCF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#F0D4FA", paddingVertical: 3, marginRight: 5 }}>
                                                    <Text style={{ color: "#CD64F4", fontSize: 12, marginHorizontal: 5 }}>Office</Text>
                                                </View>
                                            }
                                            {userLocation?.saveAs == "Others" &&
                                                <View style={{ backgroundColor: "#EDF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#BEDCFF", paddingVertical: 3, marginRight: 5 }}>
                                                    <Text style={{ color: "#64A6F4", fontSize: 12, marginHorizontal: 5 }}>Others</Text>
                                                </View>
                                            }
                                            {/* <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: 'bold', }}>Deliver to {
                                                ((userLocation?.recepientName).length > 13) ?
                                                    (((userLocation?.recepientName).substring(0, 13 - 3)) + '...') :
                                                    userLocation?.recepientName
                                            }
                                            </Text> */}
                                        </View>
                                        <TouchableOpacity onPress={() => { onPressSelectAddress() }} style={{}}>
                                            <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Change</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text numberOfLines={2} style={{ color: "#909090", fontSize: 13, marginTop: 5 }}>{userLocation?.addressLine_1} </Text>
                                </View>
                            </View>
                            : undefined
                        }
                        {/* {totalCartValue >= config?.freeDeliveryMinOrder ?
                            selectedOffer?.offer?.displayName ?
                                <View style={{ backgroundColor: 'white', marginTop: 10, paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'center' }}>
                                    <View style={{ flex: 1, flexDirection: 'row', }}>
                                        <View style={{ backgroundColor: '#FDEFEF', borderWidth: 1, borderColor: "#F5C4C6", borderTopLeftRadius: 4, borderBottomLeftRadius: 4, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                                            <Image
                                                style={{ height: 16, width: 50, }}
                                                resizeMode={"contain"}
                                                source={require('../../assets/png/couponImage.png')}
                                            />
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', borderStyle: 'dashed', borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: "#FAFAFA", alignItems: "center", borderWidth: 1.5, borderColor: '#E3E3E3', zIndex: 0, marginLeft: -1 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 14, color: "#E1171E", marginLeft: 10, fontWeight: 'bold' }}>{selectedOffer?.offer?.displayName} </Text>
                                                <Text style={{ fontSize: 12, color: '#727272', marginLeft: 10 }}>Coupon applied on the bill</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => { removeOffer() }} style={{ justifyContent: 'center', alignItems: 'center', height: 50, width: 50 }}>
                                                <Icon name="closecircle" type="AntDesign" style={{ fontSize: 18, color: '#c9c9c9' }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={{
                                    backgroundColor: 'white', marginTop: 10, paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'center',
                                    // borderTopWidth: 1, borderBottomWidth: 1, borderColor: Theme.Colors.primary,
                                }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View style={{ backgroundColor: '#FDEFEF', borderWidth: 1, borderColor: "#F5C4C6", borderTopLeftRadius: 4, borderBottomLeftRadius: 4, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                                            <Image
                                                style={{ height: 16, width: 50, }}
                                                resizeMode={"contain"}
                                                source={require('../../assets/png/couponImage.png')}
                                            />
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', borderStyle: 'dashed', borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: "#FAFAFA", alignItems: "center", borderWidth: 1.5, borderColor: '#E3E3E3', zIndex: 0, marginLeft: -1 }}>
                                            <TextInput
                                                style={{ height: 40, flex: 1, marginLeft: 8, }}
                                                onChangeText={text => setCoupon(text)}
                                                placeholder="Enter Coupon Code"
                                                value={coupon}
                                                placeholderTextColor="black"
                                                autoCapitalize="characters"
                                            />
                                            {couponLoading ?
                                                <ActivityIndicator color={Theme.Colors.primary} size="small" style={{ marginRight: 10 }} />
                                                :
                                                coupon ?
                                                    <TouchableOpacity onPress={() => onPressApplyCoupon()} style={{ justifyContent: 'center', alignItems: 'center', height: 40 }}>
                                                        <Text style={{ marginHorizontal: 5, color: Theme.Colors.primary, fontWeight: 'bold' }}>Apply</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 40 }}>
                                                        <Text style={{ marginHorizontal: 5, color: "#F5B0B2", fontWeight: 'bold' }}>Apply</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                </View>
                            : undefined} */}
                        <View style={{ flex: 1, backgroundColor: 'white', marginTop: 10, paddingVertical: 5 }}>
                            <FlatList
                                data={cartItems}
                                renderItem={({ item }) => (
                                    <CardCartScreen item={item} navigation={navigation} />
                                )}
                                keyExtractor={item => item?.id?.toString()}
                                // ListEmptyComponent={emptyComponent}
                                ItemSeparatorComponent={() => (
                                    <View
                                        style={{ height: 0.7, width: "90%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginVertical: 5 }}
                                    />
                                )}
                            />
                        </View>
                        <View style={{ backgroundColor: 'white', marginTop: 10, padding: 10, paddingHorizontal: 15 }}>
                            <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>Bill Details</Text> <Text style={{ color: '#727272', fontSize: 14, }}>({cartItems?.length} item)</Text></Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, }}>
                                <Text style={{ color: '#727272' }}>Item Total</Text>
                                <Text style={{}}>₹ {(totalCartValue).toFixed(2)} </Text>
                            </View>
                            <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ color: '#727272' }}>Delivery Charges</Text>
                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Free </Text>
                            </View>
                            {offerPrice > 0 ?
                                <>
                                    <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <Text style={{ color: '#35B332' }}>Coupon Discount</Text>
                                        <Text style={{ color: "#35B332", }}>- ₹{(totalCartValue - offerPrice).toFixed(2)} </Text>
                                    </View>
                                </>
                                : undefined}
                            <View style={{ marginTop: 3, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ fontWeight: 'bold' }}>Total Amount </Text>
                                <Text style={{ fontWeight: 'bold' }}>₹ {(offerPrice > 0 ? offerPrice : totalCartValue).toFixed(2)} </Text>
                            </View>
                            {totalCartValue < config?.freeDeliveryMinOrder ?
                                <View style={{ height: 40, width: "100%", flexDirection: 'column', justifyContent: 'center', borderColor: Theme.Colors.primary, alignSelf: 'center', marginTop: 20, borderStyle: 'dashed', borderWidth: 1.5, borderRadius: 4, backgroundColor: "#FDEFEF", alignItems: "center" }}>
                                    <Text style={{ color: Theme.Colors.primary }}>Minimum order of ₹{config?.freeDeliveryMinOrder} is mandatory to proceed </Text>
                                </View>
                                :
                                savedValue > 0 ?
                                    <View style={{ height: 40, width: "100%", flexDirection: 'column', justifyContent: 'center', borderColor: "#C2E2A9", alignSelf: 'center', marginTop: 20, borderStyle: 'dashed', borderWidth: 1.5, borderRadius: 4, backgroundColor: "#F1FAEA", alignItems: "center" }}>
                                        <Text style={{ color: "#60B11F" }}>😊 You have saved ₹{(savedValue + ((offerPrice > 0) ? (totalCartValue - offerPrice) : 0)).toFixed(2)} in this purchase</Text>
                                    </View>
                                    : undefined
                            }
                        </View>
                    </>
                    :
                    <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center', }]}>
                        <Image
                            style={{ height: 250 }}
                            resizeMode={"contain"}
                            source={require('../../assets/png/emptyCart.png')}
                        />
                        <View style={{ width: "80%", alignSelf: 'center' }}>
                            <Text style={{ alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Your cart is empty!</Text>
                            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#727272', fontSize: 12 }}>There is always something good for you.</Text>
                            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#727272', fontSize: 12 }}>Add something from the list.</Text>
                            <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, borderRadius: 100, justifyContent: 'center', alignItems: "center", padding: 10, marginTop: 15, width: 200, alignSelf: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 17 }}>Add Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>
                    {JSON.stringify(cartItems, null, "       ")}
                </Text> */}
                {/* <TouchableOpacity
                    style={styles.button}
                    // onPress={() => navigation.navigate('AccountStack', { screen: 'Account' })}
                    onPress={() => onClearCart()}
                >
                    <Text>clearCart</Text>
                </TouchableOpacity> */}
            </ScrollView>
            {isCartIssue &&
                <View style={{ height: 55, width: "100%", backgroundColor: '#FDEFEF', flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <FeatherIcons name="info" color={'#E1271E'} size={18} />
                        <Text style={{ color: "#E1271E", fontWeight: 'bold' }}> Please resolve cart item issues to continue. </Text>
                    </View>
                </View>
            }
            {cartItems.length > 0 ?
                <View style={{ height: 55, width: "100%", backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {(offerPrice > 0 ? offerPrice : totalCartValue).toFixed(2)} </Text>
                        <TouchableOpacity onPress={() => { scrollViewRef.current.scrollToEnd({ animated: true }); }} style={{}}>
                            <Text style={{ color: "#2D87C9" }}>View bill details <Icon name="down" type="AntDesign" style={{ fontSize: 12, color: '#2D87C9' }} /></Text>
                        </TouchableOpacity>
                    </View>
                    {userLocation?.lat ?
                        isCartIssue ?
                            <View style={{ flex: 1.2, backgroundColor: "#F5B0B2", margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                                <Text style={{ color: 'white', fontSize: 14 }}>Continue</Text>
                            </View>
                            :
                            totalCartValue < config?.freeDeliveryMinOrder ?
                                <View style={{ flex: 1.2, backgroundColor: "#F5B0B2", margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                                    <Text style={{ color: 'white', fontSize: 14 }}>Add ₹{config?.freeDeliveryMinOrder - totalCartValue} more to order</Text>
                                </View>
                                :
                                <TouchableOpacity onPress={() => { navigation.navigate('Checkout', { offerPrice: offerPrice, selectedOffer: selectedOffer }) }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                                    <Text style={{ color: 'white', fontSize: 17 }}>Checkout <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                                </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => { onPressSelectAddress() }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Select Address <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                        </TouchableOpacity>
                    }

                </View>
                : undefined}
            <AddressModal
                addressModalVisible={addressModalVisible}
                navigateTo="MapScreen"
                setAddressModalVisible={(option) => setAddressModalVisible(option)}
                navigation={navigation}
            />
        </View>
    );
}

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    darkMode: state.dark,
    categories: state.home.categories,
    userLocation: state.location,
    config: state.config.config,
    allUserAddress: state.auth.allUserAddress,
})

export default connect(mapStateToProps, { clearCart, getAllOffers, applyOffer, getCartItemsApi, getV2Config, getAllUserAddress })(CartScreen)

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
});
