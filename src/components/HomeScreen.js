import * as React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { Icon } from 'native-base';

const HomeScreen = ({ navigation }) => {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => { }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="location-pin" type="Entypo" />
                <Text>Jubilee Hills, Hyderabad</Text>
                <Icon name="arrow-drop-down" type="MaterialIcons" />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 16,
    },
});
export default HomeScreen;
