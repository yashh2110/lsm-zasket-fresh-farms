import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Text } from 'native-base';
import LottieView from 'lottie-react-native';
import Theme from '../../styles/Theme';
import moment from 'moment'

const PaymentSuccessScreen = ({ navigation, route }) => {
    const { date } = route.params;
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
                style={{ width: 100, height: 100 }}
                source={require("../../assets/animations/success.json")}
                autoPlay={true}
                loop={false}
            />
            <Text style={{ color: Theme.Colors.primary, fontSize: 18, fontWeight: 'bold' }}>Thank you for your order</Text>
            <Text style={{ color: "#727272", fontSize: 14, textAlign: 'center', width: '80%' }}>We are currently processing your order.
                You can find updates to your order under <Text onPress={() => {
                    navigation.navigate('CartStack', { screen: 'MyOrders' },)
                    navigation.pop()
                }} style={{ color: Theme.Colors.primary }}>My orders</Text>.</Text>
            <Text style={{ fontSize: 14, color: "#727272", marginTop: 20 }}>Your oder will arrive on </Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{moment().add(date + 1, 'days').format("DD MMM")}</Text>
            <Button full style={{ marginVertical: 20, backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => {
                navigation.navigate('Home')
                navigation.pop()
            }}><Text>Go to Homepage</Text></Button>
        </View>
    );
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {})(PaymentSuccessScreen)

const styles = StyleSheet.create({

});
