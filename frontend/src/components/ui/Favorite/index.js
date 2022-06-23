import React, { useState, useContext } from "react"
import axios from "axios"
import { setUser } from "../../../contexts/actions/user-actions"
import clsx from "clsx"
import { UserContext, FeedbackContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
import CircularProgress from "@material-ui/core/CircularProgress"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import FavoriteIcon from "../../../images/Favorite"

const useStyles = makeStyles(theme => ({
  icon: {
    height: ({ size }) => `${size || 2.8}rem`,
    width: ({ size }) => `${size || 2.8}rem`,
  },
  iconButton: {
    padding: ({ noPadding }) => (noPadding ? 0 : undefined),
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

function Favorite({ color, size, variant, customizeStyles, noPadding }) {
  const classes = useStyles({ size, noPadding })
  const { user, dispatchUser } = useContext(UserContext)
  const { dispatchFeedback } = useContext(FeedbackContext)
  const [loading, setLoading] = useState(false)

  console.log(`user ->`, user)

  const existingFaved = user.favorites?.find(fav => fav.variant === variant)
  console.log(`existingFaved ->`, existingFaved)

  const handleFavorite = () => {
    if (user.username === "Guest") {
      dispatchFeedback(
        setSnackbar({
          status: "error",
          message: "You must be logged in to favorite",
        })
      )
      return
    }

    setLoading(true)

    const axiosFunctions = existingFaved ? axios.delete : axios.post
    const routes = existingFaved
      ? `/favorites/${existingFaved.id}`
      : `/favorites`
    const auth = {
      Authorization: `Bearer ${user.jwt}`,
    }

    axiosFunctions(
      `${process.env.GATSBY_STRAPI_URL}${routes}`,
      {
        product_variant: variant,
        headers: existingFaved ? auth : undefined,
      },
      {
        headers: auth,
      }
    )
      .then(response => {
        console.log(`response ->`, response)
        setLoading(false)
        dispatchFeedback(
          setSnackbar({
            status: "success",
            message: `${
              existingFaved ? "Deleted from" : "Added to"
            } your favorites`,
          })
        )
        let newFavorites = [...user.favorites]

        // delete the faved
        if (existingFaved) {
          newFavorites = newFavorites.filter(fav => fav.id !== existingFaved.id)
        } else {
          // add to fav
          newFavorites.push({
            id: response.data.id,
            variant: response.data.product_variant.id,
          })
        }
        dispatchUser(setUser({ ...user, favorites: newFavorites }))
      })
      .catch(error => {
        setLoading(false)
        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message: `There was a problem ${
              existingFaved ? "deleting from" : "adding to"
            } your favorites`,
          })
        )
      })
  }

  if (loading) return <CircularProgress size={`${size || 2.8}rem`} />

  return (
    <IconButton
      onClick={handleFavorite}
      classes={{ root: clsx(classes.iconButton, customizeStyles) }}
    >
      <span className={classes.icon}>
        <FavoriteIcon color={color} faved={existingFaved} />
      </span>
    </IconButton>
  )
}

export default Favorite
