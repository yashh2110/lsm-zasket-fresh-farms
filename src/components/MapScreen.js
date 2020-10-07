import React from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    Image, SafeAreaView, Text, View,
    TouchableOpacity
} from 'react-native';
import MapView, { Marker, Callout, ProviderPropType } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import marker from '../assets/png/locationIcon.png';
import { } from 'react-native-gesture-handler';
import { Icon } from 'native-base';

const LATITUDE_DELTA = 0.005
const LONGITUDE_DELTA = 0.005

const initialRegion = {
    latitude: -37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
}

class MyMapView extends React.Component {

    map = null;

    state = {
        region: {
            latitude: 11.929001,
            longitude: 79.791480,
            latitudeDelta: LONGITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        },
        ready: true,
        filteredMarkers: []
    };

    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => this.map.animateToRegion(region), 10);
        }
        //this.setState({ region });
    }

    componentDidMount() {
        this.getCurrentPosition();
    }

    getCurrentPosition() {
        try {
            Geolocation.getCurrentPosition(
                (position) => {
                    const region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    };
                    this.setRegion(region);
                },
                (error) => {
                    //TODO: better design
                    switch (error.code) {
                        case 1:
                            if (Platform.OS === "ios") {
                                Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Privacidad - Localización");
                            } else {
                                Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Apps - ExampleApp - Localización");
                            }
                            break;
                        default:
                            Alert.alert("", "Error al detectar tu locación");
                    }
                }
            );
        } catch (e) {
            alert(e.message || "");
        }
    };

    onMapReady = (e) => {
        if (!this.state.ready) {
            this.setState({ ready: true });
        }
    };

    onRegionChange = (region) => {
        this.setState({
            region
        })
    };

    onRegionChangeComplete = (region) => {
        this.setState({
            region
        })
    };

    render() {

        const { region } = this.state;
        const { children, renderMarker, markers, navigation } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.map}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, justifyContent: 'center', position: "absolute", zIndex: 1, left: 10, top: 10 }}>
                        <Image
                            style={{ width: 20, height: 20, }}
                            resizeMode="contain"
                            source={require('../assets/png/backIcon.png')}
                        />
                    </TouchableOpacity>
                    <MapView
                        showsUserLocation
                        ref={map => { this.map = map }}
                        data={markers}
                        initialRegion={initialRegion}
                        onMapReady={this.onMapReady}
                        showsMyLocationButton={true}
                        onRegionChange={this.onRegionChange}
                        onRegionChangeComplete={this.onRegionChangeComplete}
                        style={StyleSheet.absoluteFill}
                        textStyle={{ color: '#bc8b00' }}
                        containerStyle={{ backgroundColor: 'white', borderColor: '#BC8B00' }}>
                        {children && children || null}
                    </MapView>
                    <View style={styles.markerFixed}>
                        <Image style={styles.marker} source={marker} />
                    </View>
                    <TouchableOpacity onPress={() => this.getCurrentPosition()} style={styles.getcurrentlocation} activeOpacity={0.6}>
                        <Icon name='gps-fixed' type="MaterialIcons" style={{ color: '#979197', fontSize: 20 }} />
                    </TouchableOpacity>
                </View>
                <SafeAreaView style={styles.footer}>
                    <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text>
                </SafeAreaView>
            </View>
        );
    }
}

export default MyMapView;

const styles = StyleSheet.create({
    map: {
        height: "50%"
    },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -35,
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
    },
    getcurrentlocation: {
        backgroundColor: "white",
        flexDirection: 'row',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        position: 'absolute',
        bottom: 10,
        right: 10
    }
})