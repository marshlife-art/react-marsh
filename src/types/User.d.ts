export interface User {
  _id?: string
  name: string | null
  roles?: string[]
}

export interface UserLogin {
  username: string
  password: string
}

export interface LoginError {
  error: string
  reason: string
}
