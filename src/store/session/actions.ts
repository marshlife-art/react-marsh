import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import { User, LoginError } from '../../types/User'

import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'

PouchDB.plugin(PouchAuth)

const SESSION_DB_URL = 'http://localhost:5984/_session'

export interface SetAction {
  type: 'SET'
  user: User
}
export interface SetFetcing {
  type: 'SET_FETCHING'
  isFetching: boolean
}
export interface SetError {
  type: 'SET_ERROR'
  error: LoginError
}

export type Action = SetAction | SetFetcing | SetError

export const set = (user: User): SetAction => {
  return { type: 'SET', user }
}
export const setError = (error: LoginError): SetError => {
  return { type: 'SET_ERROR', error }
}
export const isFetching = (isFetching: boolean): SetFetcing => {
  return { type: 'SET_FETCHING', isFetching }
}

export const checkSession = (): ThunkAction<
  Promise<void>,
  {},
  {},
  AnyAction
> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>((resolve, rject) => {
      dispatch(isFetching(true))

      fetch(SESSION_DB_URL, { credentials: 'include' })
        .then(response => response.json())
        .then(response => {
          console.log(response)
          if (response.ok && response.userCtx) {
            dispatch(set(response.userCtx))
          }
        })
        .finally(() => {
          dispatch(isFetching(false))
          resolve()
        })
    })
  }
}

export const login = (
  username: string,
  password: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(isFetching(true))

      const db = new PouchDB(SESSION_DB_URL, {
        skip_setup: true
      })

      db.logIn(username, password)
        .then(response =>
          response.ok
            ? dispatch(set({ name: response.name, roles: response.roles }))
            : dispatch(setError({ error: 'notok', reason: 'response not ok' }))
        )
        .catch((error: LoginError) => dispatch(setError(error)))
        .finally(() => {
          dispatch(isFetching(false))
          resolve()
        })
    })
  }
}

export const logout = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(isFetching(true))

      const db = new PouchDB(SESSION_DB_URL, {
        skip_setup: true
      })

      db.logOut()
        .then(() => dispatch(set({ name: null, roles: [] })))
        .catch((error: LoginError) => dispatch(setError(error)))
        .finally(() => {
          dispatch(isFetching(false))
          resolve()
        })
    })
  }
}
