import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { clearCart } from '../../actions/cart'
import Theme from '../../styles/Theme';
import CustomHeader from '../common/CustomHeader';
import CardCartScreen from './CardCartScreen';
import { Icon } from 'native-base'
const CartScreen = ({ navigation, cartItems, clearCart }) => {
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
    const onClearCart = async () => {
        clearCart()
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Cart"} showSearch={false} />
            <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
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
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>
                    {JSON.stringify(cartItems, null, "       ")}
                </Text> */}
                <TouchableOpacity
                    style={styles.button}
                    // onPress={() => navigation.navigate('AccountStack', { screen: 'Account' })}
                    onPress={() => onClearCart()}
                >
                    <Text>clearCart</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={{ height: 55, width: "100%", backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>₹ {totalCartValue}</Text>
                    <TouchableOpacity onPress={() => { }} style={{}}>
                        <Text style={{ color: "#2D87C9" }}>View bill details <Icon name="down" type="AntDesign" style={{ fontSize: 12, color: '#2D87C9' }} /></Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { scrollViewRef.current.scrollToEnd({ animated: true }); }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ color: 'white', fontSize: 17 }}>Checkout <Icon name="right" type="AntDesign" style={{ fontSize: 14, color: 'white' }} /></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    darkMode: state.dark,
    categories: state.home.categories
})

export default connect(mapStateToProps, { clearCart })(CartScreen)

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
});
