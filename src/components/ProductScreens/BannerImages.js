import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const BannerImages = ({ }) => {
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
    const [image, setImage] = useState({ banner: null, position: 0 });
    useEffect(() => {
        setImage({ ...image, banner: data?.[0]?.filename, position: 0 });
    }, [data]);
    return (
        <View style={{ flex: 1 }}>
            <View style={[{
                width: "100%",
                aspectRatio: 1.7,
            },]}>
                {/* todo: Alignment after Implementation */}
                {/* <Text>{JSON.stringify(image.banner, null, "       ")}</Text> */}
                <Image
                    source={require('../../assets/png/HomeScreenVegetable.png')} style={{ height: "100%", width: "100%" }} resizeMode="contain"
                />
            </View>
            <ScrollView horizontal={true}>
                {data?.map((item, index) => {
                    return (
                        <View style={[{ marginVertical: 8, marginHorizontal: 4, position: "relative" }]} key={index}>
                            <TouchableOpacity onPress={() => setImage({ ...image, banner: item.filename, position: index })}>
                                <Image
                                    source={require('../../assets/png/HomeScreenProduct.png')}
                                    style={[
                                        { aspectRatio: 1, width: 40, backgroundColor: "#ccc", }
                                    ]}
                                />

                                {image.position === index ? (
                                    <View style={styles.eyeOverlayContainer}>
                                        <View style={[styles.eyeOverlay, { height: "100%", width: "100%" }]}></View>
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