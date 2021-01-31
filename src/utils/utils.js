import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import GPSState from 'react-native-gps-state'
import Geolocation from '@react-native-community/geolocation';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNLocation from 'react-native-location';

export const CheckGpsState = async (callback, prompt = true) => {
    GPSState.getStatus().then((status) => {
        if (status == 3 || status == 4) {
            callback(true)
        } else {
            if (prompt) {
                if (Platform.OS == "android") {
                    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                        interval: 10000,
                        fastInterval: 5000,
                    })
                        .then((data) => {
                            callback(true)
                        })
                        .catch((err) => {
                            callback(false)
                        });
                } else if (Platform.OS == "ios") {
                    if (prompt) {
                        iosGpsAlert((status) => {
                            callback(status)
                        })
                    }
                    callback(false)
                }
            } else {
                callback(false)
            }
        }
    });
}

const iosPermissionAlert = (callback) => {
    Alert.alert(
        "Enable location services",
        "Please go to Settings and enable location services for Zasket",
        [
            {
                text: "Cancel",
                onPress: () => { callback(false) },
                style: "cancel"
            },
            {
                text: "Settings", onPress: () => {
                    callback(false)
                    Linking.openURL('app-settings:')
                }
            }
        ],
        { cancelable: true }
    );
}

const iosGpsAlert = (callback) => {
    Alert.alert(
        "Turn On Location Services to Allow \"Zasket\" to Determine Your Location",
        "Enable location services on your device inside Settings -> Privacy -> Location Services",
        [
            { text: "OK, GOT IT!", onPress: () => { callback(false) } }
        ],
        { cancelable: true }
    );
}

export const CheckPermissions = async (callback, prompt = true) => {
    if (Platform.OS === 'ios') {
        RNLocation.requestPermission({
            ios: "whenInUse",
            android: {
                detail: "coarse"
            }
        }).then(granted => {
            if (granted) {
                CheckGpsState((status) => {
                    if (status) {
                        callback(true)
                    }
                }, prompt)
            } else {
                check(PERMISSIONS.IOS.LOCATION_ALWAYS)
                    .then((result) => {
                        switch (result) {
                            case RESULTS.UNAVAILABLE:
                                if (prompt) {
                                    iosGpsAlert((status) => {
                                        callback(status)
                                    }, prompt)
                                } else {
                                    callback(false)
                                }
                                console.warn('This feature is not available (on this device / in this context)');
                                break;
                            case RESULTS.DENIED:
                                if (prompt) {
                                    iosPermissionAlert((status) => {
                                        callback(status)
                                    })
                                } else {
                                    callback(false)
                                }
                                console.warn('The permission has not been requested / is denied but requestable');
                                break;
                            case RESULTS.LIMITED:
                                if (prompt) {
                                    iosPermissionAlert((status) => {
                                        callback(status)
                                    })
                                } else {
                                    callback(false)
                                }
                                console.warn('The permission is limited: some actions are possible');
                                break;
                            case RESULTS.GRANTED:
                                console.warn('The permission is granted');
                                CheckGpsState((status) => {
                                    if (status) {
                                        callback(true)
                                    }
                                }, prompt)
                                break;
                            case RESULTS.BLOCKED:
                                if (prompt) {
                                    iosPermissionAlert((status) => {
                                        callback(status)
                                    })
                                } else {
                                    callback(false)
                                }
                                console.warn('The permission is denied and not requestable anymore');
                                break;
                        }
                    })
                    .catch((error) => {
                        // …
                        callback(false)
                    });
            }
        })
        // Geolocation.requestAuthorization();

    } else {
        let androidGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (androidGranted === PermissionsAndroid.RESULTS.GRANTED) {
            // Permission Granted
            // Check for gps state


            CheckGpsState((status) => {
                if (status) {
                    callback(true)
                } else {
                    callback(false)
                }
            }, prompt)
        } else {

            if (prompt) {
                Alert.alert(
                    "Zasket needs to access location",
                    "Please permit the permission through Settings screen. Select Permissions -> Enable permission",
                    [
                        {
                            text: "Cancel",
                            onPress: () => callback(false),
                            style: "cancel"
                        },
                        {
                            text: "OK", onPress: () => {
                                callback(false)
                                Linking.openSettings()
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                callback(false)
            }
        }

    }
}



// const iosGpsAlert = (callback) => {
//     Alert.alert(
//         "Turn On Location Services to Allow \"Zasket\" to Determine Your Location",
//         "Enable location services on your device inside Settings -> Privacy -> Location Services",
//         [
//             {
//                 text: "Settings", onPress: () => {
//                     callback(false)
//                     Linking.openURL('App-Prefs:LOCATION_SERVICES')
//                     // Linking.openURL('App-Prefs:{3}')
//                 }
//             },
//             {
//                 text: "Cancel",
//                 onPress: () => { callback(false) },
//                 style: "cancel"
//             }
//         ],
//         { cancelable: true }
//     );
// }