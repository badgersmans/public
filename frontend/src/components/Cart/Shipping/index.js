import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import formatMoney from "../../../../utils/formatMoney"

import shippingIcon from "../../../images/shipping.svg"

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 15,
    height: "10rem",
    width: "10rem",
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
    [theme.breakpoints.down("xs")]: {
      height: "5.5rem",
      width: "5.5rem",
    },
  },
  label: {
    fontSize: "1.4rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.8rem",
    },
  },
  mainContainer: {
    height: "100%",
    display: ({ selectedStep, stepNumber }) =>
      selectedStep !== stepNumber ? "none" : "flex",
  },
  price: {
    color: theme.palette.common.WHITE,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
  selected: {
    backgroundColor: theme.palette.common.WHITE,
    "&:hover": {
      backgroundColor: theme.palette.common.WHITE,
    },
  },
  selectedText: {
    color: theme.palette.secondary.main,
  },
  //   selected: {},
  //   selected: {},
  //   selected: {},
}))

function Shipping({
  shippingOptions,
  selectedShipping,
  setSelectedShipping,
  selectedStep,
  stepNumber,
}) {
  const classes = useStyles({ stepNumber, selectedStep })
  return (
    <Grid
      item
      container
      direction="column"
      alignItems="center"
      justify="center"
      classes={{ root: classes.mainContainer }}
    >
      <Grid item>{/* <img src={shippingIcon} alt="shipping" /> */}</Grid>

      <Grid item container justify="space-around">
        {shippingOptions.map(option => (
          <Grid item key={option.label}>
            <Button
              classes={{
                root: clsx(classes.button, {
                  [classes.selected]: selectedShipping === option.label,
                }),
              }}
              onClick={() => setSelectedShipping(option.label)}
            >
              <Grid container direction="column">
                <Grid item>
                  <Typography
                    variant="h5"
                    classes={{
                      root: clsx(classes.label, {
                        [classes.selectedText]:
                          selectedShipping === option.label,
                      }),
                    }}
                  >
                    {option.label}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    variant="body1"
                    classes={{
                      root: clsx(classes.price, {
                        [classes.selectedText]:
                          selectedShipping === option.label,
                      }),
                    }}
                  >
                    {formatMoney(option.price)}
                  </Typography>
                </Grid>
              </Grid>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

export default Shipping
