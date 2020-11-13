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
} from '../actions/actionTypes'
import { AnsweredCharType } from '../../types/types'
import { AllActionsMainTypes } from '../actions/main'

const sentence: string = 'Едва слышимые в окружающем шуме, звуки музыки доносились из дома, который стоял на окраине. На тело, погружаемое в воду, действует выталкивающая сила, как гласит закон Архимеда.'
const chars: Array<string> = sentence.trim().split('')
const words = getWords(chars)
export const maxSeconds = 25

export type TimerType = {
    maxSeconds: typeof maxSeconds,
    seconds: number,
    started: boolean,
    finished: boolean,
    intervalId: number ,
}
export type AreaType = {
    value: string,
    words: typeof words,
    chars: typeof chars,
    answeredChars: Array<AnsweredCharType>,
    sentence: typeof sentence,
    successChars: number,
}
export type RecordModalType = {
    result: number,
    isShow: boolean,
    hideTimeout: number,
    valid: boolean,
    showLoader: boolean,
    nameValue: string,
    statusSendName: string,
    text: string,
    alert: {
        isShowAlert: boolean,
        message: string
    }
}

type InitialStateMainType = {
    timer: TimerType,
    area: AreaType,
    recordModal: RecordModalType 
}
const initialState: InitialStateMainType = {
    timer: {
        maxSeconds,
        seconds: maxSeconds,
        started: false,
        finished: false,
        intervalId: 0,
    },
    area: {
        value: '',
        words,
        chars,
        answeredChars: [],
        sentence,
        successChars: 0,
    },
    recordModal: {
        result: 0,
        isShow: false,
        hideTimeout: 2000,
        valid: true,
        showLoader: false,
        nameValue: '',
        statusSendName: '',
        text: '',
        alert: {
            isShowAlert: false,
            message: ''
        }
    }
}

export default function(state = initialState, action: AllActionsMainTypes): InitialStateMainType {
    switch(action.type) {
        case MAIN_SUBTRACT_TIMER: {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    seconds: action.seconds
                }
            }
        }
        case MAIN_START_TIMER: {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    started: true, 
                    intervalId: action.intervalId
                }
            }
        }
        case MAIN_RESET_TIMER: {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    seconds: action.seconds,
                    started: false,
                    finished: false,
                    intervalId: 0,
                },
                area: {
                    ...state.area,
                    value: '',
                    answeredChars: [],
                    successChars: 0
                },
                recordModal: {
                    ...state.recordModal,
                    result: 0,
                    isShow: false,
                    valid: true,
                    showLoader: false,
                    statusSendName: '',
                    nameValue: '',
                    alert: {
                        ...state.recordModal.alert,
                        isShowAlert: false,
                        message: ''
                    }
                }
            }
        }
        case MAIN_STOP_TEST: {
            return {
                ...state,
                timer: {
                    ...state.timer,
                    seconds: 0,
                    finished: true
                },
                recordModal: {
                    ...state.recordModal,
                    result: action.result,
                    text: action.text
                }
            }
        }
        case MAIN_SHOW_RECORD_MODAL: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    isShow: true,
                    nameValue: ''
                }
            }
        }
        case MAIN_CLOSE_RECORD_MODAL: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    isShow: false,
                    statusSendName: '',
                    nameValue: ''
                }
            }
        }
        case MAIN_CHANGE_NAME: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    nameValue: action.name,
                }
            }
        }
        case MAIN_SHOW_LOADER: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    showLoader: true
                }
            }
        }
        case MAIN_SUCCESS_SEND_USER: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    showLoader: false,
                    statusSendName: 'success'
                }
            }
        }
        case MAIN_SUCCESS_CLOSE_RECORD: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    isShow: false,
                    statusSendName: ''
                }
            }
        }
        case MAIN_ERROR_SEND_USER: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    showLoader: false,
                    statusSendName: 'error'
                }
            }
        }
        case MAIN_CLEAR_ERROR_SEND_USER: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    statusSendName: ''
                }
            }
        }
        case MAIN_CLEAR_VALIDATE_NAME_FIELD: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    valid: true,
                    showLoader: false,
                    alert: {
                        isShowAlert: false,
                        message: ''
                    }
                }
            }
        }
        case MAIN_INVALID_NAME: {
            return {
                ...state,
                recordModal: {
                    ...state.recordModal,
                    valid: false,
                    showLoader: false,
                    alert: {
                        ...state.recordModal.alert,
                        isShowAlert: true,
                        message: action.message
                    }
                }
            }
        }
        case MAIN_REWRITE_AREA: {
            return {
                ...state,
                area: {
                    ...state.area,
                    value: action.value
                }
            }
        }
        case MAIN_PLUS_COUNTER_SUCCESS_CHARS: {
            return {
                ...state,
                area: {
                    ...state.area,
                    successChars: action.successChars
                }
            }
        }
        case MAIN_ADD_ANSWERED_CHAR: {
            return {
                ...state,
                area: {
                    ...state.area,
                    answeredChars: action.newChars
                }
            }
        }
        default: {
            return state
        }
    }
}

function getWords(chars: Array<string>) {
    let words: Array<string> = []
    let lastIndex: number = 0
    chars.forEach((char: string, i: number, arr: Array<string>) => {
        if (char === ' ') {
            const sliced: Array<string> = chars.slice(lastIndex, i + 1)
            words.push(sliced.join(''))
            lastIndex += sliced.length

        } else if (i === arr.length - 1) {
            const sliced: Array<string> = chars.slice(lastIndex)
            words.push(sliced.join(''))
        }

    })
    return words
}