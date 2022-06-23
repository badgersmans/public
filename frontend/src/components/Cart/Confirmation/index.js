import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core/styles"
import Form from "../../../components/Account/auth/Form"
import clsx from "clsx"
import confirmationIcon from "../../../images/tag.svg"
import EmailAdornment from "../../../images/EmailAdornment"
import NameAdornment from "../../../images/NameAdornment"
import PhoneAdornment from "../../../images/PhoneAdornment"
import streetAdornment from "../../../images/street-adornment.svg"
import postcodeAdornment from "../../../images/zip-adornment.svg"
import cardAdornment from "../../../images/card.svg"
import promoAdornment from "../../../images/promo-code.svg"
import formatMoney from "../../../../utils/formatMoney"
import { CartContext, FeedbackContext, UserContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
import { clearCart } from "../../../contexts/actions/cart-actions"
import { setUser } from "../../../contexts/actions/user-actions"
import { v4 as uuidv4 } from "uuid"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

const useStyles = makeStyles(theme => ({
  nameWrapper: {
    height: 22,
    width: 22,
  },
  text: {
    fontSize: "1rem",
    color: theme.palette.common.WHITE,
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.85rem",
    },
  },
  emailWrapper: {
    height: 17,
    width: 22,
  },
  phoneWrapper: {
    height: 25.122,
    width: 25.173,
  },
  card: {
    height: 18,
    width: 25,
  },
  priceLabel: {
    fontSize: "1.5rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.9rem",
    },
  },
  darkBackground: {
    backgroundColor: theme.palette.secondary.main,
  },
  fieldRow: {
    height: "2.5rem",
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    display: "flex",
    alignItems: "center",
  },
  adornmentWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  priceValue: {
    marginRight: "1rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.9rem",
      marginRight: "0.25rem",
    },
  },
  formWrapper: {
    marginLeft: "1.25rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0.25rem",
    },
  },
  button: {
    width: "100%",
    height: "7rem",
    borderRadius: 0,
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  buttonContainer: {
    marginTop: "auto",
  },
  mainContainer: {
    height: "100%",
    display: ({ selectedStep, stepNumber }) =>
      selectedStep !== stepNumber ? "none" : "flex",
  },
  chipRoot: {
    backgroundColor: theme.palette.common.WHITE,
  },
  chipLabel: {
    color: theme.palette.secondary.main,
  },
  "@global": {
    ".MuiSnackbarContent-message": {
      whiteSpace: "pre-wrap",
    },
  },
  disabled: {
    backgroundColor: theme.palette.grey[500],
  },
  // disabled: {},
}))

