import React from 'react';
import { Text, TouchableOpacity, View, Image, AsyncStorage } from 'react-native';
// import CartButton from './cartButton';
import { Icon } from 'native-base';
import { connect } from 'react-redux';

const CustomHeader = ({ navigation, title }) => {

    return (
        <View style={{ flexDirection: 'row', minHeight: 60 }}>
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}
                style={{ width: 60, justifyContent: 'center', alignItems: 'center', }}
            >
                <>
                    <Icon name="left" type="AntDesign" style={[{ color: 'black', fontSize: 23 }]} />
                </>
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', }}>
                <Text style={{ fontSize: 18, color: 'black' }}>{title}</Text>
            </View>
            <>
                <TouchableOpacity
                    onPress={() => {
                        //   navigation.navigate('MasterSearch')
                    }}
                    style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}
                >
                    <Icon name="search" type="Feather" style={[{ color: '#727272', fontSize: 22 }]} />
                </TouchableOpacity>
            </>
            {/* <CartButton navigation={navigation} /> */}
        </View>
    )
}
export default CustomHeader;
