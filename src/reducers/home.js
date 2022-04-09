import {
  GET_CATEGORIES,
  SET_BANNER_IMAGES,
  SET_SHOW_PRICECHOP_ICON,
} from "../actions/types";
import AsyncStorage from "@react-native-community/async-storage";
const initialState = {
  categories: [],
  bannerImages: [],
  showPriceChopIcon: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: payload,
      };
    case SET_BANNER_IMAGES:
      return {
        ...state,
        bannerImages: payload.sort(function (a, b) {
          return a.priority - b.priority;
        }),
      };
    case SET_SHOW_PRICECHOP_ICON:
      return {
        ...state,
        showPriceChopIcon: payload,
      };
    default:
      return {
        ...state,
      };
  }
}
