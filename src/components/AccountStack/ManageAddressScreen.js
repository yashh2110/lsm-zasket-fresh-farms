import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList, ScrollView, Image, RefreshControl, Alert } from 'react-native';
import { connect } from 'react-redux';
import { clearCart } from '../../actions/cart'
import Theme from '../../styles/Theme';
import CustomHeader from '../common/CustomHeader';
import { Icon } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
import { getAllUserAddress, deleteAddress } from '../../actions/map'
import Loader from '../common/Loader';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const ManageAddressScreen = ({ navigation, cartItems, clearCart, getAllUserAddress, deleteAddress, userLocation }) => {

    const [savedAddress, setSavedAddress] = useState([])
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        initialFunction()
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            initialFunction()
        });
        return unsubscribe;
    }, [navigation]);


    const initialFunction = async () => {
        getAllUserAddress(async (response, status) => {
            // alert(JSON.stringify(response, null, "   "))
            if (status) {
                let newArray = []
                await response?.data?.forEach((el, index) => {
                    if (el?.isActive) newArray.push(el)
                })
                setSavedAddress(newArray)
                setLoading(false)
                setRefresh(false)
            } else {
                setLoading(false)
                setRefresh(false)
                setSavedAddress([])
            }
        })
    }

    const onRefresh = () => {
        setRefresh(true)
        initialFunction()
    }

    const onPressAddNewAddress = () => {
        navigation.navigate('AutoCompleteLocationScreen', { navigateTo: "MapScreen", fromScreen: "AddNew_SCREEN", backToAddressScreen: "ManageAddressScreen" })
        // navigation.navigate('MapScreen', { fromScreen: "ManageAddressScreen" })
    }

    const onPressEdit = (option) => {
        navigation.navigate('MapScreen', { fromScreen: "EDIT_SCREEN", item: option })
    }

    const onPressDelete = (option) => {
        Alert.alert(
            "Alert",
            "Are you sure want to delete the address?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        setLoading(true)
                        deleteAddress(option?.id, (response, status) => {
                            if (status) {
                                // alert(JSON.stringify(response, null, "   "))
                                initialFunction()
                            } else {
                                setLoading(false)
                                setRefresh(false)
                            }
                        })
                    }
                }
            ],
            { cancelable: false }
        );


    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Manage Addresses"} showSearch={false} />
            <ScrollView style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }>
                {/* <Text style={{ textAlign: 'center', marginBottom: 16 }}>{JSON.stringify(location, null, "       ")} </Text> */}
                <FlatList
                    data={savedAddress}
                    renderItem={({ item }) =>
                        <View style={{ backgroundColor: 'white', paddingTop: 5, paddingHorizontal: 16, marginTop: 10, flex: 1 }}>
                            <View style={{ paddingBottom: 10, paddingTop: 5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {/* <Text style={styles.item}
                                    //   onPress={getListViewItem.bind(this, item)}
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
                                            {/* <Text style={{ fontSize: 14, fontWeight: 'bold', }}>{item?.recepientName}  </Text> */}
                                        </View>
                                        <View style={{ marginTop: 5, flexDirection: "row" }}>
                                            {
                                                item?.houseNo ?
                                                    <>
                                                        <Text style={{ color: "#909090", fontSize: 13, marginRight: 5 }}>{item?.houseNo}</Text>
                                                    </>
                                                    :
                                                    undefined
                                            }

                                            {
                                                item?.landmark ?
                                                    <>
                                                        <Text style={{ color: "#909090", fontSize: 13, }}>{item?.landmark}</Text>
                                                    </>
                                                    :
                                                    undefined
                                            }
                                        </View>
                                        <Text style={{ color: "#909090", fontSize: 13, }}>{item?.addressLine_1} </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: "#EAEAEC", marginTop: 5, paddingTop: 10 }}>
                                    <TouchableOpacity onPress={() => { onPressEdit(item) }} style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Edit </Text>
                                    </TouchableOpacity>
                                    <View style={{ width: 1, backgroundColor: '#EAEAEC', }} />
                                    <TouchableOpacity onPress={() => { onPressDelete(item) }} style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>Delete  </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                    // ListEmptyComponent={() =>
                    //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    //         {/* <Draggable> */}
                    //         <LottieView
                    //             style={{ width: 200, height: 220, marginVertical: 55 }}
                    //             source={require("../../assets/animations/sadSearch.json")}
                    //             autoPlay
                    //             loop
                    //         />
                    //         {/* // </Draggable>  */}
                    //         <Animatable.Text animation="pulse" easing="ease-in" duration={1500} iterationCount="infinite" style={{ fontSize: 20, marginTop: 50, color: '#474747' }}>You have no locations saved yet</Animatable.Text>
                    //     </View>
                    // }
                    keyExtractor={item => item?.id.toString()}
                />
            </ScrollView>
            <TouchableOpacity onPress={() => { onPressAddNewAddress() }} style={{ height: 50, backgroundColor: Theme.Colors.primary, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18 }}>+ Add New Address</Text>
            </TouchableOpacity>
            {loading ?
                <Loader /> : undefined}
        </View>
    );
}

const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    darkMode: state.dark,
    categories: state.home.categories,
    userLocation: state.location
})

export default connect(mapStateToProps, { clearCart, getAllUserAddress, deleteAddress })(ManageAddressScreen)

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
});
