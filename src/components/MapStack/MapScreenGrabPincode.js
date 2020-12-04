import React from 'react';
import { Alert, Platform, StyleSheet, FlatList, Image, SafeAreaView, Modal, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView, ActivityIndicator } from 'react-native';
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

const latitudeDelta = 0.005;
const longitudeDelta = 0.005;

const initialRegion = {
    latitude: -37.78825,
    longitude: -122.4324,
    latitudeDelta,
    longitudeDelta,
}

class MapScreenGrabPincode extends React.Component {

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
        addressId: ""
    };


    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => this.map.animateToRegion(region), 10);
        }
        //this.setState({ region });
    }


    async componentDidMount() {
        this.getCurrentPosition();
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

    getCurrentPosition() {
        try {
            Geolocation.getCurrentPosition(
                async (position) => {
                    // alert(JSON.stringify(position, null, "      "))
                    const region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta,
                        longitudeDelta,
                    };
                    await this.setRegion(region);

                    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + MapApiKey)
                        .then((response) => {
                            response.json().then(async (json) => {
                                let postal_code = json?.results?.[0]?.address_components?.find(o => JSON.stringify(o.types) == JSON.stringify(["postal_code"]));
                                await this.setLocation(json?.results?.[0]?.formatted_address, position.coords.latitude, position.coords.longitude, postal_code?.long_name)
                            });
                        }).catch((err) => {
                            console.warn(err)
                        })
                },
                (error) => {
                    //TODO: better design
                    // switch (error.code) {
                    //     case 1:
                    //         if (Platform.OS === "ios") {
                    //             Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Privacidad - Localización");
                    //         } else {
                    //             Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Apps - ExampleApp - Localización");
                    //         }
                    //         break;
                    //     default:
                    //         Alert.alert("", "Error al detectar tu locación");
                    // }
                }
            );

        } catch (e) {
            alert(e.message || "");
        }
    };

    getCurrentLocation = async () => {
        await this.setState({ addressLoading: true, errorMessage: "" })
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.region.latitude + ',' + this.state.region.longitude + '&key=' + MapApiKey)
            .then((response) => {
                response.json().then(async (json) => {
                    // console.warn(json)
                    let postal_code = json?.results?.[0]?.address_components?.find(o => JSON.stringify(o.types) == JSON.stringify(["postal_code"]));
                    // alert(JSON.stringify(json?.results?.[1]?.address_components?.find(el => el.types.find(o => o == "political")), null, "  "))
                    await this.setLocation(json?.results?.[0]?.formatted_address, this.state.region.latitude, this.state.region.longitude, postal_code?.long_name)
                    await this.setState({ addressLoading: false })
                });
            }).catch(async (err) => {
                console.warn(err)
                await this.setState({ addressLoading: false })
            })
    }

    setLocation = async (address, latitude, longitude, postal_code) => {
        this.setState({
            address: address ? address : "",
            latitude: latitude ? latitude : "",
            longitude: longitude ? longitude : "",
            pincode: postal_code ? postal_code : ""
        })
    }


    onMapReady = (e) => {
        if (!this.state.ready) {
            this.setState({ ready: true });
        }
    };


    onRegionChange = async (region) => {
        // await this.setState({
        //     region
        // })
    };

    onRegionChangeComplete = async (region) => {
        this.setState({ errorMessageBanner: false })
        await this.setState({
            region: region
        })
        await this.getCurrentLocation()
    };


    onSubmit = async () => {
        await this.props.addHomeScreenLocation({
            "addressLine_1": this.state.address,
            "pincode": this.state.pincode,
            "lat": this.state.latitude,
            "lon": this.state.longitude,
        })
        await this.props.isPincodeServiceable(this.state.pincode, (res, status) => {
            if (status) {
                this.props.navigation.goBack()
            } else {
                this.setState({ errorMessageBanner: true })
            }
        })
    }



    renderSeparator = () => {
        return (
            <View
                style={{ height: 0.7, width: "95%", alignSelf: 'center', backgroundColor: '#EAEAEC', }}
            />
        );
    };

    onPressSavedAddress = async (item) => {
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
        this.props.addLocation(payload)
        this.props.addHomeScreenLocation({
            addressLine_1: item?.addressLine_1,
            lat: item?.lat,
            lon: item?.lon,
            pincode: item?.pincode
        })
        this.props.navigation.goBack()
    }

    render() {

        const { region } = this.state;
        const { children, renderMarker, markers, navigation } = this.props;

        return (
            <>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} behavior={Platform.OS == "ios" ? "padding" : null}>
                        {this.state.errorMessageBanner &&
                            <View style={{ width: "100%", padding: 10, backgroundColor: "#F65C65", position: 'absolute', top: 0, left: 0, zIndex: 1, flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <FeatherIcons name="info" color={'white'} size={18} />
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: 'white' }}>We might be not available in all the locations. We are expanding, very soon we will be delivered in all location.</Text>
                                </View>
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.setState({ errorMessageBanner: false }) }}>
                                    <AntDesignIcons name="close" color={'white'} size={18} />
                                </TouchableOpacity>
                            </View>}
                        <View style={styles.map}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, justifyContent: 'center', position: "absolute", zIndex: 1, left: 10, top: 10 }}>
                                <Image
                                    style={{ width: 20, height: 20, }}
                                    resizeMode="contain"
                                    source={require('../../assets/png/backIcon.png')}
                                />
                            </TouchableOpacity>
                            <MapView
                                showsUserLocation
                                ref={map => { this.map = map }}
                                data={markers}
                                initialRegion={initialRegion}
                                onMapReady={this.onMapReady}
                                showsMyLocationButton={true}
                                onRegionChange={this.onRegionChange}
                                onRegionChangeComplete={this.onRegionChangeComplete}
                                style={StyleSheet.absoluteFill}
                                textStyle={{ color: '#bc8b00' }}
                                containerStyle={{ backgroundColor: 'white', borderColor: '#BC8B00' }}>
                                {children && children || null}
                            </MapView>
                            <View style={styles.markerFixed}>
                                {/* <Image style={styles.marker} source={marker} /> */}
                                <LottieView
                                    style={styles.marker}
                                    source={require("../../assets/animations/favoriteDoctorHeart.json")}
                                    autoPlay
                                />
                            </View>
                            <TouchableOpacity onPress={() => this.getCurrentPosition()} style={styles.getcurrentlocation} activeOpacity={0.6}>
                                <Icon name='gps-fixed' type="MaterialIcons" style={{ color: '#979197', fontSize: 20 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "100%", height: 3, overflow: "hidden" }}>
                            {this.state.addressLoading ?
                                <LottieView
                                    style={{ width: "100%", }}
                                    source={require("../../assets/animations/lineLoading.json")}
                                    autoPlay
                                />
                                :
                                null
                            }
                        </View>
                        <ScrollView
                            // ref='_scrollView' 
                            contentContainerStyle={{ zIndex: 1 }}
                            showsVerticalScrollIndicator={true}>
                            <View style={{ flex: 1, width: "90%", alignSelf: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ color: "#727272", fontSize: 12 }}>Your current location</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { this.setState({ modalVisible: true }) }} style={{ padding: 5 }}>
                                        <Text style={{ color: Theme.Colors.primary }}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                                {this.state.addressLoading ?
                                    <View style={{ flexDirection: "row" }}>
                                        <Image
                                            style={{ width: 30, height: 30, marginLeft: -5 }}
                                            source={require('../../assets/png/locationIcon.png')}
                                        />
                                        <Text style={{ fontWeight: "bold" }}>Locating...</Text>
                                    </View>
                                    :
                                    <View style={{ flexDirection: "row" }}>
                                        <Image
                                            style={{ width: 30, height: 30, marginLeft: -5 }}
                                            source={require('../../assets/png/locationIcon.png')}
                                        />
                                        <Text style={{ fontSize: 16 }}>{this.state.address}</Text>
                                    </View>
                                }
                            </View>
                        </ScrollView>
                        <Button full style={{ backgroundColor: Theme.Colors.primary, }} onPress={() => this.onSubmit()}><Text style={{ textTransform: 'capitalize' }}>Confirm Location</Text></Button>
                    </KeyboardAvoidingView>
                    {/* <SafeAreaView style={styles.footer}>
                        <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text>
                    </SafeAreaView> */}
                </TouchableWithoutFeedback>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}>
                    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                        <View flex={1}>
                            <View style={{ position: 'relative', height: 65 }}>
                                <AutoCompleteLocation
                                    style={{ container: { positition: 'absolute', height: 50 } }}
                                    getLocation={async (data, details = null) => { // 'details' is provided when fetchDetails = true
                                        // await setLocation(data.description, details?.geometry?.location?.lat, details?.geometry?.location?.lng)
                                        this.setState({ modalVisible: false })
                                        // await this.setState({
                                        //     address: data.description,
                                        //     latitude: details?.geometry?.location?.lat,
                                        //     longitude: details?.geometry?.location?.lng,
                                        // })
                                        await this.setState({
                                            region: {
                                                latitude: details?.geometry?.location?.lat,
                                                longitude: details?.geometry?.location?.lng,
                                                latitudeDelta,
                                                longitudeDelta,
                                            },
                                            address: data.description,
                                        })
                                        await this.getCurrentLocation()
                                        await this.map.animateToRegion(this.state.region), 100
                                    }}
                                    onRequestClose={() => {
                                        this.setState({ modalVisible: false })
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1, zIndex: -1 }}>
                                <View style={{ backgroundColor: 'white', flex: 1 }}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({ modalVisible: false })
                                        this.getCurrentPosition()
                                    }} style={{ flexDirection: 'row' }}>
                                        <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                            <Icon name="crosshairs-gps" type="MaterialCommunityIcons" style={{ fontSize: 24, color: '#232323' }} />
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 14, }}>Current Location</Text>
                                            <Text style={{ fontSize: 12, color: "#727272" }}>Using GPS</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View
                                        style={{ height: 0.7, width: "95%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 10, marginTop: 5 }}
                                    />

                                    {this.state.savedAddressLoading ?
                                        <ActivityIndicator size={"large"} color={Theme.Colors.primary} /> :
                                        <>
                                            {this.state.savedAddress?.length > 0 ?
                                                <Text style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 14, marginBottom: 10 }}>Saved Address</Text>
                                                : undefined}
                                            <FlatList
                                                data={this.state.savedAddress}
                                                renderItem={({ item }) =>
                                                    <TouchableOpacity onPress={() => { this.onPressSavedAddress(item) }} style={{ flexDirection: 'row', paddingBottom: 10, paddingTop: 5 }}>
                                                        {/* <Text style={styles.item}
                                                //   onPress={this.getListViewItem.bind(this, item)}
                                                >{JSON.stringify(item, null, "      ")}</Text> */}
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
                                                                <Text style={{ fontSize: 14, fontWeight: 'bold', }}>{item?.recepientName}</Text>
                                                            </View>
                                                            <Text numberOfLines={2} style={{ color: "#909090", fontSize: 13, marginTop: 5 }}>{item?.addressLine_1}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                                ItemSeparatorComponent={this.renderSeparator}
                                                keyExtractor={item => item?.id.toString()}
                                            /></>}
                                </View>
                            </View>
                        </View>


                        {/* <ScrollView contentContainerStyle={{ backgroundColor: 'red', marginTop: 50, flex: 1 }}>
                                <Text>{JSON.stringify(this.state.savedAddress, null, "   ")}</Text>
                            </ScrollView> */}
                    </SafeAreaView>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    userLocation: state.location
})


export default connect(mapStateToProps, { isPincodeServiceable, addHomeScreenLocation, addNewCustomerAddress, getAllUserAddress, updateUserAddress, addLocation, addHomeScreenLocation })(MapScreenGrabPincode)

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


