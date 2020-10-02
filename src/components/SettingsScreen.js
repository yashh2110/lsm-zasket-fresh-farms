import * as React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView } from 'react-native';

const SettingsScreen = ({ route, navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 16 }}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 25,
                            textAlign: 'center',
                            marginBottom: 16
                        }}>
                        You are on Setting Screen
          </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('InfiniteLoading')}>
                        <Text>Infinite Loading</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Pagination')}>
                        <Text>List with Pagination</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('SnapshotTestScreen')}>
                        <Text>Snapshot Test</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('LanguageChangeScreen')}>
                        <Text>LanguageChange Screen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('MapScreen')}>
                        <Text>MapScreen</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
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
export default SettingsScreen;