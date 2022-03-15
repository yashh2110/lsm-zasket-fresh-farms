import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import MapView, { Marker, Callout, ProviderPropType } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import marker from "../../assets/png/locationIcon.png";
import { Icon, Button, Text } from "native-base";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Theme from "../../styles/Theme";
import AutoCompleteLocation from "./AutoCompleteInput";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { CheckBox } from "react-native-elements";
import {
  addNewCustomerAddress,
  updateUserAddress,
  getAllUserAddress,
  geocodeing,
} from "../../actions/map";
import { addLocation } from "../../actions/location";
import { addHomeScreenLocation } from "../../actions/homeScreenLocation";

import { connect } from "react-redux";
import FeatherIcons from "react-native-vector-icons/Feather";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import { isPincodeServiceable } from "../../actions/home";
import { CheckGpsState, CheckPermissions } from "../../utils/utils";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import { AuthContext } from "../../navigation/Routes";
import { StackActions } from "@react-navigation/native";
import Config from "react-native-config";
const latitudeDelta = 0.005;
const longitudeDelta = 0.005;

const initialRegion = {
  latitude: -37.78825,
  longitude: -122.4324,
  latitudeDelta,
  longitudeDelta,
};
const mapApiKey = Config.MAP_API_KEY;
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
    mode: "",
    pincode: "",
    savedAddress: [],
    mobileNumberErrorText: "",
    nameErrorText: "",
    errorMessage: "",
    errorMessageBanner: false,
    addressId: "",
    pincodeAvailable: false,
    gpsEnabled: false,
    movetoadjust: false,
    addressResult: [],
  };

  setRegion(region) {
    if (this.state.ready) {
      setTimeout(() => this.map.animateToRegion(region), 10);
    }
    //this.setState({ region });
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.initialFunction();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async initialFunction() {
    CheckGpsState((status) => {
      if (status) {
        this.setState({ gpsEnabled: false });
      } else {
        this.setState({ gpsEnabled: true });
      }
    }, false);
    const { fromScreen, regionalPositions } = this.props.route.params;
    if (
      this.props.homeScreenLocation?.pincode == undefined ||
      this.props.homeScreenLocation?.pincode == ""
    ) {
      this.setState({ mode: "ON_INITIAL" });
      if (regionalPositions == null) {
        this.getCurrentPosition();
      } else {
        await this.setRegion(regionalPositions);
      }
    } else {
      if (regionalPositions == null) {
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
          pincodeAvailable: true,
        });
      } else {
        await this.setRegion(regionalPositions);
      }

      // alert(JSON.stringify(this.state.pincode))
      await this.forceUpdate();
    }

    // await this.setState({ savedAddressLoading: true, })
    // await this.props.getAllUserAddress(async (response, status) => {
    //     this.setState({ savedAddressLoading: false })
    //     if (status) {
    //         let newArray = []
    //         await response?.data?.forEach((el, index) => {
    //             if (el?.isActive) newArray.push(el)
    //         })
    //         // Alert.alert(JSON.stringify(response, null, "   "))
    //         this.setState({ savedAddress: newArray })

    //     } else {
    //         // Alert.alert(JSON.stringify(response?.data, null, "   "))
    //         this.setState({ savedAddressLoading: false })
    //     }
    // })
  }

  getCurrentPosition() {
    try {
      CheckPermissions((status) => {
        if (status) {
          this.setState({ gpsEnabled: false });
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
              geocodeing(position.coords.latitude, position.coords.longitude)
                .then((response) => {
                  response.json().then(async (json) => {
                    let postal_code = json?.results?.[0]?.address_components?.find(
                      (o) =>
                        JSON.stringify(o.types) ==
                        JSON.stringify(["postal_code"])
                    );
                    let address_components =
                      json?.results?.[0].address_components;
                    let value = address_components.filter((product) =>
                      product.types.some(
                        (item) =>
                          item === "route" ||
                          item === "sublocality_level_1" ||
                          item === "sublocality_level_2" ||
                          item === "locality" ||
                          item === "administrative_area_level_2" ||
                          item === "administrative_area_level_1" ||
                          item === "postal_code" ||
                          item === "country"
                      )
                    );
                    await this.setState({ addressResult: value });
                    let address = this.state.addressResult.map((el, index) => {
                      return el.long_name;
                    });
                    await this.setLocation(
                      address.toString(),
                      position.coords.latitude,
                      position.coords.longitude,
                      postal_code?.long_name
                    );
                  });
                })
                .catch((err) => {
                  console.warn(err);
                });
            },
            (error) => {
              console.warn(error);
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
            { enableHighAccuracy: false, timeout: 5000 }
          );
        } else {
          this.setState({ gpsEnabled: true });
        }
      });
    } catch (e) {
      alert(e.message || "");
    }
  }

  getCurrentLocation = async () => {
    await this.setState({
      addressLoading: true,
      errorMessage: "",
      movetoadjust: true,
    });
    geocodeing(this.state.region.latitude, this.state.region.longitude)
      .then((response) => {
        response.json().then(async (json) => {
          // console.warn(json)
          let postal_code = json?.results?.[0]?.address_components?.find(
            (o) => JSON.stringify(o.types) == JSON.stringify(["postal_code"])
          );
          let address_components = json?.results?.[0].address_components;
          let value = address_components.filter((product) =>
            product.types.some(
              (item) =>
                item === "route" ||
                item === "sublocality_level_1" ||
                item === "sublocality_level_2" ||
                item === "locality" ||
                item === "administrative_area_level_2" ||
                item === "administrative_area_level_1" ||
                item === "postal_code" ||
                item === "country"
            )
          );
          await this.setState({ addressResult: value });
          let address = this.state.addressResult.map((el, index) => {
            return el.long_name;
          });
          // alert(JSON.stringify(json?.results?.[1]?.address_components?.find(el => el.types.find(o => o == "political")), null, "  "))
          await this.setLocation(
            address.toString(),
            this.state.region.latitude,
            this.state.region.longitude,
            postal_code?.long_name
          );
          await this.setState({ addressLoading: false });
        });
      })
      .catch(async (err) => {
        console.warn("err", err);
        await this.setState({ addressLoading: false, movetoadjust: false });
      });
  };

  setLocation = async (address, latitude, longitude, postal_code) => {
    this.setState({
      address: address ? address : "",
      latitude: latitude ? latitude : "",
      longitude: longitude ? longitude : "",
      pincode: postal_code ? postal_code : "",
    });
  };

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
    this.setState({ errorMessageBanner: false, movetoadjust: false });
    await this.setState({
      region: region,
    });
    await this.getCurrentLocation();
  };

  onPressTurnOn = () => {
    CheckPermissions((status) => {
      if (status) {
        this.setState({ gpsEnabled: false });
        this.getCurrentPosition();
      } else {
        this.setState({ gpsEnabled: true });
      }
    });
  };
  onSubmit = async () => {
    await this.props.addHomeScreenLocation({
      addressLine_1: this.state.address,
      pincode: this.state.pincode,
      lat: this.state.latitude,
      lon: this.state.longitude,
    });
    if (this.state.mode == "ON_INITIAL") {
      this.props.navigation.dispatch(StackActions.popToTop());
      if (this.props.isAuthenticated == false) {
        this.props.navigation.navigate("SwitchNavigator");
      }
      // await AsyncStorage.setItem('onBoardKey', 'onBoardKey')
      // this.props.navigation.navigate("BottomTabRoute")
    } else {
      await this.props.isPincodeServiceable(
        this.state.latitude,
        this.state.longitude,
        (res, status) => {
          if (status) {
            this.props.navigation.navigate("BottomTabRoute");
          } else {
            this.setState({ errorMessageBanner: true });
          }
        }
      );
    }
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.7,
          width: "95%",
          alignSelf: "center",
          backgroundColor: "#EAEAEC",
        }}
      />
    );
  };

  render() {
    const { region } = this.state;
    const { children, renderMarker, markers, navigation } = this.props;

    return (
      <>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "white" }}
            behavior={Platform.OS == "ios" ? "padding" : null}>
            {this.state.errorMessageBanner && (
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  backgroundColor: "#F65C65",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  flexDirection: "row",
                }}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}>
                  <FeatherIcons name="info" color={"white"} size={18} />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text style={{ fontSize: 12, color: "white" }}>
                    We might be not available in all the locations. We are
                    expanding, very soon we will be delivered in all location.{" "}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ justifyContent: "center", alignItems: "center" }}
                  onPress={() => {
                    this.setState({ errorMessageBanner: false });
                  }}>
                  <AntDesignIcons name="close" color={"white"} size={18} />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.map}>
              {!this.state.errorMessageBanner && (
                <View
                  style={{ zIndex: 1, height: 60, backgroundColor: "white" }}>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: "center",
                      position: "absolute",
                      zIndex: 1,
                      left: 10,
                      top: 10,
                    }}>
                    <Icon
                      name="chevron-small-left"
                      type="Entypo"
                      style={[{ fontSize: 32, color: "black" }]}
                    />
                  </TouchableOpacity>
                  <View style={{ zIndex: 1, left: 45, top: 18 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "#242A40",
                      }}>
                      Set delivery location{" "}
                    </Text>
                  </View>
                </View>
              )}
              <MapView
                showsUserLocation
                ref={(map) => {
                  this.map = map;
                }}
                data={markers}
                initialRegion={initialRegion}
                onMapReady={this.onMapReady}
                showsMyLocationButton={true}
                onRegionChange={this.onRegionChange}
                onRegionChangeComplete={this.onRegionChangeComplete}
                style={StyleSheet.absoluteFill}
                textStyle={{ color: "#bc8b00" }}
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "#BC8B00",
                }}>
                {(children && children) || null}
              </MapView>
              <View style={styles.markerFixed}>
                {/* <Image style={styles.marker} source={marker} /> */}
                {/* <View style={{ backgroundColor: 'black', alignSelf: 'center', marginLeft: -50, width: 215, padding: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: -40, marginBottom: -15 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Order will be delivered here</Text>
                                    <Text style={{ color: 'white', fontSize: 12 }}>Place the pin accurately on the map</Text>
                                </View> */}
                {this.state.addressLoading ? (
                  <View
                    style={{
                      backgroundColor: "#202741",
                      alignSelf: "center",
                      marginLeft: -125,
                      width: 345,
                      padding: 10,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: -55,
                      marginBottom: -28,
                    }}>
                    <Text
                      style={{
                        color: "#9BA2BC",
                        fontWeight: "bold",
                        fontSize: 12,
                        letterSpacing: 0.2,
                      }}>
                      SELECTED LOCATION{" "}
                    </Text>
                    <Text style={{ fontWeight: "bold", color: "#EFF4F6" }}>
                      Locating...
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: "#202741",
                      alignSelf: "center",
                      marginLeft: -125,
                      width: 345,
                      padding: 10,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: -55,
                      marginBottom: -28,
                    }}>
                    {this.state.address ? (
                      <>
                        <Text
                          style={{
                            color: "#9BA2BC",
                            fontWeight: "bold",
                            fontSize: 12,
                            letterSpacing: 0.2,
                          }}>
                          SELECTED LOCATION{" "}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            width: "90%",
                            alignSelf: "center",
                            flex: 1,
                            flexWrap: "wrap",
                          }}>
                          {this.state.addressResult.map((el, index) => {
                            return (
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  numberOfLines={2}
                                  style={{ color: "#EFF4F6", fontSize: 14 }}>
                                  {(index ? ",  " : "") + el.long_name}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </>
                    ) : (
                      <>
                        <Text
                          style={{
                            color: "#9BA2BC",
                            fontWeight: "bold",
                            fontSize: 12,
                            letterSpacing: 0.2,
                          }}>
                          SELECTED LOCATION{" "}
                        </Text>
                        <Text style={{ fontWeight: "bold", color: "#EFF4F6" }}>
                          Locating...{" "}
                        </Text>
                      </>
                    )}
                  </View>
                )}
                <LottieView
                  style={styles.marker}
                  source={require("../../assets/animations/favoriteDoctorHeart.json")}
                  autoPlay
                />
              </View>
              <TouchableOpacity
                onPress={() => this.getCurrentPosition()}
                style={styles.getcurrentlocation}
                activeOpacity={0.6}>
                <Icon
                  name="gps-fixed"
                  type="MaterialIcons"
                  style={{ color: "#979197", fontSize: 20 }}
                />
              </TouchableOpacity>
            </View>
            {this.state.movetoadjust && this.state.addressLoading == false ? (
              <>
                <View
                  style={{
                    bottom: "12%",
                    left: "25%",
                    position: "absolute",
                    zIndex: 1,
                  }}>
                  <View
                    style={{
                      backgroundColor: "#202741",
                      alignSelf: "center",
                      marginLeft: 0,
                      width: 200,
                      padding: 10,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 14,
                        letterSpacing: 0.2,
                      }}>
                      Move the pin to adjust{" "}
                    </Text>
                  </View>
                </View>
              </>
            ) : null}
            <View style={{ width: "100%", height: 5, overflow: "hidden" }}>
              {this.state.addressLoading ? (
                <LottieView
                  style={{ width: "100%" }}
                  source={require("../../assets/animations/lineLoading.json")}
                  autoPlay
                />
              ) : null}
            </View>
            {/* <ScrollView
                            // ref='_scrollView' 
                            contentContainerStyle={{ zIndex: 1 }}
                            showsVerticalScrollIndicator={true}> */}
            {this.state.gpsEnabled ? (
              <View
                style={{
                  backgroundColor: "#6B98DE",
                  position: "absolute",
                  bottom: 140,
                }}>
                <View style={{ flexDirection: "row", padding: 10 }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Icon
                      name="crosshairs-gps"
                      type="MaterialCommunityIcons"
                      style={{ fontSize: 24, color: "#ffffff" }}
                    />
                  </View>
                  <View style={{ width: "60%" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ffffff",
                        fontWeight: "bold",
                      }}>
                      Unable to get location{" "}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#ffffff" }}>
                      Turning on Location ensures accurate and hassle-free
                      delivery{" "}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.onPressTurnOn()}
                    style={{
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "white",
                      margin: 10,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#6B98DE",
                        marginHorizontal: 10,
                        fontWeight: "bold",
                      }}>
                      TURN ON{" "}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            {/* <View style={{ flex: 1, width: "90%", alignSelf: 'center' }}> */}
            {/* <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ color: "#727272", fontSize: 12 }}>Your current location</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { navigation.navigate('AutoCompleteLocationScreen', { fromScreen: 'OnBoardScreen', navigateTo: 'MapScreenGrabPincode' }) }} style={{ padding: 5 }}>
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
                                        {this.state.address ?
                                            <>
                                                <Image
                                                    style={{ width: 30, height: 30, marginLeft: -5 }}
                                                    source={require('../../assets/png/locationIcon.png')}
                                                />
                                                <Text style={{ fontSize: 16 }}>{this.state.address} </Text>
                                            </> : null}
                                    </View>
                                } */}
            {/* <View style={{ borderRadius: 5, borderColor: "#ECE1D6", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#FFFCF5', borderWidth: 1, marginTop: 10 }}>
                                    <Text style={{ color: '#8e6847', fontSize: 14 }}>A detailed address will help our delivery executive reach your doorstep easily</Text>
                                </View> */}
            {/* <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: "#727272", fontSize: 12 }}>Pincode</Text>
                                    <TextInput
                                        style={{ height: 40, borderColor: this.state.errorMessageBanner ? 'red' : '#D8D8D8', borderBottomWidth: 1 }}
                                        onChangeText={text => this.setState({
                                            pincode: text
                                        })}
                                        placeholder="Pincode"
                                        value={this.state.pincode}
                                        onTouchStart={() => this.setState({ errorMessageBanner: false })}
                                    />
                                </View> */}
            {/* </View> */}
            {/* </ScrollView> */}
            <View
              style={{ flex: 1, justifyContent: "center", marginBottom: 10 }}>
              <Button
                rounded
                style={{
                  backgroundColor: Theme.Colors.primary,
                  alignSelf: "center",
                  width: "90%",
                  justifyContent: "center",
                }}
                onPress={() => this.onSubmit()}>
                <Text style={{}}>Confirm Location</Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
          {/* <SafeAreaView style={styles.footer}>
                        <Text style={styles.region}>{JSON.stringify(region, null, 2)} </Text>
                    </SafeAreaView> */}
        </TouchableWithoutFeedback>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  darkMode: state.dark,
  userLocation: state.location,
  homeScreenLocation: state.homeScreenLocation,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  isPincodeServiceable,
  addHomeScreenLocation,
  addNewCustomerAddress,
  getAllUserAddress,
  updateUserAddress,
  addLocation,
  addHomeScreenLocation,
})(MapScreenGrabPincode);

const styles = StyleSheet.create({
  map: {
    height: "90%",
  },
  // markerFixed: {
  //     left: '50%',
  //     marginLeft: -24,
  //     marginTop: -35,
  //     position: 'absolute',
  //     top: '50%',
  // },
  markerFixed: {
    left: "50%",
    marginLeft: -49,
    marginTop: -40,
    position: "absolute",
    top: "50%",
  },
  // marker: {
  //     height: 48,
  //     width: 48
  // },
  marker: {
    height: 100,
    width: 100,
  },
  footer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
  region: {
    color: "#fff",
    lineHeight: 20,
    margin: 20,
  },
  getcurrentlocation: {
    backgroundColor: "white",
    flexDirection: "row",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
