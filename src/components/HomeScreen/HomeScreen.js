import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, ScrollView, Alert, SectionList, FlatList, RefreshControl, BackHandler, Platform, PermissionsAndroid, DeviceEventEmitter, Linking, } from 'react-native';
import { Icon } from 'native-base';
import { AuthContext } from "../../navigation/Routes"
import Swiper from 'react-native-swiper';
import Theme from '../../styles/Theme';
import { getAllCategories, isPincodeServiceable, getCustomerDetails, getAllBanners, addCustomerDeviceDetails } from '../../actions/home'
import { onLogout } from '../../actions/auth'
import { connect } from 'react-redux';
import CategorySectionListItem from './CategorySectionListItem';
import Loader from '../common/Loader';
import DarkModeToggle from '../common/DarkModeToggle';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { appVersion, MapApiKey, OneSignalAppId } from '../../../env';
import { addHomeScreenLocation } from '../../actions/homeScreenLocation'
import { getCartItemsApi } from '../../actions/cart'
import FeatherIcons from "react-native-vector-icons/Feather"
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import InAppReview from "react-native-in-app-review";
import OneSignal from "react-native-onesignal";
import DeviceInfo from 'react-native-device-info';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import GPSState from 'react-native-gps-state'
import { CheckGpsState, CheckPermissions } from '../../utils/utils'
import { useIsFocused } from '@react-navigation/native';
import AddressModal from '../common/AddressModal';
import { getAllUserAddress } from '../../actions/map'
import Modal from 'react-native-modal';
import SetDeliveryLocationModal from '../common/SetDeliveryLocationModal'
import { EventRegister } from 'react-native-event-listeners'

