import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';
import { Dimensions } from "react-native";
import { connect } from 'react-redux';
import Theme from '../../styles/Theme';
import { MyText2 } from './MyText';
import Draggable from './Draggable';
const SCREEN_HEIGHT = Dimensions.get("window").height;
const EmptyComponent = ({ title, darkMode }: any) => {
    return (
        <View
            style={{
                // justifyContent: "center",
                alignItems: "center",
                height: SCREEN_HEIGHT,
                backgroundColor: darkMode ? Theme.Dark.backgroundColor : "#ddd"
            }}
        >
            <Draggable>
                <View style={{ marginTop: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView source={require('../../assets/json/NotFound1.json')} autoPlay loop style={{ width: 200, height: 200, }} />
                    <View style={{ flexDirection: 'row' }}>
                        <MyText2
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: 26,
                                color: darkMode ? "white" : "black"
                            }}
                        >
                            {title}
                        </MyText2>
                        <LottieView source={require('../../assets/json/sadEmoji.json')} autoPlay loop style={{ marginLeft: 5, width: 30, height: 30, }} />
                    </View>

                </View>
            </Draggable>
        </View>
    )
}

const mapStateToProps = (state: any) => ({
    darkMode: state.dark,
})


export default connect(mapStateToProps)(EmptyComponent)


const styles = StyleSheet.create({})
