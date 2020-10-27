import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { clearCart } from '../../actions/cart'
import Theme from '../../styles/Theme';
import CustomHeader from '../common/CustomHeader';
import CardCartScreen from './CardCartScreen';
import { Icon } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
import { getAllUserAddress } from '../../actions/map'

const CartScreen = ({ navigation, cartItems, clearCart, getAllUserAddress, userLocation }) => {
    const scrollViewRef = useRef();
    const [totalCartValue, settotalCartValue] = useState(0)
    const [savedValue, setSavedValue] = useState(0)

    useEffect(() => {
        if (cartItems.length > 0) {
            let total = cartItems.reduce(function (sum, item) {
                return sum + (item.discountedPrice * item.count);
            }, 0);
            settotalCartValue(total)

            let saved = cartItems.reduce(function (sum, item) {
                return sum + ((item.actualPrice - item.discountedPrice) * item.count);
            }, 0);
            setSavedValue(saved)
        } else {
            settotalCartValue(0)
            setSavedValue(0)
        }
    }, [cartItems])

    useEffect(() => {

    }, [])


    const onClearCart = async () => {
        clearCart()
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Cart"} showSearch={false} />
            <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={false}>
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>{JSON.stringify(location, null, "       ")}</Text> */}
                <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 16, marginTop: 10 }}>
                    <View style={{ width: 60, height: 60, borderWidth: 1, borderRadius: 5, borderColor: Theme.Colors.primary, backgroundColor: '#F1FAEA', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{ width: 30, height: 30, }}
                            source={require('../../assets/png/locationIcon.png')}
                        />
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Deliver to {userLocation?.recepientName}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { navigation.navigate('MapScreen', { fromScreen: "CartScreen" }) }} style={{}}>
                                <Text style={{ color: "#73C92D" }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <Text numberOfLines={2} style={{ color: "#909090", fontSize: 13, marginTop: 5 }}>{userLocation?.addressLine1}</Text>
                    </View>
                </View>
                {cartItems.length > 0 ?
                    <>
                        <View style={{ flex: 1, backgroundColor: 'white', marginTop: 10, paddingTop: 5 }}>
                            <FlatList
                                data={cartItems}
                                renderItem={({ item }) => (
                                    <CardCartScreen item={item} navigation={navigation} />
                                )}
                                keyExtractor={item => item?.id.toString()}
                                // ListEmptyComponent={emptyComponent}
                                ItemSeparatorComponent={() => (
                                    <View
                                        style={{ height: 0.7, width: "90%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }}
                                    />
                                )}
                            />
                        </View>
                        <View style={{ backgroundColor: 'white', marginTop: 10, padding: 16 }}>
                            <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>Bill Details</Text> <Text style={{ color: '#727272', fontSize: 14, }}>({cartItems?.length} item)</Text></Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, }}>
                                <Text style={{ color: '#727272' }}>Item Total</Text>
                                <Text style={{}}>₹ {totalCartValue}</Text>
                            </View>
                            <View style={{ marginTop: 5, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ color: '#727272' }}>Delivery Charges</Text>
                                <Text style={{ color: Theme.Colors.primary }}>Free</Text>
                            </View>
                            <View style={{ marginTop: 5, height: 0.7, width: "100%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ fontWeight: 'bold' }}>Total Payable Amount</Text>
                                <Text style={{ fontWeight: 'bold' }}>₹ {totalCartValue}</Text>
                            </View>
                            {savedValue > 0 ?
                                <View style={{ height: 40, width: "100%", flexDirection: 'column', justifyContent: 'center', borderColor: Theme.Colors.primary, alignSelf: 'center', marginTop: 20, borderStyle: 'dashed', borderWidth: 1.5, borderRadius: 4, backgroundColor: "#F1FAEA", alignItems: "center" }}>
                                    <Text style={{ color: Theme.Colors.primary }}>😊 You have saved Rs {savedValue} in this purchase</Text>
                                </View>
                                : undefined}
                        </View>
                    </>
                    : undefined}
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
            {cartItems.length > 0 ?
                <View style={{ height: 55, width: "100%", backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {totalCartValue}</Text>
                        <TouchableOpacity onPress={() => { scrollViewRef.current.scrollToEnd({ animated: true }); }} style={{}}>
                            <Text style={{ color: "#2D87C9" }}>View bill details <Icon name="down" type="AntDesign" style={{ fontSize: 12, color: '#2D87C9' }} /></Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate('Checkout') }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Checkout <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                    </TouchableOpacity>
                </View>
                : undefined}
        </View>
    );
}

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    darkMode: state.dark,
    categories: state.home.categories,
    userLocation: state.location
})

export default connect(mapStateToProps, { clearCart, getAllUserAddress })(CartScreen)

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
});
