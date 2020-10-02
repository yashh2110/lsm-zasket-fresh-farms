import { Action } from "redux";

export interface LanguageStore {
    locale: string
    messages: any
}

export enum UpdateLanguageActionType {
    UPDATE_LANGUAGE = "UPDATE_LANGUAGE"
}

export enum AsyncStorageLanguageActionType {
    SELECTEDLANGUAGE = "SELECTEDLANGUAGE"
}

export interface UpdateLanguageAction extends Action {
    type: UpdateLanguageActionType.UPDATE_LANGUAGE
    language: string
}

export interface AsyncStorageLanguageAction extends Action {
    type: AsyncStorageLanguageActionType.SELECTEDLANGUAGE
    language: string
}


export type LanguageActions = UpdateLanguageAction | AsyncStorageLanguageAction;
