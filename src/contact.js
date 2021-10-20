// Access Device’s Contact List in React Native App
// https://aboutreact.com/access-contact-list-react-native/

// Import React
import React, { useState, useEffect } from 'react';

// Import all required component
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Share from 'react-native-share';
import Contacts from 'react-native-contacts';
// import ListItem from './components/ListItem';

const App = () => {
  let [contacts, setContacts] = useState([]);
  const [base64Image, setbase64Image] = useState([])

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
        console.log("newArraynewArraynewArraynewArraynewArraynewArraynewArray", JSON.stringify(arr, null, "    "))
      })
      .catch((e) => { //handle error })
      })
  };

  // const search = (text) => {
  //   const phoneNumberRegex =
  //     /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
  //   if (text === '' || text === null) {
  //     loadContacts();
  //   } else if (phoneNumberRegex.test(text)) {
  //     Contacts.getContactsByPhoneNumber(text, (err, contacts) => {
  //       contacts.sort(
  //         (a, b) =>
  //           a.givenName.toLowerCase() > b.givenName.toLowerCase(),
  //       );
  //       setContacts(contacts);
  //       console.log('contacts', contacts);
  //     });
  //   } else {
  //     Contacts.getContactsMatchingString(text, (err, contacts) => {
  //       contacts.sort(
  //         (a, b) =>
  //           a.givenName.toLowerCase() > b.givenName.toLowerCase(),
  //       );
  //       setContacts(contacts);
  //       console.log('contacts', contacts);
  //     });
  //   }
  // };

  const openContact = (contact) => {
    console.log(JSON.stringify(contact));
    Contacts.openExistingContact(contact, () => { });
  };
  const splitName = (name) => {
    return name.charAt(0)
  }
  const moreShare = () => {
    const toDataURL = (url) => fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }))
    toDataURL('https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0')
      .then(dataUrl => {
        let split = dataUrl.split("base64,")
        console.log('RESULT:', split[1])
        // setbase64Image(split[1])
        let shareImage = {
          title: "caption",//string
          message: "https://play.google.com/store/search?q=gravity%20care",//string
          url: `data:image/png;base64,${split[1]}`,
        }

        Share.open(shareImage).catch(err => console.log(err));
      })
  }
  const whatsAppShare = (number) => {
    // alert(number)
    if (number.length == 10) {
      let mobile = "91".concat(number);
      console.log("asdasdasdasdasdasdasd", mobile)
    }
    // let split = number.slice(0, 3)
    // if(split == )
    // alert(split)

    return
    const toDataURL = (url) => fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }))
    toDataURL('https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0')
      .then(dataUrl => {
        let split = dataUrl.split("base64,")
        console.log('RESULT:', split[1])
        // setbase64Image(split[1])
        const shareOptions = {
          title: 'Share via',
          message: "https://play.google.com/store/search?q=gravity%20care",//string
          url: `data:image/png;base64,${split[1]}`,
          social: Share.Social.WHATSAPP,
          whatsAppNumber: "918778136382",  // country code + phone number
          filename: 'test', // only for base64 file in Android
        };
        Share.shareSingle(shareOptions).catch(err => console.log(err));
      })
  }
  const renderItemComponentList = (item) => {
    return (
      <>
        <View style={{ width: "95%", alignSelf: "center" }}>
          <View style={{ padding: 10, justifyContent: "space-between", flexDirection: "row", borderBottomColor: "gray", borderBottomWidth: 0.2 }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {
                  (splitName(item.displayName) == "+" || isNaN(item.displayName) == false) ?
                    <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: "lightgray", justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ textTransform: "capitalize", color: "red" }}>D</Text>
                    </View>
                    :
                    <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: "lightgray", justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ textTransform: "capitalize", color: "red" }}>{splitName(item.displayName)}</Text>
                    </View>
                }
              </View>

              <View style={{ paddingLeft: 10, justifyContent: "center", }}>
                <Text style={{ marginVertical: 3, fontWeight: "bold", color: "black" }}>{item.displayName}</Text>
                <Text style={{ color: "gray" }}>{item.number}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => whatsAppShare("8778136382")} style={{ justifyContent: "center" }}>
              <View style={{ height: 25, backgroundColor: "white", justifyContent: "center", borderRadius: 2, elevation: 1, }}>
                <Text style={{ fontSize: 14, marginHorizontal: 15 }}>Invite</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )

  }
  const renderItemComponentNumber = (item) => {
    return (
      <Text style={{ backgroundColor: "blue" }}>{item.number}</Text>
    )

  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>
          Access Contact List in React Native
        </Text>
        <FlatList
          data={contacts}
          renderItem={({ item }) =>
            renderItemComponentList(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4591ed',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 20,
  },
  searchBar: {
    backgroundColor: '#f0eded',
    paddingHorizontal: 30,
    paddingVertical: Platform.OS === 'android' ? undefined : 15,
  },
});