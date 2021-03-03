import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, FlatList, Dimensions, Image, RefreshControl } from 'react-native';
import { Icon } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import { getCustomerOrders } from '../../actions/cart';
import CardMyOrders from "./CardMyOrders";
import Loader from "../common/Loader";


const MyOrders = ({ route, navigation, getCustomerOrders }) => {
    const [orderDetails, setOrderDetails] = useState([])
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            initialFunction()
        });
        return unsubscribe;
    }, [navigation]);


    const initialFunction = async () => {
        getCustomerOrders((res, status) => {
            if (status) {
                setOrderDetails(res?.data)
                setLoading(false)
                setRefresh(false)
                // alert(JSON.stringify(res?.data, null, "        "))
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
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"My Orders"} showSearch={false} />
            <View style={{ flex: 1, backgroundColor: '#F8F8F8' }} >
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>{JSON.stringify(orderDetails, null, "       ")} </Text> */}
                <FlatList
                    data={orderDetails}
                    renderItem={({ item }) =>
                        <CardMyOrders item={item} navigation={navigation} onRepeatOrder={() => {
                            setLoading(true)
                            initialFunction()
                        }} />
                    }
                    onRefresh={() => onRefresh()}
                    refreshing={refresh}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh} onRefresh={onRefresh}
                        />
                    }
                    ListEmptyComponent={() => {
                        return (
                            <View style={[{ flex: 1, alignSelf: 'center', justifyContent: 'center', }]}>
                                {loading ?
                                    undefined
                                    :
                                    <>
                                        <Image
                                            style={{ height: 250 }}
                                            resizeMode={"contain"}
                                            source={require('../../assets/png/emptyCart.png')}
                                        />
                                        <View style={{ width: "80%", alignSelf: 'center' }}>
                                            <Text style={{ alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>No orders found</Text>
                                            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#727272', fontSize: 12 }}>There is always something good for you.</Text>
                                            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#727272', fontSize: 12 }}>Add something to cart.</Text>
                                            <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, borderRadius: 100, justifyContent: 'center', alignItems: "center", padding: 10, marginTop: 15, width: 200, alignSelf: 'center' }}>
                                                <Text style={{ color: 'white', fontSize: 17 }}>Add Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>}
                            </View>
                        )
                    }}
                // keyExtractor={item => item?.id.toString()}
                />
            </View>
            {loading ?
                <Loader />
                : undefined}
        </View>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, { getCustomerOrders })(MyOrders)