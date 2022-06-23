import React, { useState, useEffect, useRef, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import axios from "axios"
import Chip from "@material-ui/core/Chip"
import CircularProgress from "@material-ui/core/CircularProgress"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import { makeStyles } from "@material-ui/core/styles"
import Form from "../../Account/auth/Form"
import Slots from "../Slots"
import { FeedbackContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"

import locationIcon from "../../../images/location.svg"
import streetAdornment from "../../../images/street-adornment.svg"
import zipAdornment from "../../../images/zip-adornment.svg"

const useStyles = makeStyles(theme => ({
  icon: {
    marginBottom: ({ isCheckout }) => (isCheckout ? "1rem" : "3rem"),
    width: "3rem",
    height: "4rem",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1rem",
    },
  },
  chipContainer: {
    marginTop: "2rem",
    marginBottom: "4.2rem",
  },
  formContainer: {
    "& > :not(:first-child)": {
      marginTop: "2rem",
    },
  },
  slotsContainer: {
    position: "absolute",
    bottom: ({ isCheckout }) => (isCheckout ? -8 : 0),
  },
  locationContainer: {
    display: ({ isCheckout, selectedStep, stepNumber }) =>
      isCheckout && selectedStep !== stepNumber ? "none" : "flex",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      height: ({ isCheckout }) => (!isCheckout ? "30rem" : "100%"),
      borderBottom: `4px solid ${theme.palette.common.WHITE}`,
    },
    height: "100%",
  },
  switchContainer: {
    marginRight: 4,
  },
  switchText: {
    color: theme.palette.common.WHITE,
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
    },
  },
  chip: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.1rem",
    },
  },
  //   chip: {},
}))

function Location({
  user,
  edit,
  setHasChanged,
  values,
  setValues,
  slot,
  setSlot,
  errors,
  setErrors,
  isCheckout,
  billing,
  setBilling,
  noSlots,
  billingValues,
  setBillingValues,
  stepNumber,
  selectedStep,
}) {
  const classes = useStyles({ isCheckout, selectedStep, stepNumber })
  const [loading, setLoading] = useState(false)
  const { dispatchFeedback } = useContext(FeedbackContext)
  const isMounted = useRef(false)

  // console.log(`location values -> `, values)

  const fields = {
    street: {
      placeholder: "Street",
      helperText: "Invalid street",
      startAdornment: <img src={streetAdornment} alt="street" />,
    },
    postcode: {
      placeholder: "Post Code",
      helperText: "Invalid post code",
      startAdornment: <img src={zipAdornment} alt="post code" />,
    },
  }

  const getLocation = () => {
    setLoading(true)

    axios
      .get(
        `https://data.opendatasoft.com/api/records/1.0/search/?dataset=geonames-postal-code%40public&q=&rows=1&facet=country_code&facet=admin_name1&facet=place_name&facet=postal_code&refine.country_code=MY&refine.postal_code=${values.postcode}&timezone=Asia%2FKuala_Lumpur`
      )
      .then(response => {
        setLoading(false)
        // console.log(response)

        const { place_name, admin_name1 } = response.data.records[0].fields

        handleValues({ ...values, city: place_name, state: admin_name1 })
      })
      .catch(error => {
        setLoading(false)
        console.error(error)

        dispatchFeedback(
          setSnackbar({
            status: "error",
            message: "Invalid postcode, please try again.",
          })
        )
      })
  }

  useEffect(() => {
    if (noSlots || user.username === "Guest") return

    setValues(user.locations[slot])
  }, [slot])

  useEffect(() => {
    if (!isCheckout) {
      const changed = Object.keys(user.locations[slot]).some(
        field => values[field] !== user.locations[slot][field]
      )

      setHasChanged(changed)
    }

    if (values.postcode.length === 5) {
      // if city is already existing, exit function
      if (values.city) return

      getLocation()
    } else if (values.postcode.length < 5 && values.city) {
      handleValues({ ...values, city: "", state: "" })
    }
  }, [values])

  useEffect(() => {
    if (noSlots) {
      isMounted.current = false
      return
    }
    if (isMounted.current === false) {
      isMounted.current = true
      return
    }
    if (billing === false && isMounted.current) {
      setValues(billingValues)
    } else {
      setBillingValues(values)
    }
  }, [billing])

  const handleValues = values => {
    if (billing === slot && !noSlots) {
      setBillingValues(values)
    }
    setValues(values)
  }

  // console.log(`values ->`, values);
  // console.log(`billing values ->`, billingValues);

  return (
    <Grid
      item
      container
      direction="column"
      lg={isCheckout ? 12 : 6}
      xs={12}
      alignItems="center"
      justify="center"
      classes={{ root: classes.locationContainer }}
    >
      <Grid item>
        <img
          src={locationIcon}
          alt="location setting"
          className={classes.icon}
        />
      </Grid>

      <Grid
        item
        container
        direction="column"
        alignItems="center"
        classes={{ root: classes.formContainer }}
      >
        <Form
          fields={fields}
          values={billing === slot && !noSlots ? billingValues : values}
          setValues={handleValues}
          errors={errors}
          setErrors={setErrors}
          isWhite
          disabled={isCheckout ? false : !edit}
        />
      </Grid>

      <Grid item classes={{ root: classes.chipContainer }}>
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <Chip
            label={
              values.city ? `${values.city}, ${values.state}` : "City, State"
            }
            classes={{
              label: classes.chip,
            }}
          />
        )}
      </Grid>

      {noSlots ? null : (
        <Grid
          item
          container
          justify="space-between"
          classes={{ root: classes.slotsContainer }}
        >
          <Slots slot={slot} setSlot={setSlot} isCheckout={isCheckout} />

          {isCheckout && (
            <Grid item>
              <FormControlLabel
                classes={{
                  root: classes.switchContainer,
                  label: classes.switchText,
                }}
                label="Billing"
                labelPlacement="start"
                control={
                  <Switch
                    checked={billing === slot}
                    onChange={() => setBilling(billing === slot ? false : slot)}
                    color="secondary"
                  />
                }
              />
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  )
}

export default Location
