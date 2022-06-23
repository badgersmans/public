import React, { useState, useEffect, useContext } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Details from "../Details"
import PaymentInfo from "../PaymentInfo"
import Location from "../Location"
import Edit from "../Edit"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { UserContext } from "../../../contexts"

const useStyles = makeStyles(theme => ({
  topRow: {
    borderBottom: `4px solid ${theme.palette.common.WHITE}`,
  },
  sectionContainer: {
    height: "50%",
  },
}))

function Settings({ setSelectedSetting }) {
  const classes = useStyles()
  const [edit, setEdit] = useState(false)
  const [hasChanged, setHasChanged] = useState(false)
  const { user, dispatchUser } = useContext(UserContext)
  const [detailValues, setDetailValues] = useState({
    name: "",
    phone: "",
    email: "",
    password: "********",
  })

  const [locationValues, setLocationValues] = useState({
    street: "",
    postcode: "",
    city: "",
    state: "",
  })

  const [locationSlot, setLocationSlot] = useState(0)
  const [detailSlot, setDetailSlot] = useState(0)
  const [detailErrors, setDetailErrors] = useState({})
  const [locationErrors, setLocationErrors] = useState({})
  const [paymentInfoSlot, setPaymentInfoSlot] = useState(0)
  const hasActiveSubscription = user.subscriptions.length > 0

  const allErrors = { ...detailErrors, ...locationErrors }
  const hasError = Object.keys(allErrors).some(
    error => allErrors[error] === true
  )

  useEffect(() => {
    setDetailErrors({})
  }, [detailSlot])

  useEffect(() => {
    setLocationErrors({})
  }, [locationSlot])

  // console.log(`hasError ->`, hasError)
  // console.log(`user ->`, user)

  const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

  return (
    <>
      <Grid
        container
        classes={{ root: clsx(classes.topRow, classes.sectionContainer) }}
      >
        <Edit
          setSelectedSetting={setSelectedSetting}
          user={user}
          dispatchUser={dispatchUser}
          edit={edit}
          setEdit={setEdit}
          hasChanged={hasChanged}
          details={detailValues}
          detailSlot={detailSlot}
          locationSlot={locationSlot}
          location={locationValues}
          hasError={hasError}
        />
        <Details
          user={user}
          edit={edit}
          setHasChanged={setHasChanged}
          values={detailValues}
          setValues={setDetailValues}
          slot={detailSlot}
          setSlot={setDetailSlot}
          errors={detailErrors}
          setErrors={setDetailErrors}
        />
      </Grid>

      <Grid container classes={{ root: classes.sectionContainer }}>
        <Location
          user={user}
          edit={edit}
          setHasChanged={setHasChanged}
          values={locationValues}
          setValues={setLocationValues}
          slot={locationSlot}
          setSlot={setLocationSlot}
          errors={locationErrors}
          setErrors={setLocationErrors}
        />

        <Elements stripe={stripePromise}>
          <PaymentInfo
            user={user}
            edit={edit}
            slot={paymentInfoSlot}
            setSlot={setPaymentInfoSlot}
            hasActiveSubscription={hasActiveSubscription}
          />
        </Elements>
      </Grid>
    </>
  )
}

export default Settings
