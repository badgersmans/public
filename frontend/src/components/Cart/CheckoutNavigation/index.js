import React, { useState, useContext } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import CircularProgress from "@material-ui/core/CircularProgress"
import { FeedbackContext, UserContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
import { setUser } from "../../../contexts/actions/user-actions"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import save from "../../../images/save.svg"
import Delete from "../../../images/Delete"

const useStyles = makeStyles(theme => ({
  navbar: {
    backgroundColor: theme.palette.secondary.main,
    width: "41rem",
    height: "5rem",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  back: {
    visibility: ({ steps, selectedStep }) =>
      selectedStep === 0 || selectedStep === steps.length - 1
        ? "hidden"
        : "visible",
  },
  forward: {
    visibility: ({ steps, selectedStep }) =>
      selectedStep >= steps.length - 2 ? "hidden" : "visible",
  },
  disabled: {
    opacity: 0.5,
  },
  saveIcon: {
    height: "2.25rem",
    width: "2.25rem",
    [theme.breakpoints.down("xs")]: {
      height: "1.75rem",
      width: "1.75rem",
    },
  },
  deleteIcon: {
    height: "2rem",
    width: "2rem",
    [theme.breakpoints.down("xs")]: {
      height: "1.75rem",
      width: "1.75rem",
    },
  },
  actions: {
    position: "absolute",
    right: 20,
    [theme.breakpoints.down("xs")]: {
      right: 0,
    },
  },
  iconButton: {
    [theme.breakpoints.down("xs")]: {
      padding: 6,
    },
  },
  text: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
  navButtons: {
    [theme.breakpoints.down("xs")]: {
      minWidth: 0,
      width: "0.8rem",
      height: "1.5rem",
    },
  },
  // navbar: {},
  // navbar: {},
  // navbar: {},
  // navbar: {},
}))

function CheckoutNavigation({
  steps,
  selectedStep,
  setSelectedStep,
  details,
  detailSlot,
  location,
  locationSlot,
  setDetails,
  setLocation,
  setErrors,
}) {
  const classes = useStyles({ steps, selectedStep })

  const [loading, setLoading] = useState(null)
  const { dispatchFeedback } = useContext(FeedbackContext)
  const { user, dispatchUser } = useContext(UserContext)

  const handleAction = action => {
    if (steps[selectedStep].error && action !== "delete") {
      dispatchFeedback(
        setSnackbar({
          status: "error",
          message: "Please correct any errors before saving. ",
        })
      )
      return
    }

    setLoading(action)

    const isDetails = steps[selectedStep].title === "Contact Info"
    const isLocation = steps[selectedStep].title === "Address"

    axios
      .post(
        `${process.env.GATSBY_STRAPI_URL}/users-permissions/set-settings`,
        {
          details: isDetails && action !== "delete" ? details : undefined,
          detailSlot: isDetails ? detailSlot : undefined,
          location: isLocation && action !== "delete" ? location : undefined,
          locationSlot: isLocation ? locationSlot : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        }
      )
      .then(response => {
        setLoading(null)

        dispatchFeedback(
          setSnackbar({
            status: "success",
            message: `${
              action === "delete"
                ? "Deleted Successfully"
                : "Saved Successfully"
            }`,
          })
        )
        dispatchUser(
          setUser({ ...response.data, jwt: user.jwt, onboarding: true })
        )

        if (action === "delete") {
          setErrors({})
          if (isDetails) {
            setDetails({ name: "", email: "", phone: "" })
          } else if (isLocation) {
            setLocation({ street: "", postcode: "", city: "", state: "" })
          }
        }
      })
      .catch(error => {
        setLoading(null)

        dispatchFeedback(
          setSnackbar({
            status: "error",
            message: `There was a problem ${
              action === "delete" ? "deleting" : "saving"
            }`,
          })
        )
      })
  }

  return (
    <Grid
      item
      container
      classes={{ root: classes.navbar }}
      justify="center"
      alignItems="center"
    >
      <Grid item classes={{ root: classes.back }}>
        <Button
          classes={{ root: classes.navButtons }}
          onClick={() => setSelectedStep(selectedStep - 1)}
        >
          <Typography variant="h5" classes={{ root: classes.text }}>
            &#60;
          </Typography>
        </Button>
      </Grid>

      <Grid item>
        <Typography variant="h5" classes={{ root: classes.text }}>
          {steps[selectedStep].title.toUpperCase()}
        </Typography>
      </Grid>

      <Grid item classes={{ root: classes.forward }}>
        <Button
          classes={{ disabled: classes.disabled, root: classes.navButtons }}
          onClick={() => setSelectedStep(selectedStep + 1)}
          disabled={steps[selectedStep].error}
        >
          <Typography variant="h5">&#62;</Typography>
        </Button>
      </Grid>

      {steps[selectedStep].hasActions && user.username !== "Guest" ? (
        <Grid item classes={{ root: classes.actions }}>
          <Grid container>
            <Grid item>
              {loading === "save" ? (
                <CircularProgress />
              ) : (
                <IconButton
                  onClick={() => handleAction("save")}
                  classes={{ root: classes.iconButton }}
                >
                  <img src={save} alt="save" className={classes.saveIcon} />
                </IconButton>
              )}
            </Grid>

            <Grid item>
              {loading === "delete" ? (
                <CircularProgress />
              ) : (
                <IconButton
                  onClick={() => handleAction("delete")}
                  classes={{ root: classes.iconButton }}
                >
                  <span className={classes.deleteIcon}>
                    <Delete color="#FFF" />
                  </span>
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  )
}

export default CheckoutNavigation
