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
import { View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import HomeScreen from "../components/HomeScreen"
import InfiniteLoading from "../components/InfiniteLoading"
import MapScreen from "../components/MapScreen"
import AccountScreen from "../components/AccountScreen"
import Pagination from "../components/Pagination"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FeatherIcons from "react-native-vector-icons/Feather"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import CustomDrawerContent from "./CustomDrawerContent"
import Theme from '../styles/Theme';
import PincodeScreen from '../components/locationScreens/PincodeScreen';
import CartScreen from '../components/cartStack/CartScreen';
import SearchScreen from '../components/SearchStack/SearchScreen';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
export const AuthContext = React.createContext();

const Navigate = ({ alerts, darkMode }) => {

    const forFade = ({ current, closing }) => ({
        cardStyle: {
            opacity: current.progress,
        },
    });



    function SplashScreen() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color={Theme.Colors.primary} />
            </View>
        );
    }

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



    const BottomTabRoute = () => (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            tabBarOptions={{
                activeTintColor: darkMode ? "#42f44b" : Theme.Colors.primary,
                activeBackgroundColor: darkMode ? Theme.Dark.backgroundColor : "#fff",
                inactiveBackgroundColor: darkMode ? Theme.Dark.backgroundColor : "#fff",
            }}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="SearchStack"
                component={SearchStack}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <FeatherIcons name="search" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="CartStack"
                component={CartStack}
                options={{
                    tabBarLabel: 'Cart',
                    tabBarIcon: ({ color, size }) => (
                        <SimpleLineIcons name="handbag" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="AccountStack"
                component={AccountStack}
                options={{
                    tabBarLabel: 'Account',
                    tabBarIcon: ({ color, size }) => (
                        <FeatherIcons name="user" color={color} size={size} />
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
    function SearchStack() {
        return (
            <Stack.Navigator
                initialRouteName="Search"
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{ title: 'Search Page' }}
                />
            </Stack.Navigator>
        );
    }
    function CartStack() {
        return (
            <Stack.Navigator
                initialRouteName="Cart"
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen
                    name="Cart"
                    component={CartScreen}
                    options={{ title: 'Cart Page' }}
                />
            </Stack.Navigator>
        );
    }
    function AccountStack() {
        return (
            <Stack.Navigator
                initialRouteName="Account"
                screenOptions={{
                    // headerStyle: { backgroundColor: '#42f44b' },
                    // headerTintColor: '#fff',
                    // headerTitleStyle: { fontWeight: 'bold' },
                    headerShown: false
                }}>
                <Stack.Screen
                    name="Account"
                    component={AccountScreen}
                    options={{ title: 'Account Page' }}
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
                    name="MapScreen"
                    component={MapScreen}
                    options={{ title: 'MapScreen' }}
                />
            </Stack.Navigator>
        );
    }










    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_USER_DETAIL':
                    return {
                        ...prevState,
                        userDetails: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userDetails: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userDetails: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userDetails: null,
        }
    );
    React.useEffect(() => {
        const bootstrapAsync = async () => {
            let userDetails;
            let value;
            try {
                userDetails = await AsyncStorage.getItem('userDetails');
                value = await JSON.parse(userDetails);
            } catch (e) {
                // Restoring token failed
            }
            dispatch({ type: 'RESTORE_USER_DETAIL', token: value });
        };

        bootstrapAsync();
    }, []);


    const authContext = React.useMemo(
        () => ({
            signIn: async data => {
                AsyncStorage.setItem('userDetails', JSON.stringify(data))
                dispatch({ type: 'SIGN_IN', token: data });
            },
            signOut: async () => {
                AsyncStorage.clear()
                dispatch({ type: 'SIGN_OUT' })
            },
            signUp: async data => {
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
        }),
        []
    );




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
            <AuthContext.Provider value={authContext}>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false
                        }}>
                        {state.isLoading ? (
                            <Stack.Screen name="Splash" component={SplashScreen} />
                        ) : state.userDetails == null ? (
                            <Stack.Screen
                                options={{
                                    animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                                }}
                                name="AuthRoute" component={AuthRoute} />
                        ) : (
                                    <Stack.Screen name="BottomTabRoute" component={BottomTabRoute} />
                                )}
                    </Stack.Navigator>
                </NavigationContainer>
            </AuthContext.Provider>
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
