import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Theme from '../../styles/Theme';
import CustomHeader from '../common/CustomHeader';

const BannerImages = ({ navigation, item }) => {
    const data = [
        {
            "imageable_id": 244,
            "filename": "product-imgs/full/5eb2d01f0eb7c_1588776991.png",
            "medium_filename": "product-imgs/medium/5eb2d01f0eb7c_1588776991.png",
            "thumbnail_filename": "product-imgs/thumbnail/5eb2d01f0eb7c_1588776991.png"
        },
        {
            "imageable_id": 244,
            "filename": "product-imgs/full/5eb2d02036e61_1588776992.png",
            "medium_filename": "product-imgs/medium/5eb2d02036e61_1588776992.png",
            "thumbnail_filename": "product-imgs/thumbnail/5eb2d02036e61_1588776992.png"
        }
    ]
    const [banner, setBanner] = useState(null)
    const [position, setPosition] = useState(0)
    useEffect(() => {
        setBanner(item?.itemImages?.[0]?.largeImagePath)
        setPosition(0)
    }, []);
    return (
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
            <View style={[{
                width: "100%",
                aspectRatio: 1.33333,
                backgroundColor: '#F7F7F7',
                justifyContent: "center",
                borderTopLeftRadius: 25, borderTopRightRadius: 25
                // borderRadius: 25
            },]}>
                {/* todo: Alignment after Implementation */}
                {/* <Text>{JSON.stringify(item?.itemImages?.[0]?.largeImagePath, null, "       ")} </Text> */}
                <Image
                    source={item?.itemImages?.[0]?.largeImagePath ?
                        { uri: banner ? banner : item?.itemImages?.[0]?.largeImagePath } : require('../../assets/png/default.png')}
                    style={{ height: "80%", width: "80%", alignSelf: "center", }} resizeMode="contain"
                />
            </View>
            {/* {item?.itemImages?.length > 0 ?
                <ScrollView horizontal={true} contentContainerStyle={{ height: 60 }}>
                    {item?.itemImages?.map((element, index) => {
                        return (
                            <View style={[{ marginVertical: 4, marginHorizontal: 4, position: "relative", borderRadius: 4 }]} key={index}>
                                <TouchableOpacity onPress={() => {
                                    setBanner(element.largeImagePath)
                                    setPosition(index)
                                }}>
                                     <Image
                                        source={{ uri: element?.smallImagePath }}
                                        style={[
                                            { backgroundColor: "#F7F7F7", width: 50, height: 50, borderRadius: 4 }
                                        ]}
                                    /> 

                                     {position === index ? (
                                        <View style={styles.eyeOverlayContainer}>
                                            <View style={[styles.eyeOverlay, { height: "100%", width: "100%", borderRadius: 4 }]}></View>
                                            <Icon
                                                iconStyle={[{ color: "white" }, styles.eyeOpacity]}
                                                name="remove-red-eye"
                                                type="material"
                                            ></Icon>
                                        </View>
                                    ) : null} 
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
                : undefined} */}
        </View>
    );
}

export default BannerImages;

const styles = StyleSheet.create({
    bcbg: {
        backgroundColor: "#ccc",
    },
    eyeOverlayContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Theme.Colors.primary,
        borderRadius: 4
    },
    eyeOverlay: {
        position: "absolute",
        backgroundColor: "#000",
        opacity: 0.5,
    },
    eyeOpacity: {
        opacity: .5
    }
})