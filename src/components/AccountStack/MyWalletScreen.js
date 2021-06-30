import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, Dimensions, Image, Linking, FlatList } from 'react-native';
import { Icon, Button } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import call from 'react-native-phone-call';

const MyWallet = ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const [datas, setDatas] = useState([])

    useEffect(() => {
        initialFunction()
    }, [])


    const initialFunction = async () => {

        await setDatas(
            [{
                header: "Paid for order",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "200"

            },
            {
                header: "Added to wallet",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "300"
            },
            {
                header: "Paid for order",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "400"
            },
            {
                header: "Added to wallet",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "200"
            },
            {
                header: "Paid for order",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "600"
            },
            {
                header: "Added to wallet",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "200"
            }]


        )
        console.warn("datasdatasdatas", datas)
    }
    const DATA = [
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'First Item',
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'Second Item',
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"My Wallet"} showSearch={false} />
            <View style={{ flex: 1, backgroundColor: '#f4f4f4' }} showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: 'white', padding: 15, marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            style={{ width: 125, height: 40, }}
                            resizeMode="contain"
                            source={require('../../assets/png/logo.png')}
                        />
                        <View style={{ justifyContent: "flex-end", alignItems: "center", }}>
                            <Text style={{ fontSize: 22, color: "#0f0f0f" }}>Wallet</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: "#727272", fontSize: 14 }}>Available Balance</Text>
                        <Text style={{ textAlign: "center", marginTop: 10, fontWeight: "bold", fontSize: 20 }}>₹ 400</Text>
                    </View>
                </View>
                <View style={{ justifyContent: "center", backgroundColor: 'white' }}>
                    <Button rounded style={{ backgroundColor: "#e1171e", alignSelf: "center", width: ("90%"), justifyContent: "center", marginBottom: 10, marginTop: 6 }} onPress={() => { navigation.navigate('AddMoney') }}>
                        <Text style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: 16, letterSpacing: 0.2, color: "#ffffff" }}><Text style={{ fontSize: 18, color: "#ffffff" }}>+</Text> Add Money</Text>
                    </Button>
                    <View style={{ width: ("90%"), backgroundColor: "#f4f4f4", alignSelf: "center", marginTop: 10, borderRadius: 8, padding: 10 }}>
                        <Text style={{ fontSize: 12, color: "#727272", }}>*This money can only be used to buy vegetables & groceries.</Text>
                        <Text style={{ fontSize: 12, color: "#727272", }}>We will automatically deduct the amount corresponding to your order from your “wallet”.  At the time of checkout until you run out of credit.</Text>
                        <Text style={{ fontSize: 12, color: "#727272", }}>Your basket wallet also get credited automatically when zasket issues a cashbback, return of items credit etc.</Text>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', }} showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: '#f4f4f4', justifyContent: "center", alignItems: "center", marginTop: 13, padding: 5 }}>
                    </View>
                    <View style={{ alignSelf: "center", width: ("90%"), marginTop: 8, height: 40 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ fontWeight: "bold", color: "#000000", fontSize: 16 }}>Transaction History</Text>
                            <TouchableOpacity onPress={() => { navigation.navigate('TransactionHistory') }} style={{ width: 65, height: 30 }}>
                                <Text style={{ color: "#2d87c9", fontSize: 14, fontWeight: "bold", textAlign: "center" }}>View All</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList
                        data={datas}
                        renderItem={({ item }) =>
                            <View style={{ alignSelf: "center", width: ("90%"), marginBottom: 15 }}>
                                <View style={{ marginTop: "4%" }}>
                                    <Text style={{ fontWeight: "bold", color: "#000000", fontSize: 15 }}>{item.header}</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ color: "#909090", fontSize: 12.2 }}>Payment Oder ID : {item.orderID}</Text>
                                        <Text style={{ color: "#f78e24", fontSize: 12.2 }}>- {item.Amount}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", width: ("50%"), justifyContent: "space-around", marginLeft: -8 }}>
                                        <Text style={{ color: "#909090", fontSize: 12.2 }}>{item.date}</Text>
                                        <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#c2c2c2", alignSelf: "center" }}></View>
                                        <Text style={{ color: "#909090", fontSize: 12.2 }}>{item.Time}</Text>
                                    </View>
                                </View>
                            </View>
                        }
                        ItemSeparatorComponent={() => (
                            <View
                                style={{ height: 0.7, width: "90%", alignSelf: 'center', backgroundColor: '#EAEAEC', }}
                            />
                        )}
                    // keyExtractor={item => item?.id.toString()}
                    />
                    {/* <View style={{ alignSelf: "center", width: ("90%"), marginTop: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ fontWeight: "bold", color: "#000000", fontSize: 16 }}>Transaction History</Text>
                            <Text style={{ color: "#2d87c9", fontSize: 14, fontWeight: "bold" }}>View All</Text>
                        </View>
                        <View style={{ marginTop: "4%" }}>
                            <Text style={{ fontWeight: "bold", color: "#000000", fontSize: 14 }}>Paid for order</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ color: "#909090", fontSize: 12 }}>Payment Oder ID : #7654567-890</Text>
                                <Text style={{ color: "#f78e24", fontSize: 12 }}>- 200</Text>
                            </View>
                            <View style={{ flexDirection: "row", width: ("50%"), justifyContent: "space-around", marginLeft: -8 }}>
                                <Text style={{ color: "#909090", fontSize: 12 }}>01 Oct 2020</Text>
                                <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#c2c2c2", alignSelf: "center" }}></View>
                                <Text style={{ color: "#909090", fontSize: 12 }}>06:00 PM</Text>
                            </View>
                        </View>
                    </View> */}

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, {})(MyWallet)