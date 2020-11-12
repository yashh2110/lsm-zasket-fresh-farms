import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import { connect } from 'react-redux'
import Theme from '../../styles/Theme';

const CartFloatingCard = ({ color, size, cartItems, navigation, config }) => {
    const [totalCartValue, setTotalCartValue] = useState(0)
    useEffect(() => {
        if (cartItems.length > 0) {
            let total = cartItems.reduce(function (sum, item) {
                return sum + (item.discountedPrice * item.count);
            }, 0);
            setTotalCartValue(total)
        } else {
            setTotalCartValue(0)
        }
    }, [cartItems])
    return (
        <TouchableOpacity onPress={() => navigation.navigate("CartStack", { screen: 'Cart' })} style={{ backgroundColor: Theme.Colors.primary, width: "90%", minHeight: 50, alignSelf: 'center', borderRadius: 5, marginVertical: 10, flexDirection: 'row' }}>
            <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>{cartItems.length} item</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <SimpleLineIcons name="handbag" color={"white"} size={16} />
                    <Text style={{ color: 'white', fontSize: 14, }}> View cart {">"}</Text>
                </View>
            </View>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end', padding: 10 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>₹ {totalCartValue}</Text>
                {totalCartValue < config?.freeDeliveryMinOrder ?
                    <Text style={{ color: 'white', fontSize: 12, }}>Add more Rs {config?.freeDeliveryMinOrder - totalCartValue} for free delivery</Text>
                    : undefined}
            </View>
        </TouchableOpacity>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    config: state.config.config,
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CartFloatingCard)
