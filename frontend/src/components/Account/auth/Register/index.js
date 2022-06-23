import React, { useState } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Tooltip from "@material-ui/core/Tooltip"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"

import Form from "../Form"
import { EmailPassword } from "../Login"
import { setUser } from "../../../../contexts/actions/user-actions"
import { setSnackbar } from "../../../../contexts/actions/feedback-actions"

import addUserIcon from "../../../../images/add-user.svg"
import nameAdornment from "../../../../images/name-adornment.svg"
import forward from "../../../../images/forward-outline.svg"
import backward from "../../../../images/backwards-outline.svg"

const useStyles = makeStyles(theme => ({
  addUserIcon: {
    height: "10rem",
    width: "11rem",
    marginTop: "5rem",
  },
  registerWithFacebook: {
    width: "20rem",
    borderRadius: 50,
    // marginTop: "-3rem",
    [theme.breakpoints.down("xs")]: {
      width: "15rem",
    },
  },
  registerWithFacebookText: {
    fontSize: "1.5rem",
    fontWeight: 700,
    textTransform: "none",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
  navButtons: {
    height: "4rem",
    width: "4rem",
  },
  emailAdornment: {
    width: 22,
    height: 17,
    marginBottom: 10,
  },
  visibleIcon: {
    padding: 0,
  },
  // addUserIcon: {},
}))

function Register({
  steps,
  setSelectedStep,
  user,
  dispatchUser,
  dispatchFeedback,
}) {
  const classes = useStyles()
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [emailPass, setEmailPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigateToLogin = direction => {
    if (direction === "forward") {
      setEmailPass(true)
    } else {
      if (emailPass) {
        setEmailPass(false)
      } else {
        const loginIndex = steps.find(step => step.label === "Login")

        setSelectedStep(steps.indexOf(loginIndex))
      }
    }
  }

  const handleSuccessfulRegistration = () => {
    setLoading(true)
    // axios
    //   .get(
    //     `https://block-temporary-email.com/check/email/prfum6+amngg0jys85u0@sharklasers.com`,
    //     {
    //       headers: {
    //         "x-api-key": process.env.GATSBY_DISPOSABLE_EMAIL_KEY,
    //       },
    //     }
    //   )
    //   .then(response => {
    //     setLoading(false)
    //     console.log(response)

    //     return
    //   })
    //   .catch(error => {
    //     setLoading(false)
    //     console.error(error)
    //     return
    //   })

    axios
      .post(`${process.env.GATSBY_STRAPI_URL}/auth/local/register`, {
        username: values.name,
        email: values.email,
        password: values.password,
      })
      .then(response => {
        // console.log("response ->", response)
        // console.log("user profile", response.data.user)
        // console.log("JWT ->", response.data.jwt)

        setLoading(false)
        dispatchUser(setUser({ ...response.data.user, jwt: response.data.jwt }))

        const registerSuccessfulIndex = steps.find(
          step => step.label === "Registration Successful"
        )
        setSelectedStep(steps.indexOf(registerSuccessfulIndex))
      })
      .catch(error => {
        const { message } = error.response.data.message[0].messages[0]
        dispatchFeedback(setSnackbar({ status: "error", message }))

        console.error(error)
        setLoading(false)
      })
  }

  const nameField = {
    name: {
      helperText: "Name is required",
      placeholder: "Name",
      startAdornment: <img src={nameAdornment} alt="Name" />,
    },
  }

  const fields = emailPass
    ? EmailPassword(false, false, visible, setVisible)
    : nameField

  // if there is at least 1 error in some fields or some fields are empty...
  const disabled =
    Object.keys(errors).some(error => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length

  return (
    <>
      <Grid item>
        <img src={addUserIcon} alt="Register" className={classes.addUserIcon} />
      </Grid>

      <Form
        fields={fields}
        errors={errors}
        setErrors={setErrors}
        values={values}
        setValues={setValues}
      />

      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          component={!emailPass ? "a" : undefined}
          href={
            !emailPass
              ? `${process.env.GATSBY_STRAPI_URL}/connect/facebook`
              : undefined
          }
          disabled={loading || (emailPass && disabled)}
          classes={{ root: classes.registerWithFacebook }}
          onClick={() => (emailPass ? handleSuccessfulRegistration() : null)}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography
              variant="h5"
              classes={{ root: classes.registerWithFacebookText }}
            >
              Register {emailPass ? "" : " with Facebook"}
            </Typography>
          )}
        </Button>
      </Grid>

      <Grid item container justify="space-between">
        <Grid item>
          <Tooltip title="Go Back" placement="right">
            <IconButton onClick={() => navigateToLogin("backward")}>
              <img
                src={backward}
                alt="Go Back"
                className={classes.navButtons}
              />
            </IconButton>
          </Tooltip>
        </Grid>

        {emailPass ? null : (
          <Grid item>
            <Tooltip title="Continue registration" placement="left">
              <IconButton
                onClick={() => navigateToLogin("forward")}
                // disabled={
                //   Object.keys(errors).length !== Object.keys(values).length
                // }
              >
                <img
                  src={forward}
                  alt="Continue registration"
                  className={classes.navButtons}
                />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default Register
