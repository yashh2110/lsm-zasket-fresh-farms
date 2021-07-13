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
import moment from 'moment'
import Loader from '../common/Loader';

const TransactionHistory = ({ route, navigation }) => {
    const [loading, setLoading] = useState(false)
    const [transactionsHistorys, setTransactionsHistory] = useState([])
    const { transactionsHistory } = route?.params;

    useEffect(() => {
        setLoading(true)

        // alert(JSON.stringify(transactionsHistory, null, "       "))
        initialFunction()
    }, [])


    const initialFunction = async () => {
        setLoading(true)

        setTransactionsHistory(transactionsHistory)
        setLoading(false)

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
                {/* <TouchableOpacity
                    onPress={() => { }}
                    style={{ width: 60, justifyContent: "center", alignItems: "center" }}>
                    <Image
                        style={{ width: 20, height: 20, }}
                        resizeMode={"contain"}
                        source={require('../../assets/png/Iconfeather.png')}
                    />
                </TouchableOpacity> */}
            </View>
            <View style={{ flex: 1, backgroundColor: '#f4f4f4' }} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, backgroundColor: 'white', }} showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: '#f4f4f4', justifyContent: "center", alignItems: "center", marginTop: 5, padding: 5 }}>
                    </View>
                    <FlatList
                        data={transactionsHistorys}
                        renderItem={({ item }) =>
                            <View style={{ alignSelf: "center", width: ("90%"), marginBottom: 10 }}>
                                <View style={{ marginTop: "3%" }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ width: '80%', }}>
                                            <Text style={{ fontWeight: "bold", color: "#000000", fontSize: 14.5 }}>{item.heading}</Text>
                                            <Text style={{ color: "#909090", fontSize: 12.5 }}>{item.subHeading}</Text>
                                        </View>
                                        <View style={{ alignItems: "center", justifyContent: "flex-end" }}>
                                            {
                                                item.transactionType == "CREDIT" ?
                                                    <>
                                                        <Text style={{ color: "#49c32c", fontSize: 12.5 }}>+ {item.customerCredit?.credit}</Text>

                                                    </>
                                                    :
                                                    <Text style={{ color: "#f78e24", fontSize: 12.5 }}>- {item.customerCredit?.credit}</Text>

                                            }
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: 3 }}>
                                        <View style={{ flexDirection: "row", width: ("44%"), justifyContent: "space-around", marginLeft: -5, }}>
                                            <Text style={{ color: "#909090", fontSize: 12.5 }}>{moment(item.customerCredit.createdAt).format("DD MMM YYYY")}</Text>
                                            <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#c2c2c2", alignSelf: "center" }}></View>
                                            <Text style={{ color: "#909090", fontSize: 12.5 }}>{moment(item.customerCredit.createdAt, "HH:mm:ss").format("LT")}</Text>
                                        </View>
                                        {
                                            (item.customerCredit.isLifeTimeValidity == false && item.customerCredit.isExpired == false) &&
                                            <>
                                                <View style={{ flexDirection: "row", width: ("45%"), justifyContent: "space-around" }}>
                                                    <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#c2c2c2", alignSelf: "center" }}></View>
                                                    <Text style={{ color: "#e1171e", fontSize: 12.5 }}>Expires on {moment(item.customerCredit.expiredAt).format("DD MMM YYYY")}</Text>
                                                </View>

                                            </>
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
                    // keyExtractor={item => item?.id.toString()}
                    />


                </View>
            </View>
            {loading ?
                <Loader /> : undefined}
        </View>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, {})(TransactionHistory)