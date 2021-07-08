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
import { getCreditTransactions } from "../../actions/wallet";
import moment from 'moment'
import Loader from '../common/Loader';
import { EventRegister } from 'react-native-event-listeners'



const MyWallet = ({ route, navigation, getCreditTransactions }) => {
    const [loading, setLoading] = useState(false)
    const [transactionsHistory, SetTransactionsHistory] = useState([])
    const [creditBalance, SetCreditBalance] = useState(0)

    useEffect(() => {
        let listener = EventRegister.addEventListener('successWallet', async (data) => {
            console.warn("datadatadata", data)
            initialFunction()
        })
        initialFunction()
        return () => {
            // alert("failll")
            EventRegister.removeEventListener('successWallet');
        };
    }, [])


    const initialFunction = async () => {
        setLoading(true)
        // const { reload } = route?.params;
        // alert(reload)
        getCreditTransactions(async (res, status) => {
            if (status) {
                // alert(JSON.stringify(res?.data, null, "       "))
                SetTransactionsHistory(res.data)
                // SetTransactionsHistory([])
                SetCreditBalance(res.data[0]?.customer?.creditBalance)
                setLoading(false)

            } else {
                setLoading(false)
                transactionsHistory([])


            }
        })
    }

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
                    <View style={{ marginTop: 15 }}>
                        <Text style={{ color: "#727272", fontSize: 14 }}>Available Balance</Text>
                        <Text style={{ textAlign: "center", marginTop: 5, fontWeight: "bold", fontSize: 20 }}>₹ {creditBalance ? creditBalance : 0}</Text>
                    </View>
                </View>
                <View style={{ justifyContent: "center", backgroundColor: 'white' }}>
                    {/* <Button rounded style={{ backgroundColor: "#e1171e", alignSelf: "center", width: ("90%"), justifyContent: "center", marginBottom: 10, marginTop: 6 }} onPress={() => { navigation.navigate('AddMoney', { creditBalance: creditBalance }) }}>
                        <Text style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: 16, letterSpacing: 0.2, color: "#ffffff" }}><Text style={{ fontSize: 18, color: "#ffffff" }}>+</Text> Add Money</Text>
                    </Button> */}
                    <TouchableOpacity style={{ height: 48, backgroundColor: "#e1171e", alignSelf: "center", width: ("90%"), justifyContent: "center", marginBottom: 10, marginTop: 6, borderRadius: 30 }} onPress={() => { navigation.navigate('AddMoney', { creditBalance: creditBalance }) }}>
                        <Text style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: 16, letterSpacing: 0.2, color: "#ffffff", textAlign: "center" }}><Text style={{ fontSize: 18, color: "#ffffff" }}>+</Text> Add Money</Text>
                    </TouchableOpacity>
                    <View style={{ width: ("90%"), backgroundColor: "#f4f4f4", alignSelf: "center", marginTop: 10, borderRadius: 8, padding: 14 }}>
                        <Text style={{ fontSize: 12, color: "#727272", }}>*This money can only be used to buy vegetables & groceries.</Text>
                        <Text style={{ fontSize: 12, color: "#727272", marginVertical: 10 }}>We will automatically deduct the amount corresponding to your order from your “wallet”.  At the time of checkout until you run out of credit.</Text>
                        <Text style={{ fontSize: 12, color: "#727272", }}>Your basket wallet also get credited automatically when zasket issues a cashbback, return of items credit etc.</Text>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', }} showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: '#f4f4f4', justifyContent: "center", alignItems: "center", marginTop: 15, padding: 5 }}>
                    </View>
                    {
                        transactionsHistory.length ?
                            <>
                                <View style={{ alignSelf: "center", width: ("90%"), marginTop: 8, height: 50 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ fontWeight: "bold", color: "#000000", fontSize: 16 }}>Transaction History</Text>
                                        <TouchableOpacity onPress={() => { navigation.navigate('TransactionHistory', { transactionsHistory: transactionsHistory }) }} style={{ width: 70, height: 35, }}>
                                            <Text style={{ color: "#2d87c9", fontSize: 14, fontWeight: "bold", textAlign: "center", }}>View All</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </>
                            : undefined
                    }

                    <FlatList
                        data={transactionsHistory}
                        renderItem={({ item }) =>
                            <View style={{ alignSelf: "center", width: ("90%"), marginBottom: 10 }}>
                                <View style={{ marginTop: "3%" }}>
                                    <Text style={{ fontWeight: "bold", color: "#000000", fontSize: 14.5 }}>Paid for order</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                                        <Text style={{ color: "#909090", fontSize: 12.5 }}>Payment Oder ID : #7654567-890</Text>
                                        {
                                            item.transactionType == "CREDIT" ?
                                                <>
                                                    <Text style={{ color: "#49c32c", fontSize: 12.5 }}>+ {item.customerCredit?.credit}</Text>

                                                </>
                                                :
                                                <Text style={{ color: "#f78e24", fontSize: 12.5 }}>- {item.customerCredit?.credit}</Text>

                                        }
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


export default connect(mapStateToProps, { getCreditTransactions })(MyWallet)