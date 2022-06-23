import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

import marketingAdornment from "../../../images/marketing-adornment.svg"
import moreByUs from "../../../images/more-by-us.svg"
import store from "../../../images/store.svg"

const useStyles = makeStyles(theme => ({
  container: {
    margin: "15rem 0",
  },

  button: {
    backgroundImage: `url(${marketingAdornment})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "45rem",
    width: "45rem",
    transition: "transform 0.5s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
    [theme.breakpoints.down("lg")]: {
      width: "40rem",
      height: "40rem",
      margin: "3rem",
    },
    [theme.breakpoints.down("sm")]: {
      width: "30rem",
      height: "30rem",
      // margin: "3rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "18rem",
      height: "18rem",
      margin: "2rem 0",
      "&:hover": {
        transform: "scale(1)",
      },
    },
  },
  icon: {
    [theme.breakpoints.down("sm")]: {
      height: "8rem",
      width: "8rem",
    },
    [theme.breakpoints.down("xs")]: {
      height: "5rem",
      width: "5rem",
    },
  },
  label: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "2.8rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.8rem",
    },
  },
}))

function MarketingButtons() {
  const classes = useStyles()

  const marketingButtons = [
    { label: "Store", icon: store, link: "/hoodies" },
    { label: "More By Us", icon: moreByUs, href: "https://www.google.com" },
  ]

  return (
    <Grid
      container
      justify="space-around"
      classes={{ root: classes.container }}
    >
      {marketingButtons.map(button => (
        <Grid item key={button.label}>
          <Grid
            container
            alignItems="center"
            justify="center"
            direction="column"
            classes={{ root: classes.button }}
            component={button.link ? Link : "a"}
            to={button.link ? button.link : undefined}
            href={button.href ? button.href : undefined}
          >
            <Grid item>
              <img
                src={button.icon}
                alt={button.label}
                className={classes.icon}
              />
            </Grid>
            <Grid item>
              <Typography variant="h1" classes={{ root: classes.label }}>
                {button.label}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

export default MarketingButtons
