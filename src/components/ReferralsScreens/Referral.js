import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, FlatList, Clipboard, PermissionsAndroid, Share } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollableTab, Tab, Tabs, Icon } from "native-base";
import Theme from '../../styles/Theme';
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux';
import { getLeaderBoardList } from "../../actions/wallet";
import Contacts from 'react-native-contacts';
import Sharee from 'react-native-share';
import firebase from '@react-native-firebase/app'
import FastImage from 'react-native-fast-image'
import Loader from '../common/Loader';

const Referral = ({ getLeaderBoardList, route }) => {
    let [contacts, setContacts] = useState([]);
    const [titleText, setTitleText] = useState("Bird's Nest");
    const bodyText = "This is not really a bird nest.";
    const [loading, setLoading] = useState(false)
    const [referal, setReferal] = useState("")
    const [copymessage, setCopymessage] = useState(false)
    const [referalContent, setReferalContent] = useState({})
    const [dynamicLink, setDynamicLink] = useState("")
    const [leaderslist, setLeaderslist] = useState([])
    const [mobileNumber, setMobileNumber] = useState("")



    useEffect(() => {
        // alert(JSON.stringify(route, null, "        "))
        generateLink()

    }, [])
    const generateLink = async () => {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let referralCode = await parsedUserDetails?.customerDetails?.referralCode
        // alert(referralCode)
        try {
            const link = await firebase.dynamicLinks().buildShortLink({
                link: `https://zasket.page.link?referralCode=${referralCode}`,
                // link: `https://play.google.com/store/apps/details?id=com.zasket/?${SENDER_UID}`,
                android: {
                    packageName: 'com.zasket',
                },
                ios: {
                    bundleId: 'com.freshleaftechnolgies.zasket',
                    appStoreId: '1541056118',
                },
                domainUriPrefix: 'https://zasket.page.link',
            });
            setDynamicLink(link)
            console.log("qqqqqqqqqqq", link)
        } catch (error) {
            alert(error)
        }
    }
    useEffect(() => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: 'Contacts',
                message: 'This app would like to view your contacts.',
            }).then(() => {
                // alert("pass")
                loadContacts();
            }
            );
        } else {
            loadContacts();
        }
    }, []);

    const loadContacts = () => {
        Contacts.getAll()
            .then((contacts) => {
                var arr = [];
                contacts.forEach(elements =>
                    elements?.phoneNumbers?.forEach(element =>
                        arr.push(
                            {
                                displayName: elements.displayName,
                                number: element.number
                            }
                        )
                    )
                );
                let sortedArrayyy = arr.sort(function (a, b) {
                    // console.log("aaaaa", a.displayName)
                    return a.displayName - b.displayName;;
                });
                setContacts(arr)
                // console.log("newArraynewArraynewArraynewArraynewArraynewArraynewArray", JSON.stringify(arr, null, "    "))
            })
            .catch((e) => { //handle error })
            })
    };
    useEffect(() => {
        initialFunction()
    }, [])
    const splitName = (name) => {
        return name.charAt(0)
    }
    const initialFunction = async () => {
        setLoading(true)
        getLeaderBoardList(async (res, status) => {
            if (status) {
                // alert(JSON.stringify(res, null, "       "))
                setReferalContent(res?.referralContent)
                setLeaderslist(res?.leaders)
                // setLeaderslist([
                //     {
                //         "customerId": 33,
                //         "name": "Mahesh ",
                //         "earnedAmount": 5000
                //     },
                //     {
                //         "customerId": 33,
                //         "name": "ramullll",
                //         "earnedAmount": 100
                //     },
                //     {
                //         "customerId": 33,
                //         "name": "ramuu",
                //         "earnedAmount": 2000
                //     },
                //     {
                //         "customerId": 33,
                //         "name": "kumar",
                //         "earnedAmount": 899
                //     },
                //     {
                //         "customerId": 33,
                //         "name": "raviii",
                //         "earnedAmount": 9000
                //     },
                //     {
                //         "customerId": 33,
                //         "name": "Sunkari",
                //         "earnedAmount": 160
                //     },
                //     {
                //         "customerId": 33,
                //         "name": "ujjajhhah",
                //         "earnedAmount": 145
                //     },
                //     {
                //         "customerId": 33,
                //         "name": "Harish",
                //         "earnedAmount": 8000
                //     }
                // ]
                // )
                // alert(JSON.stringify(res?.leaders, null, "      "))
                // console.log("1111111112121212121", JSON.stringify(res?.leaders, null, "      "))
                // SetTransactionsHistory(res.data)
                // // SetTransactionsHistory([])
                // SetCreditBalance(res.data[0]?.customer?.creditBalance)
                setLoading(false)
                // setRefresh(false)
            } else {
                // alert("errrr")
                setLoading(false)
                // transactionsHistory([])
                // setRefresh(false)
            }
        })
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let referralCode = await parsedUserDetails?.customerDetails?.referralCode
        // alert(referralCode)
        setReferal(referralCode)
        setLoading(false)

    }

    const get_Text_From_Clipboard = (text) => {
        Clipboard.setString(text)
        setCopymessage(true)
        setTimeout(() => {
            setCopymessage(false)
        }, 4000)
    }
    const whatsupShare = () => {
        alert("jhvkhvkj")
    }
    const moreShare = (title, description) => {
        // const toDataURL = (url) => fetch(url)
        //     .then(response => response.blob())
        //     .then(blob => new Promise((resolve, reject) => {
        //         const reader = new FileReader()
        //         reader.onloadend = () => resolve(reader.result)
        //         reader.onerror = reject
        //         reader.readAsDataURL(blob)
        //     }))
        // toDataURL()
        //     .then(dataUrl => {
        //         let split = dataUrl.split("base64,")
        //         // setbase64Image(split[1])

        //     })
        let shareImage = {
            title: "Zasket",//string
            message: `${title}${description} ${dynamicLink}`,
            // url: `data:image/png;base64,${split[1]}`,
        }
        Sharee.open(shareImage).catch(err => console.log(err));
    }
    const removeFromString = (string, start, charToRemove) => {
        var newString = ''
        newString = string.slice(start, charToRemove);
        return newString
    }
    const whatsAppShare = async (number) => {
        if (number.length == 10) {
            let mobile = "91".concat(number);
            console.log("asdasdasdasdasdasdasd", mobile)
            setMobileNumber(mobile)
        } else if (number.slice(0, 3) == "+91") {
            var arr = Array.from(number);
            var items = arr.splice(1, arr.length);
            var result = items.join('');
            setMobileNumber(result)
        } else {
            setMobileNumber(number)
        }
        const shareOptions = {
            title: 'Zasket',
            message: `${referalContent?.title}${referalContent?.description} ${dynamicLink}`,
            // url: `data:image/png;base64,${split[1]}`,
            social: Sharee.Social.WHATSAPP,
            whatsAppNumber: mobileNumber,  // country code + phone number
            // filename: 'test', // only for base64 file in Android
        };
        try {
            Sharee.shareSingle(shareOptions).catch(err => console.log(err));
        } catch (err) {
            moreShare()
            // alert("notwhats app")
            // do something
        }
        // const toDataURL = (url) => fetch(url)
        //     .then(response => response.blob())
        //     .then(blob => new Promise((resolve, reject) => {
        //         const reader = new FileReader()
        //         reader.onloadend = () => resolve(reader.result)
        //         reader.onerror = reject
        //         reader.readAsDataURL(blob)
        //     }))
        // toDataURL()
        //     .then(dataUrl => {
        //         // let split = dataUrl.split("base64,")
        //         const shareOptions = {
        //             title: 'Zasket',
        //             message: `${referalContent?.title}${referalContent?.description} ${dynamicLink}`,
        //             // url: `data:image/png;base64,${split[1]}`,
        //             social: Sharee.Social.WHATSAPP,
        //             whatsAppNumber: mobileNumber,  // country code + phone number
        //             // filename: 'test', // only for base64 file in Android
        //         };
        //         try {
        //             Sharee.shareSingle(shareOptions).catch(err => console.log(err));
        //         } catch (err) {
        //             moreShare()
        //             // alert("notwhats app")
        //             // do something
        //         }
        //     })
    }

    const renderItemComponentList = (item) => {
        return (
            <>
                <View style={{ width: "95%", alignSelf: "center" }}>
                    <View style={{ justifyContent: "space-between", flexDirection: "row", borderBottomColor: "#eaeaec", borderBottomWidth: 0.8, paddingTop: 13, paddingBottom: 13 }}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                {
                                    (splitName(item.displayName) == "+" || isNaN(item.displayName) == false) ?
                                        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "#f25881", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ textTransform: "capitalize", color: "#FFFFFF", fontWeight: "bold", fontSize: 18 }}>Z</Text>
                                        </View>
                                        :
                                        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "#f25881", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ textTransform: "capitalize", color: "#FFFFFF", fontWeight: "bold", fontSize: 18 }}>{splitName(item.displayName)}</Text>
                                        </View>
                                }
                            </View>

                            <View style={{ paddingLeft: 10, justifyContent: "center", }}>
                                <Text style={{ marginVertical: 3, fontWeight: "bold", color: "black", fontSize: 15 }}>{item.displayName}</Text>
                                <Text style={{ color: "gray", fontSize: 14.5 }}>{item.number}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => whatsAppShare(item.number)} style={{ justifyContent: "center" }}>
                            <View style={{ height: 25, backgroundColor: "white", justifyContent: "center", borderRadius: 2, elevation: 1, flexDirection: "row", alignItems: "center", padding: 5, height: 30 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 17, marginHorizontal: 6, color: "#e1171e" }}>+</Text>
                                <Text style={{ fontSize: 14, fontWeight: "bold", marginHorizontal: 6, letterSpacing: 0.2, color: "#e1171e" }}>Invite</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        )

    }



    const LeaderboardListItems = (item, index) => {
        return (
            <>
                <View style={{}}>
                    <View style={{ justifyContent: "space-between", flexDirection: "row", borderBottomColor: "#eaeaec", borderBottomWidth: 1.5, paddingTop: 10, paddingBottom: 10 }}>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <View style={{}}>

                                {
                                    index == 0 ?
                                        <FastImage
                                            style={{ width: 50, height: 50, }}
                                            source={require('../../assets/png/firstRankLeader.png')}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        :
                                        index == 1 ?
                                            <FastImage
                                                style={{ width: 50, height: 50, }}
                                                source={require('../../assets/png/secondRankLeader.png')}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                            :
                                            index == 2 ?
                                                <FastImage
                                                    style={{ width: 50, height: 50, }}
                                                    source={require('../../assets/png/thirdRankLeader.png')}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                />
                                                :
                                                index >= 3 ?
                                                    <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "#f7a2a1", justifyContent: "center", alignItems: "center", elevation: 4 }}>
                                                        <Text style={{ textTransform: "capitalize", color: "#FFFFFF", fontWeight: "bold", fontSize: 18 }}>{index}</Text>
                                                    </View>
                                                    :
                                                    undefined
                                }
                            </View>
                            <View style={{ paddingLeft: 15, justifyContent: "space-between", flexDirection: "row", alignSelf: "center", flex: 1 }}>
                                <Text style={{ marginVertical: 3, fontWeight: "bold", color: "black", fontSize: 15, width: "85%", }}>{item?.name} </Text>
                            </View>
                            <View style={{ justifyContent: "center" }}>
                                <Text style={{ marginVertical: 3, fontWeight: "bold", color: "black", fontSize: 15, textAlign: "center", width: 100, textAlign: "right" }}>₹ {item?.earnedAmount}</Text>

                            </View>
                        </View>

                    </View>
                </View>
            </>
        )

    }

    // ContatsList Lists
    const ContatsList = () => {
        return (
            <FlatList
                data={contacts}
                renderItem={({ item }) =>
                    renderItemComponentList(item)}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    }






    // Leaderboard Lists
    const LeaderboardList = () => {
        return (
            <View style={{ backgroundColor: "#f4f4f4", flex: 1, padding: 15 }}>
                <FlatList
                    data={leaderslist}
                    renderItem={({ item, index }) =>
                        LeaderboardListItems(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
    // OnChange Tab
    const onChangetab = (i, ref, from) => {

    }
    return (
        <>
            <View style={styles.container}>
                <View style={{}}>
                    <LinearGradient colors={['#ec3c3c', '#ed873c',]} start={{ x: 0.9, y: 0.6 }}
                        style={{ padding: 10, paddingTop: 10, paddingBottom: 25 }}
                    >
                        <View style={{ flexDirection: "row", paddingTop: 10 }}>
                            <View style={{}}>
                                <Image
                                    style={{ width: 85, height: 85, }}
                                    resizeMode="contain"
                                    source={require('../../assets/png/referIcon.png')}
                                />
                            </View>
                            <View style={{ paddingLeft: 20, paddingTop: 3, flex: 1, }}>
                                <View style={{ width: "90%" }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 16, color: "#FFFFFF" }}>{referalContent?.title}</Text>
                                    {/* <Text style={{ fontWeight: "bold", fontSize: 16, color: "#FFFFFF" }}>& earn over ₹100</Text> */}
                                </View>
                                <View style={{ paddingTop: 6, width: "98%" }}>
                                    <Text style={{ fontSize: 14, color: "#FFFFFF" }}>{referalContent?.description}</Text>
                                    {/* <Text style={{ fontSize: 14, color: "#FFFFFF" }}>invite and make their first order.</Text> */}
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, }}>
                            <View style={{ borderRadius: 10, width: "50%", alignSelf: "center", flexDirection: 'row', borderStyle: 'dashed', borderRadius: 10, backgroundColor: "white", alignItems: "center", borderWidth: 2, borderColor: '#d8ad00', zIndex: 0, marginLeft: -1 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, color: "#d8ad00", marginLeft: 10, fontWeight: 'bold', }}>{referal} </Text>
                                </View>
                                <TouchableOpacity onPress={() => { get_Text_From_Clipboard(referal) }} style={{ flexDirection: "row", height: 50, width: 35, justifyContent: "space-evenly", alignItems: "center", }}>
                                    <View style={{}}>
                                        <Image
                                            style={{ width: 29, height: 29, }}
                                            resizeMode="contain"
                                            source={require('../../assets/png/copyIcon.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => { moreShare(referalContent?.title, referalContent?.description) }} style={{ width: "48%", height: 52, borderRadius: 10, justifyContent: "center", borderColor: "#1fa900", borderWidth: 1, backgroundColor: "#1fa900" }}>
                                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                    <View style={{ width: 22, height: 22, borderStyle: 'dashed', borderRadius: 10, borderWidth: 1.5, borderColor: '#FFFFFF', justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold", alignSelf: "center", marginBottom: 3 }}>+</Text>
                                    </View>
                                    <View style={{}}>
                                        <Text style={{ color: "#FFFFFF", marginHorizontal: 6, fontWeight: "bold", fontSize: 15 }}>More options</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
                <View style={{ flex: 1, backgroundColor: '#f4f4f4', borderTopColor: "#e5e5e5", }} >
                    <Tabs
                        onChangeTab={({ i, ref, from }) => onChangetab(i, ref, from)}
                        tabBarUnderlineStyle={"#FFFFFF"}
                        renderTabBar={() => <ScrollableTab
                            style={{
                                alignSelf: "center", width: "100%"
                            }} />}>
                        <Tab tabStyle={{ backgroundColor: "transparent" }} textStyle={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 12 }} activeTextStyle={{ fontWeight: 'bold', color: "#FFFFFF", fontSize: 10 }} activeTabStyle={{ backgroundColor: "transparent", width: "45%" }} heading={"My Referrals"}>
                            <ContatsList />
                        </Tab>
                        <Tab tabStyle={{ backgroundColor: "transparent" }} textStyle={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 12 }} activeTextStyle={{ fontWeight: 'bold', color: "#FFFFFF", fontSize: 10 }} activeTabStyle={{ backgroundColor: "transparent", width: "45%" }} heading={`Leaderboard`}>
                            <LeaderboardList />
                        </Tab>
                    </Tabs>
                </View>

            </View>
            {loading ?
                <Loader /> : undefined}
            {
                copymessage ?
                    <View style={{ position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center', left: 0, right: 0, bottom: 10 }}>
                        <View style={{ backgroundColor: "#191919", padding: 10, borderRadius: 10 }}>
                            <Text style={{ color: "#DCDCDC", letterSpacing: 0.2 }}>Copied to Clipboard</Text>
                        </View>
                    </View>
                    :
                    undefined
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold"
    }
});

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, { getLeaderBoardList })(Referral)