const HomeScreen = ({ homeScreenLocation, addHomeScreenLocation, getAllCategories, getAllUserAddress, isPincodeServiceable, getAllBanners, isAuthenticated, allUserAddress, bannerImages, addCustomerDeviceDetails, categories, navigation, userLocation, onLogout, config, getCartItemsApi }) => {
    const { setOnBoardKey, removeOnBoardKey } = React.useContext(AuthContext);

    useEffect(() => {
        const onReceived = (notification) => {
            console.log("Notification received: ", notification);
        }
        const onOpened = (openResult) => {
            // alert(JSON.stringify(openResult.notification.isAppInFocus, null, "       "))
            if (openResult.notification.payload.additionalData?.redirect_to == "MyOrdersDetailScreen") {
                navigation.navigate(openResult.notification.payload.additionalData?.redirect_to, { order_id: openResult.notification.payload.additionalData?.order_id })
                // navigation.navigate("AccountStack", {
                //     screen: 'MyOrders',
                //     params: {
                //         screen: openResult.notification.payload.additionalData?.redirect_to,
                //         params: {
                //             order_id: openResult.notification.payload.additionalData?.order_id
                //         },
                //     },
                // });
            }
            console.log('Message: ', openResult.notification.payload.body);
            console.log('Data: ', openResult.notification.payload.additionalData);
            console.log('isActive: ', openResult.notification.isAppInFocus);
            console.log('openResult: ', openResult);
        }
        const onIds = (device) => {
            console.log('Device info: ', device);
        }
        OneSignal.addEventListener('received', onReceived);
        OneSignal.addEventListener('opened', onOpened);
        OneSignal.addEventListener('ids', onIds);
        return () => {
            OneSignal.removeEventListener('received', onReceived);
            OneSignal.removeEventListener('opened', onOpened);
            OneSignal.removeEventListener('ids', onIds);
        }
    }, [])

    useEffect(() => {
        const listener = EventRegister.addEventListener('SessionExpiryEvent', (data) => {
            if (data == "logOut") {
                Alert.alert(
                    "Session Expired",
                    "Please login again",
                    [
                        { text: "OK", onPress: () => onPressLogout() }
                    ],
                    { cancelable: false }
                );
            }
        });
        return () => {
            EventRegister.removeEventListener(listener)
        }
    }, [])

    const [showAppUpdate, setShowAppUpdate] = useState(false)
    useEffect(() => {
        if (config?.appVersion !== undefined) {
            if (config?.appVersion !== appVersion) {
                setShowAppUpdate(true)
            }
        }
    }, [config])


    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [pincodeError, setPincodeError] = useState(false)
    const [showAppReviewCard, setShowAppReviewCard] = useState(true)
    const [addressModalVisible, setAddressModalVisible] = useState(false)
    const [deliveryLocationModalVisible, setDeliveryLocationModalVisible] = useState(false)
    const [isHomeScreenLocationAvailable, setIsHomeScreenLocationAvailable] = useState(false)
    useEffect(() => {
        initialFunction()
        checkForHomescreenLocationAddress()
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            setRefresh(true)
            getCartItemsApi((res, status) => {
                if (status) {
                    setRefresh(false)
                } else {
                    setRefresh(false)
                }
            })


            let userID;
            OneSignal.init(OneSignalAppId, {
                kOSSettingsKeyAutoPrompt: true,
            });
            OneSignal.getPermissionSubscriptionState(async (status) => {
                userID = await status.userId;
                var deviceId = DeviceInfo.getUniqueId();
                let getBrand = DeviceInfo.getBrand();
                let version = DeviceInfo.getVersion();
                let model = DeviceInfo.getModel();
                let payload = {
                    "appVersion": appVersion,
                    "deviceId": deviceId,
                    "mobileOS": Platform.OS == "android" ? "android" : "ios",
                    "phoneModel": getBrand + "-" + model + "   StoreBuildVersion-" + version,
                    "playerId": userID
                }
                // alert(JSON.stringify(userID, null, "       "));
                if (userID) {
                    addCustomerDeviceDetails(payload, (res, status) => { })
                }
            });
        }
    }, [isAuthenticated])

    const initialFunction = () => {
        getAllCategories((res, status) => {
            if (status) {
                // alert(JSON.stringify(res.data, null, "      "))
                setLoading(false)
                setRefresh(false)
            } else {
                setRefresh(false)
                setLoading(false)
            }
        })

        getAllBanners((res, status) => {
            if (status) {
                // alert(JSON.stringify(res.data, null, "      "))
                setLoading(false)
                setRefresh(false)
            } else {
                setRefresh(false)
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        if (userLocation?.lat) {
            setPincodeError(false)
        }
    }, [userLocation])

    useEffect(() => {
        if (homeScreenLocation?.lat) {
            setTimeout(() => {
                setDeliveryLocationModalVisible(false)
            }, 1000);
            isPincodeServiceable(homeScreenLocation?.lat, homeScreenLocation?.lon, (res, status) => {
                if (status) {
                    setPincodeError(false)
                } else {
                    setPincodeError(true)
                }
            })
        }
    }, [homeScreenLocation?.lat])
    useEffect(() => {
        if (homeScreenLocation?.lat) {
            setDeliveryLocationModalVisible(false)
            // setAddressModalVisible(false)
        }
    }, [homeScreenLocation?.lat])
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkForHomescreenLocationAddress()
        });
        return unsubscribe;
        // Return the function to unsubscribe from the event so it gets removed on unmount
    }, [navigation]);

    const checkForHomescreenLocationAddress = async () => {
        let isHomeScreenLocationAvailable = await AsyncStorage.getItem('homeScreenLocation');
        if (!isHomeScreenLocationAvailable) {
            if (homeScreenLocation?.lat == undefined || homeScreenLocation?.lat == "") {
                CheckPermissions((status) => {
                    if (status) {
                        getCurrentPosition()
                    } else {
                        getAllUserAddress(async (response, status) => {
                            if (status) {
                                let newArray = []
                                await response?.data?.forEach((el, index) => {
                                    if (el?.isActive) newArray.push(el)
                                })
                                if (newArray?.length > 0) {
                                    setAddressModalVisible(true)
                                } else {
                                    setDeliveryLocationModalVisible(true)
                                }
                            } else {
                                setDeliveryLocationModalVisible(true)
                            }
                        })
                    }
                }, false)
            } else {
                setDeliveryLocationModalVisible(false)
            }
        }
    }
    const getCurrentPosition = async () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + MapApiKey)
                    .then((response) => {
                        response.json().then(async (json) => {
                            let postal_code = json?.results?.[0]?.address_components?.find(o => JSON.stringify(o.types) == JSON.stringify(["postal_code"]));
                            addHomeScreenLocation({
                                addressLine_1: json?.results?.[0]?.formatted_address,
                                pincode: postal_code?.long_name,
                                lat: position.coords.latitude,
                                lon: position.coords.longitude
                            })
                            // await this.setLocation(json?.results?.[0]?.formatted_address, position.coords.latitude, position.coords.longitude, postal_code?.long_name)
                            isPincodeServiceable(position.coords.latitude, position.coords.longitude, (res, status) => {
                                if (status) {
                                } else {
                                    setPincodeError(true)
                                }
                            })
                        });
                    }).catch((err) => {
                        console.warn(err)
                        if (Platform.OS == "android") {
                            checkForLocationAccess()
                        }

                    })
            },
            (error) => {
                if (error?.message == "Location permission was not granted." || error?.message == "Location services disabled." || error?.message == "User denied access to location services.") {
                    // navigation.navigate('AccessPermissionScreen')
                }
                console.warn(error)
            },
            { enableHighAccuracy: false, timeout: 5000 },
        );
    };

    const onRefresh = () => {
        setRefresh(true)
        // getCurrentPosition()
        initialFunction()
    }

    const onPressLogout = async () => {
        await onLogout()
        removeOnBoardKey()
    }
    const onPressUpdate = () => {
        if (Platform.OS == "ios") {
            Linking.canOpenURL("itms-apps://itunes.apple.com/us/app/apple-store/id1541056118?mt=8").then(supported => {
                if (supported) {
                    Linking.openURL("itms-apps://itunes.apple.com/us/app/apple-store/id1541056118?mt=8");
                } else {
                    Linking.openURL("https://apps.apple.com/in/app/zasket/id1541056118");
                    console.warn("Don't know how to open URI");
                }
            });
        }
        if (Platform.OS == "android") {
            Linking.canOpenURL("market://details?id=com.zasket").then(supported => {
                if (supported) {
                    Linking.openURL("market://details?id=com.zasket");
                } else {
                    console.warn("Don't know how to open URI");
                }
            });
        }
    }
    const rateNow = async () => {
        onPressUpdate()
        // try {
        //     const isAvailable = await InAppReview.isAvailable
        //     if (!isAvailable) {
        //         onPressUpdate()
        //         return;
        //     }
        //     InAppReview.RequestInAppReview();
        // } catch (e) { }
    }
    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingHorizontal: 10, flexWrap: 'wrap' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('AutoCompleteLocationScreen', { navigateTo: "MapScreenGrabPincode" }) }} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                        <Icon name="location-pin" type="Entypo" style={{ fontSize: 22 }} />
                        <Text numberOfLines={1} style={{ maxWidth: '50%' }}>{homeScreenLocation?.addressLine_1}</Text>
                        <Icon name="arrow-drop-down" type="MaterialIcons" style={{ fontSize: 22 }} />
                    </TouchableOpacity>
                    {/* {__DEV__ ?
                        isAuthenticated ?
                            <TouchableOpacity onPress={() => onPressLogout()} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                <Text>Logout</Text>
                            </TouchableOpacity>
                            : undefined
                        : undefined} */}
                </View>
                {pincodeError ?
                    <View style={{ backgroundColor: '#F65C65', width: "95%", alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 3 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 5 }}>
                            <Text style={{ color: 'white' }}><Icon name="warning" type="AntDesign" style={{ fontSize: 22, color: 'white' }} /> We are not available at this location!</Text>
                        </View>
                        <TouchableOpacity onPress={() => { navigation.navigate('AutoCompleteLocationScreen', { navigateTo: "MapScreenGrabPincode" }) }} style={{ backgroundColor: '#DD4C55', paddingHorizontal: 5, paddingVertical: 4, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Change</Text>
                        </TouchableOpacity>
                    </View>
                    : undefined}
                <View style={{ height: 160, justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                    {bannerImages?.length > 0 ?
                        <Swiper
                            autoplay={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            autoplayTimeout={5}
                            removeClippedSubviews={false}
                            activeDotColor={"#ffffff"}
                            dotStyle={{ bottom: -10, height: 6, width: 6 }}
                            activeDotStyle={{ bottom: -10, height: 6, width: 8 }}
                        >
                            {bannerImages?.map((el, index) => {
                                return (
                                    <>
                                        <Image
                                            style={{
                                                height: "100%", width: "100%",
                                                // alignSelf: 'center',
                                                // borderRadius: 5, 
                                                // marginRight: bannerImages.length - 1 == index ? 0 : 15 
                                            }}
                                            // resizeMode={"stretch"}
                                            source={{ uri: el?.imagePath }}
                                        />
                                    </>
                                )
                            })}
                            {/* <Image
                            style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center' }}
                            // resizeMode={"stretch"}
                            source={require('../../assets/png/HomeScreenBanner1.png')}
                        />
                        <Image
                            style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center' }}
                            // resizeMode={"stretch"}
                            source={require('../../assets/png/HomeScreenBanner2.png')}
                        /> */}
                        </Swiper>
                        : undefined}
                </View>
                {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 5 }}>
                    {bannerImages?.map((el, index) => {
                        return (
                            <>
                                <Image
                                    style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center', marginRight: bannerImages.length - 1 == index ? 0 : 15 }}
                                    // resizeMode={"stretch"}
                                    source={{ uri: el?.imagePath }}
                                />
                            </>
                        )
                    })}
                </ScrollView> */}
                <View style={{ flexDirection: 'row', backgroundColor: 'white', height: 125, justifyContent: 'space-around', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('ProductListScreen', { categoryName: "VEGETABLES" }) }} style={{ height: 120, width: 150, backgroundColor: '#F2F5F7', borderRadius: 4, overflow: 'hidden' }}>
                        <Text style={{ padding: 15 }}>Vegetables</Text>
                        <Image
                            style={{ borderRadius: 5, position: 'absolute', bottom: -3, right: 0, width: 130, height: 80 }}
                            resizeMode={"contain"}
                            source={require('../../assets/png/HomeScreenVegetable.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('ProductListScreen', { categoryName: "FRUITS" }) }} style={{ height: 120, width: 150, backgroundColor: '#F2F5F7', borderRadius: 4, overflow: 'hidden' }}>
                        <Text style={{ padding: 15 }}>Fruits</Text>
                        <Image
                            style={{ borderRadius: 5, position: 'absolute', bottom: 0, right: 0, width: 150, height: 100 }}
                            resizeMode={"contain"}
                            source={require('../../assets/png/HomeScreenVegetable2.png')}
                        />
                    </TouchableOpacity>
                </View>

                <Image
                    style={{ borderRadius: 5, alignSelf: 'center', borderRadius: 5, backgroundColor: 'white', height: 125, aspectRatio: 3 }}
                    resizeMode={"cover"}
                    source={require('../../assets/png/HomeScreenFreeDelivery.png')}
                />

                <FlatList
                    data={categories}
                    renderItem={({ item }) => (
                        <CategorySectionListItem item={item} navigation={navigation} />
                    )}
                    keyExtractor={item => item?.id.toString()}
                />

                {showAppReviewCard ?
                    <View style={{ width: '90%', padding: 15, marginVertical: 10, backgroundColor: 'white', alignSelf: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.34, shadowRadius: 6.27, elevation: 10, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Like using our app?</Text>
                                <Text style={{ color: '#727272', fontSize: 13 }}>Recommend us to others by rating us 5 stars on the play store</Text>
                            </View>
                            <View style={{ backgroundColor: 'white' }}>
                                <Image
                                    style={{ height: 100, width: 80 }}
                                    resizeMode="center"
                                    source={require('../../assets/png/appReview.png')}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <TouchableOpacity onPress={() => setShowAppReviewCard(false)} style={{ padding: 10, borderRadius: 4, backgroundColor: '#FDEFEF', width: "47%", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: "#E1171E", fontSize: 13 }}>No, Thanks</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => rateNow()} style={{ padding: 10, borderRadius: 4, backgroundColor: '#E1171E', width: "47%", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 13 }}>Rate the app</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    : null}
                {/* <Text>{JSON.stringify(sectionlistData, null, "      ")} </Text> */}
            </ScrollView>
            {showAppUpdate ?
                <View style={{ height: 55, width: "100%", backgroundColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <FeatherIcons name="info" color={'#C8C8C8'} size={18} />
                        <Text style={{}}>  App update available</Text>
                    </View>
                    <TouchableOpacity onPress={() => { setShowAppUpdate(false) }} style={{
                        backgroundColor: '#F5F5F5', width: 25, height: 25, borderRadius: 50, position: 'absolute', right: 10, top: -10, zIndex: 1, elevation: 5, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.22, shadowRadius: 2.22,
                    }}>
                        <Icon name="close" style={{ color: '#AAAAAA', fontSize: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { onPressUpdate() }} style={{ margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: "center", }}>
                        <Text style={{ fontSize: 14, color: Theme.Colors.primary, fontWeight: 'bold', marginRight: 10 }}>UPDATE NOW</Text>
                    </TouchableOpacity>
                </View>
                : undefined
            }
            {loading ?
                <Loader />
                : undefined
            }
            <AddressModal
                addressModalVisible={addressModalVisible}
                setAddressModalVisible={(option) => setAddressModalVisible(option)}
                navigation={navigation}
                navigateTo="MapScreenGrabPincode"
            />
            <SetDeliveryLocationModal
                navigation={navigation}
                deliveryLocationModalVisible={deliveryLocationModalVisible}
                setDeliveryLocationModalVisible={(option) => setDeliveryLocationModalVisible(option)} />
        </>
    );
}

const mapStateToProps = (state) => ({
    categories: state.home.categories,
    bannerImages: state.home.bannerImages,
    config: state.config.config,
    userLocation: state.location,
    homeScreenLocation: state.homeScreenLocation,
    isAuthenticated: state.auth.isAuthenticated,
    allUserAddress: state.auth.allUserAddress,
})


export default connect(mapStateToProps, { getAllCategories, getAllUserAddress, isPincodeServiceable, getCustomerDetails, onLogout, getAllBanners, addHomeScreenLocation, getCartItemsApi, addCustomerDeviceDetails })(HomeScreen)
const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 10
    },
});
