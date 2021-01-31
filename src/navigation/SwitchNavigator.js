
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { ActivityIndicator } from 'react-native';
import Loader from '../components/common/Loader';
import Theme from '../styles/Theme';
import { AuthContext } from './Routes';

export default function SwitchNavigator({ route }) {
    const { setOnBoardKey, removeOnBoardKey } = React.useContext(AuthContext);

    useEffect(() => {
        setTimeout(() => {
            initialFunction()
        }, 1500);
    }, [])
    const initialFunction = () => {
        setOnBoardKey('onBoardKey')
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size="large" color={Theme.Colors.primary} />
        </View>
    )
}
