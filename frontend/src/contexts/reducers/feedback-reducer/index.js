import { SET_SNACKBAR } from "../../actions/constants/action-types"

export const feedbackReducer = (state, action) => {
  const { status, message, open } = action.payload

  switch (action.type) {
    case SET_SNACKBAR:
      // closing the snackbar
      if (open === false) return { ...state, open }

      return {
        open: true,
        backgroundColor: status === "error" ? "#FF3232" : "#4BB543",
        message,
      }

    default:
      return state
  }
}

export default feedbackReducer
