import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import { connect } from 'react-redux'
import Theme from '../../styles/Theme';

const CartFloatingCard = ({ color, size, cartItems, navigation, config }) => {
    const [totalCartValue, settotalCartValue] = useState(0)
    useEffect(() => {
        if (cartItems.length > 0) {
            let total = cartItems.reduce(function (sum, item) {
                return sum + (item.discountedPrice * item.count);
            }, 0);
            settotalCartValue(total)
        } else {
            settotalCartValue(0)
        }
    }, [cartItems])
    return (
        <View style={{ backgroundColor: Theme.Colors.primary, width: "90%", minHeight: 50, alignSelf: 'center', borderRadius: 5, marginVertical: 10, flexDirection: 'row' }}>
            <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>{cartItems.length} item</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <SimpleLineIcons name="handbag" color={"white"} size={16} />
                    <Text style={{ color: 'white', fontSize: 14, }}> View cart {">"}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end', padding: 10 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>₹ {totalCartValue}</Text>
                {totalCartValue < config?.minimumCartValue ?
                    <Text style={{ color: 'white', fontSize: 12, }}>Add more Rs {config?.minimumCartValue - totalCartValue} for free delivery</Text>
                    : undefined}
            </View>
        </View>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    config: state.config.config,
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CartFloatingCard)
