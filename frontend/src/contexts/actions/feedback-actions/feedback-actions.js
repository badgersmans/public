import { SET_SNACKBAR } from "../constants/action-types"

// action creators
export const setSnackbar = ({ status, message, open }) => ({
  type: SET_SNACKBAR,
  payload: { status, message, open },
})
