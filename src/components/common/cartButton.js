import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { View, Text, Alert } from 'react-native'
import { Button, Badge } from "react-native-elements";
import { commonStyle } from "../../pages/style";
import { retrieveData } from "../../../common/utils";
import { getCartItems } from '../../action/CustomerAction'
import { Icon } from 'native-base';
import { Title, Headline, Subheading, TouchableRipple, } from 'react-native-paper';

const CartButton = props => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        setCount(props.products?.cart_item_list?.length)
    }, [props.products])

    useEffect(() => {
        console.warn(props.auth?.role);
        props.getCartItems()
    }, [props.auth])

    const onPressCart = () => {
        retrieveData("jwt").then(res => {
            if (res) {
                if (res.role === "customer") {
                    props.navigation.navigate("CartScreen")
                } else {
                    alert("Customer can only access cart")
                }
            } else {
                Alert.alert(
                    'Alert',
                    'Login to continue',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => props.navigation.navigate("Login") },
                    ],
                    { cancelable: true }
                )
            }
        })
    }
    return (
        <View style={{ justifyContent: 'center' }}>
            {props.auth?.role === 'customer' ?
                <>
                    <TouchableRipple onPress={onPressCart}>
                        <Icon name="shopping-cart" type="Feather" style={[commonStyle.navBarIcon, { color: 'white', fontSize: 21 }]} />
                    </TouchableRipple>
                    {count > 0 ?
                        <View style={{ position: 'absolute', top: 8, right: 2, backgroundColor: 'green', borderRadius: 50, width: 15, height: 15, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                {count}
                            </Text>
                        </View>
                        // <Badge
                        //     value={<Text style={{ color: 'white' }}>
                        //         {count}
                        //     </Text>}
                        //     badgeStyle={{ backgroundColor: 'red' }}
                        //     containerStyle={{ position: 'absolute', top: 8, right: 8 }}
                        // />
                        : undefined
                    }
                </>
                : undefined}
        </View>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth.user,
    products: state.customer.cartItems
})

export default connect(mapStateToProps, { getCartItems })(CartButton)
