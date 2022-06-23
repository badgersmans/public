import React, { useState, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import axios from "axios"
import IconButton from "@material-ui/core/IconButton"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"
import Confirmation from "../Confirmation"

import BackwardsOutline from "../../../images/BackwardsOutline"
import { FeedbackContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
import { setUser } from "../../../contexts/actions/user-actions"
import editIcon from "../../../images/edit.svg"
import saveIcon from "../../../images/save.svg"

const useStyles = makeStyles(theme => ({
  icon: {
    height: "5rem",
    width: "5rem",
  },
  editContainer: {
    // borderRight: `4px solid ${theme.palette.common.WHITE}`,
    [theme.breakpoints.down("md")]: {
      borderBottom: `4px solid ${theme.palette.common.WHITE}`,
      height: "30rem",
    },
  },
  // icon: {},
  // icon: {},
  // icon: {},
}))

function Edit({
  setSelectedSetting,
  edit,
  user,
  dispatchUser,
  setEdit,
  hasChanged,
  details,
  detailSlot,
  locationSlot,
  location,
  hasError,
}) {
  const classes = useStyles()
  const handleEdit = () => {
    if (edit && hasError) {
      dispatchFeedback(
        setSnackbar({
          status: "error",
          message: "Please correct any errors before saving.",
        })
      )
      return
    }

    setEdit(!edit)
    //  ...newDetails means put all other details into newDetails
    const { password, ...newDetails } = details

    if (password !== "********") {
      setDialogOpen(true)
    }

    // means the save icon was just clicked and there were changes
    if (edit && hasChanged) {
      setLoading(true)

      //  remember { details, detailSlot, location, locationSlot } = ctx.request.body;
      axios
        .post(
          `${process.env.GATSBY_STRAPI_URL}/users-permissions/set-settings`,
          {
            details: newDetails,
            detailSlot,
            location,
            locationSlot,
          },
          {
            headers: {
              Authorization: `Bearer ${user.jwt}`,
            },
          }
        )
        .then(response => {
          setLoading(false)
          dispatchFeedback(
            setSnackbar({ status: "success", message: "Settings Saved" })
          )
          dispatchUser(
            setUser({ ...response.data, jwt: user.jwt, onboarding: true })
          )
        })
        .catch(error => {
          setLoading(false)
          console.error(error)
          dispatchFeedback(
            setSnackbar({
              status: "error",
              message: "Problem savings settings, please try again.",
            })
          )
        })
    }
    // console.log("INSIDE handleEdit function", edit)
  }
  // console.log("OUTSIDE handleEdit function", edit)

  const { dispatchFeedback } = useContext(FeedbackContext)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Grid
      item
      container
      lg={6}
      xs={12}
      justify="space-evenly"
      alignItems="center"
      classes={{ root: classes.editContainer }}
    >
      <Grid item>
        <IconButton onClick={() => setSelectedSetting(null)}>
          <span className={classes.icon}>
            <BackwardsOutline color="#FFF" />
          </span>
          {/* <img src={backwards} alt="back to settings dashboard" /> */}
        </IconButton>
      </Grid>

      <Grid item>
        {loading ? (
          <CircularProgress color="secondary" size="5rem" />
        ) : (
          <IconButton onClick={handleEdit} disabled={loading}>
            <img
              src={edit ? saveIcon : editIcon}
              alt={`${edit ? "save" : "edit"} settings`}
              className={classes.icon}
            />
          </IconButton>
        )}
      </Grid>
      <Confirmation
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        user={user}
        dispatchFeedback={dispatchFeedback}
        setSnackbar={setSnackbar}
      />
    </Grid>
  )
}

export default Edit
