
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Loader from '../components/common/Loader';
import { AuthContext } from './Routes';

export default function SwitchNavigator({ route }) {
    const { setOnBoardKey, removeOnBoardKey } = React.useContext(AuthContext);
    const { role } = route.params;

    useEffect(() => {
        setTimeout(() => {
            initialFunction()
        }, 1500);
    }, [])
    const initialFunction = () => {
        if (role == "LOGIN") {
            setOnBoardKey('onBoardKey')
        } else if (role == "LOGOUT") {
            removeOnBoardKey()
        }
    }
    return (
        <View>
            <Loader />
        </View>
    )
}
