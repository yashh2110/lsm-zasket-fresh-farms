import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, FlatList, Clipboard, PermissionsAndroid, ActivityIndicator, Share, SafeAreaView } from 'react-native';
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
import Modal from 'react-native-modal';
import FeatherIcons from "react-native-vector-icons/Feather"
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5"




const Referral = ({ getLeaderBoardList, route }) => {
    let [contacts, setContacts] = useState([]);
    const [titleText, setTitleText] = useState("Bird's Nest");
    const bodyText = "This is not really a bird nest.";
    const [loading, setLoading] = useState(false)
    const [referal, setReferal] = useState("")
    const [copymessage, setCopymessage] = useState(false)
    const [invitecopymessage, setInviteCopymessage] = useState(false)
    const [referalContent, setReferalContent] = useState({})
    const [dynamicLink, setDynamicLink] = useState("")
    const [leaderslist, setLeaderslist] = useState([])
    const [mobileNumber, setMobileNumber] = useState("")
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [selectedNumber, setSelectedNumber] = useState("")
    const [appShareInfo, setAppShareInfo] = useState({})





    // useEffect(() => {
    //     // alert(JSON.stringify(route, null, "        "))
    //     generateLink()

    // }, [])
    // const generateLink = async () => {
    //     let userDetails = await AsyncStorage.getItem('userDetails');
    //     let parsedUserDetails = await JSON.parse(userDetails);
    //     let referralCode = await parsedUserDetails?.customerDetails?.referralCode
    //     // alert(referralCode)
    //     try {
    //         const link = await firebase.dynamicLinks().buildShortLink({
    //             link: `https://zasket.page.link?referralCode=${referralCode}`,
    //             // link: `https://play.google.com/store/apps/details?id=com.zasket/?${SENDER_UID}`,
    //             android: {
    //                 packageName: 'com.zasket',
    //             },
    //             ios: {
    //                 bundleId: 'com.freshleaftechnolgies.zasket',
    //                 appStoreId: '1541056118',
    //             },
    //             domainUriPrefix: 'https://zasket.page.link',
    //         });
    //         setDynamicLink(link)
    //         console.log("qqqqqqqqqqq", link)
    //     } catch (error) {
    //         alert(error)
    //     }
    // }
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
    const dynamicSort = (property) => {
        var sortOrder = 1;

        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a, b) {
            if (sortOrder == -1) {
                return b[property].localeCompare(a[property]);
            } else {
                return a[property].localeCompare(b[property]);
            }
        }
    }
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
                let acendeingOrder = arr.sort(dynamicSort("displayName"))
                setContacts(acendeingOrder)
                setLoading(false)
            })
            .catch((e) => { //handle error })
                setLoading(false)
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
                setAppShareInfo(res?.appShareInfoResponse)
                // alert(JSON.stringify(res?.appShareInfoResponse, null, "       "))
                setLoading(false)
                // setRefresh(false)
            } else {
                setLoading(false)
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
    const moreShare = async () => {
        // alert(shareMessage)
        // return
        const toDataURL = (url) => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }))
        await toDataURL(appShareInfo?.image)
            .then(async (dataUrl) => {
                let split = dataUrl.split("base64,")
                // await setbase64Image(split[1])
                let shareImage = {
                    title: "Zasket",//string
                    message: `${appShareInfo?.content}`,
                    url: `data:image/png;base64,${split[1]}`,
                }
                Sharee.open(shareImage)
                    .then((res) => {
                    })
                    .catch((err) => {
                    });
            })
    }
    const removeFromString = (string, start, charToRemove) => {
        var newString = ''
        newString = string.slice(start, charToRemove);
        return newString
    }
    const whatsAppShares = async () => {
        console.log("222222222222222222222", selectedNumber)
        // alert(number)
        // return
        if (selectedNumber.length == 10) {
            let mobile = "91".concat(selectedNumber);
            specificNumber(mobile)
        } else if (selectedNumber.slice(0, 3) == "+91") {
            var arr = Array.from(selectedNumber);
            var items = arr.splice(1, arr.length);
            var result = items.join('');
            specificNumber(result)

        } else {
            specificNumber(selectedNumber)
        }
    }

    const specificNumber = async (mobile) => {
        const toDataURL = (url) => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }))
        toDataURL(appShareInfo?.image)
            .then(dataUrl => {
                let split = dataUrl.split("base64,")
                const shareOptions = {
                    title: "Zasket",//string
                    message: `${appShareInfo?.content}`,
                    url: `data:image/png;base64,${split[1]}`,
                    social: Sharee.Social.WHATSAPP,
                    whatsAppNumber: mobile,  // country code + phone number
                    // filename: 'test', // only for base64 file in Android
                };
                console.log("passssdadadadadadadadadadadad,", shareOptions.whatsAppNumber)
                try {
                    Sharee.shareSingle(shareOptions).catch(err => console.log(err));
                } catch (err) {
                    // moreShare()
                    // alert("notwhats app")
                    // do something
                }
            })
    }

    const whatsAppShare = async () => {
        try {
            const toDataURL = (url) => fetch(url)
                .then(response => response.blob())
                .then(blob => new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(blob)
                }))
            toDataURL(appShareInfo?.image)
                .then(dataUrl => {
                    let split = dataUrl.split("base64,")
                    const shareOptions = {
                        title: "Zasket",//string
                        message: `${appShareInfo?.content}`,
                        url: `data:image/png;base64,${split[1]}`,
                        failOnCancel: false,
                        social: Sharee.Social.WHATSAPP,

                    };
                    try {
                        Sharee.shareSingle(shareOptions).catch(err => console.log(err));
                    } catch (err) {
                        moreShare()
                        // alert("notwhats app")
                        // do something
                    }
                })
        } catch (error) {
            // alert(error)
        }


    }

    const onPressModal = async (number) => {
        setSelectedNumber(number)
        setIsVisible(true)
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
                                        <View style={{ width: 47, height: 47, borderRadius: 26, backgroundColor: "#f25881", justifyContent: "center", alignItems: "center", elevation: 5 }}>
                                            <Text style={{ textTransform: "capitalize", color: "#FFFFFF", fontWeight: "bold", fontSize: 18 }}>Z</Text>
                                        </View>
                                        :
                                        <View style={{ width: 47, height: 47, borderRadius: 26, backgroundColor: "#f25881", justifyContent: "center", alignItems: "center", elevation: 5 }}>
                                            <Text style={{ textTransform: "capitalize", color: "#FFFFFF", fontWeight: "bold", fontSize: 18 }}>{splitName(item.displayName)}</Text>
                                        </View>
                                }
                            </View>

                            <View style={{ paddingLeft: 10, justifyContent: "center", }}>
                                <Text style={{ marginVertical: 1, color: "black", fontSize: 15 }}>{item.displayName}</Text>
                                <Text style={{ color: "gray", fontSize: 14.5 }}>{item.number}</Text>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => onPressModal(item.number)} style={{ justifyContent: "center", width: 110, alignItems: "flex-end" }}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => onPressModal(item.number)} style={{
                                backgroundColor: "white", justifyContent: "center", borderRadius: 3, flexDirection: "row", alignItems: "center", padding: 5, height: 31, marginRight: 5, width: 80, borderWidth: 0.7, borderColor: "#efefef"
                            }}>
                                <Text onPress={() => onPressModal(item.number)} style={{ fontWeight: "bold", fontSize: 17, marginHorizontal: 6, color: "#e1171e" }}>+</Text>
                                <Text onPress={() => onPressModal(item.number)} style={{ fontSize: 14, fontWeight: "bold", marginHorizontal: 6, letterSpacing: 0.2, color: "#e1171e" }}>Invite</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View >
            </>
        )

    }



    const LeaderboardListItems = (item, index) => {
        return (
            <>
                <View style={{}}>
                    <View style={{ justifyContent: "space-between", flexDirection: "row", borderBottomColor: "#eaeaec", borderBottomWidth: 1.5, paddingTop: 11, width: "95%", alignSelf: "center", paddingBottom: 9, padding: 4 }}>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <View style={{}}>

                                {
                                    index == 0 ?
                                        <FastImage
                                            style={{ width: 47, height: 47, }}
                                            source={require('../../assets/png/firstRankLeader.png')}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        :
                                        index == 1 ?
                                            <FastImage
                                                style={{ width: 47, height: 47, }}
                                                source={require('../../assets/png/secondRankLeader.png')}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                            :
                                            index == 2 ?
                                                <FastImage
                                                    style={{ width: 47, height: 47, }}
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
                                <Text style={{ marginVertical: 3, color: "black", fontSize: 15, width: "85%", }}>{item?.name} </Text>
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
            <View style={{ backgroundColor: "#f4f4f4", flex: 1, }}>
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
    const tabChange = (index) => {
        // alert(index)
        setSelectedTabIndex(index)
    }

    const onPressWhatsUp = (number) => {
        // alert("jhvkj")
        setIsVisible(false)
        console.log("11111111111111111", number)
        whatsAppShares(number)

    }
    const onPressCopy = (text) => {
        setIsVisible(false)
        Clipboard.setString(text)
        setInviteCopymessage(true)
        setTimeout(() => {
            setInviteCopymessage(false)
        }, 4000)

    }
    const onPressMore = () => {
        setIsVisible(false)
        setTimeout(() => {
            moreShare()
        }, 500)

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
                                <FastImage
                                    style={{ width: 94, height: 94, }}
                                    source={require('../../assets/png/referIcon.png')}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                {/* <Image
                                    style={{ width: 94, height: 94, }}
                                    resizeMode="contain"
                                    source={require('../../assets/png/referIcon.png')}
                                /> */}
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
                                    <Text style={{ fontSize: 16.5, color: "#d8ad00", marginLeft: 10, fontWeight: 'bold', }}>{referal} </Text>
                                </View>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => { get_Text_From_Clipboard(referal) }} style={{ flexDirection: "row", height: 45, width: 35, justifyContent: "space-evenly", alignItems: "center", }}>
                                    <View style={{}}>
                                        <Image
                                            style={{ width: 30, height: 30, }}
                                            resizeMode="contain"
                                            source={require('../../assets/png/copyIcon.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => { whatsAppShare() }} style={{ width: "48%", height: 45, borderRadius: 10, justifyContent: "center", borderColor: "#1fa900", borderWidth: 1, backgroundColor: "#1fa900", marginTop: 3 }}>
                                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                    <View style={{ width: 22, height: 22, justifyContent: "center", alignItems: "center" }}>
                                        {/* <Image
                                            source={require('../../assets/png/whatsAppIcon.png')}
                                            style={{ height: 20, width: 20, alignSelf: "flex-start" }} resizeMode="cover"
                                        /> */}
                                        <FontAwesomeIcons name="whatsapp" color={"white"} size={21} />
                                        {/* <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold", alignSelf: "center", marginBottom: 3 }}>+</Text> */}
                                    </View>
                                    <View style={{}}>
                                        <Text style={{ color: "#f8f8f8", marginHorizontal: 6, fontSize: 15, fontWeight: "bold" }}>WhatsApp</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
                <LinearGradient
                    colors={['#ed873c', '#ec3c3c']}
                    style={{ height: 46, opacity: 0.9, zIndex: -1 }}
                    start={{ x: 0.4, y: 0.8 }}
                // start={{ x: 0.1, y: 0.9 }}
                // start={{ x: 0, y: 0 }}
                // end={{ x: 0.5, y: 0 }}
                // locations={[0, 0]}
                >
                    <View style={{ height: 46, flexDirection: "row", zIndex: 1 }}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { tabChange(0) }} style={{ width: "50%", justifyContent: "center", alignItems: "center" }}>
                            {/* <Text style={{}}>My refeeee</Text> */}
                            <Text style={[styles.tabText, selectedTabIndex == 0 ? { color: 'white', opacity: 1 } : null]}>My Referrals</Text>
                            {
                                selectedTabIndex == 0 &&
                                <View style={{ width: 31, height: 2.5, backgroundColor: "white", borderRadius: 5, position: "absolute", bottom: 6 }}></View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { tabChange(1) }} style={{ width: "50%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={[styles.tabText, selectedTabIndex == 1 ? { color: 'white', opacity: 1 } : null]}>Leaderboard</Text>
                            {
                                selectedTabIndex == 1 &&
                                <View style={{ width: 31, height: 2.5, backgroundColor: "white", borderRadius: 5, position: "absolute", bottom: 6 }}></View>
                            }
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                {
                    selectedTabIndex == 0 &&
                    <ContatsList />
                }
                {
                    selectedTabIndex == 1 &&
                    <LeaderboardList />
                }
            </View>
            {
                loading ?
                    <Loader /> : undefined
            }
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
            {
                invitecopymessage ?
                    <View style={{ position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center', left: 0, right: 0, bottom: 20 }}>
                        <View style={{ backgroundColor: "#191919", padding: 10, borderRadius: 10 }}>
                            <Text style={{ color: "#DCDCDC", letterSpacing: 0.2 }}>Invite message copied succcessfully</Text>
                        </View>
                    </View>
                    :
                    undefined
            }
            <Modal
                isVisible={isVisible}
                onSwipeComplete={() => setIsVisible(false)}
                swipeDirection="down"
                style={{ margin: 0, justifyContent: 'flex-end' }}
                onBackButtonPress={() => setIsVisible(false)}
                onBackdropPress={() => setIsVisible(false)}
            >
                <SafeAreaView style={{ height: 190, backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 16, color: 'black', marginTop: 18, fontWeight: "bold", marginLeft: 20, letterSpacing: 0.3 }}>Invite your friends via</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "65%", marginTop: 35, marginLeft: 20, justifyContent: "space-around" }}>
                        <TouchableOpacity onPress={() => { onPressWhatsUp(selectedNumber) }} style={{ justifyContent: "center", alignItems: "center", width: "30%", height: 50 }}>
                            <View style={{ width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center", backgroundColor: "#66e228" }}>
                                <FontAwesomeIcons name="whatsapp" color={"white"} size={20} />
                            </View>
                            {/* <Image
                                source={require('../../assets/png/whatsAppIcon.png')}
                                style={{ height: 25, width: 25, }} resizeMode="cover"
                            /> */}
                            <Text style={{ textAlign: "center", marginTop: 3, color: "#757575" }}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { onPressCopy(referal) }} style={{ width: "30%", justifyContent: "center", alignItems: "center" }}>
                            <View style={{ width: 30, height: 30, borderColor: "#757575", borderWidth: 1, borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
                                <FontAwesomeIcons name="copy" color={"#757575"} size={18} />
                                {/* <Image
                                    source={require('../../assets/png/whatsAppIcon.png')}
                                    style={{ height: 25, width: 25, }} resizeMode="cover"
                                /> */}
                            </View>
                            <Text style={{ textAlign: "center", marginTop: 3, color: "#757575" }}>Copy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onPressMore()} style={{ width: "30%", justifyContent: "center", alignItems: "center" }}>
                            <View style={{ width: 30, height: 30, borderColor: "#757575", borderWidth: 1, borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
                                <FeatherIcons name="more-horizontal" color={"#757575"} size={18} />
                                {/* <Image
                                    source={require('../../assets/png/whatsAppIcon.png')}
                                    style={{ height: 25, width: 25, }} resizeMode="cover"
                                /> */}
                            </View>
                            <Text style={{ textAlign: "center", marginTop: 3, color: "#757575" }}>More</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
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
    },
    tabText: {
        color: "#ebe6e4",
        fontSize: 14,
        opacity: 0.7
    }
});

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, { getLeaderBoardList })(Referral)