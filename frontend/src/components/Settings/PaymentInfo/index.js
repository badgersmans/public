import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import CircularProgress from "@material-ui/core/CircularProgress"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Switch from "@material-ui/core/Switch"
import { makeStyles } from "@material-ui/core/styles"
import Slots from "../Slots"
import clsx from "clsx"
import { UserContext, FeedbackContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
import { setUser } from "../../../contexts/actions/user-actions"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

import cardIcon from "../../../images/card.svg"

const useStyles = makeStyles(theme => ({
  icon: {
    marginBottom: "3rem",
    width: "4rem",
    height: "3rem",
    [theme.breakpoints.down("xs")]: {
      marginBottom: ({ isCheckout }) => (isCheckout ? "3rem" : "1rem"),
    },
  },
  cardNumber: {
    color: theme.palette.common.WHITE,
    marginBottom: "5rem",
    [theme.breakpoints.down("xs")]: {
      marginBottom: ({ isCheckout }) => (isCheckout ? "1rem" : undefined),
      fontSize: ({ isCheckout }) => (isCheckout ? "1.5rem" : undefined),
    },
  },
  deleteCard: {
    backgroundColor: theme.palette.common.WHITE,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: "2rem",
    "&:hover": {
      backgroundColor: theme.palette.common.WHITE,
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: ({ isCheckout }) => (isCheckout ? 0 : undefined),
    },
  },
  deleteCardText: {
    fontSize: "1rem",
    color: theme.palette.primary.main,
    fontFamily: "Philosopher",
    fontStyle: "italic",
  },
  paymentContainer: {
    display: ({ isCheckout, selectedStep, stepNumber }) =>
      isCheckout && selectedStep !== stepNumber ? "none" : "flex",
    borderLeft: ({ isCheckout }) =>
      isCheckout ? 0 : `4px solid ${theme.palette.common.WHITE}`,
    position: "relative",
    [theme.breakpoints.down("md")]: {
      height: ({ isCheckout }) => (!isCheckout ? "30rem" : "100%"),
      borderLeft: 0,
    },
    height: "100%",
  },
  slotsContainer: {
    position: "absolute",
    bottom: 0,
  },
  switchContainer: {
    marginRight: 4,
  },
  switchText: {
    color: theme.palette.common.WHITE,
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
  form: {
    width: "75%",
    borderBottom: `2px solid ${theme.palette.common.WHITE}`,
    height: "2rem",
    marginTop: "-1rem",
    [theme.breakpoints.down("xs")]: {
      width: "85%",
    },
  },
  spinner: {
    marginLeft: "3rem",
  },
  switchItem: {
    width: "100%",
  },
  numberWrapper: {
    marginBottom: "5rem",
  },
  //   cardNumber: {},
}))

function PaymentInfo({
  user,
  slot,
  setSlot,
  isCheckout,
  saveCard,
  setSaveCard,
  setCardError,
  selectedStep,
  stepNumber,
  setCard,
  cartHasSubscription,
  hasActiveSubscription,
}) {
  const classes = useStyles({ isCheckout, selectedStep, stepNumber })
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))
  const { dispatchFeedback } = useContext(FeedbackContext)
  const { dispatchUser } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const card =
    user.username === "Guest"
      ? { last4: "", brand: "" }
      : user.paymentMethods[slot]

  const handleSubmit = async event => {
    event.preventDefault()

    if (!stripe || !elements) return
  }

  const removeCard = () => {
    const savedCards = user.paymentMethods.filter(method => method.last4 !== "")
    const cardAssociatedToSubscription = user.subscriptions.find(
      sub => sub.paymentMethod.last4 === card.last4
    )
    // prevent removing/deleting the last remaining cards and the cards that are associated to a subscription.
    // Also if there is there is an existing subscription...
    if (
      (hasActiveSubscription && savedCards.length === 1) ||
      cardAssociatedToSubscription
    ) {
      dispatchFeedback(
        setSnackbar({
          status: "error",
          message:
            "You cannot remove your last card with an active subscription, please add another card first.",
        })
      )
      return
    }
    setLoading(true)

    axios
      .post(
        `${process.env.GATSBY_STRAPI_URL}/orders/removecard`,
        {
          card: card.last4,
        },
        {
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        }
      )
      .then(response => {
        setLoading(false)
        dispatchUser(
          setUser({ ...response.data.user, jwt: user.jwt, onboarding: true })
        )
        setCardError(true)
        setCard({ brand: "", last4: "" })
      })
      .catch(error => {
        setLoading(false)
        console.error(error)

        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a problem removing your card, please try again.",
          })
        )
      })
  }

  const handleCardChange = async event => {
    if (event.complete) {
      const cardElement = elements.getElement(CardElement)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      setCard({
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
      })
      setCardError(false)
      // console.log("valid")
    } else {
      setCardError(true)
      // console.log("invalid")
    }
  }

  const cardWrapper = (
    <form onSubmit={handleSubmit} className={classes.form}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "20px",
              fontFamily: "Montserrat",
              color: "#FFF",
              iconColor: "#FFF",
              "::placeholder": {
                color: "#FFF",
              },
            },
          },
        }}
        onChange={handleCardChange}
      />
    </form>
  )

  useEffect(() => {
    // check to make sure user is logged in and currently in checkout process
    if (!isCheckout || !user.jwt) return

    // if there is a saved payment method
    if (user.paymentMethods[slot].last4 !== "") {
      setCard(user.paymentMethods[slot])
      setCardError(false)
    } else {
      // no saved payment method
      setCard({ brand: "", last4: "" })
      setCardError(true)
    }
  }, [slot])

  return (
    <Grid
      item
      container
      direction="column"
      lg={isCheckout ? 12 : 6}
      xs={12}
      alignItems="center"
      justify="center"
      classes={{ root: classes.paymentContainer }}
    >
      <Grid item>
        <img src={cardIcon} alt="payment info" className={classes.icon} />
      </Grid>

      <Grid
        item
        container
        justify="center"
        classes={{
          root: clsx({
            [classes.numberWrapper]: isCheckout && matchesXS,
          }),
        }}
      >
        {isCheckout && !card.last4 ? cardWrapper : null}
        <Grid item>
          <Typography
            variant="h3"
            classes={{ root: classes.cardNumber }}
            align="center"
          >
            {card.last4
              ? `${card.brand.toUpperCase()} **** **** **** ${card.last4}`
              : isCheckout
              ? null
              : "Add your cards during checkout"}
          </Typography>
        </Grid>
        {card.last4 && (
          <Grid
            item
            classes={{
              root: clsx({
                [classes.spinner]: loading,
              }),
            }}
          >
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <Button
                variant="contained"
                classes={{ root: classes.deleteCard }}
                onClick={removeCard}
              >
                <Typography
                  variant="h6"
                  classes={{ root: classes.deleteCardText }}
                >
                  Delete Saved Card
                </Typography>
              </Button>
            )}
          </Grid>
        )}
      </Grid>

      <Grid
        item
        container
        justify="space-between"
        classes={{ root: classes.slotsContainer }}
      >
        <Slots slot={slot} setSlot={setSlot} noLabel />

        {isCheckout && user.username !== "Guest" && (
          <Grid
            item
            classes={{
              root: clsx({
                [classes.switchItem]: matchesXS,
              }),
            }}
          >
            <FormControlLabel
              classes={{
                root: classes.switchContainer,
                label: classes.switchText,
              }}
              label="Save card for future use"
              labelPlacement="start"
              control={
                <Switch
                  disabled={
                    user.paymentMethods[slot].last4 !== "" ||
                    cartHasSubscription
                  }
                  checked={
                    user.paymentMethods[slot].last4 !== "" ||
                    cartHasSubscription
                      ? true
                      : saveCard
                  }
                  onChange={() => setSaveCard(!saveCard)}
                  color="secondary"
                />
              }
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default PaymentInfo
