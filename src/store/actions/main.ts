import device from 'current-device'
import { Dispatch } from 'react'
import { sendMobibleUser, sendDesktopUser } from '../../database'
import { UserType, AnsweredCharType } from '../../types/types'
import { RootStateType } from '../reducers/root-reducer'

import {
    MAIN_SUBTRACT_TIMER,
    MAIN_START_TIMER,
    MAIN_RESET_TIMER,
    MAIN_STOP_TEST,
    MAIN_SHOW_RECORD_MODAL,
    MAIN_CLOSE_RECORD_MODAL,
    MAIN_CHANGE_NAME,
    MAIN_SHOW_LOADER,
    MAIN_SUCCESS_SEND_USER,
    MAIN_SUCCESS_CLOSE_RECORD,
    MAIN_ERROR_SEND_USER,
    MAIN_CLEAR_ERROR_SEND_USER,
    MAIN_CLEAR_VALIDATE_NAME_FIELD,
    MAIN_INVALID_NAME,
    MAIN_REWRITE_AREA,
    MAIN_PLUS_COUNTER_SUCCESS_CHARS,
    MAIN_ADD_ANSWERED_CHAR
} from './actionTypes'


type SubtractTimerType = {
    type: typeof MAIN_SUBTRACT_TIMER,
    seconds: number
}
export function subtractTimer() {
    return (dispatch: Dispatch<AllActionsMainTypes>, getState: () => RootStateType) => {
        dispatch({
            type: MAIN_SUBTRACT_TIMER,
            seconds: getState().main.timer.seconds - 1
        })
    }
}

type ToStartTimerType = {
    type: typeof MAIN_START_TIMER,
    intervalId: number
}
export function toStartTimer(timerId: number): ToStartTimerType {
    return {
        type: MAIN_START_TIMER,
        intervalId: timerId
    }
}

type ResetTimerType = {
    type: typeof MAIN_RESET_TIMER,
    seconds: number
}
export function resetTimer() {
    return (dispatch: Dispatch<AllActionsMainTypes>, getState: () => RootStateType) => {
        dispatch({
            type: MAIN_RESET_TIMER,
            seconds: getState().main.timer.maxSeconds
        })
    }
}

type EndTestType = {
    type: typeof MAIN_STOP_TEST,
    result: number,
    text: string
}
export function endTest(result: number, text: string): EndTestType {
    return {
        type: MAIN_STOP_TEST,
        result, text
    }
}

type ShowRecordModalType = {
    type: typeof MAIN_SHOW_RECORD_MODAL
}
export function showRecordModal(): ShowRecordModalType {
    return {
        type: MAIN_SHOW_RECORD_MODAL,
    }
}

type CloseRecordModalType = {
    type: typeof MAIN_CLOSE_RECORD_MODAL
}
export function closeRecordModal(): CloseRecordModalType {
    return {
        type: MAIN_CLOSE_RECORD_MODAL
    }
}

type ChangeNameType = {
    type: typeof MAIN_CHANGE_NAME,
    name: string
}
export function changeName(name: string): ChangeNameType { 
    return {
        type: MAIN_CHANGE_NAME,
        name
    }
}

type ShowLoaderType = {
    type: typeof MAIN_SHOW_LOADER
}
export function showLoader(): ShowLoaderType {
    return {
        type: MAIN_SHOW_LOADER
    }
}

export function sendUser(user: UserType) { 

    return async (dispatch: Dispatch<AllActionsMainTypes>, getState: () => RootStateType) => {
        const delay = getState().main.recordModal.hideTimeout
        try {
            device.type === 'mobile'
                ? await sendMobibleUser(user)
                : await sendDesktopUser(user)
            
            dispatch(successSendUser())
   
            setTimeout(() => {
                dispatch(successCloseRecord())
            }, delay * 2);

        } catch(e) {
            console.log(e)
            dispatch(errorSendUser())

            setTimeout(() => {
                dispatch(clearErrorSendUser())
            }, delay);
        }
    }
}

type ClearValidateNameFieldType = {
    type: typeof MAIN_CLEAR_VALIDATE_NAME_FIELD
}
export function clearValidateNameField(): ClearValidateNameFieldType {
    return {
        type: MAIN_CLEAR_VALIDATE_NAME_FIELD,
    }
}

type InvalidNameType = {
    type: typeof MAIN_INVALID_NAME,
    message : string
}
export function invalidName(message: string): InvalidNameType {
    return {
        type: MAIN_INVALID_NAME,
        message
    }
}

type RewriteAreaType = {
    type: typeof MAIN_REWRITE_AREA,
    value: string
}
export function rewriteArea(value: string): RewriteAreaType {
    return {
        type: MAIN_REWRITE_AREA,
        value
    }
}

type PlusCounertSuccessCharsType = {
    type: typeof MAIN_PLUS_COUNTER_SUCCESS_CHARS,
    successChars: number
}
export function plusCounertSuccessChars() {
    return (dispatch: Dispatch<AllActionsMainTypes>, getState: () => RootStateType) => {
        dispatch({
            type: MAIN_PLUS_COUNTER_SUCCESS_CHARS,
            successChars: getState().main.area.successChars + 1
        })
    }
}

type AddAnsweredCharType = {
    type: typeof MAIN_ADD_ANSWERED_CHAR,
    newChars: Array<AnsweredCharType>
}
export function addAnsweredChar(newChars: Array<AnsweredCharType>): AddAnsweredCharType {
    return {
        type: MAIN_ADD_ANSWERED_CHAR,
        newChars
    }
}

type SuccessSendUserType = {
    type: typeof MAIN_SUCCESS_SEND_USER
}
function successSendUser(): SuccessSendUserType {
    return {
        type: MAIN_SUCCESS_SEND_USER
    }
}

type SuccessCloseRecordType = {
    type: typeof MAIN_SUCCESS_CLOSE_RECORD
}
function successCloseRecord(): SuccessCloseRecordType {
    return {
        type: MAIN_SUCCESS_CLOSE_RECORD
    }
}

type ErrorSendUserType = {
    type: typeof MAIN_ERROR_SEND_USER
}
function errorSendUser(): ErrorSendUserType {
    return {
        type: MAIN_ERROR_SEND_USER
    }
}

type ClearErrorSendUserType = {
    type: typeof MAIN_CLEAR_ERROR_SEND_USER
}
function clearErrorSendUser(): ClearErrorSendUserType {
    return {
        type: MAIN_CLEAR_ERROR_SEND_USER
    }
}

export type AllActionsMainTypes = ClearErrorSendUserType | ErrorSendUserType | SuccessCloseRecordType | 
    SuccessSendUserType | AddAnsweredCharType | PlusCounertSuccessCharsType |
    RewriteAreaType | InvalidNameType | ClearValidateNameFieldType | 
    ShowLoaderType | ChangeNameType | CloseRecordModalType |
    ShowRecordModalType | EndTestType | ResetTimerType |
    ToStartTimerType | SubtractTimerType