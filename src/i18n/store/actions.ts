import { ThunkAction } from "redux-thunk";
import { AppState, } from "react-native";
import { Action } from "redux";
import { UpdateLanguageActionType, AsyncStorageLanguageActionType } from "./types";
import AsyncStorage from "@react-native-community/async-storage";


export const updateLanguage = (language: string): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
    try {
        await dispatch({
            type: UpdateLanguageActionType.UPDATE_LANGUAGE,
            language
        });
    } catch {

    }
}

export const AsyncStorageSelectedLanguagee = (): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
    try {
        AsyncStorage.getItem('selectedLanguage').then(
            (values) => {
                if (values !== null) {
                    dispatch(updateLanguage(values))
                }
                return values
            }
        );
    } catch {

    }
}