
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
import * as Animatable from 'react-native-animatable';
import HomeScreen from "../components/HomeScreen"
import InfiniteLoading from "../components/InfiniteLoading"
import MapScreen from "../components/locationScreens/MapScreen"
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
import { Button, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


const AuthContext = React.createContext();

function SplashScreen() {
    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
}

// function HomeScreen() {
//     const { signOut } = React.useContext(AuthContext);

//     return (
//         <View>
//             <Text>Signed in!</Text>
//             <Button title="Sign out" onPress={signOut} />
//         </View>
//     );
// }

function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { signIn } = React.useContext(AuthContext);

    return (
        <View>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Sign in" onPress={() => signIn({ username, password })} />
        </View>
    );
}

const Stack = createStackNavigator();

export default function App({ navigation }) {
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );

    React.useEffect(() => {
        const bootstrapAsync = async () => {
            let userToken;
            try {
                userToken = await AsyncStorage.getItem('userToken');
            } catch (e) {
                // Restoring token failed
            }
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };

        bootstrapAsync();
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async data => {
                // In a production app, we need to send some data (usually username, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            signUp: async data => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
        }),
        []
    );

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <Stack.Navigator>
                    {state.isLoading ? (
                        // We haven't finished checking for the token yet
                        <Stack.Screen name="Splash" component={SplashScreen} />
                    ) : state.userToken == null ? (
                        // No token found, user isn't signed in
                        <Stack.Screen
                            name="SignIn"
                            component={SignInScreen}
                            options={{
                                title: 'Sign in',
                                // When logging out, a pop animation feels intuitive
                                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                            }}
                        />
                    ) : (
                                // User is signed in
                                <Stack.Screen name="Home" component={HomeScreen} />
                            )}
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
}