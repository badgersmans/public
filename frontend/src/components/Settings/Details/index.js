import React, { useState, useEffect, useRef } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import Form from "../../Account/auth/Form"
import { EmailPassword } from "../../Account/auth/Login"
import Slots from "../Slots"

import fingerprint from "../../../images/fingerprint.svg"
import Account from "../../../images/Account"
import NameAdornment from "../../../images/NameAdornment"
import phoneAdornment from "../../../images/phone-adornment.svg"

const useStyles = makeStyles(theme => ({
  phoneAdornment: {
    height: 25.122,
    width: 25.173,
  },
  emailAdornment: {
    height: 17,
    width: 22,
    marginBottom: 10,
  },
  visibleIcon: {
    padding: 0,
  },
  icon: {
    marginTop: ({ isCheckout }) => (isCheckout ? "-2rem" : undefined),
    marginBottom: ({ isCheckout }) => (isCheckout ? "1rem" : "3rem"),
    width: "3.5rem",
    height: "3.5rem",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1rem",
    },
  },
  formContainer: {
    marginBottom: "2rem",
    "& > :not(:first-child)": {
      marginLeft: "5rem",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1rem",
      "& > :not(:first-child)": {
        marginLeft: 0,
        marginTop: "1rem",
      },
    },
  },
  formContainerCart: {
    "& > *": {
      marginBottom: "1rem",
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
  detailsContainer: {
    display: ({ isCheckout, selectedStep, stepNumber }) =>
      isCheckout && selectedStep !== stepNumber ? "none" : "flex",
    position: "relative",
    borderLeft: ({ isCheckout }) =>
      isCheckout ? undefined : `4px solid ${theme.palette.common.WHITE}`,
    [theme.breakpoints.down("md")]: {
      height: ({ isCheckout }) => (!isCheckout ? "30rem" : "100%"),
      borderLeft: 0,
    },
    height: "100%",
  },
  slotsContainer: {
    position: "absolute",
    bottom: ({ isCheckout }) => (isCheckout ? -8 : 0),
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
}))

function Details({
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
  selectedStep,
  stepNumber,
}) {
  const classes = useStyles({ isCheckout, selectedStep, stepNumber })
  const isMounted = useRef(false)

  const [visible, setVisible] = useState(false)
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))
  // console.log(`detail values -> `, values)
  // console.log(`detail user -> `, user)

  const emailPassword = EmailPassword(false, false, visible, setVisible, true)
  const nameAndPhone = {
    name: {
      helperText: "Name is required",
      placeholder: "Name",
      startAdornment: <NameAdornment color="#FFF" />,
    },
    phone: {
      helperText: "Phone number is invalid",
      placeholder: "Phone number",
      startAdornment: (
        // <div className={classes.phoneAdornment}>
        //     </div>
        <img src={phoneAdornment} alt="name" />
      ),
    },
  }

  useEffect(() => {
    if (noSlots || user.username === "Guest") return

    if (isCheckout) {
      // console.log(user)
      setValues(user.contactInfo[slot])
    } else {
      setValues({ ...user.contactInfo[slot], password: "********" })
    }
  }, [slot])

  useEffect(() => {
    if (isCheckout) return
    const changed = Object.keys(user.contactInfo[slot]).some(
      field => values[field] !== user.contactInfo[slot][field]
    )

    setHasChanged(changed)

    // if (changed) {
    //   setHasChanged(true)
    // }
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

  let fields = [nameAndPhone, emailPassword]

  if (isCheckout) {
    fields = [
      {
        name: nameAndPhone.name,
        email: emailPassword.email,
        phone: nameAndPhone.phone,
      },
    ]
  }

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
      classes={{ root: classes.detailsContainer }}
    >
      <Grid item>
        {/* <Account color="#FFF" classes={{ root: classes.accountIcon }} /> */}
        <img src={fingerprint} alt="details setting" className={classes.icon} />
      </Grid>
      {fields.map((fieldSet, i) => (
        <Grid
          container
          justify="center"
          alignItems={matchesXS || isCheckout ? "center" : undefined}
          classes={{
            root: clsx({
              [classes.formContainerCart]: isCheckout,
              [classes.formContainer]: !isCheckout,
            }),
          }}
          key={i}
          direction={matchesXS || isCheckout ? "column" : "row"}
        >
          <Form
            fields={fieldSet}
            values={billing === slot && !noSlots ? billingValues : values}
            setValues={handleValues}
            errors={errors}
            setErrors={setErrors}
            isWhite
            disabled={isCheckout ? false : !edit}
            settings={!isCheckout}
          />
        </Grid>
      ))}
      {noSlots ? null : (
        <Grid
          item
          container
          justify={isCheckout ? "space-between" : undefined}
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

export default Details
