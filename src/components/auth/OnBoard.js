import LottieView from 'lottie-react-native';
import { Button, Text } from "native-base";
import React from 'react';
import { Image, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider';
import { connect } from 'react-redux';
import { setDarkMode } from "../../actions/dark";
import AsyncStorage from '@react-native-community/async-storage';
import Theme from '../../styles/Theme';
import { Icon } from 'native-base';
import { AuthContext } from '../../navigation/Routes';
import { CheckGpsState, CheckPermissions } from '../../utils/utils';

const OnBoard = ({ navigation, darkMode, setDarkMode, login, isAuthenticated }) => {
    const { setOnBoardKey } = React.useContext(AuthContext);

    const _onDone = async () => {
        // await AsyncStorage.setItem('onBoardKey', 'onBoardKey');
        // navigation.pop()
        navigation.navigate("AuthRoute")
    }

    const onSkip = async () => {
        AsyncStorage.setItem('onBoardKey', 'onBoardKey')
        navigation.navigate("BottomTabRoute")
    }

    const onPressSetDeliveryLocation = () => {
        // CheckGpsState((status) => {
        //     if (status) {
        //         navigation.navigate('AutoCompleteLocationScreen', { fromScreen: 'OnBoardScreen' })
        //     }
        // })
        CheckPermissions((status) => {
            if (status) {
                alert('go to map screen')
            } else {
                alert('search location screen')
                // navigation.navigate('AutoCompleteLocationScreen', { fromScreen: 'OnBoardScreen' })
            }
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar translucent backgroundColor="transparent" />
            {/* <TouchableOpacity onPress={() => { onSkip() }} style={{ backgroundColor: '#FDEFEF', position: 'absolute', top: 20, right: 20, paddingVertical: 5, borderRadius: 25, zIndex: 1 }}>
                <Text style={{ color: Theme.Colors.primary, paddingHorizontal: 10, fontWeight: 'bold' }}>Skip <Icon name="right" type="AntDesign" style={{ fontSize: 13, marginLeft: 10, color: Theme.Colors.primary }} /></Text>
            </TouchableOpacity> */}
            <Image
                style={{ width: 150, height: 60, position: 'absolute', left: 20, zIndex: 1, top: "2.5%" }}
                resizeMode="contain"
                source={require('../../assets/png/logo.png')}
            />
            <Image
                style={{ height: "60%", width: "100%" }}
                source={require('../../assets/png/onBoard.png')}
            />
            <View style={{ flex: 1, alignItems: 'center', marginTop: "10%" }}>
                <Text style={{ fontSize: 20 }}>Welcome!</Text>
                {/* <Text style={{ textAlign: 'center', color: "#727272", marginTop: 10 }}>We care about your health,</Text> */}
                <Text style={{ textAlign: 'center', color: "#727272", marginTop: 5 }}>Get fresh fruits and vegetables at wholesale price, free to your home.</Text>
                <Button full style={{ backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, marginTop: "10%", }} onPress={() => onPressSetDeliveryLocation()}><Text style={{ textTransform: 'uppercase' }}>SET DELIVERY LOCATION</Text></Button>
                <Text onPress={() => _onDone()} style={{ textAlign: 'center', color: "#727272", marginTop: 10, }}>Have an account? <Text style={{ color: Theme.Colors.primary }}>Login/Signup</Text></Text>
            </View>
        </View>
    );
}
const mapStateToProps = (state) => ({
    darkMode: state.dark,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { setDarkMode })(OnBoard)
const styles = StyleSheet.create({
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        backgroundColor: "rgba(0, 0, 0, .2)"
    },
    activeDotStyle: {
        backgroundColor: "white"
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
    },
    image: {
        width: 320,
        height: 320,
        marginVertical: 32,
    },
    text: {
        color: 'white',
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});