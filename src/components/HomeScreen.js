import * as React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { AuthContext } from "../navigation/Routes"
import Swiper from 'react-native-swiper';
import Theme from '../styles/Theme';

const HomeScreen = ({ navigation }) => {
    const { signOut } = React.useContext(AuthContext);

    React.useEffect(() => {

    }, [])

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => { }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="location-pin" type="Entypo" />
                    <Text>Jubilee Hills, Hyderabad</Text>
                    <Icon name="arrow-drop-down" type="MaterialIcons" />
                </TouchableOpacity>

                <TouchableOpacity onPress={signOut} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <Text>LogOut</Text>
                </TouchableOpacity>
            </View>
            <View style={{ height: 160, justifyContent: 'center', alignItems: 'center', marginTop: 10, }}>
                <Swiper
                    autoplay={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    autoplayTimeout={5}
                    activeDotColor={"#505E68"}
                    dotStyle={{ bottom: -26, height: 6, width: 6 }}
                    activeDotStyle={{ bottom: -26, height: 6, width: 6 }}
                >
                    <Image
                        style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center' }}
                        // resizeMode={"stretch"}
                        source={require('../assets/png/HomeScreenBanner1.png')}
                    />
                    <Image
                        style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center' }}
                        // resizeMode={"stretch"}
                        source={require('../assets/png/HomeScreenBanner2.png')}
                    />
                </Swiper>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: 'white', height: 160 }}>
                <TouchableOpacity onPress={() => { }} style={{ flex: 1, margin: 15, backgroundColor: '#F2F5F7', borderRadius: 4, }}>
                    <Text style={{ padding: 15 }}>Vegetables</Text>
                    <Image
                        style={{ borderRadius: 5, position: 'absolute', bottom: 0, right: 0, width: 130, height: 80 }}
                        resizeMode={"contain"}
                        source={require('../assets/png/HomeScreenVegetable.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }} style={{ flex: 1, margin: 15, backgroundColor: '#F2F5F7', borderRadius: 4 }}>
                    <Text style={{ padding: 15 }}>Fruits</Text>
                    <Image
                        style={{ borderRadius: 5, position: 'absolute', bottom: 0, right: 0, width: 150, height: 100 }}
                        resizeMode={"contain"}
                        source={require('../assets/png/HomeScreenVegetable2.png')}
                    />
                </TouchableOpacity>
            </View>

            <Image
                style={{ borderRadius: 5, alignSelf: 'center', borderRadius: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.37, shadowRadius: 7.49, elevation: 5, backgroundColor: 'white', height: 130, width: "100%" }}
                resizeMode={"cover"}
                source={require('../assets/png/HomeScreenFreeDelivery.png')}
            />

            <View>
                <Text style={{ color: '#2E2E2E', padding: 10, fontWeight: 'bold', fontSize: 16 }}>Fresh Vegetables</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                    <View style={styles.scrollChildParent}>
                        <View style={{
                            flex: 1, margin: 4, width: 200,
                        }}>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={{
                                    margin: 2,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 0.5,
                                    borderColor: "#EFEFEF",
                                    flex: 1,
                                    padding: 0,
                                    overflow: "hidden",
                                    borderRadius: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.18,
                                    shadowRadius: 1.00,

                                    elevation: 1,
                                }}>

                                <View style={{ flex: 1, backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', padding: 5, paddingVertical: 10, }} onPress={() => { }}>

                                    {/* <Text>{JSON.stringify(item, null, "         ")}</Text> */}
                                    <Image
                                        style={{ width: 120, height: 100, }}
                                        source={require('../assets/png/HomeScreenProduct.png')} />

                                </View>
                                <View style={[{ padding: 10 }]}>
                                    <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>Carrot</Text>
                                    <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹ 84</Text>
                                    <Text style={{ fontSize: 12, color: '#909090', }}>500 grams</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                padding: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                                backgroundColor: 'white',
                                flexDirection: 'row',
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 4,
                                position: 'absolute',
                                zIndex: 1,
                                right: 10,
                                bottom: -12,
                            }}>
                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.scrollChildParent}>
                        <View style={{
                            flex: 1, margin: 4, width: 200,
                        }}>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={{
                                    margin: 2,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 0.5,
                                    borderColor: "#EFEFEF",
                                    flex: 1,
                                    padding: 0,
                                    overflow: "hidden",
                                    borderRadius: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.18,
                                    shadowRadius: 1.00,

                                    elevation: 1,
                                }}>

                                <View style={{ flex: 1, backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', padding: 5, paddingVertical: 10, }} onPress={() => { }}>

                                    {/* <Text>{JSON.stringify(item, null, "         ")}</Text> */}
                                    <Image
                                        style={{ width: 120, height: 100, }}
                                        source={require('../assets/png/HomeScreenProduct.png')} />

                                </View>
                                <View style={[{ padding: 10 }]}>
                                    <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>Carrot</Text>
                                    <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹ 84</Text>
                                    <Text style={{ fontSize: 12, color: '#909090', }}>500 grams</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                padding: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                                backgroundColor: 'white',
                                flexDirection: 'row',
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 4,
                                position: 'absolute',
                                zIndex: 1,
                                right: 10,
                                bottom: -12,
                            }}>
                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.scrollChildParent}>
                        <View style={{
                            flex: 1, margin: 4, width: 200,
                        }}>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={{
                                    margin: 2,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 0.5,
                                    borderColor: "#EFEFEF",
                                    flex: 1,
                                    padding: 0,
                                    overflow: "hidden",
                                    borderRadius: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.18,
                                    shadowRadius: 1.00,

                                    elevation: 1,
                                }}>

                                <View style={{ flex: 1, backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', padding: 5, paddingVertical: 10, }} onPress={() => { }}>

                                    {/* <Text>{JSON.stringify(item, null, "         ")}</Text> */}
                                    <Image
                                        style={{ width: 120, height: 100, }}
                                        source={require('../assets/png/HomeScreenProduct.png')} />

                                </View>
                                <View style={[{ padding: 10 }]}>
                                    <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>Carrot</Text>
                                    <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹ 84</Text>
                                    <Text style={{ fontSize: 12, color: '#909090', }}>500 grams</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                padding: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                                backgroundColor: 'white',
                                flexDirection: 'row',
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 4,
                                position: 'absolute',
                                zIndex: 1,
                                right: 10,
                                bottom: -12,
                            }}>
                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.scrollChildParent}>
                        <View style={{
                            flex: 1, margin: 4, width: 200,
                        }}>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={{
                                    margin: 2,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 0.5,
                                    borderColor: "#EFEFEF",
                                    flex: 1,
                                    padding: 0,
                                    overflow: "hidden",
                                    borderRadius: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.18,
                                    shadowRadius: 1.00,

                                    elevation: 1,
                                }}>

                                <View style={{ flex: 1, backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', padding: 5, paddingVertical: 10, }} onPress={() => { }}>

                                    {/* <Text>{JSON.stringify(item, null, "         ")}</Text> */}
                                    <Image
                                        style={{ width: 120, height: 100, }}
                                        source={require('../assets/png/HomeScreenProduct.png')} />

                                </View>
                                <View style={[{ padding: 10 }]}>
                                    <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>Carrot</Text>
                                    <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹ 84</Text>
                                    <Text style={{ fontSize: 12, color: '#909090', }}>500 grams</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                padding: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                                backgroundColor: 'white',
                                flexDirection: 'row',
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 4,
                                position: 'absolute',
                                zIndex: 1,
                                right: 10,
                                bottom: -12,
                            }}>
                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.scrollChildParent}>
                        <View style={{
                            flex: 1, margin: 4, width: 200,
                        }}>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={{
                                    margin: 2,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 0.5,
                                    borderColor: "#EFEFEF",
                                    flex: 1,
                                    padding: 0,
                                    overflow: "hidden",
                                    borderRadius: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.18,
                                    shadowRadius: 1.00,

                                    elevation: 1,
                                }}>

                                <View style={{ flex: 1, backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', padding: 5, paddingVertical: 10, }} onPress={() => { }}>

                                    {/* <Text>{JSON.stringify(item, null, "         ")}</Text> */}
                                    <Image
                                        style={{ width: 120, height: 100, }}
                                        source={require('../assets/png/HomeScreenProduct.png')} />

                                </View>
                                <View style={[{ padding: 10 }]}>
                                    <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>Carrot</Text>
                                    <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹ 84</Text>
                                    <Text style={{ fontSize: 12, color: '#909090', }}>500 grams</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                padding: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                                backgroundColor: 'white',
                                flexDirection: 'row',
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 4,
                                position: 'absolute',
                                zIndex: 1,
                                right: 10,
                                bottom: -12,
                            }}>
                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.scrollChildParent}>
                        <View style={{
                            flex: 1, margin: 4, width: 200,
                        }}>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={{
                                    margin: 2,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 0.5,
                                    borderColor: "#EFEFEF",
                                    flex: 1,
                                    padding: 0,
                                    overflow: "hidden",
                                    borderRadius: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.18,
                                    shadowRadius: 1.00,

                                    elevation: 1,
                                }}>

                                <View style={{ flex: 1, backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', padding: 5, paddingVertical: 10, }} onPress={() => { }}>

                                    {/* <Text>{JSON.stringify(item, null, "         ")}</Text> */}
                                    <Image
                                        style={{ width: 120, height: 100, }}
                                        source={require('../assets/png/HomeScreenProduct.png')} />

                                </View>
                                <View style={[{ padding: 10 }]}>
                                    <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>Carrot</Text>
                                    <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>₹ 84</Text>
                                    <Text style={{ fontSize: 12, color: '#909090', }}>500 grams</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={{
                                    padding: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.20,
                                    shadowRadius: 1.41,
                                    elevation: 2,
                                    backgroundColor: 'white',
                                    flexDirection: 'row',
                                    width: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 4,
                                    position: 'absolute',
                                    zIndex: 1,
                                    right: 10,
                                    bottom: -12,
                                }}
                            >
                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 10
    },
});
export default HomeScreen;
