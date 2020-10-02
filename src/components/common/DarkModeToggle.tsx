import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { setDarkMode } from "../../actions/dark";
import Switch from '../../lib/react-native-switch-pro';
import { connect } from 'react-redux';

const DarkModeToggle = ({ darkMode, setDarkMode }: any) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 5 }}>
            <View style={{ backgroundColor: '#D8DADF', padding: 5, borderRadius: 100 }}>
                <MaterialIcons name="brightness-2" style={{
                    color: 'black', alignItems: 'center', fontSize: 18,
                    transform: [{ rotate: '160deg' }]
                }} onPress={() => setDarkMode(!darkMode)} />
            </View>
            <Switch
                value={darkMode}
                style={{ marginLeft: 10 }}
                onSyncPress={() => setDarkMode(!darkMode)} />
        </View>
    )
}
const mapStateToProps = (state: any) => ({
    darkMode: state.dark
})
export default connect(mapStateToProps, { setDarkMode })(DarkModeToggle)


const styles = StyleSheet.create({})
