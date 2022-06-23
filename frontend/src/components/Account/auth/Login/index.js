import React, { useState, useEffect } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import CircularProgress from "@material-ui/core/CircularProgress"
import clsx from "clsx"
import Tooltip from "@material-ui/core/Tooltip"
import { makeStyles } from "@material-ui/core/styles"

import Form from "../Form"
import { setUser } from "../../../../contexts/actions/user-actions"
import { setSnackbar } from "../../../../contexts/actions/feedback-actions"

import accountIcon from "../../../../images/account.svg"
import EmailAdornment from "../../../../images/EmailAdornment"
import PasswordAdornment from "../../../../images/PasswordAdornment"
import HidePassword from "../../../../images/HidePassword"
import ShowPassword from "../../../../images/ShowPassword"
import addUserIcon from "../../../../images/add-user.svg"
import forgotPasswordIcon from "../../../../images/forgot.svg"
import backward from "../../../../images/backward.svg"

const useStyles = makeStyles(theme => ({
  accountIcon: {
    marginTop: "2rem",
  },
  accountIconImage: {
    width: "9rem",
    height: "9rem",
  },
  login: {
    width: "16rem",
    borderRadius: 50,
    textTransform: "none",
    [theme.breakpoints.down("xs")]: {
      width: "15rem",
    },
  },
  loginWithFacebook: {
    // marginBottom: "-1rem",
    marginTop: "1rem",
  },
  passwordError: {
    marginBottom: "-1rem",
  },
  facebookText: {
    fontSize: "1.5rem",
    fontWeight: 600,
    textTransform: "none",
  },
  backToLogin: {
    // paddingTop: 5,
  },
  reset: {
    marginTop: "-4rem",
  },
  buttonText: {
    fontSize: "1.8rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.5rem",
    },
  },
  // emailAdornment: {},
  // emailAdornment: {},
}))

export const EmailPassword = (
  hideEmail,
  hidePassword,
  visible,
  setVisible,
  isWhite
) => ({
  email: {
    helperText: "Invalid Email",
    placeholder: "Email",
    type: "text",
    hidden: hideEmail,
    startAdornment: (
      <span
        style={{
          width: 22,
          height: 17,
          marginBottom: 10,
        }}
      >
        <EmailAdornment color={isWhite ? "#FFF" : null} />
      </span>
    ),
  },
  password: {
    helperText:
      "Passwords must be 8 characters minimum (max is 100), with uppercase, lowercase, numbers, and symbols",
    placeholder: "Password",
    hidden: hidePassword,
    type: visible ? "text" : "password",
    startAdornment: <PasswordAdornment color={isWhite ? "#FFF" : null} />,
    endAdornment: (
      <IconButton
        onClick={() => setVisible(!visible)}
        style={{
          padding: 0,
        }}
      >
        {visible ? (
          <ShowPassword color={isWhite ? "#FFF" : null} />
        ) : (
          <HidePassword color={isWhite ? "#FFF" : null} />
        )}
      </IconButton>
    ),
  },
})

function Login({
  steps,
  setSelectedStep,
  user,
  dispatchUser,
  dispatchFeedback,
}) {
  const classes = useStyles()

  const [values, setValues] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [visible, setVisible] = useState(false)
  const [forgot, setForgot] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const fields = EmailPassword(false, forgot, visible, setVisible)

  const navigateToRegister = () => {
    const registerIndex = steps.find(step => step.label === "Register")

    //   const steps = [
    //     { component: 'Login', label: "Login" },
    //     { component: 'Register', label: "Register" },
    //   ]

    // const registerIndex = steps.find(step => step.label === "Register")

    // //console.log(registerIndex); << Object { component: "Register", label: "Register" }

    // console.log(steps.indexOf(registerIndex));
    setSelectedStep(steps.indexOf(registerIndex))
  }

  const handleLogin = () => {
    setLoading(true)
    axios
      .post(`${process.env.GATSBY_STRAPI_URL}/auth/local`, {
        identifier: values.email,
        password: values.password,
      })
      .then(response => {
        setLoading(false)
        dispatchUser(
          setUser({
            ...response.data.user,
            jwt: response.data.jwt,
            onboarding: true,
          })
        )
        // console.log("user profile", response.data)
        // console.log("JWT", response.data.jwt)
      })
      .catch(error => {
        const { message } = error.response.data.message[0].messages[0]
        console.log(error)
        setLoading(false)
        dispatchFeedback(setSnackbar({ status: "error", message }))
      })
  }

  const handleForgotPassword = () => {
    setLoading(true)

    axios
      .post(`${process.env.GATSBY_STRAPI_URL}/auth/forgot-password`, {
        email: values.email,
      })
      .then(response => {
        setLoading(false)
        setSuccess(true)

        dispatchFeedback(
          setSnackbar({
            status: "success",
            message: "Check your email for a password reset link",
          })
        )
      })
      .catch(error => {
        const { message } = error.response.data.message[0].messages[0]
        console.log(error)
        setLoading(false)
        dispatchFeedback(setSnackbar({ status: "error", message }))
      })
  }
  // console.log("LOGIN USER ->", user)

  const disabled =
    Object.keys(errors).some(error => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length

  useEffect(() => {
    if (!success) return

    const timer = setTimeout(() => {
      setForgot(false)
    }, 5000)

    // return in a useEffect is a cleanup function, runs on component unmount
    return () => clearTimeout(timer)
  }, [success])

  return (
    <>
      <Grid item classes={{ root: classes.accountIcon }}>
        <img
          src={accountIcon}
          alt="login page"
          className={classes.accountIconImage}
        />
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
          onClick={() => (forgot ? handleForgotPassword() : handleLogin())}
          disabled={loading || (!forgot && disabled)}
          classes={{
            root: clsx(classes.login, {
              [classes.passwordError]: errors.password,
              [classes.reset]: forgot,
            }),
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="h5" classes={{ root: classes.buttonText }}>
              {forgot ? "Forgot Password" : "Login"}
            </Typography>
          )}
        </Button>
      </Grid>

      {forgot ? null : (
        <Grid item>
          <Button
            classes={{
              root: clsx(classes.loginWithFacebook, {
                [classes.passwordError]: errors.password,
              }),
            }}
            component={"a"}
            href={`${process.env.GATSBY_STRAPI_URL}/connect/facebook`}
          >
            <Typography variant="h3" classes={{ root: classes.facebookText }}>
              Login With Facebook
            </Typography>
          </Button>
        </Grid>
      )}
      <Grid item container justify="space-between">
        <Grid
          item
          classes={{
            root: clsx({
              [classes.backToLogin]: forgot,
            }),
          }}
        >
          <Tooltip
            title={forgot ? "Go back to login" : "Forgot Password"}
            placement="right"
          >
            <IconButton onClick={() => setForgot(!forgot)}>
              <img
                src={forgot ? backward : forgotPasswordIcon}
                alt={forgot ? "go back to login" : "forgot password"}
              />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip title="Register" placement="left">
            <IconButton onClick={navigateToRegister}>
              <img src={addUserIcon} alt="register" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  )
}

export default Login
