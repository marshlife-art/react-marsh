import { createStore, combineReducers, applyMiddleware } from 'redux'
import session, { UserServiceProps } from './session/reducers'
import thunk from 'redux-thunk'

export interface RootState {
  session: UserServiceProps
}

export default createStore(
  combineReducers<RootState>({
    session
  }),
  applyMiddleware(thunk)
)
