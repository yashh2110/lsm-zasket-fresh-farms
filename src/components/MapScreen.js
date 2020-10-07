import React from 'react'
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, Callout, ProviderPropType } from 'react-native-maps';
import marker from '../assets/png/locationIcon.png';
import Geolocation from '@react-native-community/geolocation';

const latitudeDelta = 0.005
const longitudeDelta = 0.005

export default class LocationPickerDemo extends React.Component {
    state = {
        region: {
            latitudeDelta,
            longitudeDelta,
            latitude: 11.929001,
            longitude: 79.791480
        }
    }

    onRegionChange = region => {
        this.setState({
            region
        })
    }

    render() {
        const { region } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.map}>
                    <MapView
                        style={styles.map}
                        initialRegion={region}
                        onRegionChangeComplete={this.onRegionChange}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        followsUserLocation={true}
                        showsCompass={true}
                        toolbarEnabled={true}
                        loadingEnabled={true}
                    />
                    <View style={styles.markerFixed}>
                        <Image style={styles.marker} source={marker} />
                    </View>
                </View>
                {/* <SafeAreaView style={styles.footer}>
                    <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text>
                </SafeAreaView> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    markerFixed: {
        left: '50%',
        marginLeft: -25,
        marginTop: -25,
        position: 'absolute',
        top: '50%'
    },
    marker: {
        height: 48,
        width: 48
    },
    footer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: 0,
        position: 'absolute',
        width: '100%'
    },
    region: {
        color: '#fff',
        lineHeight: 20,
        margin: 20
    }
})