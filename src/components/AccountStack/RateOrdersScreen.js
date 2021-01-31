import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, FlatList, Dimensions, Image, TextInput } from 'react-native';
import { Icon, Toast } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import CardMyOrders from "./CardMyOrders";
import Loader from "../common/Loader";
import moment from 'moment'
import StarRating from 'react-native-star-rating';
import { rateOrder } from '../../actions/cart'
const RateOrdersScreen = ({ route, navigation, config, rateOrder }) => {
    const { item } = route?.params;
    const [rating, setRating] = useState(0)
    const [feedBack, setFeedBack] = useState("")

    const onPressSubmit = () => {
        let rateOrderRequest = {
            "feedback": feedBack,
            "rated": rating
        }
        rateOrder(item?.id, rateOrderRequest, (res, status) => {
            if (status) {
                // alert(JSON.stringify(res))
                navigation.goBack()
            } else {
                // alert(JSON.stringify(res?.response))
                // console.warn(JSON.stringify(res?.response, null, "      "))
            }
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Rate your Order"} showSearch={false} />
            <ScrollView style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={true}>
                <View style={{ backgroundColor: 'white', marginTop: 10 }}>
                    <Image
                        style={{ height: 200, width: "100%" }}
                        resizeMode={"center"}
                        source={require('../../assets/png/rateOrder.png')}
                    />
                    <Text style={{ fontWeight: 'bold', fontSize: 16, alignSelf: 'center', marginTop: 10 }}>Rate your Order</Text>
                    <Text style={{ color: '#727272', fontSize: 13, alignSelf: 'center', marginTop: 10 }}>Honest rating help us improve</Text>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={rating}
                        starSize={30}
                        halfStarEnabled={false}
                        containerStyle={{ width: "60%", alignSelf: 'center', marginTop: 20 }}
                        fullStar={require('../../assets/png/full.png')}
                        emptyStar={require('../../assets/png/null.png')}
                        halfStar={require('../../assets/png/half.png')}
                        selectedStar={(i) => {
                            setRating(i)
                        }}
                    />
                    <View style={{ backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 16, }}>
                        <View style={[styles.textAreaContainer, { borderBottomColor: "#B9B9B9", borderBottomWidth: 1 }]}>
                            <TextInput
                                onChangeText={(text) => { setFeedBack(text) }}
                                value={feedBack}
                                style={styles.textArea}
                                underlineColorAndroid="transparent"
                                placeholder="Tell how your experience was with us…"
                                numberOfLines={10}
                                multiline={true}
                            />
                        </View>
                    </View>
                </View>
                {rating <= 0 ?
                    <View style={{ flex: 1, backgroundColor: "#F5B0B2", borderRadius: 100, justifyContent: 'center', alignItems: "center", padding: 10, marginTop: 15, width: 200, alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Submit </Text>
                    </View>
                    :
                    <TouchableOpacity onPress={() => { onPressSubmit() }} style={{ flex: 1, backgroundColor: Theme.Colors.primary, borderRadius: 100, justifyContent: 'center', alignItems: "center", padding: 10, marginTop: 15, width: 200, alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Submit </Text>
                    </TouchableOpacity>
                }
                {/* <Text Text style={{ marginBottom: 16 }}> {JSON.stringify(item, null, "       ")} </Text> */}
            </ScrollView >
            <Text style={{ color: '#727272', fontSize: 11, alignSelf: 'center', padding: 5 }}>This information is only used to improve our service</Text>
        </View >
    );
}


const mapStateToProps = (state) => ({
    config: state.config.config,
})


export default connect(mapStateToProps, { rateOrder })(RateOrdersScreen)

const styles = StyleSheet.create({
    textAreaContainer: {
        padding: 5
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top'
    }
});
