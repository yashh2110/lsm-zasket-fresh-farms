import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, FlatList } from 'react-native';
import Theme from '../../styles/Theme';
import { addToCart, updateCart } from '../../actions/cart'
import { connect } from 'react-redux';

const CardProductListScreen = ({ item, navigation, addToCart, updateCart, cartItems }) => {
    const [addButton, setAddButton] = useState(true)
    const [count, setCount] = useState(1)
    const [isUpdate, setIsUpdate] = useState(false)

    useEffect(() => {
        if (isUpdate) {
            updateCart(item, count)
        }
    }, [count])

    useEffect(() => {
        if (cartItems.length > 0) {
            cartItems?.forEach(el => {
                if (el?.id == item?.id) {
                    setAddButton(false)
                    setCount(el.count)
                }
            })
        } else {
            setAddButton(true)
            setCount(1)
        }
    }, [cartItems])

    const onAddToCart = async () => {
        setAddButton(!addButton)
        let obj = item
        obj.count = count
        addToCart(obj)
        setIsUpdate(true)
    }

    const onCartUpdate = async (option) => {
        setIsUpdate(true)
        if (option == "INCREASE") {
            if (count > 1) {
                setCount(count - 1)
            }
        }
        if (option == "DECREASE") {
            setCount(count + 1)
        }
    }



    return (
        <View style={{ flex: 1, margin: 4, width: "90%", marginBottom: 10, alignSelf: 'center' }}>
            <TouchableOpacity
                onPress={() => { navigation.navigate("ProductDetailScreen", { item: item }) }}
                style={styles.productCard}>
                <View style={{
                    backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', padding: 10, borderWidth: 0.5, borderColor: "#EFEFEF", borderRadius: 5
                }} onPress={() => { }}>
                    {/* <Text>{JSON.stringify(item, null, "         ")}</Text> */}
                    <Image
                        style={{ width: 130, height: 100, borderRadius: 5 }}
                        resizeMode="contain"
                        source={require('../../assets/png/Rectangle.png')}
                    // source={{ uri: "https://i.picsum.photos/id/390/500/300.jpg?hmac=MTvu05oUf6PaVif2NTqWv7mLAYEYslPgtVOyjSZe-pk" }}
                    />
                </View>
                <View style={[{ padding: 10 }]}>
                    <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.itemName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹{item?.discountedPrice}</Text>
                        <Text style={{ fontSize: 14, color: '#909090', textDecorationLine: 'line-through', marginLeft: 10 }}>₹{item?.actualPrice}</Text>
                        <Text style={{ fontSize: 14, color: Theme.Colors.primary, marginLeft: 10 }}>{(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0)}% off</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: '#909090', }}>{item?.itemSubName}</Text>
                </View>
            </TouchableOpacity>

            {addButton ?
                <TouchableOpacity
                    onPress={() => onAddToCart()}
                    style={[styles.addButton, {}]}
                >
                    <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>+ Add</Text>
                </TouchableOpacity>
                :
                <View style={[styles.addButton, {}]}>
                    <TouchableOpacity onPress={() => onCartUpdate('INCREASE')} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>-</Text>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>{count}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onCartUpdate('DECREASE')} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>+</Text>
                    </TouchableOpacity>
                </View>
            }

        </View>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
})


export default connect(mapStateToProps, { addToCart, updateCart })(CardProductListScreen)
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
        position: 'absolute',
        zIndex: 1,
        right: 10,
        bottom: 12,
    }
});
