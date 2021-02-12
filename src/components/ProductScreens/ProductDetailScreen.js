import React, { useEffect, useContext, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
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

const ProductDetailScreen = ({ navigation, route, getItem, cartItems, updateCartItemsApi, isAuthenticated }) => {
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [item, setItem] = useState({})
    // const { item } = route?.params;
    const [loadingCount, setLoadingCount] = useState(false)

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
    const [count, setCount] = useState(0)

    useEffect(() => {
        let filteredItems = cartItems.filter(element => element?.id == route?.params?.item?.id);
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

    return (
        <View
            style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Back"} />
            <ScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }
            >
                <BannerImages navigation={navigation} item={item} />
                {/* <Text>{JSON.stringify(item, null, "       ")} </Text> */}
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
                            <Text style={{ fontSize: 15, color: Theme.Colors.primary, marginLeft: 10 }}>{(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0)}% off</Text>
                        }
                    </View>
                    <Text style={{ color: '#909090', }}>{item?.itemSubName} </Text>
                    <Text style={{ marginTop: 5, color: '#727272', }}>{item?.itemDescription} </Text>
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
                    <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold' }}>+  Add </Text>
                </TouchableOpacity>
                :
                <View style={{ backgroundColor: Theme.Colors.primary, height: 50, flexDirection: 'row', justifyContent: 'space-evenly' }}>
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
            {loading ?
                <Loader />
                : undefined}
        </View>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { getItem, updateCartItemsApi })(ProductDetailScreen)