import AsyncStorage from '@react-native-community/async-storage';
import { ADD_LOCATION, DELETE_LOCATION } from './types'

export const addLocation = (item) => async dispatch => {
    await AsyncStorage.setItem("location", JSON.stringify(item));
    dispatch({
        type: ADD_LOCATION,
        payload: item
    })
}

export const deleteLocation = () => dispatch => {
    dispatch({
        type: DELETE_LOCATION,
    })
}
