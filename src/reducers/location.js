import { ADD_LOCATION, DELETE_LOCATION } from '../actions/types'
const initialState = {
    addressLine_1: "",
    lat: "",
    lon: "",
    recepientName: "",
    recepientMobileNumber: "",
    landmark: "",
    saveAs: "",
    pincode: "",
    isActive: "",
    houseNo: ""
}

const location = (state = initialState, action) => {
    const { type, payload } = action
    // alert(JSON.stringify(payload, null, "                   "))
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
                landmark: payload?.landmark ? payload?.landmark : "",
                saveAs: payload?.saveAs ? payload?.saveAs : "",
                pincode: payload?.pincode ? payload?.pincode : "",
                isActive: payload?.isActive ? payload?.isActive : "",
                houseNo: payload?.houseNo ? payload?.houseNo : ""
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