function Confirmation({
  detailValues,
  billingDetails,
  detailBilling,
  locationValues,
  billingLocation,
  locationBilling,
  shippingOptions,
  selectedShipping,
  user,
  selectedStep,
  setSelectedStep,
  setOrder,
  order,
  stepNumber,
  saveCard,
  card,
  cardSlot,
}) {
  const classes = useStyles({ selectedStep, stepNumber })
  const stripe = useStripe()
  const elements = useElements()
  const [promo, setPromo] = useState({ promo: "" })
  const [promoError, setPromoError] = useState({})
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)
  const { cart, dispatchCart } = useContext(CartContext)
  const { dispatchFeedback } = useContext(FeedbackContext)
  const { dispatchUser } = useContext(UserContext)
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const shipping = shippingOptions.find(
    option => option.label === selectedShipping
  )

  const subtotal = cart.reduce(
    (total, item) => total + item.variant.price * item.quantity,
    0
  )
  const tax = (subtotal + shipping?.price) * 0.14

  const topFields = [
    {
      value: detailValues.name,
      adornment: (
        <div className={classes.nameWrapper}>
          <NameAdornment color="#FFF" />
        </div>
      ),
    },
    {
      value: detailValues.email,
      adornment: (
        <div className={classes.emailWrapper}>
          <EmailAdornment color="#FFF" />
        </div>
      ),
    },
    {
      value: detailValues.phone,
      adornment: (
        <div className={classes.phoneWrapper}>
          <PhoneAdornment />
        </div>
      ),
    },
    {
      value: locationValues.street,
      adornment: <img src={streetAdornment} alt="street address" />,
    },
  ]

  const bottomFields = [
    {
      value: `${locationValues.city}, ${locationValues.state}, ${locationValues.postcode}`,
      adornment: <img src={postcodeAdornment} alt="city, state, zip code" />,
    },
    {
      value: `${card.brand.toUpperCase()} ${card.last4}`,
      adornment: (
        <img src={cardAdornment} alt="credit card" className={classes.card} />
      ),
    },
    // {
    //   promo: {
    //     helperText: "",
    //     placeholder: "Promo code",
    //     startAdornment: <img src={promoAdornment} alt="promo code" />,
    //   },
    // },
  ]

  const prices = [
    { label: "SUBTOTAL", value: subtotal.toFixed(2) },
    { label: "SHIPPING", value: shipping?.price.toFixed(2) },
    { label: "TAX", value: tax.toFixed(2) },
  ]

  const total = prices.reduce(
    (total, item) => total + parseFloat(item.value),
    0
  )

  const adornmentValues = (adornment, value) => (
    <>
      <Grid item xs={2} classes={{ root: classes.adornmentWrapper }}>
        {adornment}
      </Grid>

      <Grid item xs={10} classes={{ root: classes.centerText }} zeroMinWidth>
        <Typography variant="body1" classes={{ root: classes.text }} noWrap>
          {value}
        </Typography>
      </Grid>
    </>
  )

  const handleOrder = async () => {
    setLoading(true)

    const idempotencyKey = uuidv4()

    const cardElement = elements.getElement(CardElement)

    const savedCard = user.jwt && user.paymentMethods[cardSlot].last4 !== ""

    const result = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: savedCard
          ? undefined
          : {
              card: cardElement,
              billing_details: {
                address: {
                  city: billingLocation.city,
                  state: billingLocation.state,
                  line1: billingLocation.street,
                },
                email: billingDetails.email,
                name: billingDetails.name,
                phone: billingDetails.phone,
              },
            },
        setup_future_usage: saveCard ? "off_session" : undefined,
      },
      { idempotencyKey }
    )

    if (result.error) {
      console.error(result.error.message)

      dispatchFeedback(
        setSnackbar({ status: "error", message: result.error.message })
      )
      setLoading(false)
    } else if (result.paymentIntent.status === "succeeded") {
      setLoading(false)
      // console.log("PAYMENT SUCCESSFUL")

      axios
        .post(
          `${process.env.GATSBY_STRAPI_URL}/orders/finalize`,
          {
            shippingAddress: locationValues,
            billingAddress: billingLocation,
            shippingInfo: detailValues,
            billingInfo: billingDetails,
            shippingOption: shipping,
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            items: cart,
            transaction: result.paymentIntent.id,
            paymentMethod: card,
            saveCard,
            cardSlot,
          },
          {
            headers:
              user.username === "Guest"
                ? undefined
                : { Authorization: `Bearer ${user.jwt}` },
          }
        )
        .then(response => {
          if (saveCard) {
            let newUser = { ...user }
            newUser.paymentMethods[cardSlot] = card

            dispatchUser(setUser(newUser))
          }

          setLoading(false)
          dispatchCart(clearCart())

          localStorage.removeItem("intentID")
          setClientSecret(null)

          setOrder(response.data.order)
          setSelectedStep(selectedStep + 1)

          // console.log(response)
        })
        .catch(error => {
          setLoading(false)
          console.error(error)
          console.log("FAILED PAYMENT INTENT", result.paymentIntent.id)
          console.log("FAILED CART", cart)

          dispatchFeedback(
            setSnackbar({
              status: "error",
              message:
                "There was a problem saving your order. Please keep this screen open and contact support.",
            })
          )
          localStorage.removeItem("intentID")
          setClientSecret(null)
        })
    }
  }

  useEffect(() => {
    if (!order && cart.length !== 0 && selectedStep === stepNumber) {
      const storedIntent = localStorage.getItem("intentID")
      const idempotencyKey = uuidv4()

      setClientSecret(null)

      axios
        .post(
          `${process.env.GATSBY_STRAPI_URL}/orders/process`,
          {
            items: cart,
            total: total.toFixed(2),
            shippingOption: shipping,
            idempotencyKey,
            storedIntent,
            email: detailValues.email,
            savedCard:
              user.jwt && user.paymentMethods[cardSlot].last4 !== ""
                ? card.last4
                : undefined,
          },
          {
            headers: user.jwt
              ? { Authorization: `Bearer ${user.jwt}` }
              : undefined,
          }
        )
        .then(response => {
          setClientSecret(response.data.client_secret)
          localStorage.setItem("intentID", response.data.intentID)
        })
        .catch(error => {
          console.error(error)

          switch (error.response.status) {
            case 400:
              dispatchFeedback(
                setSnackbar({ status: "error", message: "Invalid Cart" })
              )
              break
            case 409:
              dispatchFeedback(
                setSnackbar({
                  status: "error",
                  message:
                    `The following items ran out of stock. Please update your cart and try again.\n` +
                    `${error.response.data.unavailable.map(
                      item =>
                        `\nItem: ${item.id}, Available Stock: ${item.quantity}`
                    )}`,
                })
              )
              break
            default:
              dispatchFeedback(
                setSnackbar({
                  status: "error",
                  message:
                    "Something went wrong :( Please refresh page and try again. You have not been charged",
                })
              )
              break
          }
        })
    }
  }, [cart, selectedStep, stepNumber])

  console.log("CLIENT SECRET ->", clientSecret)

  return (
    <Grid
      item
      container
      direction="column"
      classes={{ root: classes.mainContainer }}
    >
      <Grid item container>
        <Grid item container direction="column" xs={7}>
          {topFields.map((field, i) => (
            <Grid
              item
              container
              alignItems="center"
              key={i}
              classes={{
                root: clsx(classes.fieldRow, {
                  [classes.darkBackground]: i % 2 !== 0,
                }),
              }}
            >
              {adornmentValues(field.adornment, field.value)}
            </Grid>
          ))}
        </Grid>

        <Grid item xs={5} classes={{ root: classes.iconWrapper }}>
          <img src={confirmationIcon} alt="confirmation" />
        </Grid>
      </Grid>

      {bottomFields.map((field, i) => (
        <Grid
          item
          container
          key={i}
          alignItems="center"
          classes={{
            root: clsx(classes.fieldRow, {
              [classes.darkBackground]: i % 2 !== 0,
            }),
          }}
        >
          <Grid item container xs={7}>
            {field.promo ? (
              <span className={classes.formWrapper}>
                <Form
                  fields={field}
                  values={promo}
                  setValues={setPromo}
                  errors={promoError}
                  setErrors={setPromoError}
                  isWhite
                  xs={matchesXS}
                />
              </span>
            ) : (
              adornmentValues(field.adornment, field.value)
            )}
          </Grid>

          <Grid item container xs={5}>
            <Grid item xs={6}>
              <Typography variant="h5" classes={{ root: classes.priceLabel }}>
                {prices[i].label}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="body2"
                align="right"
                classes={{ root: classes.priceValue }}
              >
                {formatMoney(prices[i].value)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ))}

      <Grid item classes={{ root: classes.buttonContainer }}>
        <Button
          classes={{ root: classes.button, disabled: classes.disabled }}
          onClick={handleOrder}
          disabled={cart.length === 0 || loading || !clientSecret}
        >
          <Grid container justify="space-around" alignItems="center">
            <Grid item>
              <Typography variant="h5">PLACE ORDER</Typography>
            </Grid>

            <Grid item>
              {loading ? (
                <CircularProgress />
              ) : (
                <Chip
                  label={formatMoney(total)}
                  classes={{ root: classes.chipRoot, label: classes.chipLabel }}
                />
              )}
            </Grid>
          </Grid>
        </Button>
      </Grid>
    </Grid>
  )
}

export default Confirmation
