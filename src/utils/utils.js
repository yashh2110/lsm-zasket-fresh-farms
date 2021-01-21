import { Alert, Linking, Platform } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import GPSState from 'react-native-gps-state'

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
                // Alert.alert(
                //     "Turn On Location Services to Allow \"Swiggy\" to Determine Your Location",
                //     "Enable location services on your device inside Settings -> Privacy -> Location Services",
                //     [
                //         {
                //             text: "Cancel",
                //             onPress: () => console.log("Cancel Pressed"),
                //             style: "cancel"
                //         },
                //         { text: "Settings", onPress: () => Linking.openURL('App-Prefs:{3}') }
                //     ],
                //     { cancelable: true }
                // );
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
