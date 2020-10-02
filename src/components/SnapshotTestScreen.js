// Intro.js
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flex: 1,
        justifyContent: 'center',
    },
    instructions: {
        color: '#333333',
        marginBottom: 5,
        textAlign: 'center',
    },
    welcome: {
        fontSize: 20,
        margin: 10,
        textAlign: 'center',
    },
});

export default class SnapshotTestScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Snapshot Test!</Text>
                <Text style={styles.instructions}>This is a React Native snapshot test.</Text>
                <Text style={styles.instructions}>When you run yarn test or jest, this will produce an output file // __tests__/__snapshots__/SnapshotTestScreen-test.js.snap</Text>
                <Text style={styles.instructions}>This test is like to compare the code written and what are the changes made</Text>
            </View>
        );
    }
}
