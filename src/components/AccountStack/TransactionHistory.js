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

const TransactionHistory = ({ navigation }) => {
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
                Amount: "200",
                Expires: "12 Oct 2020"


            },
            {
                header: "Added to wallet",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "300",
                Expires: ""
            },
            {
                header: "Paid for order",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "400",
                Expires: ""
            },
            {
                header: "Added to wallet",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "200",
                Expires: "12 Oct 2020"
            },
            {
                header: "Paid for order",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "600",
                Expires: ""
            },
            {
                header: "Added to wallet",
                orderID: "#872387238",
                date: "01 oct 2020",
                Time: "06:00 PM",
                Amount: "200",
                Expires: "12 Oct 2020"
            }]


        )
        console.warn("datasdatasdatas", datas)
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* <CustomHeader navigation={navigation} title={"Transaction History"} showSearch={false} /> */}
            <View style={{ height: 60, flexDirection: "row" }}>
                <TouchableOpacity
                    onPress={() => { navigation.goBack() }}
                    style={{ width: 60, justifyContent: 'center', alignItems: 'center', }}
                >
                    <>
                        <Icon name="chevron-small-left" type="Entypo" style={[{ color: 'black', fontSize: 36 }]} />
                    </>
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', }}>
                    <Text style={{ fontSize: 18, color: 'black', textTransform: 'capitalize', fontWeight: 'bold' }}>Transaction History </Text>
                </View>
                <TouchableOpacity
                    onPress={() => { }}
                    style={{ width: 60, justifyContent: "center", alignItems: "center" }}>
                    <Image
                        style={{ width: 20, height: 20, }}
                        resizeMode={"contain"}
                        source={require('../../assets/png/Iconfeather.png')}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, backgroundColor: '#f4f4f4' }} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, backgroundColor: 'white', }} showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: '#f4f4f4', justifyContent: "center", alignItems: "center", marginTop: 5, padding: 5 }}>
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
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ flexDirection: "row", width: ("45%"), justifyContent: "space-around", marginLeft: -6 }}>
                                            <Text style={{ color: "#909090", fontSize: 12.2 }}>{item.date}</Text>
                                            <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#c2c2c2", alignSelf: "center" }}></View>
                                            <Text style={{ color: "#909090", fontSize: 12.2 }}>{item.Time}</Text>
                                        </View>
                                        {
                                            item.Expires ?
                                                <>
                                                    <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#c2c2c2", alignSelf: "center", marginRight: 10 }}></View>
                                                    <Text style={{ color: "#909090", fontSize: 12.2, color: "#e1171e" }}>Expires on {item.Expires}</Text>

                                                </>
                                                :
                                                undefined

                                        }
                                    </View>
                                </View>
                            </View>
                        }
                        ItemSeparatorComponent={() => (
                            <View
                                style={{ height: 0.7, width: "90%", alignSelf: 'center', backgroundColor: '#EAEAEC', }}
                            />
                        )}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, {})(TransactionHistory)