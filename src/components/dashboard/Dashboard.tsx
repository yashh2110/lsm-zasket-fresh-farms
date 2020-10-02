import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import DarkModeToggle from '../common/DarkModeToggle';
import { connect } from 'react-redux';
import { setDarkMode } from "../../actions/dark";
import Theme from '../../styles/Theme';

const Dashboard = ({ navigation, darkMode }) => {
    return (
        <View style={[styles.container, { backgroundColor: darkMode ? Theme.Dark.backgroundColor : "white" }]}>
            <DarkModeToggle />
            <Text style={[{ fontWeight: 'bold', marginVertical: 20 }, (darkMode) ? styles.darkTextColor : null]}>Dashboard</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>This app contains</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Redux Setup with Thunk and logger</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Redux Persist</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Dark Mode & Light Mode option</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Lottie Animations</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} No internet modal</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Axios instance service with interceptor</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Bottom Navigation</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Infinite loading</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Pagination Loading</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Snapshot Testing</Text>
            {/* <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Custom Alert</Text> */}
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Language setup</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Responsive issues statusbar fix</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Google Maps</Text>
            <Text style={[styles.text, { marginTop: 20 }, (darkMode) ? styles.darkTextColor : null]}>{"->"} Facebook Login</Text>
            <Text style={[styles.text, (darkMode) ? styles.darkTextColor : null]}>{"->"} Google Login</Text>
        </View>
    )
}
const mapStateToProps = (state) => ({
    darkMode: state.dark
})

export default connect(mapStateToProps, { setDarkMode })(Dashboard)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20
    },
    text: {

    },
    darkTextColor: {
        color: "white"
    }
})
