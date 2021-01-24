import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import GPSState from 'react-native-gps-state'
import Geolocation from '@react-native-community/geolocation';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { call } from 'react-native-reanimated';

export const CheckGpsState = async (callback) => {
    GPSState.getStatus().then((status) => {
        if (status == 3 || status == 4) {
            callback(true)
        } else {
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
                Alert.alert(
                    "Turn On Location Services to Allow \"Swiggy\" to Determine Your Location",
                    "Enable location services on your device inside Settings -> Privacy -> Location Services",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "Settings", onPress: () => Linking.openURL('App-Prefs:{3}') }
                    ],
                    { cancelable: true }
                );
                // Alert.alert(
                //     "Enable Location Services",
                //     "Enable location services on your device inside Settings -> Privacy -> Location Services",
                //     [
                //         { text: "OK, GOT IT!", onPress: () => console.log("OK Pressed") }
                //     ],
                //     { cancelable: false }
                // );
                callback(false)
            }
        }
    });
}

export const CheckPermissions = async (callback) => {
    if (Platform.OS === 'ios') {
        check(PERMISSIONS.IOS.LOCATION_ALWAYS)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        alert('This feature is not available (on this device / in this context)');
                        callback(false)
                        break;
                    case RESULTS.DENIED:
                        alert('The permission has not been requested / is denied but requestable');
                        callback(false)
                        break;
                    case RESULTS.LIMITED:
                        alert('The permission is limited: some actions are possible');
                        callback(false)
                        break;
                    case RESULTS.GRANTED:
                        alert('The permission is granted');
                        CheckGpsState((status) => {
                            if (status) {
                                callback(true)
                            }
                        })
                        break;
                    case RESULTS.BLOCKED:
                        alert('The permission is denied and not requestable anymore');
                        callback(false)
                        break;
                }
            })
            .catch((error) => {
                // …
                callback(false)
            });
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
            })
        } else {
            callback(false)
            // Alert.alert(
            //     "Zasket needs to access location",
            //     "Please permit the permission through Settings screen. Select Permissions -> Enable permission",
            //     [
            //         {
            //             text: "Cancel",
            //             onPress: () => console.log("Cancel Pressed"),
            //             style: "cancel"
            //         },
            //         { text: "OK", onPress: () => Linking.openSettings() }
            //     ],
            //     { cancelable: false }
            // );
        }

    }
}
