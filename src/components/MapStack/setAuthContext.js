
import React from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { AuthContext } from '../../navigation/Routes';
import Theme from '../../styles/Theme';

const SetAuthContext = ({ route, navigation }) => {
    const { saveUserLocation } = React.useContext(AuthContext);
    const { userLocation } = route?.params;
    React.useEffect(() => {
        if (userLocation !== null) {
            saveUserLocation(userLocation)
        } else {
            navigation.goBack()
        }
    }, [])
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <ActivityIndicator size="large" color={Theme.Colors.primary} />
        </View>
    )
}
export default SetAuthContext;
