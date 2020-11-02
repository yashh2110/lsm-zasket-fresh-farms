import React from 'react';
import { Text, TouchableOpacity, View, Image, } from 'react-native';
// import CartButton from './cartButton';
import { Icon } from 'native-base';
import { connect } from 'react-redux';

const CustomHeader = ({ navigation, title, showSearch = true }) => {

    return (
        <View style={{ flexDirection: 'row', minHeight: 60 }}>
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}
                style={{ width: 60, justifyContent: 'center', alignItems: 'center', }}
            >
                <>
                    <Icon name="chevron-small-left" type="Entypo" style={[{ color: 'black', fontSize: 36 }]} />
                </>
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', }}>
                <Text style={{ fontSize: 18, color: 'black', textTransform: 'capitalize' }}>{title}</Text>
            </View>
            <>
                {showSearch ?
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SearchStack', { screen: 'Search' })}
                        style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}
                    >
                        <Icon name="search" type="Feather" style={[{ color: '#727272', fontSize: 22 }]} />
                    </TouchableOpacity>
                    : undefined}
            </>
            {/* <CartButton navigation={navigation} /> */}
        </View>
    )
}
export default CustomHeader;
