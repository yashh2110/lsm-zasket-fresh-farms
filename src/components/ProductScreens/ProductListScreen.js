import React, { useEffect, useContext, useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";
import CustomHeader from "../common/CustomHeader";
import { getItemsByCategory } from "../../actions/home";
import { connect } from "react-redux";
import CardProductListScreen from "./CardProductListScreen";
import Loader from "../common/Loader";
import CartDown from "../common/cartDown";
import appsFlyer from "react-native-appsflyer";
import analytics from "@react-native-firebase/analytics";

const ProductListScreen = ({ route, navigation, getItemsByCategory }) => {
  const { item } = route?.params;
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    initialFunction();
  }, []);

  const initialFunction = async () => {
    getItemsByCategory(item?.id, async (res, status) => {
      if (status) {
        setProducts(res?.data);
        let itemName = [];
        let itemId = [];
        await res?.data?.forEach((el, index) => {
          itemId.push(el?.itemName);
          itemName.push(el?.id);
        });
        const eventName = "af_list_view";
        const eventValues = {
          af_content_type: itemName.join(","),
          af_content_list: itemId.join(","),
        };
        // console.log("sasasasasasasasasasasasasassassa", eventValues);
        appsFlyer.logEvent(
          eventName,
          eventValues,
          (res) => {
            // console.log("sucessssssssssssssssss", res);
            // alert(res)
          },
          (err) => {
            console.error(err);
          }
        );
        analytics().logEvent("list_view", {
          content_type: itemName.join(","),
          content_list: itemId.join(","),
        });
        // .then((res) => console.log("firebase_list_view", res));

        // console.warn(JSON.stringify(res?.data, null, "      "))
        setLoading(false);
        setRefresh(false);
      } else {
        setLoading(false);
        setRefresh(false);
      }
    });
  };
  const onRefresh = () => {
    setRefresh(true);
    initialFunction();
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <CustomHeader navigation={navigation} title={item?.categoryDisplayName} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <CardProductListScreen item={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item?.id.toString()}
          onRefresh={() => onRefresh()}
          refreshing={refresh}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 0.7,
                width: "90%",
                alignSelf: "center",
                backgroundColor: "#EAEAEC",
                marginBottom: 5,
              }}
            />
          )}
        />
        <CartDown navigation={navigation} />
      </View>
      {/* <Text>{JSON.stringify(products, null, "       ")} </Text> */}
      {loading ? <Loader /> : undefined}
    </View>
  );
};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { getItemsByCategory })(
  ProductListScreen
);
