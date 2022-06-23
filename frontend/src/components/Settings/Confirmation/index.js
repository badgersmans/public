import React, { useState } from "react"
import axios from "axios"
import Typography from "@material-ui/core/Typography"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import CircularProgress from "@material-ui/core/CircularProgress"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"

import Form from "../../Account/auth/Form"
import { EmailPassword } from "../../Account/auth/Login"

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.error.main,
  },
  button: {
    fontFamily: "Monserrat",
  },
  // title: {},
  // title: {},
  // title: {},
  // title: {},
}))

function Confirmation({
  dialogOpen,
  setDialogOpen,
  user,
  dispatchFeedback,
  setSnackbar,
}) {
  const classes = useStyles()
  const [values, setValues] = useState({
    password: "",
    confirmation: "",
  })
  const [errors, setErrors] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))
  const { password } = EmailPassword(false, false, visible, setVisible)
  const fields = {
    password: { ...password, placeholder: "Current Password" },
    confirmation: { ...password, placeholder: "New Password" },
  }

  const disabled =
    Object.keys(errors).some(error => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length

  const handlePasswordChange = () => {
    setLoading(true)

    axios
      .post(`${process.env.GATSBY_STRAPI_URL}/auth/local`, {
        identifier: user.email,
        password: values.password,
      })
      .then(response => {
        axios
          .post(
            `${process.env.GATSBY_STRAPI_URL}/users-permissions/change-password`,
            {
              password: values.confirmation,
            },
            { headers: { Authorization: `Bearer ${user.jwt}` } }
          )
          .then(response => {
            setLoading(false)
            setDialogOpen(false)
            dispatchFeedback(
              setSnackbar({
                status: "success",
                message: "Password Changed Successfully",
              })
            )
            setValues({ password: "", confirmation: "" })
          })
          .catch(error => {
            setLoading(false)
            console.error(error)
            dispatchFeedback(
              setSnackbar({
                status: "error",
                message:
                  "There was a problem changing your password, please try again.",
              })
            )
          })
      })
      .catch(error => {
        setLoading(false)
        console.error(error)
        dispatchFeedback(
          setSnackbar({ status: "error", message: "Current password is wrong" })
        )
      })
  }

  const handleCancel = () => {
    setDialogOpen(false)

    dispatchFeedback(
      setSnackbar({ status: "error", message: "Password was not changed." })
    )
  }

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle disableTypography>
        <Typography
          variant="h3"
          classes={{ root: classes.title }}
          align={matchesXS ? "center" : undefined}
        >
          Change Password
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText align={matchesXS ? "center" : undefined}>
          You are changing your password
        </DialogContentText>

        <Form
          fields={fields}
          errors={errors}
          setErrors={setErrors}
          values={values}
          setValues={setValues}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          classes={{ root: classes.button }}
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          color="secondary"
          classes={{ root: classes.button }}
          onClick={handlePasswordChange}
          disabled={loading || disabled}
        >
          {loading ? <CircularProgress /> : "Change Password"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Confirmation
