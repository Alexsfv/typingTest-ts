import { LEADERS_GET_USERS, LEADERS_SORT_USERS } from '../actions/actionTypes'
import { UsersArrayType } from '../../types/types'
import { AllActionsLeadersTypes } from '../actions/leaders'

type UsersType = {
    mobileUsers: UsersArrayType,
    desktopUsers: UsersArrayType,
    sorted: boolean
}
const initialState = {
    users: {
        mobileUsers: [],
        desktopUsers: [],
        sorted: false
    } as UsersType,
    loader: true as boolean,
}

export type InitialStateLeadersType = typeof initialState

export default function(state = initialState, action: AllActionsLeadersTypes): InitialStateLeadersType {
    switch(action.type) {
        case LEADERS_GET_USERS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    ...action.users
                },
                loader: action.loader,
            }
        }
        case LEADERS_SORT_USERS: {
            return {
                ...state,
                users: {
                    ...state.users,
                    mobileUsers: action.users.mobileUsers,
                    desktopUsers: action.users.desktopUsers,
                    sorted: action.users.sorted
                }
            }
        }
        default: {
            return state
        }
    }
}