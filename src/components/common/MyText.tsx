import React from "react";
import { StyleProp, Text, TextStyle } from 'react-native';
interface MyTextProps {
    style?: StyleProp<TextStyle>,
    children?: any
}
export const MyText1 = (props: MyTextProps) => <Text {...props} style={[{
    fontFamily: 'FredokaOne-Regular'
}, props.style]}>{props.children}</Text>

export const MyText2 = (props: MyTextProps) => <Text {...props} style={[{
    // fontFamily: 'ShadowsIntoLight-Regular'
}, props.style]}>{props.children}</Text>