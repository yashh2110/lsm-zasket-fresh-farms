import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, Dimensions, Image, Linking, FlatList, TextInput } from 'react-native';
import { Icon, Button } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import call from 'react-native-phone-call';

const AddMoney = ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const [datas, setDatas] = useState([])
    const [amount, setAmount] = useState("")

    useEffect(() => {
        // initialFunction()
    }, [])



    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Add Money"} showSearch={false} />
            <View style={{ flex: 1, backgroundColor: '#f4f4f4' }} showsVerticalScrollIndicator={false}>
                <View style={{ height: "56%", backgroundColor: 'white', marginTop: 10, }} showsVerticalScrollIndicator={false}>
                    <View style={{ width: "90%", alignSelf: "center", marginTop: 15, }}>
                        <View style={{ flexDirection: "row", }}>
                            <Image
                                style={{ width: 125, height: 40, }}
                                resizeMode="contain"
                                source={require('../../assets/png/logo.png')}
                            />
                            <View style={{ justifyContent: "flex-end", alignItems: "center", }}>
                                <Text style={{ fontSize: 22, color: "#0f0f0f" }}>Wallet</Text>
                            </View>

                        </View>
                        <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ color: "#727272", fontSize: 12, marginRight: 10 }}>Available Balance</Text>
                            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 15 }}>₹ 400</Text>
                        </View>
                        <View style={{ marginTop: ("12%"), }}>
                            <Text style={{ color: "#727272", fontSize: 12, }}>Enter Amount</Text>
                            <TextInput
                                style={{ height: 40, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#D8D8D8', }}
                                onChangeText={text => setAmount({ amount: text })}
                                value={amount}
                            />
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", backgroundColor: 'white', marginTop: 50 }}>
                        <Button rounded style={{ backgroundColor: "#e1171e", alignSelf: "center", width: ("90%"), justifyContent: "center", marginBottom: 10, marginTop: 6 }} onPress={() => { navigation.navigate('WalletSuccessScreen') }}>
                            <View style={{ width: 100, flexDirection: "row" }}>
                                <Text style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: 16, letterSpacing: 0.1, color: "#ffffff" }}>Proceed</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: -5 }}>
                                    <Icon name="chevron-small-right" type="Entypo" style={[{ color: '#ffffff', fontSize: 24, }]} />
                                </View>
                            </View>
                        </Button>
                        {/* <View style={{ width: "90%", alignSelf: "center" }}> */}
                        <Text style={{ fontSize: 12, color: "#727272", textAlign: "center", marginTop: 10 }}>*Paying through zasket wallet will get extra discounts</Text>
                        {/* </View> */}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, {})(AddMoney)