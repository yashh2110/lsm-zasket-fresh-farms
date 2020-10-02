import React, { Component, Fragment } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import Theme from '../../styles/Theme'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { NavigationScreenProp, ScrollView } from 'react-navigation';
interface State {
    list: any[]
    screenWidth: any
    screenHeight: any
}
interface Props {

};
export default class ShimmerLoader extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            list: [{}, {}],
            screenWidth: "",
            screenHeight: ""
        }
    }
    componentWillMount = async () => {
        await this.getScreenSize();
    }
    getScreenSize = () => {
        const screenWidth = Math.round(Dimensions.get('window').width);
        const screenHeight = Math.round(Dimensions.get('window').height);
        this.setState({ screenWidth: screenWidth, screenHeight: screenHeight })
        let card = Math.round(screenHeight / 100);
        let newArray = []
        for (let i = 0; i < card; i++) {
            newArray.push({})
        }
        this.setState({ list: newArray })
    }

    render() {
        return (
            <Fragment>
                <ScrollView style={[styles.loading]}>
                    <View style={{ width: '90%', alignSelf: 'center', flex: 1, paddingBottom: 50, paddingTop: 10 }}>
                        {this.state.list.map(element => {
                            return (
                                <View style={{ backgroundColor: Theme.Colors.light, elevation: 10, padding: 10, marginBottom: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View>
                                            <ShimmerPlaceHolder duration={900} autoRun={true} style={{ width: 50, height: 50, borderRadius: 50, }} />
                                        </View>
                                        <View style={{ paddingLeft: 10 }}>
                                            <ShimmerPlaceHolder duration={1000} autoRun={true} style={{ height: 13, width: 100 }} />
                                            <ShimmerPlaceHolder duration={1300} autoRun={true} style={{ height: 13, marginVertical: 10, }} />
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, marginTop: 10 }}>
                                        <ShimmerPlaceHolder duration={1100} autoRun={true} style={{ height: 13, width: 100 }} />
                                        <ShimmerPlaceHolder duration={800} autoRun={true} style={{ height: 13, marginVertical: 5, }} />
                                    </View>
                                    <View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </Fragment>
        )
    }
}
const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        elevation: 100,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        // opacity: 0.5,
        backgroundColor: Theme.Colors.light,
    },
})

