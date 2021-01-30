import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Theme from '../../styles/Theme';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import Modal from 'react-native-modal';
import moment from 'moment'
import Icons from 'react-native-vector-icons/FontAwesome';
import { addLocation } from '../../actions/location'
import { addHomeScreenLocation } from '../../actions/homeScreenLocation'

const AddressModal = ({ item, navigation, navigateTo, homeScreenLocation, addLocation, addHomeScreenLocation, allUserAddress, addressModalVisible, setAddressModalVisible }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [savedUserAddresses, setSavedUserAddresses] = useState([])

    useEffect(() => {
        setIsVisible(addressModalVisible)
    }, [addressModalVisible])

    useEffect(() => {
        if (allUserAddress?.length > 0) {
            let newArray = []
            allUserAddress?.forEach((el, index) => {
                if (el?.isActive) newArray.push(el)
            })
            setSavedUserAddresses(newArray)
            if (homeScreenLocation?.addressLine_1 == undefined || homeScreenLocation?.addressLine_1 == "") {
                onPressSavedAddress(newArray[0])
            }
        }
    }, [allUserAddress])

    const onPressSavedAddress = async (item) => {
        // Alert.alert(JSON.stringify(item, null, "      "))
        let payload = {
            id: item?.id,
            addressLine_1: item?.addressLine_1,
            lat: item?.lat,
            lon: item?.lon,
            recepientName: item?.recepientName,
            recepientMobileNumber: item?.recepientMobileNumber,
            landMark: item?.landMark,
            saveAs: item?.saveAs,
            pincode: item?.pincode
        }
        addLocation(payload)
        addHomeScreenLocation({
            addressLine_1: item?.addressLine_1,
            lat: item?.lat,
            lon: item?.lon,
            pincode: item?.pincode
        })
    }
    return (
        <Modal
            isVisible={isVisible}
            onSwipeComplete={() => setAddressModalVisible(false)}
            swipeDirection="down"
            style={{ margin: 0, justifyContent: 'flex-end' }}
            onBackButtonPress={() => setAddressModalVisible(false)}
            onBackdropPress={() => setAddressModalVisible(false)}
        >
            <SafeAreaView style={{ height: "50%", backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                <View style={{ alignSelf: 'center', height: 5, width: 50, backgroundColor: '#E2E2E2', borderRadius: 50, marginVertical: 15 }} />
                <Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Choose a delivery address</Text>
                <Text style={{ color: '#909090', textAlign: 'center', fontSize: 13 }}>Saved Address</Text>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, margin: 4, width: "90%", marginBottom: 10, alignSelf: 'center' }}>
                        <FlatList
                            data={savedUserAddresses}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => {
                                    onPressSavedAddress(item)
                                    setAddressModalVisible(false)
                                }} style={{ flexDirection: 'row', paddingBottom: 10, paddingTop: 5 }}>
                                    {/* <Text style={styles.item}
                                                //   onPress={this.getListViewItem.bind(this, item)}
                                                >{JSON.stringify(item, null, "      ")} </Text> */}
                                    {item?.saveAs == "Home" &&
                                        <View style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                            <Icon name="home" type="AntDesign" style={{ fontSize: 24, color: '#232323' }} />
                                        </View>
                                    }
                                    {item?.saveAs == "Office" &&
                                        <View style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                            <Icon name="office-building" type="MaterialCommunityIcons" style={{ fontSize: 24, color: '#232323' }} />
                                        </View>
                                    }
                                    {item?.saveAs == "Others" &&
                                        <View style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                            <Icon name="location-pin" type="SimpleLineIcons" style={{ fontSize: 24, color: '#232323' }} />
                                        </View>
                                    }
                                    <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {item?.saveAs == "Home" &&
                                                <View style={{ backgroundColor: "#FEF8FC", borderWidth: 1, borderRadius: 4, borderColor: "#FCD8EC", paddingVertical: 3, marginRight: 5 }}>
                                                    <Text style={{ color: "#F464AD", fontSize: 12, marginHorizontal: 5 }}>Home</Text>
                                                </View>
                                            }
                                            {item?.saveAs == "Office" &&
                                                <View style={{ backgroundColor: "#FCF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#F0D4FA", paddingVertical: 3, marginRight: 5 }}>
                                                    <Text style={{ color: "#CD64F4", fontSize: 12, marginHorizontal: 5 }}>Office</Text>
                                                </View>
                                            }
                                            {item?.saveAs == "Others" &&
                                                <View style={{ backgroundColor: "#EDF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#BEDCFF", paddingVertical: 3, marginRight: 5 }}>
                                                    <Text style={{ color: "#64A6F4", fontSize: 12, marginHorizontal: 5 }}>Others</Text>
                                                </View>
                                            }
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', }}>{item?.recepientName} </Text>
                                        </View>
                                        <Text numberOfLines={2} style={{ color: "#909090", fontSize: 13, marginTop: 5 }}>{item?.addressLine_1} </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            ItemSeparatorComponent={this.renderSeparator}
                            keyExtractor={item => item?.id.toString()}
                        />
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => {
                    if (navigateTo == "MapScreen") {
                        navigation.navigate('MapScreen', { fromScreen: "AddressModal" })
                    } else {
                        navigation.navigate('AutoCompleteLocationScreen', { fromScreen: 'AddressModal', navigateTo: navigateTo })
                    }
                    setAddressModalVisible(false)
                }} style={{ backgroundColor: Theme.Colors.primary, height: 50, justifyContent: "center" }}>
                    <Text style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold' }}>+  Add New Address </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </Modal >
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    allUserAddress: state.auth.allUserAddress,
    homeScreenLocation: state.homeScreenLocation,
})


export default connect(mapStateToProps, { addLocation, addHomeScreenLocation })(AddressModal)
const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 5,
    },
    productCard: {
        flexDirection: 'row',
        margin: 2,
        backgroundColor: '#FFFFFF',

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
        marginVertical: 5
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
        // position: 'absolute',
        // zIndex: 1,
        // right: 10,
        // bottom: 12,
    }
});
