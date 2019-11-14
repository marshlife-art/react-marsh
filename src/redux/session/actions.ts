import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import { User, LoginError } from '../../types/User'

import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'

PouchDB.plugin(PouchAuth)

const API_HOST = 'http://localhost:3000'

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

      fetch(`${API_HOST}/check_session`)
        .then(response => response.json())
        .then(response => {
          console.log('check_session', response)
          if (response.msg === 'ok' && response.token) {
            dispatch(
              set({ name: 'name', email: 'e@m.ail', token: response.token })
            )
          } else {
            dispatch(set({ name: undefined, email: undefined }))
          }
        })
        .catch(err => {
          console.warn('check_session caught err:', err)
          dispatch(set({ name: undefined }))
        })
        .finally(() => {
          dispatch(isFetching(false))
          resolve()
        })
    })
  }
}

export const register = (
  name: string,
  email: string,
  password: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(isFetching(true))

      const body = { name: name, email: email, password: password }
      fetch(`${API_HOST}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(response => {
          console.log('[session/actions] user register', response)
          if (response.ok && response.user) {
            dispatch(set(response.user))
          } else {
            dispatch(setError({ error: 'error', reason: response.message }))
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
  email: string,
  password: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>(resolve => {
      dispatch(isFetching(true))

      const body = { email: email, password: password }
      fetch(`${API_HOST}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(response => {
          console.log('[session/actions] user login', response)
          if (response.msg === 'ok' && response.user) {
            dispatch(set(response.user))
          } else {
            dispatch(setError({ error: 'error', reason: response.message }))
          }
        })
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

      dispatch(isFetching(false))
      resolve()
    })
  }
}
