import AsyncStorage from '@react-native-community/async-storage';
import { ADD_HOMESCREEN_LOCATION, DELETE_LOCATION } from './types'

export const addHomeScreenLocation = (item) => async dispatch => {
    dispatch({
        type: ADD_HOMESCREEN_LOCATION,
        payload: item
    })
}
