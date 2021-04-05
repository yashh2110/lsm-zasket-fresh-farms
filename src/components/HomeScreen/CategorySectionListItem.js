import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, FlatList } from 'react-native';
import Theme from '../../styles/Theme';
import ProductCard from './ProductCard';

const CategorySectionListItem = ({ item, navigation }) => {
    return (
        <>
            {/* <Text>{JSON.stringify(item, null, "      ")} </Text> */}
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#2E2E2E', paddingLeft: 10, paddingVertical: 4, fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize', marginBottom: 5 }}>{item?.categoryDisplayName} </Text>
                </View>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('ProductListScreen', { item: item }) }}
                    style={{ justifyContent: 'center', alignItems: 'center', paddingRight: 10, paddingVertical: 4, }}
                >
                    <Text style={{ color: "#727272", fontSize: 13 }}>View all</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.scrollChildParent}>
                <FlatList
                    data={item?.items?.slice(0, 10)}
                    renderItem={({ item }) => (
                        <ProductCard item={item} navigation={navigation} />
                    )}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item?.id.toString()}
                />
            </View>
        </>
    )
}
export default CategorySectionListItem;

const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        marginTop: -5
    },
    productCard: {
        margin: 2,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: "#EFEFEF",
        flex: 1,
        padding: 0,
        overflow: "hidden",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    addButton: {
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: 'white',
        flexDirection: 'row',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        position: 'absolute',
        zIndex: 1,
        right: 10,
        bottom: -12,
    }
});
