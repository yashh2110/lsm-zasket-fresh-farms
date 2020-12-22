import { connect } from "react-redux"
import React, { useEffect, useState } from 'react';
import Navigate from './navigation/Routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StatusBar, Platform } from 'react-native';
import Theme from "./styles/Theme";
import { Modal } from 'react-native';
import Collapsible from 'react-native-collapsible';
import NoInternetModal from './components/common/NoInternetModal';
import NetInfo from "@react-native-community/netinfo";
import { getV2Config } from '../src/actions/home'
import { appVersion } from "../env";
import UpdateModal from "./components/common/UpdateModal";
import SplashScreen from 'react-native-splash-screen'

const AppContainer = ({ darkMode, getV2Config }) => {

    const [connection_Status, setConnection_Status] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected == false) {
                setConnection_Status(true)
            } else if (state.isConnected == true) {
                setConnection_Status(false)
            }
        });

        SplashScreen.hide()
    }, [])



    useEffect(() => {
        getV2Config((res, status) => {
            // alert(JSON.stringify(res.data, null, "      "))
            if (status) {
                if (res?.data?.appVersion !== appVersion) {
                    if (res?.data?.appForceUpdate) {
                        setUpdateModal(true)
                    } else {
                        // alert("A new version of app is available in Playstore")
                    }
                }
            } else {
                // alert(JSON.stringify(res.response, null, "      "))
                // alert("Internal server error")
            }
        })
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: darkMode ? Theme.Dark.backgroundColor : "white" }}>
            <StatusBar
                barStyle={darkMode ? "light-content" : "dark-content"}
                backgroundColor={darkMode ? Theme.Dark.backgroundColor : "white"}
            />
            <SafeAreaView style={{ flex: 1 }}>
                {/* <Collapsible collapsed={!connection_Status} duration={80}>
                    <View style={{ width: '100%', height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>No Internet Connection</Text>
                    </View>
                </Collapsible> */}
                <Navigate />
                <Modal visible={connection_Status} animationType={"fade"} transparent={true}>
                    <NoInternetModal />
                </Modal>
                <Modal visible={updateModal} animationType={"fade"} transparent={true}>
                    <UpdateModal />
                </Modal>
            </SafeAreaView>
        </View>
    )
}

const mapStateToProps = (state) => ({
    darkMode: state.dark
})

export default connect(mapStateToProps, { getV2Config })(AppContainer)