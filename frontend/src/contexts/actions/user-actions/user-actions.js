import { SET_USER } from "../constants/action-types"

// action creators
export const setUser = user => ({
  type: SET_USER,
  payload: { user },
})
