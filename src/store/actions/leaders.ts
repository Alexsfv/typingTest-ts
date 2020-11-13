import { LEADERS_GET_USERS, LEADERS_SORT_USERS } from './actionTypes'
import { getMobileUsers, getDesktopUsers } from '../../database'
import { UsersArrayType, SortedUsersType } from '../../types/types'
import { RootStateType } from '../reducers/root-reducer'
import { Dispatch } from 'react'

export type DateType = {
    day: string, 
    month: string, 
    string: string, 
    year: string
}


export function getUsers() {                                
    return async (dispatch: Dispatch<AllActionsLeadersTypes>) => {                      
        try {
            const rowMobileUsers = await getMobileUsers()    
            const rowDesktopUsers = await getDesktopUsers()  

            const mobileUsers: UsersArrayType = Object.values(rowMobileUsers)
            const desktopUsers: UsersArrayType = Object.values(rowDesktopUsers)
            
            dispatch(getUsersCreator(mobileUsers, desktopUsers))
        } catch(e) {
            console.log(e)
        }
    }
}

type SortUsersType = {
    type: typeof LEADERS_SORT_USERS,
    users: {
        mobileUsers: UsersArrayType,
        desktopUsers: UsersArrayType,
        sorted: boolean
    }
}
export function sortUsers(sortedUsers: SortedUsersType) {
    return (dispatch: Dispatch<AllActionsLeadersTypes>, getState: () => RootStateType) => {             
        dispatch({
            type: LEADERS_SORT_USERS,
            users: {
                mobileUsers: sortedUsers.mobileUsers,
                desktopUsers: sortedUsers.desktopUsers,
                sorted: !getState().leaders.users.sorted
            }
        })
    }
}
type getUsersCreatorType = {
    type: typeof LEADERS_GET_USERS,
    users: {
        mobileUsers: UsersArrayType,
        desktopUsers: UsersArrayType
    },
    loader: false,
}
function getUsersCreator(mobileUsers: UsersArrayType, desktopUsers: UsersArrayType): getUsersCreatorType {   
    return {
        type: LEADERS_GET_USERS,
        users: {
            mobileUsers,
            desktopUsers
        },
        loader: false
    }
}

export type AllActionsLeadersTypes = getUsersCreatorType | SortUsersType