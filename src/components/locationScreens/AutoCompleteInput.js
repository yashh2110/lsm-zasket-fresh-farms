import React, { useEffect, useState, useRef } from 'react';
import { Image, Text, TouchableOpacity, Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import { Icon } from 'native-base';
import { MapApiKey } from '../../../env';

const AutoCompleteLocation = ({ getLocation, defaultValue, styles, regions }) => {
  let someRef = useRef()
  useEffect(() => {
    if (defaultValue) {
      someRef.setAddressText(defaultValue)
    }
  }, [defaultValue])

  const [currentPosition, setCurrentPosition] = useState({})
  useEffect(() => {
    Geolocation.getCurrentPosition(({ coords }) => {
      console.warn(coords);
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + coords.latitude + ',' + coords.longitude + '&key=' + "AIzaSyAu6f9dUxz6XRVNbwIzqyF4fe1S1ZnebWw")
        .then((response) => {
          response.json().then(async (json) => {
            await setCurrentPosition({
              data: json.results[0],
              details: json.results[0],
              geometry: {
                location: {
                  lat: coords.latitude,
                  lng: coords.longitude
                }
              },
              description: json.results[0].formatted_address,
            }
            )
          });
        })
    })
  }, [])
  return (
    <GooglePlacesAutocomplete
      ref={ref => { someRef = ref }}
      placeholder='Search'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      // styles={[commonStyle.fullHeight, commonStyle.greenBg]}
      // textInputContainer={[commonStyle.fullHeight, commonStyle.greenBg]}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={getLocation}
      value={defaultValue}
      listViewDisplayed={false}
      getDefaultValue={() => ''}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: MapApiKey,
        language: 'en', // language of the results
        types: regions ? "(regions)" : '(cities)', // default: 'geocode'
        //types: "(regions)"
      }}

      styles={{
        // textInputContainer: {
        //   width: '100%',
        // },
        // description: {
        //   fontWeight: 'bold'
        // },
        // predefinedPlacesDescription: {
        //   color: '#1faadb'
        // },
        ...styles
      }}

      currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        type: 'cafe'
      }}

      GooglePlacesDetailsQuery={{ fields: 'geometry', }}


      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      predefinedPlaces={[currentPosition]}

      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      // renderLeftButton={() => <Text>X</Text>}
      // renderRightButton={() => <Text>Custom text after the input</Text>}
      renderRightButton={() =>
        Platform.OS === "ios" ?
          undefined :
          <TouchableOpacity
            style={{ backgroundColor: '#C8C8CD', borderRadius: 50, height: 20, width: 20, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 10 }}
            onPress={() => {
              // someRef.clear();
              someRef.setAddressText("")
            }}
          >
            <Icon
              name="close"
              style={{ color: 'white', fontSize: 15 }}
            />
          </TouchableOpacity>
      }
    />
  );
}

export default AutoCompleteLocation;
