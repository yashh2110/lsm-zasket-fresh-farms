import React from 'react';
import { Alert, Platform, StyleSheet, FlatList, Image, SafeAreaView, Modal, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView, ActivityIndicator, Linking } from 'react-native';
import MapView, { Marker, Callout, ProviderPropType } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import marker from '../../assets/png/locationIcon.png';
import { Icon, Button, Text } from 'native-base';
import { MapApiKey } from "../../../env"
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Theme from '../../styles/Theme';
import AutoCompleteLocation from './AutoCompleteInput'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { CheckBox } from 'react-native-elements'
import { addNewCustomerAddress, updateUserAddress, getAllUserAddress } from '../../actions/map'
import { addLocation } from '../../actions/location'
import { addHomeScreenLocation } from '../../actions/homeScreenLocation'

import { connect } from 'react-redux';
import FeatherIcons from "react-native-vector-icons/Feather"
import AntDesignIcons from "react-native-vector-icons/AntDesign"
import { isPincodeServiceable, } from '../../actions/home'
import { CheckGpsState, CheckPermissions } from '../../utils/utils';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { StackActions } from '@react-navigation/native';
const latitudeDelta = 0.005;
const longitudeDelta = 0.005;

const initialRegion = {
    latitude: -37.78825,
    longitude: -122.4324,
    latitudeDelta,
    longitudeDelta,
}

class AutoCompleteLocationScreen extends React.Component {

    map = null;

    state = {
        region: {
            latitude: null,
            longitude: null,
            latitudeDelta,
            longitudeDelta,
        },
        ready: true,
        filteredMarkers: [],
        address: null,
        latitude: null,
        longitude: null,
        houseNumber: "",
        landMark: "",
        saveAs: "",
        name: "",
        mobileNumber: "",
        addressLoading: false,
        savedAddressLoading: false,
        modalVisible: true,
        homeCheck: false,
        officeCheck: false,
        othersCheck: false,
        // deliverFor: "self",
        mode: "ON_INITIAL",
        pincode: "",
        savedAddress: [],
        mobileNumberErrorText: "",
        nameErrorText: "",
        errorMessage: "",
        errorMessageBanner: false,
        addressId: "",
        pincodeAvailable: false,
        gpsEnabled: true
    };

