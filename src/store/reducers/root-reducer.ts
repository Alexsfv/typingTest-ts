import { combineReducers } from 'redux'
import leadersReducer from './leaders'
import mainReducer from './main'

const rootReducer = combineReducers({
    leaders: leadersReducer,
    main: mainReducer
})

export type RootStateType = ReturnType<typeof rootReducer>
export default rootReducer