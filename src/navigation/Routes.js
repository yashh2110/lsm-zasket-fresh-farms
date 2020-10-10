import 'react-native-gesture-handler';
import * as React from 'react';
import { connect } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from "../components/auth/Login"
import OtpScreen from "../components/auth/OtpScreen"
import EmailScreen from "../components/auth/EmailScreen"
import SignUp from "../components/auth/SignUp"
import OnBoard from "../components/auth/OnBoard"
import Dashboard from "../components/dashboard/Dashboard"
import { View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import HomeScreen from "../components/HomeScreen"
import InfiniteLoading from "../components/InfiniteLoading"
import SnapshotTestScreen from "../components/SnapshotTestScreen"
import LanguageChangeScreen from "../components/LanguageChangeScreen"
import MapScreen from "../components/MapScreen"
import SettingsScreen from "../components/SettingsScreen"
import Pagination from "../components/Pagination"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FeatherIcons from "react-native-vector-icons/Feather"
import CustomDrawerContent from "./CustomDrawerContent"
import Theme from '../styles/Theme';
import PincodeScreen from '../components/locationScreens/PincodeScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();




const Navigate = ({ alerts, darkMode }) => {

    const forFade = ({ current, closing }) => ({
        cardStyle: {
            opacity: current.progress,
        },
    });
    const AuthRoute = () => (
        <Stack.Navigator
            initialRouteName="OnBoardScreen"
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="OnBoardScreen" component={OnBoard} />
            <Stack.Screen name="Login" component={Login} options={{ cardStyleInterpolator: forFade }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ cardStyleInterpolator: forFade }} />
            <Stack.Screen name="EmailScreen" component={EmailScreen} options={{ cardStyleInterpolator: forFade }} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ cardStyleInterpolator: forFade }} />
            <Stack.Screen name="PincodeScreen" component={PincodeScreen} options={{ cardStyleInterpolator: forFade }} />
            <Stack.Screen name="MapScreen" component={MapScreen} options={{ cardStyleInterpolator: forFade }} />
        </Stack.Navigator>
    );



    const DrawerRoute = () => (
        <Drawer.Navigator
            initialRouteName="Dashboard"
            drawerContent={(props) => (
                <CustomDrawerContent {...props} />
            )}
        >
            <Drawer.Screen name="Dashboard" component={BottomTabRoute} />
            <Drawer.Screen name="Login" component={AuthRoute} />
        </Drawer.Navigator>
    )

    const BottomTabRoute = () => (
        <Tab.Navigator
            initialRouteName="Feed"
            tabBarOptions={{
                activeTintColor: darkMode ? "#42f44b" : "#000",
                activeBackgroundColor: darkMode ? Theme.Dark.backgroundColor : "#fff",
                inactiveBackgroundColor: darkMode ? Theme.Dark.backgroundColor : "#fff",
            }}>
            <Tab.Screen
                name="HomeStack"
                component={Dashboard}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="SettingsStack"
                component={SettingsStack}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <FeatherIcons name="settings" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )

    function HomeStack() {
        return (
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: { backgroundColor: '#42f44b' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Home Page' }}
                />
                <Stack.Screen
                    name="InfiniteLoading"
                    component={InfiniteLoading}
                    options={{ title: 'Details Page' }}
                />
            </Stack.Navigator>
        );
    }

    function SettingsStack() {
        return (
            <Stack.Navigator
                initialRouteName="Settings"
                screenOptions={{
                    // headerStyle: { backgroundColor: '#42f44b' },
                    // headerTintColor: '#fff',
                    // headerTitleStyle: { fontWeight: 'bold' },
                    headerShown: false
                }}>
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ title: 'Setting Page' }}
                />
                <Stack.Screen
                    name="InfiniteLoading"
                    component={InfiniteLoading}
                    options={{ title: 'Infinite Loading' }}
                />
                <Stack.Screen
                    name="Pagination"
                    component={Pagination}
                    options={{ title: 'Pagination' }}
                />
                <Stack.Screen
                    name="SnapshotTestScreen"
                    component={SnapshotTestScreen}
                    options={{ title: 'SnapshotTestScreen' }}
                />
                <Stack.Screen
                    name="LanguageChangeScreen"
                    component={LanguageChangeScreen}
                    options={{ title: 'LanguageChangeScreen' }}
                />
                <Stack.Screen
                    name="MapScreen"
                    component={MapScreen}
                    options={{ title: 'MapScreen' }}
                />
            </Stack.Navigator>
        );
    }
    return (
        <>
            <View style={{ flex: 1, position: 'absolute', zIndex: 1, width: '100%' }}>
                {alerts.map((alert) => {
                    return (
                        <Animatable.View animation={"slideInDown"} key={alert.id}
                            style={{ padding: 15, backgroundColor: 'red', top: 10, width: "80%", alignSelf: 'center', borderRadius: 4, marginVertical: 3 }}>
                            <Text style={{ color: 'white', fontSize: 14 }}>{alert.msg}</Text>
                        </Animatable.View>
                    )
                })}
            </View>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="AuthRoute"
                    screenOptions={{
                        headerShown: false
                    }}>
                    <Stack.Screen name="AuthRoute" component={AuthRoute} />
                    <Stack.Screen name="DrawerRoute" component={DrawerRoute} />
                    <Stack.Screen name="BottomTabRoute" component={BottomTabRoute} />

                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}

const mapStateToProps = (state) => ({
    alerts: state.alert,
    darkMode: state.dark
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Navigate)
