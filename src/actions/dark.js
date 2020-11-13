import { TOGGLE_DARK_MODE } from './types'
export const setDarkMode = (option) => dispatch => {
    dispatch({
        type: TOGGLE_DARK_MODE,
        payload: option
    })
}
