import React, { useEffect, useContext, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import CustomHeader from '../common/CustomHeader';
import BannerImages from './BannerImages';
import { getItem } from '../../actions/home'
import { connect } from 'react-redux';
import Loader from '../common/Loader';
import Theme from '../../styles/Theme';
import { TouchableOpacity } from 'react-native';
import { addToCart, updateCart } from '../../actions/cart'
import CartFloatingCard from '../cartStack/CartFloatingCard';

const ProductDetailScreen = ({ navigation, route, getItem, addToCart, updateCart, cartItems }) => {
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [item, setItem] = useState({})
    // const { item } = route?.params;

    useEffect(() => {
        // alert(JSON.stringify(paramsItem, null, "      "))
        initialFunction()
    }, [])

    const initialFunction = () => {
        getItem(route?.params?.item?.id, (res, status) => {
            if (status) {
                setItem(res?.data)
                // alert(JSON.stringify(res?.data, null, "      "))
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
    const [count, setCount] = useState(1)
    const [isUpdate, setIsUpdate] = useState(false)


    useEffect(() => {
        if (cartItems.length > 0) {
            cartItems?.forEach(el => {
                if (el?.id == route.params.item?.id) {
                    setAddButton(false)
                    setCount(el.count)
                }
            })
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
        <View
            style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Back"} />
            <ScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }
            >
                <BannerImages navigation={navigation} />
                {/* <Text>{JSON.stringify(item, null, "       ")}</Text> */}
                <View style={[{ padding: 10 }]}>
                    <Text style={{ marginTop: 5, fontSize: 20, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.itemName}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹{item?.discountedPrice}</Text>
                        <Text style={{ fontSize: 15, color: '#909090', textDecorationLine: 'line-through', marginLeft: 10 }}>₹{item?.actualPrice}</Text>
                        <Text style={{ fontSize: 15, color: Theme.Colors.primary, marginLeft: 10 }}>{(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0)}% off</Text>
                    </View>
                    <Text style={{ marginTop: 5, color: '#909090', }}>{item?.itemSubName}</Text>
                    <Text style={{ marginTop: 10, color: '#727272', }}>{item?.itemDescription}</Text>
                </View>
            </ScrollView>
            {cartItems?.length > 0 ?
                <View style={{ position: 'absolute', bottom: 50, width: "100%", alignSelf: 'center' }}>
                    <CartFloatingCard navigation={navigation} />
                </View>
                : undefined
            }
            {addButton ?
                <TouchableOpacity onPress={() => onAddToCart()} style={{ backgroundColor: Theme.Colors.primary, height: 50, justifyContent: "center" }}>
                    <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold' }}>+  Add</Text>
                </TouchableOpacity>
                : <View style={{ backgroundColor: Theme.Colors.primary, height: 50, flexDirection: 'row', justifyContent: 'space-evenly' }}>

                    <TouchableOpacity onPress={() => onCartUpdate('INCREASE')} style={{ width: 35, height: 35, backgroundColor: "#60B11F", borderRadius: 4, justifyContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20 }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'white', alignSelf: 'center', fontSize: 18 }}>{count}</Text>
                    <TouchableOpacity onPress={() => onCartUpdate('DECREASE')} style={{ width: 35, height: 35, backgroundColor: "#60B11F", borderRadius: 4, justifyContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', fontSize: 20 }}>+</Text>
                    </TouchableOpacity>
                </View>
            }
            {loading ?
                <Loader />
                : undefined}
        </View>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
})


export default connect(mapStateToProps, { getItem, addToCart, updateCart })(ProductDetailScreen)