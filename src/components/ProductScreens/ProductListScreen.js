import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';
import CustomHeader from '../common/CustomHeader';
import { getItemsByCategory } from '../../actions/home'
import { connect } from 'react-redux';
import CardProductListScreen from './CardProductListScreen';
import Loader from '../common/Loader';
import CartDown from '../common/cartDown'

const ProductListScreen = ({ route, navigation, getItemsByCategory }) => {
    const { item } = route?.params;
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [products, setProducts] = useState([])

    useEffect(() => {
        initialFunction()
    }, [])

    const initialFunction = () => {
        getItemsByCategory(item?.id, (res, status) => {
            if (status) {
                setProducts(res?.data)
                // console.warn(JSON.stringify(res?.data, null, "      "))
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
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={item?.categoryDisplayName} />
            <View style={{ flex: 1 }}>
                <FlatList
                    data={products}
                    renderItem={({ item }) => (
                        <CardProductListScreen item={item} navigation={navigation} />
                    )}
                    keyExtractor={item => item?.id.toString()}
                    onRefresh={() => onRefresh()}
                    refreshing={refresh}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{ height: 0.7, width: "90%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 5 }}
                        />
                    )}
                />
                <CartDown navigation={navigation} />

            </View>
            {/* <Text>{JSON.stringify(products, null, "       ")} </Text> */}
            {loading ?
                <Loader />
                : undefined}
        </View>
    )
}
const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, { getItemsByCategory })(ProductListScreen)