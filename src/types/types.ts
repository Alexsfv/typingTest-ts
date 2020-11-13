import { DateType } from '../store/actions/leaders'
import { store } from '../index'

export type UserType = {
    date: DateType,
    name: string,
    points: number
}

export type UsersArrayType = Array<UserType>

export interface RowUsersType {
    [key: string]: UserType
}

export type AnsweredCharType = {
    index: number, 
    class: "error" | "success"
}

export type SortedUsersType = {
    desktopUsers: UsersArrayType,
    mobileUsers: UsersArrayType
}

export type AppDispatchType = typeof store.dispatch