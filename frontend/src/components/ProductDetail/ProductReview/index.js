import React, { useState, useRef, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import clsx from "clsx"
import Typography from "@material-ui/core/Typography"
import axios from "axios"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"
import Rating from "../../Home/Rating"
import Form from "../../Account/auth/Form"
import { FeedbackContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
import dayjs from "dayjs"
let advancedFormat = require("dayjs/plugin/advancedFormat")
let relativeTime = require("dayjs/plugin/relativeTime")
dayjs.extend(relativeTime, advancedFormat)
dayjs().format("Do")

const useStyles = makeStyles(theme => ({
  light: {
    color: theme.palette.primary.main,
  },
  smallDate: {
    fontSize: "1.2rem",
  },
  date: {
    marginTop: "-0.5rem",
  },
  "@global": {
    ".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
    ".MuiInput-underline:after": {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
  },
  reviewButtonText: {
    color: theme.palette.common.WHITE,
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  cancelButtonText: {
    color: theme.palette.primary.main,
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  buttonContainer: {
    marginTop: "1rem",
  },
  starBackground: {
    height: "3rem",
    backgroundColor: theme.palette.primary.light,
  },
  cursorOnHover: {
    cursor: "pointer",
  },
  mainContainer: {
    marginBottom: "3rem",
  },
  delete: {
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
    marginLeft: "1rem",
  },
  // something: {},
}))

function ProductReview({
  product,
  review,
  reviews,
  setReviews,
  setEditComment,
  user,
}) {
  const classes = useStyles()
  const existingReview = !review
    ? reviews.find(review => review.user.username === user.username)
    : null
  const { dispatchFeedback } = useContext(FeedbackContext)
  const ratingRef = useRef(null)
  const [tempRating, setTempRating] = useState(0)
  const [loading, setLoading] = useState(null)
  const [rating, setRating] = useState(
    review ? review.rating : existingReview ? existingReview.rating : null
  )
  const [values, setValues] = useState({
    message: existingReview ? existingReview.text : "",
  })
  const fields = {
    message: {
      helperText: "",
      placeholder: "Write your review",
    },
  }

  const handleReview = option => {
    setLoading(option === "delete" ? "Delete Review" : "Leave Review")

    const axiosFunctions =
      option === "delete"
        ? axios.delete
        : existingReview
        ? axios.put
        : axios.post
    const route =
      existingReview || option === "delete"
        ? `/reviews/${existingReview.id}`
        : `/reviews`
    const axiosResponseText =
      option === "delete"
        ? "Review Deleted"
        : existingReview
        ? "Review updated"
        : "Review submitted"

    const auth = {
      Authorization: `Bearer ${user.jwt}`,
    }

    axiosFunctions(
      `${process.env.GATSBY_STRAPI_URL}${route}`,
      {
        text: values.message,
        rating,
        product,
        headers: option === "delete" ? auth : undefined,
      },
      {
        headers: auth,
      }
    )
      .then(response => {
        setLoading(null)

        dispatchFeedback(
          setSnackbar({ status: "success", message: axiosResponseText })
        )

        // setReviews(response.data)
        // setEditComment(false)

        let newReviews = [...reviews]
        const reviewIndex = newReviews.indexOf(existingReview)

        if (option === "delete") {
          newReviews = newReviews.filter(review => review !== existingReview)
        } else if (existingReview) {
          newReviews[reviewIndex] = response.data
        } else {
          // otherwise it is a new review
          newReviews = [response.data, ...newReviews]
        }
        setReviews(newReviews)
        setEditComment(false)
      })
      .catch(error => {
        setLoading(null)

        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message: `There was a problem ${
              option === "delete" ? "deleting" : "leaving"
            } your review, please try again.`,
          })
        )
      })
  }

  const disableButton = existingReview
    ? existingReview.text === values.message && existingReview.rating === rating
    : !rating

  return (
    <Grid
      item
      container
      direction="column"
      classes={{ root: classes.mainContainer }}
    >
      <Grid item container justify="space-between">
        {/*  name here... */}
        <Grid item>
          <Typography variant="h4" classes={{ root: classes.light }}>
            {review ? review.user.username : user.username}
          </Typography>
        </Grid>

        {/* star rating here... */}
        <Grid
          item
          ref={ratingRef}
          classes={{
            root: clsx(classes.starBackground, {
              [classes.cursorOnHover]: !review,
            }),
          }}
          onClick={() => (review ? null : setRating(tempRating))}
          onMouseMove={e => {
            if (review) return

            //   * -5 to get a positive number
            const hoverRating =
              ((ratingRef.current.getBoundingClientRect().left - e.clientX) /
                ratingRef.current.getBoundingClientRect().width) *
              -5

            //   example we want the closest 0.5 from 2.7 (which is 2.5)
            // 2.7 * 2 = 5.4 then rounding it would become 5, then divided by 2 would become 2.5
            // console.log(Math.round(hoverRating * 2) / 2)
            setTempRating(Math.round(hoverRating * 2) / 2)
          }}
          onMouseLeave={() => {
            //   this is so that the stars reset when mouse leaves
            if (tempRating > rating) {
              setTempRating(rating)
            }
          }}
        >
          {/* use whichever number is larger for the rating */}
          <Rating
            number={rating > tempRating ? rating : tempRating}
            size={2.5}
          />
        </Grid>
      </Grid>

      {/* date here... */}
      <Grid item>
        <Typography
          variant="h5"
          classes={{ root: clsx(classes.light, classes.date) }}
        >
          {review ? dayjs().to(dayjs(review.updatedAt)) : null}

          <span className={classes.smallDate}>
            {review
              ? ` (${dayjs(review.updatedAt).format("Do MMM YYYY")})`
              : null}
          </span>
        </Typography>
      </Grid>

      {/* comment form here... */}
      <Grid item>
        {review ? (
          <Typography variant="body1">{review.text}</Typography>
        ) : (
          <Form
            values={values}
            setValues={setValues}
            fields={fields}
            fullWidth
            noError
          />
        )}
      </Grid>

      {/* buttons here... */}
      {review ? null : (
        <Grid item container classes={{ root: classes.buttonContainer }}>
          <Grid item>
            {loading === "Leave Review" ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleReview}
                disabled={!rating || disableButton}
              >
                <span className={classes.reviewButtonText}>
                  {existingReview ? "Edit" : "Leave"} Review
                </span>
              </Button>
            )}
          </Grid>

          {existingReview ? (
            <Grid item>
              {loading === "Delete Review" ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  classes={{ root: classes.delete }}
                  onClick={() => handleReview("delete")}
                >
                  <span className={classes.reviewButtonText}>Delete</span>
                </Button>
              )}
            </Grid>
          ) : null}

          <Grid item>
            <Button onClick={() => setEditComment(false)}>
              <span className={classes.cancelButtonText}>Cancel</span>
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

export default ProductReview
