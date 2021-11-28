import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Dimensions, Image, ScrollView, Alert, SectionList, FlatList, RefreshControl, BackHandler, Platform, PermissionsAndroid, DeviceEventEmitter, Linking, } from 'react-native';
import { Icon } from 'native-base';
import { AuthContext } from "../../navigation/Routes"
import Swiper from 'react-native-swiper';
import Theme from '../../styles/Theme';
import { getAllCategories, isPincodeServiceable, getCustomerDetailsLanAndLon, getAllBanners, addCustomerDeviceDetails } from '../../actions/home'
import { getBillingDetails } from '../../actions/cart'
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
import RNUxcam from 'react-native-ux-cam';
import firebase from '@react-native-firebase/app'
import Share from 'react-native-share';
import FastImage from 'react-native-fast-image'
import dynamicLinks from '@react-native-firebase/dynamic-links';

RNUxcam.startWithKey('qercwheqrlqze96'); // Add this line after RNUxcam.optIntoSchematicRecordings();
RNUxcam.optIntoSchematicRecordings();
RNUxcam.tagScreenName('homeScreen');
const HomeScreen = ({ route, cartItems, homeScreenLocation, getCustomerDetailsLanAndLon, getOrdersBillingDetails, addHomeScreenLocation, getBillingDetails, getAllCategories, getAllUserAddress, isPincodeServiceable, getAllBanners, isAuthenticated, allUserAddress, bannerImages, addCustomerDeviceDetails, categories, navigation, userLocation, onLogout, config, getCartItemsApi }) => {
    const { setOnBoardKey, removeOnBoardKey } = React.useContext(AuthContext);
    const [dynamicLink, setDynamicLink] = useState("")
    const [productId, setProductId] = useState("")
    const [subBanners, setSubBanners] = useState("")
    const [partnerDetails, setPartnerDetails] = useState("")
    // useEffect(() => {
    //     // let userDetails = await AsyncStorage.getItem('ProductId');
    //     // alert(userDetails)
    //     getIntialFunction()

    // })
    // const getIntialFunction = async () => {
    //     let userDetails = await AsyncStorage.getItem('ProductId');
    //     alert(userDetails)

    // }
    const { width: screenWidth } = Dimensions.get('window');
    useEffect(() => {
        // alert(JSON.stringify(getOrdersBillingDetails, null, "      "))
        initalCustomerDetails()
        console.log("112312312312312", JSON.stringify(getOrdersBillingDetails.discountedPrice, null, "   "))
        // alert(JSON.stringify(homeScreenLocation, null, "   "))
    }, [])
    const initalCustomerDetails = async () => {
        setLoading(true)
        getCustomerDetailsLanAndLon(homeScreenLocation, async (res, status) => {
            // alert("asdkfhiu")
            if (status) {
                // alert(JSON.stringify(res?.data?.assignedPartnerInfo, null, "   "))
                // alert(JSON.stringify(res?.data, null, "       "))
                setPartnerDetails(res?.data?.assignedPartnerInfo)
                // setUserDetails(res?.data)
                await AsyncStorage.setItem('userDetails', JSON.stringify(res?.data))
                setRefresh(false)
                setLoading(false)

            } else {
                setUserDetails({})
                setRefresh(false)
                setLoading(false)

            }
        })
    }
    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
        dynamicLinks()
            .getInitialLink()
            .then(link => {
                if (link) {
                    var regex = /[?&]([^=#]+)=([^&#]*)/g,
                        params = {},
                        match;
                    while (match = regex.exec(link.url)) {
                        params[match[1]] = match[2];
                    }
                    console.log("params?.referralCodeparams?.referralCode", params)

                    if (params?.referralCode) {
                        console.log("params?.referralCodeparams?.referralCode", params?.referralCode)
                        AsyncStorage.setItem('referralCode', params?.referralCode);
                    }
                    if (params?.productDetails) {
                        // alert(JSON.stringify(params))
                        navigation.navigate("ProductDetailScreen", { item: params?.productDetails })
                    }
                }
            });

        return () => {
            unsubscribe()
        }
    }, [])
    const handleDynamicLink = (link) => {
        if (link) {
            spreatereferral(link)

        }
    };
    const spreatereferral = (link) => {
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
        while (match = regex.exec(link.url)) {
            params[match[1]] = match[2];
        }
        // console.log(params.referralCode)
        if (params?.productDetails) {
            // alert(JSON.stringify(params))
            navigation.navigate("ProductDetailScreen", { item: params?.productDetails })
        }
        // setReferralCode(params.referralCode)
    }
    useEffect(() => {
        // alert(JSON.stringify(route, null, "        "))
        generateLink()

    }, [])
    const generateLink = async () => {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let referralCode = await parsedUserDetails?.customerDetails?.referralCode
        try {
            const link = await firebase.dynamicLinks().buildShortLink({
                link: `https://zasket.page.link?banner=${'HomePage'}`,
                // link: `https://play.google.com/store/apps/details?id=com.zasket/?${SENDER_UID}`,
                android: {
                    packageName: 'com.zasket',
                },
                ios: {
                    bundleId: 'com.freshleaftechnolgies.zasket',
                    appStoreId: '1541056118',
                },
                domainUriPrefix: 'https://zasket.page.link',
            });
            setDynamicLink(link)
            console.log("111111212121212121212", link)
        } catch (error) {
            alert(error)
        }
    }

    useEffect(() => {
        // alert(JSON.stringify(bannerImages, null, "       "))
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
    const [addressResult, setAddressResult] = useState([])
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
                // alert(JSON.stringify(res?.data?.subBanners[0], null, "      "))
                setSubBanners(res?.data?.subBanners[0])
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
                            let address_components = json?.results?.[0].address_components
                            let value = address_components.filter(product => product.types.some(item => (item === 'route' || item === 'sublocality_level_1' || item === 'sublocality_level_2' || item === 'locality' || item === 'administrative_area_level_2' || item === 'administrative_area_level_1' || item === 'postal_code' || item === 'country')));
                            await setAddressResult(value)
                            // console.log("addressResultaddressResultaddressResult", addressResult)
                            let address = addressResult.map((el, index) => {
                                return (
                                    el.long_name
                                )
                            })
                            addHomeScreenLocation({
                                addressLine_1: address.toString(),
                                pincode: postal_code?.long_name,
                                lat: position.coords.latitude,
                                lon: position.coords.longitude
                            })
                            // await this.setLocation(json?.results?.[2]?.formatted_address, position.coords.latitude, position.coords.longitude, postal_code?.long_name)
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
    useEffect(() => {
        // alert(JSON.stringify(cartItems, null, "     "))
        if (cartItems.length > 0) {
            initialBillingFunction()
        }
    }, [cartItems])

    const initialBillingFunction = async () => {
        let itemCreateRequests = []
        let validateOrders = {
            // itemCreateRequests,
            "useWallet": false

        }
        await cartItems?.forEach((el, index) => {
            itemCreateRequests.push({
                "itemId": el?.id,
                "quantity": el?.count,
                // "totalPrice": el?.discountedPrice * el?.count,
                // "unitPrice": el?.discountedPrice
            })
        })
        // console.log("allll", JSON.stringify(validateOrder, null, "      "))
        // alert(JSON.stringify(validateOrder, null, "      "))
        getBillingDetails(validateOrders, async (res, status) => {
            if (status) {
                console.log("getorderssssssss", JSON.stringify(res.data, null, "      "))
                setLoading(false)
                setRefresh(false)
            } else {
                setRefresh(false)
                setLoading(false)
            }
        })
    }
    const shareBanner = (id) => {
        alert(id)
    }
    const moreShare = async (imagePath, shareMessage) => {
        // alert(shareMessage)
        // return
        const toDataURL = (url) => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }))
        await toDataURL(imagePath)
            .then(async (dataUrl) => {
                let split = dataUrl.split("base64,")
                // await setbase64Image(split[1])
                let shareImage = {
                    title: "Zasket",//string
                    message: `${shareMessage}: ` + dynamicLink,
                    url: `data:image/png;base64,${split[1]}`,
                }
                // alert(JSON.stringify(shareImage, null, "            "))
                Share.open(shareImage)
                    .then((res) => {
                    })
                    .catch((err) => {
                    });
            })
    }
    // const { productId } = route?.params;

    const OnPressWhatsUpGrups = (Url) => {
        Linking.openURL(Url);
        // alert(Url)
        // Linking.openURL('whatsapp://send?text=' + this.state.msg + '&phone=91' + this.state.mobile_no);
        // if (Platform.OS == "android") {
        // Linking.canOpenURL('https://chat.whatsapp.com/I6YikomYujr0v9b9JeI2wp').then(supported => {
        //     if (supported) {

        //     } else {
        //         // alert("nott")
        //         console.warn("Don't know how to open URI");
        //     }
        // });
        // }
    }


    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }>
                {/* <Text>{partnerDetails?.partnerStoreName}</Text> */}
                {
                    (partnerDetails?.partnerStoreName == "" || partnerDetails?.partnerStoreName == null || partnerDetails?.partnerStoreName == undefined) ?
                        null
                        :
                        <>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingHorizontal: 10, flexWrap: 'wrap' }}>
                                <TouchableOpacity onPress={() => { navigation.navigate('AutoCompleteLocationScreen', { navigateTo: "MapScreenGrabPincode" }) }} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                                    <Image
                                        style={{ height: 18, alignSelf: "flex-start", width: 20 }}
                                        resizeMode="center"
                                        source={require('../../assets/png/HomeIconInactive.png')}
                                    />
                                    <Text numberOfLines={1} style={{ maxWidth: '50%', marginLeft: 5 }}>{partnerDetails?.partnerStoreName}</Text>
                                    <Icon name="arrow-drop-down" type="MaterialIcons" style={{ fontSize: 22 }} />
                                </TouchableOpacity>

                            </View>
                            <TouchableOpacity onPress={() => { OnPressWhatsUpGrups(partnerDetails?.partnerWhatsappGroupLink) }} style={{ position: "absolute", right: 0, top: 0, height: 50 }}>
                                <Image
                                    style={{ height: 25, }}
                                    resizeMode="center"
                                    source={require('../../assets/png/aaaaaa.png')}
                                />
                            </TouchableOpacity>
                        </>
                }

                <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingHorizontal: 10, flexWrap: 'wrap' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('AutoCompleteLocationScreen', { navigateTo: "MapScreenGrabPincode" }) }} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                        <Icon name="location-pin" type="Entypo" style={{ fontSize: 22 }} />
                        <Text numberOfLines={1} style={{ maxWidth: '50%' }}>{homeScreenLocation?.addressLine_1}</Text>
                        <Icon name="arrow-drop-down" type="MaterialIcons" style={{ fontSize: 22 }} />
                    </TouchableOpacity>
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
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 10, marginTop: 5 }}>
                    {bannerImages?.map((el, index) => {
                        return (
                            <>
                                {/* <Text>{index}</Text> */}
                                <View style={{}}>
                                    <View style={{}}>
                                        <View style={{ height: 155, width: screenWidth - 50, borderRadius: 5, marginRight: index == 0 ? 18 : 15, marginLeft: index == 0 ? 0 : 2 }}>
                                            {
                                                el?.imagePath ?
                                                    <Image
                                                        style={{ height: 155, width: screenWidth - 50, borderRadius: 5, alignSelf: 'center', }}
                                                        // resizeMode={"stretch"}
                                                        source={{ uri: el?.imagePath }}
                                                    />
                                                    :
                                                    null

                                            }
                                            <TouchableOpacity activeOpacity={0.9} onPress={() => moreShare(el?.imagePath, el?.shareMessage)} style={{ position: "absolute", right: 5, bottom: 2, width: 110, height: 45, justifyContent: "center", alignItems: "center" }} onPress={() => moreShare(el?.imagePath, el?.shareMessage)}>
                                                <View style={{ borderRadius: 25, backgroundColor: "#F7F7F7", width: 80, height: 24, justifyContent: "center", alignItems: "center" }}>
                                                    <View style={{ flexDirection: "row", marginHorizontal: 1, padding: 5, justifyContent: "center", alignItems: "center", opacity: 0.8 }}>
                                                        <FastImage
                                                            style={{ width: 15, height: 15 }}
                                                            source={require('../../assets/png/share.png')}
                                                            resizeMode={FastImage.resizeMode.contain}
                                                        />
                                                        <Text style={{ marginHorizontal: 2, fontWeight: "bold", fontSize: 15 }}>Share</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </>
                        )
                    })}
                </ScrollView>
                {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 10, backgroundColor: "blue", flex: 1, justifyContent: "center" }}>
                    {bannerImages?.map((el, index) => {
                        return (
                            <>
                                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "orange", minWidth: 30 }}>
                                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "red", }}>

                                    </View>
                                </View>
                            </>
                        )
                    })}
                </ScrollView> */}


                {/* <View style={{ width: ("100%"), marginRight: 30 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 5 }}>
                        {bannerImages?.map((el, index) => {
                            return (
                                <>
                                    <Image
                                        style={{ height: 150, marginLeft: 7, width: 352, borderRadius: 10, borderRightWidth: 50, alignSelf: 'center', marginRight: bannerImages.length - 1 == index ? 0 : 8 }}
                                        source={{ uri: el?.imagePath }}
                                    />
                                </>
                            )
                        })}
                    </ScrollView> */}

                {/* <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", }}>
                        {bannerImages?.map((el, index) => {
                            return (
                                <>

                                    <View style={{ width: 10, height: 10, backgroundColor: "#e6e6e6", marginRight: 10, borderRadius: 5 }}>
                                    </View>

                                    <View style={{ width: 10, height: 10, backgroundColor: "#505d68", marginRight: 10, borderRadius: 5 }}>
                                    </View>
                                </>
                            )
                        })}
                    </View> */}
                {/* </View> */}
                {
                    subBanners ?
                        <FastImage
                            style={{
                                borderRadius: 5, alignSelf: 'center', borderRadius: 5, backgroundColor: 'white', height: 125, width: "112.5%",
                                // aspectRatio:3
                            }} source={subBanners ? { uri: subBanners } : null}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        :
                        undefined
                }

                <View style={{ flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 5, marginTop: -10 }}>

                    <FlatList
                        data={categories}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.navigate('ProductListScreen', { item: item }) }} style={{
                                    // justifyContent: 'center',
                                    // flex: 1,
                                    minHeight: 100,
                                    width: "31%",
                                    // alignItems: 'center',
                                    margin: 5,
                                    // backgroundColor: '#00BCD4'
                                }}>
                                    <View style={{ backgroundColor: '#F7F7F7', borderRadius: 6, borderColor: '#EDEDED', borderWidth: 1, }}>
                                        {
                                            item.categoryTag ?
                                                <>
                                                    <View style={{
                                                        height: 18, width: ("58%"), backgroundColor: "#7eb517", borderTopRightRadius: 6, borderBottomLeftRadius: 6, alignSelf: "flex-end",
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 1,
                                                        },
                                                        shadowOpacity: 0.18,
                                                        shadowRadius: 1.00,
                                                        elevation: 0.8,
                                                        marginRight: -1,
                                                        marginTop: -1,
                                                        justifyContent: "center"
                                                    }}>
                                                        <Text style={{ fontSize: 9, textAlign: "center", color: "#f7f7f7", fontWeight: 'bold' }}>{item.categoryTag}</Text>

                                                    </View>

                                                </>
                                                :
                                                <View style={{
                                                    height: 18, width: ("58%"),
                                                }}>
                                                </View>
                                        }
                                        {/* <View style={[styles.categoriesCard, item.categories ? { padding: 9, marginTop: -5 } : undefined]}> */}

                                        <View style={{ padding: 10, marginTop: -8 }}>
                                            <Image
                                                style={{ aspectRatio: 1.3 }}
                                                // source={require('../../assets/png/HomeScreenVegetable.png')}
                                                resizeMode="contain"
                                                source={item?.categoryImage ?
                                                    { uri: item?.categoryImage } : require('../../assets/png/default.png')}
                                            />

                                        </View>
                                    </View>
                                    <Text style={{ alignSelf: 'center', textAlign: 'center', marginVertical: 5, fontWeight: 'bold', fontSize: 13 }}>{item?.categoryDisplayName}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        keyExtractor={item => item?.id.toString()}
                    />
                </View>



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
            {cartItems.length >= 1 ?
                <View style={{ width: "100%", backgroundColor: 'white', }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { navigation.navigate("CartStack") }} style={{ height: 55, width: "95%", backgroundColor: '#6ba040', flexDirection: 'row', borderRadius: 5, marginBottom: 8, alignSelf: "center", justifyContent: "space-between", padding: 8 }}>
                        <View style={{ marginLeft: 5 }}>
                            <Text style={{ fontWeight: "bold", color: "#ffffff", fontSize: 16 }}>{`₹ ${getOrdersBillingDetails.finalPrice}`}</Text>
                            <Text style={{ color: "#ffffff" }}>{`${cartItems.length} | Saved ₹ ${getOrdersBillingDetails?.marketPrice - getOrdersBillingDetails?.finalPrice}`}</Text>
                        </View>
                        <View style={{ flexDirection: "row", }}>
                            <Image
                                style={{ height: 40, width: 30, alignSelf: "center" }}
                                resizeMode="center"
                                source={require('../../assets/png/bagIcon.png')}
                            />
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ textAlign: "center", alignSelf: "center", color: "#ffffff", fontWeight: "bold", letterSpacing: 0.3, fontSize: 16 }}>Checkout</Text>
                                <Image
                                    style={{ height: 54, width: 20, alignSelf: "center" }}
                                    resizeMode="center"
                                    source={require('../../assets/png/rightWhiteIcon.png')}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>
                // rightWhiteIcon
                :
                undefined
            }
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
    cartItems: state.cart.cartItems,
    getOrdersBillingDetails: state.cart.getOrdersBillingDetails,

})


export default connect(mapStateToProps, { getBillingDetails, getAllCategories, getAllUserAddress, isPincodeServiceable, getCustomerDetailsLanAndLon, onLogout, getAllBanners, addHomeScreenLocation, getCartItemsApi, addCustomerDeviceDetails })(HomeScreen)
const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 10
    },
    categoriesCard: {
        padding: 10, marginTop: -5

    }
});

