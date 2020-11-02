import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, FlatList } from 'react-native';
import Theme from '../../styles/Theme';
import { addToCart, updateCart } from '../../actions/cart'
import { connect } from 'react-redux';

const ProductCard = ({ item, navigation, addToCart, updateCart, cartItems }) => {
    const [addButton, setAddButton] = useState(true)
    const [count, setCount] = useState(1)
    const [isUpdate, setIsUpdate] = useState(false)

    useEffect(() => {
        // cartItems?.forEach(el => {
        //     if (el?.id == item?.id) {
        //         setAddButton(false)
        //         setCount(el.count)
        //     }
        // })
        let filteredItems = cartItems.filter(element => element?.id == item?.id);
        if (filteredItems.length == 1) {
            setAddButton(false)
            setCount(filteredItems[0].count)
        } else {
            setAddButton(true)
            setCount(1)
            setIsUpdate(false)
        }

    }, [cartItems])

    useEffect(() => {
        if (isUpdate) {
            updateCart(item, count)
        }
    }, [count])

    const onAddToCart = async () => {
        setAddButton(!addButton)
        let obj = item
        obj.count = count
        addToCart(obj)
        setIsUpdate(true)
    }

    const onCartUpdate = async (option) => {
        setIsUpdate(true)
        if (option == "DECREASE") {
            if (count > 1) {
                setCount(count - 1)
            }
        }
        if (option == "INCREASE") {
            if (count < 6) {
                setCount(count + 1)
            }
        }
    }



    return (
        <View style={{ flex: 1, margin: 4, width: 220, marginBottom: 20 }}>
            <TouchableOpacity
                onPress={() => { navigation.navigate("ProductDetailScreen", { item: item }) }}
                style={styles.productCard}>
                <View style={{ flex: 1, backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', }} onPress={() => { }}>
                    {/* <Text>{JSON.stringify(item, null, "         ")}</Text> */}
                    <Image
                        style={{ height: 160, width: 220 }}
                        resizeMode="center"
                        source={require('../../assets/png/Rectangle.png')}
                    // source={{ uri: "https://i.picsum.photos/id/722/360/270.jpg?hmac=hZD0DDKD3kEt6aoNWx4ZP29cj87zDOlPlgKaCD6O3lc" }}
                    />

                </View>
                <View style={[{ padding: 10 }]}>
                    <Text numberOfLines={1} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.itemName}</Text>
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
                    <TouchableOpacity onPress={() => onCartUpdate('DECREASE')} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>-</Text>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>{count}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onCartUpdate('INCREASE')} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
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


export default connect(mapStateToProps, { addToCart, updateCart })(ProductCard)
const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 5,
    },
    productCard: {
        margin: 2,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: "#EFEFEF",
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
        bottom: -12,
    }
});
