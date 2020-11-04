import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Theme from '../../styles/Theme';
import CustomHeader from '../common/CustomHeader';

const BannerImages = ({ navigation }) => {
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
    }, []);
    return (
        <View style={{ backgroundColor: 'white' }}>
            <View style={[{
                width: "100%",
                aspectRatio: 1.33333,
                backgroundColor: '#F7F7F7'
            },]}>
                {/* todo: Alignment after Implementation */}
                {/* <Text>{JSON.stringify(image.banner, null, "       ")}</Text> */}
                <Image
                    source={require('../../assets/png/sample2.png')}
                    // source={{ uri: "https://i.picsum.photos/id/523/1248/936.jpg?hmac=myimbFBQoAaNy-bwZVM7jJbsgraeFWBTb8BtGlfaTvQ" }}
                    style={{ height: "100%", width: "100%" }} resizeMode="contain"
                />
            </View>
            <ScrollView horizontal={true} contentContainerStyle={{ height: 60 }}>
                {data?.map((item, index) => {
                    return (
                        <View style={[{ marginVertical: 8, marginHorizontal: 4, position: "relative", borderRadius: 4 }]} key={index}>
                            <TouchableOpacity onPress={() => setImage({ ...image, banner: item.filename, position: index })}>
                                <Image
                                    source={require('../../assets/png/thumbnail6.png')}
                                    // source={{ uri: "https://i.picsum.photos/id/835/111/81.jpg?hmac=tgyDI03VaG5zd4SFFifH0Muy4cW2e0hIuvU14QRv2Vk" }}
                                    style={[
                                        { backgroundColor: "#F7F7F7", width: 50, height: 50, borderRadius: 4 }
                                    ]}
                                />

                                {image.position === index ? (
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