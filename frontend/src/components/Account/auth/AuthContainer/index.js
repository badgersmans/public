import React, { useState, useContext, useEffect } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import Login from "../Login"
import Register from "../Register"
import RegisterSuccessful from "../RegisterSuccessful"
import { UserContext, FeedbackContext } from "../../../../contexts"
import { setSnackbar } from "../../../../contexts/actions/feedback-actions"
import { setUser } from "../../../../contexts/actions/user-actions"

import ResetPassword from "../ResetPassword"

const useStyles = makeStyles(theme => ({
  paper: {
    // backgroundColor: "red",
    // border: `2rem solid ${theme.palette.secondary.main}`,
    width: "50rem",
    height: "40rem",
    borderRadius: 0,
    [theme.breakpoints.down("md")]: {
      width: "30rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
    },
  },
  inner: {
    border: `1rem solid ${theme.palette.primary.main}`,
    width: "100%",
    height: "40rem",
    borderRadius: 0,
  },
  container: {
    marginBottom: "8rem",
    [theme.breakpoints.down("md")]: {
      marginTop: "5rem",
    },
  },
  "@global": {
    ".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
    ".MuiInput-underline:after": {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  },
  // paper: {},
  // paper: {},
}))

function AuthContainer() {
  const classes = useStyles()
  const [selectedStep, setSelectedStep] = useState(0)
  const { user, dispatchUser } = useContext(UserContext)
  const { feedback, dispatchFeedback } = useContext(FeedbackContext)
  // console.log(user)

  const steps = [
    { component: Login, label: "Login" },
    { component: Register, label: "Register" },
    { component: RegisterSuccessful, label: "Registration Successful" },
    { component: ResetPassword, label: "Reset Password" },
  ]

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const resetCode = params.get("code")
    const access_token = params.get("access_token")

    if (resetCode) {
      const resetPasswordIndex = steps.find(
        step => step.label === "Reset Password"
      )
      setSelectedStep(steps.indexOf(resetPasswordIndex))
    } else if (access_token) {
      axios
        .get(`${process.env.GATSBY_STRAPI_URL}/auth/facebook/callback`, {
          params: { access_token },
        })
        .then(response => {
          dispatchUser(
            setUser({
              ...response.data.user,
              jwt: response.data.jwt,
              onboarding: true,
            })
          )
          window.history.replaceState(null, null, window.location.pathname)
        })
        .catch(error => {
          console.error(error)
          dispatchFeedback(
            setSnackbar({
              status: "error",
              message: "Connecting to Facebook failed, please try again",
            })
          )
        })
    }
  }, [])

  return (
    <Grid container justify="center" classes={{ root: classes.container }}>
      <Grid item>
        <Paper elevation={6} classes={{ root: classes.paper }}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="space-between"
            classes={{ root: classes.inner }}
          >
            {steps.map((Step, i) =>
              selectedStep === i ? (
                <Step.component
                  setSelectedStep={setSelectedStep}
                  steps={steps}
                  user={user}
                  dispatchUser={dispatchUser}
                  feedback={feedback}
                  dispatchFeedback={dispatchFeedback}
                  key={Step.label}
                />
              ) : null
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default AuthContainer
