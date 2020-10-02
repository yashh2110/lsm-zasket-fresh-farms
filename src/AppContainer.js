import { connect } from "react-redux"
import React, { useEffect, useState } from 'react';
import Navigate from './navigation/Routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StatusBar } from 'react-native';
import Theme from "./styles/Theme";
import { Modal } from 'react-native';
import Collapsible from 'react-native-collapsible';
import NoInternetModal from './components/common/NoInternetModal';
import NetInfo from "@react-native-community/netinfo";

const AppContainer = ({ darkMode }) => {

    const [connection_Status, setConnection_Status] = useState(false)
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected == false) {
                setConnection_Status(true)
            } else if (state.isConnected == true) {
                setConnection_Status(false)
            }
        });
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: darkMode ? Theme.Dark.backgroundColor : "white" }}>
            <StatusBar
                barStyle={darkMode ? "light-content" : "dark-content"}
                backgroundColor={darkMode ? Theme.Dark.backgroundColor : "white"}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <Collapsible collapsed={!connection_Status} duration={80}>
                    <View style={{ width: '100%', height: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>No Internet Connection</Text>
                    </View>
                </Collapsible>
                <Navigate />
                <Modal visible={connection_Status} animationType={"fade"} transparent={true}>
                    <NoInternetModal />
                </Modal>
            </SafeAreaView>
        </View>
    )
}

const mapStateToProps = (state) => ({
    darkMode: state.dark
})

export default connect(mapStateToProps, {})(AppContainer)