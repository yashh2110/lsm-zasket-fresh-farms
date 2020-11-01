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


const MyOrders = ({ navigation, getCustomerOrders }) => {
    const [orderDetails, setOrderDetails] = useState([])
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        initialFunction()
    }, [])

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
            <ScrollView style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }>
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>{JSON.stringify(location, null, "       ")}</Text> */}
                <FlatList
                    data={orderDetails}
                    renderItem={({ item }) =>
                        <CardMyOrders item={item} />
                    }
                // keyExtractor={item => item?.id.toString()}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, { getCustomerOrders })(MyOrders)