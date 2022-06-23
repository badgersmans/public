import React, { useEffect, useReducer, createContext } from "react"
import Snackbar from "@material-ui/core/Snackbar"
import { setSnackbar } from "../../actions/feedback-actions"
import feedbackReducer from "../../reducers/feedback-reducer"
import axios from "axios"

export const FeedbackContext = createContext()
const FeedbackProvider = FeedbackContext.Provider

export const FeedbackWrapper = ({ children }) => {
  const [feedback, dispatchFeedback] = useReducer(feedbackReducer, {
    open: false,
    backgroundColor: "",
    message: "",
  })

  return (
    <FeedbackProvider value={{ feedback, dispatchFeedback }}>
      {children}
      <Snackbar
        open={feedback.open}
        message={feedback.message}
        ContentProps={{
          style: {
            backgroundColor: feedback.backgroundColor,
            fontSize: "1.25rem",
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        autoHideDuration={5000}
        onClose={() => dispatchFeedback(setSnackbar({ open: false }))}
      />
    </FeedbackProvider>
  )
}
