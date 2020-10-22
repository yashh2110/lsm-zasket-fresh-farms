import * as React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { clearCart } from '../../actions/cart'

const CartScreen = ({ navigation, cartItems, clearCart }) => {

    const onClearCart = async () => {
        clearCart()
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, padding: 16 }}>
                <View
                    style={{ flex: 1, }}>
                    <Text style={{ textAlign: 'center', marginBottom: 16 }}>
                        {JSON.stringify(cartItems, null, "       ")}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        // onPress={() => navigation.navigate('AccountStack', { screen: 'Account' })}
                        onPress={() => onClearCart()}
                    >
                        <Text>clearCart</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    darkMode: state.dark,
    categories: state.home.categories
})

export default connect(mapStateToProps, { clearCart })(CartScreen)

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
});
