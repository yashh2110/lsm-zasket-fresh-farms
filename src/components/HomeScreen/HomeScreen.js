import React, { useEffect, useContext, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, ScrollView, Alert, SectionList, FlatList, RefreshControl } from 'react-native';
import { Icon } from 'native-base';
import { AuthContext } from "../../navigation/Routes"
import Swiper from 'react-native-swiper';
import Theme from '../../styles/Theme';
import { getAllCategories, getCustomerDetails, onLogout } from '../../actions/home'
import { connect } from 'react-redux';
import CategorySectionListItem from './CategorySectionListItem';
import Loader from '../common/Loader';
import DarkModeToggle from '../common/DarkModeToggle';
import AsyncStorage from '@react-native-community/async-storage';

const HomeScreen = ({ getAllCategories, getCustomerDetails, categories, navigation, userLocation, onLogout }) => {
    const { signOut } = useContext(AuthContext);
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        initialFunction()
    }, [])

    const initialFunction = () => {
        getAllCategories((res, status) => {
            if (status) {
                // alert(JSON.stringify(res.data, null, "      "))
                setLoading(false)
                setRefresh(false)
            } else {
                setRefresh(false)
                setLoading(false)
            }
        })
        getCustomerDetails(async (res, status) => {
            if (status) {
                // alert(JSON.stringify(res?.data, null, "       "))
                await AsyncStorage.setItem('userDetails', JSON.stringify(res?.data))
            } else {
                setUserDetails({})
            }
        })
    }
    const onRefresh = () => {
        setRefresh(true)
        initialFunction()
    }

    const onPressLogout = async () => {
        await onLogout()
        await signOut()
    }

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingHorizontal: 10, flexWrap: 'wrap' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('MapScreen', { fromScreen: 'HomeScreen' }) }} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                        <Icon name="location-pin" type="Entypo" style={{ fontSize: 22 }} />
                        <Text numberOfLines={1} style={{ maxWidth: '50%' }}>{userLocation?.addressLine_1}</Text>
                        <Icon name="arrow-drop-down" type="MaterialIcons" style={{ fontSize: 22 }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onPressLogout()} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={{ height: 160, justifyContent: 'center', alignItems: 'center', marginTop: 10, }}>
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
                            source={require('../../assets/png/HomeScreenBanner1.png')}
                        />
                        <Image
                            style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center' }}
                            // resizeMode={"stretch"}
                            source={require('../../assets/png/HomeScreenBanner2.png')}
                        />
                    </Swiper>
                </View>*/}
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 5 }}>
                    <Image
                        style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center' }}
                        // resizeMode={"stretch"}
                        source={require('../../assets/png/HomeScreenBanner1.png')}
                    />
                    <Image
                        style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center', marginLeft: 20 }}
                        // resizeMode={"stretch"}
                        source={require('../../assets/png/HomeScreenBanner2.png')}
                    />
                </ScrollView>
                <View style={{ flexDirection: 'row', backgroundColor: 'white', height: 125, justifyContent: 'space-around', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('ProductListScreen', { categoryName: "VEGETABLES" }) }} style={{ height: 120, width: 150, backgroundColor: '#F2F5F7', borderRadius: 4, overflow: 'hidden' }}>
                        <Text style={{ padding: 15 }}>Vegetables</Text>
                        <Image
                            style={{ borderRadius: 5, position: 'absolute', bottom: -3, right: 0, width: 130, height: 80 }}
                            resizeMode={"contain"}
                            source={require('../../assets/png/HomeScreenVegetable.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('ProductListScreen', { categoryName: "FRUITS" }) }} style={{ height: 120, width: 150, backgroundColor: '#F2F5F7', borderRadius: 4, overflow: 'hidden' }}>
                        <Text style={{ padding: 15 }}>Fruits</Text>
                        <Image
                            style={{ borderRadius: 5, position: 'absolute', bottom: 0, right: 0, width: 150, height: 100 }}
                            resizeMode={"contain"}
                            source={require('../../assets/png/HomeScreenVegetable2.png')}
                        />
                    </TouchableOpacity>
                </View>

                <Image
                    style={{ borderRadius: 5, alignSelf: 'center', borderRadius: 5, backgroundColor: 'white', height: 115, aspectRatio: 3 }}
                    resizeMode={"cover"}
                    source={require('../../assets/png/HomeScreenFreeDelivery.png')}
                />

                <FlatList
                    data={categories}
                    renderItem={({ item }) => (
                        <CategorySectionListItem item={item} navigation={navigation} />
                    )}
                    keyExtractor={item => item?.id.toString()}
                />

                {/* <Text>{JSON.stringify(sectionlistData, null, "      ")}</Text> */}
            </ScrollView>
            {loading ?
                <Loader />
                : undefined
            }
        </>
    );
}

const mapStateToProps = (state) => ({
    categories: state.home.categories,
    userLocation: state.location
})


export default connect(mapStateToProps, { getAllCategories, getCustomerDetails, onLogout })(HomeScreen)
const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 10
    },
});
