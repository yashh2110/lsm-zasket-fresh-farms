import React from 'react';
import { Text, View } from 'react-native';

const CustomDrawerContent = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Text>This is customized drawer you can style your own content</Text>
        </View>
    )
}
export default CustomDrawerContent;
