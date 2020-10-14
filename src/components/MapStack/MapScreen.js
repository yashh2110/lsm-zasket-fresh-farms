import React from 'react';
import { Alert, Platform, StyleSheet, Image, SafeAreaView, Modal, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
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
import { addNewCustomerAddress } from '../../actions/map'
import { connect } from 'react-redux';

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
        addressLoading: false,
        modalVisible: false,
        homeCheck: false,
        officeCheck: false,
        othersCheck: false,
        deliverFor: "self"
    };


    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => this.map.animateToRegion(region), 10);
        }
        //this.setState({ region });
    }


    componentDidMount() {
        this.getCurrentPosition();
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
                                await this.setLocation(json?.results?.[0]?.formatted_address, position.coords.latitude, position.coords.longitude)
                            });
                        }).catch((err) => {
                            console.warn(err)
                        })
                },
                (error) => {
                    //TODO: better design
                    switch (error.code) {
                        case 1:
                            if (Platform.OS === "ios") {
                                Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Privacidad - Localización");
                            } else {
                                Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Apps - ExampleApp - Localización");
                            }
                            break;
                        default:
                            Alert.alert("", "Error al detectar tu locación");
                    }
                }
            );

        } catch (e) {
            alert(e.message || "");
        }
    };

    getCurrentLocation = async () => {
        await this.setState({ addressLoading: true })
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.region.latitude + ',' + this.state.region.longitude + '&key=' + MapApiKey)
            .then((response) => {
                response.json().then(async (json) => {
                    // console.warn(json)
                    await this.setLocation(json?.results?.[0]?.formatted_address, this.state.region.latitude, this.state.region.longitude)
                    await this.setState({ addressLoading: false })
                });
            }).catch(async (err) => {
                console.warn(err)
                await this.setState({ addressLoading: false })
            })
    }

    setLocation = async (address, latitude, longitude) => {
        this.setState({
            address: address,
            latitude: latitude,
            longitude: longitude
        })
        await AsyncStorage.setItem("location", JSON.stringify({
            address: address,
            latitude: latitude,
            longitude: longitude
        }));
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


    onSubmit = async () => {
        await this.setState({ loading: true })
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let payload = {
            "addressLine1": this.state.address,
            "cityId": 0,
            "isActive": true,
            "landmark": this.state.landMark,
            "lat": this.state.latitude,
            "lon": this.state.longitude,
            "recepientMobileNumber": parsedUserDetails?.customerDetails?.userMobileNumber,
            "recepientName": parsedUserDetails?.customerDetails?.name,
            "saveAs": this.state.saveAs
        }
        await this.props.addNewCustomerAddress(payload, (response, status) => {
            if (status) {
                Alert.alert(JSON.stringify(response, null, "   "))
                this.setState({ loading: false })
            } else {
                Alert.alert(JSON.stringify(response, null, "   "))
                this.setState({ loading: false })
            }
        })

    }

    onPressCheckbox = (option) => {
        if (option === "homeCheck") {
            this.setState({
                homeCheck: true,
                officeCheck: false,
                othersCheck: false,
            })
        }
        if (option === "officeCheck") {
            this.setState({
                homeCheck: false,
                officeCheck: true,
                othersCheck: false,
            })
        }
        if (option === "othersCheck") {
            this.setState({
                homeCheck: false,
                officeCheck: false,
                othersCheck: true,
            })
        }
    }

    onPressDeliverFor = (option) => {
        if (option === "self") {
            this.setState({
                deliverFor: "self"
            })
        }
        if (option === "others") {
            this.setState({
                deliverFor: "others"
            })
        }
    }

    render() {

        const { region } = this.state;
        const { children, renderMarker, markers, navigation } = this.props;

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} behavior={Platform.OS == "ios" ? "padding" : null}>
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
                    <ScrollView style={{ flex: 1, width: "90%", alignSelf: 'center' }} showsVerticalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ color: "#727272", fontSize: 13 }}>Your current location</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => { this.setState({ modalVisible: true }) }} style={{ padding: 5 }}>
                                <Text style={{ color: "#73C92D" }}>Change</Text>
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
                                <Text>{this.state.address}</Text>
                            </View>
                        }
                        <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold' }}>Delivering for?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: 10, }}>
                            <TouchableOpacity onPress={() => this.onPressDeliverFor('self')} style={{ justifyContent: 'center', borderColor: this.state.deliverFor == "self" ? Theme.Colors.primary : "#EFEFEF", borderWidth: 2, borderRadius: 6, justifyContent: 'center', alignItems: 'center', width: "40%", padding: 15 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Self</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onPressDeliverFor('others')} style={{ justifyContent: 'center', borderColor: this.state.deliverFor == "others" ? Theme.Colors.primary : "#EFEFEF", borderWidth: 2, borderRadius: 6, justifyContent: 'center', alignItems: 'center', width: "40%", padding: 15 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Others</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.deliverFor === "others" ?
                            <>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: "#727272", fontSize: 14 }}>Name</Text>
                                    <TextInput
                                        style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
                                        onChangeText={text => this.setState({
                                            houseNumber: text
                                        })}
                                        value={this.state.houseNumber}
                                    />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: "#727272", fontSize: 14 }}>Phone Number</Text>
                                    <TextInput
                                        style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
                                        onChangeText={text => this.setState({
                                            houseNumber: text
                                        })}
                                        value={this.state.houseNumber}
                                        keyboardType={"number-pad"}
                                    />
                                </View>
                            </> : undefined}
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: "#727272", fontSize: 14 }}>House No/ Flat No/Floor/Building</Text>
                            <TextInput
                                style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
                                onChangeText={text => this.setState({
                                    houseNumber: text
                                })}
                                value={this.state.houseNumber}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: "#727272", fontSize: 14 }}>Landmark</Text>
                            <TextInput
                                style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
                                onChangeText={text => this.setState({
                                    houseNumber: text
                                })}
                                value={this.state.houseNumber}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: "#727272", fontSize: 14 }}>Save as</Text>
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
                        <Button full style={{ marginVertical: 20, backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => this.onSubmit()}><Text>Save & continue</Text></Button>
                    </ScrollView>
                    {/* <SafeAreaView style={styles.footer}>
                        <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text>
                    </SafeAreaView> */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setState({ modalVisible: false })
                        }}>
                        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                            <AutoCompleteLocation
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
                        </SafeAreaView>
                    </Modal>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
})


export default connect(mapStateToProps, { addNewCustomerAddress })(MyMapView)

const styles = StyleSheet.create({
    map: {
        height: "40%"
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


