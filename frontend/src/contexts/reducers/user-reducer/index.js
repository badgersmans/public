import { SET_USER } from "../../actions/constants/action-types"

export const userReducer = (state, action) => {
  const { user } = action.payload

  let newState = { ...state }

  switch (action.type) {
    case SET_USER:
      if (user.username === "Guest") {
        localStorage.removeItem("user")
      } else {
        localStorage.setItem("user", JSON.stringify(user))
      }

      newState = user

      // whatever that is returned from reducers are the new state in the application
      return newState

    default:
      return state
  }
}

export default userReducer
