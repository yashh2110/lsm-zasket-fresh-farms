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
import { connect } from 'react-redux';
import FeatherIcons from "react-native-vector-icons/Feather"
import AntDesignIcons from "react-native-vector-icons/AntDesign"
import { addHomeScreenLocation } from '../../actions/homeScreenLocation'
import { CheckGpsState, CheckPermissions } from '../../utils/utils';

const latitudeDelta = 0.005;
const longitudeDelta = 0.005;

const initialRegion = {
    latitude: -37.78825,
    longitude: -122.4324,
    latitudeDelta,
    longitudeDelta,
}

class MyMapView extends React.Component {

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
        alternateMobileNumber: "",
        addressLoading: false,
        savedAddressLoading: false,
        modalVisible: false,
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
        gpsEnabled: false,
        movetoadjust: false,
        scrollEnable: false
    };


    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => this.map.animateToRegion(region), 10);
        }
        //this.setState({ region });
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.initialFunction()
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    async initialFunction() {
        CheckGpsState((status) => {
            if (status) {
                this.setState({ gpsEnabled: false })
            } else {
                this.setState({ gpsEnabled: true })
            }
        }, false)
        const { fromScreen, regionalPositions, backToCardScreen } = this.props.route?.params;
        await this.setState({ mode: fromScreen })
        if (this.state.mode == "EDIT_SCREEN") {
            await this.setState({ scrollEnable: false })
        } else {
            await this.setState({ scrollEnable: true })
        }
        if (fromScreen == "EDIT_SCREEN" && regionalPositions == null) {
            await this.setState({ modalVisible: false })
            const { item } = this.props.route?.params;
            // alert(JSON.stringify(item, null, "        "))
            const region = {
                latitude: item?.lat,
                longitude: item?.lon,
                latitudeDelta,
                longitudeDelta,
            };
            await this.setRegion(region);
            if (item?.saveAs == "Home") this.setState({ homeCheck: true })
            if (item?.saveAs == "Office") this.setState({ officeCheck: true })
            if (item?.saveAs == "Others") this.setState({ othersCheck: true })
            await this.setState({
                addressId: item?.id,
                saveAs: item?.saveAs,
                pincode: item?.pincode,
                landMark: item?.landmark,
                name: item?.recepientName,
                mobileNumber: item?.recepientMobileNumber.replace("+91", ""),
                houseNumber: item?.houseNo,
                alternateMobileNumber: item?.alternateMobileNumber ? item?.alternateMobileNumber.replace("+91", "") : "",
            })
        } else {
            this.setState({ homeCheck: true, saveAs: 'Home' })
            let userDetails = await AsyncStorage.getItem('userDetails');
            let parsedUserDetails = await JSON.parse(userDetails);
            await this.setState({
                name: parsedUserDetails?.customerDetails?.name,
                mobileNumber: parsedUserDetails?.customerDetails?.userMobileNumber.replace("+91", "")
            })
            if (regionalPositions == null) {
                // this.getCurrentPosition();
                const region = {
                    latitude: this.props.homeScreenLocation?.lat,
                    longitude: this.props.homeScreenLocation?.lon,
                    latitudeDelta,
                    longitudeDelta,
                };
                await this.setRegion(region);
                await this.setState({
                    modalVisible: false,
                    address: this.props.homeScreenLocation.addressLine_1,
                    latitude: this.props.homeScreenLocation.lat,
                    longitude: this.props.homeScreenLocation.lon,
                    pincode: this.props.homeScreenLocation.pincode,
                })
            } else {
                await this.setRegion(regionalPositions);
            }
        }
    }

    getCurrentPosition() {
        try {
            CheckPermissions((status) => {
                if (status) {
                    this.setState({ gpsEnabled: false })
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

    getCurrentLocation = async () => {
        await this.setState({ addressLoading: true, errorMessage: "", movetoadjust: true })
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.region.latitude + ',' + this.state.region.longitude + '&key=' + MapApiKey)
            .then((response) => {
                response.json().then(async (json) => {
                    // console.warn(json)
                    let postal_code = json?.results?.[0]?.address_components?.find(o => JSON.stringify(o.types) == JSON.stringify(["postal_code"]));
                    // alert(JSON.stringify(postal_code, null, "  "))
                    await this.setLocation(json?.results?.[0]?.formatted_address, this.state.region.latitude, this.state.region.longitude, postal_code?.long_name)
                    await this.setState({ addressLoading: false })
                });
            }).catch(async (err) => {
                console.warn(err)
                await this.setState({ addressLoading: false, movetoadjust: false })
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
        await this.setState({
            region: region
        })
        await this.getCurrentLocation()
    };

    validate = () => {
        let status = true

        // if (this.state.name == undefined || this.state.name.trim() == "") {
        //     this.setState({ nameErrorText: "Name is required" })
        //     status = false
        // }
        if (this.state.mobileNumber == undefined || this.state.mobileNumber.trim() == "") {
            this.setState({ mobileNumberErrorText: "Mobile number is required" })
            status = false
        }

        return status
    }

    onSubmit = async () => {
        if (this.validate()) {
            await this.setState({ loading: true })
            let payload;
            payload = {
                "addressLine1": this.state.address,
                "houseNo": this.state.houseNumber,
                "pincode": this.state.pincode,
                "isActive": true,
                "landmark": this.state.landMark,
                "lat": this.state.latitude,
                "lon": this.state.longitude,
                "recepientMobileNumber": this.state.mobileNumber.includes("+91") ? this.state.mobileNumber : "+91" + this.state.mobileNumber,
                "alternateMobileNumber": this.state.alternateMobileNumber.includes("+91") ? this.state.alternateMobileNumber : "+91" + this.state.alternateMobileNumber,
                "recepientName": this.state.name,
                "saveAs": this.state.saveAs
            }
            // console.warn(payload)
            const { fromScreen } = this.props.route?.params;
            await this.setState({ mode: fromScreen })
            if (fromScreen == "EDIT_SCREEN") {
                await this.props.updateUserAddress(this.state.addressId, payload, async (response, status) => {
                    if (status) {
                        // alert(JSON.stringify(payload, null, "       "))
                        // this.props.addLocation(payload)
                        this.props.getAllUserAddress(async (response, status) => { })
                        this.props.navigation.goBack()
                    } else {
                        if (__DEV__) {
                            alert(JSON.stringify(response?.data, null, "      "))
                        }
                        this.setState({ errorMessage: response?.data })
                        if (response?.data == "Cannot update address to not serviceable area") {
                            this.setState({ errorMessageBanner: true })
                            await this.setState({ loading: false })
                        }
                    }
                })
            } else {
                await this.props.addNewCustomerAddress(payload, async (response, status) => {
                    if (status) {
                        const { fromScreen, regionalPositions, backToCardScreen, backToCheckoutScreen, backToAddressScreen } = this.props.route?.params;
                        // alert(JSON.stringify(response.data, null, "       "))
                        let location = {
                            "id": response?.data?.id,
                            "addressLine_1": response?.data?.addressLine_1,
                            "pincode": response?.data?.pincode,
                            "isActive": true,
                            "landmark": response?.data?.landmark,
                            "lat": response?.data?.lat,
                            "lon": response?.data?.lon,
                            "recepientMobileNumber": response?.data?.recepientMobileNumber,
                            "recepientName": response?.data?.recepientName,
                            "saveAs": response?.data?.saveAs,
                            "houseNo": response?.data?.houseNo

                        }

                        this.props.addLocation(location)
                        this.props.addHomeScreenLocation({
                            "addressLine_1": response?.data?.addressLine_1,
                            "pincode": response?.data?.pincode,
                            "lat": response?.data?.lat,
                            "lon": response?.data?.lon,
                        })
                        // await AsyncStorage.setItem("location", JSON.stringify(location));
                        this.setState({ loading: false })
                        if (this.state.mode === "ON_INITIAL") {
                            this.props.navigation.navigate('SetAuthContext', { userLocation: location }) // if you send it as null it wont navigate
                        } else if (backToCardScreen == "CartScreen") {
                            this.props.navigation.navigate('CartScreen')
                        } else if (backToCheckoutScreen == "CheckoutScreen") {
                            this.props.navigation.navigate('CheckoutScreen')
                        } else if (backToAddressScreen == "ManageAddressScreen") {
                            this.props.navigation.navigate('ManageAddressScreen')

                        }
                        else {
                            this.props.navigation.goBack()
                            this.props.getAllUserAddress(async (response, status) => { })
                        }
                    } else {
                        if (__DEV__) {
                            alert(JSON.stringify(response?.data, null, "      "))
                        }
                        this.setState({ errorMessage: response?.data })
                        if (response?.data == "Your location is not serviceable") {
                            this.setState({ errorMessageBanner: true, mode: "EDIT_SCREEN" })
                        }
                        // this.refs._scrollView.scrollTo(0);
                        this.setState({ loading: false })
                    }
                })
            }

        }
    }

    OnConfirmLocation = async () => {
        await this.setState({ loading: true })
        let payload;
        payload = {
            "addressLine1": this.state.address,
            "houseNo": this.state.houseNumber,
            "pincode": this.state.pincode,
            "isActive": true,
            "landmark": this.state.landMark,
            "lat": this.state.latitude,
            "lon": this.state.longitude,
            "recepientMobileNumber": this.state.mobileNumber.includes("+91") ? this.state.mobileNumber : "+91" + this.state.mobileNumber,
            "alternateMobileNumber": this.state.alternateMobileNumber.includes("+91") ? this.state.alternateMobileNumber : "+91" + this.state.alternateMobileNumber,
            "recepientName": this.state.name,
            "saveAs": this.state.saveAs
        }
        // console.warn(payload)
        const { fromScreen } = this.props.route?.params;
        if (fromScreen == "EDIT_SCREEN") {
            await this.props.updateUserAddress(this.state.addressId, payload, async (response, status) => {
                if (status) {
                    // alert()
                    await this.setState({ mode: "EDIT_SCREEN", scrollEnable: false, errorMessageBanner: false })
                    // this.props.getAllUserAddress(async (response, status) => { })
                    // this.props.navigation.goBack()
                } else {
                    if (__DEV__) {
                        alert(JSON.stringify(response?.data, null, "      "))
                    }
                    this.setState({ errorMessage: response?.data })
                    if (response?.data == "Cannot update address to not serviceable area") {
                        await this.setState({ mode: "AddNew_SCREEN", scrollEnable: true, errorMessageBanner: false })
                        this.setState({ errorMessageBanner: true })
                        await this.setState({ loading: false })
                    }
                }
            })
        } else {
            await this.props.addNewCustomerAddress(payload, async (response, status) => {
                if (status) {
                    const { fromScreen, regionalPositions, backToCardScreen, backToCheckoutScreen, backToAddressScreen } = this.props.route?.params;
                    // Alert.alert(JSON.stringify(response, null, "   "))

                    let location = {
                        "id": response?.data?.id,
                        "addressLine_1": response?.data?.addressLine_1,
                        "pincode": response?.data?.pincode,
                        "isActive": true,
                        "landmark": response?.data?.landMark,
                        "lat": response?.data?.lat,
                        "lon": response?.data?.lon,
                        "recepientMobileNumber": response?.data?.recepientMobileNumber,
                        "recepientName": response?.data?.recepientName,
                        "saveAs": response?.data?.saveAs
                    }

                    this.props.addLocation(location)
                    this.props.addHomeScreenLocation({
                        "addressLine_1": response?.data?.addressLine_1,
                        "pincode": response?.data?.pincode,
                        "lat": response?.data?.lat,
                        "lon": response?.data?.lon,
                    })
                    // await AsyncStorage.setItem("location", JSON.stringify(location));
                    this.setState({ loading: false })
                    await this.setState({ mode: "EDIT_SCREEN", scrollEnable: false, errorMessageBanner: false })

                } else {

                    if (__DEV__) {
                        alert(JSON.stringify(response?.data, null, "      "))
                    }
                    this.setState({ errorMessage: response?.data })
                    if (response?.data == "Your location is not serviceable") {
                        await this.setState({ mode: "AddNew_SCREEN", scrollEnable: true, errorMessageBanner: false })
                        this.setState({ errorMessageBanner: true, })
                    }
                    // this.refs._scrollView.scrollTo(0);
                    this.setState({ loading: false })
                }
            })
        }
    }

    OnPressEditOnmap = async () => {
        await this.setState({ mode: "AddNew_SCREEN", scrollEnable: true, errorMessageBanner: false })
    }

    onPressCheckbox = (option) => {
        if (option === "homeCheck") {
            this.setState({
                homeCheck: true,
                officeCheck: false,
                othersCheck: false,
                saveAs: "Home"
            })
        }
        if (option === "officeCheck") {
            this.setState({
                homeCheck: false,
                officeCheck: true,
                othersCheck: false,
                saveAs: "Office"
            })
        }
        if (option === "othersCheck") {
            this.setState({
                homeCheck: false,
                officeCheck: false,
                othersCheck: true,
                saveAs: "Others"
            })
        }
    }

    // onPressDeliverFor = (option) => {
    //     if (option === "self") {
    //         this.setState({
    //             deliverFor: "self"
    //         })
    //     }
    //     if (option === "others") {
    //         this.setState({
    //             deliverFor: "others"
    //         })
    //     }
    // }

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
        if (this.state.mode === "ON_INITIAL") {
            this.props.navigation.navigate('SetAuthContext', { userLocation: payload }) // if you send it as null it wont navigate
        } else {
            this.props.navigation.goBack()
        }
    }


    render() {
        const { fromScreen, regionalPositions } = this.props.route?.params;
        const { region } = this.state;
        const { children, renderMarker, markers, navigation } = this.props;
        const { item } = this.props.route?.params;
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
                            </View>
                        }
                        <View style={[styles.map, this.state.mode == "EDIT_SCREEN" ? { height: ("50%") } : null]}>
                            {!this.state.errorMessageBanner &&
                                <View style={{ zIndex: 1, height: 60, backgroundColor: "white" }}>
                                    {
                                        this.state.mode == "EDIT_SCREEN" ?
                                            <>
                                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, justifyContent: 'center', position: "absolute", zIndex: 1, left: 10, top: 10 }}>
                                                    <Icon name="chevron-small-left" type="Entypo" style={[{ fontSize: 32, color: "black", }]} />
                                                </TouchableOpacity>
                                                <View style={{ zIndex: 1, left: 50, top: 17 }}>
                                                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#242A40" }}>Add address details</Text>
                                                </View>
                                            </>
                                            :
                                            <>
                                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, justifyContent: 'center', position: "absolute", zIndex: 1, left: 10, top: 10 }}>
                                                    <Icon name="chevron-small-left" type="Entypo" style={[{ fontSize: 32, color: "black", }]} />
                                                </TouchableOpacity>
                                                <View style={{ zIndex: 1, left: 50, top: 17 }}>
                                                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#242A40" }}>Edit location</Text>
                                                </View>
                                            </>
                                    }
                                </View>
                            }
                            <MapView
                                // pitchEnabled={false}
                                // rotateEnabled={false}
                                // zoomEnabled={false}
                                scrollEnabled={this.state.scrollEnable}
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
                                {/* <View style={{ backgroundColor: 'black', alignSelf: 'center', marginLeft: -50, width: 215, padding: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: -40, marginBottom: -15 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Order will be delivered here</Text>
                                    <Text style={{ color: 'white', fontSize: 12 }}>Place the pin accurately on the map</Text>
                                </View> */}
                                {this.state.addressLoading ?
                                    <View style={{ backgroundColor: '#202741', alignSelf: 'center', marginLeft: -125, width: 345, padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: -55, marginBottom: -28 }}>
                                        <Text style={{ color: '#9BA2BC', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.2 }}>Selected location</Text>
                                        <Text style={{ fontWeight: "bold", color: "#EFF4F6" }}>Locating...</Text>
                                    </View>
                                    :
                                    <View style={{ backgroundColor: '#202741', alignSelf: 'center', marginLeft: -125, width: 345, padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: -55, marginBottom: -28 }}>
                                        {this.state.address ?
                                            <>
                                                <Text style={{ color: '#9BA2BC', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.2 }}>Selected location</Text>
                                                <Text numberOfLines={2} style={{ color: '#EFF4F6', fontSize: 14 }}>{this.state.address}</Text>
                                            </>
                                            :
                                            <>
                                                <Text style={{ color: '#9BA2BC', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.2 }}>Selected location</Text>
                                                <Text style={{ fontWeight: "bold", color: "#EFF4F6" }}>Locating...</Text>
                                            </>
                                        }
                                    </View>
                                }
                                {
                                    this.state.mode == "EDIT_SCREEN" ?
                                        <>
                                            <LottieView
                                                style={styles.marker}
                                                source={require("../../assets/animations/favoriteDoctorHeart.json")}
                                                autoPlay={false}
                                            />
                                        </>
                                        :
                                        <LottieView
                                            style={styles.marker}
                                            source={require("../../assets/animations/favoriteDoctorHeart.json")}
                                            autoPlay
                                        />

                                }
                            </View>
                            {
                                this.state.mode == "EDIT_SCREEN" ?
                                    <TouchableOpacity onPress={() => this.OnPressEditOnmap()} style={styles.editonmap} activeOpacity={0.6}>
                                        <View style={{ flexDirection: "row", }}>
                                            {/* <View style={{}}>
                                                <Image
                                                    style={{ width: 26, height: 26, }}
                                                    source={require('../../assets/png/locationIcon.png')}
                                                />
                                            </View> */}
                                            <View style={{}}>
                                                <Text style={{ textAlign: "center", color: "red", letterSpacing: 0.2, fontWeight: "bold" }}>Edit on map</Text>
                                            </View>
                                            {/* <View style={{}}>
                                                <Icon name="chevron-forward-outline" style={{ fontSize: 24, color: "gray", }}></Icon>
                                            </View> */}
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.getCurrentPosition()} style={styles.getcurrentlocation} activeOpacity={0.6}>
                                        <Icon name='gps-fixed' type="MaterialIcons" style={{ color: 'red', fontSize: 22 }} />
                                    </TouchableOpacity>

                            }
                        </View>
                        {
                            this.state.mode == "AddNew_SCREEN" &&
                            <>
                                {
                                    this.state.movetoadjust && this.state.addressLoading == false ?
                                        <>
                                            <View style={{
                                                bottom: '12%',
                                                left: '22%',
                                                position: 'absolute',
                                                zIndex: 1
                                            }}>
                                                <View style={{ backgroundColor: '#6B6B6B', alignSelf: 'center', width: 200, padding: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center', }}>
                                                    <Text style={{ color: '#ffffff', fontSize: 14, letterSpacing: 0.2 }}>Move the pin to adjust</Text>
                                                </View>
                                            </View>

                                        </>
                                        :
                                        null
                                }
                            </>
                        }
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

                        {
                            this.state.mode == "EDIT_SCREEN" &&
                            <ScrollView
                                // ref='_scrollView' 
                                contentContainerStyle={{ zIndex: 1 }}
                                showsVerticalScrollIndicator={true}>
                                {/* {this.state.gpsEnabled ?
                                <View style={{ backgroundColor: '#6B98DE' }}>
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
                                : null} */}

                                <View style={{ flex: 1, width: "90%", alignSelf: 'center' }}>
                                    {/* <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ color: "#727272", fontSize: 12 }}>Your current location</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { navigation.navigate('AutoCompleteLocationScreen', { fromScreen: 'OnBoardScreen', navigateTo: 'MapScreen' }) }} style={{ padding: 5 }}>
                                        <Text style={{ color: Theme.Colors.primary }}>Change</Text>
                                    </TouchableOpacity>
                                </View> */}
                                    {/* {this.state.addressLoading ?
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
                                        <Text style={{ fontSize: 16 }}>{this.state.address} </Text>
                                    </View>
                                } */}
                                    {/* <View style={{ borderRadius: 5, borderColor: "#ECE1D6", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#FFFCF5', borderWidth: 1, marginTop: 10 }}>
                                    <Text style={{ color: '#8e6847', fontSize: 14 }}>A detailed address will help our delivery executive reach your doorstep easily</Text>
                                </View> */}
                                    {/* <Text style={{ color: "red", fontSize: 12, marginTop: 5, fontWeight: 'bold' }}>{this.state.errorMessage} </Text> */}
                                    {/* <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold' }}>Delivering for?</Text>
                            <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: 5, }}>
                                <TouchableOpacity onPress={() => this.onPressDeliverFor('self')} style={{ justifyContent: 'center', borderColor: this.state.deliverFor == "self" ? Theme.Colors.primary : "#EFEFEF", borderWidth: 2, borderRadius: 6, justifyContent: 'center', alignItems: 'center', width: "40%", padding: 15 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Self</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onPressDeliverFor('others')} style={{ justifyContent: 'center', borderColor: this.state.deliverFor == "others" ? Theme.Colors.primary : "#EFEFEF", borderWidth: 2, borderRadius: 6, justifyContent: 'center', alignItems: 'center', width: "40%", padding: 15 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Others</Text>
                                </TouchableOpacity>
                            </View> */}
                                    <>
                                        {/* <View style={{ marginTop: 10 }}>
                                            <TextInput
                                                style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
                                                onChangeText={text => this.setState({
                                                    name: text
                                                })}
                                                placeholder="Name"
                                                placeholderTextColor="#727272"
                                                value={this.state.name}
                                                onTouchStart={() => {
                                                    this.setState({ nameErrorText: "" })
                                                }}
                                            />
                                            {this.state.nameErrorText ?
                                                <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>{this.state.nameErrorText} </Text>
                                                : undefined}
                                        </View> */}
                                        <View style={{ marginTop: 8 }}>
                                            <Text style={{ color: "#727272", fontSize: 12 }}>Phone Number</Text>
                                            <View style={{ borderBottomColor: '#D8D8D8', flexDirection: 'row', borderBottomWidth: 1 }}>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 16 }}>+91</Text>
                                                </View>
                                                <View style={{ backgroundColor: "grey", width: 0.5, margin: 13 }} />
                                                <View style={{ flex: 1 }}>
                                                    <TextInput
                                                        style={{ height: 40, color: "black", fontWeight: "bold" }}
                                                        onChangeText={text => this.setState({
                                                            mobileNumber: text
                                                        })}
                                                        placeholder="Phone Number"
                                                        placeholderTextColor="#cccccc"
                                                        value={this.state.mobileNumber}
                                                        keyboardType={"number-pad"}
                                                        onTouchStart={() => {
                                                            this.setState({ mobileNumberErrorText: "" })
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            {/* <TextInput
                                            style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
                                            onChangeText={text => this.setState({
                                                mobileNumber: text
                                            })}
                                            placeholder="Mobile Number"
                                        placeholderTextColor="#727272"
                                            value={this.state.mobileNumber}
                                            keyboardType={"number-pad"}
                                            onTouchStart={() => {
                                                this.setState({ mobileNumberErrorText: "" })
                                            }}
                                        /> */}
                                            {this.state.mobileNumberErrorText ?
                                                <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>{this.state.mobileNumberErrorText} </Text>
                                                : undefined}
                                        </View>
                                        <View style={{ marginTop: 8 }}>
                                            <Text style={{ color: "#727272", fontSize: 12, }}>House No / Flat No / Floor /Building</Text>
                                            <TextInput
                                                style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1, color: "black", fontWeight: "bold" }}
                                                onChangeText={text => this.setState({
                                                    houseNumber: text
                                                })}
                                                placeholder="House No / Flat No / Floor /Building"
                                                placeholderTextColor="#cccccc"
                                                value={this.state.houseNumber}
                                            />
                                        </View>
                                        <View style={{ marginTop: 8 }}>
                                            <Text style={{ color: "#727272", fontSize: 12, }}>Landmark</Text>
                                            <TextInput
                                                style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1, color: "black", fontWeight: "bold" }}
                                                onChangeText={text => this.setState({
                                                    landMark: text
                                                })}
                                                placeholder="Landmark"
                                                placeholderTextColor="#cccccc"
                                                value={this.state.landMark}
                                            />
                                        </View>

                                    </>
                                    {/* <View style={{ marginTop: 8 }}>
                                    <Text style={{ color: "#727272", fontSize: 12 }}>Alternate Mobile Number</Text>
                                    <View style={{ borderBottomColor: '#D8D8D8', flexDirection: 'row', borderBottomWidth: 1 }}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 16 }}>+91</Text>
                                        </View>
                                        <View style={{ backgroundColor: "grey", width: 0.5, margin: 13 }} />
                                        <View style={{ flex: 1 }}>
                                            <TextInput
                                                style={{ height: 40, }}
                                                onChangeText={text => this.setState({
                                                    alternateMobileNumber: text
                                                })}
                                                placeholder="Alternate Mobile Number"
                                                placeholderTextColor="#727272"
                                                value={this.state.alternateMobileNumber}
                                                keyboardType={"number-pad"}
                                            />
                                        </View>
                                    </View>
                                </View> */}


                                    {/* <View style={{ marginTop: 8 }}>
                                    <TextInput
                                        style={{ height: 40, borderColor: this.state.errorMessageBanner ? 'red' : '#D8D8D8', borderBottomWidth: 1 }}
                                        onChangeText={text => this.setState({
                                            pincode: text
                                        })}
                                        placeholder="Pincode"
                                        placeholderTextColor="#727272"
                                        value={this.state.pincode}
                                        onTouchStart={() => this.setState({ errorMessageBanner: false })}
                                    />
                                </View> */}
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ color: "#727272", fontSize: 14, fontWeight: "bold" }}>Save as</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <CheckBox
                                            // center
                                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0, width: 90 }}
                                            title='Home'
                                            checkedIcon='dot-circle-o'
                                            textStyle={{ fontSize: 13 }}
                                            uncheckedIcon='circle-o'
                                            checked={this.state.homeCheck}
                                            onPress={() => this.onPressCheckbox('homeCheck')}
                                            checkedColor={Theme.Colors.primary}
                                        />
                                        <CheckBox
                                            // center
                                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0, width: 90 }}
                                            title='Office'
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            textStyle={{ fontSize: 13 }}
                                            checked={this.state.officeCheck}
                                            onPress={() => this.onPressCheckbox('officeCheck')}
                                            checkedColor={Theme.Colors.primary}
                                        />
                                        <CheckBox
                                            // center
                                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0, width: 90 }}
                                            title='Others'
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            textStyle={{ fontSize: 13 }}
                                            checked={this.state.othersCheck}
                                            onPress={() => this.onPressCheckbox('othersCheck')}
                                            checkedColor={Theme.Colors.primary}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        }
                        <View style={{ flex: 1, justifyContent: "center", marginBottom: 10 }}>
                            {this.state.mode == "EDIT_SCREEN" ?
                                <Button rounded style={{ backgroundColor: Theme.Colors.primary, alignSelf: "center", width: ("90%"), justifyContent: "center", marginBottom: 10 }} onPress={() => this.onSubmit()}>
                                    <Text style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: 16, letterSpacing: 0.2 }}>Save & confgjfgtinue</Text>
                                </Button>
                                :
                                <Button rounded style={{ backgroundColor: Theme.Colors.primary, alignSelf: "center", width: ("90%"), justifyContent: "center" }} onPress={() => this.OnConfirmLocation()}>
                                    <Text style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: 16, letterSpacing: 0.2 }}>Confirm Location</Text>
                                </Button>

                            }
                        </View>
                        {/* <Button full style={{ backgroundColor: Theme.Colors.primary, }} onPress={() => this.onSubmit()}><Text>Save & continue</Text></Button> */}
                    </KeyboardAvoidingView>
                    {/* <SafeAreaView style={styles.footer}>
                        <Text style={styles.region}>{JSON.stringify(region, null, 2)} </Text>
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
                                                                {/* <Text style={{ fontSize: 14, fontWeight: 'bold', }}>{item?.recepientName} </Text> */}
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
                                                            <Text numberOfLines={2} style={{ color: "#909090", fontSize: 13, }}>{item?.addressLine_1} </Text>
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
                                <Text>{JSON.stringify(this.state.savedAddress, null, "   ")} </Text>
                            </ScrollView> */}
                    </SafeAreaView>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    userLocation: state.location,
    homeScreenLocation: state.homeScreenLocation,
})


export default connect(mapStateToProps, { addNewCustomerAddress, getAllUserAddress, updateUserAddress, addLocation, addHomeScreenLocation })(MyMapView)

const styles = StyleSheet.create({
    map: {
        height: "90%"
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
        marginTop: -40,
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
    },
    editonmap: {
        backgroundColor: "white",
        flexDirection: 'row',
        width: 130,
        borderRadius: 65,
        height: 45,
        justifyContent: "space-around",
        alignItems: 'center',
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


