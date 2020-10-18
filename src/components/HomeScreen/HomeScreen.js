import React, { useEffect, useContext, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, ScrollView, Alert, SectionList, FlatList } from 'react-native';
import { Icon } from 'native-base';
import { AuthContext } from "../../navigation/Routes"
import Swiper from 'react-native-swiper';
import Theme from '../../styles/Theme';
import { getAllCategories } from '../../actions/home'
import { connect } from 'react-redux';
import CategorySectionListItem from './CategorySectionListItem';
import Loader from '../common/Loader';

const HomeScreen = ({ getAllCategories, categories, navigation }) => {
    const { signOut } = useContext(AuthContext);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        initialFunction()
    }, [])

    const initialFunction = () => {
        getAllCategories((res, status) => {
            if (status) {
                // alert(JSON.stringify(res.data, null, "      "))
                setLoading(false)
            } else {
                setLoading(false)
            }
        })
    }


    return (
        <>
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
                            source={require('../../assets/png/HomeScreenBanner1.png')}
                        />
                        <Image
                            style={{ height: 140, width: 330, borderRadius: 5, alignSelf: 'center' }}
                            // resizeMode={"stretch"}
                            source={require('../../assets/png/HomeScreenBanner2.png')}
                        />
                    </Swiper>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: 'white', height: 160 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('ProductListScreen', { categoryName: "VEGETABLES" }) }} style={{ flex: 1, margin: 15, backgroundColor: '#F2F5F7', borderRadius: 4, }}>
                        <Text style={{ padding: 15 }}>Vegetables</Text>
                        <Image
                            style={{ borderRadius: 5, position: 'absolute', bottom: 0, right: 0, width: 130, height: 80 }}
                            resizeMode={"contain"}
                            source={require('../../assets/png/HomeScreenVegetable.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('ProductListScreen', { categoryName: "FRUITS" }) }} style={{ flex: 1, margin: 15, backgroundColor: '#F2F5F7', borderRadius: 4 }}>
                        <Text style={{ padding: 15 }}>Fruits</Text>
                        <Image
                            style={{ borderRadius: 5, position: 'absolute', bottom: 0, right: 0, width: 150, height: 100 }}
                            resizeMode={"contain"}
                            source={require('../../assets/png/HomeScreenVegetable2.png')}
                        />
                    </TouchableOpacity>
                </View>

                <Image
                    style={{ borderRadius: 5, alignSelf: 'center', borderRadius: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.37, shadowRadius: 7.49, backgroundColor: 'white', height: 130, width: "100%" }}
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
    categories: state.home.categories
})


export default connect(mapStateToProps, { getAllCategories })(HomeScreen)
const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 10
    },
});