    async componentDidMount() {
        const { fromScreen, navigateTo } = this.props.route.params;
        CheckPermissions((status) => {
            if (status) {
                this.setState({ gpsEnabled: false })
            } else {
                this.setState({ gpsEnabled: true })
            }
        }, false)
        if (this.props.homeScreenLocation?.pincode == undefined || this.props.homeScreenLocation?.pincode == "") {
            // this.getCurrentPosition();
        } else {
            // const region = {
            //     latitude: this.props.homeScreenLocation?.lat,
            //     longitude: this.props.homeScreenLocation?.lon,
            //     latitudeDelta,
            //     longitudeDelta,
            // };
            // await this.setRegion(region);
            // await this.setState({
            //     modalVisible: false,
            //     address: this.props.homeScreenLocation.addressLine_1,
            //     latitude: this.props.homeScreenLocation.lat,
            //     longitude: this.props.homeScreenLocation.lon,
            //     pincode: this.props.homeScreenLocation.pincode,
            //     pincodeAvailable: true
            // })
            // await this.forceUpdate()
        }
        if (navigateTo == "MapScreenGrabPincode") {
            if (this.props.isAuthenticated) {
                await this.setState({ savedAddressLoading: true, })
                await this.props.getAllUserAddress(async (response, status) => {
                    this.setState({ savedAddressLoading: false })
                    if (status) {
                        let newArray = []
                        await response?.data?.forEach((el, index) => {
                            if (el?.isActive) newArray.push(el)
                        })
                        // Alert.alert(JSON.stringify(response, null, "   "))
                        this.setState({ savedAddress: newArray })

                    } else {
                        // Alert.alert(JSON.stringify(response?.data, null, "   "))
                        this.setState({ savedAddressLoading: false })
                    }
                })
            }
        } else if (fromScreen == "AddNew_SCREEN") {
            if (this.props.isAuthenticated) {
                await this.setState({ savedAddressLoading: true, })
                await this.props.getAllUserAddress(async (response, status) => {
                    this.setState({ savedAddressLoading: false })
                    if (status) {
                        let newArray = []
                        await response?.data?.forEach((el, index) => {
                            if (el?.isActive) newArray.push(el)
                        })
                        // Alert.alert(JSON.stringify(response, null, "   "))
                        this.setState({ savedAddress: newArray })

                    } else {
                        // Alert.alert(JSON.stringify(response?.data, null, "   "))
                        this.setState({ savedAddressLoading: false })
                    }
                })
            }
        }
    }
    onPressTurnOn = () => {
        CheckPermissions((status) => {
            if (status) {
                this.setState({ gpsEnabled: false })
                this.getCurrentPosition()
            } else {
                this.setState({ gpsEnabled: true })
            }
        })
    }
    getCurrentPosition() {
        const { fromScreen, navigateTo, mode, backToCardScreen, backToCheckoutScreen, backToAddressScreen } = this.props.route.params;
        try {
            CheckPermissions((status) => {
                if (status) {
                    this.setState({ gpsEnabled: false })
                    Geolocation.getCurrentPosition(
                        async (position) => {
                            const region = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                latitudeDelta,
                                longitudeDelta,
                            };
                            this.props.navigation.navigate(navigateTo, { regionalPositions: region, fromScreen: fromScreen, backToCardScreen: backToCardScreen, backToCheckoutScreen: backToCheckoutScreen, backToAddressScreen: backToAddressScreen })
                        },
                        (error) => {
                            console.warn(error)
                        },
                        { enableHighAccuracy: false, timeout: 5000 },
                    );
                } else {
                    this.setState({ gpsEnabled: true })
                }
            })
        } catch (e) {
            alert(e.message || "");
        }
    };

    renderSeparator = () => {
        return (
            <View
                style={{ height: 0.7, width: "95%", alignSelf: 'center', backgroundColor: '#EAEAEC', }}
            />
        );
    };

    onPressSavedAddress = async (item) => {
        // Alert.alert(JSON.stringify(item, null, "      "))
        const { fromScreen, navigateTo, mode, } = this.props.route.params;
        if (fromScreen == "AddNew_SCREEN") {
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
            this.props.addLocation(payload)
            this.props.addHomeScreenLocation({
                addressLine_1: item?.addressLine_1,
                lat: item?.lat,
                lon: item?.lon,
                pincode: item?.pincode
            })
            const { fromScreen, navigateTo, mode, backToCardScreen, backToCheckoutScreen } = this.props.route.params;
            this.props.navigation.navigate('MapScreen', { fromScreen: fromScreen, item: item, backToCardScreen: backToCardScreen, backToCheckoutScreen: backToCheckoutScreen })

        } else {
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
            this.props.addLocation(payload)
            this.props.addHomeScreenLocation({
                addressLine_1: item?.addressLine_1,
                lat: item?.lat,
                lon: item?.lon,
                pincode: item?.pincode
            })
            const { fromScreen, navigateTo } = this.props.route.params;
            this.props.navigation.dispatch(StackActions.popToTop());
        }


    }

    render() {
        return (
            <>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{ height: 70, backgroundColor: "white", flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: 75, height: 60, justifyContent: "center", alignItems: "center", marginRight: 5 }}>
                            <Icon name="chevron-small-left" type="Entypo" style={[{ fontSize: 34, color: "black", }]} />
                        </TouchableOpacity>
                        {/* <View style={{ width: 75, height: 60, justifyContent: "center", alignItems: "center" }}>
                                <Icon name="chevron-small-left" type="Entypo" style={[{ fontSize: 32, color: "black", }]} />
                            </View> */}
                        {/* <View style={{ width: 50, height: 50, alignItems: 'center', backgroundColor: "red", justifyContent: "center" }}>
                                <Image
                                    style={{ width: 15, height: 15, }}
                                    source={require('../../assets/png/backIcon.png')}
                                />
                            </View> */}
                        <View style={{}}>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000000", letterSpacing: 0.2 }}>
                                Search for your location
                                </Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, }}>
                        <View style={{ flex: 1, width: ("100%"), alignSelf: "center", backgroundColor: "#F8F8F8", }}>

                            {/* <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: 40, height: 40, justifyContent: 'center', }}>
                                <Icon name="arrow-back" style={{ fontSize: 28, color: "gray", }} />
                            </TouchableOpacity>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>Search for your location</Text>
                            </View> */}
                            <View style={{ position: 'relative', height: 65, marginTop: ("4%") }}>
                                <AutoCompleteLocation
                                    style={{ container: { positition: 'absolute', height: 50 } }}
                                    getLocation={async (data, details = null) => {
                                        console.warn("dsataaaaaaaaaaaaaaaaa", data.description)
                                        await this.setState({
                                            region: {
                                                latitude: details?.geometry?.location?.lat,
                                                longitude: details?.geometry?.location?.lng,
                                                latitudeDelta,
                                                longitudeDelta,
                                            },
                                            address: data.description,
                                        })
                                        let region = {
                                            latitude: details?.geometry?.location?.lat,
                                            longitude: details?.geometry?.location?.lng,
                                            latitudeDelta,
                                            longitudeDelta,
                                        }
                                        const { fromScreen, navigateTo, mode, backToCardScreen, backToCheckoutScreen, backToAddressScreen } = this.props.route.params;
                                        console.warn("navigateTonavigateTo", mode)
                                        this.props.navigation.navigate(navigateTo, { regionalPositions: region, fromScreen: fromScreen, backToCardScreen: backToCardScreen, backToCheckoutScreen: backToCheckoutScreen, backToAddressScreen: backToAddressScreen })
                                    }}
                                    onRequestClose={() => {
                                        this.props.navigation.goBack()
                                    }}

                                />
                                <View style={{ position: "absolute", top: 22, left: 20 }}>
                                    <Icon name="search" style={{ fontSize: 22, color: "gray", }} />
                                </View>
                            </View>
                            <View style={{ zIndex: -1, flex: 1, marginTop: 15 }}>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
                                    <View
                                        style={{ height: 2, width: "10%", alignSelf: 'center', backgroundColor: '#d6cfcf', marginTop: 5, }}
                                    />
                                    <Text style={{ marginLeft: 15, marginRight: 15, color: "gray", fontSize: 14, fontWeight: "bold" }}>OR</Text>
                                    <View
                                        style={{ height: 2, width: "10%", alignSelf: 'center', backgroundColor: '#d6cfcf', marginTop: 5, }}
                                    />
                                </View>
                                {this.state.gpsEnabled ?
                                    <View style={{ backgroundColor: '#6B98DE', marginTop: 30 }}>
                                        <View style={{ flexDirection: 'row', padding: 10 }}>
                                            <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                                <Icon name="crosshairs-gps" type="MaterialCommunityIcons" style={{ fontSize: 24, color: '#ffffff' }} />
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 14, color: '#ffffff', fontWeight: 'bold' }}>Unable to get location</Text>
                                                <Text style={{ fontSize: 12, color: "#ffffff" }}>Turning on Location ensures accurate and hassle-free delivery</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.onPressTurnOn()} style={{ height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', margin: 10, borderRadius: 5 }}>
                                                <Text style={{ fontSize: 14, color: '#6B98DE', marginHorizontal: 10, fontWeight: 'bold' }}>TURN ON</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    <TouchableOpacity onPress={() => {
                                        this.getCurrentPosition()
                                    }} style={{ flexDirection: 'row', width: ("90%"), backgroundColor: "#FFFFFF", alignSelf: "center", borderRadius: 30, justifyContent: "center", marginTop: 30 }}>
                                        <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginLeft: -10 }}>
                                            <Icon name="crosshairs-gps" type="MaterialCommunityIcons" style={{ fontSize: 18, color: "red" }} />
                                        </View>
                                        <View style={{ justifyContent: 'center', }}>
                                            <Text style={{ fontSize: 18, color: "red" }}>Use Current Location</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                {this.state.savedAddressLoading ?
                                    <ActivityIndicator size={"large"} color={Theme.Colors.primary} /> :
                                    <>
                                        {this.state.savedAddress?.length > 0 ?
                                            <>

                                                <Text style={{ fontWeight: 'bold', marginLeft: 8, fontSize: 16, marginBottom: 10, marginTop: 15 }}>Saved Address</Text>
                                            </>
                                            : undefined}
                                        <FlatList
                                            data={this.state.savedAddress}
                                            renderItem={({ item }) =>
                                                <TouchableOpacity onPress={() => { this.onPressSavedAddress(item) }} style={{ flexDirection: 'row', paddingBottom: 10, paddingTop: 5, width: ("95%"), alignSelf: "center" }}>
                                                    {/* <Text style={styles.item}
                                                //   onPress={this.getListViewItem.bind(this, item)}
                                                >{JSON.stringify(item, null, "      ")} </Text> */}
                                                    {item?.saveAs == "Home" &&
                                                        <View style={{ width: 40, height: 50, alignItems: 'center', }}>
                                                            <Icon name="home" type="AntDesign" style={{ fontSize: 24, color: '#232323' }} />
                                                        </View>
                                                    }
                                                    {item?.saveAs == "Office" &&
                                                        <View style={{ width: 40, height: 50, alignItems: 'center', }}>
                                                            <Image
                                                                style={{ width: 30, height: 30, }}
                                                                source={require('../../assets/png/office.png')}
                                                            />
                                                        </View>
                                                        // <View style={{ width: 40, height: 50, alignItems: 'center', }}>
                                                        //     <Icon name="office-building" type="MaterialCommunityIcons" style={{ fontSize: 24, color: '#232323' }} />
                                                        // </View>
                                                    }

                                                    {item?.saveAs == "Others" &&
                                                        <View style={{ width: 40, height: 50, alignItems: 'center', }}>
                                                            <Icon name="location-pin" type="SimpleLineIcons" style={{ fontSize: 24, color: '#232323' }} />
                                                        </View>
                                                    }
                                                    <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            {item?.saveAs == "Home" &&
                                                                // <View style={{ backgroundColor: "#FEF8FC", borderWidth: 1, borderRadius: 4, borderColor: "#FCD8EC", paddingVertical: 3, marginRight: 5 }}>
                                                                //     <Text style={{ color: "#F464AD", fontSize: 12, marginHorizontal: 5 }}>Home</Text>
                                                                // </View>
                                                                <View style={{}}>
                                                                    <Text style={{ color: "black", fontSize: 14, fontWeight: "bold" }}>Home</Text>
                                                                </View>

                                                            }
                                                            {item?.saveAs == "Office" &&
                                                                <View style={{}}>
                                                                    <Text style={{ color: "black", fontSize: 14, fontWeight: "bold" }}>Office</Text>
                                                                </View>
                                                                // <View style={{ backgroundColor: "#FCF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#F0D4FA", paddingVertical: 3,  }}>
                                                                //     <Text style={{ color: "#CD64F4", fontSize: 12, marginHorizontal: 5 }}>Office</Text>
                                                                // </View>
                                                            }
                                                            {item?.saveAs == "Others" &&
                                                                <View style={{}}>
                                                                    <Text style={{ color: "black", fontSize: 14, fontWeight: "bold" }}>Others</Text>
                                                                </View>
                                                                // <View style={{ backgroundColor: "#EDF5FF", borderWidth: 1, borderRadius: 4, borderColor: "#BEDCFF", paddingVertical: 3, marginRight: 5 }}>
                                                                //     <Text style={{ color: "#64A6F4", fontSize: 12, marginHorizontal: 5 }}>Others</Text>
                                                                // </View>
                                                            }
                                                            {/* <Text style={{ fontSize: 14, fontWeight: 'bold', }}>{item?.recepientName} </Text> */}
                                                        </View>
                                                        <Text numberOfLines={2} style={{ color: "#909090", fontSize: 13, marginTop: 5 }}>{item?.addressLine_1} </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }
                                            ItemSeparatorComponent={this.renderSeparator}
                                            keyExtractor={item => item?.id.toString()}
                                        /></>
                                }

                            </View>
                        </View>
                    </View>
                    {/* <ScrollView contentContainerStyle={{ backgroundColor: 'red', marginTop: 50, flex: 1 }}>
                                <Text>{JSON.stringify(this.state.savedAddress, null, "   ")} </Text>
                            </ScrollView> */}
                </SafeAreaView >
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    userLocation: state.location,
    homeScreenLocation: state.homeScreenLocation,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { isPincodeServiceable, addHomeScreenLocation, addNewCustomerAddress, getAllUserAddress, updateUserAddress, addLocation, addHomeScreenLocation })(AutoCompleteLocationScreen)

const styles = StyleSheet.create({
    map: {
        height: "70%"
    },
    // markerFixed: {
    //     left: '50%',
    //     marginLeft: -24,
    //     marginTop: -35,
    //     position: 'absolute',
    //     top: '50%',
    // },
    markerFixed: {
        left: '50%',
        marginLeft: -49,
        marginTop: -50,
        position: 'absolute',
        top: '50%',
    },
    // marker: {
    //     height: 48,
    //     width: 48
    // },
    marker: {
        height: 100,
        width: 100
    },
    footer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: 0,
        position: 'absolute',
        width: '100%'
    },
    region: {
        color: '#fff',
        lineHeight: 20,
        margin: 20
    },
    getcurrentlocation: {
        backgroundColor: "white",
        flexDirection: 'row',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        position: 'absolute',
        bottom: 10,
        right: 10
    }
})


