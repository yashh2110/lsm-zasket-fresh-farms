import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, ScrollView, Alert, SectionList, FlatList, RefreshControl, BackHandler, Platform, PermissionsAndroid, DeviceEventEmitter, Linking } from 'react-native';
import { Icon } from 'native-base';
import { AuthContext } from "../../navigation/Routes"
import Swiper from 'react-native-swiper';
import Theme from '../../styles/Theme';
import { getAllCategories, isPincodeServiceable, getCustomerDetails, getAllBanners } from '../../actions/home'
import { onLogout } from '../../actions/auth'
import { connect } from 'react-redux';
import CategorySectionListItem from './CategorySectionListItem';
import Loader from '../common/Loader';
import DarkModeToggle from '../common/DarkModeToggle';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { androidAppVersion, iosAppVersion, MapApiKey } from '../../../env';
import { addHomeScreenLocation } from '../../actions/homeScreenLocation'
import { getCartItemsApi } from '../../actions/cart'
import FeatherIcons from "react-native-vector-icons/Feather"
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
const HomeScreen = ({ addHomeScreenLocation, getAllCategories, isPincodeServiceable, getAllBanners, isAuthenticated, getCustomerDetails, bannerImages, categories, navigation, userLocation, onLogout, config, homeScreenLocation, getCartItemsApi }) => {
    const [showAppUpdate, setShowAppUpdate] = useState(false)
    useEffect(() => {
        if (Platform.OS == "android") {
            if (config?.androidAppVersion !== androidAppVersion) {
                setShowAppUpdate(true)
            }
        }
        if (Platform.OS == "ios") {
            if (config?.iosAppVersion !== iosAppVersion) {
                setShowAppUpdate(true)
            }
        }
    }, [config])

    useEffect(() => {
        const _bootstrapAsync = async () => {
            if (Platform.OS === 'ios') {
                Geolocation.requestAuthorization();
                // alert('work')
            } else {
                enableGpsLocation()
                DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
                    enableGpsLocation()
                    console.warn(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
                });
            }
            const onBoardKey = await AsyncStorage.getItem('onBoardKey');
            if (!onBoardKey) {
                navigation.navigate('OnBoardScreen')
            } else {
                // navigation.navigate('BottomTabRoute')
            }
        };
        _bootstrapAsync()
    }, [])
    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         // alert(JSON.stringify(homeScreenLocation))
    //         if (homeScreenLocation?.addressLine_1 == undefined || homeScreenLocation?.addressLine_1 == "") {
    //             setTimeout(() => {
    //                 checkForLocationAccess();
    //             }, 1000);
    //         }
    //     });
    //     return unsubscribe;
    // }, [navigation]);
    const enableGpsLocation = () => {
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2 style='color: #0af13e'>Use Location ?</h2>Zasket wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location",
            ok: "YES",
            cancel: "No",
            enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
            showDialog: true, // false => Opens the Location access page directly
            openLocationServices: true, // false => Directly catch method is called if location services are turned off
            preventOutSideTouch: true, // true => To prevent the location services window from closing when it is clicked outside
            preventBackClick: true, // true => To prevent the location services popup from closing when it is clicked back button
            providerListener: true // true ==> Trigger locationProviderStatusChange listener when the location state changes
        }).then(async (success) => {
            checkForLocationAccess()
            console.warn(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
        }).catch((error) => {
            console.warn(error.message); // error.message => "disabled"
            BackHandler.exitApp()
        });
    }

    const checkForLocationAccess = async () => {
        if (Platform.OS === 'android') {
            // Calling the permission function
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Zasket App Location Permission',
                    message: 'Zasket App needs access to your location',
                    buttonPositive: "Ok"
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Permission Granted
                getCurrentPosition();
            } else {
                // Permission Denied
                // alert('Permission Denied');
                navigation.navigate('PincodeScreen')
            }
        }
    }
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [pincodeError, setPincodeError] = useState(false)

    useEffect(() => {
        initialFunction()
        if (homeScreenLocation?.addressLine_1 == undefined || homeScreenLocation?.addressLine_1 == "") {
            getCurrentPosition()
        }
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
        if (userLocation?.addressLine_1) {
            setPincodeError(false)
        }
    }, [userLocation])

    useEffect(() => {
        if (homeScreenLocation?.pincode) {
            isPincodeServiceable(homeScreenLocation?.pincode, (res, status) => {
                if (status) {
                    setPincodeError(false)
                } else {
                    setPincodeError(true)
                }
            })
        }
    }, [homeScreenLocation])

    const getCurrentPosition = async () => {
        try {
            if (homeScreenLocation?.addressLine_1 == undefined || homeScreenLocation?.addressLine_1 == "") {
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
                                    isPincodeServiceable(postal_code?.long_name, (res, status) => {
                                        if (status) {
                                        } else {
                                            setPincodeError(true)
                                        }
                                    })
                                });
                            }).catch((err) => {
                                console.warn(err)
                            })
                    },
                    (error) => {
                        if (error?.message == "Location permission was not granted.") {
                            navigation.navigate('PincodeScreen')
                        }
                        console.warn(error)
                    }
                );
            }
        } catch (e) {
            alert(e.message || "");
        }
    };

    const onRefresh = () => {
        setRefresh(true)
        initialFunction()
    }

    const onPressLogout = async () => {
        navigation.navigate("OnBoardScreen")
        await onLogout()
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
    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingHorizontal: 10, flexWrap: 'wrap' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('MapScreenGrabPincode', { fromScreen: 'HomeScreen' }) }} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
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
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="warning" type="AntDesign" style={{ fontSize: 22, color: 'white' }} />
                            <Text style={{ color: 'white' }}> We are not available at this location!</Text>
                        </View>
                        <TouchableOpacity onPress={() => { navigation.navigate('MapScreenGrabPincode', { fromScreen: "HomeScreen" }) }} style={{ backgroundColor: '#DD4C55', paddingHorizontal: 5, paddingVertical: 4, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Change</Text>
                        </TouchableOpacity>
                    </View>
                    : undefined}
                {/* <View style={{ height: 160, justifyContent: 'center', alignItems: 'center', marginTop: 10, }}>
                    <Swiper
                        autoplay={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        autoplayTimeout={5}
                        activeDotColor={"#505E68"}
                        dotStyle={{ bottom: -26, height: 6, width: 6 }}
                        activeDotStyle={{ bottom: -26, height: 6, width: 6 }}
                    >
                        <Image
                            style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center' }}
                            // resizeMode={"stretch"}
                            source={require('../../assets/png/HomeScreenBanner1.png')}
                        />
                        <Image
                            style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center' }}
                            // resizeMode={"stretch"}
                            source={require('../../assets/png/HomeScreenBanner2.png')}
                        />
                    </Swiper>
                </View>*/}
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 5 }}>
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
                </ScrollView>
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
                    style={{ borderRadius: 5, alignSelf: 'center', borderRadius: 5, backgroundColor: 'white', height: 115, aspectRatio: 3 }}
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

                {/* <Text>{JSON.stringify(sectionlistData, null, "      ")}</Text> */}
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
        </>
    );
}

const mapStateToProps = (state) => ({
    categories: state.home.categories,
    bannerImages: state.home.bannerImages,
    config: state.config.config,
    userLocation: state.location,
    homeScreenLocation: state.homeScreenLocation,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { getAllCategories, isPincodeServiceable, getCustomerDetails, onLogout, getAllBanners, addHomeScreenLocation, getCartItemsApi })(HomeScreen)
const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 10
    },
});
