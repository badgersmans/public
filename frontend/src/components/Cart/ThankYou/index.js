import React from "react"
import DayJS from "react-dayjs"
import dayjs from "dayjs"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Button from "@material-ui/core/Button"
import { Link } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"

import completed from "../../../images/order-placed.svg"

let advancedFormat = require("dayjs/plugin/advancedFormat")
dayjs.extend(advancedFormat)
dayjs().format("Do")

const useStyles = makeStyles(theme => ({
  detailsButton: {
    padding: "0.25rem 0",
    textTransform: "none",
  },
  orderId: {
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.2rem",
    },
  },
  shopText: {
    fontSize: "2rem",
    fontWeight: 600,
    textTransform: "none",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.3rem",
    },
  },
  mainContainer: {
    height: "100%",
    position: "relative",
    display: ({ selectedStep, stepNumber }) =>
      selectedStep !== stepNumber ? "none" : "flex",
  },
  shopContainer: {
    position: "absolute",
    bottom: "1rem",
    right: "1rem",
  },
  icon: {
    marginTop: "-3rem",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1rem",
    },
  },
  expectedBy: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.6rem",
    },
  },
  detailsText: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
  // detailsText: {},
  // detailsText: {},
  // detailsText: {},
}))

function ThankYou({ selectedShipping, order, selectedStep, stepNumber }) {
  const classes = useStyles({ selectedStep, stepNumber })
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const addToDate = days => {
    return (
      <DayJS add={{ days }} format="Do MMM YYYY">
        {new Date()}
      </DayJS>
    )
  }

  const getExpectedDate = () => {
    switch (selectedShipping) {
      case "2-DAY SHIPPING":
        return addToDate(2)
      case "OVERNIGHT SHIPPING":
        return addToDate(1)
      default:
        return addToDate(14)
    }
  }
  return (
    <Grid
      item
      container
      direction="column"
      alignItems="center"
      justify="center"
      classes={{ root: classes.mainContainer }}
    >
      <Grid item>
        <img src={completed} alt="order placed" className={classes.icon} />
      </Grid>

      <Grid item>
        <Typography
          variant="h4"
          align="center"
          classes={{ root: classes.expectedBy }}
        >
          Expected by {getExpectedDate()}
        </Typography>

        <Grid
          item
          container
          justify={matchesXS ? "space-around" : "space-between"}
          alignItems="center"
        >
          <Grid item>
            <Typography variant="body2" classes={{ root: classes.orderId }}>
              Order #{order?.id.slice(order.id.length - 10, order.id.length)}
            </Typography>
          </Grid>

          <Grid item>
            <Button classes={{ root: classes.detailsButton }}>
              <Typography
                variant="body2"
                classes={{ root: classes.detailsText }}
              >
                Details &gt;{" "}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item classes={{ root: classes.shopContainer }}>
        <Button component={Link} to="/hoodies">
          <Typography variant="body2" classes={{ root: classes.shopText }}>
            Shop &gt;
          </Typography>
        </Button>
      </Grid>
    </Grid>
  )
}

export default ThankYou
