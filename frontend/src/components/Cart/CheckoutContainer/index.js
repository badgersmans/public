import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import CheckoutNavigation from "../CheckoutNavigation"
import Details from "../../Settings/Details"
import Location from "../../Settings/Location"
import Shipping from "../Shipping"
import ThankYou from "../ThankYou"
import Confirmation from "../Confirmation"
import BillingConfirmation from "../BillingConfirmation"
import PaymentInfo from "../../Settings/PaymentInfo"
import validate from "../../../../utils/validator"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CartContext } from "../../../contexts"

const useStyles = makeStyles(theme => ({
  stepsContainer: {
    width: "41rem",
    height: "25rem",
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  "@global": {
    ".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "2px solid #fff",
    },
    ".MuiInput-underline:after": {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
  },
  mainContainer: {
    marginTop: "2rem",
    [theme.breakpoints.down("md")]: {
      marginBottom: "5rem",
    },
  },
  // stepsContainer: {},
  // stepsContainer: {},
  // stepsContainer: {},
  // stepsContainer: {},
  // stepsContainer: {},
  // stepsContainer: {},
}))

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

function CheckoutContainer({ user }) {
  const classes = useStyles()
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
  const [selectedStep, setSelectedStep] = useState(0)
  const [detailValues, setDetailValues] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [detailSlot, setDetailSlot] = useState(0)
  const [detailForBilling, setDetailForBilling] = useState(false)
  const [locationForBilling, setLocationForBilling] = useState(false)
  const [locationValues, setLocationValues] = useState({
    street: "",
    postcode: "",
    city: "",
    state: "",
  })
  const [billingLocation, setBillingLocation] = useState({
    street: "",
    postcode: "",
    city: "",
    state: "",
  })
  const [locationSlot, setLocationSlot] = useState(0)
  const [selectedShipping, setSelectedShipping] = useState(null)
  const [cardSlot, setCardSlot] = useState(0)
  const [saveCard, setSaveCard] = useState(cartHasSubscription)
  const [order, setOrder] = useState(null)
  const [card, setCard] = useState({ brand: "", last4: "" })
  const [cardError, setCardError] = useState(true)
  const shippingOptions = [
    { label: "FREE SHIPPING", price: 0 },
    { label: "2-DAY SHIPPING", price: 5 },
    { label: "OVERNIGHT SHIPPING", price: 50 },
  ]
  const { cart } = useContext(CartContext)

  const cartHasSubscription = cart.some(item => item.subscription)
  const hasActiveSubscription = user.subscriptions.length > 0

  const errorHelper = (values, forBilling, billingValues, slot) => {
    const valid = validate(values)

    // if there is one slot marked as billing...
    if (forBilling !== false && forBilling !== undefined) {
      //  validate the billing values
      const billingValid = validate(billingValues)

      // if we are currently on the same slot as marked for billing (billing and shipping are the same)
      if (forBilling === slot) {
        // then validate the one set of fields because they are the same
        return Object.keys(billingValid).some(value => !billingValid[value])
      } else {
        // if on a different slot than the slot marked for billing (billing and shipping are different)
        // then validate both billing and shipping
        return (
          Object.keys(billingValid).some(value => !billingValid[value]) ||
          Object.keys(valid).some(value => !valid[value])
        )
      }
    } else {
      // no slots were marked for billing, just validate current slot.
      return Object.keys(valid).some(value => !valid[value])
    }
  }

  const [errors, setErrors] = useState({})

  // console.log(errorHelper(detailValues))

  let steps = [
    {
      title: "Contact Info",
      component: (
        <Details
          user={user}
          values={detailValues}
          setValues={setDetailValues}
          slot={detailSlot}
          setSlot={setDetailSlot}
          errors={errors}
          setErrors={setErrors}
          isCheckout
          billing={detailForBilling}
          setBilling={setDetailForBilling}
          billingValues={billingDetails}
          setBillingValues={setBillingDetails}
          selectedStep={selectedStep}
        />
      ),
      hasActions: true,
      error: errorHelper(
        detailValues,
        detailForBilling,
        billingDetails,
        detailSlot
      ),
    },
    {
      title: "Billing Info",
      component: (
        <Details
          values={billingDetails}
          setValues={setBillingDetails}
          errors={errors}
          setErrors={setErrors}
          isCheckout
          noSlots
          selectedStep={selectedStep}
        />
      ),
      error: errorHelper(billingDetails),
    },
    {
      title: "Address",
      component: (
        <Location
          user={user}
          values={locationValues}
          setValues={setLocationValues}
          slot={locationSlot}
          setSlot={setLocationSlot}
          billing={locationForBilling}
          setBilling={setLocationForBilling}
          errors={errors}
          setErrors={setErrors}
          isCheckout
          billingValues={billingLocation}
          setBillingValues={setBillingLocation}
          selectedStep={selectedStep}
        />
      ),
      hasActions: true,
      error: errorHelper(
        locationValues,
        locationForBilling,
        billingLocation,
        locationSlot
      ),
    },
    {
      title: "Billing Address",
      component: (
        <Location
          values={billingLocation}
          setValues={setBillingLocation}
          errors={errors}
          setErrors={setErrors}
          isCheckout
          noSlots
          selectedStep={selectedStep}
        />
      ),
      error: errorHelper(billingLocation),
    },
    {
      title: "Shipping",
      component: (
        <Shipping
          shippingOptions={shippingOptions}
          selectedShipping={selectedShipping}
          setSelectedShipping={setSelectedShipping}
          selectedStep={selectedStep}
        />
      ),
      error: selectedShipping === null,
    },
    {
      title: "Payment",
      component: (
        <PaymentInfo
          slot={cardSlot}
          setSlot={setCardSlot}
          user={user}
          isCheckout
          saveCard={saveCard}
          setSaveCard={setSaveCard}
          setCardError={setCardError}
          selectedStep={selectedStep}
          setCard={setCard}
          cartHasSubscription={cartHasSubscription}
          hasActiveSubscription={hasActiveSubscription}
        />
      ),
      error: cardError,
    },
    {
      title: "Confirmation",
      component: (
        <Confirmation
          detailValues={detailValues}
          billingDetails={billingDetails}
          detailForBilling={detailForBilling}
          locationValues={locationValues}
          billingLocation={billingLocation}
          locationForBilling={locationForBilling}
          shippingOptions={shippingOptions}
          selectedShipping={selectedShipping}
          user={user}
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
          setOrder={setOrder}
          order={order}
          saveCard={saveCard}
          card={card}
          cardSlot={cardSlot}
        />
      ),
    },
    {
      title: `Thanks, ${user.username.split(" ")[0]}!`,
      component: (
        <ThankYou
          selectedShipping={selectedShipping}
          order={order}
          selectedStep={selectedStep}
        />
      ),
    },
  ]

  if (detailForBilling !== false) {
    steps = steps.filter(step => step.title !== "Billing Info")
  }

  if (locationForBilling !== false) {
    steps = steps.filter(step => step.title !== "Billing Address")
  }

  useEffect(() => {
    setErrors({})
  }, [detailSlot, locationSlot, selectedStep])

  return (
    <Grid
      item
      container
      direction="column"
      lg={6}
      alignItems={matchesMD ? "center" : "flex-start"}
      classes={{ root: classes.mainContainer }}
    >
      <CheckoutNavigation
        steps={steps}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        details={detailValues}
        detailSlot={detailSlot}
        location={locationValues}
        locationSlot={locationSlot}
        setDetails={setDetailValues}
        setLocation={setLocationValues}
        setErrors={setErrors}
      />
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        classes={{ root: classes.stepsContainer }}
      >
        <Elements stripe={stripePromise}>
          {steps.map((step, i) =>
            React.cloneElement(step.component, { stepNumber: i, key: i })
          )}
        </Elements>
      </Grid>

      {steps[selectedStep].title === "Confirmation" && (
        <BillingConfirmation
          detailForBilling={detailForBilling}
          billingDetails={billingDetails}
          detailSlot={detailSlot}
          locationForBilling={locationForBilling}
          billingLocation={billingLocation}
          locationSlot={locationSlot}
        />
      )}
    </Grid>
  )
}

export default CheckoutContainer
