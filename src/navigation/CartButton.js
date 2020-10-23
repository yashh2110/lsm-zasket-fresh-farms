import React from 'react';
import { Text, View } from 'react-native';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import { connect } from 'react-redux'
import Theme from '../styles/Theme';

const CartButton = ({ color, size, cartItems }) => {
    return (
        <View style={{}}>
            <SimpleLineIcons name="handbag" color={color} size={size} />
            {cartItems.length > 0 ?
                <View style={{ backgroundColor: Theme.Colors.primary, borderRadius: 50, minHeight: 22, minWidth: 22, padding: 5, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: -10, top: -4 }}>
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{cartItems.length}</Text>
                </View>
                : undefined}
        </View>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CartButton)
