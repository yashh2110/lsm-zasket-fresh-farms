import { ADD_LOCATION, DELETE_LOCATION } from '../actions/types'
const initialState = {
    addressLine_1: "",
    lat: "",
    lon: "",
    recepientName: "",
    recepientMobileNumber: "",
    landMark: "",
    saveAs: "",
    pincode: "",
    isActive: ""
}

const location = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ADD_LOCATION:
            return {
                // ...state,
                id: payload?.id ? payload?.id : "",
                addressLine_1: payload?.addressLine_1 ? payload?.addressLine_1 : "",
                lat: payload?.lat ? payload?.lat : "",
                lon: payload?.lon ? payload?.lon : "",
                recepientName: payload?.recepientName ? payload?.recepientName : "",
                recepientMobileNumber: payload?.recepientMobileNumber ? payload?.recepientMobileNumber : "",
                landMark: payload?.landMark ? payload?.landMark : "",
                saveAs: payload?.saveAs ? payload?.saveAs : "",
                pincode: payload?.pincode ? payload?.pincode : "",
                isActive: payload?.isActive ? payload?.isActive : "",
            }
        // case DELETE_LOCATION:
        //     return {
        //         ...state,
        //     }
        default:
            return state
    }
}
export default location;
