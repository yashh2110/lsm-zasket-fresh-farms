import * as React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { clearCart } from '../../actions/cart'
import CustomHeader from '../common/CustomHeader';
import CardCartScreen from './CardCartScreen';

const CartScreen = ({ navigation, cartItems, clearCart }) => {

    const onClearCart = async () => {
        clearCart()
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Cart"} showSearch={false} />
            <ScrollView style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
                <FlatList
                    data={cartItems}
                    renderItem={({ item }) => (
                        <CardCartScreen item={item} navigation={navigation} />
                    )}
                    keyExtractor={item => item?.id.toString()}
                    // ListEmptyComponent={emptyComponent}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{ height: 0.7, width: "90%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10 }}
                        />
                    )}
                />
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>
                    {JSON.stringify(cartItems, null, "       ")}
                </Text> */}
                <TouchableOpacity
                    style={styles.button}
                    // onPress={() => navigation.navigate('AccountStack', { screen: 'Account' })}
                    onPress={() => onClearCart()}
                >
                    <Text>clearCart</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
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
