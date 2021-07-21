import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import CustomHeader from '../common/CustomHeader';
import { Button, Icon } from "react-native-elements";
import { Icon as Icons } from 'native-base'
import Theme from '../../styles/Theme';
import { searchItems } from '../../actions/home'
import { connect } from 'react-redux';
import CardProductListScreen from '../ProductScreens/CardProductListScreen';
import Loader from '../common/Loader';
import { ActivityIndicator } from 'react-native';
import Draggable from '../common/Draggable';
import LottieView from 'lottie-react-native';

const SearchScreen = ({ navigation, searchItems, categories }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [result, setResult] = useState([]);

    useEffect(() => {

        return () => {

        }
    }, [])

    useEffect(() => {
        if (searchTerm.length > 2) {
            setLoading(true)
            searchFunction()
        } else if (searchTerm.length <= 2) {
            setResult([])
            setLoading(false)
        }
    }, [searchTerm]);

    const searchFunction = () => {
        searchItems(searchTerm, (res, status) => {
            if (status) {
                setResult(res?.data)
                setLoading(false)
                setRefresh(false)
            } else {
                setResult([])
                setLoading(false)
                setRefresh(false)
            }
        })
    }

    const clearFunction = () => {
        setSearchTerm("")
        setResult([])
    }

    const emptyComponent = () => {
        return (
            <View style={[{ marginTop: 5, }]}>
                {loading ?
                    <ActivityIndicator style={{}} size="large" color="grey" />
                    : searchTerm.length > 2 ?
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                style={{ width: 250, height: 250 }}
                                resizeMode="center"
                                source={require("../../assets/png/sadSearch.png")}
                            />
                            <Text style={{ alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Nothing Found!</Text>
                            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#727272', fontSize: 12 }}>We cannot find what you are looking for.</Text>
                            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#727272', fontSize: 12 }}>Try search something else.</Text>
                        </View>
                        :
                        <>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>Search by category</Text>
                            <View style={{ padding: 5 }}>
                                <FlatList
                                    data={categories}
                                    numColumns={3}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={{
                                            margin: 5,
                                            // flex: 1,
                                            minHeight: 100,
                                            width: "31%",
                                        }} activeOpacity={0.5} onPress={() => { setSearchTerm(item?.categoryName) }}>
                                            <View style={{ backgroundColor: '#F7F7F7', borderRadius: 6, borderColor: '#EDEDED', borderWidth: 1, }}>
                                                {
                                                    item.categoryTag ?
                                                        <>
                                                            <View style={{
                                                                height: 18, width: ("58%"), backgroundColor: "#7eb517", borderTopRightRadius: 6, borderBottomLeftRadius: 6, alignSelf: "flex-end",
                                                                shadowColor: "#000",
                                                                shadowOffset: {
                                                                    width: 0,
                                                                    height: 1,
                                                                },
                                                                shadowOpacity: 0.18,
                                                                shadowRadius: 1.00,
                                                                elevation: 0.8,
                                                                marginRight: -1,
                                                                marginTop: -1,
                                                                justifyContent: "center"
                                                            }}>
                                                                <Text style={{ fontSize: 9, textAlign: "center", color: "#f7f7f7", fontWeight: 'bold' }}>Upto {item.categoryTag}</Text>

                                                            </View>

                                                        </>
                                                        :
                                                        <View style={{
                                                            height: 18, width: ("58%"),
                                                        }}>
                                                        </View>
                                                }
                                                {/* <View style={[styles.categoriesCard, item.categories ? { padding: 9, marginTop: -5 } : undefined]}> */}

                                                <View style={{ padding: 10, marginTop: -8 }}>
                                                    <Image
                                                        style={{ aspectRatio: 1.3 }}
                                                        // source={require('../../assets/png/HomeScreenVegetable.png')}
                                                        resizeMode="contain"
                                                        source={item?.categoryImage ?
                                                            { uri: item?.categoryImage } : require('../../assets/png/default.png')}
                                                    />

                                                </View>
                                            </View>
                                            <Text style={{ alignSelf: 'center', textAlign: 'center', marginVertical: 5, fontWeight: 'bold', fontSize: 13 }}>{item?.categoryDisplayName}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={item => item?.id.toString()}
                                />
                            </View>

                        </>
                }
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: 70, backgroundColor: '#F8F8F8', paddingLeft: 5, paddingRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => { navigation.goBack() }}
                    style={{ justifyContent: 'center', alignItems: 'center', }}
                >
                    <Icons name="chevron-small-left" type="Entypo" style={[{ color: 'black', fontSize: 36 }]} />
                </TouchableOpacity>
                <View style={{ height: 50, flex: 1, backgroundColor: 'white', borderRadius: 5, flexDirection: 'row', alignItems: 'center', shadowColor: "#000", shadowColor: "#000", shadowOffset: { width: 0, height: 5, }, shadowOpacity: 0.10, shadowRadius: 6.68, elevation: 11 }}>
                    <View style={{ paddingHorizontal: 5 }}>
                        <Icon name="search" style={{ fontSize: 24 }} color="#727272" />
                    </View>
                    <View style={{ flex: 1, }}>
                        <TextInput selectionColor={Theme.Colors.primary} placeholder={'Search for groceries'} style={{}} value={searchTerm} onChangeText={(text) => setSearchTerm(text)} />
                    </View>
                    <TouchableOpacity onPress={() => { clearFunction() }} style={{ paddingHorizontal: 5, }}>
                        <Icons name="close-circle" type="MaterialCommunityIcons" style={{ fontSize: 24, color: '#e2e2e2' }} />
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Text>{JSON.stringify(result, null, "       ")} </Text> */}
            <FlatList
                data={result}
                renderItem={({ item }) => (
                    <CardProductListScreen item={item} navigation={navigation} />
                )}
                keyExtractor={item => item?.id.toString()}
                ListEmptyComponent={emptyComponent}
                ItemSeparatorComponent={() => (
                    <View
                        style={{ height: 0.7, width: "90%", alignSelf: 'center', backgroundColor: '#EAEAEC', marginBottom: 5 }}
                    />
                )}
            />
        </View>
    )
}
const mapStateToProps = (state) => ({
    categories: state.home.categories,
})


export default connect(mapStateToProps, { searchItems })(SearchScreen)