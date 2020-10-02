import { UpdateLanguageAction, UpdateLanguageActionType, LanguageStore, LanguageActions, AsyncStorageLanguageActionType } from "./types";
import { AsyncStorage } from "react-native";


//reducers.js
const setLanguage = (language: string) => {
    let messages = {};
    switch (language) {
        case 'ar':
            messages = Object.assign(messages, require(`../languages/ar.json`));
            break;
        default:
        case 'en':
            messages = Object.assign(messages, require(`../languages/en.json`));
            break;
    }
    return messages;
};


const initialState: LanguageStore = {
    locale: 'en',
    messages: setLanguage('en')
};

const Translate = (state = initialState, action: LanguageActions) => {
    if (action === undefined) return state;
    switch (action.type) {
        case UpdateLanguageActionType.UPDATE_LANGUAGE:
            return {
                locale: action.language,
                messages: setLanguage(action.language)
            };
        default:
            return state;
    }
};

export default Translate;


