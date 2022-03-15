import React, { useEffect, useState, useRef } from "react";
import { Image, Text, TouchableOpacity, Platform } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Icon } from "native-base";
import Config from "react-native-config";
const AutoCompleteLocation = ({
  getLocation,
  defaultValue,
  styles,
  regions,
  onRequestClose,
}) => {
  const mapApiKey = Config.MAP_API_KEY;
  let someRef = useRef();
  useEffect(() => {
    if (defaultValue) {
      someRef.setAddressText(defaultValue);
    }
  }, [defaultValue]);
  return (
    <GooglePlacesAutocomplete
      ref={(ref) => {
        someRef = ref;
      }}
      // placeholder='Search'
      minLength={3} // minimum length of text to search
      autoFocus={true}
      placeholder="Search for Area, street name..."
      // styles={[commonStyle.fullHeight, commonStyle.greenBg]}
      // textInputContainer={[commonStyle.fullHeight, commonStyle.greenBg]}
      returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance={"light"} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed={false} // true/false/undefined
      fetchDetails={true}
      renderDescription={(row) => row.description} // custom description render
      onPress={getLocation}
      value={defaultValue}
      getDefaultValue={() => ""}
      textInputProps={{
        leftIcon: { type: "font-awesome", name: "chevron-left" },
        errorStyle: { color: "red" },
      }}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: mapApiKey,
        language: "en", // language of the results
        // types: 'geocode', // default: 'geocode'
        //types: "(regions)"
        components: "country:ind",
      }}
      styles={{
        ...styles,
        description: {
          color: "black",
          fontSize: 12,
        },
        textInputContainer: {
          backgroundColor: "#ffffff",
          height: 60,
        },
        // container: {
        //   backgroundColor: 'blue',
        //   height:60
        // },

        textInput: {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
          height: 50,
          // borderRadius: 25,
          paddingLeft: 45,
        },
        predefinedPlacesDescription: {
          color: "black",
        },
        listView: {
          position: "absolute",
          marginTop: 60,
          backgroundColor: "white",
          borderBottomEndRadius: 15,
          elevation: 2,
        },
        // textInputContainer: {
        //   backgroundColor: 'white'
        // },
        textInputContainer: {
          borderTopWidth: 0,
          borderBottomWidth: 0,
          backgroundColor: "#F8F8F8",
        },
      }}
      // currentLocation={true}
      // currentLocationLabel='Current location'
      nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={
        {
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }
      }
      GooglePlacesDetailsQuery={{ fields: "geometry" }}
      enableHighAccuracyLocation={true}
      listUnderlayColor="lightgrey"
      GooglePlacesSearchQuery={{
        rankby: "distance", // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        types: "building",
      }}
      filterReverseGeocodingByTypes={[
        "locality",
        "administrative_area_level_3",
      ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      // predefinedPlaces={[currentPosition]}

      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      // renderLeftButton={() => <TouchableOpacity style={{ justifyContent: 'center' }} onPress={onRequestClose}>
      //   <Icon name="arrowleft" type="AntDesign" style={{ fontSize: 20, marginLeft: 10, color: "grey" }} />
      // </TouchableOpacity>}
      // renderRightButton={() => <Text>Custom text after the input</Text>}
      renderRightButton={() =>
        Platform.OS === "ios" ? undefined : (
          <TouchableOpacity
            style={{
              backgroundColor: "#C8C8CD",
              borderRadius: 50,
              height: 20,
              width: 20,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginRight: 10,
              marginTop: 18,
            }}
            onPress={() => {
              someRef.setAddressText("");
            }}>
            <Icon name="close" style={{ color: "white", fontSize: 15 }} />
          </TouchableOpacity>
        )
      }
    />
  );
};

export default AutoCompleteLocation;
