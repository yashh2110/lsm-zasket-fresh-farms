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

const SearchScreen = ({ navigation, searchItems }) => {
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
            <View style={[{ marginTop: 10, width: '90%', alignSelf: 'center' }]}>
                {loading ?
                    <ActivityIndicator style={{}} size="large" color="grey" />
                    : searchTerm.length > 2 ?
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Draggable>
                                <LottieView
                                    style={{ width: '70%' }}
                                    source={require("../../assets/animations/sadSearch.json")}
                                    autoPlay
                                    loop
                                />
                            </Draggable>
                            {/* <Text>No items found</Text> */}
                        </View>
                        :
                        <>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Search by category</Text>
                            <View style={{ flexDirection: 'row', backgroundColor: 'white', height: 160 }}>
                                <TouchableOpacity onPress={() => { setSearchTerm("VEGETABLES") }} style={{ flex: 1, margin: 15, backgroundColor: '#F2F5F7', borderRadius: 4, overflow: 'hidden' }}>
                                    <Text style={{ padding: 15 }}>Vegetables</Text>
                                    <Image
                                        style={{ borderRadius: 5, position: 'absolute', bottom: 0, right: 0, width: 130, height: 80 }}
                                        resizeMode={"contain"}
                                        source={require('../../assets/png/HomeScreenVegetable.png')}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setSearchTerm("FRUITS") }} style={{ flex: 1, margin: 15, backgroundColor: '#F2F5F7', borderRadius: 4, overflow: 'hidden' }}>
                                    <Text style={{ padding: 15 }}>Fruits</Text>
                                    <Image
                                        style={{ borderRadius: 5, position: 'absolute', bottom: 0, right: 0, width: 150, height: 100 }}
                                        resizeMode={"contain"}
                                        source={require('../../assets/png/HomeScreenVegetable2.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                }
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: 90, backgroundColor: '#F8F8F8', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
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
                        <TextInput selectionColor={Theme.Colors.primary} placeholder={'Search for Vegetables, fruits…'} style={{}} value={searchTerm} onChangeText={(text) => setSearchTerm(text)} />
                    </View>
                    <TouchableOpacity onPress={() => { clearFunction() }} style={{ paddingHorizontal: 5, }}>
                        <Icons name="close-circle" type="MaterialCommunityIcons" style={{ fontSize: 24, color: '#e2e2e2' }} />
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Text>{JSON.stringify(result, null, "       ")}</Text> */}
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

})


export default connect(mapStateToProps, { searchItems })(SearchScreen)