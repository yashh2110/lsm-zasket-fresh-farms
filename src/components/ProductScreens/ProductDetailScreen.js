import React, { useEffect, useContext, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import CustomHeader from '../common/CustomHeader';
import BannerImages from './BannerImages';
import { getItem } from '../../actions/home'
import { connect } from 'react-redux';
import Loader from '../common/Loader';
import Theme from '../../styles/Theme';

const ProductDetailScreen = ({ navigation, route, getItem }) => {
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [product, setProduct] = useState({})
    const { item } = route?.params;

    useEffect(() => {
        // alert(JSON.stringify(item, null, "      "))
        initialFunction()
    }, [])

    const initialFunction = () => {
        getItem(item?.id, (res, status) => {
            if (status) {
                setProduct(res?.data)
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
    return (
        <View
            style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Back"} />
            <ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }
            >
                <BannerImages navigation={navigation} />
                {/* <Text>{JSON.stringify(product, null, "       ")}</Text> */}
                <View style={[{ padding: 10 }]}>
                    <Text style={{ marginTop: 5, fontSize: 20, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{product?.itemName}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹{product?.discountedPrice}</Text>
                        <Text style={{ fontSize: 15, color: '#909090', textDecorationLine: 'line-through', marginLeft: 10 }}>₹{product?.actualPrice}</Text>
                        <Text style={{ fontSize: 15, color: Theme.Colors.primary, marginLeft: 10 }}>{(((product?.actualPrice - product?.discountedPrice) / product?.actualPrice) * 100).toFixed(0)}% off</Text>
                    </View>
                    <Text style={{ marginTop: 5, color: '#909090', }}>{product?.itemSubName}</Text>
                    <Text style={{ marginTop: 10, color: '#727272', }}>{product?.itemDescription}</Text>
                </View>
            </ScrollView>
            {loading ?
                <Loader />
                : undefined}
        </View>
    )
}
const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, { getItem })(ProductDetailScreen)